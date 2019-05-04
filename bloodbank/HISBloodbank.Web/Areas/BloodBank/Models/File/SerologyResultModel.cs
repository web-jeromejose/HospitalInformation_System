using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;
using System.Text;
using HIS_BloodBank.Models;


namespace HIS_BloodBank.Areas.BloodBank.Models
{
    public class SerologyResultModel
    {
        public string ErrorMessage { get; set; }
        DBHelper db = new DBHelper();
        StringBuilder sql = new StringBuilder();


        public List<ShowListSerResult> List()
        {
            sql.Clear();
            sql.Append("  select distinct a.Donorreg,c.Name,c.DateTime,c.PatientRegistrationNO,c.ID as unitno");
            sql.Append("  from DonorTestResults a left join screeningresult b on a.ServiceID = b.testid  left join dbo.DonorReg c on a.donorreg = c.DonorRegistrationNO order by c.DateTime desc   ");
            List<ShowListSerResult> list = db.ExecuteSQLAndReturnDataTable(sql.ToString()).DataTableToList<ShowListSerResult>();
            return list;

        }


        public List<Select2> SelectDonorNo(string donorreg)
        {
            sql.Clear();

            sql.Append(" select DonorRegistrationNO as id,'0' as tempid,Id + '-'+ cast(DonorRegistrationNO as varchar(20)) as name,Id + '-'+ cast(DonorRegistrationNO as varchar(20)) as text  ");
            sql.Append("   from donorreg a where screenValue<>0   and DonorRegistrationNO like '%" + donorreg + "%' ");
            List<Select2> list = db.ExecuteSQLAndReturnDataTable(sql.ToString()).DataTableToList<Select2>();

            return list;

        }


        public List<DonorRegDetailsDAL> DonorRegDetails(string donorreg)
        {
            sql.Clear();
            sql.Append("  select a.screenvalue,a.name,a.iqama,a.age,b.name as sex ,a.id,a.donorregistrationno,a.datetime ");
            sql.Append("  from donorreg a  ");
            sql.Append("  left join sex b on a.Sex = b.id   ");
            sql.Append("  where screenValue<>0 and DonorRegistrationNO = '" + donorreg + "' ");


            DataTable dt = db.ExecuteSQLAndReturnDataTable(sql.ToString());
            List<DonorRegDetailsDAL> list = new List<DonorRegDetailsDAL>();
            if (dt.Rows.Count > 0)
            {
                list = dt.ToList<DonorRegDetailsDAL>();
                list[0].ScreenResultValue = this.GetScreenValueBinary(list[0].id);
                list[0].DonorTestResults = this.DonorTestResults(donorreg);
                list[0].LabEquipTestResultDetail = this.LabEquipTestResultDetail(donorreg);
                /*upon analyzing the wipro
                 * 1. check if theres data in the donor test result , if exist = dont save
                 * 2. check if theres data in laboratory using labno, if exist = show
                 * 3. else show the donor reg screen result value for the positve = show
                 */
            }
            return list;


        }

        public List<LabEquipTestResultDetailDAL> LabEquipTestResultDetail(string donorreg)
        {
            //magulo ung wiproc process :( 
            sql.Clear();
            sql.Append("   declare @labno as varchar(max) ");
            sql.Append("   declare @donorregno as int ='" + donorreg + "' ");
            sql.Append("    ");
            sql.Append("   select @labno = labno  from donorreg where donorregistrationno=@donorregno ");
            sql.Append("    ");
            sql.Append("   select distinct b.patientAccessNumber,b.SampleNumber as IpSn , a.testresult,a.testid,a.ParameterID,units ,d.Name as TestName ");
            sql.Append("   from LabEquipTestResultDetail a, LabEquipTestResult b, LabEquipTestMap c , screeningresult d  ");
            sql.Append("   Where  b.patientAccessNumber =@labno  and  a.Testid = c.Testid And a.verify = 1  and d.testid = a.TestID ");
            sql.Append("   and  c.equipmentid=b.equipmentid And a.EquipTestResultID = B.id  and b.equipmentid in(17,5)   ");
            sql.Append("   and a.testid in ( select testid from screeningresult where deleted=0 ) ");

            DataTable dt = db.ExecuteSQLAndReturnDataTable(sql.ToString());
            List<LabEquipTestResultDetailDAL> list = new List<LabEquipTestResultDetailDAL>();
            list = dt.ToList<LabEquipTestResultDetailDAL>();
            return list;
        }
        public List<DonorTestResultsDAL> DonorTestResults(string donorregno)
        {
            sql.Clear();
            sql.Append("  select a.Donorreg,a.ServiceID as TestId,a.ParameterID,a.ProfileID,a.Result,a.ResultDateTime,a.Units,a.Normal,b.Name as TestName ");
            sql.Append("  from DonorTestResults a left join screeningresult b on a.ServiceID = b.testid ");
            sql.Append("  where a.donorreg = '" + donorregno + "' ");
            List<DonorTestResultsDAL> list = db.ExecuteSQLAndReturnDataTable(sql.ToString()).DataTableToList<DonorTestResultsDAL>();
            return list;
        }

