using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Data.SqlClient;
using System.Data;

using DataLayer;
using HIS_OT.Areas.OT.Models;
using HIS_OT.Controllers;
using HIS_OT.Models;
using HIS.Controllers;

namespace HIS_OT.Areas.OT.Controllers
{
    [Authorize]
    public class SurgeryRecordController : BaseController
    {

        [IsSGHFeatureAuthorized(mFeatureID = "1472")]
        public ActionResult Index()
        {
           
            return View();
        }
        public ActionResult Onepage()
        {

            return View();
        }
        public JsonResult ShowList(int Id, int CurrentStationID)
        {
            SurgeryRecordModel model = new SurgeryRecordModel();
            List<SurgerRecordList> list = model.SurgeryRecordList(CurrentStationID, Id);
            return Json(list ?? new List<SurgerRecordList>() , JsonRequestBehavior.AllowGet);
        }
        public JsonResult ShowSelected(int Id, int CurrentStationID)
        {
            SurgeryRecordModel model = new SurgeryRecordModel();
            List<SurgerRecordList> list = model.SurgeryRecordList(CurrentStationID, Id);

            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details =  log_serializer.Serialize(Id);
            MasterLogs log = new MasterLogs();
            bool logs = log.loginsert("ShowSelected", "OT--" + "SurgeryRecordController", "0", "0", this.OperatorId, log_details);


            return Json(list ?? new List<SurgerRecordList>(), JsonRequestBehavior.AllowGet);
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(OTOrder entry)
        {
            SurgeryRecordModel model = new SurgeryRecordModel();
            entry.PatientType = true; // Inpatient
            entry.DoctorNotes = false;
            entry.stationid = entry.CurrentStationID;
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);

            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterLogs log = new MasterLogs();
            bool logs = log.loginsert("Save", "OT--" + "SurgeryRecordController", "0", "0", this.OperatorId, log_details);



            return Json(new Models.CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }


        public ActionResult Select2GetPIN(string searchTerm, int pageSize, int pageNum, int type)
        {
            Select2GetPinNameBedNoRepositoryPin list = new Select2GetPinNameBedNoRepositoryPin();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2GetName(string searchTerm, int pageSize, int pageNum, int type)
        {
            Select2GetPinNameBedNoRepositoryName list = new Select2GetPinNameBedNoRepositoryName();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2GetBedNo(string searchTerm, int pageSize, int pageNum, int type)
        {
            Select2GetPinNameBedNoRepositoryBedNo list = new Select2GetPinNameBedNoRepositoryBedNo();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult Select2GetOperatingTheatres(string searchTerm, int pageSize, int pageNum, int type)
        {
            Select2GetOperatingTheatresRepository list = new Select2GetOperatingTheatresRepository();
            list.Fetch(-1);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2GetAnaesthesia(string searchTerm, int pageSize, int pageNum, int type)
        {
            Select2GetAnaesthesiaRepository list = new Select2GetAnaesthesiaRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2GetShiftingNurse(string searchTerm, int pageSize, int pageNum, int type)
        {
            Select2GetShiftingNurseRepository list = new Select2GetShiftingNurseRepository();
            list.Fetch(this.DepartmentId);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2GetCirculatoryNurses(string searchTerm, int pageSize, int pageNum, int type)
        {
            Select2GetCirculatoryNursesRepository list = new Select2GetCirculatoryNursesRepository();
            list.Fetch();
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult Select2SelectedSurgery(string searchTerm, int pageSize, int pageNum, int SurgeryRecordId, int IsSelected)
        {
            Select2SelectedSurgeryRepository list = new Select2SelectedSurgeryRepository();
            list.Fetch(SurgeryRecordId, IsSelected, searchTerm);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2SelectedSurgeon(string searchTerm, int pageSize, int pageNum, int SurgeryRecordId, int IsSelected)
        {
            Select2SelectedSurgeonRepository list = new Select2SelectedSurgeonRepository();
            list.Fetch(SurgeryRecordId, IsSelected);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2SelectedAsstSurgeon(string searchTerm, int pageSize, int pageNum, int SurgeryRecordId, int IsSelected)
        {
            Select2SelectedAsstSurgeonRepository list = new Select2SelectedAsstSurgeonRepository();
            list.Fetch(SurgeryRecordId, IsSelected);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2SelectedAnaesthetist(string searchTerm, int pageSize, int pageNum, int SurgeryRecordId, int IsSelected)
        {
            Select2SelectedAnaesthetistRepository list = new Select2SelectedAnaesthetistRepository();
            list.Fetch(SurgeryRecordId, IsSelected);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2SelectedScrubNurse(string searchTerm, int pageSize, int pageNum, int SurgeryRecordId, int IsSelected)
        {
            Select2SelectedScrubNurseRepository list = new Select2SelectedScrubNurseRepository();
            list.Fetch(SurgeryRecordId, IsSelected);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult Select2SelectedEquipment(string searchTerm, int pageSize, int pageNum, int SurgeryRecordId, int IsSelected)
        {
            Select2SelectedEquipmentRepository list = new Select2SelectedEquipmentRepository();
            list.Fetch(SurgeryRecordId, IsSelected);
            return new JsonpResult
            {
                Data = list.Paged(searchTerm, pageSize, pageNum),
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        



















        public ActionResult Index1()
        {
            return View();
        }
        public JsonResult List()
        {
            RepositorySurgeryRecord model = new RepositorySurgeryRecord();
            List<EntitySurgeryRecord> list = model.GetList(this.StationId);
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        
        public JsonResult View(int pId)
        {
            RepositorySurgeryRecord repository = new RepositorySurgeryRecord();
            EntitySurgeryRecord entry = repository.View(pId);

            entry.EntitySurgeryRecordSurgeryList = RepositorySurgeryRecordSurgeryList.GetData(pId);
            entry.EntitySurgeryRecordSurgeonList = RepositorySurgeryRecordSurgeonList.GetData(pId);
            entry.EntitySurgeryRecordAsstSurgeonsList = RepositorySurgeryRecordAsstSurgeonsList.GetData(pId);
            entry.EntitySurgeryRecordAnaesthetistList = RepositorySurgeryRecordAnaesthetistList.GetData(pId);
            entry.EntitySurgeryRecordScrubNurseList = RepositorySurgeryRecordScrubNurseList.GetData(pId);
            entry.EntitySurgeryRecordEquipmentList = RepositorySurgeryRecordEquipmentList.GetData(pId);

            repository = null;

            return Json(entry, JsonRequestBehavior.AllowGet);
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save1(EntitySurgeryRecord pEntry)
        {
            RepositorySurgeryRecord repo = new RepositorySurgeryRecord();
            pEntry.OperatorId = this.OperatorId;
            pEntry.stationid = this.StationId;
            repo.CRUD(pEntry);
            return Json(new Models.CustomMessage { Title = "Message...", Message = repo.ErrorMessage });
        }


        public ActionResult Select2SurgeryRecordPIN(string searchTerm, int pageSize, int pageNum)
        {
            RepositorySurgeryRecordPinNameBedNo repository = new RepositorySurgeryRecordPinNameBedNo();
            repository.SearchType = RepositorySurgeryRecordPinNameBedNo.ennType.Pin;
            repository.InitData();

            List<EntitySurgeryRecordPinNameBedNo> list = repository.Get(searchTerm, pageSize, pageNum);
            int count = repository.GetCount(searchTerm, pageSize, pageNum);

            Select2PagedResult paged = new Select2PagedResult();
            paged.Results = list.AsEnumerable().Select(m => new Select2Result()
            {
                id = m.NameId.ToString(),
                text = m.PinName.ToString(),
                list = new object[] { 
                    m.registrationno, m.code, m.NameId, m.Name, 
                    m.BedName, m.BedId, m.PinName, m.Ward, m.Age, m.Sex, m.PrimaryConsultant, m.Package,
                    m.Company, m.CompanyName, m.Category
                }
            }).ToList();
            paged.Total = count;

            return new JsonpResult { Data = paged, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }
        public ActionResult Select2SurgeryRecordName(string searchTerm, int pageSize, int pageNum)
        {
            RepositorySurgeryRecordPinNameBedNo repository = new RepositorySurgeryRecordPinNameBedNo();
            repository.SearchType = RepositorySurgeryRecordPinNameBedNo.ennType.PinName;
            repository.InitData();

            List<EntitySurgeryRecordPinNameBedNo> list = repository.Get(searchTerm, pageSize, pageNum);
            int count = repository.GetCount(searchTerm, pageSize, pageNum);

            Select2PagedResult paged = new Select2PagedResult();
            paged.Results = list.AsEnumerable().Select(m => new Select2Result()
            {
                id = m.NameId.ToString(),
                text = m.Name.ToString(),
                list = new object[] { 
                    m.registrationno, m.code, m.NameId, m.Name, 
                    m.BedName, m.BedId, m.PinName, m.Ward, m.Age, m.Sex, m.PrimaryConsultant, m.Package,
                    m.Company, m.CompanyName, m.Category
                }
            }).ToList();
            paged.Total = count;

            return new JsonpResult { Data = paged, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }
        public ActionResult Select2SurgeryRecordBedNo(string searchTerm, int pageSize, int pageNum)
        {
            RepositorySurgeryRecordPinNameBedNo repository = new RepositorySurgeryRecordPinNameBedNo();
            repository.SearchType = RepositorySurgeryRecordPinNameBedNo.ennType.BedNo;
            repository.InitData();

            List<EntitySurgeryRecordPinNameBedNo> list = repository.Get(searchTerm, pageSize, pageNum);
            int count = repository.GetCount(searchTerm, pageSize, pageNum);

            Select2PagedResult paged = new Select2PagedResult();
            paged.Results = list.AsEnumerable().Select(m => new Select2Result()
            {
                id = m.BedId.ToString(),
                text = m.BedName.ToString(),
                list = new object[] { 
                    m.registrationno, m.code, m.NameId, m.Name, 
                    m.BedName, m.BedId, m.PinName, m.Ward, m.Age, m.Sex, m.PrimaryConsultant, m.Package,
                    m.Company, m.CompanyName, m.Category
                }
            }).ToList();
            paged.Total = count;

            return new JsonpResult { Data = paged, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }  
        public ActionResult Select2SurgeryRecordShiftingNurses(string searchTerm, int pageSize, int pageNum)
        {
            RepositorySurgeryRecordShiftNurses repository = new RepositorySurgeryRecordShiftNurses();
            repository.InitData(this.DepartmentId);

            List<EntitySurgeryRecordShiftingNurses> list = repository.Get(searchTerm, pageSize, pageNum);
            int count = repository.GetCount(searchTerm, pageSize, pageNum);

            Select2PagedResult paged = new Select2PagedResult();
            paged.Results = list.AsEnumerable().Select( m=> new Select2Result()
            {
                id = m.id.ToString(),
                text = m.name
            }).ToList();
            paged.Total = count;

            return new JsonpResult {Data = paged, JsonRequestBehavior = JsonRequestBehavior.AllowGet};
            
        }
        public ActionResult Select2SurgeryRecordCirculatoryNurses(string searchTerm, int pageSize, int pageNum)
        {
            RepositorySurgeryRecordCirculatoryNurses repository = new RepositorySurgeryRecordCirculatoryNurses();
            repository.InitData();

            List<EntitySurgeryRecordCirculatoryNurses> list = repository.Get(searchTerm, pageSize, pageNum);
            int count = repository.GetCount(searchTerm, pageSize, pageNum);

            Select2PagedResult paged = new Select2PagedResult();
            paged.Results = list.AsEnumerable().Select(m => new Select2Result()
            {
                id = m.id.ToString(),
                text = m.name
            }).ToList();
            paged.Total = count;

            return new JsonpResult { Data = paged, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }
        public ActionResult Select2SurgeryRecordOperatingTheatres(string searchTerm, int pageSize, int pageNum)
        {
            RepositorySurgeryRecordOperatingTheatres repository = new RepositorySurgeryRecordOperatingTheatres();
            repository.InitData(this.StationId);

            List<EntitySurgeryRecordOperatingTheatres> list = repository.Get(searchTerm, pageSize, pageNum);
            int count = repository.GetCount(searchTerm, pageSize, pageNum);

            Select2PagedResult paged = new Select2PagedResult();
            paged.Results = list.AsEnumerable().Select(m => new Select2Result()
            {
                id = m.id.ToString(),
                text = m.name
            }).ToList();
            paged.Total = count;

            return new JsonpResult { Data = paged, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }
        public ActionResult Select2SurgeryRecordAnaesthesia(string searchTerm, int pageSize, int pageNum)
        {
            RepositorySurgeryRecordAnaesthesia repository = new RepositorySurgeryRecordAnaesthesia();
            repository.InitData();

            List<EntitySurgeryRecordAnaesthesia> list = repository.Get(searchTerm, pageSize, pageNum);
            int count = repository.GetCount(searchTerm, pageSize, pageNum);

            Select2PagedResult paged = new Select2PagedResult();
            paged.Results = list.AsEnumerable().Select(m => new Select2Result()
            {
                id = m.id.ToString(),
                text = m.name
            }).ToList();
            paged.Total = count;

            return new JsonpResult { Data = paged, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }

        public ActionResult Select2SurgeryRecordSurgeryList(string searchTerm, int pageSize, int pageNum, int surgeryRecordId, int isSelected)
        {
            RepositorySurgeryRecordSurgeryList repository = new RepositorySurgeryRecordSurgeryList();
            repository.InitData(surgeryRecordId, isSelected);

            List<EntitySurgeryRecordSurgeryList> list = repository.Get(searchTerm, pageSize, pageNum);
            int count = repository.GetCount(searchTerm, pageSize, pageNum);

            Select2PagedResult paged = new Select2PagedResult();
            paged.Results = list.AsEnumerable().Select(m => new Select2Result()
            {
                id = m.id.ToString(),
                text = m.name
            }).ToList();
            paged.Total = count;

            return new JsonpResult { Data = paged, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }
        public ActionResult Select2SurgeryRecordSurgeonList(string searchTerm, int pageSize, int pageNum, int surgeryRecordId, int isSelected)
        {
            RepositorySurgeryRecordSurgeonList repository = new RepositorySurgeryRecordSurgeonList();
            repository.InitData(surgeryRecordId, isSelected);

            List<EntitySurgeryRecordSurgeonList> list = repository.Get(searchTerm, pageSize, pageNum);
            int count = repository.GetCount(searchTerm, pageSize, pageNum);

            Select2PagedResult paged = new Select2PagedResult();
            paged.Results = list.AsEnumerable().Select(m => new Select2Result()
            {
                id = m.id.ToString(),
                text = m.name
            }).ToList();
            paged.Total = count;

            return new JsonpResult { Data = paged, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }
        public ActionResult Select2SurgeryRecordAsstSurgeonsList(string searchTerm, int pageSize, int pageNum, int surgeryRecordId, int isSelected)
        {
            RepositorySurgeryRecordAsstSurgeonsList repository = new RepositorySurgeryRecordAsstSurgeonsList();
            repository.InitData(surgeryRecordId, isSelected);

            List<EntitySurgeryRecordAsstSurgeonsList> list = repository.Get(searchTerm, pageSize, pageNum);
            int count = repository.GetCount(searchTerm, pageSize, pageNum);

            Select2PagedResult paged = new Select2PagedResult();
            paged.Results = list.AsEnumerable().Select(m => new Select2Result()
            {
                id = m.id.ToString(),
                text = m.name
            }).ToList();
            paged.Total = count;

            return new JsonpResult { Data = paged, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }
        public ActionResult Select2SurgeryRecordAnaesthetistList(string searchTerm, int pageSize, int pageNum, int surgeryRecordId, int isSelected)
        {
            RepositorySurgeryRecordAnaesthetistList repository = new RepositorySurgeryRecordAnaesthetistList();
            repository.InitData(surgeryRecordId, isSelected);

            List<EntitySurgeryRecordAnaesthetistList> list = repository.Get(searchTerm, pageSize, pageNum);
            int count = repository.GetCount(searchTerm, pageSize, pageNum);

            Select2PagedResult paged = new Select2PagedResult();
            paged.Results = list.AsEnumerable().Select(m => new Select2Result()
            {
                id = m.id.ToString(),
                text = m.name
            }).ToList();
            paged.Total = count;

            return new JsonpResult { Data = paged, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }
        public ActionResult Select2SurgeryRecordScrubNurseList(string searchTerm, int pageSize, int pageNum, int surgeryRecordId, int isSelected)
        {
            RepositorySurgeryRecordScrubNurseList repository = new RepositorySurgeryRecordScrubNurseList();
            repository.InitData(surgeryRecordId, isSelected);

            List<EntitySurgeryRecordScrubNurseList> list = repository.Get(searchTerm, pageSize, pageNum);
            int count = repository.GetCount(searchTerm, pageSize, pageNum);

            Select2PagedResult paged = new Select2PagedResult();
            paged.Results = list.AsEnumerable().Select(m => new Select2Result()
            {
                id = m.id.ToString(),
                text = m.name
            }).ToList();
            paged.Total = count;

            return new JsonpResult { Data = paged, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }
        public ActionResult Select2SurgeryRecordEquipmentList(string searchTerm, int pageSize, int pageNum, int surgeryRecordId, int isSelected)
        {
            RepositorySurgeryRecordEquipmentList repository = new RepositorySurgeryRecordEquipmentList();
            repository.InitData(surgeryRecordId, isSelected);

            List<EntitySurgeryRecordEquipmentList> list = repository.Get(searchTerm, pageSize, pageNum);
            int count = repository.GetCount(searchTerm, pageSize, pageNum);

            Select2PagedResult paged = new Select2PagedResult();
            paged.Results = list.AsEnumerable().Select(m => new Select2Result()
            {
                id = m.id.ToString(),
                text = m.name
            }).ToList();
            paged.Total = count;

            return new JsonpResult { Data = paged, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }

        
    }


    public class EntitySurgeryRecord
    {
        public int Action { get; set; }                         // 1
        public int Id { get; set; }                             // 2
        public int PinId { get; set; }                          // 3
        public string PinName { get; set; }                     // 4
                
        public string Ward { get; set; }                        // 5
        public string SlNo { get; set; }                        // 6
        public int NameId { get; set; }                         // 7
        public string Name { get; set; }                        // 8

        public int BedId { get; set; }                          // 9
        public string BedName { get; set; }                     // 10
        public DateTime? DateTime { get; set; }                 // 11

        public string PrimaryConsultant { get; set; }           // 12
        public string Age { get; set; }                         // 13
        public string Sex { get; set; }                         // 14
        public int OperatorId { get; set; }                     // 15
        public string Operator { get; set; }                    // 16
        public string AnaesthetistNotes { get; set; }           // 17
        public string SurgeonNotes { get; set; }                // 18

        public int OperationTheatreId { get; set; }             // 19
        public string OperationTheatreName { get; set; }        // 20

        public DateTime? OTStartDateTime { get; set; }          // 21
        public DateTime? OTEndDateTime { get; set; }            // 22
        public DateTime? AnaesthesiaStartDateTime { get; set; } // 23
        public DateTime? AnaesthesiaEndDateTime { get; set; }   // 24
        public DateTime? SurgeryStartDateTime { get; set; }     // 25
        public DateTime? SurgeryEndDateTime { get; set; }       // 26    
        public DateTime? RecoveryStartDateTime { get; set; }    // 27
        public DateTime? RecoveryEndDateTime { get; set; }      // 28

        public int ScheduleRequestedById { get; set; }          // 29
        public string ScheduleRequestedByName { get; set; }     // 30

        public string Category { get; set; }                    // 31
        public string Company { get; set; }                     // 32
        public string Package { get; set; }                     // 33
        public string Disease { get; set; }                     // 34

        public int ShiftingNurseId { get; set; }                // 35
        public string ShiftingNurseName { get; set; }           // 36

        public int CirculatoryNurseId { get; set; }             // 37
        public string CirculatoryNurseName { get; set; }        // 38

        public int AnaesthesiaTypeID { get; set; }              // 39
        public string AnaesthesiaTypeName { get; set; }            // 40

        public int RequestedById { get; set; }                  // 41
        public string RequestedByName { get; set; }             // 42

        public int stationid { get; set; }                      // 43
        public string OTStartDateTimeD { get; set; }             // 44
        public string OTEndDateTimeD { get; set; }             // 45
        public string DateTimeD { get; set; }             // 46

        public List<EntitySurgeryRecordSurgeryList> EntitySurgeryRecordSurgeryList { get; set; }
        public List<EntitySurgeryRecordSurgeonList> EntitySurgeryRecordSurgeonList { get; set; }
        public List<EntitySurgeryRecordAsstSurgeonsList> EntitySurgeryRecordAsstSurgeonsList { get; set; }
        public List<EntitySurgeryRecordAnaesthetistList> EntitySurgeryRecordAnaesthetistList { get; set; }
        public List<EntitySurgeryRecordScrubNurseList> EntitySurgeryRecordScrubNurseList { get; set; }
        public List<EntitySurgeryRecordEquipmentList> EntitySurgeryRecordEquipmentList { get; set; }

    }
    public class EntityListOfSurgeryRecord
    {
        public int Id { get; set; }
        public string SINo { get; set; }
        public string PIN { get; set; }
        public string PatientName { get; set; }
        public DateTime? OTStartDateTime { get; set; }
        public DateTime? OTEndDateTime { get; set; }
        public string Operator { get; set; }
        public DateTime? OrderDatetime { get; set; }

    }
    public class RepositorySurgeryRecord
    {
        const string CACHE_KEY = "#fksdlajl548300943#";
        public string ErrorMessage = "";
        public List<EntitySurgeryRecord> GetList(int pStationId)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@StationId",pStationId),
                new SqlParameter("@Id",-1)
            };

            if (this.PutOnSession && HttpContext.Current.Cache[CACHE_KEY] != null)
            {
                return (List<EntitySurgeryRecord>)HttpContext.Current.Cache[CACHE_KEY];
            }
            
            List<EntitySurgeryRecord> list = db.ExecuteSPAndReturnDataTable("ZZZ_ListSurgeryRecord").ToList<EntitySurgeryRecord>();
            HttpContext.Current.Cache[CACHE_KEY] = list;
            return list;
        }
        public EntitySurgeryRecord View(int pId)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@StationId",-1),
                new SqlParameter("@Id", pId)
            };
            return db.ExecuteSPAndReturnDataTable("ZZZ_ListSurgeryRecord").ToList<EntitySurgeryRecord>()[0];
        }
        public string CRUD(EntitySurgeryRecord entry)
        {
            #region Checking routine

            if (this.HasRequired(entry)) return this.ErrorMessage;

            #endregion

            try
            {
                List<EntitySurgeryRecord> listHeader = new List<EntitySurgeryRecord>();
                listHeader.Add(entry);

                List<EntitySurgeryRecordAnaesthetistList> anaesthetistList = entry.EntitySurgeryRecordAnaesthetistList;
                if (anaesthetistList == null) anaesthetistList = new List<EntitySurgeryRecordAnaesthetistList>();

                List<EntitySurgeryRecordAsstSurgeonsList> asstsurgeonList = entry.EntitySurgeryRecordAsstSurgeonsList;
                if (asstsurgeonList == null) asstsurgeonList = new List<EntitySurgeryRecordAsstSurgeonsList>();

                List<EntitySurgeryRecordEquipmentList> equipmentList =entry.EntitySurgeryRecordEquipmentList;
                if (equipmentList == null) equipmentList = new List<EntitySurgeryRecordEquipmentList>();

                List<EntitySurgeryRecordScrubNurseList> scrubNurseList = entry.EntitySurgeryRecordScrubNurseList;
                if (scrubNurseList == null) scrubNurseList = new List<EntitySurgeryRecordScrubNurseList>();

                List<EntitySurgeryRecordSurgeonList> surgeonList = entry.EntitySurgeryRecordSurgeonList;
                if (surgeonList == null) surgeonList = new List<EntitySurgeryRecordSurgeonList>();

                List<EntitySurgeryRecordSurgeryList> surgeryList = entry.EntitySurgeryRecordSurgeryList;
                if (surgeryList == null) surgeryList = new List<EntitySurgeryRecordSurgeryList>();

                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                        new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                        new SqlParameter("@Action", entry.Action),
                        new SqlParameter("@xmlHeader", listHeader.ListToXml("header")),
                        new SqlParameter("@xmlAnaesthetistList", anaesthetistList.ListToXml("anaesthetistList")),
                        new SqlParameter("@xmlAsstsurgeonList", asstsurgeonList.ListToXml("asstsurgeonList")),
                        new SqlParameter("@xmlEquipmentList", equipmentList.ListToXml("equipmentList")),
                        new SqlParameter("@xmlScrubNurseList", scrubNurseList.ListToXml("scrubNurseList")),
                        new SqlParameter("@xmlSurgeonList", surgeonList.ListToXml("surgeonList")),
                        new SqlParameter("@xmlSurgeryList", surgeryList.ListToXml("surgeryList"))
                };
                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ZZZ_CRUDSurgeryRecord");
                this.ErrorMessage = db.param[0].Value.ToString();
                
                if (string.IsNullOrEmpty(this.ErrorMessage.Trim())) this.ErrorMessage = "Successfully saved!";
                return this.ErrorMessage;      
            }
            catch (Exception ex)
            {
                this.ErrorMessage = ex.Message;
                return this.ErrorMessage;
            }

        }

        private bool HasRequired(EntitySurgeryRecord entry)
        {
            this.ErrorMessage = "";
            string msg = "";

            //if (leaveApplication.empid < 1)
            //{
            //    ctr++;
            //    msg = msg + "<div class='row'><span style='font-size: 15px;'>" +
            //          ctr.ToString() + ". Select an employee" +
            //          "</span></div>";
            //}
           

            if (string.IsNullOrEmpty(msg)) return false;

            this.ErrorMessage = "<div class='row'><div class='col-xs-2 glyphicon glyphicon-remove-sign' style='font-size: 40px; color: #FF0000; padding: 0 0 0 30px;'></div><div class='col-xs-10'>" +
                                msg +
                                "</div></div>";
            msg = null;
            return true;
        }

        private bool putOnSession = false;
        public bool PutOnSession
        {
            get { return putOnSession; }
            set { putOnSession = value; }
        }
    }

    public class EntitySurgeryRecordPinNameBedNo
    {
        public int registrationno { get; set; }
        public string code { get; set; }
        public int NameId { get; set; }
        public string Name { get; set; }
        public string BedName { get; set; }
        public int BedId { get; set; }
        public string PinName { get; set; }
        public string Ward { get; set; }
        public string Age { get; set; }
        public string Sex { get; set; }
        public string PrimaryConsultant { get; set; }
        public string Package { get; set; }
        public string Company { get; set; } // Code
        public string CompanyName { get; set; }
        public string Category { get; set; }

    }
    public class RepositorySurgeryRecordPinNameBedNo
    {
        public RepositorySurgeryRecordPinNameBedNo() { }

        private IQueryable<EntitySurgeryRecordPinNameBedNo> queryable;
        private IQueryable<EntitySurgeryRecordPinNameBedNo> GetQuery(string searchTerm)
        {
            searchTerm = searchTerm.ToLower();
            IQueryable<EntitySurgeryRecordPinNameBedNo> q = null;

            if (this.SearchType == ennType.Pin) q = queryable.Where(a => a.PinName.ToLower().Like(searchTerm));
            else if (this.SearchType == ennType.PinName) q = queryable.Where(a => a.Name.ToLower().Like(searchTerm));
            else if (this.SearchType == ennType.BedNo) q = queryable.Where(a => a.BedName.ToLower().Like(searchTerm));

            return q;
        }
        public int GetCount(string searchTerm, int pageSize, int pageNum)
        {
            return GetQuery(searchTerm).Count();
        }
        public IQueryable<EntitySurgeryRecordPinNameBedNo> Queryable
        {
            get { return queryable; }
            set { queryable = value; }
        }

        public enum ennType : int
        {
            Pin=0,
            PinName,
            BedNo
        }
        private ennType searchType = ennType.Pin;
        public ennType SearchType
        {
            get { return searchType; }
            set { searchType = value; }
        }

        public void InitData()
        {
            DBHelper db = new DBHelper();
            List<EntitySurgeryRecordPinNameBedNo> list = db.ExecuteSPAndReturnDataTable("ZZZ_Select2_SurgerRecordPinNameBedNo").ToList<EntitySurgeryRecordPinNameBedNo>();
            this.Queryable = list.AsQueryable();
        }
        public List<EntitySurgeryRecordPinNameBedNo> Get(string searchTerm, int pageSize, int pageNum)
        {
            return GetQuery(searchTerm).Skip(pageSize * (pageNum - 1)).Take(pageSize).ToList();
        }

    }

    public class EntitySurgeryRecordShiftingNurses
    {
        public int id { get; set; }
        public string name { get; set; }
    }
    public class RepositorySurgeryRecordShiftNurses
    {
        public RepositorySurgeryRecordShiftNurses() { }

        private IQueryable<EntitySurgeryRecordShiftingNurses> queryable;
        private IQueryable<EntitySurgeryRecordShiftingNurses> GetQuery(string searchTerm)
        {
            searchTerm = searchTerm.ToLower();
            return queryable.Where
                   (
                        a =>
                        a.name.ToLower().Like(searchTerm)
                   );
        }
        public int GetCount(string searchTerm, int pageSize, int pageNum)
        {
            return GetQuery(searchTerm).Count();
        }
        public IQueryable<EntitySurgeryRecordShiftingNurses> Queryable
        {
            get { return queryable; }
            set { queryable = value; }
        }
        public void InitData(int pId)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@departmentid",pId)
            };
            List<EntitySurgeryRecordShiftingNurses> list = db.ExecuteSPAndReturnDataTable("ZZZ_Select2_SurgerRecordShiftingNurses").ToList<EntitySurgeryRecordShiftingNurses>();
            this.Queryable = list.AsQueryable();
        }
        public List<EntitySurgeryRecordShiftingNurses> Get(string searchTerm, int pageSize, int pageNum)
        {
            return GetQuery(searchTerm).Skip(pageSize * (pageNum - 1)).Take(pageSize).ToList();
        }

    }

    public class EntitySurgeryRecordCirculatoryNurses
    {
        public int id { get; set; }
        public string name { get; set; }
    }
    public class RepositorySurgeryRecordCirculatoryNurses
    {
        public RepositorySurgeryRecordCirculatoryNurses() { }

        private IQueryable<EntitySurgeryRecordCirculatoryNurses> queryable;
        private IQueryable<EntitySurgeryRecordCirculatoryNurses> GetQuery(string searchTerm)
        {
            searchTerm = searchTerm.ToLower();
            return queryable.Where
                   (
                        a =>
                        a.name.ToLower().Like(searchTerm)
                   );
        }
        public int GetCount(string searchTerm, int pageSize, int pageNum)
        {
            return GetQuery(searchTerm).Count();
        }
        public IQueryable<EntitySurgeryRecordCirculatoryNurses> Queryable
        {
            get { return queryable; }
            set { queryable = value; }
        }
        public void InitData()
        {
            DBHelper db = new DBHelper();
            List<EntitySurgeryRecordCirculatoryNurses> list = db.ExecuteSPAndReturnDataTable("ZZZ_Select2_SurgerRecordCirculatoryNurses").ToList<EntitySurgeryRecordCirculatoryNurses>();
            this.Queryable = list.AsQueryable();
        }
        public List<EntitySurgeryRecordCirculatoryNurses> Get(string searchTerm, int pageSize, int pageNum)
        {
            return GetQuery(searchTerm).Skip(pageSize * (pageNum - 1)).Take(pageSize).ToList();
        }

    }

    public class EntitySurgeryRecordOperatingTheatres
    {
        public int id { get; set; }
        public string name { get; set; }
    }
    public class RepositorySurgeryRecordOperatingTheatres
    {
        public RepositorySurgeryRecordOperatingTheatres() { }

        private IQueryable<EntitySurgeryRecordOperatingTheatres> queryable;
        private IQueryable<EntitySurgeryRecordOperatingTheatres> GetQuery(string searchTerm)
        {
            searchTerm = searchTerm.ToLower();
            return queryable.Where
                   (
                        a =>
                        a.name.ToLower().Like(searchTerm)
                   );
        }
        public int GetCount(string searchTerm, int pageSize, int pageNum)
        {
            return GetQuery(searchTerm).Count();
        }
        public IQueryable<EntitySurgeryRecordOperatingTheatres> Queryable
        {
            get { return queryable; }
            set { queryable = value; }
        }
        public void InitData(int pId)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@stationId",pId)
            };
            List<EntitySurgeryRecordOperatingTheatres> list = db.ExecuteSPAndReturnDataTable("ZZZ_Select2_SurgerRecordOperatingTheatres").ToList<EntitySurgeryRecordOperatingTheatres>();
            this.Queryable = list.AsQueryable();
        }
        public List<EntitySurgeryRecordOperatingTheatres> Get(string searchTerm, int pageSize, int pageNum)
        {
            return GetQuery(searchTerm).Skip(pageSize * (pageNum - 1)).Take(pageSize).ToList();
        }

    }
    
    public class EntitySurgeryRecordAnaesthesia
    {
        public int id { get; set; }
        public string name { get; set; }
        public int? type { get; set; }
        public int? departmentId { get; set; }
    }
    public class RepositorySurgeryRecordAnaesthesia
    {
        public RepositorySurgeryRecordAnaesthesia() { }

        private IQueryable<EntitySurgeryRecordAnaesthesia> queryable;
        private IQueryable<EntitySurgeryRecordAnaesthesia> GetQuery(string searchTerm)
        {
            searchTerm = searchTerm.ToLower();
            return queryable.Where
                   (
                        a =>
                        a.name.ToLower().Like(searchTerm)
                   );
        }
        public int GetCount(string searchTerm, int pageSize, int pageNum)
        {
            return GetQuery(searchTerm).Count();
        }
        public IQueryable<EntitySurgeryRecordAnaesthesia> Queryable
        {
            get { return queryable; }
            set { queryable = value; }
        }
        public void InitData()
        {
            DBHelper db = new DBHelper();
            List<EntitySurgeryRecordAnaesthesia> list = db.ExecuteSPAndReturnDataTable("ZZZ_Select2_SurgerRecordAnaesthesia").ToList<EntitySurgeryRecordAnaesthesia>();
            this.Queryable = list.AsQueryable();
        }
        public List<EntitySurgeryRecordAnaesthesia> Get(string searchTerm, int pageSize, int pageNum)
        {
            return GetQuery(searchTerm).Skip(pageSize * (pageNum - 1)).Take(pageSize).ToList();
        }

    }
    
    public class EntitySurgeryRecordSurgeryList
    {
        public int id { get; set; }
        public string name { get; set; }
        public int Count { get; set; }
        public int No { get; set; }
    }
    public class RepositorySurgeryRecordSurgeryList
    {
        public RepositorySurgeryRecordSurgeryList() { }

        private IQueryable<EntitySurgeryRecordSurgeryList> queryable;
        private IQueryable<EntitySurgeryRecordSurgeryList> GetQuery(string searchTerm)
        {
            searchTerm = searchTerm.ToLower();
            return queryable.Where
                   (
                        a =>
                        a.name.ToLower().Like(searchTerm)
                   );
        }
        public int GetCount(string searchTerm, int pageSize, int pageNum)
        {
            return GetQuery(searchTerm).Count();
        }
        public IQueryable<EntitySurgeryRecordSurgeryList> Queryable
        {
            get { return queryable; }
            set { queryable = value; }
        }
        public void InitData(int psurgeryRecordId, int pIsSelected)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@surgeryRecordId",psurgeryRecordId),
                new SqlParameter("@isSelected",pIsSelected)
            };
            this.List = db.ExecuteSPAndReturnDataTable("ZZZ_Select2_SurgerRecordSurgeryList").ToList<EntitySurgeryRecordSurgeryList>();
            this.Queryable = list.AsQueryable();
        }
        public static List<EntitySurgeryRecordSurgeryList> GetData(int psurgeryRecordId)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@surgeryRecordId",psurgeryRecordId),
                new SqlParameter("@isSelected", 1)
            };
            return db.ExecuteSPAndReturnDataTable("ZZZ_Select2_SurgerRecordSurgeryList").ToList<EntitySurgeryRecordSurgeryList>();
        }
        public List<EntitySurgeryRecordSurgeryList> Get(string searchTerm, int pageSize, int pageNum)
        {
            return GetQuery(searchTerm).Skip(pageSize * (pageNum - 1)).Take(pageSize).ToList();
        }

        private List<EntitySurgeryRecordSurgeryList> list;
        public List<EntitySurgeryRecordSurgeryList> List
        {
            get { return list; }
            set { list = value; }
        }
    }

    public class EntitySurgeryRecordSurgeonList
    {
        public int id { get; set; }
        public string name { get; set; }
    }
    public class RepositorySurgeryRecordSurgeonList
    {
        public RepositorySurgeryRecordSurgeonList() { }

        private IQueryable<EntitySurgeryRecordSurgeonList> queryable;
        private IQueryable<EntitySurgeryRecordSurgeonList> GetQuery(string searchTerm)
        {
            searchTerm = searchTerm.ToLower();
            return queryable.Where
                   (
                        a =>
                        a.name.ToLower().Like(searchTerm)
                   );
        }
        public int GetCount(string searchTerm, int pageSize, int pageNum)
        {
            return GetQuery(searchTerm).Count();
        }
        public IQueryable<EntitySurgeryRecordSurgeonList> Queryable
        {
            get { return queryable; }
            set { queryable = value; }
        }
        public void InitData(int psurgeryRecordId, int pIsSelected)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@surgeryRecordId",psurgeryRecordId),
                new SqlParameter("@isSelected",pIsSelected)
            };
            this.List = db.ExecuteSPAndReturnDataTable("ZZZ_Select2_SurgerRecordSurgeonList").ToList<EntitySurgeryRecordSurgeonList>();
            this.Queryable = list.AsQueryable();
        }
        public static List<EntitySurgeryRecordSurgeonList> GetData(int psurgeryRecordId)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@surgeryRecordId",psurgeryRecordId),
                new SqlParameter("@isSelected",1)
            };
            return db.ExecuteSPAndReturnDataTable("ZZZ_Select2_SurgerRecordSurgeonList").ToList<EntitySurgeryRecordSurgeonList>();
        }
        public List<EntitySurgeryRecordSurgeonList> Get(string searchTerm, int pageSize, int pageNum)
        {
            return GetQuery(searchTerm).Skip(pageSize * (pageNum - 1)).Take(pageSize).ToList();
        }

        private List<EntitySurgeryRecordSurgeonList> list;
        public List<EntitySurgeryRecordSurgeonList> List
        {
            get { return list; }
            set { list = value; }
        }

    }

    public class EntitySurgeryRecordAsstSurgeonsList
    {
        public int id { get; set; }
        public string name { get; set; }
    }
    public class RepositorySurgeryRecordAsstSurgeonsList
    {
        public RepositorySurgeryRecordAsstSurgeonsList() { }

        private IQueryable<EntitySurgeryRecordAsstSurgeonsList> queryable;
        private IQueryable<EntitySurgeryRecordAsstSurgeonsList> GetQuery(string searchTerm)
        {
            searchTerm = searchTerm.ToLower();
            return queryable.Where
                   (
                        a =>
                        a.name.ToLower().Like(searchTerm)
                   );
        }
        public int GetCount(string searchTerm, int pageSize, int pageNum)
        {
            return GetQuery(searchTerm).Count();
        }
        public IQueryable<EntitySurgeryRecordAsstSurgeonsList> Queryable
        {
            get { return queryable; }
            set { queryable = value; }
        }
        public void InitData(int psurgeryRecordId, int pIsSelected)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@surgeryRecordId",psurgeryRecordId),
                new SqlParameter("@isSelected",pIsSelected)
            };
            this.List = db.ExecuteSPAndReturnDataTable("ZZZ_Select2_SurgerRecordAsstSurgeonsList").ToList<EntitySurgeryRecordAsstSurgeonsList>();
            this.Queryable = list.AsQueryable();
        }
        public static List<EntitySurgeryRecordAsstSurgeonsList> GetData(int psurgeryRecordId)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@surgeryRecordId",psurgeryRecordId),
                new SqlParameter("@isSelected",1)
            };
            return db.ExecuteSPAndReturnDataTable("ZZZ_Select2_SurgerRecordAsstSurgeonsList").ToList<EntitySurgeryRecordAsstSurgeonsList>();
        }
        public List<EntitySurgeryRecordAsstSurgeonsList> Get(string searchTerm, int pageSize, int pageNum)
        {
            return GetQuery(searchTerm).Skip(pageSize * (pageNum - 1)).Take(pageSize).ToList();
        }

        private List<EntitySurgeryRecordAsstSurgeonsList> list;
        public List<EntitySurgeryRecordAsstSurgeonsList> List
        {
            get { return list; }
            set { list = value; }
        }

    }

    public class EntitySurgeryRecordAnaesthetistList
    {
        public int id { get; set; }
        public string name { get; set; }
    }
    public class RepositorySurgeryRecordAnaesthetistList
    {
        public RepositorySurgeryRecordAnaesthetistList() { }

        private IQueryable<EntitySurgeryRecordAnaesthetistList> queryable;
        private IQueryable<EntitySurgeryRecordAnaesthetistList> GetQuery(string searchTerm)
        {
            searchTerm = searchTerm.ToLower();
            return queryable.Where
                   (
                        a =>
                        a.name.ToLower().Like(searchTerm)
                   );
        }
        public int GetCount(string searchTerm, int pageSize, int pageNum)
        {
            return GetQuery(searchTerm).Count();
        }
        public IQueryable<EntitySurgeryRecordAnaesthetistList> Queryable
        {
            get { return queryable; }
            set { queryable = value; }
        }
        public void InitData(int psurgeryRecordId, int pIsSelected)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@surgeryRecordId",psurgeryRecordId),
                new SqlParameter("@isSelected",pIsSelected)
            };
            this.List = db.ExecuteSPAndReturnDataTable("ZZZ_Select2_SurgerRecordAnaesthetistList").ToList<EntitySurgeryRecordAnaesthetistList>();
            this.Queryable = list.AsQueryable();
        }
        public static List<EntitySurgeryRecordAnaesthetistList> GetData(int psurgeryRecordId)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@surgeryRecordId",psurgeryRecordId),
                new SqlParameter("@isSelected", 1)
            };
            return db.ExecuteSPAndReturnDataTable("ZZZ_Select2_SurgerRecordAnaesthetistList").ToList<EntitySurgeryRecordAnaesthetistList>();
        }
        public List<EntitySurgeryRecordAnaesthetistList> Get(string searchTerm, int pageSize, int pageNum)
        {
            return GetQuery(searchTerm).Skip(pageSize * (pageNum - 1)).Take(pageSize).ToList();
        }

        private List<EntitySurgeryRecordAnaesthetistList> list;
        public List<EntitySurgeryRecordAnaesthetistList> List
        {
            get { return list; }
            set { list = value; }
        }

    }

    public class EntitySurgeryRecordScrubNurseList
    {
        public int id { get; set; }
        public string name { get; set; }
    }
    public class RepositorySurgeryRecordScrubNurseList
    {
        public RepositorySurgeryRecordScrubNurseList() { }

        private IQueryable<EntitySurgeryRecordScrubNurseList> queryable;
        private IQueryable<EntitySurgeryRecordScrubNurseList> GetQuery(string searchTerm)
        {
            searchTerm = searchTerm.ToLower();
            return queryable.Where
                   (
                        a =>
                        a.name.ToLower().Like(searchTerm)
                   );
        }
        public int GetCount(string searchTerm, int pageSize, int pageNum)
        {
            return GetQuery(searchTerm).Count();
        }
        public IQueryable<EntitySurgeryRecordScrubNurseList> Queryable
        {
            get { return queryable; }
            set { queryable = value; }
        }
        public void InitData(int psurgeryRecordId, int pIsSelected)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@surgeryRecordId",psurgeryRecordId),
                new SqlParameter("@isSelected",pIsSelected)
            };
            this.List = db.ExecuteSPAndReturnDataTable("ZZZ_Select2_SurgerRecordScrubNurseList").ToList<EntitySurgeryRecordScrubNurseList>();
            this.Queryable = list.AsQueryable();
        }
        public static List<EntitySurgeryRecordScrubNurseList> GetData(int psurgeryRecordId)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@surgeryRecordId",psurgeryRecordId),
                new SqlParameter("@isSelected",1)
            };
            return db.ExecuteSPAndReturnDataTable("ZZZ_Select2_SurgerRecordScrubNurseList").ToList<EntitySurgeryRecordScrubNurseList>();            
        }
        public List<EntitySurgeryRecordScrubNurseList> Get(string searchTerm, int pageSize, int pageNum)
        {
            return GetQuery(searchTerm).Skip(pageSize * (pageNum - 1)).Take(pageSize).ToList();
        }

