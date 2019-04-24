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
    public class WardPharmacyMappingController : BaseController
    {
        //
        // GET: /ITADMIN/WardPharmacyMapping/
        WardPharModel bs = new WardPharModel();

        [IsSGHFeatureAuthorized(mFeatureID = "581")]
        public ActionResult Index()
        {
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(ListWardSaveModel entry)
        {
            WardPharModel model = new WardPharModel();
            //   entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);

         

            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "WardPharmacyMappingController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

        public JsonResult WardStation(string id)
        {
            List<ListWardModel> list = bs.WardListDAL(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult WardPharmacyListDAL(string id)
        {
            List<ListWardModel> list = bs.WardPharmacyListDAL(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public ActionResult View(int WardStationId)
        {
            WardPharModel model = new WardPharModel();
            List<ListWardPharViewModel> list = model.ListWardPharViewModel(WardStationId);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ListWardPharViewModel>() }),
                ContentType = "application/json"
            };
            return result;

        }


    }
}
