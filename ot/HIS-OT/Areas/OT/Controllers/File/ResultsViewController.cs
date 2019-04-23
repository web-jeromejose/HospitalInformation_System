using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Data.SqlClient;
using System.Data;

using DataLayer;
using HIS_OT.Areas.OT.Models;
using HIS_OT.Controllers;
using HIS_OT.Models;
using HIS.Controllers;


namespace HIS_OT.Areas.OT.Controllers
{
    [Authorize]
    public class ResultsViewController : BaseController
    {
        //
        // GET: /OT/ResultsView/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ShowResultsViewResults(int registrationno)
        {
            ResultsViewModel model = new ResultsViewModel();
            List<ResultsViewResults> list = model.ShowResultsViewResults(registrationno);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ResultsViewResults>() }),
                ContentType = "application/json"
            };
            return result;
        }
        public ActionResult ShowResultsViewOldResults(int registrationno, int type)
        {
            ResultsViewModel model = new ResultsViewModel();
            List<ResultsViewOldResultsLab> list = model.ShowResultsViewOldResults(registrationno, type);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ResultsViewOldResultsLab>() }),
                ContentType = "application/json"
            };
            return result;
        }
        public ActionResult ShowResultsViewEndoscopyNew(int registrationno)
        {
            ResultsViewModel model = new ResultsViewModel();
            List<ResultsViewEndoscopyNew> list = model.ShowResultsViewEndoscopyNew(registrationno);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ResultsViewEndoscopyNew>() }),
                ContentType = "application/json"
            };
            return result;
        }
        public ActionResult ShowResultsViewEndoscopyOld(int registrationno)
        {
            ResultsViewModel model = new ResultsViewModel();
            List<ResultsViewEndoscopyOld> list = model.ShowResultsViewEndoscopyOld(registrationno);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ResultsViewEndoscopyOld>() }),
                ContentType = "application/json"
            };
            return result;
        }
        public ActionResult ShowResultsViewCathLab(int registrationno)
        {
            ResultsViewModel model = new ResultsViewModel();
            List<ResultsViewCathLab> list = model.ShowResultsViewCathLab(registrationno);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ResultsViewCathLab>() }),
                ContentType = "application/json"
            };
            return result;
        }


        public ActionResult Select2GetPIN(string searchTerm, int pageSize, int pageNum, int type)
        {
            Select2GetPinNameBedNoRepositoryPin list = new Select2GetPinNameBedNoRepositoryPin();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2GetName(string searchTerm, int pageSize, int pageNum, int type)
        {
            Select2GetPinNameBedNoRepositoryName list = new Select2GetPinNameBedNoRepositoryName();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }




    }
}
