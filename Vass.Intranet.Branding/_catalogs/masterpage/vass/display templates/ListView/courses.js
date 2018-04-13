(function () {
    
    var courseContext = {};
    courseContext.Templates = {};

    courseContext.Templates.Header = '<table class="table table-striped">';
    courseContext.Templates.Footer = '</table>';
    courseContext.Templates.Item = courseTemplate;

    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(courseContext);

})();

function courseTemplate(ctx) {
    var title = ctx.CurrentItem["Title"];
    var id = ctx.CurrentItem["ID"];
    var hours = ctx.CurrentItem["CourseHours"];
    var trainer = ctx.CurrentItem["Trainer"][0].lookupValue;

    var html = '<tr>';

    html += '<td><a href="curso.aspx?curso=' + id + '">' + title + '</a></td>';
    html += '<td><span class="clock">' + hours + '</span></td>';
    html += '<td>' + trainer + '</td>';

    html += '</tr>';
    
    return html;
}