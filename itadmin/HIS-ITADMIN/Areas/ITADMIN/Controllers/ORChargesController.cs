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
    public class ORChargesController : BaseController
    {
        //
        // GET: /ITADMIN/ORCharges/
        AsstSurgeonModel bs = new AsstSurgeonModel();
        public ActionResult Index()
        {
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(ORChargesHeaderSave entry)
        {
            ORChargesModel model = new ORChargesModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);

           
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "ORChargesController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

        public JsonResult TariffList(string id)
        {
            List<TariffListModel> list = bs.TariffListModelDal(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public ActionResult ORChargesDashBoard(int CategoryId)
        {
            ORChargesModel model = new ORChargesModel();
            List<ORChargesDashBoard> list = model.ORChargesDashBoard(CategoryId);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ORChargesDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }

    }
}
