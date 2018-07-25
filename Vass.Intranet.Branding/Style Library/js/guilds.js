$(document).ready(function() {
	$('#btnOk').on('click', function () {
		var guildName = $('#drpNombreGremio').val();

		var clientContext = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);

		var oList = clientContext.get_web().get_lists().getByTitle('Unete a un gremio');

		var itemCreateInfo = new SP.ListItemCreationInformation();
		var guildItem = oList.addItem(itemCreateInfo);
		guildItem.set_item('Title', guildName);			
		guildItem.update();

		clientContext.load(guildItem);

		clientContext.executeQueryAsync(
			Function.createDelegate(this, function () {
				showOkMessage("Tu petición se ha creado correctamente. En cuanto se apruebe la petición por parte del administrador del gremio lo tendrá disponible en su TEAMS y en la home de la intranet.", function () {
					window.location.href = 'home.aspx';
				});
			}),
			Function.createDelegate(this, function (sender, args) {
				console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
				showErrorMessage("No se ha podido crear la petición");
			})
		);
	});

	$('#btnCancel').on('click', function () {
		window.history.back();
	});

	var url = "https://grupovass.sharepoint.com/es-es/_api/web/lists/getbytitle('Teams')/items?$filter=TeamType eq 'Gremio'";

	var $ajax = $.ajax({
		url: url,
		type: "GET",
		dataType: "json",
		headers: {
			Accept: "application/json;odata=verbose"
		}
	});

	$ajax.done(function (data, textStatus, jqXHR) {
		guilds = data.d.results;
		var html = "";
		
		for(var i = 0; i < guilds.length; i++) {
			html += "<option value='" + guilds[i].Title + "'>" + guilds[i].Title + "</option>";
		}
		
		$("#drpNombreGremio").append(html);
	});
});

function showOkMessage(msg, callback) {
    bootbox.alert(msg, function () {
        if (callback == null)
            window.location.reload();
        else {
            callback();
        }
    });
}

function showErrorMessage(msg) {
    bootbox.alert(msg, function () {
        window.history.back();
    });
}