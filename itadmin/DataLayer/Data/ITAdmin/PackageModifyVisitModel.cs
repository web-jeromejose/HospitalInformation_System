using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;


namespace DataLayer.ITAdmin.Model
{
    public class PackageModifyVisit
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();

        public bool Save(PackageHeaderSave entry)
        {

            try
            {
                List<PackageHeaderSave> PackageHeaderSave = new List<PackageHeaderSave>();
                PackageHeaderSave.Add(entry);

                List<PackageDetailsTestSave> PackageDetailsTestSave = entry.PackageDetailsTestSave;
                if (PackageDetailsTestSave == null) PackageDetailsTestSave = new List<PackageDetailsTestSave>();


                List<PackageDetailsProcedSave> PackageDetailsProcedSave = entry.PackageDetailsProcedSave;
                if (PackageDetailsProcedSave == null) PackageDetailsProcedSave = new List<PackageDetailsProcedSave>();

                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlPackageHeaderSave",PackageHeaderSave.ListToXml("PackageHeaderSave")),  
                    new SqlParameter("@xmlPackageDetailsTestSave",PackageDetailsTestSave.ListToXml("PackageDetailsTestSave")),
                    new SqlParameter("@xmlPackageDetailsProcedSave",PackageDetailsProcedSave.ListToXml("PackageDetailsProcedSave")),  
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.OPModifyPackageSave_SCS");
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

        public List<PacakgeVisitTest> PacakgeVisitTest(int Pin)
        {
           
            db.param = new SqlParameter[] {
            new SqlParameter("@Pin", Pin)
           
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.OpPackage_DashBoardTest_SCS");
            List<PacakgeVisitTest> list = new List<PacakgeVisitTest>();
            if (dt.Rows.Count > 0) list = dt.ToList<PacakgeVisitTest>();
            return list;
        }


        public List<PacakgeVisitProcedure> PacakgeVisitProcedure(int Pin)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@Pin", Pin)
           
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.OpPackage_DashBoardTProcedure_SCS");
            List<PacakgeVisitProcedure> list = new List<PacakgeVisitProcedure>();
            if (dt.Rows.Count > 0) list = dt.ToList<PacakgeVisitProcedure>();
            return list;
        }

   
  
    

    }

}


public class PackageHeaderSave
{
    public int Action { get; set; }
    //public int PinNo  { get; set; }
    public List<PackageDetailsTestSave> PackageDetailsTestSave { get; set; }
    public List<PackageDetailsProcedSave> PackageDetailsProcedSave { get; set; }
   
}

public class PackageDetailsTestSave
{
    public int SNo { get; set; }
    public int PinNo { get; set; }
    public int DoctorId { get; set; }
    public int ItemId { get; set; }
    public int dayscompleted { get; set; }
    public int visitscompleted { get; set; }
    public string Remarks { get; set; }

}

public class PackageDetailsProcedSave
{
    public int SNo { get; set; }
    public int PinNo { get; set; }
    public int DoctorId { get; set; }
    public int ItemId { get; set; }
    public int dayscompleted { get; set; }
    public int visitscompleted { get; set; }
    public string Remarks { get; set; }

}


public class PacakgeVisitTest
{
    public int selected { get; set; }
    public int SNo { get; set; }
    public int TestId { get; set; }
    public string TestName { get; set; }
    public string doctor  { get; set; }
    public string PackDays { get; set; }
    public string PackVisits { get; set; }
    public string PinNo { get; set; }
    public string Patient { get; set; }
    public string Days { get; set;   }
    public string visits { get; set; }
    public string Remarks { get; set; }
    public int doctorid { get; set; }
    public int ItemId { get; set; }
    
}


public class PacakgeVisitProcedure
{
    public int selected { get; set; }
    public int SNo { get; set; }
    public string ProcedureName { get; set; }
    public string doctor { get; set; }
    public string PackDays { get; set; }
    public string PackVisits { get; set; }
    public string Days { get; set; }
    public string visits { get; set; }
    public string Remarks { get; set; }
    public string Patient { get; set; }
    public int TestId { get; set; }
    public int doctorid { get; set; }
    public string PinNo { get; set; }
    public int ItemId { get; set; }
    //public string OriginalDays { get; set; }

  
}

