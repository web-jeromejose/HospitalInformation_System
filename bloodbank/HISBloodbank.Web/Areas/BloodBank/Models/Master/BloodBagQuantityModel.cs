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
    public class BloodBagQuantityModel
    {
        public string ErrorMessage { get; set; }

        public List<BBBagQty> List()
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", -1)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.MainListBloodBagQuantity");
            List<BBBagQty> list = new List<BBBagQty>();
            if (dt.Rows.Count > 0) list = dt.ToList<BBBagQty>();
            return list;

        }
        public List<BBBagQty> ShowSelected(int id)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", id)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.MainListBloodBagQuantity");
            List<BBBagQty> list = new List<BBBagQty>();
            if (dt.Rows.Count > 0) list = dt.ToList<BBBagQty>();
            return list;
        }
        public bool Save(BBBagQty entry)
        {
            try
            {
                List<BBBagQty> BBBagQty = new List<BBBagQty>();
                BBBagQty.Add(entry);

                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@Action", entry.Action),
                    new SqlParameter("@xmlBBBagQty",BBBagQty.ListToXml("BBBagQty"))
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("BLOODBANK.MasterBBBagQtySave");
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