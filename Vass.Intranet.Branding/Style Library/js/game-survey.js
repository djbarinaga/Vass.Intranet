//NEW CHAT
(function ($) {
    $.fn.gamesurvey = function (options) {
        var $this = this;
        var gameSite = decodeURIComponent(getUrlParam('s'));
        var gameList = getUrlParam('n');
        var gameItem = getUrlParam('c');

        function getGameData() {
            var clientContext = new SP.ClientContext(gameSite);

            var oList = clientContext.get_web().get_lists().getByTitle(gameList);

            var item = oList.getItemById(Number(gameItem));

            clientContext.load(item, 'Title', 'Juego');

            clientContext.load(item);

            clientContext.executeQueryAsync(
                Function.createDelegate(this, function () {
                    $('#hdnGame').val(item.get_item('Title'));
                    $('#hdnGameModel').val(item.get_item('Juego'));
                    getMiniGame(item.get_item('Juego'));
                }),
                Function.createDelegate(this, function (sender, args) {
                    console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                })
            );
        }

        function getMiniGame(game) {
            var clientContext = SP.ClientContext.get_current();

            var oList = clientContext.get_web().get_lists().getByTitle('Juegos');

            var camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml(
                '<View><Query><Where><Eq><FieldRef Name=\'Juego\'/>' +
                '<Value Type=\'Lookup\'>' + game + '</Value></Eq></Where></Query>' +
                '<RowLimit>1</RowLimit></View>'
            );

            var gamesCollection = oList.getItems(camlQuery);

            clientContext.load(gamesCollection);

            clientContext.executeQueryAsync(
                Function.createDelegate(this, function () {
                    var listItemEnumerator = gamesCollection.getEnumerator();
                    while (listItemEnumerator.moveNext()) {
                        var oListItem = listItemEnumerator.get_current();
                        var survey = oListItem.get_item('Title');
                        $('#hdnMiniGame').val(survey);
                        checkResponses(survey);
                        getMiniGameQuestions(survey);
                        break;
                    }
                }),
                Function.createDelegate(this, function (sender, args) {
                    console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                })
            );
        }

        function checkResponses(miniGame) {
            var clientContext = SP.ClientContext.get_current();

            var oList = clientContext.get_web().get_lists().getByTitle(miniGame);

            var camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml(
                '<View><Query><Where><And><Eq><FieldRef Name=\'Partida\'/>' +
                '<Value Type=\'Text\'>' + $('#hdnGame').val() + '</Value></Eq><Eq><FieldRef Name=\'Author\' LookupId="TRUE"/>' +
                '<Value Type=\'Lookup\'><UserID/></Value></Eq></And></Where></Query>' +
                '<RowLimit>1</RowLimit></View>'
            );

            var responsesCollection = oList.getItems(camlQuery);

            clientContext.load(responsesCollection);

            clientContext.executeQueryAsync(
                Function.createDelegate(this, function () {
                    if (responsesCollection.get_count() == 0)
                        getMiniGameQuestions(miniGame);
                    else
                        showErrorMessage("Ya has realizado la valoración de esta charla", function () {
                            window.history.back();
                        });
                }),
                Function.createDelegate(this, function (sender, args) {
                    console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                })
            );
        }

        function getMiniGameQuestions(miniGame) {

            var clientContext = SP.ClientContext.get_current();

            var oList = clientContext.get_web().get_lists().getByTitle(miniGame);

            var listFields = oList.get_fields();

            clientContext.load(listFields);

            clientContext.executeQueryAsync(
                Function.createDelegate(this, function () {
                    var fieldEnumerator = listFields.getEnumerator();
                    while (fieldEnumerator.moveNext()) {
                        var oField = fieldEnumerator.get_current();
                        var fType = oField.get_fieldTypeKind();

                        if (fType === SP.FieldType.number) {
                            var minimunValue = parseInt(oField.get_minimumValue());
                            var maximunValue = parseInt(oField.get_maximumValue());

                            if (!isNaN(minimunValue) && !isNaN(maximunValue)) {
                                var html = '';

                                html += '<div class="row" data-command="question">';

                                html += '<div class="col-3"><span data-role="title">' + oField.get_title() + '</span></div>';

                                for (var i = minimunValue; i <= maximunValue; i++) {
                                    html += '<div class="col">';
                                    html += '   <div class="form-group form-check">';
                                    html += '       <input type="radio" name="' + oField.get_internalName() + '" class="form-check-input" id="radio' + i + '" value="' + i + '">';
                                    html += '       <label class="form-check-label" for="exampleCheck1">' + i + '</label>';
                                    html += '   </div>';
                                    html += '</div>';
                                }

                                html += '</div>';

                                $('#survey-questions').append(html);
                            }
                        }
                    }
                }),
                Function.createDelegate(this, function (sender, args) {
                    console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                })
            );
        }

        function getAverage() {
            var clientContext = SP.ClientContext.get_current();

            var oList = clientContext.get_web().get_lists().getByTitle($('#hdnMiniGame').val());

            var camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml(
                '<View><Query><Where><Eq><FieldRef Name=\'Partida\'/>' +
                '<Value Type=\'Text\'>' + $('#hdnGame').val() + '</Value></Eq></Where></Query></View>'
            );

            var responseCollection = oList.getItems(camlQuery);

            clientContext.load(responseCollection);

            clientContext.executeQueryAsync(
                Function.createDelegate(this, function () {
                    var listItemEnumerator = responseCollection.getEnumerator();
                    var average = 0;
                    while (listItemEnumerator.moveNext()) {
                        var oListItem = listItemEnumerator.get_current();

                        $($this).find('[data-command="question"]').each(function () {
                            var question = $(this).find('input[type="radio"]');
                            var fieldName = question.attr('name');

                            average += Number(oListItem.get_item(fieldName));
                        });
                    }

                    average = average / responseCollection.get_count();
                    getMiniGameScore(average);
                }),
                Function.createDelegate(this, function (sender, args) {
                    console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                })
            );
        }

        function getMiniGameScore(average) {
            var clientContext = SP.ClientContext.get_current();

            var oList = clientContext.get_web().get_lists().getByTitle('Puntuaciones variables');

            var camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml(
                '<View><Query><Where><Eq><FieldRef Name=\'Juego\'/>' +
                '<Value Type=\'Lookup\'>' + $('#hdnMiniGame').val() + '</Value></Eq></Where></Query></View>'
            );

            var scoreCollection = oList.getItems(camlQuery);

            clientContext.load(scoreCollection);

            clientContext.executeQueryAsync(
                Function.createDelegate(this, function () {
                    var minigameScore = new Array();

                    var listItemEnumerator = scoreCollection.getEnumerator();
                    while (listItemEnumerator.moveNext()) {
                        var oListItem = listItemEnumerator.get_current();
                        var score = {
                            minimun: oListItem.get_item('PuntuacionMinima'),
                            maximun: oListItem.get_item('PuntuacionMaxima'),
                            score: oListItem.get_item('Puntuacion'),
                        };

                        minigameScore.push(score);
                    }

                    console.log(minigameScore);

                    getGamer(average, minigameScore);
                }),
                Function.createDelegate(this, function (sender, args) {
                    console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                })
            );
        }

        function getGamer(average, minigameScore) {
            var clientContext = new SP.ClientContext(gameSite);

            var oList = clientContext.get_web().get_lists().getByTitle(gameList);

            var item = oList.getItemById(Number(gameItem));

            clientContext.load(item, 'Author');

            clientContext.load(item);

            clientContext.executeQueryAsync(
                Function.createDelegate(this, function () {
                    getGamerGames(item.get_item('Author'), average, minigameScore);
                }),
                Function.createDelegate(this, function (sender, args) {
                    console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                })
            );
        }

        function getGamerGames(gamer, average, minigameScore) {
            var clientContext = SP.ClientContext.get_current();

            var user = clientContext.get_web().getUserById(gamer.get_lookupId());

            clientContext.load(user);

            clientContext.executeQueryAsync(
                function () {
                    var login = user.get_loginName();
                    var peopleManager = new SP.UserProfiles.PeopleManager(clientContext);

                    var userProfileProperties = peopleManager.getPropertiesFor(login);

                    clientContext.load(userProfileProperties);

                    clientContext.executeQueryAsync(
                        Function.createDelegate(this, function () {
                            var properties = userProfileProperties.get_userProfileProperties();
                            var userGames = properties["Game"].split(';');
                            var userGameScore = properties["GameScore"].split(';');

                            setScore(gamer, userGames, userGameScore, minigameScore, average);
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

        function setScore(gamer, userGames, userScore, minigameScore, average) {
            //Verificamos si el usuario está jugando al juego
            var game = $('#hdnGameModel').val();
            var gameIndex = userGames.indexOf(game);
            var isNewGame = false;
            var gameScore = 0;

            for (var i = 0; i < minigameScore.length; i++) {
                var score = minigameScore[i];

                if (average >= score.minimun && average <= score.maximun) {
                    gameScore = score.score;
                    break;
                }
            }

            if (gameScore != 0) {
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

                var clientContext = SP.ClientContext.get_current();

                var user = clientContext.get_web().getUserById(gamer.get_lookupId());

                clientContext.load(user);

                clientContext.executeQueryAsync(
                    function () {
                        var login = user.get_loginName();

                        var peopleManager = new SP.UserProfiles.PeopleManager(clientContext);

                        var userProfileProperties = peopleManager.getPropertiesFor(login);

                        peopleManager.setMultiValuedProfileProperty(login, "Game", userGames);
                        peopleManager.setMultiValuedProfileProperty(login, "GameScore", userScore);

                        clientContext.executeQueryAsync(
                            Function.createDelegate(this, function () {
                                showOkMessage('Tu valoración se ha enviado correctamente');
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
        }

        function getInscriptions() {
            var clientContext = new SP.ClientContext(gameSite);

            var oList = clientContext.get_web().get_lists().getByTitle('Inscripciones charlas');

            var camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml(
                '<View><Query><Where><Eq><FieldRef Name=\'Charla\'/>' +
                '<Value Type=\'Lookup\'>' + $('#hdnGame').val() + '</Value></Eq></Where></Query></View>'
            );

            var inscripciones = oList.getItems(camlQuery);

            clientContext.load(inscripciones);

            clientContext.executeQueryAsync(
                Function.createDelegate(this, function () {
                    getResponses(inscripciones.get_count());
                }),
                Function.createDelegate(this, function (sender, args) {
                    console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                })
            );
        }

        function getResponses(inscriptions) {
            var clientContext = SP.ClientContext.get_current();

            var oList = clientContext.get_web().get_lists().getByTitle($('#hdnMiniGame').val());

            var camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml(
                '<View><Query><Where><Eq><FieldRef Name=\'Partida\'/>' +
                '<Value Type=\'Text\'>' + $('#hdnGame').val() + '</Value></Eq></Where></Query></View>'
            );

            var responses = oList.getItems(camlQuery);

            clientContext.load(responses);

            clientContext.executeQueryAsync(
                Function.createDelegate(this, function () {
                    var count = responses.get_count();

                    if (count == inscriptions) {
                        getAverage();
                    }
                    else {
                        showOkMessage('Tu valoración se ha enviado correctamente');
                    }
                }),
                Function.createDelegate(this, function (sender, args) {
                    console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                })
            );
        }

        $(this).find('#btnCancel').on('click', function () {
            window.history.back();
        });

        $(this).find('#btnOk').on('click', function () {
            var clientContext = SP.ClientContext.get_current();

            var oList = clientContext.get_web().get_lists().getByTitle($('#hdnMiniGame').val());

            var itemCreateInfo = new SP.ListItemCreationInformation();
            var item = oList.addItem(itemCreateInfo);

            $($this).find('[data-command="question"]').each(function () {
                var question = $(this).find('input[type="radio"]');
                var fieldName = question.attr('name');
                var fieldValue = $(this).find('input[type="radio"]:checked').val();

                item.set_item(fieldName, fieldValue);
            });

            item.set_item('Partida', $('#hdnGame').val())
            
            item.update();

            clientContext.load(item);

            clientContext.executeQueryAsync(
                Function.createDelegate(this, function () {
                    getInscriptions();
                    //showOkMessage("Tu valoración se ha enviado correctamente");
                }),
                Function.createDelegate(this, function (sender, args) {
                    console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                    showErrorMessage("No se ha podido crear la solicitud");
                })
            );
        });

        getGameData();
    };
}(jQuery));

$(document).ready(function () {
    $('#game-survey').gamesurvey();
});

function showOkMessage(msg) {
    bootbox.alert(msg, function () {
        window.location.href = '/';
    });
}

function showErrorMessage(msg, callback) {
    bootbox.alert(msg, function () {
        if (callback == null)
            window.history.back();
        else
            callback();
    });
}