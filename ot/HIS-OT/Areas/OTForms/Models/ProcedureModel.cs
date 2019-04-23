using DataLayer;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace HIS_OT.Areas.OTForms.Models
{
    public class ProcedureModel
    {
        DBHelper db = new DBHelper();
        public List<TestEntity> SearchTestProcedure(string term)
        {
            db.param = new SqlParameter[] {
                new SqlParameter("@term", term)
            };
            var dt = db.ExecuteSPAndReturnDataTable("[OT].[SearchTestProcedure]");
            var list = dt.ToList<TestEntity>();
            return list ?? new List<TestEntity>();
        }
    }


    public class TestEntity
    {
        public int Id { get; set; }

        public decimal CostPrice { get; set; }

        public string Code { get; set; }
        public string Name { get; set; }
    }
}