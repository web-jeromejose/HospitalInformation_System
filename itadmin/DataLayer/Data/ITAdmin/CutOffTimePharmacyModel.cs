using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;


namespace DataLayer.ITAdmin.Model
{
    public class CutOffTimePharmacyModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();

        public bool Save(CutOffTimePharmacySave entry)
        {

            try
            {
                List<CutOffTimePharmacySave> CutOffTimePharmacySave = new List<CutOffTimePharmacySave>();
                CutOffTimePharmacySave.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlCutOffTimePharmacySave",CutOffTimePharmacySave.ListToXml("CutOffTimePharmacySave"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.CutOffTimePharmacySave_SCS");
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


        public List<CutOffTimePharmacy> CutOffTimePharmacyDAL(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT top 10 ID id,Name text,Name as name from Station where Name like '%" + id + "%' ").DataTableToList<CutOffTimePharmacy>();
        }


        public List<CutOffTimePharmcyView> CutOffTimePharmcyList(int Id)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@Id", Id),
            };

            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.CutOffTimePharmcyView_View_SCS");
            List<CutOffTimePharmcyView> list = new List<CutOffTimePharmcyView>();
            if (dt.Rows.Count > 0) list = dt.ToList<CutOffTimePharmcyView>();
            return list;
        }


    }


    public class CutOffTimePharmacySave
    {
        public int Action { get; set; }
        public int WardStationId { get; set; }
        public string CutOffTime { get; set; }
    }


    //public class CutOffTimePharmacy
    //{
    //    public string id { get; set; }
    //    public string text { get; set; }
    //    public string name { get; set; }

    //}

    public class CutOffTimePharmcyView
    {
        public string StationName { get; set; }
        public int StationId { get; set; }
        public string CutOffTime { get; set; }
    
    }


  
   
}



