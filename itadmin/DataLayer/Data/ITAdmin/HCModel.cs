using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;

namespace DataLayer
{
    public class HCModel
    {
        public string ErrorMessage { get; set; }
        
        DBHelper db = new DBHelper();



        public bool Process(HeaderMapProcess entry)
        {

            try
            {
                List<HeaderMapProcess> HeaderMapProcess = new List<HeaderMapProcess>();
                HeaderMapProcess.Add(entry);

                List<ItemListMapProcess> ItemListMapProcess = entry.ItemListMapProcess;
                if (ItemListMapProcess == null) ItemListMapProcess = new List<ItemListMapProcess>();


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlHeaderMapProcess",HeaderMapProcess.ListToXml("HeaderMapProcess")),  
                    new SqlParameter("@xmlItemListMapProcess",ItemListMapProcess.ListToXml("ItemListMapProcess")),
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.HomeCareProcess_SCS");
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

        public List<ItemListDashboard> ItemListDashboard()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.HCListItem_DashBoard_SCS");
            List<ItemListDashboard> list = new List<ItemListDashboard>();
            if (dt.Rows.Count > 0) list = dt.ToList<ItemListDashboard>();
            return list;
        }




    }


    public class ItemListDashboard
    {
        public int SNo { get; set; }
        public string Test { get; set; }
        public string CostPrice { get; set; }
        public string Id { get; set; }
        public string NewCode { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
    
    }


    public class ItemListMap
    {
        public int SNo { get; set; }
        public string Test { get; set; }
        public string CostPrice { get; set; }
        public string Id { get; set; }
        public string NewCode { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
   

    }

    public class ItemListMapProcess
    {
        public int SNo { get; set; }
        public string Test { get; set; }
        public string CostPrice { get; set; }
        public string Id { get; set; }
        public string NewCode { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }

    }

    public class HeaderMapProcess
    {
        public int Action { get; set; }
        public List<ItemListMapProcess> ItemListMapProcess { get; set; }
    
    }




}



