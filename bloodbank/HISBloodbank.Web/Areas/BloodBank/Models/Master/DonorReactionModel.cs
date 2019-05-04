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
    public class DonorReactionModel
    {
        public string ErrorMessage { get; set; }

        public List<Reaction> List()
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", -1)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.MainListReaction");
            List<Reaction> list = new List<Reaction>();
            if (dt.Rows.Count > 0) list = dt.ToList<Reaction>();
            return list;

        }
        public List<Reaction> ShowSelected(int id)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", id)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.MainListReaction");
            List<Reaction> list = new List<Reaction>();
            if (dt.Rows.Count > 0) list = dt.ToList<Reaction>();
            return list;
        }
        public bool Save(Reaction entry)
        {
            try
            {
                List<Reaction> Reaction = new List<Reaction>();
                Reaction.Add(entry);

                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@Action", entry.Action),
                    new SqlParameter("@xmlReaction",Reaction.ListToXml("Reaction"))
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("BLOODBANK.MasterReactionSave");
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