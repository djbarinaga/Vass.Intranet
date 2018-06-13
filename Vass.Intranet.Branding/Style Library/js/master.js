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

/*MENU PLUGIN*/
(function ($) {
    $.fn.menu = function (options) {
        var $this = this;
        $(this).on('click', function () {
            var span = $(this).find('span');

            var toggleCurrentMenu = function () {
                $('#current-menu').animate(
                    {
                        width: 'toggle'
                    },
                    {
                        complete: function () {
                            if ($(span).hasClass('icon-menu_cierra')) {
                                $(span).removeClass('icon-menu_cierra').addClass('icon-menu');
                                $('#page-title').animate({
                                    'padding-left': '32px'
                                });
                            }
                            else {
                                $(span).removeClass('icon-menu').addClass('icon-menu_cierra');
                                $('#page-title').animate({
                                    'padding-left': '0px'
                                });
                            }
                        }
                    }
                );
            }

            if (!$('#current-submenu').data('hidden')) {
                $('#current-submenu').animate(
                    {
                        width: 'toggle'
                    },
                    {
                        complete: function () {
                            toggleCurrentMenu();
                        }
                    }
                );
            }
            else {
                $('#current-submenu').hide();
                toggleCurrentMenu();
            }
            
        });
    };
}(jQuery));

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
        var location = window.location.href;
        if (location.indexOf('k=') > -1) {
            var locationSplit = location.split('k=');
            $(this).val(decodeURIComponent(locationSplit[1]));
        }

        $(this).on('keydown', function (ev) {
            var resultPages = ['paginas.aspx', 'documentos.aspx', 'personas.aspx'];
            var language = _spPageContextInfo.currentCultureName;
            var searchUrl = '/' + language;
            if (language == 'es-ES') {
                searchUrl += '/Paginas/';
            }

            var currentPage = location.substring(0, location.indexOf('?'));
            currentPage = currentPage.substring(currentPage.lastIndexOf('/') + 1);

            if (resultPages.indexOf(currentPage) > -1)
                searchUrl += currentPage;
            else
                searchUrl += 'paginas.aspx';

            if (ev.keyCode == 13) {
                ev.preventDefault();
                window.location.href = searchUrl + '?k=' + decodeURIComponent($(this).val());
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
        var url = _spPageContextInfo.webServerRelativeUrl + "/_api/web/lists/getbytitle('Banners')/items?$filter=Banner eq '" + bannerZone + "'";

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
                
                var bgColor;
                var bgImagen = '/Style library/images/';

                switch (result.Color) {
                    case 'Azul':
                        bgColor = 'bg-blue';
                        break;
                    case 'Morado':
                        bgColor = 'bg-purple';
                        break;
                    case 'Violeta':
                        bgColor = 'bg-violet';
                        break;
                    case 'Naranja':
                        bgColor = 'bg-orange';
                        break;
                    case 'Verde':
                        bgColor = 'bg-green';
                        break;
                    case 'Caqui':
                        bgColor = 'bg-khaki';
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

                var imageDiv = $('<div/>');
                jQuery($this).append(imageDiv);

                var panelBody = $('<div class="panel-body"/>');
                $(imageDiv).append(panelBody);

                var link = jQuery('<a href="' + result.URL.Url + '">' + result.Title + '</a>');

                jQuery(panelBody).empty();
                jQuery(panelBody).append(link);

                if (result.Image != null) {
                    jQuery(imageDiv).addClass('image');
                    jQuery(imageDiv).css('background', 'url("' + bgImagen + '") no-repeat');
                    jQuery(imageDiv).css('background-size', 'cover');
                }
                else if (result.Icon != null) {
                    jQuery(imageDiv).css('background', 'url("' + bgImagen + '") no-repeat 90% 90%');
                }

                if (bgColor != null)
                    jQuery(imageDiv).addClass(bgColor);

                if (result.Description == null)
                    $(link).addClass('w-75');
                else
                    jQuery(panelBody).append('<p class="w-75">' + result.Description + '</p>');
            }
        });
    };
}(jQuery));

