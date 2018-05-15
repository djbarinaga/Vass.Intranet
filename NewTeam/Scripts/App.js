(function ($) {
    $.fn.wizard = function (options) {
        var $this = this;
        var currentStep = -1;
        var length = $('#wizard-steps .row').length;
        var totalSteps = 0;
        var currentAction = 0;

        $('#nextStep').on('click', function () {

            $('#wizard-steps .row').each(function (index) {
                if (!$(this).hasClass('d-none'))
                    currentStep = index;
            });

            if (currentStep < length - 1) {
                if (currentStep == 0 && $('#txtGroupName').val() == '') {
                    alert('Introduzca el nombre del equipo');
                    return;
                }

                if (currentStep == 1 && $('#txtOwner').val() == '') {
                    alert('Introduzca el email del propietario del equipo');
                    return;
                }

                $('#wizard-steps .row:eq(' + currentStep + ')').addClass('d-none');
                $('#wizard-steps .row:eq(' + (currentStep + 1) + ')').removeClass('d-none');
                $('#wizard-indicators p').each(function (index) {
                    if (index == currentStep + 1) {
                        $(this).removeClass('bg-secondary').addClass('bg-primary');
                    }
                    else {
                        $(this).removeClass('bg-primary').addClass('bg-secondary');
                    }
                });

                if (currentStep == 1)
                    createTeam();
            }

        });

        $('#prevStep').on('click', function () {

            $('#wizard-steps .row').each(function (index) {
                if (!$(this).hasClass('d-none'))
                    currentStep = index;
            });

            if (currentStep > 0) {
                $('#wizard-steps .row:eq(' + currentStep + ')').addClass('d-none');
                $('#wizard-steps .row:eq(' + (currentStep - 1) + ')').removeClass('d-none');

                $('#wizard-indicators p').each(function (index) {
                    if (index == currentStep - 1) {
                        $(this).removeClass('bg-secondary').addClass('bg-primary');
                    }
                    else {
                        $(this).removeClass('bg-primary').addClass('bg-secondary');
                    }
                });
            }
        });

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
                        choices: ['Horizontal', 'Vertical']
                    },
                    {
                        name: 'Origen',
                        kind: fieldKinds.Choice,
                        type: fieldTypes.Choice,
                        choices: ['Rq', 'Cu', 'Pr']
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

        function createTeam() {
            calculateProgress();

            $('.progress-bar').css('width', currentAction + 'px');

            var groupName = $('#txtGroupName').val();
            var mailNickName = groupName.toLowerCase().replace(/ /g, '');

            $('#alert').text('Creando grupo');

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

                    console.log('Grupo creado: ' + groupId);

                    currentAction++;
                    setProgress();

                    $('#alert').text('Añadiendo propietario al grupo');

                    //Asignamos el propietario
                    execute({
                        version: "v1.0",
                        endpoint: "/groups/" + groupId + "/owners/$ref",
                        type: "POST",
                        data: {
                            "@odata.id": "https://graph.microsoft.com/v1.0/users/" + $('#txtOwner').val()
                        },
                        callback: function (result) {

                            console.log('Propietario añadido');

                            currentAction++;
                            setProgress();

                            $('#alert').text('Creando equipo');

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
                                    console.log('Equipo creado en Teams');

                                    currentAction++;
                                    setProgress();

                                    createFolder(0);
                                }
                            })
                        }
                    })
                }
            });
        };

        function createFolder(index) {
            var teamName = $('#txtGroupName').val().toLowerCase().replace(/ /g, '');
            var teamSiteUrl = "https://grupovass.sharepoint.com/teams/" + teamName;

            $('#alert').text('Esperando la creación del sitio');

            checkSite(teamSiteUrl, function (formDigest) {
                checkFolder(teamSiteUrl, formDigest, function () {

                    $('#alert').text('Creando estructura de carpetas');

                    var create = function (index) {

                        if (index < folders.length) {
                            var folder = folders[index];

                            var folderName = '';

                            if (folder.parent == null)
                                folderName = folder.name;
                            else
                                folderName = folder.parent + "/" + folder.name

                            console.log('Creando carpeta ' + folder.name + ' en ' + folder.parent);

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

                                console.log('Carpeta creada');

                                currentAction++;
                                setProgress();

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
            $('#alert').text('Creando listas');

            var createList = function (url, index) {

                if (index < lists.length) {
                    var list = lists[index];

                    var listBody = {
                        '__metadata': {
                            'type': 'SP.List'
                        },
                        'BaseTemplate': 100,
                        'Description': list.name,
                        'Title': list.name
                    }

                    console.log('Creando lista ' + list.name);

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

                        console.log('Lista creada ' + list.id);

                        currentAction++;
                        setProgress();

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
                    $('#alert').text('Creando campos en listas');
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

                        console.log('Creando campo ' + field.name + ' en ' + list.name);

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
                            console.log('Campo creado');

                            addFieldToDefaultView(url, list, field, formDigest);

                            currentAction++;
                            setProgress();

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
                $('.progress-bar').css('width', '100%');
                $('#alert').text('Equipo creado');
            }
        }

        function addFieldToDefaultView(url, list, field, formDigest) {
            url += "/_api/web/lists/getbytitle('" + list.name + "')/DefaultView/ViewFields/AddViewField";

            console.log('Agregando campo ' + field.name + ' a vista por defecto');

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
                console.log('Campo agregado a la vista');
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

        function calculateProgress() {
            totalSteps = folders.length;
            totalSteps += lists.length;

            for (var i = 0; i < lists.length; i++) {
                var list = lists[i];
                var fields = list.fields;
                totalSteps += fields.length;
            }

            //Añadimos la creación del grupo + la asignación de propietario + creación de equipo
            totalSteps += 3;
        }

        function setProgress() {
            var currentProgress = (currentAction * 100) / totalSteps;
            $('.progress-bar').css('width', currentProgress + '%');
        }

        setContext();
    };
}(jQuery));
$(document).ready(function () {
    $('#graph-wizard').wizard();
})