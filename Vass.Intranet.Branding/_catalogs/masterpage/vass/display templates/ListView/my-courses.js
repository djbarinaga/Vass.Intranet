(function () {
    
    var courseContext = {};
    courseContext.Templates = {};

    courseContext.Templates.Header = headerTemplate;
    courseContext.Templates.Footer = '</table>';
    courseContext.Templates.Item = courseTemplate;
    courseContext.OnPostRender = courseOnPostRender; 

    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(courseContext);

})();

function headerTemplate(ctx) {
    var html = '<table class="table table-striped" id="my-courses">';
    html += '<thead><tr>';

    html += '<th>Curso</th>';
    html += '<th>Fecha de inicio</th>';
    html += '<th>Estado de aprobación</th>';

    html += '</tr></thead>';

    return html;
}

function courseTemplate(ctx) {
    var course = ctx.CurrentItem.Nombre_x0020_curso["0"].lookupValue;
    var startDate = ctx.CurrentItem.Fecha;
    var courseId = ctx.CurrentItem.Nombre_x0020_curso["0"].lookupId;
    var status = ctx.CurrentItem.Estado;
    var itemId = ctx.CurrentItem.ID;
    var courseDate = '';

    if (startDate != '')
        courseDate = toDate(startDate.split(' ')[0]);

    var html = '<tr>';

    var statusClass = "fg-orange";
    if (status == "")
    {
        status = "Pendiente";
    }

    if (status == "Aprobado") {
        statusClass = "fg-green";
    }
    else if (status == "Rechazado") {
        statusClass = "fg-red";
    }

    html += '<td><a href="curso.aspx?curso=' + courseId + '">' + course + '</a></td>';
    html += '<td><span>' + courseDate + '</span></td>';
    html += '<td><span class="bold ' + statusClass + '">' + status + '</span></td>';

    var daysDiff = dateDiff(new Date(), courseDate);

    if (daysDiff <= 5 && ctx.CurrentItem["Confirmacion_x0020_Asistencia"] == "" && (Number(status) != 2 && Number(status) != 1))
        html += '<td class="text-center"><button type="button" class="btn btn-primary" data-argument="' + itemId + '" data-message="¿Desea confirmar la asistencia al curso ' + course + '?">Confirmar asistencia</button></td>';

    html += '</tr>';
    
    return html;
}

function courseOnPostRender() {
    if ($('#my-courses button').length > 0) {
        $('#my-courses thead tr').append('<th/>');

        $('#my-courses button').each(function () {
            $(this).on('click', function () {
                var button = $(this);
                var itemId = $(this).data('argument');
                var message = $(this).data('message');

                bootbox.setDefaults({
                    closeButton: false
                });

                bootbox.confirm(message, function (result) {
                    if (result) {
                        var listName = 'Solicitud Cursos-empleados';
                        var item = {
                            "__metadata": {
                                "type": "SP.Data.Solicitud_x0020_CursosempleadosListItem"
                            },
                            "Confirmacion_x0020_Asistencia": 1
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