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
    public class OTRoomCountController:BaseController
    {
          private IOperationBusiness operationBusiness;
          private IMasterFileBusiness masterFileBusiness;
          public OTRoomCountController(IOperationBusiness business, IMasterFileBusiness masterfilebusiness)
         {
            operationBusiness = business;
            masterFileBusiness = masterfilebusiness;
         }

          public ActionResult Index()
          {
              var model = new OTRoomCountSheet()
              {
              };

              return View(new OTRoomCountSheet());
          }


          [HttpPost]
          public JsonResult GetOTRoomCountList(AjaxDataTableModel model)
          {

              int filteredResultsCount;
              int totalResultsCount;

              var res = this.SearchRoomCountRecord(model, out filteredResultsCount, out totalResultsCount);

              var data = res.AsQueryable().Select(m => new
              {
                  Id = m.Id,
                  PatientName = m.PatientName,
                  PIN = m.PIN,
                  EntryDateTime = m.EntryDateTime.ToString("MM/dd/yyyy"),
                  ProcedureName = m.ProcedureName,
                  SurgeonName = m.SurgeonName
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

              var screeningmodel = operationBusiness.GetOTRoomCountSheet(Id.Value);
              return View(screeningmodel);
          }

          public ActionResult Create()
          {

              var defaultitems = masterFileBusiness.GetOTItems(new int[]{ 1, 2, 3, 4, 5, 6, 7 });
              var defaultbasicinstrument = masterFileBusiness.OTInstruments(new int[] { 1, 2, 3, 4, 5, 6, 7,8,9 });

              var defaultUnit = masterFileBusiness.GetOTUnitOfMeasurement(1);
              var otiteminv = new List<OTItemCount>();
              var otbasicinstrumentsinv = new List<OTBasicInstrumentCount>();

              foreach(var item in defaultitems){
                  var itemcount = new OTItemCount(){
                      OTItemId = item.Id,
                      Item = item,
                      OTUnitOfMeasurementId = defaultUnit.Id,
                      Unit = defaultUnit
                  };
                  otiteminv.Add(itemcount);
              }


               foreach(var item in defaultbasicinstrument){
                  var insturmentcount = new OTBasicInstrumentCount(){
                      OTInstrumentId = item.Id,
                      Instrument = item
                  };
                  otbasicinstrumentsinv.Add(insturmentcount);
              }


              var model = new OTRoomCountSheet()
              {
                  EntryDateTime = DateTime.Now,
                  OTItems = otiteminv,
                  BasicInstruments =  otbasicinstrumentsinv

              };

              return View(model);
          }

          [HttpPost]
          public ActionResult Create(OTRoomCountSheet sheet)
          {

              sheet.CreatedAt = DateTime.Now;
              sheet.CreatedById = base.OperatorId;
              sheet.CreatedByName = base.OperatorName;

            if(sheet.OTItems != null)
            sheet.OTItems.RemoveAll(i => i.OTItemId == 0 || i.OTUnitOfMeasurementId ==0);
            if (sheet.BasicInstruments != null)
            sheet.BasicInstruments.RemoveAll(i => i.OTInstrumentId == 0);
            if (sheet.SepareteInstruments != null)
            sheet.SepareteInstruments.RemoveAll(i => i.OTInstrumentId == 0);

          
           
            int id = operationBusiness.AddOTRoomCountSheet(sheet);

              return Json(new { id = id }, JsonRequestBehavior.AllowGet);
          }

          public ActionResult Update(int ? Id)
          {
              if (Id == null)
                return  RedirectToAction("");

              var model = operationBusiness.GetOTRoomCountSheet(Id.Value);
              return View(model);
          }

          [HttpPost]
          public ActionResult Update(OTRoomCountSheet screening)
          {
              screening.ModifiedAt = DateTime.Now;
              screening.ModifiedByName = base.OperatorName;
              screening.ModifiedById = base.OperatorId;
             
              return Json(new { result = operationBusiness.UpdateOTRoomCountSheet(screening)}, JsonRequestBehavior.AllowGet);
          }

          [HttpPost]
          public ActionResult Delete(int Id)
          {
              var data = new OTRoomCountSheet(){
              Id = Id,
                 ModifiedAt = DateTime.Now,
                 ModifiedByName = base.OperatorName,
                 ModifiedById = base.OperatorId
              };

              operationBusiness.DeleteOTRoomCountSheet(data);

              return RedirectToAction("");
          }


          private List<OTRoomCountSheet> SearchRoomCountRecord(AjaxDataTableModel model, out int filteredResultsCount, out int totalResultsCount)
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

              var result = operationBusiness.GetPagedOTRoomCountSheetList(searchBy, take, skip, sortBy, sortDir, out filteredResultsCount, out totalResultsCount);

              if (result == null)
              {
                  return new List<OTRoomCountSheet>();
              }

              return result;
          }
    
    }
}