/*WIZARD*/
(function ($) {
    $.fn.wizard = function (options) {
        setContext(variables.clientId.Graph);

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

                if (currentStep == 2 && $('input[name=teamType]:checked').val() == null) {
                    alert('Seleccione el tipo de proyecto');
                    return;
                }

                $('#wizard-indicators div').removeClass('active');
                $('#wizard-steps .row:eq(' + currentStep + ')').addClass('d-none');
                $('#wizard-steps .row:eq(' + (currentStep + 1) + ')').removeClass('d-none');
                $('#wizard-indicators div').each(function (index) {
                    if (index == currentStep + 1) {
                        $(this).addClass('active');
                        $(this).prev().addClass('completed');
                    }
                });

                if (currentStep == 2)
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
                $('#wizard-indicators div').removeClass('active');

                $('#wizard-indicators div').each(function (index) {
                    if (index == currentStep - 1) {
                        $(this).removeClass('completed');
                        $(this).addClass('active');
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
                clientId: variables.clientId.Graph,
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
                        clientId: variables.clientId.Graph,
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
                                clientId: variables.clientId.Graph,
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
                setInterval(checkFolder(teamSiteUrl, formDigest, callback), 3000);
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
                    setInterval(checkSite(teamSiteUrl, callback), 3000);
                else
                    callback(data.d.GetContextWebInformation.FormDigestValue);
            }).fail(function (j) {
                setInterval(checkSite(teamSiteUrl, callback), 3000);
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
                    window.location.href = 'https://grupovass.sharepoint.com/es-es/mitrabajo/Lists/Teams/AllItems.aspx';
                });
            }
        }

        function addTeamToList(callback) {
            $('#alert').text('Agregando equipo a la lista de equipos');

            var item = {
                "__metadata": { "type": 'SP.Data.TeamsListItem' },
                "Title": $('#txtGroupName').val(),
                "TeamType": $('input[name=teamType]:checked').val()
            };

            $.ajax({
                url: "https://grupovass.sharepoint.com/es-es/mitrabajo/_api/web/lists/getbytitle('Teams')/items",
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
        setContext(variables.clientId.Graph);
        var $this = $(this);
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
                clientId: variables.clientId.Graph,
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

            if (currentDate == null)
                currentDate = new Date();


            $('.event-day').text(daysOfWeek[currentDate.getDay()]);
            $('.event-day-number').text(currentDate.getDate());
            $('.event-month').text(currentMonthName);
            $('.events').empty();


            if (events.length > 0) {
                var length = events.length;

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
        var parent = $(this).prev();

        $(parent).css('cursor', 'pointer');
        $(parent).on('click', function () {
            window.location.href = 'https://grupovass.sharepoint.com/es-es/businessvalue/marketing/Paginas/eventos.aspx';
        })

        var url = "https://grupovass.sharepoint.com/es-es/businessvalue/marketing/_api/web/lists/GetByTitle('Eventos')/items?$top=2&$orderby=EventDate";

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
                for (var i = 0; i < results.length; i++) {
                    var result = results[i];
                    var title = result.Title;
                    var description = result.Description;
                    var date = new Date(result.EventDate);
                    var dateAsString = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();

                    $($this).append('<li><h4>' + title + '</h4>' + description + '<span class="icon-calendario"></span>' + dateAsString + '</li>');
                }
            }
        });
    };
}(jQuery));

/*CAROUSEL PLUGIN*/
(function ($) {
    $.fn.carousel = function (options) {
        var $this = this;
        var url = "https://grupovass.sharepoint.com/_api/search/query?querytext='HomeHighlight:true'&trimduplicates=false&selectproperties='Title%2cPath%2cPublishingImage%2cHitHighlightedSummary'";

        var $ajax = $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            headers: {
                Accept: "application/json;odata=verbose"
            }
        });

        $ajax.fail(function (data, textStatus, jqXHR) {
            console.log(data);
        });

        $ajax.done(function (data) {
            var totalRows = data.d.query.PrimaryQueryResult.RelevantResults.TotalRows;
            var results = data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results; 

            if (totalRows > 0) {
                var carouselInner = $($this).find('.carousel-inner');
                carouselInner.empty();

                for (var i = 0; i < results.length; i++) {
                    var result = results[i];
                    var fields;
                    var title;
                    var description;
                    var image;
                    var url;
                    var img;

                    fields = result.Cells.results;
                    title = getValue(fields, 'Title');
                    description = getValue(fields, 'HitHighlightedSummary');
                    image = getValue(fields, 'PublishingImage');
                    url = getValue(fields, 'Path');
                    img = $(image);

                    img.addClass('d-block w-100');
                    

                    var css = "carousel-item";
                    if (i == 0)
                        css += " active";

                    var carouselItem = $('<div class="' + css + '"/>');
                    $(carouselItem).append(img);

                    var carouselCaption = $('<div class="carousel-caption d-none d-md-block"><h5><a href="' + url + '">' + title + '</a></h5><p>' + description + '</p></div>');
                    carouselItem.append(carouselCaption);

                    carouselInner.append(carouselItem);

                }
            }
        });

        function getValue(fields, fieldName) {
            var value;
            for (var i = 0; i < fields.length; i++) {
                if (fields[i].Key == fieldName) {
                    value = fields[i].Value;
                    break;
                }
            }

            return value;
        }
    };
}(jQuery));

