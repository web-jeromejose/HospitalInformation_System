using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Globalization;
using System.Data;
using System.ComponentModel;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Web;
using System.Data.SqlClient;


namespace DataLayer.ITAdmin.Model
{
    public class ORChargesModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();



        public bool Save(ORChargesHeaderSave entry)
        {

            try
            {
                List<ORChargesHeaderSave> ORChargesHeaderSave = new List<ORChargesHeaderSave>();
                ORChargesHeaderSave.Add(entry);

                List<ORChargesDetailsSave> ORChargesDetailsSave = entry.ORChargesDetailsSave;
                if (ORChargesDetailsSave == null) ORChargesDetailsSave = new List<ORChargesDetailsSave>();


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlORChargesHeaderSave",ORChargesHeaderSave.ListToXml("ORChargesHeaderSave")),
                    new SqlParameter("@xmlORChargesDetailsSave",ORChargesDetailsSave.ListToXml("ORChargesDetailsSave"))
    
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.IORCharge_SAVE_SCS");
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

        public List<ORChargesDashBoard> ORChargesDashBoard(int CategoryId)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@CategoryId", CategoryId)

            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.ORCharges_DashBoard_SCS");
            List<ORChargesDashBoard> list = new List<ORChargesDashBoard>();
            if (dt.Rows.Count > 0) list = dt.ToList<ORChargesDashBoard>();
            return list;
        }
       
    }

    public class ORChargesDashBoard
    {
        public int SNo { get; set; }
        public int ORNo { get; set; }
        public string ORNoName { get; set; }
        public string Percentage { get; set; }

    
    }

    public class ORChargesHeaderSave
    {
        public int Action { get; set; }
        public int CategoryId { get; set; }
        public int OperatorId {get; set;}
        public List<ORChargesDetailsSave> ORChargesDetailsSave {get; set;}
    }

    public class ORChargesDetailsSave
    {
        public int ORNo { get; set; }
        public decimal Percentage { get; set; }
    }

  




}

