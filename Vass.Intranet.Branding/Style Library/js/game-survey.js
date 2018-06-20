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
                    $('#hdnGame').val(item.get_item('Juego'));
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
                        getMiniGameQuestions(survey);
                        break;
                    }
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
                                    html += '       <input type="radio" name="' + oField.get_internalName() + '" class="form-check-input" id="radio' + i + '">';
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

        getGameData();
    };
}(jQuery));

$(document).ready(function () {
    $('#game-survey').gamesurvey();
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