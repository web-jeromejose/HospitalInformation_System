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
    public class GenCashierTransTypeController : BaseController
    {
        //
        // GET: /ITADMIN/GenCashierTransType/

        public ActionResult Index()
        {
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(GenCashierTransTypeSave entry)
        {
            GenCashierTransTypeModel model = new GenCashierTransTypeModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }


        public ActionResult GenCashierDashBoard()
        {
            GenCashierTransTypeModel model = new GenCashierTransTypeModel();
            List<GenCashierTransTypeDashBoard> list = model.GenCashierTransTypeDashBoard();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<GenCashierTransTypeDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult FetchGenCashierTypeTrans(int Id)
        {
            GenCashierTransTypeModel model = new GenCashierTransTypeModel();
            List<GenCashierViewModel> list = model.GenCashierViewModel(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<GenCashierViewModel>() }),
                ContentType = "application/json"
            };
            return result;

        }
    }
}
