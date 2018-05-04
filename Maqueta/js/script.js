/*QUICKLINKS PLUGIN*/
(function ($) {
    $.fn.wizard = function (options) {
        var $this = this;
        var currentStep = 0;

        $('#nextStep').on('click', function () {

            $('#wizard-steps .row').each(function (index) {
                if (!$(this).hasClass('d-none'))
                    currentStep = index;
            });

            if (currentStep < length - 1) {
                $('#wizard-steps .row:eq(' + currentStep + ')').addClass('d-none');
                $('#wizard-steps .row:eq(' + (currentStep + 1) + ')').removeClass('d-none');
            }

            enableButtons();
        });

        $('#prevStep').on('click', function () {

            $('#wizard-steps .row').each(function (index) {
                if (!$(this).hasClass('d-none'))
                    currentStep = index;
            });

            if (currentStep > 0) {
                $('#wizard-steps .row:eq(' + currentStep + ')').addClass('d-none');
                $('#wizard-steps .row:eq(' + (currentStep - 1) + ')').removeClass('d-none');
            }

            enableButtons();
        });

        function enableButtons() {
            var length = $('#wizard-steps .row').length;
            if (currentStep == 0) {
                $('#nextStep').removeProp('disabled');
                $('#prevStep').prop('disabled', 'disabled');
            }
        }

        enableButtons();
    };
}(jQuery));

$(document).ready(function () {
    $('#wizard').wizard();
})