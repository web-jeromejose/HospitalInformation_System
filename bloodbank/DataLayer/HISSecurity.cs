using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Diagnostics;
using System.Data.SqlClient;
using System.Data;

namespace DataLayer
{
    public class HISSecurity
    {
        DBHelper DB = new DBHelper("WARDS");
        public string UserID { get; set; }
        public string ModuleID { get; set; }
        public string StationID { get; set; }
        public List<HISSecurityModel> SecuritryFeatureCS()
        {
            try
            {
                DB.param = new SqlParameter[]{
                     new SqlParameter("UserID", UserID),
                     new SqlParameter("ModuleID", ModuleID)
                };
                return DB.ExecuteSPAndReturnDataTable("WARDS.EMPLOYEE_FEATURE").DataTableToList<HISSecurityModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
    }

    public class HISSecurityModel
    {
        public string id { get; set; }
        public string Name { get; set; }
    }
}
