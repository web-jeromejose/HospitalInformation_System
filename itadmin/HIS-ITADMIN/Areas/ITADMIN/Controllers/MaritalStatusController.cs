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
    public class MaritalStatusController : BaseController
    {
        //
        // GET: /ITADMIN/MaritalStatus/

        public ActionResult Index()
        {
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(MaritalSave entry)
        {
            MaritalStatusModel model = new MaritalStatusModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

        public ActionResult FetchMaritalStatus(int Id)
        {
            MaritalStatusModel model = new MaritalStatusModel();
            List<MartialViewModel> list = model.MaritalViewModelDal(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<MartialViewModel>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult MaritalStatusDashBoard()
        {
            MaritalStatusModel model = new MaritalStatusModel();
            List<MaritalDashBoard> list = model.MaritalDashBoard();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<MaritalDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }


        


    }
}
