using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OTEf.Core.Model
{
    public class PreSedation :BaseModel
    {
        public PreSedation()
        {
            this.ProposedProcedure = new List<PresedationProposedProcedure>();
        }
        public int Id { get; set; }
        public int StationId { get; set; }

        public int HR { get; set; }
        public int RR { get; set; }
        public int SedationType { get; set; }
        public int ConsultantId { get; set; }
        public int PhysicianId { get; set; }
        public int CigarettesPerDay { get; set; }
        
        public double LiquorIntakePerML { get; set; }
        public double Weight { get; set; }
        public double Temperature {get;set;}

        public string BP { get; set; }
        public string StationName { get; set; }
        public string ConsultantName { get; set; }
        public string PreProcedureDiagnosis { get; set; }
        public string ClinicalHistory { get; set; }
        public string PrevMedicalHistory { get; set; }
        public string CurrentMedicationTherapy { get; set; }
        public string Investigations { get; set; }
        public string PlanCare { get; set; }
        public string IVLines { get; set; }
        public string OtherPreSedateData { get; set; }
        public string PhysicianName { get; set; }
        public string Allergies { get; set; }
        public string PhysicalExam { get; set; }
        public string CVS { get; set; }
        public string RS { get; set; }
        public string CNS { get; set; }

        public bool MonitorNIBP { get; set; }
        public bool MonitorECG { get; set; }
        public bool MonitorPulseOxymetry { get; set; }
        public bool MonitorRespiratoryRate { get; set; }
        public bool MonitorTemperature { get; set; }
        public bool MonitorETC02 { get; set; }
        public bool HasAllergies { get; set; }
        public bool IsAlcoholic { get; set; }
        public bool IsSmoker { get; set; }

        public virtual List<PresedationProposedProcedure> ProposedProcedure { get; set; }

    }
}
