using System;
using System.Collections.Generic;
using DataLayer;
using DataLayer.ITAdmin.Model;
using HIS.Controllers;
using HIS_ITADMIN.Areas.ITADMIN.Models;
using Microsoft.Reporting.WebForms;
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
    public class TitleController : BaseController
    {
        //
        // GET: /ITADMIN/Title/
        TitleModel bs = new TitleModel();

        [IsSGHFeatureAuthorized(mFeatureID = "511")]
        public ActionResult Index()
        {
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(TitleSave entry)
        {
            TitleModel model = new TitleModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

        public ActionResult TitleDashBoard()
        {
            TitleModel model = new TitleModel();
            List<TitleDashBoard> list = model.TitleDashBoard();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<TitleDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult FetchTitle(int Id)
        {
            TitleModel model = new TitleModel();
            List<TitleViewModel> list = model.TitleViewModel(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<TitleViewModel>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public JsonResult MaritalList(string id)
        {
            List<Select2Model> list = bs.Select2MaritalStatusDAL(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SexList(string id)
        {
            List<Select2Model> list = bs.Select2SexDAL(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

    }
}
