(function ($) {
    $.fn.courseList = function (options) {
        var $this = this;
        
        var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Cursos')/items?$select=Id, Title, CourseHours, Trainer/Title&$expand=Trainer/Title";

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
                var table = $('<table class="table table-striped"/>');
                $($this).append(table);

                var tbody = $('<tbody/>');
                table.append(tbody);

                for (var i = 0; i < results.length; i++) {
                    var result = results[i];
                    var tr = $('<tr/>');
                    var tdCurso = $('<td><a href="curso.aspx?curso=' + result.Id + '">' + result.Title + '</a></td>');
                    var tdHoras = $('<td><span class="clock-bold">' + result.CourseHours + ' hrs.</span></td>');
                    var tdFormador = $('<td><span>' + result.Trainer.Title + '</span></td>');

                    tr.append(tdCurso);
                    tr.append(tdHoras);
                    tr.append(tdFormador);

                    tbody.append(tr);
                }
            }
        });
    };
}(jQuery));

jQuery(document).ready(function () {
    $('#course-list').each(function () {
        $(this).courseList();
    })
});