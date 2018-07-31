(function () {

    var charlaContext = {};
    charlaContext.Templates = {};

    charlaContext.Templates.Header = '<div id="charlas" class="events">';
    charlaContext.Templates.Footer = pagingControl;
    charlaContext.Templates.Item = charlaTemplate;
    charlaContext.OnPostRender = charlasPostRender;

    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(charlaContext);

})();

function charlaTemplate(ctx) {
    var months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    var title = ctx.CurrentItem["Title"];
    var id = ctx.CurrentItem["ID"];
    var description = ctx.CurrentItem["Descripcion"];
    var location = ctx.CurrentItem["Lugar_x0020_de_x0020_Realizacion"];
    var charlaStartDate = ctx.CurrentItem["Fecha_x0020_de_x0020_Realizacion"];
    var aforo = ctx.CurrentItem["Aforo"];
    var charlaTime = ctx.CurrentItem["Tiempo"];
    var author = ctx.CurrentItem["Author"];

    var charlaDateParts = charlaStartDate.split('/');
    var charlaDay = charlaDateParts[0];
    var charlaMonthNumber = Number(charlaDateParts[1]) - 1;
    var charlaMonth = months[charlaMonthNumber];
    charlaMonth = charlaMonth.substring(0, 3);
    var charlaEndDate = ctx.CurrentItem["Fecha_x0020_de_x0020_Finalizacio"];
	var charlaStartHour = charlaStartDate.split(' ')[1];

    var charlaEnd = charlaEndDate.split(' ');
    var charlaEndHour = charlaEnd[1];

    var html = '<div class="row event-detail" data-aos="fade-up" data-aos-once="true">';

    html += '<div class="col-8 event">';
    html += '   <h3 class="event-title">' + title + '</h3>';
    html += '   <p class="event-author"><img src="https://outlook.office365.com/owa/service.svc/s/GetPersonaPhoto?email=' + author["0"].email + '&UA=0&size=HR48x48&sc=1529465121474"/>' + author["0"].title + '</p>';
    html += '   <p class="event-description">' + description + '</p>';
    html += '   <a href="#" data-time="' + charlaTime + '" data-location="' + location + '" data-title="' + title + '" data-charlaid="' + id + '" data-aforo="' + aforo + '" data-date="' + charlaStartDate+ '" class="float-right event-inscription hidden">Inscribirme</a><span data-charlaid="' + id + '"></span>';
    html += '</div>';
    html += '<div class="col">';
    html += '   <div class="row">';
    html += '       <div class="col">';
    html += '           <div class="row">';
    html += '               <div class="col event-date">';
    html += '                   <span class="icon-calendario"></span><span class="span-corrector">' + charlaDay + ' ' + charlaMonth + ' ' + charlaStartDate.split(' ')[1]; + '</span>';
    html += '               </div>';
    html += '               <div class="col event-hour">';
    html += '                   <span class="icon-reloj"></span><span class="span-corrector">' + charlaStartHour + '-' + charlaEndHour + ' min.</span>';
    html += '               </div>';
    html += '           </div>';
    html += '       </div>';
    html += '   </div>';
    html += '   <div class="row">';
    html += '       <div class="col event-location">';
    html += '           <span class="icon-location"></span>' + location + '<br/><span>Aforo: </span>' + aforo + ' personas';
    html += '       </div>';
    html += '   </div>';
    html += '</div>';

    html += '</div>';

    return html;
}

function pagingControl(ctx) {
    var firstRow = ctx.ListData.FirstRow;
    var lastRow = ctx.ListData.LastRow;
    var prev = ctx.ListData.PrevHref;
    var next = ctx.ListData.NextHref;

    var html = '</div>';

    if (prev || next) {
        html += "<div class='paging'>";
        html += prev ? "<a href='" + prev + "'><span class='icon-izquierda'></span></a>" : "";
        html += "<span class='ms-paging'><span class='First'>" + firstRow + "</span> - <span class='Last'>" + lastRow + "</span></span>";
        html += next ? "<a href='" + next + "'><span class='icon-derecha'></a>" : "";
        html += "</div>";
    }



    return html;
}

