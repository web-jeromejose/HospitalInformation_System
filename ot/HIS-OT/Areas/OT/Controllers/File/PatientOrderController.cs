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

namespace HIS_OT.Areas.OT.Controllers
{
    [Authorize]
    public class PatientOrderController : BaseController
    {
        //
        // GET: /OT/PatientOrder/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult PatientOrderList(int Id)
        {
            PatientOrderModel model = new PatientOrderModel();
            List<PatientOrderList> list = model.PatientOrderList(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<PatientOrderList>() }),
                ContentType = "application/json"
            };
            return result;

        }
       

    }
}
