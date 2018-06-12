(function () {
    
    var itemContext = {};
    itemContext.Templates = {};

    itemContext.Templates.Header = headerTemplate;
    itemContext.Templates.Footer = '</div></div>';;
    itemContext.Templates.Item = itemTemplate;

    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(itemContext);

})();

function headerTemplate(ctx) {
    var html = '<div class="module throne-list">' +
        '<div class="module-content">';

    return html;
}

function itemTemplate(ctx) {
    var title = ctx.CurrentItem["Title"];
    var puntos = ctx.CurrentItem["Puntos_x0020_Total"];
    
    var html = '';
    html += '<div class="row">'

    html += '   <div class="col throne">';
    html += '       <img src="/es-es/businessvalue/PublishingImages/targaryen.jpg"/>';
    html += '   </div>';
    html += '   <div class="col throne">';
    html += '       <canvas id="targaryenChart" data-role="chart" width="400" height="400"></canvas>';
    html += '   </div>';

    html += '</div>';

    if (size != null)
        html += '<td>' + size + '</td>';

    html += '</div>';
    
    return html;
}

function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}