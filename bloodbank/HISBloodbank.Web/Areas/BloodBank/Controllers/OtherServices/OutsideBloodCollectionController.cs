using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

using DataLayer;
using HIS_BloodBank.Areas.BloodBank.Models;
using HIS_BloodBank.Areas.BloodBank.Controllers;
using HIS_BloodBank.Models;
using HIS_BloodBank.Controllers;

namespace HIS_BloodBank.Areas.BloodBank.Controllers
{
    public class OutsideBloodCollectionController : BaseController
    {
        //
        // GET: /BloodBank/OutsideBloodCollection/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ShowList(int Id, int RowsPerPage, int GetPage)
        {
            OutsideBloodCollectionModel model = new OutsideBloodCollectionModel();
            List<OutsideBagsCollection> list = model.List(RowsPerPage, GetPage);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<OutsideBagsCollection>() }),
                ContentType = "application/json"
            };
            return result;
        }
        public ActionResult ShowSelected(int Id)
        {
            OutsideBloodCollectionModel model = new OutsideBloodCollectionModel();
            List<OutsideBagsCollection> list = model.Selected(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<OutsideBagsCollection>() }),
                ContentType = "application/json"
            };
            return result;
        }

        [HttpPost]
        public ActionResult Save1(Screen entry)        
        {
            OutsideBloodCollectionModel model = new OutsideBloodCollectionModel();
            entry.OperatorID = this.OperatorId;
            entry.StationID = this.StationId;
            bool status = model.Save(entry);
            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });            
        }

        public ActionResult FindPatientDetails(string registrationno)
        {
            int reg = 0;
            if (registrationno.IndexOf('.') > 0)
            {
                string[] ar = registrationno.Split('.');
                reg = int.Parse(ar[1]);
            }
            else
            {
                reg = int.Parse(registrationno);
            }            

            OutsideBloodCollectionModel model = new OutsideBloodCollectionModel();
            List<OutsideBloodCollectionFind> list = model.FindPatientDetails(reg);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<OutsideBloodCollectionFind>() }),
                ContentType = "application/json"
            };
            return result;
        }
        public ActionResult GetSubcenterIssuesByHosp(int Hospitalid)
        {
            OutsideBloodCollectionModel model = new OutsideBloodCollectionModel();
            List<GetSubcenterIssuesByHospList> list = model.GetSubcenterIssuesByHosp(Hospitalid);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<GetSubcenterIssuesByHospList>() }),
                ContentType = "application/json"
            };
            return result;
        }
        

        #region select2

        public ActionResult Select2OutsideBloodCollectionBloodGroup(string searchTerm, int pageSize, int pageNum)
        {
            Select2OutsideBloodCollectionBloodGroupRepository list = new Select2OutsideBloodCollectionBloodGroupRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2OutsideBloodCollectionBloodGroupE(string searchTerm, int pageSize, int pageNum, int componentid, int bloodgroopid)
        {
            Select2OutsideBloodCollectionBloodGroupERepository list = new Select2OutsideBloodCollectionBloodGroupERepository();
            list.Fetch(componentid, bloodgroopid);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2OutsideBloodCollectionIssueHospital(string searchTerm, int pageSize, int pageNum)
        {
            Select2OutsideBloodCollectionIssueHospitalRepository list = new Select2OutsideBloodCollectionIssueHospitalRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2GetComponentByType(string searchTerm, int pageSize, int pageNum, int Id)
        {
            Select2GetComponentByTypeRepository list = new Select2GetComponentByTypeRepository();
            list.Fetch(Id);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2BBBagQty(string searchTerm, int pageSize, int pageNum)
        {
            Select2BBBagQtyRepository list = new Select2BBBagQtyRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }        

        #endregion


    }


}
