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
    public class IPPharmacyServiceChargeController : BaseController
    {
        //
        // GET: /ITADMIN/IPPharmacyServiceCharge/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult IPPharmacyServiceDashBoard()
        {
            IpPharmacyServiceModel model = new IpPharmacyServiceModel();
            List<IPPharmacyDashboardModel> list = model.IPPharmacyDashboardModel();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<IPPharmacyDashboardModel>() }),
                ContentType = "application/json"
            };
            return result;

        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(IPPharmacyHeaderSave entry)
        {
            IpPharmacyServiceModel model = new IpPharmacyServiceModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
 
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "IPPharmacyServiceChargeController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }


    }
}
