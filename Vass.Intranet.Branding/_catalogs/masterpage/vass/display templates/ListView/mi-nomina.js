(function () {
    
    var itemContext = {};
    itemContext.Templates = {};

    itemContext.Templates.Header = headerTemplate;
    itemContext.Templates.Footer = '</table>';
    itemContext.Templates.Item = itemTemplate;

    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(itemContext);

})();

function headerTemplate(ctx) {
    var html = '';
    html += '<table class="table table-striped">';

    return html;
}

function itemTemplate(ctx) {
    var link = ctx.CurrentItem.FileRef;
    var title = ctx.CurrentItem.FileLeafRef;

    var titleSplit = title.split('.')[0].split('_');

    var month = titleSplit[0];
    var year = titleSplit[titleSplit.length - 1];

    var html = '<tr>';

    html += '<td><a href="' + link + '" target="_blank">' + month + ' - ' + year + '</a></td>';

    html += '</tr>';
    
    return html;
}