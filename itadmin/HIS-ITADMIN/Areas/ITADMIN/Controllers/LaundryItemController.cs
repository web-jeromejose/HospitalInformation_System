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
    public class LaundryItemController : BaseController
    {
        //
        // GET: /ITADMIN/LaundryItem/
        LaundryItemModel bs = new LaundryItemModel();
        public ActionResult Index()
        {
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(LaundryItemSave entry)
        {
            LaundryItemModel model = new LaundryItemModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
           
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "LaundryItemController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

        public ActionResult LaundryItemDashBoard()
        {
            LaundryItemModel model = new LaundryItemModel();
            List<LaundryItemDashBoard> list = model.LaundryItemDashBoard();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<LaundryItemDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult FetchLaundryItem(int Id)
        {
            LaundryItemModel model = new LaundryItemModel();
            List<LaundryItemView> list = model.LaundryItemView(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<LaundryItemView>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public JsonResult Select2Dept(string id)
        {
            List<ListDepartment> list = bs.Select2Department(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

    }
}
