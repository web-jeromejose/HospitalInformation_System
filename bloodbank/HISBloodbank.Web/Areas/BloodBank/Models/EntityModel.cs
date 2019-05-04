using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;

using HIS_BloodBank.Models;



namespace HIS_BloodBank.Areas.BloodBank.Models
{
    public class IdName
    {
        public int id { get; set; }
        public string name { get; set; }
        public int type { get; set; }
        public int chk { get; set; }
    }
    public class CrossMatch
    {
        public int Ipid { get; set; }
        public int BedId { get; set; }
        public int Doctorid { get; set; }
        public int bagid { get; set; }
        public string BagNumber { get; set; }
        public int CrossMatchedBy { get; set; }
        public int compatabulity { get; set; }
        public int Requisttype { get; set; }
        public string dateTime { get; set; }
        public string ExpiryDate { get; set; }
        public int CrossMatchtype { get; set; }
        public int StationId { get; set; }
        public int Issued { get; set; }
        public int Reserved { get; set; }
        public int ExtenReserved { get; set; }
        public string Remarks { get; set; }
        public int patbloodgroup { get; set; }
        public int UnitGroup { get; set; }
        public int worderid { get; set; }
        public int transtype { get; set; }
        public int Unresevetype { get; set; }
        public string unreservedatetime { get; set; }
        public int componentid { get; set; }
        public int Unreseveoperatorid { get; set; }
        public string reqdatetime { get; set; }
        public int Operatorid { get; set; }
        public int antibody { get; set; }
        public int ID { get; set; }
    }
    public class BloodGroup
    {
        public int Action { get; set; }
        public int id { get; set; }
        public string name { get; set; }
        public string startdatetime { get; set; }
        public string enddatetime { get; set; }
        public bool deleted { get; set; }
        public int operatorid { get; set; }
        public int modifiedby { get; set; }
        public string modifieddatetime { get; set; }
        public int type { get; set; }
        public string code { get; set; }
        public string arabicname { get; set; }
        public string arabiccode { get; set; }
        public int departmentid { get; set; }

        public int ctr { get; set; }
        public string modifiedbyName { get; set; }
        public string departmentName { get; set; }
    }
    public class Component
    {
        public int Action { get; set; }
        public int ctr { get; set; }
        public int ID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Arabiccode { get; set; }
        public string Arabicname { get; set; }
        public int TempId { get; set; }
        public string TempName { get; set; }
        public int Type { get; set; }
        public bool DefaultType { get; set; }
        public float Costprice { get; set; }
        public int Departmentid { get; set; }
        public int ExpiryPeriod { get; set; }
        public string Unit { get; set; }
        public int ReplacementCount { get; set; }
        public string StartDateTime { get; set; }
        public bool Deleted { get; set; }
        public string EndDateTime { get; set; }
        public string LastUpdated { get; set; }
        public int TimeId { get; set; }
        public bool uploaded { get; set; }
        public string udatetime { get; set; }

        public string TypeName { get; set; }
        public string departmentName { get; set; }
    }
    public class BloodOrder
    {
        
