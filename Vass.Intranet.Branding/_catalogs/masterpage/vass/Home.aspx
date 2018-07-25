<%@ Page Language="C#" Inherits="Microsoft.SharePoint.Publishing.PublishingLayoutPage,Microsoft.SharePoint.Publishing,Version=16.0.0.0,Culture=neutral,PublicKeyToken=71e9bce111e9429c" meta:progid="SharePoint.WebPartPage.Document" %>

<%@ Register TagPrefix="SharePointWebControls" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="PublishingWebControls" Namespace="Microsoft.SharePoint.Publishing.WebControls" Assembly="Microsoft.SharePoint.Publishing, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="PublishingNavigation" Namespace="Microsoft.SharePoint.Publishing.Navigation" Assembly="Microsoft.SharePoint.Publishing, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<asp:Content contentplaceholderid="PlaceHolderAdditionalPageHead" runat="server">
	<SharePointWebControls:CssRegistration name="<% $SPUrl:~sitecollection/Style Library/~language/Themable/Core Styles/pagelayouts15.css %>" runat="server" __designer:Preview="" __designer:Values="&lt;P N=&#39;Name&#39; Bound=&#39;True&#39; T=&#39;SPUrl:~sitecollection/Style Library/~language/Themable/Core Styles/pagelayouts15.css&#39; /&gt;&lt;P N=&#39;ID&#39; ID=&#39;1&#39; T=&#39;ctl00&#39; /&gt;&lt;P N=&#39;Page&#39; ID=&#39;2&#39; /&gt;&lt;P N=&#39;TemplateControl&#39; R=&#39;2&#39; /&gt;&lt;P N=&#39;AppRelativeTemplateSourceDirectory&#39; R=&#39;-1&#39; /&gt;"/>
	<PublishingWebControls:EditModePanel runat="server" __designer:Preview="&lt;Regions&gt;&lt;Region Name=&quot;0&quot; Editable=&quot;True&quot; Content=&quot;&amp;#xD;&amp;#xA;		&amp;lt;!-- Styles for edit mode only--&amp;gt;&amp;#xD;&amp;#xA;		&amp;lt;SharePointWebControls:CssRegistration name=&amp;quot;&amp;lt;% $SPUrl:~sitecollection/Style Library/~language/Themable/Core Styles/editmode15.css %&amp;gt;&amp;quot;&amp;#xD;&amp;#xA;			After=&amp;quot;&amp;lt;% $SPUrl:~sitecollection/Style Library/~language/Themable/Core Styles/pagelayouts15.css %&amp;gt;&amp;quot; runat=&amp;quot;server&amp;quot; __designer:Preview=&amp;quot;&amp;quot; __designer:Values=&amp;quot;&amp;amp;lt;P N=&amp;amp;#39;Name&amp;amp;#39; Bound=&amp;amp;#39;True&amp;amp;#39; T=&amp;amp;#39;SPUrl:~sitecollection/Style Library/~language/Themable/Core Styles/editmode15.css&amp;amp;#39; /&amp;amp;gt;&amp;amp;lt;P N=&amp;amp;#39;After&amp;amp;#39; Bound=&amp;amp;#39;True&amp;amp;#39; T=&amp;amp;#39;SPUrl:~sitecollection/Style Library/~language/Themable/Core Styles/pagelayouts15.css&amp;amp;#39; /&amp;amp;gt;&amp;amp;lt;P N=&amp;amp;#39;ID&amp;amp;#39; T=&amp;amp;#39;ctl00&amp;amp;#39; /&amp;amp;gt;&amp;amp;lt;P N=&amp;amp;#39;Page&amp;amp;#39; ID=&amp;amp;#39;1&amp;amp;#39; /&amp;amp;gt;&amp;amp;lt;P N=&amp;amp;#39;TemplateControl&amp;amp;#39; R=&amp;amp;#39;1&amp;amp;#39; /&amp;amp;gt;&amp;amp;lt;P N=&amp;amp;#39;AppRelativeTemplateSourceDirectory&amp;amp;#39; R=&amp;amp;#39;-1&amp;amp;#39; /&amp;amp;gt;&amp;quot;/&amp;gt;&amp;#xD;&amp;#xA;	&quot; /&gt;&lt;/Regions&gt;
		&lt;!-- Styles for edit mode only--&gt;
		&lt;SharePointWebControls:CssRegistration name=&quot;&lt;% $SPUrl:~sitecollection/Style Library/~language/Themable/Core Styles/editmode15.css %&gt;&quot;
			After=&quot;&lt;% $SPUrl:~sitecollection/Style Library/~language/Themable/Core Styles/pagelayouts15.css %&gt;&quot; runat=&quot;server&quot;/&gt;
	" __designer:Values="&lt;P N=&#39;ID&#39; ID=&#39;1&#39; T=&#39;ctl01&#39; /&gt;&lt;P N=&#39;Page&#39; ID=&#39;2&#39; /&gt;&lt;P N=&#39;TemplateControl&#39; R=&#39;2&#39; /&gt;&lt;P N=&#39;AppRelativeTemplateSourceDirectory&#39; R=&#39;-1&#39; /&gt;&lt;P N=&#39;Visible&#39; T=&#39;False&#39; /&gt;">
		<!-- Styles for edit mode only-->
		<SharePointWebControls:CssRegistration name="<% $SPUrl:~sitecollection/Style Library/~language/Themable/Core Styles/editmode15.css %>"
			After="<% $SPUrl:~sitecollection/Style Library/~language/Themable/Core Styles/pagelayouts15.css %>" runat="server"/>
	</PublishingWebControls:EditModePanel>
    <script type="text/javascript" src="https://c64.assets-yammer.com/assets/platform_embed.js"></script>
