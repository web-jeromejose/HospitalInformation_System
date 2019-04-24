using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;


namespace DataLayer.ITAdmin.Model
{
    public class ForceInPatientTransferModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();

        public List<ForceInPatientView> ForceInPatientView(int IPID)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@IPID", IPID)

            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Select2ForcePatient_BedTransfer");
            List<ForceInPatientView> list = new List<ForceInPatientView>();
            if (dt.Rows.Count > 0) list = dt.ToList<ForceInPatientView>();
            return list;
        }

        public List<Select2EmployeeAccess> GetRegno(string id)
        {
        //     public string id { get; set; }
        //public string text { get; set; }
            //public string name { get; set; } //a.RegistrationNo
            return db.ExecuteSQLAndReturnDataTableLive("SELECT a.ipid as id,  CAST( a.RegistrationNo  AS varchar(100)) + ' - '+ familyname + ' ' + firstname + ' ' + middlename + ' ' + lastname as text ,  b.name as name  FROM inpatient a LEFT JOIN bed b on a.ipid = b.ipid WHERE a.registrationno like '%" + id + "%' ").DataTableToList<Select2EmployeeAccess>();
        }
        public List<Select2EmployeeAccess> GetBedlist(string id)
        {
            //     public string id { get; set; }
            //public string text { get; set; }
            //public string name { get; set; } //a.RegistrationNo
            return db.ExecuteSQLAndReturnDataTableLive("select   id , name ,name as text from bed where Status = 1 and IPID = 0 and name  like '%" + id + "%' ").DataTableToList<Select2EmployeeAccess>();
        }


    }

    public class ForceInPatientView
    {
        public string PatientName { get; set; }
        public int RegistrationNo { get; set; }
        public string CurrentBed { get; set; }
        public int ipid { get; set; }
    }


    public class SaveInfoForceInPatientTransfer
    {
        public string IPID { get; set; }
        public string BedId { get; set; }
    }



}



