﻿<%@ Page language="C#"   Inherits="Microsoft.SharePoint.Publishing.PublishingLayoutPage,Microsoft.SharePoint.Publishing,Version=16.0.0.0,Culture=neutral,PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="SharePointWebControls" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> <%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> <%@ Register Tagprefix="PublishingWebControls" Namespace="Microsoft.SharePoint.Publishing.WebControls" Assembly="Microsoft.SharePoint.Publishing, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> <%@ Register Tagprefix="PublishingNavigation" Namespace="Microsoft.SharePoint.Publishing.Navigation" Assembly="Microsoft.SharePoint.Publishing, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<asp:Content ContentPlaceholderID="PlaceHolderAdditionalPageHead" runat="server">
	<SharePointWebControls:CssRegistration name="<% $SPUrl:~sitecollection/Style Library/~language/Themable/Core Styles/pagelayouts15.css %>" runat="server"/>
	<PublishingWebControls:EditModePanel runat="server">
		<!-- Styles for edit mode only-->
		<SharePointWebControls:CssRegistration name="<% $SPUrl:~sitecollection/Style Library/~language/Themable/Core Styles/editmode15.css %>"
			After="<% $SPUrl:~sitecollection/Style Library/~language/Themable/Core Styles/pagelayouts15.css %>" runat="server"/>
	</PublishingWebControls:EditModePanel>
    <script type="text/javascript" src="/style library/js/currentnavigation.js"></script>
	<SharePointWebControls:FieldValue id="PageStylesField" FieldName="HeaderStyleDefinitions" runat="server"/>
</asp:Content>
<asp:Content ContentPlaceholderID="PlaceHolderPageTitle" runat="server">
	<SharePointWebControls:FieldValue id="PageTitle" FieldName="Title" runat="server"/>
</asp:Content>
<asp:Content ContentPlaceholderID="PlaceHolderPageTitleInTitleArea" runat="server">
	<SharePointWebControls:FieldValue FieldName="Title" runat="server"/>
</asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderTitleBreadcrumb" runat="server"> <SharePointWebControls:ListSiteMapPath runat="server" SiteMapProviders="CurrentNavigationSwitchableProvider" RenderCurrentNodeAsLink="false" PathSeparator="" CssClass="s4-breadcrumb" NodeStyle-CssClass="s4-breadcrumbNode" CurrentNodeStyle-CssClass="s4-breadcrumbCurrentNode" RootNodeStyle-CssClass="s4-breadcrumbRootNode" NodeImageOffsetX=0 NodeImageOffsetY=289 NodeImageWidth=16 NodeImageHeight=16 NodeImageUrl="/_layouts/15/images/fgimg.png?rev=44" HideInteriorRootNodes="true" SkipLinkText="" /> </asp:Content>
<asp:Content ContentPlaceholderID="PlaceHolderMain" runat="server">
	<div id="article" class="container-fluid">
		<PublishingWebControls:EditModePanel runat="server" CssClass="edit-mode-panel title-edit">
			<SharePointWebControls:TextField runat="server" FieldName="Title"/>
		</PublishingWebControls:EditModePanel>
        <div>
            <div class="row">
                <a id="menu-button"><span class="icon-menu_cierra"></span></a>
                <div class="float-left" id="current-menu"></div>
                <div class="float-left" style="display:none" id="current-submenu"></div>
                <div class="col">
                <div class="breadcrumb">
                    <asp:SiteMapPath runat="server" ParentLevelsDisplayed="1" SiteMapProvider="CurrentNavigation" RenderCurrentNodeAsLink="false" SkipLinkText="" RootNodeStyle-CssClass="home" NodeStyle-CssClass="bc-node" CurrentNodeStyle-CssClass="current"/>
                </div>
                    <h2 id="page-title">
                        <SharePointWebControls:FieldValue runat="server" FieldName="Title"/>
                    </h2>
                    <div id="summary-zone">
                        <div class="row">
                            <div class="col" id="summary">
                                <PublishingWebControls:RichHtmlField FieldName="Summary" HasInitialFocus="True" MinimumEditHeight="400px" runat="server"/>
                            </div>
                        </div>
                    </div>
                    <div id="sections">
                        <WebPartPages:WebPartZone runat="server" Title="Módulos" ID="modules" />
                    </div>
                </div>
            </div>
        </div>
        
		<PublishingWebControls:EditModePanel runat="server">
			<SharePointWebControls:BooleanField FieldName="HomeHighlight" runat="server"/>
			<SharePointWebControls:BooleanField FieldName="SubhomeHighlight" runat="server"/>
		</PublishingWebControls:EditModePanel>
	</div>
</asp:Content>
