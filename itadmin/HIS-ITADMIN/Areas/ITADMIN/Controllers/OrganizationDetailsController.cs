using System;
using System.Collections.Generic;
using DataLayer;
using DataLayer.ITAdmin.Model;
using HIS.Controllers;
using HIS_ITADMIN.Areas.ITADMIN.Models;
using Microsoft.Reporting.WebForms;
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
    public class OrganizationDetailsController : BaseController
    {
        //
        // GET: /ITADMIN/OrganizationDetails/
        OrganisationModel bs = new OrganisationModel();
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult FetchOrganisationDetails(int Id)
        {
            OrganisationModel model = new OrganisationModel();
            List<OrganisationViewModel> list = model.OrganisationViewModel(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<OrganisationViewModel>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public JsonResult CompanyList(string id)
        {
            List<CompanyList> list = bs.CompanyListDal(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public JsonResult CurrencyList(string id)
        {
            List<CurrencyList> list = bs.CurrencyListDal(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }


        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(OrganisationSave entry)
        {
            OrganisationModel model = new OrganisationModel();
           entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);

           
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "OrganizationDetailsController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }
    }
}
