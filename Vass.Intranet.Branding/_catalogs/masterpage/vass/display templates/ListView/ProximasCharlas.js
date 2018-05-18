	(function(){
		/**
		* Declaramos las constantes que mas adelante usaremos
		**/
		var objcharlas;
		var context;
		var oCharlasList;
		var oAsistenciasList;
		var siteUrl;
		var clientContext;
		var TargetedControl = 0;
		var aforoSala = 0;
		var itemsCount = 0;
		ExecuteOrDelayUntilScriptLoaded(readyFunction,"sp.js", "SP.ClientContext");
	})();

	/**
	* Tomamos el contexto del sitio y cargamos los botones sobre los items del WebPart "Próximas Charlas"
	**/
	function readyFunction()
	{
		//Tomamos el contexto del sitio
		context = new SP.ClientContext;
		siteUrl= window.location.protocol + "//" + window.location.host + context.get_url();
		clientContext = new SP.ClientContext(siteUrl);
		//Tomamos la lista de Asistencia a Charlas
		oAsistenciasList = clientContext.get_web().get_lists().getByTitle('Asistencia a Charlas');
		//Tomamos la lista de charlas
		oCharlasList = clientContext.get_web().get_lists().getByTitle('Charlas');
		//Cargamos el webpart
		flag = 0;
		var $t = $('#js-listviewthead-WPQ3').next().next().find('tr');
		$t.each(function()
		{
			$(this).append("<td><input type='button' class='btntable' id='btnApuntarse' onclick='AddNewItem(this)' value='Apuntarse'/></td><td><input type='button' class='btntable' id='btnDesapuntarse' onclick='RemoveItem(this)' value='Desapuntarse'/></td>");
		});

	}
