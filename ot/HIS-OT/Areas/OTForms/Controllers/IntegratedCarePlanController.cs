using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using HIS.Controllers;
using HIS_OT.Areas.OTForms.Models;
using HIS_OT.Areas.OTForms.Models.DataTable;

using OTEf.Core.Interface;
using OTEf.Core.Model;

namespace HIS_OT.Areas.OTForms.Controllers
{
    public class IntegratedCarePlanController : BaseController
    {
        //
        // GET: /OTForms/IntegratedCarePlan/

        private IOperationBusiness operationBusiness;
        private IMasterFileBusiness masterFileBusiness;
        public IntegratedCarePlanController(IOperationBusiness business, IMasterFileBusiness masterfilebusiness)
        {
            operationBusiness = business;
            masterFileBusiness = masterfilebusiness;
        }


        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult GetIntegratedCarePlan(AjaxDataTableModel model)
        {

            int filteredResultsCount;
            int totalResultsCount;

            var res = this.SearchIntegratedCarePlan(model, out filteredResultsCount, out totalResultsCount);

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

        private List<IntegratedCarePlan> SearchIntegratedCarePlan(AjaxDataTableModel model, out int filteredResultsCount, out int totalResultsCount)
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
                    sortBy = "No";
                }
                else
                {
                    sortBy = model.columns[model.order[0].column].data;
                }

                sortDir = model.order[0].dir.ToLower() == "asc";
            }

            var result = operationBusiness.GetPagedIntegratedCarePlan(searchBy, take, skip, sortBy, sortDir, out filteredResultsCount, out totalResultsCount);

            if (result == null)
            {
                return new List<IntegratedCarePlan>();
            }

            return result;
        }


        //
        // GET: /OTForms/IntegratedCarePlan/Details/5

        public ActionResult Details(int id)
        {
            return View();
        }

        //
        // GET: /OTForms/IntegratedCarePlan/Create

        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /OTForms/IntegratedCarePlan/Create

        [HttpPost]
        public ActionResult Create(IntegratedCarePlan collection)
        {
             
                return View(collection);
             
        }

        //
        // GET: /OTForms/IntegratedCarePlan/Edit/5

        public ActionResult Edit(int id)
        {
            return View();
        }

        //
        // POST: /OTForms/IntegratedCarePlan/Edit/5

        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //
        // GET: /OTForms/IntegratedCarePlan/Delete/5

        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /OTForms/IntegratedCarePlan/Delete/5

        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
    }
}
