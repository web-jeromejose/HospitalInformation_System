using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OTEf.Core.Model
{
    public class PreAnestheticRecord : PatientCommon
    {
        public int Id { get; set; }
        public DateTime EntryDateTime { get; set; }
        public int Age { get; set; }
        public int GenderId { get; set; }
        public string GenderName { get; set; }
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public string Consultant { get; set; }
        public int BP { get; set; }
        public int HR { get; set; }
        public int Temp { get; set; }
        public int Weight { get; set; }
        public int Height { get; set; }
        public int LMP { get; set; }
        public int UrineTest_Albumin { get; set; }
        public int UrineTest_Glucose { get; set; }
        public int UrineTest_Acetone { get; set; }
        public int BS { get; set; }

        public bool isHistoryTakenFrom_Patient { get; set; }
        public bool isHistoryTakenFrom_Interpreter { get; set; }
        public bool isHistoryTakenFrom_MedicalRecords { get; set; }
        public bool isHistoryTakenFrom_Guardian { get; set; }
        public bool isHistoryTakenFrom_Others { get; set; }
        public string HistoryTakenFrom_Others { get; set; }

        public string PreOperativeDiagnosis { get; set; }
        public string ProposedProcedure { get; set; }
        public bool isProposedProcedure_Elective { get; set; }
        public bool isProposedProcedure_Urgent { get; set; }
        public bool isProposedProcedure_Emergency { get; set; }
        public bool isProposedProcedure_ReOperative { get; set; }

        public string PreviousAnestheticHistory { get; set; }
        public string CurrentMedication { get; set; }

        public string Teeth { get; set; }
        public string LastMeal { get; set; }
        public string BloodCrossedMatched { get; set; }
        public string SpecialRemarks { get; set; }
        public bool isAirway_i { get; set; }
        public bool isAirway_ii { get; set; }
        public bool isAirway_iii { get; set; }
        public bool isAirway_iv { get; set; }
        public bool isAsa_i { get; set; }
        public bool isAsa_ii { get; set; }
        public bool isAsa_iii { get; set; }
        public bool isAsa_iv { get; set; }
        public bool isAsa_v { get; set; }
        public bool isAsa_e { get; set; }
        public bool isAirway_therisk { get; set; }

        public string AnesthesiaPlan { get; set; }
        public int AnesthetistId { get; set; }
        public string AnesthetistName { get; set; }
        public DateTime? AnesthetistDateTime { get; set; }

        public virtual List<PreAnestheticRecordOrganFunction> PreAnestheticRecordOrganFunction { get; set; }
    }

    public class PreAnestheticRecordOrganFunction
    {
        public int Id { get; set; }

        public bool isConsciousness_n { get; set; }
        public bool isConsciousness_p { get; set; }
        public bool isNeurology_n { get; set; }
        public bool isNeurology_p { get; set; }
        public bool isMuscles_n { get; set; }
        public bool isMuscles_p { get; set; }
        public bool isHeart_n { get; set; }
        public bool isHeart_p { get; set; }
        public bool isCirculation_n { get; set; }
        public bool isCirculation_p { get; set; }
        public bool isAuscultation_n { get; set; }
        public bool isAuscultation_p { get; set; }
        public bool isECG_n { get; set; }
        public bool isECG_p { get; set; }
        public bool isEcho_n { get; set; }
        public bool isEcho_p { get; set; }
        public bool isRespSystem_n { get; set; }
        public bool isRespSystem_p { get; set; }
        public bool isCXR_n { get; set; }
        public bool isCXR_p { get; set; }
        public bool isPFT_n { get; set; }
        public bool isPFT_p { get; set; }
        public bool isGITract_n { get; set; }
        public bool isGITract_p { get; set; }
        public bool isLiver_n { get; set; }
        public bool isLiver_p { get; set; }
        public bool isKidney_n { get; set; }
        public bool isKidney_p { get; set; }
        public bool isEndocrinology_n { get; set; }
        public bool isEndocrinology_p { get; set; }
        public bool isInfection_n { get; set; }
        public bool isInfection_p { get; set; }
        public bool isCoagulation_n { get; set; }
        public bool isCoagulation_p { get; set; }
        public bool isUE_n { get; set; }
        public bool isUE_p { get; set; }
        public bool isHematology_n { get; set; }
        public bool isHematology_p { get; set; }

        //Ignore Self referecing Use JSON.net Newtonsoft json in serializing to object to json
        [JsonIgnore]
        public virtual PreAnestheticRecord PreAnestheticRecord { set; get; }

        public virtual int? PreAnestheticRecordId { get; set; }      
    }

    public class PreAnestheticRecordPreOperativeExamination
    {
        public int Id { get; set; }

        public bool isConsciousness_n { get; set; }
        public bool isConsciousness_p { get; set; }
        public bool isNeurology_n { get; set; }
        public bool isNeurology_p { get; set; }
        public bool isMuscles_n { get; set; }
        public bool isMuscles_p { get; set; }
        public bool isHeart_n { get; set; }
        public bool isHeart_p { get; set; }
        public bool isCirculation_n { get; set; }
        public bool isCirculation_p { get; set; }
        public bool isAuscultation_n { get; set; }
        public bool isAuscultation_p { get; set; }
        public bool isECG_n { get; set; }
        public bool isECG_p { get; set; }
        public bool isEcho_n { get; set; }
        public bool isEcho_p { get; set; }
        public bool isRespSystem_n { get; set; }
        public bool isRespSystem_p { get; set; }
        public bool isCXR_n { get; set; }
        public bool isCXR_p { get; set; }
        public bool isPFT_n { get; set; }
        public bool isPFT_p { get; set; }
        public bool isGITract_n { get; set; }
        public bool isGITract_p { get; set; }
        public bool isLiver_n { get; set; }
        public bool isLiver_p { get; set; }
        public bool isKidney_n { get; set; }
        public bool isKidney_p { get; set; }
        public bool isEndocrinology_n { get; set; }
        public bool isEndocrinology_p { get; set; }
        public bool isInfection_n { get; set; }
        public bool isInfection_p { get; set; }
        public bool isCoagulation_n { get; set; }
        public bool isCoagulation_p { get; set; }
        public bool isUE_n { get; set; }
        public bool isUE_p { get; set; }
        public bool isHematology_n { get; set; }
        public bool isHematology_p { get; set; }

        //Ignore Self referecing Use JSON.net Newtonsoft json in serializing to object to json
        [JsonIgnore]
        public virtual PreAnestheticRecord PreAnestheticRecord { set; get; }

        public virtual int? PreAnestheticRecordId { get; set; }
    }

}
