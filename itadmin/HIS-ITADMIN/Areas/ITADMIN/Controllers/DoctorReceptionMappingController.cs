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
    public class DoctorReceptionMappingController : BaseController
    {
        //
        // GET: /ITADMIN/DoctorReceptionMapping/
        DocSpecMapModel bs = new DocSpecMapModel();

        [IsSGHFeatureAuthorized(mFeatureID = "1995")]
        public ActionResult Index()
        {
            return View();
        }




        public ActionResult SelectedListItem(int Id)
        {
            DocRecepMappingModel model = new DocRecepMappingModel();
            List<SelectedReceptionist> list = model.SelectedReceptionistView(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<SelectedReceptionist>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult ReceptionistListDashBoard()
        {
            DocRecepMappingModel model = new DocRecepMappingModel();
            List<ReceptionistDashBoard> list = model.ReceptionistDashBoard();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ReceptionistDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }

        //public JsonResult DoctorList(string id)
        //{
        //    List<DoctorListItem> list = bs.DoctorListDal(id);
        //    return Json(list, JsonRequestBehavior.AllowGet);
        //}


        public ActionResult DoctorList(string searchTerm, int pageSize, int pageNum)
        {
            Select2DoctorListRepository list = new Select2DoctorListRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(DoctorRecepHeaderSave entry)
        {
            DocRecepMappingModel model = new DocRecepMappingModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);

            //log  
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("DocRecepMappingModel", "DoctorReceptionMappingController", "0", "0", this.OperatorId, " ", this.LocalIPAddress());


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

    }


}
