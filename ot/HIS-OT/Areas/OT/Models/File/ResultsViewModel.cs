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
    public class ResultsViewModel
    {

        public List<ResultsViewResults> ShowResultsViewResults(int registrationno)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@registrationno", registrationno)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.ResultsViewResults");
            List<ResultsViewResults> list = new List<ResultsViewResults>();
            if (dt.Rows.Count > 0) list = dt.ToList<ResultsViewResults>();

            return list;
        }
        public List<ResultsViewOldResultsLab> ShowResultsViewOldResults(int registrationno, int type)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@registrationno", registrationno),
                new SqlParameter("@type", type)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.ResultsViewOldResults");
            List<ResultsViewOldResultsLab> list = new List<ResultsViewOldResultsLab>();
            if (dt.Rows.Count > 0) list = dt.ToList<ResultsViewOldResultsLab>();

            return list;
        }
        public List<ResultsViewEndoscopyNew> ShowResultsViewEndoscopyNew(int registrationno)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@registrationno", registrationno)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.ResultsViewEndoscopyNew");
            List<ResultsViewEndoscopyNew> list = new List<ResultsViewEndoscopyNew>();
            if (dt.Rows.Count > 0) list = dt.ToList<ResultsViewEndoscopyNew>();

            return list;
        }
        public List<ResultsViewEndoscopyOld> ShowResultsViewEndoscopyOld(int registrationno)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@registrationno", registrationno)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.ResultsViewEndoscopyOld");
            List<ResultsViewEndoscopyOld> list = new List<ResultsViewEndoscopyOld>();
            if (dt.Rows.Count > 0) list = dt.ToList<ResultsViewEndoscopyOld>();

            return list;
        }
        public List<ResultsViewCathLab> ShowResultsViewCathLab(int registrationno)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@registrationno", registrationno)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.ResultsViewCathLab");
            List<ResultsViewCathLab> list = new List<ResultsViewCathLab>();
            if (dt.Rows.Count > 0) list = dt.ToList<ResultsViewCathLab>();

            return list;
        }


    }


    public class ResultsViewResults
    {
        public string Station { get; set; }
        public int StID { get; set; }
        public int ID { get; set; }
        public string ReqNo { get; set; }
        public string Ipno { get; set; }
        public string OrderDateTime { get; set; }
        public string PName { get; set; }
        public string Doctor { get; set; }
        public string Sex { get; set; }
        public string AgetYpe { get; set; }
        public string Code { get; set; }
        public string Test { get; set; }
        public int PatientType { get; set; }
        public int TestID { get; set; }
        public int TestDoneBY { get; set; }
        public int verifiedby { get; set; }
    }
    public class ResultsViewOldResultsLab
    {
        public int ID { get; set; }
        public string PIN { get; set; }
        public string PT_NAME { get; set; }
        public string SEX { get; set; }
        public string AGE { get; set; }
        public string AGE1 { get; set; }
        public string SERVICE_CODE { get; set; }
        public string SERVICE_DESC { get; set; }
        public string ROOMNO { get; set; }
        public string DATETIME_COMPLETED { get; set; }
        public string DOC_CODE { get; set; }
        public string DOC_NAME { get; set; }
    }
    public class ResultsViewEndoscopyNew
    {
        public string ISSUEAUTHORITYCODE { get; set; }
        public int REGISTRATIONNO { get; set; }
        public string PATIENTNAME { get; set; }
        public int AGE { get; set; }
        public string AGETYPE { get; set; }
        public string SEX { get; set; }
        public int REQUESTID { get; set; }
        public string PATIENTTYPE { get; set; }
        public string PROCEDURENAME { get; set; }
        public string REPORTDATETIME { get; set; }
        public int REFERRALDOCTORID { get; set; }
        public int TESTDONEBYID { get; set; }
        public int BILLNO { get; set; }
        public string BILLDATETIME { get; set; }
        public int PROCEDUREID { get; set; }
        public int ORDERID { get; set; }
        public string REFERRALDOCTORNAME { get; set; }
        public string PIN { get; set; }
        public int SlNo { get; set; }
    }
    public class ResultsViewEndoscopyOld
    {
        public string PatientName { get; set; }
        public string PIN { get; set; }
        public int Age { get; set; }
        public string AgeType { get; set; }
        public string Sex { get; set; }
        public string VisitDate { get; set; }
        public string Room { get; set; }
        public string ReasonForReferral { get; set; }
        public string RelevantInvestigation { get; set; }
        public string PreMedications { get; set; }
        public string ReferredBy { get; set; }
        public string Biopsy { get; set; }
        public string Cytology { get; set; }
        public string Photo { get; set; }
        public string Video { get; set; }
        public string TXT_ITEM { get; set; }
        public string CONSULTANT { get; set; }
        public decimal V_NO { get; set; }
        public string REP_TYPE { get; set; }
    }
    public class ResultsViewCathLab
    {
        public int ID { get; set; }
        public string ORDERDATETIME { get; set; }
        public int ProcedureID { get; set; }
        public string ProcedureName { get; set; }
        public int PatientType { get; set; }
    }

}