/*QUICKLINKS PLUGIN*/
(function ($) {
    $.fn.quicklinks = function (options) {
        var $this = this;
        var url = "https://grupovass.sharepoint.com/desarrollo/_api/web/lists('698a56a1-a894-4580-835d-242c1bbd1bdc')/items";

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
            var parents = new Array();

            if (results != null && results.length > 0) {
                var resultsLength = results.length;
                for (var i = 0; i < resultsLength; i++) {
                    var result = results[i];
                    if (result.URL == null)
                        parents.push(result);
                }

                var parentsLength = parents.length;
                for (var i = 0; i < parentsLength; i++) {
                    var parent = parents[i];
                    var parentLi = jQuery('<li class="group-list">' + parent.Title + '</li>');

                    jQuery($this).append(parentLi);

                    var childList = jQuery('<ul/>');
                    parentLi.append(childList);

                    for (var j = 0; j < results.length; j++) {
                        var result = results[j];

                        if (result.URL != null && result.ParentId == parent.ID) {
                            childList.append('<li><a href="' + result.URL.Url + '">' + result.Title + '</a></li>');
                        }
                    }
                }
            }
        });
    };
}(jQuery));

/*SOCIALLINKS PLUGIN*/
(function ($) {
    $.fn.sociallinks = function (options) {
        var $this = this;
        var url = "https://grupovass.sharepoint.com/desarrollo/_api/web/lists('3cc277c3-ae2f-469c-a045-36bc751cdc91')/items";

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
                var resultsLength = results.length;

                for (var i = 0; i < resultsLength; i++) {
                    var result = results[i];
                    var li = jQuery('<li><a href="' + result.URL.Url + '"><span class="icon-' + result.Title + '"></span></li>');

                    jQuery($this).append(li);
                }
            }
        });
    };
}(jQuery));

/*SEARCHBOX PLUGIN*/
(function ($) {
    $.fn.searchbox = function (options) {
        var url = "https://grupovass.sharepoint.com/desarrollo/Pages/busqueda.aspx";
        var location = window.location.href;
        if (location.indexOf('k=') > -1) {
            var locationSplit = location.split('k=');
            $(this).val(locationSplit[1]);
        }
        

        $(this).on('keydown', function (ev) {
            if (ev.keyCode == 13) {
                ev.preventDefault();
                window.location.href = url + '?k=' + $(this).val();
                return false;
            }
        });
    };
}(jQuery));

/*BANNER PLUGIN*/
(function ($) {
    $.fn.banner = function (options) {
        var $this = this;
        var bannerZone = $(this).data('target');
        var url = "https://grupovass.sharepoint.com/desarrollo/_api/web/lists('f618ff1b-b6ea-4bab-a787-0d56eb4fba30')/items?$filter=Banner eq '" + bannerZone + "'";

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
                var result = results[0];
                var link = jQuery('<a href="' + result.URL.Url + '">' + result.Title + '</a>');

                jQuery($this).find('.panel-body').append(link);


                var bgColor;
                var bgImagen = '/Style library/images/';

                switch (result.Color) {
                    case 'Azul':
                        bgColor = '#50bbeb';
                        break;
                    case 'Morado':
                        bgColor = '#6d6ba6';
                        break;
                    case 'Violeta':
                        bgColor = '#9b549e';
                        break;
                    case 'Naranja':
                        bgColor = '#f39a4a';
                        break;
                    case 'Verde':
                        bgColor = '#629e4d';
                        break;
                    case 'Aceituna':
                        bgColor = '#d3d612';
                        break;
                }

                if (result.Image != null) {
                    bgImagen = result.Image.Url;
                }
                else {
                    switch (result.Icon) {
                        case 'Diálogo':
                            bgImagen += 'dialogue.png';
                            break;
                        case 'Mano':
                            bgImagen += 'hand.png';
                            break;
                        default:
                            bgImagen = '';
                            break;
                    }
                }

                if (result.Image != null) {
                    jQuery($this).addClass('image');
                    jQuery($this).parent().css('background', 'url("' + bgImagen + '") no-repeat');
                    jQuery($this).parent().css('background-size', 'cover');
                }
                else if (bgImagen == '')
                {
                    jQuery($this).css('background-color', bgColor);
                }
                else if (result.Icon != null)
                {
                    jQuery($this).css('background', 'url("' + bgImagen + '") ' + bgColor + ' no-repeat 90% 90%');
                }
                    
                

                if (result.Description == null)
                    $(link).addClass('w-75');
                else
                    jQuery($this).find('.panel-body').append('<p class="w-75">' + result.Description + '</p>');
            }
        });
    };
}(jQuery));


jQuery(document).ready(function () {
    setHomePage();
    jQuery('#quickLinks').each(function () {
        $(this).quicklinks();
    });

    jQuery('#socialLinks').each(function () {
        $(this).sociallinks();
    });

    jQuery('.search-box').each(function () {
        $(this).searchbox();
    });

    jQuery('.banner').each(function () {
        $(this).banner();
    });
});

function setHomePage(){
    $('.navbar-brand').attr('href', '/' + _spPageContextInfo.currentCultureName.toLowerCase());
}

var maxLength = 255;
function stripHtml(html, length) {
    if (length == null)
        length = maxLength;

    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    var strippedHtml = tmp.textContent || tmp.innerText || "";

    if (strippedHtml.length > length) {
        strippedHtml = strippedHtml.substring(0, length);
        strippedHtml += '[...]';
    }

    return strippedHtml;
}

function getUrlParam(param, url) {
    var returnValue = '';

    if (url == null)
        url = window.location.href;

    var newUrl = url.split('?');
    if (newUrl.length > 1) {
        var qs = newUrl[1];
        var values = qs.split('&');

        for (var i = 0; i < values.length; i++) {
            var keyValue = values[i].split('=');
            if (keyValue[0] == param)
                return keyValue[1].replace("#", "");
        }
    }
}

function toDate(text) {
    var language = _spPageContextInfo.currentLanguage;
    var d = null;

    if (language == 3082) {
        //español
        var textAsDate = text.split('/');
        d = new Date(textAsDate[2], Number(textAsDate[1]) - 1, textAsDate[0]);
    }
    else {
        d = new Date(text);
    }

    return d;
}

function dateDiff(first, second) {
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
}