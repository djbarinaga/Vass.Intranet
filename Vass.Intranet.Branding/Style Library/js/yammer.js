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

    !function (d, s, id) {
        var js;
        var fjs = d.getElementsByTagName(s)[0];
        var p = /^http:/.test(d.location) ? 'http' : 'https';
        if (!d.getElementById(id)) {
            js = d.createElement(s);
            js.id = id;
            js.src = p + "://platform.twitter.com/widgets.js";
            fjs.parentNode.insertBefore(js, fjs);
        }
    }(document, "script", "twitter-wjs");
})
