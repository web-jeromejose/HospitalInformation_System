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
    public class DonorQuestionaireModel
    {
        public string ErrorMessage { get; set; }

        public List<DonorQuestionaires> List()
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", -1)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.MainListDonorQuestionaires");
            List<DonorQuestionaires> list = new List<DonorQuestionaires>();
            if (dt.Rows.Count > 0) list = dt.ToList<DonorQuestionaires>();
            return list;

        }
        public List<DonorQuestionaires> ShowSelected(int id)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", id)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.MainListDonorQuestionaires");
            List<DonorQuestionaires> list = new List<DonorQuestionaires>();
            if (dt.Rows.Count > 0) list = dt.ToList<DonorQuestionaires>();
            return list;
        }
        public bool Save(DonorQuestionaires entry)
        {
            try
            {
                List<DonorQuestionaires> DonorQuestionaires = new List<DonorQuestionaires>();
                DonorQuestionaires.Add(entry);

                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@Action", entry.Action),
                    new SqlParameter("@xmlDonorQuestionaires",DonorQuestionaires.ListToXml("DonorQuestionaires"))
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("BLOODBANK.MasterDonorQuestionairesSave");
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