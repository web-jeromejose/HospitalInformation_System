using OTEf.Core.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OTEf.Core.Model
{
    public class PatientCaseHistory : BaseModel
    {
        public int Id { set; get; }
        public int RegistrationNo { set; get; }
        public string PatientName { set; get; }
        public bool? EightHoursFasting { set; get; }
        public bool? MedicineForSugar { set; get; }
        public bool? MedicineForHaemophilia { set; get; }
        public bool? MedicineForAntibiotic { set; get; }
        public bool? MedicineForGlands { set; get; }
        public List<CaseHistoryInfo> Infos { set; get; }
    }

    public class CaseHistoryInfo : BaseModel
    {
        public int Id { set; get; }
        public PatientCaseType PatientCaseType { set; get; }
        public string Detail { set; get; }
    }


    public class MRSAScreening :BaseModel
    {
        public int Id                                { set; get; }
        public int RegistrationNo                    { set; get; }
        public int LocationId                        { get; set; }
        public int ObserverId                        { get; set; }

        public string IssueAuthorityCode             { get; set; }
        public string ObserverName                   { get; set; }
        public string LocationName                   { get; set; }
        public string PatientName                    { get; set; }

      
        public DateTime ScreeningDate                { get; set; }
    
        public bool HasPrev_ADM_TRF_OTH_HOSP_Past3Mo { get; set; }
        public bool Prev_MRSA_Positive               { get; set; }
        public bool Above69YrsOld                    { get; set; }
        public bool HasHomeNursingHistory            { get; set; }
        public bool HasIndwellingDevices             { get; set; }
        public bool HasDiseaseOrIllness              { get; set; }

        public virtual string PIN { 
            get {
                return this.IssueAuthorityCode + "." + this.RegistrationNo.ToString("000000000");
            } 
        }


    }
}
