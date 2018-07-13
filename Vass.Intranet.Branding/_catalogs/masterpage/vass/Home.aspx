<%@ Page Language="C#" Inherits="Microsoft.SharePoint.Publishing.PublishingLayoutPage,Microsoft.SharePoint.Publishing,Version=16.0.0.0,Culture=neutral,PublicKeyToken=71e9bce111e9429c" %>

<%@ Register TagPrefix="SharePointWebControls" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="PublishingWebControls" Namespace="Microsoft.SharePoint.Publishing.WebControls" Assembly="Microsoft.SharePoint.Publishing, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="PublishingNavigation" Namespace="Microsoft.SharePoint.Publishing.Navigation" Assembly="Microsoft.SharePoint.Publishing, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<asp:Content contentplaceholderid="PlaceHolderAdditionalPageHead" runat="server">
	<SharePointWebControls:CssRegistration name="<% $SPUrl:~sitecollection/Style Library/~language/Themable/Core Styles/pagelayouts15.css %>" runat="server"/>
	<PublishingWebControls:EditModePanel runat="server">
		<!-- Styles for edit mode only-->
		<SharePointWebControls:CssRegistration name="<% $SPUrl:~sitecollection/Style Library/~language/Themable/Core Styles/editmode15.css %>"
			After="<% $SPUrl:~sitecollection/Style Library/~language/Themable/Core Styles/pagelayouts15.css %>" runat="server"/>
	</PublishingWebControls:EditModePanel>
    <script type="text/javascript" src="https://c64.assets-yammer.com/assets/platform_embed.js"></script>
<script type= "text/javascript" data-app-id="8Z6wlIYczbZAxWELw2Zyyg" src="https://c64.assets-yammer.com/assets/platform_js_sdk.js" ></script>
<script type="text/javascript" src="/style library/js/yammer.js"></script>
<script type="text/javascript" src="/style library/js/ranking.js"></script>
    <script type="text/javascript" src="/style library/js/masonry.js"></script>
    <script type="text/javascript">
        $(document).ready(function () {
            $('.tiles').masonry({
              itemSelector: '.tile'
            });
        });
    </script>
</asp:Content>
<asp:Content contentplaceholderid="PlaceHolderPageTitle" runat="server">
	<SharePointWebControls:FieldValue FieldName="Title" runat="server"/>
</asp:Content>
<asp:Content contentplaceholderid="PlaceHolderPageTitleInTitleArea" runat="server">
	<SharePointWebControls:FieldValue FieldName="Title" runat="server" />
</asp:Content>
<asp:Content contentplaceholderid="PlaceHolderTitleBreadcrumb" runat="server"> 
    <SharePointWebControls:ListSiteMapPath runat="server" SiteMapProviders="CurrentNavigationSwitchableProvider" RenderCurrentNodeAsLink="false" PathSeparator="" CssClass="s4-breadcrumb" NodeStyle-CssClass="s4-breadcrumbNode" CurrentNodeStyle-CssClass="s4-breadcrumbCurrentNode" RootNodeStyle-CssClass="s4-breadcrumbRootNode" NodeImageOffsetX=0 NodeImageOffsetY=289 NodeImageWidth=16 NodeImageHeight=16 NodeImageUrl="/_layouts/15/images/fgimg.png?rev=44" HideInteriorRootNodes="true" SkipLinkText="" /> </asp:Content>
<asp:Content contentplaceholderid="PlaceHolderPageDescription" runat="server">
	<SharePointWebControls:ProjectProperty Property="Description" runat="server"/>
</asp:Content>
<asp:Content contentplaceholderid="PlaceHolderBodyRightMargin" runat="server">
	<div height=100% class="ms-pagemargin"><IMG SRC="/_layouts/images/blank.gif" width=10 height=1 alt=""></div>
