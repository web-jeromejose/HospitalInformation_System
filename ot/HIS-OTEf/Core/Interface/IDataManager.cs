using OTEf.Core.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OTEf.Core.Interface
{
    public interface IDataManager
    {
        IRepository<PatientCaseHistory> PatientCaseHistory { get; }
        IRepository<CaseHistoryInfo> CaseHistoryInfo { get; }
        IRepository<MRSAScreening> MRSAScreening { get; }
        IRepository<OTItem> OTItem { get; }
        IRepository<OTInstrument> OTInstrument { get; }
        IRepository<OTUnitOfMeasurement> OTUnitOfMeasurement { get; }
        IRepository<OTRoomCountSheet> OTRoomCountSheet { get; }
        IRepository<OTItemCount> OTItemCount { get; }
        IRepository<OTBasicInstrumentCount> OTBasicInstrumentCount { get; }
        IRepository<OTSeparateInstrumentCount> OTSeparateInstrumentCount { get; }
        IRepository<PreOperativeMedication> PreOperativeMedication { get; }
        IRepository<PreOperativeCheck> PreOperativeCheck { get; }
        IRepository<PreOperativeChart> PreOperativeChart { get; }

        IRepository<PreOperativeCheckPerformed> PreOperativeCheckPerformed { get; }
        IRepository<PreOperativeMedicationGiven> PreOperativeMedicationGiven { get; }
        IRepository<PreOpChartEvaluation> PreOpChartEvaluation { get; }
        IRepository<PreOperativeChecklist> PreOperativeChecklist { get; }
        IRepository<OTMedicalReport> OTMedicalReport { get; }

        IRepository<PreSedation> PreSedation { get; }
        IRepository<SedationMonitoring> SedationMonitoring { get; }
        IRepository<SedationRecoveryRoomRecord> SedationRecoveryRoomRecord { get; }
        IRepository<ConsciousSedationRecord> ConsciousSedationRecord { get; }

        IRepository<PresedationProposedProcedure> PresedationProposedProcedure { get; }

        IRepository<TimeoutForm> TimeoutForm { get; }
        IRepository<IntegratedCarePlan> IntegratedCarePlan { get; }
        

    }
}
