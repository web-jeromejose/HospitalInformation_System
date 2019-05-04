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
    public class CompatibilityModel
    {
        public string ErrorMessage { get; set; }

        public List<Compatability> List()
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", -1)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.MainListCompatability");
            List<Compatability> list = new List<Compatability>();
            if (dt.Rows.Count > 0) list = dt.ToList<Compatability>();
            return list;

        }
        public List<Compatability> ShowSelected(int id)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", id)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.MainListCompatability");
            List<Compatability> list = new List<Compatability>();
            if (dt.Rows.Count > 0) list = dt.ToList<Compatability>();
            return list;
        }
        public bool Save(Compatability entry)
        {
            try
            {
                List<Compatability> Compatability = new List<Compatability>();
                Compatability.Add(entry);

                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@Action", entry.Action),
                    new SqlParameter("@xmlCompatability",Compatability.ListToXml("Compatability"))
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("BLOODBANK.MasterCompatabilitySave");
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