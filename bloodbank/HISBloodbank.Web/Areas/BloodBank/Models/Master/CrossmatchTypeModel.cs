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
    public class CrossmatchTypeModel
    {
        public string ErrorMessage { get; set; }

        public List<CrossMatchType> List()
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", -1)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.MainListCrossMatchType");
            List<CrossMatchType> list = new List<CrossMatchType>();
            if (dt.Rows.Count > 0) list = dt.ToList<CrossMatchType>();
            return list;

        }
        public List<CrossMatchType> ShowSelected(int id)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", id)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.MainListCrossMatchType");
            List<CrossMatchType> list = new List<CrossMatchType>();
            if (dt.Rows.Count > 0) list = dt.ToList<CrossMatchType>();
            return list;
        }
        public bool Save(CrossMatchType entry)
        {
            try
            {
                List<CrossMatchType> CrossMatchType = new List<CrossMatchType>();
                CrossMatchType.Add(entry);

                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@Action", entry.Action),
                    new SqlParameter("@xmlCrossMatchType",CrossMatchType.ListToXml("CrossMatchType"))
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("BLOODBANK.MasterCrossMatchTypeSave");
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