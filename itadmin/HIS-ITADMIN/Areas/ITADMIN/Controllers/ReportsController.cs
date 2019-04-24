using DataLayer;
using DataLayer.ITAdmin.Data;
using DataLayer.ITAdmin.Model;
using HIS.Controllers;
using HIS_ITADMIN.Areas.ITADMIN.Models;
using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Security;
using System.Security.Permissions;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

 
namespace HIS_ITADMIN.Areas.ITADMIN.Controllers
{
    public class ReportsController : BaseController
    {
        //
        // GET: /ITADMIN/Reports/

        public ActionResult AramcoMonthlyEncounter()
        {
       
            return View();
        }
        public ActionResult Aramco_PerCapita()
        {
            return View();
        }

        public ActionResult TimeInOutAuditTrail()
        {

            return View();
        }

        public ActionResult Select2Department(string searchTerm, int pageSize, int pageNum)
        {
            Select2DepartmentRepository list = new Select2DepartmentRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }


        #region DownloadCompanyPriceList

        public ActionResult DownloadCompanyPrice()
        {
            SghUtilitiesDB DB = new SghUtilitiesDB();

            DownloadCompanyPrice model = new DownloadCompanyPrice();
            model.TariffList = DB.GetTariffList();
            return View(model);
        }

        public FileResult DownloadCompanyPriceToPdf()
        {
            JavaScriptSerializer js = new JavaScriptSerializer();
            FilterDownloadCompanyPriceToPdf[] filter = js.Deserialize<FilterDownloadCompanyPriceToPdf[]>(this.GetFilter());

            string TariffId = filter[0].TariffId;
            string IporOp = filter[0].IporOp;

            return File(this.ToPDFDownloadCompanyPrice(IporOp,TariffId), "application/pdf");

        }

        public FileResult DownloadCompanyPriceToXLS()
        {
            JavaScriptSerializer js = new JavaScriptSerializer();
            FilterDownloadCompanyPriceToPdf[] filter = js.Deserialize<FilterDownloadCompanyPriceToPdf[]>(this.GetFilter());

            string TariffId = filter[0].TariffId;
            string IporOp = filter[0].IporOp;

            UserAccRpt logic = new UserAccRpt();
            string filename = string.Format("{0}.{1}", "DownloadCompanyPriceList_" + DateTime.Now.ToString("ddMMMyyyy_hhmmss"), "xls");
            return File(this.ToXLSDownloadCompanyPrice(IporOp, TariffId), "application/vnd.ms-excel", filename);
        }

        public byte[] ToPDFDownloadCompanyPrice(string IporOp, string TariffId)
        {
             
            ReportGenerator rpt = new ReportGenerator();

            if (IporOp.ToString() == "IP")
            {
                rpt.Path = "Areas/ITADMIN/Reports/Report_DownloadCompanyPriceListIP.rdl"; //
                rpt.AddReportParameter("TariffID", TariffId.ToString());
                //rpt.AddSource("dsHeader", this.GetReportHeaderDetails(DeptId));
                rpt.AddSource("DataSet1", this.Load_IPPriceList(TariffId));
                return rpt.Generate(ReportGenerator.RptTo.ToPDF);
            }
            else // OP
            {
                rpt.Path = "Areas/ITADMIN/Reports/Report_DownloadCompanyPriceListOP.rdl"; //
                rpt.AddReportParameter("TariffID", TariffId.ToString());
                //rpt.AddSource("dsHeader", this.GetReportHeaderDetails(DeptId));
                rpt.AddSource("DataSet1", this.Load_OPPriceList(TariffId));
                return rpt.Generate(ReportGenerator.RptTo.ToPDF);
            }

           
        }

        public byte[] ToXLSDownloadCompanyPrice(string IporOp, string TariffId)
        {
            
            ReportGenerator rpt = new ReportGenerator();

            if (IporOp.ToString() == "IP")
            {
                rpt.Path = "Areas/ITADMIN/Reports/Report_DownloadCompanyPriceListIP.rdl"; //
                rpt.AddReportParameter("TariffID", TariffId.ToString());
                //rpt.AddSource("dsHeader", this.GetReportHeaderDetails(DeptId));
                rpt.AddSource("DataSet1", this.Load_IPPriceList(TariffId));
                return rpt.Generate(ReportGenerator.RptTo.ToXLS);
            }
            else // OP
            {
                rpt.Path = "Areas/ITADMIN/Reports/Report_DownloadCompanyPriceListOP.rdl"; //
                rpt.AddReportParameter("TariffID", TariffId.ToString());
                rpt.AddSource("DataSet1", this.Load_OPPriceList(TariffId));
                return rpt.Generate(ReportGenerator.RptTo.ToXLS);
            }
        }

        public DataTable Load_IPPriceList(string TariffId)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
            new SqlParameter("@TariffID", TariffId)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.SghUtilities_DownloadCompPriceListIPTariff");
            return dt;
        }
        public DataTable Load_OPPriceList(string TariffId)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
            new SqlParameter("@TariffID", TariffId)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.SghUtilities_DownloadCompPriceListOPTariff");
            return dt;
        }



        #endregion


    }

    public class FilterDownloadCompanyPriceToPdf
    {
        public string TariffId { get; set; }
        public string IporOp { get; set; }

    }
}
