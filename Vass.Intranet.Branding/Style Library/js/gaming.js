/*WIZARD*/
(function ($) {
    $.fn.wizardForm = function (options) {
        var $this = this;
        var currentStep = -1;
        var length = $('.wizard-steps .row').length;
        var totalSteps = 0;
        var currentAction = 0;

        $('.nextStep').on('click', function () {
            if (currentStep == -1) {
                if ($('#txtGame').val() == '') {
                    alert("Introduzca el nombre del juego.");
                    return;
                }
                if ($('#txtScore').val() == '') {
                    alert("Introduzca la puntuación por defecto.");
                    return;
                }
            }
            $('.wizard-steps .row').each(function (index) {
                if (!$(this).hasClass('d-none'))
                    currentStep = index;
            });

            if (currentStep < length - 1) {
                $('.wizard-indicators div').removeClass('active');
                $('.wizard-steps .row:eq(' + currentStep + ')').addClass('d-none');
                $('.wizard-steps .row:eq(' + (currentStep + 1) + ')').removeClass('d-none');
                $('.wizard-indicators div').each(function (index) {
                    if (index == currentStep + 1) {
                        $(this).addClass('active');
                        $(this).prev().addClass('completed');
                    }
                });

                if (currentStep == length - 2) {
                    if (options.onfinalstep != null)
                        options.onfinalstep();
                }
            }

        });

        $('.prevStep').on('click', function () {

            $('.wizard-steps .row').each(function (index) {
                if (!$(this).hasClass('d-none'))
                    currentStep = index;
            });

            if (currentStep > 0) {
                $('.wizard-steps .row:eq(' + currentStep + ')').addClass('d-none');
                $('.wizard-steps .row:eq(' + (currentStep - 1) + ')').removeClass('d-none');
                $('.wizard-indicators div').removeClass('active');

                $('.wizard-indicators div').each(function (index) {
                    if (index == currentStep - 1) {
                        $(this).removeClass('completed');
                        $(this).addClass('active');
                    }
                });
            }
        });
    };
}(jQuery));

jQuery(document).ready(function () {
    jQuery('.wizard-form').each(function () {
        init(this);

        $(this).wizardForm({
            onfinalstep: createGame
        });
    });
});

var gameItem;
var surveyItem;
var totalSteps = 5;
var currentAction = 0;

function init(element) {
    $(element).find('[data-role="clonable-button"]').each(function () {
        var counter = 1;
        $(this).on('click', function () {
            var target = $(this).data('target');
            var clone = $(target).clone();
            $(clone).insertBefore($(this));
            counter++;
            $(clone).find('span[data-role="id"]').text(counter);
        });
    })
}

function createGame() {
    $('#alert').text('Creando juego...');

    var gameName = $('#txtGame').val();
    var gameScore = $('#txtScore').val();

    var clientContext = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);

    var oList = clientContext.get_web().get_lists().getByTitle('Juegos');

    var itemCreateInfo = new SP.ListItemCreationInformation();
    gameItem = oList.addItem(itemCreateInfo);

    gameItem.set_item('Title', gameName);
    gameItem.set_item('Puntuacion', gameScore);
    gameItem.update();

    clientContext.load(gameItem);

    clientContext.executeQueryAsync(
        Function.createDelegate(this, createGameGroups),
        Function.createDelegate(this, createGameFailed)
    );
}

function createGameGroups() {
    currentAction++;

    setProgress();

    $('#alert').text('Creando clasificaciones...');

    var gameId = gameItem.get_id();

    $('[data-command="groups"]').each(function () {
        var gropuName = $(this).find('[data-command="groupName"]').val();
        var minimunScore = $(this).find('[data-command="minimunScore"]').val();
        var maximunScore = $(this).find('[data-command="maximunScore"]').val();

        var clientContext = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);

        var oList = clientContext.get_web().get_lists().getByTitle('Clasificación');

        var itemCreateInfo = new SP.ListItemCreationInformation();
        var groupItem = oList.addItem(itemCreateInfo);

        groupItem.set_item('Title', gropuName);
        groupItem.set_item('PuntuacionMaxima', maximunScore);
        groupItem.set_item('PuntuacionMinima', minimunScore);
        groupItem.set_item('JuegoPadre', gameId);
        groupItem.update();

        clientContext.load(groupItem);

        clientContext.executeQueryAsync(
            Function.createDelegate(this, function () {
                console.log('Grupo creado');
            }),
            Function.createDelegate(this, createGameFailed)
        );
    })

    createMiniGame();
}

