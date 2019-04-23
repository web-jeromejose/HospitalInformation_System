using HIS.Controllers;
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
    public class MasterFileController : BaseController
    {
          private IMasterFileBusiness masterBusiness;

          public MasterFileController(IMasterFileBusiness business)
         {

             masterBusiness = business;
         }

        

        public ActionResult Index()
        {
            return View();
        }

        #region [OT Item]
        public ActionResult OTItemList()
        {
            return View();
        }

       
        public ActionResult OTItemDetail(int id)
        {
            return PartialView(masterBusiness.GetOTItem(id));
        }

        public ActionResult OTItemCreate()
        {
            return PartialView(new OTItem());
        }

        [HttpPost]
        public ActionResult OTItemCreate(OTItem model)
        {
            model.CreatedAt = DateTime.Now;
            model.CreatedByName = base.OperatorName;
            model.CreatedById = base.OperatorId;

            var id = masterBusiness.AddOTItem(model);

            return PartialView("OTItemDetail", model);
        }

        public ActionResult OTItemUpdate(int id)
        {
            return PartialView(masterBusiness.GetOTItem(id));
        }

        [HttpPost]
        public ActionResult OTItemUpdate(OTItem model)
        {
            model.ModifiedAt = DateTime.Now;
            model.ModifiedByName = base.OperatorName;
            model.ModifiedById = base.OperatorId;

            masterBusiness.UpdateOTItem(model);

             return PartialView("OTItemDetail", model);
        }

        [HttpPost]
        public ActionResult OTItemDelete(int id)
        {
            var model = new OTItem()
            {
                Id = id,
                ModifiedAt = DateTime.Now,
                ModifiedByName = base.OperatorName,
                ModifiedById = base.OperatorId,
            };

            var result = masterBusiness.DeleteOTItem(model);

            return Json(new{result = result}, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetOTItems(AjaxDataTableModel model)
        {

            int filteredResultsCount;
            int totalResultsCount;

            var res = this.SearchOTITems(model, out filteredResultsCount, out totalResultsCount);

            var data = res.AsQueryable().Select(m => new
            {
                Id = m.Id,
                Name = m.Name
            }).ToList();

            return Json(new
            {

                draw = model.draw,
                recordsTotal = totalResultsCount,
                recordsFiltered = filteredResultsCount,
                data = data

            }, JsonRequestBehavior.AllowGet);

        }

        private List<OTItem> SearchOTITems(AjaxDataTableModel model, out int filteredResultsCount, out int totalResultsCount)
        {

            var searchBy = (model.search != null) ? model.search.value : null;
            var take = model.length;
            var skip = model.start;

            string sortBy = "";
            bool sortDir = true;
            if (model.order != null)
            {
               sortBy = model.columns[model.order[0].column].data;
               sortDir = model.order[0].dir.ToLower() == "asc";
            }

            var result = masterBusiness.GetPagedOTItemList(searchBy, take, skip, sortBy, sortDir, out filteredResultsCount, out totalResultsCount);

            if (result == null)
            {
                return new List<OTItem>();
            }

            return result;

        }
        #endregion

        #region [OT Unit of measurement]
        public ActionResult OTUOMList()
        {
            return View();
        }

        public ActionResult OTUOMDetail(int id)
        {
            return PartialView(masterBusiness.GetOTUnitOfMeasurement(id));
        }

        public ActionResult OTUOMCreate()
        {
            return PartialView(new OTUnitOfMeasurement());
        }

        [HttpPost]
        public ActionResult OTUOMCreate(OTUnitOfMeasurement model)
        {
            model.CreatedAt = DateTime.Now;
            model.CreatedByName = base.OperatorName;
            model.CreatedById = base.OperatorId;

            var id = masterBusiness.AddOTUnitOfMeasurement(model);

            return PartialView("OTUOMDetail", model);
        }

        public ActionResult OTUOMUpdate(int id)
        {
            return PartialView(masterBusiness.GetOTUnitOfMeasurement(id));
        }

        [HttpPost]
        public ActionResult OTUOMUpdate(OTUnitOfMeasurement model)
        {
            model.ModifiedAt = DateTime.Now;
            model.ModifiedByName = base.OperatorName;
            model.ModifiedById = base.OperatorId;

            masterBusiness.UpdateOTUnitOfMeasurement(model);

            return PartialView("OTUOMDetail", model);
        }

        [HttpPost]
        public ActionResult OTUOMDelete(int id)
        {
            var model = new OTUnitOfMeasurement()
            {
                Id = id,
                ModifiedAt = DateTime.Now,
                ModifiedByName = base.OperatorName,
                ModifiedById = base.OperatorId,
            };

            var result = masterBusiness.DeleteOTUnitOfMeasurement(model);

            return Json(new { result = result }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetOTUOMs(AjaxDataTableModel model)
        {

            int filteredResultsCount;
            int totalResultsCount;

            var res = this.SearchUnitOfMeasurement(model, out filteredResultsCount, out totalResultsCount);

            var data = res.AsQueryable().Select(m => new
            {
                Id = m.Id,
                Name = m.Name
            }).ToList();

            return Json(new
            {

                draw = model.draw,
                recordsTotal = totalResultsCount,
                recordsFiltered = filteredResultsCount,
                data = data

            }, JsonRequestBehavior.AllowGet);

        }

        private List<OTUnitOfMeasurement> SearchUnitOfMeasurement(AjaxDataTableModel model, out int filteredResultsCount, out int totalResultsCount)
        {

            var searchBy = (model.search != null) ? model.search.value : null;
            var take = model.length;
            var skip = model.start;

            string sortBy = "";
            bool sortDir = true;
            if (model.order != null)
            {
                sortBy = model.columns[model.order[0].column].data;
                sortDir = model.order[0].dir.ToLower() == "asc";
            }

            var result = masterBusiness.GetPagedOTUnitOfMeasurementList(searchBy, take, skip, sortBy, sortDir, out filteredResultsCount, out totalResultsCount);

            if (result == null)
            {
                return new List<OTUnitOfMeasurement>();
            }

            return result;

        }
        #endregion

        #region [OT Instrument]
        public ActionResult OTInstrumentList()
        {
            return View();
        }

        public ActionResult OTInstrumentDetail(int id)
        {
            return PartialView(masterBusiness.GetOTInstrument(id));
        }

        public ActionResult OTInstrumentCreate()
        {
            return PartialView(new OTInstrument());
        }

        [HttpPost]
        public ActionResult OTInstrumentCreate(OTInstrument model)
        {
            model.CreatedAt = DateTime.Now;
            model.CreatedByName = base.OperatorName;
            model.CreatedById = base.OperatorId;

            var id = masterBusiness.AddOTInstrument(model);

            return PartialView("OTInstrumentDetail", model);
        }

        public ActionResult OTInstrumentUpdate(int id)
        {
            return PartialView(masterBusiness.GetOTInstrument(id));
        }

        [HttpPost]
        public ActionResult OTInstrumentUpdate(OTInstrument model)
        {
            model.ModifiedAt = DateTime.Now;
            model.ModifiedByName = base.OperatorName;
            model.ModifiedById = base.OperatorId;

            masterBusiness.UpdateOTInstrument(model);

            return PartialView("OTInstrumentDetail", model);
        }

        [HttpPost]
        public ActionResult OTInstrumentDelete(int id)
        {
            var model = new OTInstrument()
            {
                Id = id,
                ModifiedAt = DateTime.Now,
                ModifiedByName = base.OperatorName,
                ModifiedById = base.OperatorId,
            };

            var result = masterBusiness.DeleteOTInstrument(model);

            return Json(new { result = result }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetOTInstruments(AjaxDataTableModel model)
        {

            int filteredResultsCount;
            int totalResultsCount;

            var res = this.SearchOTInstruments(model, out filteredResultsCount, out totalResultsCount);

            var data = res.AsQueryable().Select(m => new
            {
                Id = m.Id,
                Name = m.Name
            }).ToList();

            return Json(new
            {

                draw = model.draw,
                recordsTotal = totalResultsCount,
                recordsFiltered = filteredResultsCount,
                data = data

            }, JsonRequestBehavior.AllowGet);

        }

        private List<OTInstrument> SearchOTInstruments(AjaxDataTableModel model, out int filteredResultsCount, out int totalResultsCount)
        {

            var searchBy = (model.search != null) ? model.search.value : null;
            var take = model.length;
            var skip = model.start;

            string sortBy = "";
            bool sortDir = true;
            if (model.order != null)
            {
                sortBy = model.columns[model.order[0].column].data;
                sortDir = model.order[0].dir.ToLower() == "asc";
            }

            var result = masterBusiness.GetPagedOTInstrumentList(searchBy, take, skip, sortBy, sortDir, out filteredResultsCount, out totalResultsCount);

            if (result == null)
            {
                return new List<OTInstrument>();
            }

            return result;

        }
        #endregion

        #region [Pre Operative Medication]
        public ActionResult PreOperativeMedicationList()
        {
            return View();
        }

        public ActionResult PreOperativeMedicationDetail(int id)
        {
            return PartialView(masterBusiness.GetPreOperativeMedication(id));
        }

        public ActionResult PreOperativeMedicationCreate()
        {
            return PartialView(new PreOperativeMedication());
        }

        [HttpPost]
        public ActionResult PreOperativeMedicationCreate(PreOperativeMedication model)
        {
            model.CreatedAt = DateTime.Now;
            model.CreatedByName = base.OperatorName;
            model.CreatedById = base.OperatorId;

            var id = masterBusiness.AddPreOperativeMedication(model);

            return PartialView("PreOperativeMedicationDetail", model);
        }

        public ActionResult PreOperativeMedicationUpdate(int id)
        {
            return PartialView(masterBusiness.GetPreOperativeMedication(id));
        }

        [HttpPost]
        public ActionResult PreOperativeMedicationUpdate(PreOperativeMedication model)
        {
            model.ModifiedAt = DateTime.Now;
            model.ModifiedByName = base.OperatorName;
            model.ModifiedById = base.OperatorId;

            masterBusiness.UpdatePreOperativeMedication(model);

            return PartialView("PreOperativeMedicationDetail", model);
        }

        [HttpPost]
        public ActionResult PreOperativeMedicationDelete(int id)
        {
            var model = new PreOperativeMedication()
            {
                Id = id,
                ModifiedAt = DateTime.Now,
                ModifiedByName = base.OperatorName,
                ModifiedById = base.OperatorId,
            };

            var result = masterBusiness.DeletePreOperativeMedication(model);

            return Json(new { result = result }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetPreOperativeMedications(AjaxDataTableModel model)
        {

            int filteredResultsCount;
            int totalResultsCount;

            var res = this.SearchPreOperativeMedications(model, out filteredResultsCount, out totalResultsCount);

            var data = res.AsQueryable().Select(m => new
            {
                Id = m.Id,
                Name = m.Name,
                HasOperationalValue = m.HasOperationalValue
            }).ToList();

            return Json(new
            {

                draw = model.draw,
                recordsTotal = totalResultsCount,
                recordsFiltered = filteredResultsCount,
                data = data

            }, JsonRequestBehavior.AllowGet);

        }

        private List<PreOperativeMedication> SearchPreOperativeMedications(AjaxDataTableModel model, out int filteredResultsCount, out int totalResultsCount)
        {

            var searchBy = (model.search != null) ? model.search.value : null;
            var take = model.length;
            var skip = model.start;

            string sortBy = "";
            bool sortDir = true;
            if (model.order != null)
            {
                sortBy = model.columns[model.order[0].column].data;
                sortDir = model.order[0].dir.ToLower() == "asc";
            }

            var result = masterBusiness.GetPagedPreOperativeMedicationList(searchBy, take, skip, sortBy, sortDir, out filteredResultsCount, out totalResultsCount);

            if (result == null)
            {
                return new List<PreOperativeMedication>();
            }

            return result;

        }
        #endregion

        #region [Pre Operative Check]
        public ActionResult PreOperativeCheckList()
        {
            return View();
        }

        public ActionResult PreOperativeCheckDetail(int id)
        {
            return PartialView(masterBusiness.GetPreOperativeCheck(id));
        }

        public ActionResult PreOperativeCheckCreate()
        {
            return PartialView(new PreOperativeCheck());
        }

        [HttpPost]
        public ActionResult PreOperativeCheckCreate(PreOperativeCheck model)
        {
            model.CreatedAt = DateTime.Now;
            model.CreatedByName = base.OperatorName;
            model.CreatedById = base.OperatorId;

            var id = masterBusiness.AddPreOperativeCheck(model);

            return PartialView("PreOperativeCheckDetail", model);
        }

        public ActionResult PreOperativeCheckUpdate(int id)
        {
            return PartialView(masterBusiness.GetPreOperativeCheck(id));
        }

        [HttpPost]
        public ActionResult PreOperativeCheckUpdate(PreOperativeCheck model)
        {
            model.ModifiedAt = DateTime.Now;
            model.ModifiedByName = base.OperatorName;
            model.ModifiedById = base.OperatorId;

            masterBusiness.UpdatePreOperativeCheck(model);

            return PartialView("PreOperativeCheckDetail", model);
        }

        [HttpPost]
        public ActionResult PreOperativeCheckDelete(int id)
        {
            var model = new PreOperativeCheck()
            {
                Id = id,
                ModifiedAt = DateTime.Now,
                ModifiedByName = base.OperatorName,
                ModifiedById = base.OperatorId,
            };

            var result = masterBusiness.DeletePreOperativeCheck(model);

            return Json(new { result = result }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetPreOperativeChecks(AjaxDataTableModel model)
        {

            int filteredResultsCount;
            int totalResultsCount;

            var res = this.SearchPreOperativeChecks(model, out filteredResultsCount, out totalResultsCount);

            var data = res.AsQueryable().Select(m => new
            {
                Id = m.Id,
                Name = m.Name
            }).ToList();

            return Json(new
            {

                draw = model.draw,
                recordsTotal = totalResultsCount,
                recordsFiltered = filteredResultsCount,
                data = data

            }, JsonRequestBehavior.AllowGet);

        }

        private List<PreOperativeCheck> SearchPreOperativeChecks(AjaxDataTableModel model, out int filteredResultsCount, out int totalResultsCount)
        {

            var searchBy = (model.search != null) ? model.search.value : null;
            var take = model.length;
            var skip = model.start;

            string sortBy = "";
            bool sortDir = true;
            if (model.order != null)
            {
                sortBy = model.columns[model.order[0].column].data;
                sortDir = model.order[0].dir.ToLower() == "asc";
            }

            var result = masterBusiness.GetPagedPreOperativeCheckList(searchBy, take, skip, sortBy, sortDir, out filteredResultsCount, out totalResultsCount);

            if (result == null)
            {
                return new List<PreOperativeCheck>();
            }

            return result;

        }
        #endregion


        #region [Pre Operative Chart]
        public ActionResult PreOperativeChartList()
        {
            return View();
        }

        public ActionResult PreOperativeChartDetail(int id)
        {
            return PartialView(masterBusiness.GetPreOperativeChart(id));
        }

        public ActionResult PreOperativeChartCreate()
        {
            return PartialView(new PreOperativeChart());
        }

        [HttpPost]
        public ActionResult PreOperativeChartCreate(PreOperativeChart model)
        {
            model.CreatedAt = DateTime.Now;
            model.CreatedByName = base.OperatorName;
            model.CreatedById = base.OperatorId;

            var id = masterBusiness.AddPreOperativeChart(model);

            return PartialView("PreOperativeChartDetail", model);
        }

        public ActionResult PreOperativeChartUpdate(int id)
        {
            return PartialView(masterBusiness.GetPreOperativeChart(id));
        }

        [HttpPost]
        public ActionResult PreOperativeChartUpdate(PreOperativeChart model)
        {
            model.ModifiedAt = DateTime.Now;
            model.ModifiedByName = base.OperatorName;
            model.ModifiedById = base.OperatorId;

            masterBusiness.UpdatePreOperativeChart(model);

            return PartialView("PreOperativeChartDetail", model);
        }

        [HttpPost]
        public ActionResult PreOperativeChartDelete(int id)
        {
            var model = new PreOperativeChart()
            {
                Id = id,
                ModifiedAt = DateTime.Now,
                ModifiedByName = base.OperatorName,
                ModifiedById = base.OperatorId,
            };

            var result = masterBusiness.DeletePreOperativeChart(model);

            return Json(new { result = result }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetPreOperativeCharts(AjaxDataTableModel model)
        {

            int filteredResultsCount;
            int totalResultsCount;

            var res = this.SearchPreOperativeCharts(model, out filteredResultsCount, out totalResultsCount);

            var data = res.AsQueryable().Select(m => new
            {
                Id = m.Id,
                Name = m.Name
            }).ToList();

            return Json(new
            {

                draw = model.draw,
                recordsTotal = totalResultsCount,
                recordsFiltered = filteredResultsCount,
                data = data

            }, JsonRequestBehavior.AllowGet);

        }

        private List<PreOperativeChart> SearchPreOperativeCharts(AjaxDataTableModel model, out int filteredResultsCount, out int totalResultsCount)
        {

            var searchBy = (model.search != null) ? model.search.value : null;
            var take = model.length;
            var skip = model.start;

            string sortBy = "";
            bool sortDir = true;
            if (model.order != null)
            {
                sortBy = model.columns[model.order[0].column].data;
                sortDir = model.order[0].dir.ToLower() == "asc";
            }

            var result = masterBusiness.GetPagedPreOperativeChartList(searchBy, take, skip, sortBy, sortDir, out filteredResultsCount, out totalResultsCount);

            if (result == null)
            {
                return new List<PreOperativeChart>();
            }

            return result;

        }
        #endregion

    }
}
