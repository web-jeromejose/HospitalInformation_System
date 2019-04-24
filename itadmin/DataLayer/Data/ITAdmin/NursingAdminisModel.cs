using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;

namespace DataLayer
{

    public class NursingAdminisModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();


        public bool Save(NursingAdminisSaveModel entry)
        {

            try
            {
                List<NursingAdminisSaveModel> NursingAdminisSaveModel = new List<NursingAdminisSaveModel>();
                NursingAdminisSaveModel.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlNursingAdminisSaveModel",NursingAdminisSaveModel.ListToXml("NursingAdminisSaveModel"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.NursingAdministration_Save_SCS");
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


        public List<NursingAdminisDashboardModel> NursingAdminisDashboardModel()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.NursingAdminisProced_DashBoard_SCS");
            List<NursingAdminisDashboardModel> list = new List<NursingAdminisDashboardModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<NursingAdminisDashboardModel>();
            return list;
        }

        public List<NursAdmnProced> NursAdmnProced()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.NursingAdminUtilities_DashBoard_SCS");
            List<NursAdmnProced> list = new List<NursAdmnProced>();
            if (dt.Rows.Count > 0) list = dt.ToList<NursAdmnProced>();
            return list;
        }



        public List<ListDepartModel> DepartListDAL(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT top 20 id,DeptCode + ' - ' + Name as text, Name as name from Department where Deleted =0 and name like '%" + id + "%' ").DataTableToList<ListDepartModel>();
                   
        }



        public List<ListDepartModel> EmpListDAL(string id)
        {

            return db.ExecuteSQLAndReturnDataTableLive("select a.id ,a.Employeeid + ' - ' + a.name [text], a.name as name from employee a where a.deleted = 0 and a.medical = 1 order by [name]").DataTableToList<ListDepartModel>();
        }



        public List<NursingAdminViewModel> NursingAdminViewModel(int Id)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@Id", Id)
            
           
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.NursingAdminProced_View_SCS");
            List<NursingAdminViewModel> list = new List<NursingAdminViewModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<NursingAdminViewModel>();
            return list;
        }

        /**
         *  FOR OT HEAD MAPPING 
         *  
         * */
        public List<MainListOT> DataTableOTHeadList()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.GetHeadMapping");
            List<MainListOT> list = new List<MainListOT>();
            if (dt.Rows.Count > 0) list = dt.ToList<MainListOT>();
            return list;
        }

        

       
    }

        public class NursingAdminisSaveModel
        {
                public int Action { get; set; }
                public int Id { get; set; }
                public string Name { get; set; }
                public string Code { get; set; }
                public decimal CostPrice { get; set; }
                public int DepartmentId { get; set; }
        }


        public class NursingAdminisDashboardModel
        {
            public int SNo { get; set; }
            public string Name { get; set; }
            public int Id { get; set; }
    
        }

        public class NursAdmnProced
        {
            public int SNo { get; set; }
            public string Name { get; set; }
            public string Status { get; set; }
            public int Id { get; set; }

        }

        public class NursingAdminViewModel
        {
            public string Name { get; set; }
            public string Code { get; set; }
            public decimal CostPrice { get; set; }
            public string DepartmentName { get; set; }
            public int DepartmentId { get; set; }
            public int Id { get; set; }
        }

    /**
     FOR OT HEAD MAPPINg
     
     */

        public class MainListOT
        {
            public int userid { get; set; }
            public string empid { get; set; }
            public string name { get; set; }
        }
   

    
    }






