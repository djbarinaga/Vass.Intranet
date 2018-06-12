<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="rss/channel">
        <xsl:call-template name="item" />
    </xsl:template>
    <xsl:template name="item">
	<table id="xltTable">
        <xsl:for-each select="item">
            	
                <tr id="header"><td><a href="{link}" target="_blank" style="font-size: 20px;"><xsl:value-of select="title" disable-output-escaping="yes" /></a></td></tr>
                <tr id="description"><td id="text"><xsl:value-of select="description" disable-output-escaping="yes" /></td></tr>
            	<tr><td><a href="{link}" style="font-size: 20px;">Ver más Información</a></td></tr>
            	<tr><td><p></p></td></tr>
            	<tr><td><p></p></td></tr>
            	
        </xsl:for-each>
        <tr><td><p></p></td></tr>
        <tr><td><p></p></td></tr>
        <tr><td><p></p></td></tr>
        <tr><td><p></p></td></tr>
		<tr><td><p></p></td></tr>
        <tr><td><p></p></td></tr>

        <tr><td id="entradas"><a href="https://www.vass.es/blog/" style="font-size: 20px;" target="_blank">Ver todas las entradas</a></td></tr>
     </table>
     </xsl:template>
</xsl:stylesheet>