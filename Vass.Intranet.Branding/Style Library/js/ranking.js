﻿
(function ($) {
    $.fn.ranking = function (options) {
        var users = [];
        var gameGroups = [];
        var $this = this;

        this.empty();

        function getGameGroups() {
            var clientContext = new SP.ClientContext('https://grupovass.sharepoint.com/es-es/businessvalue/gaming');

            var oList = clientContext.get_web().get_lists().getByTitle('Clasificación');

            var camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml(
                '<View><Query><Where><Eq><FieldRef Name=\'JuegoPadre\'/>' +
                '<Value Type=\'Lookup\'>Juego de tronos</Value></Eq></Where><OrderBy><FieldRef Name="PuntuacionMinima" Ascending="False"/></OrderBy></Query></View>'
            );

            var groupCollection = oList.getItems(camlQuery);

            clientContext.load(groupCollection);

            clientContext.executeQueryAsync(
                Function.createDelegate(this, function () {
                    var defaultScore = 0;
                    var listItemEnumerator = groupCollection.getEnumerator();
                    while (listItemEnumerator.moveNext()) {
                        var oListItem = listItemEnumerator.get_current();
                        var title = oListItem.get_item('Title');
                        var image = oListItem.get_item('Imagen').get_url();
                        var description = oListItem.get_item('Descripcion');
                        var minimun = oListItem.get_item('PuntuacionMinima');
                        var maximun = oListItem.get_item('PuntuacionMaxima');

                        var gameGroup = {
                            title: title,
                            description: description,
                            image: image,
                            minimun: minimun,
                            maximun: maximun
                        }

                        gameGroups.push(gameGroup);
                    }

                    renderRanking();
                }),
                Function.createDelegate(this, function (sender, args) {
                    console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                    //showErrorMessage("No se ha podido crear la solicitud");
                })
            );
        }

        function getUsers() {
            var url = "https://grupovass.sharepoint.com/_api/search/query?querytext='Game:tronos'&rowlimit=3000&selectproperties='WorkEmail,Game%2cGameScore%2cPictureURL%2cPreferredName'&sourceid='b09a7990-05ea-4af9-81ef-edfab16c4e31'";

            var $ajax = $.ajax({
                url: url,
                type: "GET",
                dataType: "json",
                headers: {
                    Accept: "application/json;odata=verbose"
                }
            });

            $ajax.done(function (data, textStatus, jqXHR) {
                var results = data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results; 
                for (var i = 0; i < results.length; i++) {
                    var result = results[i];
                    var fields = result.Cells.results;
                    var title = getValue(fields, 'PreferredName');
                    var email = getValue(fields, 'WorkEmail');
                    var picture = getValue(fields, 'PictureURL');
                    var gameScore = getValue(fields, 'GameScore');

                    if (gameScore != null) {
                        var user = {
                            name: title,
                            picture: '/_layouts/15/userphoto.aspx?size=L&accountname=' + email,
                            score: gameScore
                        }

                        users.push(user);
                    }
                }

                users.sort(function (a, b) {
                    return b.score - a.score;
                });

                getGameGroups();
            });
        }

        function renderRanking() {

            var ranking = [];

            for (var i = 0; i < gameGroups.length; i++) {
                var gameGroup = gameGroups[i];

                var newRanking = {
                    group: gameGroup,
                    users: []
                }

                for (var j = 0; j < users.length; j++) {
                    var user = users[j];
                    if (user.score >= gameGroup.minimun && (user.score <= gameGroup.maximun || gameGroup.maximun == null)) {
                        newRanking.users.push(user);
                    }
                }

                ranking.push(newRanking);
            }

            for (var i = 0; i < ranking.length; i++) {
                var currentRanking = ranking[i];

                var url = 'https://grupovass.sharepoint.com/es-es/businessvalue/gaming/Paginas/Ranking.aspx?g=Juego%20de%20tronos&f=' + currentRanking.group.title;

                var html = '';
                html += '<div class="row group-detail" data-aos="fade-up" data-aos-once="true">' +
                    '<p class="group-title">' + currentRanking.group.title + '</p>' +
                    '<div class="col-3">' +
                    '<div class="group-image">' +
                    '<img src="' + currentRanking.group.image + '" class="img-fluid"/>' +
                    '</div>' +
                    '</div>' +
                    '<div class="col">' +
                    '<p class="group-description" data-aos="fade-right" data-aos-once="true">' + currentRanking.group.description + '</p>' +
                    '<div class="row group-users" data-aos="fade-right" data-aos-once="true">';

                for (var j = 0; j < 3; j++) {
                    if (j < currentRanking.users.length)
                        html += '<div class="col-2"><img src="' + currentRanking.users[j].picture + '" title="' + currentRanking.users[j].name + '" /></div>';
                }

                html += '<div class="col"><span class="badge badge-pill badge-info">' + currentRanking.users.length + '</span></div>';

                html += '<a href="' + url+ '" class="group-info"><span class="icon-mas"></span>&nbsp;info</a>';

                html += '</div>' +
                    '</div>' +
                    '</div>';

                $($this).append(html);
            }

            if (checkMSIE()) {
                $("[data-aos^=fade][data-aos^=fade]").css("opacity", "1");
                $("[data-aos^=fade][data-aos^=fade]").css("transform", "none");
            }
        }

        function compare(a, b) {
            if (a.score < b.score)
                return 1;
            if (a.score > b.score)
                return -1;
            return 0;
        }

        function getValue(fields, fieldName) {
            var value;
            for (var i = 0; i < fields.length; i++) {
                if (fields[i].Key == fieldName) {
                    value = fields[i].Value;
                    break;
                }
            }

            return value;
        }

        getUsers();
    };
}(jQuery));

