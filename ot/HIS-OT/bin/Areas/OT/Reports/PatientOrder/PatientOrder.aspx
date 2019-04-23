<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="PatientOrder.aspx.cs" Inherits="SGH.Areas.OT.Reports.PatientOrder" %>

<%@ Register Assembly="Microsoft.ReportViewer.WebForms, Version=11.0.0.0, Culture=neutral, PublicKeyToken=89845dcd8080cc91"
    Namespace="Microsoft.Reporting.WebForms" TagPrefix="rsweb" %>

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title></title>
</head>
<body>
    
    <form id="form1" runat="server">
        <asp:ScriptManager ID="ScriptManager1" runat="server">
        </asp:ScriptManager>    

<%--        <rsweb:ReportViewer ID="ReportViewer2" runat="server" Width="427px">
        </rsweb:ReportViewer>--%>
        <rsweb:ReportViewer ID="ReportViewer2" AsyncRendering="false" runat="server" SizeToReportContent="true" width="100%" style="background-color:white; overflow: visible !important;" height="100%" ShowFindControls="False" ShowRefreshButton="True" ShowBackButton="False">
        </rsweb:ReportViewer>
    </form>

</body>
</html>
