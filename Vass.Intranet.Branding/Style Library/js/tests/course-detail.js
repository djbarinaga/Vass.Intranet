function loadCourse() {
    var course = getUrlParam('curso');

    var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Cursos')/items?$select=Id, Title, Image, CourseHours, StartDate, EndDate, Profile, Area, Location, CourseType, Remarks, Trainer/Title&$expand=Trainer&$filter=Id eq " + course;

    var $ajax = $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        headers: {
            Accept: "application/json;odata=verbose"
        }
    });

    $ajax.done(function (data, textStatus, jqXHR) {
        var results = data.d.results;

        if (results != null && results.length > 0) {
            var result = results[0];

            var image = null;
            if (result.Image != null)
                image = result.Image.Url;

            var title = result.Title;
            var startDate = new Date(result.StartDate);
            var endDate = new Date(result.EndDate);

            $('#list-item-title').text(title);

            if (image != null)
                $('#list-item-picture').append('<img class="img-fluid" src="' + image + '"/>');

            var html = '<table class="table table-striped">';
            html += '<tbody>';

            html += '<tr>';
            html += '<td class="bold">Duración</td>';
            html += '<td>' + result.CourseHours + ' hrs.</td>';
            html += '<td class="bold">Fecha de inicio</td>';
            html += '<td>' + startDate.toLocaleDateString() + '</td>';
            html += '<td class="bold">Fecha de fin</td>';
            html += '<td>' + endDate.toLocaleDateString() + '</td>';
            html += '</tr>';

            html += '<tr>';
            html += '<td class="bold">Formador</td>';
            html += '<td>' + result.Trainer.Title + '</td>';
            html += '<td class="bold">Perfil</td>';
            html += '<td>' + result.Profile + '</td>';
            html += '<td class="bold">Área</td>';
            html += '<td>' + result.Area + '</td>';
            html += '</tr>';

            html += '<tr>';
            html += '<td class="bold">Ubicación</td>';
            html += '<td>' + result.Location + '</td>';
            html += '<td class="bold">Modalidad</td>';
            html += '<td>' + result.CourseType + '</td>';
            html += '<td class="bold">Observaciones</td>';
            html += '<td>' + (result.Remarks == null ? '' : result.Remarks) + '</td>';
            html += '</tr>';

            html += '</tbody>';
            html += '</table>';

            html += '<button type="button" id="btnInscripcion" class="btn btn-primary float-right">Inscribirme</button>';

            $('#list-item-content').append(html);

            $('#btnInscripcion').on('click', function () {
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
                        "CourseId": result.Id,
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
                            alert(data);
                        },
                        error: function (data) {
                            console.log(data);
                        }
                    });
                });
            });
        }
    });
}

function GetItemTypeForListName(name) {
    return "SP.Data." + name.charAt(0).toUpperCase() + name.split(" ").join("").slice(1) + "ListItem";
}

function getPropertyValue(userProperties, property) {
    for (var i = 0; i < userProperties.length; i++) {
        var userProperty = userProperties[i];
        if (userProperty.Key == property)
            return userProperty.Value;
    }
}

jQuery(document).ready(function () {
    loadCourse();
});