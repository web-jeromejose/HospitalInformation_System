using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataLayer;
using HIS.Controllers;
using HIS_ITADMIN.Areas.ITADMIN.Models;
using System.Web.Script.Serialization;
using System.Data;
using System.Data.SqlClient;

namespace HIS_ITADMIN.Areas.ITADMIN.Controllers
{
    public class MmsReportsMappingController : BaseController
    {
        //
        // GET: /ITADMIN/MmsReportsMapping/
        ItemMappingModel itemmap = new ItemMappingModel();
        MmsReportsMappingModel model = new MmsReportsMappingModel();

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult StationList(string id)
        {
            List<Select2StationModel> list = itemmap.StationListDAL(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public ActionResult MmsRepostMappingDashboard(int stationid)
        {
          
            List<MmsRepostMappingDashboard> list = model.MmsRepostMappingDashboard(stationid);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<MmsRepostMappingDashboard>() }),
                ContentType = "application/json"
            };
            return result;

        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(MmsReportMappingSave entry)
        {
           
            entry.OperatorID = this.OperatorId;
            bool status = model.Save(entry);
            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }



    }
}
