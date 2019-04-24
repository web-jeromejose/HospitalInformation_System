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
    public class EmployeeDetailsController : BaseController
    {
        //
        // GET: /ITADMIN/EmployeeDetails/
    
        EncryptDecrypt EncryDecry = new EncryptDecrypt();
        Encryption enrypt = new Encryption();
        UserRegistrationModel model = new UserRegistrationModel();
     


        public ActionResult Index()
        {
            /* different view for sharjah..ask fahad may22 2018
             * 
             if (this.GetIssueAuthorityCode("AE02"))//sharjah
            {
                return Redirect("/ITADMIN/EmployeeDetails/IndexSharjah");
            }
            else
            {
                return View();
            }
             */

            return View();
        }

        public ActionResult IndexSharjah()
        {
            return View();
        }

        public JsonResult AllActiveEmployees()
        {
            List<UserList> list = model.AllActiveEmployees();
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult AllNewEmployees()
        {
            List<UserList> list = model.AllNewEmployees();
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetCountEmployees()
        {
            List<GetCountEmployees> list = model.GetCountEmployees();
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult NewEmployeeSave(NewUserRegistrationSave entry)
        {
          
            entry.OperatorId = this.OperatorId;
            entry.IPAddress = this.GetLanIPAddress();
            entry.Pass_key = entry.Password;
            entry.Password = enrypt.EnCryptNew(entry.Password);
            bool status = model.NewEmployeeSave(entry);
 

            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "EmployeeDetailsController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });

        }


        public JsonResult GetEmployeeDetails(string id)
        {
            List<GetEmployeeDetails> li = model.GetEmployeeDetails(id);
            return Json(li, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetUserInformation(int Id)
        {
            GetUserListModel c = model.GetUserInfo(Id);
            string password = "ERROR-DECYPTOR";
            try
            {
                  password = EncryDecry.DecryptPassword(c.Password);
            }
            catch (Exception ex) {
                //log  
                var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
                string log_details = log_serializer.Serialize("ERROR IN DECYPTOR");
                MasterModel log = new MasterModel();
                bool logs = log.loginsert("GetUserInformation-ERROR", "EmployeeDetailsController", Id.ToString(), "0", this.OperatorId, log_details, this.LocalIPAddress());

            }

            GetUserListModel li = new GetUserListModel()
            {
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
                DecrpytPass = (c.Password == "" || c.Password == null ? "EXPIRED" : password)
            };

            return Json(li, JsonRequestBehavior.AllowGet);
        }

            [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult ChangePasswordSave(NewUserRegistrationSave entry)
        {
          
            entry.OperatorId = this.OperatorId;
            entry.IPAddress = this.GetLanIPAddress();
            entry.Pass_key = entry.Password;
            entry.Password = enrypt.EnCryptNew(entry.Pass_key);
            entry.Password = enrypt.EnCryptNew(entry.Pass_key);
         
         
                var i = 0;
                while (i < 5)
                    {

                        string s = enrypt.EnCryptNew(entry.Pass_key);  
                        var withoutSpecial = new string(s.Where(c => Char.IsLetterOrDigit(c)
                                                         || Char.IsWhiteSpace(c)).ToArray());

                        if (s != withoutSpecial)
                        {
                            entry.Password = s;
                        }
                        else {
                            entry.Password = s;
                            break;
                        }


                    i += 1;
     
                    }


            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("ChangePasswordSave", "EmployeeDetailsController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            bool status = model.ChangePasswordSave(entry);
            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });

        }


            [AcceptVerbs(HttpVerbs.Post)]
            public ActionResult ForceResetPassword(string EmpId)
            {
                UserRegistrationModel model = new UserRegistrationModel();
                bool status = model.ForceResetPassword(EmpId);
               
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(EmpId);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("ForceResetPasswordSave", "EmployeeDetailsController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });

            }


            #region forSharjah
            /**for SHARJAH BRANCH
         * May 22 2018
             * RULES : NO RULES
             * default password change to employee id
         */

            [AcceptVerbs(HttpVerbs.Post)]
            public ActionResult ForceResetPassword_Sharjah(string EmpId)
            {
                UserRegistrationModel model = new UserRegistrationModel();
                string EncryptPass = "";
              

                var i = 0;
                while (i < 5)
                {

                    string s = enrypt.EnCryptNew(EmpId);
                    var withoutSpecial = new string(s.Where(c => Char.IsLetterOrDigit(c)
                                                     || Char.IsWhiteSpace(c)).ToArray());

                    if (s != withoutSpecial)
                    {
                        EncryptPass = s;
                    }
                    else
                    {
                        EncryptPass = s;
                        break;
                    }


                    i += 1;

                }



                bool status = model.ForceResetPassword_Sharjah(EmpId, EncryptPass);
                //log  
                MasterModel log = new MasterModel();
                bool logs = log.loginsert("ForceResetPassword", "EmployeeDetailsController", "0", "0", this.OperatorId, "  " + EmpId, this.LocalIPAddress());


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });

            }
            #endregion


    }

}
