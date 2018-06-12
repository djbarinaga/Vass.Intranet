(function () {
    
    var stockContext = {};
    stockContext.Templates = {};

    stockContext.Templates.Header = headerTemplate;
    stockContext.Templates.Footer = '</table>';
    stockContext.Templates.Item = stockTemplate;
    stockContext.Templates.Group = CustomGroup;

    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(stockContext);

})();

function headerTemplate(ctx) {
    var html = '<table class="table table-striped" id="my-stock"><thead><tr>';

    html += '<th>Presupuesto inicial</th>';
    html += '<th>Consumido bolsa</th>';
    html += '<th>Consumido tripartira</th>';
    html += '<th>Fecha</th>';
    html += '<th>Horas</th>';
    html += '<th>Comentarios</th>';

    html += '</tr></thead>';

    return html;
}

function stockTemplate(ctx) {
    var presupuestoInicial = ctx.CurrentItem["Presupuesto_x0020_Inicial"];
    var consumidoBolsa = ctx.CurrentItem["Consumido_x0020_Bolsa"];
    var consumidoTripartita = ctx.CurrentItem["Consumido_x0020_Tripartita"];
    var fecha = ctx.CurrentItem["Fecha"];
    var horas = ctx.CurrentItem["Horas"];
    var comentarios = ctx.CurrentItem["Comentario"];

    var html = '<tr>';

    html += '<td>' + presupuestoInicial + '</td>';
    html += '<td>' + consumidoBolsa + '</td>';
    html += '<td>' + consumidoTripartita + '</td>';
    html += '<td>' + fecha + '</td>';
    html += '<td>' + horas + '</td>';
    html += '<td>' + comentarios + '</td>';
    
    html += '</tr>';

    return html;
}

function CustomGroup(ctx, group, groupId, listItem, listSchema, level, expand) {
    if (listItem[group] != '') {
        var html = '<tr><td colspan="6"><h2>Año ' + listItem[group] + ' : </h2></td></tr>';
        return html;
    }

    return '';
}