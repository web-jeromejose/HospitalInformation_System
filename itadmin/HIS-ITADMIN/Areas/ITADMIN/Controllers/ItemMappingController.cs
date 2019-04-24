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
    public class ItemMappingController : BaseController
    {
        //
        // GET: /ITADMIN/ItemMapping/
        ItemMappingModel bs = new ItemMappingModel();
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult StationList(string id)
        {
            List<Select2StationModel> list = bs.StationListDAL(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }


        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(ItemMappingSaveModel entry)
        {
            ItemMappingModel model = new ItemMappingModel();
            //   entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
 
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "ItemMappingController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }



    }
}
