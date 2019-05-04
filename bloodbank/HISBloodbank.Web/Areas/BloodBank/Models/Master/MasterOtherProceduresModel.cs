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
    public class MasterOtherProceduresModel
    {
        public string ErrorMessage { get; set; }

        public List<BBotherProcedures> List()
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", -1)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.MainListBBotherProcedures");
            List<BBotherProcedures> list = new List<BBotherProcedures>();
            if (dt.Rows.Count > 0) list = dt.ToList<BBotherProcedures>();
            return list;

        }
        public List<BBotherProcedures> ShowSelected(int id)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", id)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.MainListBBotherProcedures");
            List<BBotherProcedures> list = new List<BBotherProcedures>();
            if (dt.Rows.Count > 0) list = dt.ToList<BBotherProcedures>();
            return list;
        }
        public bool Save(BBotherProcedures entry)
        {
            try
            {
                List<BBotherProcedures> BBotherProcedures = new List<BBotherProcedures>();
                BBotherProcedures.Add(entry);

                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@Action", entry.Action),
                    new SqlParameter("@xmlBBotherProcedures",BBotherProcedures.ListToXml("BBotherProcedures"))
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("BLOODBANK.MasterBBotherProceduresSave");
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