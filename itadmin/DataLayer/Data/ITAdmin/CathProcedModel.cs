using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;

namespace DataLayer
{

    public class CathProcedModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();


        public bool Save(CathProcedureSaveModel entry)
        {

            try
            {
                List<CathProcedureSaveModel> CathProcedureSaveModel = new List<CathProcedureSaveModel>();
                CathProcedureSaveModel.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlCathProcedureSaveModel",CathProcedureSaveModel.ListToXml("CathProcedureSaveModel"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.CathProcedure_Save_SCS");
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


        public List<CathProcedDashBoard> CathProcedDashBoard()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.CatProcedure_DashBoard_SCS");
            List<CathProcedDashBoard> list = new List<CathProcedDashBoard>();
            if (dt.Rows.Count > 0) list = dt.ToList<CathProcedDashBoard>();
            return list;
        }

        public List<CathProcedViewModel> CathProcedViewModel(int Id)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@Id", Id)
            
           
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.CathProcedure_View_SCS");
            List<CathProcedViewModel> list = new List<CathProcedViewModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<CathProcedViewModel>();
            return list;
        }

        public List<ListDepartModel> DepartListDAL(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT top 20 id,DeptCode + ' - ' + Name as text, Name as name from Department where Deleted =0 and name like '%" + id + "%' ").DataTableToList<ListDepartModel>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }
       
         }


    public class CathProcedDashBoard
    {
        public int SNo { get; set; }
        public string Name { get; set; }
        public int Id { get; set;}
    
    
    }

            public class CathProcedViewModel
            {

                public string DepartmentName { get; set; }
                public int DepartmentId { get; set; }
                public string Name { get; set; }
                public int Costprice { get; set; }
                public string Code { get; set; }
                public string Instructions { get; set; }
                public int Id { get; set; }
        
    
            }

            public class CathProcedureSaveModel
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






