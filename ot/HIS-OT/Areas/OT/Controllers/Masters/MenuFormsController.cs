using System;
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

using Microsoft.Reporting.WebForms;
using System.Security.Permissions;
using System.Security;



namespace HIS_OT.Areas.OT.Controllers.Masters
{
    public class MenuFormsController : BaseController
    {
        //
        // GET: /OT/MenuForms/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult MasterFile()
        {
            return View();
        }



    }
}
