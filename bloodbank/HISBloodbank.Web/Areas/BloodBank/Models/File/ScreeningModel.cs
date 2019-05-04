using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;

using HIS_BloodBank.Models;
using System.Text;

namespace HIS_BloodBank.Areas.BloodBank.Models
{
    public class ScreeningModel
    {
        public string ErrorMessage { get; set; }
        DBHelper db = new DBHelper();
        StringBuilder sql = new StringBuilder();


        public List<ScreeningDashboard> ScreeningDashboard()
        {
            sql.Clear();
            sql.Append(" select a.id,a.donortype,d.name as donortypename,a.ipid,a.opno,a.bloodgroup, e.name as bloodgroupname,a.donateddate, ");
            sql.Append(" a.deleted,a.status,a.bagtype, dbo.IsComponentExist(a.procid) as IsCompExist, a.procid, g.Name as ProcName ");
            sql.Append(" ,a.volumedrawn ,a.DonorRegistrationNO ,f.name as bagtypename,0 componentid, ");
            sql.Append(" isnull(c.screenvalue,0)screenvalue ");
            sql.Append(" ,isnull(c.screentype,0)screentype ");// -- 1 =check 0=notcheck
            sql.Append(" ,isnull(a.screenresult,0)screenresult ");// ----  1-nega ,2-positive
            sql.Append("  ,case when isnull(a.screenresult,0) = 2 then 'Positive' else 'Negative' end  screenresultname ");
            sql.Append("  ,isnull(a.groupoperatorid,0) groupoperatorid ");
            sql.Append(" ,isnull(c.Verified,0) verified  ");
            sql.Append("   from donorreg a  ");
            //sql.Append(" left join dbo.ComponentScreen b on a.id = b.id ");//--from->TempId = binary select * from BloodComponent where type = 2 and deleted = 0
            sql.Append(" inner join dbo.DonorType d on a.DonorType = d.id ");
            sql.Append(" inner join dbo.BloodGroup e on a.BloodGroup = e.id  ");
            sql.Append(" inner join dbo.BagType f on a.Bagtype =  f.id ");
            sql.Append(" inner join dbo.Component g on a.Procid =  g.id ");
            sql.Append(" left join dbo.Screen c on a.DonorRegistrationNO = c.Bagid ");
            sql.Append(" where DateDiff(day,getdate(),a.expirydate)>=0 and  ");
            sql.Append(" a.status in (1,2)   ");
            sql.Append(" and a.donorstatus <> 2 and a.donateddate is not null ");
            sql.Append(" order by a.DonorRegistrationNO desc");
            List<ScreeningDashboard> list = db.ExecuteSQLAndReturnDataTable(sql.ToString()).DataTableToList<ScreeningDashboard>();
            return list;
        }



        public List<Select2> Select2ComponentDetails(string BagId)
        {
            sql.Clear();

            sql.Append(" select a.TempId as Id,a.TempId,a.Code+'-'+a.TempName as Name, a.Code+'-'+a.TempName as Text  ");
            sql.Append(" from Component a ");
            sql.Append(" left join componentscreen b on a.TempId = b.Componentid ");
            sql.Append(" where  b.id ='" + BagId + "' and  ");
            sql.Append(" a.type =2 and a.deleted = 0 ");

            List<Select2> list = db.ExecuteSQLAndReturnDataTable(sql.ToString()).DataTableToList<Select2>();

            return list;
        }



