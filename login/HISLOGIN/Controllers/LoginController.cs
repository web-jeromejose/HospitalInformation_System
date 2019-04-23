using DataLayer;
using System;
using System.Configuration;
using System.Diagnostics;
using System.Globalization;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Web.Security;

namespace HIS_LOGIN.Controllers
{
    public class LoginController : Controller
    {
        //
        // GET: /Login/

/* JFJ AUg2017
 RULES :
 *  CHECK 
 * 1. Domain IP of the web url
 * 2. SQL Data Source 
 * 3. set up the String variable in SQlDataSource and  DomainName
 * 
 * User SIDE:
 * CHECK
 * 1. PC IP Address
 * 2. Domain IP of the web url
 * 3. Employee Department ID
 * 4. Check in the [HISGLOBAL].[HIS_WEB_LoginIP]  talbe the IP , BranchIP and the Department
 * 
 * SECURITY
 * 1. 3 Times locked accout due to wrong set up of ip address and branchip and department . Wrong password.
 * 
 * last part: scrap this nonsense..
 * 
 * JFJ feb 2019
 * comment unused methods.
 */
        private EncryptDecrypt EncryDecry = new EncryptDecrypt();



        public ActionResult Index(string ReturnUrl)
        {
            var domain = GetbranchIP();
            //check SQL server
            string connString = "";
            connString = ConfigurationManager.ConnectionStrings["SghDbContextConnString"].ConnectionString;
            connString = EncryDecry.Decrypt(connString, true);


            //get the DATA SOURCE AND WEBSERVER
            //string datasecurity = "";
            //datasecurity = ConfigurationManager.ConnectionStrings["SghSecurityLogin"].ConnectionString;
            //datasecurity = EncryDecry.Decrypt(datasecurity, true);
            //var datasoc = datasecurity.Split('%');
            //SQlDataSource = datasoc[0].ToString();
            //DomainName = datasoc[1].ToString();

            //bool sqlconn = connString.Contains(SQlDataSource);

            //if (domain != DomainName || sqlconn == false)
            //{
            //    if (domain != "localhost")//for localhost dev only
            //    {
            //        return RedirectToAction("ErrorSite", "Login");
            //    }
            //}

            ViewBag.Error = TempData["ErrorMessage"];
            ViewBag.sUsername = TempData["sUsername"];

            //Response.Cookies["ReturnURL"].Expires = DateTime.Now.AddDays(-1);
            //if (!String.IsNullOrEmpty(ReturnUrl))
            //{
            //    if (ReturnUrl != "/")
            //    {
            //        Response.Cookies.Add(new HttpCookie("ReturnURL", ReturnUrl));
            //    }
            //}
            if (!User.Identity.IsAuthenticated)
            {
                return View(new LoginModel());
            }
            else
            {
                return RedirectToAction("Index", "Home");
            }
        }
        public ActionResult ErrorSite()
        {
            return View();
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


        /***simple login */


        [HttpPost]
        public ActionResult Login(LoginModel model)
        {
            LoginDAL log = new LoginDAL();
            log.Username = model.Username;
            log.Password = model.Password;
            var ip = LocalIPAddress();
            var BranchIP = GetbranchIP();

            if (ModelState.IsValid)
            {
                log.Username = model.Username;
                log.Password = model.Password;
                log.ClinicType = model.ClinicType;
                if (log.checkLeaveApplicationVacation(ip))
                {
                    if (log.simpleLogin(ip))
                    {

                        log.ClinicDeptID = log.ClinicType != "0" ? log.DepartmentID : "0";
                        SetUpClinicCookie(log.ClinicType, log.ClinicDeptID);
                        SetUpLoginLog();
                        SetupFormsAuthTicket(log.EmployeeID, model.Username.ToString(), log.Employee, log.DivisionID, log.DepartmentID);
                        TempData["ErrorMessage"] = "";
                        //check if user already in the user_auth table

                        log.saveuserinUserAuthTable();

                        /*
                         TO CHANGE THE DAYS FOR PASSWORD
                         * [ITADMIN].[CheckUserPasswordExpiryDate] 
                         * [ITADMIN].[CheckUserPasswordDaysRemaining]
                         * 
                         */
                        if (log.Password != null)
                        {

                            if (log.IsUserPassword90DaysExpired() || log.Password.Contains("EXPIRED"))
                            {
                                //90 days expire must change pass
                                //return RedirectToAction("ChangePassword", "Home");
                                Response.Cookies.Add(new HttpCookie("IsUserPassword90DaysExpired", "1"));
                            }
                        }
                        Response.Cookies.Add(new HttpCookie("lock", "0"));
                        return RedirectToAction("Index", "Home");
                    }
                    TempData["ErrorMessage"] = "Please check your Employee ID,Password!";
                    TempData["sUsername"] = model.Username;

                }
                else
                {
                    TempData["ErrorMessage"] = "Employee is currently on leave!";
                    TempData["sUsername"] = model.Username;
                }

            }
            Response.Cookies.Add(new HttpCookie("lock", "0"));
            return RedirectToAction("Index");
        }

     /*   [HttpPost] //not use 
        public ActionResult LoginWithIP(LoginModel model)
        {
            LoginDAL log = new LoginDAL();
            log.Username = model.Username;
            log.Password = model.Password;
            var ip = LocalIPAddress();
            var BranchIP = GetbranchIP();

            if (ModelState.IsValid)
            {
                log.Username = model.Username;
                log.Password = model.Password;
                log.ClinicType = model.ClinicType;

                if (log.CheckEmployeeIsLocked())
                {
                    TempData["ErrorMessage"] = "User Locked! Please contact your IT Administrator";
                    TempData["sUsername"] = model.Username;
                    return RedirectToAction("Index");

                }
                else
                {

                    if (log.checkEmployeeID(ip))
                    {
                        if (log.checkLeaveApplicationVacation(ip))
                        {
                            if (log.IsUserPassword90DaysExpired())
                            {
                                //90 days expire must change pass
                                TempData["ErrorMessage"] = "Password exceed in 90 Days. Please change your password or contact IT.";
                                TempData["sUsername"] = model.Username;
                                //return RedirectToAction("Index");
                            }

                            if (log.checkDepartment(ip, BranchIP))
                            {
                                if (log.checkPassword(ip))
                                {

                                    log.ClinicDeptID = log.ClinicType != "0" ? log.DepartmentID : "0";
                                    SetUpClinicCookie(log.ClinicType, log.ClinicDeptID);
                                    SetUpLoginLog();
                                    SetupFormsAuthTicket(log.EmployeeID, model.Username.ToString(), log.Employee, log.DivisionID, log.DepartmentID);
                                    TempData["ErrorMessage"] = "";
                                    //check if user already in the user_auth table

                                    log.saveuserinUserAuthTable();

                                
                                    if (log.Password != null)
                                    {
                                        if (log.Password.Contains("EXPIRED"))
                                        {
                                            //90 days expire must change pass
                                            return RedirectToAction("ChangePassword", "Home");
                                        }
                                    }
                                    return RedirectToAction("Index", "Home");
                                }
                                else
                                {
                                    TempData["ErrorMessage"] = "Please check your Password!";
                                    TempData["sUsername"] = model.Username;
                                }
                            }
                            else
                            {
                                TempData["ErrorMessage"] = "Please check your IP Address and Department!";
                                TempData["sUsername"] = model.Username;
                            }

                        }
                        else
                        {
                            TempData["ErrorMessage"] = "Employee is currently on leave!";
                            TempData["sUsername"] = model.Username;
                        }
                    }
                    else
                    {
                        TempData["ErrorMessage"] = "Please check your Employee ID!";
                        TempData["sUsername"] = model.Username;
                    }
                }


            }
            var loginAttempts = 1;
            if (Request.Cookies["LoginAttempt"] != null)
            {
                loginAttempts = Request.Cookies["LoginAttempt"].Value.ToInt();
                var loginAttempts_UserID = Request.Cookies["LoginAttempt_UserId"].Value.ToString();
                if (log.Username.ToString() == loginAttempts_UserID)
                {
                    if (loginAttempts >= 3)
                    {
                        //locked the account
                        log.locktheEmployee(ip);
                        Response.Cookies.Add(new HttpCookie("LoginAttempt", "0"));
                        TempData["ErrorMessage"] = "User Locked! Please contact your IT Administrator";
                        TempData["sUsername"] = model.Username;
                        return RedirectToAction("Index");

                    }
                    loginAttempts = loginAttempts + 1;
                    Response.Cookies.Add(new HttpCookie("LoginAttempt", loginAttempts.ToString()));
                }
                else
                {
                    Response.Cookies.Add(new HttpCookie("LoginAttempt", "1"));
                    Response.Cookies.Add(new HttpCookie("LoginAttempt_UserId", log.Username.ToString()));

                }


            }
            else
            {
                Response.Cookies.Add(new HttpCookie("LoginAttempt", loginAttempts.ToString()));
                Response.Cookies.Add(new HttpCookie("LoginAttempt_UserId", log.Username.ToString()));
            }
            return RedirectToAction("Index");
        }*/



        public string GetbranchIP()
        {

            ActionExecutingContext filterContext = new ActionExecutingContext();
            base.OnActionExecuting(filterContext);
            Debug.Print("Host: " + Request.Url.Host);
            Console.WriteLine("Host: " + Request.Url.Host);
            return Request.Url.Host;
        }

        public string LocalIPAddress()
        {
            string stringIpAddress;
            stringIpAddress = Request.ServerVariables["HTTP_X_FORWARDED_FOR"];

            if (stringIpAddress == null) //may be the HTTP_X_FORWARDED_FOR is null
            {
                stringIpAddress = Request.ServerVariables["REMOTE_ADDR"]; //we can use REMOTE_ADDR
            }
            else if (stringIpAddress == null)
            {
                stringIpAddress = GetLanIPAddress();
            }

            return stringIpAddress;
        }
        public string GetLanIPAddress()
        {
            //Get the Host Name
            string stringHostName = Dns.GetHostName();
            //Get The Ip Host Entry
            IPHostEntry ipHostEntries = Dns.GetHostEntry(stringHostName);
            //Get The Ip Address From The Ip Host Entry Address List
            System.Net.IPAddress[] arrIpAddress = ipHostEntries.AddressList;
            return arrIpAddress[arrIpAddress.Length - 1].ToString();
        }

        private void SetupFormsAuthTicket(string EmployeeID, string EmpID, string EmployeeName, string DivisionID, string DepartmentID)
        {
            var userData = EmployeeID.ToString(CultureInfo.InvariantCulture);
            var authTicket = new FormsAuthenticationTicket(1, //version
                                EmployeeName, // user name
                                DateTime.Now,             //creation
                                DateTime.Now.AddMinutes(7200), //Expiration 4620
                                false, //Persistent
                                EmployeeID + "|" + EmpID + "|" + EmployeeName + "|" + DivisionID + "|" + DepartmentID);

            var encTicket = FormsAuthentication.Encrypt(authTicket);
           
         //   Response.Cookies.Add(new HttpCookie(FormsAuthentication.FormsCookieName, encTicket));
 
            HttpCookie cookie = new HttpCookie(FormsAuthentication.FormsCookieName, encTicket);
            cookie.Expires = authTicket.Expiration;
            Response.Cookies.Add(cookie);

            Response.Cookies.Add(new HttpCookie("Copy of FormsAuthentication.FormsCookieName ", encTicket));
            Response.Cookies["Copy of FormsAuthentication.FormsCookieName "].Expires = DateTime.Now.AddMinutes(4620);
            Response.Cookies.Add(new HttpCookie("ELOG_PAR1", EmployeeID));
            Response.Cookies.Add(new HttpCookie("ELOG_PAR2", LocalIPAddress()));
            Response.Cookies.Add(new HttpCookie("ELOG_PAR3", DivisionID));
            Response.Cookies.Add(new HttpCookie("Logged_LockScreen", "1234567890"));


            CustomPrincipalSerializedModel serializeModel = new CustomPrincipalSerializedModel();
            serializeModel.Id = int.Parse(EmployeeID);
            serializeModel.FullName = EmployeeName;
            serializeModel.Department = DepartmentID;
            serializeModel.Email = "";
            serializeModel.UserRole = (int)1;
            serializeModel.UserRoleDesc = "test";
            serializeModel.IpAddress = LocalIPAddress();

            JavaScriptSerializer serializer = new JavaScriptSerializer();
            string userData2 = serializer.Serialize(serializeModel);
            var cryptor = new EncryptDecrypt();
            var encryptedEmployee = cryptor.Encrypt(userData2, true);
            Response.Cookies.Add(new HttpCookie("__sghis", encryptedEmployee));

 


        }

        private void SetUpLoginLog()
        {
            var IP = LocalIPAddress();
            Response.Cookies.Add(new HttpCookie("IPAddress", IP));
        }
        private void SetUpClinicCookie(string ClinicType, string ClinicTypeDepartmentID)
        {

            Response.Cookies.Add(new HttpCookie("ClinicType", ClinicType));
            Response.Cookies.Add(new HttpCookie("ClinicDeptID", ClinicTypeDepartmentID));
        }

    }
}
