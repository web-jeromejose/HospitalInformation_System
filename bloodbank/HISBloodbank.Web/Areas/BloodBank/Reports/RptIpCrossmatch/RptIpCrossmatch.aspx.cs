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
    public partial class RptIpCrossmatch : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (IsPostBack) return;

            #region Init variables
            
            string UserId = "";
            string From = "";
            string To = "";

            #endregion
            #region Get and assign to a variable

            UserId = Request.QueryString["Id"].ToString();
            From = Request.QueryString["From"].ToString();
            To = Request.QueryString["To"].ToString();

            string reportTitle = "IP Crossmatch from : " + From+ " to: " + To;

            #endregion

            #region Header

            DBHelper DB = new DBHelper();
            //DB.param = new SqlParameter[]{
            //    new SqlParameter("@From", From),
            //    new SqlParameter("@To", To)
            //};
            //DataTable dtHeader = DB.ExecuteSPAndReturnDataTable("BLOODBANK.RptBloodDonorScreeningHeader"); 

            #endregion         
            #region Details1

            DB = new DBHelper();
            DB.param = new SqlParameter[]{
                new SqlParameter("@From", From.ToString())
                ,new SqlParameter("@To", To.ToString())
            };
            DataTable dtDetails1 = DB.ExecuteSPAndReturnDataTable("BLOODBANK.RptIpCrossmatchDetails1");

            #endregion
            #region Details2

            //DB = new DBHelper();
            //DB.param = new SqlParameter[]{
            //    new SqlParameter("@From", From),
            //    new SqlParameter("@To", To)
            //};
            //DataTable dtDetails2 = DB.ExecuteSPAndReturnDataTable("BLOODBANK.RptBloodDonorScreeningDetails2");

            #endregion


            #region Report setup.

            ReportViewer2.Reset();
            ReportViewer2.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + @"\Areas\BloodBank/Reports/RptIpCrossmatch/RptIpCrossmatch.rdl";

            PermissionSet permissions = new PermissionSet(PermissionState.Unrestricted);
            ReportViewer2.LocalReport.SetBasePermissionsForSandboxAppDomain(permissions);

            ReportViewer2.LocalReport.SetParameters(new ReportParameter("aaaCompanyName", Common.ReportHeader));
            ReportViewer2.LocalReport.SetParameters(new ReportParameter("aaaReportTitle", reportTitle));
            ReportViewer2.LocalReport.SetParameters(new ReportParameter("aaaDescription01", ""));
            ReportViewer2.LocalReport.SetParameters(new ReportParameter("aaaDescription02", ""));
            ReportViewer2.LocalReport.SetParameters(new ReportParameter("aaaDescription03", ""));
            ReportViewer2.LocalReport.SetParameters(new ReportParameter("aaaUser", UserId));

            ReportViewer2.LocalReport.DataSources.Clear();
            //ReportViewer2.LocalReport.DataSources.Add(new ReportDataSource("dsHeader", dtHeader));
            ReportViewer2.LocalReport.DataSources.Add(new ReportDataSource("dsDetails1", dtDetails1));
            //ReportViewer2.LocalReport.DataSources.Add(new ReportDataSource("dsDetails2", dtDetails2));

            ReportViewer2.DataBind();
            ReportViewer2.LocalReport.Refresh(); 

            #endregion

        }

    }
}