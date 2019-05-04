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
    public partial class CrossmatchIP : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (IsPostBack) return;

            #region Init variables

            string Id = "";
            string UserId = "";

            #endregion
            #region Get and assign to a variable

            Id = Request.QueryString["Id"].ToString();

            #endregion

            #region Header

            DBHelper DB = new DBHelper();
            DB.param = new SqlParameter[]{
                new SqlParameter("@Id", Id)
            };
            DataTable dtHeader = DB.ExecuteSPAndReturnDataTable("BLOODBANK.ReportCrossmatchIPHeader"); 

            #endregion         
            #region Details1

            DB = new DBHelper();
            DB.param = new SqlParameter[]{
                new SqlParameter("@Id", Id)
            };
            DataTable dtDetails1 = DB.ExecuteSPAndReturnDataTable("BLOODBANK.ReportCrossmatchIPDetail1");

            #endregion


            #region Report setup.

            ReportViewer2.Reset();
            ReportViewer2.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + @"\Areas\BloodBank/Reports/CrossmatchIP/CrossmatchIP.rdl";

            PermissionSet permissions = new PermissionSet(PermissionState.Unrestricted);
            ReportViewer2.LocalReport.SetBasePermissionsForSandboxAppDomain(permissions);

            ReportViewer2.LocalReport.SetParameters(new ReportParameter("aaaCompanyName", Common.ReportHeader));
            ReportViewer2.LocalReport.SetParameters(new ReportParameter("aaaReportTitle", "Blood Bank"));
            ReportViewer2.LocalReport.SetParameters(new ReportParameter("aaaDescription01", "Blood Requisition"));
            ReportViewer2.LocalReport.SetParameters(new ReportParameter("aaaDescription02", ""));
            ReportViewer2.LocalReport.SetParameters(new ReportParameter("aaaDescription03", ""));
            ReportViewer2.LocalReport.SetParameters(new ReportParameter("aaaUser", UserId));

            ReportViewer2.LocalReport.DataSources.Clear();
            ReportViewer2.LocalReport.DataSources.Add(new ReportDataSource("dsHeader", dtHeader));
            ReportViewer2.LocalReport.DataSources.Add(new ReportDataSource("dsDetails1", dtDetails1));

            ReportViewer2.DataBind();
            ReportViewer2.LocalReport.Refresh(); 

            #endregion

        }

    }
}