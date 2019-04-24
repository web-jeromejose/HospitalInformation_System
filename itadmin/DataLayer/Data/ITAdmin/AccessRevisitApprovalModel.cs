using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;

namespace DataLayer
{
    public class AccessRevisitApprovalModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();


        public List<Select2EmployeeAccess> Select2EmployeeAccessDAL(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT a.ID id,a.EmployeeId + '-' + a.Name as text,a.Name as name from employee a where  a.deleted = 0 and a.EmployeeId + '-' + Name like '%" + id + "%' ").DataTableToList<Select2EmployeeAccess>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }



        public bool Save(AccessIdSave entry)
        {

            try
            {
                List<AccessIdSave> AccessIdSave = new List<AccessIdSave>();
                AccessIdSave.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlAccessIdSave",AccessIdSave.ListToXml("AccessIdSave"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.AccessOPRevisitApproval_Save_SCS");
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

        public bool SaveCancelApproval(AccessCancelApproverIdSave entry)
        {

            try
            {
                List<AccessCancelApproverIdSave> AccessCancelApproverIdSave = new List<AccessCancelApproverIdSave>();
                AccessCancelApproverIdSave.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlAccessCancelApproverIdSave",AccessCancelApproverIdSave.ListToXml("AccessCancelApproverIdSave"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.AccessCancelApproval_Save_SCS");
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


    public class Select2EmployeeAccess
    {
        public string id { get; set; }
        public string text { get; set; }
        public string name { get; set; }
    }

    public class AccessIdSave
    {
        public int Action { get; set; }
        public int AccessId { get; set; }
    }

    public class AccessCancelApproverIdSave
    {
        public int Action { get; set; }
        public int AccessId { get; set; }
        //public string AccessName { get; set; }
    }

}



