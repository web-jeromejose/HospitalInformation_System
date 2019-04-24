using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Globalization;
using System.Data;
using System.ComponentModel;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Web;
using System.Data.SqlClient;


namespace DataLayer.ITAdmin.Model
{
    public class OREmployeeTypeModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();

        public bool Save(OREmployeeSave entry)
        {

            try
            {
                List<OREmployeeSave> OREmployeeSave = new List<OREmployeeSave>();
                OREmployeeSave.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlOREmployeeSave",OREmployeeSave.ListToXml("OREmployeeSave"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.OREmployeeType_Save_SCS");
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

        public List<OREmployeeDashBoard> OREmployeeDashBoard()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.OREmployeeType_DashBoard_SCS");
            List<OREmployeeDashBoard> list = new List<OREmployeeDashBoard>();
            if (dt.Rows.Count > 0) list = dt.ToList<OREmployeeDashBoard>();
            return list;
        }

        public List<EmployeeListModel> EmployeeListDal(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT top 10 id,empcode + ' - ' + name as text, name as name from employee where Deleted = 0 and medical = 1  and name like '%" + id + "%' ").DataTableToList<EmployeeListModel>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }


        public List<OREmployeesView> OREmployeesView(int Id)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@Id", Id)
            
           
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.OREmployeeType_View_SCS");
            List<OREmployeesView> list = new List<OREmployeesView>();
            if (dt.Rows.Count > 0) list = dt.ToList<OREmployeesView>();
            return list;
        }
     
    }

    public class OREmployeeSave
    {
        public int Action { get; set; }
        public int Employeeid { get; set; }
        public int TypeId { get; set; }
        
    }

  

    public class OREmployeeDashBoard
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public int Id { get; set; }
    
    }

    public class EmployeeListModel
    {
        public string id { get; set; }
        public string text { get; set; }
        public string name { get; set; }
    }

    public class OREmployeesView
    {

        public string Employeeid { get; set; }
        public string EmployeeName { get; set; }
        public string TypeName { get; set; }
        public string Typeid { get; set; }

    }
}

