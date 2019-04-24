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
    public class CategoryStationMappingController : BaseController
    {
        //
        // GET: /ITADMIN/CategoryStationMapping/
        CategoryStationMapModel bs = new CategoryStationMapModel();

        [IsSGHFeatureAuthorized(mFeatureID = "577")]
        public ActionResult Index()
        {
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(ListCategoryStationSaveModel entry)
        {
            CategoryStationMapModel model = new CategoryStationMapModel();
            //   entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

        public JsonResult CategoryList(string id)
        {
            List<ListCategoryModel> list = bs.CategoryListDAL(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public JsonResult StationList(string id)
        {
            List<Select2StationModel> list = bs.StationListDAL(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

    }
}
