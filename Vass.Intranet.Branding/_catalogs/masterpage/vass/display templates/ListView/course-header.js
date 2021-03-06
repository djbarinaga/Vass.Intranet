﻿(function () {
    
    var courseContext = {};
    courseContext.Templates = {};

    courseContext.Templates.Header = '<div id="course">';
    courseContext.Templates.Footer = '</div>';
    courseContext.Templates.Item = courseTemplate;
    courseContext.OnPostRender = courseOnPostRender; 

    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(courseContext);

})();

function courseTemplate(ctx) {
    var html = '';
    var courseId = getUrlParam('curso');
    var id = ctx.CurrentItem["ID"];

    var title = ctx.CurrentItem["Nombre_x0020_Curso"];
    var hours = ctx.CurrentItem["Horas_x0020_curso"];
    var startDate = ctx.CurrentItem["Fecha_x0020_Inicio"];
    var endDate = ctx.CurrentItem["Fecha_x0020_Fin"];
    var trainer = '';//ctx.CurrentItem["Trainer"][0].lookupValue;
    var profile = ctx.CurrentItem["Perfil"];
    var descripcion = ctx.CurrentItem["Descripcion"];
    var imagen = ctx.CurrentItem["Imagen"];

    html = '<h2 id="page-title">' + title + '</h2>';

    if (imagen != null && descripcion != null) {
        html += '<div id="summary-zone">' +
                '   <div class="row">' +
                '       <div class="col-4">' +
                '           <img src="' + imagen + '"/>' +
                '       </div>' +
                '       <div class="col-8" id="summary">' +
                descripcion +
                '       </div>' +
                '   </div>' +
                '</div>';
    }

    html += '<div class="content"><table class="table">';

    if (hours != null && hours != '') {
        html += '<tr>';
        html += '<th>Horas</th>';
        html += '<td>' + hours + '</td>';
        html += '</tr>';
    }

    if (startDate != null && startDate != '') {
        html += '<tr>';
        html += '<th>Fecha de inicio</th>';
        html += '<td>' + startDate + '</td>';
        html += '</tr>';
    }
    
    if (endDate != null && endDate != '') {
        html += '<tr>';
        html += '<th>Fecha de fin</th>';
        html += '<td>' + endDate + '</td>';
        html += '</tr>';
    }


    if (trainer != null && trainer != '') {
        html += '<tr>';
        html += '<th>Formador</th>';
        html += '<td>' + trainer + '</td>';
        html += '</tr>';

    }

    if (profile != null && profile != '') {
        html += '<tr>';
        html += '<th>Perfil</th>';
        html += '<td>' + profile + '</td>';
        html += '</tr>';
    }

    if (ctx.CurrentItem["Area_x0020_Afectada"] != null && ctx.CurrentItem["Area_x0020_Afectada"] != '') {
        html += '<tr>';
        html += '<th>Area</th>';
        html += '<td>' + ctx.CurrentItem["Area_x0020_Afectada"] + '</td>';
        html += '</tr>';
    }

    if (startDate != null && startDate != '') {
        html += '<tr>';
        html += '<th>Ubcación</th>';
        html += '<td>' + ctx.CurrentItem["Ubicacion"] + '</td>';
        html += '</tr>';
    }

    if (ctx.CurrentItem["Modalidad_x0020_Curso"] != null && ctx.CurrentItem["Modalidad_x0020_Curso"] != '') {

        html += '<tr>';
        html += '<th>Modalidad</th>';
        html += '<td>' + ctx.CurrentItem["Modalidad_x0020_Curso"] + '</td>';
        html += '</tr>';
    }

    if (ctx.CurrentItem["Comentarios_x002f_observaciones"] != '') {
        html += '<tr>';
        html += '<th>Observaciones</th>';
        html += '<td>' + ctx.CurrentItem["Comentarios_x002f_observaciones"] + '</td>';
        html += '</tr>';
    }

    html += '</table>';

    html += '<button type="button" id="btnInscripcion" data-argument="' + id + '" data-message="¿Desea inscribirse en el curso ' + title + '?" class="btn btn-primary float-right">Inscribirme</button>';
    html += '</div>';

    return html;
}

function courseOnPostRender() {
    var courseId = getUrlParam('curso');
    checkInscription(courseId, function (result) {
        if (result) {
            $('#btnInscripcion').remove();
        }
    });

    $('#btnInscripcion').on('click', function () {
        var courseId = $(this).data('argument');
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
                    "Nombre_x0020_cursoId": courseId
                };

                $.ajax({
                    url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + listName + "')/items",
                    type: "POST",
                    contentType: "application/json;odata=verbose",
                    data: JSON.stringify(item),
                    headers: {
                        "Accept": "application/json;odata=verbose",
                        "X-RequestDigest": $("#__REQUESTDIGEST").val()
                    },
                    success: function (data) {
                        bootbox.alert('La inscripción al curso se ha realizado correctamente.', function () {
                            window.location.href = 'mis-cursos.aspx';
                        });
                    },
                    error: function (data) {
                        console.log(data);
                    }
                });
            }

        });
    });
}

function checkInscription(courseId, callback) {
    var listName = 'Solicitud Cursos-empleados';
    var currentUser = _spPageContextInfo.userId;

    var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + listName + "')/items?$top=1&$filter=Author eq " + currentUser + " and Nombre_x0020_curso eq " + courseId;

    $.ajax({
        url: url,
        type: "GET",
        contentType: "application/json;odata=verbose",
        headers: {
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        },
        success: function (data) {
            var results = data.d.results;

            callback(results.length > 0);
        },
        error: function (data) {
            console.log(data);

            callback(true);
        }
    });
}

function getPropertyValue(userProperties, property) {
    for (var i = 0; i < userProperties.length; i++) {
        var userProperty = userProperties[i];
        if (userProperty.Key == property)
            return userProperty.Value;
    }
}