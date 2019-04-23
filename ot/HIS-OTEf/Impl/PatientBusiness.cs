using OTEf.Core.Interface;
using OTEf.Core.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace OTEf.Impl
{

    public class PatientBusiness : BusinessBase, IPatientBusiness
    {

        public PatientBusiness(IDataManager manager)
            : base(manager)
        {
        }

        public List<PatientCaseHistory> GetAllPatientCaseHistory(int regNo)
        {
            return dataManager.PatientCaseHistory.GetAllNoTracking().Where(c => c.RegistrationNo == regNo).ToList();
        }

        public bool AddPatientCaseHistory(PatientCaseHistory patientCaseHistory)
        {
            dataManager.PatientCaseHistory.Add(patientCaseHistory);
            dataManager.PatientCaseHistory.Commit();
            return true;
        }

        public bool UpdatePatientCaseHistory(PatientCaseHistory patientCaseHistory)
        {
            var caseToUpdate = dataManager.PatientCaseHistory.GetById(patientCaseHistory.Id);
            caseToUpdate.EightHoursFasting = patientCaseHistory.EightHoursFasting;
            caseToUpdate.MedicineForAntibiotic = patientCaseHistory.MedicineForAntibiotic;
            caseToUpdate.MedicineForGlands = patientCaseHistory.MedicineForGlands;
            caseToUpdate.MedicineForHaemophilia = patientCaseHistory.MedicineForHaemophilia;
            caseToUpdate.MedicineForSugar = patientCaseHistory.MedicineForSugar;
            caseToUpdate.ModifiedAt = DateTime.Now;
            caseToUpdate.ModifiedByName = patientCaseHistory.ModifiedByName;

            dataManager.PatientCaseHistory.Update(caseToUpdate);
            dataManager.PatientCaseHistory.Commit();
            return true;
        }

        public bool AddCaseHistoryInfo(CaseHistoryInfo caseHistoryInfo)
        {
            dataManager.CaseHistoryInfo.Add(caseHistoryInfo);
            dataManager.CaseHistoryInfo.Commit();
            return true;
        }

        public bool UpdateCaseHistoryInfo(CaseHistoryInfo caseHistoryInfo)
        {
            var infoToUpdate = dataManager.CaseHistoryInfo.GetById(caseHistoryInfo.Id);
            infoToUpdate.PatientCaseType = caseHistoryInfo.PatientCaseType;
            infoToUpdate.Detail = caseHistoryInfo.Detail;
            infoToUpdate.ModifiedAt = DateTime.Now;
            infoToUpdate.ModifiedByName = caseHistoryInfo.ModifiedByName;
            dataManager.CaseHistoryInfo.Update(infoToUpdate);
            dataManager.CaseHistoryInfo.Commit();
            return true;
        }



        public MRSAScreening GetMRSAScreening(int Id)
        {
            return dataManager.MRSAScreening.GetById(Id);
        
        }

        public int AddMRSAScreening(MRSAScreening screening)
        {
            dataManager.MRSAScreening.Add(screening);
            dataManager.MRSAScreening.Commit();

            return screening.Id;
        }

        public bool DeleteMRSAScreening(MRSAScreening screening)
        {

            var data = dataManager.MRSAScreening.GetById(screening.Id);
            data.Active = false;
            data.ModifiedAt = screening.ModifiedAt;
            data.ModifiedById = screening.ModifiedById;
            data.ModifiedByName = screening.ModifiedByName;
            dataManager.MRSAScreening.Update(data);
            dataManager.MRSAScreening.Commit();

            return true;
        }

        public bool UpdateMRSAScreening(MRSAScreening screening)
        {
            var data = dataManager.MRSAScreening.GetById(screening.Id);

            data.HasDiseaseOrIllness = screening.HasDiseaseOrIllness;
            data.Above69YrsOld = screening.Above69YrsOld;
            data.HasHomeNursingHistory = screening.HasHomeNursingHistory;
            data.HasIndwellingDevices = screening.HasIndwellingDevices;
            data.HasPrev_ADM_TRF_OTH_HOSP_Past3Mo = screening.HasPrev_ADM_TRF_OTH_HOSP_Past3Mo;
            data.LocationId = screening.LocationId;
            data.LocationName = screening.LocationName;
            data.ObserverId = screening.ObserverId;
            data.ObserverName = screening.ObserverName;
            data.PatientName = screening.PatientName;
            data.RegistrationNo = screening.RegistrationNo;
            data.Prev_MRSA_Positive = screening.Prev_MRSA_Positive;
            data.ModifiedAt = screening.ModifiedAt;
            data.ModifiedById = screening.ModifiedById;
            data.ModifiedByName = screening.ModifiedByName;
            data.ScreeningDate = screening.ScreeningDate;

            dataManager.MRSAScreening.Update(data);
            dataManager.MRSAScreening.Commit();

            return true;
        }


        public List<MRSAScreening> MRSAScreeningList()
        {
              var query =  dataManager.MRSAScreening.GetAllByCriteria(m=>m.Active= true).OrderByDescending(i=>i.ScreeningDate);

          return query.ToList();
        }

        public List<MRSAScreening>  GetPagedMRSAScreeningList(string searchBy, int take, int skip, string sortBy, 
                                                             bool sortDir,out int filteredResultsCount, out int totalResultsCount)
        {
            filteredResultsCount = 1;
            totalResultsCount = 1;
           
            var query = dataManager.MRSAScreening.GetAllByCriteria(m => m.Active == true);
            totalResultsCount = query.Count();
            filteredResultsCount = query.Count();
            if (String.IsNullOrEmpty(searchBy) == false)
            {
                query = query.Where(i => Regex.IsMatch(i.RegistrationNo.ToString().ToLower(), ".*" + searchBy.ToLower())
                                       || Regex.IsMatch(i.PatientName.ToLower(), ".*" + searchBy.ToLower() + ".*") 
                                     );
                filteredResultsCount = query.Count();
            }

            if(!sortDir)
                return query.OrderByDescending(i => typeof(MRSAScreening).GetProperty(sortBy).GetValue(i, null)).Skip(skip).Take(take).ToList();
            else
               return query.OrderBy(i=>typeof(MRSAScreening).GetProperty( sortBy).GetValue(i,null)).Skip(skip).Take(take).ToList();
        }

    }
}
