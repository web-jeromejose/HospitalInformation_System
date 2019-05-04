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

    public class IssueEmergencyModel
    {
        public string ErrorMessage { get; set; }
        DBHelper db = new DBHelper();
        StringBuilder sql = new StringBuilder();

        public List<IssueEmergency> List()
        {
            DBHelper db = new DBHelper();
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.IssueEmergency");
            List<IssueEmergency> list = new List<IssueEmergency>();
            if (dt.Rows.Count > 0) list = dt.ToList<IssueEmergency>();
            return list;
        }


        public IssueEmergencyInfo GetIssueEmergencyById(int id)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@id", id)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.IssueEmergency_Info");
            List<IssueEmergencyInfo> list = new List<IssueEmergencyInfo>();
            if (dt.Rows.Count > 0) list = dt.ToList<IssueEmergencyInfo>();
            return list[0];
        }

        public List<IssueEmergency> GetIssueEmergencies()
        {
            DBHelper db = new DBHelper();
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.IssueEmergency");
            List<IssueEmergency> list = new List<IssueEmergency>();
            if (dt.Rows.Count > 0) list = dt.ToList<IssueEmergency>();
            return list;
        }

        public List<IssueEmergencyAvailable> GetIssueEmergencyAvailableByBloodgroupId(int id)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@bloodGroupId", id)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.IssueEmergency_Available");
            List<IssueEmergencyAvailable> list = new List<IssueEmergencyAvailable>();
            if (dt.Rows.Count > 0) list = dt.ToList<IssueEmergencyAvailable>();
            return list;
        }

        public bool AddIssueEmergency(IssueEmergencyVm model)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@orderNo", model.OrderNo)
                ,new SqlParameter("@ipId", model.IpId)
                ,new SqlParameter("@bedId", model.BedId)
                ,new SqlParameter("@stationId", model.StationId)
                ,new SqlParameter("@wardId", model.WardId)
                ,new SqlParameter("@operatorId", model.OperatorId)
                ,new SqlParameter("@bagNo", model.BagNo )
                ,new SqlParameter("@componentId", model.ComponentId)
                ,new SqlParameter("@quantity", model.Quantity)
                ,new SqlParameter("@volumeIssued", model.VolumeIssued)
                ,new SqlParameter("@receivedBy", model.ReceivedBy)
                ,new SqlParameter("@crossId", model.CrossId)
                ,new SqlParameter("@expiryDate", model.ExpiryDate)
                ,new SqlParameter("@transfusionType", model.TransfusionType)
                ,new SqlParameter("@bagGroup", model.BagGroup)
                ,new SqlParameter("@doctorId", model.DoctorId)
                ,new SqlParameter("@patBloodGroup", model.PatBloodGroup)
                ,new SqlParameter("@remarks", model.Remarks)
                ,new SqlParameter("@demandId", model.DemandId)
                ,new SqlParameter("@componentType", model.ComponentType)
                ,new SqlParameter("@bagId", model.BagId)
                ,new SqlParameter("@collectedBy", model.CollectedBy)
                ,new SqlParameter("@replacementBags", model.ReplacementBags)
            };
            db.ExecuteSP("BLOODBANK.IssueEmergency_Add");
            return true;
        }

        public bool Save(IssueEmergencySave entry)
        {
            StringBuilder sql = new StringBuilder();
            try
            {


                DBHelper db = new DBHelper();
                sql.Clear();
                sql.Append("  if not exists(select * from sys.tables where name = 'ScreenLogs' ) ");
                sql.Append("  BEGIN ");
                sql.Append("  CREATE TABLE [BLOODBANK].[ScreenLogs]( ");
                sql.Append("  [Transaction] [varchar](250) NULL, ");
                sql.Append("  [Table] [varchar](max) NULL, ");
                sql.Append("  [Details] [varchar](max) NULL, ");
                sql.Append("  [DateProcess] [datetime] NULL ");
                sql.Append("  ) ON [MasterFile] ");
                sql.Append("  END ");

 
                
                if (entry.issuedBag != null)
                {

                    sql.Append("   ");
                    sql.Append("  declare @transfusiontype int  = " + entry.TransfusionType);
                    sql.Append("  declare @stationId int =  " + entry.stationid);
                    sql.Append("  declare @operatorid int = " + entry.operatorid);
                    sql.Append("  declare @collectedby int = " + entry.collectedBy);
                    sql.Append("  declare @issuedby int = " + entry.IssuedBy);
                    sql.Append("  declare @bloodorderid int = " + entry.BloodOrderId);
                    sql.Append("  declare @remarks varchar(max)  = '" + entry.Remarks + "' ");
                    sql.Append("   ");
                    sql.Append("  declare @maxId int  ");
                    sql.Append("  declare @cvolume varchar(max)   ");
                    sql.Append("  declare @expirydate varchar(max)   ");
                    sql.Append("  declare @bloodbaggroup varchar(max)   ");
                    sql.Append("  declare @screenBagId varchar(max)   ");
                    sql.Append("  declare @ipid varchar(max)   ");
                    sql.Append("  declare @bagno varchar(max) ");

                    sql.Append("  select @ipid =ipid from  BloodOrder where id= @bloodorderid ");

                    foreach (var data in entry.issuedBag)
                    {

                       var bagno = data.bagno;
                       sql.Append("  SET @bagno = '" + bagno + "' ");
                       sql.Append("  select @maxId = isnull(max(id),0)+1 from Issue ");
                       sql.Append("  select @cvolume= Cvolume,@expirydate = ExpiryDate,@bloodbaggroup = Bloodgroup,@screenBagId = Bagid from screen where Bagnumber =@bagno  ");
                       sql.Append("   ");
                       sql.Append("   ");
                       sql.Append("  Insert Into Issue (id,Datetime,IPID,BedID,StationID,WardID,OperatorID ");
                       sql.Append("  ,BagNumber,ComponentID,Quantity,VolumeIssued,ReceivedBy,CrossID ");
                       sql.Append("  ,ExpiryDate,Transfusiontype,baggroup, DoctorID, PatBloodGroup, Remarks ");
                       sql.Append("  ,demandid,COMPONENTTYPE,bagid,collectedby,ReplacementBags) ");
                       sql.Append("   ");
                       sql.Append("  select @maxId,getdate(),ipid,bedid,@stationId,stationid,@operatorid,@bagno ,2,1,@cvolume,@issuedby,-2 ");
                       sql.Append("  ,@expirydate,@transfusiontype,@bloodbaggroup,doctorid,@bloodbaggroup,@remarks ");
                       sql.Append("  ,-2,1,@screenBagId,@collectedby,0 ");
                       sql.Append("  from  BloodOrder where id= @bloodorderid ");
                       sql.Append("   ");
                       sql.Append("  update Crossmatch Set Issued=1 where BAGNUMBER =@bagno and ipid=@ipid ");
                       sql.Append("  update Screen Set Cvolume =0, Issued=Issued +1 where BAGNUMBER =@bagno ");
                       sql.Append("   ");
                       sql.Append("    insert into [BLOODBANK].[ScreenLogs] values('Insert','Issue',' bagno  /bagno '" + bagno + "'  ',getdate())  ");
                

                    }
                    //sql.Append("  ------------END LOOP ");
                    sql.Append("   ");
                    sql.Append("   ");
                    sql.Append("  Update BloodOrder set Status=1, BOperatorID = @operatorid where ipid = @ipid and id= @bloodorderid ");
                    sql.Append("   ");
                    sql.Append("  ");
                  
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

    public class IssueEmergencySave
    {
        public int BloodOrderId { get; set; }
        public string Remarks { get; set; }
 
        public int TransfusionType { get; set; }
        public int collectedBy { get; set; }
        public int IssuedBy { get; set; }
        public int stationid { get; set; }
        public int operatorid { get; set; }

        public List<issuedBag> issuedBag { get; set; }
    }
    public class issuedBag {
        public string bagno { get; set; }
    }
    public class IssueEmergency
    {
        public int OrderNo { get; set; }
        public string OrderDateTime { get; set; }
        public string IssueAuthorityCode { get; set; }
        public string RegistrationNo { get; set; }
        public string PinNo { get; set; }
        public string IpId { get; set; }
        public string BedName { get; set; }
        public string BoperatorId { get; set; }
        public string PatientName { get; set; }
        public string RequestedByOperatorName { get; set; }
        public string Status { get; set; }
        public string AcknowledgeByName { get; set; }
        public string StationName { get; set; }
        public string Prefix { get; set; }
        public string StationSlNo { get; set; }
        public string AcknowledgeDate { get; set; }
    }

    public class IssueEmergencyInfo
    {
        public int OrderNo { get; set; }
        public string OrderDateTime { get; set; }
        public string IssueAuthorityCode { get; set; }
        public string RegistrationNo { get; set; }
        public string PinNo { get; set; }
        public string IpId { get; set; }
        public string BedId { get; set; }
        public string BedName { get; set; }
        public string BoperatorId { get; set; }
        public string PatientName { get; set; }
        public string Status { get; set; }
        public string AcknowledgeByName { get; set; }
        public string WardsId { get; set; }
        public string WardsName { get; set; }
        public string Age { get; set; }
        public string Gender { get; set; }
        public string AcknowledgeDate { get; set; }
        public string DoctorName { get; set; }
        public string BloodGroup { get; set; }
        public string BloodGroupId { get; set; } 
        public string DoctorId { get; set; }
    }

    public class IssueEmergencyAvailable
    {
        public int BagId { get; set; }
        public string BagNo { get; set; }
        public string DonationDate { get; set; }
        public string ExpiryDate { get; set; }
        public string BloodGroupName { get; set; }
        public string BloodGroupId { get; set; }
        public string CrossmatchDate { get; set; }
        public string CVolume { get; set; }
        public string ScreeningId { get; set; }
        public string Component { get; set; }
    }

    public class IssueEmergencyVm
    {
        public string OrderNo { get; set; }
        public string IpId { get; set; }
        public string BedId { get; set; }
        public string StationId { get; set; }
        public string WardId { get; set; }
        public string OperatorId { get; set; }
        public string BagNo { get; set; }
        public string ComponentId { get; set; }
        public string Quantity { get; set; }
        public string VolumeIssued { get; set; }
        public string ReceivedBy { get; set; }
        public string CrossId { get; set; }
        public string ExpiryDate { get; set; }
        public string TransfusionType { get; set; }
        public string BagGroup { get; set; }
        public string DoctorId { get; set; }
        public string PatBloodGroup { get; set; }
        public string Remarks { get; set; }
        public string DemandId { get; set; }
        public string ComponentType { get; set; }
        public string BagId { get; set; }
        public string CollectedBy { get; set; }
        public string ReplacementBags { get; set; }
    }
}
