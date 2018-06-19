(function () {

    var charlaContext = {};
    charlaContext.Templates = {};

    charlaContext.Templates.Header = '<div class="events">';
    charlaContext.Templates.Footer = pagingControl;
    charlaContext.Templates.Item = charlaTemplate;

    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(charlaContext);

})();

function charlaTemplate(ctx) {
    var months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    var title = ctx.CurrentItem["Title"];
    var id = ctx.CurrentItem["ID"];
    var description = ctx.CurrentItem["Descripcion"];
    var location = ctx.CurrentItem["Lugar_x0020_de_x0020_Realizacion"];
    var charlaStartDate = ctx.CurrentItem["Fecha_x0020_de_x0020_Realizacion"];
    var charlaTime = ctx.CurrentItem["Tiempo"];
    var author = ctx.CurrentItem["Author"];

    var charlaDateParts = charlaStartDate.split('/');
    var charlaDay = charlaDateParts[0];
    var charlaMonthNumber = Number(charlaDateParts[1]) - 1;
    var charlaMonth = months[charlaMonthNumber];

    var html = '<div class="row event-detail">';

    html += '<div class="col-8 event">';
    html += '   <h3 class="event-title">' + title + '</h3>';
    html += '   <p class="event-author">' + author["0"].title + '</p>';
    html += '   <p class="event-description">' + description + '</p>';
    html += '   <a href="#" class="float-right event-inscription"><span class="icon-chat_02"></span>&nbsp;Inscribirme</a>';
    html += '</div>';
    html += '<div class="col">';
    html += '   <div class="row">';
    html += '       <div class="col">';
    html += '           <div class="row">';
    html += '               <div class="col-4 event-date">';
    html += '                   <span class="icon-calendario"></span><span>' + charlaDay + ' ' + charlaMonth + '</span>';
    html += '               </div>';
    html += '               <div class="col event-hour">';
    html += '                   <span class="icon-reloj"></span><span>' + charlaTime + ' min.</span>';
    html += '               </div>';
    html += '           </div>';
    html += '       </div>';
    html += '   </div>';
    html += '   <div class="row">';
    html += '       <div class="col event-location">';
    html += '           <span class="icon-location"></span><span>' + location + '</span>';
    html += '       </div>';
    html += '   </div>';
    html += '</div>';

    html += '</div>';

    return html;
}

function pagingControl(ctx) {
    var firstRow = ctx.ListData.FirstRow;
    var lastRow = ctx.ListData.LastRow;
    var prev = ctx.ListData.PrevHref;
    var next = ctx.ListData.NextHref;

    var html = '</div>';

    if (prev || next) {
        html += "<div class='paging'>";
        html += prev ? "<a href='" + prev + "'><span class='icon-izquierda'></span></a>" : "";
        html += "<span class='ms-paging'><span class='First'>" + firstRow + "</span> - <span class='Last'>" + lastRow + "</span></span>";
        html += next ? "<a href='" + next + "'><span class='icon-derecha'></a>" : "";
        html += "</div>";
    }



    return html;
}