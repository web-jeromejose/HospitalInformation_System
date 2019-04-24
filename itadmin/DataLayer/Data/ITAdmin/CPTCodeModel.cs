using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Globalization;
using System.Data;
using System.ComponentModel;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Web;
using System.Data.SqlClient;


namespace DataLayer
{


    public class CPTCodeModel
    {

        public string ErrorMessage { get; set; }
        DBHelper db = new DBHelper();

        #region CPTCODE
        public List<CPTCodeDal> Dashboard()
        {
            StringBuilder sql = new StringBuilder();
            sql.Clear();

           sql.Append("   ");
           sql.Append(" select 'OTHER-PROCEDURE' as TableName,B.NAME AS DeptName,A.Id,A.DepartmentId,A.Code,A.Name,ISNULL(A.CostPrice,0) as CostPrice   ");
           sql.Append(" FROM otherprocedures A  ");
           sql.Append(" LEFT JOIN DBO.Department B ON A.DepartmentID = B.ID ");
           sql.Append(" where A.deleted = 0 ");
           sql.Append(" UNION ALL ");
           sql.Append(" select 'NURSING-ADMINISTRATION' as TableName,B.NAME AS DeptName,A.Id,A.DepartmentId,A.Code,A.Name,ISNULL(A.CostPrice,0) as CostPrice   ");
           sql.Append(" FROM BedsideProcedure A  ");
           sql.Append(" LEFT JOIN DBO.Department B ON A.DepartmentID = B.ID ");
           sql.Append(" where A.deleted = 0 ");
           sql.Append(" UNION ALL ");
           sql.Append(" select 'Anaesthesia' as TableName,B.NAME AS DeptName,A.Id,A.DepartmentId,A.Code,A.Name,ISNULL(A.CostPrice,0) as CostPrice   ");
           sql.Append(" FROM Anaesthesia A  ");
           sql.Append(" LEFT JOIN DBO.Department B ON A.DepartmentID = B.ID ");
           sql.Append(" where A.deleted = 0 ");
           sql.Append(" UNION ALL ");
           sql.Append(" select 'HOMECARE-MAPPING' as TableName,B.NAME AS DeptName,A.Id,A.DepartmentId,A.Code,A.Name,ISNULL(A.CostPrice,0) as CostPrice   ");
           sql.Append(" FROM Test A  ");
           sql.Append(" LEFT JOIN DBO.Department B ON A.DepartmentID = B.ID ");
           sql.Append(" where A.deleted = 0 ");
           sql.Append(" UNION ALL ");
           sql.Append(" select 'PT-PROCEDURE' as TableName,B.NAME AS DeptName,A.Id,A.DepartmentId,A.Code,A.Name,ISNULL(A.CostPrice,0) as CostPrice   ");
           sql.Append(" FROM ptprocedure A  ");
           sql.Append(" LEFT JOIN DBO.Department B ON A.DepartmentID = B.ID ");
           sql.Append(" where A.deleted = 0 ");
           sql.Append(" UNION ALL ");
           sql.Append(" select 'OR-SURGERY' as TableName,B.NAME AS DeptName,A.Id,A.DepartmentId,A.Code,A.Name,ISNULL(A.CostPrice,0) as CostPrice   ");
           sql.Append(" FROM Surgery A  ");
           sql.Append(" LEFT JOIN DBO.Department B ON A.DepartmentID = B.ID ");
           sql.Append(" where A.deleted = 0 ");
           sql.Append("  UNION ALL  ");
           sql.Append("  select case when a.type = 1 then 'bloodcrossmatch' else  case when a.type = 2 then 'bloodcomponent' else  case when a.type = 3 then 'blooddonation' end end end as TableName  ");
           sql.Append("  ,B.NAME AS DeptName ,A.Id ,A.DepartmentId ,A.Code,A.Name,ISNULL(A.CostPrice,0) as CostPrice  from component a  LEFT JOIN DBO.Department B ON A.DepartmentID = B.ID  ");
           sql.Append("  where a.deleted = 0 and B.ID is not null ");
           sql.Append("  UNION ALL  ");
           sql.Append("  Select 'MISC-Items' as TableName ,B.NAME AS DeptName ,A.Id ,A.DepartmentId ,A.Code,A.Name,ISNULL(A.Amount,0) as CostPrice ");
           sql.Append("  from miscitems a  LEFT JOIN DBO.Department B ON A.DepartmentID = B.ID  where a.deleted = 0 ");
           
            DataTable dt = db.ExecuteSQLAndReturnDataTable(sql.ToString());
            List<CPTCodeDal> list = new List<CPTCodeDal>();
            if (dt.Rows.Count > 0) list = dt.ToList<CPTCodeDal>();
                return list;
        }
        public bool Save(CPTSaveDal entry)
        {

                StringBuilder sql = new StringBuilder();
                sql.Clear();
                sql.Append("  ");

                sql.Append("  ");
                sql.Append("  ");
                sql.Append(" declare @type varchar(max) = '" + entry.type + "' ");
                sql.Append(" declare @table varchar(max) = '" + entry.table + "' ");
                sql.Append(" declare @itemid varchar(max) = '" + entry.id + "' ");
                sql.Append(" declare @value varchar(max) = '" + entry.value + "' ");
                sql.Append(" declare @operatorid varchar(max) = '" + entry.OperatorId + "' ");
                sql.Append("  ");
                sql.Append(" declare @codename varchar(max) ");
                sql.Append(" declare @itemname varchar(max)   ");
                sql.Append(" declare @costprice varchar(max)   ");
                sql.Append("  ");
                sql.Append(" if not exists(select * from sys.tables where name = 'Logs_Procedures_Items') ");
                sql.Append(" BEGIN ");
                sql.Append("  ");
                sql.Append(" 	CREATE TABLE [ITADMIN].[Logs_Procedures_Items] ");
                sql.Append(" 	( ");
                sql.Append(" 		[ID] [int] IDENTITY(1,1) NOT NULL, ");
                sql.Append(" 		[TableName] [varchar](100) NULL, ");
                sql.Append(" 		[Name] [varchar](100) NULL, ");
                sql.Append(" 		[CostPrice] [varchar](50) NULL, ");
                sql.Append(" 		[Code] [varchar](50) NULL, ");
                sql.Append(" 		[OperatorID] [varchar](100) NULL, ");
                sql.Append(" 		[Comment] [varchar](100) NULL, ");
                sql.Append(" 		[DateUpdated] [datetime] default CURRENT_TIMESTAMP ");
                sql.Append(" 	) ON [MasterFile] ");
                sql.Append(" END ");
                sql.Append("  ");
               // sql.Append(" --SET VARIABLES ");
                sql.Append(" set @table = LTRIM(RTRIM(LOWER(@table))); ");
                sql.Append(" set @type = LTRIM(RTRIM(LOWER(@type))); ");
                sql.Append("  ");
                sql.Append(" if(@type = 'costprice') ");
                sql.Append(" BEGIN ");
                sql.Append(" SET @costprice = @value; ");
                sql.Append(" END ");
                sql.Append("  ");
                sql.Append(" if(@type = 'itemname') ");
                sql.Append(" BEGIN ");
                sql.Append(" SET @itemname = @value; ");
                sql.Append(" END ");
                sql.Append("  ");
                sql.Append(" if(@type = 'code') ");
                sql.Append(" BEGIN ");
                sql.Append(" SET @codename = @value; ");
                sql.Append(" END ");
                sql.Append("  ");
                sql.Append(" if(@table = LTRIM(RTRIM(LOWER('other-procedure')))) ");
                sql.Append(" BEGIN ");
                sql.Append(" 		if exists(select *  FROM otherprocedures A where id = @itemid and deleted = 0 ) ");
                sql.Append(" 		BEGIN ");
                sql.Append("  ");
                sql.Append(" 			UPDATE otherprocedures SET ");
                sql.Append(" 			[Code] = COALESCE(@codename,[Code]), ");
                sql.Append(" 			[Name] = COALESCE(@itemname,[Name]), ");
                sql.Append(" 			[CostPrice] = COALESCE(@costprice,[CostPrice]) ");
                sql.Append(" 			where id = @itemid and deleted = 0  ");
                sql.Append("  ");
                sql.Append(" 		END ");
                sql.Append(" END ");
                sql.Append("  ");
                sql.Append("  ");
                sql.Append(" if(@table = LTRIM(RTRIM(LOWER('NURSING-ADMINISTRATION'))) ) ");
                sql.Append(" BEGIN ");
                sql.Append(" 		if exists(select *  FROM BedsideProcedure A where id = @itemid and deleted = 0 ) ");
                sql.Append(" 		BEGIN ");
                sql.Append("  ");
                sql.Append(" 			UPDATE BedsideProcedure SET ");
                sql.Append(" 			[Code] = COALESCE(@codename,[Code]), ");
                sql.Append(" 			[Name] = COALESCE(@itemname,[Name]), ");
                sql.Append(" 			[CostPrice] = COALESCE(@costprice,[CostPrice]) ");
                sql.Append(" 			where id = @itemid and deleted = 0  ");
                sql.Append("  ");
                sql.Append(" 		END ");
                sql.Append(" END ");
                sql.Append("  ");
                sql.Append(" if(@table = LTRIM(RTRIM(LOWER('Anaesthesia'))) ) ");
                sql.Append(" BEGIN ");
                sql.Append(" 		if exists(select *  FROM Anaesthesia A where id = @itemid and deleted = 0 ) ");
                sql.Append(" 		BEGIN ");
                sql.Append("  ");
                sql.Append(" 			UPDATE Anaesthesia SET ");
                sql.Append(" 			[Code] = COALESCE(@codename,[Code]), ");
                sql.Append(" 			[Name] = COALESCE(@itemname,[Name]), ");
                sql.Append(" 			[CostPrice] = COALESCE(@costprice,[CostPrice]) ");
                sql.Append(" 			where id = @itemid and deleted = 0  ");
                sql.Append("  ");
                sql.Append(" 		END ");
                sql.Append(" END ");
                sql.Append("  ");
                sql.Append("  if(@table = LTRIM(RTRIM(LOWER('HOMECARE-MAPPING'))) ) ");
                sql.Append(" BEGIN ");
                sql.Append(" 		if exists(select *  FROM Test A where id = @itemid and deleted = 0 ) ");
                sql.Append(" 		BEGIN ");
                sql.Append("  ");
                sql.Append(" 			UPDATE Test SET ");
                sql.Append(" 			[Code] = COALESCE(@codename,[Code]), ");
                sql.Append(" 			[Name] = COALESCE(@itemname,[Name]), ");
                sql.Append(" 			[CostPrice] = COALESCE(@costprice,[CostPrice]) ");
                sql.Append(" 			where id = @itemid and deleted = 0  ");
                sql.Append("  ");
                sql.Append(" 		END ");
                sql.Append(" END ");
                sql.Append("  ");
                sql.Append("  ");
                sql.Append("  if(@table = LTRIM(RTRIM(LOWER('PT-PROCEDURE'))) ) ");
                sql.Append(" BEGIN ");
                sql.Append(" 		if exists(select *  FROM ptprocedure A where id = @itemid and deleted = 0 ) ");
                sql.Append(" 		BEGIN ");
                sql.Append("  ");
                sql.Append(" 			UPDATE ptprocedure SET ");
                sql.Append(" 			[Code] = COALESCE(@codename,[Code]), ");
                sql.Append(" 			[Name] = COALESCE(@itemname,[Name]), ");
                sql.Append(" 			[CostPrice] = COALESCE(@costprice,[CostPrice]) ");
                sql.Append(" 			where id = @itemid and deleted = 0  ");
                sql.Append("  ");
                sql.Append(" 		END ");
                sql.Append(" END ");
                sql.Append("  ");
                sql.Append("  ");
                sql.Append("  ");
                sql.Append("  if(@table = LTRIM(RTRIM(LOWER('OR-SURGERY'))) ) ");
                sql.Append(" BEGIN ");
                sql.Append(" 		if exists(select *  FROM Surgery A where id = @itemid and deleted = 0 ) ");
                sql.Append(" 		BEGIN ");
                sql.Append("  ");
                sql.Append(" 			UPDATE Surgery SET ");
                sql.Append(" 			[Code] = COALESCE(@codename,[Code]), ");
                sql.Append(" 			[Name] = COALESCE(@itemname,[Name]), ");
                sql.Append(" 			[CostPrice] = COALESCE(@costprice,[CostPrice]) ");
                sql.Append(" 			where id = @itemid and deleted = 0  ");
                sql.Append("  ");
                sql.Append(" 		END ");
                sql.Append(" END ");

                sql.Append(" if( @table = LTRIM(RTRIM(LOWER('MISC-Items'))) )  BEGIN   ");
                sql.Append(" if exists(select *  FROM MiscItems A where id = @itemid and deleted = 0 )        ");
                sql.Append(" BEGIN           ");
                sql.Append(" UPDATE MiscItems SET  [Code] = COALESCE(@codename,[Code]),      [Name] = COALESCE(@itemname,[Name]),  ");
                sql.Append(" [Amount] = COALESCE(@costprice,[Amount])                ");
                sql.Append(" where id = @itemid and deleted = 0                                ");
                sql.Append(" END   ");
                sql.Append(" END   ");
                sql.Append("  ");
                sql.Append(" if(@table = LTRIM(RTRIM(LOWER('bloodcrossmatch'))) OR @table = LTRIM(RTRIM(LOWER('bloodcomponent'))) OR @table = LTRIM(RTRIM(LOWER('blooddonation')))    )  BEGIN   ");
                sql.Append(" if exists(select *  FROM component A where id = @itemid and deleted = 0 )        ");
                sql.Append(" BEGIN           ");
                sql.Append(" UPDATE component SET  [Code] = COALESCE(@codename,[Code]),      [Name] = COALESCE(@itemname,[Name]),  ");
                sql.Append(" [Costprice] = COALESCE(@costprice,[Costprice])               ");
                sql.Append(" where id = @itemid and deleted = 0            ");
                sql.Append("  ");
                sql.Append(" END   ");
                sql.Append(" END  ");

                sql.Append("  ");
                sql.Append("  ");
                sql.Append(" insert into [ITADMIN].[Logs_Procedures_Items] (TableName,Name,CostPrice,Code,OperatorID,Comment )  ");
                sql.Append(" values (@table,@itemname,@costprice,@codename,cast(@operatorid as varchar(max)),'this is the log for editing price procedures code name in all known tables') ");
                sql.Append("  ");
                sql.Append("  ");


                db.ExecuteSQLLive(sql.ToString());
                this.ErrorMessage = "Procedure Item Save"; 
                return true;

        }
        #endregion  

