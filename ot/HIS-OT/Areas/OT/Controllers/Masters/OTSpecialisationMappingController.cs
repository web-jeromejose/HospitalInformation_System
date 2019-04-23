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
    public class OTSpecialisationMappingController : BaseController
    {
        //
        // GET: /OT/OTSpecialisationMapping/

        public ActionResult Index()
        {
            return View();
        }
        public ActionResult ShowList()
        {
            OTSpecialisationMappingModel model = new OTSpecialisationMappingModel();
            List<MainListOTSpecialisation> list = model.List();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<MainListOTSpecialisation>() }),
                ContentType = "application/json"
            };
            return result;
        }
        public ActionResult ShowSelected(int Id)
        {
            OTSpecialisationMappingModel model = new OTSpecialisationMappingModel();
            List<OTNo> list = model.ShowSelected(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<OTNo>() }),
                ContentType = "application/json"
            };
            return result;
        }
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(OTNo entry)
        {
            OTSpecialisationMappingModel model = new OTSpecialisationMappingModel();
            bool status = model.Save(entry);

            ////log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterLogs log = new MasterLogs();
            bool logs = log.loginsert("Save", "OT--" + "OTSpecialisationMappingController", "0", "0", this.OperatorId, log_details);


            return Json(new Models.CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }





        public ActionResult Select2OTSpecializationMappingStation(string searchTerm, int pageSize, int pageNum)
        {
            Select2OTSpecializationMappingStationRepository list = new Select2OTSpecializationMappingStationRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }


    }
}
