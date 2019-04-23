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
    public partial class ResultsViewLabMicrobiology : System.Web.UI.Page
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
            DataTable dtHeader = DB.ExecuteSPAndReturnDataTable("OT.ReportResultsViewMicrobiologyHeader");

            #endregion
            #region Sample

            DB = new DBHelper();
            DB.param = new SqlParameter[]{
                new SqlParameter("@orderid", OrderId),
                new SqlParameter("@serviceid", ServiceId)
            };
            DataTable dtSample = DB.ExecuteSPAndReturnDataTable("OT.ReportResultsViewMicrobiologySample");

            #endregion
            #region GramStainedSmear

            DB = new DBHelper();
            DB.param = new SqlParameter[]{
                new SqlParameter("@orderid", OrderId),
                new SqlParameter("@serviceid", ServiceId)
            };
            DataTable dtGramStainedSmear = DB.ExecuteSPAndReturnDataTable("OT.ReportResultsViewMicrobiologyGramStainedSmear");

            #endregion
            #region ZNStainedSmear

            DB = new DBHelper();
            DB.param = new SqlParameter[]{
                new SqlParameter("@orderid", OrderId),
                new SqlParameter("@serviceid", ServiceId)
            };
            DataTable dtZNStainedSmear = DB.ExecuteSPAndReturnDataTable("OT.ReportResultsViewMicrobiologyZNStainedSmear");

            #endregion
            #region WetSmear

            DB = new DBHelper();
            DB.param = new SqlParameter[]{
                new SqlParameter("@orderid", OrderId),
                new SqlParameter("@serviceid", ServiceId)
            };
            DataTable dtWetSmear = DB.ExecuteSPAndReturnDataTable("OT.ReportResultsViewMicrobiologyWetSmear");

            #endregion
            #region Culture

            DB = new DBHelper();
            DB.param = new SqlParameter[]{
                new SqlParameter("@orderid", OrderId),
                new SqlParameter("@serviceid", ServiceId)
            };
            DataTable dtCulture = DB.ExecuteSPAndReturnDataTable("OT.ReportResultsViewMicrobiologyCulture");

            #endregion
            #region SensitiveTest

            DB = new DBHelper();
            DB.param = new SqlParameter[]{
                new SqlParameter("@orderid", OrderId),
                new SqlParameter("@serviceid", ServiceId)
            };
            DataTable dtSensitiveTest = DB.ExecuteSPAndReturnDataTable("OT.ReportResultsViewMicrobiologySensitiveTest");

            #endregion
            #region  Comment

            DB = new DBHelper();
            DB.param = new SqlParameter[]{
                new SqlParameter("@orderid", OrderId),
                new SqlParameter("@serviceid", ServiceId)
            };
            DataTable dtComment = DB.ExecuteSPAndReturnDataTable("OT.ReportResultsViewMicrobiologyComment");

            #endregion
            #region Results

            DB = new DBHelper();
            DB.param = new SqlParameter[]{
                new SqlParameter("@orderid", OrderId),
                new SqlParameter("@serviceid", ServiceId)
            };
            DataTable dtResults = DB.ExecuteSPAndReturnDataTable("OT.ReportResultsViewMicrobiologyResults");

            #endregion
            #region Footer

            DB = new DBHelper();
            DB.param = new SqlParameter[]{
                new SqlParameter("@orderid", OrderId),
                new SqlParameter("@serviceid", ServiceId)
            };
            DataTable dtFooter = DB.ExecuteSPAndReturnDataTable("OT.ReportResultsViewMicrobiologyFooter");

            #endregion

            #region Report setup.

            ReportViewer2.Reset();
            ReportViewer2.LocalReport.ReportPath = "Areas/OT/Reports/ResultsView/ResultsViewLabMicrobiology.rdl";

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
            ReportViewer2.LocalReport.DataSources.Add(new ReportDataSource("dsSample", dtSample));
            ReportViewer2.LocalReport.DataSources.Add(new ReportDataSource("dsGramStainedSmear", dtGramStainedSmear));
            ReportViewer2.LocalReport.DataSources.Add(new ReportDataSource("dsZNStainedSmear", dtZNStainedSmear));
            ReportViewer2.LocalReport.DataSources.Add(new ReportDataSource("dsWetSmear", dtWetSmear));
            ReportViewer2.LocalReport.DataSources.Add(new ReportDataSource("dsCulture", dtCulture));
            ReportViewer2.LocalReport.DataSources.Add(new ReportDataSource("dsSensitiveTest", dtSensitiveTest));
            ReportViewer2.LocalReport.DataSources.Add(new ReportDataSource("dsComment", dtComment));
            ReportViewer2.LocalReport.DataSources.Add(new ReportDataSource("dsResults", dtResults));
            ReportViewer2.LocalReport.DataSources.Add(new ReportDataSource("dsFooter", dtFooter));

            ReportViewer2.DataBind();
            ReportViewer2.LocalReport.Refresh();

            #endregion

        }

    }
}