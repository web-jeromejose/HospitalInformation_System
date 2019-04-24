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
using SGH.Encryption;

namespace HIS_ITADMIN.Areas.ITADMIN.Controllers
{
    public class DoctorProfileEntryController : BaseController
    {
  
        //
        // GET: /ITADMIN/DoctorProfileEntry/
        SharjahModel model = new SharjahModel();

        [IsSGHFeatureAuthorized(mFeatureID = "2693")]
        public ActionResult Index()
        {
            return View();
        }


        public JsonResult AllActiveDoctors()
        {
            List<ListModel> list = model.AllActiveDoctors();
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public JsonResult getdetailsfromDocProf(int id)
        {
            List<getdetailsfromDocProfVM> list = model.getdetailsfromDocProf(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult DoctorProfileEntrySave(DoctorProfileEntrySaveDal entry)
        {
            entry.operatorid = this.OperatorId;
            bool status = model.DoctorProfileEntrySave(entry);
            //log  
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("SharjahModel", "DoctorProfileEntryController", "0", "0", this.OperatorId, " ", this.LocalIPAddress());


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });

        }



        public ActionResult DoctorProfileEntryDashboard()
        {

           
            List<DoctorProfileEntryDashboardDal> list = model.DoctorProfileEntryDashboard();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<DoctorProfileEntryDashboardDal>() }),
                ContentType = "application/json"
            };
            return result;

        }

    }
}
