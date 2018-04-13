var hostweburl;
var appweburl;
var listName;
var items;

$(document).ready(function () {
    hostweburl = getQueryStringParameter("Web");
    appweburl = getQueryStringParameter("SPAppWebUrl");
    listName = getQueryStringParameter("List");
    items = getQueryStringParameter("Items");

    if (isNullOrEmpty(items))
        items = 0;
    else
        items = Number(items);

    var scriptbase = hostweburl + "/_layouts/15/";

    if (!isNullOrEmpty(hostweburl) && !isNullOrEmpty(listName))
        $.getScript(scriptbase + "SP.RequestExecutor.js", execCrossDomainRequest);
});

function execCrossDomainRequest() {
    var executor = new SP.RequestExecutor(appweburl);

    executor.executeAsync(
        {
            url:
                appweburl +
                "/_api/SP.AppContextSite(@target)/web/lists/getbytitle('" + listName + "')/items?$select=Title, Summary, FileRef, PublishingPageContent&@target='" + hostweburl + "'",
            method: "GET",
            headers: { "Accept": "application/json; odata=verbose" },
            success: successHandler,
            error: errorHandler
        }
    );
}

function successHandler(data) {
    var jsonObject = JSON.parse(data.body);
    var announcementsHTML = '';

    var results = jsonObject.d.results;

    if (items == 0)
        items = results.length;

    var carouselItems = $('#carouselNews .carousel-inner');

    for (var i = 0; i < items; i++) {
        var result = results[i];

        var className = 'carousel-item';
        if (i == 0)
            className += ' active';

        var image = result['PublishingRollupImage'];
        var srcImage = '';

        if (image != null) {
            var srcSplit = image.split('src="');
            var srcQuoteSplit = srcSplit[1].split('"');

            srcImage = srcQuoteSplit[0];
        }
        
        var title = result['Title'];
        var fileRef = result['FileRef'];
        var summary = result['Summary'];

        if (summary == null)
            summary = result['PublishingPageContent'];

        summary = stripHtml(summary);

        var carouselItem = $('<div class="' + className + '"/>');
        var carouselImage = $('<div class="carousel-image" style="background-image:url(' + srcImage + ')"/>');
        var carouselCaption = $('<div class="carousel-caption"/>');
        var carouselCaptionTitle = $('<h3><a href="' + fileRef + '">' + title + '</a></h3>');
        var carouselCaptionSummary = $('<div/>');

        carouselCaptionSummary.html(summary);

        carouselCaption.append(carouselCaptionTitle);
        carouselCaption.append(carouselCaptionSummary);

        carouselItem.append(carouselImage);
        carouselItem.append(carouselCaption);

        carouselItems.append(carouselItem);
    }
}

function errorHandler(data, errorCode, errorMessage) {
    document.getElementById("HostwebTitle").innerText =
        "Could not complete cross-domain call: " + errorMessage;
}

function getQueryStringParameter(paramToRetrieve) {
    var params =
        document.URL.split("?")[1].split("&");
    var strParams = "";
    for (var i = 0; i < params.length; i = i + 1) {
        var singleParam = params[i].split("=");
        if (singleParam[0] == paramToRetrieve)
            return decodeURIComponent(singleParam[1]);
    }
}

function isNullOrEmpty(text) {
    return text == '' || text == null;
}