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
    public class DonorSuffersModel
    {
        public string ErrorMessage { get; set; }

        public List<DonorSuffers> List()
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", -1)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.MainListDonorSuffers");
            List<DonorSuffers> list = new List<DonorSuffers>();
            if (dt.Rows.Count > 0) list = dt.ToList<DonorSuffers>();
            return list;

        }
        public List<DonorSuffers> ShowSelected(int id)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", id)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.MainListDonorSuffers");
            List<DonorSuffers> list = new List<DonorSuffers>();
            if (dt.Rows.Count > 0) list = dt.ToList<DonorSuffers>();
            return list;
        }
        public bool Save(DonorSuffers entry)
        {
            try
            {
                List<DonorSuffers> DonorSuffers = new List<DonorSuffers>();
                DonorSuffers.Add(entry);

                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@Action", entry.Action),
                    new SqlParameter("@xmlDonorSuffers",DonorSuffers.ListToXml("DonorSuffers"))
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("BLOODBANK.MasterDonorSuffersSave");
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