(function ($) {
    $.fn.currentUserRanking = function (options) {
        var $this = this;

        var picture = 'https://outlook.office365.com/owa/service.svc/s/GetPersonaPhoto?email=' + _spPageContextInfo.userEmail + '&UA=0&size=HR96x96';

        $('#userPhoto').attr('src', picture);
        $('#userName').text(_spPageContextInfo.userDisplayName);

        var clientContext = new SP.ClientContext('https://grupovass.sharepoint.com/es-es/businessvalue/gaming');

        var oList = clientContext.get_web().get_lists().getByTitle('Clasificación');

        var camlQuery = new SP.CamlQuery();
        camlQuery.set_viewXml(
            '<View><Query><Where><Eq><FieldRef Name=\'JuegoPadre\'/>' +
            '<Value Type=\'Lookup\'>Juego de tronos</Value></Eq></Where><OrderBy><FieldRef Name="PuntuacionMinima" Ascending="False"/></OrderBy></Query></View>'
        );

        var groupCollection = oList.getItems(camlQuery);

        clientContext.load(groupCollection);

        clientContext.executeQueryAsync(
            Function.createDelegate(this, function () {
                var defaultScore = 0;
                var listItemEnumerator = groupCollection.getEnumerator();
                var gameGroups = new Array();
                while (listItemEnumerator.moveNext()) {
                    var oListItem = listItemEnumerator.get_current();
                    var title = oListItem.get_item('Title');
                    var image = oListItem.get_item('Imagen').get_url();
                    var description = oListItem.get_item('Descripcion');
                    var minimun = oListItem.get_item('PuntuacionMinima');
                    var maximun = oListItem.get_item('PuntuacionMaxima');

                    var gameGroup = {
                        title: title,
                        description: description,
                        image: image,
                        minimun: minimun,
                        maximun: maximun
                    }

                    gameGroups.push(gameGroup);
                }

                getUserScore(gameGroups);
                
            }),
            Function.createDelegate(this, function (sender, args) {
                console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                //showErrorMessage("No se ha podido crear la solicitud");
            })
        );
        
        var userImageWidth = $("#userPhoto").width();
        if (userImageWidth < 30) {
        	picture = '/_layouts/15/userphoto.aspx?size=L&accountname=' + _spPageContextInfo.userEmail;
        	$('#userPhoto').attr('src', picture);
        }
    };

    function getUserScore(gameGroups) {
        var clientContext = SP.ClientContext.get_current();
        var user = clientContext.get_web().getUserById(_spPageContextInfo.userId);
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
                        var userGameScore = Number(properties["GameScore"].split(';')[0]);

                        $('#userScore').text(userGameScore);

                        for (var i = 0; i < gameGroups.length; i++) {
                            var gameGroup = gameGroups[i];
                            if (gameGroup.minimun <= userGameScore && (gameGroup.maximun >= userGameScore || gameGroup.maximun == 3000)) {
                                $('#rankingPhoto').attr('src', gameGroup.image);
                                break;
                            }
                        }
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
}(jQuery));

jQuery(document).ready(function () {
    jQuery('#ranking').ranking();
    jQuery('#currentUserRanking').currentUserRanking();
});