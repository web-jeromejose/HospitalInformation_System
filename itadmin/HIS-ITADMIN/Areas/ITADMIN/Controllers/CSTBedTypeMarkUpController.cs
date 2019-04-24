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
    public class CSTBedTypeMarkUpController : BaseController
    {
        //
        // GET: /ITADMIN/CSTBedTypeMarkUp/
        [IsSGHFeatureAuthorized(mFeatureID = "1990")]
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult BedtypeMarkUp()
        {
            CSTBedTypeModel model = new CSTBedTypeModel();
            List<CSTBedTypeDashboard> list = model.CSTBedTypeDashboard();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<CSTBedTypeDashboard>() }),
                ContentType = "application/json"
            };
            return result;

        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(CSTBedTypeHeader entry)
        {
            CSTBedTypeModel model = new CSTBedTypeModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
           
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "CSTBedTypeMarkUpController", "0", "0", this.OperatorId, log_details);



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

    }
}
