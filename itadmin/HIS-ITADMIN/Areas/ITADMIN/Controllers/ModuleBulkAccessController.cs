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
    public class ModuleBulkAccessController : BaseController
    {
        //
        // GET: /ITADMIN/ModuleBulkAccess/
        ModuleAccessDAL bs = new ModuleAccessDAL();
        ModuleBulkAccessDAL bsBulk = new ModuleBulkAccessDAL();

        public ActionResult Index()
        {
            return View();
        }

         [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult EmployeeList(FilterSearchModuleAccess filter)
        {
            

            List<GetAllEmplist> li = bsBulk.GetAllEmplist(filter.DeptId,filter.DesigId,filter.CatId);
            return Json(li, JsonRequestBehavior.AllowGet);
        }
        public JsonResult ModuleAccessList()
        {

            List<ListModel> li = bsBulk.ModuleAccessList();
            return Json(li, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ModuleAccessListFeat(string mod)
        {
    
            List<ModuleAccessModel> li = bsBulk.GetModuleAccessFeatureDAL(mod);
            return Json(li, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetUserFunctionsFeat( string feat)
        {
            List<FunctionUserModel> li = bsBulk.GetUserFeatureFunctionDAL(feat);
            return Json(li , JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDepartmentList()
        {

            List<RoleModel> li = bsBulk.GetDepartmentList();
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetDesignationList()
        {

            List<RoleModel> li = bsBulk.GetDesignationList();
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetCategoryList()
        {

            List<RoleModel> li = bsBulk.GetCategoryList();
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }



        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult SaveModuleEmployee(AddModuleEmployee entry)
        {
            entry.OperatorId = this.OperatorId;

            bool status = bsBulk.AddModuleEmployee(entry);
            return Json(new CustomMessage { Title = "Message...", Message = bsBulk.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

         [AcceptVerbs(HttpVerbs.Post)]
        public JsonResult UpdateUserFeature(AddModuleEmployee entry )
        {
            entry.OperatorId = this.OperatorId;
            bool status =   bsBulk.UpdateUserFeatureDAL(entry);
            return Json(new CustomMessage { Title = "Message...", Message = bsBulk.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

      

         [AcceptVerbs(HttpVerbs.Post)]
         public JsonResult UpdateUserFunction(AddModuleEmployee entry)
         {
             entry.OperatorId = this.OperatorId;
             bool status = bsBulk.UpdateUserFunction(entry);
             return Json(new CustomMessage { Title = "Message...", Message = bsBulk.ErrorMessage, ErrorCode = status ? 1 : 0 });
         }


    }

    public class FilterSearchModuleAccess
    {
        public string DeptId { get; set; }
        public string DesigId { get; set; }
        public string CatId { get; set; }

    }

}
