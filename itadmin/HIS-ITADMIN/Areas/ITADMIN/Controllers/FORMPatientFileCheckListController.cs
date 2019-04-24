using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataLayer;
using HIS.Controllers;
using HIS_ITADMIN.Areas.ITADMIN.Models;
using System.Web.Script.Serialization;
using System.Data;
using System.Data.SqlClient;
using DataLayer.Data.ITAdmin;

namespace HIS_ITADMIN.Areas.ITADMIN.Controllers
{
    public class FORMPatientFileCheckListController : Controller
    {
        //
        // GET: /ITADMIN/FORMPatientFileCheckList/

        public ActionResult Index()
        {
            return View();
        }


        //public ActionResult GetFormList()
        //{
        //    FRMPatientFileCheckListModel model = new FRMPatientFileCheckListModel();
        //    List<FRMPatientFileCheckList> list = model.FileCheckListGetAll();
        //    var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
        //    var result = new ContentResult
        //    {
        //        Content = serializer.Serialize(new { list = list ?? new List<FRMPatientFileCheckList>() }),
        //        ContentType = "application/json"
        //    };
        //    return result;

        //}

    }
}