/*MIS EQUIPOS PLUGIN*/
(function ($) {
    $.fn.myjoinedteams = function (options) {
        setContext(variables.clientId.Graph);
        var $this = $(this);

        var endpoint = "/me/joinedteams";

        execute({
            clientId: variables.clientId.Graph,
            version: "beta",
            endpoint: endpoint,
            type: "GET",
            callback: render
        });

        function render(data) {
            if (data.value.length == 0) {
                $($this).closest('.col').hide();
                return;
            }

            var teams = data.value;

            for (var i = 0; i < teams.length; i++) {
                var team = teams[i];

                var bgColor = getIconColor();

                var html = '';

                html += '<li>';
                html += '   <div class="row">';
                html += '       <div class="col-3 text-center">';
                html += '           <p class="team-icon ' + bgColor + '">' + getTeamIcon(team.displayName) + '</p>';
                html += '       </div>';
                html += '       <div class="col">';
                html += '           <h4><a href="https://teams.microsoft.com" target="_blank">' + team.displayName + '</a></h4>';
                html += '           <span>' + team.description + '</span>';
                html += '       </div>';
                html += '   </div>';
                html += '</li>';

                $($this).append(html);
            }
        }

        function getIconColor() {
            var bgColors = ['bg-blue', 'bg-purple', 'bg-violet', 'bg-orange', 'bg-green', 'bg-khaki'];

            return bgColors[Math.floor(Math.random() * bgColors.length)];
        }

        function getTeamIcon(teamName) {
            var words = teamName.split(' ');
            var icon = '';

            for (var i = 0; i < 1; i++) {
                var firstLetter = words[i].substring(0, 1).toUpperCase();
                icon += firstLetter;
            }

            return icon;
        }
    };
}(jQuery));

/*MIS COMPAÑEROS PLUGIN*/
(function ($) {
    $.fn.peoplearoundme = function (options) {
        setContext(variables.clientId.Graph);
        var $this = $(this);

        var endpoint = "/me/people";

        execute({
            clientId: variables.clientId.Graph,
            version: "v1.0",
            endpoint: endpoint,
            type: "GET",
            callback: render
        });

        function render(data) {
            if (data.value.length == 0) {
                $($this).closest('.col').hide();
                return;
            }

            var people = data.value;
            var counter = 0;

            for (var i = 0; i < people.length; i++) {
                if (counter == 4)
                    break;
                var user = people[i];

                if (user.personType.subclass == "OrganizationUser") {
                    var jobTitle = '';

                    if (user.jobTitle != null)
                        jobTitle = user.jobTitle;

                    var url = 'https://eur.delve.office.com/?u=' + user.id + '&v=work';

                    var html = '';

                    html += '<li>';
                    html += '   <div class="row">';
                    html += '       <div class="col-3 text-center">';
                    html += '           <span class="icon-usuario"></span>';
                    html += '       </div>';
                    html += '       <div class="col">';
                    html += '           <h4><a href="' + url + '" target="_blank">' + user.displayName + '</a></h4>';
                    html += '           <span>' + jobTitle + '</span>';
                    html += '       </div>';
                    html += '   </div>';
                    html += '</li>';

                    $($this).append(html);

                    counter++;
                }
            }
        }
    };
}(jQuery));