<script type= "text/javascript" data-app-id="8Z6wlIYczbZAxWELw2Zyyg" src="https://c64.assets-yammer.com/assets/platform_js_sdk.js" ></script>
<script type="text/javascript" src="/style library/js/yammer.js"></script>
<script type="text/javascript" src="/style library/js/ranking.js"></script>
</asp:Content>
<asp:Content contentplaceholderid="PlaceHolderPageTitle" runat="server">
	<SharePointWebControls:FieldValue FieldName="Title" runat="server" __designer:Preview="" __designer:Values="&lt;P N=&#39;ID&#39; ID=&#39;1&#39; T=&#39;ctl02&#39; /&gt;&lt;P N=&#39;ItemFieldValue&#39; ID=&#39;2&#39; Serial=&#39;AAEAAAD/////AQAAAAAAAAAGAQAAAA1Ib21lIEludHJhbmV0Cw&#39; /&gt;&lt;P N=&#39;ListItemFieldValue&#39; R=&#39;2&#39; /&gt;&lt;P N=&#39;Visible&#39; T=&#39;True&#39; /&gt;&lt;P N=&#39;FieldName&#39; T=&#39;Title&#39; /&gt;&lt;P N=&#39;ControlMode&#39; E=&#39;1&#39; /&gt;&lt;P N=&#39;Page&#39; ID=&#39;3&#39; /&gt;&lt;P N=&#39;TemplateControl&#39; R=&#39;3&#39; /&gt;&lt;P N=&#39;AppRelativeTemplateSourceDirectory&#39; R=&#39;-1&#39; /&gt;"/>
</asp:Content>
<asp:Content contentplaceholderid="PlaceHolderPageTitleInTitleArea" runat="server">
	<SharePointWebControls:FieldValue FieldName="Title" runat="server" __designer:Preview="" __designer:Values="&lt;P N=&#39;ID&#39; ID=&#39;1&#39; T=&#39;ctl03&#39; /&gt;&lt;P N=&#39;ItemFieldValue&#39; ID=&#39;2&#39; Serial=&#39;AAEAAAD/////AQAAAAAAAAAGAQAAAA1Ib21lIEludHJhbmV0Cw&#39; /&gt;&lt;P N=&#39;ListItemFieldValue&#39; R=&#39;2&#39; /&gt;&lt;P N=&#39;Visible&#39; T=&#39;True&#39; /&gt;&lt;P N=&#39;FieldName&#39; T=&#39;Title&#39; /&gt;&lt;P N=&#39;ControlMode&#39; E=&#39;1&#39; /&gt;&lt;P N=&#39;Page&#39; ID=&#39;3&#39; /&gt;&lt;P N=&#39;TemplateControl&#39; R=&#39;3&#39; /&gt;&lt;P N=&#39;AppRelativeTemplateSourceDirectory&#39; R=&#39;-1&#39; /&gt;"/>
