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
    public class ComissionProfileController : BaseController
    {
        //sorry wrong spelling rush eh..late na narealize na mali :) rush rush rush
        // GET: /ITADMIN/ComissionProfile/
        ComissionProfileModel model = new ComissionProfileModel();

        [IsSGHFeatureAuthorized(mFeatureID = "2575")]
        public ActionResult Index()
        {
            return View();
        }


        public JsonResult GetDoctorDAL()
        {

            List<ListModel> li = model.GetDoctorDAL();
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }

        #region Commission Profile Options
        public ActionResult perDoctorListServices(string docid)
        {

            List<perDoctorList> list = model.perDoctorListServices(docid);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<perDoctorList>() }),
                ContentType = "application/json"
            };
            return result;

        }
        public ActionResult perDoctorListDepartment(string docid)
        {

            List<perDoctorList> list = model.perDoctorListDepartment(docid);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<perDoctorList>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult perDoctorListItems(string docid)
        {

            List<perDoctorList> list = model.perDoctorListItems(docid);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<perDoctorList>() }),
                ContentType = "application/json"
            };
            return result;

        }
        
        #endregion


        #region Service Tab


        public ActionResult ComissionProfileServiceTab(string type, string docid)
        {

            List<ComissionProfileServices> list = model.ComissionProfileServices(type, docid);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ComissionProfileServices>() }),
                ContentType = "application/json"
            };
            return result;

        }
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult SaveServiceTab(SaveServiceTabCP entry)
        {
            entry.OperatorId = this.OperatorId;
            entry.IpAddress = LocalIPAddress();
            
            bool status = model.SaveServiceTabCP(entry);
            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

        #endregion

        #region Department Tab

        public ActionResult ComissionProfileDepartmentTab(string type, string serviceId, string docid)
        {

            List<ComissionProfileServices> list = model.ComissionProfileDepartmentTab(type, serviceId, docid);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ComissionProfileServices>() }),
                ContentType = "application/json"
            };
            return result;

        }


        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult SaveDepartmentTab(SaveDepartmentTabCP entry)
        {
            entry.OperatorId = this.OperatorId;
            entry.IpAddress = LocalIPAddress();
            bool status = model.SaveDepartmentTab(entry);
            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }


        #endregion

        #region Item Tab
        public ActionResult ComissionProfileItemTabList(string type, string docid, string serviceid, string deptid)
        {

            List<ComissionProfileItemTabList> list = model.ComissionProfileItemTabList(type, docid, serviceid, deptid);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ComissionProfileItemTabList>() }),
                ContentType = "application/json"
            };
            return result;

        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult SaveItemTab(SaveItemTabCP entry)
        {
            entry.OperatorId = this.OperatorId;
            entry.IpAddress = LocalIPAddress();
            bool status = model.SaveItemTab(entry);
            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

      


        #endregion


    }
}
