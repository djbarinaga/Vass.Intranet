<%@ Page Language="C#" Inherits="Microsoft.SharePoint.Publishing.PublishingLayoutPage,Microsoft.SharePoint.Publishing,Version=16.0.0.0,Culture=neutral,PublicKeyToken=71e9bce111e9429c" %>

<%@ Register TagPrefix="SharePointWebControls" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="PublishingWebControls" Namespace="Microsoft.SharePoint.Publishing.WebControls" Assembly="Microsoft.SharePoint.Publishing, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="PublishingNavigation" Namespace="Microsoft.SharePoint.Publishing.Navigation" Assembly="Microsoft.SharePoint.Publishing, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<asp:content contentplaceholderid="PlaceHolderAdditionalPageHead" runat="server">
	<SharePointWebControls:CssRegistration name="<% $SPUrl:~sitecollection/Style Library/~language/Themable/Core Styles/pagelayouts15.css %>" runat="server"/>
	<PublishingWebControls:EditModePanel runat="server">
		<!-- Styles for edit mode only-->
		<SharePointWebControls:CssRegistration name="<% $SPUrl:~sitecollection/Style Library/~language/Themable/Core Styles/editmode15.css %>"
			After="<% $SPUrl:~sitecollection/Style Library/~language/Themable/Core Styles/pagelayouts15.css %>" runat="server"/>
	</PublishingWebControls:EditModePanel>
    <script type="text/javascript" src="https://c64.assets-yammer.com/assets/platform_embed.js"></script>
</asp:content>
<asp:content contentplaceholderid="PlaceHolderPageTitle" runat="server">
	<SharePointWebControls:FieldValue FieldName="Title" runat="server"/>
</asp:content>
<asp:content contentplaceholderid="PlaceHolderPageTitleInTitleArea" runat="server">
	<SharePointWebControls:FieldValue FieldName="Title" runat="server" />
</asp:content>
<asp:content contentplaceholderid="PlaceHolderTitleBreadcrumb" runat="server"> 
    <SharePointWebControls:ListSiteMapPath runat="server" SiteMapProviders="CurrentNavigationSwitchableProvider" RenderCurrentNodeAsLink="false" PathSeparator="" CssClass="s4-breadcrumb" NodeStyle-CssClass="s4-breadcrumbNode" CurrentNodeStyle-CssClass="s4-breadcrumbCurrentNode" RootNodeStyle-CssClass="s4-breadcrumbRootNode" NodeImageOffsetX=0 NodeImageOffsetY=289 NodeImageWidth=16 NodeImageHeight=16 NodeImageUrl="/_layouts/15/images/fgimg.png?rev=44" HideInteriorRootNodes="true" SkipLinkText="" /> </asp:content>
<asp:content contentplaceholderid="PlaceHolderPageDescription" runat="server">
	<SharePointWebControls:ProjectProperty Property="Description" runat="server"/>
</asp:content>
<asp:content contentplaceholderid="PlaceHolderBodyRightMargin" runat="server">
	<div height=100% class="ms-pagemargin"><IMG SRC="/_layouts/images/blank.gif" width=10 height=1 alt=""></div>
