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

namespace HIS_ITADMIN.Areas.ITADMIN.Controllers
{
    public class SubStoreController : BaseController
    {
        //
        // GET: /ITADMIN/SubStore/



        SubStoreModel bs = new SubStoreModel();

        [IsSGHFeatureAuthorized(mFeatureID = "575")]
        public ActionResult Index()
        {
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(HoldingSubStoreHeaderModel entry)
        {
            SubStoreModel model = new SubStoreModel();
           // entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }


        public JsonResult HoldingList(string id)
        {
            List<ListHoldingStore> list = bs.HoldingListDAL(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public ActionResult View(int Id)
        {
            SubStoreModel model = new SubStoreModel();
            List<SubStoreList> list = model.SubStoreList(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<SubStoreList>() }),
                ContentType = "application/json"
            };
            return result;


        }

    }



}
