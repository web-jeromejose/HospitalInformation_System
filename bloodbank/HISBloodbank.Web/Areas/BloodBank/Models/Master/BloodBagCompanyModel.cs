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

    public class BloodBagCompanyModel
    {
        public string ErrorMessage { get; set; }

        public List<BBBagCompany> List()
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", -1)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.MainListBBBagCompany");
            List<BBBagCompany> list = new List<BBBagCompany>();
            if (dt.Rows.Count > 0) list = dt.ToList<BBBagCompany>();
            return list;

        }
        public List<BBBagCompany> ShowSelected(int id)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", id)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.MainListBBBagCompany");
            List<BBBagCompany> list = new List<BBBagCompany>();
            if (dt.Rows.Count > 0) list = dt.ToList<BBBagCompany>();
            return list;
        }
        public bool Save(BBBagCompany entry)
        {
            try
            {
                List<BBBagCompany> BBBagCompany = new List<BBBagCompany>();
                BBBagCompany.Add(entry);

                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@Action", entry.Action),
                    new SqlParameter("@xmlBBBagCompany",BBBagCompany.ListToXml("BBBagCompany"))
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("BLOODBANK.MasterBBBagCompanySave");
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