<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="DonorRegistrationList.aspx.cs" Inherits="HIS_BloodBank.Areas.BloodBank.Reports.DonorRegistrationList" %>

<%@ Register Assembly="Microsoft.ReportViewer.WebForms, Version=11.0.0.0, Culture=neutral, PublicKeyToken=89845dcd8080cc91"
    Namespace="Microsoft.Reporting.WebForms" TagPrefix="rsweb" %>

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <script src="../../../../Content/jquery/js/jquery.min.js"></script>
      <script type="text/javascript">
          //------------------------------------------------------------------
          // Cross-browser Multi-page Printing with ASP.NET ReportViewer
          // by Chtiwi Malek.
          // http://www.codicode.com
          //------------------------------------------------------------------
          // Linking the print function to the print button
          $(document).ready(function () {
              $('#printreport').click(function () {
                  printReport('rv1');
              });
          });



          // Print function (require the reportviewer client ID)
          function printReport(report_ID) {
              var rv1 = $('#' + report_ID);
              var iDoc = rv1.parents('html');

              // Reading the report styles
              var styles = iDoc.find("head style[id$='ReportControl_styles']").html();
              if ((styles == undefined) || (styles == '')) {
                  iDoc.find('head script').each(function () {
                      var cnt = $(this).html();
                      var p1 = cnt.indexOf('ReportStyles":"');
                      if (p1 > 0) {
                          p1 += 15;
                          var p2 = cnt.indexOf('"', p1);
                          styles = cnt.substr(p1, p2 - p1);
                      }
                  });
              }
              if (styles == '') { alert("Cannot generate styles, Displaying without styles.."); }
              styles = '<style type="text/css">' + styles + "</style>";

              // Reading the report html
              var table = rv1.find("div[id$='_oReportDiv']");
              if (table == undefined) {
                  alert("Report source not found.");
                  return;
              }

              // Generating a copy of the report in a new window
              var docType = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/loose.dtd">';
              var docCnt = styles + table.parent().html();              
              var docHead = '<head></head>';
              var winAttr = "location=yes,statusbar=no,directories=no,menubar=no,titlebar=no,toolbar=no,dependent=no,width=720,height=600,resizable=yes,screenX=200,screenY=200,personalbar=no,scrollbars=yes";;
              var newWin = window.open("", "_blank", winAttr);
              writeDoc = newWin.document;
              writeDoc.open();
              writeDoc.write(docType + '<html>' + docHead + '<body onload="window.print();">' + docCnt + '</body></html>');
              writeDoc.close();

              // The print event will fire as soon as the window loads
              newWin.focus();
              // uncomment to autoclose the preview window when printing is confirmed or canceled.
              // newWin.close();
          };

        </script>
</head>
<body>
    
    <form id="form1" runat="server">
        <div>
            <div align="center">
                <asp:ScriptManager ID="ScriptManager1" runat="server">
                </asp:ScriptManager>

                <rsweb:ReportViewer ID="ReportViewer2" AsyncRendering="false" runat="server" SizeToReportContent="true" width="100%" style="background-color:#d0cccc; overflow: visible !important;" height="100%" ShowFindControls="False" ShowRefreshButton="True" ShowBackButton="False">
                </rsweb:ReportViewer>
            </div>
        </div>
    </form>

</body>
</html>

 