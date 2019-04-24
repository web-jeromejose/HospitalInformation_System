using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;

namespace DataLayer
{
    public class GenericDAL
    {
        DBHelper DB = new DBHelper("GIA");
        public string ID { get; set; }
        public List<ListModel> GetCategoryDAL()
        {
            try
            {
                return DB.ExecuteSQLAndReturnDataTable(" select id,Code + ' - ' + Name as name,Code + ' - ' + Name as text  from category where deleted = 0 union all select 0 ,'0000 ALL','ALL' ").DataTableToList<ListModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public List<ListModel> GetCompanyDAL()
        {
            try
            {
                return DB.ExecuteSQLAndReturnDataTable(" select id,Code as name,Name as text from company where deleted = 0 and categoryid = " + ID + " union all select 0 ,'0000 ALL','ALL' ").DataTableToList<ListModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public List<ListModel> GetDoctorDAL()
        {
            try
            {
                return DB.ExecuteSQLAndReturnDataTable(" select EmpCode as id,EmpCode + ' - ' + Name as name,EmpCode + ' - ' + Name as text from doctor where deleted = 0 union all select '0' ,'0000 ALL','ALL' ").DataTableToList<ListModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public List<ListModel> GetStationDAL()
        {
            try
            {
                return DB.ExecuteSQLAndReturnDataTable(" select  id,name,name as text from Station where deleted = 0  and DepartmentId = " + ID).DataTableToList<ListModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public List<ListModel> GetHRCategoryDAL()
        {
            try
            {
                DB.param = new SqlParameter[]{
                new SqlParameter("@FromDate", "01/01/1900"),
                new SqlParameter("@ToDate", "01/01/1900"),
                new SqlParameter("@Department", "0"),
                new SqlParameter("@DeptAll", "1")                
                };
                return DB.ExecuteSPAndReturnDataTable("GIA.ReportPunchRecord").DataTableToList<ListModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

    }

    
}
