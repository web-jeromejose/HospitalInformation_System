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



namespace DataLayer.ITAdmin.Model
{
    public class UserRegistrationModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();

        public List<UserList> Select2UserListDalWithuserAuthentic(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT a.ID id,a.EmployeeID + '-' + a.Name as text,a.Name as name from employee a inner join ITADMIN.User_Authentication b on a.EmployeeID = b.EmployeeId and b.active = 1 where a.Deleted = 0  and a.Name like '%" + id + "%' OR a.EmployeeID like '%" + id + "%'   ").DataTableToList<UserList>();
        }

        public List<UserListPassExcep> Select2UserListPassExcep(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive(" select b.ID id,b.EmployeeID + '-' + b.Name as text,b.Name as name,c.Name as deptname from [ITADMIN].[EmployeePasswordExpiryException] a left join Employee b on a.userid = b.ID left join Department c on b.DepartmentID = c.ID  ").DataTableToList<UserListPassExcep>();
        }

        public List<UserLockedList> UserLockedList()
        {
            return db.ExecuteSQLAndReturnDataTableLive("  select a.id, rtrim(FirstName) + ' ' + rtrim(Lastname) as Name, DepartmentID,b.Name as DeptName,b.DivisionId from HIS..Employee A LEFT JOIN Department b on a.departmentid = b.id where a.Deleted = 0 and a.Locked_YN = 'Y'  ").DataTableToList<UserLockedList>();
        }

        public List<GetWebIPLogin> GetWebIPLogin()
        {
            return db.ExecuteSQLAndReturnDataTableLive("   select  a.Id,a.Ipaddress,a.BranchIP,a.DepartmentId,b.Name as DeptName  from [HISGLOBAL].[HIS_WEB_LoginIP] a left join dbo.Department b on a.departmentId = b.Id    ").DataTableToList<GetWebIPLogin>();
        }

        public List<RoleModel> GetDepartmentDal()
        {
            return db.ExecuteSQLAndReturnDataTableLive("   select id, name as text ,name from Department where deleted = 0 order by Name  ").DataTableToList<RoleModel>();
        }
       


        public bool UserLockedSave(UnlockedUserModel entry)
        {
            try
            {
                DBHelper db = new DBHelper();
                 
                StringBuilder sql = new StringBuilder();
                sql.Append("   update  dbo.employee set Locked_YN = null  where id = '" + entry.userid + "'  and deleted = 0  ");
                sql.Append("  insert into hisglobal.HIS_WEB_LOGIN_LOG_Status ( UserID, OperatorId,Detail,LoginDate) values  ( '" + entry.userid + "', '" + entry.OperatorId + "','UNLOCKED',GETDATE())  ");
                   
                db.ExecuteSQL(sql.ToString());

                this.ErrorMessage = "Employee has been unlocked.";
 
                return true;
            }
            catch (Exception x)
            {
                this.ErrorMessage = x.Message;
                return false;
            }

        }



