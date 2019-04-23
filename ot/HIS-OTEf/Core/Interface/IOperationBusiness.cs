using OTEf.Core.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OTEf.Core.Interface
{
    public interface IOperationBusiness
    {
        List<OTRoomCountSheet> GetAllOTRoomCountSheets();
        OTRoomCountSheet GetOTRoomCountSheet(int id);
        int AddOTRoomCountSheet(OTRoomCountSheet countsheet);
        bool UpdateOTRoomCountSheet(OTRoomCountSheet countsheet);
        bool DeleteOTRoomCountSheet(OTRoomCountSheet countsheet);
        List<OTRoomCountSheet> GetPagedOTRoomCountSheetList(string searchBy, int take, int skip, string sortBy,
                                                    bool sortDir, out int filteredResultsCount, out int totalResultsCount);

        List<PreOperativeChecklist> GetAllPreOperativeChecklist();
        PreOperativeChecklist GetPreOperativeChecklist(int id);
        int AddPreOperativeChecklist(PreOperativeChecklist checklist);
        bool UpdatePreOperativeChecklist(PreOperativeChecklist checklist);
        bool DeletePreOperativeChecklist(PreOperativeChecklist checklist);
        List<PreOperativeChecklist> GetPagedPreOperativeChecklist(string searchBy, int take, int skip, string sortBy,
                                                    bool sortDir, out int filteredResultsCount, out int totalResultsCount);

        List<OTMedicalReport> GetAllOTMedicalReport();
        OTMedicalReport GetOTMedicalReport(int id);
        int AddOTMedicalReport(OTMedicalReport checklist);
        bool UpdateOTMedicalReport(OTMedicalReport checklist);
        bool DeleteOTMedicalReport(OTMedicalReport checklist);
        List<OTMedicalReport> GetPagedOTMedicalReport(string searchBy, int take, int skip, string sortBy,
                                                    bool sortDir, out int filteredResultsCount, out int totalResultsCount);

        List<ConsciousSedationRecord> GetAllConsciousSedationRecord();
        ConsciousSedationRecord GetConsciousSedationRecord(int id);
        int AddConsciousSedationRecord(ConsciousSedationRecord record);
        bool UpdateConsciousSedationRecord(ConsciousSedationRecord record);
        bool DeleteConsciousSedationRecord(ConsciousSedationRecord record);
        List<ConsciousSedationRecord> GetPagedConsciousSedationRecord(string searchBy, int take, int skip, string sortBy,
                                                    bool sortDir, out int filteredResultsCount, out int totalResultsCount);

        List<TimeoutForm> GetAllTimeoutForm();
        TimeoutForm GetTimeoutForm(int id);
        int AddTimeoutForm(TimeoutForm record);
        bool UpdateTimeoutForm(TimeoutForm record);
        bool DeleteTimeoutForm(TimeoutForm record);
        List<TimeoutForm> GetPagedTimeoutForm(string searchBy, int take, int skip, string sortBy,
                                                    bool sortDir, out int filteredResultsCount, out int totalResultsCount);

        List<IntegratedCarePlan> GetAllIntegratedCarePlan();
        IntegratedCarePlan GetIntegratedCarePlan(int id);
        int AddIntegratedCarePlan(IntegratedCarePlan record);
        bool UpdateIntegratedCarePlan(IntegratedCarePlan record);
        bool DeleteIntegratedCarePlan(IntegratedCarePlan record);
        List<IntegratedCarePlan> GetPagedIntegratedCarePlan(string searchBy, int take, int skip, string sortBy,
                                                    bool sortDir, out int filteredResultsCount, out int totalResultsCount);








    }
}
