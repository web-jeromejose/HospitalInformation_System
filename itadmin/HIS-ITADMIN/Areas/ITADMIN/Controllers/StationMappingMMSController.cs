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
    public class StationMappingMMSController : BaseController
    {
        //
        // GET: /ITADMIN/StationMappingMMS/

        //same as   //
        // JUST GO TO : /ITADMIN/InvMax/


        public ActionResult Index()
        {
            return View();
        }

    }
}