        public bool GetWebIPLoginSave(GetWebIPLoginEntry entry)
        {
            try
            {
                DBHelper db = new DBHelper();
                 
                StringBuilder sql = new StringBuilder();
              
                if (entry.Action == 1)
                {
                    sql.Clear();
                    sql.Append("    if not exists(select * from  [HISGLOBAL].[HIS_WEB_LoginIP] where IpAddress = '" + entry.IpAddress.Trim() + "'  and BranchIP = '" + entry.BranchIP.Trim() + "'  and DepartmentId = '" + entry.DepartmentId + "'    )    ");
                    sql.Append("  begin   ");
                    sql.Append("  declare @scopeId int    ");
                     sql.Append("  insert into  [HISGLOBAL].[HIS_WEB_LoginIP]  (IpAddress,BranchIP,DepartmentId,DateCreated)   ");
                     sql.Append("  values ('" + entry.IpAddress.Trim() + "' ,'" + entry.BranchIP.Trim() + "' ,'" + entry.DepartmentId + "' ,getdate())  ");
                     sql.Append("  select  @scopeId = SCOPE_IDENTITY()  ");
                     sql.Append("  insert into hisglobal.HIS_WEB_LOGIN_LOG_Status (  UserID,OperatorId,Detail,LoginDate) values  (@scopeId, '" + entry.OperatorId + "','NEW',GETDATE())  ");
                     sql.Append("    ");
                     sql.Append("  end  ");

                    db.ExecuteSQL(sql.ToString());

                    this.ErrorMessage ="Record Added.";


                }else if (entry.Action == 2)
                {
                    sql.Clear();
                    sql.Append(" if not exists(select * from  [HISGLOBAL].[HIS_WEB_LoginIP] where IpAddress = '" + entry.IpAddress.Trim() + "'  and BranchIP = '" + entry.BranchIP.Trim() + "'  and DepartmentId = '" + entry.DepartmentId + "' and  ID <> '" + entry.Id + "'   )    ");
                    sql.Append("   begin   ");
                    sql.Append("   update  [HISGLOBAL].[HIS_WEB_LoginIP]  ");
                    sql.Append("   set IPAddress =  '" + entry.IpAddress.Trim() + "' ");
                    sql.Append("   ,BranchIP = '" + entry.BranchIP.Trim() + "'  ");
                    sql.Append("   ,DepartmentId = '" + entry.DepartmentId + "'  ");
                    sql.Append("   ,DateCreated = GETDATE() ");
                    sql.Append("   where ID = '" + entry.Id + "'  ");

                    sql.Append("    ");
                    sql.Append("  insert into hisglobal.HIS_WEB_LOGIN_LOG_Status (  UserID,OperatorId,Detail,LoginDate) values  ( '" + entry.Id + "', '" + entry.OperatorId + "','UPDATE',GETDATE())  ");
                    sql.Append("  end  ");
                    db.ExecuteSQL(sql.ToString());

                    this.ErrorMessage = "Record Updated.";

                }else if (entry.Action == 3)
                { 
                
                    sql.Clear();
                    sql.Append("    delete from [HISGLOBAL].[HIS_WEB_LoginIP] where Id = '" + entry.Id + "'   ");
                    sql.Append("  insert into hisglobal.HIS_WEB_LOGIN_LOG_Status ( UserID, OperatorId,Detail,LoginDate) values  ( '" + entry.Id + "',  '" + entry.OperatorId + "','DELETED' ,GETDATE())  ");
                    db.ExecuteSQL(sql.ToString());
                    this.ErrorMessage = "IpAddress has been removed.";

                }
 
                return true;
            }
            catch (Exception x)
            {
                this.ErrorMessage = x.Message;
                return false;
            }

        }

        public bool SavePassExcep(ExcepPassModel entry)
        {
            try
            {
                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@Action", entry.Action),
                    new SqlParameter("@userid", entry.userid)
                };

                db.param[0].Direction = ParameterDirection.Output;
  
                db.ExecuteSP("ITADMIN.PasswordChange_ExceptionEmployee");
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


        public List<UserList> Select2UserListDal(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT a.ID id,a.EmployeeID + '-' + a.Name as text,a.Name as name from employee a where a.Deleted = 0  and (a.Name like '%" + id + "%' OR a.EmployeeID like '%" + id + "%')    ").DataTableToList<UserList>();
        }

        public List<UserList> AllActiveEmployees()
        {
            return db.ExecuteSQLAndReturnDataTableLive(" SELECT deleted,a.ID id,a.EmployeeID + '-' + a.Name as text,a.Name as name from employee a where a.Deleted = 0  and (a.Password is not null or password <> '')    ").DataTableToList<UserList>();
        }

        public List<UserList> AllNewEmployees()
        {
            return db.ExecuteSQLAndReturnDataTableLive(" SELECT deleted,a.ID id,a.EmployeeID + '-' + a.Name as text,a.Name as name from employee a where a.Deleted = 0 and (a.Password is null or password = '')  ").DataTableToList<UserList>();
        }




        public GetUserListModel GetUserInfo(int Id)
        {

            db.param = new SqlParameter[]{
                     new SqlParameter("Id", Id)
            };
            return db.ExecuteSPAndReturnDataTable("ITADMIN.GetUserInfo_SCS").DataTableToModel<GetUserListModel>();
        }

        public List<GetUserListModel>FetchUserInfo(int Id)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("Id", Id)
           
           
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.GetUserInfo_SCS");
            List<GetUserListModel> list = new List<GetUserListModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<GetUserListModel>();
            return list;
        }

