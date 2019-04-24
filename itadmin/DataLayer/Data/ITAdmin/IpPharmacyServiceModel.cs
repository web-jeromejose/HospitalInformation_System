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

    public class IpPharmacyServiceModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();


        public bool Save(IPPharmacyHeaderSave entry)
        {

            try
            {
                List<IPPharmacyHeaderSave> IPPharmacyHeaderSave = new List<IPPharmacyHeaderSave>();
                IPPharmacyHeaderSave.Add(entry);

                List<IPPharmacyDetailsSave> IPPharmacyDetailsSave = entry.IPPharmacyDetailsSave;
                if (IPPharmacyDetailsSave == null) IPPharmacyDetailsSave = new List<IPPharmacyDetailsSave>();


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlIPPharmacyHeaderSave",IPPharmacyHeaderSave.ListToXml("IPPharmacyHeaderSave")),
                    new SqlParameter("@xmlIPPharmacyDetailsSave",IPPharmacyDetailsSave.ListToXml("IPPharmacyDetailsSave"))
    
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.IPPharmacyService_Save");
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


        public List<IPPharmacyDashboardModel> IPPharmacyDashboardModel()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.IPPharmacyServices_DashBoard_SCS");
            List<IPPharmacyDashboardModel> list = new List<IPPharmacyDashboardModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<IPPharmacyDashboardModel>();
            return list;
        }

     

       
         }

        public class IPPharmacyDashboardModel
        {
            public int selected { get; set; }
            public string BedType { get; set; }
            public string CurrentMarkUp { get; set; }
            public string NewMarkUp { get; set; }
            public int Id { get; set; }
        }


        public class IPPharmacyHeaderSave
        {
            public int Action { get; set; }
            public int OperatorId { get; set; }
            public List<IPPharmacyDetailsSave> IPPharmacyDetailsSave { get; set; }
        
        
        }

        public class IPPharmacyDetailsSave
        {
            public int BedTypeId { get; set; }
            public int MarkupPer { get; set; }
           
        }


        

    
    }






