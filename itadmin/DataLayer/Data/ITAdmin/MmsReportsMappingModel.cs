using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;

namespace DataLayer
{
    public class MmsReportsMappingModel
    {
        public string ErrorMessage { get; set; }

        DBHelper db = new DBHelper();


        public List<MmsRepostMappingDashboard> MmsRepostMappingDashboard(int StationId)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@stationid", StationId)
  

            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.MMS_ReportsMapping");
            List<MmsRepostMappingDashboard> list = new List<MmsRepostMappingDashboard>();
            if (dt.Rows.Count > 0) list = dt.ToList<MmsRepostMappingDashboard>();
            return list;
        }

        public bool Save(MmsReportMappingSave entry)
        {

            try
            {
                List<MmsReportMappingSave> MmsReportMappingSave = new List<MmsReportMappingSave>();
                MmsReportMappingSave.Add(entry);

                //List<MmsReportMappingSaveDetails> CashDiscountDetailsSave = entry.MmsReportMappingSaveDetails;
                //if (CashDiscountDetailsSave == null) CashDiscountDetailsSave = new List<MmsReportMappingSaveDetails>();
 
                DBHelper db = new DBHelper();

                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlMmsReportHeader",MmsReportMappingSave.ListToXml("xmlMmsReportHeader")),
                    new SqlParameter("@xmlMmsReportHeaderDetails",entry.MmsReportMappingSaveDetails.ListToXml("xmlMmsReportHeaderDetails"))                                  
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.MMSReportsMapping_Save");
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

    public class MmsRepostMappingDashboard
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public int StnID { get; set; }
        public int chkbox { get; set; }
    }

    public class MmsReportMappingSave
    {
        public int StationID { get; set; }
        public int OperatorID { get; set; }
        public List<MmsReportMappingSaveDetails> MmsReportMappingSaveDetails { get; set; }
    }
    public class MmsReportMappingSaveDetails
    {
        public int ReportID { get; set; }
    }


}
