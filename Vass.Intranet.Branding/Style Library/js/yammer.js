jQuery(document).ready(function () {
    yam.connect.embedFeed({
        "config": {
            "use_sso": false,
            "header": false,
            "footer": false,
            "showOpenGraphPreview": false,
            "defaultToCanonical": false,
            "hideNetworkName": false,
            "theme": "light"
        },
        "container": "#yammer",
        network: 'grupovass.onmicrosoft.com',
        feedType: "group",
        feedId: "15465439"
    });
})