///////////////////////////////////////////////////////////////////////////////////BOTON: APUNTARSE/////////////////////////////////////////////////////////////////////
	/**
	* Evento que se ejecuta cuando el usuario pulsa sobre el botón de Apuntarse
	* @btn {object}
	*/
	function AddNewItem(btn)
	{
		//Los botones de apuntarse y de Desapuntarse se Bloquean para el usuario
		$('.btntable').prop("disabled", true);
		//Tomamos los datos necesarios de la página
		//Entre estos datos tomaremos: ID de la Charla, el Titulo de la Charla y el Usuario Actual
		var tr1=$(btn).closest('tr');
		var tds = tr1.find('td');
		var IDCharla = $(tds[1]).text();
		var TituloCharla= $(tds[2]).text();
		var realizacion= $(tds[5]).text();
		var finalizacion= $(tds[6]).text();
		var UserID = $(".o365cs-mfp-header-displayname").text();
		alert(TituloCharla);
		//Añadimos los datos tomados sobre un array que podremos usar en las distintas Funciones
		objcharlas=new Object();
		objcharlas.TituloCharla=TituloCharla;
		objcharlas.UserID=UserID;
		objcharlas.IDCharla=IDCharla;
		//Tomamos la lista de Charlas
		clientContext.load(oCharlasList);
		//Creamos una query a la lista de "Charlas" para comprobar el Aforo
		var camlQuery = new SP.CamlQuery();
		camlQuery.set_viewXml("<View><Query><Where><Eq><FieldRef Name='ID' /><Value Type='Counter'>"+objcharlas.IDCharla+"</Value></Eq></Where></Query></View>");
		this.listItems = oCharlasList.getItems(camlQuery);
		clientContext.load(listItems,'Include(Aforo)');
		clientContext.executeQueryAsync(
			Function.createDelegate(this, CapacityOnSuccess),
			Function.createDelegate(this, CapacityOnFail)
		);
	}
	/**
	* Función que se ejecuta cuando la CamlQuery para tomar el Aforo ha funcionado correctamente
	* @sender {object}
	* @args {objects}
	*/
	function CapacityOnSuccess(sender,args)
	{	
		//Tomamos los items de la lista de Charlas correspondientes al ID de la charla actual
		var listEnumerator = this.listItems.getEnumerator();
		if(this.listItems.get_count() > 0)
		{
			//Tomamos el Item de la lista para conocer el aforo
			while (listEnumerator.moveNext())
			{
				var currentItem = listEnumerator.get_current();
				aforoSala = currentItem.get_item('Aforo');
			}
			//Tomamos la lista de asistencia a charlas
			clientContext.load(oAsistenciasList);
			//Tomamos el número de personas apuntadas a las charlas correspondientes al Item actual
			var camlQuery = new SP.CamlQuery();
			camlQuery.set_viewXml("<View><Query><Where><Eq><FieldRef Name='ID_x0020_Charla' /><Value Type='Text'>"+objcharlas.IDCharla+"</Value></Eq></Where></Query></View>");
			this.listItems = oAsistenciasList.getItems(camlQuery);
			clientContext.load(listItems,'Include(ID_x0020_Charla)');
			clientContext.executeQueryAsync(
				Function.createDelegate(this, CountOnSuccess), 
				Function.createDelegate(this, CountOnFail)
			);
		}
	}
	/**
	* Función que se ejecuta cuando la CamlQuery para saber el numero de asistentes a la charla Funciona
	* @sender {object}
	* @args {objects}
	*/
	function CountOnSuccess(sender,args)
	{
		var confirm;
		//Tomando el Aforo de la charla y el número de asistentes a la misma:
		//En el caso de que haya mas o igual gente apuntada que el Aforo de la charla: Añadimos el Item con el valor de la columna: 0 ---> Apuntado a lista de espera
		//En el caso de que haya menos gente que el aforo: Añadimos el Item con el valor de la columna: 1 -----> Apuntado correctamente
		var listEnumerator = this.listItems.getEnumerator();
		if(this.listItems.get_count() >= 0)
		{
			//Tomamos el número de asistentes
			var Assistants = listItems.get_count();
			//Calculamos la capacidad actual de la sala
			//Contamos también al usuario que se va a añadir
			var ActualCapacity = aforoSala - (Assistants+1);
			if(ActualCapacity >= 0)
			{
				//En el caso de que haya espacio
				TargetedControl = 1;
				alert("Hay plazas suficientes, se procederá a su inscripción");
				confirm = true;
			}
			else
			{
				//En el caso de que no haya espacio
				TargetedControl = 0;
				confirm = window.confirm("No hay plazas, ¿Desea apuntarse a la lista de espera?");
			}
			if(confirm == true)
			{
				//Tomamos la lista de asistencia a charlas
				clientContext.load(oAsistenciasList);
				//Crearemos la CamlQuery hacia la lista de "Asistencia a Charlas" con los datos tomados del Item para localizarlo en la lista
				var camlQuery = new SP.CamlQuery();
				camlQuery.set_viewXml("<View><Query><Where><And><Eq><FieldRef Name='ID_x0020_Charla' /><Value Type='Text'>"+objcharlas.IDCharla+"</Value></Eq><Eq><FieldRef Name='ID_x0020_Usuario' /><Value Type='Text'>"+objcharlas.UserID+"</Value></Eq></And></Where></Query></View>");
				this.listItems = oAsistenciasList.getItems(camlQuery);
				clientContext.load(listItems,'Include(Title,ID_x0020_Usuario,ID)');
				clientContext.executeQueryAsync(
					Function.createDelegate(this, checkItemOnSuccess),
					Function.createDelegate(this, checkItemOnFail)
				);
			}
			else
			{
				$('.btntable').prop("disabled", false);
			}
		}
	}
	/**
	* Función que se ejecuta cuando la CamlQuery para saber el numero de asistentes a la charla Falla
	* @sender {object}
	* @args {objects}
	*/
	function CountOnFail(sender,args)
	{
		alert("Fallo al revisar el Aforo sobre la sala, por favor, contacte con su administrador: ERROR "+args.get_message());
	}
	/**
	* Función que se ejecuta cuando la CamlQuery para tomar el Aforo no ha funcionado
	* @sender {object}
	* @args {objects}
	*/
	function CapacityOnFail(sender,args)
	{
		alert("Fallo al revisar el Aforo sobre la sala, por favor, contacte con su administrador: ERROR "+args.get_message())
	}
	
	/**
	* Función que se ejecuta cuando la CamlQuery ha funcionado correctamente
	* @sender {object}
	* @args {objects}
	*/
	function checkItemOnSuccess(sender, args)
	{
		//Los botónes se deshabilitan para el usuario
		$('.btntable').prop("disabled", false);
		//Cargamos la lista de "Asistencia a Charlas"
		clientContext.load(oAsistenciasList);
		//Cargamos los items de la lista
		var listEnumerator = this.listItems.getEnumerator();
		//En el caso de que no existan items que correspondan a esa query se crean
		if(this.listItems.get_count() == 0)
		{
			//Creamos los items con los datos necesarios y cargados previamente
			var itemCreateInfo = new SP.ListItemCreationInformation();
			this.oListItem = oAsistenciasList.addItem(itemCreateInfo);
			oListItem.set_item('Title', objcharlas.TituloCharla);
			oListItem.set_item('ID_x0020_Charla', objcharlas.IDCharla);
			oListItem.set_item('ID_x0020_Usuario', objcharlas.UserID);
			oListItem.set_item('Apuntado', TargetedControl);
			oListItem.update();
			clientContext.load(oListItem);
			//Comprobamos si la query ha sido un éxito o no
			clientContext.executeQueryAsync(Function.createDelegate(this, this.AddItemOnQuerySucceeded), Function.createDelegate(this, this.AddItemOnQueryFailed));
		}
		else
		{
			//En el caso de que ya exista el Item se le comunica al usuario mediante un popup por pantalla
			alert("Ya estas apuntado a esta charla");	
		}
	}
	/**
	* Función que se ejecuta cuando la CamlQuery no ha funcionado
	* @sender {object}
	* @args {objects}
	*/
	function checkItemOnFail(sender, args)
	{
		//Habilitamos los botones y mostramos un mensaje por pantalla del error
		$('.btntable').prop("disabled", false);
		alert("Error al apuntarse");
	}
	/**
	* Función que se ejecuta cuando la CamlQuery de apuntarse a la charla ha funcionado correctamente
	* @sender {object}
	* @args {objects}
	*/
	function AddItemOnQuerySucceeded(sender, args) 
	{
		setContext(variables.clientId.Events);
		execute({
                clientId: variables.clientId.Events,
                version: "v1.0",
                endpoint: "/me/events",
                type: "POST",
                data: {
				"subject": objcharlas.TituloCharla,
				  "start": {
				    "dateTime": "2018-05-16T08:13:01.870Z",
				    "timeZone": "UTC"
				  },
				  "end": {
				    "dateTime": "2018-05-23T08:13:01.870Z",
				    "timeZone": "UTC"
				  }
				},
                callback: function (result) {
                   alert("Completed");
                }
            });	
	
	/*
		var calendarEvent = {
		  "subject": "Alex Prueba C�digo",
		  "start": {
		    "dateTime": "2018-05-14T14:03:48.160Z",
		    "timeZone": "UTC"
		  },
		  "end": {
		    "dateTime": "2018-05-21T14:03:48.160Z",
		    "timeZone": "UTC"
		  }
		}
		
		$.ajax({
			url:"https://outlook.office.com/api/v2.0/me/events",
			data: calendarEvent,
			success: function(data){alert(data);},
			contenType: "application/json",
			headers:{
				'Accept':'application/json',
				'Authorization':'Bearer eyJ0eXAiOiJKV1QiLCJub25jZSI6IkFRQUJBQUFBQUFEWDhHQ2k2SnM2U0s4MlRzRDJQYjdyZlNZMmhKLUE4dHBEQlJhYWxPZEFuRkV6ZHUyTFRzX1lrM18tOTNtTndndURSbFNNZmJpYnhKYnNNdl9qSmZCZkZWYW5ibVdvS1Z4dGtjXzRSb3B5QmlBQSIsImFsZyI6IlJTMjU2IiwieDV0IjoiaUJqTDFSY3F6aGl5NGZweEl4ZFpxb2hNMllrIiwia2lkIjoiaUJqTDFSY3F6aGl5NGZweEl4ZFpxb2hNMllrIn0.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9iNzE2YzExZi0xNmEzLTRkMTUtOGRiYy1mMTFmN2ZkZWZlNWEvIiwiaWF0IjoxNTI2MzA5MjcwLCJuYmYiOjE1MjYzMDkyNzAsImV4cCI6MTUyNjMxMzE3MCwiYWNyIjoiMSIsImFpbyI6IkFTUUEyLzhIQUFBQU83aUFmMWRQUElOWXB2cEVtUXZ1ZjdPYmJqanJtNU9WbXVUZ2NuNmt2VTQ9IiwiYW1yIjpbInB3ZCJdLCJhcHBfZGlzcGxheW5hbWUiOiJHcmFwaCBleHBsb3JlciIsImFwcGlkIjoiZGU4YmM4YjUtZDlmOS00OGIxLWE4YWQtYjc0OGRhNzI1MDY0IiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJBZG1pbiIsImdpdmVuX25hbWUiOiJJbnRyYW5ldDEiLCJpcGFkZHIiOiI4My41OS4yMDkuMjI5IiwibmFtZSI6IkludHJhbmV0MSBBZG1pbiIsIm9pZCI6IjcyMTgwODFkLTNiMWUtNDg5MS1iZDRiLThkMjBjMjEyMzY0MSIsIm9ucHJlbV9zaWQiOiJTLTEtNS0yMS0xOTcyODU0NTkyLTQxMzYwMTc1NDctMjYzNzU1MTIxMS00MTMzMyIsInBsYXRmIjoiMyIsInB1aWQiOiIxMDAzN0ZGRUE5NDRBRTk3Iiwic2NwIjoiQ2FsZW5kYXJzLlJlYWRXcml0ZSBDb250YWN0cy5SZWFkV3JpdGUgRGV2aWNlTWFuYWdlbWVudEFwcHMuUmVhZC5BbGwgRGV2aWNlTWFuYWdlbWVudEFwcHMuUmVhZFdyaXRlLkFsbCBEZXZpY2VNYW5hZ2VtZW50Q29uZmlndXJhdGlvbi5SZWFkLkFsbCBEZXZpY2VNYW5hZ2VtZW50Q29uZmlndXJhdGlvbi5SZWFkV3JpdGUuQWxsIERldmljZU1hbmFnZW1lbnRNYW5hZ2VkRGV2aWNlcy5Qcml2aWxlZ2VkT3BlcmF0aW9ucy5BbGwgRGV2aWNlTWFuYWdlbWVudE1hbmFnZWREZXZpY2VzLlJlYWQuQWxsIERldmljZU1hbmFnZW1lbnRNYW5hZ2VkRGV2aWNlcy5SZWFkV3JpdGUuQWxsIERldmljZU1hbmFnZW1lbnRSQkFDLlJlYWQuQWxsIERldmljZU1hbmFnZW1lbnRSQkFDLlJlYWRXcml0ZS5BbGwgRGV2aWNlTWFuYWdlbWVudFNlcnZpY2VDb25maWcuUmVhZC5BbGwgRGV2aWNlTWFuYWdlbWVudFNlcnZpY2VDb25maWcuUmVhZFdyaXRlLkFsbCBEaXJlY3RvcnkuQWNjZXNzQXNVc2VyLkFsbCBEaXJlY3RvcnkuUmVhZFdyaXRlLkFsbCBGaWxlcy5SZWFkV3JpdGUuQWxsIEdyb3VwLlJlYWRXcml0ZS5BbGwgSWRlbnRpdHlSaXNrRXZlbnQuUmVhZC5BbGwgTWFpbC5SZWFkV3JpdGUgTWFpbGJveFNldHRpbmdzLlJlYWRXcml0ZSBOb3Rlcy5SZWFkV3JpdGUuQWxsIFBlb3BsZS5SZWFkIFJlcG9ydHMuUmVhZC5BbGwgU2l0ZXMuUmVhZFdyaXRlLkFsbCBUYXNrcy5SZWFkV3JpdGUgVXNlci5SZWFkIFVzZXIuUmVhZEJhc2ljLkFsbCBVc2VyLlJlYWRXcml0ZSBVc2VyLlJlYWRXcml0ZS5BbGwiLCJzdWIiOiJ2T3hSUFlxTWo3WU56WHUwbl9sZ0ZlOGhwXzIyenNRZjJUd1JsYlZfdkpJIiwidGlkIjoiYjcxNmMxMWYtMTZhMy00ZDE1LThkYmMtZjExZjdmZGVmZTVhIiwidW5pcXVlX25hbWUiOiJpbnRyYW5ldDFAdmFzcy5lcyIsInVwbiI6ImludHJhbmV0MUB2YXNzLmVzIiwidXRpIjoiVUU1bGF5eXExazZieDJmcnJtd2xBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiNjJlOTAzOTQtNjlmNS00MjM3LTkxOTAtMDEyMTc3MTQ1ZTEwIl19.hPpQJ50aH7NasEDpCXclS-Xw2tECllWu4gGX0gkOKOER7i9_JgrZZUFNuTg9uxkRKTbcsobmRuaBxQMgr_9SkkHQCahdBTQU9dYCtr_ZkgFLJzv_-iGFqMeQLDp2lpG_hBVVdq3JE68lw6aUeUjpIVYiZKgitySmE5RlIzrVXbfHoVFswYKGDAPtyHhsC6iZ_3GxVP612YIpE3Bpx-ooJXglyUinRwIbqU8cDok2hObsrXMjS-MKLktOiuP6d1J0Ui2A4Q7KKtuSsVHrNEv2QhawQut1tVAyahO3W2__UzNOYdkw5KG5fTwQVfrxntUnIKMKVhrMIwRb8gxB5rkfWw'
					}
			});
			*/

		alert("Apuntado a la charla Correctamente");
	}
	/**
	* Función que se ejecuta cuando la CamlQuery de apuntarse a la charla no ha funcionado
	* @sender {object}
	* @args {objects}
	*/
	function AddItemOnQueryFailed(sender, args) 
	{
		alert("Error al apuntarse a la charla, por favor contacte con su administrador");
	}
