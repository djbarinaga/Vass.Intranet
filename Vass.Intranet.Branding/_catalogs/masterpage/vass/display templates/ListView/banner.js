var itemCount;

(function () {
    
    var bannerContext = {};
    bannerContext.Templates = {};

    bannerContext.Templates.Header = '<div>';
    bannerContext.Templates.Footer = '<div>';
    bannerContext.Templates.Item = bannerTemplate;

    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(bannerContext);

})();

function bannerTemplate(ctx) {
    var link = jQuery('<a href="' + ctx.CurrentItem["URL"] + '">' + ctx.CurrentItem["Title"] + '</a>');
    var html = '';
    var bgColor;
    var bgImagen = '/Style library/images/';

    switch (ctx.CurrentItem["Color"]) {
        case 'Azul':
            bgColor = '#50bbeb';
            break;
        case 'Morado':
            bgColor = '#6d6ba6';
            break;
        case 'Violeta':
            bgColor = '#9b549e';
            break;
        case 'Naranja':
            bgColor = '#f39a4a';
            break;
        case 'Verde':
            bgColor = '#629e4d';
            break;
        case 'Aceituna':
            bgColor = '#d3d612';
            break;
    }

    if (ctx.CurrentItem["Image"] != null) {
        bgImagen = result.Image.Url;
    }
    else {
        switch (ctx.CurrentItem["Icon"]) {
            case 'Diálogo':
                bgImagen += 'dialogue.png';
                break;
            case 'Mano':
                bgImagen += 'hand.png';
                break;
            default:
                bgImagen = '';
                break;
        }
    }

    if (ctx.CurrentItem["Image"] != null) {
        html += '<div data-target="Banner 4" class="panel banner image" style="background-size:cover;background:url(' + bgImagen + ')">';
    }
    else if (bgImagen == '') {
        banner.css('background-color', bgColor);
    }
    else if (result.Icon != null) {
        banner.css('background', 'url("' + bgImagen + '") ' + bgColor + ' no-repeat 90% 90%');
    }

    html += '</div>';



    if (result.Description == null)
        $(link).addClass('w-75');
    else
        banner.find('.panel-body').append('<p class="w-75">' + result.Description + '</p>');

    html += '<td><a href="' + fileRef + '">' + title + '</a></td>';
    html += '<td>' + fileSize + '</td>';

    html += '</tr>';
    
    return html;
}