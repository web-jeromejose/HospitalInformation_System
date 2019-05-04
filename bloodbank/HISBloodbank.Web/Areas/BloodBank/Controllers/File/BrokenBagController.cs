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
    public class BrokenBagController : BaseController
    {
        //
        // GET: /BloodBank/BrokenBag/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ShowList()
        {
            BrokenBagModel model = new BrokenBagModel();
            List<BrokenBag> list = model.ShowSelected();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<BrokenBag>() }),
                ContentType = "application/json"
            };
            return result;
        }



    }
}
