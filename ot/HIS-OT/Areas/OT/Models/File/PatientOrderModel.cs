using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;
using HIS_OT.Models;

namespace HIS_OT.Areas.OT.Models
{
    public class PatientOrderModel
    {
        public List<PatientOrderList> PatientOrderList(int id)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@registrationno", id)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.PatientOrderList");
            List<PatientOrderList> list = dt.ToList<PatientOrderList>();
            return list ?? new List<PatientOrderList>();
        }
    }

    public class PatientOrderList
    {
        public string Type { get; set; }
        public string DepartmentName { get; set; }
        public string OrderID { get; set; }
        public DateTime? datetime { get; set; }
        public string name { get; set; }
        public string StationName { get; set; }
        public int DispatchQuantity { get; set; }
        public string Unit { get; set; }
        public string SerialNo { get; set; }
        public string operatorName { get; set; }
        public string status { get; set; }
        public int No { get; set; }
        public string datetimeD { get; set; }
    }

}