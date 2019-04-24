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
namespace HIS_ITADMIN.Areas.ITADMIN.Reports
{
    public partial class Aramco_PerCapita : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                PermissionSet permissions = new PermissionSet(PermissionState.Unrestricted);
                DBHelper DB = new DBHelper();

                string YEAR = Request.QueryString["YEAR"].ToString();
                string MONTH = Request.QueryString["MONTH"].ToString();

                DB.param = new SqlParameter[]{
                new SqlParameter("@YearInput", YEAR),
                new SqlParameter("@MonthInput", MONTH)
                };
                DataTable dt = DB.ExecuteSPAndReturnDataTable("dbo.SP_AramcoPerCapitalMonthly");
                rpt.LocalReport.ReportPath = "Areas/ITADMIN/Reports/Aramco_PerCapita.rdl";
                rpt.LocalReport.SetBasePermissionsForSandboxAppDomain(permissions);
                rpt.LocalReport.SetParameters(new ReportParameter("YearInput", YEAR));
                rpt.LocalReport.SetParameters(new ReportParameter("MonthInput", MONTH));
                rpt.LocalReport.DisplayName = "ARAMCO_PerCapita_" + MONTH + YEAR;
                rpt.LocalReport.DataSources.Clear();
                rpt.LocalReport.DataSources.Add(new ReportDataSource("DataSet1", dt));
                rpt.DataBind();
                rpt.LocalReport.Refresh();
            }
        }
    }
}