///////////////////////////////////////////////////////////////////////////////////BOTON: DESAPUNTARSE/////////////////////////////////////////////////////////////////////
	function RemoveItem(btn)
	{
		//Deshabilitamos los botones
		$('.btntable').prop("disabled", true);
		
		//Tomamos los datos necesarios de la página
		//Entre estos datos tomaremos: ID de la Charla y el Usuario Actual
		var tr1=$(btn).closest('tr');
		var tds = tr1.find('td');
		var IDCharla = $(tds[1]).text();
		var UserID = $(".o365cs-mfp-header-displayname").text();
		//Guardaremos estos datos en un array para utilizarlo más adelante
		objcharlas=new Object();
		objcharlas.UserID=UserID;
		objcharlas.IDCharla=IDCharla;
		clientContext.load(oAsistenciasList);
		//Creamos la Query para recuperar los elementos de la lista de "Asistencia a Charlas" correspondientes a los datos del elemento actual
		var camlQuery = new SP.CamlQuery();
		camlQuery.set_viewXml("<View><Query><Where><And><Eq><FieldRef Name='ID_x0020_Charla' /><Value Type='Text'>"+IDCharla+"</Value></Eq><Eq><FieldRef Name='ID_x0020_Usuario' /><Value Type='Text'>"+UserID+"</Value></Eq></And></Where></Query></View>");
		this.listItems = oAsistenciasList.getItems(camlQuery);
		//Recuperamos de la lista el Titulo, el ID interno y el ID de usuario
		clientContext.load(listItems,'Include(Title,ID_x0020_Usuario,ID)');
		clientContext.executeQueryAsync(
			Function.createDelegate(this, onSuccess), 
			Function.createDelegate(this, onFail)
		);
	}
	/**
	* Función que se ejecuta cuando la CamlQuery de Desapuntarse a la charla ha funcionado correctamente
	* @sender {object}
	* @args {objects}
	*/
	function onSuccess(sender, args)
	{
		//Deshabilitamos los botones
		$('.btntable').prop("disabled", false);
		//Cargamos la lista de "Asistencia a Charlas"
		clientContext.load(oAsistenciasList);
		//Tomamos los items de la lista de "Asistencia a charlas" correspondientes a la query que hemos creado
		var listEnumerator = this.listItems.getEnumerator();
		//Si se encuentran Items, elimina el correspondiente
		if(this.listItems.get_count() > 0)
		{
			//Tomamos el item correspondiente y lo eliminamos
			while (listEnumerator.moveNext())
			{
				flagUnattached = 1;
				var currentItem = listEnumerator.get_current();
				var id = currentItem.get_item('ID');
				this.oListItem = oAsistenciasList.getItemById(id);
				oListItem.deleteObject();
				clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceeded), Function.createDelegate(this, this.onQueryFailed));	
			}
		}
		else
		{
			//En el caso de que no se hayan encontrado elementos
			alert("No estas apuntado a esta charla");	
		}
	}
	/**
	* Función que se ejecuta cuando la CamlQuery de Desapuntarse a la charla no ha funcionado
	* @sender {object}
	* @args {objects}
	*/
	function onFail(sender, args) 
	{
		//Habilitamos los botones y mostramos un mensaje de error por pantalla
		$('.btntable').prop("disabled", false);
		alert('Error al Desapuntarse, por favor, contacte con su administrador. Error:' + args.get_message());
	}
	/**
	* Función que se ejecuta cuando la CamlQuery de Desapuntarse a la charla ha funcionado
	* @sender {object}
	* @args {objects}
	*/
	function onQuerySucceeded() 
	{
		//Habilitamos los botones
		//$('.btntable').prop("disabled", false);
		//Mostramos un mensaje por pantalla
		alert('Desapuntado de la charla correctamente');
		//Creamos una query para retornar los items en el que el valor de la columna apuntado sea igual a 0
		clientContext.load(oAsistenciasList);
		var camlQuery = new SP.CamlQuery();
		camlQuery.set_viewXml("<View><Query><Where><And><Eq><FieldRef Name='Apuntado' /><Value Type='Number'>0</Value></Eq><Eq><FieldRef Name='ID_x0020_Charla' /><Value Type='Text'>"+objcharlas.IDCharla+"</Value></Eq></And></Where><OrderBy><FieldRef Name='Created' Ascending='True' /></OrderBy></Query></View>");
		this.listItems = oAsistenciasList.getItems(camlQuery);
		//Recuperamos de la lista el Titulo, el ID interno y el ID de usuario
		clientContext.load(listItems,'Include(Apuntado)');
		clientContext.executeQueryAsync(
			Function.createDelegate(this, ChangeAssistanceOnSuccess), 
			Function.createDelegate(this, ChangeAssistanceOnFail)
		);
	}
	/**
	* Función que se ejecuta cuando la CamlQuery de devolver los items con valor en apuntado a 0 Funciona correctamente
	* @sender {object}
	* @args {objects}
	*/
	function ChangeAssistanceOnSuccess(sender,args)
	{
		clientContext.load(oAsistenciasList);
		//Tomamos los items de la lista de "Asistencia a charlas" correspondientes a la query que hemos creado
		var listEnumerator = this.listItems.getEnumerator();
		while (listEnumerator.moveNext())
		{
			itemsCount = itemsCount + 1;
			if(itemsCount == 1)
			{
				var currentItem = listEnumerator.get_current();
				currentItem.set_item('Apuntado','1');
				currentItem.update();
				clientContext.load(currentItem);
				clientContext.executeQueryAsync(Function.createDelegate(this, this.UpdateItemOnSucceeded), Function.createDelegate(this, this.UpdateItemOnFailed));
			}
		}
	}
	/**
	* Función que se ejecuta cuando la CamlQuery de devolver los items con valor en apuntado a 0 No Funciona
	* @sender {object}
	* @args {objects}
	*/
	function ChangeAssistanceOnFail(sender,args)
	{
		alert("Error interno al actualizar elementos, por favor contacte con su administrador: ERROR "+args.get_message());
	}
	/**
	* Función que se ejecuta cuando la CamlQuery de actualizar los items Funciona
	* @sender {object}
	* @args {objects}
	*/
	function UpdateItemOnSucceeded(sender, args)
	{
			console.log("Actualizado el elemento correctamente");
	}
	/**
	* Función que se ejecuta cuando la CamlQuery de actualizar los items Funciona
	* @sender {object}
	* @args {objects}
	*/
	function UpdateItemOnFailed(sender, args)
	{
		console.log("Error al actualizar el elemento: "+args.get_message());
	}
	/**
	* Función que se ejecuta cuando la CamlQuery de Desapuntarse a la charla no ha funcionado
	* @sender {object}
	* @args {objects}
	*/
	function onQueryFailed(sender, args) 
	{
		//Habilitamos los botones
		$('.btntable').prop("disabled", false);
		//Mostramos un mensaje por pantalla con el error
		alert('Error al Desapuntarse, por favor, contacte con su administrador. ERROR '+ args.get_message());
	}