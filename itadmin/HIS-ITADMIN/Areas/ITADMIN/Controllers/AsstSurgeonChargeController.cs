using DataLayer;
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
    public class AsstSurgeonChargeController : BaseController
    {
        //
        // GET: /ITADMIN/AsstSurgeonCharge/
        AsstSurgeonModel bs = new AsstSurgeonModel();

        [IsSGHFeatureAuthorized(mFeatureID = "531")]
        public ActionResult Index()
        {
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(AsstSurgeonSaveModel entry)
        {
            AsstSurgeonModel model = new AsstSurgeonModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

        public ActionResult AsstSurgeonDashBoard()
        {
            AsstSurgeonModel model = new AsstSurgeonModel();
            List<AsstSurgeonDashBoard> list = model.AsstSurgeonDashBoard();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<AsstSurgeonDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public JsonResult TariffList(string id)
        {
            List<TariffListModel> list = bs.TariffListModelDal(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ORNOListDal(string id)
        {
            List<OTNOListModel> list = bs.OTNOListModelDal(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }




        public ActionResult AsstSurgeonChargeView(int CategoryId, int ORNoId, int SlNo)
        {
            AsstSurgeonModel model = new AsstSurgeonModel();
            List<AssistSurgeonViewModel> list = model.AssistSurgeonViewModel(CategoryId, ORNoId, SlNo);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<AssistSurgeonViewModel>() }),
                ContentType = "application/json"
            };
            return result;

        }

    }
}
