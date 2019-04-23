using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;
using HIS_OT.Models;

namespace HIS_OT.Areas.OT.Models
{

    public class OTSchedulerModel
    {
        public string ErrorMessage { get; set; }

        public List<OTSchedule> List(OTScheduleFilter filter)
        {
            int ID = filter.ID;

            List<OTScheduleFilter> find = new List<OTScheduleFilter>();
            find.Add(filter);

            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@OTScheduleFilter", find.ListToXml("OTScheduleFilter"))
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.OTSchedulerView");

            List<OTSchedule> list = new List<OTSchedule>();
            if (dt.Rows.Count > 0) list = dt.ToList<OTSchedule>();
            if (ID > -1 && dt.Rows.Count > 0)
            {
                list[0].OTSSurgeryT = this.SelectedSurgeryList(ID, 1,"");
                list[0].OTSSurgeonT = this.SelectedSurgeonList(ID, 1);
                list[0].OTSAssistantSurgeonT = this.SelectedAsstSurgeonList(ID, 1);
                list[0].OTSAnaesthetistT = this.SelectedAnaesthetistList(ID, 1);
                list[0].OTSEquipmentT = this.SelectedEquipmentList(ID, 1);
            }

            return list;
        }
        public List<Scheduler> ListCalendar(OTScheduleFilter filter)
        {
            int ID = filter.ID;

            List<OTScheduleFilter> find = new List<OTScheduleFilter>();
            find.Add(filter);

            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@OTScheduleFilter", find.ListToXml("OTScheduleFilter"))
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.OTSchedulerCalendar");

            List<Scheduler> list = new List<Scheduler>();
            if (dt.Rows.Count > 0) list = dt.ToList<Scheduler>();


            return list;
        }
        public List<PatientFilterResults> PatientFilterResults(PatientFilter filter)
        {

            List<PatientFilter> find = new List<PatientFilter>();
            find.Add(filter);

            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@xmlPatient", find.ListToXml("Patient"))
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.OutPatientFilter");

            List<PatientFilterResults> list = new List<PatientFilterResults>();
            if (dt.Rows.Count > 0) list = dt.ToList<PatientFilterResults>();


            return list;
        }



        public bool SaveOTHead(OTHeadmodel entry)
        {
            try
            {
                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@Action", entry.Action),
                    new SqlParameter("@userid", entry.userid)
                };

                db.param[0].Direction = ParameterDirection.Output;
                //db.ExecuteSP("OT.OTSchedulerSave");
                db.ExecuteSP("OT.OTHeadMapping");
                this.ErrorMessage = db.param[0].Value.ToString();

                bool isOK = this.ErrorMessage.Split('-')[0] == "100";

                return isOK;
            }
            catch (Exception x)
            {
                this.ErrorMessage = x.Message;
                return false;
            }

        }