        public List<Select2> GetScreenValueBinary(string donorid)
        {
            sql.Clear();
            sql.Append("   ");
            sql.Append("  DECLARE @scrncompId AS INT   ");
            sql.Append("   ");
            sql.Append("  DECLARE @scrnbagnum AS varchar(20) = '" + donorid.Trim() + "' ");
            sql.Append("   ");
            sql.Append("  SELECT @scrncompId = ScreenValue FROM SCREEN WHERE Bagnumber = @scrnbagnum  ");
            sql.Append("   ");
            sql.Append("  DECLARE @tblBits AS TABLE (Id INT IDENTITY, Value INT) ");
            sql.Append("  INSERT INTO @tblBits (Value) ");
            sql.Append("  SELECT id FROM ScreeningResult WHERE DELETED = 0 group by id order by id desc ");
            sql.Append("   ");
            sql.Append("  DECLARE @difference AS INT = 0; ");
            sql.Append("  DECLARE @tblComponents AS TABLE (Id INT IDENTITY, Value INT) ");
            sql.Append("  DECLARE @counter INT = 1; ");
            sql.Append("  DECLARE @maxCount INT =  (SELECT COUNT(1) FROM @tblBits) ");
            sql.Append("   ");
            sql.Append("  DECLARE @bit AS INT = 0; ");
            sql.Append("  WHILE (@counter <= @maxCount) BEGIN ");
            sql.Append("  SET @bit =  (SELECT Value FROM @tblBits WHERE Id = @counter); ");
            sql.Append("  SET @difference = @scrncompId - @bit; ");
            sql.Append("   ");
            sql.Append("  IF (@scrncompId <> 0 AND @difference >= 0)BEGIN ");
            sql.Append("  INSERT INTO @tblComponents (Value) ");
            sql.Append("  VALUES(@bit)		 ");
            sql.Append("  SET @scrncompId = @difference; ");
            sql.Append("  END ");
            sql.Append("   ");
            sql.Append("  SET @difference = 0; ");
            sql.Append("  SET @counter = @counter + 1; ");
            sql.Append("  END ");
            sql.Append("  SELECT  a.Id,a.Id as TempId,a.Name, a.Name as Text FROM ScreeningResult a where a.id in (SELECT value FROM @tblComponents) ");
            sql.Append("   ");


            List<Select2> list = db.ExecuteSQLAndReturnDataTable(sql.ToString()).DataTableToList<Select2>();

            return list;

        }



        public bool Delete(string donorregno)
        {
            StringBuilder sql = new StringBuilder();
            try
            {
                sql.Clear();               
                sql.Append("  delete from  DonorTestResults where Donorreg='"+donorregno+"'  ");
                db.ExecuteSQL(sql.ToString());
                return true;

            }
            catch (Exception x)
            {
               
                return false;
            }

        }