</asp:content>
<asp:Content contentplaceholderid="PlaceHolderMain" runat="server">
    <PublishingWebControls:EditModePanel runat="server" CssClass="edit-mode-panel title-edit">
		<SharePointWebControls:TextField runat="server" FieldName="Title"/>
	</PublishingWebControls:EditModePanel>
    <div id="home">
        <div id="top-zone" class="container-fluid">
            <div class="row mb-0">
                <div class="col">
                    <div class="row" style="height: 250px;">
                        <div class="col">
                            <div data-target="Banner 1" class="panel banner">
                                <div class="panel-body"></div>
                            </div>
                        </div>
                    </div>
                    <div class="row no-gutters" style="height: 200px;">
                        <div class="col-8">
                            <div id="calendar">
                                        <div class="month">      
                                          <ul>
                                            <li class="prev">&#10094;</li>
                                            <li class="next">&#10095;</li>
                                            <li class="current-month">
                                              Marzo <span>2018</span>
                                            </li>
                                          </ul>
                                        </div>

                                        <ul class="weekdays">
                                          <li>L</li>
                                          <li>M</li>
                                          <li>X</li>
                                          <li>J</li>
                                          <li>V</li>
                                          <li>S</li>
                                          <li>D</li>
                                        </ul>

                                        <ul class="days">  
                                          <li>1</li>
                                          <li>2</li>
                                          <li>3</li>
                                          <li>4</li>
                                          <li>5</li>
                                          <li>6</li>
                                          <li>7</li>
                                          <li>8</li>
                                          <li>9</li>
                                          <li><span class="active">10</span></li>
                                          <li>11</li>
                                          <li>12</li>
                                          <li>13</li>
                                          <li>14</li>
                                          <li>15</li>
                                          <li>16</li>
                                          <li>17</li>
                                          <li>18</li>
                                          <li>19</li>
                                          <li>20</li>
                                          <li>21</li>
                                          <li>22</li>
                                          <li><span class="active">23</span></li>
                                          <li>24</li>
                                          <li>25</li>
                                          <li>26</li>
                                          <li>27</li>
                                          <li>28</li>
                                          <li><span class="active">29</span></li>
                                          <li>30</li>
                                          <li>31</li>
                                        </ul>
                                    </div>
                        </div>
                        <div class="col-4 o-hidden h-200">
                            <div class="event-today">
                                <div class="event-date">
                                    <span class="event-day">Viernes</span>
                                    <span class="event-day-number">23</span>
                                    <span class="event-month">Marzo</span>
                                    <hr />
                                    <ul class="events">
                                        <li>
                                            <span class="clock">12:00</span>
                                            <span>Reunión de seguimiento</span>
                                        </li>
                                        <li>
                                            <span class="clock">13:00</span>
                                            <span>Reunión de seguimiento</span>
                                        </li>
                                        <li>
                                            <span class="clock">16:00</span>
                                            <span>Reunión de seguimiento</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="row" style="height: 350px;">
                        <div class="col">
                            <div id="carouselNews" class="carousel slide" data-ride="carousel" style="overflow:hidden;">
                              <ol class="carousel-indicators">
                                <li data-target="#carouselNews" data-slide-to="0" class="active"></li>
                                <li data-target="#carouselNews" data-slide-to="1"></li>
                              </ol>
                              <div class="carousel-inner">
                                <div class="carousel-item active">
                                  <img class="d-block w-100" src="https://grupovass.sharepoint.com/:i:/r/Style%20Library/Images/carousel1.jpg?csf=1&e=DgeSO7" alt="First slide">
                                </div>
                                <div class="carousel-item text-center" style="overflow: hidden;height: 328px;">
                                    <video class="video-fluid" autoplay loop style="width:630px;">
                                        <source src="https://mdbootstrap.com/img/video/forest.mp4" type="video/mp4" />
                                    </video>
                                </div>
                              </div>
                            </div>
                        </div>
                    </div>
                    <div class="row" style="height: 100px;">
                        <div class="col">
                            <div data-target="Banner 3" class="panel banner">
                                <div class="panel-body"></div>
                            </div>
                        </div>
                        <div class="col">
                            <div data-target="Banner 4" class="panel banner">
                                <div class="panel-body"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <WebPartPages:WebPartZone runat="server" Title="Header" ID="Header" />
        <div class="content">
            <div class="row">
            <div class="col-4">
                <div id="yammer" style="height:100%;">
                </div>
            </div>
            <div class="col">
                <div class="row">
                    <div class="col">
                        <div class="panel">
                          <div class="panel-body">
                            <p class="panel-title"><span class="font-weight-semi-bold">Próximos</span> eventos</p>
                            <ul>
                                <li>
                                    <h4>Showroom mobile app</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce elit purus, volutpat eget ipsum in, vestibulum porta metus.</p>
                                    <span class="date">16/03/2018</span>
                                </li>
                                <li>
                                    <h4>Tech Forum Madrid 2018</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce elit purus, volutpat eget ipsum in, vestibulum porta metus.</p>
                                    <span class="date">01/06/2018</span>
                                </li>
                            </ul>
                          </div>
                        </div>
                        <WebPartPages:WebPartZone runat="server" Title="Zona 1" ID="WebPartZone4" />
                    </div>
                    <div class="col">
                        <div class="panel">
                          <div class="panel-body">
                            <p class="panel-title"><span class="font-weight-semi-bold">Tareas</span> pendientes</p>
                            <ul>
                                <li>
                                    <h4>Aprobación de noticia para la Home</h4>
                                    <span class="date">16/03/2018</span>
                                </li>
                                <li>
                                    <h4>Kick off proyecto Bancamarch</h4>
                                    <span class="date">01/06/2018</span>
                                    <span class="clock">12:00</span>
                                </li>
                                <li>
                                    <h4>Entrega documentación proyecto</h4>
                                    <span class="date">01/06/2018</span>
                                    <span class="clock">16:00</span>
                                </li>
                            </ul>
                          </div>
                        </div>
                        <WebPartPages:WebPartZone runat="server" Title="Zona 2" ID="WebPartZone5" />
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <div class="panel icon-left">
                          <div class="panel-body">
                            <p class="panel-title"><span class="font-weight-semi-bold">Mis</span> equipos</p>
                            <ul>
                                <li>
                                    <div class="row">
                                        <div class="col--3 text-center">
                                            <span class="icon-agile"></span>
                                        </div>
                                        <div class="col">
                                            <h4>Aplicación para iOS</h4>
                                            <span>BBVA</span>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div class="row">
                                        <div class="col--3 text-center">
                                            <span class="icon-waterfall"></span>
                                        </div>
                                        <div class="col">
                                            <h4>Aplicación para el comercio exterior</h4>
                                            <span>Bancamarch</span>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div class="row">
                                        <div class="col--3 text-center">
                                            <span class="icon-guild"></span>
                                        </div>
                                        <div class="col">
                                            <h4>Angular</h4>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                              <div class="toolbar">
                                  <a href="https://teams.microsoft.com/" target="_blank" class="add">AÑADIR EQUIPO</a>
                              </div>
                          </div>
                        </div>
                        <WebPartPages:WebPartZone runat="server" Title="Zona 3" ID="WebPartZone6" />
                    </div>
                    <div class="col">
                        <div data-target="Banner 5" class="panel banner">
                          <div class="panel-body"></div>
                        </div>
                        <WebPartPages:WebPartZone runat="server" Title="Zona 4" ID="WebPartZone2" />
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <div data-target="Banner 6" class="panel banner">
                            <div class="panel-body"></div>
                        </div>
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
    <script>
        yam.connect.embedFeed({
            "config": {
                "use_sso": false,
                "header": false,
                "footer": false,
                "showOpenGraphPreview": false,
                "defaultToCanonical": false,
                "hideNetworkName": false,
                "theme": "light"
            },
            "container": "#yammer",
            network: 'grupovass.onmicrosoft.com'
        });
    </script>
</asp:Content>
