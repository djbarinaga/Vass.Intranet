//NEW CHAT
(function ($) {
    $.fn.project_request = function (options) {
        var $this = this;

        $(this).find('#btnOk').on('click', function () {
            var chatName = $('#txtPepProyecto').val();
            var chatDescription = $('#txtNombreProyecto').val();
			var chatCliente = $('#txtCliente').val();
            var chatAreaTecnica = $('#txtAreaTecnica').val();

            var clientContext = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);

            var oList = clientContext.get_web().get_lists().getByTitle('Peticiones Proyectos');

            var itemCreateInfo = new SP.ListItemCreationInformation();
            gameItem = oList.addItem(itemCreateInfo);

            gameItem.set_item('Title', chatName);
            gameItem.set_item('NombreProyecto', chatDescription);
			gameItem.set_item('Cliente', chatCliente);
            gameItem.set_item('AreaTecnica', chatAreaTecnica);
			
            gameItem.update();

            clientContext.load(gameItem);

            clientContext.executeQueryAsync(
                Function.createDelegate(this, function () {
                    showOkMessage("Tu petición se ha creado correctamente", function () {
                        window.location.href = 'home.aspx';
                    });
                }),
                Function.createDelegate(this, function (sender, args) {
                    console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                    showErrorMessage("No se ha podido crear la petición");
                })
            );
        });

        $(this).find('#btnCancel').on('click', function () {
            window.history.back();
        });
    };
}(jQuery));



$(document).ready(function () {
    $('#alta-proyecto').project_request();
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
