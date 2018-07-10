$(document).ready(function () {
    checkSurvey();
    $('#btnOk').on('click', function () {
        var hasSelect = true;

        $('#course-survey .form-group').each(function () {
            var radio = $(this).find('input[type="radio"]:checked');
            if (radio.length == 0) {
                hasSelect = false;
                return hasSelect;
            }
        });

        if (hasSelect) {
            $('#sending').modal();
            getCourse();
        }
        else {
            bootbox.alert('Por favor, conteste a todas las preguntas');
        }
    });
});

function checkSurvey() {
    var courseId = getUrlParam("c");

    var clientContext = SP.ClientContext.get_current();

    var oList = clientContext.get_web().get_lists().getByTitle('Listado Cursos');
    var item = oList.getItemById(Number(courseId));

    clientContext.load(item, 'Title', 'ID');

    clientContext.executeQueryAsync(
        Function.createDelegate(this, function () {
            $('#page-title').text('Encuesta sobre el curso ' + item.get_item('Title'));
            var list = clientContext.get_web().get_lists().getByTitle('Valoración Formación');
            var folderPath = '/es-es/formacion/lists/Valoracin formacin/Año ' + new Date().getFullYear() + '/' + item.get_item('Title');

            var camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml(
                '<View Scope="RecursiveAll"><Query><Where><And><Eq><FieldRef Name=\'Author\' LookupId="TRUE"/>' +
                '<Value Type=\'Lookup\'>' + _spPageContextInfo.userId + '</Value></Eq><Eq><FieldRef Name=\'FileDirRef\'/>' +
                '<Value Type=\'Text\'>' + folderPath + '</Value></Eq></And></Where></Query></View>'
            );

            var items = list.getItems(camlQuery);

            clientContext.load(items);

            clientContext.executeQueryAsync(
                Function.createDelegate(this, function () {
                    if (items.get_count() > 0) {
                        bootbox.alert('Ya ha contestado a esta encuesta.', function () {
                            window.location.href = '/' + _spPageContextInfo.currentCultureName
                        });
                    }
                }),
                Function.createDelegate(this, function (sender, args) {
                    console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                    //showErrorMessage("No se ha podido crear la solicitud");
                })
            );
        }),
        Function.createDelegate(this, function (sender, args) {
            console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
            //showErrorMessage("No se ha podido crear la solicitud");
        })
    );

}


function getCourse() {
    var courseId = getUrlParam("c");

    var clientContext = SP.ClientContext.get_current();

    var oList = clientContext.get_web().get_lists().getByTitle('Listado Cursos');
    var item = oList.getItemById(Number(courseId));

    clientContext.load(item, 'Title', 'ID');

    clientContext.executeQueryAsync(
        Function.createDelegate(this, function () {
            checkYearFolder("Año " + new Date().getFullYear(), item.get_item('Title'));
        }),
        Function.createDelegate(this, function (sender, args) {
            console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
            //showErrorMessage("No se ha podido crear la solicitud");
        })
    );
}

function checkYearFolder(year, course) {
    var folderName = '/es-es/formacion/lists/Valoracin%20formacin/' + year;

    var clientContext = SP.ClientContext.get_current();
    var list = clientContext.get_web().get_lists().getByTitle('Valoración Formación');
    var folder = clientContext.get_web().getFolderByServerRelativeUrl(folderName);

    clientContext.load(list);
    clientContext.load(folder, "Exists", "Name");

    clientContext.executeQueryAsync(
        function () {
            if (folder.get_exists()) {
                checkCourseFolder(year, course);
            }
            else {
                console.log("Folder exists but is hidden (security-trimmed) for us.");
            }
        },
        function (s, args) {
            if (args.get_errorTypeName() === "System.IO.FileNotFoundException") {
                var itemCreateInfo = new SP.ListItemCreationInformation();
                itemCreateInfo.set_underlyingObjectType(SP.FileSystemObjectType.folder);
                itemCreateInfo.set_leafName(year);

                var oListItem = list.addItem(itemCreateInfo);
                oListItem.set_item('Title', year);
                oListItem.update();

                clientContext.load(oListItem);
                clientContext.executeQueryAsync(
                    Function.createDelegate(this, function () {
                        console.log('Carpeta año creada');
                        checkCourseFolder(year, course);
                    }),
                    Function.createDelegate(this, function (sender, args) {
                        console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                        //showErrorMessage("No se ha podido crear la solicitud");
                    })
                );
            }
            else {
                // An unexpected error occurred.
                console.log("Error: " + args.get_message());
            }
        }
    );
}

