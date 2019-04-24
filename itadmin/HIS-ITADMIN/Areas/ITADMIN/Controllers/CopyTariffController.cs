using DataLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using HIS.Controllers;
using HIS_ITADMIN.Areas.ITADMIN.Models;

namespace HIS_ITADMIN.Areas.ITADMIN.Controllers
{
    public class CopyTariffController : BaseController
    {
        //
        // GET: /ITADMIN/CopyTariff/

        [IsSGHFeatureAuthorized(mFeatureID = "1287")]
        public ActionResult Index()
        {
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(CopyTariffHeaderSave entry)
        {
            CopyTariffModel model = new CopyTariffModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
           
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "CopyTariffController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult SaveOP(CopyOPTariffHeaderSave entry)
        {
            CopyTariffModel model = new CopyTariffModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.SaveOP(entry);
           
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("SaveOP", "CopyTariffController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


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

        public ActionResult CopyTariffDashBoard()
        {
            CopyTariffModel model = new CopyTariffModel();
            List<CopyTariffDashBoard> list = model.CopyTariffDashBoard();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<CopyTariffDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult CopyOPTariffDashBoard()
        {
            CopyTariffModel model = new CopyTariffModel();
            List<CopyTariffDashBoard> list = model.CopyOPTariffDashBoard();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<CopyTariffDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }


    }
}