        public List<Select2> Select2ScreenResultsDetails(string BagId)
        {
            sql.Clear();

            sql.Append("   ");
            sql.Append("  DECLARE @scrncompId AS INT   ");
            sql.Append("  DECLARE @scrnbagnum AS varchar(20) = '" + BagId.Trim() + "'  ");

            sql.Append("  SELECT @scrncompId = ScreenValue FROM SCREEN WHERE Bagnumber = @scrnbagnum  ");

            sql.Append("  DECLARE @tblBits AS TABLE (Id INT IDENTITY, Value INT) ");
            sql.Append("  INSERT INTO @tblBits (Value) ");
            sql.Append("  SELECT id FROM ScreeningResult WHERE DELETED = 0 group by id order by id desc ");
            sql.Append("     ");

            sql.Append("  DECLARE @difference AS INT = 0; ");
            sql.Append("  DECLARE @tblComponents AS TABLE (Id INT IDENTITY, Value INT) ");
            sql.Append("  DECLARE @counter INT = 1; ");
            sql.Append("  DECLARE @maxCount INT =  (SELECT COUNT(1) FROM @tblBits)  ");

            sql.Append("  DECLARE @bit AS INT = 0; ");
            sql.Append("  WHILE (@counter <= @maxCount) BEGIN ");
            sql.Append("          SET @bit =  (SELECT Value FROM @tblBits WHERE Id = @counter); ");
            sql.Append("          SET @difference = @scrncompId - @bit;  ");

            sql.Append("          IF (@scrncompId <> 0 AND @difference >= 0)BEGIN ");
            sql.Append("              INSERT INTO @tblComponents (Value) ");
            sql.Append("              VALUES(@bit)         ");
            sql.Append("              SET @scrncompId = @difference; ");
            sql.Append("          END  ");

            sql.Append("          SET @difference = 0; ");
            sql.Append("          SET @counter = @counter + 1; ");
            sql.Append("  END ");
            sql.Append("   SELECT  a.Id,a.Id as TempId,a.Name, a.Name as Text FROM ScreeningResult a where a.id in ( SELECT value FROM @tblComponents)");

            List<Select2> list = db.ExecuteSQLAndReturnDataTable(sql.ToString()).DataTableToList<Select2>();

            return list;
        }



        public List<Select2> Select2Component(string search)
        {
            sql.Clear();

            sql.Append("select Id, TempId, Code+'-' + TempName as Name, Code + '-' + TempName as Text  from Component where Deleted = 0 and Type = 2 and TempName like '%" + search + "%'");
            List<Select2> list = db.ExecuteSQLAndReturnDataTable(sql.ToString()).DataTableToList<Select2>();

            return list;
        }

        public List<Select2> Select2ScreenResults(string search)
        {
            sql.Clear();

            sql.Append(" select Id,Name, Name as Text ,Id as TempId from ScreeningResult where deleted = 0  and  name like '%" + search + "%'  ");
            List<Select2> list = db.ExecuteSQLAndReturnDataTable(sql.ToString()).DataTableToList<Select2>();

            return list;
        }

