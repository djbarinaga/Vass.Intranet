//NEW CHAT
(function ($) {
    $.fn.chat = function (options) {
        var $this = this;

        $(this).find('#btnOk').on('click', function () {
            var chatName = $('#txtNombreCharla').val();
            var chatDescription = $('#txtDescripcionCharla').val();
            var chatDate = $('#txtFechaCharla').val();
            var chatTime = $('#txtTiempoCharla').val();

            var date = new Date(chatDate);

            var clientContext = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);

            var oList = clientContext.get_web().get_lists().getByTitle('Charlas');

            var itemCreateInfo = new SP.ListItemCreationInformation();
            gameItem = oList.addItem(itemCreateInfo);

            gameItem.set_item('Title', chatName);
            gameItem.set_item('Descripcion', chatDescription);
            gameItem.set_item('Fecha_x0020_de_x0020_Realizacion', date);
            gameItem.set_item('Tiempo', chatTime);
            gameItem.update();

            clientContext.load(gameItem);

            clientContext.executeQueryAsync(
                Function.createDelegate(this, function () {
                    showOkMessage("Tu solicitud se ha creado correctamente");
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
        setContext(variables.clientId.Graph);

        var $this = this;
        var charlaId = getUrlParam('c');
        var gamesCollection;

        $(this).find('#btnCancel').on('click', function () {
            window.history.back();
        });

        //EDICIÓN DE CHARLA
        $(this).find('#btnOk').on('click', function () {
            $(this).prop('disabled', 'disabled');

            var clientContext = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);

            var oList = clientContext.get_web().get_lists().getByTitle('Charlas');
            var item = oList.getItemById(Number(charlaId));

            clientContext.load(item, 'Title', 'Author');

            clientContext.executeQueryAsync(
                Function.createDelegate(this, function () {
                    var game = item.get_item('Title');
                    var user = item.get_item('Author');

                    editGame(game, user);
                }),
                Function.createDelegate(this, function (sender, args) {
                    console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                    //showErrorMessage("No se ha podido crear la solicitud");
                })
            );
        });

        function editGame(game, user) {
            var room = $('#roomSelect').val();
            var aforo = $('#txtAforo').val();

            var clientContext = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);

            var oList = clientContext.get_web().get_lists().getByTitle('Charlas');
            var item = oList.getItemById(Number(charlaId));

            item.set_item('Lugar_x0020_de_x0020_Realizacion', room);
            item.set_item('Aforo', Number(aforo));

            if ($('#chkAprobar').is(':checked'))
                item.set_item('Estado_x0020_de_x0020_la_x0020_C', 'Confirmada');

            if ($('#chkFinalizado').is(':checked'))
                item.set_item('Estado_x0020_de_x0020_la_x0020_C', 'Realizada');

            item.update();

            clientContext.executeQueryAsync(
                Function.createDelegate(this, function () {
                    if ($('#chkFinalizado').is(':checked')) //Se asigna la puntuación al usuario
                        getGames(game, user);
                    else
                        showOkMessage('La charla se ha modificado correctamente');
                }),
                Function.createDelegate(this, function (sender, args) {
                    console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                    //showErrorMessage("No se ha podido crear la solicitud");
                })
            );
        }
        //FIN EDICIÓN

        //SALAS
        var endpoint = "/me/findRooms";

        execute({
            clientId: variables.clientId.Graph,
            version: "beta",
            endpoint: endpoint,
            type: "GET",
            callback: setRooms
        });

        function setRooms(data) {
            var results = data.value;
            var length = results.length;
            for (var i = 0; i < length; i++) {
                var room = results[i];

                $('#roomSelect').append($('<option>', {
                    value: room.name,
                    text: room.name
                }));
            }
        }
        //FIN SALAS

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