using DataLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using HIS.Controllers;
using HIS_ITADMIN.Areas.ITADMIN.Models;
namespace HIS_ITADMIN.Areas.ITADMIN.Controllers
{
    public class FixingNightShiftTimeController : Controller
    {
        //
        // GET: /ITADMIN/FixingNightDutyTime/

        public ActionResult Index()
        {
            return View();
        }

    }
}
