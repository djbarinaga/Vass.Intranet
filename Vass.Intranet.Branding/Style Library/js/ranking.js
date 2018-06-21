(function ($) {
    $.fn.ranking = function (options) {
        var users = [];
        var $this = this;

        this.empty();

        function getGameGroups() {
            var clientContext = new SP.ClientContext('https://grupovass.sharepoint.com/es-es/businessvalue/gaming');

            var oList = clientContext.get_web().get_lists().getByTitle('Clasificación');

            var camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml(
                '<View><Query><Where><Eq><FieldRef Name=\'JuegoPadre\'/>' +
                '<Value Type=\'Lookup\'>Juego de tronos</Value></Eq></Where></Query></View>'
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
                        var minimun = oListItem.get_item('PuntuacionMinima');
                        var maximun = oListItem.get_item('PuntuacionMaxima');

                        var html = '';
                        html += '<div class="row">' +
                            '<p class="group-title">' + title + '</p>' +
                            '<div class="col-4">' +
                            '<div class="group-image">' +
                            '<img src="' + image + '" />' +
                            '</div>' +
                            '</div>' +
                            '<div class="col">' +
                            '<div class="row group-users" data-minimun="' + minimun + '" data-maximun="' + maximun + '">' +
                            '</div>' +
                            '</div>' +
                            '</div>';

                        $($this).append(html);
                    }

                    getUsers();
                }),
                Function.createDelegate(this, function (sender, args) {
                    console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                    //showErrorMessage("No se ha podido crear la solicitud");
                })
            );
        }

        function getUsers() {
            var clientContext = new SP.ClientContext(_spPageContextInfo.siteAbsoluteUrl);
            var web = clientContext.get_web();
            var userInfoList = web.get_siteUserInfoList();
            var query = SP.CamlQuery.createAllItemsQuery();
            var allusers = userInfoList.getItems(query);

            clientContext.load(allusers, 'Include(ID)');

            clientContext.executeQueryAsync(
                Function.createDelegate(this, function () {

                    var listItemEnumerator = allusers.getEnumerator();
                    while (listItemEnumerator.moveNext()) {
                        var user = listItemEnumerator.get_current();
                        getProfile(user);
                    }

                }), Function.createDelegate(this, function () {
                    //On Fail
                }));
        }

        function getProfile(userItem) {
            var clientContext = SP.ClientContext.get_current();

            var user = clientContext.get_web().getUserById(userItem.get_item('ID'));

            clientContext.load(user);

            clientContext.executeQueryAsync(
                function () {
                    var login = user.get_loginName();
                    var title = user.get_title();
                    var email = user.get_email();
                    var peopleManager = new SP.UserProfiles.PeopleManager(clientContext);

                    var userProfileProperties = peopleManager.getPropertiesFor(login);

                    clientContext.load(userProfileProperties);

                    clientContext.executeQueryAsync(
                        Function.createDelegate(this, function () {
                            var properties = userProfileProperties.get_userProfileProperties();
                            var upPhoto = userProfileProperties.get_userProfileProperties().PictureURL;
                            var image = 'https://outlook.office365.com/owa/service.svc/s/GetPersonaPhoto?email=' + email + '&UA=0&size=HR48x48';

                            var img = new Image();
                            img.src = image;

                            img.onload = function () {
                                if (properties["Game"] != '' && this.width > 1) {
                                    var userGames = properties["Game"].split(';');
                                    var userGameScore = properties["GameScore"].split(';');
                                    var gameIndex = userGames.indexOf('Juego de tronos');

                                    if (gameIndex > -1) {
                                        var score = userGameScore[gameIndex];
                                        if (score == '')
                                            score = 0;

                                        score = Number(score);

                                        var groupUser = $($this).find('.group-users').filter(function () {
                                            if ($(this).children().length < 3)
                                                return (score >= $(this).data('minimun') && score <= $(this).data('maximun'));
                                        });
                                        if (groupUser != null)
                                            groupUser.append('<div class="col-3"><img src="' + image + '" title="' + title + '" /></div>');
                                    }
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

        function onQueryFailed(sender, args) {
            console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
        }

        getGameGroups();
    };
}(jQuery));

jQuery(document).ready(function () {
    jQuery('#ranking').ranking();
});