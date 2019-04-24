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
    public class ReleaseDrugOrderAftrOTController : BaseController
    {
        //
        // GET: /ITADMIN/ReleaseDrugOrderAftrOT/

        [IsSGHFeatureAuthorized(mFeatureID = "1626")]
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Select2PINOTORDER(string searchTerm, int pageSize, int pageNum)
        {
            Select2ReleaseDrugOrderAfterOT list = new Select2ReleaseDrugOrderAfterOT();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }


        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(ReleaseDrugOrderSave entry)
        {
            ReleaseDrugOrderModel model = new ReleaseDrugOrderModel();
            //entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

    }
}