        #region ALLPRocedure
        public List<AllProcDal> AllprocDashboard(string deptid , string OPBServiceId,string IPServiceId)
        {
        
      
            string sql1 = "";
            sql1 = @"   
                                declare @opbserviceid varchar(max) = '" + OPBServiceId + @"'
                                declare @ipbserviceid varchar(max) = '" + IPServiceId + @"'
                                declare @deptid varchar(max) = '" +deptid+@"'
                                declare @subdeptid varchar(max) = '0'

                                 select  ISNULL(A.BLCOD , ' ') as  BLCOD
                                        ,ISNULL(A.BLDESC , ' ') as BLDESC
                                        ,ISNULL(A.[DEPT CODE] , ' ') as DeptCode
                                        ,ISNULL(A.DEPTDESC , ' ') as DEPTDESC
                                        ,ISNULL(A.SERVTYP , ' ') as SERVTYP
                                        ,ISNULL(A.[Service Type]  , ' ') as ServiceType 
                                        ,ISNULL(A.PACKAGE , ' ') as PACKAGE
                                        ,ISNULL(A.STDFEE , ' ') as STDFEE
                                        ,ISNULL(A.CONSTYPE , ' ') as CONSTYPE
                                        ,ISNULL(A.CPTCODE , ' ') as CPTCODE
                                        ,ISNULL(A.SERGRPDESC , ' ') as SERGRPDESC
                                        ,ISNULL(A.SUBDEPTCOD , ' ') as SUBDEPTCOD
                                        ,ISNULL(A.SUBDEPTDES  , ' ') as SUBDEPTDES
                                        ,ISNULL(A.ACTTYPDESC , ' ') as ACTTYPDESC
                                        ,ISNULL(A.OPBServiceID , ' ') as OPBServiceID
                                        ,ISNULL(A.IPBServiceID , ' ') as IPBServiceID
                                        ,ISNULL(A.OperationType , ' ') as OperationType
                                        ,ISNULL(A.HIS_DepartmentId , ' ') as HIS_DepartmentId
                                        ,ISNULL(A.HIS_SubDeptId , ' ') as HIS_SubDeptId
                                        ,ISNULL(ipb.ServiceName,' ') as IpServiceName,
                                ISNULL(opb.Name,' ') as OpServiceName,
                                ISNULL(dp.Name,' ') as DepartmentName,
                                ISNULL(subdp.Name,' ') as SubDeptName 

                                from Temp_Service_list_mapped A
                                left join dbo.IPBService ipb on ipb.ID = A.IPBServiceID
                                left join dbo.Department dp on dp.id = A.HIS_DepartmentId
                                left join dbo.Section subdp on subdp.DeptId = dp.id and subdp.id = A.HIS_SubDeptId
                                left join dbo.OPBService opb on opb.Id  = A.OPBServiceID

                                where (@opbserviceid = '0' OR @opbserviceid = A.OPBServiceID)
                                and (@ipbserviceid = '0' OR @ipbserviceid = A.IPBServiceID)
                                and (@deptid = '0' OR @deptid = A.HIS_DepartmentId)
                                and (@subdeptid = '0' OR @subdeptid = A.HIS_SubDeptId) ";
        

       
           sql1 = Regex.Replace(sql1, @"\t|\n|\r", "");
        
            DataTable dt = db.ExecuteSQLAndReturnDataTable(sql1);
            List<AllProcDal> list = new List<AllProcDal>();
            if (dt.Rows.Count > 0) list = dt.ToList<AllProcDal>();
            return list;
        }

