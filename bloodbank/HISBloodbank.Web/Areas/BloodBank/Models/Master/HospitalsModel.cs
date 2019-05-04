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
    public class HospitalsModel
    {
        public string ErrorMessage { get; set; }

        public List<IssueHospitals> List()
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", -1)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.MainListIssueHospitals");
            List<IssueHospitals> list = new List<IssueHospitals>();
            if (dt.Rows.Count > 0) list = dt.ToList<IssueHospitals>();
            return list;

        }
        public List<IssueHospitals> ShowSelected(int id)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", id)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.MainListIssueHospitals");
            List<IssueHospitals> list = new List<IssueHospitals>();
            if (dt.Rows.Count > 0) list = dt.ToList<IssueHospitals>();
            return list;
        }
        public bool Save(IssueHospitals entry)
        {
            try
            {
                List<IssueHospitals> IssueHospitals = new List<IssueHospitals>();
                IssueHospitals.Add(entry);

                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@Action", entry.Action),
                    new SqlParameter("@xmlIssueHospitals",IssueHospitals.ListToXml("IssueHospitals"))
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("BLOODBANK.MasterIssueHospitalsSave");
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



}