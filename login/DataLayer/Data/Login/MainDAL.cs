using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Data;


namespace DataLayer
{
    public class MainDAL
    {
        public string ErrorMessage { get; set; }
        DBHelper DB = new DBHelper();
        public List<UserModules> UserModuleListCS(string id)
        {
            try
            {
               

                DB.param = new SqlParameter[]{
                     new SqlParameter("Username", id)
                };
                return DB.ExecuteSPAndReturnDataTable("HISGLOBAL.EMPLOYEE_MODULE").DataTableToList<UserModules>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

  
        public GetUserListModel GetUserInfo(int Id)
        {

            DB.param = new SqlParameter[]{
                     new SqlParameter("Id", Id)
            };
            return DB.ExecuteSPAndReturnDataTable("ITADMIN.GetUserInfo_SCS").DataTableToModel<GetUserListModel>();
        }

        public bool LogsUpdate(string departmentId,string userid, string ip, string hostname, bool isLoginCorrect )
        {

            try
            {

                StringBuilder sql = new StringBuilder();
                sql.Clear();
                sql.Append("  insert into HISGLOBAL.HIS_WEB_LOGIN_LOG ( DepartmentId,UserID, IPAddress,HostName,LoginDate,IsLogInCorrect) values  ( '" + departmentId + "', '" + userid + "', '" + ip + "','"+ hostname+"',GETDATE(),'" + isLoginCorrect + "')  ");
                DB.ExecuteSQL(sql.ToString());
                return true;
            }
            catch (Exception x)
            {
                this.ErrorMessage = x.Message;
                return false;
            }

        }

        public bool ChangePasswordSave(ChangePasswordSaveModel entry)
        {

            try
            {
                List<ChangePasswordSaveModel> UserFormModel = new List<ChangePasswordSaveModel>();
                UserFormModel.Add(entry);

                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlChangePasswordSave",UserFormModel.ListToXml("ChangePasswordSave")),
                    //new SqlParameter("@xmlOPTariffDetails", OPTariffDetails.ListToXml("OPTariffDetails")),
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.Login_ChangePasswordSave");
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


        

    public List<LogChar> LogChart(string id)
        {
            try
            {

                StringBuilder sql = new StringBuilder();
                sql.Clear();
                sql.Append(@" declare @userid varchar(max) = "+ id + @"
 
                 
                 SET Transaction Isolation Level read uncommitted

                         select * into #HIS_WEB_LOGIN_LOG from HISGLOBAL.HIS_WEB_LOGIN_LOG (nolock) where userid = @userid  and YEAR(LoginDate) = YEAR(GetDate())
                         select * into #HIS_LOGIN_LOG from HISGLOBAL.HIS_LOGIN_LOG (nolock) where  userid = @userid  and YEAR(LoginDate) = YEAR(GetDate())
 
                            select  a.ModuleId,a.UserID
                            into #totalHISCount
                            from HISGLOBAL.HIS_LOGIN_LOG a  (nolock) 
                            where a.ModuleID <> 0
                            and cast(LoginDate as Date) = cast(getdate() as Date) 
                            and YEAR(LoginDate) = YEAR(GetDate())	
                            group by a.ModuleId,a.UserID,datepart(minute,LoginDate),datepart(HOUR,LoginDate)

                          		 
                                SELECT DATENAME(MONTH, DATEADD(MM, s.number, CONVERT(DATETIME, 0))) AS [MonthName], 
                                MONTH(DATEADD(MM, s.number, CONVERT(DATETIME, 0))) AS [MonthNumber] 
                                , Isnull(u.sum_of_login,0) as sum_of_login
                                ,(select count(ID) from  #HIS_WEB_LOGIN_LOG where  userid = @userid and YEAR(LoginDate) = YEAR(GetDate())) as total_login
                                ,Isnull(v.ModuleName,0) as module_use
                                ,Isnull(v.module_count,0) as module_count
                                ,Isnull(ipadd.IPAddress,0) as IPAddress
                                ,Isnull(ipadd.ip_count,0)  as ip_count
                                ,Isnull(alluser.all_user_count,0)  as all_user_count
                                ,Isnull(alluser.all_user_modulename,0)  as all_user_modulename
								
                             FROM master.dbo.spt_values s 
                                left join (
		                                select   MonthName=DateName(MM,LoginDate)
		                                 ,count(userid) AS sum_of_login
		                                from #HIS_WEB_LOGIN_LOG
		                                WHERE YEAR(LoginDate) = YEAR(GetDate())
		                                and userid = @userid
		                                 Group By Month(LoginDate),DateName(MM,LoginDate)
                                ) u on u.[MonthName] = DATENAME(MONTH, DATEADD(MM, s.number, CONVERT(DATETIME, 0))) 
                                left join
                                (
	                                select  top 12 ROW_NUMBER() OVER(ORDER BY count(a.ID) desc ) as rn,b.ModuleName,count(a.ID) as module_count 
									from #HIS_LOGIN_LOG  a 
	                                inner join HISGLOBAL.HIS_MODULES b on a.ModuleID = b.ModuleID
	                                where userid = @userid and YEAR(LoginDate) = YEAR(GetDate())
	                                group by  b.ModuleName order by module_count desc
 
                                ) v on v.rn = MONTH(DATEADD(MM, s.number, CONVERT(DATETIME, 0)))
                                left join
                                (
                                select top 12 ROW_NUMBER() OVER(ORDER BY count(IpAddress) desc ) as rn,IPAddress,count(IPAddress) as ip_count   
		                                from #HIS_WEB_LOGIN_LOG
		                                WHERE   userid = @userid and IsLogInCorrect = 1 
										 and YEAR(LoginDate) = YEAR(GetDate())
	                                group by IPAddress
                                ) ipadd on ipadd.rn = MONTH(DATEADD(MM, s.number, CONVERT(DATETIME, 0)))
                                left join
								(
								 select  top 12  ROW_NUMBER() OVER(ORDER BY count(a.ModuleID) desc ) as rn, 
								 count(a.ModuleId) as all_user_count,b.ModuleName as  all_user_modulename 
								
								 from #totalHISCount a
								 left join  HISGLOBAL.HIS_MODULES b (nolock) on a.moduleid = b.ModuleID
								 group by a.ModuleID,b.ModuleName
								 order by all_user_count desc
								) alluser on alluser.rn = MONTH(DATEADD(MM, s.number, CONVERT(DATETIME, 0)))
                                WHERE [type] = 'P' AND s.number BETWEEN 0 AND 11
                                ORDER BY 2
 
                        drop table #HIS_WEB_LOGIN_LOG
                        drop table #HIS_LOGIN_LOG
                        drop table #totalHISCount

");
                return DB.ExecuteSQLAndReturnDataTable(sql.ToString()).DataTableToList<LogChar>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

    public List<PunchInDetails> PunchInDetails(string id)
        {
            try
            {
                // @empid varchar(max)= '"+id.ToString()+ @"'  
                StringBuilder sql = new StringBuilder();
                sql.Clear();
                sql.Append(@"  
                            declare @stDate datetime
                            ,@enDate datetime,
                           @empid varchar(max)= '" + id.ToString() + @"'  
 
                            set @stDate =  convert(varchar(11), DATEADD(day,-7, GETDATE()), 113) 
                            set @enDate = convert(varchar(11),  GETDATE() , 113)
  


                            Create Table #EmployeeMagcardSummary
                             (DeptID int, EmployeeID nvarchar(10), Name nvarchar(100),    
                              Todate datetime, InTime datetime, OutTime datetime,    
                              InTime1 datetime, OutTime1 datetime, Shiftname varchar(50))    
 
   
                               Insert into #EmployeeMagcardSummary(EmployeeID,Name,Todate,InTime,OutTime,InTime1,OutTime1,Shiftname)
                            select c.employeeid EmployeeNo,c.name EmployeeName,  
                            convert(datetime,REPLICATE('0',2-(LEN(CONVERT(Varchar(2),b.shiftday)))) + 
                            CONVERT(Varchar(2),b.shiftday) + '-' + substring(convert(nvarchar,a.currentmonth,106),4,3) + '-' + 
                            convert(nvarchar,year(a.currentmonth)),105) AS ToDate,
                            b.InTime InTime , 
                            b.OutTime OutTime, 
                            b.InTime1 InTime1, 
                            b.OutTime1 OutTime1, 
                            case when d.id in (103,105,106,107,108,109,110,111,112,113,135,136,192,195,196,197,219) 
                            then d.name else '' end Shiftname 
                            From allotshift a 
                            left join allotshiftdetail b on a.id = b.allotid 
                            left join employee c on a.empid = c.id left join shift d on b.shiftid = d.id 
                            Where 
                            a.CurrentMonth >= '01-JAN-2007' and
                             c.EmployeeID = @empid  and
                            convert(datetime,REPLICATE('0',2-(LEN(CONVERT(Varchar(2),b.shiftday)))) 
                            + CONVERT(Varchar(2),b.shiftday) + '-' + substring(convert(varchar,a.currentmonth,106),4,3) + '-' + 
                            convert(varchar,year(a.currentmonth)),105) >= @stDate and   
                            convert(datetime,REPLICATE('0',2-(LEN(CONVERT(Varchar(2),b.shiftday)))) 
                            + CONVERT(Varchar(2),b.shiftday) + '-' + substring(convert(varchar,a.currentmonth,106),4,3) + '-' + 
                            convert(varchar,year(a.currentmonth)),105) <= @enDate
 

 
                            Update #EmployeeMagcardSummary
	                            Set InTime = 
                            (select top 1 convert(nvarchar(10),intime,114) intime from emppunchingdetails 
                            Where empid = #EmployeeMagcardSummary.EmployeeID
                            and todate = #EmployeeMagcardSummary.Todate 
                            and intime >= dateadd(HH,-3,#EmployeeMagcardSummary.InTime)
                            and intime <= dateadd(HH,3,#EmployeeMagcardSummary.InTime)
                            and outtime is null order by todate,intime),
		                            OutTime = (select top 1  convert(nvarchar(10),outtime,114) outtime from emppunchingdetails 
                            Where empid = #EmployeeMagcardSummary.EmployeeID 
                            and todate >= #EmployeeMagcardSummary.Todate
                            and todate <=  dateadd(HH,36,convert(datetime,convert(varchar,#EmployeeMagcardSummary.Todate,105),105)) 
                            and outtime >= dateadd(HH,-3,#EmployeeMagcardSummary.outtime)
                            and outtime <= dateadd(HH,3,#EmployeeMagcardSummary.outtime)
                            and intime is null order by todate,outtime),
	                             InTime1 = 
                            (select top 1 convert(nvarchar(10),intime,114) intime from emppunchingdetails 
                            Where empid = #EmployeeMagcardSummary.EmployeeID
                            and todate = #EmployeeMagcardSummary.Todate 
                            and InTime >= dateadd(HH,-3,#EmployeeMagcardSummary.InTime1)
                            and InTime <= dateadd(HH,3,#EmployeeMagcardSummary.InTime1)
                            and outtime is null order by todate,InTime),
		                            OutTime1 = (select top 1  convert(nvarchar(10),outtime,114) outtime from emppunchingdetails 
                            Where empid = #EmployeeMagcardSummary.EmployeeID 
                            and todate >= #EmployeeMagcardSummary.Todate
                            and todate <=  dateadd(HH,36,convert(datetime,convert(varchar,#EmployeeMagcardSummary.Todate,105),105)) 
                            and OutTime >= dateadd(HH,-3,#EmployeeMagcardSummary.OutTime1)
                            and OutTime <= dateadd(HH,3,#EmployeeMagcardSummary.OutTime1)
                            and intime is null order by todate,OutTime)

                            select * from #EmployeeMagcardSummary
                            order by  todate asc


drop table #EmployeeMagcardSummary

 
 




                ");
                return DB.ExecuteSQLAndReturnDataTable(sql.ToString()).DataTableToList<PunchInDetails>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

    }


}


 
