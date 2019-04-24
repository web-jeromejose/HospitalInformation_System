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
    public class CityController : BaseController
    {
        //
        // GET: /ITADMIN/City/

        [IsSGHFeatureAuthorized(mFeatureID = "518")]
        public ActionResult Index()
        {
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(CitySave entry)
        {
            CityModel model = new CityModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

        public ActionResult CityDashBoard()
        {
            CityModel model = new CityModel();
            List<CityDashBoard> list = model.CityDashBoardDal();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<CityDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult FetchCity(int Id)
        {
            CityModel model = new CityModel();
            List<CityViewModel> list = model.CityViewModel(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<CityViewModel>() }),
                ContentType = "application/json"
            };
            return result;

        }


    }
}
