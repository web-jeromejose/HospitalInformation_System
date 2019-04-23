using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Security;
using System.Security.Permissions;
using DataLayer;
using System.Data;
using System.Data.SqlClient;
using System.Reflection;
using HIS_OT.Models;

namespace SGH.Areas.OT.Reports
{
    public partial class ResultsViewLabChemistry: System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

            #region Init variables

            string UserId = "";
            int OrderId = -1;
            int ServiceId = -1; 

            #endregion
            #region Get and assign to a variable

            UserId = Request.QueryString["UserId"].ToString();
            int.TryParse(Request.QueryString["OrderId"].ToString(), out OrderId);
            int.TryParse(Request.QueryString["ServiceId"].ToString(), out ServiceId); 

            #endregion

            #region Header

            DBHelper DB = new DBHelper();
            DB.param = new SqlParameter[]{
                new SqlParameter("@orderid", OrderId),
                new SqlParameter("@serviceid", ServiceId)
            };
            DataTable dtHeader = DB.ExecuteSPAndReturnDataTable("OT.ReportChemistryHeader"); 

            #endregion         
            #region Details

            DB = new DBHelper();
            DB.param = new SqlParameter[]{
                new SqlParameter("@orderid", OrderId),
                new SqlParameter("@serviceid", ServiceId)
            };
            DataTable dtDetails = DB.ExecuteSPAndReturnDataTable("OT.ReportChemistryDetails");

            #endregion
            #region Footer

            DB = new DBHelper();
            DB.param = new SqlParameter[]{
                new SqlParameter("@orderid", OrderId),
                new SqlParameter("@serviceid", ServiceId)
            };
            DataTable dtFooter = DB.ExecuteSPAndReturnDataTable("OT.ReportChemistryFooter");

            #endregion

            #region Report setup.

            ReportViewer2.Reset();
            ReportViewer2.LocalReport.ReportPath = "Areas/OT/Reports/ResultsView/ResultsViewLabChemistry.rdl";

            PermissionSet permissions = new PermissionSet(PermissionState.Unrestricted);
            ReportViewer2.LocalReport.SetBasePermissionsForSandboxAppDomain(permissions);

            ReportViewer2.LocalReport.SetParameters(new ReportParameter("aaaCompanyName", Common.ReportHeader));
            ReportViewer2.LocalReport.SetParameters(new ReportParameter("aaaReportTitle", "LABORATORY REPORT"));
            ReportViewer2.LocalReport.SetParameters(new ReportParameter("aaaDescription01", ""));
            ReportViewer2.LocalReport.SetParameters(new ReportParameter("aaaDescription02", ""));
            ReportViewer2.LocalReport.SetParameters(new ReportParameter("aaaDescription03", ""));
            ReportViewer2.LocalReport.SetParameters(new ReportParameter("aaaUser", UserId));

            ReportViewer2.LocalReport.DataSources.Clear();
            ReportViewer2.LocalReport.DataSources.Add(new ReportDataSource("dsHeader", dtHeader));
            ReportViewer2.LocalReport.DataSources.Add(new ReportDataSource("dsDetails", dtDetails));
            ReportViewer2.LocalReport.DataSources.Add(new ReportDataSource("dsFooter", dtFooter));

            ReportViewer2.DataBind();
            ReportViewer2.LocalReport.Refresh(); 

            #endregion

        }

    }
}