(function ($) {
    $.fn.secondaryHighlights = function (options) {
        var $this = this;
        var site = $(this).data('site');
        var url = _spPageContextInfo.siteAbsoluteUrl + _spPageContextInfo.webServerRelativeUrl + '/' + site;

        var clientContext = new SP.ClientContext(url);

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

            var highlightContent = $('#secondary-highlight .content');
            highlightContent.empty();

            var highlightsRow = $('<div class="row"/>');
            highlightContent.append(highlightsRow);

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

                    var title = $('<h3>' + title.trim() + '</h3>');
                    col.append(title);

                    var row = $('<div class="row"/>');
                    col.append(row);

                    var rowImageCol = $('<div class="col-6"/>');
                    row.append(rowImageCol);

                    var image = $('<img src="' + srcImage + '" class="img-fluid"/>');
                    rowImageCol.append(image);

                    var rowContentCol = $('<div class="col-6 bold"/>');
                    rowContentCol.html(summary.trim());
                    row.append(rowContentCol);
                }

                counter++;
            }
        }

        function onQueryFailed(sender, args) {
            console.log('Site Highlights. Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
        }
    };
}(jQuery));

(function ($) {
    $.fn.mainHighlight = function (options) {
        var $this = this;
        var site = $(this).data('site');
        var url = _spPageContextInfo.siteAbsoluteUrl + _spPageContextInfo.webServerRelativeUrl + '/' + site;

        var clientContext = new SP.ClientContext(url);
        var oList = clientContext.get_web().get_lists().getByTitle('Páginas');

        var camlQuery = new SP.CamlQuery();
        camlQuery.set_viewXml('<View><ViewFields><FieldRef Name="Title"></FieldRef><FieldRef Name="FileRef"></FieldRef><FieldRef Name="Summary"></FieldRef><FieldRef Name="PublishingRollupImage"></FieldRef><FieldRef Name="PublishingPageContent"></FieldRef></ViewFields><Query><Where><Eq><FieldRef Name=\'SubhomeHighlight\'/>' +
            '<Value Type=\'Integer\'>1</Value></Eq></Where><OrderBy><FieldRef Name="Created" Ascending="FALSE"/></OrderBy></Query><RowLimit>1</RowLimit></View>');
        var collListItem = oList.getItems(camlQuery);

        clientContext.load(collListItem);

        clientContext.executeQueryAsync(Function.createDelegate(this, onQuerySucceeded), Function.createDelegate(this, onQueryFailed));

        function onQuerySucceeded(sender, args) {

            var listItemInfo = '';

            var listItemEnumerator = collListItem.getEnumerator();

            var carouselItems = $($this).find('.carousel .carousel-inner');
            carouselItems.empty();

            var counter = 0;

            while (listItemEnumerator.moveNext()) {
                var oListItem = listItemEnumerator.get_current();
                var className = 'carousel-item active';

                var image = oListItem.get_item('PublishingRollupImage');
                var srcSplit = image.split('src="');
                var srcQuoteSplit = srcSplit[1].split('"');

                var srcImage = srcQuoteSplit[0];
                var title = oListItem.get_item('Title');
                var fileRef = oListItem.get_item('FileRef');
                var summary = oListItem.get_item('Summary');

                if (summary == null)
                    summary = oListItem.get_item('PublishingPageContent');

                summary = stripHtml(summary);

                var carouselItem = $('<div class="' + className + '"/>');
                var carouselImage = $('<div class="carousel-image" style="background-image:url(' + srcImage + ')"/>');
                var carouselCaption = $('<div class="carousel-caption"/>');
                var carouselCaptionTitle = $('<h3><a href="' + fileRef + '">' + title.trim() + '</a></h3>');
                var carouselCaptionSummary = $('<div/>');

                carouselCaptionSummary.html(summary.trim());

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
    };
}(jQuery));

jQuery(document).ready(function () {
    jQuery('#secondary-highlight').each(function () {
        var $this = $(this);
        SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {
            $($this).secondaryHighlights();
        });
    });

    jQuery('#main-highlight').each(function () {
        var $this = $(this);
        SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {
            $($this).mainHighlight();
        });
    });
});