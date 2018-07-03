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

    if (ctx.ListTemplateType == 851) {
        return ThumbnailList.headerTemplate(ctx);
    }
    else {
        switch (listName) {
            case "modelo para evaluadores":
                return Links.headerTemplate(ctx);
                break;
            case "sugerencias":
                return Suggestion.headerTemplate(ctx);
                break;
            case "banners":
                return Banner.headerTemplate(ctx);
                break;
            case "páginas":
                return PagesList.headerTemplate(ctx);
                break;
            case "logos grupo vass":
            case "logos fabricantes":
                return ThumbnailList.headerTemplate(ctx);
                break;
            case "plantillas corporativas":
            case "evaluadores":
            case "ppts corporativas":
            case "creatividades":
            case "diseños":
                return DocumentsList.headerTemplate(ctx);
                break;
            case "imágenes":
                return ImageGallery.headerTemplate(ctx);
                break;
            default:
                return '';
                break;
        }
    }
}

function itemTemplate(ctx) {
    var listName = ctx.ListTitle.toLowerCase();

    if (ctx.ListTemplateType == 851) {
        return ThumbnailList.itemTemplate(ctx);
    }
    else {
        switch (listName) {
            case "modelo para evaluadores":
                return Links.itemTemplate(ctx);
                break;
            case "sugerencias":
                return Suggestion.itemTemplate(ctx);
                break;
            case "banners":
                return Banner.itemTemplate(ctx);
                break;
            case "páginas":
                return PagesList.itemTemplate(ctx);
                break;
            case "logos grupo vass":
            case "logos fabricantes":
                return ThumbnailList.itemTemplate(ctx);
                break;
            case "plantillas corporativas":
            case "evaluadores":
            case "ppts corporativas":
            case "creatividades":
            case "diseños":
                return DocumentsList.itemTemplate(ctx);
                break;
            case "imágenes":
                return ImageGallery.itemTemplate(ctx);
                break;
        }
    }
}

function footerTemplate(ctx) {
    var listName = ctx.ListTitle.toLowerCase();

    if (ctx.ListTemplateType == 851) {
        return ThumbnailList.footerTemplate(ctx);
    }
    else {
        switch (listName) {
            case "modelo para evaluadores":
                return Links.footerTemplate(ctx);
                break;
            case "sugerencias":
                return Suggestion.footerTemplate(ctx);
                break;
            case "banners":
                return Banner.footerTemplate(ctx);
                break;
            case "páginas":
                return PagesList.footerTemplate(ctx);
                break;
            case "logos grupo vass":
            case "logos fabricantes":
                return ThumbnailList.footerTemplate(ctx);
                break;
            case "plantillas corporativas":
            case "ppts corporativas":
            case "evaluadores":
            case "creatividades":
            case "diseños":
                return DocumentsList.footerTemplate(ctx);
                break;
            case "imágenes":
                return ImageGallery.footerTemplate(ctx);
                break;
        }
    }
}

function postRender(ctx) {
    var listName = ctx.ListTitle.toLowerCase();

    if (ctx.ListTemplateType == 851) {
        return ImageGallery.onpostrender(ctx);
    }
    else {
        switch (listName) {
            case "modelo para evaluadores":
                return Links.onpostrender(ctx);
                break;
            case "sugerencias":
                return Suggestion.onpostrender(ctx);
                break;
            case "banners":
                return Banner.onpostrender(ctx);
                break;
            case "páginas":
                return PagesList.onpostrender(ctx);
                break;
            case "logos grupo vass":
            case "logos fabricantes":
                return ThumbnailList.onpostrender(ctx);
                break;
            case "plantillas corporativas":
            case "ppts corporativas":
            case "evaluadores":
            case "creatividades":
            case "diseños":
                return DocumentsList.onpostrender(ctx);
                break;
            case "imágenes":
                return ImageGallery.onpostrender(ctx);
                break;
        }
    }
}