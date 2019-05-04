using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

using DataLayer;
using HIS_BloodBank.Areas.BloodBank.Models;
using HIS_BloodBank.Areas.BloodBank.Controllers;
using HIS_BloodBank.Models;
using HIS_BloodBank.Controllers;


namespace HIS_BloodBank.Areas.BloodBank.Controllers
{
    
    public class FindDonorController : BaseController
    {
        //
        // GET: /BloodBank/FindDonor/
        FindDonorModel model = new FindDonorModel();
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Dashboard()
        {

            List<DonorDashboardDAL> list = model.Dashboard();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<DonorDashboardDAL>() }),
                ContentType = "application/json"
            };
            return result;
        }

        public ActionResult Select2BloodGroup(string searchTerm, int pageSize, int pageNum)
        {
            Select2BloodGroupRepository list = new Select2BloodGroupRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult Select2DonorStatus(string searchTerm, int pageSize, int pageNum)
        {
            Select2DonorStatusRepository list = new Select2DonorStatusRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2Gender(string searchTerm, int pageSize, int pageNum)
        {
            Select2GenderRepository list = new Select2GenderRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2Nationality(string searchTerm, int pageSize, int pageNum)
        {
            Select2NationalityRepository list = new Select2NationalityRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2DonorType(string searchTerm, int pageSize, int pageNum)
        {
            Select2DonorTypeRepository list = new Select2DonorTypeRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult GetDonorScreeningReuslt(int donorRegiesterNo)
        {
            return new JsonpResult
            {
                Data = model.GetDonorScreeningReuslt(donorRegiesterNo),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        [HttpPost]
        public ActionResult ShowList(DonorListParam para)
        {

            List<DonorDashboardDAL> list = model.List(para);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<DonorDashboardDAL>() }),
                ContentType = "application/json"
            };
            return result;
        }


    }
}
