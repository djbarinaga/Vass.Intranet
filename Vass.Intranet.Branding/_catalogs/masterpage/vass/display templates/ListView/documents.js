(function () {
    
    var documentContext = {};
    documentContext.Templates = {};

    documentContext.Templates.Header = headerTemplate;
    documentContext.Templates.Footer = '</table></div></div>';;
    documentContext.Templates.Item = documentTemplate;

    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(documentContext);

})();

function headerTemplate(ctx) {
    var html = '<div class="module doc-list">' +
        '<div class="module-content">' +
        '<table class="table table-striped">';

    return html;
}

function documentTemplate(ctx) {
    var title = ctx.CurrentItem["Title"];
    var id = ctx.CurrentItem["ID"];
    var fileRef = ctx.CurrentItem["FileRef"];
    var size = this.bytesToSize(ctx.CurrentItem["File_x0020_Size"]);
    var fileType = ctx.CurrentItem["File_x0020_Type"];

    if (title == null)
        title = ctx.CurrentItem["FileLeafRef"];

    var html = '<tr>';

    html += '<td><span class="icon-pdf"></span><a href="' + fileRef + '" target="_blank">' + title + '</a></td>';

    if (size != null)
        html += '<td>' + size + '</td>';

    html += '</tr>';
    
    return html;
}

function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}