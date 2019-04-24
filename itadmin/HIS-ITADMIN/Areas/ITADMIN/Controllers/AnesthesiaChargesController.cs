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
    public class AnesthesiaChargesController : BaseController
    {
        //
        // GET: /ITADMIN/AnesthesiaCharges/
        AsstSurgeonModel bs = new AsstSurgeonModel();
        AnesthesiaChargesModel bss = new AnesthesiaChargesModel();

        [IsSGHFeatureAuthorized(mFeatureID = "2013")]
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult AnesthesiaChargeDashBoard()
        {
            AnesthesiaChargesModel model = new AnesthesiaChargesModel();
            List<AnesthesiaChargeDashBoard> list = model.AnesthesiaChargeDashBoard();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<AnesthesiaChargeDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult FetchAnesthesiaView(int CategoryId, int OTID, int ServiceId)
        {
            AnesthesiaChargesModel model = new AnesthesiaChargesModel();
            List<AnesthesiaChargeView> list = model.AnesthesiaChargeView(CategoryId, OTID, ServiceId);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<AnesthesiaChargeView>() }),
                ContentType = "application/json"
            };
            return result;
        }

        public JsonResult TariffList(string id)
        {
            List<TariffListModel> list = bs.TariffListModelDal(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ORNOListDal(string id)
        {
            List<OTNOListModel> list = bs.OTNOListModelDal(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Select2Service(string searchTerm, int pageSize, int pageNum)
        {
            Select2ServicesAnesChargeRespository list = new Select2ServicesAnesChargeRespository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(AnesthesiaChargeSave entry)
        {
            AnesthesiaChargesModel model = new AnesthesiaChargesModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
         
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "AnesthesiaChargesController", "0", "0", this.OperatorId, log_details);



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

    }
}
