(function () {
    
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

    if (id == Number(courseId)) {
        var title = ctx.CurrentItem["Title"];
        var hours = ctx.CurrentItem["CourseHours"];
        var startDate = ctx.CurrentItem["StartDate"];
        var endDate = ctx.CurrentItem["EndDate"];
        var trainer = ctx.CurrentItem["Trainer"][0].lookupValue;
        var profile = ctx.CurrentItem["Profile"];
        

        html = '<h2>' + title + '</h2>';

        html += '<div class="content"><table class="table">';

        html += '<tr>';
        html += '<th>Horas</th>';
        html += '<td>' + hours + '</td>';
        html += '</tr>';

        html += '<tr>';
        html += '<th>Fecha de inicio</th>';
        html += '<td>' + startDate + '</td>';
        html += '</tr>';

        html += '<tr>';
        html += '<th>Fecha de fin</th>';
        html += '<td>' + endDate + '</td>';
        html += '</tr>';

        html += '<tr>';
        html += '<th>Formador</th>';
        html += '<td>' + trainer + '</td>';
        html += '</tr>';

        html += '<tr>';
        html += '<th>Perfil</th>';
        html += '<td>' + profile + '</td>';
        html += '</tr>';

        html += '<tr>';
        html += '<th>Area</th>';
        html += '<td>' + ctx.CurrentItem["Area"] + '</td>';
        html += '</tr>';

        html += '<tr>';
        html += '<th>Ubcación</th>';
        html += '<td>' + ctx.CurrentItem["Location"] + '</td>';
        html += '</tr>';

        html += '<tr>';
        html += '<th>Modalidad</th>';
        html += '<td>' + ctx.CurrentItem["CourseType"] + '</td>';
        html += '</tr>';

        if (ctx.CurrentItem["Remarks"] != '') {
            html += '<tr>';
            html += '<th>Observaciones</th>';
            html += '<td>' + ctx.CurrentItem["Remarks"] + '</td>';
            html += '</tr>';
        }

        html += '</table>';

        html += '<button type="button" id="btnInscripcion" data-argument="' + id + '" data-message="¿Desea inscribirse en el curso ' + title + '?" class="btn btn-primary float-right">Inscribirme</button>';
        html += '</div>';
    }

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
                //Obtenemos las propiedades del usuario
                var url = _spPageContextInfo.webAbsoluteUrl + "/_api/SP.UserProfiles.PeopleManager/GetMyProperties";

                var $ajax = $.ajax({
                    url: url,
                    type: "GET",
                    dataType: "json",
                    headers: {
                        Accept: "application/json;odata=verbose"
                    }
                });

                $ajax.done(function (data, textStatus, jqXHR) {
                    var userProperties = data.d.UserProfileProperties.results;

                    var listName = 'Solicitudes cursos';
                    var item = {
                        "__metadata": {
                            "type": "SP.Data.Solicitudes_x0020_cursosListItem"
                        },
                        "CourseId": courseId,
                        "Email": getPropertyValue(userProperties, "WorkEmail"),
                        "FirstName": getPropertyValue(userProperties, "FirstName"),
                        "Surname": getPropertyValue(userProperties, "LastName"),
                        "Area": getPropertyValue(userProperties, "Department"),
                        "Position": getPropertyValue(userProperties, "Title")
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
                });
            }

        });
    });
}

function checkInscription(courseId, callback) {
    var listName = 'Solicitudes cursos';
    var currentUser = _spPageContextInfo.userId;

    var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + listName + "')/items?$filter=Author eq " + currentUser + " and CourseId eq " + courseId;

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