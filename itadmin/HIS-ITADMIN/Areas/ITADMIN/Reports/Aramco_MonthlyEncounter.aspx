<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Aramco_MonthlyEncounter.aspx.cs" Inherits="HIS_ITADMIN.Areas.ITADMIN.Reports.Aramco_MonthlyEncounter" %>
<%@ Register Assembly="Microsoft.ReportViewer.WebForms, Version=11.0.0.0, Culture=neutral, PublicKeyToken=89845dcd8080cc91"
    Namespace="Microsoft.Reporting.WebForms" TagPrefix="rsweb" %>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
        <style>
        body, html {
            background-color: #2C3E50;
        }
        #rpt_fixedTable {
            margin: auto !important;background-color:white;
        }
    </style>
</head>
<body>
    <form id="form1" runat="server">
     <asp:ScriptManager ID="ScriptManager1" runat="server">         
     </asp:ScriptManager>    
            <rsweb:ReportViewer ID="rpt" AsyncRendering="false" runat="server"
                SizeToReportContent="true" Width="100%"
                Style="overflow: visible !important;" Height="100%"
                ShowFindControls="False" ShowRefreshButton="True" ShowBackButton="False">
            </rsweb:ReportViewer>
    </form>
</body>
</html>
