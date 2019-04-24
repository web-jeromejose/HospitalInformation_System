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


namespace DataLayer.ITAdmin.Model
{
    public class OTNursingAdminModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();


        public bool Save(OTNursingAdminHeaderSave entry)
        {

            try
            {
                List<OTNursingAdminHeaderSave> OTNursingAdminHeaderSave = new List<OTNursingAdminHeaderSave>();
                OTNursingAdminHeaderSave.Add(entry);

                List<OTNursingAdminDetaisSave> OTNursingAdminDetaisSave = entry.OTNursingAdminDetaisSave;
                if (OTNursingAdminDetaisSave == null) OTNursingAdminDetaisSave = new List<OTNursingAdminDetaisSave>();


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlOTNursingAdminHeaderSave",OTNursingAdminHeaderSave.ListToXml("OTNursingAdminHeaderSave")),
                    new SqlParameter("@xmlOTNursingAdminDetaisSave",OTNursingAdminDetaisSave.ListToXml("OTNursingAdminDetaisSave"))
    
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.OTNursingAdministration_SAVE_SCS");
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


        public List<OTNursingAdminDashBoard> OTNursingAdminDashBoard()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.OTNurseAdministration_DashBoard_SCS");
            List<OTNursingAdminDashBoard> list = new List<OTNursingAdminDashBoard>();
            if (dt.Rows.Count > 0) list = dt.ToList<OTNursingAdminDashBoard>();
            return list;
        }

        public List<OTNursingAdminView> OTNursingAdminView(int CategoryId)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@CategoryId", CategoryId)

            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.OTNurseAdministration_View_SCS");
            List<OTNursingAdminView> list = new List<OTNursingAdminView>();
            if (dt.Rows.Count > 0) list = dt.ToList<OTNursingAdminView>();
            return list;
        }
 

       
    }

    public class OTNursingAdminHeaderSave
    {
        public int Action { get; set; }
        public int CategoryId { get; set; }
        public int OperatorId { get; set; }
        public List<OTNursingAdminDetaisSave> OTNursingAdminDetaisSave { get; set; }
    
    }

    public class OTNursingAdminDetaisSave
    {
        public decimal Percentage { get; set; }
        public decimal Amount { get; set; }
        public decimal ExceedAmount { get; set; }
        public int BedTypeID { get; set; }
    
    }


    public class OTNursingAdminDashBoard
    {
        public int SNo { get; set; }
        public string BedType { get; set; }
        public string Percentage { get; set; }
        public string Amount { get; set; }
        public string ExceedAmount { get; set; }
        public int BedTypeID { get; set; }
    }

    public class OTNursingAdminView
    {
        public int SNo { get; set; }
        public string BedType { get; set; }
        public string Percentage { get; set; }
        public string Amount { get; set; }
        public string ExceedAmount { get; set; }
        public int BedTypeID { get; set; }
    }


}

