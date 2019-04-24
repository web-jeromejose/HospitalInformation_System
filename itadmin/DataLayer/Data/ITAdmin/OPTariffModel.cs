using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;

namespace DataLayer
{
    public class OPTariffModel
    {
        public string ErrorMessage { get; set; }


        public List<ItemListNoPrice> ItemListNoPrice(int TariffID, int ServiceID, int DepartmentID, int TableExists)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
            new SqlParameter("@TariffID", TariffID),
            new SqlParameter("@ServiceID", ServiceID),
            new SqlParameter("@DepartmentID", DepartmentID),
            //new SqlParameter("@TableExists", SqlDbType.Bit)
            new SqlParameter("@TableExists", TableExists)


            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.TARIFF_OP_GetItemListNoPrice_SCS");
            List<ItemListNoPrice> list = new List<ItemListNoPrice>();
            if (dt.Rows.Count > 0) list = dt.ToList<ItemListNoPrice>();
            return list;
        }


        public List<ItemListNoPrice> ItemWithNoPrice(int TariffID, int ServiceID, int DepartmentID, int TableExists)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
            new SqlParameter("@TariffID", TariffID),
            new SqlParameter("@ServiceID", ServiceID),
            new SqlParameter("@DepartmentID", DepartmentID),
            //new SqlParameter("@TableExists", SqlDbType.Bit)
            new SqlParameter("@TableExists", TableExists)


            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.TARIFF_OP_GetItemListWithPrice_SCS");
            List<ItemListNoPrice> list = new List<ItemListNoPrice>();
            if (dt.Rows.Count > 0) list = dt.ToList<ItemListNoPrice>();
            return list;
        }



        public bool Save(OPTariffHeaderSave entry)
        {

            try
            {
                List<OPTariffHeaderSave> OPTariffHeaderSave = new List<OPTariffHeaderSave>();
                OPTariffHeaderSave.Add(entry);

                List<OPTariffDetails> OPTariffDetails = entry.OPTariffDetails;
                if (OPTariffDetails == null) OPTariffDetails = new List<OPTariffDetails>();

                List<OPTariffDetailsTest> OPTariffDetailsTest = entry.OPTariffDetailsTest;
                if (OPTariffDetailsTest == null) OPTariffDetailsTest = new List<OPTariffDetailsTest>();


                List<DetailsNotSelectedItem> OPTariffDetailsNotSelectedItem = entry.OPTariffDetailsNotSelectedItem;
                if (OPTariffDetailsNotSelectedItem == null) OPTariffDetailsNotSelectedItem = new List<DetailsNotSelectedItem>();



                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlOPTariffHeaderSave",OPTariffHeaderSave.ListToXml("OPTariffHeaderSave")),
                    new SqlParameter("@xmlOPTariffDetails", OPTariffDetailsTest.ListToXml("OPTariffDetails")),
                    new SqlParameter("@xmlOPTariffDetailsNotSelectedItem", OPTariffDetailsNotSelectedItem.ListToXml("OPTariffDetailsNotSelectedItem")),
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                //db.ExecuteSP("ITADMIN.OPTariffSave_SCS");//with no  xmlOPTariffDetailsNotSelectedItem in param
                db.ExecuteSP("ITADMIN.OPTariffSave_SCS_2017");
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


    public class ItemListNoPrice
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string Price { get; set; }
        public string ctr { get; set; }
        public string RefPrice { get; set; }
    
    }


    public class OPTariffHeaderSave
    {
        public int Action { get; set; }
        public int Deleted { get; set; }
        public int TariffID { get; set; }
        public int ServiceID { get; set; }
        public List<OPTariffDetails> OPTariffDetails { get; set; }
        public List<OPTariffDetailsTest> OPTariffDetailsTest { get; set; }
        public List<DetailsNotSelectedItem> OPTariffDetailsNotSelectedItem { get; set; }
    }

    public class OPTariffDetails
    {
        public int Id { get; set; }
        public string Price { get; set; }
        public string RefPrice { get; set; }
    
    }
    public class DetailsNotSelectedItem
    {
        public int Id { get; set; }
        public string Price { get; set; }
        public string RefPrice { get; set; }
    
    }

    public class OPTariffDetailsTest
    {
        public int Id { get; set; }
        public string Price { get; set; }
        public string RefPrice { get; set; }
    }
    
}



