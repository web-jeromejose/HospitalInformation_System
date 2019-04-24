using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;

namespace DataLayer
{
    public class PunchingDAL
    {
        DBHelper DB = new DBHelper("GIA");
        public List<PunchingModel> GetPunchingDAL(string df, string dt, string id)
        {
            try
            {
                DB.param = new SqlParameter[]{
                new SqlParameter("@FromDate", df),
                new SqlParameter("@ToDate", dt),
                new SqlParameter("@Department", id),
                new SqlParameter("@DeptAll", "0")                
                };
                return DB.ExecuteSPAndReturnDataTable("GIA.ReportPunchRecord").DataTableToList<PunchingModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
    }
}
