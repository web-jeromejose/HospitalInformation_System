using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;

using HIS_BloodBank.Models;

namespace HIS_BloodBank.Areas.BloodBank.Models
{
    public class BrokenBagModel
    {
        public string ErrorMessage { get; set; }

        public List<BrokenBag> ShowSelected()
        {
            DBHelper db = new DBHelper();
            //db.param = new SqlParameter[] {
            //    new SqlParameter("@Registrationno", Id)
            //};
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.BrokenBagSearch");
            List<BrokenBag> list = new List<BrokenBag>();
            if (dt.Rows.Count > 0)
            {
                list = dt.ToList<BrokenBag>();
            }
            return list;

        }




    }



    public class BrokenBag
    {
        public string bagnumber { get; set; }
        public string date1 { get; set; }
        public string col3 { get; set; }
        public string type { get; set; }
        public List<Screen> Screen { get; set; }
        public List<Component> Component { get; set; }
        public List<ComponentScreen> ComponentScreen { get; set; }
    }


}