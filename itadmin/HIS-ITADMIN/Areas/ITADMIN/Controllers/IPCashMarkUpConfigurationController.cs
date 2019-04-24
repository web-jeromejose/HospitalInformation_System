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
    public class IPCashMarkUpConfigurationController : BaseController
    {
        //
        // GET: /ITADMIN/IPCashMarkUpConfiguration/

        public ActionResult Index()
        {
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(IPCashMarkupHeaderSave entry)
        {
            IPCashMarkUpConfigModel model = new IPCashMarkUpConfigModel();
            //entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
 
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "IPCashMarkUpConfigurationController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

        public ActionResult IPCashMarkUpDashBoard()
        {
            IPCashMarkUpConfigModel model = new IPCashMarkUpConfigModel();
            List<IPCashMarkUpDashboard> list = model.IPCashMarkUpDashboard();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<IPCashMarkUpDashboard>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public JsonResult GetDefaultMarkUp()
        {
            IPCashMarkUpConfigModel _DefaultMarkUp = new IPCashMarkUpConfigModel();
            List<GetDefaultCashMarkUpModel> DefaultMarkUp = _DefaultMarkUp.GetDefaultCashMarkUpModel();
            return Json(DefaultMarkUp ?? new List<GetDefaultCashMarkUpModel>(), JsonRequestBehavior.AllowGet);

        }

    }
}
