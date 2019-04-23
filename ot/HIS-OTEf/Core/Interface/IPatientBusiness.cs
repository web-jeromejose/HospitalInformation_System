using OTEf.Core.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OTEf.Core.Interface
{
    public interface IPatientBusiness
    {
        List<PatientCaseHistory> GetAllPatientCaseHistory(int regNo);
        bool AddPatientCaseHistory(PatientCaseHistory patientCaseHistory);
        bool UpdatePatientCaseHistory(PatientCaseHistory patientCaseHistory);

        bool AddCaseHistoryInfo(CaseHistoryInfo caseHistoryInfo);
        bool UpdateCaseHistoryInfo(CaseHistoryInfo caseHistoryInfo);

        MRSAScreening GetMRSAScreening(int Id);

        int AddMRSAScreening(MRSAScreening screening);

        bool DeleteMRSAScreening(MRSAScreening screening);

        bool UpdateMRSAScreening(MRSAScreening screening);

        List<MRSAScreening> MRSAScreeningList();

        List<MRSAScreening> GetPagedMRSAScreeningList(string searchBy, int take, int skip, string sortBy, 
                                                     bool sortDir,out int filteredResultsCount, out int totalResultsCount);

    }
}
