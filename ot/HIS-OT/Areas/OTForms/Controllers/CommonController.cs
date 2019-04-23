using HIS.Controllers;
using HIS_OT.Areas.OT.Models;
using HIS_OT.Areas.OTForms.Models;
using HIS_OT.Models;
using OTEf.Core.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HIS_OT.Areas.OTForms.Controllers
{
    public class CommonController : BaseController
    {

         private IMasterFileBusiness masterBusiness;

         public CommonController(IMasterFileBusiness business)
         {

             masterBusiness = business;
         }

        public ActionResult select2PIN(string searchTerm)
        {
            return new JsonpResult
            {
                Data = Select2Repository.Patient(searchTerm),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult Select2AllSex()
        {
            return new JsonpResult
            {
                Data = Select2Repository.AllSex(),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult Select2AllStation()
        {
            return new JsonpResult
            {
                Data = Select2Repository.AllStation(),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult Select2StationByType(int typeid)
        {
            return new JsonpResult
            {
                Data = Select2Repository.StationByType(typeid),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult Select2AllAgeType()
        {
            return new JsonpResult
            {
                Data = Select2Repository.AllAgeType(),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult Select2MedicalEmployee(string searchTerm)
        {
            return new JsonpResult
            {
                Data = Select2Repository.MedicalEmployee(searchTerm),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult Select2MedicalSurgeon(string searchTerm)
        {
            return new JsonpResult
            {
                Data = Select2Repository.MedicalSurgeon(searchTerm),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult Select2TestProcedure(string searchTerm)
        {
            return new JsonpResult
            {
                Data = Select2Repository.TestProcedure(searchTerm),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult Select2CirculatoryNurse(string searchTerm)
        {
            return new JsonpResult
            {
                Data = Select2Repository.CirculatoryNurse(searchTerm),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult Select2ScrubNurse(string searchTerm)
        {
            return new JsonpResult
            {
                Data = Select2Repository.ScrubNurse(searchTerm),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }


        public ActionResult Select2Doctor(string searchTerm)
        {
            return new JsonpResult
            {
                Data = Select2Repository.Doctor(searchTerm),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult Select2AllLocation()
        {
            return new JsonpResult
            {
                Data = Select2Repository.AllLocation(),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult Select2UnitOFMeasurement()
        {
            var sel2data = masterBusiness.GetAllOTUnitOfMeasurement().AsEnumerable().Select(m => new
            {
                id = m.Id,
                text = m.Name,
            }).ToList();

            return new JsonpResult
            {
                Data = new { Total = sel2data.Count(), Results = sel2data },
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult Select2OTRoomItems()
        {
            var sel2data = masterBusiness.GetAllOTItems().AsEnumerable().Select(m => new
            {
                id = m.Id,
                text = m.Name,
            }).ToList();

            return new JsonpResult
            {
                Data = new { Total = sel2data.Count(), Results = sel2data },
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult Select2OTInstrument()
        {
            var sel2data = masterBusiness.GetAllOTInstrument().AsEnumerable().Select(m => new
            {
                id = m.Id,
                text = m.Name,
            }).ToList();

            return new JsonpResult
            {
                Data = new { Total = sel2data.Count(), Results = sel2data },
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult Select2PreOperative_Chart()
        {
            var sel2data = masterBusiness.GetAllPreOperativeChart().AsEnumerable().Select(m => new
            {
                id = m.Id,
                text = m.Name,
            }).ToList();

            return new JsonpResult
            {
                Data = new { Total = sel2data.Count(), Results = sel2data },
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2PreOperative_Check()
        {
            var sel2data = masterBusiness.GetAllPreOperativeCheck().AsEnumerable().Select(m => new
            {
                id = m.Id,
                text = m.Name,
            }).ToList();

            return new JsonpResult
            {
                Data = new { Total = sel2data.Count(), Results = sel2data },
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2PreOperative_MedicationsGiven()
        {
            var sel2data = masterBusiness.GetAllPreOperativeMedication().AsEnumerable().Select(m => new
            {
                id = m.Id,
                text = m.Name,
            }).ToList();

            return new JsonpResult
            {
                Data = new { Total = sel2data.Count(), Results = sel2data },
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }


    }
}
