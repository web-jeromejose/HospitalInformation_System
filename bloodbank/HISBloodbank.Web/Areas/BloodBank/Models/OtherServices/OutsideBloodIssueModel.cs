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
    public class OutsideBloodIssueModel
    {
        public string ErrorMessage { get; set; }
        DBHelper db = new DBHelper();
        StringBuilder sql = new StringBuilder();

        public List<BloodCategoryDAL> BloodCategory()
        {
            var TmpDynamicTable = "#tmpDynamicTableName_" + DateTime.Now.Minute + "_" + DateTime.Now.Millisecond + "_" + DateTime.Now.Second;
            sql.Clear();
            sql.Append("    declare @rowid int ");
            sql.Append("    declare @bloodgroupId int ");
            sql.Append("    declare @bloodgroupname varchar(max) ");
            sql.Append("    declare @SQL NVARCHAR(max) ");
            sql.Append("    declare @tmpTbl as table (bagnumber varchar(max),procid int,expiry datetime,tvolume varchar(max),bloodgroup int,bloodgroupname  varchar(max)) ");
            sql.Append("     ");
            sql.Append("    select *,IDENTITY(INT, 1,1) as rowid into  " + TmpDynamicTable + "  from BloodGroup where deleted = 0 ");
            sql.Append("    set @SQL  = N'  '  ");
            sql.Append("    WHILE EXISTS(select top 1 *  from  " + TmpDynamicTable + " )   ");
            sql.Append("    BEGIN ");
            sql.Append("    select  @rowid = rowid ,@bloodgroupId = id,@bloodgroupname = name from  " + TmpDynamicTable + "  order by rowid desc ");
            sql.Append("    set @SQL  = N'  '+@SQL+ N' ");
            sql.Append("    select  a.bagnumber,a.procid,a.expirydate as expiry,a.tvolume  ");
            sql.Append("    ,a.bloodgroup as bloodgroup,b.name as bloodgroupname ");
            sql.Append("    from screen a ,bloodgroup b ");
            sql.Append("    where a.screenValue = 0 and a.status=1   and b.id = a.Bloodgroup  ");
            sql.Append("    and a.broken=0  and a.issued=0 and a.expirydate>=getdate() ");
            sql.Append("    and a.bloodgroup='+cast(@bloodgroupId as varchar(20))+'  ");
            sql.Append("    union all'  ");
            sql.Append("    delete from " + TmpDynamicTable + "  where rowid = @rowid ");
            sql.Append("    END ");
            sql.Append("    set @SQL = LEFT(@SQL, LEN(@SQL) -9 )  ");
            sql.Append("    set @SQL  = N'  '+@SQL+ N'  order by a.bloodgroup,a.expirydate ' ");
            sql.Append("    print @SQL ");
            sql.Append("    INSERT INTO @tmpTbl  EXEC sp_executesql @SQL  ");
            sql.Append("    drop table  " + TmpDynamicTable + "  ");
            sql.Append("     ");
            sql.Append("    select * from @tmpTbl where procid = 1 order by bloodgroup,expiry ");
            List<BloodCategoryDAL> list = db.ExecuteSQLAndReturnDataTable(sql.ToString()).DataTableToList<BloodCategoryDAL>();
            return list;
        }

        public List<BloodCategoryDAL> SDPLRCategory()
        {
            var TmpDynamicTable = "#tmpDynamicTableName_" + DateTime.Now.Minute + "_" + DateTime.Now.Millisecond + "_" + DateTime.Now.Second;
            sql.Clear();
            sql.Append("    declare @rowid int ");
            sql.Append("    declare @bloodgroupId int ");
            sql.Append("    declare @bloodgroupname varchar(max) ");
            sql.Append("    declare @SQL NVARCHAR(max) ");
            sql.Append("    declare @tmpTbl as table (bagnumber varchar(max),procid int,expiry datetime,tvolume varchar(max),bloodgroup int,bloodgroupname  varchar(max)) ");
            sql.Append("     ");
            sql.Append("    select *,IDENTITY(INT, 1,1) as rowid into  " + TmpDynamicTable + "  from BloodGroup where deleted = 0 ");
            sql.Append("    set @SQL  = N'  '  ");
            sql.Append("    WHILE EXISTS(select top 1 *  from  " + TmpDynamicTable + " )   ");
            sql.Append("    BEGIN ");
            sql.Append("    select  @rowid = rowid ,@bloodgroupId = id,@bloodgroupname = name from  " + TmpDynamicTable + "  order by rowid desc ");
            sql.Append("    set @SQL  = N'  '+@SQL+ N' ");
            sql.Append("    select  a.bagnumber,a.procid,a.expirydate as expiry,a.tvolume  ");
            sql.Append("    ,a.bloodgroup as bloodgroup,b.name as bloodgroupname ");
            sql.Append("    from screen a ,bloodgroup b ");
            sql.Append("    where a.screenValue = 0 and a.status=1   and b.id = a.Bloodgroup  ");
            sql.Append("    and a.broken=0  and a.issued=0 and a.expirydate>=getdate() ");
            sql.Append("    and a.bloodgroup='+cast(@bloodgroupId as varchar(20))+'  ");
            sql.Append("    union all'  ");
            sql.Append("    delete from " + TmpDynamicTable + "  where rowid = @rowid ");
            sql.Append("    END ");
            sql.Append("    set @SQL = LEFT(@SQL, LEN(@SQL) -9 )  ");
            sql.Append("    set @SQL  = N'  '+@SQL+ N'  order by a.bloodgroup,a.expirydate ' ");
            sql.Append("    print @SQL ");
            sql.Append("    INSERT INTO @tmpTbl  EXEC sp_executesql @SQL  ");
            sql.Append("    drop table  " + TmpDynamicTable + "  ");
            sql.Append("     ");
            sql.Append("    select * from @tmpTbl where procid = 5 order by bloodgroup,expiry ");
            List<BloodCategoryDAL> list = db.ExecuteSQLAndReturnDataTable(sql.ToString()).DataTableToList<BloodCategoryDAL>();
            return list;
        }

        public List<ComponentCategoryDAL> ComponentCategory()
        {
            sql.Clear();
            sql.Append("    select distinct  a.componentid, bagnumber,a.expirydate as expirydate,b.tempname,a.bloodgroup,isnull(a.Qty,250) Qty ,d.name as bloodgroupname ");
            sql.Append("    from componentscreen a,component b,donorreg c ,BloodGroup d ");
            sql.Append("    where a.id *= c.id and a.status=1 and c.bloodgroup<>0 and b.type = 2  and d.id = a.bloodgroup");
            sql.Append("    and a.componentid= b.tempid and screeningresult=0 and issued=0 ");
            sql.Append("    and C.expirydate > getdate()  ");
            sql.Append("    and  broken=0 ");
            sql.Append("    order by b.tempname,a.bloodgroup,a.expirydate ");

            List<ComponentCategoryDAL> list = db.ExecuteSQLAndReturnDataTable(sql.ToString()).DataTableToList<ComponentCategoryDAL>();
            return list;
        }


        public List<Select2> Select2IssueHospital()
        {
            sql.Clear();

            sql.Append(" select   Id,Id as TempId,a.Code+'-'+a.name as Name, a.Code+'-'+a.name as Text  ");
            sql.Append("  from IssueHospitals a  where a.deleted = 0 ");          
            List<Select2> list = db.ExecuteSQLAndReturnDataTable(sql.ToString()).DataTableToList<Select2>();

            return list;

        }

        public List<Select2StringALL> Select2OutSideBagperHospital(int hospitalid, string name)
        {
            sql.Clear();

            sql.Append(" select purchasebagnumber as Id ,purchasebagnumber as tempid ,purchasebagnumber as text ,purchasebagnumber as name from outsidebagscollection where  Hospitalid =" + hospitalid + "   ");
            sql.Append("  and Screenbagnumber like '%" + name + "%'  and id not  in  (select collectionid from BloodcollectionIssues where Completed=1   )  ");
            List<Select2StringALL> list = db.ExecuteSQLAndReturnDataTable(sql.ToString()).DataTableToList<Select2StringALL>();

            return list;

        }
        public bool Save(OutsideBloodIssueSave entry)
        {
            StringBuilder sql = new StringBuilder();
            try
            {

                sql.Clear();
                DBHelper db = new DBHelper();
                sql.Append("  declare @operatorid int = "+entry.operatorid);
                sql.Append("  declare @StationId int = "+entry.StationId);
                sql.Append("  declare @HospitalId int =  "+entry.HospitalId);
                sql.Append("  declare @completed int = "+entry.completed);
                sql.Append("  declare @Patname varchar(max) = '"+entry.Patname+"' ");
                sql.Append("  declare @billno varchar(max) = '" + entry.billno + "' ");
                sql.Append("   ");
                sql.Append("  declare @OutsideBagnumber varchar(max)  ");
                sql.Append("  declare @Bagnumber varchar(max)  ");
                sql.Append("  declare @ExpiryDate datetime ");
                sql.Append("  declare @BloodGroup int ");
                sql.Append("  declare @Componentid int ");
                sql.Append("  declare @tbId int ");
                sql.Append("  declare @tbGroupId int ");
                sql.Append("  declare @OutsideBgId int ");
                sql.Append("   ");
                sql.Append("   ");
                sql.Append("  select @tbId = max(id),@tbGroupId = max(groupid) from otherissues ");
            
                sql.Append("   ");
                sql.Append("   ");

          
                if (entry.OutsideBloodIssueCategory != null)
                {

                    foreach (var item in entry.OutsideBloodIssueCategory.Where(i => i.bagnumber != null))
                    {
                        var bagnumber = item.bagnumber;
                        //sql.Append("  --LOOP START for the Blood catergory ");
                        sql.Append("   ");
                        sql.Append("  SET @Bagnumber = '" + bagnumber + "'");
                        sql.Append("   ");
                        sql.Append("   ");
                        //sql.Append("  --------COMPONENT ");
                        sql.Append("  if exists(select * from componentscreen where bagnumber=@Bagnumber ) BEGIN ");
                        sql.Append("  select @ExpiryDate = Expirydate,@BloodGroup = BloodGroup,@Componentid = Componentid from componentscreen where bagnumber=@Bagnumber ");
                        sql.Append("   insert into otherissues(id,HospitalId,IssueDate,Bagnumber,BloodGroup,ExpiryDate,OPERATORID,StationId,Componentid,Crossid,Collectid,groupid,Patname,billno) ");
                        sql.Append("  values(@tbId,@HospitalId, getdate(),@Bagnumber,@BloodGroup,@ExpiryDate,@operatorid,@StationId,@Componentid,1 ,0,@tbGroupId,@Patname,@billno) ");
                        sql.Append("  update componentscreen set issued=1 where bagnumber=@Bagnumber ");
                        sql.Append("  END ");
                        sql.Append("   ");
                        //sql.Append("  ---------BLOOD / PLASMA ");
                        sql.Append("  ELSE BEGIN  ");
                        sql.Append("  select @ExpiryDate = Expirydate,@BloodGroup = BloodGroup,@Componentid = Component from screen where bagnumber=@Bagnumber  ");
                        sql.Append("  insert into otherissues( id,HospitalId,IssueDate,Bagnumber,BloodGroup,ExpiryDate,OPERATORID,StationId,Componentid,Crossid,Collectid,groupid,Patname,billno) ");
                        sql.Append("  values(@tbId,@HospitalId, getdate(),@Bagnumber,@BloodGroup,@ExpiryDate,@operatorid,@StationId,@Componentid,0 ,0,@tbGroupId,@Patname,@billno) ");
                        sql.Append("  update screen set issued=1,Cvolume=0 where bagnumber=@Bagnumber ");
                        sql.Append("   ");
                        sql.Append("  END ");
                        //sql.Append("  --LOOP END for the Blood catergory ");
                        sql.Append("   ");

                    }
                    sql.Append("   ");

                }

                if (entry.OutsideBloodIssueHospBag != null)
                {

                    foreach (var item in entry.OutsideBloodIssueHospBag.Where(i => i.bagnumber != null))
                    {
                        var bagnumber = item.bagnumber;

                        sql.Append("   ");
                        //sql.Append("  --LOOP START for the Outside bag collection ");
                        sql.Append("  SET @OutsideBagnumber = '" + bagnumber + "'");
                        sql.Append("   ");
                        sql.Append("  if exists(select * from outsidebagscollection where purchasebagnumber=@OutsideBagnumber )  ");
                        sql.Append("  BEGIN ");
                        sql.Append("   ");
                        sql.Append("  select @OutsideBgId = id  from outsidebagscollection where purchasebagnumber =  @OutsideBagnumber ");
                        sql.Append("   ");
                        sql.Append("  Insert into BloodcollectionIssues(Hospitalid,Collectionbag, Issuebag,Collectionid,Issueid,Datetime,Operatorid,Completed) ");
                        sql.Append("  Values(@HospitalId,  @OutsideBagnumber,'',@OutsideBgId,@tbId,  getdate(),@operatorid,@completed) ");
                        sql.Append("   ");
                        sql.Append("  END ");

                        //sql.Append("  --LOOP END for the Outside bag collection ");
                    }
                    sql.Append("   ");

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
    public class OutsideBloodIssueSave
    {
 
        public int operatorid { get; set; }
        public int StationId { get; set; }
        public int HospitalId { get; set; }
        public int completed { get; set; }
        public string Patname { get; set; }
        public string billno { get; set; }
        public List<OutsideBloodIssueCategory> OutsideBloodIssueCategory { get; set; }
        public List<OutsideBloodIssueHospBag> OutsideBloodIssueHospBag { get; set; }
      
    }
    public class OutsideBloodIssueCategory
    {
        public string bagnumber { get; set; }

    }
    public class OutsideBloodIssueHospBag
    {
        public string bagnumber { get; set; }

    }
    public class BloodCategoryDAL
    {
        public string bagnumber { get; set; }
        public int procid { get; set; }
        public string expiry { get; set; }
        public string tvolume { get; set; }
        public int bloodgroup { get; set; }
        public string bloodgroupname { get; set; }
    }
    public class ComponentCategoryDAL
    {
        public int componentid { get; set; }
        public string bagnumber { get; set; }
        public string expirydate { get; set; }
        public string tempname { get; set; }
        public int bloodgroup { get; set; }
        public int Qty { get; set; }
        public string bloodgroupname { get; set; }
    }

    public class OutsideBagDAL
    {
        public int Id { get; set; }
        public string Screenbagnumber { get; set; }
        public int Hospitalid { get; set; }
 
    }
    public class Select2StringALL
    {
        public string id { get; set; }
        public string tempid { get; set; }
        public string name { get; set; }
        public string text { get; set; }
    }



}