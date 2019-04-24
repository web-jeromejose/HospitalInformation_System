using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;


namespace DataLayer.ITAdmin.Model
{
    public class PackageVisit
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();
        public bool Save(PackageVisitSave entry)
        {

            try
            {
                List<PackageVisitSave> PackageVisitSave = new List<PackageVisitSave>();
                PackageVisitSave.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlPackageVisitSave",PackageVisitSave.ListToXml("PackageVisitSave"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.PackageVisit_Save_SCS");
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

        public List<PacakgeVisitDashBoard> PacakgeVisitDashBoard(int Service)
        {
           
            db.param = new SqlParameter[] {
            new SqlParameter("@Service", Service)
           
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.PackageVisit_DashBoard_SCS_New");
            List<PacakgeVisitDashBoard> list = new List<PacakgeVisitDashBoard>();
            if (dt.Rows.Count > 0) list = dt.ToList<PacakgeVisitDashBoard>();
            return list;
        }

        public List<PacakgeVisitView> PacakgeVisitView(int Service, int PackageId)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@Service", Service),
            new SqlParameter("@PackageId", PackageId)
           
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.PackageVisit_FetchDetails");
            List<PacakgeVisitView> list = new List<PacakgeVisitView>();
            if (dt.Rows.Count > 0) list = dt.ToList<PacakgeVisitView>();
            return list;
        }



      
    }



}

public class PacakgeVisitDashBoard
{
    public int SNo { get; set; }
    public int ID { get; set; }
    public string Test { get; set; }
    public string NoOfdays { get; set; }
    public string NoOfVisits { get; set; }
}

public class PacakgeVisitView
{
    public int SNo { get; set; }
    public int ID { get; set; }
    public string Test { get; set; }
    public string NoOfdays { get; set; }
    public string NoOfVisits { get; set; }
}

public class PackageVisitSave
{
    public int Action { get; set; }
    public int TestId { get; set; }
    public int NoOfDays { get; set; }
    public int NoOfVisits { get; set; }
    public int ServiceId { get; set; }
}
