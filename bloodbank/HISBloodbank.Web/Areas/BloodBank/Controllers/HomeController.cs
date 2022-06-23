﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

using DataLayer;
//using HIS_BloodBank.Areas.BloodBank.Models;
using HIS_BloodBank.Areas.BloodBank.Controllers;
//using HIS_BloodBank.Models;
//using HIS_BloodBank.Controllers;
using System.Web.Security;
using HIS_BloodBank.Controllers;

namespace HIS_BloodBank.Areas.BloodBank.Controllers
{
    public class HomeController : BaseController
    {
        //
        // GET: /Home/

        public ActionResult Index()
        {            
            return View();
        }



        public ActionResult LogOff()
        {
            this.IsSet = 0;
            FormsAuthentication.SignOut();
            return RedirectToAction("Index");
        }   

    }
}