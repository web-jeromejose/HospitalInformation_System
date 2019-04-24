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
    public class UserRolesController : BaseController
    {
        //
        // GET: /ITADMIN/UserRoles/
        UserRoleslModel bs = new UserRoleslModel();

        [IsSGHFeatureAuthorized(mFeatureID = "2233")]
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult Select2GetModuleDAL(string searchTerm, int pageSize, int pageNum, int ModuleId)
        {
            Select2GetModuleRoles list = new Select2GetModuleRoles();
            list.Fetch(ModuleId);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult ModuleList(string id)
        {
            List<Select2ModuleList> list = bs.Select2ModuleListDal(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public JsonResult EmployeeList(string id)
        {
            List<Select2ModuleList> list = bs.Select2UserListDAL(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public ActionResult FeatureNewEntryDashBoard(int ModuleId)
        {
            UserRoleslModel model = new UserRoleslModel();
            List<FeatureListDashBoard> list = model.FeatureNewEntry(ModuleId);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<FeatureListDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult FunctionNewEntryDashBoard()
        {
            UserRoleslModel model = new UserRoleslModel();
            List<FunctionListSelected> list = model.FunctionNewEntry();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<FunctionListSelected>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult FeatureDashBoardList(int ModuleId,int RoleId,int UserId)
        {
            UserRoleslModel model = new UserRoleslModel();
            List<FeatureListDashBoard> list = model.FeatureListDashBoardDAL(ModuleId, RoleId, UserId);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<FeatureListDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult FunctionListSelected(int UserId, int ModuleId, int RoleId)
        {
            UserRoleslModel model = new UserRoleslModel();
            List<FunctionListSelected> list = model.FunctionListDL(UserId,ModuleId, RoleId);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<FunctionListSelected>() }),
                ContentType = "application/json"
            };
            return result;

        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(UserRolesHeaderSave entry)
        {
            UserRoleslModel model = new UserRoleslModel();
            entry.OperatorId = this.OperatorId;
            entry.StationId = 0; //this.StationId;
            bool status = model.Save(entry);
 
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "UserRolesController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }


    }
}
