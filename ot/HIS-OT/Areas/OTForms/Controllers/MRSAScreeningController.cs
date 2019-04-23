using HIS.Controllers;
using HIS_OT.Areas.OT.Models;
using HIS_OT.Areas.OTForms.Models;
using HIS_OT.Areas.OTForms.Models.DataTable;
using HIS_OT.Models;
using OTEf.Core.Interface;
using OTEf.Core.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HIS_OT.Areas.OTForms.Controllers
{
    public class MRSAScreeningController : BaseController
    {
         private IPatientBusiness patientBusiness;

         public MRSAScreeningController(IPatientBusiness business)
         {
            patientBusiness = business;
         }

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult GetScreeningList(AjaxDataTableModel model){

            int filteredResultsCount;
            int totalResultsCount;

            var res = this.SearchScreeningRecord(model, out filteredResultsCount, out totalResultsCount);

            var data = res.AsQueryable().Select(m => new
            {
                Id = m.Id,
                PatientName = m.PatientName,
                PIN = m.PIN,
                ScreeningDate = m.ScreeningDate.ToString("MM/dd/yyyy")
            }).ToList();

            return Json(new  {

                draw = model.draw,
                recordsTotal = totalResultsCount,
                recordsFiltered = filteredResultsCount,
                data = data
                
            },JsonRequestBehavior.AllowGet);

        }

        public ActionResult Detail(int Id = 0)
        {
            var screeningmodel = patientBusiness.GetMRSAScreening(Id);
            return View(screeningmodel);
        }

        public ActionResult Create()
        {
            ViewBag.Locations = Select2Helper.GetListData(Select2Repository.AllLocation());
        
            return View();
        }

        [HttpPost]
        public ActionResult Create(MRSAScreening screening)
        {
            ViewBag.Locations = Select2Helper.GetListData(Select2Repository.AllLocation());

            screening.CreatedByName = base.OperatorName;
            screening.CreatedById = base.OperatorId;
            int id = patientBusiness.AddMRSAScreening(screening);

            return RedirectToAction("Detail", new {id =id});
        }

        public ActionResult Update(int Id)
        {
            ViewBag.Locations = Select2Helper.GetListData(Select2Repository.AllLocation());
            var screeningdata = patientBusiness.GetMRSAScreening(Id);
            return View(screeningdata);
        }

        [HttpPost]
        public ActionResult Update(MRSAScreening screening)
        {
            screening.ModifiedAt = DateTime.Now;
            screening.ModifiedByName = base.OperatorName;
            screening.ModifiedById = base.OperatorId;
            patientBusiness.UpdateMRSAScreening(screening);

            return RedirectToAction("Detail", "MRSAScreening", new { Id = screening.Id });
        }

        [HttpPost]
        public ActionResult Delete(int Id)
        {
            var screeningdata = new MRSAScreening();
            screeningdata.Id = Id;
            screeningdata.ModifiedAt = DateTime.Now;
            screeningdata.ModifiedByName = base.OperatorName;
            screeningdata.ModifiedById = base.OperatorId;

            patientBusiness.DeleteMRSAScreening(screeningdata);

            return RedirectToAction("");
        }


        private List<MRSAScreening> SearchScreeningRecord(AjaxDataTableModel model, out int filteredResultsCount, out int totalResultsCount) {

            var searchBy = (model.search != null) ? model.search.value : null;
            var take = model.length;
            var skip = model.start;

            string sortBy = "";
            bool sortDir = true;
            if (model.order != null)
            {
                if (model.order[0].column == 0)
                {
                    sortBy = "RegistrationNo";
                }
                else
                {
                    sortBy = model.columns[model.order[0].column].data;
                }
                
                sortDir = model.order[0].dir.ToLower() == "asc";
            }

            var result = patientBusiness.GetPagedMRSAScreeningList(searchBy,take, skip,sortBy,sortDir, out filteredResultsCount, out totalResultsCount);

            if (result == null)
            {
                return new List<MRSAScreening>();
            }

            return result;
        
        }
    
    }
}
