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
        public string FeatureID { get; set; }

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

        public List<HISSecurityModel> SecuritryFunctionCS()
        {
            try
            {
                DB.param = new SqlParameter[]{
                     new SqlParameter("UserID", UserID),
                     new SqlParameter("ModuleID", ModuleID),
                     new SqlParameter("FeatureID", FeatureID)
                };
                return DB.ExecuteSPAndReturnDataTable("HISGLOBAL.EMPLOYEE_FUNCTION").DataTableToList<HISSecurityModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public List<HISMenuModel> MenuFunctionCS()
        {
            try
            {
                DB.param = new SqlParameter[]{
                     new SqlParameter("UserID", UserID),
                     new SqlParameter("ModuleID", ModuleID)
                };
                return DB.ExecuteSPAndReturnDataTable("HISGLOBAL.EMPLOYEE_FEATURE").DataTableToList<HISMenuModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

 
    }

    //public class HISSecurityModel
    //{
    //    public string id { get; set; }
    //    public string Name { get; set; }
    //}

    public class HISSecurityModel
    {
        public string id { get; set; }
        public string Name { get; set; }
    }

    public class HISFeatSecurity
    {
        public int FeatCount { get; set; }
    }

    public class HISModSecurity
    {
        public int ModCount { get; set; }
    }
    public class HISMenuModel
    {
        public string ID { get; set; }
        public string MenuName { get; set; }
        public string ParentName { get; set; }
        public string MenuURL { get; set; }
        public string ParentSequence { get; set; }
        public string MenuSequence { get; set; }
    }
}
