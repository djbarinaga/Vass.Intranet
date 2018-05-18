Date.isLeapYear = function (year) {
    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
};

Date.getDaysInMonth = function (year, month) {
    return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};

Date.prototype.isLeapYear = function () {
    return Date.isLeapYear(this.getFullYear());
};

Date.prototype.getDaysInMonth = function () {
    return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
};

Date.prototype.addMonths = function (value) {
    var n = this.getDate();
    this.setDate(1);
    this.setMonth(this.getMonth() + value);
    this.setDate(Math.min(n, this.getDaysInMonth()));
    return this;
};

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
                else if (bgImagen == '') {
                    jQuery($this).css('background-color', bgColor);
                }
                else if (result.Icon != null) {
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

(function ($) {
    $.fn.wizard = function (options) {
        setContext(variables.clientId.Teams);

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

        function createTeam() {

            calculateProgress();

            $('.progress-bar').css('width', currentAction + 'px');

            var groupName = $('#txtGroupName').val();
            var mailNickName = groupName.toLowerCase().replace(/ /g, '');

            $('#alert').text('Creando grupo');

            //Creamos el grupo
            execute({
                clientId: variables.clientId.Teams,
                version: "v1.0",
                endpoint: "/groups",
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
                        clientId: variables.clientId.Teams,
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
                                clientId: variables.clientId.Teams,
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
                addTeamToList(function () {
                    $('#alert').text('Equipo creado');
                    window.location.href = 'https://grupovass.sharepoint.com/desarrollo/mitrabajo/Lists/Teams/AllItems.aspx';
                });
            }
        }

        function addTeamToList(callback) {
            $('#alert').text('Agregando equipo a la lista de equipos');

            var item = {
                "__metadata": { "type": itemType },
                "Title": 'SP.Data.TeamsListItem',
                "Tipo": 'Proyecto'
            };

            $.ajax({
                url: "https://grupovass.sharepoint.com/desarrollo/mitrabajo/_api/web/lists/getbytitle('Teams')/items",
                type: "POST",
                contentType: "application/json;odata=verbose",
                data: JSON.stringify(item),
                headers: {
                    "Accept": "application/json;odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val()
                }
            }).done(function (data) {
                if (callback != null)
                    callback();
            }).fail(function (data) {
                console.log(data);
            });
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
    };
}(jQuery));

/*MI CALENDARIO PLUGIN*/
(function ($) {
    $.fn.mycalendar = function (options) {
        setContext(variables.clientId.Events);
        var events;
        var today = new Date();
        var months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        var daysInMonth = [31, (Date.isLeapYear(today.getFullYear()) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        var selectedDate;
        var currentMonthName;
        var lastDay;

        function init(date) {
            if (date == null)
                selectedDate = today;
            else {
                selectedDate = date;
            }

            var currentMonth = selectedDate.getMonth();

            currentMonthName = months[Number(currentMonth)];
            lastDay = daysInMonth[Number(currentMonth)];

            var startDate = selectedDate.getFullYear() + '-' + (Number(currentMonth) + 1) + '-01';
            var endDate = selectedDate.getFullYear() + '-' + (Number(currentMonth) + 1) + '-' + lastDay;

            var endpoint = "/me/events?$filter=start/dateTime ge '" + startDate + "' and end/dateTime le '" + endDate + "'";

            execute({
                clientId: variables.clientId.Events,
                version: "v1.0",
                endpoint: endpoint,
                type: "GET",
                callback: setCalendar
            });
        }

        function renderCalendar() {
            $('#calendar .days').empty();
            $('.current-month').text(currentMonthName + ' ' + selectedDate.getFullYear());

            var firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
            var dayOfWeek = firstDayOfMonth.getDay() - 1;
            if (dayOfWeek < 0)
                dayOfWeek = 6;

            //Pintamos los días vacíos
            for (var i = 0; i < dayOfWeek; i++) {
                $('#calendar .days').append('<li></li>');
            }

            for (var i = 0; i < lastDay; i++) {
                var day = i + 1;
                $('#calendar .days').append('<li><span>' + day + '</span></li>');
            }

            for (var i = 0; i < events.length; i++) {
                var event = events[i];
                var eventDate = new Date(event.start.dateTime);
                var eventStartDay = eventDate.getDate();
                var eventEndDate = new Date(event.end.dateTime);
                var eventEndDay = eventEndDate.getDate();

                var dayDiff = eventEndDay - eventStartDay;
                var selectedDay = eventStartDay - 1;

                for (var j = 0; j <= dayDiff; j++) {
                    selectedDay += 1;
                    $("#calendar .days li").filter(function () {
                        return $(this).text() === selectedDay.toString();
                    }).addClass('active');
                }
            }

            $('#calendar .days li.active').each(function () {
                $(this).on('click', function () {
                    var dayDate = Number($(this).text());
                    var selectedDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), dayDate);
                    renderEvents(selectedDay);

                });
            });

            renderEvents();
        }

        function renderEvents(currentDate) {
            if (currentDate == null)
                currentDate = getFirstDate();

            if (events.length > 0) {
                var length = events.length;

                $('.event-day').text(daysOfWeek[currentDate.getDay()]);
                $('.event-day-number').text(currentDate.getDate());
                $('.event-month').text(currentMonthName);
                $('.events').empty();

                var today = currentDate.getDate();
                var addedEvents = new Array();

                for (var i = 0; i < length; i++) {
                    var event = events[i];
                    var eventDate = new Date(event.start.dateTime);
                    var eventDay = eventDate.getDate();
                    var eventEndDate = new Date(event.end.dateTime);
                    var eventEndDay = eventEndDate.getDate();

                    if ((today >= eventDay && today <= eventEndDay) && addedEvents.indexOf(today + ":" + event.subject) == -1) {
                        var eventHours = eventDate.getHours();
                        var eventMinutes = eventDate.getMinutes();
                        if (eventHours < 10)
                            eventHours = '0' + eventHours;
                        if (eventMinutes < 10)
                            eventMinutes = '0' + eventMinutes;

                        $('.events').append('<li><span class="clock">' + eventHours + ':' + eventMinutes + '</span><span>' + event.subject + '</span></li>');
                        addedEvents.push(today + ":" + event.subject);
                    }
                }

                $('.event-date').append('<a target="_bank" href="https://outlook.office.com/owa/?realm=vass.es&exsvurl=1&ll-cc=3082&modurl=1&path=/calendar/view/Month">Ver todo</a>');
            }
        }

        function setCalendar(data) {
            events = data.value;

            renderCalendar();
        }

        function getFirstDate() {
            var currentDate = null;

            for (var i = 0; i < events.length; i++) {
                var event = events[i];
                var eventDate = new Date(event.start.dateTime);


                if (i == 0) {
                    currentDate = eventDate;
                }
                else {
                    var diff = dateDiff(eventDate, currentDate);
                    if (diff > 0)
                        currentDate = eventDate;
                }
            }

            return currentDate;
        }

        //Botones para desplazarse por los meses
        $('#calendar .month .next a').on('click', function () {
            var newDate = selectedDate.addMonths(1);
            init(newDate);
            return false;
        });

        $('#calendar .month .prev a').on('click', function () {
            var newDate = selectedDate.addMonths(-1);
            init(newDate);
            return false;
        });

        init();
    };
}(jQuery));

/*EVENTOS PLUGIN*/
(function ($) {
    $.fn.events = function (options) {
        var $this = this;
        var url = "https://grupovass.sharepoint.com/es-es/_api/web/lists/GetByTitle('Calendario VASS')/items?$top=2&$orderby=EventDate";

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
            console.log(results);
            if (results != null && results.length > 0) {
                for (var i = 0; i < results.length; i++) {
                    var result = results[i];
                    var title = result.Title;
                    var description = result.Description;
                    var date = new Date(result.EventDate);
                    var dateAsString = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();

                    $($this).append('<li><h4>' + title + '</h4>' + description + '<span class="date">' + dateAsString + '</span></li>');
                }
            }
        });
    };
}(jQuery));


jQuery(document).ready(function () {
    //localStorage.clear();

    setHomePage();

    jQuery('#graph-wizard').each(function () {
        $(this).wizard();
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

    jQuery('#calendar').each(function () {
        $(this).mycalendar();
    });

    jQuery('#vass-calendar').each(function () {
        $(this).events();
    });
});

function setHomePage() {
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