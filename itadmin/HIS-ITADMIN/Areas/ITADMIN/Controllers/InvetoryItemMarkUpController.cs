using DataLayer;
using DataLayer.ITAdmin.Model;
using HIS.Controllers;
using HIS_ITADMIN.Areas.ITADMIN.Models;
using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Security;
using System.Security.Permissions;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace HIS_ITADMIN.Areas.ITADMIN.Controllers
{
    public class InvetoryItemMarkUpController : BaseController
    {
        //
        // GET: /ITADMIN/InvetoryItemMarkUp/
        InventoryItemMarkupModel bs = new InventoryItemMarkupModel();
        public ActionResult Index()
        {
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(InvenItemMarkupHeaderModel entry)
        {
            InventoryItemMarkupModel model = new InventoryItemMarkupModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
             
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "InvetoryItemMarkUpController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

        public ActionResult FetchInvetoryItemMarkUp(int CategoryId,int TypeId)
        {
            InventoryItemMarkupModel model = new InventoryItemMarkupModel();
            List<InvenItemMarkupViewModel> list = model.InvenItemMarkupViewModel(CategoryId, TypeId);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<InvenItemMarkupViewModel>() }),
                ContentType = "application/json"
            };
            return result;

        }


        public JsonResult Select2Category(string id)
        {
            List<ListofItemGroup> list = bs.Select2CatDal(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Select2Types(string id)
        {
            List<ListofType> list = bs.Select2TypesDal(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

    }
}
