
(function ($) {
    $.fn.ranking = function (options) {
        var users = [];
        var gameGroups = [];
        var $this = this;

        this.empty();

        function getGameGroups() {
            var game = decodeURIComponent(getUrlParam('g'));
            var group = getUrlParam('f');
            var clientContext = new SP.ClientContext('https://grupovass.sharepoint.com/es-es/businessvalue/gaming');

            var oList = clientContext.get_web().get_lists().getByTitle('Clasificación');

            var camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml(
                '<View><Query><Where><And><Eq><FieldRef Name=\'JuegoPadre\'/>' +
                '<Value Type=\'Lookup\'>' + game + '</Value></Eq><Eq><FieldRef Name=\'Title\'/>' +
                '<Value Type=\'Text\'>' + group + '</Value></Eq></And></Where></Query></View>'
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
                        var bigImage;

                        if (oListItem.get_item('Imagen_x0020_Grande') != null)
                            bigImage = oListItem.get_item('Imagen_x0020_Grande').get_url();

                        var description = oListItem.get_item('Descripcion');
                        var minimun = oListItem.get_item('PuntuacionMinima');
                        var maximun = oListItem.get_item('PuntuacionMaxima');

                        var gameGroup = {
                            title: title,
                            description: description,
                            image: (bigImage != null ? bigImage : image),
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

                users.sort(compare);

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

                $('#page-title').text(currentRanking.group.title);

                var html = '';
                html += '<div class="row">' +
                    '<p class="group-title">' + currentRanking.group.description + '</p>' +
                    '<div class="col">' +
                    '<div>' +
                    '<img src="' + currentRanking.group.image + '" style="max-width:300px"/>' +
                    '</div>' +
                    '</div>' +
                    '<div class="col">' +
                    '<canvas id="group-summary" data-role="chart" width="700" height="400"></canvas>' +
                    '</div>' +
                    '</div>';

                html += '<div class="row">';

                for (var j = 0; j < currentRanking.users.length; j++) {
                    html += '<div class="col-5 panel" data-aos="fade-up" data-aos-once="true">';
                    html += '<div class="row">';
                    html += '<div class="col">';
                    html += '<img src="' + currentRanking.users[j].picture + '" title="' + currentRanking.users[j].name + '" style="max-height:120px"/>';
                    html += '</div>';
                    html += '<div class="col">';
                    html += '<p>' + currentRanking.users[j].name + '</p>';
                    html += '<p><span class="badge badge-pill badge-info">' + currentRanking.users[j].score + '</span></p>';
                    html += '</div>';
                    html += '</div>';
                    html += '</div>';
                }

                html += '</div>' +

                $($this).append(html);
            }

            renderChart(currentRanking.group);

            AOS.init({
                targetSelector: ".group-detail",
            });

            $('#s4-workspace').on('scroll', function () {
                AOS.refresh();
            });
        }

        function renderChart(group) {
            users.sort(function (a, b) {
                var aScore = a.score;
                var bScore = b.score;

                if (aScore.indexOf(';') > -1)
                    aScore = aScore.substring(0, aScore.indexOf(';'));

                if (bScore.indexOf(';') > -1)
                    bScore = bScore.substring(0, bScore.indexOf(';'));

                return Number(bScore) - Number(aScore);
            });

            var labels = [];
            var scores = [];
            var counter = 0;

            for (var i = 0; i < users.length; i++) {
                var score = users[i].score;
                if (score.indexOf(';') > -1)
                    score = score.substring(0, score.indexOf(';'));

                score = Number(score);

                if (score >= group.minimun && (score <= group.maximun || group.maximun == null)) {
                    scores.push(score);
                    labels.push(users[i].name);
                    counter++;
                }
                
                
                if (counter == 5)
                    break;
            }

            var ctx = document.getElementById("group-summary").getContext('2d');
            var myBarChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Usuarios',
                        data: scores,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                min: (group.minimun - 10 >= 0 ? group.minimun - 10 : 0)
                            }
                        }],
                        xAxes: [{
                            ticks: {
                                autoSkip: false
                            }
                        }]
                    }
                }
            });
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

jQuery(document).ready(function () {
    jQuery('#ranking').ranking();
});