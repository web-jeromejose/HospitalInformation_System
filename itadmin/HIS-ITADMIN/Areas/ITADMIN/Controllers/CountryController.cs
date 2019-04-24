using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataLayer;
using HIS.Controllers;
using DataLayer.Common;
using System.Web.Script.Serialization;

namespace HIS_ITADMIN.Areas.ITADMIN.Controllers
{
 
    public class CountryController : BaseController
    {
        //
        // GET: /ITADMIN/Country/
        MasterModel model = new MasterModel();

        [IsSGHFeatureAuthorized(mFeatureID = "2686")]
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult CountryDashboard(CountryDal viewModel)
        {
            List<CountryDal> list = model.CountryDashboard();
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            serializer.MaxJsonLength = int.MaxValue;

            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<CountryDal>() }),
                ContentType = "application/json"
            };
            return result;
        }


        public ActionResult CityDashboard(CityDal viewModel)
        {
            List<CityDal> list = model.CityDashboard();
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            serializer.MaxJsonLength = int.MaxValue;

            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<CityDal>() }),
                ContentType = "application/json"
            };
            return result;
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(CountrySaveDal entry)
        {
            bool status = model.CountrySave(entry);
            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult AddCountrySave(CountrySaveDal entry)
        {
            bool status = model.AddCountrySave(entry);
            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

         [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult AddCitySave(CitySaveDal entry)
        {
            bool status = model.AddCitySave(entry);
            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }
         [AcceptVerbs(HttpVerbs.Post)]
         public ActionResult UpdateCity(UpdateCityDal entry)
         {
             bool status = model.UpdateCity(entry);
             return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
         }
        
        public JsonResult select2country()
        {

            List<RoleModel> li = model.AllCountries();
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }

        public JsonResult select2citybycountryid(string id)
        {

            List<RoleModel> li = model.getCitybyCountry(id);
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }


    }
}
