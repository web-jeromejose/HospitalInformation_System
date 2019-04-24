using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;
using System.Text;


namespace DataLayer
{
    public class CathLabEmployeeMasterModel
    {
        public string ErrorMessage { get; set; }
        DBHelper db = new DBHelper();



        public List<DashboardForCathLabEmployeeMaster> Dashboard(string typeid)
        {
            db.param = new SqlParameter[] { 
                new SqlParameter("@typeId", typeid.ToString())
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("[ITADMIN].[CathLabEmployeeMaster_Dashboard]");
            List<DashboardForCathLabEmployeeMaster> list = dt.ToList<DashboardForCathLabEmployeeMaster>();
            if (dt.Rows.Count > 0) list = dt.ToList<DashboardForCathLabEmployeeMaster>();
            return list;
        }

        public bool Save(string empid, string type, string action)
        {

            try
            {
                 
                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500)
                   ,new SqlParameter("@typeid",empid)
                   ,new SqlParameter("@type",type)
                   ,new SqlParameter("@Action",action)               
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.CathLabEmployeeMaster_Save");
                this.ErrorMessage = db.param[0].Value.ToString();

                bool isOK = this.ErrorMessage.Split('-')[0] == "100";

                return isOK;
            }
            catch (Exception x)
            {
                this.ErrorMessage = x.Message;
                return false;
            }

        }


   



    }

    public class CathLabEmployeeMasterFilter
    {
        public int Action { get; set; }
        public int ID { get; set; }
        public int EmpID { get; set; }
        public string TypeId { get; set; }
    }
    public class DashboardForCathLabEmployeeMaster
    {
        public int SNo { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }
        public string EmployeeID { get; set; }
        public string DeptName { get; set; }
        public int isExist { get; set; }
    }

}
