using HIS.Controllers;
using HIS_OT.Areas.OTForms.Models;
using HIS_OT.Areas.OTForms.Models.DataTable;

using OTEf.Core.Interface;
using OTEf.Core.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
namespace HIS_OT.Areas.OTForms.Controllers
{
    public class TimeOutFormController : BaseController
    {
        //
        // GET: /OTForms/TimeOutForm/
        private IOperationBusiness operationBusiness;
        private IMasterFileBusiness masterFileBusiness;
        public TimeOutFormController(IOperationBusiness business, IMasterFileBusiness masterfilebusiness)
        {
            operationBusiness = business;
            masterFileBusiness = masterfilebusiness;
        }


        public ActionResult Index()
        {
            return View(new TimeoutForm());
        }
        private List<TimeoutForm> SearchTimeoutFormRecord(AjaxDataTableModel model, out int filteredResultsCount, out int totalResultsCount)
        {

            var searchBy = (model.search != null) ? model.search.value : null;
            var take = model.length;
            var skip = model.start;

            string sortBy = "";
            bool sortDir = true;
            if (model.order != null)
            {
                if (model.order[0].column == 2)
                {
                    sortBy = "RegistrationNo";
                }
                else
                {
                    sortBy = model.columns[model.order[0].column].data;
                }

                sortDir = model.order[0].dir.ToLower() == "asc";
            }

            var result = operationBusiness.GetPagedTimeoutForm(searchBy, take, skip, sortBy, sortDir, out filteredResultsCount, out totalResultsCount);

            if (result == null)
            {
                return new List<TimeoutForm>();
            }

            return result;
        }

        [HttpPost]
        public JsonResult GetTimeoutForm(AjaxDataTableModel model)
        {

            int filteredResultsCount;
            int totalResultsCount;

            var res = this.SearchTimeoutFormRecord(model, out filteredResultsCount, out totalResultsCount);

            var data = res.AsQueryable().Select(m => new
            {
                Id = m.Id,
                PatientName = m.PatientName,
                PIN = m.PIN,
                //MedicalReportDate = m.MedicalReportDate.ToString("MMM/dd/yyyy"),
               // Complaints = m.Complaints,
            }).ToList();

            return Json(new
            {

                draw = model.draw,
                recordsTotal = totalResultsCount,
                recordsFiltered = filteredResultsCount,
                data = data

            }, JsonRequestBehavior.AllowGet);

        }

        public ActionResult Detail(int? Id)
        {

            if (Id == null)
                return RedirectToAction("");

            var screeningmodel = operationBusiness.GetTimeoutForm(Id.Value);
            return View(screeningmodel);
        }

        public ActionResult Create()
        {


            var model = new TimeoutForm()
            {
                //MedicalReportDate = DateTime.Now
            };

            return View(model);
        }

        [HttpPost]
        public ActionResult Create(TimeoutForm sheet)
        {

            sheet.CreatedAt = DateTime.Now;
            sheet.CreatedById = base.OperatorId;
            sheet.CreatedByName = base.OperatorName;

            int id = operationBusiness.AddTimeoutForm(sheet);

            return Json(new { id = id }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Update(int? Id)
        {
            if (Id == null)
                return RedirectToAction("");

            var model = operationBusiness.GetTimeoutForm(Id.Value);
            return View(model);
        }

        [HttpPost]
        public ActionResult Update(TimeoutForm checklist)
        {
            checklist.ModifiedAt = DateTime.Now;
            checklist.ModifiedByName = base.OperatorName;
            checklist.ModifiedById = base.OperatorId;

            return Json(new { result = operationBusiness.UpdateTimeoutForm(checklist) }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Delete(int Id)
        {
            var data = new TimeoutForm()
            {
                Id = Id,
                ModifiedAt = DateTime.Now,
                ModifiedByName = base.OperatorName,
                ModifiedById = base.OperatorId
            };

            operationBusiness.DeleteTimeoutForm(data);

            return RedirectToAction("");
        }

    }
}
