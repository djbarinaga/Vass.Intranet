(function () {
    
    var suggestionContext = {};
    suggestionContext.Templates = {};

    suggestionContext.Templates.Header = '<div class="module">' +
                                        '<h3 class="title">Sugerencias para ti</h3>' +
                                        '<div class="module-content">' + 
                                            '<div class="row">';
    suggestionContext.Templates.Footer =         '</div></div></div>';
    suggestionContext.Templates.Item = suggestionTemplate;

    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(suggestionContext);

})();

function suggestionTemplate(ctx) {
    var title = ctx.CurrentItem["Title"];
    var description = ctx.CurrentItem["Description"];
    var link = ctx.CurrentItem["URL"];

    var total = ctx.ListData.Row.length;
    var colWidth = 12 / total;
    var col = 'col-' + colWidth;

    var html = '<div class="' + col + '">';

    html += '<div class="card">';
    html += '<div class="card-body">';

    html += '<h4 class="card-title"><a href="' + link +'">' + title + '</a></h4>';
    html += '<p class="card-text">' + description + '</p>';

    html += '</div>';
    html += '</div>';
    html += '</div>';


    return html;
}