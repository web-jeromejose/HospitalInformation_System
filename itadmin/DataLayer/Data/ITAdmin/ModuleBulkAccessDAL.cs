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
    public class ModuleBulkAccessDAL
    {
        DBHelper DB = new DBHelper("GIA");
        public string ErrorMessage { get; set; }

        public List<GetAllEmplist> GetAllEmplist(string deptid,string desId,string catid)
        {
            try
            {
                DB.param = new SqlParameter[]{
                    new SqlParameter("@deptid", deptid.ToString()),
                    new SqlParameter("@desId", desId.ToString()),
                    new SqlParameter("@catid",catid.ToString()),
               };
                return DB.ExecuteSPAndReturnDataTable("ITADMIN.ModuleAccess_GetAllEmployee").DataTableToList<GetAllEmplist>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public List<ListModel> ModuleAccessList()
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Append(" select a.ModuleID as id,a.ModuleName as text,a.ModuleName as name from hisglobal.HIS_MODULES a ");
                sql.Append(" left join HISGLOBAL.ACCESS_MODULEFEATURES b on a.ModuleID = b.ModuleId ");
                sql.Append(" left join HISGLOBAL.MENU_ACCESS c on b.FeatureId = c.FeatureID ");
                sql.Append(" left join HISGLOBAL.MENU_PARENT e on c.ParentID = e.MenuID");
                sql.Append(" where  a.Deleted = 0 and b.Deleted = 0 and c.Deleted = 0 group by a.ModuleID,a.ModuleName order by a.ModuleName ");

                return DB.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<ListModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }


        public bool AddModuleEmployee(AddModuleEmployee entry)
        {
            List<AddModuleEmployee> headerxml = new List<AddModuleEmployee>();
            headerxml.Add(entry);

            var varXml = "<DocumentElement></DocumentElement>";
            if (entry.EmployeeSelectedList != null && entry.EmployeeSelectedList.Count > 0)
            {
                varXml = entry.EmployeeSelectedList.ListToXml("detailsXML");
            }

            try
            {
                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                     new SqlParameter("@header", headerxml.ListToXml("headerXML")),
                     new SqlParameter("@details", varXml)
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.ModuleAccess_SaveAddModuleEmployee");
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

        public bool UpdateUserFeatureDAL(AddModuleEmployee entry)
        {
            List<AddModuleEmployee> headerxml = new List<AddModuleEmployee>();
            headerxml.Add(entry);

            var varXml = "<DocumentElement></DocumentElement>";
            if (entry.EmployeeSelectedList != null && entry.EmployeeSelectedList.Count > 0)
            {
                varXml = entry.EmployeeSelectedList.ListToXml("detailsXML");
            }

            try
            {
                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                     new SqlParameter("@header", headerxml.ListToXml("headerXML")),
                     new SqlParameter("@details", varXml)
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.ModuleAccess_UpdateUserFeatureDAL");
                this.ErrorMessage = db.param[0].Value.ToString();

                bool isOK = this.ErrorMessage.Split('-')[0] == "100";

                /*
                 sql.Clear();
                if (id == "0")
                {
                    sql.Append(" insert into HISGLOBAL.ACCESS_USERFEATURES (USERID,Module_Id,Feature_Id,Deleted,Station_Id) ");
                    sql.Append(" select " + usr + "," + mod + "," + feat + ",0,0 ");
                }
                else
                {
                    sql.Append(" update HISGLOBAL.ACCESS_USERFEATURES set Deleted = " + acc + " where ID = " + id);
                }
                 */

                return isOK;
            }
            catch (Exception x)
            {
                this.ErrorMessage = x.Message;
                return false;
            }

        }

        public bool UpdateUserFunction(AddModuleEmployee entry)
        {
            List<AddModuleEmployee> headerxml = new List<AddModuleEmployee>();
            headerxml.Add(entry);

            var varXml = "<DocumentElement></DocumentElement>";
            if (entry.EmployeeSelectedList != null && entry.EmployeeSelectedList.Count > 0)
            {
                varXml = entry.EmployeeSelectedList.ListToXml("detailsXML");
            }

            try
            {
                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                     new SqlParameter("@header", headerxml.ListToXml("headerXML")),
                     new SqlParameter("@details", varXml)
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.ModuleAccess_UpdateUserFunction");
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

 

        public List<FunctionUserModel> GetUserFeatureFunctionDAL( string feat)
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Clear();

                sql.Append(" select c.FunctionID as id,c.name as text,c.name as name,'No' as HasAccess  ");
                sql.Append(" from HISGLOBAL.ACCESS_FEATUREFUNCTIONS  a ");
                sql.Append("  left join HISGLOBAL.MENU_FUNCTIONS c on a.FunctionID = c.FunctionID  ");
                sql.Append(" where a.FeatureId = " + feat);

                //sql.Append(" select c.FunctionID as id,c.name as text,isnull(b.ID,0) as name, case when isnull(b.deleted,1) = 1 then 'No' else 'Yes' end as HasAccess from HISGLOBAL.ACCESS_FEATUREFUNCTIONS  a ");
                //sql.Append(" left join [HISGLOBAL].ACCESS_USERFUNCTION b on a.FeatureId = b.FeatureId and a.FunctionID = b.FunctionID and b.USERID = " + id);
                //sql.Append(" left join HISGLOBAL.MENU_FUNCTIONS c on a.FunctionID = c.FunctionID ");
                //sql.Append(" where a.FeatureId = " + feat);
                return DB.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<FunctionUserModel>();
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
                 StringBuilder sql = new StringBuilder();

                 sql.Append("  select isnull( b.FeatureId,0) as FID, a.ModuleID,a.ModuleName,a.URLLink,e.Name as ParentName,e.SequenceNo as ParentSeq,c.FeatureID as FeatureID, c.name as FeatureName,c.SequenceNo as FeatureSequence,0  as HasAccess  ");
                 sql.Append(" from hisglobal.HIS_MODULES a  left join HISGLOBAL.ACCESS_MODULEFEATURES b on a.ModuleID = b.ModuleId   ");
                 sql.Append(" left join HISGLOBAL.MENU_ACCESS c on b.FeatureId = c.FeatureID ");
                 sql.Append(" left join HISGLOBAL.MENU_PARENT e on c.ParentID = e.MenuID   ");
                 sql.Append(" where a.ModuleID = " + mod + "  and  a.Deleted = 0 and b.Deleted = 0 and c.Deleted = 0  ");
               
                return DB.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<ModuleAccessModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }



        public List<RoleModel> GetDepartmentList()
        {
            return DB.ExecuteSQLAndReturnDataTableLive(" select 0 as id, '--All DEPT--' as text , '--All DEPT--' as name  union select id, name as text ,name from Department where deleted = 0 order by Name ").DataTableToList<RoleModel>();
        }
        public List<RoleModel> GetDesignationList()
        {
            return DB.ExecuteSQLAndReturnDataTableLive(" select 0 as id, '--All DESIGNATION--' as text , '--All DESIGNATION--' as name  union  select id, name as text ,name from Designation where deleted = 0 order by name ").DataTableToList<RoleModel>();
        }

        public List<RoleModel> GetCategoryList()
        {
            return DB.ExecuteSQLAndReturnDataTableLive(" select 0 as id, '--All CATEGORY--' as text , '--All CATEGORY--' as name  union  select id, name as text ,name from HRCategory where deleted = 0 order by name ").DataTableToList<RoleModel>();
        }


    }


    public class AddModuleEmployee
    {
        public string ModuleId { get; set; }
        public int OperatorId { get; set; }
        public string FeatureId { get; set; }
        public string Deleted { get; set; }
        public string FunctionId { get; set; }
        
        
        public List<EmployeeSelectedList> EmployeeSelectedList { get; set; }

    }
    public class EmployeeSelectedList
    {
        public string Userid { get; set; }
    }

}
