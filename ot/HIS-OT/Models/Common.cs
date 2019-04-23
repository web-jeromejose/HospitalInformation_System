using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;

using System.Configuration;
using System.Web.Configuration;
using System.ComponentModel;
using System.Reflection;

namespace HIS_OT.Models
{
    public class Common
    {


        public static string ReportHeader
        {
            get
            {
                string configPath = HttpContext.Current.Request.ApplicationPath;
                string retValue = "";

                // http://msdn.microsoft.com/en-us/library/610xe886(v=vs.100).aspx
                Configuration r = WebConfigurationManager.OpenWebConfiguration(configPath);
                if (r.AppSettings.Settings.Count > 0)
                {
                    KeyValueConfigurationElement iCompanyName = r.AppSettings.Settings["CompanyName"];
                    retValue = iCompanyName.Value;
                }
                r = null;

                return retValue;
            }
        }

    }
}