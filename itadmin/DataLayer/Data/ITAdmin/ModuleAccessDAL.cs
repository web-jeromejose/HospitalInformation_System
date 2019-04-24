using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Data;
using DataLayer.Common;
using System.Text.RegularExpressions;

namespace DataLayer
{
    public class ModuleAccessDAL
    {
        DBHelper DB = new DBHelper("GIA");
        ExceptionLogging eLOG = new ExceptionLogging();

        public string ID { get; set; }
        public List<ListModel> GetEmplist()
        {
            try
            {
                DB.param = new SqlParameter[]{
                new SqlParameter("ID", ID)
                };
                return DB.ExecuteSPAndReturnDataTable("HISGLOBAL.EMPLOYEE_LIST").DataTableToList<ListModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public List<ModuleModel> GetModulesDAL()
        {
            try
            {
                return DB.ExecuteSQLAndReturnDataTableLive(" select moduleid as id,modulename as text,id as name, * from hisglobal.HIS_MODULES ").DataTableToList<ModuleModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public string UpdateModuleDAL(string id, string name, string slink, string src, string incvname, string vname, string del)
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Clear();
                if (incvname == "True")
                    incvname = "1";
                else
                    incvname = "0";

                if (del == "True")
                    del = "1";
                else
                    del = "0";

                sql.Append(" update his.HISGLOBAL.HIS_MODULES set deleted='" + del + "', ModuleName = '" + name + "', URLLink ='" + slink + "', ImgSrc='" + src + "', VirtualPoolName='" + vname + "', IncludeVPoolName = '" + incvname + "'  where ModuleID = " + id);
                DB.ExecuteSQLLive(sql.ToString());
                return "Done";
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public List<MenuAccessModel> GetMenuDAL()
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Append(" select b.*,c.Name as ParentName from  HISGLOBAL.ACCESS_MODULEFEATURES a ");
                sql.Append(" inner join HISGLOBAL.MENU_ACCESS b on a.FeatureId = b.FeatureID ");
                sql.Append("  left join HISGlobal.MENU_PARENT c on b.ParentID = c.ID   ");
                sql.Append("  ");
                sql.Append("  ");
                sql.Append(" where ModuleId = " + ID);
                return DB.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<MenuAccessModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public List<ListModel> GetMenuSearchDAL()
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Append(" select FeatureID as id,Name + ' - ' + MenuURL as text,MenuURL as name from HISGLOBAL.MENU_ACCESS ");
                sql.Append(" where name like '%" + ID + "%'  ");

                return DB.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<ListModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public List<ListModel> GetModuleAccessDAL()
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Append(" select a.ModuleID as id,a.ModuleName as text,'' as name from hisglobal.HIS_MODULES a ");
                sql.Append(" left join HISGLOBAL.ACCESS_MODULEFEATURES b on a.ModuleID = b.ModuleId ");
                sql.Append(" left join HISGLOBAL.MENU_ACCESS c on b.FeatureId = c.FeatureID ");
                sql.Append(" inner join hisglobal.ACCESS_USERFEATURES d on a.ModuleID = d.Module_Id and b.FeatureId = d.Feature_Id  and USERID = '" + ID + "'  ");
                sql.Append(" left join HISGLOBAL.MENU_PARENT e on c.ParentID = e.MenuID");
                sql.Append(" where  a.Deleted = 0 and b.Deleted = 0 and c.Deleted = 0 group by a.ModuleID,a.ModuleName ");

                return DB.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<ListModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public List<ModuleAccessModel> GetModuleAccessFeatureDAL(string mod)
        {
            try
            {
                var TmppDATETIMEMILISECS = "#tmpMultipleFeatureIdPerModule" + DateTime.Now.Minute + "_" + DateTime.Now.Millisecond;
                StringBuilder sql = new StringBuilder();
                //check multiple entrey in userfeatures table
                sql.Append("  declare @Id int,@featureId int ,@tableId int,@moduleId int,@UserId int ");
                sql.Append(" set @moduleId = " + mod + " ");
                sql.Append(" set @UserId =  '" + ID + "'  ");
                sql.Append(" select  IDENTITY(INT, 1,1) as TableID,feature_Id,Module_Id  into " + TmppDATETIMEMILISECS + " from  HISGLOBAL.ACCESS_USERFEATURES   where USERID = @UserId and Module_Id = @moduleId group by feature_Id,Module_Id having count(Feature_Id) > 1  ");
                sql.Append(" While Exists(select * from " + TmppDATETIMEMILISECS + "  ) ");
                sql.Append(" begin ");
                sql.Append(" select   @tableId =  TableId,@featureId = feature_Id from " + TmppDATETIMEMILISECS + "  ");
                sql.Append(" select  @Id = Id from HISGLOBAL.ACCESS_USERFEATURES  where Feature_Id = @featureId and USERID = @UserId  order by ID asc ");
                sql.Append(" delete from   HISGLOBAL.ACCESS_USERFEATURES   where Id <> @Id and Feature_Id = @featureId  ");
                sql.Append(" delete from " + TmppDATETIMEMILISECS + "  where TableId = @tableId ");
                sql.Append(" end ");
                sql.Append("  drop table " + TmppDATETIMEMILISECS + "  ");

                //check multiple entrey in ACCESS_MODULEFEATURES table
                var TmpTableModFeat = "#duplicateFeatIdTemp" + DateTime.Now.Minute + "_" + DateTime.Now.Millisecond;

                sql.Append("  declare @ID_new int,@feature_Id int ,@table_Id int,@module_Id int  ");
                sql.Append("  set @module_Id =  " + mod + "  ");
                sql.Append("  select IDENTITY(INT, 1,1) as TableID,featureId,ModuleId into " + TmpTableModFeat + " from  HISGLOBAL.ACCESS_MODULEFEATURES   ");
                sql.Append("  where   ModuleId = @module_Id  group by featureId,ModuleId having count(FeatureId) > 1  ");
                sql.Append("  While Exists(select * from " + TmpTableModFeat + "  ) ");
                sql.Append("  begin ");
                sql.Append("  select   @table_Id =  TableId,@feature_Id = featureId from " + TmpTableModFeat + "  ");
                sql.Append("  select  @ID_new = Id from HISGLOBAL.ACCESS_MODULEFEATURES  where FeatureId = @feature_Id order by ID asc ");
                sql.Append("  delete from HISGLOBAL.ACCESS_MODULEFEATURES  where FeatureId =  @feature_Id and ID <>  @ID_new  ");
                sql.Append("  delete from " + TmpTableModFeat + "  where TableId = @table_Id ");
                sql.Append("  end ");
                sql.Append("  drop table " + TmpTableModFeat + "  ");

                sql.Append(" select isnull(d.id,0) as FID, a.ModuleID,a.ModuleName,a.URLLink,e.Name as ParentName,e.SequenceNo as ParentSeq,c.FeatureID as FeatureID, c.name as FeatureName,c.SequenceNo as FeatureSequence,case when isnull(d.Feature_Id,0) = 0 or d.Deleted = 1   then 0 else 1 end  as HasAccess  from hisglobal.HIS_MODULES a ");
                sql.Append(" left join HISGLOBAL.ACCESS_MODULEFEATURES b on a.ModuleID = b.ModuleId ");
                sql.Append(" left join HISGLOBAL.MENU_ACCESS c on b.FeatureId = c.FeatureID ");
                sql.Append(" left join hisglobal.ACCESS_USERFEATURES d on a.ModuleID = d.Module_Id and b.FeatureId = d.Feature_Id and USERID = '" + ID + "'  ");
                sql.Append(" left join HISGLOBAL.MENU_PARENT e on c.ParentID = e.MenuID ");
                sql.Append(" where a.ModuleID =" + mod + " and  a.Deleted = 0 and b.Deleted = 0 and c.Deleted = 0 ");

                return DB.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<ModuleAccessModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public List<ModuleUserModel> GetModuleUserAccessDAL()
        {
            try
            {
                DB.param = new SqlParameter[]{
                new SqlParameter("id", ID)
                };
                return DB.ExecuteSPAndReturnDataTable("ITADMIN.ModuleAccess_GetUser").DataTableToList<ModuleUserModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public string UpdateUserModuleDAL(string id, string moduleid)
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Clear();
                sql.Append(" delete from HISGLOBAL.ACCESS_USERFEATURES where UserID = '" + id + "' and Module_Id=" + moduleid + " ");
                sql.Append(" insert into HISGLOBAL.ACCESS_USERFEATURES (USERID,Module_Id,Feature_Id,Deleted,Station_Id) ");
                sql.Append(" select '" + id + "',ModuleId,FeatureId,'True',0 from HISGLOBAL.ACCESS_MODULEFEATURES where  deleted = 0 and ModuleId = " + moduleid);
                DB.ExecuteSQLLive(sql.ToString());

                //if (moduleid == "103") //new inventory
                //{
                //    sql.Clear();
                //    sql.Append("  exec [ITADMIN].[Sync_MMS_ROLES] '" + id + "'"); //userID 
                //    DB.ExecuteSQLLive(sql.ToString());
                //}

                return "Done";
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public string UpdateUserFeatureDAL(string id, string acc, string feat, string mod, string usr)
        {                       //UpdateUserFeature?id=0&acc=0&feat=2277&mod=36&usr=&_=1478423174506
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Clear();
                if (id == "0")
                {
                    sql.Append(" insert into HISGLOBAL.ACCESS_USERFEATURES (USERID,Module_Id,Feature_Id,Deleted,Station_Id,StartDateTime) ");
                    sql.Append(" select " + usr + "," + mod + "," + feat + ",0,0,GETDATE() ");
                }
                else
                {
                    if (acc == "0")
                    {
                        sql.Append(" update HISGLOBAL.ACCESS_USERFEATURES set Deleted = " + acc + ",StartDateTime = GETDATE(),EndDateTime = null where ID = " + id);
                    }
                    else
                    {
                        sql.Append(" update HISGLOBAL.ACCESS_USERFEATURES set Deleted = " + acc + ",EndDateTime = GETDATE() where ID = " + id);
                    }

                }
                DB.ExecuteSQLLive(sql.ToString());
                return "Done";
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public string DeleteUserModuleDAL(string id, string mod)
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Clear();
                sql.Append(" delete from HISGLOBAL.ACCESS_USERFEATURES where USERID = " + id + " and module_id = " + mod);
                sql.Append(" delete from l_userroles where  USER_ID = " + id + " and Role_id in (SELECT ROLE_ID FROM L_ROLEFEATURES WHERE MODULE_ID =" + mod + " GROUP BY ROLE_ID)   ");

                DB.ExecuteSQLLive(sql.ToString());
                return "Deleted";
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public string AddModuleFeature(string mod, string feat)
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Clear();
                sql.Append(" insert into HIS.HISGLOBAL.ACCESS_MODULEFEATURES (Moduleid,FeatureId,Deleted) select " + mod + "," + feat + ",0 ");
                DB.ExecuteSQLLive(sql.ToString());
                return "Done";
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public void UpdateMenuDAL(string id, string parent, string menu, string seq, string name, string bar, string newwindow, string del, string ModuleId)
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Clear();
                if (bar == "True")
                    bar = "1";
                else
                    bar = "0";
                if (newwindow == "True")
                    newwindow = "1";
                else
                    newwindow = "0";
                if (parent == "")
                    parent = "0";
                if (seq == "")
                    seq = "0";
                if (del == "True")
                    del = "1";
                else
                    del = "0";

                sql.Append(" update HIS.HISGLOBAL.MENU_ACCESS  set name='" + name + "', ParentID = " + parent + ", MenuURL ='" + menu + "', SequenceNo =" + seq + ",Bar=" + bar + ", NewWindow=" + newwindow + " ,deleted=" + del + " where FeatureId = " + id);
                DB.ExecuteSQLLive(sql.ToString());

                sql.Clear();
                sql.Append(" update HIS.HISGLOBAL.ACCESS_MODULEFEATURES  set deleted=" + del + " where FeatureId = " + id + " AND ModuleId = " + ModuleId);
                DB.ExecuteSQLLive(sql.ToString());
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public void NewModMenuDAL(string mod, string name, string menuUrl, string ParentID)
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Clear();
                sql.Append(" insert into hisglobal.MENU_ACCESS (Name,MenuURL,Deleted,ParentID,SequenceNo,Bar,NewWindow) select '" + name + "' as Name,'" + menuUrl + "' as MenuURL,0 Deleted," + ParentID + " as ParentID,30,0,0  update hisglobal.MENU_ACCESS set FeatureID = SCOPE_IDENTITY()  where id = SCOPE_IDENTITY()  select SCOPE_IDENTITY() as ID  ");
                DataTable dt = DB.ExecuteSQLAndReturnDataTableLive(sql.ToString());
                string feat = dt.Rows[0][0].ToString();
                sql.Clear();
                sql.Append(" insert into hisglobal.ACCESS_MODULEFEATURES (ModuleID,FeatureID,deleted) select " + mod + "," + feat + ",0 ");
                DB.ExecuteSQLLive(sql.ToString());
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public void DeleteModMenuDAL(string mod, string feat)
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Clear();

                sql.Append(" DELETE from HISGLOBAL.ACCESS_MODULEFEATURES WHERE ModuleId = " + mod + " AND FeatureId = " + feat);
                DB.ExecuteSQLLive(sql.ToString());
                sql.Clear();
                sql.Append(" DELETE from HISGLOBAL.ACCESS_USERFEATURES WHERE Module_Id = " + mod + " AND Feature_Id =  " + feat);
                DB.ExecuteSQLLive(sql.ToString());
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        /*Menu Functions*/
        public List<ListModel> GetAllFeatureFunctionDAL()
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Append("  select FunctionID as id,cast(FunctionID as nvarchar(2048)) + '-' + name as text,name as name from HISGLOBAL.MENU_FUNCTIONS where Deleted = 0 and name is not null and name <> '' order by id desc    ");
                return DB.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<ListModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public List<ListModel> GetFeatureFunctionDAL()
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Append(" select b.FunctionID as id,b.name as text,a.FeatureId as name from HISGLOBAL.ACCESS_FEATUREFUNCTIONS a ");
                sql.Append(" left join HISGLOBAL.MENU_FUNCTIONS b on a.FunctionID = b.Id where FeatureId = " + ID + " and a.Deleted =0 and b.deleted = 0");
                return DB.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<ListModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public string AddNewFeatureFunctionDAL(string name)
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Clear();
                sql.Append(" insert into HISGLOBAL.MENU_FUNCTIONS (Name,Deleted,OperatorID) select '" + name + "',0,0 ");
                sql.Append("  update HISGLOBAL.MENU_FUNCTIONS set FunctionID = CAST(scope_identity() AS int) where id =   CAST(scope_identity() AS int) ");
                DB.ExecuteSQLLive(sql.ToString());
                return "New Function Added!";
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public string AddFeatureFunction(string del, string feat)
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Clear();
                if (del == "0")
                {
                    sql.Append(" if not exists(select * from HISGLOBAL.ACCESS_FEATUREFUNCTIONS where FunctionID = " + ID + "  and FeatureId = " + feat + ") ");
                    sql.Append(" begin insert into HISGLOBAL.ACCESS_FEATUREFUNCTIONS (FeatureId,FunctionID,Deleted) select " + feat + "," + ID + ",0  end");
                    sql.Append(" else begin update HISGLOBAL.ACCESS_FEATUREFUNCTIONS set Deleted = 0 where FeatureId= " + feat + " and FunctionID = " + ID + "   end");

                    DB.ExecuteSQLLive(sql.ToString());
                    return "Function Added!";
                }
                else
                {
                    sql.Append(" update HISGLOBAL.ACCESS_FEATUREFUNCTIONS set Deleted = 1 where FunctionID = " + ID + "  and FeatureId = " + feat);
                    DB.ExecuteSQLLive(sql.ToString());
                    return "Function Deleted!";
                }
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public string UpdateUserFunctionDAL(string id, string usr, string mod, string feat, string func, string del)
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                if (del == "1")
                {
                    sql.Append(" update HISGLOBAL.ACCESS_USERFUNCTION set deleted = 1 where id= " + id);
                    DB.ExecuteSQL(sql.ToString());
                    return "Function Added";
                }
                else
                {
                    if (id == "0")
                    {
                        sql.Append(" insert into [HISGLOBAL].ACCESS_USERFUNCTION (USERID,ModuleId,FeatureId,FunctionID,Deleted ) select " + usr + "," + mod + "," + feat + "," + func + ",0 ");
                        DB.ExecuteSQLLive(sql.ToString());
                        return "Function Added";
                    }
                    else
                    {
                        sql.Append(" update HISGLOBAL.ACCESS_USERFUNCTION set deleted = 0 where id= " + id);
                        DB.ExecuteSQLLive(sql.ToString());
                        return "Function Updated";
                    }
                }

            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public List<FunctionUserModel> GetUserFeatureFunctionDAL(string id, string feat)
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Clear();
                sql.Append(" select c.FunctionID as id,c.name as text,isnull(b.ID,0) as name, case when isnull(b.deleted,1) = 1 then 'No' else 'Yes' end as HasAccess from HISGLOBAL.ACCESS_FEATUREFUNCTIONS  a ");
                sql.Append(" left join [HISGLOBAL].ACCESS_USERFUNCTION b on a.FeatureId = b.FeatureId and a.FunctionID = b.FunctionID and b.USERID = " + id);
                sql.Append(" left join HISGLOBAL.MENU_FUNCTIONS c on a.FunctionID = c.FunctionID ");
                sql.Append(" where a.FeatureId = " + feat);
                return DB.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<FunctionUserModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }


        public List<ListModel> GetStationDAL()
        {
            try
            {
                StringBuilder sql = new StringBuilder();

                sql.Append(" select id,name text,Code as name from station where id in (SELECT STATIONID FROM his.dbo.BED) order by name ");
                return DB.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<ListModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        /*Menu Parent*/
        public List<ListModel> GetParentDAL()
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Append(" select menuid as id,Name as text, SequenceNo as name from hisglobal.MENU_PARENT ");
                return DB.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<ListModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public string AddNewParent(string name)
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Clear();
                sql.Append("   declare @maxMenuId int    ");
                sql.Append("  select @maxMenuId = max(MenuId) + 1 from hisglobal.menu_parent   ");
                sql.Append("  insert into HISGLOBAL.menu_parent (Name,MenuLevel,SequenceNo) select '" + name + "',0,99  ");
                sql.Append("  update hisglobal.menu_parent set menuid = @maxMenuId where id = SCOPE_IDENTITY()      ");
                DB.ExecuteSQLLive(sql.ToString());
                return "New Parent Added!";
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }


        public string AddNewFunction(string name)
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Clear();
                sql.Append("   declare @maxMenuId int    ");
                sql.Append("  select @maxMenuId =  max(FunctionID) + 1 from HISGLOBAL.MENU_FUNCTIONS  ");
                sql.Append("  insert into HISGLOBAL.MENU_FUNCTIONS (Name,StartDateTime,Deleted,OperatorID)  select '" + name + "',GETDATE(),0,1     ");
                sql.Append(" update hisglobal.MENU_FUNCTIONS  set FunctionID = @maxMenuId where id = SCOPE_IDENTITY()       ");
                DB.ExecuteSQLLive(sql.ToString());
                return "New Function Added!";
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        /*Synchronize*/
        public void SynchModulesDAL(string id, string cons)
        {
            try
            {
                BranchDBHelper dbb = new BranchDBHelper();
                StringBuilder sql = new StringBuilder();
                List<ModuleModel> module = DB.ExecuteSQLAndReturnDataTableLive(" select moduleid as id,modulename as text,id as name, * from hisglobal.HIS_MODULES ").DataTableToList<ModuleModel>();
                foreach (var i in module)
                {
                    sql.Clear();
                    sql.Append(" if not exists(select * from HISGLOBAL.HIS_MODULES where ModuleID = " + i.ModuleID + ") begin ");
                    sql.Append(" insert into HISGLOBAL.HIS_MODULES (ModuleID,ModuleName,URLLink,ImgSrc,StationSpecific,TPwdRequired,Deleted,VirtualPoolName,IncludeVPoolName) ");
                    sql.Append(" select " + i.ModuleID + ",'" + i.ModuleName + "','','" + i.ImgSrc + "','N','N',0,'" + i.VirtualPoolName + "','" + i.IncludeVPoolName + "' end");
                    sql.Append(" else begin update HISGLOBAL.HIS_MODULES set ModuleName='" + i.ModuleName + "',ImgSrc='" + i.ImgSrc + "',StationSpecific='" + i.StationSpecific + "',TPwdRequired='" + i.TPwdRequired + "',Deleted='" + i.Deleted + "',VirtualPoolName='" + i.VirtualPoolName + "', ");
                    sql.Append(" IncludeVPoolName='" + i.IncludeVPoolName + "',AreaName='" + i.AreaName + "', URLLink='" + i.URLLink + "' where ModuleID = " + i.ModuleID + " end ");
                    //dbb.ExecuteSQL(sql.ToString(), cons);
                }
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public void SynchFeaturesDAL(string id, string cons)
        {
            try
            {
                BranchDBHelper dbb = new BranchDBHelper();

                StringBuilder sql = new StringBuilder();
                sql.Append(" select '' as ParentName,FeatureID,Name,MenuURL,Deleted,isnull(ParentID,0) as ParentID,isnull(SequenceNo,0) as SequenceNo,isnull(Bar,0)as Bar,isnull(NewWindow,0) as NewWindow,Id,StartDateTime,EndDateTime,OperatorID from  HISGLOBAL.MENU_ACCESS where FeatureID in (select FeatureId from HISGLOBAL.ACCESS_MODULEFEATURES where ModuleId = " + id + ")  "); //and NewWindow <> 1 
                List<MenuAccessModel> feat = DB.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<MenuAccessModel>();

                foreach (var i in feat)
                {
                    var deleted = 0;
                    if (i.Deleted == "True")
                    {
                        deleted = 1;
                    }

                    sql.Clear();
                    sql.Append(" delete from HISGLOBAL.MENU_ACCESS where FeatureID = " + i.FeatureID);
                    sql.Append(" insert into hisglobal.MENU_ACCESS (FeatureID,Name,MenuURL,Deleted,ParentID,SequenceNo,Bar,NewWindow) select " + i.FeatureID + ", '" + i.Name.Replace("'", "`") + "' as Name,'" + i.MenuURL + "' as MenuURL," + deleted + "," + i.ParentID + " ," + i.SequenceNo + " ,'" + i.Bar + "' ,'" + i.NewWindow + "' ");
                    eLOG.LogDetail(">>>>2. SynchFeaturesDAL-->" + sql.ToString());
                    dbb.ExecuteSQL(sql.ToString(), cons);


                    //start get the menu function for each feature ID 
                    sql.Clear();
                    sql.Append(" select FunctionID,Name from HISGLOBAL.MENU_FUNCTIONS where FunctionID in ( select FunctionID from HISGLOBAL.ACCESS_FEATUREFUNCTIONS where FeatureId = " + i.FeatureID + ")  ");
                    List<MenuFunctionPerFeatureIdModel> menufunction = DB.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<MenuFunctionPerFeatureIdModel>();

                    foreach (var a in menufunction)
                    {
                        sql.Clear();
                        //sql.Append(" if not exists(select * from HISGLOBAL.MENU_FUNCTIONS where FunctionID = " + a.FunctionID + " and deleted = 0) begin ");
                        sql.Append(" delete from HISGLOBAL.MENU_FUNCTIONS where FunctionID = " + a.FunctionID);
                        sql.Append(" insert into HISGLOBAL.MENU_FUNCTIONS (FunctionID,Name,StartDateTime,Deleted) VALUES ('" + a.FunctionID + "','" + a.Name + "',getdate(),0)  ");
                        // sql.Append(" END ");
                        eLOG.LogDetail(">>>>3. SynchFeaturesDAL-->" + sql.ToString());
                        dbb.ExecuteSQL(sql.ToString(), cons);

                    }
                    //end get the menu function for each feature ID 



                }

                sql.Clear();
                sql.Append(" select * from  hisglobal.MENU_PARENT ");
                List<MenuParent> parents = DB.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<MenuParent>();

                foreach (var i in parents)
                {
                    sql.Clear();
                    sql.Append(" if not exists(select * from HISGLOBAL.MENU_PARENT where MenuID = " + i.MenuID + ") begin ");
                    sql.Append(" insert into hisglobal.MENU_PARENT (MenuID,Name,MenuLevel,SequenceNo) select " + i.MenuID + ",'" + i.Name + "','" + i.MenuLevel + "','" + i.SequenceNo + "'  end ");
                    sql.Append(" else begin update hisglobal.MENU_PARENT set Name='" + i.Name + "',MenuLevel = '" + i.MenuLevel + "',SequenceNo = '" + i.SequenceNo + "' where MenuID=" + i.MenuID + " end");
                    eLOG.LogDetail(">>>>4. SynchFeaturesDAL-->" + sql.ToString());
                    dbb.ExecuteSQL(sql.ToString(), cons);
                }

            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public void SynchModFeaturesDAL(string id, string cons)
        {
            try
            {
                BranchDBHelper dbb = new BranchDBHelper();
                StringBuilder sql = new StringBuilder();
                sql.Append(" select ModuleId,FeatureId from his.HISGLOBAL.ACCESS_MODULEFEATURES where ModuleId = " + id);
                DataTable dt = DB.ExecuteSQLAndReturnDataTableLive(sql.ToString());
                DataTable dtRet = new DataTable();
                dtRet.Columns.AddRange(new[] {
                    new DataColumn("ModuleId", typeof(int)),
                    new DataColumn("FeatureId", typeof(int))
                });

                foreach (DataRow i in dt.Rows)
                {
                    DataRow newRow = dtRet.NewRow();
                    newRow["ModuleId"] = i["ModuleId"].ToString();
                    newRow["FeatureId"] = i["FeatureId"].ToString();
                    dtRet.Rows.Add(newRow);
                }

                System.IO.StringWriter sw = new System.IO.StringWriter();
                dtRet.TableName = "Data";
                dtRet.WriteXml(sw);
                dbb.param = new SqlParameter[]{
                new SqlParameter("@Mod", "2"),
                new SqlParameter("@XML", sw.ToString())
                };
                eLOG.LogDetail(">>>>5. ITADMIN.MENUSYNC SP ito  MOd=2 , @XML-->" + sw.ToString());
                dbb.ExecuteSP("ITADMIN.MENUSYNC", cons);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }


        public void SynchParentMenu(string id, string cons)
        {
            try
            {
                BranchDBHelper dbb = new BranchDBHelper();

                StringBuilder sql = new StringBuilder();
                //create back up  MENU_PARENT_OLD TABLE
                sql.Append(" if exists( SELECT * FROM sys.tables where name = 'MENU_PARENT_OLD' ) begin insert into [HISGLOBAL].[MENU_PARENT_OLD] (MenuID,Name,MenuLevel,SequenceNo,DateCreated) select MenuID,Name,MenuLevel,SequenceNo,GETDATE() from hisglobal.MENU_PARENT end  ");
                sql.Append(" else begin CREATE TABLE [HISGLOBAL].[MENU_PARENT_OLD]( [Id] [int] IDENTITY(1,1) NOT NULL, [MenuID] [int] NULL, [Name] [varchar](100) NOT NULL, [MenuLevel] [int] NULL, [SequenceNo] [int] NULL, [DateCreated] [datetime] NULL ) ON [MasterFile]   ");
                sql.Append("  insert into [HISGLOBAL].[MENU_PARENT_OLD] (MenuID,Name,MenuLevel,SequenceNo,DateCreated) select MenuID,Name,MenuLevel,SequenceNo,GETDATE() from hisglobal.MENU_PARENT end  ");
                dbb.ExecuteSQL(sql.ToString(), cons);

                //drop table  and create new table  MENU_PARENT 
                sql.Clear();
                sql.Append(" DROP TABLE [HISGLOBAL].[MENU_PARENT] CREATE TABLE [HISGLOBAL].[MENU_PARENT]( [Id] [int] IDENTITY(1,1) NOT NULL, [MenuID] [int] NULL, [Name] [varchar](100) NOT NULL, [MenuLevel] [int] NULL, [SequenceNo] [int] NULL ) ON [MasterFile]  ");
                eLOG.LogDetail(">>>>7. SynchParentMenu-->" + sql.ToString());
                dbb.ExecuteSQL(sql.ToString(), cons);

                sql.Clear();
                sql.Append(" select * from  hisglobal.MENU_PARENT ");
                List<MenuParent> parents = DB.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<MenuParent>();

                foreach (var i in parents)
                {
                    sql.Clear();
                    sql.Append(" insert into hisglobal.MENU_PARENT (MenuID,Name,MenuLevel,SequenceNo) select " + i.MenuID + ",'" + i.Name + "','" + i.MenuLevel + "','" + i.SequenceNo + "'   ");
                    eLOG.LogDetail(">>>>8. SynchParentMenu-->" + sql.ToString());
                    dbb.ExecuteSQL(sql.ToString(), cons);
                }

            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public List<ListModel> GetParentList()
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Append("select MenuId as id,cast(MenuId as varchar(max)) + '-' + name as text,cast(MenuId as varchar(max)) + '-' + name as  name from HISGLOBAL.menu_parent order by MenuId desc ");
                return DB.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<ListModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public List<ListModel> GetFunctionList()
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Append(@"select FunctionID as id
                            ,cast(FunctionId as varchar) +'-'+ cast(Name as varchar)  as text
                            ,cast(FunctionId as varchar) +'-'+ cast(Name as varchar)  as name
                            from HISGLOBAL.MENU_FUNCTIONS a
                             where  a.Deleted = 0 order by a.StartDateTime desc
                            ");
                return DB.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<ListModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public List<ListModel> GetModuleStationDAL(string id, string idd)
        {
            try
            {
                DB.param = new SqlParameter[]{
                new SqlParameter("MODULEID", idd),
                new SqlParameter("USERID", id)
                };
                return DB.ExecuteSPAndReturnDataTable("HISGLOBAL.EMPLOYEE_STATION").DataTableToList<ListModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public string InsertModuleStationDAL(string id, string idd, string stationid, string del)
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                string s;
                if (del == "0" || del == null || del == "")
                {

                    sql.Append(" delete HISGLOBAL.ACCESS_USER_STATION where User_Id ='" + id + "' and ModuleID ='" + idd + "' and StationID = '" + stationid + "' ");
                    sql.Append(" insert into HISGLOBAL.ACCESS_USER_STATION (User_Id,ModuleID,StationID) ");
                    sql.Append(" select " + id + "," + idd + "," + stationid);

                    sql.Append(" delete from DATAINFO.dbo.ModulePermission where ModuleId = '" + idd + "' and StationId =  '" + stationid + "'   ");
                    sql.Append(" insert into DATAINFO.dbo.ModulePermission (ModuleId,SystemName,StationId,ModifiedDateTime,ModifiedBy,TPWDREQUIRED) ");
                    sql.Append(" values  (" + idd + ", ' '," + stationid + " ,GETDATE() ,0,'N')  ");

                    s = "Done Adding Station";
                }
                else
                {
                    sql.Append(" delete HISGLOBAL.ACCESS_USER_STATION where User_Id ='" + id + "' and ModuleID ='" + idd + "' and StationID = '" + stationid + "' ");
                    sql.Append(" delete from DATAINFO.dbo.ModulePermission where ModuleId = '" + idd + "' and StationId =  '" + stationid + "'   ");

                    s = "Done Removing Station";
                }
                DB.ExecuteSQLAndReturnDataTable(sql.ToString());
                return s;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public string InserttoDataInfoModulePermission(string idd, string stationid, string del)
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                string s;
                if (del == "0" || del == null || del == "")
                {


                    sql.Append(" delete from DATAINFO.dbo.ModulePermission where ModuleId = '" + idd + "' and StationId =  '" + stationid + "'   ");
                    sql.Append(" insert into DATAINFO.dbo.ModulePermission (ModuleId,SystemName,StationId,ModifiedDateTime,ModifiedBy,TPWDREQUIRED) ");
                    sql.Append(" values  (" + idd + ", ' '," + stationid + " ,GETDATE() ,0,'N')  ");

                    s = "Done Adding Station -Datainfo";
                }
                else
                {
                    sql.Append(" delete from DATAINFO.dbo.ModulePermission where ModuleId = '" + idd + "' and StationId =  '" + stationid + "'   ");

                    s = "Done Removing Station-Datainfo";
                }
                DB.ExecuteSQLAndReturnDataTable(sql.ToString());
                return s;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }


        public void SynchFeatFuncDAL(string id, string cons)
        {
            try
            {
                BranchDBHelper dbb = new BranchDBHelper();
                StringBuilder sql = new StringBuilder();
                sql.Append(" select distinct FeatureId,FunctionID from his.HISGLOBAL.ACCESS_FEATUREFUNCTIONS where FeatureId in (select FeatureId from his.HISGLOBAL.ACCESS_MODULEFEATURES where ModuleId = " + id + " and Deleted = 0) ");
                DataTable dt = DB.ExecuteSQLAndReturnDataTableLive(sql.ToString());

                DataTable dtRet = new DataTable();
                dtRet.Columns.AddRange(new[] {
                    new DataColumn("FeatureId", typeof(int)),
                    new DataColumn("FunctionID", typeof(int))
                });

                foreach (DataRow i in dt.Rows)
                {
                    DataRow newRow = dtRet.NewRow();
                    newRow["FeatureId"] = i["FeatureId"].ToString();
                    newRow["FunctionID"] = i["FunctionID"].ToString();
                    dtRet.Rows.Add(newRow);
                }

                System.IO.StringWriter sw = new System.IO.StringWriter();
                dtRet.TableName = "Data";
                dtRet.WriteXml(sw);
                dbb.param = new SqlParameter[]{
                new SqlParameter("@Mod", "3"),
                new SqlParameter("@XML", sw.ToString())
                };
                eLOG.LogDetail(">>>>6. ITADMIN.MENUSYNC @mod=3 @XML -->" + sw.ToString());
                dbb.ExecuteSP("ITADMIN.MENUSYNC", cons);

            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public void SynchParentFuncDAL()
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Append(" select MenuID,Name,MenuLevel,SequenceNo from hisglobal.MENU_PARENT order by MenuID ");
                DataTable dt = DB.ExecuteSQLAndReturnDataTableLive(sql.ToString());

                DataTable dtRet = new DataTable();
                dtRet.Columns.AddRange(new[] {
                    new DataColumn("MenuID", typeof(int)),
                    new DataColumn("Name", typeof(string)),
                    new DataColumn("MenuLevel", typeof(int)),
                    new DataColumn("SequenceNo", typeof(int))
                });

                foreach (DataRow i in dt.Rows)
                {
                    DataRow newRow = dtRet.NewRow();
                    newRow["MenuID"] = i["MenuID"].ToString();
                    newRow["Name"] = i["Name"].ToString();
                    newRow["MenuLevel"] = i["MenuLevel"].ToString();
                    newRow["SequenceNo"] = i["SequenceNo"].ToString();
                    dtRet.Rows.Add(newRow);
                }

                System.IO.StringWriter sw = new System.IO.StringWriter();
                dtRet.TableName = "Data";
                dtRet.WriteXml(sw);
                DB.param = new SqlParameter[]{
                new SqlParameter("@Mod", "4"),
                new SqlParameter("@XML", sw.ToString())
                };
                DB.ExecuteSPCairo("ITADMIN.MENUSYNC");

            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public void SynchFuncDAL(string cons)
        {
            try
            {
                BranchDBHelper dbb = new BranchDBHelper();
                StringBuilder sql = new StringBuilder();
                sql.Append(" select Name,FunctionID,isnull(PasswordTrans,0) as PasswordTrans  from hisglobal.MENU_FUNCTIONS  ");
                DataTable dt = DB.ExecuteSQLAndReturnDataTableLive(sql.ToString());

                DataTable dtRet = new DataTable();
                dtRet.Columns.AddRange(new[] {
                    new DataColumn("FunctionID", typeof(int)),
                    new DataColumn("Name", typeof(string)),
                    new DataColumn("PasswordTrans", typeof(int))
                });

                foreach (DataRow i in dt.Rows)
                {
                    DataRow newRow = dtRet.NewRow();
                    newRow["FunctionID"] = i["FunctionID"].ToString();
                    newRow["Name"] = i["Name"].ToString();
                    newRow["PasswordTrans"] = i["PasswordTrans"].ToString();
                    dtRet.Rows.Add(newRow);
                }

                System.IO.StringWriter sw = new System.IO.StringWriter();
                dtRet.TableName = "Data";
                dtRet.WriteXml(sw);
                dbb.param = new SqlParameter[]{
                new SqlParameter("@Mod", "5"),
                new SqlParameter("@XML", sw.ToString())
                };
                dbb.ExecuteSP("ITADMIN.MENUSYNC");
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        /*TEST 90 Synchronize*/
        public void SynchModulesTestDAL()
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                List<ModuleModel> module = DB.ExecuteSQLAndReturnDataTableLive(" select moduleid as id,modulename as text,id as name, * from hisglobal.HIS_MODULES ").DataTableToList<ModuleModel>();
                foreach (var i in module)
                {
                    sql.Clear();
                    sql.Append(" if not exists(select * from HISGLOBAL.HIS_MODULES where ModuleID = " + i.ModuleID + ") begin ");
                    sql.Append(" insert into HISGLOBAL.HIS_MODULES (ModuleID,ModuleName,URLLink,ImgSrc,StationSpecific,TPwdRequired,Deleted,VirtualPoolName,IncludeVPoolName) ");
                    sql.Append(" select " + i.ModuleID + ",'" + i.ModuleName + "','','" + i.ImgSrc + "','N','N',0,'" + i.VirtualPoolName + "','" + i.IncludeVPoolName + "' end");
                    DB.ExecuteSQLTest(sql.ToString());
                }
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public void SynchFeaturesTestDAL()
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Append(" select FeatureID,Name,MenuURL,Deleted,isnull(ParentID,0) as ParentID,isnull(SequenceNo,0) as SequenceNo,isnull(Bar,0)as Bar,isnull(NewWindow,0) as NewWindow,Id,StartDateTime,EndDateTime,OperatorID from  HISGLOBAL.MENU_ACCESS where MenuURL like '%/%' ");
                List<MenuAccessModel> feat = DB.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<MenuAccessModel>();

                foreach (var i in feat)
                {
                    sql.Clear();
                    sql.Append(" if not exists(select * from HISGLOBAL.MENU_ACCESS where FeatureID = " + i.FeatureID + ") begin ");
                    sql.Append(" insert into hisglobal.MENU_ACCESS (FeatureID,Name,MenuURL,Deleted,ParentID,SequenceNo,Bar,NewWindow) select " + i.FeatureID + ", '" + i.Name.Replace("'", "`") + "' as Name,'" + i.MenuURL + "' as MenuURL,0 ," + i.ParentID + " ," + i.SequenceNo + " ,'" + i.Bar + "' ,'" + i.NewWindow + "'  end ");
                    sql.Append(" else begin update hisglobal.MENU_ACCESS set Name = '" + i.Name.Replace("'", "`") + "' ,MenuURL = '" + i.MenuURL + "' ,ParentID = " + i.ParentID + " ,SequenceNo = " + i.SequenceNo + ",Bar='" + i.Bar + "',NewWindow = '" + i.NewWindow + "' where  FeatureID = " + i.FeatureID + "  end");
                    DB.ExecuteSQLTest(sql.ToString());
                }
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public void SynchModFeaturesTestDAL()
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Append(" select ModuleId,FeatureId from HISGLOBAL.ACCESS_MODULEFEATURES where Deleted = 0 ");
                DataTable dt = DB.ExecuteSQLAndReturnDataTableLive(sql.ToString());

                DataTable dtRet = new DataTable();
                dtRet.Columns.AddRange(new[] {
                    new DataColumn("ModuleId", typeof(int)),
                    new DataColumn("FeatureId", typeof(int))
                });

                foreach (DataRow i in dt.Rows)
                {
                    DataRow newRow = dtRet.NewRow();
                    newRow["ModuleId"] = i[0].ToString();
                    newRow["FeatureId"] = i[1].ToString();
                    dtRet.Rows.Add(newRow);
                }

                System.IO.StringWriter sw = new System.IO.StringWriter();
                dtRet.TableName = "Data";
                dtRet.WriteXml(sw);
                DB.param = new SqlParameter[]{
                new SqlParameter("@Mod", "2"),
                new SqlParameter("@XML", sw.ToString())
                };
                DB.ExecuteSPTest("ITADMIN.MENUSYNC");
                //foreach (DataRow i in dt.Rows)
                //{
                //    sql.Clear();
                //    sql.Append(" if not exists(select * from HISGLOBAL.ACCESS_MODULEFEATURES where ModuleId = " + i[0].ToString() + " and FeatureID = " + i[1].ToString() + " ) begin ");
                //    sql.Append(" insert into hisglobal.ACCESS_MODULEFEATURES (ModuleId,FeatureId,Deleted) select " + i[0].ToString() + "," + i[1].ToString() + ",'False' end ");
                //    DB.ExecuteSQLCairo(sql.ToString());
                //}
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }



        /*start sec admin JFJ Dec 21 7:34PM */

        public void SyncModuleID(string id, string cons)
        {
            try
            {
                BranchDBHelper dbb = new BranchDBHelper();
                StringBuilder sql = new StringBuilder();
                sql.Append(" select ModuleID,ModuleName,URLLink,ImgSrc,Deleted,StationSpecific,TPwdRequired,VirtualPoolName,IncludeVPoolName  from HISGLOBAL.HIS_MODULES where ModuleId = " + id + "   ");
                List<ModuleMenuSyncModel> feat = DB.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<ModuleMenuSyncModel>();

                if (feat.Count > 0)
                {


                    foreach (var i in feat)
                    {

                        sql.Clear();
                        sql.Append(" if not exists(select * from HISGLOBAL.HIS_MODULES where ModuleId = " + id + ") ");
                        sql.Append(" begin ");
                        sql.Append("  ");
                        sql.Append(" insert into HISGLOBAL.HIS_MODULES (ModuleID,ModuleName,URLLink,ImgSrc,Deleted,StationSpecific,TPwdRequired,VirtualPoolName,IncludeVPoolName ) ");
                        sql.Append(" VALUES (" + i.ModuleID + ",'" + i.ModuleName + "','" + i.URLLink + "','" + i.ImgSrc + "'," + i.Deleted + ",'" + i.StationSpecific + "','" + i.TPwdRequired + "','" + i.VirtualPoolName + "'," + i.IncludeVPoolName + ") ");
                        sql.Append(" end ");
                        dbb.ExecuteSQL(sql.ToString(), cons);
                        eLOG.LogDetail(">>>>1. SyncModuleID1-->" + sql.ToString());

                    }
                }


            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }



        public List<RoleModel> GetRolesDal(string ID)
        {
            try
            {
                return DB.ExecuteSQLAndReturnDataTableLive("select id, cast(id as varchar(20))+ '-'+name as text ,cast(id as varchar(20))+ '-'+name as name from m_roles  where ( name like '%" + ID + "%' OR cast(id as varchar(20)) like  '%" + ID + "%'  )  and deleted = 0  ").DataTableToList<RoleModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public List<RoleModel> GetRolesByModuleID(string roleid, string moduleid)
        {
            try
            {
                return DB.ExecuteSQLAndReturnDataTableLive("select b.ID,b.Name,b.Name as text from l_rolefeatures a left join Station b on a.Station_Id = b.ID where a.Role_Id = '" + roleid + "' and a.Module_Id = '" + moduleid + "' group by b.ID,b.Name   ").DataTableToList<RoleModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public List<DtTableFeatureList> DtTableFeatureList(string stationid, string moduleid, string roleid)
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Clear();
                sql.Append(@" 
select a.Module_Id,a.Feature_Id,b.Name,'True' as [View],'True' as [Save],'True' as Modify,'True' as [Delete],'True' as Printing
,case when Isnull(c.Feature_Id,0) = 0 then 0 else 1 end as 'HasAccess'
from l_modulefeatures a left join m_features b on a.Feature_Id = b.Id 
left join ( select Feature_Id from dbo.l_rolefeatures where Station_Id = '" + stationid + @"'   and Role_Id = '" + roleid + @"'   and Module_Id = '" + moduleid + @"'   ) c on c.Feature_Id = b.Id
where a.Module_Id ='" + moduleid + @"'   ");

                //return DB.ExecuteSQLAndReturnDataTableLive("  select a.Module_Id,a.Feature_Id,b.Name,'True' as [View],'True' as [Save],'True' as Modify,'True' as [Delete],'True' as Printing from l_modulefeatures a left join m_features b on a.Feature_Id = b.Id where a.Module_Id ='" + moduleid + "'   ").DataTableToList<DtTableFeatureList>();
                return DB.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<DtTableFeatureList>();

                //return DB.ExecuteSQLAndReturnDataTableLive(" select a.Id ,a.Role_Id,a.Station_Id,a.Module_Id,a.Feature_Id,c.Name ,'False' as [View],'False' as [Save],'False' as Modify,'False' as [Delete],'False' as Printing from l_rolefunctions a left join m_features c on a.Feature_Id = c.Id where a.Role_Id = '" + roleid + "' and a.Module_Id = '" + moduleid + "' and a.Station_Id = '" + stationid + "'  ").DataTableToList<DtTableFeatureList>();
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
                return DB.ExecuteSQLAndReturnDataTableLive("select id, name as text ,name from station where name like '%" + ID + "%' and  deleted = 0 order by Name ").DataTableToList<RoleModel>();
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
                return DB.ExecuteSQLAndReturnDataTableLive(" select id, name as text ,name from Department where deleted = 0 order by Name ").DataTableToList<RoleModel>();
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


                return DB.ExecuteSQLAndReturnDataTableLive("select ModuleId as Id,cast(ModuleId as varchar(20)) + '-' +ModuleName as Name,ModuleName as text from HISGLOBAL.HIS_MODULES  where ModuleName like '%" + ID + "%'    ").DataTableToList<RoleModel>();


                //return DB.ExecuteSQLAndReturnDataTableLive(" select b.Id,b.Name,b.Name as text from l_rolefeatures a left join M_Modules b on a.Module_Id = b.Id where a.Role_Id = '" + roleid + "' group by b.Id,b.Name  ").DataTableToList<RoleModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }



        public string CreateNewRole(string moduleid, string stationid, string roleid, string featureId)
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Clear();
                sql.Append(" delete from l_rolefeatures where Role_Id = '" + roleid + "' and Station_Id = '" + stationid + "' and Module_Id = '" + moduleid + "'  and Feature_Id = '" + featureId + "'   ");
                sql.Append("insert l_rolefeatures (Role_Id,Station_Id,Module_Id,Feature_Id,StartDateTime,Deleted) VALUES ('" + roleid + "','" + stationid + "','" + moduleid + "','" + featureId + "',GETDATE(),0)  ");

                sql.Append(" delete from l_rolefunctions where Role_Id ='" + roleid + "'  and Station_Id = '" + stationid + "' and Module_Id = '" + moduleid + "'  and Feature_Id = '" + featureId + "'   ");
                DB.ExecuteSQLLive(sql.ToString());

                //insert l_role per function 
                sql.Clear();
                sql.Append(" select Feature_Id,Function_Id from l_featurefunction  where Deleted = 0 and Feature_Id = '" + featureId + "'");
                List<FeatureFuncModel> feat = DB.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<FeatureFuncModel>();

                foreach (var i in feat)
                {
                    sql.Clear();
                    sql.Append("  insert into l_rolefunctions (Function_Id,Role_Id,Station_Id,Module_Id,Feature_Id,StartDatetime,Deleted) VALUES  ");
                    sql.Append("  ('" + i.Function_Id + "', '" + roleid + "','" + stationid + "','" + moduleid + "','" + i.Feature_Id + "',GETDATE(),0)  ");
                    DB.ExecuteSQLLive(sql.ToString());
                }

                return "Done";
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public string DeleteFeatinRole(string moduleid, string stationid, string roleid, string featureId)
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Clear();
                sql.Append(" delete from l_rolefeatures where Role_Id = '" + roleid + "' and Station_Id = '" + stationid + "' and Module_Id = '" + moduleid + "'  and Feature_Id = '" + featureId + "'   ");

                sql.Append(" delete from l_rolefunctions where Role_Id ='" + roleid + "'  and Station_Id = '" + stationid + "' and Module_Id = '" + moduleid + "'  and Feature_Id = '" + featureId + "'   ");
                DB.ExecuteSQLLive(sql.ToString());

                //insert l_role per function 
                sql.Clear();

                return "Done";
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }


        public string InsertNewRole(string newrolename, string desc)
        {
            try
            {

                //dito na ko
                StringBuilder sql = new StringBuilder();
                sql.Clear();
                sql.Append(" insert into m_roles (Name,Description,Startdatetime,Deleted) VALUES ('" + newrolename + "','" + desc + "',GETDATE(),0)  ");
                DB.ExecuteSQLLive(sql.ToString());


                return "Done";
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }


        public List<RoleModel> EmployeeList(string ID)
        {
            try
            {
                return DB.ExecuteSQLAndReturnDataTableLive(" select id, EmployeeID + ' - '+ name as name,EmployeeID + ' - '+ name as text from employee where name like '%" + ID + "%'  or employeeId like  '%" + ID + "%'   ").DataTableToList<RoleModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public string InsertNewRoleToEmployee(string roleid, string userid)
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Clear();

                sql.Append(" delete from l_userroles where Role_Id = '" + roleid + "' and User_Id = '" + userid + "'    ");
                sql.Append(" insert into l_userroles (Role_Id,User_Id,Startdatetime,Deleted) VALUES ('" + roleid + "','" + userid + "',GETDATE(),0)  ");
                DB.ExecuteSQLLive(sql.ToString());


                return "Done";
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }



        public List<GetFeatureListbyRole> GetFeatureListbyRole(string roleid, string stationid, string moduleid)
        {
            try
            {
                return DB.ExecuteSQLAndReturnDataTableLive(" select a.Feature_Id,a.Function_Id,b.Name as featname,c.Name as funcname " +
                " ,( select case when exists ( SELECT 1 FROM l_rolefunctions where Role_Id = '" + roleid + "' and Station_Id = '" + stationid + "' and Module_Id = '" + moduleid + "' and Feature_Id = a.Feature_Id and Function_Id = a.Function_Id ) then " +
                "case when exists ( SELECT 1 FROM l_rolefunctions where Role_Id =  '" + roleid + "' and Station_Id =  '" + stationid + "'  and Module_Id = '" + moduleid + "' and Feature_Id = a.Feature_Id and Function_Id = a.Function_Id and Deleted = 0 ) " +
                " then 1 else 0 end " +
                " else 0 end ) as HasAccess  " +
                "from l_featurefunction a " +
                                        "left join m_features b on a.Feature_Id = b.Id " +
                                        "left join m_functions c on c.Id = a.Function_Id " +
                                        "where a.Feature_Id in  " +
                                        "( " +
                                        "select Feature_Id from l_rolefeatures where Role_Id = '" + roleid + "' and Station_Id = '" + stationid + "' and Module_Id = '" + moduleid + "' " +
                                        ")  ").DataTableToList<GetFeatureListbyRole>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }


        public List<GetAllRoleList> GetAllRoleList()
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Clear();
                sql.Append("  select Id,Name,Description from m_roles where Deleted = 0 order by Id desc ");

                return DB.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<GetAllRoleList>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }




        public string AddRoleFunctions(string roleid, string stationid, string moduleid, string featureid, string functionid)
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Clear();

                sql.Append(" delete from l_rolefunctions  where  Role_Id = '" + roleid + "' and  Station_Id = '" + stationid + "' and  Module_Id =  '" + moduleid + "' and Feature_Id =  '" + featureid + "' and  Function_Id =  '" + functionid + "' ");
                sql.Append("  insert into l_rolefunctions (Role_Id,Station_Id,Module_Id,Feature_Id,Function_Id,StartDatetime,Deleted) values ('" + roleid + "','" + stationid + "' ,'" + moduleid + "','" + featureid + "','" + functionid + "',GETDATE(),0)    ");
                DB.ExecuteSQLLive(sql.ToString());


                return "Done";
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }


        public string RemoveRoleFunctions(string roleid, string stationid, string moduleid, string featureid, string functionid)
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Clear();

                //sql.Append(" delete from l_rolefunctions  where  Role_Id = '" + roleid + "' and  Station_Id = '" + stationid + "' and  Module_Id =  '" + moduleid + "' and Feature_Id =  '" + featureid + "' and  Function_Id =  '" + functionid + "' ");

                sql.Append(" update l_rolefunctions set Deleted = 1  where  Role_Id = '" + roleid + "' and  Station_Id = '" + stationid + "' and  Module_Id =  '" + moduleid + "' and Feature_Id =  '" + featureid + "' and  Function_Id =  '" + functionid + "' ");

                DB.ExecuteSQLLive(sql.ToString());

                return "Done";
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public List<GetModulePerStation> GetModulePerStation(string stationid)
        {
            try
            {

                return DB.ExecuteSQLAndReturnDataTableLive("  select  a.Module_Id,b.ModuleName as Modulename, '' as Role_id, '' as Rolename  from l_rolefeatures a  " +
                                                             " left join HISGLOBAL.HIS_MODULES b on a.Module_Id = b.Id " +
                                                             " left join m_roles c on c.Id = a.Role_Id " +
                                                             " where a.Station_Id = '" + stationid + "' and a.Deleted = 0 and b.ModuleName is not null    " +
                                                             " group by  a.Module_Id,b.ModuleName   ").DataTableToList<GetModulePerStation>();

                //return DB.ExecuteSQLAndReturnDataTableLive(" select a.Id ,a.Role_Id,a.Station_Id,a.Module_Id,a.Feature_Id,c.Name ,'False' as [View],'False' as [Save],'False' as Modify,'False' as [Delete],'False' as Printing from l_rolefunctions a left join m_features c on a.Feature_Id = c.Id where a.Role_Id = '" + roleid + "' and a.Module_Id = '" + moduleid + "' and a.Station_Id = '" + stationid + "'  ").DataTableToList<DtTableFeatureList>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }



        public string SaveStationtoStationperModule(string OrigstationId, string CopystationId)
        {
            var ErrorMessage = "";
            try
            {



                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@origStationID",OrigstationId),
                    new SqlParameter("@copyStationID",CopystationId),

                };
                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.SecurityAdmin_CopyStationToStation");
                ErrorMessage = db.param[0].Value.ToString();
                bool isOK = ErrorMessage.Split('-')[0] == "100";
                return "Done";
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }


        public List<ListModel> GetALLStationDAL()
        {
            try
            {
                StringBuilder sql = new StringBuilder();

                sql.Append(" select id,name text,Code as name from station where Deleted = 0 order by name ");
                return DB.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<ListModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        /*end sec admin*/

        public string CreateModuleId()
        {
            try
            {
                DBHelper db = new DBHelper();

                db.ExecuteSP("ITADMIN.Create_ModuleID");

                return "Done";
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        #region Copy Employee to Another
        public string SaveCopyEmployeeAccess(string FromUserId, string ToUserId, string ModuleId, int DeleteOld)
        {
            try
            {
                var ErrorMessage = "";
                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@fromUserId",FromUserId),
                    new SqlParameter("@toUserId",ToUserId),
                    new SqlParameter("@moduleId",ModuleId),
                    new SqlParameter("@DeleteOld",DeleteOld),

                };
                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.ModuleAccess_CopyEmployeeAccess");
                ErrorMessage = db.param[0].Value.ToString();
                bool isOK = ErrorMessage.Split('-')[0] == "100";
                return "Done";
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }



        #endregion

        #region HISGLOBALCONTROLLER

        public List<AllModuleList> AllModuleList()
        {
            try
            {
                return DB.ExecuteSQLAndReturnDataTableLive(@"  

    if ((SELECT count(COLUMN_NAME) FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'HIS_MODULES' and COLUMN_NAME = 'Description') = 0)
    begin
 
        ALTER TABLE HISGLOBAL.HIS_MODULES
        ADD Description text null;

    end

select ID ,ModuleID ,ModuleName ,URLLink , Description as 'ImgSrc' ,StationSpecific ,TPwdRequired ,Deleted ,VirtualPoolName ,IncludeVPoolName ,AreaName from hisglobal.HIS_MODULES where moduleid <> '' order by modulename 
").DataTableToList<AllModuleList>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public List<FeatureList> getFeaturesbyModId(string Moduleid)
        {
            try
            {
                return DB.ExecuteSQLAndReturnDataTableLive(@"  
                        select 
                        b.Id
                    ,b.FeatureID
                    ,b.Name
                    ,b.ParentID
                    ,b.MenuURL
                    ,b.StartDateTime
                    ,b.EndDateTime
                    ,b.OperatorID
                    ,b.Deleted
                    ,b.SequenceNo
                    ,b.Bar
                    ,b.NewWindow
                    ,b.MenuType
                    ,c.Name as ParentName 
                    from  HISGLOBAL.ACCESS_MODULEFEATURES a  
                    inner join HISGLOBAL.MENU_ACCESS b on a.FeatureId = b.FeatureID  
                    left join HISGlobal.MENU_PARENT c on b.ParentID = c.ID      
                    where ModuleId = " + Moduleid + @";
                    ").DataTableToList<FeatureList>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public List<ListModel> getFunctionbyFeature(string featureId)
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Append(" select b.FunctionID as id,b.name as text,a.FeatureId as name from HISGLOBAL.ACCESS_FEATUREFUNCTIONS a ");
                sql.Append(" left join HISGLOBAL.MENU_FUNCTIONS b on a.FunctionID = b.FunctionID where FeatureId = " + featureId + " and a.Deleted =0 and b.deleted = 0");
                return DB.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<ListModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public string HISModulesUpdate(HisModDal param)
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Clear();
                //, ImgSrc = '" + param.HIS_ImgSrc.Substring(0,120) + @"'
                sql.Append(@" 
 


update his.HISGLOBAL.HIS_MODULES 
set 
ModuleName = '" + param.HIS_ModuleName + @"'
, VirtualPoolName='" + param.HIS_VirtualPoolName + @"'                
, Description='" + param.HIS_ImgSrc.ToString().Replace("'", "&apos;") + @"'
, URLLink ='" + param.HIS_URLLink + @"'
, AreaName = '" + param.HIS_AreaName + @"'
, IncludeVPoolName = '" + param.HIS_IncludeVPoolName + @"'  
, deleted='" + param.HIS_Deleted + @"'
, StationSpecific = '" + param.HIS_StationSpecific + @"'
, TPwdRequired = '" + param.HIS_TPwdRequired + @"'
 
where ModuleID =  '" + param.ModuleID + @"'

    ");


                DB.ExecuteSQLLive(sql.ToString());
                return "Done";
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public string SaveNewFeatures(string name, string menuUrl, string ParentID, string mod)
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Clear();
                sql.Append(" insert into hisglobal.MENU_ACCESS (Name,MenuURL,Deleted,ParentID,SequenceNo,Bar,NewWindow) select '" + name + "' as Name,'" + menuUrl + "' as MenuURL,0 Deleted," + ParentID + " as ParentID,30,0,0  update hisglobal.MENU_ACCESS set FeatureID = SCOPE_IDENTITY()  where id = SCOPE_IDENTITY()  select SCOPE_IDENTITY() as ID  ");
                DataTable dt = DB.ExecuteSQLAndReturnDataTableLive(sql.ToString());
                string feat = dt.Rows[0][0].ToString();
                sql.Clear();
                sql.Append(" insert into hisglobal.ACCESS_MODULEFEATURES (ModuleID,FeatureID,deleted) select " + mod + "," + feat + ",0 ");
                DB.ExecuteSQLLive(sql.ToString());
                return "Done";
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public string UpdateFeatures(updateFeatDal param)
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Clear();

                sql.Append(" update HIS.HISGLOBAL.MENU_ACCESS  set name='" + param.Name + "', ParentID = " + param.ParentName + ", MenuURL ='" + param.MenuURL + "', SequenceNo =" + param.SequenceNo + ",Bar=0, NewWindow=" + param.NewWindow_.ToString() + " ,deleted=" + param.Deleted + " where FeatureId = " + param.featid);
                // sql.Append(" update HIS.HISGLOBAL.MENU_ACCESS  set name='" + param.Name.ToString() + "', ParentID = " + param.ParentName.ToString() + ", MenuURL ='" + param.MenuURL.ToString() + "', SequenceNo =" + param.SequenceNo.ToString() + ",Bar=0, NewWindow=" + param.NewWindow_.ToString() + " ,deleted=" + param.Deleted.ToString() + " where FeatureId = " + param.featid.ToString());
                DB.ExecuteSQLLive(sql.ToString());

                sql.Clear();
                sql.Append(" update HIS.HISGLOBAL.ACCESS_MODULEFEATURES  set deleted=" + param.Deleted.ToString() + " where FeatureId = " + param.featid.ToString() + " AND ModuleId = " + param.ModuleID.ToString());
                DB.ExecuteSQLLive(sql.ToString());

                return "Done";
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public string DeleteFeatures(string feat, string mod)
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Clear();


                sql.Append(" DELETE from HISGLOBAL.ACCESS_MODULEFEATURES WHERE ModuleId = " + mod + " AND FeatureId = " + feat);
                DB.ExecuteSQLLive(sql.ToString());
                sql.Clear();
                sql.Append(" DELETE from HISGLOBAL.ACCESS_USERFEATURES WHERE Module_Id = " + mod + " AND Feature_Id =  " + feat);
                DB.ExecuteSQLLive(sql.ToString());


                return "Done";
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public string SaveNewFunction(string feat, string ID, string del)
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Clear();

                if (del == "0")
                {
                    sql.Append(" if not exists(select * from HISGLOBAL.ACCESS_FEATUREFUNCTIONS where FunctionID = " + ID + "  and FeatureId = " + feat + ") ");
                    sql.Append(" begin insert into HISGLOBAL.ACCESS_FEATUREFUNCTIONS (FeatureId,FunctionID,Deleted) select " + feat + "," + ID + ",0  end");
                    sql.Append(" else begin update HISGLOBAL.ACCESS_FEATUREFUNCTIONS set Deleted = 0 where FeatureId= " + feat + " and FunctionID = " + ID + "   end");

                    DB.ExecuteSQLLive(sql.ToString());
                    return "Function Added!";
                }
                else
                {
                    sql.Append(" update HISGLOBAL.ACCESS_FEATUREFUNCTIONS set Deleted = 1 where FunctionID = " + ID + "  and FeatureId = " + feat);
                    DB.ExecuteSQLLive(sql.ToString());
                    return "Function Deleted!";
                }


            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public string CreateNewModule( string name,string url)
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Clear();

               
                
                sql.Append(@"  
                            declare @maxModuleId int

                            select @maxModuleId =  max(moduleId) + 1 from HISGLOBAL.HIS_MODULES

                             insert into HISGLOBAL.HIS_MODULES (ModuleID,ModuleName,URLLink,Deleted)
                             VALUES (@maxModuleId,'"+ name + @"','" + url + @"',0)

                             insert into  HISGLOBAL.HIS_VERSION (ModuleID,MajorVersion,MinorVersion,Description,DateDeployed,DateDeveloped)
                             Values (@maxModuleId,1,0,'" + name + @"',GETDATE(),GETDATE())

                            ");
                DB.ExecuteSQLLive(sql.ToString());
                return "Function Deleted!";
              


            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        #endregion
    }

    #region Prop
    public class AllModuleList
    {
        public string ID { get; set; }
        public string ModuleID { get; set; }
        public string ModuleName { get; set; }
        public string URLLink { get; set; }
        public string ImgSrc { get; set; }
        public string StationSpecific { get; set; }
        public string TPwdRequired { get; set; }
        public string Deleted { get; set; }
        public string VirtualPoolName { get; set; }
        public string IncludeVPoolName { get; set; }
        public string AreaName { get; set; }
    }

    public class FeatureList
    {
        public string Id { get; set; }
        public string FeatureID { get; set; }
        public string Name { get; set; }
        public string ParentID { get; set; }
        public string MenuURL { get; set; }
        public string StartDateTime { get; set; }
        public string EndDateTime { get; set; }
        public string OperatorID { get; set; }
        public string Deleted { get; set; }
        public string SequenceNo { get; set; }
        public string Bar { get; set; }
        public string NewWindow { get; set; }
        public string MenuType { get; set; }
        public string ParentName { get; set; }
    }
    public class HisModDal
    {
        public string ModuleID { get; set; }
        public string HIS_ModuleName { get; set; }
        public string HIS_VirtualPoolName { get; set; }
        public string HIS_ImgSrc { get; set; }
        public string HIS_URLLink { get; set; }
        public string HIS_AreaName { get; set; }
        public string HIS_IncludeVPoolName { get; set; }
        public string HIS_Deleted { get; set; }
        public string HIS_StationSpecific { get; set; }
        public string HIS_TPwdRequired { get; set; }
    }

    public class updateFeatDal
    {
        public string Name { get; set; }
        public string ParentName { get; set; }
        public string Deleted { get; set; }
        public string ModuleID { get; set; }
        public string SequenceNo { get; set; }
        public string NewWindow_ { get; set; }
        public string featid { get; set; }
        public string MenuURL { get; set; }

    }

    #endregion
}
