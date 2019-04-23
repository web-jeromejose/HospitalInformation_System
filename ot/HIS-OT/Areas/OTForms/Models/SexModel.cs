using DataLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HIS_OT.Areas.OTForms.Models
{
    public class SexModel
    {
        DBHelper db = new DBHelper();

        public List<SexEntity> GetAllSex()
        {
            var dt = db.ExecuteSQLAndReturnDataTable("Select Id, Name from Sex where deleted = 0");
            var list = dt.ToList<SexEntity>();
            return list ?? new List<SexEntity>();
        }
    }

    public class SexEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}