        private List<EntitySurgeryRecordScrubNurseList> list;
        public List<EntitySurgeryRecordScrubNurseList> List
        {
            get { return list; }
            set { list = value; }
        }

    }

    public class EntitySurgeryRecordEquipmentList
    {
        public int id { get; set; }
        public string name { get; set; }
    }
    public class RepositorySurgeryRecordEquipmentList
    {
        public RepositorySurgeryRecordEquipmentList() { }

        private IQueryable<EntitySurgeryRecordEquipmentList> queryable;
        private IQueryable<EntitySurgeryRecordEquipmentList> GetQuery(string searchTerm)
        {
            searchTerm = searchTerm.ToLower();
            return queryable.Where
                   (
                        a =>
                        a.name.ToLower().Like(searchTerm)
                   );
        }
        public int GetCount(string searchTerm, int pageSize, int pageNum)
        {
            return GetQuery(searchTerm).Count();
        }
        public IQueryable<EntitySurgeryRecordEquipmentList> Queryable
        {
            get { return queryable; }
            set { queryable = value; }
        }
        public void InitData(int psurgeryRecordId, int pIsSelected)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@surgeryRecordId",psurgeryRecordId),
                new SqlParameter("@isSelected",pIsSelected)
            };
            this.List = db.ExecuteSPAndReturnDataTable("ZZZ_Select2_SurgerRecordEquipmentList").ToList<EntitySurgeryRecordEquipmentList>();
            this.Queryable = list.AsQueryable();
        }
        public static List<EntitySurgeryRecordEquipmentList> GetData(int psurgeryRecordId)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@surgeryRecordId",psurgeryRecordId),
                new SqlParameter("@isSelected",1)
            };
            return db.ExecuteSPAndReturnDataTable("ZZZ_Select2_SurgerRecordEquipmentList").ToList<EntitySurgeryRecordEquipmentList>();
        }
        public List<EntitySurgeryRecordEquipmentList> Get(string searchTerm, int pageSize, int pageNum)
        {
            return GetQuery(searchTerm).Skip(pageSize * (pageNum - 1)).Take(pageSize).ToList();
        }

        private List<EntitySurgeryRecordEquipmentList> list;
        public List<EntitySurgeryRecordEquipmentList> List
        {
            get { return list; }
            set { list = value; }
        }

    }

}
