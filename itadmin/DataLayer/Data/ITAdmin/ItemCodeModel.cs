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


namespace DataLayer
{

    public class ItemCodeModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();

        public bool Save(ItemCodeHeaderSave entry)
        {

            try
            {
                List<ItemCodeHeaderSave> ItemCodeHeaderSave = new List<ItemCodeHeaderSave>();
                ItemCodeHeaderSave.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlItemCodeHeaderSave",ItemCodeHeaderSave.ListToXml("ItemCodeHeaderSave"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.ItemCode_Save_SCS");
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

        public List<GetItemCodePatientPreparationFee> GetItemCodePatientPreparationFee()
        {
            DBHelper db = new DBHelper();

            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.ITEMCODE_PatientPreparationFee_SCS");

            List<GetItemCodePatientPreparationFee> list = new List<GetItemCodePatientPreparationFee>();
            if (dt.Rows.Count > 0) list = dt.ToList<GetItemCodePatientPreparationFee>();
            return list;

        }

        public List<GetItemAsstSurgeon> GetItemAsstSurgeon()
        {
            DBHelper db = new DBHelper();

            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.ITEMCODE_AsstSurgeon_SCS");

            List<GetItemAsstSurgeon> list = new List<GetItemAsstSurgeon>();
            if (dt.Rows.Count > 0) list = dt.ToList<GetItemAsstSurgeon>();
            return list;

        }


        public List<FetchRecoveryRoomCharges> FetchRecoveryRoomCharges(int OtId)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@OtId", OtId)
     
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Select2RecoveryRoomOtId_View_SCS");
            List<FetchRecoveryRoomCharges> list = new List<FetchRecoveryRoomCharges>();
            if (dt.Rows.Count > 0) list = dt.ToList<FetchRecoveryRoomCharges>();
            return list;
        }


    }

    public class ItemCodeHeaderSave
    {
        public int Action { get; set; }
        public int OTNO { get; set; }
        public string ItemCode { get; set; }
        public int Type { get; set; }
        public int DepartmentId { get; set; }
        public int OperatorId { get; set; }
    }


    public class GetItemCodePatientPreparationFee
    {
        public string ItemCode { get; set; }
    }


    public class GetItemAsstSurgeon
    {
        public string ItemCode { get; set; }
    }

    public class FetchRecoveryRoomCharges
    {
        public string ItemCode { get; set; }
        public string DepartmentName { get; set; }
        public int DepartmentId { get; set; }
    }

}



