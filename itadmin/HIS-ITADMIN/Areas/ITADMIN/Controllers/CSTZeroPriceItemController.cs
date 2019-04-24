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
    public class CSTZeroPriceItemController : BaseController
    {
        //
        // GET: /ITADMIN/CSTZeroPriceItem/
        [IsSGHFeatureAuthorized(mFeatureID = "1424")]
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ItemListDashboard()
        {
            CSTZeroItemModel model = new CSTZeroItemModel();
            List<CSSITEMModel> list = model.CSSITEMModel();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<CSSITEMModel>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult ItemListZeroPriceDashboard()
        {
            CSTZeroItemModel model = new CSTZeroItemModel();
            List<CSSITEMZeroPriceModel> list = model.CSSITEMZeroPriceModel();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<CSSITEMZeroPriceModel>() }),
                ContentType = "application/json"
            };
            return result;

        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(CSTHeaderSave entry)
        {
            CSTZeroItemModel model = new CSTZeroItemModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);

 
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "CSTZeroPriceItemController", "0", "0", this.OperatorId, log_details);



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

    }
}
