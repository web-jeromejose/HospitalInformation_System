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
    public class DoctorStationGroupController : BaseController
    {

        // GET: /ITADMIN/DoctorStationGroup/
        DoctorStationGroupModel model = new DoctorStationGroupModel();
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult ProfileList()
        {
            List<RoleModel> list = model.ProfileList();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<RoleModel>() }),
                ContentType = "application/json"
            };
            return result;
        }
        
        //public ActionResult DoctorList()
        //{
        //    List<RoleModel> list = model.DoctorList();
        //    var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
        //    var result = new ContentResult
        //    {
        //        Content = serializer.Serialize(new { list = list ?? new List<RoleModel>() }),
        //        ContentType = "application/json"
        //    };
        //    return result;
        //}

        //public JsonResult DoctorList()
        //{
        //    List<RoleModel> list = model.DoctorList();
        //    return Json(list.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        //}

        public ActionResult StationList(string searchTerm, int pageSize, int pageNum)
        {
            Select2NewStationListRepository list = new Select2NewStationListRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult DoctorList(string searchTerm, int pageSize, int pageNum)
        {
            Select2NewDoctorListRepository list = new Select2NewDoctorListRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }


        public ActionResult ShowStationProfileId(int ProfileId)
        {
            List<IdName> list = model.ShowStationProfileId(ProfileId);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<IdName>() }),
                ContentType = "application/json"
            };
            return result;
        }

        public ActionResult ShowDoctorProfileId(int ProfileId)
        {
            List<IdName> list = model.ShowDoctorProfileId(ProfileId);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<IdName>() }),
                ContentType = "application/json"
            };
            return result;
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(DonorStatGroupSave entry)
        {
            entry.operatorid = this.OperatorId;
            entry.ipaddress = this.LocalIPAddress();
            bool status = model.Save(entry);
            
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "DoctorStationGroupController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            return Json(new CustomMessage { Title = "Message...", Message =" Profile Doctor Station Save", ErrorCode = status ? 1 : 0 });
        }
         [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult SaveProfile(SaveProfile entry)
        {
            entry.operatorid = this.OperatorId;
            entry.ipaddress = this.LocalIPAddress();
            bool status = model.SaveProfile(entry);
            return Json(new CustomMessage { Title = "Message...", Message =" New Profile Name Save", ErrorCode = status ? 1 : 0 });
        }
        

    }
}
