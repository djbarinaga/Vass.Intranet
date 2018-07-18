//NEW CHAT
(function ($) {
    $.fn.chat = function (options) {
        var $this = this;
        populateHours('#hourSelect');
        populateHours('#hourEndSelect');

        $(this).find('#btnOk').on('click', function () {
            var chatName = $('#txtNombreCharla').val();
            var chatDescription = $('#txtDescripcionCharla').val();
            var chatDate = $('#txtFechaCharla').val();
            var chatEndHours = $('#hourEndSelect').val();
            var chatHours = $('#hourSelect').val();

            var chatSplit = chatDate.split('/');
            var chatDay = Number(chatSplit[0]);
            var chatMonth = Number(chatSplit[1]);
            var chatYear = Number(chatSplit[2]);
            var chatHour = chatHours.split(':')[0];
            var chatMinutes = chatHours.split(':')[1];

            var chatEndHour = chatEndHours.split(':')[0];
            var charEndMinutes = chatEndHours.split(':')[1];

            var date = new Date(chatYear, chatMonth - 1, chatDay, chatHour, chatMinutes);
            var endDate = new Date(chatYear, chatMonth - 1, chatDay, chatEndHour, charEndMinutes);

            var clientContext = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);

            var oList = clientContext.get_web().get_lists().getByTitle('Charlas');

            var itemCreateInfo = new SP.ListItemCreationInformation();
            gameItem = oList.addItem(itemCreateInfo);

            gameItem.set_item('Title', chatName);
            gameItem.set_item('Descripcion', chatDescription);
            gameItem.set_item('Fecha_x0020_de_x0020_Realizacion', date);
            gameItem.set_item('Fecha_x0020_de_x0020_Finalizacio', endDate);
            gameItem.update();

            clientContext.load(gameItem);

            clientContext.executeQueryAsync(
                Function.createDelegate(this, function () {
                    showOkMessage("Tu solicitud se ha creado correctamente", function () {
                        window.location.href = 'mis-charlas.aspx';
                    });
                }),
                Function.createDelegate(this, function (sender, args) {
                    console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                    showErrorMessage("No se ha podido crear la solicitud");
                })
            );
        });

        $(this).find('#btnCancel').on('click', function () {
            window.history.back();
        });
    };
}(jQuery));

