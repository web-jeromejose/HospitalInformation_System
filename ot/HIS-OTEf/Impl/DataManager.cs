
using OTEf.Core.Interface;
using OTEf.Core.Model;
using OTEf.Infra;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OTEf.Impl
{
    public class DataManager : IDataManager
    {
        private OTEfDbContext context;

        //DbContext is not a thread safe, 
        //So whenever we need datamanager, we will create a new instance of DbContext
        
        public DataManager()
        {
            context = new OTEfDbContext();
            PatientCaseHistory = new OTEfRepository<PatientCaseHistory>(context);
            CaseHistoryInfo = new OTEfRepository<CaseHistoryInfo>(context);
            MRSAScreening = new OTEfRepository<MRSAScreening>(context);
            OTItem = new OTEfRepository<OTItem>(context);
            OTInstrument = new OTEfRepository<OTInstrument>(context);
            OTUnitOfMeasurement = new OTEfRepository<OTUnitOfMeasurement>(context);
            OTRoomCountSheet = new OTEfRepository<OTRoomCountSheet>(context);
            OTItemCount = new OTEfRepository<OTItemCount>(context);
            OTBasicInstrumentCount = new OTEfRepository<OTBasicInstrumentCount>(context);
            OTSeparateInstrumentCount = new OTEfRepository<OTSeparateInstrumentCount>(context);
            PreOperativeChart = new OTEfRepository<PreOperativeChart>(context);
            PreOperativeCheck = new OTEfRepository<PreOperativeCheck>(context);
            PreOperativeMedication = new OTEfRepository<PreOperativeMedication>(context);
            PreOperativeChecklist = new OTEfRepository<PreOperativeChecklist>(context);
            PreOperativeCheckPerformed = new OTEfRepository<PreOperativeCheckPerformed>(context);
            PreOperativeMedicationGiven = new OTEfRepository<PreOperativeMedicationGiven>(context);
            PreOpChartEvaluation = new OTEfRepository<PreOpChartEvaluation>(context);
            OTMedicalReport = new OTEfRepository<OTMedicalReport>(context);
            ConsciousSedationRecord = new OTEfRepository<ConsciousSedationRecord>(context);

            TimeoutForm = new OTEfRepository<TimeoutForm>(context);
            ConsciousSedationRecord = new OTEfRepository<ConsciousSedationRecord>(context);
            IntegratedCarePlan = new OTEfRepository<IntegratedCarePlan>(context);
            
        }



        public IRepository<PatientCaseHistory> PatientCaseHistory { get; private set; }
        public IRepository<CaseHistoryInfo> CaseHistoryInfo { get; private set; }
        public IRepository<MRSAScreening> MRSAScreening { get; private set; }
        public IRepository<OTItem> OTItem { get; private set; }
        public IRepository<OTInstrument> OTInstrument { get; private set; }
        public IRepository<OTUnitOfMeasurement> OTUnitOfMeasurement { get; private set; }
        public IRepository<OTRoomCountSheet> OTRoomCountSheet { get; private set; }
        public IRepository<OTItemCount> OTItemCount { get; private set; }
        public IRepository<OTBasicInstrumentCount> OTBasicInstrumentCount { get; private set; }
        public IRepository<OTSeparateInstrumentCount> OTSeparateInstrumentCount { get; private set; }
        public IRepository<PreOperativeMedication> PreOperativeMedication { get; private set; }
        public IRepository<PreOperativeCheck> PreOperativeCheck { get; private set; }
        public IRepository<PreOperativeChart> PreOperativeChart { get; private set; }
        public IRepository<PreOperativeCheckPerformed> PreOperativeCheckPerformed { get; private set; }
        public IRepository<PreOperativeMedicationGiven> PreOperativeMedicationGiven { get; private set; }
        public IRepository<PreOpChartEvaluation> PreOpChartEvaluation { get; private set; }
        public IRepository<PreOperativeChecklist> PreOperativeChecklist { get; private set; }
        public IRepository<OTMedicalReport> OTMedicalReport { get; private set; }
        public IRepository<PreSedation> PreSedation { get; private set; }
        public IRepository<SedationMonitoring> SedationMonitoring { get; private set; }
        public IRepository<SedationRecoveryRoomRecord> SedationRecoveryRoomRecord { get; private set; }
        public IRepository<ConsciousSedationRecord> ConsciousSedationRecord { get; private set; }
        public IRepository<PresedationProposedProcedure> PresedationProposedProcedure { get; private set; }

        public IRepository<TimeoutForm> TimeoutForm { get; private set; }
        public IRepository<IntegratedCarePlan> IntegratedCarePlan { get; private set; }


       
    }
}
