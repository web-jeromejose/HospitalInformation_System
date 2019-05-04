using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;

using HIS_BloodBank.Models;

namespace HIS_BloodBank.Areas.BloodBank.Models
{
    public class PatientEditModel
    {
        public string ErrorMessage { get; set; }

        public List<PatientEdit> ShowSelected(int Id)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Registrationno", Id)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.PatientEditSearch");
            List<PatientEdit> list = new List<PatientEdit>();
            if (dt.Rows.Count > 0)
            {
                list = dt.ToList<PatientEdit>();
            }
            return list;

        }
        public bool Save(PatientEdit entry)
        {
            try
            {
                List<PatientEdit> PatientEdit = new List<PatientEdit>();
                PatientEdit.Add(entry);

                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@Action", entry.Action),
                    new SqlParameter("@xmlPatientEdit",PatientEdit.ListToXml("PatientEdit"))
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("BLOODBANK.PatientEditSave");
                this.ErrorMessage = db.param[0].Value.ToString();

                bool isOK = this.ErrorMessage.Split('-')[0] == "100";

                return isOK;
            }
            catch (Exception x)
            {
                this.ErrorMessage = x.Message;
                return false;
            }

        }

    }



    public class PatientEdit : Patient
    {
        public int Action { get; set; }
        public int BloodGroupId { get; set; }        
        public string PatientName { get; set; }
        public string AgeName { get; set; }
        public string GenderName { get; set; }
        public string BloodGroupName { get; set; }
    }


}