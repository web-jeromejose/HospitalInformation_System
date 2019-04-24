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
    public class DoctorSpecialisationMappingController : BaseController
    {
        //
        // GET: /ITADMIN/DoctorSpecialisationMapping/
        DocSpecMapModel bs = new DocSpecMapModel();
        public ActionResult Index()
        {
            return View();
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


        public ActionResult GeneralListDashBoard()
        {
            DocSpecMapModel model = new DocSpecMapModel();
            List<GeneralListDashBoard> list = model.GeneralListDashBoard();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<GeneralListDashBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult SelectedListItem(int Id)
        {
            DocSpecMapModel model = new DocSpecMapModel();
            List<SelectedList> list = model.SelectedListView(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<SelectedList>() }),
                ContentType = "application/json"
            };
            return result;

        }


        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(DoctorSpecMappingHeaderSave entry)
        {
            DocSpecMapModel model = new DocSpecMapModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);

            
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "DoctorSpecialisationMappingController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

    }
}
