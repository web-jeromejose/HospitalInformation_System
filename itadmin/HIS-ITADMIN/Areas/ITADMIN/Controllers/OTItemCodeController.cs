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
    public class OTItemCodeController : BaseController
    {
        //
        // GET: /ITADMIN/OTItemCode/
        AsstSurgeonModel bs = new AsstSurgeonModel();
        HealthCheckupModel bss = new HealthCheckupModel();
        public ActionResult Index()
        {
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(ItemCodeHeaderSave entry)
        {
            ItemCodeModel model = new ItemCodeModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }


        public JsonResult GetITemCodeResult()
        {
            ItemCodeModel _GetItemCodePatientPreparationFee = new ItemCodeModel();
            List<GetItemCodePatientPreparationFee> GetItemCode = _GetItemCodePatientPreparationFee.GetItemCodePatientPreparationFee();
            return Json(GetItemCode ?? new List<GetItemCodePatientPreparationFee>(), JsonRequestBehavior.AllowGet);

        }


             public JsonResult GetITemCodeAsstSurgeonList()
        {
            ItemCodeModel _GetItemAsstSurgeon = new ItemCodeModel();
            List<GetItemAsstSurgeon> GetItemCode = _GetItemAsstSurgeon.GetItemAsstSurgeon();
            return Json(GetItemCode ?? new List<GetItemAsstSurgeon>(), JsonRequestBehavior.AllowGet);

        }


        public JsonResult ORNOListDal(string id)
        {
            List<OTNOListModel> list = bs.OTNOListModelDal(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DepartmentList(string id)
        {
            List<ListDepartModel> list = bss.DepartListDAL(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }


        public ActionResult RecoveryRoomCharges(int OtId)
        {
            ItemCodeModel model = new ItemCodeModel();
            List<FetchRecoveryRoomCharges> list = model.FetchRecoveryRoomCharges(OtId);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<FetchRecoveryRoomCharges>() }),
                ContentType = "application/json"
            };
            return result;

        }

    }
}
