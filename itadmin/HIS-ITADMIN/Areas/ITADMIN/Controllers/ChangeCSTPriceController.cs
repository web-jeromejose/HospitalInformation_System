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
    public class ChangeCSTPriceController : BaseController
    {
        //
        // GET: /ITADMIN/ChangeCSTPrice/
        ChangeCSTModel bs = new ChangeCSTModel();

        [IsSGHFeatureAuthorized(mFeatureID = "1583")]
        public ActionResult Index()
        {
            return View();
        }
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(ChangeCSTSaveModel entry)
        {
            ChangeCSTModel model = new ChangeCSTModel();
            //entry.OperatorID = this.OperatorId;
            bool status = model.Save(entry);
           

            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "ChangeCSTPriceController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());




            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

        public JsonResult Select2ItemList(string id)
        {
            List<ListItemModel> list = bs.Select2ItemList(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetChangeCSTView(int Id)
        {
            ChangeCSTModel model = new ChangeCSTModel();
            List<ListItemView> list = model.GetListItemView(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ListItemView>() }),
                ContentType = "application/json"
            };
            return result;

        }


        /**********************change price in ipid ***********************************************************************/
        [IsSGHFeatureAuthorized(mFeatureID = "2572")]
        public ActionResult ChangeCstPricePerPin()
        {
            return View();
        }
        // [ITADMIN].[CST_CheckZeroPrice]

        public JsonResult Select2InPatientList(string pin)
        {
            List<ListItemModel> list = bs.Select2InPatientList(pin);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetZeroPriceList(int ipid)
        {
            ChangeCSTModel model = new ChangeCSTModel();
            List<GetZeroPriceListVM> list = model.GetZeroPriceList(ipid);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<GetZeroPriceListVM>() }),
                ContentType = "application/json"
            };
            return result;

        }
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult ZeroPriceSave(ZeroPriceSaveVM entry)
        {
            ChangeCSTModel model = new ChangeCSTModel();
            entry.OperatorID = this.OperatorId;
            bool status = model.ZeroPriceSave(entry);

            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "ChangeCSTPriceController-ZeroPriceSave", "0", "0", this.OperatorId, log_details);


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }
        /**********************change price in ipid ***********************************************************************/
    

    }
}
