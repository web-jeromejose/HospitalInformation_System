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
    public class SplittingBagController : BaseController
    {
        //
        // GET: /BloodBank/SplittingBag/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ShowSelected(string Id)
        {
            SplittingBagModel model = new SplittingBagModel();
            List<SplittingBag> list = model.ShowSelected(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<SplittingBag>() }),
                ContentType = "application/json"
            };
            return result;
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(SplittingBag entry)
        {
            entry.OperatorID = this.OperatorId;
            SplittingBagModel model = new SplittingBagModel();
            bool status = model.Save(entry);
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterLogs log = new MasterLogs();
            bool logs = log.loginsert("Save", "BB--" + "SplittingBagController", "0", "0", this.OperatorId, log_details);

            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }
    }
}
