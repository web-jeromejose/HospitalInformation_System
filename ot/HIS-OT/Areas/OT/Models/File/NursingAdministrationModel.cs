using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;
using HIS_OT.Models;
using System.Text;

namespace HIS_OT.Areas.OT.Models
{
    public class NursingAdministrationModel
    {
        public string ErrorMessage { get; set; }
        DBHelper db = new DBHelper();
        DBHelper DB = new DBHelper();
    public List<NursingAdministration_ShowList> ShowList(int stationid)
        {
           
            string sql = @"   select  distinct a.ID, 
                            b.IssueAuthoritycode +'.'+ replicate('0', (10-len(b.Registrationno))) + convert(varchar(10),b.Registrationno) as Registrationno
                            ,cast(S.Prefix as varchar(max)) + '-'+cast(a.stationslno as varchar(max))  as StationSlNo,((b.FirstName)  + ' ' +  (b.MiddleName)  + ' ' + (b.LastName)) as PName, a.IPID,
                            c.Name as Bed,e.Name as Doctor, a.DateTime as  orderDateTime,t.name as Nurse  
                            from dbo.BSPExecution a 
                            inner join dbo.InPatient b  on a.ipid = b.IPID
                            inner join dbo.Bed c on a.bedid = c.ID
                            inner join dbo.Doctor e on a.doctorid = e.ID
                            inner join dbo.Station S on a.stationid = s.ID
                            inner join dbo.Employee T on a.operatorid = t.ID
                          where a.stationid = " + stationid + @" 
                          order by a.ID desc
                        ";
            StringBuilder sbl = new StringBuilder(sql);
            DataTable dt = db.ExecuteSQLAndReturnDataTable(sbl.ToString());
            List<NursingAdministration_ShowList> list = new List<NursingAdministration_ShowList>();
            if (dt.Rows.Count > 0) list = dt.ToList<NursingAdministration_ShowList>();
            return list;
        }

        
     public List<NursingAdministration_GetOrderList> GetOrderList(int orderid)
        {

            string sql = @"   Select ServiceID,name,sum(Quantity) as quantity,b.code
                            from his.dbo.BSPExecutionDetail a
                            left join his.dbo.bedsideprocedure b on a.ServiceID = b.ID
                            where OrderID = "+ orderid + @" group by serviceid,quantity,name,b.code
                        ";

            StringBuilder sbl = new StringBuilder(sql);
            DataTable dt = db.ExecuteSQLAndReturnDataTable(sbl.ToString());
            List<NursingAdministration_GetOrderList> list = new List<NursingAdministration_GetOrderList>();
            if (dt.Rows.Count > 0) list = dt.ToList<NursingAdministration_GetOrderList>();
            return list;
        }
        public List<NursingAdministration_PatientView> GetInpatientDAL(int IPID)
        {
            try
            {
                string sql = @"  declare @IPID int  = "+ IPID + @"

                        SELECT 
	                        A.issueauthoritycode + '.' + replicate('0', (10-len(a.Registrationno))) + convert(varchar(10),a.Registrationno) as PIN,
	                        A.IPID, 
	                        upper(A.Title +' '+ a.FamilyName + ' ' + A.FirstName +' '+ A.MiddleName +' '+ 
	                        A.LastName) as  PatientName, A.RegistrationNo, A.issueauthoritycode, B.ID BedId, B.Name Bed, 
	                        b.StationID,stat.Name as StationName, CAST(a.Age AS VARCHAR(10))+ ' ' + AT.Name Age, S.NAME Sex, BloodGroup

	                        ,DoctorID,
	                        doc.EmpCode + ' - ' +  doc.name as DocName,
	                        a.CompanyID,
	                        convert(varchar(10),a.CompanyID) + ' - ' + comp.Name as CompanyName,
	                        a.OtherAllergies as Allergy,
	                        isnull(pp.Name,'Non Package Patient') as Package,
	                        ICDDescription = 	STUFF((
		                        SELECT ', ' + ICDCode + ' ' + ICDDescription FROM his.dbo.Ipicddetail
		                        WHERE ipid = a.ipid
		                        FOR XML PATH(''), TYPE).value('.[1]', 'nvarchar(max)'), 1, 2, '') ,
	                        convert(varchar(17),GETDATE(),113) as DateTime,
	                        convert(varchar(17),A.AdmitDateTime,113) as AdmitDateTime
	                        FROM his.dbo.InPatient A
	                        left JOIN his.dbo.Bed B ON A.IPID = B.IPID 
	                        left JOIN his.dbo.AgeType AT ON AT.Id = A.AgeType
	                        left JOIN his.dbo.Sex S ON S.ID = A.Sex
	                        left join his.dbo.Station stat on b.StationID = stat.ID
	                        left join his.dbo.Company comp on a.CompanyID = comp.ID
 
	                        left join his.dbo.IpPackage p on a.IPID = p.Ipid
	                        left join his.dbo.Package pp on p.PackageId = pp.Id
	                        left join his.dbo.Doctor doc on a.DoctorID = doc.id
	                        WHERE (@IPID = 0 or a.IPID=@IPID) 
                        ";
                StringBuilder sbl = new StringBuilder(sql);
                return DB.ExecuteSQLAndReturnDataTable(sbl.ToString()).DataTableToList<NursingAdministration_PatientView>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public bool CancelOrder(int orderid,int operatorid)
        {
            try
            {
                string sql = @" 
                                declare @OrderID int = "+ orderid+ @"
                                declare @CanceledBy int = " + operatorid + @" 
                                Insert into his.dbo.CanBSPExecutionDetail(OrderID,ServiceID,CanceledDatetime,Quantity) 
                                Select OrderID,ServiceID,GETDATE(),Quantity from his.dbo.BSPExecutionDetail where OrderID=@OrderID

                              Delete from his.dbo.BSPExecutionDetail where OrderID = @OrderID

                                Insert into his.dbo.canBSPExecution(BedID,IPID,StationID,OperatorID,DateTime,DoctorID,ID,CanceledBy,CanceledDateTime,Modified,StationSlNo) 
                                select BedID,IPID,StationID,OperatorID,DateTime,DoctorID,ID,@CanceledBy,
                                GETDATE(),1,StationSlNo from his.dbo.BSPExecution where ID = @OrderID

                               Delete from his.dbo.BSPExecution where ID = @OrderID


                                insert into his.dbo.WARDSENTRYLOG (CreatedDateTime,EntryType,OrderID,OperatorID)
                                select GETDATE(),'NURSEPROC-Cancel in OT',@OrderID,@CanceledBy	

                        ";
              
                StringBuilder sbl = new StringBuilder(sql);
                    var dt = db.ExecuteSQL(sbl.ToString());
                    return dt;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }


        
        public bool SaveNursingAdmin(NursingAdministration_Save entry)
        {
            try
            {

                List<NursingAdministration_Save> headerdata = new List<NursingAdministration_Save>();
                headerdata.Add(entry);

                List<NursingAdministration_Save_LIST> selected = entry.selecteditem;
                if (selected == null) selected = new List<NursingAdministration_Save_LIST>();

                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlItemList", selected.ListToXml("xmlItemList")),
                    new SqlParameter("@xmlHeader", headerdata.ListToXml("xmlHeader")),
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("[OT].[OT_WARDS_NURSINGPROC_SAVE]");
                
                this.ErrorMessage = db.param[0].Value.ToString();
                bool isOK = this.ErrorMessage.Split('-')[0] == "100";

                return isOK;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public List<NursingAdministration_BedsideProcedures> BedsideProcedures( )
        {
            DBHelper db = new DBHelper();
            string sql = @"select id,name,code from his.dbo.bedsideprocedure where deleted=0  ";
            StringBuilder sbl = new StringBuilder(sql);
            DataTable dt = db.ExecuteSQLAndReturnDataTable(sbl.ToString());
            List<NursingAdministration_BedsideProcedures> list = new List<NursingAdministration_BedsideProcedures>();
            if (dt.Rows.Count > 0) list = dt.ToList<NursingAdministration_BedsideProcedures>();
            return list;
        }

        public List<NursingAdministration_PatientList> PatientList(string Registrationno)
        {

            DBHelper db = new DBHelper();
            string sql = @" select   a.IssueAuthoritycode +'.'+ replicate('0', (10-len(a.Registrationno))) + convert(varchar(10),a.Registrationno) as Registrationno
                            ,((a.FirstName)  + ' ' +  (a.MiddleName)  + ' ' + (a.LastName)) as PName
                            , a.IPID,b.Name as bed,c.Name as stationname
                            ,convert(varchar(11),a.AdmitDateTime, 113) AdmitDateTime
                            from dbo.InPatient a 
                            inner join dbo.Bed b on a.IPID =b.IPID
                            inner join dbo.Station c on b.StationID = c.id
                            where b.Deleted = 0 
                            and ('"+ Registrationno + @"' = '' OR a.RegistrationNo like '%" + Registrationno + @"%')
                            order by a.AdmitDateTime desc
                            ";
            StringBuilder sbl = new StringBuilder(sql);
            DataTable dt = db.ExecuteSQLAndReturnDataTable(sbl.ToString());
            List<NursingAdministration_PatientList> list = new List<NursingAdministration_PatientList>();
            if (dt.Rows.Count > 0) list = dt.ToList<NursingAdministration_PatientList>();
            return list;
        }
        public List<Select2Ajax> DoctorList(string doc)
        {

            DBHelper db = new DBHelper();
            string sql = @"     select Id ,  cast(EmpCode as varchar(max)) + '-' + cast(Name as varchar(max))  as  Name ,  cast(EmpCode as varchar(max)) + '-' + cast(Name as varchar(max))  as  Text 
                                from doctor where  (EmployeeID  like  '%" + doc + @"%'  OR Name like  '%" + doc + @"%'  OR EmpCode like  '%" + doc + @"%' )  
                                and deleted = 0 order by EmpCode  ";
            StringBuilder sbl = new StringBuilder(sql);
            DataTable dt = db.ExecuteSQLAndReturnDataTable(sbl.ToString());
            List<Select2Ajax> list = new List<Select2Ajax>();
            if (dt.Rows.Count > 0) list = dt.ToList<Select2Ajax>();
            return list;
        }


    }

    public class NursingAdministration_ShowList
        {       
            public int ID { get; set; } 
            public string Registrationno { get; set; }    
            public string StationSlNo { get; set; }
            public string PName { get; set; }
            public string IPID { get; set; }
            public string Bed  {get;set;}
            public string Doctor {get;set;}
            public string orderDateTime {get;set;}
            public string Nurse {get;set;}
        }   
    public class NursingAdministration_PatientView
    {
        public string PIN { get; set; }
        public string IPID { get; set; }
        public string PatientName { get; set; }
        public string RegistrationNo { get; set; }
        public string issueauthoritycode { get; set; }
        public string BedId { get; set; }
        public string Bed { get; set; }
        public string StationID { get; set; }
        public string StationName { get; set; }
        public string Age { get; set; }
        public string Sex { get; set; }
        public string BloodGroup { get; set; }
        public string DoctorID { get; set; }
        public string DocName { get; set; }
        public string CompanyID { get; set; }
        public string CompanyName { get; set; }
        public string Allergy { get; set; }
        public string Package { get; set; }
        public string ICDDescription { get; set; }
        public string DateTime { get; set; }
        public string AdmitDateTime { get; set; }

    }
    public class NursingAdministration_GetOrderList
        {
            public string ServiceID { get; set; }
            public string name { get; set; }
            public int quantity { get; set; }
            public string code { get; set; }
        }
    public class NursingAdministration_PatientList
    {
        public string Registrationno { get; set; }
        public string PName { get; set; }
        public int IPID { get; set; }
        public string bed { get; set; }
        public string stationname { get; set; }
        public string AdmitDateTime { get; set; }

    }
    public class NursingAdministration_BedsideProcedures
    {
        public int id { get; set; }
        public string name { get; set; }
        public string code { get; set; }
    }
    public class NursingAdministration_Save
    {
        public string IPID { get; set; }
        public string DocId { get; set; }        
        public int stationid { get; set; }
        public int operatorid { get; set; }
        public List<NursingAdministration_Save_LIST> selecteditem  { get; set; } 
    }
    public class NursingAdministration_Save_LIST
    {
        
        public string itemid { get; set; }
        public string qty { get; set; }
    }

    public class Select2Ajax
    {

        public string Id { get; set; }
        public string Name { get; set; }
        public string Text { get; set; }
    }

    
}