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
        var fieldKinds = {
            Text: 2,
            DateTime: 4,
            Note: 3,
            User: 20,
            Lookup: 7,
            Choice: 6,
            Number: 9
        }
        var fieldTypes = {
            Text: 'SP.FieldText',
            DateTime: 'SP.FieldDateTime',
            Note: 'SP.FieldMultiLineText',
            User: 'SP.Field',
            Lookup: 'SP.FieldLookup',
            Choice: 'SP.FieldChoice',
            Number: 'SP.FieldNumber'
        }

        var folders = [
            {
                name: "05_CIERRE",
                parent: null
            },
            {
                name: "03_POSTMORTEM",
                parent: "05_CIERRE"
            },
            {
                name: "02_EVALUACIONES",
                parent: "05_CIERRE"
            },
            {
                name: "01_ENCUESTA_SATISFACCION",
                parent: "05_CIERRE"
            },
            {
                name: "04_RESEARCH",
                parent: null
            },
            {
                name: "03_PROYECTO",
                parent: null
            },
            {
                name: "07_ENTREGAS",
                parent: "03_PROYECTO"
            },
            {
                name: "06_CALIDAD",
                parent: "03_PROYECTO"
            },
            {
                name: "05_EJECUCION",
                parent: "03_PROYECTO"
            },
            {
                name: "04_DEFINICIONES_REQUERIMIENTOS",
                parent: "03_PROYECTO"
            },
            {
                name: "03_ENTORNOS",
                parent: "03_PROYECTO"
            },
            {
                name: "02_DISEÑOS",
                parent: "03_PROYECTO"
            },
            {
                name: "01_ARQUITECTURA",
                parent: "03_PROYECTO"
            },
            {
                name: "02_GESTION",
                parent: null
            },
            {
                name: "04_ACTAS",
                parent: "02_GESTION"
            },
            {
                name: "03_SEGUIMIENTO",
                parent: "02_GESTION"
            },
            {
                name: "02_PLANIFICACION",
                parent: "02_GESTION"
            },
            {
                name: "01_ECONOMICS",
                parent: "02_GESTION"
            },
            {
                name: "01_OFERTA",
                parent: null
            },
            {
                name: "00_DOCUMENTACION_CLIENTE",
                parent: null
            }
        ]

        var lists = [
            {
                name: 'Requisitos',
                fields: [
                    {
                        name: 'Identificador',
                        kind: fieldKinds.Text,
                        type: 'SP.FieldText'
                    },
                    {
                        name: 'Nombre requisito',
                        kind: fieldKinds.Text,
                        type: 'SP.FieldText'
                    },
                    {
                        name: 'Tipo requisito',
                        kind: fieldKinds.Choice,
                        choices: ['01-Funcionalidad', '02-Usabilidad', '03-Fiabilidad', '04-Rendimiento', '05-Seguridad'],
                        type: 'SP.FieldChoice'
                    },
                    {
                        name: 'Dependencia requisito',
                        kind: fieldKinds.Lookup,
                        type: 'SP.FieldLookup',
                        lookupFieldName: 'Title',
                        lookupList: 'Requisitos'
                    },
                    {
                        name: 'Criterios Aceptación',
                        kind: fieldKinds.Note,
                        type: 'SP.FieldMultiLineText'
                    },
                    {
                        name: 'Fecha recepción',
                        kind: fieldKinds.DateTime,
                        type: 'SP.FieldDateTime'
                    },
                    {
                        name: 'Estado de Aprobacion',
                        kind: fieldKinds.Choice,
                        choices: ['Borrador', 'Aprobado'],
                        type: 'SP.FieldChoice'
                    }
                ]
            },
            {
                name: 'Cambios de alcance',
                fields: [
                    {
                        name: 'Identificador',
                        kind: fieldKinds.Text,
                        type: fieldTypes.Text
                    },
                    {
                        name: 'Nombre',
                        kind: fieldKinds.Text,
                        type: fieldTypes.Text
                    },
                    {
                        name: 'Fecha Recepcion',
                        kind: fieldKinds.DateTime,
                        type: fieldTypes.DateTime
                    },
                    {
                        name: 'Descripción cambio',
                        kind: fieldKinds.Note,
                        type: fieldTypes.Note
                    },
                    {
                        name: 'Solicitado por',
                        kind: fieldKinds.User,
                        type: fieldTypes.User
                    },
                    {
                        name: 'Estado cambio',
                        kind: fieldKinds.Choice,
                        type: fieldTypes.Choice,
                        choices: ['No iniciado', 'Borrador', 'Revisado', 'Programada', 'Publicado', 'Final', 'Caducado']
                    },
                    {
                        name: 'Implicaciones',
                        kind: fieldKinds.Note,
                        type: fieldTypes.Note
                    },
                    {
                        name: 'Requisitos afectados',
                        kind: fieldKinds.Lookup,
                        type: fieldTypes.Lookup,
                        lookupFieldName: 'Title',
                        lookupList: 'Requisitos'
                    }
                ]
            },
            {
                name: 'Casos de uso',
                fields: [
                    {
                        name: 'Identificador',
                        kind: fieldKinds.Text,
                        type: fieldTypes.Text
                    },
                    {
                        name: 'Nombre del caso de uso',
                        kind: fieldKinds.Text,
                        type: fieldTypes.Text
                    },
                    {
                        name: 'Prioridad del caso de uso',
                        kind: fieldKinds.Choice,
                        type: fieldTypes.Choice,
                        choices: ['01-Alto', '02-Media', '03-Baja']
                    },
                    {
                        name: 'Estado del caso de uso',
                        kind: fieldKinds.Choice,
                        type: fieldTypes.Choice,
                        choices: ['01-Nuevo', '02-Revisado', '03-Aprobado']
                    },
                    {
                        name: 'Actores',
                        kind: fieldKinds.Text,
                        type: fieldTypes.Text
                    },
                    {
                        name: 'Resumen',
                        kind: fieldKinds.Note,
                        type: fieldTypes.Note
                    },
                    {
                        name: 'Pre-condiciones',
                        kind: fieldKinds.Note,
                        type: fieldTypes.Note
                    },
                    {
                        name: 'Post-condiciones',
                        kind: fieldKinds.Note,
                        type: fieldTypes.Note
                    },
                    {
                        name: 'Flujo principal',
                        kind: fieldKinds.Note,
                        type: fieldTypes.Note
                    },
                    {
                        name: 'Flujos alternativos',
                        kind: fieldKinds.Note,
                        type: fieldTypes.Note
                    },
                    {
                        name: 'Requisito',
                        kind: fieldKinds.Lookup,
                        type: fieldTypes.Lookup,
                        lookupFieldName: 'Title',
                        lookupList: 'Requisitos'
                    },
                    {
                        name: 'Dependencia caso de uso',
                        kind: fieldKinds.Lookup,
                        type: fieldTypes.Lookup,
                        lookupFieldName: 'Nombre del caso de uso',
                        lookupList: 'Casos de uso'
                    }
                ]
            },
            {
                name: 'Implicados',
                fields: [
                    {
                        name: 'Nombre',
                        kind: fieldKinds.Text,
                        type: fieldTypes.Text,
                    },
                    {
                        name: 'Email',
                        kind: fieldKinds.Text,
                        type: fieldTypes.Text,
                    },
                    {
                        name: 'Rol',
                        kind: fieldKinds.Choice,
                        type: fieldTypes.Choice,
                        choices: ['JP', 'AF', 'AP', 'PR', 'TS', 'AR', 'MQ']
                    },
                    {
                        name: 'Tipo de implicado',
                        kind: fieldKinds.Choice,
                        type: fieldTypes.Choice,
                        choices: ['Equipo VASS', 'Cliente', 'Otro']
                    },
                    {
                        name: 'Fecha inicio',
                        kind: fieldKinds.DateTime,
                        type: fieldTypes.DateTime
                    },
                    {
                        name: 'Fecha fin',
                        kind: fieldKinds.DateTime,
                        type: fieldTypes.DateTime
                    },
                    {
                        name: 'Disponibilidad',
                        kind: fieldKinds.Number,
                        type: fieldTypes.Number
                    }
                ]
            },
            {
                name: 'Comunicaciones',
                fields: [
                    {
                        name: 'Tipo de comunicación',
                        kind: fieldKinds.Choice,
                        type: fieldTypes.Choice,
                        choices: ['Comité', 'Reunión', 'Correo']
                    },
                    {
                        name: 'Periodicidad',
                        kind: fieldKinds.Choice,
                        type: fieldTypes.Choice,
                        choices: ['Diaria', 'Semanal', 'Quicenal', 'Mensual', 'Bimensual', 'Trimestral', 'Semestral', 'Anual']
                    },
                    {
                        name: 'Responsable',
                        kind: fieldKinds.Lookup,
                        type: fieldTypes.Lookup,
                        lookupFieldName: 'Nombre',
                        lookupList: 'Implicados'
                    },
                    {
                        name: 'Destinatarios',
                        kind: fieldKinds.Lookup,
                        type: fieldTypes.Lookup,
                        lookupFieldName: 'Nombre',
                        lookupList: 'Implicados'
                    },
                    {
                        name: 'Documento generado',
                        kind: fieldKinds.Text,
                        type: fieldTypes.Text
                    }
                ]
            },
            {
                name: 'Roles',
                fields: [
                    {
                        name: 'Rol',
                        kind: fieldKinds.Text,
                        type: fieldTypes.Text
                    }
                ]
            },
            {
                name: 'Formación',
                fields: [
                    {
                        name: 'Formación',
                        kind: fieldKinds.Text,
                        type: fieldTypes.Text
                    },
                    {
                        name: 'Cuando',
                        kind: fieldKinds.DateTime,
                        type: fieldTypes.DateTime
                    },
                    {
                        name: 'Rol',
                        kind: fieldKinds.Lookup,
                        type: fieldTypes.Lookup,
                        lookupFieldName: 'Rol',
                        lookupList: 'Roles'
                    }
                ]
            },
            {
                name: 'KICKOFF',
                fields: [
                    {
                        name: 'Objetivos del proyecto',
                        kind: fieldKinds.Note,
                        type: fieldTypes.Note
                    },
                    {
                        name: 'Alcance',
                        kind: fieldKinds.Note,
                        type: fieldTypes.Note
                    },
                    {
                        name: 'Tipo de proyecto',
                        kind: fieldKinds.Choice,
                        type: fieldTypes.Choice,
                        choices: ['Llave en mano', 'Mantenimiento', 'MVP']
                    },
                    {
                        name: 'Ciclo de vida',
                        kind: fieldKinds.Choice,
                        type: fieldTypes.Choice,
                        choices: ['Cascada', 'Corto', 'Iterativo']
                    }
                ]
            },
            {
                name: 'Tipos responsabilidades',
                fields: [
                    {
                        name: 'Responsabilidades',
                        kind: fieldKinds.Text,
                        type: fieldTypes.Text
                    }
                ]
            },
            {
                name: 'Plan Roles Responsabilidades',
                fields: [
                    {
                        name: 'Rol',
                        kind: fieldKinds.Lookup,
                        type: fieldTypes.Lookup,
                        lookupFieldName: 'Rol',
                        lookupList: 'Roles'
                    },
                    {
                        name: 'Responsabilidades',
                        kind: fieldKinds.Lookup,
                        type: fieldTypes.Lookup,
                        lookupFieldName: 'Responsabilidades',
                        lookupList: 'Tipos responsabilidades'
                    }
                ]
            },
            {
                name: 'Riesgos',
                fields: [
                    {
                        name: 'Nombre Riesgo',
                        kind: fieldKinds.Text,
                        type: fieldTypes.Text
                    },
                    {
                        name: 'Descripcion Riesgo',
                        kind: fieldKinds.Note,
                        type: fieldTypes.Note
                    },
                    {
                        name: 'Impacto',
                        kind: fieldKinds.Choice,
                        type: fieldTypes.Choice,
                        choices: ['Alto', 'Medio', 'Bajo']
                    },
                    {
                        name: 'Plan de Accion Definido',
                        kind: fieldKinds.Note,
                        type: fieldTypes.Note
                    },
                    {
                        name: 'Responsable Accion',
                        kind: fieldKinds.User,
                        type: fieldTypes.User
                    },
                    {
                        name: 'Resultado Esperado del Plan de Accion',
                        kind: fieldKinds.Note,
                        type: fieldTypes.Note
                    },
                    {
                        name: 'Resultados Reales del Plan de Accion',
                        kind: fieldKinds.Note,
                        type: fieldTypes.Note
                    },
                    {
                        name: 'Fecha Estimada Inicio Ejecucion',
                        kind: fieldKinds.DateTime,
                        type: fieldTypes.DateTime
                    },
                    {
                        name: 'Fecha Estimada Fin Plan Accion',
                        kind: fieldKinds.DateTime,
                        type: fieldTypes.DateTime
                    },
                    {
                        name: 'Fecha Real de Inicio de Plan',
                        kind: fieldKinds.DateTime,
                        type: fieldTypes.DateTime
                    },
                    {
                        name: 'Fecha Real Fin de Plan',
                        kind: fieldKinds.DateTime,
                        type: fieldTypes.DateTime
                    },
                    {
                        name: 'Prioridad Ejecucion Plan de Accion',
                        kind: fieldKinds.Choice,
                        type: fieldTypes.Choice,
                        choices: ['Alto', 'Medio', 'Bajo']
                    },
                    {
                        name: 'Descripcion Impacto',
                        kind: fieldKinds.Choice,
                        type: fieldTypes.Choice,
                        choices: ['Alto', 'Medio', 'Bajo']
                    },
                    {
                        name: 'Umbral Teorico Riesgo',
                        kind: fieldKinds.Number,
                        type: fieldTypes.Number
                    },
                    {
                        name: 'Valoracion Impacto',
                        kind: fieldKinds.Choice,
                        type: fieldTypes.Choice,
                        choices: ['Alto', 'Medio', 'Bajo']
                    },
                    {
                        name: 'Probabilidad',
                        kind: fieldKinds.Choice,
                        type: fieldTypes.Choice,
                        choices: ['Alto', 'Medio', 'Bajo']
                    },
                    {
                        name: 'Probabilidad Valoracion',
                        kind: fieldKinds.Choice,
                        type: fieldTypes.Choice,
                        choices: ['Alto', 'Medio', 'Bajo']
                    },
                    {
                        name: 'Probabilidad Valoracion Probabilidad',
                        kind: fieldKinds.Choice,
                        type: fieldTypes.Choice,
                        choices: ['Alto', 'Medio', 'Bajo']
                    },
                    {
                        name: 'Estado Riesgo Nombre',
                        kind: fieldKinds.Choice,
                        type: fieldTypes.Choice,
                        choices: ['Alto', 'Medio', 'Bajo']
                    },
                    {
                        name: 'Estado Riesgo',
                        kind: fieldKinds.Choice,
                        type: fieldTypes.Choice,
                        choices: ['Alto', 'Medio', 'Bajo']
                    }
                ]
            },
            {
                name: 'Trazabilidad',
                fields: [
                    {
                        name: 'Tipo de traza',
                        kind: fieldKinds.Choice,
                        type: fieldTypes.Choice,
                        choices: ['Horizontal','Vertical']
                    },
                    {
                        name: 'Origen',
                        kind: fieldKinds.Choice,
                        type: fieldTypes.Choice,
                        choices: ['Rq','Cu','Pr']
                    },
                    {
                        name: 'Destino',
                        kind: fieldKinds.Choice,
                        type: fieldTypes.Choice,
                        choices: ['Rq', 'Cu', 'Pr']
                    }
                ]
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

            $('#alert').text('Esperando la creación del sitio ' + teamSiteUrl);

            checkSite(teamSiteUrl, function (formDigest) {
                checkFolder(teamSiteUrl, formDigest, function () {

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
                                    "X-RequestDigest": formDigest
                                }
                            }).done(function (data) {
                                index++;
                                create(index);
                            }).fail(function (j) {
                                console.log(j);
                            });
                        }
                        else {
                            createLists(teamSiteUrl, 0, formDigest);
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

        function checkSite(teamSiteUrl, callback) {

            var url = teamSiteUrl + "/_api/contextinfo";

            $.ajax({
                url: url,
                method: "POST",
                headers: { Accept: "application/json;odata=verbose", "X-RequestDigest": $("#__REQUESTDIGEST").val() }
            }).done(function (data) {
                if (data == null || data.d == null || data.d.GetContextWebInformation == null || data.d.GetContextWebInformation.FormDigestValue == null)
                    setInterval(checkSite(teamSiteUrl, callback), 2000);
                else
                    callback(data.d.GetContextWebInformation.FormDigestValue);
            }).fail(function (j) {
                setInterval(checkSite(teamSiteUrl, callback), 2000);
            });
        }

        function createLists(url, index, formDigest) {
            var createList = function (url, index) {

                if (index < lists.length) {
                    var list = lists[index];

                    $('#alert').text('Creando lista ' + list.name);

                    var listBody = {
                        '__metadata': {
                            'type': 'SP.List'
                        },
                        'BaseTemplate': 100,
                        'Description': list.name,
                        'Title': list.name
                    }

                    var $ajax = $.ajax({
                        url: url + '/_api/web/lists',
                        type: "POST",
                        data: JSON.stringify(listBody),
                        dataType: "json",
                        headers: {
                            Accept: "application/json;odata=verbose",
                            "content-type": "application/json;odata=verbose",
                            "X-RequestDigest": formDigest
                        }
                    });

                    $ajax.done(function (data) {
                        list.id = data.d.Id;
                        index++;
                        createList(url, index);
                    });

                    $ajax.fail(function (jqXSR, text, err) {
                        console.log(jqXSR);
                        console.log(text);
                        console.log(err);
                    });
                }
                else {
                    createFields(url, formDigest, 0);
                }
            }

            createList(url, index, formDigest);
        }

        function createFields(url, formDigest, index) {
            if (index < lists.length) {
                var list = lists[index];
                var listTitle = list.name;
                var listUrl = url + "/_api/web/lists/getbytitle('" + list.name + "')/fields";

                var createField = function (listUrl, formDigest, list, fieldIndex, listIndex) {
                    if (fieldIndex < list.fields.length) {
                        var auxUrl = listUrl;
                        var field = list.fields[fieldIndex];

                        $('#alert').text('Creando campo ' + field.name + ' en ' + list.name);

                        var fieldBody = {};

                        switch (field.kind) {
                            case fieldKinds.Lookup:
                                var listId = getListId(field.lookupList);
                                var lookupField = field.lookupFieldName;
                                auxUrl += '/addfield';

                                fieldBody = {
                                    'parameters': {
                                        '__metadata': {
                                            'type': 'SP.FieldCreationInformation'
                                        },
                                        'FieldTypeKind': field.kind,
                                        'Title': field.name,
                                        'LookupListId': listId,
                                        'LookupFieldName': lookupField
                                    }
                                }
                                break;
                            case fieldKinds.User:
                                fieldBody = {
                                    '__metadata': {
                                        'type': 'SP.Field'
                                    },
                                    'FieldTypeKind': field.kind,
                                    'Title': field.name,
                                    'SchemaXml': '<Field Type=\"UserMulti\" Required=\"FALSE\" UserSelectionMode=\"PeopleAndGroups\" UserSelectionScope=\"0\" Mult=\"TRUE\" DisplayName="' + field.name + '" Title="' + field.name + '" StaticName="' + field.name.replace(/ /g, '') + '"/>'
                                }
                                break;
                            default:
                                fieldBody = {
                                    '__metadata': {
                                        'type': field.type
                                    },
                                    'FieldTypeKind': field.kind,
                                    'Title': field.name
                                };

                                if (field.kind == fieldKinds.Choice) {
                                    fieldBody['Choices'] = {
                                        'results': field.choices
                                    }
                                }
                                break;
                        }



                        var $ajax = $.ajax({
                            url: auxUrl,
                            type: "POST",
                            data: JSON.stringify(fieldBody),
                            dataType: "json",
                            headers: {
                                Accept: "application/json;odata=verbose",
                                "content-type": "application/json;odata=verbose",
                                "X-RequestDigest": formDigest
                            }
                        });

                        $ajax.done(function (data) {
                            addFieldToDefaultView(url, list, field, formDigest);
                            fieldIndex++;
                            createField(listUrl, formDigest, list, fieldIndex, listIndex);
                        });

                        $ajax.fail(function (jqXSR, text, err) {
                            console.log(jqXSR);
                            console.log(text);
                            console.log(err);
                        });
                    }
                    else {
                        listIndex++;
                        createFields(url, formDigest, listIndex);
                    }
                };

                createField(listUrl, formDigest, list, 0, index);
            }
            else {
                $('#alert').text('Equipo creado!');
            }
        }

        function addFieldToDefaultView(url, list, field, formDigest) {
            url += "/_api/web/lists/getbytitle('" + list.name + "')/DefaultView/ViewFields/AddViewField";

            var body = {
                'strField': field.name
            }

            var $ajax = $.ajax({
                url: url,
                type: "POST",
                data: JSON.stringify(body),
                dataType: "json",
                headers: {
                    Accept: "application/json;odata=verbose",
                    "content-type": "application/json;odata=verbose",
                    "X-RequestDigest": formDigest
                }
            });

            $ajax.done(function (data) {
                console.log(data);
            });

            $ajax.fail(function (jqXSR, text, err) {
                console.log(jqXSR);
                console.log(text);
                console.log(err);
            });
        }

        function getListId(title) {
            var listId;
            for (var i = 0; i < lists.length; i++) {
                var list = lists[i];
                if (list.name == title) {
                    listId = list.id;
                    break;
                }
            }

            return listId;
        }

        setContext();
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