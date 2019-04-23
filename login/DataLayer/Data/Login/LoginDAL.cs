using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Data;

namespace DataLayer
{
    public class LoginDAL
    {
        public int StationID { get; set; }
        public int UserID { get; set; }
        public string IPID { get; set; }
        public string PIN { get; set; }

        public string Employee { get; set; }
        public string EmployeeID { get; set; }

        public string DivisionID { get; set; }
        public string DepartmentID { get; set; }


        public string Username { get; set; }
        public string Password { get; set; }

        public string ClinicType { get; set; }
        public string ClinicDeptID { get; set; }

        DBHelper DB = new DBHelper("HIS");
        EncryptDecrypt util = new EncryptDecrypt();

        public Boolean simpleLogin(string ip)
        {
            try
            {
                string hostname = "";
                DB.param = new SqlParameter[]{
                     new SqlParameter("Username", Username)
                };

                StringBuilder sql1 = new StringBuilder();
                sql1.Append(@"   
                                     if not exists(select  * from sys.tables where name = 'HIS_WEB_LOGIN_LOG')
                                     BEGIN

 
                                    CREATE TABLE [HISGLOBAL].[HIS_WEB_LOGIN_LOG](
	                                    [ID] [int] IDENTITY(1,1) NOT NULL,
	                                    [UserID] [int] NULL,
	                                    [IPAddress] [varchar](20) NULL,
	                                    [HostName] [varchar](100) NULL,
	                                    [DepartmentId] [int] NULL,
	                                    [LoginDate] [datetime] NULL,
	                                    [IsLogInCorrect] [bit] NULL
                                    ) ON [MasterFile]

                                     END
    ");
                DB.ExecuteSQL(sql1.ToString());
                sql1.Clear();


                DataTable ds = DB.ExecuteSQLAndReturnDataTable("select a.id, rtrim(FirstName) + ' ' + rtrim(Lastname) as Name, password, DepartmentID,b.DivisionId from HIS..Employee A LEFT JOIN Department b on a.departmentid = b.id where A.employeeid = '" + Username + "' and a.Deleted = 0");
                if (ds.Rows.Count != 0)
                {
                    var userid = ds.Rows[0]["id"].ToString();
                    var departmentId = ds.Rows[0]["DepartmentID"].ToString();

                    bool isLoginCorrect = false;

                    if (string.Compare(Password ?? "", util.DecryptPassword(ds.Rows[0]["password"].ToString()), false) != 0)
                    {

                        StringBuilder sql = new StringBuilder();
                        sql.Clear();
                        sql.Append("  insert into hisglobal.HIS_WEB_LOGIN_LOG ( DepartmentId,UserID, IPAddress,HostName,LoginDate,IsLogInCorrect) values  ( '" + departmentId + "', '" + userid + "', '" + ip + "','" + hostname + "',GETDATE(),'" + isLoginCorrect + "')  ");
                        DB.ExecuteSQL(sql.ToString());

                        return false;
                    }
                    else
                    {
                        
                        this.Employee = ds.Rows[0]["name"].ToString();
                        this.EmployeeID = ds.Rows[0]["id"].ToString();

                        this.DivisionID = ds.Rows[0]["divisionid"].ToString();
                        this.DepartmentID = ds.Rows[0]["DepartmentID"].ToString();

                        StringBuilder sql = new StringBuilder();
                        sql.Clear();
                        sql.Append(@"  insert into HISGLOBAL.HIS_LOGIN_LOG(UserID,ModuleID,IPAddress,HostName,LoginDate)  
                                   values  ('"+ userid + @"',0,'" + ip+@"',HOST_NAME(),GETDATE())     
                                    ");
                         DB.ExecuteSQL(sql.ToString());

                        return true;
                    }


                }

                return false;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        public Boolean CheckEmployeeIsLocked()
        {
            try
            {

                DataTable ds = DB.ExecuteSQLAndReturnDataTable("select a.id, rtrim(FirstName) + ' ' + rtrim(Lastname) as Name, password, DepartmentID,b.DivisionId from HIS..Employee A LEFT JOIN Department b on a.departmentid = b.id where A.employeeid = '" + Username + "' and a.Deleted = 0 and a.Locked_YN = 'Y' ");
                if (ds.Rows.Count != 0)
                {
                    //is locked
                    return true;
                }
                else
                {
                    return false;
                }

            }
            catch (Exception ex)
            {
                return false;
            }
        }
        public Boolean locktheEmployee(string ip)
        {
            try
            {

                DataTable ds = DB.ExecuteSQLAndReturnDataTable("select a.id, rtrim(FirstName) + ' ' + rtrim(Lastname) as Name, password, DepartmentID,b.DivisionId from HIS..Employee A LEFT JOIN Department b on a.departmentid = b.id where A.employeeid = '" + Username + "' and a.Deleted = 0");
                if (ds.Rows.Count != 0)
                {
                    var userid = ds.Rows[0]["id"].ToString();

                    StringBuilder sql = new StringBuilder();
                    sql.Append("    update  dbo.employee set Locked_YN = 'Y'  where ID =  '" + userid + "'  and deleted = 0   ");
                    sql.Append("  insert into hisglobal.HIS_WEB_LOGIN_LOG_Status ( UserID, IPAddress,Detail,LoginDate) values  ( '" + userid + "', '" + ip + "','LOCKED',GETDATE())  ");
                    DB.ExecuteSQL(sql.ToString());
                    return true;
                }
                else
                {
                    StringBuilder sql = new StringBuilder();
                    sql.Append("  insert into hisglobal.HIS_WEB_LOGIN_LOG_Status ( UserID, IPAddress,Detail,LoginDate) values  ( '" + Username + "', '" + ip + "','NOT-EXIST',GETDATE())  ");
                    DB.ExecuteSQL(sql.ToString());
                    return true;
                }

            }
            catch (Exception ex)
            {
                return false;
            }
        }
        public Boolean IsUserHaveAccessInUserAuthenticTable()
        {
            try
            {
                DB.param = new SqlParameter[]{
                     new SqlParameter("id", EmployeeID)
                };
                DataTable ds = DB.ExecuteSPAndReturnDataTable("ITADMIN.CheckInUserAuthentication");
                if (ds.Rows.Count != 0)
                {
                    return false;

                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        public Boolean IsUserPassword90DaysExpired()
        {
            try
            {
                DB.param = new SqlParameter[]{
                     new SqlParameter("id", EmployeeID)
                };
                DataTable ds = DB.ExecuteSPAndReturnDataTable("ITADMIN.CheckUserPasswordExpiryDate");
                if (ds.Rows.Count != 0)
                {
                    return false;

                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        public Boolean saveuserinUserAuthTable()
        {
            try
            {
                DB.param = new SqlParameter[]{
                     new SqlParameter("id", EmployeeID)
                };
                DataTable ds = DB.ExecuteSPAndReturnDataTable("ITADMIN.Login_SaveEmpinUserAuthTable");
                if (ds.Rows.Count != 0)
                {
                    return false;

                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public Boolean LogoutProcess(string ip) {
            try {

                StringBuilder sql = new StringBuilder();
            
                
                sql.Clear();
                sql.Append(@"  insert into HISGLOBAL.HIS_LOGIN_LOG(UserID,ModuleID,IPAddress,HostName,LogoutDate)  
                                   values  ('" + EmployeeID + @"',0,'" + ip + @"',HOST_NAME(),GETDATE())     
                                    ");
                DB.ExecuteSQL(sql.ToString());

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public Boolean checkEmployeeID(string ip)
        {
            try
            {
                DataTable ds = DB.ExecuteSQLAndReturnDataTable("select a.id, rtrim(FirstName) + ' ' + rtrim(Lastname) as Name, password, DepartmentID,b.DivisionId from HIS..Employee A LEFT JOIN Department b on a.departmentid = b.id where A.employeeid = '" + Username + "' and a.Deleted = 0");
                if (ds.Rows.Count != 0)
                {
                    return true;
                }
                else
                {
                    StringBuilder sql = new StringBuilder();
                    sql.Append("  insert into hisglobal.HIS_WEB_LOGIN_LOG ( UserID, IPAddress,HostName,LoginDate,IsLogInCorrect) values  ( '0', '" + ip + "','0',GETDATE(),'false')  ");
                    DB.ExecuteSQL(sql.ToString());

                    return false;
                }

            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public Boolean checkDepartment(string ip, string branchIP)
        {
            try
            {
                string hostname = "";
                DataTable ds = DB.ExecuteSQLAndReturnDataTable("select a.id, rtrim(FirstName) + ' ' + rtrim(Lastname) as Name, password, DepartmentID,b.DivisionId from HIS..Employee A LEFT JOIN Department b on a.departmentid = b.id where A.employeeid = '" + Username + "' and a.Deleted = 0");
                if (ds.Rows.Count != 0)
                {
                    var userid = ds.Rows[0]["id"].ToString();
                    var departmentId = ds.Rows[0]["DepartmentID"].ToString();


                    bool isLoginCorrect = false;


                    //check ip lookup table
                    // insert into  [HISGLOBAL].[HIS_WEB_LoginIP] (IPAddress,BranchIP,UserId,Login_Date) values (IPAddress,BranchIP,UserId,Login_Date)
                    StringBuilder sqlip = new StringBuilder();
                    /*
                     * RULES
                     * 1. check Department and BRANCHIP and IPADDRESS 
                     */
                    sqlip.Append(" if exists(  select  *  from [HISGLOBAL].[HIS_WEB_LoginIP]  where IPADDRESS = '" + ip + "'   and DepartmentId = '" + departmentId + "'  and BranchIP = '" + branchIP + "'        ) ");
                    sqlip.Append(" begin ");//login with SPECIFIC IP AND USERID 
                    sqlip.Append(" select  IPADDRESS  from [HISGLOBAL].[HIS_WEB_LoginIP]  where IPADDRESS = '" + ip + "' and DepartmentId = '" + departmentId + "' and BranchIP = '" + branchIP + "'   ");
                    sqlip.Append(" end ");
                    sqlip.Append(" else ");
                    sqlip.Append(" begin ");//check for the  SUBSTRING(IPADDRESS,6,4) -> .-.-
                    sqlip.Append("  select  IPADDRESS  from [HISGLOBAL].[HIS_WEB_LoginIP]  where IPADDRESS like '%'+  SUBSTRING('" + ip + "',1,6)  +'%' and  IPAddress like '%.-.-' and DepartmentId = '" + departmentId + "'  and BranchIP = '" + branchIP + "'    ");
                    sqlip.Append(" end ");

                    DataTable ipds = DB.ExecuteSQLAndReturnDataTable(sqlip.ToString());
                    if (ipds.Rows.Count != 0)
                    {
                        return true;

                    }
                    else
                    {
                        StringBuilder sql = new StringBuilder();
                        sql.Append("  insert into hisglobal.HIS_WEB_LOGIN_LOG (DepartmentId, UserID, IPAddress,HostName,LoginDate,IsLogInCorrect) values  (  '" + departmentId + "', '" + userid + "', '" + ip + "','" + hostname + "',GETDATE(),'" + isLoginCorrect + "')  ");
                        DB.ExecuteSQL(sql.ToString());
                    }

                }


                return false;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public Boolean checkPassword(string ip)
        {
            try
            {
                string hostname = "";
                DataTable ds = DB.ExecuteSQLAndReturnDataTable("select a.id, rtrim(FirstName) + ' ' + rtrim(Lastname) as Name, password, DepartmentID,b.DivisionId from HIS..Employee A LEFT JOIN Department b on a.departmentid = b.id where A.employeeid = '" + Username + "' and a.Deleted = 0");
                if (ds.Rows.Count != 0)
                {
                    var userid = ds.Rows[0]["id"].ToString();
                    var departmentId = ds.Rows[0]["DepartmentID"].ToString();
                    bool isLoginCorrect = false;

                    if (string.Compare(Password ?? "", util.DecryptPassword(ds.Rows[0]["password"].ToString()), false) != 0)
                    {

                        StringBuilder sql = new StringBuilder();
                        sql.Append("  insert into hisglobal.HIS_WEB_LOGIN_LOG ( DepartmentId,UserID, IPAddress,HostName,LoginDate,IsLogInCorrect) values  ( '" + departmentId + "',  '" + userid + "', '" + ip + "','" + hostname + "',GETDATE(),'" + isLoginCorrect + "')  ");
                        DB.ExecuteSQL(sql.ToString());

                        return false;
                    }
                    else
                    {
                        isLoginCorrect = true;
                        StringBuilder sql = new StringBuilder();
                        sql.Append("  insert into hisglobal.HIS_WEB_LOGIN_LOG ( DepartmentId,UserID, IPAddress,HostName,LoginDate,IsLogInCorrect) values  ( '" + departmentId + "','" + userid + "', '" + ip + "','" + hostname + "',GETDATE(),'" + isLoginCorrect + "')  ");
                        DB.ExecuteSQL(sql.ToString());


                        this.Employee = ds.Rows[0]["name"].ToString();
                        this.EmployeeID = ds.Rows[0]["id"].ToString();

                        this.DivisionID = ds.Rows[0]["divisionid"].ToString();
                        this.DepartmentID = ds.Rows[0]["DepartmentID"].ToString();
                        return true;
                    }


                }


                return false;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public Boolean checkLeaveApplicationVacation(string ip)
        {
            DataTable ds = DB.ExecuteSQLAndReturnDataTable("  select b.EmployeeID from dbo.LeaveApplication a left join dbo.Employee b on b. id=a.EmpID left join dbo.Leave c on c.id=a.LeaveID where a.Deleted=0 and a.LeaveID=2 and b.EmployeeID='" + Username + "' and cast(convert(varchar,getdate(),101) as datetime)<=a.ToDate and cast(convert(varchar,getdate(),101) as datetime)>=a.FromDate   and a.Approved = 1      ");
            if (ds.Rows.Count != 0)
            {
                return false;
            }

            return true;
        }


    }

    public class CustomPrincipalSerializedModel
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Department { get; set; }
        public string Email { get; set; }
        public string UserRoleDesc { get; set; }
        public int UserRole { get; set; }
        public string IpAddress { get; set; }
    }
}
