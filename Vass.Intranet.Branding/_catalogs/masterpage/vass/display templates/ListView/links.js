(function () {
    
    var documentContext = {};
    documentContext.Templates = {};

    documentContext.Templates.Header = headerTemplate;
    documentContext.Templates.Footer = '</table>';
    documentContext.Templates.Item = documentTemplate;

    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(documentContext);

})();

function headerTemplate(ctx) {
    var html = '';
    html += '<table class="table table-striped">';

    return html;
}

function documentTemplate(ctx) {
    var title = ctx.CurrentItem["URL.desc"];
    var link = ctx.CurrentItem["URL"];

    var html = '<tr>';

    html += '<td><a href="' + link + '" target="_blank">' + title + '</a></td>';

    html += '</tr>';
    
    return html;
}