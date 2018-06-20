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

    var html = '<div class="row event-detail">';

    html += '<div class="col-8 event">';
    html += '   <h3 class="event-title">' + title + '</h3>';
    html += '   <p class="event-author"><img src="https://outlook.office365.com/owa/service.svc/s/GetPersonaPhoto?email=' + author["0"].email + '&UA=0&size=HR48x48&sc=1529465121474"/>' + author["0"].title + '</p>';
    html += '   <p class="event-description">' + description + '</p>';
    html += '   <a href="#" data-charlaid="' + id + '" data-aforo="' + aforo + '"class="float-right event-inscription hidden">Inscribirme</a><span data-charlaid="' + id + '"></span>';
    html += '</div>';
    html += '<div class="col">';
    html += '   <div class="row">';
    html += '       <div class="col">';
    html += '           <div class="row">';
    html += '               <div class="col event-date">';
    html += '                   <span class="icon-calendario"></span><span class="span-corrector">' + charlaDay + ' ' + charlaMonth + '</span>';
    html += '               </div>';
    html += '               <div class="col event-hour">';
    html += '                   <span class="icon-reloj"></span><span class="span-corrector">' + charlaTime + ' min.</span>';
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
            var aforo = $(this).data('aforo');
            var inscripciones = $(this).next().data('inscriciones');

            var clientContext = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);

            var oList = clientContext.get_web().get_lists().getByTitle('Inscripciones charlas');

            var itemCreateInfo = new SP.ListItemCreationInformation();
            var newItem = oList.addItem(itemCreateInfo);

            newItem.set_item('Charla', charlaId);
            newItem.set_item('ListaEspera', inscripciones >= aforo);
            newItem.update();

            clientContext.load(newItem);

            clientContext.executeQueryAsync(
                Function.createDelegate(this, function () {
                    if (inscripciones >= aforo)
                        showOkMessage("Tu inscripción se ha creado correctamente. <br/>El aforo está completo y se confirmará tu inscripción si se produce alguna baja.");
                    else
                        showOkMessage("Tu inscripción se ha creado correctamente");
                }),
                Function.createDelegate(this, function (sender, args) {
                    console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                    showErrorMessage("No se ha podido realizar la inscripción al curso. Si el problema persiste ponte en contacto con el administrador del sistema.");
                })
            );
        });
    });
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
                    if (!enEspera)
                        $(charla).parent().append('<span class="fg-green float-right">Inscrito</span>');
                    else
                        $(charla).parent().append('<span class="fg-orange float-right">En lista de espera</span>');

                    $(charla).remove();

                    if (callback != null)
                        callback();
                }
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