using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;

namespace DataLayer
{

    public class OtherProcedureModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();


        public bool Save(OtherProcedureSaveModel entry)
        {

            try
            {
                List<OtherProcedureSaveModel> OtherProcedureSaveModel = new List<OtherProcedureSaveModel>();
                OtherProcedureSaveModel.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlOtherProcedureSaveModel",OtherProcedureSaveModel.ListToXml("OtherProcedureSaveModel"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.OtherProcedure_Save_SCS");
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


        public List<OtherProcedureDashBoardModel> OtherProcedureDashBoardModel()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.OtherProced_DashBoard_SCS");
            List<OtherProcedureDashBoardModel> list = new List<OtherProcedureDashBoardModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<OtherProcedureDashBoardModel>();
            return list;
        }


        public List<OtherProcedViewModel> OtherProcedViewModel(int Id)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@Id", Id)
            
           
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.OtherProced_View_SCS");
            List<OtherProcedViewModel> list = new List<OtherProcedViewModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<OtherProcedViewModel>();
            return list;
        }


        public List<ListDepartModel> DepartListDAL(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT top 20 id,DeptCode + ' - ' + Name as text, Name as name from Department where Deleted =0 and name like '%" + id + "%' ").DataTableToList<ListDepartModel>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }


        public List<ListSpecializationModel> ListSpecializationModel(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT top 20 id,Code + ' - ' + Name as text, Name as name from Specialisation where Deleted =0 and name like '%" + id + "%' ").DataTableToList<ListSpecializationModel>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }
       
       
         }



    public class OtherProcedureSaveModel
    {
        public int Action { get; set; }
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public decimal CostPrice { get; set; }
        public int DepartmentId { get; set; }
        public string instructions { get; set; }
        public string remarks { get; set; }
        public int OperatorId { get; set; }
        public int SpecialisationId { get; set; }
    
    }


    public class ListSpecializationModel
    {
        public string id { get; set; }
        public string text { get; set; }
        public string name { get; set; }
    }



    public class OtherProcedureDashBoardModel
    {
     
        public int SNo { get; set; }
        public string Name { get; set; }
        public int Id { get; set;}
    
    }

    public class OtherProcedViewModel
    {
        public string Name { get; set; }
        public string DepartmentName { get; set; }
        public int DepartmentId { get; set; }
        public string SpecialisationName { get; set; }
        public int SpecialisationId { get; set; }
        public string Instructions { get; set; }
        public string Remarks { get; set; }
        public int Id { get; set; }
        public string Code { get; set; }
        public decimal CostPrice { get; set; } 

    }





    
    }