        public int id { get; set; }
        public int ipid { get; set; }
        public int bedid { get; set; }
        public string regno { get; set; }
        public int stationid { get; set; }
        public int woperatorid { get; set; }
        public string datetime { get; set; }
        public int doctorid { get; set; }
        public int status { get; set; }
        public int boperatorid { get; set; }
        public int bloodgroup { get; set; }
        public bool transtype { get; set; }
        public bool replace { get; set; }
        public int reqtype { get; set; }
        public int wbc { get; set; }
        public int rbc { get; set; }
        public int hb { get; set; }
        public int pcv { get; set; }
        public int platelet { get; set; }
        public string others { get; set; }
        public int earlierdetct { get; set; }
        public int demand { get; set; }
        public string clinicaldetails { get; set; }
        public int pt { get; set; }
        public int pttk { get; set; }
        public int deletedby { get; set; }
        public int stationslno { get; set; }
        public string ackdate { get; set; }
        public int ackoperator { get; set; }
        public int labno { get; set; }
    }
    public class InPatient
    {
        public int IPID { get; set; }
        public int AdminNo { get; set; }
        public string IssueAuthorityCode { get; set; }
        public int RegistrationNo { get; set; }
        public string AdmitDateTime { get; set; }
        public int AdmitedAtID { get; set; }
        public int PatientType { get; set; }
        public int ModeOfVisit { get; set; }
        public bool VIP { get; set; }
        public int AttendRelation { get; set; }
        public string Title { get; set; }
        public string FamilyName { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string DateOfBirth { get; set; }
        public int Age { get; set; }
        public int AgeType { get; set; }
        public int Sex { get; set; }
        public string Sexothers { get; set; }
        public int Religion { get; set; }
        public string BloodGroup { get; set; }
        public string OtherAllergies { get; set; }
        public int Nationality { get; set; }
        public int PCity { get; set; }
        public string CityName { get; set; }
        public int District { get; set; }
        public string DistrictName { get; set; }
        public int PState { get; set; }
        public string StateName { get; set; }
        public int PCountry { get; set; }
        public string CountryName { get; set; }
        public string PPhone { get; set; }
        public string PCellNo { get; set; }
        public string PPagerNo { get; set; }
        public string PEMail { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string Address3 { get; set; }
        public string PzipCode { get; set; }
        public string SaudiIqamaID { get; set; }
        public string SIDIssueDate { get; set; }
        public string SIDExpiryDate { get; set; }
        public string SIDIssuedAt { get; set; }
        public bool NonSaudi { get; set; }
        public string InsCardNo { get; set; }
        public string LetterNo { get; set; }
        public int LetterNoType { get; set; }
        public string MedIDNumber { get; set; }
        public string PolicyNo { get; set; }
        public int TariffID { get; set; }
        public int CategoryID { get; set; }
        public int CompanyID { get; set; }
        public int GradeId { get; set; }
        public int BillType { get; set; }
        public int BedTypeID { get; set; }
        public bool Block { get; set; }
        public bool Messages { get; set; }
        public int DoctorID { get; set; }
        public int DepartmentId { get; set; }
        public int TreDoctor1 { get; set; }
        public int TreDoctor2 { get; set; }
        public bool Newborn { get; set; }
        public int NewBornSlNo { get; set; }
        public int MotherIPID { get; set; }
        public int OperatorID { get; set; }
        public int ModifiedBy { get; set; }
        public string ModifiedOn { get; set; }
        public string SGHRegNO { get; set; }
        public string PTName { get; set; }
        public bool UPLOADTAG { get; set; }
    }
    public class ComponentScreen
    {
        public string id { get; set; }
        public string bagnumber { get; set; }
        public int Componentid { get; set; }
        public string Expirydate { get; set; }
        public bool issued { get; set; }
        public int ScreeningResult { get; set; }
        public string datetime { get; set; }
        public int Operatorid { get; set; }
        public int Stationid { get; set; }
        public int Status { get; set; }
        public int bloodgroup { get; set; }
        public string coldate { get; set; }
        public int broken { get; set; }
        public int bagid { get; set; }
        public bool split { get; set; }
        public int Qty { get; set; }
        public bool Reserve { get; set; }
    }
    public class BagTypeMapping
    {
        public int Action { get; set; }
        public int id { get; set; }
        public int bagtypeid { get; set; }
        public int componentid { get; set; }
        public int expiryperiod { get; set; }
        public int timeid { get; set; }
        public bool deleted { get; set; }
        public int operatorid { get; set; }
        public string datetime { get; set; }

        public int ctr { get; set; }
        public string refid { get; set; }
        public string Component { get; set; }
        public string BloodGroup { get; set; }
        public string ExpiryName { get; set; }
        public string CreatedBy { get; set; }
        
    }
    public class BagType
    {
        public int id { get; set; }
        public string name { get; set; }
        public string startdatetime { get; set; }
        public string enddatetime { get; set; }
        public bool deleted { get; set; }
        public int operatorid { get; set; }
        public int modifiedby { get; set; }
        public string modifieddatetime { get; set; }
        public string code { get; set; }
        public string arabicname { get; set; }
        public string arabiccode { get; set; }
        public int departmentid { get; set; }

        public int Action { get; set; }
        public int ctr { get; set; }
        public string modifiedbyName { get; set; }
        public string departmentName { get; set; }
    }
    public class ScreeningResult
    {
        public int Id { get; set; }
        public string code { get; set; }
        public string Name { get; set; }
        public string ArabicCode { get; set; }
        public string ArabicName { get; set; }
        public bool type { get; set; }
        public int Departmentid { get; set; }
        public int sno { get; set; }
        public string StartDateTime { get; set; }
        public string EndDateTime { get; set; }
        public bool Deleted { get; set; }
        public int modifiedby { get; set; }
        public string updatedatetime { get; set; }
        public int operatorid { get; set; }
        public string modifieddatetime { get; set; }
        public int testid { get; set; }
        public string Equpsno { get; set; }

        public int Action { get; set; }
        public int ctr { get; set; }
        public string DepartmentName { get; set; }
        public string CreatedBy { get; set; }
        public string LastModifiedBy { get; set; }

        public List<Sequence> Sequence { get; set; }

    }
    public class BBBagQty
    {
        public int id { get; set; }
        public string name { get; set; }
        public string startdatetime { get; set; }
        public string enddatetime { get; set; }
        public bool deleted { get; set; }
        public int operatorid { get; set; }
        public int modifiedby { get; set; }
        public string modifieddatetime { get; set; }
        public string code { get; set; }
        public string arabicname { get; set; }
        public string arabiccode { get; set; }
        public int departmentid { get; set; }

        public int Action { get; set; }
        public int ctr { get; set; }
        public string modifiedbyName { get; set; }
        public string departmentName { get; set; }
    }
    public class Reaction
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string startdatetime { get; set; }
        public string EndDateTime { get; set; }
        public bool deleted { get; set; }
        public int operatorid { get; set; }
        public int modifiedby { get; set; }
        public string modifieddatetime { get; set; }
        public string code { get; set; }
        public string Arabicname { get; set; }
        public string Arabiccode { get; set; }
        public int Departmentid { get; set; }

        public int Action { get; set; }
        public int ctr { get; set; }
        public string modifiedbyName { get; set; }
        public string departmentName { get; set; }
    }
    public class Compatability
    {
        public int Id { get; set; }
        public string code { get; set; }
        public string Name { get; set; }
        public string Arabiccode { get; set; }
        public string Arabicname { get; set; }
        public int Departmentid { get; set; }
        public int sno { get; set; }
        public string startdatetime { get; set; }
        public string EndDateTime { get; set; }
        public bool deleted { get; set; }
        public int operatorid { get; set; }
        public int Modifiedby { get; set; }
        public string updatedatetime { get; set; }
        public string modifieddatetime { get; set; }

