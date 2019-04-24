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
    public class VatProfileController : BaseController
    {
        //
        // GET: /ITADMIN/VatCharges/
        VatProfileModel model = new VatProfileModel();

        [IsSGHFeatureAuthorized(mFeatureID = "2567")]
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult TaxList()
        {
            List<RoleModel> li = model.TaxList();
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }
        public JsonResult DeptList()
        {
         
            List<RoleModel> li = model.GetDepartmentDal();
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GradeList()
        {

            List<RoleModel> li = model.GetGradeDal();
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }
        public JsonResult NationalityList()
        {
            List<RoleModel> li = model.GetNationalityDal();
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }

        #region ViewVatButton
        public ActionResult VatPresentPrice()
        {
 
            List<Tax> list = model.VatPresentPrice();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<Tax>() }),
                ContentType = "application/json"
            };
            return result;

        }
        public ActionResult VatNewPrice()
        {

            List<Tax> list = model.VatNewPrice();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<Tax>() }),
                ContentType = "application/json"
            };
            return result;

        }
        

        public JsonResult VatServiceListByType(string IpOrOp)
        {
            List<RoleModel> li = model.VatServiceListByType(IpOrOp);
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult SaveNewVat(SaveNewVat entry)
        {
            entry.OperatorId = this.OperatorId;
            entry.IpAddress = LocalIPAddress();
            bool status = model.SaveNewVat(entry);
            
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("SaveNewVat", "VatProfileController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }


        #endregion


        #region Service Tab


        public ActionResult VatServiceTab(string type, string taxid)
        {

            List<TaxServices> list = model.VatTaxServices(type, taxid);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<TaxServices>() }),
                ContentType = "application/json"
            };
            return result;

        }

        

            
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult SaveServiceTab(SaveServiceTab entry)
        {
            entry.OperatorId = this.OperatorId;
            entry.IpAddress = LocalIPAddress();
            bool status = model.SaveServiceTab(entry);


            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("SaveServiceTab", "VatProfileController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

 
        #endregion

        #region Department Tab

        public ActionResult VatDepartmentTab(string type, string serviceId)
        {

            List<TaxServices> list = model.VatDepartmentTab(type, serviceId);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<TaxServices>() }),
                ContentType = "application/json"
            };
            return result;

        }

        
              [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult SaveDepartmentTab(SaveDepartmentTab entry)
        {
            entry.OperatorId = this.OperatorId;
            entry.IpAddress = LocalIPAddress();
            bool status = model.SaveDepartmentTab(entry);

            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("SaveDepartmentTab", "VatProfileController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

        #endregion

        #region Item Tab


        public JsonResult DeptListByService(string IpOrOp,string serviceId )
        {

            List<RoleModel> li = model.DeptListByService(IpOrOp, serviceId);
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }

     
        public ActionResult VatItemTabList(string type, string taxid,string serviceid, string deptid)
        {

            List<VatItemTabList> list = model.VatItemTabList(type, taxid, serviceid, deptid);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<VatItemTabList>() }),
                ContentType = "application/json"
            };
            return result;

        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult SaveItemTab(SaveItemTab entry)
        {
            entry.OperatorId = this.OperatorId;
            entry.IpAddress = LocalIPAddress();
            bool status = model.SaveItemTab(entry);

            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("SaveItemTab", "VatProfileController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }


        #endregion

        #region Tax Exemption
        public ActionResult TaxExempList()
        {

            List<TaxExempList> list = model.TaxExempList();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<TaxExempList>() }),
                ContentType = "application/json"
            };
            return result;

        }


        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult SaveTaxExemp(SaveTaxExemp entry)
        {
            entry.OperatorId = this.OperatorId;

            bool status = model.SaveTaxExemp(entry);


            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("SaveTaxExemp", "VatProfileController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }
        #endregion



    }
}
