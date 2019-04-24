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
    public class OPDoctorClinicController : BaseController
    {
        //
        // GET: /ITADMIN/OPDoctorClinic/
        OPDoctorClinicModel bs = new OPDoctorClinicModel();

        [IsSGHFeatureAuthorized(mFeatureID = "2016")]
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult FetchOPClinic(int Id)
        {
            OPDoctorClinicModel model = new OPDoctorClinicModel();
            List<OPDoctorViewModel> list = model.OPDoctorViewModel(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<OPDoctorViewModel>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public JsonResult Select2Department(string id)
        {
            List<ListDepartDAL> list = bs.Select2DepartList(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }


        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(OPDoctorClinicHeaderSave entry)
        {
            OPDoctorClinicModel model = new OPDoctorClinicModel();
            //entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);

           
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "OPDoctorClinicController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());




            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }


    }
}
