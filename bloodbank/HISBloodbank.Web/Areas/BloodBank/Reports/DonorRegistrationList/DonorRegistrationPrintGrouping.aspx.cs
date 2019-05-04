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
using HIS_BloodBank.Areas.BloodBank.Models;
using System.Web.Script.Serialization;

namespace HIS_BloodBank.Areas.BloodBank.Reports
{
    public partial class DonorRegistrationPrintGrouping : System.Web.UI.Page
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
            UserId = Request.QueryString["UserId"].ToString();

            #endregion

            #region DataSet1

            DBHelper DB = new DBHelper();
            DB.param = new SqlParameter[]{
                new SqlParameter("@Id", Id),
                new SqlParameter("@ReportType", 1),
            };
            DataTable DataSet1 = DB.ExecuteSPAndReturnDataTable("BloodBank.DonorRegistrationPrint"); 

            #endregion         
 
            #region DataSet2

            DB = new DBHelper();
            DB.param = new SqlParameter[]{
                new SqlParameter("@Id", Id),
                new SqlParameter("@ReportType", 2),
            };
            DataTable DataSet2 = DB.ExecuteSPAndReturnDataTable("BloodBank.DonorRegistrationPrint");

            #endregion         
 


            #region Report setup.

            ReportViewer2.Reset();
            ReportViewer2.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + @"\Areas\BloodBank/Reports/DonorRegistrationList/DonorRegistrationPrintGrouping.rdl";

            PermissionSet permissions = new PermissionSet(PermissionState.Unrestricted);
            ReportViewer2.LocalReport.SetBasePermissionsForSandboxAppDomain(permissions);

            ReportViewer2.LocalReport.SetParameters(new ReportParameter("aaaCompanyName", Common.ReportHeader));
            ReportViewer2.LocalReport.SetParameters(new ReportParameter("aaaReportTitle", "Donor Registration Grouping"));
            ReportViewer2.LocalReport.SetParameters(new ReportParameter("aaaDescription01", ""));
            //ReportViewer2.LocalReport.SetParameters(new ReportParameter("aaaDescription02", ""));
            //ReportViewer2.LocalReport.SetParameters(new ReportParameter("aaaDescription03", ""));
            ReportViewer2.LocalReport.SetParameters(new ReportParameter("aaaUser", UserId));

            ReportViewer2.LocalReport.DataSources.Clear();
            ReportViewer2.LocalReport.DataSources.Add(new ReportDataSource("DataSet1", DataSet1));
            ReportViewer2.LocalReport.DataSources.Add(new ReportDataSource("DataSet2", DataSet2));
            //ReportViewer2.LocalReport.DataSources.Add(new ReportDataSource("dsDetails1", dtDetails1));

            ReportViewer2.DataBind();
            ReportViewer2.LocalReport.Refresh(); 

            #endregion

        }

    }
}