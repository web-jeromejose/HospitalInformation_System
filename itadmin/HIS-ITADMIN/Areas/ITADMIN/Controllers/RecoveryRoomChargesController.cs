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
    public class RecoveryRoomChargesController : BaseController
    {
        //
        // GET: /ITADMIN/RecoveryRoomCharges/
        AsstSurgeonModel bs = new AsstSurgeonModel();

        [IsSGHFeatureAuthorized(mFeatureID = "533")]
        public ActionResult Index()
        {
            return View();
        }


        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(RecoveryRoomChargesHeaderSave entry)
        {
            RecoveryRoomChargesModel model = new RecoveryRoomChargesModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
          

            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "RecoveryRoomChargesController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

        public ActionResult RecoveryRoomChargesDashBoard(int CategoryId)
        {
            RecoveryRoomChargesModel model = new RecoveryRoomChargesModel();
            List<RecoveryRoomChargesDashBoard> list = model.RecoveryRoomChargesDashBoard(CategoryId);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<RecoveryRoomChargesDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public JsonResult TariffList(string id)
        {
            List<TariffListModel> list = bs.TariffListModelDal(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

    }
}
