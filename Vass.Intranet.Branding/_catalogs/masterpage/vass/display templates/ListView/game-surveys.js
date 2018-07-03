(function () {
    
    var documentContext = {};
    documentContext.Templates = {};

    documentContext.Templates.Header = headerTemplate;
    documentContext.Templates.Footer = '</table>';
    documentContext.Templates.Item = documentTemplate;
    documentContext.OnPostRender = onPostRender;

    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(documentContext);

})();

function headerTemplate(ctx) {
    var html = '';
    html += '<table class="table table-striped">';

    return html;
}

function documentTemplate(ctx) {
    var title = ctx.CurrentItem["Title"];

    var html = '<tr>';

    html += '<td><a href="" target="_blank" data-survey="' + title + '">' + title + '</a></td>';

    html += '</tr>';
    
    return html;
}

function onPostRender(ctx) {
    var lists = $('a[data-survey]');

    getListLink(lists, 0);
}

function getListLink(lists, index) {
    if (index >= lists.length)
        return;

    var list = lists[index];
    var listTitle = $(list).data('survey');

    var clientContext = SP.ClientContext.get_current();
    var oList = clientContext.get_web().get_lists().getByTitle(listTitle);
    var listRootFolder = oList.get_rootFolder();

    clientContext.load(oList);
    clientContext.load(listRootFolder);

    clientContext.executeQueryAsync(
        Function.createDelegate(this, function () {
            var url = _spPageContextInfo.siteAbsoluteUrl + "/" + listRootFolder.get_serverRelativeUrl();
            $(list).attr('href', url);

            var currentIndex = index;
            currentIndex = index + 1;
            getListLink(lists, currentIndex);
        }),
        Function.createDelegate(this, function (sender, args) {
            console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
        })
    );
}