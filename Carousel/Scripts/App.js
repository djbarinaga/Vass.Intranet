var hostweburl;
var appweburl;
var listName

$(document).ready(function () {
    hostweburl = getQueryStringParameter("Web");
    appweburl = getQueryStringParameter("SPAppWebUrl");
    listName = getQueryStringParameter("List");

    var scriptbase = hostweburl + "/_layouts/15/";

    if (hostweburl != null && listName != null)
        $.getScript(scriptbase + "SP.RequestExecutor.js", execCrossDomainRequest);
});

function execCrossDomainRequest() {
    var executor = new SP.RequestExecutor(appweburl);

    executor.executeAsync(
        {
            url:
                appweburl +
                "/_api/SP.AppContextSite(@target)/web/lists/getbytitle('" + listName+ "')/items?@target='" + hostweburl + "'",
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
    console.log(results);
    //for (var i = 0; i < results.length; i++) {
    //    announcementsHTML = announcementsHTML +
    //        "<p><h1>" + results[i].Title +
    //        "</h1>" +
    //        "</p><hr>";
    //}

    //document.getElementById("HostwebTitle").innerHTML =
    //    announcementsHTML;
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