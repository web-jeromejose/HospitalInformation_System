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
using SGH.Encryption;


namespace HIS_ITADMIN.Areas.ITADMIN.Controllers
{
    public class UserRegistrationController : BaseController
    {
        //
        // GET: /ITADMIN/UserRegistration/
        UserRegistrationModel bs = new UserRegistrationModel();
        EncryptDecrypt EncryDecry = new EncryptDecrypt();
        Encryption enrypt = new Encryption();


        [IsSGHFeatureAuthorized(mFeatureID = "1824")]
        public ActionResult Index()
        {
            return View();
        }

       public JsonResult Select2UserList(string id)
        {
            List<UserList> list = bs.Select2UserListDal(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }
       public JsonResult Select2UserListWithUserAuthentic(string id)
       {
           List<UserList> list = bs.Select2UserListDal(id);
          // List<UserList> list = bs.Select2UserListDalWithuserAuthentic(id); 
           return Json(list, JsonRequestBehavior.AllowGet);
       }

       public ActionResult FetchUserListInformation(int Id)
        {
            UserRegistrationModel model = new UserRegistrationModel();
            List<GetUserListModel> list = model.FetchUserInfo(Id);
          
            //list.First().Password();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<GetUserListModel>() }),
                ContentType = "application/json"
            };
            return result;

        }

       public ActionResult Select2FetchUserDetails(string searchTerm, int pageSize, int pageNum)
        {
            Select2UserInfoRespository list = new Select2UserInfoRespository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

       public JsonResult GetUserInformation(int Id)
        {
            GetUserListModel c = bs.GetUserInfo(Id);
            GetUserListModel li = new GetUserListModel()
            {
              //3fZ93[$U3PW!3k:D3\373U5e3fZN
                Id = c.Id,
                Name = c.Name,
                Password = c.Password,
                Email = c.Email,
                Mobile = c.Mobile,
                Question1 = c.Question1,
                Question2 = c.Question2,
                SecAnswer1 = c.SecAnswer1,
                SecAnswer2 = c.SecAnswer2,
                EffectivityDate = c.EffectivityDate,
                //IsSuperUserId = c.IsSuperUserId,
                //IsSuperUser = c.IsSuperUser,
                DecrpytPass = (c.Password == "" || c.Password == null ? "EXPIRED" : EncryDecry.DecryptPassword(c.Password))
              //  DecrpytPass =  EncryDecry.DecryptPassword(c.Password.ToString())
            };

            return Json(li, JsonRequestBehavior.AllowGet);
        }

       [AcceptVerbs(HttpVerbs.Post)]
       public ActionResult Save(UserRegistrationSave entry)
        {
            UserRegistrationModel model = new UserRegistrationModel();
            entry.OperatorId = this.OperatorId;
            entry.IPAddress = this.GetLanIPAddress();
            //var EncryptPasssword = EncryDecry.EncryptNewPassword(entry.Password,true);
            entry.Pass_key = entry.Password;
            entry.Password = enrypt.EnCryptNew(entry.Password);
            bool status = model.Save(entry);
 
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "UserRegistrationController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());




            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });

        }


       public JsonResult PassExcepEmployeeList(string id)
        {
            List<UserListPassExcep> list = bs.Select2UserListPassExcep(id);
            return Json(list, JsonRequestBehavior.AllowGet);

        }
       [AcceptVerbs(HttpVerbs.Post)]
       public ActionResult PasswordExceptionSave(ExcepPassModel entry)
       {
           UserRegistrationModel model = new UserRegistrationModel();
           bool status = model.SavePassExcep(entry);
            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });

       }
        [AcceptVerbs(HttpVerbs.Post)]
       public ActionResult ForceResetPassword(string EmpId)
       {
           UserRegistrationModel model = new UserRegistrationModel();
           bool status = model.ForceResetPassword(EmpId);
            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });

       }

        


       public JsonResult UserLockedList()
       {
           List<UserLockedList> list = bs.UserLockedList();
           return Json(list, JsonRequestBehavior.AllowGet);
       }
       [AcceptVerbs(HttpVerbs.Post)]
       public ActionResult UserLockedSave(UnlockedUserModel entry)
       {
           UserRegistrationModel model = new UserRegistrationModel();
           entry.OperatorId = this.OperatorId;
           bool status = model.UserLockedSave(entry);
           return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });

       }
       public JsonResult DeptList()
       {
           UserRegistrationModel model = new UserRegistrationModel();
           List<RoleModel> li = model.GetDepartmentDal();
           return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
       }

       public JsonResult GetWebIPLogin()
       {
           List<GetWebIPLogin> list = bs.GetWebIPLogin();
           return Json(list, JsonRequestBehavior.AllowGet);
       }

       [AcceptVerbs(HttpVerbs.Post)]
       public ActionResult GetWebIPLoginSave(GetWebIPLoginEntry entry)
       {
           UserRegistrationModel model = new UserRegistrationModel();
           entry.OperatorId = this.OperatorId;
           bool status = model.GetWebIPLoginSave(entry);
           return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });

       }



     }
}
