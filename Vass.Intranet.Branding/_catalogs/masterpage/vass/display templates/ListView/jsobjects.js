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

        if (Number(doubleBanner) == 1) {
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
        var html = '<div class="module article-list">' +
            '<div class="module-content">' +
            '<div class="row">';

        return html;
    },

    itemTemplate: function (ctx) {
        var title = ctx.CurrentItem["Title"];
        var description = ctx.CurrentItem["Summary"];
        var link = ctx.CurrentItem["FileRef"];
        var image = ctx.CurrentItem["PublishingRollupImage"];
        var created = ctx.CurrentItem["Created"];
        var date;

        if (created != null) {
            var dateParts = created.split(' ');
            date = dateParts[0];
        }
        

        var div = $(image);
        var src = div.find('img').attr('src');

        var html = '';

        html += '<div class="col article-card">';

        html += '   <div class="row">';
        html += '       <div class="col">';
        html += '           <div class="article-image" style="background:url(\'' + src + '\') no-repeat; background-size:cover">';
        html += '           </div>';
        html += '       </div>';
        html += '       <div class="col-8 article-data">';
        if(date != null)
            html += '           <p class="article-date">' + date + '</p>';

        html += '           <a href="' + link + '">' + title + '</a>';

        if (description != null)
            html += '           <p>' + stripHtml(description) + '</p>';

        html += '       </div>';
        html += '   </div>';

        html += '</div>';

        return html;
    },

    footerTemplate: function (ctx) {
        var firstRow = ctx.ListData.FirstRow;
        var lastRow = ctx.ListData.LastRow;
        var prev = ctx.ListData.PrevHref;
        var next = ctx.ListData.NextHref;

        var html = '</div></div></div>';

        if (prev || next) {
            html += "<div class='paging'>";
            html += prev ? "<a href='" + prev + "'><span class='icon-izquierda'></span></a>" : "";
            html += "<span class='ms-paging'><span class='First'>" + firstRow + "</span> - <span class='Last'>" + lastRow + "</span></span>";
            html += next ? "<a href='" + next + "'><span class='icon-derecha'></a>" : "";
            html += "</div>";
        }



        return html;
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

var ThumbnailList = {
    headerTemplate: function (ctx) {
        var html = '<div class="module thumbnail">' +
            '<div class="module-content">' +
            '<div class="row">';

        return html;
    },

    itemTemplate: function (ctx) {
        var link = ctx.CurrentItem["FileRef"];
        var name = ctx.CurrentItem["FileLeafRef"];

        var total = ctx.ListData.Row.length;
        var colWidth = 12 / total;

        if (colWidth < 3)
            colWidth = 3;

        var col = 'col-3';

        var html = '<div class="' + col + '" data-aos="fade-up" data-aos-once="true">';

        html += '<div class="thumbnail-container"><div class="row">';

        html += '<div class="col">';
        html += '<img src="' + link + '" class="img-thumbnail"/>';
        html += '</div>';

        html += '<div class="col">';
        html += '<a href="' + link + '" download="' + name + '">Descargar</a>';
        html += '</div>';


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

var ThumbnailGallery = {
    headerTemplate: function (ctx) {
        var html = '<div class="module thumbnail">' +
            '<div class="module-content">' +
            '<div class="row">';

        return html;
    },

    itemTemplate: function (ctx) {
        var link = ctx.CurrentItem["FileRef"];
        var name = ctx.CurrentItem["FileLeafRef"];

        var total = ctx.ListData.Row.length;
        var colWidth = 12 / total;

        if (colWidth < 3)
            colWidth = 3;

        var col = 'col-3';

        var html = '<div class="' + col + ' text-center" data-aos="fade-up" data-aos-once="true">';

        html += '<img src="' + link + '" class="img-thumbnail"/>';

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

var DocumentsList = {
    headerTemplate: function (ctx) {
        var html = '<div class="module doc-list">' +
            '<div class="module-content">' +
            '<table class="table table-striped">';

        return html;
    },

    itemTemplate: function (ctx) {
        var link = ctx.CurrentItem["FileRef"];
        var name = ctx.CurrentItem["FileLeafRef"];
        var type = ctx.CurrentItem["File_x0020_Type"];
        var description = ctx.CurrentItem["Description"];
        var size = this.bytesToSize(ctx.CurrentItem["File_x0020_Size"]);

        var html = '<tr>';

        var iconclass = 'icon-texto';

        if (type == 'jpg' || type == 'jpeg' || type == 'png' || type == 'gif')
            iconclass = "icon-foto_01";

        html += '<td><span class="' + iconclass + '"></span><a href="' + link + '" download="' + name + '">' + name + '</a></td>';

        if(description != null && description != '')
            html += '<td>' + description + '</td>';

        if (ctx.CurrentItem["File_x0020_Size"] != null)
            html += '<td>' + size + '</td>';

        html += '</tr>';


        return html;
    },

    footerTemplate: function (ctx) {
        return '</table></div></div>';
    },

    onpostrender: function (ctx) {
        $('.ms-webpart-titleText a').removeAttr('href');
    },

    bytesToSize: function (bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }
}

var ImageGallery = {
    headerTemplate: function (ctx) {
        var html = '<div class="module img-gallery">' +
            '<div class="module-content">' +
            '<div class="row">';

        return html;
    },

    itemTemplate: function (ctx) {
        var link = ctx.CurrentItem["FileRef"];
        var name = ctx.CurrentItem["FileLeafRef"];
        var type = ctx.CurrentItem["File_x0020_Type"];
        var size = this.bytesToSize(ctx.CurrentItem["File_x0020_Size"]);
        var height = ctx.CurrentItem["ImageHeight"];
        var width = ctx.CurrentItem["ImageWidth"];

        var html = '<div class="col-3" data-aos="fade-up" data-aos-once="true">';

        html += '<div class="card">';

        html += '<a href="' + link + '" data-lightbox="roadtrip"><img class="card-img-top" src="' + link + '"/></a>';

        html += '<div class="card-body">';

        //html += '<h5 class="card-title">' + name + '</h5>';
        html += '<p class="card-text"><span class="icon-expande"></span>' + width + 'px x ' + height + 'px&nbsp;<span class="icon-cloud_baja"></span>' + size;
        html += '<a href="' + link + '" download="' + name + '" class="float-right pt-4">Descargar</a>';
        html += '</p>';

        html += '</div>';
        html += '</div>';
        html += '</div>';

        return html;
    },

    footerTemplate: function (ctx) {
        var firstRow = ctx.ListData.FirstRow;
        var lastRow = ctx.ListData.LastRow;
        var prev = ctx.ListData.PrevHref;
        var next = ctx.ListData.NextHref;

        var html = '</div></div></div>';

        if (prev || next) {
            html += "<div class='paging'>";
            html += prev ? "<a href='" + prev + "'><span class='icon-izquierda'></span></a>" : "";
            html += "<span class='ms-paging'><span class='First'>" + firstRow + "</span> - <span class='Last'>" + lastRow + "</span></span>";
            html += next ? "<a href='" + next + "'><span class='icon-derecha'></a>" : "";
            html += "</div>";
        }

        return html;
    },

    onpostrender: function (ctx) {
        $('.ms-webpart-titleText a').removeAttr('href');
    },

    bytesToSize: function (bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }
}

var Links = {
    headerTemplate: function(ctx) {
        var html = '';
    html += '<table class="table table-striped">';

    return html;
    },

    itemTemplate: function(ctx) {
        var title = ctx.CurrentItem["URL.desc"];
        var link = ctx.CurrentItem["URL"];

        var html = '<tr>';

        html += '<td><a href="' + link + '" target="_blank">' + title + '</a></td>';

        html += '</tr>';

        return html;
    },

    footerTemplate: function (ctx) {
        return '</table>';
    }
}