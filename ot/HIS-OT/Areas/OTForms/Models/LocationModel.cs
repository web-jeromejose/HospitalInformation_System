using DataLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HIS_OT.Areas.OTForms.Models
{
    public class LocationModel
    {
        DBHelper db = new DBHelper();

        public List<LocationEntity> GetAllLocation()
        {
            var dt = db.ExecuteSPAndReturnDataTable("OT.GetLocation");
            var list = dt.ToList<LocationEntity>();
            return list ?? new List<LocationEntity>();
        }
    }

    public class LocationEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}