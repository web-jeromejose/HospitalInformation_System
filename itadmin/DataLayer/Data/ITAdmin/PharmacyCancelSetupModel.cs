using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;


namespace DataLayer.ITAdmin.Model
{
    public class PharmacyCancelSetupModel
    {
                public string ErrorMessage { get; set; }

                DBHelper db = new DBHelper();

     public bool Save(PharmacySave entry)
     {

        try
        {
                List<PharmacySave> PharmacySave = new List<PharmacySave>();
                PharmacySave.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                new SqlParameter("@xmlPharmacySave",PharmacySave.ListToXml("PharmacySave"))     
                                     
        };

            db.param[0].Direction = ParameterDirection.Output;
            db.ExecuteSP("ITADMIN.PharmacyCancelSetUp_Save_SCS");
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

                public List<PharmacyCancelDashBoard> PharmacyCancelDashBoard()
                {
                    DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.PharmacyCancelDaysSetup_SCS");
                    List<PharmacyCancelDashBoard> list = new List<PharmacyCancelDashBoard>();
                    if (dt.Rows.Count > 0) list = dt.ToList<PharmacyCancelDashBoard>();
                    return list;
                }

                public List<PharmacyCancelView> PharmacyCancelView(int StationId)
                {

                    db.param = new SqlParameter[] {
                     new SqlParameter("@StationId", StationId)
           
           
                    };
                    DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.PharmacyCancelDaysSetup_View_SCS");
                    List<PharmacyCancelView> list = new List<PharmacyCancelView>();
                    if (dt.Rows.Count > 0) list = dt.ToList<PharmacyCancelView>();
                    return list;
                }
      }

    }

    public class PharmacyCancelDashBoard
    {
        public string Station { get; set; }
        public int NoOfDays { get; set; }
        public int StationId {get; set;}
    }

    public class PharmacyCancelView
    {
        public string Station { get; set; }
        public int NoOfDays { get; set; }
        public int StationId { get; set; }
    }

    public class PharmacySave
    {
        public int Action { get; set; }
        public int StationId { get; set; }
        public int NoOfDays { get; set; }
    }





