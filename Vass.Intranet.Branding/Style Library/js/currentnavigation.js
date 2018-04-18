var menu;
var menuIndex;
(function ($) {
    $.fn.currentNav = function (options) {
        var $this = this;

        var url = _spPageContextInfo.webServerRelativeUrl;

        url += "/_api/navigation/menustate?mapprovidername='CurrentNavigationSwitchableProvider'";

        var $ajax = $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            headers: {
                Accept: "application/json;odata=verbose"
            }
        });

        $ajax.done(function (data, textStatus, jqXHR) {
            var activeMenu = -1;
            var ul = $('<ul style="display:none"/>');
            menu = data.d.MenuState.Nodes.results;

            for (var i = 0; i < menu.length; i++) {
                if (window.location.href.toLowerCase().indexOf(menu[i].SimpleUrl.toLowerCase()) > -1) {
                    $(ul).append('<li class="active"><a href="' + menu[i].SimpleUrl + '" data-menu="' + i + '">' + menu[i].Title + '</a></li>');
                    activeMenu = i;
                }
                else {
                    $(ul).append('<li><a href="' + menu[i].SimpleUrl + '" data-menu="' + i + '">' + menu[i].Title + '</a></li>');
                }
            }

            $($this).append(ul);

            $(ul).fadeIn('fast');

            if (activeMenu > -1) {
                var submenu = menu[activeMenu].Nodes.results;

                if (submenu.length > 0) {
                    var ul = $('<ul/>');

                    for (var i = 0; i < submenu.length; i++) {
                        $(ul).append('<li><a href="' + submenu[i].SimpleUrl + '" data-menu="' + i + '">' + submenu[i].Title + '</a></li>');
                    }
                    $('#current-submenu').append(ul);
                    $('#current-menu').removeClass('col-4').addClass('col-2');
                    $('#current-submenu').fadeIn('fast');
                }
                else {
                    $('#current-submenu').fadeOut('fast');
                }
            }
            else {
                $(ul).find('li a').each(function () {
                    $(this).on('mouseover', function () {
                        $(this).closest('ul').find('li').removeClass('active');
                        $(this).parent().addClass('active');
                        var idx = $(this).data('menu');
                        if (idx != menuIndex) {
                            var submenu = menu[idx].Nodes.results;

                            if (submenu.length > 0) {
                                var ul = $('<ul/>');

                                for (var i = 0; i < submenu.length; i++) {
                                    $(ul).append('<li><a href="' + submenu[i].SimpleUrl + '" data-menu="' + i + '">' + submenu[i].Title + '</a></li>');
                                }

                                $('#current-submenu').html('');
                                $('#current-submenu').append(ul);
                                $('#current-submenu').css('position', 'absolute');
                                $('#current-submenu').css('z-index', '1');
                                $('#current-submenu').css('left', $('#current-menu').width() - 15 + 'px'); //-20 padding
                                $('#current-submenu').css('height', $('#current-menu').height() + 80 + 'px'); // +80 padding
                                $('#current-submenu').fadeIn('fast');
                            }
                            else {
                                $('#current-submenu').fadeOut('fast');
                            }
                        }

                        menuIndex = idx;
                    });
                });
            }
        });
    };
}(jQuery));

$(document).ready(function () {
    $('#current-menu').currentNav();
})