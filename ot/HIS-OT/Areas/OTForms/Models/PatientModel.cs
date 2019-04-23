using DataLayer;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace HIS_OT.Areas.OTForms.Models
{
    public class PatientEntity
    {
        public int RegistrationNo { get; set; }
        public int Sex { get; set; }
        public int Age { get; set; }
       
        public int AgeType { get; set; }
        public int Nationality { get; set; }
        public int PCity { get; set; }
        public int Country { get; set; }

        public string PatientName { get; set; }
        public string IssueAuthorityCode { get; set; }
        public string PIN { get; set; }
        public string PPhone { get; set; }
        public string CityName { get; set; }
        public string CountryName { get; set; }
        public string AgeTypeDesc { get; set; }

        public DateTime DateOfBirth { get; set; }
    }


    public class PatientModel{
        DBHelper db = new DBHelper();

        public List<PatientEntity> SearchPatient(string term)
        {

            db.param = new SqlParameter[] {
                new SqlParameter("@term", term)
            };
            var dt = db.ExecuteSPAndReturnDataTable("OT.SearchPatient");
            List<PatientEntity> list = dt.ToList<PatientEntity>();
            return list ?? new List<PatientEntity>();
        }

    }
}