function charlasPostRender(ctx) {
    var charlas = $('#charlas a[data-charlaid]');
    var users = $('#charlas [data-uid]');

    checkInscription(charlas, 0);

    checkAforo(charlas, 0);

    //getUser(users, 0);

    $('#charlas a[data-charlaid]').each(function () {
        $(this).on('click', function () {
            var charlaId = $(this).data('charlaid');
            var charlaDate = $(this).data('date');
            var charlaTitle = $(this).data('title');
            var charlaTime = $(this).data('time');
            var charlaLocation = $(this).data('location');
            var inscription = $(this).data('inscription');
            var aforo = $(this).data('aforo');
            var inscripciones = $(this).next().data('inscriciones');
            var clientContext = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);
            var oList = clientContext.get_web().get_lists().getByTitle('Inscripciones charlas');

            if ($(this).data('command') != 'delete') {

                var itemCreateInfo = new SP.ListItemCreationInformation();
                var newItem = oList.addItem(itemCreateInfo);

                newItem.set_item('Charla', charlaId);3
                newItem.set_item('ListaEspera', inscripciones >= aforo);
                newItem.update();

                clientContext.load(newItem);

                clientContext.executeQueryAsync(
                    Function.createDelegate(this, function () {
                        if (inscripciones >= aforo)
                            showOkMessage("Tu inscripción se ha creado correctamente. <br/>El aforo está completo y se confirmará tu inscripción si se produce alguna baja.");
                        else {
                            createCalendarEvent(charlaDate, charlaTitle, charlaLocation, charlaTime);
                        }
                    }),
                    Function.createDelegate(this, function (sender, args) {
                        console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                        showErrorMessage("No se ha podido realizar la inscripción al curso. Si el problema persiste ponte en contacto con el administrador del sistema.");
                    })
                );
            }
            else {
                bootbox.confirm("¿Deseas darte de baja de la charla " + charlaTitle + "?", function (result) {
                    if (result) {
                        var inscriptionItem = oList.getItemById(inscription);
                        inscriptionItem.deleteObject();

                        clientContext.executeQueryAsync(
                            Function.createDelegate(this, function () {
                                setEnEspera();
                            }),
                            Function.createDelegate(this, function (sender, args) {
                                console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                                showErrorMessage("No se ha podido realizar la inscripción al curso. Si el problema persiste ponte en contacto con el administrador del sistema.");
                            })
                        );
                    }
                });
            }
        });
    });
}

function createCalendarEvent(date, title, location, time) {
    setContext(variables.clientId.Graph);

    var dateSplit = date.split(' ');
    var eventDate = toDate(dateSplit[0], dateSplit[1]);

    var endDate = new Date(eventDate);
    endDate.setMinutes(eventDate.getMinutes() + Number(time));

    var event = {
        "subject": title,
        "start": {
            "dateTime": eventDate.toISOString(),
            "timeZone": "UTC"
        },
        "end": {
            "dateTime": endDate.toISOString(),
            "timeZone": "UTC"
        },
        "location": {
            "displayName": location
        }
    }

    execute({
        clientId: variables.clientId.Graph,
        version: "v1.0",
        endpoint: "/me/events",
        type: "POST",
        data: event,
        callback: function (result) {
            bootbox.alert("Tu inscripción se ha creado correctamente", function () {
                window.location.reload();
            });
        }
    })
}

function setEnEspera() {
    var clientContext = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);

    var oList = clientContext.get_web().get_lists().getByTitle('Inscripciones charlas');

    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml(
        '<View><Query><Where><Eq><FieldRef Name=\'ListaEspera\' />' +
        '<Value Type="Boolean">1</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>'
    );

    var items = oList.getItems(camlQuery);

    clientContext.load(items);

    clientContext.executeQueryAsync(
        Function.createDelegate(this, function () {
            if (items.get_count() > 0) {
                var listItemEnumerator = items.getEnumerator();
                while (listItemEnumerator.moveNext()) {
                    var item = listItemEnumerator.get_current();

                    var user = item.get_item('Author');
                    var email = user.get_email();
                    var lookup = item.get_item('Charla');
                    var charlaTitle = lookup.get_lookupValue()

                    item.set_item('ListaEspera', 0);
                    item.update();

                    clientContext.executeQueryAsync(
                        Function.createDelegate(this, function () {
                            sendEmail('no-reply@sharepointonline.com', email, 'Se ha producido una baja en la charla ' + charlaTitle + ' por lo que se ha realizado tu inscripción.', 'Inscripción en ' + charlaTitle, function () {
                                showOkMessage("Tu inscripción se ha dado de baja correctamente.");
                            });
                        }),
                        Function.createDelegate(this, function (sender, args) {
                            console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                        })
                    );

                    break;
                }
            }
            else {
                showOkMessage("Tu inscripción se ha dado de baja correctamente.");
            }
        }),
        Function.createDelegate(this, function (sender, args) {
            console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
        })
    );
}