</asp:Content>
<asp:Content contentplaceholderid="PlaceHolderTitleBreadcrumb" runat="server"> 
    <SharePointWebControls:ListSiteMapPath runat="server" SiteMapProviders="CurrentNavigationSwitchableProvider" RenderCurrentNodeAsLink="false" PathSeparator="" CssClass="s4-breadcrumb" NodeStyle-CssClass="s4-breadcrumbNode" CurrentNodeStyle-CssClass="s4-breadcrumbCurrentNode" RootNodeStyle-CssClass="s4-breadcrumbRootNode" NodeImageOffsetX=0 NodeImageOffsetY=289 NodeImageWidth=16 NodeImageHeight=16 NodeImageUrl="/_layouts/15/images/fgimg.png?rev=44" HideInteriorRootNodes="true" SkipLinkText="" __designer:Preview="&lt;ul class=&quot;s4-breadcrumb&quot;&gt;

&lt;/ul&gt;" __designer:Values="&lt;P N=&#39;SiteMapProviders&#39; T=&#39;CurrentNavigationSwitchableProvider&#39; /&gt;&lt;P N=&#39;CssClass&#39; T=&#39;s4-breadcrumb&#39; /&gt;&lt;P N=&#39;PathSeparator&#39; R=&#39;-1&#39; /&gt;&lt;P N=&#39;HideInteriorRootNodes&#39; T=&#39;True&#39; /&gt;&lt;P N=&#39;NodeImageOffsetY&#39; T=&#39;289&#39; /&gt;&lt;P N=&#39;NodeImageWidth&#39; T=&#39;16&#39; /&gt;&lt;P N=&#39;NodeImageHeight&#39; T=&#39;16&#39; /&gt;&lt;P N=&#39;NodeImageUrl&#39; T=&#39;/_layouts/15/images/fgimg.png?rev=44&#39; /&gt;&lt;P N=&#39;SkipLinkText&#39; R=&#39;-1&#39; /&gt;&lt;P N=&#39;ID&#39; ID=&#39;1&#39; T=&#39;ctl04&#39; /&gt;&lt;P N=&#39;Page&#39; ID=&#39;2&#39; /&gt;&lt;P N=&#39;TemplateControl&#39; R=&#39;2&#39; /&gt;&lt;P N=&#39;AppRelativeTemplateSourceDirectory&#39; R=&#39;-1&#39; /&gt;" __designer:Templates="&lt;Group Name=&quot;NodeTemplate&quot;&gt;&lt;Template Name=&quot;NodeTemplate&quot; Content=&quot;&quot; /&gt;&lt;/Group&gt;&lt;Group Name=&quot;CurrentNodeTemplate&quot;&gt;&lt;Template Name=&quot;CurrentNodeTemplate&quot; Content=&quot;&quot; /&gt;&lt;/Group&gt;&lt;Group Name=&quot;RootNodeTemplate&quot;&gt;&lt;Template Name=&quot;RootNodeTemplate&quot; Content=&quot;&quot; /&gt;&lt;/Group&gt;&lt;Group Name=&quot;PathSeparatorTemplate&quot;&gt;&lt;Template Name=&quot;PathSeparatorTemplate&quot; Content=&quot;&quot; /&gt;&lt;/Group&gt;"/> </asp:Content>
<asp:Content contentplaceholderid="PlaceHolderPageDescription" runat="server">
	<SharePointWebControls:ProjectProperty Property="Description" runat="server" __designer:Preview="" __designer:Values="&lt;P N=&#39;Property&#39; T=&#39;Description&#39; /&gt;&lt;P N=&#39;ID&#39; ID=&#39;1&#39; T=&#39;ctl06&#39; /&gt;&lt;P N=&#39;Page&#39; ID=&#39;2&#39; /&gt;&lt;P N=&#39;TemplateControl&#39; R=&#39;2&#39; /&gt;&lt;P N=&#39;AppRelativeTemplateSourceDirectory&#39; R=&#39;-1&#39; /&gt;"/>
</asp:Content>
<asp:Content contentplaceholderid="PlaceHolderBodyRightMargin" runat="server">
	<div height=100% class="ms-pagemargin"><IMG SRC="/_layouts/images/blank.gif" width=10 height=1 alt=""></div>