        public bool Save(UserRegistrationSave entry)
        {

            try
            {
                List<UserRegistrationSave> UserRegistrationSave = new List<UserRegistrationSave>();
                UserRegistrationSave.Add(entry);

                //During Saving password should be decrypt


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlUserRegistrationSave",UserRegistrationSave.ListToXml("UserRegistrationSave")),
                    //new SqlParameter("@xmlOPTariffDetails", OPTariffDetails.ListToXml("OPTariffDetails")),
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.UserRegistrationSave_User_Authentication"); //with pass_key
               // db.ExecuteSP("ITADMIN.UserRegistrationSave_SCS");
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


        public bool ForceResetPassword(string EmpId)
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Append("  if NOT exists( SELECT * FROM sys.tables where name = 'Employee_ResetPasswordLog' ) begin  ");
                sql.Append("  CREATE TABLE [dbo].[Employee_ResetPasswordLog]( [Id] [int] IDENTITY(1,1) NOT NULL, [EmployeeID][varchar](max) NOT NULL, [EmpID] [int] NOT NULL, [CreatedDateTime] [datetime] NOT NULL, )ON [MasterFile] ");
                sql.Append(" end   ");
                //reset to EXPIRED password
                sql.Append("  update employee set Password = '3fZ93^Pq3T&E3k:D3__Y3U5e3fZN', PWD_SET_DATE = GETDATE() where ID = '" + EmpId + "' ");

                sql.Append("   insert into [dbo].[Employee_ResetPasswordLog] ( EmployeeID,EmpID,CreatedDateTime) values ( '1','" + EmpId + "',GETDATE())   ");
                db.ExecuteSQL(sql.ToString());
                return true;
                
            }
            catch (Exception ex)
            {
                 return false;
            }
        }

        public bool ForceResetPassword_Sharjah(string EmpId,string EncryptPassword)
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Append("  if NOT exists( SELECT * FROM sys.tables where name = 'Employee_ResetPasswordLog' ) begin  ");
                sql.Append("  CREATE TABLE [dbo].[Employee_ResetPasswordLog]( [Id] [int] IDENTITY(1,1) NOT NULL, [EmployeeID][varchar](max) NOT NULL, [EmpID] [int] NOT NULL, [CreatedDateTime] [datetime] NOT NULL, )ON [MasterFile] ");
                sql.Append(" end   ");
                //reset to EXPIRED password
               // sql.Append("  update employee set Password = '3fZ93^Pq3T&E3k:D3__Y3U5e3fZN', PWD_SET_DATE = GETDATE() where ID = '" + EmpId + "' ");
                sql.Append("  update employee set Password = '" + EncryptPassword + "', PWD_SET_DATE = GETDATE() where ID = '" + EmpId + "' ");

