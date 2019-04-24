using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;

namespace DataLayer
{

    public class PTProcedureModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();


        public bool Save(PTProcedureSaveModel entry)
        {

            try
            {
                List<PTProcedureSaveModel> PTProcedureSaveModel = new List<PTProcedureSaveModel>();
                PTProcedureSaveModel.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlPTProcedureSaveModel",PTProcedureSaveModel.ListToXml("PTProcedureSaveModel"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.PTProcedure_Save_SCS");
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


        public List<PTProcedureDashBoard> PTProcedureDashBoard()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.PTProcedure_DashBoard_SCS");
            List<PTProcedureDashBoard> list = new List<PTProcedureDashBoard>();
            if (dt.Rows.Count > 0) list = dt.ToList<PTProcedureDashBoard>();
            return list;
        }

        public List<PTProcedViewModel> PTProcedViewModel(int Id)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@Id", Id)
            
           
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.PTProcedure_View_SCS");
            List<PTProcedViewModel> list = new List<PTProcedViewModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<PTProcedViewModel>();
            return list;
        }

        public List<ListDepartModel> DepartListDAL(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT top 20 id,DeptCode + ' - ' + Name as text, Name as name from Department where Deleted =0 and name like '%" + id + "%' ").DataTableToList<ListDepartModel>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }
       
         }

    


    public class PTProcedureDashBoard
    {
        public int SNo { get; set; }
        public string Name { get; set; }
        public int Id { get; set;}
    
    
    }

    public class PTProcedViewModel
            {
                public string DepartmentName { get; set; }
                public string DepartmentId { get; set; }
                public string Name { get; set; }
                public string Costprice { get; set; }
                public string Code { get; set; }
                public string Instructions { get; set; }
                public string Id { get; set; }
        
    
            }

            public class PTProcedureSaveModel
            {
                public int Action { get; set; }
                public int Id { get; set; }
                public string Name { get; set; }
                public string Code { get; set; }
                public string instructions { get; set; }
                public int DepartmentId {get; set;}
                public int OperatorId { get; set; }
                public decimal Costprice { get; set; }

            
            }




    
    }