        public bool Save(ScreenSave entry)
        {
            StringBuilder sql = new StringBuilder();
            try
            {
                DBHelper db = new DBHelper();
                string ComponentList = string.Join(",", entry.componentids);
                var totalScreenBinaryId = 0;
                if (entry.screenresults.Count > 0)
                {
                    foreach (var screenId in entry.screenresults)
                    {
                        totalScreenBinaryId = totalScreenBinaryId + screenId;
                    }
                }

                db.param = new SqlParameter[] {
                    new SqlParameter("@verified",entry.verified),
                    new SqlParameter("@screenverified",entry.screenverified),
                    new SqlParameter("@id", entry.id.Trim()),
                    new SqlParameter("@screentype ",entry.screentype),
                    new SqlParameter("@operatorId",entry.OperatorId),
                    new SqlParameter("@stationId",entry.stationId),
                    new SqlParameter("@bloodgroup",entry.bloodgroup),
                    new SqlParameter("@screenresultNega ",entry.screenresultNega),
                    new SqlParameter("@screening",entry.screening),
                    new SqlParameter("@componentidList", ComponentList),
                    new SqlParameter("@totalScreenResult",totalScreenBinaryId)
                };

                db.ExecuteSP("BLOODBANK.SCREENING_SAVE");

                return true;



                //sql.Append("  if not exists(select * from sys.tables where name = 'ScreenLogs' ) ");
                //sql.Append("  BEGIN ");
                //sql.Append("  CREATE TABLE [BLOODBANK].[ScreenLogs]( ");
                //sql.Append("  [Transaction] [varchar](250) NULL, ");
                //sql.Append("  [Table] [varchar](max) NULL, ");
                //sql.Append("  [Details] [varchar](max) NULL, ");
                //sql.Append("  [DateProcess] [datetime] NULL ");
                //sql.Append("  ) ON [MasterFile] ");
                //sql.Append("  END ");




                //if (entry.componentids.Count > 0)
                //{
                //    var componentIdTotal = 0;


                //    sql.Append("          declare @Idcomp varchar(20)  = '" + entry.id.Trim() + "'  ");
                //    sql.Append("          declare @operatorIdcomp  int  = " + entry.OperatorId);
                //    sql.Append("          declare @stationIdcomp int  = " + entry.stationId);
                //    sql.Append("          declare @bloodgroupcomp int  = " + entry.bloodgroup);
                //    sql.Append("          declare @bagidcomp int  ");
                //    sql.Append("          declare @maxID int ");
                //    sql.Append("          declare @donorRegID varchar(20)    ");
                //    sql.Append("          declare @ComponentTempName varchar(50)  ");
                //    sql.Append("          declare @componentBagNumber varchar(20)  ");
                //    sql.Append("          declare @componentExpiryDate varchar(20)  ");
                //    sql.Append("          declare @donorDate varchar(20)  ");
                //    sql.Append("          declare @componentID int ");
                //    sql.Append(" select @bagidcomp = DonorRegistrationNO  from donorreg where id=@Idcomp ");
                //    foreach (int componentId in entry.componentids)
                //    {

                //        componentIdTotal = componentIdTotal + componentId;
                //        sql.Append("          SET @componentID = " + componentId);

                //        sql.Append("         if not exists(Select id from componentscreen where componentid=@componentID  and bagid = @bagidcomp  )   ");
                //        sql.Append("         BEGIN  ");
                //        sql.Append("                 select @ComponentTempName = TempName from Component where tempid = @componentID ");
                //        sql.Append("                 select @donorRegID = ID,@donorDate = DonatedDate from DonorReg where DonorRegistrationNO = @bagidcomp ");
                //        sql.Append("                 select  @componentExpiryDate = replace(convert(varchar(11),dateadd(year,1, getdate()),113),' ','-')   ");

                //        sql.Append("                 if not exists(Select maxid from bbmax where slno=3 and componentid= @componentID and cyear = Right(Year(getDate()), 2)   ) ");
                //        sql.Append("                 begin ");
                //        sql.Append("                 Insert into bbmax (slno,maxid,cyear,Componentid) values(3,0, Right(Year(getDate()),2),@componentID) ");
                //        sql.Append("                 end   ");

                //        sql.Append("                 UPDATE bbmax set maxid=maxid+1 where slno=3 and componentid= @componentID and  cyear = Right(Year(getdate()), 2)  ");
                //        sql.Append("                 Select @maxID = maxid from bbmax where slno=3 and componentid= @componentID and cyear = Right(Year(getDate()), 2) ");
                //        sql.Append("                 set @componentBagNumber = @donorRegID +'/'+@ComponentTempName+'/'+ cast (@maxID  as varchar(max))  ");
                //        sql.Append("                 insert into componentscreen(id,bagnumber,componentid,expirydate,issued,screeningresult,datetime,operatorid ");
                //        sql.Append("                 ,stationid,status,bloodgroup,coldate,broken,bagid,Qty)  ");
                //        sql.Append("                 select @donorRegID, cast (@componentBagNumber  as varchar(max)),@componentID,@componentExpiryDate,0,0,getdate(),@operatorIdcomp   ");
                //        sql.Append("                 ,@stationIdcomp,0,@bloodgroupcomp,@donorDate,0,@bagidcomp,250 ");
                //        sql.Append("   ");
                //        sql.Append("                 ");
                //        sql.Append("    insert into [BLOODBANK].[ScreenLogs] values('insert','componentscreen','   ID = " + entry.id.Trim() + "   ',getdate())  ");

                //        sql.Append("         END   ");

                //    }
                //    sql.Append("             UPDATE screen set component=" + componentIdTotal + " where bagid=@bagidcomp ");
                //    sql.Append("    insert into [BLOODBANK].[ScreenLogs] values('update','screen',' UPDATE screen set component=0 / ID = " + entry.id.Trim() + "   ',getdate())  ");

                //}
                ////else
                ////{
                ////    sql.Append("          declare @Idcomp varchar(20)  = '" + entry.id.Trim() + "'  ");
                ////    sql.Append("          declare @bagidcomp int  ");
                ////    sql.Append("          declare @donorRegID varchar(20)    ");
                ////    sql.Append(" select @bagidcomp = DonorRegistrationNO  from donorreg where id=@Idcomp ");
                ////    sql.Append("                 select @donorRegID = ID  from DonorReg where DonorRegistrationNO = @bagidcomp ");
                ////    sql.Append("             delete from componentscreen where id =@donorRegID  ");
                ////    sql.Append("             UPDATE screen set component=0 where bagid=@bagidcomp ");
                ////    sql.Append("    insert into [BLOODBANK].[ScreenLogs] values('delete','componentscreen',' delete from componentscreen  / ID = " + entry.id.Trim() + "   ',getdate())  ");

                ////}


                ////else {
                ////    sql.Append(" update DonorReg set screenvalue=0  where  id = '" + entry.id.Trim() + "'  ");
                ////    sql.Append("    insert into [BLOODBANK].[ScreenLogs] values('update','screen',' update DonorReg set screenvalue=0  where  id = " + entry.id.Trim() + "  ',getdate())  ");

                ////}


                //sql.Append("  ");
                //sql.Append(" declare @verified int = " + entry.verified);
                //sql.Append(" declare @screenverified int  = " + entry.screenverified);
                //sql.Append(" declare @id varchar(20)  = '" + entry.id.Trim() + "'  ");
                //sql.Append(" declare @bagid int   ");
                //sql.Append(" declare @screentype int = " + entry.screentype);
                //sql.Append(" declare @maxIdScreen  int   ");
                //sql.Append(" declare @operatorId  int  = " + entry.OperatorId);
                //sql.Append(" declare @stationId int  = " + entry.stationId);

                //sql.Append(" declare @bloodgroup int  = " + entry.bloodgroup);
                //sql.Append(" declare @bagVolume int ");
                //sql.Append(" declare @screenresultNega int   = " + entry.screenresultNega);
                //sql.Append(" declare @screening int = " + entry.screening);
                //sql.Append(" declare @groupoperatorid int  = " + entry.groupoperatorid);
                //sql.Append(" 	  ");
                //sql.Append("  ");
                //sql.Append(" if exists(select * from donorreg where id=@id ) ");
                //sql.Append(" begin ");
                //sql.Append("  ");
                //sql.Append(" select @bagid = DonorRegistrationNO,@bagVolume = volumeDrawn from donorreg where id=@id ");
                //sql.Append(" select @bagVolume = name from BBBagQty where id = @bagVolume ");
                //sql.Append(" select @maxIdScreen = isnull(max(id),0)+1  from screen ");
                //sql.Append("   ");
                //sql.Append(" if(@verified = 1 AND @screening = 1) ");
                //sql.Append(" begin ");
                //sql.Append("  ");
                //sql.Append(" DELETE from  screen where bagid=@bagid ");
                //sql.Append("  insert into screen (Id,bagid,bagnumber,Donortype,ipid,opid,Component,   Procid,ScreenType,ScreenValue ");
                //sql.Append("			,SCREENRESULT,Verified,[DateTime],OperatorID, StationID,Coldate,ExpiryDate,Crossstate,Nocross,Issued ");
                //sql.Append(" ,Status,Bloodgroup, broken , Tvolume ,Cvolume,filterid )  ");
                //sql.Append(" select @maxIdScreen,DonorRegistrationNO,id,DonorType,ipid,0,0,Procid,@screentype,screenvalue  ");
                //sql.Append(" ,screenresult,@verified,DateTime,@operatorId,@stationId,DonatedDate,ExpiryDate,0,0,0 ");
                //sql.Append(" ,0,@bloodgroup,0 ,@bagVolume,@bagVolume,0 ");
                //sql.Append(" from donorreg where id= @id ");
                //sql.Append("  ");
                //sql.Append(" update donorreg set status=2,screenresult=@screenresultNega  where id=@id ");
                //sql.Append(" update screen set component=0 where bagid=@bagid ");
                //sql.Append(" update componentscreen set screeningresult=0 where id=@id ");
                //sql.Append("    insert into [BLOODBANK].[ScreenLogs] values('update','donorreg','   status=2 /ID " + entry.id.Trim() + "   ',getdate())  ");

                //sql.Append("  ");
                //sql.Append(" end ");
                //sql.Append(" if(@groupoperatorid <> 0)  ");
                //sql.Append(" BEGIN ");
                //sql.Append(" update donorreg set bloodgroup= @bloodgroup,groupoperatorid=@operatorId where  id=@id");
                //sql.Append(" END ");
                //sql.Append("  ");
                //sql.Append(" update screen set ScreenType=@screentype where bagid=@bagid   ");
                //sql.Append(" update donorreg set  screenresult=@screenresultNega  where id=@id ");

                //sql.Append(" 	 ");
                //sql.Append("   ");
                //sql.Append(" if(@screenverified <> 0) ");
                //sql.Append(" BEGIN ");
                //sql.Append("  ");
                //sql.Append(" update donorreg set status=3 where DonorRegistrationNO=@bagid    ");
                //sql.Append(" update screen set status=1,bloodgroup=@bloodgroup,component=0  where bagid=@bagid   ");
                //sql.Append(" update componentscreen set status=1,bloodgroup=@bloodgroup where id=@id   ");
                //sql.Append("    insert into [BLOODBANK].[ScreenLogs] values('update','donorreg','   status=3 /ID " + entry.id.Trim() + "   ',getdate())  ");

                //sql.Append("  ");
                //sql.Append(" END ");
                //sql.Append("  ");
                //sql.Append(" end ");
                //sql.Append("  ");

                //if (entry.screenresult != null)
                //{

                //    sql.Append(" update screen set ScreenValue=" + totalScreenBinaryId + " where  bagnumber = '" + entry.id.Trim() + "'  ");

                //}
                //db.ExecuteSQL(sql.ToString());

            }
            catch (Exception x)
            {
                this.ErrorMessage = x.Message;
                return false;
            }

        }




    }
    public class Select2
    {
        public int id { get; set; }
        public int tempid { get; set; }
        public string name { get; set; }
        public string text { get; set; }
    }