                sql.Append("   insert into [dbo].[Employee_ResetPasswordLog] ( EmployeeID,EmpID,CreatedDateTime) values ( '1','" + EmpId + "',GETDATE())   ");
                db.ExecuteSQL(sql.ToString());
                return true;

            }
            catch (Exception ex)
            {
                return false;
            }
        }

        #region New Employee 2018

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////NEW EMPLOYEE PAGE JFJ 2018
        public bool NewEmployeeSave(NewUserRegistrationSave entry)
        {
             
                StringBuilder sql = new StringBuilder();
                 sql.Append("     ");
                 Regex reg1 = new Regex("[']");
                 entry.Password = reg1.Replace(entry.Password, "''");

                    sql.Append("   ");
                    sql.Append("  declare @Id				 as int = " + entry.Id);
                    sql.Append("  declare @OperatorId      as int =  "+entry.OperatorId);
                    sql.Append("  declare @Password as varchar(250) = '" + @entry.Password + "'  ");
                    sql.Append("  declare @IPAddress as varchar(250) = '" + entry.IPAddress + "'  ");
                    sql.Append("  declare @Pass_key as varchar(250) = '" + entry.Pass_key + "'  ");
                    sql.Append("  declare @Mobile as varchar(250) = '" + entry.Mobile + "' ");
                    sql.Append("  declare @Email as varchar(250) = '" + entry.Email + "' ");
                    sql.Append("  declare @Question1 as varchar(250) = '" + entry.Question1 + "' ");
                    sql.Append("  declare @Question2 as varchar(250) = '" + entry.Question2 + "' ");
                    sql.Append("  declare @SecAnswer1 as varchar(250) = '" + entry.SecAnswer1 + "' ");
                    sql.Append("  declare @SecAnswer2 as varchar(250) = '" + entry.SecAnswer2 + "' ");	
                    sql.Append("   ");
                    sql.Append("  declare @EmployeeId as varchar(250) ");
                    sql.Append("  declare @EmpName as varchar(250) ");
                    sql.Append("   ");
                    sql.Append("   ");
                    sql.Append("   ");
                    sql.Append("  select @EmployeeId = EmployeeId,@EmpName = Name  from Employee where ID = @Id ");
                    sql.Append("   ");
                    sql.Append("   ");
                    sql.Append("  DELETE from ITADMIN.User_Authentication where  EmployeeId =@EmployeeId ");
                    sql.Append("   ");
                    sql.Append("  INSERT INTO ITADMIN.User_Authentication ");
                    sql.Append("  ( EmployeeId,Name,Password,EffectivityDate,Mobile,Email,IsVerified,IsAdminReset,CounterAtempt,Question1 ");
                    sql.Append("  ,Question2,SecAnswer1,SecAnswer2,Active,CTR,OperatorId,IPAddress,Pass_key) VALUES  ");
                    sql.Append("  (@EmployeeId,@EmpName,@Password,GETDATE(),@Mobile,@Email,0,0,3,@Question1 ");
                    sql.Append("  ,@Question2,@SecAnswer1,@SecAnswer2,1,1,@OperatorId,@IPAddress,@Pass_key) ");
                    sql.Append("   ");
                    sql.Append("  Update a set a.Password = @Password from Employee a where a.ID = @Id  ");

                db.ExecuteSQL(sql.ToString());
                this.ErrorMessage = "New employee has been added to the HIS. Please go to HISLogin to verify...";
                return true;
 
        }
        public List<GetEmployeeDetails> GetEmployeeDetails(string id)
        {
            StringBuilder sql = new StringBuilder();
            sql.Append("     ");
            sql.Append("   select a.Name,a.HAdd1 as Address,convert(varchar(11),a.DOB, 113) as DOB,a.CellNo ,a.SystemName  ,a.EMail as Email,a.EContactPerson as ContactPerson ");
            sql.Append("   ,b.Name as Deptname ");
            sql.Append("   ,c.Name as Designation ");
            sql.Append("   ,convert(varchar(11),d.latest, 113) Logindate  ");
            sql.Append("   from dbo.employee a ");
            sql.Append("   left join dbo.department b on a.DepartmentID = b.id ");
            sql.Append("   left join dbo.designation c on a.designationid = c.id ");
            sql.Append("   LEFT JOIN ( ");
            sql.Append("   SELECT  MAX(logindate) AS latest,ai.userid ");
            sql.Append("   FROM  hisglobal.HIS_LOGIN_LOG ai    ");
            sql.Append("   GROUP BY ai.userid  ");
            sql.Append("   ) AS d on d.UserID = a.id  ");
            sql.Append("   where a.id = '"+id+"' ");

            DataTable dt = db.ExecuteSQLAndReturnDataTableLive(sql.ToString());
                List<GetEmployeeDetails> list = new List<GetEmployeeDetails>();
                if (dt.Rows.Count > 0) list = dt.ToList<GetEmployeeDetails>();
                return list;
          
        }

        public List<GetCountEmployees> GetCountEmployees()
        {
            StringBuilder sql = new StringBuilder();
            sql.Append("     ");
            sql.Append("  select count(a.id) as count,'allemployees' as field  from employee a  inner join SalaryComponent b on a.ID = b.Empid  ");
            sql.Append("  union all ");
            sql.Append("  select count(a.id), 'activeemployees' from employee a  inner join SalaryComponent b on a.ID = b.Empid where a.deleted = 0 ");
            sql.Append("  union all ");
            sql.Append("   select count(a.id), 'newemployees' from employee  a  inner join SalaryComponent b on a.ID = b.Empid  where deleted = 0 and year(a.StartDateTime) = year(getdate())  ");

            DataTable dt = db.ExecuteSQLAndReturnDataTableLive(sql.ToString());
            List<GetCountEmployees> list = new List<GetCountEmployees>();
            if (dt.Rows.Count > 0) list = dt.ToList<GetCountEmployees>();
            return list;

        }

        public bool ChangePasswordSave(NewUserRegistrationSave entry)
        {

            StringBuilder sql = new StringBuilder();
            sql.Append("     ");
            entry.Password = Slugify(entry.Password);

            sql.Append("   declare @Id int = '" + entry.Id + "' ");
            sql.Append("   declare @password varchar(max) = '" + entry.Password + "' ");
            sql.Append("   declare @rowId int  ");
            sql.Append("   declare @employeeid varchar(max) ");
            sql.Append("    ");
            sql.Append("    ");
            sql.Append("   select @EmployeeId = employeeid from employee where id = @Id ");
            sql.Append("    ");
            sql.Append("   update employee set Password = @password, PWD_SET_DATE = GETDATE() where ID = @Id ");
            sql.Append("    ");
            sql.Append("   select @rowId = ID from ITADMIN.User_Authentication where EmployeeId = @EmployeeId and Active = 1 ");
            sql.Append("    ");
            sql.Append("   insert into ITADMIN.User_Authentication (CTR,EmployeeId,Name,Password,EffectivityDate,Mobile,Email,IPAddress,OperatorId,IsVerified,IsAdminReset,CounterAtempt,Question1,Question2,Image,IsSuperUser,SecAnswer1,SecAnswer2,Active,ResetDate,pass_key) ");
            sql.Append("   select CTR+1,EmployeeId,Name,@password,GETDATE(),Mobile,Email,IPAddress,OperatorId,IsVerified,IsAdminReset,CounterAtempt,Question1,Question2,Image,IsSuperUser,SecAnswer1,SecAnswer2,1,null,pass_key ");
            sql.Append("   from ITADMIN.User_Authentication where ID = @rowId  ");
            sql.Append("    ");
            sql.Append("   update ITADMIN.User_Authentication  SET Active = 0 where ID = @rowId  ");

            sql.Append("  if NOT exists( SELECT * FROM sys.tables where name = 'Employee_ResetPasswordLog' ) begin  ");
            sql.Append("  CREATE TABLE [dbo].[Employee_ResetPasswordLog]( [Id] [int] IDENTITY(1,1) NOT NULL, [EmployeeID][varchar](max) NOT NULL, [EmpID] [int] NOT NULL, [CreatedDateTime] [datetime] NOT NULL, )ON [MasterFile] ");
            sql.Append(" end   ");

            sql.Append("   insert into [dbo].[Employee_ResetPasswordLog] ( EmployeeID,EmpID,CreatedDateTime) values ( @employeeid, @Id ,GETDATE())   ");
               
    
            db.ExecuteSQL(sql.ToString());
            this.ErrorMessage = "Employee change password has been updated..";
            return true;

        }
        public static string Slugify(string phrase)
        {
            // Remove all non valid chars with space
            String str = Regex.Replace(phrase, @"[']", "''");
            // convert multiple spaces into one space  
           // str = Regex.Replace(str, @"\s+", " ").Trim();
            return str;
        }
        #endregion



          //----------------------------------------------------------OT HEAD MAPPING

        public bool SaveOTHead(OTHeadmodel entry)
        {
            try
            {
                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@Action", entry.Action),
                    new SqlParameter("@userid", entry.userid)
                };

                db.param[0].Direction = ParameterDirection.Output;
                //db.ExecuteSP("OT.OTSchedulerSave");
                db.ExecuteSP("OT.OTHeadMapping");
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


        public bool CheckOTHeadUser(CheckOTHeadUserModel entry)
        {
            try
            {
                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@Action", entry.Action),
                    new SqlParameter("@userid", entry.OperatorId)
                };

                db.param[0].Direction = ParameterDirection.Output;
                //db.ExecuteSP("OT.OTSchedulerSave");
                db.ExecuteSP("OT.CheckOTHeadUser");
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

        public List<MainListOT> GetMainListOT()
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                //new SqlParameter("@surgeonId", surgeonId),
                //new SqlParameter("@dfrom", dfrom),
                //new SqlParameter("@dto", dto)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.GetHeadMapping");
            List<MainListOT> list = dt.ToList<MainListOT>();
            if (list == null) list = new List<MainListOT>();

            return list;
        }
       










    }









    public class UserList
    {
        public string id { get; set; }
        public string name { get; set; }
        public string text { get; set; }
    }
    public class UserListPassExcep
    {
        public string id { get; set; }
        public string name { get; set; }
        public string text { get; set; }
        public string deptname { get; set; }
    }

    public class UserLockedList
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string DepartmentId { get; set; }
        public string DivisionId { get; set; }
        public string Deptname { get; set; }
    }
    public class GetWebIPLogin
    {
        public string Id { get; set; }
        public string IpAddress { get; set; }
        public string BranchIP { get; set; }
        public string DepartmentId { get; set; }
        public string Deptname { get; set; }
    }
    public class GetWebIPLoginEntry
    {
        public int Action { get; set; }
        public string Id { get; set; }
        public string IpAddress { get; set; }
        public string BranchIP { get; set; }
        public string DepartmentId { get; set; }
        public string Deptname { get; set; }
        public int OperatorId { get; set; }
    }


    public class GetUserListModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
        public string Question1 { get; set; }
        public string Question2 { get; set; }
        public string SecAnswer1 { get; set; }
        public string SecAnswer2 { get; set; }
        public string EffectivityDate { get; set; }
        public bool IsSuperUserId { get; set; }
        public string IsSuperUser { get; set; }
        public string DecrpytPass { get; set; }

    
    }

    public class UserRegistrationSave
    {
        public int Action { get; set; }
        public int Id { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
        public string Question1 { get; set; }
        public string Question2 { get; set; }
        public string SecAnswer1 { get; set; }
        public string SecAnswer2 { get; set; }
        public string EffectivityDate { get; set; }
        //public bool IsSuperUserId { get; set; }
        //public string IsSuperUser { get; set; }
        public int OperatorId { get; set; }
        public string IPAddress { get; set; }
        public string Pass_key { get; set; }
    }

    public class ExcepPassModel
    {
        public string Action { get; set; }
        public string userid { get; set; }
    }
    public class UnlockedUserModel
    {
        public string Action { get; set; }
        public string userid { get; set; }
        public int OperatorId { get; set; }
    }

    public class OTHeadmodel
    {
        public string Action { get; set; }
        public string userid { get; set; }
    }
    public class MainListOT2
    {
        public int userid { get; set; }
        public string empid { get; set; }
        public string name { get; set; }
    }
    public class CheckOTHeadUserModel
    {
        public string Action { get; set; }
        public int OperatorId { get; set; }
    }
    public class CustomMessage
    {
        public string Title { get; set; }
        public string Message { get; set; }
        public int ErrorCode { get; set; }
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////NEW EMPLOYEE PAGE JFJ 2018
    public class NewUserRegistrationSave
    {

        public int Id { get; set; }

        public string Password { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
        public string Question1 { get; set; }
        public string Question2 { get; set; }
        public string SecAnswer1 { get; set; }
        public string SecAnswer2 { get; set; }
        public int OperatorId { get; set; }
        public string IPAddress { get; set; }
        public string Pass_key { get; set; }
    }
     public class GetEmployeeDetails
    {

            public string Name { get; set; }
            public string Address { get; set; }
            public string DOB { get; set; }
            public string CellNo { get; set; }
            public string SystemName { get; set; }
            public string Email { get; set; }
            public string ContactPerson { get; set; }
            public string Deptname { get; set; }
            public string Designation { get; set; }
            public string Logindate { get; set; }
    }
     public class GetCountEmployees
    {
            public string count { get; set; }
            public string field { get; set; }
    }
    
    									
}