function createMiniGame() {
    currentAction++;

    setProgress();

    $('#alert').text('Creando juegos asociados...');

    var gameName = $('#txtGame').val();
    var surveyName = gameName + ' Valoración';
    var gameId = gameItem.get_id();

    var clientContext = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);

    var oList = clientContext.get_web().get_lists().getByTitle('Juegos');

    var itemCreateInfo = new SP.ListItemCreationInformation();
    surveyItem = oList.addItem(itemCreateInfo);

    surveyItem.set_item('Title', surveyName);
    surveyItem.set_item('Juego', gameId);
    surveyItem.update();

    clientContext.load(surveyItem);

    clientContext.executeQueryAsync(
        Function.createDelegate(this, createSurvey),
        Function.createDelegate(this, createGameFailed)
    );
}

function createSurvey() {
    currentAction++;
    setProgress();

    $('#alert').text('Creando listas de valoración...');

    var gameName = $('#txtGame').val();
    var surveyName = gameName + ' Valoración';

    var clientContext = new SP.ClientContext.get_current();
    var oWebsite = clientContext.get_web();

    var listCreationInfo = new SP.ListCreationInformation();
    listCreationInfo.set_title(surveyName);
    
    listCreationInfo.set_templateType(102); 

    oWebsite.get_lists().add(listCreationInfo);  

    clientContext.executeQueryAsync(
        Function.createDelegate(this, createSurveyQuestions),
        Function.createDelegate(this, createGameFailed)
    );  
}

function createSurveyQuestions() {
    currentAction++;
    setProgress();

    $('#alert').text('Creando preguntas de valoración...');

    var gameName = $('#txtGame').val();
    var surveyName = gameName + ' Valoración';

    var clientContext = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);
    var oList = clientContext.get_web().get_lists().getByTitle(surveyName);

    //Partida
    var oField = oList.get_fields().addFieldAsXml("<Field DisplayName='Partida' Type='Text'/>", true, SP.AddFieldOptions.defaultValue);

    clientContext.load(oField);

    clientContext.executeQueryAsync(
        Function.createDelegate(this, function () {
            console.log('Pregunta creada');
        }),
        Function.createDelegate(this, createGameFailed)
    );  

    $('[data-command="surveys"]').each(function () {
        var question = $(this).find('[data-command="question"]').val();
        var minimunScore = $(this).find('[data-command="minimunScore"]').val();
        var maximunScore = $(this).find('[data-command="maximunScore"]').val();

        var oField;

        if (maximunScore != '')
            oField = oList.get_fields().addFieldAsXml("<Field DisplayName='" + question + "' Type='Number' Max='" + maximunScore + "' Min='" + minimunScore + "'/>", true, SP.AddFieldOptions.defaultValue);
        else
            oField = oList.get_fields().addFieldAsXml("<Field DisplayName='" + question + "' Type='Number' Min='" + minimunScore + "'/>", true, SP.AddFieldOptions.defaultValue);

        var fieldNumber = clientContext.castTo(oField, SP.FieldNumber);
        fieldNumber.set_maximumValue(10);
        fieldNumber.set_minimumValue(1);
        fieldNumber.update();

        clientContext.load(oField);

        clientContext.executeQueryAsync(
            Function.createDelegate(this, function () {
                console.log('Pregunta creada');
            }),
            Function.createDelegate(this, createGameFailed)
        );  
    });

    createSurveyScore();
}

function createSurveyScore() {
    currentAction++;
    setProgress();

    $('#alert').text('Configurando puntuación...');

    var clientContext = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);
    var oList = clientContext.get_web().get_lists().getByTitle('Puntuaciones variables');
    var miniGame = surveyItem.get_id();

    $('[data-command="survey-score"]').each(function () {
        var minimunScore = $(this).find('[data-command="minimunScore"]').val();
        var maximunScore = $(this).find('[data-command="maximunScore"]').val();
        var evaluation = $(this).find('[data-command="evaluation"]').val();

        var itemCreateInfo = new SP.ListItemCreationInformation();
        var questionItem = oList.addItem(itemCreateInfo);

        questionItem.set_item('Juego', miniGame);
        questionItem.set_item('PuntuacionMaxima', maximunScore);
        questionItem.set_item('PuntuacionMinima', minimunScore);
        questionItem.set_item('Puntuacion', evaluation);
        questionItem.update();

        clientContext.load(questionItem);

        clientContext.executeQueryAsync(
            Function.createDelegate(this, function () {
                console.log('Valoración creada');
            }),
            Function.createDelegate(this, createGameFailed)
        );
    });

    $('#alert').text('Juego creado');
}

function createGameFailed(sender, args) {
    alert('Mal');
    console.log('Request failed. ' + args.get_message() +
        '\n' + args.get_stackTrace());
}

function setProgress() {
    var currentProgress = (currentAction * 100) / totalSteps;
    $('.progress-bar').css('width', currentProgress + '%');
}