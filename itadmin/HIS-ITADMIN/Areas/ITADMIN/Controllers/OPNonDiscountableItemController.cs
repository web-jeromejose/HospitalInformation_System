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
    public class OPNonDiscountableItemController : BaseController
    {
        //
        // GET: /ITADMIN/OPNonDiscountableItem/
        NonDiscountItemModel bs = new NonDiscountItemModel();
        [IsSGHFeatureAuthorized(mFeatureID = "1468")]
        public ActionResult Index()
        {
            return View();

        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(NonDiscountHeaderSave entry)
        {
            NonDiscountItemModel model = new NonDiscountItemModel();
          //  entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
             
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "OPNonDiscountableItemController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

        public JsonResult ServiceListDL(string id)
        {
            List<ServiceList> list = bs.ServiceDal(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }


        public ActionResult SelectedList(int ServiceId)
        {
 


            NonDiscountItemModel model = new NonDiscountItemModel();
            List<NonDiscountItemList> list = model.NonDiscountItemList(ServiceId);
             
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            serializer.MaxJsonLength = int.MaxValue;

            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<NonDiscountItemList>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult SelectedListItem(int ServiceId)
        {
            NonDiscountItemModel model = new NonDiscountItemModel();
            List<NonDiscountItemList> list = model.SelectedNonDiscountItemList(ServiceId);
            //var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };

            JavaScriptSerializer serializer = new JavaScriptSerializer();
            serializer.MaxJsonLength = int.MaxValue;

            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<NonDiscountItemList>() }),
                ContentType = "application/json"
            };
            return result;

        }
    }
}