</asp:Content>
<asp:Content contentplaceholderid="PlaceHolderMain" runat="server">
	<PublishingWebControls:EditModePanel runat="server" CssClass="edit-mode-panel title-edit" __designer:Preview="&lt;Regions&gt;&lt;Region Name=&quot;0&quot; Editable=&quot;True&quot; Content=&quot;&amp;#xD;&amp;#xA;		&amp;lt;SharePointWebControls:TextField runat=&amp;quot;server&amp;quot; FieldName=&amp;quot;Title&amp;quot; __designer:Preview=&amp;quot;&amp;quot; __designer:Values=&amp;quot;&amp;amp;lt;P N=&amp;amp;#39;FieldName&amp;amp;#39; T=&amp;amp;#39;Title&amp;amp;#39; /&amp;amp;gt;&amp;amp;lt;P N=&amp;amp;#39;ItemFieldValue&amp;amp;#39; ID=&amp;amp;#39;1&amp;amp;#39; Serial=&amp;amp;#39;AAEAAAD/////AQAAAAAAAAAGAQAAAA1Ib21lIEludHJhbmV0Cw&amp;amp;#39; /&amp;amp;gt;&amp;amp;lt;P N=&amp;amp;#39;ListItemFieldValue&amp;amp;#39; R=&amp;amp;#39;1&amp;amp;#39; /&amp;amp;gt;&amp;amp;lt;P N=&amp;amp;#39;Visible&amp;amp;#39; T=&amp;amp;#39;True&amp;amp;#39; /&amp;amp;gt;&amp;amp;lt;P N=&amp;amp;#39;ControlMode&amp;amp;#39; E=&amp;amp;#39;1&amp;amp;#39; /&amp;amp;gt;&amp;amp;lt;P N=&amp;amp;#39;ID&amp;amp;#39; T=&amp;amp;#39;ctl00&amp;amp;#39; /&amp;amp;gt;&amp;amp;lt;P N=&amp;amp;#39;Page&amp;amp;#39; ID=&amp;amp;#39;2&amp;amp;#39; /&amp;amp;gt;&amp;amp;lt;P N=&amp;amp;#39;TemplateControl&amp;amp;#39; R=&amp;amp;#39;2&amp;amp;#39; /&amp;amp;gt;&amp;amp;lt;P N=&amp;amp;#39;AppRelativeTemplateSourceDirectory&amp;amp;#39; R=&amp;amp;#39;-1&amp;amp;#39; /&amp;amp;gt;&amp;quot;/&amp;gt;&amp;#xD;&amp;#xA;	&quot; /&gt;&lt;/Regions&gt;
		&lt;SharePointWebControls:TextField runat=&quot;server&quot; FieldName=&quot;Title&quot;/&gt;
	" __designer:Values="&lt;P N=&#39;CssClass&#39; T=&#39;edit-mode-panel title-edit&#39; /&gt;&lt;P N=&#39;ID&#39; ID=&#39;1&#39; T=&#39;ctl07&#39; /&gt;&lt;P N=&#39;Page&#39; ID=&#39;2&#39; /&gt;&lt;P N=&#39;TemplateControl&#39; R=&#39;2&#39; /&gt;&lt;P N=&#39;AppRelativeTemplateSourceDirectory&#39; R=&#39;-1&#39; /&gt;&lt;P N=&#39;Visible&#39; T=&#39;False&#39; /&gt;">
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
                                <li class="prev"><a href="#">❮</a></li>
                                <li class="next"><a href="#">❯</a></li>
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
        <div class="content">
            <div class="row">
            <div class="col-4">
                <div class="panel">
                    <div class="panel-body">
                        <p class="panel-title"><span class="font-weight-semi-bold">
						Charlas</span> @innovation depot</p>
                        <div class="row thumbnail-container" id="currentUserRanking">
                            <div class="col">
                                <img id="userPhoto" />
                            </div>
                            <div class="col">
                                <div class="row">
                                    <div class="col">
                                        <span id="userName"></span>
                                        <br />
                                        <span class="badge badge-pill badge-info" id="userScore"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="col">
                                <img id="rankingPhoto" />
                            </div>
                        </div>
                        <div id="ranking"></div>
                    </div>
                </div>

                <div id="yammer" style="min-height: 125px; max-height: 300px; overflow: auto; margin-bottom: 15px;">
	            </div>
	            <div class="panel">
					<div class="panel-body">
						<p class="panel-title"><span class="font-weight-semi-bold">
						Tareas</span> pendientes</p>
						<ul id="my-tasks"></ul>
					</div>
                </div>
            </div>
            <div class="col">
            	<div class="row">
                    <div class="col">
                        <div class="panel icon-left">
                          <div class="panel-body">
                            <p class="panel-title"><span class="font-weight-semi-bold">
							Mis</span> proyectos</p>
                            <ul id="my-projects"></ul>
                            <div class="toolbar">
                                <a href="/es-es/Paginas/mis-proyectos.aspx"><span class="icon-mas"></span>
								ver todos</a>
                            </div>
                          </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="panel icon-left">
                          <div class="panel-body">
                            <p class="panel-title"><span class="font-weight-semi-bold">
							Mis</span> gremios</p>
                            <ul id="my-guilds"></ul>
                              <div class="toolbar">
                                <a href="/es-es/Paginas/mis-gremios.aspx"><span class="icon-mas"></span>
								ver todos</a>
                            </div>
                          </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="panel icon-left">
                          <div class="panel-body">
                            <p class="panel-title"><span class="font-weight-semi-bold">
							Mis</span> equipos</p>
                            <ul id="my-teams"></ul>
                            <div class="toolbar">
                                <a href="/es-es/Paginas/mis-equipos.aspx"><span class="icon-mas"></span>
								ver todos</a>
                            </div>
                          </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <div class="panel">
                          <div class="panel-body">
                            <p class="panel-title"><span class="font-weight-semi-bold">
							Calendario</span> de eventos</p>
                            <ul id="vass-calendar" style="height: 450px; overflow-y: auto;"></ul>
                            <div class="toolbar">
                                <a href="/es-es/marketing/Paginas/Eventos.aspx"><span class="icon-mas span-corrector"></span>
								ver todos</a>
                            </div>
                          </div>
                        </div>
                    </div>
	                <div class="col">
                        <div class="panel">
                          <div class="panel-body">
                            <p class="panel-title"><span class="font-weight-semi-bold">
							Twitter</span> @vasstalent</p>
                            <div id="twitter-timeline" style="max-height: 500px; overflow-y: auto;">
                            	<a class="twitter-timeline" data-lang="es" data-theme="light" data-chrome="noheader nofooter noborders" href="https://twitter.com/VASSTALENT?ref_src=twsrc%5Etfw">
                            		Tweets by VASSTALENT
                            	</a>
				            </div>
                          </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <WebPartPages:WebPartZone runat="server" Title="Zona 6" ID="WebPartZone7" __designer:Preview="&lt;Regions&gt;&lt;Region Name=&quot;0&quot; Editable=&quot;True&quot; Content=&quot;&quot; NamingContainer=&quot;True&quot; /&gt;&lt;/Regions&gt;&lt;table cellspacing=&quot;0&quot; cellpadding=&quot;0&quot; border=&quot;0&quot; id=&quot;WebPartZone7&quot;&gt;
	&lt;tr&gt;
		&lt;td style=&quot;white-space:nowrap;&quot;&gt;&lt;table cellspacing=&quot;0&quot; cellpadding=&quot;2&quot; border=&quot;0&quot; style=&quot;width:100%;&quot;&gt;
			&lt;tr&gt;
				&lt;td style=&quot;white-space:nowrap;&quot;&gt;Zona 6&lt;/td&gt;
			&lt;/tr&gt;
		&lt;/table&gt;&lt;/td&gt;
	&lt;/tr&gt;&lt;tr&gt;
		&lt;td style=&quot;height:100%;&quot;&gt;&lt;table cellspacing=&quot;0&quot; cellpadding=&quot;2&quot; border=&quot;0&quot; style=&quot;border-color:Gray;border-width:1px;border-style:Solid;width:100%;height:100%;&quot;&gt;
			&lt;tr valign=&quot;top&quot;&gt;
				&lt;td _designerRegion=&quot;0&quot;&gt;&lt;table cellspacing=&quot;0&quot; cellpadding=&quot;2&quot; border=&quot;0&quot; style=&quot;width:100%;&quot;&gt;
					&lt;tr&gt;
						&lt;td style=&quot;height:100%;&quot;&gt;&lt;/td&gt;
					&lt;/tr&gt;
				&lt;/table&gt;&lt;/td&gt;
			&lt;/tr&gt;
		&lt;/table&gt;&lt;/td&gt;
	&lt;/tr&gt;