        public int Action { get; set; }
        public int ctr { get; set; }
        public string modifiedbyName { get; set; }
        public string departmentName { get; set; }
    }
    public class CrossMatchType
    {
        public int Id { get; set; }
        public string code { get; set; }
        public string Name { get; set; }
        public string Arabiccode { get; set; }
        public string Arabicname { get; set; }
        public int Departmentid { get; set; }
        public int sno { get; set; }
        public string StartDateTime { get; set; }
        public bool Deleted { get; set; }
        public string EndDateTime { get; set; }
        public int operatorid { get; set; }
        public int modifiedby { get; set; }
        public string updatedatetime { get; set; }
        public string modifieddatetime { get; set; }

        public int Action { get; set; }
        public int ctr { get; set; }
        public string modifiedbyName { get; set; }
        public string departmentName { get; set; }
    }
    public class IssueHospitals
    {
        public int ID { get; set; }
        public string code { get; set; }
        public string name { get; set; }
        public string Arabiccode { get; set; }
        public string Arabicname { get; set; }
        public int Departmentid { get; set; }
        public bool deleted { get; set; }
        public int operatorid { get; set; }
        public int modifiedby { get; set; }
        public string modifieddatetime { get; set; }
        public string StartDateTime { get; set; }
        public string Enddatetime { get; set; }