function checkCourseFolder(year, course) {
    var yearFolder = '/es-es/formacion/lists/Valoracin formacin/' + year;
    var folderName = yearFolder + '/' + course;

    var clientContext = SP.ClientContext.get_current();
    var list = clientContext.get_web().get_lists().getByTitle('Valoración Formación');
    var folder = clientContext.get_web().getFolderByServerRelativeUrl(folderName);

    clientContext.load(list);
    clientContext.load(folder, "Exists", "Name");

    clientContext.executeQueryAsync(
        function () {
            if (folder.get_exists()) {
                createItems(folderName);
            }
            else {
                console.log("Folder exists but is hidden (security-trimmed) for us.");
            }
        },
        function (s, args) {
            if (args.get_errorTypeName() === "System.IO.FileNotFoundException") {
                var itemCreateInfo = new SP.ListItemCreationInformation();
                itemCreateInfo.set_folderUrl(yearFolder);
                itemCreateInfo.set_underlyingObjectType(SP.FileSystemObjectType.folder);
                itemCreateInfo.set_leafName(course);

                var oListItem = list.addItem(itemCreateInfo);
                oListItem.set_item('Title', course);
                oListItem.update(); 

                clientContext.load(oListItem);

                clientContext.executeQueryAsync(
                    Function.createDelegate(this, function () {
                        createItems(folderName);
                    }),
                    Function.createDelegate(this, function (sender, args) {
                        console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                        //showErrorMessage("No se ha podido crear la solicitud");
                    })
                );

            }
            else {
                // An unexpected error occurred.
                console.log("Error: " + args.get_message());
            }
        }
    );
}

function createItems(course) {

    var createItem = function (course, index) {
        if (index >= $('#course-survey [data-field="Title"]').length) {
            $('#sending').modal('toggle');
            bootbox.alert('Su encuesta se ha enviado correctamente.', function () {
                window.location.href = '/' + _spPageContextInfo.currentCultureName
            })
        }

        var questionElement = $($('#course-survey [data-field="Title"]')[index]);

        var question = $(questionElement).text();

        var clientContext = SP.ClientContext.get_current();
        var list = clientContext.get_web().get_lists().getByTitle('Valoración Formación');

        var camlQuery = new SP.CamlQuery();
        camlQuery.set_viewXml(
            '<View Scope="RecursiveAll"><Query><Where><And><Eq><FieldRef Name=\'Preguntas\'/>' +
            '<Value Type=\'Text\'>' + question + '</Value></Eq><Eq><FieldRef Name=\'FileDirRef\'/>' +
            '<Value Type=\'Text\'>' + course + '</Value></Eq></And></Where></Query></View>'
        );

        var items = list.getItems(camlQuery);

        clientContext.load(items, 'Include(Muy_x0020_bien,Bien,Poco,Mal)');

        clientContext.executeQueryAsync(
            Function.createDelegate(this, function () {
                if (items.get_count() == 0) {

                    var itemCreateInfo = new SP.ListItemCreationInformation();
                    itemCreateInfo.set_folderUrl(course);

                    var oListItem = list.addItem(itemCreateInfo);
                    oListItem.set_item('Preguntas', question);

                    var formGroup = $(questionElement).parent();
                    var radio = $(formGroup).find('input[type="radio"]:checked');
                    var fieldName = $(radio).data('field');

                    oListItem.set_item(fieldName, 1);

                    oListItem.update();

                    clientContext.load(oListItem);

                    clientContext.executeQueryAsync(
                        Function.createDelegate(this, function () {
                            console.log('item creado');
                            var currentIndex = index;
                            currentIndex += 1;
                            createItem(course, currentIndex);
                        }),
                        Function.createDelegate(this, function (sender, args) {
                            console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                            //showErrorMessage("No se ha podido crear la solicitud");
                        })
                    );
                }
                else {
                    var listItemEnumerator = items.getEnumerator();
                    while (listItemEnumerator.moveNext()) {
                        var formGroup = $(questionElement).parent();
                        var radio = $(formGroup).find('input[type="radio"]:checked');
                        var fieldName = $(radio).data('field');

                        var item = listItemEnumerator.get_current();
                        var currentFieldValue = item.get_item(fieldName);

                        currentFieldValue += 1;

                        item.set_item(fieldName, currentFieldValue);
                        item.update();

                        clientContext.executeQueryAsync(
                            Function.createDelegate(this, function () {
                                var currentIndex = index;
                                currentIndex += 1;
                                createItem(course, currentIndex);
                            }),
                            Function.createDelegate(this, function (sender, args) {
                                console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                                //showErrorMessage("No se ha podido crear la solicitud");
                            })
                        );
                    }
                }

            }),
            Function.createDelegate(this, function (sender, args) {
                console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                //showErrorMessage("No se ha podido crear la solicitud");
            })
        );
    }

    createItem(course, 0);
}