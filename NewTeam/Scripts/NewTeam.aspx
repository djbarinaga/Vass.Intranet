<%@ Page language="C#" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<WebPartPages:AllowFraming ID="AllowFraming" runat="server" />

<html>
<head>
    <title></title>

    <link rel="stylesheet" href="../Content/bootstrap.min.css" />
    <link rel="stylesheet" href="../Content/app.css" />

    <script type="text/javascript" src="/_layouts/15/init.js"></script>
    <script type="text/javascript" src="../Scripts/jquery-1.9.1.min.js"></script>
    <script type="text/javascript" src="/_layouts/15/MicrosoftAjax.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.js"></script>

    <script type="text/javascript" src="../Scripts/App.js"></script>

    <script type="text/javascript">
        // Set the style of the client web part page to be consistent with the host web.
        (function () {
            'use strict';

            var hostUrl = '';
            var link = document.createElement('link');
            link.setAttribute('rel', 'stylesheet');
            if (document.URL.indexOf('?') != -1) {
                var params = document.URL.split('?')[1].split('&');
                for (var i = 0; i < params.length; i++) {
                    var p = decodeURIComponent(params[i]);
                    if (/^SPHostUrl=/i.test(p)) {
                        hostUrl = p.split('=')[1];
                        link.setAttribute('href', hostUrl + '/_layouts/15/defaultcss.ashx');
                        break;
                    }
                }
            }
            if (hostUrl == '') {
                link.setAttribute('href', '/_layouts/15/1033/styles/themable/corev15.css');
            }
            document.head.appendChild(link);
        })();
    </script>
</head>
<body>
    <div id="wizard" class="container">
        <div class="row" id="wizard-indicators">
            <div class="col text-center">
                <p class="circle bg-primary">1</p>
            </div>
            <div class="col text-center">
                <p class="circle bg-info">2</p>
            </div>
            <div class="col text-center">
                <p class="circle bg-info">3</p>
            </div>
        </div>
        <div id="wizard-steps">
            <div class="row">
                <div class="col">
                    <div class="form">
                        <div class="form-group">
                            <label for="txtGroupName">Nombre del equipo</label>
                            <input type="text" class="form-control" id="txtGroupName" placeholder="Nombre del equipo">
                        </div>
                    </div>
                </div>
            </div>
            <div class="row d-none">
                <div class="col">
                    <div class="form">
                        <div class="form-group">
                            <label for="txtOwner">Propietario</label>
                            <input type="text" class="form-control" id="txtOwner" placeholder="Email del propietario">
                        </div>
                    </div>
                </div>
            </div>
            <div class="row d-none">
                <div class="col">
                    <p id="alert">Procesando...</p>
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" style="width: 25%"></div>
                    </div>
                </div>
            </div>
        </div>
        <div id="wizard-buttons" class="row">
            <button type="button" class="btn btn-default" id="prevStep">Anterior</button>
            <button type="button" class="btn btn-primary" id="nextStep">Siguiente</button>
        </div>
    </div>
</body>
</html>
