using DataLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HIS_OT.Areas.OTForms.Models
{
    public class StationModel
    {
        DBHelper db = new DBHelper();

        public List<StationEntity> GetAllStation()
        {
            var dt = db.ExecuteSQLAndReturnDataTable("Select Id, Name, ISNULL(Code,'') Code from Station where deleted = 0");
            var list = dt.ToList<StationEntity>();
            return list ?? new List<StationEntity>();
        }

        public List<StationEntity> GetStationByType(int stationTypeId)
        {
            var dt = db.ExecuteSQLAndReturnDataTable("Select Id, Name, ISNULL(Code,'') Code from Station where StationTypeID = "+stationTypeId.ToString()+" and deleted = 0");
            var list = dt.ToList<StationEntity>();
            return list ?? new List<StationEntity>();
        }
    }

    public class StationEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code {get;set;}
    }
}