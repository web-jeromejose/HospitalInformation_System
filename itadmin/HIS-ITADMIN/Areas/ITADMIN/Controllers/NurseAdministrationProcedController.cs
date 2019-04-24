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
    public class NurseAdministrationProcedController : BaseController
    {
        //
        // GET: /ITADMIN/NurseAdministrationProced/
        NursingAdminisModel bs = new NursingAdminisModel();
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult NursingAdminisDashboardModel()
        {
            NursingAdminisModel model = new NursingAdminisModel();
            List<NursingAdminisDashboardModel> list = model.NursingAdminisDashboardModel();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<NursingAdminisDashboardModel>() }),
                ContentType = "application/json"
            };
            return result;

        }


        public JsonResult DepartmentList(string id)
        {
            List<ListDepartModel> list = bs.DepartListDAL(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public ActionResult FetchNursingAdminis(int Id)
        {
            NursingAdminisModel model = new NursingAdminisModel();
            List<NursingAdminViewModel> list = model.NursingAdminViewModel(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<NursingAdminViewModel>() }),
                ContentType = "application/json"
            };
            return result;
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(NursingAdminisSaveModel entry)
        {
            NursingAdminisModel model = new NursingAdminisModel();
            //entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
          
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "NurseAdministrationProcedController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }


    }
}
