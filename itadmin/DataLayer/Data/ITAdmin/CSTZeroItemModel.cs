using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;

namespace DataLayer
{
    public class CSTZeroItemModel
    {
        public string ErrorMessage { get; set; }
        
        DBHelper db = new DBHelper();


        public List<CSSITEMModel> CSSITEMModel()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.CSSItem_DashBoard_SCS");
            List<CSSITEMModel> list = new List<CSSITEMModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<CSSITEMModel>();
            return list;
        }

        public List<CSSITEMZeroPriceModel> CSSITEMZeroPriceModel()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.CSSItemZeroPrice_DashBoard_SCS");
            List<CSSITEMZeroPriceModel> list = new List<CSSITEMZeroPriceModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<CSSITEMZeroPriceModel>();
            return list;
        }


        public bool Save(CSTHeaderSave entry)
        {

            try
            {
                List<CSTHeaderSave> CSTHeaderSave = new List<CSTHeaderSave>();
                CSTHeaderSave.Add(entry);

                List<CSTZeroItemDetails> CSTZeroItemDetails = entry.CSTZeroItemDetails;
                if (CSTZeroItemDetails == null) CSTZeroItemDetails = new List<CSTZeroItemDetails>();

                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlCSTHeaderSave",CSTHeaderSave.ListToXml("CSTHeaderSave")),
                    new SqlParameter("@xmlCSTZeroItemDetails", CSTZeroItemDetails.ListToXml("CSTZeroItemDetails")),

                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.CSTZeroPrice_Save_SCS");
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

    public class CSTHeaderSave
    {
        public int Action { get; set; }
        public int OperatorId { get; set; }
        public List<CSTZeroItemDetails> CSTZeroItemDetails { get; set; }
    }

    public class CSTZeroItemDetails 
    {
        public int ItemID { get; set; }
        public string ItemCode { get; set; }
        public string ItemName { get; set; }
        public int CategoryId { get; set; }
    
    }

    public class CSSITEMModel 
    {
        public string SelectedItem { get; set; }
        public string ItemCode { get; set; }
        public string Name { get; set; }
        public string CategoryID { get; set; }
        public int ItemId { get; set; }
    }

    public class CSSITEMZeroPriceModel
    {
        public string SelectedItem { get; set; }
        public string ItemCode { get; set; }
        public string Name { get; set; }
        public int CategoryID { get; set; }
        public int ItemId { get; set; }
    }


}



