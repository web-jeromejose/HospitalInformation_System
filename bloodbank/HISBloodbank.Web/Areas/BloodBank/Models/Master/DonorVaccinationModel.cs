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
    public class DonorVaccinationModel
    {
        public string ErrorMessage { get; set; }

        public List<DonorVaccination> List()
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", -1)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.MainListDonorVaccination");
            List<DonorVaccination> list = new List<DonorVaccination>();
            if (dt.Rows.Count > 0) list = dt.ToList<DonorVaccination>();
            return list;

        }
        public List<DonorVaccination> ShowSelected(int id)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", id)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.MainListDonorVaccination");
            List<DonorVaccination> list = new List<DonorVaccination>();
            if (dt.Rows.Count > 0) list = dt.ToList<DonorVaccination>();
            return list;
        }
        public bool Save(DonorVaccination entry)
        {
            try
            {
                List<DonorVaccination> DonorVaccination = new List<DonorVaccination>();
                DonorVaccination.Add(entry);

                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@Action", entry.Action),
                    new SqlParameter("@xmlDonorVaccination",DonorVaccination.ListToXml("DonorVaccination"))
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("BLOODBANK.MasterDonorVaccinationSave");
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