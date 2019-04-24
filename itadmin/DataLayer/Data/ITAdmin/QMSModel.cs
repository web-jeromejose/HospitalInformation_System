using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;
using System.Text;


namespace DataLayer
{
    public class QMSModel
    {


        public string ErrorMessage { get; set; }
        DBHelper db = new DBHelper();

        public List<ShowZoneOnlyDT> showZoneOnly()
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Clear();

                sql.Append(" select A.Id, A.Code,A.Name,ISNULL(A.Service_Id,0) as ServiceId,A.Patient_Flow_Zone as Flow,C.Name as ServiceName ");
                sql.Append(" ,ISNULL(B.Name,A.Name) as ZoneName, ISNULL(B.Id,0) as ZoneId ");
       
                sql.Append("  ,A.His_Station_Id as StationId,stat.Name as StationName  ");
                sql.Append(" from  QMS.QMS_Locations A ");
                sql.Append(" left join QMS.QMS_Locations B on A.Parent_Id = B.Id ");
                sql.Append(" left join DBO.Station stat on A.His_Station_Id = stat.Id ");
                sql.Append(" Left Join QMS.QMS_Services C on A.Service_Id = C.Id ORder by ZoneName,A.Id ");

                return db.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<ShowZoneOnlyDT>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }


        public List<ListModel> GetDoctors()
        {
            try
            {
                return db.ExecuteSQLAndReturnDataTable(" select id,name as text, name from doctor where deleted =0 ").DataTableToList<ListModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public List<ListModel> GetStation()
        {
            try
            {
                return db.ExecuteSQLAndReturnDataTable(" select '0' as  id,'No Station' as text,'No Station' as  name union all  select id,name as text, name from dbo.station where deleted =0 ").DataTableToList<ListModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public List<ListModel> getteststationbylocid(string locid)
        {
            try
            {
                return db.ExecuteSQLAndReturnDataTable(" select B.Id,B.Name,B.name as text  from QMS.QMS_TestDestinationStation A left join dbo.Station B on A.Station_Id = B.ID where QMS_Location_Id = " + locid).DataTableToList<ListModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        
 
        public List<RoleModel> showQmsService()
        {
            return db.ExecuteSQLAndReturnDataTableLive(" select id, name as text ,name  from QMS.QMS_Services   ").DataTableToList<RoleModel>();
        }

        public List<RoleModel> showZoneList()
        {
            return db.ExecuteSQLAndReturnDataTableLive(" select id, name as text ,name   from QMS.QMS_Locations where Parent_Id is null and Service_Id is null   ").DataTableToList<RoleModel>();
        }

        public List<RoleModel> showLocationList()
        {
            return db.ExecuteSQLAndReturnDataTableLive(" select id, name as text ,name   from QMS.QMS_Locations   ").DataTableToList<RoleModel>();
        }


        

        public List<ZoneDT> showClinicByZoneId(string ZoneId)
        {
            try
            {
                StringBuilder sql = new StringBuilder();
                sql.Clear();
 
 
                sql.Append("   select A.Id,A.Code,A.Name,A.Service_Id as ServiceId,B.Name as ServiceName,A.Patient_Flow_Zone as Flow,'' as ZoneName,'0' as ZoneId ");
                sql.Append("   from QMS.QMS_Locations A ");
                sql.Append("   left join QMS.QMS_Services B on A.Service_Id = B.Id  ");
                sql.Append("   where A.Parent_Id = '" + ZoneId + "' ");
                sql.Append("   Order by A.Patient_Flow_Zone ");

                return db.ExecuteSQLAndReturnDataTableLive(sql.ToString()).DataTableToList<ZoneDT>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }



        public bool SaveNewZone(ZoneClinicSave entry)
        {
                 DBHelper db = new DBHelper();

                StringBuilder sql = new StringBuilder();
                sql.Clear();

                sql.Append("  insert into QMS.QMS_Locations (Code,Name,Parent_Id,Service_Id,Patient_Flow_Zone) ");
                sql.Append("  values ('" + entry.Code + "','" + entry.Name + "',NULL,NULL,'" + entry.Flow + "')  ");
                sql.Append("   ");
                sql.Append("   ");
               
                db.ExecuteSQLLive(sql.ToString());

                this.ErrorMessage = "Data Added!";

                return true;
        }
        public bool SaveNewClinic(ZoneClinicSave entry)
        {
                 DBHelper db = new DBHelper();

                StringBuilder sql = new StringBuilder();
                sql.Clear();

                sql.Append("  insert into QMS.QMS_Locations (Code,Name,Parent_Id,Service_Id,Patient_Flow_Zone) ");
                sql.Append("  values ('" + entry.Code + "','" + entry.Name + "','" + entry.Id + "','" + entry.ServiceId + "','" + entry.Flow + "')  ");
                sql.Append("   ");
                sql.Append("   ");
               
               
                db.ExecuteSQLLive(sql.ToString());

                this.ErrorMessage = "Data Added!";

                return true;
        }

        public bool SaveNewService(QmsService entry)
        {
            DBHelper db = new DBHelper();

            StringBuilder sql = new StringBuilder();
            sql.Clear();

            sql.Append(" insert into QMS.QMS_Services (Name) values ('"+entry.Name+"') ");
 
            sql.Append("   ");

            db.ExecuteSQLLive(sql.ToString());

            this.ErrorMessage = "Data Added!";

            return true;
        }


        public bool SaveTestZoneDoc(TestZoneDocDal entry)
        {
            DBHelper db = new DBHelper();

            StringBuilder sql = new StringBuilder();
            sql.Clear();
            sql.Append("   ");
            sql.Append("  declare @locationid varchar(max) = '"+entry.LocationId+"' ");
            sql.Append("  declare @stationid varchar(max) ");
            sql.Append("  Declare @operatodid int = "+entry.OperatorId);
            sql.Append("  ");
            sql.Append("  ");

            foreach (var i in entry.stationIds)
            {
                sql.Append("  SET @stationid = '"+i.stationId+"' ");
                sql.Append("  ");
                sql.Append("  delete from QMS.QMS_TestDestinationStation where QMS_Location_Id = @locationid ");
                sql.Append("  ");
                sql.Append("  insert into QMS.QMS_TestDestinationStation ( QMS_Location_Id,Station_Id,CreatedBy,CreatedDate,Active) ");
                sql.Append("  values (@locationid,@stationid,@operatodid,GETDATE(),1) ");
                sql.Append("  ");
            }


          

            db.ExecuteSQLLive(sql.ToString());

            this.ErrorMessage = "Zone Station has been updated!";

            return true;
        }

        public bool SaveDocLocation(QMSDocLoc entry)
        {
            DBHelper db = new DBHelper();

            StringBuilder sql = new StringBuilder();
            sql.Clear();

            sql.Append("  delete from  QMS.QMS_DoctorLocation where DoctorId = '" + entry.DoctorId + "'  ");
            sql.Append("  insert into QMS.QMS_DoctorLocation(Location_Id,DoctorId,OperatorId,DateCreated)  ");
            sql.Append("   values ('" + entry.LocationId + "','" + entry.DoctorId + "','" + entry.OperatorId + "',GETDATE())  ");
            sql.Append("   ");

            db.ExecuteSQLLive(sql.ToString());

            this.ErrorMessage = "Data Added!";

            return true;
        }


        public bool DeleteLocationById(ZoneClinicSave entry)
        {
            DBHelper db = new DBHelper();

            StringBuilder sql = new StringBuilder();
            sql.Clear();

            sql.Append("   delete from QMS.QMS_Locations where Id = '" + entry.Id + "' ");
            sql.Append("   ");

            db.ExecuteSQLLive(sql.ToString());

            this.ErrorMessage = "Data Removed!";

            return true;
        }

        public bool UpdateLocationById(ZoneClinicSave entry)
        {
            DBHelper db = new DBHelper();

            StringBuilder sql = new StringBuilder();
            sql.Clear();

            sql.Append("   UPDATE QMS.QMS_Locations ");
            sql.Append("   SET Code='" + entry.Code + "' ");
            sql.Append("   , Name='" + entry.Name + "' ");
            sql.Append("   , Patient_Flow_Zone ='" + entry.Flow + "' ");
            sql.Append("  where Id = '" + entry.Id + "'    ");

            db.ExecuteSQLLive(sql.ToString());

            this.ErrorMessage = "Data Updated!";

            return true;
        }
        public bool SaveStationLocation(ZoneStationSave entry)
        {
            DBHelper db = new DBHelper();

            StringBuilder sql = new StringBuilder();
            sql.Clear();

            sql.Append("   UPDATE QMS.QMS_Locations ");
            sql.Append("   SET HIS_Station_Id ='" + entry.StationId + "' ");
            sql.Append("  where Id = '" + entry.LocationId + "'    ");

            db.ExecuteSQLLive(sql.ToString());

            this.ErrorMessage = "Data Updated!";

            return true;
        }
        

    }
    public class ShowZoneOnlyDT
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string ServiceId { get; set; }
        public string ServiceName { get; set; }
        public string StationId { get; set; }
        public string StationName { get; set; }
        public string Flow { get; set; }
        public string ZoneName { get; set; }
        public string ZoneId { get; set; }

    }

    public class ZoneDT
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string ServiceId { get; set; }
        public string ServiceName { get; set; }
        public string Flow { get; set; }
        public string ZoneName { get; set; }
        public string ZoneId { get; set; }

    }
    public class ZoneClinicSave
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string ServiceId { get; set; }
        public string Flow { get; set; }
    }

    public class QmsService
    {
        public int Id { get; set; }
        public string Name { get; set; }

    }
    public class QMSDocLoc
    {
        public int LocationId { get; set; }
        public string DoctorId { get; set; }
        public int OperatorId { get; set; }
 
    }
    public class ZoneStationSave
    {
        public int StationId { get; set; }
        public string LocationId { get; set; }

    }

    public class TestZoneDocDal
    {
        public string LocationId { get; set; }
        public int OperatorId { get; set; }
        public List<TestZoneDocDalStation> stationIds { get; set; }
    }

    public class TestZoneDocDalStation
    {
        public string stationId { get; set; }
    }

    
}
