function loadCourse() {
    var course = getUrlParam('curso');

    var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Cursos')/items?$filter=Id eq " + course;

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

            var image = null;
            if (result.Image != null)
                image = result.Image.Url;

            var title = result.Title;

            $('#list-item-title').text(title);

            if (image != null)
                $('#list-item-picture').append('<img class="img-fluid" src="' + image + '"/>');
        }
    });
}

jQuery(document).ready(function () {
    loadCourse();
});