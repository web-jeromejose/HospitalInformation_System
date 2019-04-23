using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Data.SqlClient;
using System.Data;

using DataLayer;
using HIS_OT.Areas.OT.Models;
using HIS_OT.Controllers;
using HIS_OT.Models;

namespace HIS_OT.Areas.OT.Models
{
    public class PackDefinitionModel
    {
        public string ErrorMessage { get; set; }

        public List<MainListPackDefinition> List()
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", -1)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.MainListPackDefinition");

            List<MainListPackDefinition> list = new List<MainListPackDefinition>();
            if (dt.Rows.Count > 0) list = dt.ToList<MainListPackDefinition>();
            return list;

        }
        public List<MainListPackDefinition> ShowSelected(int id)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", id)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.MainListPackDefinition");

            List<MainListPackDefinition> list = new List<MainListPackDefinition>();
            if (dt.Rows.Count > 0)
            {
                list = dt.ToList<MainListPackDefinition>();
                list[0].PackDefinitionSelected = this.GetPackDefinitionSelected(id);
            }
            return list;

        }

        public bool Save(CSSDProfile entry)
        {
            try
            {
                List<CSSDProfile> CSSDProfile = new List<CSSDProfile>();
                CSSDProfile.Add(entry);

                List<CSSDProfileDetail> CSSDProfileDetail = entry.CSSDProfileDetail;
                if (CSSDProfileDetail == null) CSSDProfileDetail = new List<CSSDProfileDetail>();

                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@Action", entry.Action),
                    new SqlParameter("@xmlCSSDProfile",CSSDProfile.ListToXml("CSSDProfile")),
                    new SqlParameter("@xmlCSSDProfileDetail",CSSDProfileDetail.ListToXml("CSSDProfileDetail"))
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("OT.PackDefinitionSave");
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

        public List<Items> GetItems()
        {
            DBHelper db = new DBHelper();
            //db.param = new SqlParameter[] {
            //    new SqlParameter("@Id", -1)
            //};
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.GetItems");

            List<Items> list = new List<Items>();
            if (dt.Rows.Count > 0) list = dt.ToList<Items>();
            return list;

        }




        private List<PackDefinitionSelected> GetPackDefinitionSelected(int id)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@ProfileId", id)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.GetPackDefinitionSelected");

            List<PackDefinitionSelected> list = new List<PackDefinitionSelected>();
            if (dt.Rows.Count > 0) list = dt.ToList<PackDefinitionSelected>();
            return list;

        }


    }








    public class MainListPackDefinition
    {
        public int Action { get; set; }
        public int id { get; set; }
        public string name { get; set; }
        public string Selected { get; set; }

        public List<PackDefinitionSelected> PackDefinitionSelected { get; set; }

    }
    public class PackDefinitionSelected
    {
        public int id { get; set; }
        public int ctr { get; set; }
        public string code { get; set; }
        public string name { get; set; }
        public int Qty { get; set; }
    }
    public class Items
    {
        public int id { get; set; }
        public string code { get; set; }
        public string name { get; set; }
    }

    public class CSSDProfile
    {
        public int Action { get; set; }
        public int id { get; set; }
        public string Name { get; set; }
        public int OperatorId { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public int Stationid { get; set; }
        public int stationslno { get; set; }

        public List<CSSDProfileDetail> CSSDProfileDetail { get; set; }

    }
    public class CSSDProfileDetail
    {
        public int ProfileId { get; set; }
        public int ItemId { get; set; }
        public int Qty { get; set; }
        public int slNo { get; set; }
    }




}