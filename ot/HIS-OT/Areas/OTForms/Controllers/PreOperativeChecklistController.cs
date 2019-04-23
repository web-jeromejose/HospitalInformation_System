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
    public class PreOperativeChecklistController:BaseController
    {
          private IOperationBusiness operationBusiness;
          private IMasterFileBusiness masterFileBusiness;
          public PreOperativeChecklistController(IOperationBusiness business, IMasterFileBusiness masterfilebusiness)
         {
            operationBusiness = business;
            masterFileBusiness = masterfilebusiness;
         }

          public ActionResult Index()
          {

              return View(new PreOperativeChecklist());
          }


          [HttpPost]
          public JsonResult GetPreOperativeCheckList(AjaxDataTableModel model)
          {

              int filteredResultsCount;
              int totalResultsCount;

              var res = this.SearchPreOperativeChecklistRecord(model, out filteredResultsCount, out totalResultsCount);

              var data = res.AsQueryable().Select(m => new
              {
                  Id = m.Id,
                  PatientName = m.PatientName,
                  PIN = m.PIN,
                  ProcedureDate = m.ProcedureDate.ToString("MMM/dd/yyyy"),
                  ProcedureName = m.ProcedureName,
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

              var screeningmodel = operationBusiness.GetPreOperativeChecklist(Id.Value);
              return View(screeningmodel);
          }

          public ActionResult Create()
          {

              var defaultCharts = masterFileBusiness.GetPreOperativeCharts (new int[]{ 1, 2, 3, 4, 5, 6, 7 ,8, 9, 10, 11, 12});
              var defaultCheckItems = masterFileBusiness.GetPreOperativeCheck (new int[] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17 });
              var defaultMedications = masterFileBusiness.GetPreOperativeMedications(new int[] { 1, 2, 3, 4 });
         
              var chartEvaluation = new List<PreOpChartEvaluation>();
              var medications = new List<PreOperativeMedicationGiven>();
              var checkItems = new List<PreOperativeCheckPerformed>();

              foreach(var item in defaultCharts){
                  var obj = new PreOpChartEvaluation()
                  {
                      PreOperativeChartId = item.Id,
                      Chart = item
                  };
                  chartEvaluation.Add(obj);
              }

              foreach (var item in defaultMedications)
              {
                  var obj = new PreOperativeMedicationGiven()
                  {
                      PreOperativeMedicationId = item.Id,
                      Medication = item
                  };
                  medications.Add(obj);
              }

              foreach (var item in defaultCheckItems)
              {
                  var obj = new PreOperativeCheckPerformed()
                  {
                      PreOperativeCheckId = item.Id,
                      CheckItem = item
                  };
                  checkItems.Add(obj);
              }


               var model = new PreOperativeChecklist()
              {
                  ProcedureDate = DateTime.Now,
                  Medications = medications,
                  ChartEvaluations = chartEvaluation,
                  CheckedItems = checkItems
              };

              return View(model);
          }

          [HttpPost]
          public ActionResult Create(PreOperativeChecklist sheet)
          {

              sheet.CreatedAt = DateTime.Now;
              sheet.CreatedById = base.OperatorId;
              sheet.CreatedByName = base.OperatorName;

              int id = operationBusiness.AddPreOperativeChecklist(sheet);

              return Json(new { id = id }, JsonRequestBehavior.AllowGet);
          }

          public ActionResult Update(int ? Id)
          {
              if (Id == null)
                return  RedirectToAction("");

              var model = operationBusiness.GetPreOperativeChecklist(Id.Value);
              return View(model);
          }

          [HttpPost]
          public ActionResult Update(PreOperativeChecklist checklist)
          {
              checklist.ModifiedAt = DateTime.Now;
              checklist.ModifiedByName = base.OperatorName;
              checklist.ModifiedById = base.OperatorId;
             
              return Json(new { result = operationBusiness.UpdatePreOperativeChecklist(checklist)}, JsonRequestBehavior.AllowGet);
          }

          [HttpPost]
          public ActionResult Delete(int Id)
          {
              var data = new PreOperativeChecklist()
              {
                Id = Id,
                 ModifiedAt = DateTime.Now,
                 ModifiedByName = base.OperatorName,
                 ModifiedById = base.OperatorId
              };

              operationBusiness.DeletePreOperativeChecklist(data);

              return RedirectToAction("");
          }


          private List<PreOperativeChecklist> SearchPreOperativeChecklistRecord(AjaxDataTableModel model, out int filteredResultsCount, out int totalResultsCount)
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

              var result = operationBusiness.GetPagedPreOperativeChecklist(searchBy, take, skip, sortBy, sortDir, out filteredResultsCount, out totalResultsCount);

              if (result == null)
              {
                  return new List<PreOperativeChecklist>();
              }

              return result;
          }
    
    }
}