function checkAforo(charlas, index) {
    if (index == charlas.length)
        return;

    var charla = $(charlas[index])
    var id = charla.data('charlaid');

    var clientContext = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);

    var oList = clientContext.get_web().get_lists().getByTitle('Inscripciones charlas');

    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml(
        '<View><Query><Where><Eq><FieldRef Name=\'Charla\' LookupId="TRUE" />' +
        '<Value Type=\'Lookup\'>' + id + '</Value></Eq></Where></Query></View>'
    );

    var items = oList.getItems(camlQuery);

    clientContext.load(items);

    clientContext.executeQueryAsync(
        Function.createDelegate(this, function () {
            if (items.get_count() > 0) {
                $(charla).next().text("Inscripciones: " + items.get_count());
                $(charla).next().attr("data-inscriciones", items.get_count());
            }

            $(charla).removeClass('hidden');

            var currentIndex = index;
            currentIndex += 1;
            checkAforo(charlas, currentIndex);
        }),
        Function.createDelegate(this, function (sender, args) {
            console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
        })
    );
}

function checkInscription(charlas, index, callback) {
    if (index == charlas.length)
        return;

    var charla = $(charlas[index])
    var id = charla.data('charlaid');

    var clientContext = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);

    var oList = clientContext.get_web().get_lists().getByTitle('Inscripciones charlas');

    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml(
        '<View><Query><Where><And><Eq><FieldRef Name=\'Charla\' LookupId="TRUE" />' +
        '<Value Type=\'Lookup\'>' + id + '</Value></Eq><Eq><FieldRef Name=\'Author\' LookupId="TRUE" />' +
        '<Value Type=\'Lookup\'>' + _spPageContextInfo.userId + '</Value></Eq></And></Where></Query><RowLimit>1</RowLimit></View>'
    );

    var items = oList.getItems(camlQuery);

    clientContext.load(items);

    clientContext.executeQueryAsync(
        Function.createDelegate(this, function () {
            if (items.get_count() > 0) {
                var listItemEnumerator = items.getEnumerator();
                while (listItemEnumerator.moveNext()) {
                    var oListItem = listItemEnumerator.get_current();
                    var enEspera = oListItem.get_item('ListaEspera');
                    if (!enEspera) {
                        $(charla).text('Borrarme').attr('data-command', 'delete');
                        $(charla).attr('data-inscription', oListItem.get_item('ID'));
                    }
                    else
                        $(charla).parent().append('<span class="fg-orange float-right">En lista de espera</span>');
                }

                var currentIndex = index;
                currentIndex += 1;
                checkInscription(charlas, currentIndex);
            }

            var currentIndex = index;
            currentIndex += 1;
            checkAforo(charlas, currentIndex);
        }),
        Function.createDelegate(this, function (sender, args) {
            console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
        })
    );
}

function getUser(users, index) {
    if (index == users.length)
        return;

    var clientContext = SP.ClientContext.get_current();

    var userId = $(users[index]).data('uid');

    var user = clientContext.get_web().getUserById(userId);

    clientContext.load(user);

    clientContext.executeQueryAsync(
        function () {
            var login = user.get_loginName();

            var peopleManager = new SP.UserProfiles.PeopleManager(clientContext);
            var userProfileProperties = peopleManager.getPropertiesFor(login);

            clientContext.load(userProfileProperties);

            clientContext.executeQueryAsync(
                Function.createDelegate(this, function () {
                    
                    var image = userProfileProperties.get_userProfileProperties().PictureURL;

                    if (image != null && image != '')
                        $(users[index]).prepend('<img src="' + image + '"/>');

                    var currentIndex = index;
                    currentIndex += 1;
                    getUser(users, currentIndex);
                }),
                Function.createDelegate(this, function (sender, args) {
                    console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                    //showErrorMessage("No se ha podido crear la solicitud");
                }));
        },
        function (sender, args) {
            console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
        }
    );
}

function showOkMessage(msg) {
    bootbox.alert(msg, function () {
        window.location.reload();
    });
}

function showErrorMessage(msg) {
    bootbox.alert(msg, function () {
        window.history.back();
    });
}