
using System;
using System.Configuration;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity.Core.EntityClient;
using OTEf.Core.Model;
using OTEf.Core.Helper;
using System.Data.Entity.ModelConfiguration.Conventions;

namespace OTEf.Infra
{
    public class OTEfDbContext : DbContext
    {

        public OTEfDbContext()
            : base()
        {
            string encrypted = System.Configuration.ConfigurationManager.ConnectionStrings["SghDbContextConnString"].ToString();
            string decrypted = Cypher.Decrypt(encrypted, true);
            Database.Connection.ConnectionString = decrypted;
            Database.CreateIfNotExists();
        }

        //public DbSet<PatientCaseHistory> PatientCaseHistory { get; set; }
        //public DbSet<CaseHistoryInfo> CaseHistoryInfo { get; set; }

        public DbSet<MRSAScreening> MRSAScreeningAuditTool { get; set; }
        public DbSet<OTItem> OTItem { get; set; }
        public DbSet<OTInstrument> OTInstrument { get; set; }
        public DbSet<OTUnitOfMeasurement> OTUnitOfMeasurement { get; set; }
        public DbSet<OTItemCount> OTItemCount { get; set; }
        public DbSet<OTBasicInstrumentCount> OTBasicInstrumentCount { get; set; }
        public DbSet<OTSeparateInstrumentCount> OTSeparateInstrumentCount { get; set; }
        public DbSet<OTRoomCountSheet> OTRoomCountSheet { get; set; }
        public DbSet<PreOperativeMedication> PreOperativeMedication { get; set; }
        public DbSet<PreOperativeCheck> PreOperativeCheck { get; set; }
        public DbSet<PreOperativeChart> PreOperativeChart { get; set; }
        public DbSet<PreOpChartEvaluation> PreOpChartEvaluation { get; set; }
        public DbSet<PreOperativeCheckPerformed> PreOperativeCheckPerformed { get; set; }
        public DbSet<PreOperativeMedicationGiven> PreOperativeMedicationGiven { get; set; }
        public DbSet<PreOperativeChecklist> PreOperativeCheckList { get; set; }
        public DbSet<OTMedicalReport> OTMedicalReport { get; set; }
        public DbSet<PreSedation> PreSedation { get; set; }
        public DbSet<SedationMonitoring> SedationMonitoring { get; set; }
        public DbSet<SedationRecoveryRoomRecord> SedationRecoveryRoomRecord { get; set; }
        public DbSet<ConsciousSedationRecord> ConciousSedationRecord { get; set; }
        public DbSet<TimeoutForm> TimeoutForm { get; set; }
        public DbSet<PresedationProposedProcedure> PresedationProposedProcedure { get; set; }
        public DbSet<IntegratedCarePlan> IntegratedCarePlan { get; set; }


        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            //modelBuilder.Entity<PatientCaseHistory>().ToTable("PatientCaseHistory", "OTEf");
            modelBuilder.Entity<MRSAScreening>().ToTable("MRSAScreening", "OTEf");
            modelBuilder.Entity<OTItem>().ToTable("OTItem", "OTEf");
            modelBuilder.Entity<OTInstrument>().ToTable("OTInstrument", "OTEf");
            modelBuilder.Entity<OTUnitOfMeasurement>().ToTable("OTUnitOfMeasurement", "OTEf");
            modelBuilder.Entity<OTItemCount>().ToTable("OTItemCount", "OTEf");
            modelBuilder.Entity<OTBasicInstrumentCount>().ToTable("OTBasicInstrumentCount", "OTEf");
            modelBuilder.Entity<OTSeparateInstrumentCount>().ToTable("OTSeparateInstrumentCount", "OTEf");
            modelBuilder.Entity<OTRoomCountSheet>().ToTable("OTRoomCountSheet", "OTEf");
            modelBuilder.Entity<PreOperativeMedication>().ToTable("PreOperativeMedication", "OTEf");
            modelBuilder.Entity<PreOperativeCheck>().ToTable("PreOperativeCheck", "OTEf");
            modelBuilder.Entity<PreOperativeChart>().ToTable("PreOperativeChart", "OTEf");
            modelBuilder.Entity<PreOpChartEvaluation>().ToTable("PreOpChartEvaluation", "OTEf");
            modelBuilder.Entity<PreOperativeCheckPerformed>().ToTable("PreOperativeCheckPerformed", "OTEf");
            modelBuilder.Entity<PreOperativeMedicationGiven>().ToTable("PreOperativeMedicationGiven", "OTEf");
            modelBuilder.Entity<PreOperativeChecklist>().ToTable("PreOperativeCheckList", "OTEf");
            modelBuilder.Entity<OTMedicalReport>().ToTable("OTMedicalReport", "OTEf");
            modelBuilder.Entity<PreSedation>().ToTable("PreSedation", "OTEf");
            modelBuilder.Entity<SedationMonitoring>().ToTable("SedationMonitoring", "OTEf");
            modelBuilder.Entity<SedationRecoveryRoomRecord>().ToTable("SedationRecoveryRoomRecord", "OTEf");
            modelBuilder.Entity<ConsciousSedationRecord>().ToTable("ConsciousSedationRecord", "OTEf");
            modelBuilder.Entity<TimeoutForm>().ToTable("TimeoutForm", "OTEf");

            modelBuilder.Entity<PresedationProposedProcedure>().ToTable("PresedationProposedProcedure", "OTEf");
            modelBuilder.Entity<IntegratedCarePlan>().ToTable("IntegratedCarePlan", "OTEf");
            modelBuilder.Entity<IntegratedCarePlan_OutComeStatus>().ToTable("IntegratedCarePlan_OutComeStatus", "OTEf");



        }

    }
}
