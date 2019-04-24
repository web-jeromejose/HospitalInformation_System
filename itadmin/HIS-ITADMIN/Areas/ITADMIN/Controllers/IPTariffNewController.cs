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
using log4net.Core;
using log4net;
using DataLayer.Common;

namespace HIS_ITADMIN.Areas.ITADMIN.Controllers
{
    public class IPTariffNewController : BaseController
    {
        ExceptionLogging eLOG = new ExceptionLogging();
        //
        // GET: /ITADMIN/IPTariffNew/
        private const string NameOfReport = "IP Tariff Price";

        [IsSGHFeatureAuthorized(mFeatureID = "554")]
        public ActionResult Index()
        {
            return View();
        }

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
        
        public ActionResult Select2IPServices(string searchTerm, int pageSize, int pageNum)
        {
            Select2IPServicesRespository list = new Select2IPServicesRespository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult ServiceList(string id)
        {
            IPTariffNewModel model = new IPTariffNewModel();
            List<Select2Col1> li = model.ServiceList(id);
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }


        public ActionResult Select2ItemCode(string searchTerm, int pageSize, int pageNum, int ServiceID,int SearchByCode,string SearchText)
        {
            Select2GetItemCodePramRespository list = new Select2GetItemCodePramRespository();
            list.Fetch(ServiceID, SearchByCode, searchTerm);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult ItemListPrice(int TariffID, int ServiceID, int ItemId)
        {
            IPTariffNewModel model = new IPTariffNewModel();
            List<ItemLisPrice> list = model.IPTariffPrice(TariffID, ServiceID, ItemId);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ItemLisPrice>() }),
                ContentType = "application/json"
            };
            return result;

        }
        public ActionResult ItemListPriceNotDynamicTable(int TariffID, int ServiceID)
        {
            IPTariffNewModel model = new IPTariffNewModel();
            List<ItemLisPrice> list = model.IPTariff_GetItemCodePriceNotDynamicTable(TariffID, ServiceID);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ItemLisPrice>() }),
                ContentType = "application/json"
            };
            return result;
        }
        public ActionResult ItemListPriceMedicalSuperVision(int TariffID, int ServiceID, int ItemId)
        {
            IPTariffNewModel model = new IPTariffNewModel();
            List<ItemLisPrice> list = model.IPTariffPriceMedicalSuperVision(TariffID, ServiceID, ItemId);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ItemLisPrice>() }),
                ContentType = "application/json"
            };
            return result;
        }
        public ActionResult ItemListPriceBloodCrossMatch(int TariffID, int ServiceID, int ItemId)
        {
            IPTariffNewModel model = new IPTariffNewModel();
            List<ItemLisPrice> list = model.IPTariffPriceBloodCrossMatch(TariffID, ServiceID, ItemId);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ItemLisPrice>() }),
                ContentType = "application/json"
            };
            return result;
        }


        public ActionResult IPTariffNewPriceWithEffectiveDate(int TariffID, int ServiceID, int ItemId)
        {
            IPTariffNewModel model = new IPTariffNewModel();
            List<ItemNewListPrice> list = model.IPTariffNewPriceWithEffectiveDate(TariffID, ServiceID, ItemId);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ItemNewListPrice>() }),
                ContentType = "application/json"
            };
            return result;

        }


        public ActionResult ItemNewPrice()
        {
            IPTariffNewModel model = new IPTariffNewModel();
            List<ItemNewListPrice> list = model.IPTariffNewPrice();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ItemNewListPrice>() }),
                ContentType = "application/json"
            };
            return result;

        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(IPTariffHeaderSave entry)
        {
            IPTariffNewModel model = new IPTariffNewModel();
            entry.OperatorId = this.OperatorId;
            bool status = false;
            try
            {
                status = model.Save(entry);

               
                //log  
                var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
                string log_details = log_serializer.Serialize(entry.TariffId);
                MasterModel log = new MasterModel();
                bool logs = log.loginsert("Save", "IPTariffNewController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            }
            catch (Exception e)
            {
                eLOG.LogError(e);
                var logger = LogManager.GetLogger("IP Tariff Logger");
                logger.Error(e.Message);
                logger.Error(e.StackTrace);
            }
            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }



        public FileResult ToPDF()
        {
            JavaScriptSerializer js = new JavaScriptSerializer();
            FilterItemCode[] filter = js.Deserialize<FilterItemCode[]>(this.GetFilter());


            string ItemId = filter[0].ItemId;

            RptFnlAtten logic = new RptFnlAtten();
            return File(logic.ToPDF(ItemId), "application/pdf");
        }
        public FileResult ToXLS()
        {
            JavaScriptSerializer js = new JavaScriptSerializer();
            FilterItemCode[] filter = js.Deserialize<FilterItemCode[]>(this.GetFilter());

            //string Start = filter[0].Start.To_yyyyMMdd();
            string ItemId = filter[0].ItemId;


            RptFnlAtten logic = new RptFnlAtten();
            string filename = string.Format("{0}.{1}", NameOfReport + "_" + DateTime.Now.ToString("ddMMMyyyy_hhmmss"), "xls");
            return File(logic.ToXLS(ItemId), "application/vnd.ms-excel", filename);
        }


        public class RptFnlAtten
        {
            public RptFnlAtten() { }

            public DataTable GetReportDetails(string ItemId)
            {
                DBHelper db = new DBHelper();
                db.param = new SqlParameter[]{
                new SqlParameter("@ItemId", ItemId)
  
            };
                DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.IPTriffPrice_REPORTS_SCS");

                return dt;
            }



            public byte[] ToPDF(string ItemId)
            {
                ReportGenerator rpt = new ReportGenerator();
                rpt.Path = "Areas/ITADMIN/Reports/IPTARIFFPRICEReports.rdl";
                rpt.AddReportParameter("ItemId", ItemId);
                rpt.AddSource("DataSet1", this.GetReportDetails(ItemId));
                return rpt.Generate(ReportGenerator.RptTo.ToPDF);
            }


            public byte[] ToXLS(string ItemId)
            {
                ReportGenerator rpt = new ReportGenerator();
                rpt.Path = "Areas/ITADMIN/Reports/IPTARIFFPRICEReports.rdl";
                rpt.AddReportParameter("ItemId", ItemId);
                rpt.AddSource("DataSet1", this.GetReportDetails(ItemId));
                return rpt.Generate(ReportGenerator.RptTo.ToXLS);
            }



        }



        public class FilterItemCode
        {
            public string ItemId { get; set; }

        }


    }

}
