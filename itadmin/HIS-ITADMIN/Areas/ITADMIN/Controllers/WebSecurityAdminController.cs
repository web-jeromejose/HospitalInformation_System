using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataLayer;
using HIS.Controllers;
using System.Web.Script.Serialization;

namespace HIS_ITADMIN.Areas.ITADMIN.Controllers
{
    public class WebSecurityAdminController : BaseController
    {
        //
        // GET: /ITADMIN/WebSecurityAdmin/

        public ActionResult Index()
        {
            return View();
        }

        ModuleAccessDAL modDal = new ModuleAccessDAL();
        WebSecurityAdminModel WebModel = new WebSecurityAdminModel();

        public JsonResult RoleList(string id)
        {
            List<RoleModel> li = modDal.GetRolesDal(id);
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }

        public JsonResult RoleListbyStationId(string id)
        {
            WebSecurityAdminModel model = new WebSecurityAdminModel();
            List<RoleModel> li = model.GetRolebyStationId(id);
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }


        public JsonResult StationList(string id)
        {
            WebSecurityAdminModel model = new WebSecurityAdminModel();
            List<RoleModel> li = model.GetStationDal(id);
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }
        public JsonResult ModuleList(string id)
        {
            List<RoleModel> li = modDal.GetModulesDal(id);
            return Json(li, JsonRequestBehavior.AllowGet);
        }


        public JsonResult DeptList()
        {
            WebSecurityAdminModel model = new WebSecurityAdminModel();
            List<RoleModel> li = model.GetDepartmentDal();
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }


        public ActionResult UsersDataTable()
        {
            WebSecurityAdminModel model = new WebSecurityAdminModel();
            List<UserDataTableDal> list = model.UsersDataTable();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<UserDataTableDal>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult GetRoleByUserID(string UserId)
        {
            WebSecurityAdminModel model = new WebSecurityAdminModel();
            List<GetRoleByUserIDDal> list = model.GetRoleByUserID(UserId);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<GetRoleByUserIDDal>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult RolesDataTable()
        {
            WebSecurityAdminModel model = new WebSecurityAdminModel();
            List<RolesDataTableDal> list = model.RolesDataTable();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<RolesDataTableDal>() }),
                ContentType = "application/json"
            };
            return result;

        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult UpdateRoleDesc(RolesDataTableUpdateDal entry)
        {
            WebSecurityAdminModel model = new WebSecurityAdminModel();
            bool status = model.UpdateRoleDesc(entry);

            //log  
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("UpdateRoleDesc", "WebSecurityAdminController", "0", "0", this.OperatorId, " ");


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

        public ActionResult AssignRoleDashboard(string station_id, string dept_id, string role_id)
        {
            WebSecurityAdminModel model = new WebSecurityAdminModel();
            List<AssignRoleDashboardDAL> list = model.AssignRoleDashboard(station_id, dept_id, role_id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<AssignRoleDashboardDAL>() }),
                ContentType = "application/json"
            };
            return result;

        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult AssignRoleSave(AssignRoleSaveDAL entry)
        {
            WebSecurityAdminModel model = new WebSecurityAdminModel();
            bool status = model.AssignRoleSave(entry);

            //log  
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("AssignRoleSave", "WebSecurityAdminController", "0", "0", this.OperatorId, " ");

            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

 
        #region Role MOdule Config
        public ActionResult GetModuleByRole(string RoleId)
        {
            WebSecurityAdminModel model = new WebSecurityAdminModel();
            List<GetModuleByRoleDAL> list = model.GetModuleByRole(RoleId);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<GetModuleByRoleDAL>() }),
                ContentType = "application/json"
            };
            return result;
        }

        public ActionResult GetFeatureListByRoleModule(string RoleId, string ModuleId, string StationId)
        {
            WebSecurityAdminModel model = new WebSecurityAdminModel();
            List<GetFeatureListByRoleModuleDAL> list = model.GetFeatureListByRoleModule(RoleId, ModuleId, StationId);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<GetFeatureListByRoleModuleDAL>() }),
                ContentType = "application/json"
            };
            return result;

        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult AddModuleByRoleId(AddModuleByRoleIdDAL entry)
        {
            WebSecurityAdminModel model = new WebSecurityAdminModel();
            bool status = model.AddModuleByRoleId(entry);
            //log  
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("AddModuleByRoleId", "WebSecurityAdminController", "0", "0", this.OperatorId, " ");

            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult RemoveModuleRoleStation(string RoleId, string ModuleId, string StationId)
        {
            WebSecurityAdminModel model = new WebSecurityAdminModel();
            bool status = model.RemoveModuleRoleStation(RoleId, ModuleId, StationId);
            //log  
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("RemoveModuleRoleStation", "WebSecurityAdminController", "0", "0", this.OperatorId, " ");

            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult RoleModuleConfigAccessRolePerFeatures(string RoleId, string ModuleId, string StationId, string FeatId, int Actionres)
        {
            WebSecurityAdminModel model = new WebSecurityAdminModel();
            bool status = model.RoleModuleConfigAccessRolePerFeatures(RoleId, ModuleId, StationId, FeatId, Actionres);
            //log  
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("RoleModuleConfigAccessRolePerFeatures", "WebSecurityAdminController", "0", "0", this.OperatorId, " ");

            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

        public JsonResult GetFunctionsFeat(string RoleId, string ModuleId, string StationId, string FeatId)
        {
            WebSecurityAdminModel model = new WebSecurityAdminModel();
            List<GetFeatureFunctionDAL> li = model.GetFeatureFunction(RoleId, ModuleId, StationId, FeatId);
            return Json(li.OrderBy(x => x.FunctionID), JsonRequestBehavior.AllowGet);
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult RoleModuleConfigFunctionPerStationModule(string RoleId, string FunctionId, string StationId, string FeatId, int Actionres)
        {
            WebSecurityAdminModel model = new WebSecurityAdminModel();
            bool status = model.RoleModuleConfigFunctionPerStationModule(RoleId, FunctionId, StationId, FeatId, Actionres);
            //log  
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("RoleModuleConfigFunctionPerStationModule", "WebSecurityAdminController", "0", "0", this.OperatorId, " ");

            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

        #endregion

        #region Station Module Role Tab
        public JsonResult ModuleListByStation(string StationId)
        {
            List<RoleModel> li = WebModel.ModuleListByStation(StationId);
            return Json(li, JsonRequestBehavior.AllowGet);
        }
        public JsonResult RoleListbyStationModule(string StationId,string ModuleId)
        {
            List<RoleModel> li = WebModel.RoleListbyStationModule(StationId, ModuleId);
            return Json(li, JsonRequestBehavior.AllowGet);
        }

        public JsonResult FeatureFunctionDashboard(string RoleId, string ModuleId , string StationId)
        {
            List<FeatureFunctionDashboard> li = WebModel.FeatureFunctionDashboard(RoleId, ModuleId,StationId);
            return Json(li, JsonRequestBehavior.AllowGet);
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult GetFunctionFromFeatureChecked(FunctionfromFeatureChecked entry)
        {
            List<FeatureFunctionDashboard> li = WebModel.GetFunctionFromFeatureChecked(entry);
            //log  
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("GetFunctionFromFeatureChecked", "WebSecurityAdminController", "0", "0", this.OperatorId, " ");

            return Json(li, JsonRequestBehavior.AllowGet);
        }



        
        #endregion








    }
}
