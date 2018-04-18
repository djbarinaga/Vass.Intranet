(function () {
    
    var documentContext = {};
    documentContext.Templates = {};

    documentContext.Templates.Header = headerTemplate;
    documentContext.Templates.Footer = '</table>';
    documentContext.Templates.Item = documentTemplate;

    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(documentContext);

})();

function headerTemplate(ctx) {
    var html = '<h3>' + ctx.ListTitle + '</h3>';
    html += '<table class="table table-striped">';

    return html;
}

function documentTemplate(ctx) {
    var title = ctx.CurrentItem["Title"];
    var id = ctx.CurrentItem["ID"];
    var fileRef = ctx.CurrentItem["FileRef"];
    var fileSize = ctx.CurrentItem["Size"];
    var fileType = ctx.CurrentItem["File_x0020_Type"];

    if (title == null)
        title = ctx.CurrentItem["FileLeafRef"];

    var html = '<tr>';

    html += '<td><a href="' + fileRef + '" target="_blank"><span class="' + fileType + '">' + title + '</span></a></td>';

    if (fileSize != null)
        html += '<td>' + fileSize + '</td>';

    html += '</tr>';
    
    return html;
}