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
    public class AnesthesiaController : BaseController
    {
        //
        // GET: /ITADMIN/Anesthesia/

        [IsSGHFeatureAuthorized(mFeatureID = "1992")]
        public ActionResult Index()
        {
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(AnesthesiaSave entry)
        {
            AnesthesiaModel model = new AnesthesiaModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

        public ActionResult AnesthesiaDashBoard()
        {
            AnesthesiaModel model = new AnesthesiaModel();
            List<AnesthesiaDashboardModel> list = model.AnesthesiaDashboardModel();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<AnesthesiaDashboardModel>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult FetchAnesView(int Id)
        {
            AnesthesiaModel model = new AnesthesiaModel();
            List<AnesthesiaViewModel> list = model.AnesthesiaViewModel(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<AnesthesiaViewModel>() }),
                ContentType = "application/json"
            };
            return result;

        }


    }
}
