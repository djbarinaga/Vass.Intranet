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
    html += '<th>Duración</th>';
    html += '<th>Tipo</th>';

    html += '</tr></thead>';

    return html;
}

function courseTemplate(ctx) {
    var course = ctx.CurrentItem["Course"][0].lookupValue;
    var courseId = ctx.CurrentItem["Course"][0].lookupId;
    var startDate = ctx.CurrentItem["Curso_x003a_Fecha_x0020_de_x0020"].split(' ')[0];
    var courseDate = toDate(startDate);
    var itemId = ctx.CurrentItem["ID"];

    var html = '<tr>';

    html += '<td><a href="curso.aspx?curso=' + courseId + '">' + course + '</a></td>';
    html += '<td><span>' + startDate + '</span></td>';
    html += '<td><span>' + ctx.CurrentItem["Curso_x003a_Horas_x0020_curso"] + ' hrs.</span></td>';
    html += '<td><span>' + ctx.CurrentItem["Curso_x003a_Modalidad_x0020_del_"] + '</span></td>';

    var daysDiff = dateDiff(new Date(), courseDate);

    if (daysDiff <= 5 && ctx.CurrentItem["AttendanceConfirmed.value"] == 0)
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