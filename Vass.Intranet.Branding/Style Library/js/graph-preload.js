$(document).ready(function () {
    //https://graph.microsoft.com/v1.0/me/

    execute({
        clientId: variables.clientId.Graph,
        version: "v1.0",
        endpoint: "/me",
        type: "GET",
        callback: function () {
            window.location.href = '/Pages/VariationRoot.aspx';
        }
    });


})