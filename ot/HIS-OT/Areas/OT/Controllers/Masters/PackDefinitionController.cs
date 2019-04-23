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
    public class PackDefinitionController : BaseController
    {
        //
        // GET: /OT/PackDefinition/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ShowList()
        {
            PackDefinitionModel model = new PackDefinitionModel();
            List<MainListPackDefinition> list = model.List();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<MainListPackDefinition>() }),
                ContentType = "application/json"
            };
            return result;
        }
        public ActionResult ShowItems()
        {
            PackDefinitionModel model = new PackDefinitionModel();
            List<Items> list = model.GetItems();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<Items>() }),
                ContentType = "application/json"
            };
            return result;
        }
        
        public ActionResult ShowSelected(int Id)
        {
            PackDefinitionModel model = new PackDefinitionModel();
            List<MainListPackDefinition> list = model.ShowSelected(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<MainListPackDefinition>() }),
                ContentType = "application/json"
            };
            return result;
        }
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(CSSDProfile entry)
        {
            entry.Stationid = this.StationId;
            entry.OperatorId = this.OperatorId;
            PackDefinitionModel model = new PackDefinitionModel();
            bool status = model.Save(entry);

            ////log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterLogs log = new MasterLogs();
            bool logs = log.loginsert("Save", "OT--" + "PackDefinitionController", "0", "0", this.OperatorId, log_details);


            return Json(new Models.CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }



    }
}
