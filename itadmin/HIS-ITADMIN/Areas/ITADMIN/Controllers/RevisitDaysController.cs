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
    public class RevisitDaysController : BaseController
    {
        //
        // GET: /ITADMIN/RevisitDays/
        OPRevisitModel bs = new OPRevisitModel();

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult OPRevisitDashBoard()
        {
            OPRevisitModel model = new OPRevisitModel();
            List<OPRevisitDashBoard> list = model.OPRevisitDashBoard();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<OPRevisitDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }


        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(OPRevisitSaveModel entry)
        {
            OPRevisitModel model = new OPRevisitModel();
            entry.OperatorId = this.OperatorId;
            entry.ClientIP = this.LocalIPAddress();
            bool status = model.Save(entry);
            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

        public ActionResult OpRevisitView(int Id)
        {
            OPRevisitModel model = new OPRevisitModel();
            List<OPRevisitView> list = model.OPRevisitView(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<OPRevisitView>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public JsonResult CompanyList(string id)
        {
            List<ListCompModel> list = bs.CompanyListDAL(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }


        public JsonResult CategoryList(string id)
        {
            List<Select2Category> list = bs.Select2CategoryDAl(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }


    }
}
