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
    public class AnesthesiaChargesModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();


        public List<AnesthesiaChargeDashBoard> AnesthesiaChargeDashBoard()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.AnesthesiaCharges_DashBoard_SCS");
            List<AnesthesiaChargeDashBoard> list = new List<AnesthesiaChargeDashBoard>();
            if (dt.Rows.Count > 0) list = dt.ToList<AnesthesiaChargeDashBoard>();
            return list;
        }

        public List<AnesthesiaChargeView> AnesthesiaChargeView(int CategoryId, int OTID, int ServiceId)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@CategoryId", CategoryId),
            new SqlParameter("@OTID", OTID),
            new SqlParameter("@ServiceId", ServiceId)
           
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.AnesthesiaCharges_View_SCS");
            List<AnesthesiaChargeView> list = new List<AnesthesiaChargeView>();
            if (dt.Rows.Count > 0) list = dt.ToList<AnesthesiaChargeView>();
            return list;
        }

        public bool Save(AnesthesiaChargeSave entry)
        {

            try
            {
                List<AnesthesiaChargeSave> AnesthesiaChargeSave = new List<AnesthesiaChargeSave>();
                AnesthesiaChargeSave.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlAnesthesiaChargeSave",AnesthesiaChargeSave.ListToXml("AnesthesiaChargeSave"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.AnesthesiaCharges_SCS_Save");
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


    public class AnesthesiaChargeSave
    {
        public int Action { get; set; }
        public int OperatorId { get; set; }
        public int CategoryId {get; set;}
        public int OTID {get; set;}
        public int ServiceID {get; set;}
        public decimal Percentage { get; set; }
    
    }



    public class AnesthesiaChargeDashBoard
    {
        public string category { get; set; }
        public string ANNAme { get; set; }
        public string OT { get; set; }
        public decimal Percentage { get; set; }
        public int categoryId { get; set; }
        public int AnId { get; set; }
        public int OTID { get; set; }
    }

    public class AnesthesiaChargeView
    {
        public string category { get; set; }
        public string ANNAme { get; set; }
        public string OT { get; set; }
        public decimal Percentage { get; set; }
        public int categoryId { get; set; }
        public int AnId { get; set; }
        public int OTID { get; set; }
    }


}

