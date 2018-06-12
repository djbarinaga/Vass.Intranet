(function () {
    
    var pagesContext = {};
    pagesContext.Templates = {};

    pagesContext.Templates.Header = '<div class="module article-list">' +
        '<div class="module-content">' +
        '<div class="row">';
    pagesContext.Templates.Footer = pagingControl;
    pagesContext.Templates.Item = pagesTemplate;

    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(pagesContext);

})();

function pagesTemplate(ctx) {
    var title = ctx.CurrentItem["Title"];
    var description = ctx.CurrentItem["Summary"];
    var link = ctx.CurrentItem["FileRef"];
    var image = ctx.CurrentItem["PublishingRollupImage"];
    var created = ctx.CurrentItem["Created"];
    var date;

    if (created != null) {
        var dateParts = created.split(' ');
        date = dateParts[0];
    }


    var div = $(image);
    var src = div.find('img').attr('src');

    var html = '';

    html += '<div class="col-5 article-card">';

    html += '   <div class="row">';
    html += '       <div class="col">';
    html += '           <div class="article-image" style="background:url(\'' + src + '\') no-repeat; background-size:cover">';
    html += '           </div>';
    html += '       </div>';
    html += '       <div class="col-8 article-data">';
    if (date != null)
        html += '           <p class="article-date">' + date + '</p>';

    html += '           <a href="' + link + '">' + title + '</a>';

    if (description != null)
        html += '           <p>' + stripHtml(description) + '</p>';

    html += '       </div>';
    html += '   </div>';

    html += '</div>';

    return html;
}

function pagingControl(ctx) {
    var firstRow = ctx.ListData.FirstRow;
    var lastRow = ctx.ListData.LastRow;
    var prev = ctx.ListData.PrevHref;
    var next = ctx.ListData.NextHref;

    var html = '</div></div></div>';

    if (prev || next) {
        html += "<div class='paging'>";
        html += prev ? "<a href='" + prev + "'><span class='icon-izquierda'></span></a>" : "";
        html += "<span class='ms-paging'><span class='First'>" + firstRow + "</span> - <span class='Last'>" + lastRow + "</span></span>";
        html += next ? "<a href='" + next + "'><span class='icon-derecha'></a>" : "";
        html += "</div>";
    }

    

    return html;
}