        public int Action { get; set; }
        public int ctr { get; set; }
        public string modifiedbyName { get; set; }
        public string departmentName { get; set; }
    }
    public class BloodGroupMapping
    {
        public int id { get; set; }
        public int bloodgroop { get; set; }
        public int type { get; set; }
        public int issgroop { get; set; }
        public int componentid { get; set; }
        public bool deleted { get; set; }
        public int operatorid { get; set; }

        public int Action { get; set; }
        public int ctr { get; set; }
    }
    public class BBBagCompany
    {
        public int id { get; set; }
        public string code { get; set; }
        public string name { get; set; }
        public string arabiccode { get; set; }
        public string arabicname { get; set; }
        public int departmentid { get; set; }
        public string startdatetime { get; set; }
        public string enddatetime { get; set; }
        public int modifiedby { get; set; }
        public string modifieddatetime { get; set; }
        public bool deleted { get; set; }
        public int operatorid { get; set; }

        public int Action { get; set; }
        public int ctr { get; set; }
        public string modifiedbyName { get; set; }
        public string departmentName { get; set; }
    }
    public class DonorQuestionaires
    {
        public int id { get; set; }
        public string Name { get; set; }
        public string startDatetime { get; set; }
        public string enddatetime { get; set; }
        public bool deleted { get; set; }
        public int operatorid { get; set; }
        public int modifiedby { get; set; }
        public string updatedatetime { get; set; }
        public int sno { get; set; }
        public string modifieddatetime { get; set; }
        public string code { get; set; }
        public string Arabicname { get; set; }
        public string Arabiccode { get; set; }
        public int Departmentid { get; set; }

        public int Action { get; set; }
        public int ctr { get; set; }
        public string modifiedbyName { get; set; }
        public string departmentName { get; set; }

        public int isChk { get; set; }
    }
    public class DonorSuffers
    {
        public int id { get; set; }
        public string Name { get; set; }
        public string startDatetime { get; set; }
        public string enddatetime { get; set; }
        public bool deleted { get; set; }
        public int operatorid { get; set; }
        public int modifiedby { get; set; }
        public string updatedatetime { get; set; }
        public int sno { get; set; }
        public string modifieddatetime { get; set; }
        public string code { get; set; }
        public string Arabicname { get; set; }
        public string Arabiccode { get; set; }
        public int Departmentid { get; set; }

        public int Action { get; set; }
        public int ctr { get; set; }
        public string modifiedbyName { get; set; }
        public string departmentName { get; set; }
    }
    public class DonorVaccination
    {
        public int id { get; set; }
        public string Name { get; set; }
        public string startDatetime { get; set; }
        public string enddatetime { get; set; }
        public bool deleted { get; set; }
        public int operatorid { get; set; }
        public int modifiedby { get; set; }
        public string updatedatetime { get; set; }
        public int sno { get; set; }
        public string modifieddatetime { get; set; }
        public string code { get; set; }
        public string Arabicname { get; set; }
        public string Arabiccode { get; set; }
        public int Departmentid { get; set; }

        public int Action { get; set; }
        public int ctr { get; set; }
        public string modifiedbyName { get; set; }
        public string departmentName { get; set; }
    }
    public class DonorAntidrugs
    {
        public int id { get; set; }
        public string Name { get; set; }
        public string startDatetime { get; set; }
        public string enddatetime { get; set; }
        public bool deleted { get; set; }
        public int operatorid { get; set; }
        public int modifiedby { get; set; }
        public string updatedatetime { get; set; }
        public int sno { get; set; }
        public string modifieddatetime { get; set; }
        public string code { get; set; }
        public string Arabicname { get; set; }
        public string Arabiccode { get; set; }
        public int Departmentid { get; set; }

        public int Action { get; set; }
        public int ctr { get; set; }
        public string modifiedbyName { get; set; }
        public string departmentName { get; set; }
    }
    public class Donorprice
    {
        public int id { get; set; }
        public int Bloodgroupid { get; set; }
        public int componentid { get; set; }
        public string amount { get; set; }
        public string startdatetime { get; set; }
        public string enddatetime { get; set; }
        public bool deleted { get; set; }
        public int operatorid { get; set; }