//EDIT CHAT
(function ($) {
    $.fn.editChat = function (options) {
        var $this = this;
        var charlaId = getUrlParam('c');
        var gamesCollection;

        loadCharla();

        $(this).find('#btnCancel').on('click', function () {
            window.history.back();
        });

        //EDICIÓN DE CHARLA
        $(this).find('#btnOk').on('click', function () {
            $(this).prop('disabled', 'disabled');

            var clientContext = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);

            var oList = clientContext.get_web().get_lists().getByTitle('Charlas');
            var item = oList.getItemById(Number(charlaId));

            item.set_item('Estado_x0020_de_x0020_la_x0020_C', 'Confirmada');

            item.update();
        });

        $(this).find('#btnReject').on('click', function () {
            bootbox.prompt("Introduzca el motivo del rechazo:", function (result) {
                var clientContext = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);

                var oList = clientContext.get_web().get_lists().getByTitle('Charlas');
                var item = oList.getItemById(Number(charlaId));

                item.set_item('Estado_x0020_de_x0020_la_x0020_C', 'Rechazada');
                item.set_item('Comentarios', result);

                item.update();

                clientContext.executeQueryAsync(
                    Function.createDelegate(this, function () {
                        bootbox.alert('Los cambios se han guardado correctamente', function () {
                            window.location.href = "https://grupovass.sharepoint.com/es-es/businessvalue";
                        });
                    }),
                    Function.createDelegate(this, function (sender, args) {
                        console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                        bootbox.alert('No se han podido guardar los cambios');
                    })
                );
            })
            
        });

        function loadCharla() {
            var clientContext = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);

            var oList = clientContext.get_web().get_lists().getByTitle('Charlas');
            var item = oList.getItemById(Number(charlaId));

            clientContext.load(item, 'Title', 'Descripcion', 'Author', 'Fecha_x0020_de_x0020_Realizacion', 'Lugar_x0020_de_x0020_Realizacion', 'Aforo', 'Estado_x0020_de_x0020_la_x0020_C');

            clientContext.executeQueryAsync(
                Function.createDelegate(this, function () {
                    var date = new Date(item.get_item('Fecha_x0020_de_x0020_Realizacion'));
                    $('#page-title').text(item.get_item('Title'));

                    $('[data-field="Fecha"]').text(date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear());

                    $('[data-field="Hora"]').text(date.getHours() + ':' + date.getMinutes());

                    $('#txtStatus').text(item.get_item('Estado_x0020_de_x0020_la_x0020_C'));

                    $('[data-field="Descripcion"]').text(item.get_item('Descripcion'));

                    var author = item.get_item('Author');
                    $('[data-field="Author"]').text(author.get_lookupValue());

                    if (item.get_item('Estado_x0020_de_x0020_la_x0020_C') != 'Propuesta')
                        $('#wizard-buttons').remove();
                }),
                Function.createDelegate(this, function (sender, args) {
                    console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                    //showErrorMessage("No se ha podido crear la solicitud");
                })
            );
        }

        function editGame(game, user) {
            var clientContext = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);

            var oList = clientContext.get_web().get_lists().getByTitle('Charlas');
            var item = oList.getItemById(Number(charlaId));

            item.set_item('Estado_x0020_de_x0020_la_x0020_C', 'Confirmada');

            item.update();
        }
        //FIN EDICIÓN

        function sendSurvey(game) {
            var clientContext = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);
            var oList = clientContext.get_web().get_lists().getByTitle('Inscripciones charlas');

            var camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml(
                '<View><Query><Where><Eq><FieldRef Name=\'Charla\'/>' +
                '<Value Type=\'Lookup\'>' + game + '</Value></Eq></Where></Query></View>'
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
                            var charlaTitle = lookup.get_lookupValue();

                            var url = "https://grupovass.sharepoint.com/es-es/businessvalue/gaming/Paginas/valorar-partida.aspx?s=" + _spPageContextInfo.webServerRelativeUrl + "&n=Charlas&c=" + lookup.get_lookupId();

                            clientContext.executeQueryAsync(
                                Function.createDelegate(this, function () {
                                    var body = '';
                                    body += '<p>A continuación te enviamos una encuesta para valorar la charla ' + game + '</p>';
                                    body += '<a href="' + url + '">Encuesta</a>';

                                    sendEmail('no-reply@sharepointonline.com', email, body, "Encuesta sobre la charla " + game);
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

        //ASIGNACIÓN DE PUNTOS
        function getGames(game, user) {
            var clientContext = SP.ClientContext.get_current();

            var user = clientContext.get_web().getUserById(user.get_lookupId());

            clientContext.load(user);

            clientContext.executeQueryAsync(
                function () {
                    var login = user.get_loginName();
                    var peopleManager = new SP.UserProfiles.PeopleManager(clientContext);

                    var userProfileProperties = peopleManager.getPropertiesFor(login);

                    clientContext.load(userProfileProperties);

                    clientContext.executeQueryAsync(
                        Function.createDelegate(this, function () {
                            getAssignedGame(game, user, userProfileProperties);
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

        function getAssignedGame(game, user, userProfileProperties) {
            var login = user.get_loginName();
            var properties = userProfileProperties.get_userProfileProperties();
            var userGames = properties["Game"].split(';');
            var userGameScore = properties["GameScore"].split(';');

            var clientContext = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);

            var oList = clientContext.get_web().get_lists().getByTitle('Charlas');
            var item = oList.getItemById(Number(charlaId));

            clientContext.load(item, 'Title', 'Juego');

            clientContext.executeQueryAsync(
                Function.createDelegate(this, function () {
                    var assignedGame = item.get_item('Juego');
                    getGameData(login, assignedGame, userGames, userGameScore);
                }),
                Function.createDelegate(this, function (sender, args) {
                    console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                    //showErrorMessage("No se ha podido crear la solicitud");
                })
            );
        }

        function getGameData(login, assignedGame, userGames, userGameScore) {
            var clientContext = new SP.ClientContext('https://grupovass.sharepoint.com/es-es/businessvalue/gaming');

            var oList = clientContext.get_web().get_lists().getByTitle('Juegos');

            var camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml(
                '<View><Query><Where><Eq><FieldRef Name=\'Title\'/>' +
                '<Value Type=\'Text\'>' + assignedGame + '</Value></Eq></Where></Query>' +
                '<RowLimit>1</RowLimit></View>'
            );

            gamesCollection = oList.getItems(camlQuery);

            clientContext.load(gamesCollection);

            clientContext.executeQueryAsync(
                Function.createDelegate(this, function () {
                    var defaultScore = 0;
                    var listItemEnumerator = gamesCollection.getEnumerator();
                    while (listItemEnumerator.moveNext()) {
                        var oListItem = listItemEnumerator.get_current();
                        defaultScore = oListItem.get_item('Puntuacion');
                        break;
                    }

                    setGameScore(login, assignedGame, defaultScore, userGames, userGameScore);
                }),
                Function.createDelegate(this, function (sender, args) {
                    console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                    //showErrorMessage("No se ha podido crear la solicitud");
                })
            );
        }

        function setGameScore(login, game, gameScore, userGames, userScore) {
            //Verificamos si el usuario está jugando al juego
            var gameIndex = userGames.indexOf(game);
            var isNewGame = false;

            if (gameIndex == -1) {
                userGames.push(game);
                gameIndex = userGames.indexOf(game);
                isNewGame = true;
            }

            //Obtenemos la puntuación asignada al juego
            if (isNewGame)
                userScore.push(gameScore);
            else {
                var currentScore = userScore[gameIndex];
                if (currentScore == "")
                    currentScore = 0;

                currentScore = Number(currentScore);

                currentScore += Number(gameScore);

                userScore[gameIndex] = currentScore;
            }

            

            var clientContext = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);
            var peopleManager = new SP.UserProfiles.PeopleManager(clientContext);

            var userProfileProperties = peopleManager.getPropertiesFor(login);

            peopleManager.setMultiValuedProfileProperty(login, "Game", userGames);
            peopleManager.setMultiValuedProfileProperty(login, "GameScore", userScore);

            clientContext.executeQueryAsync(
                Function.createDelegate(this, function () {
                    showOkMessage('La charla se ha modificado correctamente');
                }),
                Function.createDelegate(this, function (sender, args) {
                    console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                    //showErrorMessage("No se ha podido crear la solicitud");
                }));
        }
        //FIN ASIGNACIÓN DE PUNTOS
    };
}(jQuery));

$(document).ready(function () {
    $('#nueva-charla').chat();

    $('#editar-charla').editChat();
});

function showOkMessage(msg, callback) {
    bootbox.alert(msg, function () {
        if (callback == null)
            window.location.reload();
        else {
            callback();
        }
    });
}

function showErrorMessage(msg) {
    bootbox.alert(msg, function () {
        window.history.back();
    });
}