        public List<RoleModel> AllprocDepartment()
        {
            return db.ExecuteSQLAndReturnDataTableLive(" select 0 as id ,'-ALL' as name , 'ALL' as text union all  select A.HIS_DepartmentId,b.Name as name, b.Name as text from [dbo].[Temp_Service_list_mapped] A left join dbo.department b on A.HIS_DepartmentId = b.ID where a.HIS_DepartmentId is not null group by A.HIS_DepartmentId,b.Name ORDER BY Name  ").DataTableToList<RoleModel>();
        }
        public List<RoleModel> AllprocOPBService()
        {
            return db.ExecuteSQLAndReturnDataTableLive(" select 0 as id ,'-ALL' as name , 'ALL' as text union all select A.OPBServiceID as id,b.Name as name, b.Name as text from [dbo].[Temp_Service_list_mapped] A left join dbo.OPBService b on A.OPBServiceID = b.ID where a.OPBServiceID is not null group by A.OPBServiceID ,b.Name ORDER BY Name ").DataTableToList<RoleModel>();
        }
        public List<RoleModel> AllprocIPBService()
        {
            return db.ExecuteSQLAndReturnDataTableLive(" select 0 as id ,'-ALL' as name , 'ALL' as text union all  select A.IPBServiceID as id,b.ServiceName as name, b.ServiceName as text from [dbo].[Temp_Service_list_mapped] A left join dbo.IPBService b on A.IPBServiceID = b.ID where a.IPBServiceID is not null and b.ID is not null group by A.IPBServiceID ,b.ServiceName ORDER BY Name  ").DataTableToList<RoleModel>();
        }
        #endregion

    }
    #region CPTCODEDAL
    public class CPTCodeDal
    {
        public string TableName { get; set; }
        public string DeptName { get; set; }
        public string Id { get; set; }
        public string DepartmentId { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string CostPrice { get; set; }      
    }
    public class CPTSaveDal
    {
        public string id { get; set; }
        public string value { get; set; }
        public string table { get; set; }
        public string type { get; set; }
        public int OperatorId { get; set; }
 
    }
       #endregion  
    
        #region ALLPRocedureDAL

  public class AllProcDal
    {
            public string BLCOD {get;set;} 
            public string BLDESC {get;set;}
            public int DeptCode {get;set;}
            public string DEPTDESC {get;set;}
            public int SERVTYP { get; set; }
            public string ServiceType {get;set;}
            public int PACKAGE { get; set; }
            public int STDFEE { get; set; }
            public string CONSTYPE {get;set;}
            public string CPTCODE {get;set;}
            public string SERGRPDESC {get;set;}
            public string SUBDEPTCOD {get;set;}
            public string SUBDEPTDES {get;set;}
            public string ACTTYPDESC {get;set;}
            public int OPBServiceID { get; set; }
            public int IPBServiceID { get; set; }
            public string OperationType {get;set;}
            public string HIS_DepartmentId {get;set;}
            public string HIS_SubDeptId {get;set;}
            public string IpServiceName {get;set;}
            public string OpServiceName {get;set;}
            public string DepartmentName {get;set;}
            public string SubDeptName {get;set;}
      }

  public class ALlDashEntry
  {
      public string DeptId { get; set; }
      public string OPBServiceId { get; set; }
      public string IPBServiceId { get; set; }
  }


        #endregion

}
