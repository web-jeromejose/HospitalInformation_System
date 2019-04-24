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

    public class IPCashMarkUpConfigModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();

        public bool Save(IPCashMarkupHeaderSave entry)
        {

            try
            {
                List<IPCashMarkupHeaderSave> IPCashMarkupHeaderSave = new List<IPCashMarkupHeaderSave>();
                IPCashMarkupHeaderSave.Add(entry);

                List<IPCashMarkupDetailsSave> IPCashMarkupDetailsSave = entry.IPCashMarkupDetailsSave;
                if (IPCashMarkupDetailsSave == null) IPCashMarkupDetailsSave = new List<IPCashMarkupDetailsSave>();


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlIPCashMarkupHeaderSave",IPCashMarkupHeaderSave.ListToXml("IPCashMarkupHeaderSave")),
                    new SqlParameter("@xmlIPCashMarkupDetailsSave",IPCashMarkupDetailsSave.ListToXml("IPCashMarkupDetailsSave"))
    
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.IPCashMarkUpConfig_Save");
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

        public List<IPCashMarkUpDashboard> IPCashMarkUpDashboard()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.IPCashMarkUpConfigDashBoard_SCS");
            List<IPCashMarkUpDashboard> list = new List<IPCashMarkUpDashboard>();
            if (dt.Rows.Count > 0) list = dt.ToList<IPCashMarkUpDashboard>();
            return list;
        }

        public List<GetDefaultCashMarkUpModel> GetDefaultCashMarkUpModel()
        {
            DBHelper db = new DBHelper();

            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.GetDefaultCashMarkUp_SCS");

            List<GetDefaultCashMarkUpModel> list = new List<GetDefaultCashMarkUpModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<GetDefaultCashMarkUpModel>();
            return list;

        }

       
    }


    public class IPCashMarkupHeaderSave
    {
        public int Action { get; set; }
        public int CashMarkUpDefault { get; set; }
        public List<IPCashMarkupDetailsSave>IPCashMarkupDetailsSave { get; set; }
    
    }

    public class IPCashMarkupDetailsSave
    {
        public int ID { get; set; }
    }


    public class IPCashMarkUpDashboard
    {
        public int selected { get; set; }
        public string ServiceName { get; set; }
        public int ID { get; set; }
    }

    public class GetDefaultCashMarkUpModel
    {
        public int CashMarkUp { get; set; }
    
    }



   

}



