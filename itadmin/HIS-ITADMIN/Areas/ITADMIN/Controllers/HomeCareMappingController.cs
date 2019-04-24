using DataLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using HIS.Controllers;
using HIS_ITADMIN.Areas.ITADMIN.Models;

namespace HIS_ITADMIN.Areas.ITADMIN.Controllers
{
    public class HomeCareMappingController : BaseController
    {
        //
        // GET: /ITADMIN/HomeCareMapping/

        [IsSGHFeatureAuthorized(mFeatureID = "1983")]
        public ActionResult Index()
        {
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Process(HeaderMapProcess entry)
        {
            HCModel model = new HCModel();
            //entry.OperatorID = this.OperatorId;
            bool status = model.Process(entry);
            //log  
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("HCModel", "HomeCareMappingController", "0", "0", this.OperatorId, " ", this.LocalIPAddress());


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }


        public ActionResult ItemListDashboard()
        {
            HCModel model = new HCModel();
            List<ItemListDashboard> list = model.ItemListDashboard();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ItemListDashboard>() }),
                ContentType = "application/json"
            };
            return result;

        }


        


    }
}
