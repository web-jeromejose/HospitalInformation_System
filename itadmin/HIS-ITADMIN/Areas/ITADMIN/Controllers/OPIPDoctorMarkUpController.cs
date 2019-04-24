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
    public class OPIPDoctorMarkUpController : BaseController
    {
        //
        // GET: /ITADMIN/OPIPDoctorMarkUp/
        [IsSGHFeatureAuthorized(mFeatureID = "551")]
        public ActionResult Index()
        {
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(IPOPMarkUpSave entry)
        {
            IpOpMarkUpModel model = new IpOpMarkUpModel();
            //entry.OperatorID = this.OperatorId;
            bool status = model.Save(entry);
            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

        public ActionResult IpOPMarkupDashBoard()
        {
            IpOpMarkUpModel model = new IpOpMarkUpModel();
            List<IpOpDMarkUpDashBoard> list = model.IpOpDMarkUpDashBoard();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<IpOpDMarkUpDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult Select2DoctorCode(string searchTerm, int pageSize, int pageNum)
        {
            Select2IPOPDoctorRespository list = new Select2IPOPDoctorRespository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult FetchOPIP(int DoctorId)
        {
            IpOpMarkUpModel model = new IpOpMarkUpModel();
            List<IPOPViewDetails> list = model.IPOPViewDetails(DoctorId);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<IPOPViewDetails>() }),
                ContentType = "application/json"
            };
            return result;

        }

    }
}
