(function () {
    
    var tableContext = {};
    tableContext.Templates = {};

    tableContext.Templates.Header = headerTemplate;
    tableContext.Templates.Footer = '</table></div></div>';;
    tableContext.Templates.Item = tableTemplate;
    tableContext.OnPostRender = postRender;

    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(tableContext);

})();

function headerTemplate(ctx) {
    var html = '<div class="module table-list">' +
        '<div class="module-content">' +
        '<table class="table">';

    return html;
}

function tableTemplate(ctx) {
    var title = ctx.CurrentItem["Title"];
    var description = ctx.CurrentItem["Descripcion"];
    var startDate = ctx.CurrentItem["Fecha_x0020_de_x0020_Realizacion"];
    var endDate = ctx.CurrentItem["Fecha_x0020_de_x0020_Finalizacio"];
    var aforo = ctx.CurrentItem["Aforo"];
    var location = ctx.CurrentItem["Lugar_x0020_de_x0020_Realizacion"];
    var id = ctx.CurrentItem["ID"];

    var html = '<tr>';

    html += '<td>' + title + '</td>';
    html += '<td>' + description + '</td>';
    html += '<td>' + startDate + '</td>';
    html += '<td>' + endDate + '</td>';
    html += '<td>' + location + '</td>';
    html += '<td><button type="button" class="btn btn-primary" data-command="apuntarse" data-aforo="' + aforo + '" data-id="' + id + '" data-title="' + title + '">Apuntarse</button></td>';
    html += '<td><button type="button" class="btn btn-secondary" data-command="desapuntarse" data-id="' + id + '" data-title="' + title + '">Desapuntarse</button></td>';

    html += '</tr>';
    
    return html;
}

function postRender(ctx) {
    
    $('button[data-command="apuntarse"]').each(function () {
        $(this).on('click', function () {
            var charlaId = $(this).data('id');

            checkAforo(charlaId,
                function () {
                    alert('')
                },
                function () {
                });

        })
    })
}


function checkAforo(idCharla, onsuccess, onfail) {
    var clientContext = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);
    var oAsistenciasList = clientContext.get_web().get_lists().getByTitle('Asistencia a Charlas');
    clientContext.load(oAsistenciasList);

    //Tomamos el nÃºmero de personas apuntadas a las charlas correspondientes al Item actual
    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml("<View><Query><Where><Eq><FieldRef Name='ID_x0020_Charla' /><Value Type='Text'>" + idCharla + "</Value></Eq></Where></Query></View>");
    this.listItems = oAsistenciasList.getItems(camlQuery);
    clientContext.load(listItems, 'Include(ID_x0020_Charla)');
    clientContext.executeQueryAsync(
        Function.createDelegate(this, onsuccess),
        Function.createDelegate(this, onfail)
    );
}