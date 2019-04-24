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
    public class WebSecurityAdminModel
    {

        public string ErrorMessage { get; set; }
        DBHelper db = new DBHelper();
        #region UserRoleTab
        public List<UserDataTableDal> UsersDataTable()
        {

            db.param = new SqlParameter[] {
 
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.WebSecAdmin_ShowUsers");
            List<UserDataTableDal> list = new List<UserDataTableDal>();
            if (dt.Rows.Count > 0) list = dt.ToList<UserDataTableDal>();
            return list;
        }
        public List<GetRoleByUserIDDal> GetRoleByUserID(string UserId)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@UserId", UserId),
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.WebSecAdmin_GetRoleByUserID");
            List<GetRoleByUserIDDal> list = new List<GetRoleByUserIDDal>();
            if (dt.Rows.Count > 0) list = dt.ToList<GetRoleByUserIDDal>();
            return list;
        }

        public List<RolesDataTableDal> RolesDataTable()
        {

            db.param = new SqlParameter[] {
 
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.WebSecAdmin_ShowRoles");
            List<RolesDataTableDal> list = new List<RolesDataTableDal>();
            if (dt.Rows.Count > 0) list = dt.ToList<RolesDataTableDal>();
            return list;
        }

        public bool UpdateRoleDesc(RolesDataTableUpdateDal entry)
        {
            List<RolesDataTableUpdateDal> DetailsEntry = new List<RolesDataTableUpdateDal>();
                DetailsEntry.Add(entry);
            try
            {
                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@RoleDetailsXML", DetailsEntry.ListToXml("RoleDetailsXML"))
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.WebSecAdmin_UpdateRoleSave");
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



       
        public List<AssignRoleDashboardDAL> AssignRoleDashboard(string station_id, string dept_id, string role_id)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@DeptId", dept_id),
            new SqlParameter("@RoleId", role_id)

            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("[ITADMIN].[WebSecAdmin_ShowRolesByDept]");
            List<AssignRoleDashboardDAL> list = new List<AssignRoleDashboardDAL>();
            if (dt.Rows.Count > 0) list = dt.ToList<AssignRoleDashboardDAL>();
            return list;
        }


 

         public List<RoleModel> GetRolebyStationId(string ID)
        {
            try
            {
             return db.ExecuteSQLAndReturnDataTableLive("  "+
                "select DISTINCT a.ROLE_ID as id ,b.Name as text ,b.Name    from HIS.HISGLOBAL.ACCESS_ROLEFEATURES a " +
                     " left join HIS.HISGLOBAL.ACCESS_ROLES b on a.Role_Id = b.RoleID  " +
                     " where (0 = '" + ID + "' OR a.Station_Id = " + ID + ") and a.Deleted = 0 and b.Deleted = 0  ").DataTableToList<RoleModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }



        public List<RoleModel> GetStationDal(string ID)
        {
            try
            {
                return db.ExecuteSQLAndReturnDataTableLive("select 0 as id, '--All Station--' as text , '--All Station--' as name  union select id, name as text ,name from station where name like '%" + ID + "%' and  deleted = 0 order by Name ").DataTableToList<RoleModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public List<RoleModel> GetDepartmentDal()
        {
            try
            {
                return db.ExecuteSQLAndReturnDataTableLive(" select 0 as id, '--All DEPT--' as text , '--All DEPT--' as name  union select id, name as text ,name from Department where deleted = 0 order by Name ").DataTableToList<RoleModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }


        public bool AssignRoleSave(AssignRoleSaveDAL entry)
        {
            List<AssignRoleSaveDAL> DetailsEntry = new List<AssignRoleSaveDAL>();
            DetailsEntry.Add(entry);

            List<AssignRoleDetailsSave> assignRoleDetailsSave = entry.AssignRoleDetailsSave;
            if (assignRoleDetailsSave == null) assignRoleDetailsSave = new List<AssignRoleDetailsSave>();


            try
            {
                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@assignRoleHeaderSave", DetailsEntry.ListToXml("assignRoleHeaderSaveXML"))
                    ,new SqlParameter("@assignRoleDetailsSave", assignRoleDetailsSave.ListToXml("assignRoleDetailsSaveXML"))
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.WebSecAdmin_AssignRoleSave");
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
        #endregion
        #region RoleModuleConfig

        //*********************************Role MOdule Config***********************************
        public List<GetModuleByRoleDAL> GetModuleByRole(string role_id)
        {

            db.param = new SqlParameter[] {
 
            new SqlParameter("@RoleId", role_id)

            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("[ITADMIN].[WebSecAdmin_GetModuleByRole]");
            List<GetModuleByRoleDAL> list = new List<GetModuleByRoleDAL>();
            if (dt.Rows.Count > 0) list = dt.ToList<GetModuleByRoleDAL>();
            return list;
        }
        public List<GetFeatureListByRoleModuleDAL> GetFeatureListByRoleModule(string role_id, string module_id,string stationid)
        {

            db.param = new SqlParameter[] {
 
            new SqlParameter("@ModuleId", module_id),
            new SqlParameter("@RoleId", role_id),
            new SqlParameter("@StationId", stationid)

            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("[ITADMIN].[WebSecAdmin_GetFeatureListByRoleModule]");
            List<GetFeatureListByRoleModuleDAL> list = new List<GetFeatureListByRoleModuleDAL>();
            if (dt.Rows.Count > 0) list = dt.ToList<GetFeatureListByRoleModuleDAL>();
            return list;

            //try
            //{
            //    DBHelper db = new DBHelper();
            //    StringBuilder sql = new StringBuilder();
            //    sql.Append(" select isnull(d.id,0) as FID, a.ModuleID,a.ModuleName,a.URLLink,e.Name as ParentName,e.SequenceNo as ParentSeq,c.FeatureID as FeatureID, c.name as FeatureName,c.SequenceNo as FeatureSequence,case when isnull(d.Feature_Id,0) = 0 or d.Deleted = 1   then 0 else 1 end  as HasAccess  from hisglobal.HIS_MODULES a ");
            //    sql.Append(" left join HISGLOBAL.ACCESS_MODULEFEATURES b on a.ModuleID = b.ModuleId ");
            //    sql.Append(" left join HISGLOBAL.MENU_ACCESS c on b.FeatureId = c.FeatureID ");
            //    sql.Append(" left join hisglobal.ACCESS_USERFEATURES d on a.ModuleID = d.Module_Id and b.FeatureId = d.Feature_Id and ROLEDAPAT = '" + role_id + "'  ");
            //    sql.Append(" left join HISGLOBAL.MENU_PARENT e on c.ParentID = e.MenuID ");
            //    sql.Append(" where a.ModuleID =" + module_id + " and  a.Deleted = 0 and b.Deleted = 0 and c.Deleted = 0 ");

            //    return db.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<GetFeatureListByRoleModuleDAL>();
            //}
            //catch (Exception ex)
            //{
            //    throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            //}
      

        }


        public bool AddModuleByRoleId(AddModuleByRoleIdDAL entry)
        {

            List<AddModuleByRoleIdDAL> HeaderEntry = new List<AddModuleByRoleIdDAL>();
            HeaderEntry.Add(entry);

            List<AddModuleByRoleIdStationDAL> DetailsEntry = entry.stationIds;
            if (DetailsEntry == null) DetailsEntry = new List<AddModuleByRoleIdStationDAL>();

            try
            {
                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@AddModuleHeader", HeaderEntry.ListToXml("AddModuleHeaderXML"))
                     ,new SqlParameter("@AddModuleDetails", DetailsEntry.ListToXml("AddModuleDetailsXML"))
                };
                
                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.WebSecAdmin_AddModuleByRoleId");
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

        public bool RemoveModuleRoleStation(string role_id, string module_id, string stationid)
        {
 
            try
            {
                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                     new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                        new SqlParameter("@ModuleId", module_id),
                        new SqlParameter("@RoleId", role_id),
                        new SqlParameter("@StationId", stationid)
                        };
                
                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.WebSecAdmin_RemoveModuleRoleStation");
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

        public bool RoleModuleConfigAccessRolePerFeatures(string RoleId, string ModuleId, string StationId, string FeatId, int Action)
        {
 
            try
            {
                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500)
                    ,new SqlParameter("@RoleId",RoleId)
                    ,new SqlParameter("@ModuleId",ModuleId)
                    ,new SqlParameter("@StationId",StationId)
                    ,new SqlParameter("@FeatId",FeatId)
                    ,new SqlParameter("@Action",Action)
                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.WebSecAdmin_RoleModuleConfigAccessRolePerFeatures");
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

        public List<GetFeatureFunctionDAL> GetFeatureFunction(string RoleId, string ModuleId, string StationId, string FeatId)
        {
            try
            {
                db.param = new SqlParameter[] {
                    new SqlParameter("@RoleId", RoleId),
                    new SqlParameter("@ModuleId", ModuleId),
                    new SqlParameter("@StationId", StationId),
                    new SqlParameter("@FeatId", FeatId)

                    };
                DataTable dt = db.ExecuteSPAndReturnDataTable("[ITADMIN].[WebSecAdmin_RoleModuleConfigFeatureFunction]");
                List<GetFeatureFunctionDAL> list = new List<GetFeatureFunctionDAL>();
                if (dt.Rows.Count > 0) list = dt.ToList<GetFeatureFunctionDAL>();
                return list;

            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public bool RoleModuleConfigFunctionPerStationModule(string RoleId, string FunctionId, string StationId, string FeatId, int Action)
        {
            try
            {
                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500)
                    ,new SqlParameter("@RoleId",RoleId)
                    ,new SqlParameter("@FunctId",FunctionId)
                    ,new SqlParameter("@StationId",StationId)
                    ,new SqlParameter("@FeatId",FeatId)
                    ,new SqlParameter("@Action",Action)
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.WebSecAdmin_RoleModuleConfigFunctionPerStationModule");
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


        

        #endregion

        #region StationModuleRoleTab


        public List<RoleModel> ModuleListByStation(string ID)
        {
            try
            {
                return db.ExecuteSQLAndReturnDataTableLive(" select distinct Module_Id as Id,b.ModuleName as Name,b.ModuleName as text from  HIS.HISGLOBAL.ACCESS_ROLEFEATURES a left join HIS.HISGLOBAL.HIS_MODULES  b on a.Module_Id = b.ModuleID where  a.Station_Id =  " + ID + " ").DataTableToList<RoleModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public List<RoleModel> RoleListbyStationModule(string stationID,string moduleID)
        {
            try
            {
                return db.ExecuteSQLAndReturnDataTableLive("select distinct b.RoleID  as Id, b.Name, b.Name as text from  HIS.HISGLOBAL.ACCESS_ROLEFEATURES a left join HIS.HISGLOBAL.ACCESS_ROLES  b on a.Role_Id = b.RoleID where  a.Station_Id = " + stationID + " and a.Module_Id = " + moduleID + " ").DataTableToList<RoleModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }


        //---dashboard
        public List<FeatureFunctionDashboard> FeatureFunctionDashboard(string RoleId, string ModuleId , string StationId)
        {
            db.param = new SqlParameter[] {
                new SqlParameter("@RoleId",RoleId)
                ,new SqlParameter("@ModuleId",ModuleId)
                ,new SqlParameter("@StationId",StationId)
            };

            DataSet ds = db.ExecuteSPAndReturnDataSet("[ITADMIN].[WebSecAdmin_StationModuleRoleFeatureList]");
            DataTable dt = ds.Tables[0];
            DataTable dta = new DataTable();

            List<FeatureFunctionDashboard> list = dta.ToList<FeatureFunctionDashboard>();
            if (list.Count == 0) list.Add(new FeatureFunctionDashboard { });

            list[0].FeatureDashboard = ds.Tables[0].ToList<FeatureDashboard>() ?? new List<FeatureDashboard>();
            list[0].FunctionDashboard = ds.Tables[1].ToList<FunctionDashboard>() ?? new List<FunctionDashboard>();

            return list;
        }

        public List<FeatureFunctionDashboard> GetFunctionFromFeatureChecked(FunctionfromFeatureChecked entry)
        {
          
            //List<AddModuleByRoleIdDAL> HeaderEntry = new List<AddModuleByRoleIdDAL>();
            //HeaderEntry.Add(entry);

            //List<AddModuleByRoleIdStationDAL> DetailsEntry = entry.stationIds;
            //if (DetailsEntry == null) DetailsEntry = new List<AddModuleByRoleIdStationDAL>();

            try
            {

                db.param = new SqlParameter[] {
                new SqlParameter("@RoleId",entry.RoleId)
                ,new SqlParameter("@ModuleId",entry.ModuleId)
                ,new SqlParameter("@StationId",entry.StationId)
                ,new SqlParameter("@CheckFeatureList", entry.CheckFeatureList.ListToXml("CheckFeatureListXML"))
                };


                DataSet ds = db.ExecuteSPAndReturnDataSet("[ITADMIN].[WebSecAdmin_StationModuleRoleFeatureListPerFunction]");
                DataTable dt = ds.Tables[0];
                DataTable dta = new DataTable();

                List<FeatureFunctionDashboard> list = dta.ToList<FeatureFunctionDashboard>();
                if (list.Count == 0) list.Add(new FeatureFunctionDashboard { });

                list[0].FeatureDashboard = ds.Tables[0].ToList<FeatureDashboard>() ?? new List<FeatureDashboard>();
                list[0].FunctionDashboard = ds.Tables[1].ToList<FunctionDashboard>() ?? new List<FunctionDashboard>();

                return list;

            }
            catch (Exception x)
            {
                this.ErrorMessage = x.Message;
                DataTable dta = new DataTable();
                List<FeatureFunctionDashboard> list = dta.ToList<FeatureFunctionDashboard>();
                list.Add(new FeatureFunctionDashboard { });
                return list;
                
            }


        }


        

        #endregion



    }

    public class UserDataTableDal
    {
        public string Name { get; set; }
        public string UserId { get; set; }
        public string EmpId { get; set; }
        public string Status { get; set; }
    }
    public class GetRoleByUserIDDal
    {
        public string Name { get; set; }
    }
    public class RolesDataTableDal
    { 
        public string RoleId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Startdatetime { get; set; }
    }
     public class RolesDataTableUpdateDal
    { 
        public string RoleId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Deleted { get; set; }
    }

     public class AssignRoleDashboardDAL
     {
         public int ID { get; set; }
         public string EmployeeId { get; set; }
         public string EmpCode { get; set; }
         public string Name { get; set; }
         public string Dept { get; set; }
         public string Role_Id { get; set; }
         public string Selected { get; set; }    
     }

     public class AssignRoleSaveDAL
     {
         public int Action { get; set; }
         public string deptid { get; set; }
         public string roleid { get; set; }
         public string stationid { get; set; }
         public List<AssignRoleDetailsSave> AssignRoleDetailsSave { get; set; }
         
     }

     public class AssignRoleDetailsSave
     {
         public string employeeId { get; set; }
         public string userId { get; set; }
     }

     public class GetModuleByRoleDAL
     {
       
         public string Station_Id { get; set; }
         public string Module_Id { get; set; }
         public string StationName { get; set; }
         public string ModuleName { get; set; }
 
     }

     public class GetFeatureListByRoleModuleDAL
     {
         public string FID { get; set; }
         public string RoleID { get; set; }
         public string StationID { get; set; }
         public string ModuleID { get; set; }
         public string ModuleName { get; set; }
         public string URLLink { get; set; }
         public string ParentName { get; set; }
         public string ParentSeq { get; set; }
         public string FeatureID { get; set; }
         public string FeatureName { get; set; }
         public string FeatureSequence { get; set; }
         public string HasAccess { get; set; }

     }

     public class AddModuleByRoleIdDAL {
         /*
                     {"RoleId":"1000","ModuleId":"308","stationIds":[{"staionid":"316"},{"staionid":"17"},{"staionid":"99"}]}:
                     */
         public string RoleId { get; set; }
         public string ModuleId { get; set; }
         public List<AddModuleByRoleIdStationDAL> stationIds { get; set; }

     }
     public class AddModuleByRoleIdStationDAL {
         public string stationId { get; set; }
     }

     public class GetFeatureFunctionDAL 
     {
         public string Feature_Id { get; set; }
         public string FeatName { get; set; }
         public string FunctionID { get; set; }
         public string FunctName { get; set; }
         public string HasAccess { get; set; }
         public string Role_Id { get; set; }
         public string Module_Id { get; set; }
         public string Station_Id { get; set; }
     }

     public class FeatureFunctionDashboard
     {
        public List<FeatureDashboard> FeatureDashboard { get; set; }
        public List<FunctionDashboard> FunctionDashboard { get; set; }
     }

     public class FeatureDashboard
     {
        public string ModuleId { get; set; }
        public string RoleId { get; set; }
        public string StationId { get; set; }
        public string FeatureId { get; set; }
        public string FeatName { get; set; }
        public int HasAccess { get; set; }
     }

     public class FunctionDashboard
     {
         public string ModuleId { get; set; }
         public string RoleId { get; set; }
         public string StationId { get; set; }
         public string FeatureId { get; set; }
         public string FunctionId { get; set; }
         public string FeatureName { get; set; }
         public string FunctionName { get; set; }
         public int HasAccess { get; set; }
     }
     public class FunctionfromFeatureChecked
     {
         public string ModuleId { get; set; }
         public string RoleId { get; set; }
         public string StationId { get; set; }
         public List<CheckFeatureList> CheckFeatureList { get; set; }
     
     }
     public class CheckFeatureList
     {
         public string FeatureId { get; set; }
     }
    
}
