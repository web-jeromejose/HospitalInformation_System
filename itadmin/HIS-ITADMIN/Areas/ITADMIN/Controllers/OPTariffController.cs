using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataLayer;
using HIS.Controllers;
using HIS_ITADMIN.Areas.ITADMIN.Models;
using System.Web.Script.Serialization;
using System.Data;
using System.Data.SqlClient;

namespace HIS_ITADMIN.Areas.ITADMIN.Controllers
{
    public class OPTariffController : BaseController
    {
        //
        // GET: /ITADMIN/OPTariff/
        private const string NameOfReport = "OP Tariff Price";

        [IsSGHFeatureAuthorized(mFeatureID = "1981")]
        public ActionResult Index()
        {
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(OPTariffHeaderSave entry)
        {
            OPTariffModel model = new OPTariffModel();
             
            bool status = model.Save(entry);
           
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
           
            
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "OPTariffController", "0", "0",  this.OperatorId, ">>"+entry.TariffID + "tariff<<", this.LocalIPAddress());
 
            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

        public ActionResult ItemListNoPrice(int TariffID, int ServiceID, int DepartmentID, int TableExists)
        {
            OPTariffModel model = new OPTariffModel();
            List<ItemListNoPrice> list = model.ItemListNoPrice(TariffID, ServiceID, DepartmentID, TableExists);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ItemListNoPrice>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult ItemListWithPrice(int TariffID, int ServiceID, int DepartmentID, int TableExists)
        {
            OPTariffModel model = new OPTariffModel();
            List<ItemListNoPrice> list = model.ItemWithNoPrice(TariffID, ServiceID, DepartmentID, TableExists);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ItemListNoPrice>() }),
                ContentType = "application/json"
            };
            return result;

        }

        //[AcceptVerbs(HttpVerbs.Post)]
        //public ActionResult Process(CreateTransOrder entry)
        //{
        //    TransOrderModel model = new TransOrderModel();
        //    //entry.operatorid = this.OperatorId;
        //    bool status = model.Process(entry);
        //    return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        //}

        public ActionResult Select2Tariff(string searchTerm, int pageSize, int pageNum)
        {
            Select2TariffRespository list = new Select2TariffRespository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult Select2Service(string searchTerm, int pageSize, int pageNum)
        {
            Select2ServicesRespository list = new Select2ServicesRespository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult Select2ServiceDept(string searchTerm, int pageSize, int pageNum, int ServiceID)
        {
            Select2GetServicesDeptRespository list = new Select2GetServicesDeptRespository();
            list.Fetch(ServiceID);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public FileResult ToPDF()
        {
            JavaScriptSerializer js = new JavaScriptSerializer();
            FilterItemCode[] filter = js.Deserialize<FilterItemCode[]>(this.GetFilter());


            string Id = filter[0].Id;

            RptFnlAtten logic = new RptFnlAtten();
            return File(logic.ToPDF(Id), "application/pdf");
        }
        public FileResult ToXLS()
        {
            JavaScriptSerializer js = new JavaScriptSerializer();
            FilterItemCode[] filter = js.Deserialize<FilterItemCode[]>(this.GetFilter());

            //string Start = filter[0].Start.To_yyyyMMdd();
            string Id = filter[0].Id;


            RptFnlAtten logic = new RptFnlAtten();
            string filename = string.Format("{0}.{1}", NameOfReport + "_" + DateTime.Now.ToString("ddMMMyyyy_hhmmss"), "xls");
            return File(logic.ToXLS(Id), "application/vnd.ms-excel", filename);
        }


        public class RptFnlAtten
        {
            public RptFnlAtten() { }

            public DataTable GetReportDetails(string Id)
            {
                DBHelper db = new DBHelper();
                db.param = new SqlParameter[]{
                new SqlParameter("@Id", Id)
  
            };
                DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.OPTriffPrice_REPORTS_SCS");

                return dt;
            }



            public byte[] ToPDF(string Id)
            {
                ReportGenerator rpt = new ReportGenerator();
                rpt.Path = "Areas/ITADMIN/Reports/OPTARIFFPRICEReports.rdl";
                rpt.AddReportParameter("Id", Id);
                rpt.AddSource("DataSet1", this.GetReportDetails(Id));
                return rpt.Generate(ReportGenerator.RptTo.ToPDF);
            }


            public byte[] ToXLS(string Id)
            {
                ReportGenerator rpt = new ReportGenerator();
                rpt.Path = "Areas/ITADMIN/Reports/OPTARIFFPRICEReports.rdl";
                rpt.AddReportParameter("Id", Id);
                rpt.AddSource("DataSet1", this.GetReportDetails(Id));
                return rpt.Generate(ReportGenerator.RptTo.ToXLS);
            }



        }



        public class FilterItemCode
        {
            public string Id { get; set; }

        }

    }
}
