(function () {
    
    var documentContext = {};
    documentContext.Templates = {};

    documentContext.Templates.Header = headerTemplate;
    documentContext.Templates.Footer = '</tbody></table>';
    documentContext.Templates.Item = documentTemplate;

    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(documentContext);

})();

function headerTemplate(ctx) {
    var html = '';
    html += '<table class="table table-striped">';

    html += '<thead><tr>';

    html += '<th>Cliente</th>';
    html += '<th>Proyecto</th>';
    html += '<th>Fabricante</th>';
    html += '<th>Año</th>';
    html += '<th>Fecha</th>';
    html += '<th>Venta prevista</th>';
    html += '<th>Coste previsto</th>';

    html += '</tr></thead><tbody>';

    return html;
}

function documentTemplate(ctx) {
    var html = '<tr>';

    html += '<td>' + ctx.CurrentItem.Cliente + '</td>';
    html += '<td>' + ctx.CurrentItem.Proyecto + '</td>';
    html += '<td>' + ctx.CurrentItem.Fabricante + '</td>';
    html += '<td>' + ctx.CurrentItem.LinkTitle + '</td>';
    html += '<td>' + ctx.CurrentItem.Fecha_x0020_de_x0020_petici_x00f + '</td>';
    html += '<td>' + ctx.CurrentItem.Venta_x0020_prevista + '</td>';
    html += '<td>' + ctx.CurrentItem.Coste_x0020_previsto + '</td>';

    html += '</tr>';
    
    return html;
}