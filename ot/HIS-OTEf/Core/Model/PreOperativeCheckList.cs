using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OTEf.Core.Model
{
    public class PreOperativeChecklist : PatientCommon
    {
        public int Id { get; set; }
        public int ProcedureId { get; set; }
        public int ORNurseId { get; set; }
        public int WardNurseId { get; set; }
        public int Pulse { get; set; }
        public int Temperature { get; set; }
        public int ResperatoryRate { get; set; }
        public int PainScore { get; set; }

        public string BloodPressure { get; set; }
        public string ProcedureName { get; set; }
        public string ORStaffComment { get; set; }
        public string ORNurseName { get; set; }
        public string WardNurseName { get; set; }

        public DateTime ProcedureDate { get; set; }
        public DateTime? VitalSignEvalDatetime { get; set; }
        public DateTime? NPO_StartDatetime { get; set; }
        public DateTime? Voided_StartDatetime { get; set; }
        public DateTime? ORTrasferDatetime { get; set; }
        public DateTime? ORNurse_AcknowledgeDateTime { get; set; }
        public DateTime? ORWard_AcknowledgeDateTime { get; set; }

        public virtual List<PreOpChartEvaluation> ChartEvaluations { get; set; }
        public virtual List<PreOperativeCheckPerformed> CheckedItems { get; set; }
        public virtual List<PreOperativeMedicationGiven> Medications { get; set; }


    }
}