        public bool CheckOTHeadUser(CheckOTHeadUserModel entry)
        {
            try
            {
                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@Action", entry.Action),
                    new SqlParameter("@userid", entry.OperatorId)
                };

                db.param[0].Direction = ParameterDirection.Output;
                //db.ExecuteSP("OT.OTSchedulerSave");
                db.ExecuteSP("OT.CheckOTHeadUser");
                this.ErrorMessage = db.param[0].Value.ToString();

                bool isOK = this.ErrorMessage.Split('-')[0] == "100";

                return isOK;
            }
            catch (Exception x)
            {
                this.ErrorMessage = x.Message;
                return false;
            }

        }



        

        public bool Save(OTSchedule entry)
        {
            try
            {
                List<OTSchedule> OTSchedule = new List<OTSchedule>();
                OTSchedule.Add(entry);
                
                List<OTSSurgery> OTSSurgery = entry.OTSSurgery;
                if (OTSSurgery == null) OTSSurgery = new List<OTSSurgery>();

                List<OTSSurgeon> OTSSurgeon = entry.OTSSurgeon;
                if (OTSSurgeon == null) OTSSurgeon = new List<OTSSurgeon>();

                List<OTSAssistantSurgeon> OTSAssistantSurgeon = entry.OTSAssistantSurgeon;
                if (OTSAssistantSurgeon == null) OTSAssistantSurgeon = new List<OTSAssistantSurgeon>();

                List<OTSAnaesthetist> OTSAnaesthetist = entry.OTSAnaesthetist;
                if (OTSAnaesthetist == null) OTSAnaesthetist = new List<OTSAnaesthetist>();

                List<OTSEquipment> OTSEquipment = entry.OTSEquipment;
                if (OTSEquipment == null) OTSEquipment = new List<OTSEquipment>();


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@Action", entry.Action),
                    new SqlParameter("@xmlOTSchedule",OTSchedule.ListToXml("OTSchedule")),
                    new SqlParameter("@xmlOTSSurgery",OTSSurgery.ListToXml("OTSSurgery")),
                    new SqlParameter("@xmlOTSSurgeon",OTSSurgeon.ListToXml("OTSSurgeon")),
                    new SqlParameter("@xmlOTSAssistantSurgeon",OTSAssistantSurgeon.ListToXml("OTSAssistantSurgeon")),
                    new SqlParameter("@xmlOTSAnaesthetist",OTSAnaesthetist.ListToXml("OTSAnaesthetist")),
                    new SqlParameter("@xmlOTSEquipment",OTSEquipment.ListToXml("OTSEquipment"))
                };

                db.param[0].Direction = ParameterDirection.Output;
                //db.ExecuteSP("OT.OTSchedulerSave");
                db.ExecuteSP("OT.OTSchedulerSaveWithSurgeryPosition");//with update surgery position Jan2017
                this.ErrorMessage = db.param[0].Value.ToString();

                bool isOK = this.ErrorMessage.Split('-')[0] == "100";

                return isOK;
            }
            catch (Exception x)
            {
                this.ErrorMessage = x.Message;
                return false;
            }

        }


        public List<DoctorListStatusModel> DoctorListStatusModel(int OperatorId)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@OperatorId", OperatorId)

            };

            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.GetDoctorAllowed_SCS");

            List<DoctorListStatusModel> list = new List<DoctorListStatusModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<DoctorListStatusModel>();
            return list;

        }


        private List<SelectedSurgeryList> SelectedSurgeryList(int SurgeryRecordId, int IsSelected, string searchTerm)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", SurgeryRecordId),
                new SqlParameter("@isSelected", IsSelected)
                ,new SqlParameter("@searchTerm", searchTerm)
            
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.SelectedSurgeryListSched");
            List<SelectedSurgeryList> list = new List<SelectedSurgeryList>();
            if (dt.Rows.Count > 0) list = dt.ToList<SelectedSurgeryList>();
            return list;
        }
        private List<IdName> SelectedSurgeonList(int SurgeryRecordId, int IsSelected)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", SurgeryRecordId),
                new SqlParameter("@isSelected", IsSelected)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.Select2SelectedSurgeonSched");
            List<IdName> list = new List<IdName>();
            if (dt.Rows.Count > 0) list = dt.ToList<IdName>();
            return list;
        }
        private List<IdName> SelectedAsstSurgeonList(int SurgeryRecordId, int IsSelected)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", SurgeryRecordId),
                new SqlParameter("@isSelected", IsSelected)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.Select2SelectedAsstSurgeonSched");
            List<IdName> list = new List<IdName>();
            if (dt.Rows.Count > 0) list = dt.ToList<IdName>();
            return list;
        }
        private List<IdName> SelectedAnaesthetistList(int SurgeryRecordId, int IsSelected)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", SurgeryRecordId),
                new SqlParameter("@isSelected", IsSelected)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.Select2SelectedAnaesthetistSched");
            List<IdName> list = new List<IdName>();
            if (dt.Rows.Count > 0) list = dt.ToList<IdName>();
            return list;
        }
        private List<IdName> SelectedEquipmentList(int SurgeryRecordId, int IsSelected)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", SurgeryRecordId),
                new SqlParameter("@isSelected", IsSelected)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.Select2SelectedEquipmentSched");
            List<IdName> list = new List<IdName>();
            if (dt.Rows.Count > 0) list = dt.ToList<IdName>();
            return list;
        }

        public string ValidateDateDAL(string id,string df, string dt)
        {

            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@OTID", id),
                new SqlParameter("@STARTDATE", df),
                new SqlParameter("@ENDDATE", dt)
            };
            DataTable dtt = db.ExecuteSPAndReturnDataTable("OT.OTSchedulerValidate");
            return dtt.Rows[0]["id"].ToString();
        }
    }

    public class DoctorListStatusModel 
    {
        public int IsPractisingDoctor { get; set; }
        //public int OperatorId { get; set; }
    }

    public class OTScheduleFilter : OTSchedule
    {
    }
    public class PatientFilter : Patient
    {
        public string RegDateTimeF { get; set; }
        public string RegDateTimeT { get; set; }
    }

    public class PatientFilterResults
    {
        public int chk { get; set; }
        public string PIN { get; set; }
        public string name { get; set; }
        public string date { get; set; }
        public string Age { get; set; }
        public string SEX { get; set; }
        public string PLACE { get; set; }
        public string PPhone { get; set; }
        public int Registrationno { get; set; }
        public string CategoryCode { get; set; }
        public string CompanyCode { get; set; }
        public string IssueAuthorityCode { get; set; }
    }
    public class Patient
    {
        public string RegDateTime { get; set; }
        public string IssueAuthorityCode { get; set; }
        public int Registrationno { get; set; }
        public string Title { get; set; }
        public string FamilyName { get; set; }
        public string Firstname { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string MothersMaidenName { get; set; }
        public string FathersName { get; set; }
        public string DateOfBirth { get; set; }
        public int Age { get; set; }
        public int Agetype { get; set; }
        public int Sex { get; set; }
        public int MaritalStatus { get; set; }
        public string Occupation { get; set; }
        public string Guardian { get; set; }
        public string GRelationship { get; set; }
        public int PCity { get; set; }
        public string PPhone { get; set; }
        public string PEMail { get; set; }
        public string WrkAddress { get; set; }
        public string WrkPhone { get; set; }
        public string WrkEMail { get; set; }
        public string OtherAllergies { get; set; }
        public bool Caution { get; set; }
        public string LastModifiedDateTime { get; set; }
        public int OperatorID { get; set; }
        public int Country { get; set; }
        public string PassportNo { get; set; }
        public string IssueDate { get; set; }
        public string ExpiryDate { get; set; }
        public string CCurrency { get; set; }
        public string ReferredDocName { get; set; }
        public string ReferredDocAddress { get; set; }
        public string ReferredDocPhone { get; set; }
        public string ReferredDocEmail { get; set; }
        public string ReferredDocCellNo { get; set; }
        public int Religion { get; set; }
        public int ModifiedOperator { get; set; }
        public bool Deleted { get; set; }
        public bool Vip { get; set; }
        public string CityName { get; set; }
        public string CountryName { get; set; }
        public string Password { get; set; }
        public string ReferredDocSpecialisation { get; set; }
        public string PCellno { get; set; }
        public string Gphone { get; set; }
        public string Gcellno { get; set; }
        public string Gaddress { get; set; }
        public string Gemail { get; set; }
        public string BloodGroup { get; set; }
        public string WrkFax { get; set; }
        public string Ppagerno { get; set; }
        public string Cpagerno { get; set; }
        public string Rpagerno { get; set; }
        public bool ChequeBounce { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string Address3 { get; set; }
        public bool NonSaudi { get; set; }
        public string pZipCode { get; set; }
        public int Nationality { get; set; }
        public int Billtype { get; set; }
        public string WrkCompanyName { get; set; }
        public int CompanyId { get; set; }
        public string SidIssueDate { get; set; }
        public string SidIssuedAt { get; set; }
        public string SaudiIqamaId { get; set; }
        public string SidExpiryDate { get; set; }
        public string PassportIssuedAt { get; set; }
        public string Sexothers { get; set; }
        public bool Messages { get; set; }
        public bool BilledBy { get; set; }
        public int DoctorId { get; set; }
        public string EmployeeId { get; set; }
        public int Embose { get; set; }
        public string AFirstName { get; set; }
        public string AMiddleName { get; set; }
        public string ALastName { get; set; }
        public string AFamilyName { get; set; }
        public string AAddress1 { get; set; }
        public string AAddress2 { get; set; }
        public int CategoryId { get; set; }
        public int GradeId { get; set; }
        public string PolicyNo { get; set; }
        public string IDExpiryDate { get; set; }
        public string MedIDNumber { get; set; }
        public bool Billed { get; set; }
        public string ValidFrom { get; set; }
        public string ValidTo { get; set; }
        public int MRBlocked { get; set; }
        public int IsInvoiced { get; set; }
        public string InvoiceDateTime { get; set; }
        public int CompanyLetterId { get; set; }
        public string SGHRegNO { get; set; }
        public string SGHDateTime { get; set; }
        public bool EmboseCharged { get; set; }
        public string AramcoRegDateTime { get; set; }
        public string SGHName { get; set; }
        public bool UPLOADTAG { get; set; }
        public string BirthTime { get; set; }
        public string Insert_Update { get; set; }
    }
    public class OTSchedule
    {
        public int Action { get; set; }
        public int ID { get; set; }
        public int PatientType { get; set; }
        public string IssueAuthorityCode { get; set; }
        public int IPIDOPID { get; set; }
        public int OTID { get; set; }
        public int AnaesthesiaID { get; set; }
        public string DateOfBooking { get; set; }
        public string FromDateTime { get; set; }
        public string ToDateTime { get; set; }
        public int ReservedConfirmed { get; set; }
        public string Remarks { get; set; }
        public string COORemarks { get; set; }
        public string PatientName { get; set; }
        public int Age { get; set; }
        public int AgeType { get; set; }
        public string Sex { get; set; }
        public string Disease { get; set; }
        public int RequestedBy { get; set; }
        public int VerifiedBy { get; set; }
        public bool Verified { get; set; }
        public string Verifieddatetime { get; set; }
        public bool Deleted { get; set; }
        public int OperatorID { get; set; }
        public string TheReason { get; set; }

        public int W { get; set; }
        public string PIN { get; set; }
        public string PTName { get; set; }
        public string PatientTypeName { get; set; }
        public string wardname { get; set; }
        public string CategoryName { get; set; }
        public string CompanyName { get; set; }
        public string bedname { get; set; }
        public string Gender { get; set; }
        public string Package { get; set; }
        public string OperationTheatreName { get; set; }
        public string DateFrom { get; set; }
        public string DateTo { get; set; }
        public string TimeFrom { get; set; }
        public string TimeTo { get; set; }
        public string AnaesthesiaName { get; set; }
        public string DateFromS { get; set; }
        public string DateToS { get; set; }
        public string OperatorName { get; set; }
        public string Duration { get; set; }
        public string Status { get; set; }
        public int ReservedConfirmedId { get; set; }

        public string SurgeryPosition { get; set; }

        public List<OTSSurgery> OTSSurgery { get; set; }
        public List<OTSSurgeon> OTSSurgeon { get; set; }
        public List<OTSAssistantSurgeon> OTSAssistantSurgeon { get; set; }
        public List<OTSAnaesthetist> OTSAnaesthetist { get; set; }
        public List<OTSEquipment> OTSEquipment { get; set; }

        public List<SelectedSurgeryList> OTSSurgeryT { get; set; }
        public List<IdName> OTSSurgeonT { get; set; }
        public List<IdName> OTSAssistantSurgeonT { get; set; }
        public List<IdName> OTSAnaesthetistT { get; set; }
        public List<IdName> OTSEquipmentT { get; set; }


    }
    public class OTSSurgeon
    {
        public int OTScheduleId { get; set; }
        public int SurgeonId { get; set; }
    }
    public class OTSAssistantSurgeon
    {
        public int OTScheduleId { get; set; }
        public int AssistantsurgeonId { get; set; }
    }
    public class OTSAnaesthetist
    {
        public int OTScheduleId { get; set; }
        public int AnaesthetistId { get; set; }
    }
    public class OTSEquipment
    {
        public int OTScheduleId { get; set; }
        public int EquipmentId { get; set; }
    }
    public class OTSSurgery
    {
        public int OTScheduleId { get; set; }
        public int SurgeryId { get; set; }
        public int SpecialisationId { get; set; }
    }
    public class Scheduler
    {
        public string id { get; set; }
        public string start_date { get; set; }
        public string end_date { get; set; }
        public string text { get; set; }
        public string textColor { get; set; }
        public string color { get; set; }        
    }

    public class OTHeadmodel
    {
        public string Action { get; set; }
        public string userid { get; set; }
    }
    public class MainListOT
    {
        public int userid { get; set; }
        public string empid { get; set; }
        public string name { get; set; }
    }
    public class CheckOTHeadUserModel
    {
        public string Action { get; set; }
        public int OperatorId { get; set; }
    }


}