/*MY TASKS PLUGIN*/
(function ($) {
    $.fn.mytasks = function (options) {
        setContext(variables.clientId.Graph);

        var $this = $(this);

        var endpoint = "/me/planner/tasks";

        execute({
            clientId: variables.clientId.Graph,
            version: "v1.0",
            endpoint: endpoint,
            type: "GET",
            callback: render
        });

        function render(data) {
            if (data.value.length == 0) {
                $($this).closest('.col').hide();
                return;
            }

            var allTasks = data.value;

            var tasks = getPendingTasks(allTasks);
            if (tasks.length == 0) {
                $($this).closest('.col').hide();
                return;
            }

            var length = tasks.length;
            if (length > 4)
                length = 4;

            for (var i = 0; i < length; i++) {
                var task = tasks[i];

                var taskDate = task.dueDateTime;

                if (taskDate == null)
                    taskDate = task.createdDateTime;

                taskDate = taskDate.split('T');
                taskDate = taskDate[0];

                taskDate = new Date(taskDate);

                var taskDateString = taskDate.getDate() + '/' + (taskDate.getMonth() + 1) + '/' + taskDate.getFullYear();

                var html = '';

                if (dateDiff(taskDate, new Date()) < 0)
                    html += '<li>';
                else
                    html += '<li class="fg-red">';

                html += '   <h4>' + task.title + '</h4>';
                html += '   <span class="icon-calendario"></span><span>' + taskDateString + '</span>';
                html += '</li>';

                $($this).append(html);
            }
        }

        function getPendingTasks(allTasks) {
            var tasks = new Array();

            for (var i = 0; i < allTasks.length; i++) {
                var task = allTasks[i];

                if (task.percentComplete < 100) {
                    tasks.push(task);
                }
            }

            return tasks;
        }
    };
}(jQuery));

/*THRONW PLUGIN*/
(function ($) {
    $.fn.thrones = function (options) {
        var $this = this;
        var url = "https://grupovass.sharepoint.com/es-es/businessvalue/_api/web/lists/getbytitle('Thrones')/items";

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
                var targaryen = new Array();
                var stark = new Array();

                for (var i = 0; i < results.length; i++){
                    if (targaryen.length == 5)
                        break;

                    var result = results[i];
                    if (result["Puntos_x0020_Total"] > 10) {
                        targaryen.push(result);
                    }
                }

                for (var i = 0; i < results.length; i++) {
                    if (stark.length == 5)
                        break;

                    var result = results[i];
                    if (result["Puntos_x0020_Total"] > 7 && result["Puntos_x0020_Total"] < 10) {
                        stark.push(result);
                    }
                }

                //TARGARYEN
                var html = '<div class="row"><div class="col throne"><h2>Targaryen</h2><div class="row"><div class="col-4"><img class="img-fluif" src="/es-es/businessvalue/PublishingImages/targaryen.jpg"></div><div class="col"><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin finibus, dolor vitae vulputate lobortis, nisi leo placerat tortor, pulvinar ultrices ex nisi eget sem.</p></div></div></div><div class="col"><canvas id="targaryenChart"></canvas></div></div>'
                $($this).append(html);

                var targaryenLabels = new Array();
                var targaryenPoints = new Array();

                for (var i = 0; i < targaryen.length; i++) {
                    targaryenLabels.push(targaryen[i]["Nombre_x0020_Usuario"]);
                    targaryenPoints.push(targaryen[i]["Puntos_x0020_Total"]);
                }

                var ctx = document.getElementById("targaryenChart").getContext('2d');
                var myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: targaryenLabels,
                        datasets: [{
                            label: 'Puntos',
                            data: targaryenPoints,
                            backgroundColor: 'rgba(255, 0, 0, 0.1)',
                            borderColor: 'rgba(255, 0, 0, 0.3)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }
                });

                //STARK
                html = '<div class="row"><div class="col throne"><h2>Stark</h2><div class="row"><div class="col-4"><img class="img-fluif" src="/es-es/businessvalue/PublishingImages/stark.png"></div><div class="col"><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin finibus, dolor vitae vulputate lobortis, nisi leo placerat tortor, pulvinar ultrices ex nisi eget sem.</p></div></div></div><div class="col"><canvas id="starkChart"></canvas></div></div>'
                $($this).append(html);

                var starkLabels = new Array();
                var starkPoints = new Array();

                for (var i = 0; i < stark.length; i++) {
                    starkLabels.push(stark[i]["Nombre_x0020_Usuario"]);
                    starkPoints.push(stark[i]["Puntos_x0020_Total"]);
                }

                ctx = document.getElementById("starkChart").getContext('2d');
                var myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: starkLabels,
                        datasets: [{
                            label: 'Puntos',
                            data: starkPoints,
                            backgroundColor: 'rgba(170, 170, 170, 0.1)',
                            borderColor: 'rgba(170, 170, 170, 0.3)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }
                });
            }
        });
    };
}(jQuery));

