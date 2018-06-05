var Suggestion = {
    headerTemplate: function (ctx) {
        var html = '<div class="module">' +
            '<div class="module-content">' +
            '<div class="row">';

        return html;
    },

    itemTemplate: function (ctx) {
        var title = ctx.CurrentItem["Title"];
        var description = ctx.CurrentItem["Description"];
        var link = ctx.CurrentItem["URL"];
        var itemIcon = ctx.CurrentItem["Icono"];
        var icon = getIcon(itemIcon);

        var total = ctx.ListData.Row.length;
        var colWidth = 12 / total;
        var col = 'col-' + colWidth;

        var html = '<div class="' + col + '">';

        html += '<div class="card">';
        html += '<div class="card-body">';

        html += '<h4 class="card-title">';

        if (icon != null)
            html += icon;

        html += '<a href="' + link + '">' + title + '</a>';
        html += '</h4>';

        html += '<p class="card-text">' + description + '</p>';

        html += '</div>';
        html += '</div>';
        html += '</div>';


        return html;
    },

    footerTemplate: function (ctx) {
        return '</div></div></div>';
    },

    onpostrender: function (ctx) {
        $('.ms-webpart-titleText a').removeAttr('href');
    }
}

var Banner = {
    headerTemplate: function (ctx) {
        var html = '<div class="module">' +
            '<div class="module-content">' +
            '<div class="row">';

        return html;
    },

    itemTemplate: function (ctx) {
        var title = ctx.CurrentItem["Title"];
        var description = ctx.CurrentItem["Description"];
        var color = ctx.CurrentItem["Color"];
        var itemIcon = ctx.CurrentItem["Icono"];
        var link = ctx.CurrentItem["URL"];
        var image = ctx.CurrentItem["Image"];
        var doubleBanner = ctx.CurrentItem["Icono_x0020_lateral.value"];

        var bgColor;

        switch (color) {
            case 'Azul':
                bgColor = 'bg-blue';
                break;
            case 'Morado':
                bgColor = 'bg-purple';
                break;
            case 'Violeta':
                bgColor = 'bg-violet';
                break;
            case 'Naranja':
                bgColor = 'bg-orange';
                break;
            case 'Verde':
                bgColor = 'bg-green';
                break;
            case 'Caqui':
                bgColor = 'bg-khaki';
                break;
        }

        var icon = getIcon(itemIcon);

        var total = ctx.ListData.Row.length;
        var colWidth = 12 / total;

        if (colWidth < 4)
            colWidth = 4;

        var col = 'col-' + colWidth;

        var html = '<div class="' + col + '">';

        if (doubleBanner == 1) {
            html += '<div class="icon-l">';

            html += '<div class="banner-icon ' + bgColor + '">';
            html += icon;
            html += '</div>';

            html += '<div class="panel banner">';

            html += '<div class="panel-body">';

            html += '<a href="' + link + '">' + title + '</a>';

            html += '<p>' + description + '</p>';

            html += '</div>';

            html += '</div>';

            html += '</div>';
        }
        else {
            if (image != '') {
                html += '<div class="panel banner image" style="background:url(\'' + image + '\') no-repeat">';

                html += '<div class="panel-body">';

                html += '<a href="' + link + '">' + title + '</a>';

                html += '</div>';

                html += '</div>';
            }
            else {

                html += '<div class="panel banner ' + bgColor + '">';

                html += '<div class="panel-body">';

                html += '<a href="' + link + '">' + title + '</a>';

                html += '<p>' + description + '</p>';

                if (icon != null)
                    html += icon;

                html += '</div>';

                html += '</div>';
            }
        }

        
        html += '</div>';


        return html;
    },

    footerTemplate: function (ctx) {
        return '</div></div></div>';
    },

    onpostrender: function (ctx) {
        $('.ms-webpart-titleText a').removeAttr('href');
    }
}

var PagesList = {
    headerTemplate: function (ctx) {
        var html = '<div class="module">' +
            '<div class="module-content">' +
            '<div class="row">';

        return html;
    },

    itemTemplate: function (ctx) {
        var title = ctx.CurrentItem["Title"];
        var description = ctx.CurrentItem["Summary"];
        var link = ctx.CurrentItem["URL"];
        var image = ctx.CurrentItem["PublishingRollupImage"];

        var div = $(image);
        div.find('img').addClass('img-fluid');

        var total = ctx.ListData.Row.length;
        var colWidth = 6;
        var col = 'col-' + colWidth;

        var html = '<div class="' + col + '">';

        html += '<div class="card">';
        html += '<div class="card-body">';

        html += '<h4 class="card-title"><a href="' + link + '">' + title + '</a></h4>';
        html += div.html();
        html += '<p class="card-text">' + description + '</p>';

        html += '</div>';
        html += '</div>';
        html += '</div>';


        return html;
    },

    footerTemplate: function (ctx) {
        return '</div></div></div>';
    },

    onpostrender: function (ctx) {
        $('.ms-webpart-titleText a').removeAttr('href');
    }
}

var PageHighlight = {
    headerTemplate: function (ctx) {
        var html = '<div class="module">' +
            '<div class="module-content">' +
            '<div class="row">';

        return html;
    },

    itemTemplate: function (ctx) {
        var title = ctx.CurrentItem["Title"];
        var description = ctx.CurrentItem["Summary"];
        var link = ctx.CurrentItem["URL"];
        var image = ctx.CurrentItem["PublishingRollupImage"];

        var div = $(image);
        div.find('img').addClass('img-fluid');

        var total = ctx.ListData.Row.length;
        var colWidth = 6;
        var col = 'col-' + colWidth;

        var html = '<div class="' + col + '">';

        html += '<div class="card">';
        html += '<div class="card-body">';

        html += '<h4 class="card-title"><a href="' + link + '">' + title + '</a></h4>';
        html += div.html();
        html += '<p class="card-text">' + description + '</p>';

        html += '</div>';
        html += '</div>';
        html += '</div>';


        return html;
    },

    footerTemplate: function (ctx) {
        return '</div></div></div>';
    },

    onpostrender: function (ctx) {
        $('.ms-webpart-titleText a').removeAttr('href');
    }
}