using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;

namespace DataLayer
{
    public class CopyTariffModel
    {
        public string ErrorMessage { get; set; }

        DBHelper db = new DBHelper();

        public bool Save(CopyTariffHeaderSave entry)
        {

            try
            {
                List<CopyTariffHeaderSave> CopyTariffHeaderSave = new List<CopyTariffHeaderSave>();
                CopyTariffHeaderSave.Add(entry);

                List<CopyIPTariffServiceDetailsSave> CopyIPTariffServiceDetailsSave = entry.CopyIPTariffServiceDetailsSave;
                if (CopyIPTariffServiceDetailsSave == null) CopyIPTariffServiceDetailsSave = new List<CopyIPTariffServiceDetailsSave>();


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlCopyTariffHeaderSave",CopyTariffHeaderSave.ListToXml("CopyTariffHeaderSave")),
                    new SqlParameter("@xmlCopyIPTariffServiceDetailsSave",CopyIPTariffServiceDetailsSave.ListToXml("CopyIPTariffServiceDetailsSave"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.CopyIPTariffSave_SCS");
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

        public bool SaveOP(CopyOPTariffHeaderSave entry)
        {

            try
            {
                List<CopyOPTariffHeaderSave> CopyOPTariffHeaderSave = new List<CopyOPTariffHeaderSave>();
                CopyOPTariffHeaderSave.Add(entry);

                List<CopyOPTariffServiceDetailsSave> CopyOPTariffServiceDetailsSave = entry.CopyOPTariffServiceDetailsSave;
                if (CopyOPTariffServiceDetailsSave == null) CopyOPTariffServiceDetailsSave = new List<CopyOPTariffServiceDetailsSave>();


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlCopyOPTariffHeaderSave",CopyOPTariffHeaderSave.ListToXml("CopyOPTariffHeaderSave")),
                    new SqlParameter("@xmlCopyOPTariffServiceDetailsSave",CopyOPTariffServiceDetailsSave.ListToXml("CopyOPTariffServiceDetailsSave"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                //db.ExecuteSP("ITADMIN.CopyOPTariffSave_SCS");
                db.ExecuteSP("ITADMIN.CopyOPTariffSave_2017");//NEW JEROME MArch 29 2017
                
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


        public List<CopyTariffDashBoard> CopyTariffDashBoard()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.IPService_Get_All_SCS");
            List<CopyTariffDashBoard> list = new List<CopyTariffDashBoard>();
            if (dt.Rows.Count > 0) list = dt.ToList<CopyTariffDashBoard>();
            return list;
        }

        public List<CopyTariffDashBoard> CopyOPTariffDashBoard()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.OPService_Get_All_SCS");
            List<CopyTariffDashBoard> list = new List<CopyTariffDashBoard>();
            if (dt.Rows.Count > 0) list = dt.ToList<CopyTariffDashBoard>();
            return list;
        }
 

    }


        public class CopyTariffDashBoard
        {
            public int ID { get; set; }
            public string ServiceName { get; set; }
    
    
        }





        public class CopyTariffHeaderSave
        {
            public int Action { get; set; }
            public int OperatorId { get; set; }
            public int fromTariffId { get; set; }
            public int toTariffId { get; set; }
            public decimal percentage { get; set; }
            public string Effecdate { get; set; }
            public List<CopyIPTariffServiceDetailsSave> CopyIPTariffServiceDetailsSave { get; set; }
        }

        public class CopyIPTariffServiceDetailsSave
        {
           
            public int serviceId { get; set; }
        
        }

        public class CopyOPTariffHeaderSave
        {
            public int Action { get; set; }
            public int OperatorId { get; set; }
            public int fromTariffId { get; set; }
            public int toTariffId { get; set; }
            public decimal percentage { get; set; }
            public string Effecdate { get; set; }
            public List<CopyOPTariffServiceDetailsSave> CopyOPTariffServiceDetailsSave { get; set; }
        }

        public class CopyOPTariffServiceDetailsSave
        {

            public int serviceId { get; set; }

        }



        public class CopyOPTariffDetails
        {
            public int fromOPTariffId { get; set; }
            public int toOPTariffId { get; set; }
            public decimal percentage { get; set; }
            public int OpserviceId { get; set; }
        
        
        }

}



