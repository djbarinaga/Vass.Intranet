(function () {
    
    var eventContext = {};
    eventContext.Templates = {};

    eventContext.Templates.Header = '<div class="events">';
    eventContext.Templates.Footer = '</div>';
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

    var html = '<div class="row">';

    html += '<div class="col-2 event-date">';
    html += '   <p class="day">' + eventDay + '</p>';
    html += '   <p class="month">' + eventMonth + '</p>';
    html += '</div>';

    html += '<div class="col event">';
    html += '   <h3>' + title + '</h2>';

    html += '<span class="clock">' + eventHour + '-' + eventEndHour + '</span>';

    if (location != '') {
        html += '   <span class="location">' + location + '</span>';
    }

    html += description;
    html += '</div>';


    html += '</div>';


    return html;
}