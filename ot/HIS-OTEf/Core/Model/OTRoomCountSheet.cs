using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace OTEf.Core.Model
{
    public class OTRoomCountSheet : PatientCommon
    {
        public int Id                           { get; set; }
        public int SurgeonId                    { get; set; }
        public int ProcedureId                  { get; set; }

        public int INT_CIRC_Nurse_CTR_Id        { get; set; }
        public int INT_ScrubNurse_CTR_Id        { get; set; }
        public int FNL_CIRC_Nurse_CTR_Id        { get; set; }
        public int FNL_ScrubNurse_CTR_Id        { get; set; }

        public string SurgeonName               { get; set; }
        public string ProcedureName             { get; set; }
        public string INT_CIRC_Nurse_CTR_Name   { get; set; }
        public string INT_ScrubNurse_CTR_Name   { get; set; }
        public string FNL_CIRC_Nurse_CTR_Name   { get; set; }
        public string FNL_ScrubNurse_CTR_Name   { get; set; }


        public bool Recount                     { get; set; }
        public bool InformedSurgeon             { get; set; }
        public bool InformedOTNurseMngr         { get; set; }
        public bool ObtainXray                  { get; set; }
        public bool CompleteIncidentRpt         { get; set; }
        public bool InformedNurseDir            { get; set; }

        public DateTime EntryDateTime           { get; set; }
        public DateTime? INT_CIRC_Nurse_CTR_Date { get; set; }
        public DateTime? INT_ScrubNurse_CTR_Date { get; set; }
        public DateTime? FNL_CIRC_Nurse_CTR_Date { get; set; }
        public DateTime? FNL_ScrubNurse_CTR_Date { get; set; }
        
        
        public virtual List<OTItemCount> OTItems { get; set; }
        public virtual List<OTBasicInstrumentCount> BasicInstruments { get; set; }
        public virtual List<OTSeparateInstrumentCount> SepareteInstruments { get; set; }

    }
}
