function retrieveListItems() {

    var clientContext = new SP.ClientContext("https://grupovass.sharepoint.com/es-es/peopleandtalent/noticias/");
    var oList = clientContext.get_web().get_lists().getByTitle('Páginas');

    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml('<View><ViewFields><FieldRef Name="Title"></FieldRef><FieldRef Name="FileRef"></FieldRef><FieldRef Name="Summary"></FieldRef><FieldRef Name="PublishingRollupImage"></FieldRef><FieldRef Name="PublishingPageContent"></FieldRef></ViewFields><Query><Where><Eq><FieldRef Name=\'SubhomeHighlight\'/>' +
        '<Value Type=\'Integer\'>1</Value></Eq></Where><OrderBy><FieldRef Name="Created" Ascending="FALSE"/></OrderBy></Query><RowLimit>4</RowLimit></View>');
    var collListItem = oList.getItems(camlQuery);

    clientContext.load(collListItem);

    clientContext.executeQueryAsync(Function.createDelegate(this, onQuerySucceeded), Function.createDelegate(this, onQueryFailed));

    function onQuerySucceeded(sender, args) {

        var listItemInfo = '';

        var listItemEnumerator = collListItem.getEnumerator();

        var highlightsRow = $('#secondary-highlight .row');

        var counter = 0;

        while (listItemEnumerator.moveNext()) {
            if (counter > 0) {
                var oListItem = listItemEnumerator.get_current();

                var image = oListItem.get_item('PublishingRollupImage');
                var srcSplit = image.split('src="');
                var srcQuoteSplit = srcSplit[1].split('"');
                var srcImage = srcQuoteSplit[0];
                var title = oListItem.get_item('Title');
                var fileRef = oListItem.get_item('FileRef');
                var summary = oListItem.get_item('Summary');

                if (summary == null)
                    summary = oListItem.get_item('PublishingPageContent');

                summary = stripHtml(summary, 155);

                var col = $('<div class="col-4"/>');
                highlightsRow.append(col);

                var title = $('<h3>' + title + '</h3>');
                col.append(title);

                var row = $('<div class="row"/>');
                col.append(row);

                var rowImageCol = $('<div class="col-6"/>');
                row.append(rowImageCol);

                var image = $('<img src="' + srcImage + '" class="img-fluid"/>');
                rowImageCol.append(image);

                var rowContentCol = $('<div class="col-6"/>');
                rowContentCol.html(summary);
                row.append(rowContentCol);
            }

            counter++;
        }
    }

    function onQueryFailed(sender, args) {

        console.log('Site Highlights. Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
    }
}

SP.SOD.executeFunc('sp.js', 'SP.ClientContext', retrieveListItems);