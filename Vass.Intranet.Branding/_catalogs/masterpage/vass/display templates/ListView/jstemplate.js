(function () {
    
    var itemContext = {};
    itemContext.Templates = {};

    itemContext.Templates.Header = headerTemplate;
    itemContext.Templates.Footer = footerTemplate;
    itemContext.Templates.Item = itemTemplate;
    itemContext.OnPostRender = postRender;

    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(itemContext);

})();

function headerTemplate(ctx) {
    var listName = ctx.ListTitle.toLowerCase();

    switch (listName) {
        case "sugerencias":
            return Suggestion.headerTemplate(ctx);
            break;
        case "banners":
            return Banner.headerTemplate(ctx);
            break;
        case "páginas":
            return PagesList.headerTemplate(ctx);
            break;
    }
}

function itemTemplate(ctx) {
    var listName = ctx.ListTitle.toLowerCase();

    switch (listName) {
        case "sugerencias":
            return Suggestion.itemTemplate(ctx);
            break;
        case "banners":
            return Banner.itemTemplate(ctx);
            break;
        case "páginas":
            return PagesList.itemTemplate(ctx);
            break;
    }
}

function footerTemplate(ctx) {
    var listName = ctx.ListTitle.toLowerCase();

    switch (listName) {
        case "sugerencias":
            return Suggestion.footerTemplate(ctx);
            break;
        case "banners":
            return Banner.footerTemplate(ctx);
            break;
        case "páginas":
            return PagesList.footerTemplate(ctx);
            break;
    }
}

function postRender(ctx) {
    var listName = ctx.ListTitle.toLowerCase();

    switch (listName) {
        case "sugerencias":
            return Suggestion.onpostrender(ctx);
            break;
        case "banners":
            return Banner.onpostrender(ctx);
            break;
        case "páginas":
            return PagesList.onpostrender(ctx);
            break;
    }
}