        public int Action { get; set; }
        public int ctr { get; set; }
        public string BloodGroup { get; set; }
        public string component { get; set; }
        public string price { get; set; }
        public string CreatedBy { get; set; }
    }
    public class DonorDrugAllergies
    {
        public string Id { get; set; }
        public int Drugid { get; set; }
    }
    public class DonorFoodAllergies
    {
        public string Id { get; set; }
        public int FoodAllergyid { get; set; }
    }
    public class DonorSurgeries
    {
        public string Id { get; set; }
        public int Surgeryid { get; set; }
    }
    public class ComponentList
    {
        public int componentId { get; set; }
        public string componentExp { get; set; }
    }

    public class DonorOtherHistory
    {
        public string Id { get; set; }
        public int MainSymptomid { get; set; }
        public int SubSymptomId { get; set; }
        public string Description { get; set; }
    }
    public class DonorImmunisation
    {
        public string Id { get; set; }
        public int immunisationid { get; set; }
        public string IDate { get; set; }
        public string Description { get; set; }
    }
    public class Filters
    {
        public int ID { get; set; }
        public string code { get; set; }
        public string Name { get; set; }
        public string Arabiccode { get; set; }
        public string Arabicname { get; set; }
        public string tempName { get; set; }
        public int Departmentid { get; set; }
        public string StartDateTime { get; set; }
        public string EndDateTime { get; set; }
        public bool Deleted { get; set; }
        public string LastUpdated { get; set; }
        public int modifiedby { get; set; }
        public string modifieddatetime { get; set; }
        public int operatorid { get; set; }

        public int Action { get; set; }
        public int ctr { get; set; }
        public string modifiedbyName { get; set; }
        public string departmentName { get; set; }
    }
    public class BBotherProcedures
    {
        public int id { get; set; }
        public string name { get; set; }
        public string startdatetime { get; set; }
        public string enddatetime { get; set; }
        public bool deleted { get; set; }
        public int operatorid { get; set; }
        public int modifiedby { get; set; }
        public string modifieddatetime { get; set; }
        public int departmentid { get; set; }
        public string arabicname { get; set; }
        public string arabiccode { get; set; }
        public string code { get; set; }
        public int type { get; set; }
        public bool uploaded { get; set; }
        public string udatetime { get; set; }

        public int Action { get; set; }
        public int ctr { get; set; }
        public string modifiedbyName { get; set; }
        public string departmentName { get; set; }
    }
    public class OutsideBagsCollection
    {
        public int id { get; set; }
        public int W { get; set; }
        public string cdatetime { get; set; }
        public int bloodgroup { get; set; }
        public string purchasebagnumber { get; set; }
        public int screenvalue { get; set; }
        public string expirydatetime { get; set; }
        public string DateTime { get; set; }
        public int OperatorID { get; set; }
        public bool type { get; set; }
        public int componentid { get; set; }
        public int hospitalid { get; set; }
        public int stationid { get; set; }
        public int Quantity { get; set; }
        public string screenbagnumber { get; set; }
        public int RegistrationNo { get; set; }
        public int pBloodgroup { get; set; }
        public int Issueid { get; set; }
        

        public int Action { get; set; }
        public int ctr { get; set; }
        public string hospitalname { get; set; }
        public string OperatorName { get; set; }        
        public string PIN { get; set; }
        public string PatientName { get; set; }
        public string Age { get; set; }
        public string BloodGroupName { get; set; }
        public string BloodGroupName1 { get; set; }
        public string Gender { get; set; }
        public string ComponentName { get; set; }
        public string HospitalName1 { get; set; }
        public string TypeName { get; set; }
        public string QuantityName { get; set; }       

        public string DateTimeD { get; set; }
        public string collectiondatetimeD { get; set; }
        public string expirydatetimeD { get; set; }

