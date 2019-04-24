using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;

namespace DataLayer
{
    public class IPTariffNewModel
    {
        public string ErrorMessage { get; set; }
        DBHelper db = new DBHelper();

        public List<ItemLisPrice> IPTariffPrice(int TariffID, int ServiceID, int ItemId)
        {
           
            db.param = new SqlParameter[] {
            new SqlParameter("@TariffID", TariffID),
            new SqlParameter("@ServiceID", ServiceID),
            new SqlParameter("@ItemId", ItemId)
  
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Tariff_IP_GetItemCodePrice_SCS");
            List<ItemLisPrice> list = new List<ItemLisPrice>();
            if (dt.Rows.Count > 0) list = dt.ToList<ItemLisPrice>();
            return list;
        }
        public List<ItemLisPrice> IPTariff_GetItemCodePriceNotDynamicTable(int TariffID, int ServiceID)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@TariffID", TariffID),
            new SqlParameter("@ServiceID", ServiceID) 
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.IPTariff_GetItemCodePriceNotDynamicTable");
            List<ItemLisPrice> list = new List<ItemLisPrice>();
            if (dt.Rows.Count > 0) list = dt.ToList<ItemLisPrice>();
            return list;
        }

        public List<ItemLisPrice> IPTariffPriceMedicalSuperVision(int TariffID, int ServiceID, int ItemId)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@TariffID", TariffID),
            new SqlParameter("@ServiceID", ServiceID),
            new SqlParameter("@ItemId", ItemId)
  
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Tariff_IP_GetItemCodePrice_MedicalSuperVision");
            List<ItemLisPrice> list = new List<ItemLisPrice>();
            if (dt.Rows.Count > 0) list = dt.ToList<ItemLisPrice>();
            return list;
        }
         public List<ItemLisPrice> IPTariffPriceBloodCrossMatch(int TariffID, int ServiceID, int ItemId)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@TariffID", TariffID),
            new SqlParameter("@ServiceID", ServiceID),
            new SqlParameter("@ItemId", ItemId)
  
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Tariff_IP_GetItemCodePrice_BloodCrossMatch");
            List<ItemLisPrice> list = new List<ItemLisPrice>();
            if (dt.Rows.Count > 0) list = dt.ToList<ItemLisPrice>();
            return list;
        }





         public List<ItemNewListPrice> IPTariffNewPriceWithEffectiveDate(int TariffID, int ServiceID, int ItemId)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
            new SqlParameter("@TariffID", TariffID),
            new SqlParameter("@ServiceID", ServiceID),
            new SqlParameter("@ItemId", ItemId)
  
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Tariff_IP_NewItemCodeWithEffectDate");
            List<ItemNewListPrice> list = new List<ItemNewListPrice>();
            if (dt.Rows.Count > 0) list = dt.ToList<ItemNewListPrice>();
            return list;
        }

        public List<ItemNewListPrice> IPTariffNewPrice()
        {
          //  DBHelper db = new DBHelper();
            //db.param = new SqlParameter[] {
            ////new SqlParameter("@TariffID", TariffID),
            ////new SqlParameter("@ServiceID", ServiceID),
            ////new SqlParameter("@ItemId", ItemId)
  
            //};
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Tariff_IP_NewItemPrice_SCS");
            List<ItemNewListPrice> list = new List<ItemNewListPrice>();
            if (dt.Rows.Count > 0) list = dt.ToList<ItemNewListPrice>();
            return list;
        }


        public bool Save(IPTariffHeaderSave entry)
        {
            var message = "";
            try
            {
                List<IPTariffHeaderSave> IPTariffHeaderSave = new List<IPTariffHeaderSave>();
                IPTariffHeaderSave.Add(entry);

                List<IPTariffDetailsSave> IPTariffDetailsSave = entry.IPTariffDetailsSave;
                if (IPTariffDetailsSave == null) IPTariffDetailsSave = new List<IPTariffDetailsSave>();


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlIPTariffHeaderSave",IPTariffHeaderSave.ListToXml("IPTariffHeaderSave")),
                    new SqlParameter("@xmlIPTariffDetailsSave", IPTariffDetailsSave.ListToXml("IPTariffDetailsSave")),
                                     
                };
                message = "xmlIPTariffDetailsSave :" + IPTariffDetailsSave.ListToXml("IPTariffDetailsSave").ToString();
                message += "xmlIPTariffHeaderSave :" + IPTariffHeaderSave.ListToXml("IPTariffHeaderSave").ToString();
                db.param[0].Direction = ParameterDirection.Output;
                 db.ExecuteSP("ITADMIN.IPTariffSave_SCS");
                 message = "step 2";
                this.ErrorMessage = db.param[0].Value.ToString();
                message = db.param[0].Value.ToString();
                bool isOK = this.ErrorMessage.Split('-')[0] == "100";

                return isOK;
            }
            catch (Exception x)
            {
                throw new Exception(message);
                //this.ErrorMessage = x.Message;
                //return false;
            }

        }

        public List<Select2Col1> ServiceList(string ID)
        {
            try
            {
                db.param = new SqlParameter[] 
                {
                   new SqlParameter("@Id", ID)
                };
                return db.ExecuteSPAndReturnDataTable("ITADMIN.IPTariff_GetServiceListWithDynamicTable").DataTableToList<Select2Col1>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }









    }

    public class IPTariffHeaderSave
    {
        public int Action { get; set; }
        public int TariffId { get; set; }
        public int ServiceId { get; set; }
        public int ItemId { get; set; }
        public int OperatorId { get; set; }
        public List<IPTariffDetailsSave> IPTariffDetailsSave { get; set; }
    
    }

    public class IPTariffDetailsSave
    {
        public int BedTypeId { get; set; }
        public string Price { get; set; }
        public string StartDate { get; set; }
    
    }


    public class ItemLisPrice
    {
        public string name { get; set; }
        public string Price { get; set; }
        public string StartDateTime { get; set; }
        public string BedTypeId { get; set; }
        public string ItemId { get; set; }

    }

    public class ItemNewListPrice
    {
        public int selected { get; set; }
        public string name { get; set; }
        public string Price { get; set; }
        public string startdatetime { get; set; }
        public string BedTypeId { get; set; }

    }


    //public class OPTariffHeaderSave
    //{
    //    public int Action { get; set; }
    //    public int Deleted { get; set; }
    //    public int TariffID { get; set; }
    //    public int ServiceID { get; set; }
    //    public List<OPTariffDetails> OPTariffDetails { get; set; }
    //}

    //public class OPTariffDetails
    //{
    //    public int Id { get; set; }
    //    public decimal Price { get; set; }
    
    //}

}



