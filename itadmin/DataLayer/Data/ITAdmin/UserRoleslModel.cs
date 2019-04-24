using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;

namespace DataLayer
{
    public class UserRoleslModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();


        public List<Select2ModuleList> Select2ModuleListDal(string id)
        {
             return db.ExecuteSQLAndReturnDataTableLive("SELECT a.ModuleID id,a.ModuleName as text,a.ModuleName as name from HIS.HISGLOBAL.HIS_MODULES a where  a.ModuleName like '%" + id + "%' ").DataTableToList<Select2ModuleList>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }

        public List<Select2ModuleList> Select2UserListDAL(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT Top 100 a.ID id,a.EmployeeID + '-' + a.Name as text,a.EmployeeID + '-' + a.Name as name from Employee a where  a.Name like '%" + id + "%' ").DataTableToList<Select2ModuleList>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }

        public bool Save(UserRolesHeaderSave entry)
        {

            try
            {
                List<UserRolesHeaderSave> UserRolesHeaderSave = new List<UserRolesHeaderSave>();
                UserRolesHeaderSave.Add(entry);


                List<UserRolesDetailsSave> UserRolesDetailsSave = entry.UserRolesDetailsSave;
                if (UserRolesDetailsSave == null) UserRolesDetailsSave = new List<UserRolesDetailsSave>();

                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlUserRolesHeaderSave",UserRolesHeaderSave.ListToXml("UserRolesHeaderSave")),     
                    new SqlParameter("@xmlUserRolesDetailsSave", UserRolesDetailsSave.ListToXml("UserRolesDetailsSave")),                 
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.UserRolesSave_SCS");
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

        public List<FeatureListDashBoard> FeatureListDashBoardDAL(int ModuleId,int RoleId, int UserId)
            {


                db.param = new SqlParameter[] {
                new SqlParameter("@ModuleId", ModuleId),
                 new SqlParameter("@RoleId", RoleId),
                 new SqlParameter("@UserId", UserId)
 

                };

                //DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.FeatureList_SCS");
                DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.FeatureListwithUserId");
                List<FeatureListDashBoard> list = new List<FeatureListDashBoard>();
                if (dt.Rows.Count > 0) list = dt.ToList<FeatureListDashBoard>();
                return list;
            }

        public List<FeatureListDashBoard> FeatureNewEntry(int ModuleId)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@ModuleId", ModuleId)
                 

            };

            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.FeatureListNew_SCS");
            List<FeatureListDashBoard> list = new List<FeatureListDashBoard>();
            if (dt.Rows.Count > 0) list = dt.ToList<FeatureListDashBoard>();
            return list;
        }

        public List<FunctionListSelected> FunctionNewEntry()
        {


            //db.param = new SqlParameter[] {
            //new SqlParameter("@ModuleId", ModuleId),
            // new SqlParameter("@RoleId", RoleId)


            //};

            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.FunctionListNew_SCS");
            List<FunctionListSelected> list = new List<FunctionListSelected>();
            if (dt.Rows.Count > 0) list = dt.ToList<FunctionListSelected>();
            return list;
        }

        public List<FunctionListSelected> FunctionListDL(int UserId, int ModuleId,int RoleId)
        {


            db.param = new SqlParameter[] {
                new SqlParameter("@UserId", UserId),
                new SqlParameter("@ModuleId", ModuleId),
                new SqlParameter("@RoleId", RoleId)
 

            };

            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.FunctionList_SCS");
            List<FunctionListSelected> list = new List<FunctionListSelected>();
            if (dt.Rows.Count > 0) list = dt.ToList<FunctionListSelected>();
            return list;
        }



    }

    public class Select2ModuleList
    {
        public string id { get; set; }
        public string text { get; set; }
        public string name { get; set; }
    }

    public class FeatureListDashBoard
    {
        public int selected { get; set; }
        public string FeatureName { get; set; }
        public string FeatureId { get; set; }
    
    }

    public class FunctionListSelected
    {
        public int selected { get; set; }
        public string FunctionName { get; set; }
        public string FunctionID { get; set; }

    
    }

    public class UserRolesHeaderSave
    {
        public int Action { get; set; }
        public int UserId { get; set; }
        public int RoleId { get; set; }
        public int ModuleId { get; set; }
        public int StationId { get; set; }
        public string RoleName { get; set; }
        public int OperatorId { get; set; }
        public List<UserRolesDetailsSave> UserRolesDetailsSave { get; set; }
    
    }

    public class UserRolesDetailsSave
    {
        public int FeatureId { get; set; }
        //public int FunctionId { get; set; }

    }




}



