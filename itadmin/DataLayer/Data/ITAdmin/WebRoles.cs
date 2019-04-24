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
    public class WebRoles
    {

        public string ErrorMessage { get; set; }
        DBHelper db = new DBHelper();

        public List<RolesData> RoleListDT()
        {
            StringBuilder sql = new StringBuilder();
            sql.Clear();
            sql.Append("  select RoleId,Name,Description,Startdatetime from HIS.HISGLOBAL.ACCESS_ROLES where  (DELETED=0 OR DELETED IS NULL) ORDER BY Id desc  ");
            DataTable dt = db.ExecuteSQLAndReturnDataTable(sql.ToString());

            List<RolesData> list = new List<RolesData>();
            if (dt.Rows.Count > 0) list = dt.ToList<RolesData>();
            return list;
        }
        public List<RoleModel> GetRolesDal(string ID)
        {
            try
            {
                return db.ExecuteSQLAndReturnDataTable(" select id, cast(id as varchar(20))+ '-'+name as text ,cast(id as varchar(20))+ '-'+name as name from HIS.HISGLOBAL.ACCESS_ROLES  where name like '%" + ID + "%'   and deleted = 0  ").DataTableToList<RoleModel>();
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
                return db.ExecuteSQLAndReturnDataTableLive(" select id, name as text ,name from Department where deleted = 0 order by Name ").DataTableToList<RoleModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public List<RoleModel> GetModulesDal(string ID)
        {
            try
            {
                return db.ExecuteSQLAndReturnDataTableLive("select ModuleId as Id,cast(ModuleId as varchar(20)) + '-' +ModuleName as Name,cast(ModuleId as varchar(20)) + '-' +ModuleName as text from HISGLOBAL.HIS_MODULES  where ModuleName like '%" + ID + "%'    ").DataTableToList<RoleModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public List<RoleModel> GetModuleByRoleId(string ID)
        {
            try
            {
                return db.ExecuteSQLAndReturnDataTableLive(" select distinct A.Module_Id as id, C.ModuleName as name, C.ModuleName as text from HISGLOBAL.ACCESS_ROLEFEATURES A LEFT JOIN HIS.HISGLOBAL.HIS_MODULES C on A.Module_Id = C.ModuleID where A. Role_id = '" + ID + "' AND C.Deleted = 0 and a.Station_Id = 0  ").DataTableToList<RoleModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public List<GetFeatureByRole> GetFeatureByRole(string roleid, string moduleid)
        {
            try
            {
                StringBuilder sql = new StringBuilder();

                sql.Append("   select  f.Role_Id as RoleId,a.ModuleID,a.ModuleName,a.URLLink,e.Name as ParentName,e.SequenceNo as ParentSeq ");
                sql.Append("   ,c.FeatureID as FeatureID, c.name as FeatureName,c.SequenceNo as FeatureSequence ");
                sql.Append("   ,case when   f.Deleted = 1   then 0 else 1 end  as HasAccess   ");
                sql.Append("   from hisglobal.HIS_MODULES a  ");
                sql.Append("   left join HISGLOBAL.ACCESS_MODULEFEATURES b on a.ModuleID = b.ModuleId  ");
                sql.Append("   left join HISGLOBAL.MENU_ACCESS c on b.FeatureId = c.FeatureID  ");
                sql.Append("   left join HISGLOBAL.MENU_PARENT e on c.ParentID = e.MenuID  ");
                sql.Append("   left join HISGLOBAL.ACCESS_ROLEFEATURES f on f.Module_Id = a.ModuleID   and b.FeatureId = f.Feature_Id ");
                sql.Append("   where a.ModuleID =" + moduleid + "  ");
                sql.Append("   and f.Role_Id = " + roleid + "  and f.Station_Id = 0 ");
                sql.Append("   and  a.Deleted = 0 and b.Deleted = 0 and c.Deleted = 0  ");


                return db.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<GetFeatureByRole>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public List<AssignRoleDashboardDAL> AssignRoleDashboard(string dept_id, string role_id)
        {
            StringBuilder sql = new StringBuilder();
            sql.Clear();
            sql.Append("  DECLARE @DeptId varchar(max) = '" + dept_id + "'");
            sql.Append("  DECLARE  @RoleId varchar(max) = '" + role_id + "'");
            sql.Append("  ");
            sql.Append("  select   A.ID,A.EMPLOYEEID,A.EMPCODE,A.NAME,B.NAME AS DEPT,c.ROLE_ID , '1' as selected ");
            sql.Append("  into #tempWebSecAdmin_ShowRolesByDept");
            sql.Append("  from EMPLOYEE A ");
            sql.Append("  left join Department b on a.DepartmentID = b.ID");
            sql.Append("  left join HIS.HISGLOBAL.ACCESS_USERROLES c on c.User_Id = a.ID");
            sql.Append("  where c.Role_Id = @RoleId ");
            sql.Append("  and (@DeptId = '0' OR  b.Id = @DeptId)");
            sql.Append("  ORDER BY c.ROLE_ID DESC,b.Id ");
            sql.Append("  ");
            sql.Append("  ");
            sql.Append("  select * from #tempWebSecAdmin_ShowRolesByDept  ");
            sql.Append("  union all ");
            sql.Append("  select  A.ID,A.EMPLOYEEID,A.EMPCODE,A.NAME,B.NAME AS DEPT,@RoleId, '0' as selected ");
            sql.Append("  from EMPLOYEE a ");
            sql.Append("  left join Department b on a.DepartmentID = b.ID");
            sql.Append("  where  (a.DELETED=0 OR a.DELETED IS NULL)");
            sql.Append("  and a.ID not IN ( select ID from #tempWebSecAdmin_ShowRolesByDept)");
            sql.Append("  and (@DeptId = '0' OR  b.Id = @DeptId)");
            sql.Append("  ORDER BY  selected desc ,dept , a.name");
            sql.Append("  ");
            sql.Append("  drop table #tempWebSecAdmin_ShowRolesByDept");

            DataTable dt = db.ExecuteSQLAndReturnDataTable(sql.ToString());

            List<AssignRoleDashboardDAL> list = new List<AssignRoleDashboardDAL>();
            if (dt.Rows.Count > 0) list = dt.ToList<AssignRoleDashboardDAL>();
            return list;

        }
        public bool AssignRoleSave(AssignRoleSaveDAL entry)
        {
            StringBuilder sql = new StringBuilder();
            StringBuilder sqlquery = new StringBuilder();



            List<AssignRoleDetailsSave> assignRoleDetailsSave = entry.AssignRoleDetailsSave;

            try
            {

                sqlquery.Append(" declare @userId as int ");
                sqlquery.Append(" declare @RoleId as int = " + entry.roleid);
                sqlquery.Append(" declare @deptID int = " + entry.deptid);


                if (assignRoleDetailsSave.Count > 0)
                {


                    sqlquery.Append("  delete from   HIS.HISGLOBAL.ACCESS_USERROLES where Role_Id = @RoleId  and User_Id in (select ID from employee where DepartmentID = @deptID)      ");

                    foreach (var item in assignRoleDetailsSave.Where(i => i.userId != null))
                    {
                        var TmpTable = "#webroleModuleList" + DateTime.Now.Minute + "_" + DateTime.Now.Millisecond;

                        sqlquery.Append("   ");
                        sqlquery.Append("  SET @userId = " + item.userId);

                        sqlquery.Append("   ");
                        sqlquery.Append("  delete from   HIS.HISGLOBAL.ACCESS_USERROLES where Role_Id = @RoleId and User_Id = @userId   ");
                        sqlquery.Append("  INSERT INTO HIS.HISGLOBAL.ACCESS_USERROLES (ROLE_ID,USER_ID,STARTDATETIME,OPERATORID,Deleted) ");
                        sqlquery.Append("  values ( @RoleId,@userId,getdate(),0,0  ) ");
                        sqlquery.Append("   ");

                        sqlquery.Append("  declare @looproleId int = " + entry.roleid);
                        sqlquery.Append("  declare @loopUserId int  = " + item.userId);
                        sqlquery.Append("   ");
                        sqlquery.Append("  declare @rowid int ");
                        sqlquery.Append("  declare @loopModId int ");
                        sqlquery.Append("   ");
                        sqlquery.Append("  select distinct Module_Id,IDENTITY(INT, 1,1) as rowId into " + TmpTable + " from HIS.HISGLOBAL.ACCESS_ROLEFEATURES where role_id = @looproleId ");
                        sqlquery.Append("   ");
                        sqlquery.Append("  WHILE EXISTS(select top 1 *  from " + TmpTable + ")   ");
                        sqlquery.Append("  BEGIN ");
                        sqlquery.Append("  select @rowid = rowId,@loopModId = Module_Id  from " + TmpTable + " ");
                        sqlquery.Append("   ");
                        sqlquery.Append("  delete from HISGLOBAL.ACCESS_USERFEATURES where USERID = @loopUserId and Module_Id = @loopModId and Deleted = 0 and Station_Id = 0 ");
                        sqlquery.Append("   ");
                        sqlquery.Append("  insert into HISGLOBAL.ACCESS_USERFEATURES (USERID,Module_Id,Feature_Id,Deleted,Station_Id,StartDateTime) ");
                        sqlquery.Append("  select @loopUserId,Module_Id,Feature_Id,Deleted,0 ,getdate() ");
                        sqlquery.Append("  from HIS.HISGLOBAL.ACCESS_ROLEFEATURES where Module_Id = @loopModId and Role_Id = @looproleId ");
                        sqlquery.Append("  and Feature_Id not in   ");
                        sqlquery.Append("  (select distinct Feature_Id  from HISGLOBAL.ACCESS_USERFEATURES where USERID = @loopUserId and Module_Id = @loopModId and Deleted = 1 and Station_Id = 0 )   ");

                        sqlquery.Append("   ");
                        sqlquery.Append("  delete from " + TmpTable + "  where rowId = @rowid ");
                        sqlquery.Append("  END ");
                        sqlquery.Append("   ");
                        sqlquery.Append("  drop table " + TmpTable + " ");

                    }
                }

                sql.Append("   ");
                sql.Append("  DECLARE @ErrorMessage as NVARCHAR(max) ");
                sql.Append("  DECLARE @ERROR_SEVERITY AS INT  ");
                sql.Append("  DECLARE @ERROR_STATE AS INT ");
                sql.Append("   ");
                sql.Append("  BEGIN TRY ");
                sql.Append("       ");
                sql.Append("  BEGIN TRAN ");
                sql.Append("   ");
                sql.Append("   ");
                sql.Append("   ");
                sql.Append("   " + sqlquery.ToString());
                sql.Append("   ");
                sql.Append("  COMMIT TRAN ");
                sql.Append("   ");
                sql.Append("  SET	@ErrorMessage = '100-Updated Successfully.'		 ");
                sql.Append("  SET @ERROR_STATE = 0		   ");
                sql.Append("  SELECT @ErrorMessage as Message, @ERROR_STATE as Error   ");
                sql.Append("  return ");
                sql.Append("    ");
                sql.Append("  END TRY ");
                sql.Append("  BEGIN CATCH                 ");
                sql.Append("  SET	@ErrorMessage = N'There was an error: Ln: ' + cast(ERROR_LINE() as nvarchar(2048)) + N' Message: ' + ERROR_MESSAGE();		 ");
                sql.Append("  SET @ERROR_STATE = 1		 ");
                sql.Append("  SELECT @ErrorMessage as Message, @ERROR_STATE as Error   ");
                sql.Append("  return ");
                sql.Append("  END CATCH;   ");

                List<SqlMessage> dt = db.ExecuteSQLAndReturnDataTable(sql.ToString()).DataTableToList<SqlMessage>();
                if (dt.Count > 0)
                {
                    this.ErrorMessage = dt[0].Message;
                    if (dt[0].Error == "1")
                    {
                        return false;
                    }
                }

                return true;

            }
            catch (Exception x)
            {
                this.ErrorMessage = x.Message;
                return false;
            }

        }
        public bool AddModuleinRole(string module_id, string role_id, int operatorid)
        {
            StringBuilder sql = new StringBuilder();
            StringBuilder sqlquery = new StringBuilder();

            try
            {

                sqlquery.Append("  declare @roleid int =" + role_id);
                sqlquery.Append("  declare @modid int =" + module_id);
                sqlquery.Append("  declare @operatorid int =" + operatorid);
                sqlquery.Append("   ");
                sqlquery.Append("  delete from  HISGLOBAL.ACCESS_ROLEFEATURES  where role_id = @roleid and station_id = 0 and Module_Id = @modid ");
                sqlquery.Append("  insert into HISGLOBAL.ACCESS_ROLEFEATURES  (Role_Id,Station_Id,Module_Id,Feature_Id,StartDateTime,OperatorId,Deleted) ");
                sqlquery.Append("  select @roleid,0,moduleId,FeatureId,GETDATE(),@operatorid,0 from  HISGLOBAL.ACCESS_MODULEFEATURES a where a.ModuleId = @modid and a.deleted = 0  ");




                sql.Append("   ");
                sql.Append("  DECLARE @ErrorMessage as NVARCHAR(max) ");
                sql.Append("  DECLARE @ERROR_SEVERITY AS INT  ");
                sql.Append("  DECLARE @ERROR_STATE AS INT ");
                sql.Append("   ");
                sql.Append("  BEGIN TRY ");
                sql.Append("       ");
                sql.Append("  BEGIN TRAN ");
                sql.Append("   ");
                sql.Append("   ");
                sql.Append("   ");
                sql.Append("   " + sqlquery.ToString());
                sql.Append("   ");
                sql.Append("  COMMIT TRAN ");
                sql.Append("   ");
                sql.Append("  SET	@ErrorMessage = '100-Updated Successfully.'		 ");
                sql.Append("  SET @ERROR_STATE = 0		   ");
                sql.Append("  SELECT @ErrorMessage as Message, @ERROR_STATE as Error   ");
                sql.Append("  return ");
                sql.Append("    ");
                sql.Append("  END TRY ");
                sql.Append("  BEGIN CATCH                 ");
                sql.Append("  SET	@ErrorMessage = N'There was an error: Ln: ' + cast(ERROR_LINE() as nvarchar(2048)) + N' Message: ' + ERROR_MESSAGE();		 ");
                sql.Append("  SET @ERROR_STATE = 1		 ");
                sql.Append("  SELECT @ErrorMessage as Message, @ERROR_STATE as Error   ");
                sql.Append("  return ");
                sql.Append("  END CATCH;   ");

                List<SqlMessage> dt = db.ExecuteSQLAndReturnDataTable(sql.ToString()).DataTableToList<SqlMessage>();
                if (dt.Count > 0)
                {
                    this.ErrorMessage = dt[0].Message;
                    if (dt[0].Error == "1")
                    {
                        return false;
                    }
                }

                return true;

            }
            catch (Exception x)
            {
                this.ErrorMessage = x.Message;
                return false;
            }

        }

        public bool RemoveModuleinRole(string module_id, string role_id)
        {
            StringBuilder sql = new StringBuilder();
            StringBuilder sqlquery = new StringBuilder();

            try
            {

                sqlquery.Append("  declare @roleid int =" + role_id);
                sqlquery.Append("  declare @modid int =" + module_id);

                sqlquery.Append("   ");
                sqlquery.Append("  delete from  HISGLOBAL.ACCESS_ROLEFEATURES  where role_id = @roleid and station_id = 0 and Module_Id = @modid ");


                sql.Append("   ");
                sql.Append("  DECLARE @ErrorMessage as NVARCHAR(max) ");
                sql.Append("  DECLARE @ERROR_SEVERITY AS INT  ");
                sql.Append("  DECLARE @ERROR_STATE AS INT ");
                sql.Append("   ");
                sql.Append("  BEGIN TRY ");
                sql.Append("       ");
                sql.Append("  BEGIN TRAN ");
                sql.Append("   ");
                sql.Append("   ");
                sql.Append("   ");
                sql.Append("   " + sqlquery.ToString());
                sql.Append("   ");
                sql.Append("  COMMIT TRAN ");
                sql.Append("   ");
                sql.Append("  SET	@ErrorMessage = '100-Updated Successfully.'		 ");
                sql.Append("  SET @ERROR_STATE = 0		   ");
                sql.Append("  SELECT @ErrorMessage as Message, @ERROR_STATE as Error   ");
                sql.Append("  return ");
                sql.Append("    ");
                sql.Append("  END TRY ");
                sql.Append("  BEGIN CATCH                 ");
                sql.Append("  SET	@ErrorMessage = N'There was an error: Ln: ' + cast(ERROR_LINE() as nvarchar(2048)) + N' Message: ' + ERROR_MESSAGE();		 ");
                sql.Append("  SET @ERROR_STATE = 1		 ");
                sql.Append("  SELECT @ErrorMessage as Message, @ERROR_STATE as Error   ");
                sql.Append("  return ");
                sql.Append("  END CATCH;   ");

                List<SqlMessage> dt = db.ExecuteSQLAndReturnDataTable(sql.ToString()).DataTableToList<SqlMessage>();
                if (dt.Count > 0)
                {
                    this.ErrorMessage = dt[0].Message;
                    if (dt[0].Error == "1")
                    {
                        return false;
                    }
                }

                return true;

            }
            catch (Exception x)
            {
                this.ErrorMessage = x.Message;
                return false;
            }

        }

        public bool UpdateRoleFeature(int roleid, int moduleid, int featid, int operatorid, int deleted)
        {

            StringBuilder sql = new StringBuilder();
            StringBuilder sqlquery = new StringBuilder();
            try
            {

                sqlquery.Append("   ");
                sqlquery.Append("  declare @roleid int =" + roleid);
                sqlquery.Append("  declare @moduleid int =" + moduleid);
                sqlquery.Append("  declare @featureid int =" + featid);
                sqlquery.Append("  declare @operatorid int =" + operatorid);
                sqlquery.Append("  declare @deleted int =" + deleted);
                sqlquery.Append("   ");

                sqlquery.Append("  delete from HIS.HISGLOBAL.ACCESS_ROLEFEATURES where role_id =@roleid and Module_Id = @moduleid and Feature_Id = @featureid and  Station_Id = 0 ");
                sqlquery.Append("  insert into HIS.HISGLOBAL.ACCESS_ROLEFEATURES  (Role_Id,Station_Id,Module_Id,Feature_Id,startdatetime,Deleted,OperatorId) ");
                sqlquery.Append("  values (@roleid,0,@moduleid,@featureid,GETDATE(),@deleted,@operatorid) ");


                sql.Append("   ");
                sql.Append("  DECLARE @ErrorMessage as NVARCHAR(max) ");
                sql.Append("  DECLARE @ERROR_SEVERITY AS INT  ");
                sql.Append("  DECLARE @ERROR_STATE AS INT ");
                sql.Append("   ");
                sql.Append("  BEGIN TRY ");
                sql.Append("       ");
                sql.Append("  BEGIN TRAN ");
                sql.Append("   ");
                sql.Append("   ");
                sql.Append("   ");
                sql.Append("   " + sqlquery.ToString());
                sql.Append("   ");
                sql.Append("  COMMIT TRAN ");
                sql.Append("   ");
                sql.Append("  SET	@ErrorMessage = '100-Updated Successfully.'		 ");
                sql.Append("  SET @ERROR_STATE = 0		   ");
                sql.Append("  SELECT @ErrorMessage as Message, @ERROR_STATE as Error   ");
                sql.Append("  return ");
                sql.Append("    ");
                sql.Append("  END TRY ");
                sql.Append("  BEGIN CATCH                 ");
                sql.Append("  SET	@ErrorMessage = N'There was an error: Ln: ' + cast(ERROR_LINE() as nvarchar(2048)) + N' Message: ' + ERROR_MESSAGE();		 ");
                sql.Append("  SET @ERROR_STATE = 1		 ");
                sql.Append("  SELECT @ErrorMessage as Message, @ERROR_STATE as Error   ");
                sql.Append("  return ");
                sql.Append("  END CATCH;   ");

                List<SqlMessage> dt = db.ExecuteSQLAndReturnDataTable(sql.ToString()).DataTableToList<SqlMessage>();
                if (dt.Count > 0)
                {
                    this.ErrorMessage = dt[0].Message;
                    if (dt[0].Error == "1")
                    {
                        return false;
                    }
                }

                return true;

            }
            catch (Exception x)
            {
                this.ErrorMessage = x.Message;
                return false;
            }

        }

        public bool UpdateRoleDesc(RolesDataTableUpdateDal entry)
        {

            StringBuilder sql = new StringBuilder();
            StringBuilder sqlquery = new StringBuilder();
            try
            {
                sqlquery.Append("   ");
                sqlquery.Append("  declare @RoleId int  ="+entry.RoleId);
                sqlquery.Append("  declare @deleted int  =" + entry.Deleted);
                sqlquery.Append("  declare @operatorId int  =1");
                sqlquery.Append("  declare @Name varchar(max)  ='" + entry.Name+"'");
                sqlquery.Append("  declare @desc varchar(max)  ='" + entry.Description + "'");
                sqlquery.Append("   ");
                sqlquery.Append("  if(@RoleId = 0) ");
                sqlquery.Append("  BEGIN ");
                sqlquery.Append("  select @RoleId=max(Id)+1 from HIS.HISGLOBAL.ACCESS_ROLES ");
                sqlquery.Append("  insert into HIS.HISGLOBAL.ACCESS_ROLES (RoleID,Name,Description,Startdatetime,Deleted,OperatorID) ");
                sqlquery.Append("  select @RoleId,@Name,@desc,Getdate(),@deleted,@operatorId ");
                sqlquery.Append("  END ");
                sqlquery.Append("  ELSE ");
                sqlquery.Append("  BEGIN ");
                sqlquery.Append("   ");
                sqlquery.Append("  UPDATE HIS.HISGLOBAL.ACCESS_ROLES  ");
                sqlquery.Append("  set Name=  @Name,Description = @desc,Startdatetime = GETDATE(),Deleted = @deleted ");
                sqlquery.Append("  where RoleID = @RoleId ");
                sqlquery.Append("   ");
                sqlquery.Append("  END ");


                sql.Append("   ");
                sql.Append("  DECLARE @ErrorMessage as NVARCHAR(max) ");
                sql.Append("  DECLARE @ERROR_SEVERITY AS INT  ");
                sql.Append("  DECLARE @ERROR_STATE AS INT ");
                sql.Append("   ");
                sql.Append("  BEGIN TRY ");
                sql.Append("       ");
                sql.Append("  BEGIN TRAN ");
                sql.Append("   ");
                sql.Append("   ");
                sql.Append("   ");
                sql.Append("   " + sqlquery.ToString());
                sql.Append("   ");
                sql.Append("  COMMIT TRAN ");
                sql.Append("   ");
                sql.Append("  SET	@ErrorMessage = '100-Updated Successfully.'		 ");
                sql.Append("  SET @ERROR_STATE = 0		   ");
                sql.Append("  SELECT @ErrorMessage as Message, @ERROR_STATE as Error   ");
                sql.Append("  return ");
                sql.Append("    ");
                sql.Append("  END TRY ");
                sql.Append("  BEGIN CATCH                 ");
                sql.Append("  SET	@ErrorMessage = N'There was an error: Ln: ' + cast(ERROR_LINE() as nvarchar(2048)) + N' Message: ' + ERROR_MESSAGE();		 ");
                sql.Append("  SET @ERROR_STATE = 1		 ");
                sql.Append("  SELECT @ErrorMessage as Message, @ERROR_STATE as Error   ");
                sql.Append("  return ");
                sql.Append("  END CATCH;   ");

                List<SqlMessage> dt = db.ExecuteSQLAndReturnDataTable(sql.ToString()).DataTableToList<SqlMessage>();
                if (dt.Count > 0)
                {
                    this.ErrorMessage = dt[0].Message;
                    if (dt[0].Error == "1")
                    {
                        return false;
                    }
                }

                return true;

            }
            catch (Exception x)
            {
                this.ErrorMessage = x.Message;
                return false;
            }
        }


    }

    public class RolesData
    {
        public string RoleId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Startdatetime { get; set; }

    }

    public class GetFeatureByRole
    {
        public string RoleId { get; set; }
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


}
