using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;

using System.Configuration;
using System.Web.Configuration;
using System.ComponentModel;
using System.Reflection;
using DataLayer;
using System.Data;

namespace HIS_BloodBank.Models
{
    public class Common
    {


        public static string ReportHeader
        {
            get
            {
                //string configPath = HttpContext.Current.Request.ApplicationPath;
                //string retValue = "";

                //// http://msdn.microsoft.com/en-us/library/610xe886(v=vs.100).aspx
                //Configuration r = WebConfigurationManager.OpenWebConfiguration(configPath);
                //if (r.AppSettings.Settings.Count > 0)
                //{
                //    KeyValueConfigurationElement iCompanyName = r.AppSettings.Settings["CompanyName"];
                //    retValue = iCompanyName.Value;
                //}
                //r = null;

                //return retValue;
                DBHelper db = new DBHelper();
                DataTable dt = db.ExecuteSQLAndReturnDataTable("select top 1 a.name + ' - ' + a.City name from OrganisationDetails a");
                string retValue = "";
                if (dt.Rows.Count > 0)
                {
                    retValue = dt.Rows[0]["name"].ToString();
                }

                return retValue;
            }
        }

    }
}