&lt;/table&gt;" __designer:Values="&lt;P N=&#39;Title&#39; ID=&#39;1&#39; T=&#39;Zona 6&#39; /&gt;&lt;P N=&#39;HeaderText&#39; R=&#39;1&#39; /&gt;&lt;P N=&#39;DisplayTitle&#39; R=&#39;1&#39; /&gt;&lt;P N=&#39;ID&#39; ID=&#39;2&#39; T=&#39;WebPartZone7&#39; /&gt;&lt;P N=&#39;Page&#39; ID=&#39;3&#39; /&gt;&lt;P N=&#39;TemplateControl&#39; R=&#39;3&#39; /&gt;&lt;P N=&#39;AppRelativeTemplateSourceDirectory&#39; R=&#39;-1&#39; /&gt;" __designer:Templates="&lt;Group Name=&quot;ZoneTemplate&quot;&gt;&lt;Template Name=&quot;ZoneTemplate&quot; Content=&quot;&quot; /&gt;&lt;/Group&gt;"><ZoneTemplate></ZoneTemplate></WebPartPages:WebPartZone>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <WebPartPages:WebPartZone runat="server" Title="Zona 8" ID="WebPartZone1" __designer:Preview="&lt;Regions&gt;&lt;Region Name=&quot;0&quot; Editable=&quot;True&quot; Content=&quot;&quot; NamingContainer=&quot;True&quot; /&gt;&lt;/Regions&gt;&lt;table cellspacing=&quot;0&quot; cellpadding=&quot;0&quot; border=&quot;0&quot; id=&quot;WebPartZone1&quot;&gt;
	&lt;tr&gt;
		&lt;td style=&quot;white-space:nowrap;&quot;&gt;&lt;table cellspacing=&quot;0&quot; cellpadding=&quot;2&quot; border=&quot;0&quot; style=&quot;width:100%;&quot;&gt;
			&lt;tr&gt;
				&lt;td style=&quot;white-space:nowrap;&quot;&gt;Zona 8&lt;/td&gt;
			&lt;/tr&gt;
		&lt;/table&gt;&lt;/td&gt;
	&lt;/tr&gt;&lt;tr&gt;
		&lt;td style=&quot;height:100%;&quot;&gt;&lt;table cellspacing=&quot;0&quot; cellpadding=&quot;2&quot; border=&quot;0&quot; style=&quot;border-color:Gray;border-width:1px;border-style:Solid;width:100%;height:100%;&quot;&gt;
			&lt;tr valign=&quot;top&quot;&gt;
				&lt;td _designerRegion=&quot;0&quot;&gt;&lt;table cellspacing=&quot;0&quot; cellpadding=&quot;2&quot; border=&quot;0&quot; style=&quot;width:100%;&quot;&gt;
					&lt;tr&gt;
						&lt;td style=&quot;height:100%;&quot;&gt;&lt;/td&gt;
					&lt;/tr&gt;
				&lt;/table&gt;&lt;/td&gt;
			&lt;/tr&gt;
		&lt;/table&gt;&lt;/td&gt;
	&lt;/tr&gt;