        public List<GetSubcenterIssuesByHospList> GetSubcenterIssuesByHospList { get; set; }
    }
    public class BloodCollectionIssues
    {
        public int Hospitalid { get; set; }
        public string Collectionbag { get; set; }
        public string Issuebag { get; set; }
        public int Collectionid { get; set; }
        public int Issueid { get; set; }
        public string Datetime { get; set; }
        public int Operatorid { get; set; }
        public int Completed { get; set; }
    }
    public class Screen
    {
        public int Action { get; set; }
        public string Id { get; set; }
        public int Bagid { get; set; }
        public string Bagnumber { get; set; }
        public int Donortype { get; set; }
        public int ipid { get; set; }
        public int opid { get; set; }
        public int Component { get; set; }
        public int Procid { get; set; }
        public bool ScreenType { get; set; }
        public int ScreenValue { get; set; }
        public int SCREENRESULT { get; set; }
        public bool Verified { get; set; }
        public string DateTime { get; set; }
        public int OperatorID { get; set; }
        public int StationID { get; set; }
        public string Coldate { get; set; }
        public string ExpiryDate { get; set; }
        public int crossstate { get; set; }
        public int Nocross { get; set; }
        public int Issued { get; set; }
        public int Status { get; set; }
        public int Bloodgroup { get; set; }
        public int BROKEN { get; set; }
        public int Tvolume { get; set; }
        public int Cvolume { get; set; }
        public int filterid { get; set; }
        public bool split { get; set; }

        public List<OutsideBagsCollection> OutsideBagsCollectionD { get; set; }
        public List<BloodCollectionIssues> BloodCollectionIssuesD { get; set; }
        
    }
    public class DonorReg
    {
        public int Action { get; set; }
        public string ID { get; set; }
        public string Name { get; set; }
        public string ppobox { get; set; }
        public string address1 { get; set; }
        public string cityname { get; set; }
        public string address2 { get; set; }
        public string pzipcode { get; set; }
        public string pphone { get; set; }
        public string pcellno { get; set; }
        public string DateTime { get; set; }
        public string DateofBirth { get; set; }
        public int Age { get; set; }
        public int Sex { get; set; }
        public int BloodGroup { get; set; }
        public string Religion { get; set; }
        public string Occupation { get; set; }
        public int Maritialstatus { get; set; }
        public string LastDonatedDate { get; set; }
        public int DonorType { get; set; }
        public int ipid { get; set; }
        public int OPNO { get; set; }
        public decimal Hb { get; set; }
        public decimal Weight { get; set; }
        public string BP { get; set; }
        public decimal Temperature { get; set; }
        public string Pulse { get; set; }
        public int Phlebotomist { get; set; }
        public int volumeDrawn { get; set; }
        public int Bagtype { get; set; }
        public int Company { get; set; }
        public int Venisite { get; set; }
        public bool WillingTodonate { get; set; }
        public string HealthHistory { get; set; }
        public int operatorid { get; set; }
        public int stationid { get; set; }
        public int Title { get; set; }
        public string District { get; set; }
        public int HospitalId { get; set; }
        public int Type { get; set; }
        public bool deleted { get; set; }
        public int GroupOperatorId { get; set; }
        public int Status { get; set; }
        public int DonorNo { get; set; }
        public int DonorRegistrationNO { get; set; }
        public string ExpiryDate { get; set; }
        public string Remarks { get; set; }
        public int DonorStatus { get; set; }
        public string DonatedDate { get; set; }
        public int ReactionId { get; set; }
        public int nationality { get; set; }
        public string bleddingdate { get; set; }
        public string iqama { get; set; }
        public int pcity { get; set; }
        public int country { get; set; }
        public string countryname { get; set; }
        public string pemail { get; set; }
        public string ppagerno { get; set; }
        public string IssueAuthorityCode { get; set; }
        public string Iqamaissuedate { get; set; }
        public string IqamaIssuePlace { get; set; }
        public int Sgpt { get; set; }
        public decimal Bilrubin { get; set; }
        public decimal hct { get; set; }
        public int plt { get; set; }
        public int Suffers { get; set; }
        public int Vaccination { get; set; }
        public int Antidrugs { get; set; }
        public int Questionairespos { get; set; }
        public int Questionairesneg { get; set; }
        public int Procid { get; set; }
        public int screenresult { get; set; }
        public int PAmount { get; set; }
        public int idd { get; set; }
        public int screenvalue { get; set; }
        public string screendate { get; set; }
        public decimal Ausab { get; set; }
        public int PatientRegistrationNO { get; set; }
        public int BillNo { get; set; }
        public int IssueID { get; set; }
        public string IssueMappedDateTime { get; set; }
        public bool Aganistbill { get; set; }
        public string IssueBagnumber { get; set; }
        public bool PRINTNO { get; set; }
        public string labno { get; set; }
        public string Reason { get; set; }

