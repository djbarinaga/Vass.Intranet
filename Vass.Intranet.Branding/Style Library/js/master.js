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

/*GRAPH*/
(function ($) {
    $.fn.graph = function (options) {
        //var folders = ["01-Venta", "02-Inicio", "03-Planificación y gestión", "04-Seguimiento", "04-Seguimiento/04.01-Informes", "04-Seguimiento/04.02-Actas", "04-Seguimiento/04.03-Inventario", "05-Cierre de proyecto"]
        var folders = [
            {
                name: "01-Venta",
                parent: null
            },
            {
                name: "02-Inicio",
                parent: null
            },
            {
                name: "03-Planificación y gestión",
                parent: null
            },
            {
                name: "04-Seguimiento",
                parent: null
            },
            {
                name: "04.01-Informes",
                parent: "04-Seguimiento"
            },
            {
                name: "04.02-Actas",
                parent: "04-Seguimiento"
            },
            {
                name: "04.03-Inventario",
                parent: "04-Seguimiento"
            },
            {
                name: "05-Cierre de proyecto",
                parent: null
            },
            {
                name: "06-Desarrollo",
                parent: null
            },
            {
                name: "06.01-Estrategia de proyecto",
                parent: "06-Desarrollo"
            },
            {
                name: "06.02-Gestión de requisitos",
                parent: "06-Desarrollo"
            },
            {
                name: "06.03-Análisis",
                parent: "06-Desarrollo"
            },
            {
                name: "06.04-Diseño",
                parent: "06-Desarrollo"
            },
            {
                name: "06.05-Construcción",
                parent: "06-Desarrollo"
            },
            {
                name: "06.06-Pruebas",
                parent: "06-Desarrollo"
            },
            {
                name: "06.07-Despliegue",
                parent: "06-Desarrollo"
            },
            {
                name: "06.08-Otros",
                parent: "06-Desarrollo"
            }
        ]

        var variables = {
            // TENANT
            azureAD: "grupovass.onmicrosoft.com",
            // ClientId de la aplicación
            clientId: "7b53e22e-fe24-444b-ab4a-cf30fc982da3"
        }

        // Configuración de AuthenticationContext
        window.config = {
            tenant: variables.azureAD,
            clientId: variables.clientId,
            postLogoutRedirectUri: window.location.origin,
            endpoints: {
                graphApiUri: "https://graph.microsoft.com"
            },
            cacheLocation: "localStorage"
        };

        function setContext() {
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
            }
        }

        function execute(options) {
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
                        var url = config.endpoints.graphApiUri + "/" + options.version + "/" + options.endpoint;

                        var ajaxOptions = {
                            url: url,
                            type: options.type,
                            headers: {
                                "Authorization": "Bearer " + token,
                                "Content-Type": "application/json"
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

        $('#btnCreateTeam').on('click', function () {
            var groupName = $('#txtGroupName').val();
            var mailNickName = groupName.toLowerCase().replace(/ /g, '');

            $('#alert').text('Creando grupo...');

            //Creamos el grupo
            execute({
                version: "v1.0",
                endpoint: "groups",
                type: "POST",
                data: {
                    "description": groupName,
                    "displayName": groupName,
                    "groupTypes": [
                        "Unified"
                    ],
                    "mailEnabled": true,
                    "mailNickname": mailNickName,
                    "securityEnabled": false
                },
                callback: function (result) {
                    var groupId = result.id;

                    $('#alert').text('Añadiendo propietario ' + $('#txtOwner').val() + ' al grupo ' + groupId);

                    //Asignamos el propietario
                    execute({
                        version: "v1.0",
                        endpoint: "/groups/" + groupId + "/owners/$ref",
                        type: "POST",
                        data: {
                            "@odata.id": "https://graph.microsoft.com/v1.0/users/" + $('#txtOwner').val()
                        },
                        callback: function (result) {
                            $('#alert').text('Creando equipo para el grupo ' + groupId);

                            //Creamos el equipo
                            execute({
                                version: "beta",
                                endpoint: "/groups/" + groupId + "/team",
                                type: "PUT",
                                data: {
                                    "memberSettings": {
                                        "allowCreateUpdateChannels": true
                                    },
                                    "messagingSettings": {
                                        "allowUserEditMessages": true,
                                        "allowUserDeleteMessages": true
                                    },
                                    "funSettings": {
                                        "allowGiphy": true,
                                        "giphyContentRating": "strict"
                                    }
                                },
                                callback: function (result) {
                                    createFolder(0);
                                }
                            })
                        }
                    })
                }
            });
        });

        function createFolder(index) {
            var teamName = $('#txtGroupName').val().toLowerCase().replace(/ /g, '');
            var teamSiteUrl = "https://grupovass.sharepoint.com/teams/" + teamName;

            $.ajax({
                url: teamSiteUrl + "/_api/contextinfo",
                method: "POST",
                headers: { Accept: "application/json;odata=verbose" }
            }).done(function (data) {
                $('#alert').text('Esperando la creación del sitio ' + teamSiteUrl);

                checkFolder(teamSiteUrl, data.d.GetContextWebInformation.FormDigestValue, function () {

                    var create = function (index) {

                        if (index < folders.length) {
                            var folder = folders[index];

                            var folderName = '';

                            if (folder.parent == null)
                                folderName = folder.name;
                            else
                                folderName = folder.parent + "/" + folder.name

                            $('#alert').text('Creando carpeta ' + folderName + ' en ' + teamSiteUrl);

                            var url = teamSiteUrl + "/_api/web/getfolderbyserverrelativeurl('Shared%20Documents/General";

                            if (folder.parent != null)
                                url += "/" + folder.parent;

                            url += "')/Folders/add(url='" + folder.name + "')";

                            $.ajax({
                                url: url,
                                type: "POST",
                                dataType: "json",
                                headers: {
                                    Accept: "application/json;odata=verbose",
                                    "X-RequestDigest": data.d.GetContextWebInformation.FormDigestValue
                                }
                            }).done(function (data) {
                                index++;
                                create(index);
                            }).fail(function (j) {
                                console.log(j);
                            });
                        }
                        else {
                            $('#alert').text('Equipo creado');
                        }
                    }

                    create(index);
                });
            });
        }

        function checkFolder(teamSiteUrl, formDigest, callback) {

            var url = teamSiteUrl + "/_api/web/getfolderbyserverrelativeurl('Shared%20Documents/General')";

            $.ajax({
                url: url,
                type: "GET",
                dataType: "json",
                headers: {
                    Accept: "application/json;odata=verbose",
                    "X-RequestDigest": formDigest
                }
            }).done(function (data) {
                callback(true);
            }).fail(function (j) {
                setInterval(checkFolder(teamSiteUrl, formDigest, callback), 1000);
            }); 
        }

        setContext();



        //ClearHtml();

        //var groupName;
        //var groupType;
        //var groupOwner;

        //$('#btnCreateTeam').on('click', function () {
        //    createGroup();
        //});

        //function createGroup() {
        //    $('#alert').text('Creando grupo...');
        //    $('#alert').show();

        //    groupName = $('#txtGroupName').val();
        //    groupType = $('#selectGroupType').val();
        //    groupOwner = $('#txtOwner').val();

        //    var data = new Object();
        //    data.description = groupName;
        //    data.displayName = groupName;
        //    data.groupTypes = ["Unified"];
        //    data.mailEnabled = true;
        //    data.mailNickname = groupName.toLowerCase().replace(/ /g, '');
        //    data.securityEnabled = false;

        //    console.log(data);

        //    var url = "https://graph.microsoft.com/v1.0/groups";

        //    var $ajax = $.ajax({
        //        url: url,
        //        type: "POST",
        //        dataType: "json",
        //        data: JSON.stringify(data),
        //        headers: {
        //            "Accept": "application/json;odata=verbose",
        //            "Content-Type": "application/json",
        //            "Content-Length": JSON.stringify(data).length
        //        }
        //    });

        //    $ajax.done(function (data, textStatus, jqXHR) {
        //        console.log(data);
        //    });

        //    $ajax.fail(function (jqXSR, text, err) {
        //        console.log(jqXSR);
        //        console.log(text);
        //        console.log(err);
        //    });
        //}
    };
}(jQuery));


jQuery(document).ready(function () {
    setHomePage();

    jQuery('#graph').each(function () {
        $(this).graph();
    });

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