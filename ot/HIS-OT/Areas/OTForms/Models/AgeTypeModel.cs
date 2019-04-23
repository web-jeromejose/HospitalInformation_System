using DataLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HIS_OT.Areas.OTForms.Models
{
    public class AgeTypeModel
    {
        DBHelper db = new DBHelper();
        public List<AgeTypeEntity> GetAllAgeType()
        {
            var dt = db.ExecuteSQLAndReturnDataTable("Select Id, Name from Agetype where deleted = 0");
            var list = dt.ToList<AgeTypeEntity>();
            return list ?? new List<AgeTypeEntity>();
        }
    }


    public class AgeTypeEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}