&lt;/table&gt;" __designer:Values="&lt;P N=&#39;Title&#39; ID=&#39;1&#39; T=&#39;Zona 8&#39; /&gt;&lt;P N=&#39;HeaderText&#39; R=&#39;1&#39; /&gt;&lt;P N=&#39;DisplayTitle&#39; R=&#39;1&#39; /&gt;&lt;P N=&#39;ID&#39; ID=&#39;2&#39; T=&#39;WebPartZone1&#39; /&gt;&lt;P N=&#39;Page&#39; ID=&#39;3&#39; /&gt;&lt;P N=&#39;TemplateControl&#39; R=&#39;3&#39; /&gt;&lt;P N=&#39;AppRelativeTemplateSourceDirectory&#39; R=&#39;-1&#39; /&gt;" __designer:Templates="&lt;Group Name=&quot;ZoneTemplate&quot;&gt;&lt;Template Name=&quot;ZoneTemplate&quot; Content=&quot;&quot; /&gt;&lt;/Group&gt;"><ZoneTemplate></ZoneTemplate></WebPartPages:WebPartZone>
                    </div>
                    <div class="col">
                        <WebPartPages:WebPartZone runat="server" Title="Zona 9" ID="WebPartZone8" __designer:Preview="&lt;Regions&gt;&lt;Region Name=&quot;0&quot; Editable=&quot;True&quot; Content=&quot;&quot; NamingContainer=&quot;True&quot; /&gt;&lt;/Regions&gt;&lt;table cellspacing=&quot;0&quot; cellpadding=&quot;0&quot; border=&quot;0&quot; id=&quot;WebPartZone8&quot;&gt;
	&lt;tr&gt;
		&lt;td style=&quot;white-space:nowrap;&quot;&gt;&lt;table cellspacing=&quot;0&quot; cellpadding=&quot;2&quot; border=&quot;0&quot; style=&quot;width:100%;&quot;&gt;
			&lt;tr&gt;
				&lt;td style=&quot;white-space:nowrap;&quot;&gt;Zona 9&lt;/td&gt;
			&lt;/tr&gt;
		&lt;/table&gt;&lt;/td&gt;
	&lt;/tr&gt;&lt;tr&gt;
		&lt;td style=&quot;height:100%;&quot;&gt;&lt;table cellspacing=&quot;0&quot; cellpadding=&quot;2&quot; border=&quot;0&quot; style=&quot;border-color:Gray;border-width:1px;border-style:Solid;width:100%;height:100%;&quot;&gt;
			&lt;tr valign=&quot;top&quot;&gt;
				&lt;td _designerRegion=&quot;0&quot;&gt;&lt;table cellspacing=&quot;0&quot; cellpadding=&quot;2&quot; border=&quot;0&quot; style=&quot;width:100%;&quot;&gt;
					&lt;tr&gt;
						&lt;td style=&quot;height:100%;&quot;&gt;&lt;/td&gt;
					&lt;/tr&gt;
				&lt;/table&gt;&lt;/td&gt;
			&lt;/tr&gt;
		&lt;/table&gt;&lt;/td&gt;
	&lt;/tr&gt;
