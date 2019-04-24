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
    public class MasterController : BaseController
    {

        MasterModel model = new MasterModel();
        // GET: /ITADMIN/Master/

        public ActionResult Index()
        {
            return View();
        }

        #region DosageForm

        public ActionResult DosageForm()
        {
            return View();
        }


        public JsonResult DosageFormDashboard()
        {
            List<DosageFormMaster> li = model.DosageFormDashboard();
            return Json(li.OrderBy(x => x.Name), JsonRequestBehavior.AllowGet);
        }


        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult DosageFormSave(DosageFormMasterEntry entry)
        {
            //entry.OperatorId = this.OperatorId;

            bool status = model.DosageFormSave(entry);
            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

        #endregion

        #region ServiceCategory

        public ActionResult ServiceCategory()
        {
            return View();
        }
        public JsonResult ServiceCategoryDashboard()
        {
            List<ServiceCategoryDashboard> li = model.ServiceCategoryDashboard();
            return Json(li, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeptList()
        {
            List<RoleModel> li = model.GetDepartmentDal();
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }
        public JsonResult ServiceCategoryList()
        {
            List<RoleModel> li = model.GetServiceCategory();
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }
        public JsonResult TestList()
        {
            List<RoleModel> li = model.GetTestList();
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetDeptByTestId(string testid)
        {
            List<RoleModel> li = model.GetDeptByTestId(testid);
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }


        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult ServiceCategorySave(ServiceCatSaveEntry entry)
        {
            //entry.OperatorId = this.OperatorId;

            bool status = model.ServiceCategorySave(entry);
            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

        #endregion

        #region OPCancelReceiptApproval
        public ActionResult OPCancelReceiptApproval()
        {
            return View();
        }

        public JsonResult ViewData_OPCancelReceiptApproval(string billno)
        {
            List<OPCancelReceiptApprovalViewVM> li = model.ViewData_OPCancelReceiptApproval(billno);
            return Json(li , JsonRequestBehavior.AllowGet);
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult OPCancelReceiptApprovalSAVE(OPCancelReceiptApprovalSaveVM entry)
        {
           entry.OperatorID = this.OperatorId;
            bool status = model.OPCancelReceiptApprovalSAVE(entry);
            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }


        #endregion

        #region

        #endregion

        #region

        #endregion

        #region

        #endregion

    }
}