/*TILES PLUGIN*/
(function ($) {
    $.fn.tiles = function (options) {
        var $this = this;
        var url = "https://grupovass.sharepoint.com/_api/web/lists/getbytitle('Aplicaciones')/items";

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
                    var html = '';
                    html += '<div class="col tile" style="background-color:' + result.Color + '">';

                    html += '   <a href="' + result.URL.Url + '">';

                    html += '       <img src="' + result.Imagen.Url + '"/>';  
                    html += '       <p>' + result.Title + '</p>';

                    html += '<div>';

                    $($this).append(html);
                }
            }
        });
    };
}(jQuery));

jQuery(document).ready(function () {
    //localStorage.clear();

    setHomePage();

    jQuery('#menu-button').menu();

    jQuery('#graph-wizard').each(function () {
        $(this).wizard();
    });

    //jQuery('#quickLinks').each(function () {
    //    $(this).quicklinks();
    //});

    //jQuery('#socialLinks').each(function () {
    //    $(this).sociallinks();
    //});

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

    jQuery('#carouselNews').each(function () {
        $(this).carousel();
    });

    $('#my-teams').each(function () {
        $(this).myjoinedteams();
    });

    $('#my-people').each(function () {
        $(this).peoplearoundme();
    });

    $('#my-tasks').each(function () {
        $(this).mytasks();
    });

    $('#thrones').each(function () {
        $(this).thrones();
    });

    $('#tiles').each(function () {
        $(this).tiles();
    });
});

function setHomePage() {
    $('.logo a').attr('href', '/' + _spPageContextInfo.currentCultureName.toLowerCase());
}

