using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataLayer;
using HIS.Controllers;
using HIS_ITADMIN.Areas.ITADMIN.Models;
using System.Web.Script.Serialization;
using DataLayer.ITAdmin.Model;

namespace HIS_ITADMIN.Areas.ITADMIN.Controllers
{
    public class CutOffTimePharmacyController : BaseController
    {
        //
        // GET: /ITADMIN/CutOffTimePharmacy/
        CutOffTimePharmacyModel bs = new CutOffTimePharmacyModel();

        [IsSGHFeatureAuthorized(mFeatureID = "586")]
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult WardStationList(string id)
        {
            List<CutOffTimePharmacy> list = bs.CutOffTimePharmacyDAL(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public ActionResult SelectedListItem(int Id)
        {
            CutOffTimePharmacyModel model = new CutOffTimePharmacyModel();
            List<CutOffTimePharmcyView> list = model.CutOffTimePharmcyList(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<CutOffTimePharmcyView>() }),
                ContentType = "application/json"
            };
            return result;

        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(CutOffTimePharmacySave entry)
        {
            CutOffTimePharmacyModel model = new CutOffTimePharmacyModel();
      //      entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);

           
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "CutOffTimePharmacyController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }



    }
}
