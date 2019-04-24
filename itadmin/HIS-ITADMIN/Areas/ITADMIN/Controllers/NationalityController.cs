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
    public class NationalityController : BaseController
    {
        //
        // GET: /ITADMIN/Nationality/

        public ActionResult Index()
        {
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(NationalitySave entry)
        {
            NationalityModel model = new NationalityModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

        public ActionResult NationalityDashBoard()
        {
            NationalityModel model = new NationalityModel();
            List<NationalityDashBoard> list = model.NationalityDashBoard();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<NationalityDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult FetchNationality(int Id)
        {
            NationalityModel model = new NationalityModel();
            List<NationalityViewModel> list = model.NationalityViewModelDal(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<NationalityViewModel>() }),
                ContentType = "application/json"
            };
            return result;

        }


    }
}
