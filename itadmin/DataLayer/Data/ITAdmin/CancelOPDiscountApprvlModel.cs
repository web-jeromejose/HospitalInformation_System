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
    public class CancelOPDiscountApprvlModel
    {
        public string ErrorMessage { get; set; }

        DBHelper db = new DBHelper();


        public List<CancelOPDiscountApprvl> OpDiscountCancelApprovalView(int RegNo)
        {
            db.param = new SqlParameter[] {
                    new SqlParameter("@RegNo", RegNo)
                };

            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.CancelOPDiscountApproval_SCS");
            List<CancelOPDiscountApprvl> list = new List<CancelOPDiscountApprvl>();
            if (dt.Rows.Count > 0) list = dt.ToList<CancelOPDiscountApprvl>();
            return list;
        }




    }



    public class CancelOPDiscountApprvl
    {
        public string selected { get; set; }
        public string id { get; set; }
        public string visitdate { get; set; }
        public string reason { get; set; }
        public string status { get; set; }
    }
}