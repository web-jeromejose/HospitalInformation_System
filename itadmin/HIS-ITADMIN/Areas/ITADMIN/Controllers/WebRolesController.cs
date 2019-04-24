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
    public class WebRolesController : BaseController
    {
        //
        // GET: /ITADMIN/WebRoles/
        WebRoles model = new WebRoles();

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult RolesDataTable()
        {
            List<RolesData> list = model.RoleListDT();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<RolesData>() }),
                ContentType = "application/json"
            };
            return result;

        }
        public JsonResult RoleList(string id)
        {
            List<RoleModel> li = model.GetRolesDal(id);
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }
        public JsonResult DeptList()
        {
             List<RoleModel> li = model.GetDepartmentDal();
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }
        public JsonResult ModuleList(string id)
        {
            List<RoleModel> li = model.GetModulesDal(id);
            return Json(li, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetModuleByRoleId(string id)
        {
            List<RoleModel> li = model.GetModuleByRoleId(id);
            return Json(li, JsonRequestBehavior.AllowGet);
        }
        public JsonResult ModuleAccessListFeat(string roleid, string moduleid)
        {
            List<GetFeatureByRole> li = model.GetFeatureByRole(roleid, moduleid);
            return Json(li, JsonRequestBehavior.AllowGet);
        }
         
        public ActionResult AssignRoleDashboard( string dept_id, string role_id)
        {
            List<AssignRoleDashboardDAL> list = model.AssignRoleDashboard(dept_id, role_id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<AssignRoleDashboardDAL>() }),
                ContentType = "application/json"
            };
            return result;

        }

          [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult AddModuleinRole(string moduleid, string roleid)
        {
             bool status = model.AddModuleinRole(moduleid, roleid,this.OperatorId);
 
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(moduleid);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("AddModuleinRole", "WebRolesController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });      
        }
    
          public ActionResult RemoveModuleinRole(string moduleid, string roleid)
        {
            bool status = model.RemoveModuleinRole(moduleid, roleid);
             var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 }),
                ContentType = "application/json"
            };
            return result;

        }
          public ActionResult UpdateRoleFeature(int roleid, int moduleid, int featid, int deleted)
          {
              bool status = model.UpdateRoleFeature(roleid, moduleid, featid, this.OperatorId, deleted);
         
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(moduleid);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("UpdateRoleFeature", "WebRolesController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
              var result = new ContentResult
              {
                  Content = serializer.Serialize(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 }),
                  ContentType = "application/json"
              };
              return result;
          }

        
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult AssignRoleSave(AssignRoleSaveDAL entry)
        {
            bool status = model.AssignRoleSave(entry);
           
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("AssignRoleSave", "WebRolesController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult UpdateRoleDesc(RolesDataTableUpdateDal entry)
        {
 
            bool status = model.UpdateRoleDesc(entry);
 
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("UpdateRoleDesc", "WebRolesController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }



    }
}