        public bool Save(SerologyResultSave entry)
        {
            StringBuilder sql = new StringBuilder();
            try
            {

                sql.Clear();
                DBHelper db = new DBHelper();
          
                sql.Append("  declare @donorregid int ");
                sql.Append("  declare @testid int  ");
                sql.Append("  declare @ParameterID int   ");
                sql.Append("  declare @result varchar(20) ");


                if (entry.TestIds != null)
                {

                    sql.Append("  set @donorregid = '" + entry.DonorId + "'");

                    sql.Append("   if not exists(select * from DonorTestResults where Donorreg =  @donorregid)  ");
                    sql.Append(" BEGIN ");

                    foreach (var item in entry.TestIds)
                    {
                        var testid = item.testid;
                        var result = item.result;

                        sql.Append("   ");
                      
                        sql.Append("  set @testid  = " + testid);
                        sql.Append("  set @result   = '" + result + "' ");
                       // sql.Append("  --SET PARATEMERID missing the other testid , blame wipro ");
                        sql.Append("  set @ParameterID = 0; ");
                        sql.Append("  if(@testid = 309) ");
                        sql.Append("  BEGIN ");
                        sql.Append("  set @ParameterID = 171; ");
                        sql.Append("  END ");
                        sql.Append("  if(@testid = 293) ");
                        sql.Append("  BEGIN ");
                        sql.Append("  set @ParameterID = 618; ");
                        sql.Append("  END ");
                        sql.Append("  if(@testid = 319) ");
                        sql.Append("  BEGIN ");
                        sql.Append("  set @ParameterID = 455; ");
                        sql.Append("  END ");
                        sql.Append("   ");
                        sql.Append("   ");
                        sql.Append("   ");

                    

                        sql.Append("  if(@result = 'negative') ");
                        sql.Append("  BEGIN ");
                        sql.Append("  Insert into DonorTestResults (Donorreg,serviceid,ParameterID, result, ResultDateTime,Units,Normal )  ");
                        sql.Append("  values (@donorregid,@testid,@ParameterID,'Negative', getdate() ,'','N') ");
                        sql.Append("   ");
                        sql.Append("  END ");
                        sql.Append("  if(@result = 'positive') ");
                        sql.Append("  BEGIN ");
                        sql.Append("  Insert into DonorTestResults (Donorreg,serviceid,ParameterID, result, ResultDateTime,Units,Normal )  ");
                        sql.Append("  values (@donorregid,@testid,@ParameterID,'Positive', getdate() ,'','P') ");
                        sql.Append("   ");
                        sql.Append("  END ");
                        sql.Append("  if(@result = 'reactive') ");
                        sql.Append("  BEGIN ");
                        sql.Append("  Insert into DonorTestResults (Donorreg,serviceid,ParameterID, result, ResultDateTime,Units,Normal )  ");
                        sql.Append("  values (@donorregid,@testid,@ParameterID,'Reactive', getdate() ,'','R') ");
                        sql.Append("  END ");
                        sql.Append("   ");
                        sql.Append("    insert into [BLOODBANK].[ScreenLogs] values('insert','DonorTestResults','Insert into DonorTestResults   /@donorregid = " + entry.DonorId + " / @testid  = " + testid + " / @result   = " + result + " ',getdate())  ");
                
                      
                    }
               
                    sql.Append("  END ");
                }

              

                db.ExecuteSQL(sql.ToString());

                return true;

            }
            catch (Exception x)
            {
                this.ErrorMessage = x.Message;
                return false;
            }

        }



    }

    public class DonorRegDetailsDAL
    {
        public string screenvalue { get; set; }
        public string name { get; set; }
        public string iqama { get; set; }
        public string age { get; set; }
        public string sex { get; set; }
        public string id { get; set; }
        public string datetime { get; set; }
        public string donorregistrationno { get; set; }

        public List<Select2> ScreenResultValue { get; set; }
        public List<DonorTestResultsDAL> DonorTestResults { get; set; }
        public List<LabEquipTestResultDetailDAL> LabEquipTestResultDetail { get; set; }
    }

    public class LabEquipTestResultDetailDAL
    {
        public string patientAccessNumber { get; set; }
        public string IpSn { get; set; }
        public string testresult { get; set; }
        public int testid { get; set; }
        public int ParameterID { get; set; }
        public string units { get; set; }
        public string TestName { get; set; }
    }

    public class DonorTestResultsDAL
    {
        public string Donorreg { get; set; }
        public int TestId { get; set; }
        public string ParameterID { get; set; }
        public string ProfileID { get; set; }
        public string Result { get; set; }
        public string ResultDateTime { get; set; }
        public string Units { get; set; }
        public string Normal { get; set; }
        public string TestName { get; set; }
    }
    public class ShowListSerResult
    {
        public string Donorreg { get; set; }
        public string Name { get; set; }
        public string DateTime { get; set; }
        public string PatientRegistrationNO { get; set; }
        public string unitno { get; set; }

    }
    public class SerologyResultSave
    {
        public string DonorId { get; set; }
        public List<TestIdList> TestIds { get; set; }
    }
    public class TestIdList
    {
        public string testid { get; set; }
        public string result { get; set; }
    }

    
}