&lt;/table&gt;" __designer:Values="&lt;P N=&#39;Title&#39; ID=&#39;1&#39; T=&#39;Zona 9&#39; /&gt;&lt;P N=&#39;HeaderText&#39; R=&#39;1&#39; /&gt;&lt;P N=&#39;DisplayTitle&#39; R=&#39;1&#39; /&gt;&lt;P N=&#39;ID&#39; ID=&#39;2&#39; T=&#39;WebPartZone8&#39; /&gt;&lt;P N=&#39;Page&#39; ID=&#39;3&#39; /&gt;&lt;P N=&#39;TemplateControl&#39; R=&#39;3&#39; /&gt;&lt;P N=&#39;AppRelativeTemplateSourceDirectory&#39; R=&#39;-1&#39; /&gt;" __designer:Templates="&lt;Group Name=&quot;ZoneTemplate&quot;&gt;&lt;Template Name=&quot;ZoneTemplate&quot; Content=&quot;&quot; /&gt;&lt;/Group&gt;"><ZoneTemplate></ZoneTemplate></WebPartPages:WebPartZone>
                    </div>
                </div>
            </div>
        </div>
        </div>
    </div>
    <SharePointWebControls:ScriptBlock runat="server" __designer:Preview="&lt;script type=&quot;text/javascript&quot;&gt;// &lt;![CDATA[ 


	if(typeof(MSOLayout_MakeInvisibleIfEmpty) == &amp;quot;function&amp;quot;) 
	
	
	{MSOLayout_MakeInvisibleIfEmpty();}// ]]&gt;
&lt;/script&gt;" __designer:Values="&lt;P N=&#39;ID&#39; ID=&#39;1&#39; T=&#39;ctl08&#39; /&gt;&lt;P N=&#39;Page&#39; ID=&#39;2&#39; /&gt;&lt;P N=&#39;TemplateControl&#39; R=&#39;2&#39; /&gt;&lt;P N=&#39;AppRelativeTemplateSourceDirectory&#39; R=&#39;-1&#39; /&gt;">
	if(typeof(MSOLayout_MakeInvisibleIfEmpty) == &quot;function&quot;) 
	
	
	{MSOLayout_MakeInvisibleIfEmpty();}</SharePointWebControls:ScriptBlock>
	</span>
</asp:Content>