        public List<DonorDrugAllergies> DonorDrugAllergies { get; set; }
        public List<DonorFoodAllergies> DonorFoodAllergies { get; set; }
        public List<DonorSurgeries> DonorSurgeries { get; set; }
        public List<ComponentList> ComponentList { get; set; }
    }
    public class m_generic
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string GenericCode { get; set; }
        public string StartDateTime { get; set; }
        public string EndDatetime { get; set; }
        public int OperatorID { get; set; }
        public bool Deleted { get; set; }
        public int Hipar { get; set; }
        public int HiparGenericID { get; set; }
        public string ts { get; set; }
        public string Description { get; set; }
        public string Comments { get; set; }
        public string ContraIndications { get; set; }
        public string Cautions { get; set; }
        public string SideEffects { get; set; }
        public string Dose { get; set; }
        public string AppLever { get; set; }
        public string AppRenal { get; set; }
        public string AppPregnancy { get; set; }
        public string AppBreastFeed { get; set; }
        public string AppIntraAdditives { get; set; }

        public int ctr { get; set; }
        public int isChk { get; set; }
    }
    public class fooditem
    {
        public int Id { get; set; }
        public int DepartmentID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string ArabicCode { get; set; }
        public string ArabicName { get; set; }
        public string Units { get; set; }
        public decimal CostPrice { get; set; }
        public int CategoryID { get; set; }
        public int SectionID { get; set; }
        public int StatusType { get; set; }
        public int OperatorID { get; set; }
        public string StartDateTime { get; set; }
        public string LastUpdated { get; set; }
        public bool Deleted { get; set; }
        public string EndDateTime { get; set; }
        public bool uploaded { get; set; }
        public string udatetime { get; set; }

        public int ctr { get; set; }
        public int isChk { get; set; }
    }
    public class Immunisation
    {
        public int id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string StartDateTime { get; set; }
        public string EndDateTime { get; set; }
        public int OperatorId { get; set; }
        public int ModifiedBy { get; set; }
        public string ModifiedDateTime { get; set; }
        public bool Deleted { get; set; }
    }
    public class Surgery
    {
        public int ID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string ArabicCode { get; set; }
        public string ArabicName { get; set; }
        public float CostPrice { get; set; }
        public bool package { get; set; }
        public int Grade { get; set; }
        public string Instructions { get; set; }
        public int DepartmentID { get; set; }
        public int SurgeryType { get; set; }
        public string StartDateTime { get; set; }
        public string EndDateTime { get; set; }
        public int OperatorID { get; set; }
        public string ModifiedDateTime { get; set; }
        public int ModifiedBy { get; set; }
        public bool Deleted { get; set; }
        public int StatusType { get; set; }
        public int UPLOADED { get; set; }
        public string UDATETIME { get; set; }

        public int ctr { get; set; }
        public int isChk { get; set; }
    }
    public class Title
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Sex { get; set; }
        public int Maritalstatus { get; set; }
        public string StartDatetime { get; set; }
        public string Enddatetime { get; set; }
        public bool Deleted { get; set; }
        public int OperatorId { get; set; }
        public int ModifiedBy { get; set; }
        public string ModifiedDateTime { get; set; }
        public string ArabicName { get; set; }

        public int ctr { get; set; }
        public int isChk { get; set; }
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


    public class JsTreeModel
    {
        public string data;
        public JsTreeAttribute attr;
        // this was "open" but changing it to “leaf” adds “jstree-leaf” to the class   
        public string state = "leaf";
        public List<JsTreeModel> children;
    }
    public class JsTreeAttribute
    {
        public string id;
    } 



}