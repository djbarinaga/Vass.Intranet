(function () {
    
    var courseContext = {};
    courseContext.Templates = {};

    courseContext.Templates.Header = '<table class="table table-striped">';
    courseContext.Templates.Footer = pagingControl;
    courseContext.Templates.Item = courseTemplate;

    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(courseContext);

})();

function courseTemplate(ctx) {
    var title = ctx.CurrentItem["Nombre_x0020_Curso"];
    var id = ctx.CurrentItem["ID"];
    var hours = ctx.CurrentItem["Horas_x0020_curso"];
    var startDate = ctx.CurrentItem["Fecha_x0020_Inicio"];

    var trainer = '';

    if (ctx.CurrentItem["Trainer"] != null)
        trainer = ctx.CurrentItem["Trainer"][0].lookupValue;

    var html = '<tr>';

    html += '<td><a href="curso.aspx?curso=' + id + '">' + title + '</a></td>';
    html += '<td>';

    if (hours != '')
        html += '<span class="icon-reloj"></span><span>' + hours + '</span>';

    html += '</td>';

    html += '<td>';

    if (startDate != '')
        html += '<span class="icon-calendario"></span><span>' + startDate + '</span>';

    html += '</td>';

    html += '<td>';

    if (trainer != '')
        html += trainer;

    html += '</td>';

    html += '</tr>';
    
    return html;
}

function pagingControl(ctx) {
    var firstRow = ctx.ListData.FirstRow;
    var lastRow = ctx.ListData.LastRow;
    var prev = ctx.ListData.PrevHref;
    var next = ctx.ListData.NextHref;

    var html = '</table>';

    html += "<div class='paging'>";
    html += prev ? "<a href='" + prev + "'><span class='icon-izquierda'></span></a>" : "";
    html += "<span class='ms-paging'><span class='First'>" + firstRow + "</span> - <span class='Last'>" + lastRow + "</span></span>";
    html += next ? "<a href='" + next + "'><span class='icon-derecha'></a>" : "";
    html += "</div>";

    return html;
}