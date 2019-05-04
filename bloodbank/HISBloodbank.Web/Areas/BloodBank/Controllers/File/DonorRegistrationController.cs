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
    public class DonorRegistrationController : BaseController
    {
        //
        // GET: /BloodBank/DonorRegistration/
        DonorRegistrationModel model = new DonorRegistrationModel();
        public ActionResult Index()
        {
            ViewBag.MyIp = GetUserIp();
            return View();
        }

        public ActionResult GetLastBBRegNo()
        {
            DonorRegistrationModel model = new DonorRegistrationModel();
            string msg = model.GetLastBBRegNo();
            return Json(new CustomMessage { Title = "Message...", Message = msg, ErrorCode = 1 }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult DonorRegistrationSearch(int SearchBy, string Value)
        {
            DonorRegistrationModel model = new DonorRegistrationModel();
            List<DonorRegistrationSearchItem> list = model.DonorRegistrationSearch(SearchBy, Value);

            if (model.ErrorMessage.Trim().Length == 0)
            {
                var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
                var result = new ContentResult
                {
                    Content = serializer.Serialize(new { list = list ?? new List<DonorRegistrationSearchItem>() }),
                    ContentType = "application/json"
                };
                return result;
            }
            else
            {
                bool status = model.ErrorMessage.Length == 0;
                return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 }, JsonRequestBehavior.AllowGet);
            }

            
        }

        [HttpPost]
        public ActionResult SaveBarcodeAndPrint(int idd, string workStationIp)
        {
            var refId = model.SaveBarcode(idd, workStationIp);

            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(string.Concat("idd:", idd, " workStationIp:", workStationIp));
            MasterLogs log = new MasterLogs();
            bool logs = log.loginsert("SaveBarcodeAndPrint", "BB--" + "DonorRegistrationController", "0", "0", this.OperatorId, log_details);

            return Json(new { refId = refId });
        }

        [HttpPost]
        public ActionResult ShowList(ShowListParam para)
        {
            DonorRegistrationModel model = new DonorRegistrationModel();
            List<DonorRegView> list = model.List(para.DonorRegFilter, para.Id, para.RowsPerPage, para.GetPage);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<DonorRegView>() }),
                ContentType = "application/json"
            };
            return result;
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(DonorReg entry)
        {
            entry.operatorid = this.OperatorId;
            DonorRegistrationModel model = new DonorRegistrationModel();
            bool status = model.Save(entry);
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterLogs log = new MasterLogs();
            bool logs = log.loginsert("Save", "BB--" + "DonorRegistrationController", "0", "0", this.OperatorId, log_details);

            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

        public ActionResult ShowSelected(int Id)
        {
            DonorRegistrationModel model = new DonorRegistrationModel();
            List<DonorRegSelected> list = model.ShowSelected(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<DonorRegSelected>() }),
                ContentType = "application/json"
            };
            return result;
        }
        //public ActionResult ShowScreenResults(int Id)
        //{
        //    DonorRegistrationModel model = new DonorRegistrationModel();
        //    List<IdName> list = model.ShowScreenResults(Id);
        //    var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
        //    var result = new ContentResult
        //    {
        //        Content = serializer.Serialize(new { list = list ?? new List<IdName>() }),
        //        ContentType = "application/json"
        //    };
        //    return result;
        //}
        public ActionResult ShowListOfDrugAllergies(int Id)
        {
            DonorRegistrationModel model = new DonorRegistrationModel();
            List<m_generic> list = model.ListOfDrugAllergies(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<m_generic>() }),
                ContentType = "application/json"
            };
            return result;
        }
        public ActionResult ShowListOfFoodAllergies(int Id)
        {
            DonorRegistrationModel model = new DonorRegistrationModel();
            List<fooditem> list = model.ListOfFoodAllergies(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<fooditem>() }),
                ContentType = "application/json"
            };
            return result;
        }
        public ActionResult ShowListOfSurgeries(int Id)
        {
            DonorRegistrationModel model = new DonorRegistrationModel();
            List<Surgery> list = model.ListOfSurgeries(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<Surgery>() }),
                ContentType = "application/json"
            };
            return result;
        }
        public ActionResult ShowListOfDonorQuestionaires(int Id)
        {
            DonorRegistrationModel model = new DonorRegistrationModel();
            List<DonorQuestionaires> list = model.ListOfDonorQuestionaires(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<DonorQuestionaires>() }),
                ContentType = "application/json"
            };
            return result;
        }



        public JsonResult Select2DonorVolume()
        {
            List<RoleModel> li = model.Select2DonorVolume();
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }
        public ActionResult Select2SDPLR(DateTime currentDate, string searchTerm, int pageSize, int pageNum)
        {
            //List<RoleModel> list = model.Select2SDPLR();
            //return Json(list.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
            Select2TypeofDonationRepository list = new Select2TypeofDonationRepository();
            list.FetchV2(currentDate);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        
 
        #region select2

        public ActionResult Select2IssueBags(string searchTerm, int pageSize, int pageNum, int IPID)
        {
            Select2IssueBagsRepository list = new Select2IssueBagsRepository();
            list.Fetch(IPID);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2City(string searchTerm, int pageSize, int pageNum)
        {
            Select2CityRepository list = new Select2CityRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2Country(string searchTerm, int pageSize, int pageNum)
        {
            Select2CountryRepository list = new Select2CountryRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2Occupation(string searchTerm, int pageSize, int pageNum)
        {
            Select2OccupationRepository list = new Select2OccupationRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2Religion(string searchTerm, int pageSize, int pageNum)
        {
            Select2ReligionRepository list = new Select2ReligionRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2Bed(string searchTerm, int pageSize, int pageNum)
        {
            Select2BedRepository list = new Select2BedRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2Title(string searchTerm, int pageSize, int pageNum)
        {
            Select2TitleRepository list = new Select2TitleRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2Gender(string searchTerm, int pageSize, int pageNum)
        {
            Select2GenderRepository list = new Select2GenderRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2Nationality(string searchTerm, int pageSize, int pageNum)
        {
            Select2NationalityRepository list = new Select2NationalityRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2BloodGroup(string searchTerm, int pageSize, int pageNum)
        {
            Select2BloodGroupRepository list = new Select2BloodGroupRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2MaritalStatus(string searchTerm, int pageSize, int pageNum)
        {
            Select2MaritalStatusRepository list = new Select2MaritalStatusRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2DonatingFor(string searchTerm, int pageSize, int pageNum)
        {
            Select2DonatingForRepository list = new Select2DonatingForRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2FoodAllergies(string searchTerm, int pageSize, int pageNum)
        {
            Select2FoodAllergiesRepository list = new Select2FoodAllergiesRepository();
            list.Fetch(-1);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2DrugAllergies(string searchTerm, int pageSize, int pageNum)
        {
            Select2DrugAllergiesRepository list = new Select2DrugAllergiesRepository();
            list.Fetch(-1);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2Surgeries(string searchTerm, int pageSize, int pageNum)
        {
            Select2SurgeriesRepository list = new Select2SurgeriesRepository();
            list.Fetch(-1);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2DonorSuffers(string searchTerm, int pageSize, int pageNum)
        {
            Select2DonorSuffersRepository list = new Select2DonorSuffersRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2DonorAntiDrugs(string searchTerm, int pageSize, int pageNum)
        {
            Select2DonorAntiDrugsRepository list = new Select2DonorAntiDrugsRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2DonorVaccination(string searchTerm, int pageSize, int pageNum)
        {
            Select2DonorVaccinationRepository list = new Select2DonorVaccinationRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2DonorStatus(string searchTerm, int pageSize, int pageNum)
        {
            Select2DonorStatusRepository list = new Select2DonorStatusRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2DonorType(string searchTerm, int pageSize, int pageNum)
        {
            Select2DonorTypeRepository list = new Select2DonorTypeRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2BagType(int componentId, DateTime currentDate, string searchTerm, int pageSize, int pageNum)
        {
            Select2BagTypeRepository list = new Select2BagTypeRepository();
            list.FetchV2(componentId, currentDate);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2Phlebotomist(string searchTerm, int pageSize, int pageNum, int StationId)
        {
            Select2PhlebotomistRepository list = new Select2PhlebotomistRepository();
            list.Fetch(StationId);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        
        public ActionResult Select2BBBagCompany(string searchTerm, int pageSize, int pageNum)
        {
            Select2BBBagCompanyRepository list = new Select2BBBagCompanyRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2ScreeningResult(string searchTerm, int pageSize, int pageNum)
        {
            Select2ScreeningResultRepository list = new Select2ScreeningResultRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2Reaction(string searchTerm, int pageSize, int pageNum)
        {
            Select2ReactionRepository list = new Select2ReactionRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2Venisite(string searchTerm, int pageSize, int pageNum)
        {
            Select2VenisiteRepository list = new Select2VenisiteRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2DonorRegBBBagQty(string searchTerm, int pageSize, int pageNum)
        {
            Select2DonorRegBBBagQtyRepository list = new Select2DonorRegBBBagQtyRepository();
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
