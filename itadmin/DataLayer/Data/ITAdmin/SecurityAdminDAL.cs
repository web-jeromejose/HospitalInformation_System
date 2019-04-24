using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Data;
namespace DataLayer
{
    public class SecurityAdminDAL
    {
        DBHelper DB = new DBHelper("GIA");
        public string ID { get; set; }

        public List<ListModel> GetStationDAL(string ID)
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Append(" select id,name,name as text from Station where deleted = 0   ");
                sql.Append(" and name like '%" + ID + "%'  ");
                return DB.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<ListModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public List<ListModel> GetModuleDAL(string ID)
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Append(" select ModuleId as Id, ModuleName as Name, ModuleName as text from DATAINFO.dbo.ServerInformation where ModuleID IN ( SELECT DISTINCT a.Module_Id FROM L_ROLEFEATURES a join M_ROLES b on b.ID = a.ROLE_ID join DATAINFO.dbo.ServerInformation c on a.Module_Id = c.ModuleId WHERE (b.DELETED=0 OR b.DELETED IS NULL)   ");
                sql.Append(" AND a.STATION_ID =  '" + ID + "'  ) order by ModuleName   ");
                return DB.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<ListModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        #region BI_AR_REJECTION
//        public DataTable GetOraBiArRejection()
//        {
//            try
//            {

////                Set rstfrom = GetRecordset("EXEC SP_LOAD_ARREJECTION '" & FormatDatePlus(stDate.Value, "DD_MMM_YYYY") & "','" & FormatDatePlus(enDate.Value + 1, "DD_MMM_YYYY") & "'", adoConn3)
////Set rstto = GetRecordsetTable("Select * from BI_AR_REJECTION where BILLNO = '111' ", adoConn8)


//                StringBuilder strb = new StringBuilder();
//                strb.Append(" Select * from BI_AR_REJECTION ");

//                //strb.Append("SELECT  a.PIN, a.REQ_DATE, a.SERVICE_CODE,a.SERVICE_NAME,a.PROC_SEQ_NO," +
//                //            "  a.AREA_CODE, b.wipro_pin from or_request_procedure a, patient b  " +
//                //            " WHERE a.pin=b.pin " +
//                //            "  and (a.service_code not like 'FMCAT%' and a.service_code not like 'FMVAS%')  " +
//                //            " and nvl(a.service_code,'xxx') <> 'xxx'" +
//                //            " ORDER BY a.proc_seq_no ");


//                return DB.ExecuteQueryInORA(strb.ToString());


              

                
//            }
//            catch (Exception ex)
//            {
//                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
//            }
//        }
        #endregion

        #region UsersAndRoles

        public List<GetUserDataTable> GetUserDataTable()
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Clear();
                sql.Append("  select a.ID, a.EmployeeID,a.Name from employee a where a.Deleted = 0 order by a.Name ");

                return DB.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<GetUserDataTable>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public List<GetRolesByUserId> GetRolesByUserId(string userid)
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Clear();
                sql.Append("  SELECT Name ,Description,(SELECT  NAME  FROM EMPLOYEE WHERE (DELETED=0 OR DELETED IS NULL) AND ID= '" + userid + "')as Fullname");
                 sql.Append(" FROM M_ROLES ");
                 sql.Append("  WHERE (DELETED=0 OR DELETED IS NULL) AND ID IN (SELECT ROLE_ID FROM L_USERROLES WHERE USER_ID='" + userid + "') ORDER BY NAME ");

                return DB.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<GetRolesByUserId>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }



        public string SaveRoleDesc(string Id, string RoleName, string Desc)
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Clear();


                sql.Append(" update M_ROLES set Name ='" + RoleName + "',Description='" + Desc + "',Startdatetime= getdate() where Id ='" + Id + "'   ");

                DB.ExecuteSQLLive(sql.ToString());

                return "Done";
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
                return DB.ExecuteSQLAndReturnDataTableLive(" select distinct A.Module_Id as id, C.ModuleName as name, C.ModuleName as text from HISGLOBAL.ACCESS_ROLEFEATURES A LEFT JOIN HIS.HISGLOBAL.HIS_MODULES C on A.Module_Id = C.ModuleID where A. Role_id = '" + ID + "' AND C.Deleted = 0 and a.Station_Id = 0  ").DataTableToList<RoleModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }


        public List<RoleModel> GetAllEmployeeList()
        {
            try
            {
                return DB.ExecuteSQLAndReturnDataTableLive("  select id,FirstName +' '+MiddleName+' '+LastName as name ,FirstName +' '+MiddleName+' '+LastName as text from employee where deleted = 0 order by id ").DataTableToList<RoleModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public List<AssignRoleDataTAble> GetDetailsByEmployee(int userid)
        {
            try
            {
                return DB.ExecuteSQLAndReturnDataTableLive(@" 
                    select c.Name as StationName,a.Station_Id as StationId
                    ,b.Name as RoleName,a.Role_Id as RoleId
                    ,d.ModuleName,d.ModuleID
                    ,e.Name as FeatureName,a.Feature_Id as FeatureId
                    from  dbo.l_rolefeatures a
                    left join dbo.m_roles b on a.Role_Id = b.Id
                    left join dbo.Station c on a.station_id = c.id
                    left join HIS.HISGLOBAL.HIS_MODULES  d on a.Module_id = d.moduleID
                    left join dbo.m_features e on a.feature_id = e.id
                    where   a.role_id in ( select distinct Role_Id from dbo.L_USERROLES a where a.User_Id = " + userid + @" )
                    order by  c.Name,b.Name ,d.ModuleName,e.Name
                ").DataTableToList<AssignRoleDataTAble>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        
        #endregion


    }
}
public class AssignRoleDataTAble 
{
    public string StationName { get; set; }
    public int StationId { get; set; }
    public string RoleName { get; set; }
    public int RoleId { get; set; }
    public string ModuleName { get; set; }
    public int ModuleID { get; set; }
    public string FeatureName { get; set; }
    public int FeatureId { get; set; }
}
