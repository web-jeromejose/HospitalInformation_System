﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Data.SqlClient;
using System.Data;

using DataLayer;
using HIS_OT.Areas.OT.Models;
using HIS_OT.Controllers;
using HIS_OT.Models;
using HIS.Controllers;


namespace HIS_OT.Areas.OT.Controllers.File
{
    public class OTTrackingController : BaseController
    {
        //
        // GET: /OT/OTTracking/

        public ActionResult Index()
        {
            return View();
        }

    }
}
