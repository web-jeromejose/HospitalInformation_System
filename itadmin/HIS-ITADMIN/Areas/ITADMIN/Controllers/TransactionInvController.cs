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
    public class TransactionInvController : BaseController
    {
        //
        // GET: /ITADMIN/TransactionInv/
        TransacInvModel bs = new TransacInvModel();

        [IsSGHFeatureAuthorized(mFeatureID = "582")]
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult TransaInviDashBoard()
        {
            TransacInvModel model = new TransacInvModel();
            List<TransactionInvDashBoardModel> list = model.TransactionInvDashBoardModel();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<TransactionInvDashBoardModel>() }),
                ContentType = "application/json"
            };
            return result;
        }

        public ActionResult FetchTransInv(int Id)
        {
            TransacInvModel model = new TransacInvModel();
            List<TransactionInvDashBoardModel> list = model.TransactionView(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<TransactionInvDashBoardModel>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public JsonResult StationInList(string id)
        {
            List<ListTransaInvModel> list = bs.StationListInV(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(ListTransSaveHeaderModel entry)
        {
            TransacInvModel model = new TransacInvModel();
            //entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
 
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "TransactionInvController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }



    }







}
