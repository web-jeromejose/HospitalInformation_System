using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;

namespace DataLayer
{

    public class CancelOPReceiptsModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();


        public bool Save(CancelOpReceiptMappingSaveHeader entry)
        {

            try
            {
                List<CancelOpReceiptMappingSaveHeader> CancelOpReceiptMappingSaveHeader = new List<CancelOpReceiptMappingSaveHeader>();
                CancelOpReceiptMappingSaveHeader.Add(entry);

                List<CancelOpReceiptMappingDetailsSave> CancelOpReceiptMappingDetailsSave = entry.CancelOpReceiptMappingDetailsSave;
                if (CancelOpReceiptMappingDetailsSave == null) CancelOpReceiptMappingDetailsSave = new List<CancelOpReceiptMappingDetailsSave>();


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlCancelOpReceiptMappingSaveHeader",CancelOpReceiptMappingSaveHeader.ListToXml("CancelOpReceiptMappingSaveHeader")),
                    new SqlParameter("@xmlCancelOpReceiptMappingDetailsSave", CancelOpReceiptMappingDetailsSave.ListToXml("CancelOpReceiptMappingDetailsSave")),
                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.CancelOPReceiptMappingSave_SCS");
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



        public List<CancelOPReceiptsDashboardModel> CancelOPReceiptsDashboardModel(string FromDate, string ToDate)
        {


            db.param = new SqlParameter[] {
            new SqlParameter("@FromDate", FromDate),
            new SqlParameter("@ToDate", ToDate)

            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.CancelOPReceipts_DashBoard_SCS");
            List<CancelOPReceiptsDashboardModel> list = new List<CancelOPReceiptsDashboardModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<CancelOPReceiptsDashboardModel>();
            return list;
        }

        public List<CancelOPReceiptsDashboardModel> CancelOPReceiptsMapping(DateTime FromDate, string ToDate, int RegNo, int Service, int opbillid, int SNO, string BillNo)
        {


            db.param = new SqlParameter[] {
            new SqlParameter("@FromDate", FromDate),
            new SqlParameter("@ToDate", ToDate),
            new SqlParameter("@RegNo", RegNo),
            new SqlParameter("@Service", Service),
            new SqlParameter("@opbillid",opbillid),
            new SqlParameter("@SNO",SNO),
            new SqlParameter("@BillNo",BillNo)

            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.CancelOPReceipts_ReceiptMapping_SCS");
            List<CancelOPReceiptsDashboardModel> list = new List<CancelOPReceiptsDashboardModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<CancelOPReceiptsDashboardModel>();
            return list;
        }

        public List<CancelOPReceiptView> CancelOPReceiptView(string FromDate, int RegNo,int Service)
        {


            db.param = new SqlParameter[] {
            new SqlParameter("@FromDate", FromDate),
            new SqlParameter("@RegNo", RegNo),
            new SqlParameter("@Service", Service)

            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.CancelOPReceipts_View_SCS");
            List<CancelOPReceiptView> list = new List<CancelOPReceiptView>();
            if (dt.Rows.Count > 0) list = dt.ToList<CancelOPReceiptView>();
            return list;
        }



       
         }



                public class CancelOPReceiptsDashboardModel
                {
          
                    public string PIN { get; set; }
                    public string billno { get; set; }
                    public string ServiceName { get; set; }
                    public string billdatetime { get; set; }
                    public string BillAmount { get; set; }
                    public string Cancelreason { get; set; }
                    public string serviceid { get; set; }
                    public string ReIssueBillNo { get; set; }
                    public string canceldatetime { get; set; }
                    public string opbillid { get; set; }
                    public string registrationno { get; set; }
                    public string SNO { get; set; }
                    public string tagId { get; set; }

                }



                public class CancelOPReceiptView
                {
                    public string billno { get; set; }
                    public string Servicename { get; set; }
                    public string DocCode { get; set; }
                    public string category { get; set; }
                    public string billdatetime { get; set; }
                    public string Amount { get; set; }
                    public string registrationno { get; set; }
                    public string serviceId { get; set; }
                    public string Id { get; set; }

                }

                public class CancelOpReceiptMappingSaveHeader
                {
                    public int Action { get; set; }

                    public List<CancelOpReceiptMappingDetailsSave> CancelOpReceiptMappingDetailsSave { get; set; }
    
                }

               public class CancelOpReceiptMappingDetailsSave
                {
                   public int OPBillId { get; set; }
                   public string ReIssueBillNo { get; set; }
                   public int tagId { get; set; }
               
               }


    
    }






