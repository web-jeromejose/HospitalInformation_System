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
    public class SplittingBagModel
    {
        public string ErrorMessage { get; set; }

        public List<SplittingBag> ShowSelected(string Id)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@bagnumber", Id)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.SplittingBagSearch");
            List<SplittingBag> list = new List<SplittingBag>();
            if (dt.Rows.Count > 0)
            {
                list = dt.ToList<SplittingBag>();
            }
            return list;

        }
        public bool Save(SplittingBag entry)
        {
            try
            {
                List<SplittingBag> SplittingBag = new List<SplittingBag>();
                SplittingBag.Add(entry);

                List<Screen> Screen = entry.Screen;
                if (Screen == null) Screen = new List<Screen>();

                List<ComponentScreen> ComponentScreen = entry.ComponentScreen;
                if (ComponentScreen == null) ComponentScreen = new List<ComponentScreen>();

                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@Action", entry.Action),
                    new SqlParameter("@xmlSplittingBag", SplittingBag.ListToXml("SplittingBag")),
                    new SqlParameter("@xmlScreen", Screen.ListToXml("Screen")),
                    new SqlParameter("@xmlComponentScreen", ComponentScreen.ListToXml("ComponentScreen"))
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("BLOODBANK.SplittingBagSave");
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




    public class SplittingBag : Screen
    {
        public int Action { get; set; }
        public string CurentId { get; set; }
        public int t { get; set; }
        public int qty { get; set; }
        public int OperatorID { get; set; }
        public List<Screen> Screen { get; set; }
        public List<ComponentScreen> ComponentScreen { get; set; }
        
    }







}