﻿
// Configuración de AuthenticationContext
var variables = {
    // TENANT
    azureAD: "grupovass.onmicrosoft.com",
    // ClientId de la aplicación
    clientId: {
        Teams: "4392d55a-3366-49f1-b553-1206086b9749",
        Events: "abc12551-d625-4f3f-94a9-1dee82fc9c18",
        Graph: "ab66f287-db0f-40c4-8b34-ddcedd387b8a"
    }
}

window.config = {
    tenant: variables.azureAD,
    clientId: variables.clientId,
    postLogoutRedirectUri: window.location.origin,
    endpoints: {
        graphApiUri: "https://graph.microsoft.com"
    },
    cacheLocation: "localStorage"
};

function setContext(clientId) {
    config.clientId = clientId;

    var authContext = new AuthenticationContext(config);

    //authContext.TokenCache.Clear();

    if (authContext.isCallback(window.location.hash)) {

        authContext.handleWindowCallback();
        var err = authContext.getLoginError();
        if (err) {
            console.log(err);
        }
    }
    else {

        var user = authContext.getCachedUser();
        if (!user) {
            authContext.login();
        }
    }
}

function execute(options) {
    config.clientId = options.clientId;
    var authContext = new AuthenticationContext(config);

    if (authContext.isCallback(window.location.hash)) {

        authContext.handleWindowCallback();
        var err = authContext.getLoginError();
        if (err) {
            console.log(err);
        }
    }
    else {

        var user = authContext.getCachedUser();
        if (!user) {
            authContext.login();
        }

        authContext.acquireToken(config.endpoints.graphApiUri, function (error, token) {
            if (error || !token) {
                console.log("ADAL error occurred: " + error);
                return;
            }
            else {
                var url = config.endpoints.graphApiUri + "/" + options.version + options.endpoint;

                var ajaxOptions = {
                    url: url,
                    type: options.type,
                    headers: {
                        "Authorization": "Bearer " + token,
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                };

                if (options.type == "POST" || options.type == "PUT") {
                    ajaxOptions.data = JSON.stringify(options.data);
                }

                $.ajax(ajaxOptions).done(function (response) {
                    if (options.callback != null)
                        options.callback(response);
                }).fail(function (j, h, d) {
                    console.log(j);
                });
            }
        });
    }
}