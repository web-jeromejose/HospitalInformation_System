using HIS.Controllers;
using HIS_OT.Areas.OTForms.Models;
using HIS_OT.Areas.OTForms.Models.DataTable;
using OTEf.Core.Enum;
using OTEf.Core.Interface;
using OTEf.Core.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HIS_OT.Areas.OTForms.Controllers
{
    public class ConsciousSedationController:BaseController
    {
          private IOperationBusiness operationBusiness;
          private IMasterFileBusiness masterFileBusiness;
          public ConsciousSedationController(IOperationBusiness business, IMasterFileBusiness masterfilebusiness)
         {
            operationBusiness = business;
            masterFileBusiness = masterfilebusiness;
         }

          public ActionResult Index()
          {
              return View();
          }
          public ActionResult Detail(int id) {
              var sedation = operationBusiness.GetConsciousSedationRecord(id);
              
              if(sedation == null)
                  return RedirectToAction("");
              else
              return View(sedation);
          }
          
          public ActionResult Create()
          {
              ViewBag.AgeTypes = Select2Helper.GetListData(Select2Repository.AllAgeType());
              ViewBag.Sexes = Select2Helper.GetListData(Select2Repository.AllSex());
              var model = new ConsciousSedationRecord()
              {
                  PreSedation = new PreSedation() { SedationType = (int)SedationType.ELECTIVE},
                  SedationMonitoring = new SedationMonitoring(),
                  SedationRoomRecord = new SedationRecoveryRoomRecord(),

              };

              return View(model);
          }

          public ActionResult Update(int id)
          {
              ViewBag.AgeTypes = Select2Helper.GetListData(Select2Repository.AllAgeType());
              ViewBag.Sexes = Select2Helper.GetListData(Select2Repository.AllSex());
              
              var sedation = operationBusiness.GetConsciousSedationRecord(id);

              if (sedation == null)
                  return RedirectToAction("");
              else
                  return View(sedation);

          }

          public ActionResult Delete(int id) {

              var sedation = operationBusiness.GetConsciousSedationRecord(id);

              sedation.ModifiedByName = base.OperatorName;
              sedation.ModifiedAt = DateTime.Now;
              sedation.ModifiedById = base.OperatorId;

              operationBusiness.DeleteConsciousSedationRecord(sedation);

              return RedirectToAction("");
          }

          [HttpPost]
          public ActionResult CreatePresedation(ConsciousSedationRecord model)
          {
              model.CreatedByName = base.OperatorName;
              model.CreatedAt = DateTime.Now;
              model.CreatedById = base.OperatorId;

              model.PreSedation.CreatedByName = base.OperatorName;
              model.PreSedation.CreatedAt = DateTime.Now;
              model.PreSedation.CreatedById = base.OperatorId;
              
              model.PreSedation.ProposedProcedure.Select(i =>  {
                  i.CreatedByName = base.OperatorName; ;
                  i.CreatedById = base.OperatorId;
                  i.CreatedAt = DateTime.Now;
                    return i;
              }).ToList();


              if (model.Id == 0)
              {
                  operationBusiness.AddConsciousSedationRecord(model);
              }
              else
              {

                  var existingConsciousSedation = operationBusiness.GetConsciousSedationRecord(model.Id);
                  
                  existingConsciousSedation.ModifiedByName = base.OperatorName;
                  existingConsciousSedation.ModifiedAt = DateTime.Now;
                  existingConsciousSedation.ModifiedById = base.OperatorId;

                  existingConsciousSedation.PreSedation = model.PreSedation;

                  operationBusiness.UpdateConsciousSedationRecord(existingConsciousSedation);
                  
              }

              return Json(new { id = model.Id },JsonRequestBehavior.AllowGet);
          }

          [HttpPost]
          public ActionResult UpdatePresedation(ConsciousSedationRecord model)
          {


             var sedation = operationBusiness.GetConsciousSedationRecord(model.Id);

             sedation.ModifiedByName                        = base.OperatorName;
             sedation.ModifiedAt                            = DateTime.Now;
             sedation.ModifiedById                          = base.OperatorId;
             sedation.PreSedation.ModifiedByName            = base.OperatorName;
             sedation.PreSedation.ModifiedAt                = DateTime.Now;
             sedation.PreSedation.ModifiedById              = base.OperatorId;
             sedation.PreSedation.StationId                 = model.PreSedation.StationId;
             sedation.PreSedation.HR                        = model.PreSedation.HR;
             sedation.PreSedation.RR                        = model.PreSedation.RR;
             sedation.PreSedation.SedationType              = model.PreSedation.SedationType;
             sedation.PreSedation.ConsultantId              = model.PreSedation.ConsultantId;
             sedation.PreSedation.PhysicianId               = model.PreSedation.PhysicianId;
             sedation.PreSedation.CigarettesPerDay          = model.PreSedation.CigarettesPerDay;
             sedation.PreSedation.LiquorIntakePerML         = model.PreSedation.LiquorIntakePerML;
             sedation.PreSedation.Weight                    = model.PreSedation.Weight;
             sedation.PreSedation.Temperature               = model.PreSedation.Temperature;
             sedation.PreSedation.BP                        = model.PreSedation.BP;
             sedation.PreSedation.StationName               = model.PreSedation.StationName;
             sedation.PreSedation.ConsultantName            = model.PreSedation.ConsultantName;
             sedation.PreSedation.PreProcedureDiagnosis     = model.PreSedation.PreProcedureDiagnosis;
             sedation.PreSedation.ClinicalHistory           = model.PreSedation.ClinicalHistory;
             sedation.PreSedation.PrevMedicalHistory        = model.PreSedation.PrevMedicalHistory;
             sedation.PreSedation.CurrentMedicationTherapy  = model.PreSedation.CurrentMedicationTherapy;
             sedation.PreSedation.Investigations            = model.PreSedation.Investigations;
             sedation.PreSedation.PlanCare                  = model.PreSedation.PlanCare;
             sedation.PreSedation.IVLines                   = model.PreSedation.IVLines;
             sedation.PreSedation.OtherPreSedateData        = model.PreSedation.OtherPreSedateData;
             sedation.PreSedation.PhysicianName             = model.PreSedation.PhysicianName;
             sedation.PreSedation.Allergies                 = model.PreSedation.Allergies;
             sedation.PreSedation.PhysicalExam              = model.PreSedation.PhysicalExam;
             sedation.PreSedation.CVS                       = model.PreSedation.CVS;
             sedation.PreSedation.RS                        = model.PreSedation.RS;
             sedation.PreSedation.CNS                       = model.PreSedation.CNS;
             sedation.PreSedation.MonitorNIBP               = model.PreSedation.MonitorNIBP;
             sedation.PreSedation.MonitorECG                = model.PreSedation.MonitorECG;
             sedation.PreSedation.MonitorPulseOxymetry      = model.PreSedation.MonitorPulseOxymetry;
             sedation.PreSedation.MonitorRespiratoryRate    = model.PreSedation.MonitorRespiratoryRate;
             sedation.PreSedation.MonitorTemperature        = model.PreSedation.MonitorTemperature;
             sedation.PreSedation.MonitorETC02              = model.PreSedation.MonitorETC02;
             sedation.PreSedation.HasAllergies              = model.PreSedation.HasAllergies;
             sedation.PreSedation.IsAlcoholic               = model.PreSedation.IsAlcoholic;
             sedation.PreSedation.IsSmoker                  = model.PreSedation.IsSmoker;

                 //update existing
                 sedation.PreSedation.ProposedProcedure.Select(i =>
                  {
                      if (!model.PreSedation.ProposedProcedure.Any(a => a.TestId == i.TestId))
                      {
                          i.ModifiedByName = base.OperatorName; ;
                          i.ModifiedById = base.OperatorId;
                          i.ModifiedAt = DateTime.Now;
                          i.Active = false;
                      }
                      return i;
                  }).ToList();

                  //add new
                 foreach (var item in model.PreSedation.ProposedProcedure)
                 {
                     if (!sedation.PreSedation.ProposedProcedure.Any(i => i.TestId == item.TestId))
                     {
                         item.CreatedByName = base.OperatorName; ;
                         item.CreatedById = base.OperatorId;
                         item.CreatedAt = DateTime.Now;
                         sedation.PreSedation.ProposedProcedure.Add(item);
                     }
                 }


                  operationBusiness.UpdateConsciousSedationRecord(sedation);


              return Json(new { id = model.Id }, JsonRequestBehavior.AllowGet);
          }


          [HttpPost]
          public JsonResult GetConsciousSedationList(AjaxDataTableModel model)
          {

              int filteredResultsCount;
              int totalResultsCount;

              var res = this.SearchConsciousSedationRecord(model, out filteredResultsCount, out totalResultsCount);

              var data = res.AsQueryable().Select(m => new
              {
                  Id = m.Id,
                  PatientName = m.PatientName,
                  PIN = m.PIN,
                  CreatedAt = m.CreatedAt.ToString("MM/dd/yyyy"),
                  ModifiedAt = m.ModifiedAt.HasValue? m.ModifiedAt.Value.ToString("MM/dd/yyyy"): ""
              }).ToList();

              return Json(new
              {

                  draw = model.draw,
                  recordsTotal = totalResultsCount,
                  recordsFiltered = filteredResultsCount,
                  data = data

              }, JsonRequestBehavior.AllowGet);

          }
          private List<ConsciousSedationRecord> SearchConsciousSedationRecord(AjaxDataTableModel model, out int filteredResultsCount, out int totalResultsCount)
          {

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

              var result =  operationBusiness.GetPagedConsciousSedationRecord(searchBy, take, skip, sortBy, sortDir, out filteredResultsCount, out totalResultsCount);

              if (result == null)
              {
                  return new List<ConsciousSedationRecord>();
              }

              return result;

          }
    }
}