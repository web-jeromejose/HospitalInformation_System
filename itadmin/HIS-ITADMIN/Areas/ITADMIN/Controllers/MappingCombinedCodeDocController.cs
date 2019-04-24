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
    public class MappingCombinedCodeDocController : BaseController
    {
        //
        // GET: /ITADMIN/MappingCombinedCodeDoc/
        MappingCombinedDocCodeModel bs = new MappingCombinedDocCodeModel();
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult DoctorCombList(string id)
        {
            List<DoctorListCombinedDoctor> list = bs.DoctorCombinedCodeList(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GeneralListDashBoard()
        {
            MappingCombinedDocCodeModel model = new MappingCombinedDocCodeModel();
            List<CombinedDoctorDashBoard> list = model.CombinedDoctorDashBoard();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<CombinedDoctorDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }


        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(CombinedDoctorHeaderSave entry)
        {
            MappingCombinedDocCodeModel model = new MappingCombinedDocCodeModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
 
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "MappingCombinedCodeDocController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

        public ActionResult SelectedListItem(int Id)
        {
            MappingCombinedDocCodeModel model = new MappingCombinedDocCodeModel();
            List<SelectedDoctorList> list = model.SelectedDoctorList(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<SelectedDoctorList>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult SelectedHeaderListItem(int Id)
        {
            MappingCombinedDocCodeModel model = new MappingCombinedDocCodeModel();
            List<SelectedHeaderDoctorList> list = model.SelectedHeaderDoctorList(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<SelectedHeaderDoctorList>() }),
                ContentType = "application/json"
            };
            return result;

        }

    }
}
