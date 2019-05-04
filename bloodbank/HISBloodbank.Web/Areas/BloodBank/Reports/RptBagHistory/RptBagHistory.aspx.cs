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

using HIS_BloodBank.Models;

namespace HIS_BloodBank.Areas.BloodBank.Reports
{
    public partial class RptBagHistory : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

            if (IsPostBack) return;

            #region Init variables
            
            string UserId = "";
            string bagnumber = "";

            #endregion
            #region Get and assign to a variable

            UserId = Request.QueryString["UserId"].ToString();
            bagnumber = Request.QueryString["bagnumber"].ToString();
            
            string reportTitle = "BLOOD BANK";

            #endregion

            #region Header

            DBHelper DB = new DBHelper();
            //DB.param = new SqlParameter[]{
            //    new SqlParameter("@From", From),
            //    new SqlParameter("@To", To)
            //};
            //DataTable dtHeader = DB.ExecuteSPAndReturnDataTable("BLOODBANK.RptBloodDonorScreeningHeader"); 

            #endregion         
            #region dsDonorDetails

            DB = new DBHelper();
            DB.param = new SqlParameter[]{
                new SqlParameter("@bagnumber", bagnumber)
            };
            DataTable dsDonorDetails = DB.ExecuteSPAndReturnDataTable("BLOODBANK.RptBagHistoryDonorDetails");

            #endregion
            #region dsScreening

            DB = new DBHelper();
            DB.param = new SqlParameter[]{
                new SqlParameter("@bagnumber", bagnumber)
            };
            DataTable dsScreening = DB.ExecuteSPAndReturnDataTable("BLOODBANK.RptBagHistoryDetailScreening");

            #endregion
            #region dsComponent

            DB = new DBHelper();
            DB.param = new SqlParameter[]{
                new SqlParameter("@bagnumber", bagnumber)
            };
            DataTable dsComponent = DB.ExecuteSPAndReturnDataTable("BLOODBANK.RptBagHistoryDetailComponent");

            #endregion
            #region dsCrossmatch

            DB = new DBHelper();
            DB.param = new SqlParameter[]{
                new SqlParameter("@bagnumber", bagnumber)
            };
            DataTable dsCrossmatch = DB.ExecuteSPAndReturnDataTable("BLOODBANK.RptBagHistoryDetailCrossmatch");

            #endregion
            #region dsIssues

            DB = new DBHelper();
            DB.param = new SqlParameter[]{
                new SqlParameter("@bagnumber", bagnumber)
            };
            DataTable dsIssues = DB.ExecuteSPAndReturnDataTable("BLOODBANK.RptBagHistoryDetailIssue");

            #endregion
            #region dsHospital

            DB = new DBHelper();
            DB.param = new SqlParameter[]{
                new SqlParameter("@bagnumber", bagnumber)
            };
            DataTable dsHospital = DB.ExecuteSPAndReturnDataTable("BLOODBANK.RptBagHistoryDetailOtherHospital");

            #endregion
            #region dsBloodBagStatus

            DB = new DBHelper();
            DB.param = new SqlParameter[]{
                new SqlParameter("@bagnumber", bagnumber)
            };
            DataTable dsBloodBagStatus = DB.ExecuteSPAndReturnDataTable("BLOODBANK.RptBagHistoryDetailBloodBagStatus");

            #endregion
            #region dsComponentStatus

            DB = new DBHelper();
            DB.param = new SqlParameter[]{
                new SqlParameter("@bagnumber", bagnumber)
            };
            DataTable dsComponentStatus = DB.ExecuteSPAndReturnDataTable("BLOODBANK.RptBagHistoryDetailComponentStatus");

            #endregion

            #region Report setup.

            ReportViewer2.Reset();
            ReportViewer2.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + @"\Areas\BloodBank/Reports/RptBagHistory/RptBagHistory.rdl";

            PermissionSet permissions = new PermissionSet(PermissionState.Unrestricted);
            ReportViewer2.LocalReport.SetBasePermissionsForSandboxAppDomain(permissions);

            ReportViewer2.LocalReport.SetParameters(new ReportParameter("aaaCompanyName", Common.ReportHeader));
            ReportViewer2.LocalReport.SetParameters(new ReportParameter("aaaReportTitle", reportTitle));
            ReportViewer2.LocalReport.SetParameters(new ReportParameter("aaaDescription01", ""));
            ReportViewer2.LocalReport.SetParameters(new ReportParameter("aaaDescription02", ""));
            ReportViewer2.LocalReport.SetParameters(new ReportParameter("aaaDescription03", ""));
            ReportViewer2.LocalReport.SetParameters(new ReportParameter("aaaUser", UserId));

            ReportViewer2.LocalReport.DataSources.Clear();
            ReportViewer2.LocalReport.DataSources.Add(new ReportDataSource("dsDonorDetails", dsDonorDetails));
            ReportViewer2.LocalReport.DataSources.Add(new ReportDataSource("dsScreening", dsScreening));
            ReportViewer2.LocalReport.DataSources.Add(new ReportDataSource("dsComponent", dsComponent));
            ReportViewer2.LocalReport.DataSources.Add(new ReportDataSource("dsCrossmatch", dsCrossmatch));
            ReportViewer2.LocalReport.DataSources.Add(new ReportDataSource("dsIssues", dsIssues));
            ReportViewer2.LocalReport.DataSources.Add(new ReportDataSource("dsHospital", dsHospital));
            ReportViewer2.LocalReport.DataSources.Add(new ReportDataSource("dsBloodBagStatus", dsBloodBagStatus));
            ReportViewer2.LocalReport.DataSources.Add(new ReportDataSource("dsComponentStatus", dsComponentStatus));

            ReportViewer2.DataBind();
            ReportViewer2.LocalReport.Refresh(); 

            #endregion

        }

    }
}