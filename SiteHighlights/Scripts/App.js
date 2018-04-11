'use strict';

function retrieveListItems() {

    var clientContext = new SP.ClientContext("https://grupovass.sharepoint.com/es-es/peopleandtalent/noticias/");
    var oList = clientContext.get_web().get_lists().getByTitle('Páginas');

    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml('<View><ViewFields><FieldRef Name="Title"></FieldRef><FieldRef Name="FileRef"></FieldRef><FieldRef Name="Summary"></FieldRef><FieldRef Name="PublishingRollupImage"></FieldRef></ViewFields><Query><Where><Eq><FieldRef Name=\'SubhomeHighlight\'/>' +
        '<Value Type=\'Integer\'>1</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>');
    var collListItem = oList.getItems(camlQuery);

    clientContext.load(collListItem);

    clientContext.executeQueryAsync(Function.createDelegate(this, onQuerySucceeded), Function.createDelegate(this, onQueryFailed));

    function onQuerySucceeded(sender, args) {

        var listItemInfo = '';

        var listItemEnumerator = collListItem.getEnumerator();

        var carouselItems = $('#carouselNews .carousel-inner');

        var counter = 0;

        while (listItemEnumerator.moveNext()) {
            var oListItem = listItemEnumerator.get_current();
            var className = 'carousel-item';
            if (counter == 0)
                className += ' active';

            var image = oListItem.get_item('PublishingRollupImage');
            var srcSplit = image.split('src="');
            var srcQuoteSplit = srcSplit[1].split('"');

            var srcImage = srcQuoteSplit[0];
            var title = oListItem.get_item('Title');
            var fileRef = oListItem.get_item('FileRef');
            var summary = oListItem.get_item('Summary');

            var carouselItem = $('<div class="' + className + '"/>');
            var carouselImage = $('<div class="carousel-image" style="background-image:url(' + srcImage + ')"/>');
            var carouselCaption = $('<div class="carousel-caption"/>');
            var carouselCaptionTitle = $('<h3><a href="' + fileRef + '">' + title + '</a></h3>');
            var carouselCaptionSummary = $('<p>' + summary + '</p>');

            carouselCaption.append(carouselCaptionTitle);
            carouselCaption.append(carouselCaptionSummary);

            carouselItem.append(carouselImage);
            carouselItem.append(carouselCaption);

            carouselItems.append(carouselItem);

            counter++;
        }
    }

    function onQueryFailed(sender, args) {

        console.log('Site Highlights. Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
    }
}

ExecuteOrDelayUntilScriptLoaded(retrieveListItems, "sp.js");