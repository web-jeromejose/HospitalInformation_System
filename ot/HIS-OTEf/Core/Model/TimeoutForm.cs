using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OTEf.Core.Model
{
    public class TimeoutForm : PatientCommon
    {
        //signin
        public int Id { get; set; }
        public string MRN { get; set; }

        public bool CheckSignIn { get; set; }
        public bool CheckTimeOut { get; set; }
        public bool CheckSignOut { get; set; }

        #region SIGN IN
               
        public bool PatientConfirmISIdentify { get; set; }
        public bool PatientConfirmISSite { get; set; }
        public bool PatientConfirmISProcedure { get; set; }
        public string PatientConfirmProcedureOther { get; set; }
        public bool PatientConfirmISSurgicalConsent { get; set; }
        public bool PatientConfirmISAnesthesiaConsent { get; set; }
        public bool PatientConfirmISLocationProcedure { get; set; }
        public string PatientConfirmLocationProcedureOther { get; set; }

        //is the surgical marked
        public bool SurgicalSiteISMark { get; set; }
        public bool SurgicalSiteISPatientRefuse { get; set; }
        public string SurgicalSiteOther { get; set; }

         public bool isPulseOximeter { get; set; }
         public bool isAnesthesiaMachine { get; set; }
        public bool isPatientAllergy { get; set; }
         public bool isAirway { get; set; }

        //risk of 500ml bloodloss
         public bool RiskBloodLossIS { get; set; }
         public bool RiskBloodLossCurrentHistory { get; set; }
         public bool RiskBloodLossAvailability { get; set; }

         public DateTime? SigninDateTime { get; set; }
         public string Location { get; set; }
        #endregion

        #region TIMEOUT
        
        public bool isTeamIntroduce { get; set; }

        public bool SurgeonRegisterIS { get; set; }
        public bool SurgeonRegisterISProcedure { get; set; }
        public string SurgeonRegisterProcedureOther { get; set; }

        public bool AnticipatedSurgeonBloodlossIS { get; set; }
        public string AnticipatedSurgeonBloodlossOther { get; set; }
        public bool AnticipatedSurgeonEquipIS { get; set; }
        public string AnticipatedSurgeonEquipOther { get; set; }
        public bool AnticipatedSurgeonCriticalIS { get; set; }
        public string AnticipatedSurgeonCriticalOther { get; set; }

        public bool AnesthetistConcernIS { get; set; }
        public string AnesthetistConcernOther { get; set; }

        public bool NurseOdpSterileIS { get; set; }
        public bool NurseOdpSterileISEquipment { get; set; }
        public string NurseOdpSterileEquipmentOther { get; set; }

        public bool isProphylactic { get; set; }

        public bool isProphylacticGiven60mins { get; set; }
        public DateTime? ProphylacticGiven60minsDateTime { get; set; }

         public bool isImagingDisplay { get; set; }

        public DateTime? TimeoutDateTime { get; set; }
        public string TeamPresent { get; set; }
        public int SurgeonId { get; set; }
        public string SurgeonName { get; set; }
        public int AnesthesiologistId { get; set; }
        public string AnesthesiologistName { get; set; }
        public int TechnicianId { get; set; }
        public string TechnicianName { get; set; }
        public int NurseTimeOutId { get; set; }
        public string NurseTimeOutName { get; set; }
        public int ScrubTimeOutId { get; set; }
        public string ScrubTimeOutName { get; set; }
        public string OthersTimeOut   { get; set; }

        #endregion


        #region SIGN OUT
        public bool NurseIntroduceProcedure { get; set; }
        public bool NurseIntroduceInstrument { get; set; }
        public bool NurseIntroduceSpecimen { get; set; }
        public bool NurseIntroduceEquipProblems { get; set; }

        public bool SurgeonNurseRegisterdSignOutIS { get; set; }
        public string SurgeonNurseRegisterdSignOutOther { get; set; }
        public DateTime? SignoutDateTime { get; set; }
        public int NurseSignoutId { get; set; }
        public string NurseSignoutName { get; set; }
        #endregion

      
        


    }
 

}
