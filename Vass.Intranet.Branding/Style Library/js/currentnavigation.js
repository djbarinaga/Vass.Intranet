(function ($) {
    $.fn.currentNav = function (options) {
        var $this = this;
        var ul = $('<ul style="display:none"/>');

        function getParentPagesNav(welcomepage) {
            var url = _spPageContextInfo.webServerRelativeUrl.split("/").slice(0, -1).join("/");

            if(url == '/es-es')
                url = _spPageContextInfo.webServerRelativeUrl;

            url += "/_api/lists/getbytitle('Páginas')/items?$select=Title, FileRef";

            var $ajax = $.ajax({
                url: url,
                type: "GET",
                dataType: "json",
                headers: {
                    Accept: "application/json;odata=verbose"
                }
            });

            $ajax.done(function (data, textStatus, jqXHR) {
                var results = data.d.results;

                if (results != null && results.length > 0) {
                    var length = results.length;
                    var currentUrl = window.location.href;
                    for (var i = 0; i < length; i++) {
                        var result = results[i];
                        var title = result.Title;
                        var url = result.FileRef;

                        if(url.toLowerCase().indexOf(welcomepage.toLowerCase()) > -1)
                            continue;

                        var css = '';

                        if (currentUrl.toLowerCase().indexOf(url.toLowerCase()) > -1) {
                            css = 'class="active"';
                        }

                        var li = $('<li ' + css + '><a href="' + url + '">' + title + '</a></li>');
                        ul.append(li);
                    }

                    $($this).append(ul);
                }

                getParentSitesNav();
            });
        }

        function getParentSitesNav() {
            var url = _spPageContextInfo.webServerRelativeUrl.split("/").slice(0, -1).join("/");

            if (url == '/es-es')
                url = _spPageContextInfo.webServerRelativeUrl;

            url += '/_api/web/webs';

            var $ajax = $.ajax({
                url: url,
                type: "GET",
                dataType: "json",
                headers: {
                    Accept: "application/json;odata=verbose"
                }
            });

            $ajax.done(function (data, textStatus, jqXHR) {
                var results = data.d.results;

                if (results != null && results.length > 0) {
                    var length = results.length;
                    var currentUrl = window.location.href;
                    for (var i = 0; i < length; i++) {
                        var result = results[i];
                        if (result.WebTemplate != 'APP') {
                            var title = result.Title;
                            var url = result.Url;
                            var css = '';

                            if (currentUrl.toLowerCase().indexOf(url.toLowerCase()) > -1) {
                                css = 'class="active"';
                            }

                            var li = $('<li ' + css + '><a href="' + url + '">' + title + '</a></li>');
                            ul.append(li);
                        }
                    }
                }

                ul.fadeIn();
            });
        }

        //Obtenemos la página de inicio
        var url = _spPageContextInfo.webServerRelativeUrl.split("/").slice(0, -1).join("/");

        if (url == '/es-es')
            url = _spPageContextInfo.webServerRelativeUrl;

        url += '/_api/web/rootfolder?$select=welcomepage';

        var $ajax = $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            headers: {
                Accept: "application/json;odata=verbose"
            }
        });

        $ajax.done(function (data, textStatus, jqXHR) {
            var welcomepage = data.d.WelcomePage;

            getParentPagesNav(welcomepage);
        });
    };
}(jQuery));

(function ($) {
    $.fn.currentSubNav = function (options) {
        var $this = this;
        var ul = $('<ul/>');

        function getPagesNav() {

            var checkUrl = _spPageContextInfo.webServerRelativeUrl.split("/").slice(0, -1).join("/");

            if (checkUrl != '/es-es') {
                var url = _spPageContextInfo.webServerRelativeUrl;

                url += "/_api/lists/getbytitle('Páginas')/items?$select=Title, FileRef, PublishingPageLayout";

                var $ajax = $.ajax({
                    url: url,
                    type: "GET",
                    dataType: "json",
                    headers: {
                        Accept: "application/json;odata=verbose"
                    }
                });

                $ajax.done(function (data, textStatus, jqXHR) {
                    var results = data.d.results;

                    if (results != null && results.length > 0) {
                        var length = results.length;
                        var currentUrl = window.location.href;
                        for (var i = 0; i < length; i++) {
                            var result = results[i];
                            var pageLayout = result.PublishingPageLayout.Description;

                            if (pageLayout.toLowerCase().indexOf('article') > -1) {
                                var title = result.Title;
                                var url = result.FileRef;
                                var css = '';

                                if (currentUrl.toLowerCase().indexOf(url.toLowerCase()) > -1) {
                                    css = 'class="active"';
                                }

                                var li = $('<li ' + css + '><a href="' + url + '">' + title + '</a></li>');
                                ul.append(li);
                            }
                        }

                        $($this).append(ul);
                    }

                    getSitesNav();
                });
            }
        }

        function getSitesNav() {
            var url = _spPageContextInfo.webServerRelativeUrl;

            url += '/_api/web/webs';

            var $ajax = $.ajax({
                url: url,
                type: "GET",
                dataType: "json",
                headers: {
                    Accept: "application/json;odata=verbose"
                }
            });

            $ajax.done(function (data, textStatus, jqXHR) {
                var results = data.d.results;
                var length = 0;
                if (results != null && results.length > 0) {
                    length = results.length;
                    var currentUrl = window.location.href;
                    for (var i = 0; i < length; i++) {
                        var result = results[i];
                        if (result.WebTemplate != 'APP') {
                            var title = result.Title;
                            var url = result.Url;
                            var css = '';

                            if (currentUrl.toLowerCase().indexOf(url.toLowerCase()) > -1) {
                                css = 'class="active"';
                            }

                            var li = $('<li ' + css + '><a href="' + url + '">' + title + '</a></li>');
                            ul.append(li);
                        }
                    }
                }

                if (length > 0) {
                    $('#current-menu').removeClass('col-4').addClass('col-2');
                    $($this).fadeIn();
                }
            });
        }

        getPagesNav();
    };
}(jQuery));

$(document).ready(function () {
    $('#current-menu').currentNav();
    $('#current-submenu').currentSubNav();
})