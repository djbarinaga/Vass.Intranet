(function(){
	//Constantes
	var objcharlasAdmin;
	var contextAdmin;
	var siteUrlAdmin;
	var clientcontextAdmin;
	var oConfigurationListAdmin;
	var oCharlasListAdmin;
	var currentYear;
	var puntos;
	var status;	
	var UserID;
	
	//Función principal
	ExecuteOrDelayUntilScriptLoaded(readyFunction,"sp.js", "SP.ClientContext");
	
})();

function readyFunction()
{
	//Tomamos el año actual
	currentYear = (new Date).getFullYear();
	//Tomamos el contexto del sitio
	contextAdmin = new SP.ClientContext;
	siteUrlAdmin = window.location.protocol + "//" + window.location.host + contextAdmin.get_url();
	clientcontextAdmin= new SP.ClientContext(siteUrlAdmin);
	//Tomamos la lista de Configuracion Charlas
	oConfigurationListAdmin= clientcontextAdmin.get_web().get_lists().getByTitle('Configuracion Charlas');
	//Tomamos la lista de Charlas
	oCharlasListAdmin = clientcontextAdmin.get_web().get_lists().getByTitle('Charlas');
	//Tomamos la lista de Asistencia a charlas
	oAsistenciaCharlasList= clientcontextAdmin.get_web().get_lists().getByTitle('Asistencia a Charlas');

	
	
	var $t = $('#js-listviewthead-WPQ1').next().next().find('tr');
	$t.each(function()
	{
		$(this).append("<td><input type='button' class='btntable' onclick='AssignPoints(this)' value='Asignar Puntos'/></td><td><input type='button' class='btntable' onclick='SendSurvey(this)' value='Enviar Encuesta'/></td>");
	});
}
function AssignPoints(btn)
{
	var tr1=$(btn).closest('tr');
	var tds = tr1.find('td');
	var IDCharla = $(tds[1]).text();
	var statusCharla = $(tds[4]).text();
	//AÃ±adimos los datos tomados sobre un array que podremos usar en las distintas Funciones
	objcharlasAdmin=new Object();
	objcharlasAdmin.IDCharla=IDCharla;
	var puntuacionCharla = $(tds[10]).text();
	
	if(statusCharla != 'Realizada')
	{
		alert("La charla no se ha completado...Espere a que se complete la charla");
	}
	else
	{		
		if(puntuacionCharla == "")
		{		
			//Los botones de apuntarse y de Desapuntarse se Bloquean para el usuario
			//$('.btntable').prop("disabled", true);
			//Tomamos el año actual
			currentYear = (new Date).getFullYear();
			//Montamos la query para tomar de la lista de configuración el item referente al año actual
			//Tomamos la lista de configuración
			clientcontextAdmin.load(oConfigurationListAdmin);
			//Creamos una query a la lista de "Charlas" para comprobar el Aforo
			var camlQuery = new SP.CamlQuery();
			camlQuery.set_viewXml("<View><Query><Where><And><Eq><FieldRef Name='A_x00f1_o' /><Value Type='Text'>"+currentYear+"</Value></Eq><Eq><FieldRef Name='Accion' /><Value Type='Choice'>Charla Técnica</Value></Eq></And></Where></Query></View>");
			this.listItems = oConfigurationListAdmin.getItems(camlQuery);
			clientcontextAdmin.load(listItems,'Include(Puntos)');
			clientcontextAdmin.executeQueryAsync(
				Function.createDelegate(this, ConfigurationOnSuccess),
				Function.createDelegate(this, ConfigurationOnFail)
			);
		}
		else
		{
			alert("La charla ya tiene una puntuacion asignada");
		}
	}
}
function ConfigurationOnSuccess(sender,args)
{
	//Tomamos los puntos de la columna devuelta
	var listEnumerator = this.listItems.getEnumerator();
	while (listEnumerator.moveNext())
	{
		var currentItem = listEnumerator.get_current();
		puntos = currentItem.get_item('Puntos');
	}
	//cargamos la lista correspondiente al elemento actual
	clientcontextAdmin.load(oCharlasListAdmin);
	var camlQuery = new SP.CamlQuery();
	camlQuery.set_viewXml("<View><Query><Where><Eq><FieldRef Name='ID' /><Value Type='Counter'>"+objcharlasAdmin.IDCharla+"</Value></Eq></Where></Query></View>");
	this.listItems = oCharlasListAdmin.getItems(camlQuery);
	clientcontextAdmin.load(listItems);
	clientcontextAdmin.executeQueryAsync(
		Function.createDelegate(this, SetPointsOnSuccess),
		Function.createDelegate(this, SetPointsOnFail)
	);
}
function ConfigurationOnFail(sender,args)
{
	alert("Error al asignar los puntos sobre el año actual: Por favor, contacte con su Administrador. ERROR: "+args.get_message());
}
function SetPointsOnSuccess (sender,args)
{
	clientcontextAdmin.load(oCharlasListAdmin);
	var listEnumerator = this.listItems.getEnumerator();
	while (listEnumerator.moveNext())
	{
		var currentItem = listEnumerator.get_current();
		currentItem.set_item('Puntos_x0020_Charla',puntos);
		currentItem.update();
		clientcontextAdmin.load(currentItem);
		clientcontextAdmin.executeQueryAsync(Function.createDelegate(this, this.UpdatePointsOnSucceeded), Function.createDelegate(this, this.UpdatePointsOnFailed));
	}
}
function SetPointsOnFail(sender,args)
{
	alert("Error al asignar los puntos sobre el año actual: Por favor, contacte con su Administrador. ERROR: "+args.get_message());
}
function UpdatePointsOnSucceeded(sender,args)
{
	alert("Agregados los puntos correctamente");
	location.reload();
}
function UpdatePointsOnFailed(sender,args)
{
	alert("Error al asignar los puntos sobre el año actual: Por favor, contacte con su Administrador. ERROR: "+args.get_message());
}

function SendSurvey(btn)
{
	UserID = $(".o365cs-mfp-header-displayname").text();
	clientcontextAdmin.load(oAsistenciaCharlasList);
	var camlQuery = new SP.CamlQuery();
	camlQuery.set_viewXml("<View><Query><Where><Eq><FieldRef Name='ID_x0020_Charla' /><Value Type='Text'>41</Value></Eq></Where></Query></View>");
	this.listItems = oAsistenciaCharlasList.getItems(camlQuery);
	clientcontextAdmin.load(listItems);
	clientcontextAdmin.executeQueryAsync(
		Function.createDelegate(this, OnSuccess), 
		Function.createDelegate(this, OnFail)
	);
}
function OnFail(sender,args){alert("Falla por capullo");}
function OnSuccess(sender,args)
{
	clientcontextAdmin.load(oAsistenciaCharlasList);
	var listEnumerator = this.listItems.getEnumerator();
	var object = new SP.User();
	object.addUser(UserID);
	while (listEnumerator.moveNext())
	{
		var currentItem = listEnumerator.get_current();
		currentItem.set_item('users',object);
		currentItem.update();
		clientcontextAdmin.load(currentItem);
		clientcontextAdmin.executeQueryAsync(Function.createDelegate(this, this.PointsOnSucceeded), Function.createDelegate(this, this.PointsOnFailed));
	}
}
function PointsOnSucceeded (sender, args){alert("Ole!! Has triunfaooooo");}
function PointsOnFailed (sender,args){alert("Fracasadooo");}
	