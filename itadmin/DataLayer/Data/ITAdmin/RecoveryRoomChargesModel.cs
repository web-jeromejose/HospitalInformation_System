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
    public class RecoveryRoomChargesModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();

        public List<RecoveryRoomChargesDashBoard> RecoveryRoomChargesDashBoard(int CategoryId)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@CategoryId", CategoryId)

            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Select2RecoveryRoomCharges_SCS");
            List<RecoveryRoomChargesDashBoard> list = new List<RecoveryRoomChargesDashBoard>();
            if (dt.Rows.Count > 0) list = dt.ToList<RecoveryRoomChargesDashBoard>();
            return list;
        }

        public bool Save(RecoveryRoomChargesHeaderSave entry)
        {

            try
            {
                List<RecoveryRoomChargesHeaderSave> RecoveryRoomChargesHeaderSave = new List<RecoveryRoomChargesHeaderSave>();
                RecoveryRoomChargesHeaderSave.Add(entry);

                List<RecoveryRoomChargesDetailsSave> RecoveryRoomChargesDetailsSave = entry.RecoveryRoomChargesDetailsSave;
                if (RecoveryRoomChargesDetailsSave == null) RecoveryRoomChargesDetailsSave = new List<RecoveryRoomChargesDetailsSave>();


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlRecoveryRoomChargesHeaderSave",RecoveryRoomChargesHeaderSave.ListToXml("RecoveryRoomChargesHeaderSave")),
                    new SqlParameter("@xmlRecoveryRoomChargesDetailsSave",RecoveryRoomChargesDetailsSave.ListToXml("RecoveryRoomChargesDetailsSave"))
    
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.RecoveryRoomDetails_SAVE_SCS");
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


    public class RecoveryRoomChargesDashBoard
    {
        public int SNo { get; set; }
        public string OtNo { get; set; }
        public decimal Percentage { get; set; }
        public int OtId { get; set; }
  
    }

    public class RecoveryRoomChargesHeaderSave
    {
        public int Action { get; set; }
        public int CategoryId { get; set; }
        public int OperatorId { get; set; }
        public List<RecoveryRoomChargesDetailsSave> RecoveryRoomChargesDetailsSave { get; set; }
    
    }

    public class RecoveryRoomChargesDetailsSave
    {
        public int OtId {get; set;}
        public decimal Percentage {get; set;}    
    }
  




}

