(function () {

    var charlaContext = {};
    charlaContext.Templates = {};

    charlaContext.Templates.Header = '<div id="charlas" class="events">';
    charlaContext.Templates.Footer = pagingControl;
    charlaContext.Templates.Item = charlaTemplate;
    charlaContext.OnPostRender = charlasPostRender;

    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(charlaContext);

})();

function charlaTemplate(ctx) {
    var months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    var title = ctx.CurrentItem["Title"];
    var id = ctx.CurrentItem["ID"];
    var description = ctx.CurrentItem["Descripcion"];
    var location = ctx.CurrentItem["Lugar_x0020_de_x0020_Realizacion"];
    var charlaStartDate = ctx.CurrentItem["Fecha_x0020_de_x0020_Realizacion"];
    var aforo = ctx.CurrentItem["Aforo"];
    var charlaTime = ctx.CurrentItem["Tiempo"];
    var author = ctx.CurrentItem["Author"];

    var charlaDateParts = charlaStartDate.split('/');
    var charlaDay = charlaDateParts[0];
    var charlaMonthNumber = Number(charlaDateParts[1]) - 1;
    var charlaMonth = months[charlaMonthNumber];

    var html = '<div class="row event-detail">';

    html += '<div class="col-8 event">';
    html += '   <h3 class="event-title"><a href="/es-es/businessvalue/Paginas/Editar-charla.aspx?c=' + id + '">' + title + '</a></h3>';
    html += '   <p class="event-author"><img src="https://outlook.office365.com/owa/service.svc/s/GetPersonaPhoto?email=' + author["0"].email + '&UA=0&size=HR48x48&sc=1529465121474"/>' + author["0"].title + '</p>';
    html += '   <p class="event-description">' + description + '</p>';
    html += '   <p data-charlaid="' + id + '" class="float-right"></p>';
    html += '</div>';
    html += '<div class="col">';
    html += '   <div class="row">';
    html += '       <div class="col">';
    html += '           <div class="row">';
    html += '               <div class="col event-date">';
    html += '                   <span class="icon-calendario"></span><span class="span-corrector">' + charlaDay + ' ' + charlaMonth + '</span>';
    html += '               </div>';
    html += '               <div class="col event-hour">';
    html += '                   <span class="icon-reloj"></span><span class="span-corrector">' + charlaTime + ' min.</span>';
    html += '               </div>';
    html += '           </div>';
    html += '       </div>';
    html += '   </div>';
    html += '   <div class="row">';
    html += '       <div class="col event-location">';
    html += '           <span class="icon-location"></span>' + location + '<br/><span>Aforo: </span>' + aforo + ' personas';
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

function charlasPostRender(ctx) {
    var charlas = $('#charlas p[data-charlaid]');
    var users = $('#charlas [data-uid]');

    checkAforo(charlas, 0);
}

function checkAforo(charlas, index) {
    if (index == charlas.length)
        return;

    var charla = $(charlas[index])
    var id = charla.data('charlaid');

    var clientContext = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);

    var oList = clientContext.get_web().get_lists().getByTitle('Inscripciones charlas');

    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml(
        '<View><Query><Where><Eq><FieldRef Name=\'Charla\' LookupId="TRUE" />' +
        '<Value Type=\'Lookup\'>' + id + '</Value></Eq></Where></Query></View>'
    );

    var items = oList.getItems(camlQuery);

    clientContext.load(items);

    clientContext.executeQueryAsync(
        Function.createDelegate(this, function () {
            if (items.get_count() > 0) {
                $(charla).text("Inscripciones: " + items.get_count());
            }

            var currentIndex = index;
            currentIndex += 1;
            checkAforo(charlas, currentIndex);
        }),
        Function.createDelegate(this, function (sender, args) {
            console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
        })
    );
}