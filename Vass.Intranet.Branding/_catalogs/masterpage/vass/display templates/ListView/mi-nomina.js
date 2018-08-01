(function () {
    
    var itemContext = {};
    itemContext.Templates = {};

    itemContext.Templates.Header = headerTemplate;
    itemContext.Templates.Footer = footerTemplate;
    itemContext.Templates.Item = itemTemplate;
    itemContext.OnPostRender = postrender;

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

function footerTemplate(ctx) {
    var firstRow = ctx.ListData.FirstRow;
    var lastRow = ctx.ListData.LastRow;
    var prev = ctx.ListData.PrevHref;
    var next = ctx.ListData.NextHref;

    var html = '</table></div></div></div>';

    if (prev || next) {
        html += "<div class='paging'>";
        html += prev ? "<a href='" + prev + "'><span class='icon-izquierda'></span></a>" : "";
        html += "<span class='ms-paging'><span class='First'>" + firstRow + "</span> - <span class='Last'>" + lastRow + "</span></span>";
        html += next ? "<a href='" + next + "'><span class='icon-derecha'></a>" : "";
        html += "</div>";
    }



    return html;
}

function postrender(ctx) {
    $('.ms-webpart-titleText a').removeAttr('href');
}