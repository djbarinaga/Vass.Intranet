(function () {
    
    var stockContext = {};
    stockContext.Templates = {};

    stockContext.Templates.Header = '<div id="my-stock">';
    stockContext.Templates.Footer = '</div>';
    stockContext.Templates.Item = stockTemplate;
    stockContext.OnPostRender = stockOnPostRender; 

    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(stockContext);

})();

function stockTemplate(ctx) {
    var html = '<div class="row">';
    
    html += '<div class="col-4"><div class="text-center"><p class="big-circle bg-dark-blue">' + ctx.CurrentItem["Initial_x0020_Budget"] + '</p><p class="big">Presupuesto inicial</p></div></div>';
    html += '<div class="col-4"><div class="text-center"><p class="big-circle bg-dark-blue">' + ctx.CurrentItem["Consumed_x0020_Bag"] + '</p><p class="big">Consumido</p></div></div>';
    html += '<div class="col-4"><div class="text-center"><p class="big-circle bg-dark-blue">' + ctx.CurrentItem["Hours"] + '</p><p class="big">Horas de formación recibidas</p></div></div>';

    html += '</div>';
    
    return html;
}

function stockOnPostRender() {
    if ($('#my-stocks button').length > 0) {
        $('#my-stocks thead tr').append('<th/>');

        $('#my-stocks button').each(function () {
            $(this).on('click', function () {
                var button = $(this);
                var itemId = $(this).data('argument');
                var message = $(this).data('message');

                bootbox.setDefaults({
                    closeButton: false
                });

                bootbox.confirm(message, function (result) {
                    if (result) {
                        var listName = 'Solicitudes cursos';
                        var item = {
                            "__metadata": {
                                "type": "SP.Data.Solicitudes_x0020_cursosListItem"
                            },
                            "AttendanceConfirmed": true
                        };

                        $.ajax({
                            url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + listName + "')/items(" + itemId + ")",
                            type: "POST",
                            contentType: "application/json;odata=verbose",
                            data: JSON.stringify(item),
                            headers: {
                                "Accept": "application/json;odata=verbose",
                                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                                "X-HTTP-Method": "MERGE",
                                "If-Match": "*"
                            },
                            success: function (data) {
                                bootbox.alert('La confirmación de asistencia al curso se ha realizado correctamente.', function () {
                                    button.fadeOut();
                                });
                            },
                            error: function (data) {
                                console.log(data);
                            }
                        });
                    }
                });
            })
        })
    }
}