    public class ScreeningDashboard
    {

        public string id { get; set; }
        public int donortype { get; set; }
        public string donortypename { get; set; }

        public string ipid { get; set; }
        public int opno { get; set; }
        public int bloodgroup { get; set; }
        public string bloodgroupname { get; set; }
        public string donateddate { get; set; }
        public int deleted { get; set; }
        public int status { get; set; }
        public int bagtype { get; set; }
        public string bagtypename { get; set; }
        public bool IsCompExist { get; set; }
        public int procid { get; set; }
        public string ProcName { get; set; }
        public int volumedrawn { get; set; }

        public string DonorRegistrationNO { get; set; }
        public int componentid { get; set; }
        public int screenvalue { get; set; }
        public int screentype { get; set; }
        public int screenresult { get; set; }
        public string screenresultname { get; set; }
        public int groupoperatorid { get; set; }
        public int verified { get; set; }



    }

    public class componentidBinarylist
    {
        public int BinaryId { get; set; }
    }

    public class screenresultBinarylist
    {
        public int ScrnBinaryId { get; set; }
    }

    /*   public List<int> componentids { set; get; }
           public List<int> screenresults { set; get; }
           public List<componentidBinarylist> componentid { get; set; }
           public List<screenresultBinarylist> screenresult { get; set; } //erase mo n to. palitan mo ng List<int>
       **/
    public class ScreenSave
    {
        public string id { get; set; }
        public int bloodgroup { get; set; }
        public int bloodgroupname { get; set; }
        public int bagtype { get; set; }
        public string bagtypename { get; set; }
        public string DonorRegistrationNO { get; set; }
        public int screentype { get; set; }
        public int status { get; set; }
        public string screenresultname { get; set; }

        public int verified { get; set; }
        public int screenverified { get; set; }
        public int screenresultNega { get; set; }
        public int screening { get; set; }
        public int groupoperatorid { get; set; }

        public int OperatorId { get; set; }
        public int stationId { get; set; }

        public List<componentidBinarylist> componentid { get; set; }
        public List<screenresultBinarylist> screenresult { get; set; }

        public List<int> componentids { set; get; }
        public List<int> screenresults { set; get; }
    }


}