</asp:Content>
<asp:Content contentplaceholderid="PlaceHolderMain" runat="server">
    <PublishingWebControls:EditModePanel runat="server" CssClass="edit-mode-panel title-edit">
		<SharePointWebControls:TextField runat="server" FieldName="Title"/>
	</PublishingWebControls:EditModePanel>
    <div id="home">
        <div id="top-zone" class="container-fluid">
            <div class="row mb-0">
                <div class="col">
                    <div class="row">
                        <div class="col br-10 pr-0 pl-0">
                            <div id="carouselNews" class="carousel slide" data-ride="carousel" data-pause="false" style="overflow:hidden;">
                              <div class="carousel-inner"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row mt-30">
                <div class="col-3 ml-20 pr-0">
                    <div id="calendar">
                        <div class="month">      
                            <ul>
                                <li class="prev"><a href="#">&#10094;</a></li>
                                <li class="next"><a href="#">&#10095;</a></li>
                                <li class="current-month"></li>
                            </ul>
                        </div>

                        <ul class="weekdays"></ul>

                        <ul class="days"></ul>
                    </div>
                </div>
                <div class="col-3 o-hidden pr-0" style="height:241px;background: url('/style library/images/calendar.png') no-repeat 55%;">
                    <div class="event-today">
                        <div class="event-date">
                            <span class="event-day"></span>
                            <span class="event-day-number"></span>
                            <span class="event-month"></span>
                            <hr />
                            <div class="events-div" data-simplebar>
                                <ul class="events"></ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="tiles" style="height: 100px;" data-role="tiles"></div>
                </div>
            </div>
        </div>
        <div class="content" style="height: 1500px;">
            <div class="row">
            <div class="col-4">
                <div class="panel">
                    <div class="panel-body">
                        <p class="panel-title"><span class="font-weight-semi-bold">Charlas</span> @innovation depot</p>
                        <div id="ranking"></div>
                    </div>
                </div>

                <div id="yammer" style="height:300px"></div>
            </div>
            <div class="col">
                <div class="row">
                    <div class="col">
                        <div class="panel">
                          <div class="panel-body">
                            <p class="panel-title"><span class="font-weight-semi-bold">Próximos</span> eventos</p>
                            <ul id="vass-calendar"></ul>
                            <div class="toolbar">
                                <a href="/es-es/marketing/Paginas/Eventos.aspx"><span class="icon-mas span-corrector"></span>ver todos</a>
                            </div>
                          </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="panel">
                          <div class="panel-body">
                            <p class="panel-title"><span class="font-weight-semi-bold">Tareas</span> pendientes</p>
                            <ul id="my-tasks"></ul>
                          </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <div class="panel icon-left">
                          <div class="panel-body">
                            <p class="panel-title"><span class="font-weight-semi-bold">Mis</span> proyectos</p>
                            <ul id="my-projects"></ul>
                            <div class="toolbar">
                                <a href="/es-es/Paginas/mis-proyectos.aspx"><span class="icon-mas"></span>ver todos</a>
                            </div>
                          </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="panel icon-left">
                          <div class="panel-body">
                            <p class="panel-title"><span class="font-weight-semi-bold">Mis</span> gremios</p>
                            <ul id="my-guilds"></ul>
                              <div class="toolbar">
                                <a href="/es-es/Paginas/mis-gremios.aspx"><span class="icon-mas"></span>ver todos</a>
                            </div>
                          </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="panel icon-left">
                          <div class="panel-body">
                            <p class="panel-title"><span class="font-weight-semi-bold">Mis</span> equipos</p>
                            <ul id="my-teams"></ul>
                            <div class="toolbar">
                                <a href="/es-es/Paginas/mis-equipos.aspx"><span class="icon-mas"></span>ver todos</a>
                            </div>
                          </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <WebPartPages:WebPartZone runat="server" Title="Zona 6" ID="WebPartZone7" />
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <WebPartPages:WebPartZone runat="server" Title="Zona 8" ID="WebPartZone1" />
                    </div>
                    <div class="col">
                        <WebPartPages:WebPartZone runat="server" Title="Zona 9" ID="WebPartZone8" />
                    </div>
                </div>
            </div>
        </div>
        </div>
    </div>
    <SharePointWebControls:ScriptBlock runat="server">if(typeof(MSOLayout_MakeInvisibleIfEmpty) == "function") {MSOLayout_MakeInvisibleIfEmpty();}</SharePointWebControls:ScriptBlock>
</asp:Content>
