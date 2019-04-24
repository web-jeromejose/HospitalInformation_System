using System;
using System.Collections.Generic;
using DataLayer;
using DataLayer.ITAdmin.Model;
using HIS.Controllers;
using HIS_ITADMIN.Areas.ITADMIN.Models;
using Microsoft.Reporting.WebForms;
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
    public class CancellationTypeMappingController : BaseController
    {
        //
        // GET: /ITADMIN/CancellationTypeMapping/

        [IsSGHFeatureAuthorized(mFeatureID = "2219")]
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Select2CanceBillReason(string searchTerm, int pageSize, int pageNum)
        {
            Select2CancelBillReason list = new Select2CancelBillReason();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult FetchCancelBillDashBoard(int Id)
        {
            CancelBillMappingModel model = new CancelBillMappingModel();
            List<CancelTypeDashBoard> list = model.CancelTypeDashBoardView(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<CancelTypeDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult FetchCancelReason(int Id)
        {
            CancelBillMappingModel model = new CancelBillMappingModel();
            List<CancelTypeDashBoard> list = model.CancelTypeFetchView(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<CancelTypeDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(CancelTypeMappingSave entry)
        {
            CancelBillMappingModel model = new CancelBillMappingModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);


            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "CancellationTypeMappingController", "0", "0", this.OperatorId, log_details);



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }




        }

    }
