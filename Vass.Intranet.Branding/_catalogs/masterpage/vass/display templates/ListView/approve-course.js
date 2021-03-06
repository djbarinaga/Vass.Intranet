﻿(function () {
    
    var courseContext = {};
    courseContext.Templates = {};

    courseContext.Templates.Header = headerTemplate;
    courseContext.Templates.Footer = footerTemplate;
    courseContext.Templates.Item = courseTemplate;
    courseContext.OnPostRender = courseOnPostRender; 

    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(courseContext);

})();

function headerTemplate(ctx) {
    var html = '<table class="table table-striped">';
    html += '<thead><tr>';

    html += '<th>Curso</th>';
    html += '<th>Fecha de inicio</th>';
    html += '<th>Email</th>';
    html += '<th>Estado de aprobación</th>';

    html += '</tr></thead>';

    return html;
}

function courseTemplate(ctx) {
    if (ctx.CurrentItem.Nombre_x0020_curso.length > 0) {
        var course = ctx.CurrentItem.Nombre_x0020_curso["0"].lookupValue;
        var startDate = ctx.CurrentItem.Fecha;
        var courseId = ctx.CurrentItem.Nombre_x0020_curso["0"].lookupId;
        var status = ctx.CurrentItem.Estado;
        var itemId = ctx.CurrentItem.ID;
        var email = ctx.CurrentItem.Author["0"].email;
        var courseDate = '';

        if (startDate != '')
            courseDate = toDate(startDate.split(' ')[0]);

        var html = '<tr>';

        var statusClass = "fg-orange";

        if (status == 'Aprobado')
            statusClass = "fg-green";
        else if (status == 'Rechazado')
            statusClass = "fg-red";

        html += '<td><a href="curso.aspx?curso=' + courseId + '" target="_blank">' + course + '</a></td>';
        html += '<td><span>' + courseDate + '</span></td>';
        html += '<td><span>' + email + '</span></td>';
        html += '<td><span class="bold ' + statusClass + '">' + status + '</span></td>';

        html += '</tr>';

        return html;
    }
}

function footerTemplate(ctx) {
    var html = '</table>';

    html += '<div id="approve-buttons"><button type="button" class="bg-orange" id="btnApprove">Aprobar</button><button type="button" class="bg-grey" id="btnReject">Rechazar</button></div>';

    return html;
}

function courseOnPostRender() {
    $('#btnApprove').on('click', function () {
        setModerationStatus('Aprobado'); //0 == Approved
    });

    $('#btnReject').on('click', function () {
        setModerationStatus('Rechazado'); //1 == Denied
    });
}

function setModerationStatus(moderationStatus) {
    var message = '';

    if (moderationStatus == 'Aprobado')
        message = "¿Desea aprobar la solicitud del curso?";
    else
        message = "¿Desea denegar la solicitud del curso?";

    bootbox.confirm(message, function (result) {
        if (result) {
            bootbox.prompt({
                title: "Comentarios",
                inputType: 'textarea',
                callback: function (result) {
                    if (result != null) {
                        var comments = result;

                        var id = getUrlParam('solicitud');
                        var listName = 'Solicitud Cursos-empleados';
                        var item = {
                            "__metadata": {
                                "type": "SP.Data.Solicitud_x0020_CursosempleadosListItem"
                            },
                            "Estado": moderationStatus,
                            "Comentarios": comments
                        };

                        $.ajax({
                            url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + listName + "')/items(" + id + ")",
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
                                var msg = 'Se ha aprobado correctamente la solicitud';

                                if (moderationStatus == 1)
                                    msg = 'Se ha denegado la solicitud';

                                bootbox.alert(msg, function () {
                                    window.location.href = '/es-es/formacion';
                                });
                            },
                            error: function (data) {
                                console.log(data);
                            }
                        });
                    }
                }
            });
        }
    });
}