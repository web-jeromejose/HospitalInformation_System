using DataLayer;
using SGH.Encryption;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Web.Security;

namespace HIS.Controllers
{
    [Authorize]
    public class HomeController : BaseController
    {
        MainDAL main = new MainDAL();

        public ActionResult Index()
        {
            LoginDAL log = new LoginDAL();
     

            //if (Request.Cookies["lock"] != null)
            //{
            //    var lockkk = Request.Cookies["lock"].Value.ToString();
            //    if (lockkk == "true")
            //    {
            //        var cookieLock = Request.Cookies["lock"].Value;
            //        return View("LockScreenPage");
            //    }
            //}


            FormsIdentity id = (FormsIdentity)User.Identity;
            FormsAuthenticationTicket ticket = id.Ticket;
            var d = ticket.UserData.Split('|');
            var ip = LocalIPAddress();
            log.EmployeeID = d[0].ToString();
            MainDAL main = new MainDAL();
            List<UserModules> li = main.UserModuleListCS(d[0].ToString()).OrderBy(x => x.Name).ToList();
            string hostname = System.Environment.MachineName;

            //string departmentId,string userid, string ip,string hostname, bool isLoginCorrect )
            main.LogsUpdate(d[4].ToString(), d[0].ToString(), ip, hostname,true);

           
            return View(li);
            // }
        }

        public PartialViewResult GotoLockScreen()
        {
            
            return PartialView("_LockScreen" );
        }

        public ActionResult LogChart()
        {
            FormsIdentity id = (FormsIdentity)User.Identity;
            FormsAuthenticationTicket ticket = id.Ticket;
            var d = ticket.UserData.Split('|');
        
            List<LogChar> list = main.LogChart(d[0].ToString());
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<LogChar>() }),
                ContentType = "application/json"
            };
            return result;

        }
        public ActionResult PunchInDetails()
        {
            FormsIdentity id = (FormsIdentity)User.Identity;
            FormsAuthenticationTicket ticket = id.Ticket;
            var d = ticket.UserData.Split('|');

            List<PunchInDetails> list = main.PunchInDetails(d[1].ToString());
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<PunchInDetails>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public JsonResult OpenPage(string id)
        {
            ApplicationGlobal app = new ApplicationGlobal();
            app.ModuleID = id;
            ApplicationVersionModel apps = app.GetApplicationDetail();
            ControllerContext.StoreModelToCookies("AppModel" + id, apps);
            return Json("", JsonRequestBehavior.AllowGet);
        }

        public ActionResult LogOff()
        {
          
            LoginDAL logindal = new LoginDAL();
            FormsIdentity id = (FormsIdentity)User.Identity;
            FormsAuthenticationTicket ticket = id.Ticket;
            var d = ticket.UserData.Split('|');
            var ip = LocalIPAddress();
            logindal.EmployeeID = d[0].ToString();

            bool logout = logindal.LogoutProcess(ip);

            FormsAuthentication.SignOut();

            Response.Cookies.Add(new HttpCookie("lock", "0"));
            Response.Cookies.Add(new HttpCookie("Logged_LockScreen", ""));
            return RedirectToAction("Index", "Login");
        }
        public ActionResult ChangePassword()
        {
            LoginDAL log = new LoginDAL();
            MainDAL main = new MainDAL();
            FormsIdentity id = (FormsIdentity)User.Identity;
            FormsAuthenticationTicket ticket = id.Ticket;
            var d = ticket.UserData.Split('|');

            log.EmployeeID = d[0].ToString();

            /*
            TO CHANGE THE DAYS FOR PASSWORD
            * [ITADMIN].[CheckUserPasswordExpiryDate] 
            * [ITADMIN].[CheckUserPasswordDaysRemaining]
            * 
            */
            List<UserModules> li = main.UserModuleListCS(d[0].ToString()).OrderBy(x => x.Name).ToList();
            return View(li);

        }
        public JsonResult GetUserInformation(int Id)
        {
            MainDAL bs = new MainDAL();

            Encryption ency = new Encryption();
            GetUserListModel c = bs.GetUserInfo(Id);

            EncryptDecryptSec EncryDecry = new EncryptDecryptSec();
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
                //IsSuperUserId = c.IsSuperUserId,
                //IsSuperUser = c.IsSuperUser,
                DecrpytPass = EncryDecry.DecryptPassword(c.Password)
            };

            return Json(li, JsonRequestBehavior.AllowGet);
        }
        public JsonResult ChangePasswordSave(ChangePasswordSaveModel ChangePasswordSaveModel)
        {
            Encryption ency = new Encryption();
            MainDAL bs = new MainDAL();
            FormsIdentity id = (FormsIdentity)User.Identity;
            FormsAuthenticationTicket ticket = id.Ticket;
            var d = ticket.UserData.Split('|');
            var empid = d[1].ToString();
            //UserFormModel.EmpId = empid;
            //  UserFormModel.Action = "1";
            //ChangePasswordSaveModel.password = EncryDecry.EnCryptPassword("EXPIRED");
            ChangePasswordSaveModel.pass_key = ChangePasswordSaveModel.password;
            ChangePasswordSaveModel.password = ency.EnCryptNew(ChangePasswordSaveModel.pass_key);
            ChangePasswordSaveModel.Action = "1";

            bool status = bs.ChangePasswordSave(ChangePasswordSaveModel);
            return Json(new CustomMessage { Title = "Message...", Message = bs.ErrorMessage, ErrorCode = status ? 1 : 0 }, JsonRequestBehavior.AllowGet);

        }
        public JsonResult ChangeStation(int stationId)
        {
            this.StationId = stationId;
            var result = new { };
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        public PartialViewResult GetMenu()
        {
            ApplicationVersionModel apps = new ApplicationVersionModel();
            ApplicationGlobal glob = new ApplicationGlobal();
            glob.UserID = this.OperatorId.ToString();
            List<ApplicationMenuModel> menu = glob.GetApplicationMenu();
            return PartialView("_Menu", menu ?? new List<ApplicationMenuModel>());
        }
        public JsonResult GetApplicationIssue()
        {
            ApplicationGlobal glob = new ApplicationGlobal();
            glob.UserID = this.OperatorId.ToString();
            List<ApplicationIssueModel> iss = glob.GetApplicationIssueDAL();
            return Json(iss, JsonRequestBehavior.AllowGet);
        }






    }
    public class CustomMessage
    {
        public string Title { get; set; }
        public string Message { get; set; }
        public int ErrorCode { get; set; }
    }
}
