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
    public class BedController : BaseController
    {
        //
        // GET: /ITADMIN/Bed/
        BedDetailsModel bs = new BedDetailsModel();

        [IsSGHFeatureAuthorized(mFeatureID = "2224")]
        public ActionResult Index()
        {
            return View();
        }


        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(BedSave entry)
        {
            BedDetailsModel model = new BedDetailsModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
           
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "BedController", "0", "0", this.OperatorId, log_details);


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

        public ActionResult BedDashBoardList()
        {
            BedDetailsModel model = new BedDetailsModel();
            List<BedDashBoard> list = model.BedDashBoardDL();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<BedDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult FetchBedView(int Id)
        {
            BedDetailsModel model = new BedDetailsModel();
            List<BedViewModel> list = model.BedViewModelDL(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<BedViewModel>() }),
                ContentType = "application/json"
            };
            return result;

        }



        public JsonResult BedTypeDL(string id)
        {
            List<ListSelect> list = bs.BedType(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult StationNameDL(string id)
        {
            List<ListSelect> list = bs.StationName(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult RoomNameDL(string id)
        {
            List<ListSelect> list = bs.RoomName(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult BedStatusDL(string id)
        {
            List<ListSelect> list = bs.BedStatus(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult DepartmentListDL(string id)
        {
            List<ListSelect> list = bs.DepartmentList(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }
      

    }
}
