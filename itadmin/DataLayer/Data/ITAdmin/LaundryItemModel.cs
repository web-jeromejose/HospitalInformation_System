using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;


namespace DataLayer.ITAdmin.Model
{
    public class LaundryItemModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();


        public bool Save(LaundryItemSave entry)
        {

            try
            {
                List<LaundryItemSave> LaundryItemSave = new List<LaundryItemSave>();
                LaundryItemSave.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlLaundryItemSave",LaundryItemSave.ListToXml("LaundryItemSave"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.LaundryItem_Save_SCS");
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



        public List<LaundryItemDashBoard> LaundryItemDashBoard()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.LaundryItem_DashBoard_SCS");
            List<LaundryItemDashBoard> list = new List<LaundryItemDashBoard>();
            if (dt.Rows.Count > 0) list = dt.ToList<LaundryItemDashBoard>();
            return list;
        }

        public List<ListDepartment> Select2Department(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT Id id,Name as text,Name as name from Department where Deleted = 0 and Name like '%" + id + "%' ").DataTableToList<ListDepartment>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }

        public List<LaundryItemView> LaundryItemView(int Id)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@Id", Id)
           
           
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.LaundryItem_View_SCS");
            List<LaundryItemView> list = new List<LaundryItemView>();
            if (dt.Rows.Count > 0) list = dt.ToList<LaundryItemView>();
            return list;
        }

    }

    public class LaundryItemSave
    {
        public int Action { get; set; }
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public decimal CostPrice { get; set; }
        public int DepartmentId { get; set; }
        public int OperatorId { get; set; }
    }

    public class LaundryItemDashBoard
    {
        public int SNo { get; set; }
        public string Name { get; set; }
        public int Id { get; set; }
        
    }

    public class ListDepartment
    {
        public string id { get; set; }
        public string name { get; set; }
        public string text { get; set; }
    }

    public class LaundryItemView
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public decimal CostPrice { get; set; }
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public int Id { get; set; }
    
    }
}



