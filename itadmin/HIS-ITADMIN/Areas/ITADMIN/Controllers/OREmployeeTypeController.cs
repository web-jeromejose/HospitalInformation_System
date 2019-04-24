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
    public class OREmployeeTypeController : BaseController
    {
        //
        // GET: /ITADMIN/OREmployeeType/
        OREmployeeTypeModel bs = new OREmployeeTypeModel();
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult OREmployeeViewDetails(int Id)
        {
            OREmployeeTypeModel model = new OREmployeeTypeModel();
            List<OREmployeesView> list = model.OREmployeesView(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<OREmployeesView>() }),
                ContentType = "application/json"
            };
            return result;

        }


        public ActionResult OREmployeeType()
        {
            OREmployeeTypeModel model = new OREmployeeTypeModel();
            List<OREmployeeDashBoard> list = model.OREmployeeDashBoard();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<OREmployeeDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }

       

        public JsonResult EmployeeList(string id)
        {
            List<EmployeeListModel> list = bs.EmployeeListDal(id);
            return Json(list, JsonRequestBehavior.AllowGet);
         }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(OREmployeeSave entry)
        {
            OREmployeeTypeModel model = new OREmployeeTypeModel();
            //entry.OperatorID = this.OperatorId;
            bool status = model.Save(entry);
            

            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "OREmployeeTypeController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

    }
}
