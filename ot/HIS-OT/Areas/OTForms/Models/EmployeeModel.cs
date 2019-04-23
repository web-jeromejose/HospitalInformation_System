using DataLayer;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace HIS_OT.Areas.OTForms.Models
{
    public class EmployeeModel
    {
        DBHelper db = new DBHelper();

        public List<EmployeeEntity> SearchMedicalEmployee(string term)
        {
            db.param = new SqlParameter[] {
                new SqlParameter("@term", term)
            };
            var dt = db.ExecuteSPAndReturnDataTable("OT.SearchMedicalEmployee");
            var list = dt.ToList<EmployeeEntity>();
            return list ?? new List<EmployeeEntity>();
        }

        public List<EmployeeEntity> SearchMedicalSurgeon(string term)
        {
            db.param = new SqlParameter[] {
                new SqlParameter("@term", term)
            };
            var dt = db.ExecuteSPAndReturnDataTable("OT.SearchMedicalSurgeon");
            var list = dt.ToList<EmployeeEntity>();
            return list ?? new List<EmployeeEntity>();
        }
       
        public List<EmployeeEntity> SearchScrubNurse(string term)
        {
            db.param = new SqlParameter[] {
                new SqlParameter("@term", term)
            };
            var dt = db.ExecuteSPAndReturnDataTable("[OT].[SearchScrubNurse]");
            var list = dt.ToList<EmployeeEntity>();
            return list ?? new List<EmployeeEntity>();
        }

        public List<EmployeeEntity> SearchCirculatingNurse(string term)
        {
            db.param = new SqlParameter[] {
                new SqlParameter("@term", term)
            };
            var dt = db.ExecuteSPAndReturnDataTable("[OT].[SearchCirculatoryNurse]");
            var list = dt.ToList<EmployeeEntity>();
            return list ?? new List<EmployeeEntity>();
        }

        public List<EmployeeEntity> SearchDoctor(string term)
        {
            db.param = new SqlParameter[] {
                new SqlParameter("@term", term)
            };
            var dt = db.ExecuteSQLAndReturnDataTable("select Id ,EmployeeId, EmpCode ,Name from doctor where  (EmployeeID  like '%'+'" + term + "' OR Name like '%'+'" + term + "' +'%' OR EmpCode like '" + term + "'+'%') and deleted = 0 order by EmpCode ");
            var list = dt.ToList<EmployeeEntity>();
            return list ?? new List<EmployeeEntity>();
        }
    }

    public class EmployeeEntity
    {
        public int Id { get; set; }

        public string EmployeeId { get; set; }
        public string EmpCode { get; set; }
        public string Name { get; set; }
    }
}