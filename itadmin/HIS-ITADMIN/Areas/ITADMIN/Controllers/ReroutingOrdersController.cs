﻿using DataLayer;
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
    public class ReroutingOrdersController : BaseController
    {
        //
        // GET: /ITADMIN/ReroutingOrders/
        ReroutingORderModel bs = new ReroutingORderModel();


        [IsSGHFeatureAuthorized(mFeatureID = "1994")]
        public ActionResult Index()
        {
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(ReRouteHeaderSaveModel entry)
        {
            ReroutingORderModel model = new ReroutingORderModel();
         //   entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
             
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "ReroutingOrdersController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }
        public JsonResult Select2Pharm(string id)
        {
            List<ListPharmacy> list = bs.Select2Pharmacy(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public ActionResult FetchReReoutingItem(int Id)
        {
            ReroutingORderModel model = new ReroutingORderModel();
            List<PharmacyViewModel> list = model.PharmacyViewModel(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<PharmacyViewModel>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult Select2StationList(string searchTerm, int pageSize, int pageNum)
        {
            Select2Station list = new Select2Station();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

    }
}