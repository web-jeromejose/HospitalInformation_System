using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OTEf.Core.Model
{
    public class OTMedicalReport : PatientCommon
    {
        public int Id { get; set; }
        public DateTime MedicalReportDate { get; set; }
        public DateTime? DoctorDateTime { get; set; }
        public int? Age { get; set; }
        public int? GenderId { get; set; }
        public int? NationalityId { get; set; }
        public int? DoctorId { get; set; }

        public string GenderName { get; set; }
        public string NationalityName { get; set; }
        public string Complaints { get; set; }
        public string Examination { get; set; }
        public string Investigations { get; set; }
        public string Treatment { get; set; }
        public string Prescription { get; set; }
        public string InitialFinalDiagnosis { get; set; }
        public string Icd { get; set; }
        public string DoctorName { get; set; }
        public string Recommendation { get; set; }
    }
}
