using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;
using System.Text;
using DataLayer.Common;
using System.Text.RegularExpressions;


namespace DataLayer
{

    public class MasterModel
    {
        public string ErrorMessage { get; set; }
        DBHelper db = new DBHelper();
        ExceptionLogging elog = new ExceptionLogging();

        #region GenericFunctions
        public List<ListModel> GetModules()
        {
            try
            {
                return db.ExecuteSQLAndReturnDataTableLive(" select moduleid as id,modulename as text,id as name  from hisglobal.HIS_MODULES where deleted = 0 and modulename <> '' and URLLink <> '' order by ModuleName  ").DataTableToList<ListModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        
        public List<ListModel> FeatureListByModuleId(int ModuleId)
        {
            try
            {
                return db.ExecuteSQLAndReturnDataTableLive("select ma.FeatureId as id ,ma.Name as name,ma.Name as text from HISGLOBAL.ACCESS_MODULEFEATURES mf left join HISGLOBAL.HIS_MODULES hm on hm.Moduleid = mf.ModuleId left join HISGLOBAL.MENU_ACCESS ma on ma.FeatureId = mf.FeatureId where ma.Deleted = 0 and hm.Deleted = 0  and mf.Deleted =  0 and mf.moduleId = " + ModuleId + "  order by name  ").DataTableToList<ListModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public List<ListModel> GetEmployeeList()
        {
            try
            {
                return db.ExecuteSQLAndReturnDataTableLive(" select id as id,cast(EmployeeID as varchar(max)) + ' - '+cast(name as varchar(max)) as text,cast(EmployeeID as varchar(max)) + ' - '+cast(name as varchar(max)) as name   from his.dbo.employee where deleted = 0 order by name ").DataTableToList<ListModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

         public string RemoveAccessSave(string RmvType, string UserId, string featureid, string functionId)
        {
            try
            {

                StringBuilder sql = new StringBuilder();

                if (RmvType == "Feature")
                {
                    sql.Clear();
                    sql.Append(" update  HISGLOBAL.ACCESS_USERFUNCTION  set deleted =1,EndDateTime = GETDATE() where  USERID = "+ UserId + "   and  FeatureId =  "+ featureid + "  ");
                    sql.Append(" update  HISGLOBAL.ACCESS_USERFEATURES  set deleted =1,EndDateTime = GETDATE() where  USERID =  " + UserId + "   and  Feature_Id =   " + featureid + "  ");
                }

                if (RmvType == "Function")
                {
                    sql.Clear();
                    sql.Append(" update  HISGLOBAL.ACCESS_USERFUNCTION  set deleted =1,EndDateTime = GETDATE() where  USERID =  " + UserId + "    and  FunctionID =  "+ functionId + "  ");
                }


               
                sql.Append("   ");
                db.ExecuteSQL(sql.ToString());
                return "Done";


            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }


        #endregion

        #region dosage form
        public List<DosageFormMaster> DosageFormDashboard()
        {

            return db.ExecuteSQLAndReturnDataTable(" Select row_number() over (order by Name asc) as slno,Id,Name,Description from dbo.DosageFormMaster where Deleted=0 order by Name asc ").DataTableToList<DosageFormMaster>();
        }

        public List<ServiceCategoryDashboard> ServiceCategoryDashboard()
        {
            StringBuilder sql = new StringBuilder();
            sql.Clear();
            sql.Append("   ");
            sql.Append(" select  row_number() over (order by c.Name asc) as slno,b.Name as CategoryName,b.ID as CategoryId,c.Name,c.Code,c.ID as ItemId, d.Name as DeptName,a.ID as ServiceCatId ");
            sql.Append(" from ServiceCategory a ");
            sql.Append(" inner join ServiceCategoryMaster b on a.CategoryID = b.ID ");
            sql.Append(" inner join dbo.Test c on a.ServiceCode = c.Code and a.DepartmentID = c.DepartmentID ");
            sql.Append(" left join dbo.Department d on a.DepartmentID = d.id  ");
            sql.Append(" where c.Deleted = 0  order by c.Name asc   ");


            return db.ExecuteSQLAndReturnDataTable(sql.ToString()).DataTableToList<ServiceCategoryDashboard>();
        }

        public List<RoleModel> GetDepartmentDal()
        {
            return db.ExecuteSQLAndReturnDataTableLive("  select id, name as text ,name from dbo.Department where deleted = 0 order by Name ").DataTableToList<RoleModel>();
        }

        public List<RoleModel> GetServiceCategory()
        {
            return db.ExecuteSQLAndReturnDataTableLive("   select id, name as text ,name from dbo.ServiceCategoryMaster  order by Name  ").DataTableToList<RoleModel>();
        }

        public List<RoleModel> GetTestList()
        {
            return db.ExecuteSQLAndReturnDataTableLive("   select id,code+'-'+name as text ,code+'-'+name as name from dbo.test where deleted = 0  order by code  ").DataTableToList<RoleModel>();
        }

        public List<RoleModel> GetDeptByTestId(string testid)
        {
            return db.ExecuteSQLAndReturnDataTableLive("   select a.ID,b.Name as text, b.Name from dbo.test a left join dbo.Department b on a.DepartmentID = b.ID where a.id = '" + testid + "'  order by code  ").DataTableToList<RoleModel>();
        }

        public bool DosageFormSave(DosageFormMasterEntry entry)
        {

            try
            {
                StringBuilder sql = new StringBuilder();

                if (entry.Action == "1") //new  
                {
                    sql.Clear();
                    sql.Append("   ");
                    sql.Append(" if exists(select * from dbo.DosageFormMaster where Name = '" + entry.Name.Trim() + "' and deleted = 0) ");
                    sql.Append(" begin  ");
                    sql.Append(" select  'Name: <b>" + entry.Name + " </b> already exists!' as Message , 1 as Error ");
                    sql.Append(" return;  ");
                    sql.Append(" end  ");
                    sql.Append("   ");
                    sql.Append("  insert into dbo.DosageFormMaster ( Name,Description,Deleted,DateCreated)  ");
                    sql.Append("   values ( '" + entry.Name.Trim() + "','" + entry.Description.Trim() + "',0,getdate())  ");
                    sql.Append(" select  'Save Successfully.' as Message , 0 as Error ");

                }
                else if (entry.Action == "2") //update
                {
                    sql.Clear();
                    sql.Append(" update dbo.DosageFormMaster set Name = '" + entry.Name.Trim() + "' ,Description = '" + entry.Description.Trim() + "' where ID ='" + entry.Id + "'  ");
                    sql.Append("   ");
                    sql.Append("   ");
                    sql.Append(" select  'Update Successfully.' as Message , 0 as Error ");
                }
                else if (entry.Action == "3") //delete
                {
                    sql.Clear();
                    sql.Append(" update dbo.DosageFormMaster set Deleted = 1 where ID ='" + entry.Id + "'  ");
                    sql.Append("   ");
                    sql.Append(" select  'Remove Successfully.' as Message , 0 as Error ");
                }

                List<SqlMessage> dt = db.ExecuteSQLAndReturnDataTable(sql.ToString()).DataTableToList<SqlMessage>();
                // DataTable dt = db.ExecuteSQLAndReturnDataTable(sql.ToString());
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

        public bool ServiceCategorySave(ServiceCatSaveEntry entry)
        {

            try
            {
                StringBuilder sql = new StringBuilder();

                if (entry.Action == "1") //new  
                {
                    sql.Clear();
                    sql.Append("  declare @deptId int,@code varchar(100) ");
                    sql.Append("   ");
                    sql.Append(" if not exists( select * from dbo.test where id ='" + entry.ItemId + "' and deleted = 0 ) ");
                    sql.Append(" begin  ");
                    sql.Append(" select  'Test ID : <b>" + entry.ItemId + " </b> not exists!' as Message , 1 as Error ");
                    sql.Append(" return;  ");
                    sql.Append(" end  ");

                    sql.Append("  select @code = a.code,@deptId =  b.Id from dbo.test a left join dbo.Department b on a.DepartmentID = b.ID where a.id ='" + entry.ItemId + "'   ");


                    sql.Append("   ");
                    sql.Append(" if  exists( select ServiceCode from dbo.ServiceCategory  where  CategoryId =  '" + entry.ServiceCatId + "'  and ServiceCode = @code  )  ");
                    sql.Append(" begin  ");
                    sql.Append(" select  'Category and Test ID : <b>" + entry.ItemId + " </b> already  exists!' as Message , 1 as Error ");
                    sql.Append(" return;  ");
                    sql.Append(" end  ");



                    sql.Append(" declare @maxid int  ");
                    sql.Append("  select @maxid = max(id) + 1 from HIS.dbo.ServiceCategory  ");

                    sql.Append("  insert into dbo.ServiceCategory (CategoryID,ServiceCode,DepartmentID,ID)   ");
                    sql.Append("   values ('" + entry.ServiceCatId + "',@code,@deptId, @maxid)   ");
                    sql.Append("   ");

                    sql.Append(" select  'Save Successfully.' as Message , 0 as Error ");

                }
                else if (entry.Action == "2") //update
                {
                    sql.Clear();

                    sql.Append(" select  'Update Successfully.' as Message , 0 as Error ");
                }
                else if (entry.Action == "3") //delete
                {
                    sql.Clear();
                    sql.Append(" delete from ServiceCategory where ID = '" + entry.Id + "'   ");
                    sql.Append(" select  'Remove Successfully.' as Message , 0 as Error ");
                }

                List<SqlMessage> dt = db.ExecuteSQLAndReturnDataTable(sql.ToString()).DataTableToList<SqlMessage>();
                // DataTable dt = db.ExecuteSQLAndReturnDataTable(sql.ToString());
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
        #endregion

        #region CountryController
        public List<CountryDal> CountryDashboard()
        {
            StringBuilder sql = new StringBuilder();
            sql.Clear();

            sql.Append(" if not exists(select * from sys.tables where name = 'CountryIso') ");
            sql.Append(" begin ");
            sql.Append(" CREATE TABLE  [dbo].[CountryIso]( ");
            sql.Append("  ");
            sql.Append(" 	[Id] [int] IDENTITY(1,1) NOT NULL, ");
            sql.Append(" 	[CountryId] [int] NULL, ");
            sql.Append(" 	[IsoCode] [nvarchar](100) NULL, ");
            sql.Append(" 	[NumCode] [nvarchar](100) NULL, ");
            sql.Append(" 	[PhoneCode] [nvarchar](100) NULL, ");
            sql.Append(" 	[FlagLogo] [varbinary](max) NULL, ");
            sql.Append(" 	[CreatedDate] [datetime] null, ");
            sql.Append(" 	[Deleted] [bit] NULL, ");
            sql.Append(" ) ON [MasterFile] TEXTIMAGE_ON [MasterFile] ");
            sql.Append(" end ");

            sql.Append("  select A.Id,A.Name, ISNULL(A.ArabicName,' ') as ArabicName,ISNULL(B.IsoCode,' ') as IsoCode,ISNULL(B.NumCode,' ') as NumCode,ISNULL(B.PhoneCode,' ')as PhoneCode, B.FlagLogo  ");
            sql.Append("        from dbo.Country A   ");
            sql.Append("        left join dbo.CountryIso B on A.Id = B.CountryId  ");
            sql.Append("       where A.Deleted = 0   ");


            DataTable dt = db.ExecuteSQLAndReturnDataTable(sql.ToString());
            List<CountryDal> list = new List<CountryDal>();
            if (dt.Rows.Count > 0) list = dt.ToList<CountryDal>();
            return list;
        }

        public List<CityDal> CityDashboard()
        {
            StringBuilder sql = new StringBuilder();
            sql.Clear();

            sql.Append(" select B.Name as CountryName,A.Name as CityName,ISNULL(C.IsoCode,'') as IsoCode ,ISNULL(C.PhoneCode, '') as PhoneCode,A.Deleted ,A.Id as CityId, B.Id as CountryId ");
            sql.Append(" from dbo.City A ");
            sql.Append(" left join dbo.Country B on A.CountryID = B.Id ");
            sql.Append(" left join dbo.CountryIso C on B.Id = C.CountryId ");
            sql.Append(" where B.Deleted = 0 ");


            DataTable dt = db.ExecuteSQLAndReturnDataTable(sql.ToString());
            List<CityDal> list = new List<CityDal>();
            if (dt.Rows.Count > 0) list = dt.ToList<CityDal>();
            return list;
        }


        public List<RoleModel> AllCountries()
        {
            return db.ExecuteSQLAndReturnDataTableLive(" select Id,name as text,name from Country where deleted = 0 order by name ").DataTableToList<RoleModel>();
        }
        public List<RoleModel> getCitybyCountry(string countryid)
        {
            return db.ExecuteSQLAndReturnDataTableLive(" select Id,name as text,name from City where deleted = 0 and CountryID = " + countryid + " order by name").DataTableToList<RoleModel>();
        }



        public bool CountrySave(CountrySaveDal entry)
        {

            StringBuilder sql = new StringBuilder();
            sql.Clear();
            sql.Append("  ");

            sql.Append("   ");
            sql.Append("   ");
            sql.Append("   ");
            sql.Append("  declare @id int = " + entry.Id);
            sql.Append("  declare @Iso varchar(max) =UPPER(NULLIF('" + entry.IsoCode + "','')) ");
            sql.Append("  declare @phonecode varchar(max) = NULLIF('" + entry.PhoneCode + "','') ");
            sql.Append("  declare @countryname varchar(max) = NULLIF('" + entry.Name + "','') ");
            sql.Append("   ");
            sql.Append("  if not exists(select * from dbo.CountryIso where countryId =   @id  ) ");
            sql.Append("  BEGIN ");
            sql.Append("  insert into  dbo.CountryIso (IsoCode,PhoneCode,CountryId) values (@Iso,@phonecode, @id)  ");
            sql.Append("  END ");
            sql.Append("  ELSE ");
            sql.Append("  BEGIN ");
            sql.Append("   ");
            sql.Append("  UPDATE dbo.CountryIso SET  ");
            sql.Append("      [IsoCode] = COALESCE(@Iso,[IsoCode]),  ");
            sql.Append("      [PhoneCode] = COALESCE(@phonecode,[PhoneCode]) ");
            sql.Append("      where CountryId = @id  ");
            sql.Append("   ");
            sql.Append("  END ");
            sql.Append("  update dbo.Country SET ");
            sql.Append("    [Name] = COALESCE(@countryname,[Name]) ");
            sql.Append("   where Id = @id  ");



            db.ExecuteSQLLive(sql.ToString());
            this.ErrorMessage = "Data has been updated..";
            return true;

        }

        public bool AddCountrySave(CountrySaveDal entry)
        {

            StringBuilder sql = new StringBuilder();
            sql.Clear();
            sql.Append("  ");


            sql.Append("   ");
            sql.Append("  declare @Iso varchar(max) =UPPER(NULLIF('" + entry.IsoCode + "','')) ");
            sql.Append("  declare @phonecode varchar(max) = NULLIF('+" + entry.PhoneCode + "','') ");
            sql.Append("  declare @countryname varchar(max) = NULLIF('" + entry.Name + "','') ");
            sql.Append("  declare @id int ");
            sql.Append("   ");
            sql.Append("   ");
            sql.Append("  if not exists(select * from dbo.Country where LTRIM(RTRIM(LOWER(name)))  =  LTRIM(RTRIM(LOWER(@countryname))) and deleted =0 ) ");
            sql.Append("  BEGIN ");
            sql.Append("  	insert into  dbo.Country (Name,Startdatetime,Deleted) values (@countryname,getdate(),0)  ");
            sql.Append("  	SELECT @id = SCOPE_IDENTITY(); ");
            sql.Append("  	insert into  dbo.CountryIso (IsoCode,PhoneCode,CountryId) values (@Iso,@phonecode, @id)  ");
            sql.Append("  END ");
            sql.Append("  ELSE ");
            sql.Append("  BEGIN ");
            sql.Append("  	select @id = id  from dbo.Country where LTRIM(RTRIM(LOWER(name)))  =  LTRIM(RTRIM(LOWER(@countryname)))  and deleted =0 ");
            sql.Append("   ");
            sql.Append("  	update dbo.Country SET ");
            sql.Append("  	  [Name] = COALESCE(@countryname,[Name]) ");
            sql.Append("  	 where Id = @id  ");
            sql.Append("   ");
            sql.Append("  	 UPDATE dbo.CountryIso SET  ");
            sql.Append("          [IsoCode] = COALESCE(@Iso,[IsoCode]),  ");
            sql.Append("          [PhoneCode] = COALESCE(@phonecode,[PhoneCode]) ");
            sql.Append("          where CountryId = @id  ");
            sql.Append("   ");
            sql.Append("  END ");
            sql.Append("   ");



            db.ExecuteSQLLive(sql.ToString());
            this.ErrorMessage = "Country has been saved..";
            return true;

        }

        public bool AddCitySave(CitySaveDal entry)
        {

            StringBuilder sql = new StringBuilder();
            sql.Clear();
            sql.Append("  ");


            sql.Append("  declare @countryid int = " + entry.Id + " ");
            sql.Append("  declare @cityname varchar(max) ");

            foreach (var i in entry.CityName)
            {
                sql.Append("  SET @cityname = '" + i.cityname + "' ");

                sql.Append("  if exists(select * from dbo.City where LTRIM(RTRIM(LOWER(name)))  =  LTRIM(RTRIM(lower(@cityname))) and deleted =0 and CountryID = @countryid ) ");
                sql.Append("  BEGIN ");
                sql.Append("   ");
                sql.Append("  UPDATE dbo.City SET  ");
                sql.Append("      [Name] = COALESCE(@cityname,[Name])         ");
                sql.Append("  where  LTRIM(RTRIM(LOWER(name)))  =  LTRIM(RTRIM(lower(@cityname))) and deleted = 0  and CountryID= @countryid   ");
                sql.Append("  END ");
                sql.Append("  ELSE ");
                sql.Append("  BEGIN ");
                sql.Append("  	insert into dbo.City (Name,CountryID,StartDatetime,Deleted) values  (@cityname,@countryid,getdate(),0)");
                sql.Append("  END ");


            }




            db.ExecuteSQLLive(sql.ToString());
            this.ErrorMessage = "Country - City has been updated..";
            return true;

        }

        public bool UpdateCity(UpdateCityDal entry)
        {

            StringBuilder sql = new StringBuilder();
            sql.Clear();
            sql.Append("  ");

            sql.Append("   update dbo.City set  [Name] = COALESCE('" + entry.CityName + "',[Name])  where id = " + entry.Id + " ");

            db.ExecuteSQLLive(sql.ToString());
            this.ErrorMessage = "City has been updated..";
            return true;

        }

        #endregion

        #region ModuleViewController
        public List<ModuleViewDashboarddal> ModuleViewDashboard(int moduleid,int userid,int featid)
        {
            StringBuilder sql = new StringBuilder();
            sql.Clear();
           
            sql.Append("   declare @moduleid int = " + moduleid + " ");
            sql.Append("   declare @userid int = " + userid + " ");
            sql.Append("   declare @featId int = " + featid + " ");
            sql.Append("    "); 
            sql.Append("  select          distinct    ");
            sql.Append("  Department = d.name   ");
            sql.Append("  , Designation = de.name   ");
            sql.Append("  ,emp.EmployeeID   ");
            sql.Append("  , emp.Name as EmpName          ");
            sql.Append("  ,convert(varchar(11), emp.StartDateTime , 113)  as EmpDateStart   ");
            sql.Append("  ,[datetime] =  emp.StartDateTime            ");
            sql.Append("  , hm.ModuleName   ");
            sql.Append("  , ma.Name   ");
            sql.Append("  , ma.MenuURL   ");
            sql.Append("  , ISNULL(mf.Name,'--') as FunctionName   ");
            sql.Append("  ,a.Module_Id as ModuleId ,a.Feature_Id as FeatureId , ISNULL(mf.FunctionID,0) as FunctionID,emp.ID as UserId       ");
            sql.Append("  from            HISGLOBAL.ACCESS_USERFEATURES a    ");
            sql.Append("  left join       (   ");
            sql.Append("  select a.moduleid, a.featureid, a.FunctionID   ");
            sql.Append("  from   HISGLOBAL.ACCESS_USERFUNCTION a where  (@moduleid = 0 OR a.ModuleId = @moduleid  )    and (@userid = 0 OR a.USERID = @userid)   and a.deleted = 0   ");
            sql.Append("  ) b on b.featureid = a.feature_id and a.Module_Id = b.ModuleId   ");
            sql.Append("  left join       dbo.Employee emp on emp.id = a.USERID     ");
            sql.Append("  left join       dbo.Department d on d.id = emp.DepartmentID   ");
            sql.Append("  left join       dbo.Designation de on de.id = emp.DesignationID   ");
            sql.Append("  left join       HISGLOBAL.MENU_ACCESS ma on ma.FeatureId = a.Feature_Id   ");
            sql.Append("  left join       HISGLOBAL.MENU_FUNCTIONS mf on mf.FunctionID = b.FunctionID   ");
            sql.Append("  left join       HISGLOBAL.HIS_MODULES hm on hm.Moduleid = a.module_id   ");
            sql.Append("  where         (@moduleid = 0 OR a.Module_Id = @moduleid  )  ");
            sql.Append("  and (@userid = 0 OR emp.ID = @userid) ");
            sql.Append("  and (@featId = 0 OR a.Feature_Id = @featId)  ");
            sql.Append("  and a.Deleted = 0 and emp.Deleted = 0 and ma.MenuURL <> ''  and hm.ModuleName <> '' ");
            sql.Append("   and hm.ModuleName is not null ");
            sql.Append("  Order By d.name,de.name,emp.StartDateTime   desc   ");


            DataTable dt = db.ExecuteSQLAndReturnDataTable(sql.ToString());
            List<ModuleViewDashboarddal> list = new List<ModuleViewDashboarddal>();
            if (dt.Rows.Count > 0) list = dt.ToList<ModuleViewDashboarddal>();
            return list;
        }

        public List<ModuleViewDashboarddal> UserModuleViewDashboard(int moduleid, int userid)
        {
            StringBuilder sql = new StringBuilder();
            sql.Clear();

            sql.Append("   declare @moduleid int = " + moduleid + " ");
            sql.Append("   declare @userid int = " + userid + " ");
            sql.Append("    ");
            sql.Append("  select          ");
            sql.Append("  Department = d.name    ");
            sql.Append("  , Designation = de.name    ");
            sql.Append("  ,emp.EmployeeID    ");
            sql.Append("  , emp.Name as EmpName           ");
            sql.Append("  ,convert(varchar(11), emp.StartDateTime , 113)  as EmpDateStart             ");
            sql.Append("  , hm.ModuleName    ");
            sql.Append("  from            HISGLOBAL.ACCESS_USERFEATURES a     ");
            sql.Append("  left join       (    ");
            sql.Append("  select a.moduleid, a.featureid, a.FunctionID    ");
            sql.Append("  from   HISGLOBAL.ACCESS_USERFUNCTION a where (@moduleid = 0 OR a.ModuleId = @moduleid  )    and (@userid = 0 OR a.USERID = @userid)    and a.deleted = 0    ");
            sql.Append("  ) b on b.featureid = a.feature_id and a.Module_Id = b.ModuleId    ");
            sql.Append("  left join       dbo.Employee emp on emp.id = a.USERID      ");
            sql.Append("  left join       dbo.Department d on d.id = emp.DepartmentID    ");
            sql.Append("  left join       dbo.Designation de on de.id = emp.DesignationID    ");
            sql.Append("  left join       HISGLOBAL.MENU_ACCESS ma on ma.FeatureId = a.Feature_Id    ");
            sql.Append("  left join       HISGLOBAL.MENU_FUNCTIONS mf on mf.FunctionID = b.FunctionID    ");
            sql.Append("  left join       HISGLOBAL.HIS_MODULES hm on hm.Moduleid = a.module_id    ");
            sql.Append("  where         (@moduleid = 0 OR a.Module_Id = @moduleid  )   ");
            sql.Append("  and (@userid = 0 OR emp.ID = @userid)  ");
            sql.Append("  and a.Deleted = 0 and emp.Deleted = 0 and ma.MenuURL <> ''  and hm.ModuleName <> '' and hm.ModuleName is not  null  ");
            sql.Append("  group by d.name ,de.name ,emp.EmployeeID ,emp.Name , emp.StartDateTime, hm.ModuleName   ");
            sql.Append("  Order By d.name,de.name,emp.StartDateTime   desc    ");


            DataTable dt = db.ExecuteSQLAndReturnDataTable(sql.ToString());
            List<ModuleViewDashboarddal> list = new List<ModuleViewDashboarddal>();
            if (dt.Rows.Count > 0) list = dt.ToList<ModuleViewDashboarddal>();
            return list;
        }


        #endregion

        #region INVMaxController


        public List<ListModel> GetStationWithInvmax()
        {
            try
            {
                StringBuilder sql = new StringBuilder();

                sql.Append(" select id,name as text,name from station  where id not in (select distinct stationid from invmax ) and deleted = 0 order by name ");
                return db.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<ListModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }


        public List<ListModel> GetStationWithMMSRPTMAP()
        {
            try
            {
                StringBuilder sql = new StringBuilder();

                sql.Append(" select id,name as text,name from station  where id not in (select distinct stationid from MMSRPTMAP ) and deleted = 0 order by name ");
                return db.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<ListModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }


        public string InvMaxSave(int stationid)
        {
            string sql = @"
 
                     select slno into #tmpInsertInvmax2018 from   dbo.InvMax where stationid = 0 order by stationid

                      insert into dbo.InvMax (slno,maxId,stationid)
                      select slno,0," + stationid + @" from #tmpInsertInvmax2018

                      drop table #tmpInsertInvmax2018
  
                    ";



            sql = Regex.Replace(sql, @"\t|\n|\r", "");

            db.ExecuteSQLLive(sql);

            return "Station added";

        }

        public string InvMaxSaveMMSRPTMAP(int stationid)
        {
            string sql = @"
                            declare @NewST int
                            declare @Ccount int

                            select @NewST=ID  from Station where id =  "+stationid+@";
 

                            select @Ccount = COUNT(*) from MMSRPTMAP where StationID=@NewST;
                            select @Ccount
                            IF (@Ccount=0)

                            BEGIN
 
 
                            insert into MMSRPTMAP (ReportID,StationID,OperatorID,StartDateTime)
                            select ReportID,@NewST,OperatorID,SYSDATETIME() from MMSRPTMAP where StationID=18
 
                            END;
  
                    ";



            sql = Regex.Replace(sql, @"\t|\n|\r", "");

            db.ExecuteSQLLive(sql);

            return "Station added";

        }
        
        #endregion

        #region MOHCodesMapping


        public bool MOHMasterDelete(string Id, int operatorid)
        {

            StringBuilder sql = new StringBuilder();
            sql.Clear();
            sql.Append("  ");
 

            sql.Append(" UPDATE MOHInv_CodeMappings SET Deleted = 1, ModifiedBy = "+ operatorid + " , ModifiedDateTime = getdate() where id = " + Id);
            sql.Append("  ");

            db.ExecuteSQLLive(sql.ToString());
            this.ErrorMessage = "Data Deleted.";
            return true;

        }


        public bool MOHMasterAdd(string DeptID
                                , string SGH_Code
                                , string SGH_ExtCode
                                , string MOH_ID
                                , string MOH_ItemCode
                                , string MOH_Price
                                , string ACHI_Code
                                , string ACHI_BLOCK
                                , string ACHI_PROCEDURE
                                , string LOINC_Code,string SGH_Desc
                                , string SFDA_Code, int operatorid)
        {

            StringBuilder sql = new StringBuilder();
            sql.Clear();
            sql.Clear();
            sql.Append(" select SGH_Code from MOHInv_CodeMappings where LTRIM(RTRIM(LOWER(SGH_Code))) = LTRIM(RTRIM(LOWER('" + SGH_Code + @"'))) and deleted = 0 ");
            DataTable dt = db.ExecuteSQLAndReturnDataTable(sql.ToString());
            if (dt.Rows.Count > 0)
            {
                this.ErrorMessage = "SGH Code Already Exist.";
                return false;
            }
            sql.Clear();

            sql.Append("  ");
            
            sql.Append(@" insert into MOHInv_CodeMappings
                       (DeptID
                        ,SGH_Code
                        ,SGH_ExtCode
                        ,MOH_ID
                        ,MOH_ItemCode
                        ,MOH_Price
                        ,ACHI_Code
                        ,ACHI_BLOCK
                        ,ACHI_PROCEDURE
                        ,LOINC_Code
                        ,SFDA_Code
                        ,SGH_Code_Description
                        ,CreatedBy
                        ,ModifiedBy
                        ,CreatedDateTime
                        ,ModifiedDateTime
                        ,Deleted
                        ) 
                        values 
                     ('" + DeptID + @"',
                        '" + SGH_Code + @"',
                        '" + SGH_ExtCode + @"',
                        '" + MOH_ID + @"',
                        '" + MOH_ItemCode + @"',
                        '" + MOH_Price + @"',
                        '" + ACHI_Code + @"',
                        '" + ACHI_BLOCK + @"',
                        '" + ACHI_PROCEDURE + @"',
                        '" + LOINC_Code + @"',
                        '" + SFDA_Code + @"',
                        '" + SGH_Desc + @"',
                        '" + operatorid + @"',
                        '" + operatorid + @"',
                        getdate(),
                        getdate(),
                        0
                        ) 
                        ");
 
            db.ExecuteSQLLive(sql.ToString());
            this.ErrorMessage = "Data Added.";
            return true;

        }





        public bool MOHMasterUpdate(string ID
                                , string DeptID
                                , string SGH_Code
                                , string SGH_ExtCode
                                , string MOH_ID
                                , string MOH_ItemCode
                                , string MOH_Price
                                , string ACHI_Code
                                , string ACHI_BLOCK
                                , string ACHI_PROCEDURE
                                , string LOINC_Code
                                , string SFDA_Code
                                , string SGH_Desc
                                , int operatorid)
        {

            StringBuilder sql = new StringBuilder();
            sql.Clear();
            sql.Append(" select SGH_Code from MOHInv_CodeMappings where LTRIM(RTRIM(LOWER(SGH_Code))) = LTRIM(RTRIM(LOWER('" + SGH_Code + @"'))) and deleted = 0 and id not in ('" + ID + @"') ");
            DataTable dt = db.ExecuteSQLAndReturnDataTable(sql.ToString());
            if (dt.Rows.Count > 0)
            {
                this.ErrorMessage = "SGH Code Already Exist.";
                return false;
            }
            sql.Clear();
            sql.Append(@"  update MOHInv_CodeMappings 

SET 
DeptID= '" + DeptID + @"' ,
SGH_Code=  '" + SGH_Code + @"' ,
SGH_ExtCode= '" + SGH_ExtCode + @"' ,
MOH_ID=  '" + MOH_ID + @"' ,
MOH_ItemCode =  '" + MOH_ItemCode + @"' ,
MOH_Price =  '" + MOH_Price + @"' ,
ACHI_Code=  '" + ACHI_Code + @"' ,
ACHI_BLOCK =  '" + ACHI_BLOCK + @"' ,
ACHI_PROCEDURE=  '" + ACHI_PROCEDURE + @"' ,
LOINC_Code=  '" + LOINC_Code + @"' ,
SFDA_Code =  '" + SFDA_Code + @"' 
,SGH_Code_Description = '" + SGH_Desc + @"' 
,ModifiedBy = " + operatorid + @"
, ModifiedDateTime = getdate()

where 
Id = " + ID + @"   ");

            sql.Append("  ");
            sql.Append(" insert into [ITADMIN].[Logs_Procedures_Items] (TableName,Name,CostPrice,Code,OperatorID,Comment )  ");
            sql.Append(" select 'MOHInv_CodeMappings',SGH_Code,MOH_Price,ACHI_Code,'" + operatorid + "','update from moh mapping' from MOHInv_CodeMappings where id = " + ID);
            sql.Append("  ");



            db.ExecuteSQLLive(sql.ToString());
            this.ErrorMessage = "Data updated.";
            return true;

        }


        public List<MohJedRiyadMastertable> MohJedRiyadMastertable(string deptid, string serviceid)
        {
            try
            {

                StringBuilder sql = new StringBuilder();
                sql.Clear();
                sql.Append("  ");

                sql.Append(@" 
                             select  A.ID
                            ,A.DeptID
                            ,ISNULL(A.SGH_Code, ' ') as SGH_Code
                            ,ISNULL(A.SGH_ExtCode, ' ') as SGH_ExtCode
                            ,ISNULL(A.MOH_ID, ' ') as MOH_ID
                            ,ISNULL(A.MOH_ItemCode, ' ') as MOH_ItemCode
                            ,ISNULL(A.MOH_Price ,0) as   MOH_Price
                            ,ISNULL(A.ACHI_Code, ' ') as ACHI_Code
                            ,ISNULL(A.ACHI_BLOCK, ' ') as ACHI_BLOCK
                            ,ISNULL(A.ACHI_PROCEDURE, ' ') as ACHI_PROCEDURE
                            ,ISNULL(A.LOINC_Code, ' ') as LOINC_Code
                            ,ISNULL(A.SFDA_Code, ' ') as SFDA_Code
                            ,ISNULL(A.SGH_Code_Description, ' ') as SGH_Code_Description
                            ,ISNULL(B.Name,' ') as DeptName
 
                            ,ISNULL(Emp_created.Name,' ') as CreatedBy
                            ,ISNULL(Emp_mod.Name,' ') as ModifiedBy
                            ,replace(convert(varchar(11),A.CreatedDateTime, 113),' ','-') CreatedDateTime
                            ,replace(convert(varchar(11),A.ModifiedDateTime, 113),' ','-') ModifiedDateTime
 
                              from MOHInv_CodeMappings A
                              left join dbo.Department B on B.ID = A.DeptID
                              left join dbo.Employee Emp_created on Emp_created.ID = A.CreatedBy  
                              left join dbo.Employee Emp_mod on Emp_mod.ID = A.ModifiedBy
                              where A.Deleted = 0
  ");


                DataTable dt = db.ExecuteSQLAndReturnDataTable(sql.ToString());
                List<MohJedRiyadMastertable> list = new List<MohJedRiyadMastertable>();
                if (dt.Rows.Count > 0) list = dt.ToList<MohJedRiyadMastertable>();
                return list;

            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public List<Moh_AchiCodes> Moh_AchiCodes()
        {
            try
            {
                StringBuilder sql = new StringBuilder();

                sql.Append(@"         Select 
                                        A.ID
                                        ,A.DeptId
                                        ,A.SGH_CODE
                                        ,A.SGH_CODE_EXT
                                        ,A.ACHI_Code
                                        ,A.ACHI_BLOCK
                                        ,A.ACHI_PROCEDURE
                                        ,B.Name as DeptName
                                         from MOHInv_ACHICodesMappingsByDept A
                                        left join dbo.Department B on A.DeptId = B.id 
                                        ");
                return db.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<Moh_AchiCodes>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }

        }
        public List<Moh_AchiCodes_Xray> Moh_AchiCodes_Xray()
        {
            try
            {
                StringBuilder sql = new StringBuilder();

                sql.Append(@" 
                            Select  ID
                    ,SGH_ItemID
                    ,SGH_CODE
                    ,SGH_CODE_EXT
                    ,SGH_Description
                    ,ACHI_Code
                    ,ACHI_BLOCK
                     from MOHInv_ACHICodesForXrayTests  
                                        ");
                return db.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<Moh_AchiCodes_Xray>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }

        }
        public List<Moh_AchiCodes_LABLoin> Moh_AchiCodes_LABLoin()
        {
            try
            {
                StringBuilder sql = new StringBuilder();

                sql.Append(@" 
                                    Select  
                                    ID
                                    ,ItemCode
                                    ,ItemName
                                    ,LOINC_Code
                                     from MOHInv_LabLOINCMappings 
                                        ");
                return db.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<Moh_AchiCodes_LABLoin>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }

        }
        public List<PharmacySFDA> PharmacySFDA()
        {
            try
            {
                StringBuilder sql = new StringBuilder();

                sql.Append(@" 
                                 Select ID
                                ,ItemCode
                                ,ItemName
                                ,SFDA_Code
                                 from MOHInv_PharmacySFDAMappings 
                                        ");
                return db.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<PharmacySFDA>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }

        }
        public List<Moh_AchiCode_LabTEST> Moh_AchiCode_LabTEST()
        {
            try
            {
                StringBuilder sql = new StringBuilder();

                sql.Append(@" 
                              Select ID
                                    ,Dept_Id
                                    ,SGH_CODE
                                    ,SGH_CODE_EXT
                                    ,ACHI_Code
                                    ,ACHI_BLOCK
                                    ,ACHI_PROCEDURE from MOHInv_ACHICodesForLabTests
                                        ");
                return db.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<Moh_AchiCode_LabTEST>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }

        }





        #endregion

        #region Loginsert
        public bool loginsert(string tablename, string name, string costprice, string code, int operatorid, string comment, string Ipadd = null)
        {
            //String strPathAndQuery = HttpContext.Current.Request.RawUrl;// HttpContext.Current.Request.Url.PathAndQuery;
            // String url = HttpContext.Current.Request.RawUrl;// HttpContext.Current.Request.Url.PathAndQuery;
            string strPathAndQuery = HttpContext.Current.Request.Url.AbsolutePath;
            String url = HttpContext.Current.Request.Url.AbsoluteUri.Replace(strPathAndQuery, "/");
          
            string sql = @" 

 if not exists(select * from sys.tables where name = 'Logs_Procedures_Items_OLD') 
 BEGIN 
   select *  into [ITADMIN].[Logs_Procedures_Items_OLD]   from [ITADMIN].[Logs_Procedures_Items]
    drop table  [ITADMIN].[Logs_Procedures_Items]
 END 

 if not exists(select * from sys.tables where name = 'Logs_Procedures_Items') 
 BEGIN 
  
 	CREATE TABLE [ITADMIN].[Logs_Procedures_Items] 
 	( 
 		[ID] [int] IDENTITY(1,1) NOT NULL, 
 		[TableName] [varchar](100) NULL, 
 		[Name] [varchar](100) NULL, 
 		[CostPrice] [varchar](50) NULL, 
 		[Code] [varchar](50) NULL, 
 		[OperatorID] [varchar](100) NULL, 
 		[Comment] [text] NULL, 
 		[DateUpdated] [datetime] default CURRENT_TIMESTAMP 
 	) ON [MasterFile] 
 END 
  
insert into itadmin.logs_procedures_items
(TableName,Name,CostPrice,Code,OperatorID,Comment)
values 
('" + tablename + @"','" + name + @"','" + costprice + @"','" + code + @"','" + operatorid + @"',HOST_NAME() +'>>" + Ipadd.ToString()+ @">>" + comment + @">>URL-" + url + @"    ') ";


            string sql1 = Regex.Replace(sql, @"\t|\n|\r|%|&|http|https", "");

            db.ExecuteSQLLive(sql1);
            return true;
        }
        #endregion


        #region bankcontroller

        public List<BANKVm> GetBankMaster()
        {
            StringBuilder sql = new StringBuilder();
            sql.Clear();
            sql.Append("  select  ID ");
            sql.Append("  ,NAME ");
            sql.Append("  ,CITY ");
            sql.Append("  ,PIN ");
            sql.Append("  ,DELETED ");
            sql.Append("  ,State ");
            sql.Append("  ,branch ");
            sql.Append("  ,operatorid ");
            sql.Append("  ,adress ");
            sql.Append("  ,BankCode ");
            sql.Append("  ,HospitalAccNo ");
            sql.Append("  ,DivisionId ");
            sql.Append("  ,site ");
            sql.Append("  ,credit_card_type ");
            sql.Append("  ,IBANNumber ");
            sql.Append("  ,AccountOpenDate ");
            sql.Append("  from  DBO.BANK where deleted = 0 ");

            DataTable dt = db.ExecuteSQLAndReturnDataTable(sql.ToString());
            List<BANKVm> list = new List<BANKVm>();
            if (dt.Rows.Count > 0) list = dt.ToList<BANKVm>();
            return list;
        }
        public bool BankMasterSave(BANKSaveVm entry)
        {

            StringBuilder sql = new StringBuilder();

            sql.Clear();
            sql.Append(" select Name  from  dbo.bank where deleted = 0 and ID <> '" + entry.ID + "'  and lower(LTRIM(RTRim(BankCode))) = lower(LTRIM(RTRim('" + entry.BankCode + "'))) ");
            DataTable dt = db.ExecuteSQLAndReturnDataTable(sql.ToString());
            if (dt.Rows.Count > 0)
            {
                this.ErrorMessage = "Bank Code already exist..";
                return false;
            }
            sql.Clear();

            sql.Append("     ");
 
            sql.Append("  declare @ID  as varchar(max) = " + entry.ID);
            sql.Append("  declare @NAME  as varchar(max) = '" + entry.NAME+"'");
            sql.Append("  declare @CITY  as varchar(max) = '" + entry.CITY + "'");
            sql.Append("  declare @State  as varchar(max) = '" + entry.State + "'");
            sql.Append("  declare @branch  as varchar(max) = '" + entry.branch + "'");
            sql.Append("  declare @adress  as varchar(max) = '" + entry.adress + "'");
            sql.Append("  declare @BankCode  as varchar(max) = '" + entry.BankCode + "'");
            sql.Append("  declare @HospitalAccNo  as varchar(max) = '" + entry.HospitalAccNo + "'");
            sql.Append("  declare @IBANNumber  as varchar(max) ='" + entry.IBANNumber + "'");

            sql.Append("   update dbo.bank SET  ");
            sql.Append("   [NAME] = COALESCE(@NAME,[NAME]), ");
            sql.Append("   [CITY] = COALESCE(@CITY,[CITY]), ");
            sql.Append("   [State] = COALESCE(@State,[State]), ");
            sql.Append("   [branch] = COALESCE(@branch,[branch]), ");
            sql.Append("   [adress] = COALESCE(@adress,[adress]), ");
            sql.Append("   [BankCode] = COALESCE(@BankCode,[BankCode]), ");
            sql.Append("   [HospitalAccNo] = COALESCE(@HospitalAccNo,[HospitalAccNo]), ");
            sql.Append("   [IBANNumber] = COALESCE(@IBANNumber,[IBANNumber]), AccountOpenDate=GETDATE() ,");
            sql.Append("   [operatorid] = COALESCE('"+entry.OperatorID+"',[operatorid]) ");
            sql.Append("   where ID = @ID  ");

            db.ExecuteSQL(sql.ToString());
            this.ErrorMessage = "Bank Master Updated...";
            return true;

        }
        public bool BankMasterNew(BANKSaveVm entry)
        {

            StringBuilder sql = new StringBuilder();
            sql.Clear();

            sql.Append(" select Name  from  dbo.bank where deleted = 0 and lower(LTRIM(RTRim(BankCode))) = lower(LTRIM(RTRim('" + entry.BankCode + "'))) ");
            DataTable dt = db.ExecuteSQLAndReturnDataTable(sql.ToString()); 
            if ( dt.Rows.Count > 0)
            {
                this.ErrorMessage = "Bank Code already exist..";
                return false;
            }


            sql.Clear();
            sql.Append("  declare @ID  as varchar(max) = " + entry.ID);
            sql.Append("  declare @NAME  as varchar(max) = '" + entry.NAME + "'");
            sql.Append("  declare @CITY  as varchar(max) = '" + entry.CITY + "'");
            sql.Append("  declare @State  as varchar(max) = '" + entry.State + "'");
            sql.Append("  declare @branch  as varchar(max) = '" + entry.branch + "'");
            sql.Append("  declare @adress  as varchar(max) = '" + entry.adress + "'");
            sql.Append("  declare @BankCode  as varchar(max) = '" + entry.BankCode + "'");
            sql.Append("  declare @HospitalAccNo  as varchar(max) = '" + entry.HospitalAccNo + "'");
            sql.Append("  declare @IBANNumber  as varchar(max) ='" + entry.IBANNumber + "'");

            sql.Append("  insert into dbo.Bank  ");
            sql.Append("  ( Name, CITY, State , branch, adress, Deleted , BankCode ");
            sql.Append("  , HospitalAccNo, IBANNumber,operatorid,AccountOpenDate) ");
            sql.Append("  VALUES  ");
            sql.Append("  ( @Name, @CITY, @State , @branch, @adress, 0 , @BankCode, @HospitalAccNo, @IBANNumber," + entry.OperatorID + ",GETDATE()) ");
 

            db.ExecuteSQL(sql.ToString());
            this.ErrorMessage = "Bank Master New...";
            return true;

        }
        public bool BankMasterDelete(BANKSaveVm entry)
        {

            StringBuilder sql = new StringBuilder();
            sql.Append("     ");

            sql.Append("  declare @ID  as varchar(max) = " + entry.ID);
 

            sql.Append("   update dbo.bank SET  ");
            sql.Append("   DELETED = 1,AccountOpenDate=GETDATE() ,"); 
            sql.Append("   [operatorid] = COALESCE('" + entry.OperatorID + "',[operatorid]) ");
            sql.Append("   where ID = @ID  ");

            db.ExecuteSQL(sql.ToString());
            this.ErrorMessage = "Bank Master Updated...";
            return true;

        }
        public List<bankbackupVM> GetBankDetails(string bankid)
        {
            StringBuilder sql = new StringBuilder();
            sql.Clear();
            sql.Append(@"select ID
,NAME
,CITY
,PIN
,DELETED
,State
,branch
,operatorid
,adress
,BankCode
,HospitalAccNo
,DivisionId
,site
,credit_card_type
,BankID
from bankbackup where deleted = 0 and  bankid = '"+bankid+"'");


            DataTable dt = db.ExecuteSQLAndReturnDataTable(sql.ToString());
            List<bankbackupVM> list = new List<bankbackupVM>();
            if (dt.Rows.Count > 0) list = dt.ToList<bankbackupVM>();
            return list;
        }

        public bool BankDetailsNew(bankbackupVM entry)
        {

            StringBuilder sql = new StringBuilder();
            sql.Clear();

            sql.Append("    select * from dbo.bankbackup where bankid = '" + entry.BankID + "' and HospitalAccNo = '" + entry.HospitalAccNo + "' and deleted = 0 ");
            DataTable dt = db.ExecuteSQLAndReturnDataTable(sql.ToString());
            if (dt.Rows.Count > 0)
            {
                this.ErrorMessage = "Bank Details already exist..";
                return false;
            }


            sql.Clear();
            sql.Append("  declare @HospitalAccNo varchar(30) = '" + entry.HospitalAccNo + "' ");
            sql.Append("  declare @bankId int = '" + entry.BankID + "' ");
            sql.Append("  declare @operatorid int = '" + entry.operatorid + "' ");
            sql.Append("  declare @credit_card_type varchar(100) = '" + entry.credit_card_type + "' ");
            sql.Append("  ");
            sql.Append("  declare @site varchar(10)");
            sql.Append("  declare @NAME varchar(200)");
            sql.Append("  ");
            sql.Append("  select @NAME = Name from dbo.bank where id = @bankId and deleted = 0");
            sql.Append("  ");
            sql.Append("  select top 1 @site = IssueAuthorityCode   from OrganisationDetails");
            sql.Append("  set @NAME = UPPER(LTRIM(RTRIM(@NAME))) +'-'+@HospitalAccNo");
            sql.Append("  ");
            sql.Append("  insert into dbo.bankbackup (NAME,CITY,PIN,DELETED,State,branch,operatorid,adress,BankCode,HospitalAccNo,DivisionId,site,credit_card_type,BankID)");
            sql.Append("  values (@NAME,NULL,NULL,0,NULL,NULL,@operatorid,NULL,NULL,@HospitalAccNo,1,@site,@credit_card_type,@bankId)");


            db.ExecuteSQL(sql.ToString());
            this.ErrorMessage = "Bank Details New...";
            return true;

        }
        public bool BankDetailsDelete(bankbackupVM entry)
        {

            StringBuilder sql = new StringBuilder();
            sql.Append("     ");

            sql.Append("  declare @ID  as varchar(max) = " + entry.ID);


            sql.Append("   update dbo.bankbackup SET  ");
            sql.Append("   DELETED = 1, ");
            sql.Append("   [operatorid] = COALESCE('" + entry.operatorid + "',[operatorid]) ");
            sql.Append("   where ID = @ID  ");

            db.ExecuteSQL(sql.ToString());
            this.ErrorMessage = "Bank Details Updated...";
            return true;

        }
        public bool BankDetailsUpdate(bankbackupVM entry)
        {

            StringBuilder sql = new StringBuilder();
            sql.Clear();

            sql.Append("   select * from dbo.bankbackup where BankId = '" + entry.BankID + "' and HospitalAccNo = '" + entry.HospitalAccNo + "'  and id <> '" + entry.ID + "' and deleted = 0 ");
            DataTable dt = db.ExecuteSQLAndReturnDataTable(sql.ToString());
            if (dt.Rows.Count > 0)
            {
                this.ErrorMessage = "Bank Details/ Hospital AccNo already exist..";
                return false;
            }


            sql.Clear();
            sql.Append("   declare @HospitalAccNo varchar(30) = '" + entry.HospitalAccNo + "' ");
            sql.Append("   declare @bankId int = '" + entry.BankID + "'  ");
            sql.Append("   declare @bankBackUpId int = '" + entry.ID + "'  ");
            sql.Append("   declare @operatorid int = '" + entry.operatorid + "'  ");
            sql.Append("   declare @credit_card_type varchar(100) = '" + entry.credit_card_type + "'  ");
            sql.Append("     ");
            sql.Append("   declare @site varchar(10) ");
            sql.Append("   declare @NAME varchar(200) ");
            sql.Append("    ");
            sql.Append("   select @NAME = Name from dbo.bank where id = @bankId and deleted = 0 ");
            sql.Append("     ");
            sql.Append("   set @NAME = UPPER(LTRIM(RTRIM(@NAME))) +'-'+@HospitalAccNo ");
            sql.Append("    ");
            sql.Append("   update dbo.bankbackup ");
            sql.Append("   SET ");
            sql.Append("   [operatorid] = COALESCE(@operatorid,[operatorid]), ");
            sql.Append("   [NAME] = COALESCE(@NAME,[NAME]), ");
            sql.Append("   [credit_card_type] = COALESCE(@credit_card_type,[credit_card_type]), ");
            sql.Append("   [HospitalAccNo] = COALESCE(@HospitalAccNo,[HospitalAccNo]) ");
            sql.Append("   where ID = @bankBackUpId  ");

            db.ExecuteSQL(sql.ToString());
            this.ErrorMessage = "Bank Details Updated...";
            return true;

        }
        #endregion

        #region OPCancelReceiptApproval
        public List<OPCancelReceiptApprovalViewVM> ViewData_OPCancelReceiptApproval(string billno)
        {
            StringBuilder sql = new StringBuilder();
            sql.Clear();
            sql.Append("   ");
            sql.Append("   select a.opbillid,a.Billdatetime,case when dateadd(dd,30,a.Billdatetime) < getdate() then 'yes' else 'no' end as cancellationperiod,   ");
            sql.Append("   a.registrationno,    ");
            sql.Append("   b.familyname + ' ' + b.firstname + ' ' + b.middlename + ' ' + b.lastname as PatientName,    ");
            sql.Append("   a.billno,c.name Service,sum(a.billamount) billamount,    ");
            sql.Append("   d.appdatetime, isnull(d.reason,'') reason,    ");
            sql.Append("   sum(a.discount) discount,sum(a.paidamount) paidamount,sum(a.balance) balance    ");
            sql.Append("   from opcompanybilldetail a    ");
            sql.Append("   left join patient b on a.registrationno = b.registrationno    ");
            sql.Append("   left join opbservice c on a.serviceid = c.id    ");
            sql.Append("   left join OPCancelReceiptApproval d on a.opbillid = d.opbillid    ");
            sql.Append("   where  a.billno = '"+billno+"'  and   isnull(d.deleted,0)=0    ");
            sql.Append("   group by a.Billdatetime,a.opbillid, a.registrationno, b.familyname + ' ' + b.firstname + ' ' + b.middlename + ' ' +  b.lastname ,  a.billno,c.name,d.appdatetime,d.reason   ");



            return db.ExecuteSQLAndReturnDataTable(sql.ToString()).DataTableToList<OPCancelReceiptApprovalViewVM>();
        }

        public bool OPCancelReceiptApprovalSAVE(OPCancelReceiptApprovalSaveVM entry)
        {

            try
            {
                StringBuilder sql = new StringBuilder();

             
                    sql.Clear();
                    sql.Append("   ");
                    sql.Append(" if exists(select * from dbo.OPCancelReceiptApproval where opbillid = '" + entry.OPBillID + "' and deleted = 0) ");
                    sql.Append(" begin  ");
                   sql.Append(" select  ' opbillid already exists!' as Message , 1 as Error ");
                    sql.Append(" return;  ");
                    sql.Append(" end  ");
                    sql.Append("   ");
                    sql.Append(" Insert into OPCancelReceiptApproval(opbillid,appdatetime,operatorid,reason,status,deleted) ");
                    sql.Append("   values(" + entry.OPBillID + ",getdate()," + entry.OperatorID + ",'" + entry.Reason + "',0,0) ");
                    sql.Append(" select  'Save Successfully.' as Message , 0 as Error ");

               
               

                List<SqlMessage> dt = db.ExecuteSQLAndReturnDataTable(sql.ToString()).DataTableToList<SqlMessage>();
                // DataTable dt = db.ExecuteSQLAndReturnDataTable(sql.ToString());
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

        #endregion

    }


    #region dosage form DAL
    public class ServiceCategoryDashboard
    {
        public int slno { get; set; }
        public string CategoryName { get; set; }
        public string CategoryId { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string ItemId { get; set; }
        public string DeptName { get; set; }
        public string ServiceCatId { get; set; }

    }
    public class DosageFormMaster
    {
        public int slno { get; set; }
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }
    public class DosageFormMasterEntry
    {
        public int slno { get; set; }
        public int Id { get; set; }
        public string Action { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }
    public class ServiceCatSaveEntry
    {
        public int slno { get; set; }
        public int Id { get; set; }
        public string Action { get; set; }
        public string ItemId { get; set; }
        public string ServiceCatId { get; set; }
    }
    public class SqlMessage
    {
        public string Message { get; set; }
        public string Error { get; set; }
    }
    #endregion

    #region CountryControllerDal

    public class CountryDal
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ArabicName { get; set; }
        public string IsoCode { get; set; }
        public string NumCode { get; set; }
        public string PhoneCode { get; set; }
        public string FlagLogo { get; set; }

    }
    public class CityDal
    {
        public string CountryName { get; set; }
        public string CityName { get; set; }
        public string IsoCode { get; set; }
        public string PhoneCode { get; set; }
        public string CityId { get; set; }
        public string CountryId { get; set; }
        public int Deleted { get; set; }

    }
    public class CountrySaveDal
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ArabicName { get; set; }
        public string IsoCode { get; set; }
        public string NumCode { get; set; }
        public string PhoneCode { get; set; }
        public string FlagLogo { get; set; }
        public string CityName { get; set; }

    }

    public class CitySaveDal
    {
        public int Id { get; set; }
        public List<CityNameDal> CityName { get; set; }

    }
    public class CityNameDal
    {
        public string cityname { get; set; }
    }

    public class UpdateCityDal
    {
        public int Id { get; set; }
        public string CityName { get; set; }

    }


    #endregion

    #region ModuleViewControllerDAL
    public class ModuleViewDashboarddal
    {
        public string Department { get; set; }
        public string Designation { get; set; }
        public string EmployeeID { get; set; }
        public string EmpName { get; set; }
        public string EmpDateStart { get; set; }
        public string datetime { get; set; }
        public string ModuleName { get; set; }
        public string Name { get; set; }
        public string MenuURL { get; set; }
        public string FunctionName { get; set; }

        public string ModuleId { get; set; }
        public string FeatureId { get; set; }
        public string FunctionID { get; set; }
        public string UserId { get; set; }

    }

    #endregion

    #region MOHCodesMappingDAL

    public class MohJedRiyadMastertable
    {
        public string ID { get; set; }
        public string DeptID { get; set; }
        public string SGH_Code { get; set; }
        public string SGH_ExtCode { get; set; }
        public string MOH_ID { get; set; }
        public string MOH_ItemCode { get; set; }
        public string MOH_Price { get; set; }
        public string ACHI_Code { get; set; }
        public string ACHI_BLOCK { get; set; }
        public string ACHI_PROCEDURE { get; set; }
        public string LOINC_Code { get; set; }
        public string SFDA_Code { get; set; }
        public string DeptName { get; set; }
        public string SGH_Code_Description { get; set; }

        public string CreatedBy { get; set; }
        public string ModifiedBy { get; set; }
        public string CreatedDateTime { get; set; }
        public string ModifiedDateTime { get; set; }


    }

    public class Moh_AchiCodes
    {
        public string ID { get; set; }
        public string DeptId { get; set; }
        public string SGH_CODE { get; set; }
        public string SGH_CODE_EXT { get; set; }
        public string ACHI_Code { get; set; }
        public string ACHI_BLOCK { get; set; }
        public string ACHI_PROCEDURE { get; set; }
        public string DeptName { get; set; }
    }
    public class Moh_AchiCodes_Xray
    {
        public string ID { get; set; }
        public string SGH_ItemID { get; set; }
        public string SGH_CODE { get; set; }
        public string SGH_CODE_EXT { get; set; }
        public string SGH_Description { get; set; }
        public string ACHI_Code { get; set; }
        public string ACHI_BLOCK { get; set; }

    }
    public class Moh_AchiCodes_LABLoin
    {
        public string ID { get; set; }
        public string ItemCode { get; set; }
        public string ItemName { get; set; }
        public string LOINC_Code { get; set; }

    }
    public class PharmacySFDA
    {
        public string ID { get; set; }
        public string ItemCode { get; set; }
        public string ItemName { get; set; }
        public string SFDA_Code { get; set; }

    }
    public class Moh_AchiCode_LabTEST
    {
        public string ID { get; set; }

        public string Dept_Id { get; set; }
        public string SGH_CODE { get; set; }
        public string SGH_CODE_EXT { get; set; }
        public string ACHI_Code { get; set; }
        public string ACHI_BLOCK { get; set; }
        public string ACHI_PROCEDURE { get; set; }

    }



    #endregion


    #region bankcontrollerDAL

    public class BANKVm
    {
        public int ID { get; set; }

        public string NAME { get; set; }

        public string CITY { get; set; }

        public string PIN { get; set; }

        public short? DELETED { get; set; }

        public string State { get; set; }

        public string branch { get; set; }

        public int? operatorid { get; set; }

        public string adress { get; set; }

        public string BankCode { get; set; }

        public string HospitalAccNo { get; set; }

        public int? DivisionId { get; set; }

        public string site { get; set; }

        public string credit_card_type { get; set; }

        public string IBANNumber { get; set; }

        public DateTime? AccountOpenDate { get; set; }

    }
    public class BANKSaveVm
    {
        public int ID { get; set; }
        public int OperatorID { get; set; }
        public string NAME { get; set; }
        public string CITY { get; set; }
        public string State { get; set; }
        public string branch { get; set; }
        public string adress { get; set; }
        public string BankCode { get; set; }
        public string HospitalAccNo { get; set; }
        public string IBANNumber { get; set; }
    }

    public class bankbackupVM
    {
        public int ID { get; set; }

        public string NAME { get; set; }

        public string CITY { get; set; }

        public string PIN { get; set; }

        public short? DELETED { get; set; }

        public string State { get; set; }

        public string branch { get; set; }

        public int? operatorid { get; set; }

        public string adress { get; set; }

        public string BankCode { get; set; }

        public string HospitalAccNo { get; set; }

        public int? DivisionId { get; set; }

        public string site { get; set; }

        public string credit_card_type { get; set; }

        public int BankID { get; set; }

    }

    #endregion

    #region OPCancelReceiptApproval
    public class OPCancelReceiptApprovalSaveVM
    {
        public int OPBillID { get; set; }
        public int OperatorID { get; set; }
        public string Reason { get; set; }
 
    }
  public class OPCancelReceiptApprovalViewVM
    {
            public string opbillid { get; set; }
            public string registrationno { get; set; }
            public string cancellationperiod { get; set; }
      
            public string PatientName  { get; set; }
            public string billno { get; set; }
            public string Service  { get; set; }
            public string billamount { get; set; }
            public string appdatetime  { get; set; }
            public string reason { get; set; }
            public string discount { get; set; }
            public string paidamount   { get; set; }
            public string balance { get; set; }
    }

    #endregion



    #region New Tariff PAGE 
    public class GenerateTariffModel
    {
        public string ErrorMessage { get; set; }
        DBHelper db = new DBHelper();
        ExceptionLogging elog = new ExceptionLogging();

       
        public List<GT_TariffModel> TariffList()
        {
            try
            {
                return db.ExecuteSQLAndReturnDataTableLive(" select id,cast(Id as varchar(max))+'-'+cast(name as varchar(max)) as name, name as text from his.dbo.tariff where Deleted =0 order by name   ").DataTableToList<GT_TariffModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public List<GT_ServiceModel> servicelist()
        {

            StringBuilder sql = new StringBuilder();
            sql.Clear();
            sql.Append(@"   select * into #tmplistservicewithnoprice from ipbservice where pricetype <> 2 and PriceTable <> 'NoPrice' and Deleted = 0
                             SELECT A.ID AS id,cast(A.ID as varchar(max)) +'-'+ cast(A.ServiceName as varchar(max))   as name, A.ServiceName as text
                            , CASE WHEN A.ID In(select ID from #tmplistservicewithnoprice) THEN 0 ELSE 1 END as ServiceType
			                        FROM dbo.IPBservice a
                                    WHERE A.Deleted = 0
                                        AND A.OrderType <> 5
                                        AND A.PriceType <> 3
                                        AND A.PriceType <> 0
                                    ORDER BY A.ServiceName
                            drop table #tmplistservicewithnoprice		
                          ");


            try
            {
                return db.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<GT_ServiceModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public List<GT_TariffModel> itemlist(int serviceid)
        {

            StringBuilder sql = new StringBuilder();
            sql.Clear();
            sql.Append(@"DECLARE @MasterTable VARCHAR(30), @SQL NVARCHAR(2000) ,@serviceId int
		 
                    set @serviceId = "+ serviceid + @"

                    SELECT @MasterTable = MasterTable FROM dbo.IPBservice WHERE ID = @serviceId
	
 
                    IF @serviceId != 15
	                BEGIN			 
		                SET @SQL = N' SELECT ID, Code +''-''+ cast(Name as varchar(max)) as name , Code +''-''+ cast(Name as varchar(max)) as text FROM dbo.' + @MasterTable + '  WHERE  DELETED = 0 ' 
	                END
	                ELSE
	                BEGIN			 
		                SET @SQL = N' SELECT ID, EmpCode +''-''+ cast(Name as varchar(max)) as name , EmpCode +''-''+ cast(Name as varchar(max)) as text FROM dbo.' + @MasterTable + '  WHERE  DELETED = 0 '  
	                END

	                EXEC sp_executesql @sql 		
                          ");


            try
            {
                return db.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<GT_TariffModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public List<GT_TariffModel> bedtypelist()
        {

            StringBuilder sql = new StringBuilder();
            sql.Clear();
            sql.Append(@"  select 'ALL' as id,'0-ALL Bed Class' as name, '0-ALL Bed Class' as text
                            union all
                            select cast(id as varchar(max)) as id, cast(id as varchar(max))+'-'+cast(name as varchar(max)) as name, name as text from BedType where deleted = 0 
                       ");


            try
            {
                return db.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<GT_TariffModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public List<GT_CurrentPriceDal> CurrentTariffPrice_IP(string TariffID, string ServiceID, string ItemId, string BedType )
        {

            try
            {

                if (BedType.Contains("ALL"))
                {
                    BedType = "ALL";
                }
              


                db.param = new SqlParameter[]{
                new SqlParameter("TariffID", TariffID),
                new SqlParameter("ServiceID", ServiceID),
                new SqlParameter("ItemId", ItemId),
                new SqlParameter("BedType", BedType) 
                };
                return db.ExecuteSPAndReturnDataTable("[ITADMIN].[GenerateTariff_IP_CURRENTPRICELIST]").DataTableToList<GT_CurrentPriceDal>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public bool SaveNewPrice(SaveNewPriceDal entry,int OperatorId)
        {

            try
            {
               // List<SaveNewPriceDalList> Xmldal = new List<SaveNewPriceDalList>();
               // Xmldal.Add(entry.SaveNewPriceDalList);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@XmlDal",entry.SaveNewPriceDalList.ListToXml("XmlDal"))
                    ,new SqlParameter("@OperatorId",OperatorId)

                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.GenerateTariff_IP_SAVENEWPRICE");
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





    public class GT_TariffModel
    {
        public string id { get; set; }
        public string name { get; set; }
        public string text { get; set; }
    }
    public class GT_ServiceModel
    {
        public string id { get; set; }
        public string name { get; set; }
        public string text { get; set; }
        public string ServiceType { get; set; }
    }
    public class GT_CurrentPriceDal
    { 
        public string ServiceName { get; set; }
        public string BedName { get; set; }
        public string ItemId { get; set; }
        public string ItemName { get; set; }
        public int Price { get; set; }
        public string StartDateTime { get; set; }
        public string EndDateTime { get; set; }
        public string OperatorName { get; set; }
        public string Css { get; set; }
        

    }
     
    public class SaveNewPriceDal
    {
        public int OperatorID { get; set; }
        public List<SaveNewPriceDalList> SaveNewPriceDalList { get; set; }    
     }
    public class SaveNewPriceDalList
    {
            public string rowid { get; set; }
            public string TariffID { get; set; }
            public string ServiceID { get; set; }
            public string ItemId { get; set; }
            public string BedType { get; set; }
            public string price { get; set; }
            public string date { get; set; }
 
    }
    #endregion
}
