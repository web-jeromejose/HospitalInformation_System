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
    public class DonorAntidrugsModel
    {
        public string ErrorMessage { get; set; }

        public List<DonorAntidrugs> List()
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", -1)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.MainListDonorAntidrugs");
            List<DonorAntidrugs> list = new List<DonorAntidrugs>();
            if (dt.Rows.Count > 0) list = dt.ToList<DonorAntidrugs>();
            return list;

        }
        public List<DonorAntidrugs> ShowSelected(int id)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", id)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.MainListDonorAntidrugs");
            List<DonorAntidrugs> list = new List<DonorAntidrugs>();
            if (dt.Rows.Count > 0) list = dt.ToList<DonorAntidrugs>();
            return list;
        }
        public bool Save(DonorAntidrugs entry)
        {
            try
            {
                List<DonorAntidrugs> DonorAntidrugs = new List<DonorAntidrugs>();
                DonorAntidrugs.Add(entry);

                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@Action", entry.Action),
                    new SqlParameter("@xmlDonorAntidrugs",DonorAntidrugs.ListToXml("DonorAntidrugs"))
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("BLOODBANK.MasterDonorAntidrugsSave");
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