(function () {
    
    var eventContext = {};
    eventContext.Templates = {};

    eventContext.Templates.Header = '<div class="events">';
    eventContext.Templates.Footer = pagingControl;
    eventContext.Templates.Item = eventTemplate;

    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(eventContext);

})();

function eventTemplate(ctx) {
    var months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    var title = ctx.CurrentItem["Title"];
    var id = ctx.CurrentItem["ID"];
    var description = ctx.CurrentItem["Description"];
    var location = ctx.CurrentItem["Location"];
    var eventStartDate = ctx.CurrentItem["EventDate"];
    var eventEndDate = ctx.CurrentItem["EndDate"];

    var eventHour = eventStartDate.split(' ')[1];
    var eventEndHour = eventEndDate.split(' ')[1];

    var eventDateParts = eventStartDate.split('/');
    var eventDay = eventDateParts[0];
    var eventMonthNumber = Number(eventDateParts[1]) - 1;
    var eventMonth = months[eventMonthNumber];

    var html = '<div class="row event-detail">';

    html += '<div class="col-8 event">';
    html += '   <h3 class="event-title">' + title + '</h3>';
    html += '   <p class="event-description">' + description + '</p>';
    html += '</div>';
    html += '<div class="col">';
    html += '   <div class="row">';
    html += '       <div class="col">';
    html += '           <div class="row">';
    html += '               <div class="col-4 event-date">';
    html += '                   <span class="icon-calendario"></span><span>' + eventDay + ' ' + eventMonth + '</span>';
    html += '               </div>';
    html += '               <div class="col event-hour">';
    html += '                   <span class="icon-reloj"></span><span>' + eventHour + ' - ' + eventEndHour + '</span>';
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