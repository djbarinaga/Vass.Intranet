(function ($) {
    $.fn.wizard = function (options) {
        var $this = this;
        var currentStep = -1;
        var length = $('#wizard-steps .row').length;

        $('#nextStep').on('click', function () {

            $('#wizard-steps .row').each(function (index) {
                if (!$(this).hasClass('d-none'))
                    currentStep = index;
            });

            if (currentStep < length - 1) {
                $('#wizard-steps .row:eq(' + currentStep + ')').addClass('d-none');
                $('#wizard-steps .row:eq(' + (currentStep + 1) + ')').removeClass('d-none');
                $('#wizard-indicators p').each(function (index) {
                    if (index == currentStep + 1) {
                        $(this).removeClass('bg-info').addClass('bg-primary');
                    }
                    else {
                        $(this).removeClass('bg-primary').addClass('bg-info');
                    }
                });
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
                        $(this).removeClass('bg-info').addClass('bg-primary');
                    }
                    else {
                        $(this).removeClass('bg-primary').addClass('bg-info');
                    }
                });
            }
        });
    };
}(jQuery));

$(document).ready(function () {
    $('#wizard').wizard();
})