function hideRibbon() {
    //if (window.isInEditMode)
    //    $('#s4-ribbonrow').show();
    //else
    //    $('#s4-ribbonrow').hide();
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

function getIcon(icon) {

    if (icon == null)
        return null;

    var iconClass;

    switch (icon.toLowerCase()) {
        case 'aleatorio':
            iconClass = 'icon-aleatorio';
            break;
        case 'artículo':
            iconClass = 'icon-articulo';
            break;
        case 'baja':
            iconClass = 'icon-baja';
            break;
        case 'bandera':
            iconClass = 'icon-bandera';
            break;
        case 'basura':
            iconClass = 'icon-basura';
            break;
        case 'buscar':
            iconClass = 'icon-buscar';
            break;
        case 'café':
            iconClass = 'icon-cafe';
            break;
        case 'calendario':
            iconClass = 'icon-calendario';
            break;
        case 'cámara de fotos':
            iconClass = 'icon-camara_fotos';
            break;
        case 'candado cerrado':
            iconClass = 'icon-candado_01';
            break;
        case 'candado abierto':
            iconClass = 'icon-candado_02';
            break;
        case 'carpeta':
            iconClass = 'icon-carpeta_01';
            break;
        case 'charla':
            iconClass = 'icon-charla';
            break;
        case 'chat':
            iconClass = 'icon-chat';
            break;
        case 'chat - eliminar':
            iconClass = 'icon-chat_04';
            break;
        case 'chat - cara alegre':
            iconClass = 'icon-chat_02';
            break;
        case 'chat - cara triste':
            iconClass = 'icon-chat_01';
            break;
        case 'chat - puntos suspensivos':
            iconClass = 'icon-chat_06';
            break;
        case 'chat - lineas':
            iconClass = 'icon-chat_05';
            break;
        case 'cierra':
            iconClass = 'icon-cierra';
            break;
        case 'cierra - círculo':
            iconClass = 'icon-cierra_02';
            break;
        case 'cloud - baja':
            iconClass = 'icon-cloud_baja';
            break;
        case 'cloud - cierra':
            iconClass = 'icon-cloud_cierra';
            break;
        case 'cloud - ok':
            iconClass = 'icon-cloud_ok';
            break;
        case 'cloud - sube':
            iconClass = 'icon-cloud_sube';
            break;
        case 'compartir':
            iconClass = 'icon-compartir';
            break;
        case 'corazón':
            iconClass = 'icon-corazon';
            break;
        case 'cronómetro':
            iconClass = 'icon-cronometro';
            break;
        case 'datos':
            iconClass = 'icon-datos_01';
            break;
        case 'datos - sube':
            iconClass = 'icon-datos_02';
            break;
        case 'datos - baja':
            iconClass = 'icon-datos_03';
            break;
        case 'derecha':
            iconClass = 'icon-derecha';
            break;
        case 'desktop':
            iconClass = 'icon-desktop';
            break;
        case 'eliminar carpeta':
            iconClass = 'icon-carpeta_03';
            break;
        case 'escritorio 1':
            iconClass = 'icon-escritorio';
            break;
        case 'escritorio 2':
            iconClass = 'icon-escritorio_02';
            break;
        case 'etiqueta':
            iconClass = 'icon-etiqueta';
            break;
        case 'expande':
            iconClass = 'icon-expande';
            break;
        case 'favorito':
            iconClass = 'icon-favorito';
            break;
        case 'foto 1':
            iconClass = 'icon-foto_01';
            break;
        case 'foto 2':
            iconClass = 'icon-foto_02';
            break;
        case 'imprimir':
            iconClass = 'icon-imprimir';
            break;
        case 'información':
            iconClass = 'icon-info';
            break;
        case 'izquierda':
            iconClass = 'icon-izquierda';
            break;
        case 'lápiz':
            iconClass = 'icon-lapiz_editar';
            break;
        case 'libreta':
            iconClass = 'icon-libreta';
            break;
        case 'listado 1':
            iconClass = 'icon-listado';
            break;
        case 'listado 2':
            iconClass = 'icon-listado_02';
            break;
        case 'mail':
            iconClass = 'icon-mail';
            break;
        case 'mail abierto':
            iconClass = 'icon-mail_abierto';
            break;
        case 'maletín':
            iconClass = 'icon-maletin';
            break;
        case 'mano':
            iconClass = 'icon-mano';
            break;
        case 'más':
            iconClass = 'icon-mas';
            break;
        case 'menos':
            iconClass = 'icon-menos';
            break;
        case 'menú':
            iconClass = 'icon-menu';
            break;
        case 'menú cierra':
            iconClass = 'icon-menu_cierra';
            break;
        case 'móvil':
            iconClass = 'icon-movil';
            break;
        case 'navegar':
            iconClass = 'icon-navegar';
            break;
        case 'notas más':
            iconClass = 'icon-notas_mas';
            break;
        case 'notas ok':
            iconClass = 'icon-notas_ok';
            break;
        case 'nueva carpeta':
            iconClass = 'icon-carpeta_02';
            break;
        case 'ok 1':
            iconClass = 'icon-ok';
            break;
        case 'ok 2':
            iconClass = 'icon-ok_2';
            break;
        case 'pausa':
            iconClass = 'icon-pause';
            break;
        case 'pdf':
            iconClass = 'icon-pdf';
            break;
        case 'play':
            iconClass = 'icon-play';
            break;
        case 'portátil':
            iconClass = 'icon-portatil';
            break;
        case 'pregunta':
            iconClass = 'icon-pregunta';
            break;
        case 'pregunta':
            iconClass = 'icon-pregunta';
            break;
        case 'presentación':
            iconClass = 'icon-presentacion';
            break;
        case 'recargar':
            iconClass = 'icon-recargar';
            break;
        case 'reload':
            iconClass = 'icon-reload';
            break;
        case 'reloj':
            iconClass = 'icon-reloj';
            break;
        case 'repliega':
            iconClass = 'icon-repliega';
            break;
        case 'reunión de grupo':
            iconClass = 'icon-reunion_grupo';
            break;
        case 'seguro':
            iconClass = 'icon-seguro';
            break;
        case 'settings':
            iconClass = 'icon-settings';
            break;
        case 'sonido 1':
            iconClass = 'icon-sonido_01';
            break;
        case 'sonido 2':
            iconClass = 'icon-sonido_02';
            break;
        case 'sonido 3':
            iconClass = 'icon-sonido_03';
            break;
        case 'sube':
            iconClass = 'icon-sube';
            break;
        case 'tablet':
            iconClass = 'icon-tablet';
            break;
        case 'texto':
            iconClass = 'icon-texto';
            break
        case 'texto - lápiz':
            iconClass = 'icon-texto_lapiz';
            break;
        case 'usuario':
            iconClass = 'icon-usuario';
            break;
        case 'ventanas':
            iconClass = 'icon-ventanas';
            break;
    }

    if (iconClass != null)
        return '<span class="' + iconClass + '"></span>';
    else
        return null;
}