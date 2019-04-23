using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Data.SqlClient;
using System.Data;

using DataLayer;
using HIS_OT.Areas.OT.Models;
using HIS_OT.Controllers;
using HIS_OT.Models;
namespace HIS_OT.Areas.OT.Models.Masters
{
    public class OTFormModel
    {
        DBHelper db = new DBHelper();
        public string ErrorMessage { get; set; }
        public string qry = "";

        #region operative report

        public List<OperativeReport> GetPatientBasicDetails(string RegNo, string AdmNo)
        {

            qry = "if exists (Select * from OTEf.OperativeReport where registrationNo = " + RegNo + " and AdmissionNO = " + AdmNo + " and Deleted = 0) ";
            qry += "begin ";
            qry += "Select o.*, s.NAME as Sex, ";
            qry += "anes.EmpCode + ' - '  + anes.Name as AnesName,  ";
            qry += "surg.EmpCode + ' - ' + surg.Name as SurgName, ";
            qry += "sec_surg.EmpCode + ' - ' + sec_surg.Name as Sec_surgName, ";
            qry += "asst.EmpCode + ' - ' + asst.Name as AsstName ";
            qry += "from OTEf.OperativeReport o  ";
            qry += "inner join AllInpatients aip on aip.IPID = o.IPID ";
            qry += "inner join Sex s on s.ID = aip.Sex ";
            qry += "left join Employee anes on o.AnesthetistID = anes.ID  ";
            qry += "left join Employee surg on o.SurgeonID = surg.ID ";
            qry += "left join Employee sec_surg on o.SecondarySurgeonID = sec_surg.ID ";
            qry += "left join Employee asst on o.AsstSurgeonID = asst.ID ";
            qry += "where o.RegistrationNo = " + RegNo + " and o.AdmissionNo = " + AdmNo + " ";
            qry += "end ";
            qry += "else ";
            qry += "begin ";
            qry += "SELECT ";
            qry += "ISNULL(ip.FamilyName, '') + ' ' + Isnull(ip.FirstName, '') + ' ' + isnull(ip.MiddleName, '') + ' ' + ip.LastName AS NAME ";
            qry += ", CONVERT(VARCHAR, ip.Age) + ' ' + at.NAME AS Age ";
            qry += ", s.NAME AS Sex ";
            qry += "FROM InPatient ip ";
            qry += "INNER JOIN AgeType at ON ip.AgeType = at.ID ";
            qry += "INNER JOIN Sex s ON s.ID = ip.Sex ";
            qry += "WHERE ip.RegistrationNo = " + RegNo + " and ip.AdminNo = " + AdmNo + " ";
            qry += "end ";
            this.ErrorMessage = "";
            return db.ExecuteSQLAndReturnDataTable(qry).ToList<OperativeReport>();
        }
        public string OperativeReport_Save(OperativeReport or)
        {
            qry = "if exists (Select * from OTEf.OperativeReport where registrationNo = " + or.RegistrationNo + " and AdmissionNO = " + or.AdmissionNo + " and Deleted = 0) ";
            qry += "begin ";
            qry += "Update OTEf.OperativeReport ";
            qry += "set ";
            qry += "IssueAuthorityCode = (Select top 1 IssueAuthorityCode from OrganisationDetails) ";
            qry += ", NAME = '" + this.Str(or.Name) + "' ";
            qry += ", Age = '" + this.Str(or.Age) + "' ";
            qry += ", [DATE] = '" + or.Date + "' ";
            qry += ", TypeOfAnesthesia = '" + this.Str(or.TypeOfAnesthesia) + "' ";
            qry += ", AnesthetistID = " + or.AnesthetistID + " ";
            qry += ", SurgeonID = " + or.SurgeonID + " ";
            qry += ", SecondarySurgeonID = " + or.SecondarySurgeonID + " ";
            qry += ", AsstSurgeonID= " + or.AsstSurgeonID + " ";
            qry += ", OperativeDetails = '" + this.Str(or.OperativeDetails) + "' ";
            qry += ", PeriOpertiveComplications = '" + this.Str(or.PeriOpertiveComplications) + "' ";
            qry += ", EstimatedAmountOfBloodLoss = '" + or.EstimatedAmountOfBloodLoss + "' ";
            if (or.SurgicalSpecimenSentForExamination)
                qry += ", SurgicalSpecimenSentForExamination = 1 ";
            else
                qry += ", SurgicalSpecimenSentForExamination = 0 ";

            qry += ", ModifiedOn = '" + DateTime.Now.ToString() + "' ";
            qry += ", ModifiedOperatorID = " + or.ModifiedOperatorID + " ";
            qry += "where RegistrationNo = " + or.RegistrationNo + " and AdmissionNo = " + or.AdmissionNo + " ";
            qry += "end ";
            qry += "else ";
            qry += "begin ";
            qry += "INSERT INTO OTEf.OperativeReport ( ";
            qry += "IssueAuthorityCode ";
            qry += ", RegistrationNo ";
            qry += ", AdmissionNo ";
            qry += ", NAME ";
            qry += ", Age ";
            qry += ", [DATE] ";
            qry += ", TypeOfAnesthesia ";
            qry += ", AnesthetistID ";
            qry += ", SurgeonID ";
            qry += ", SecondarySurgeonID ";
            qry += ", AsstSurgeonID ";
            qry += ", OperativeDetails ";
            qry += ", PeriOpertiveComplications ";
            qry += ", EstimatedAmountOfBloodLoss ";
            qry += ", SurgicalSpecimenSentForExamination ";
            qry += ", Saved ";
            qry += ", OperatorID ";
            qry += ", Deleted, ";
            qry += "IPID, ";
            qry += "AdmissionDate ";
            qry += ") ";
            qry += "VALUES ( ";
            qry += "(SELECT TOP 1 IssueAuthorityCode FROM OrganisationDetails) ";
            qry += ", " + or.RegistrationNo + " ";
            qry += ", " + or.AdmissionNo + " ";
            qry += ", '" + this.Str(or.Name) + "' ";
            qry += ", '" + this.Str(or.Age) + "' ";
            qry += ", '" + or.Date + "' ";
            qry += ", '" + this.Str(or.TypeOfAnesthesia) + "' ";
            qry += ", " + or.AnesthetistID + " ";
            qry += ", " + or.SurgeonID + " ";
            qry += ", " + or.SecondarySurgeonID + " ";
            qry += ", " + or.AsstSurgeonID + " ";
            qry += ", '" + this.Str(or.OperativeDetails) + "' ";
            qry += ", '" + this.Str(or.PeriOpertiveComplications) + "' ";
            qry += ", " + or.EstimatedAmountOfBloodLoss + " ";
            if (or.SurgicalSpecimenSentForExamination)
                qry += ",1 ";
            else
                qry += ",0 ";
            qry += ", '" + or.Saved + "' ";
            qry += ", " + or.OperatorID + " ";
            qry += ",0, ";
            qry += " (Select ip.IPID from dbo.InPatient ip where ip.RegistrationNo = " + or.RegistrationNo + " and ip.AdminNo =" + or.AdmissionNo + "), ";
            qry += " (Select ip.AdmitDateTime from dbo.InPatient ip where ip.RegistrationNo = " + or.RegistrationNo + " and ip.AdminNo =" + or.AdmissionNo + ") ) end ";

            if (db.ExecuteSQL(qry))
                this.ErrorMessage = "Success";
            else
                this.ErrorMessage = "Failed";
            return this.ErrorMessage;
        }
        public List<OperativeReport> SelectAdmissionNo(string RegNo)
        {
            qry = "if exists (Select * from OTEf.OperativeReport where registrationNo = " + RegNo + " and Deleted = 0) ";
            qry += "begin ";
            qry += "Select AdmissionNo, AdmissionDate from OTEf.OperativeReport where RegistrationNo=" + RegNo + " and Deleted = 0 ";
            qry += "union all ";
            qry += "select ip.AdminNo as AdmissionNo, ip.AdmitDateTime as AdmissionDate ";
            qry += "from dbo.InPatient ip where ip.RegistrationNo = " + RegNo + " and ip.AdminNo not in ";
            qry += "( ";
            qry += "Select o.AdmissionNo from OTEf.OperativeReport o where o.RegistrationNo = " + RegNo + " ";
            qry += ") ";
            qry += "end ";
            qry += "else ";
            qry += "Select ip.AdminNo as AdmissionNo, ip.AdmitDateTime as AdmissionDate from InPatient ip inner join AgeType at on ip.AgeType = at.ID inner join Sex s on s.ID = ip.Sex ";
            qry += "where ip.RegistrationNo  = " + RegNo + "";
            this.ErrorMessage = "";
            return db.ExecuteSQLAndReturnDataTable(qry).ToList<OperativeReport>();
        }
        public string OperativeReport_Delete(string RegNo, string AdmNo)
        {
            qry = "update OTEf.OperativeReport ";
            qry += "set Deleted = 1 where RegistrationNo = " + RegNo + " and AdmissionNo = " + AdmNo + " ";
            if (db.ExecuteSQL(qry))
                this.ErrorMessage = "Success";
            else
                this.ErrorMessage = "Failed";
            return this.ErrorMessage;
        }
        public List<Select2Model> GetDoctors(string id)
        {
            qry = "declare @Name varchar (255) ";
            qry += "set @Name='" + this.Str(id) + "' ";
            qry += "Select top 20 d.ID, d.EmpCode +'-'+ d.Name as text, d.name from Doctor d ";
            qry += "where d.Deleted=0 and (d.EmpCode like @Name + '%' or d.Name like @Name +'%') order by d.EmpCode ";
            this.ErrorMessage = "";
            return db.ExecuteSQLAndReturnDataTable(qry).ToList<Select2Model>();
        }
        public List<Select2Model> GetICDCodes(string id)
        {
            qry = "declare @str varchar(255) ";
            qry += "set @str = '" + this.Str(id) + "' ";
            qry += "Select top 100  d.ID, d.Code + '-' + d.Description as text,d.Description as name ";
            qry += "from ICD10CODE d ";
            qry += "inner join ICD4CHLIST ic on ic.ID =  d.ID ";
            qry += "where (d.CODE like '%'+ @str + '%' or d.DESCRIPTION like '%'+ @str + '%')  ";
            qry += "and ic.Deleted = 0  and ic.EndDateTime is null";
            this.ErrorMessage = "";
            return db.ExecuteSQLAndReturnDataTable(qry).ToList<Select2Model>();
        }
        public List<Select2Model> GetProcedures(string id)
        {
            qry = "declare @str varchar(255) ";
            qry += "set @str = '" + this.Str(id) + "' ";
            qry += "Select top 20 s.ID as id, s.Code + ' - ' + s.Name as text, s.Name as name from Surgery s ";
            qry += "where s.Deleted=0 and (s.Code like @str + '%' or s.Name like @str +'%') order by s.Code ";
            this.ErrorMessage = "";
            return db.ExecuteSQLAndReturnDataTable(qry).ToList<Select2Model>();
        }

        public string OperativeReport_PerformedProcedures_Save(OperativeReport_PerformedProcedures orpp)
        {
            qry = "Insert into OTEf.OperativeReport_PerformedProcedures ";
            qry += "(OperativeReportID, ProcedureID, Saved, OperatorID, Deleted) ";
            qry += "values ( ";
            qry += "(Select ID from OTEf.OperativeReport where RegistrationNo = " + orpp.RegNo + " and AdmissionNo = " + orpp.AdmNo + "), ";
            qry += "" + orpp.ProcedureID + ", GETDATE(), " + orpp.OperatorID + ", 0) ";
            if (db.ExecuteSQL(qry))
                this.ErrorMessage = "Success";
            else
                this.ErrorMessage = "Failed";
            return this.ErrorMessage;
        }
        public string OperativeReport_PlannedProcedures_Save(OperativeReport_PlannedProcedures orpp)
        {
            qry = "Insert into OTEf.OperativeReport_PlannedProcedures ";
            qry += "(Deleted,OperativeReportID, OperatorID, ProcedureID, Saved)  ";
            qry += "values ";
            qry += "( ";
            qry += "0,(Select ID from OTEf.OperativeReport where RegistrationNo = " + orpp.RegNo + " and AdmissionNo = " + orpp.AdmNo + "), ";
            qry += "" + orpp.OperatorID + "," + orpp.ProcedureID + ",GETDATE() )";
            if (db.ExecuteSQL(qry))
                this.ErrorMessage = "Success";
            else
                this.ErrorMessage = "Failed";
            return this.ErrorMessage;
        }
        public string OperativeReport_PostOPDiagnosis_Save(OperativeReport_PostOPDiagnosis orpo)
        {
            qry = "Insert into OTEf.OperativeReport_PostOPDiagnosis ";
            qry += "(Deleted, ICDID, OperativeReportID, OperatorID, Saved) values ";
            qry += "(0, " + orpo.ICDID + ",(Select ID from OTEf.OperativeReport where RegistrationNo = " + orpo.RegNo + " and AdmissionNo = " + orpo.AdmNo + "), ";
            qry += " " + orpo.OperatorID + ", GETDATE()) ";
            if (db.ExecuteSQL(qry))
                this.ErrorMessage = "Success";
            else
                this.ErrorMessage = "Failed";
            return this.ErrorMessage;
        }
        public string OperativeReport_PreOPICDDiagnosis_Save(OperativeReport_PreOPICDDiagnosis orpr)
        {
            qry = "insert into OTEf.OperativeReport_PreOPICDDiagnosis ";
            qry += "(Deleted, ICDID, OperativeReportID, OperatorID, Saved)  ";
            qry += "values  ";
            qry += "(0, " + orpr.ICDID + ", ";
            qry += "(Select ID from OTEf.OperativeReport where RegistrationNo = " + orpr.RegNo + " and AdmissionNo = " + orpr.AdmNo + ") ,  ";
            qry += "" + orpr.OperatorID + ", GETDATE()) ";
            if (db.ExecuteSQL(qry))
                this.ErrorMessage = "Success";
            else
                this.ErrorMessage = "Failed";
            return this.ErrorMessage;
        }

        public List<OperativeReport_PerformedProcedures> OperativeReport_PerformedProcedures_Select(OperativeReport_PerformedProcedures orpp)
        {
            qry = "Select pp.ID, s.Code +' - '+ s.Name as Name from  ";
            qry += "OTEf.OperativeReport_PerformedProcedures  pp ";
            qry += "inner join OTEf.OperativeReport op on op.ID = pp.OperativeReportID ";
            qry += "inner join dbo.Surgery s on s.ID = pp.ProcedureID ";
            qry += "where op.RegistrationNo = " + orpp.RegNo + " and op.AdmissionNo = " + orpp.AdmNo + " and op.Deleted = 0 ";
            qry += "and pp.Deleted = 0 ";
            this.ErrorMessage = "";
            return db.ExecuteSQLAndReturnDataTable(qry).ToList<OperativeReport_PerformedProcedures>();
        }
        public List<OperativeReport_PlannedProcedures> OperativeReport_PlannedProcedures_Select(OperativeReport_PlannedProcedures orpp)
        {
            qry = "Select pp.ID, s.Code +' - '+ s.Name as Name from  ";
            qry += "OTEf.OperativeReport_PlannedProcedures pp ";
            qry += "inner join OTEf.OperativeReport op on op.ID = pp.OperativeReportID ";
            qry += "inner join dbo.Surgery s on s.ID = pp.ProcedureID ";
            qry += "where op.RegistrationNo = " + orpp.RegNo + " and op.AdmissionNo = " + orpp.AdmNo + " and op.Deleted = 0 ";
            qry += "and pp.Deleted = 0  ";
            this.ErrorMessage = "";
            return db.ExecuteSQLAndReturnDataTable(qry).ToList<OperativeReport_PlannedProcedures>();
        }
        public List<OperativeReport_PostOPDiagnosis> OperativeReport_PostOPDiagnosis_Select(OperativeReport_PostOPDiagnosis orpo)
        {
            qry = "Select pp.ID, c.CODE + ' - ' + c.DESCRIPTION as Name ";
            qry += "from  ";
            qry += "OTEf.OperativeReport_PostOPDiagnosis pp  ";
            qry += "inner join OTEf.OperativeReport o on pp.OperativeReportID = o.ID ";
            qry += "inner join ICD10CODE c on c.ID = pp.ICDID ";
            qry += "where o.RegistrationNo = " + orpo.RegNo + " and o.AdmissionNo = " + orpo.AdmNo + " and o.Deleted = 0  ";
            qry += "and pp.Deleted = 0 ";
            this.ErrorMessage = "";
            return db.ExecuteSQLAndReturnDataTable(qry).ToList<OperativeReport_PostOPDiagnosis>();
        }
        public List<OperativeReport_PreOPICDDiagnosis> OperativeReport_PreOPICDDiagnosis_Select(OperativeReport_PreOPICDDiagnosis orpo)
        {
            qry = "Select pp.ID, c.CODE + ' - ' + c.DESCRIPTION as Name ";
            qry += "from  ";
            qry += "OTEf.OperativeReport_PreOPICDDiagnosis pp  ";
            qry += "inner join OTEf.OperativeReport o on pp.OperativeReportID = o.ID ";
            qry += "inner join ICD10CODE c on c.ID = pp.ICDID ";
            qry += "where o.RegistrationNo = 2787 and o.AdmissionNo = 1 and o.Deleted = 0  ";
            qry += "and pp.Deleted = 0 ";
            this.ErrorMessage = "";
            return db.ExecuteSQLAndReturnDataTable(qry).ToList<OperativeReport_PreOPICDDiagnosis>();
        }

        public string OperativeReport_PerformedProcedures_Delete(string ID)
        {
            qry = "Update OTEf.OperativeReport_PerformedProcedures ";
            qry += "set Deleted = 1 where ID = " + ID + " ";
            if (db.ExecuteSQL(qry))
                this.ErrorMessage = "Success";
            else
                this.ErrorMessage = "Failed";
            return this.ErrorMessage;
        }
        public string OperativeReport_PlannedProcedures_Delete(string ID)
        {
            qry = "Update OTEf.OperativeReport_PlannedProcedures ";
            qry += "set Deleted = 1 where ID = " + ID + "";
            if (db.ExecuteSQL(qry))
                this.ErrorMessage = "Success";
            else
                this.ErrorMessage = "Failed";
            return this.ErrorMessage;
        }
        public string OperativeReport_PostOPDiagnosis_Delete(string ID)
        {
            qry = "Update OTEf.OperativeReport_PostOPDiagnosis ";
            qry += "set Deleted = 1 where ID = " + ID + " ";
            if (db.ExecuteSQL(qry))
                this.ErrorMessage = "Success";
            else
                this.ErrorMessage = "Failed";
            return this.ErrorMessage;
        }
        public string OperativeReport_PreOPICDDiagnosis_Delete(string ID)
        {
            qry = "Update OTEf.OperativeReport_PreOPICDDiagnosis ";
            qry += "set Deleted = 1 where ID = " + ID + " ";
            if (db.ExecuteSQL(qry))
                this.ErrorMessage = "Success";
            else
                this.ErrorMessage = "Failed";
            return this.ErrorMessage;
        }
        
        #endregion

        #region UTI Bundle 

        public List<UTIBundle> UTIBundle_GetAdmission(string RegNo)
        {
            qry = "if exists (Select * from OTEf.UTIBundle where registrationNo = "+ RegNo +" and Deleted = 0) ";
            qry += "begin ";
            qry += "Select AdmissionNo, AdmissionDate from OTEf.UTIBundle where RegistrationNo = "+ RegNo +" and Deleted = 0 ";
            qry += "union all ";
            qry += "select ip.AdminNo as AdmissionNo, ip.AdmitDateTime as AdmissionDate  ";
            qry += "from dbo.InPatient ip where ip.RegistrationNo = "+ RegNo +" and ip.AdminNo not in ";
            qry += "( ";
            qry += "Select o.AdmissionNo from OTEf.OperativeReport o where o.RegistrationNo = "+ RegNo +" ";
            qry += ") ";
            qry += "end ";
            qry += "else ";
            qry += "Select ip.AdminNo as AdmissionNo, ip.AdmitDateTime as AdmissionDate ";
            qry += "from InPatient ip ";
            qry += "inner join AgeType at on ip.AgeType = at.ID ";
            qry += "inner join Sex s on s.ID = ip.Sex where ip.RegistrationNo  = "+RegNo +" ";
            this.ErrorMessage = "";
            return db.ExecuteSQLAndReturnDataTable(qry).ToList<UTIBundle>();
        }
        public List<UTIBundle> UTIBundle_GetPatientDetails(string RegNo, string AdmNo)
        {
            qry = "IF EXISTS ( ";
            qry += "SELECT * ";
            qry += "FROM OTEf.UTIBundle ";
            qry += "WHERE registrationNo = "+ RegNo +" ";
            qry += "AND AdmissionNO = "+ AdmNo +" ";
            qry += "AND Deleted = 0 ";
            qry += ") ";
            qry += "BEGIN ";
            qry += "SELECT o.* ";
            qry += ", s.NAME AS Sex ";
            qry += "FROM OTEf.UTIBundle o ";
            qry += "INNER JOIN AllInpatients aip ON aip.IPID = o.IPID ";
            qry += "INNER JOIN Sex s ON s.ID = aip.Sex ";
            qry += "WHERE o.RegistrationNo = "+ RegNo +" ";
            qry += "AND o.AdmissionNo = "+ AdmNo +" ";
            qry += "END ";
            qry += "ELSE ";
            qry += "BEGIN ";
            qry += "SELECT ISNULL(ip.FamilyName, '') + ' ' + Isnull(ip.FirstName, '') + ' ' + isnull(ip.MiddleName, '') + ' ' + ip.LastName AS NAME ";
            qry += ", CONVERT(VARCHAR, ip.Age) + ' ' + at.NAME AS Age ";
            qry += ", s.NAME AS Sex ";
            qry += "FROM InPatient ip ";
            qry += "INNER JOIN AgeType at ON ip.AgeType = at.ID ";
            qry += "INNER JOIN Sex s ON s.ID = ip.Sex ";
            qry += "WHERE ip.RegistrationNo = "+ RegNo +" ";
            qry += "AND ip.AdminNo = "+ AdmNo +" ";
            qry += "END ";
            this.ErrorMessage = "";
            return db.ExecuteSQLAndReturnDataTable(qry).ToList<UTIBundle>();
        }
        public string UTIBundle_Insert(UTIBundle ub)
        {
            qry = "if exists( Select * from OTEf.UTIBundle where RegistrationNo = " + ub.RegistrationNo + " and AdmissionNo = " + ub.AdmissionNo + " and Deleted = 0 ) ";
            qry += "begin ";
            qry += "update OTEf.UTIBundle ";
            qry += "set "; 
            qry += "CatheterInsertedDateTime = '" + ub.CatheterInsertedDateTime + "', ";
            qry += "ByTrainedPerson = " + this.Bool(ub.ByTrainedPerson) + ", ";
            qry += "ByTrainedPersonRemarks = '" + this.Str(ub.ByTrainedPersonRemarks) + "', ";
            qry += "CatheterIndication = " + this.Bool(ub.CatheterIndication) + ", ";
            qry += "CatheterIndicationRemarks = '" + this.Str(ub.CatheterIndicationRemarks) + "', ";
            qry += "HandHygiene = " + this.Bool(ub.HandHygiene) + ", ";
            qry += "HandHygieneRemarks = '" + this.Str(ub.HandHygieneRemarks) + "', ";
            qry += "GlovesWorn = " + this.Bool(ub.GlovesWorn) + ", ";
            qry += "GlovesWornRemarks = '" + this.Str(ub.GlovesWornRemarks) + "', ";
            qry += "PatientCovered = " + this.Bool(ub.PatientCovered) + ", ";
            qry += "PatientCoveredRemarks = '" + this.Str(ub.PatientCoveredRemarks) + "', ";
            qry += "InsertionSiteCleaned = " + this.Bool(ub.InsertionSiteCleaned) + ", ";
            qry += "InsertionSiteCleanedRemarks = '" + this.Str(ub.InsertionSiteCleanedRemarks) + "', ";
            qry += "SiteLubricated = " + this.Bool(ub.SiteLubricated) + ", ";
            qry += "SiteLubricatedRemarks = '" + this.Str(ub.SiteLubricatedRemarks) + "', ";
            qry += "AppropriateSize = " + this.Bool(ub.AppropriateSize) + ", ";
            qry += "AppropriateSizeRemarks = '" + this.Str(ub.AppropriateSizeRemarks) + "', ";
            qry += "ClosedSystem = " + this.Bool(ub.ClosedSystem) + ", ";
            qry += "ClosedSystemRemarks = '" + this.Str(ub.ClosedSystemRemarks) + "', ";
            qry += "DrainageBagAttached = " + this.Bool(ub.DrainageBagAttached) + ", ";
            qry += "DrainageBagAttachedRemarks = '" + this.Str(ub.DrainageBagAttachedRemarks) + "', ";
            qry += "DrainageBagOffFloor	 = " + this.Bool(ub.DrainageBagOffFloor) + ", ";
            qry += "DrainageBagOffFloorRemarks = '" + this.Str(ub.DrainageBagOffFloorRemarks) + "',";
            qry += "CatheterSecured = " + this.Bool(ub.CatheterSecured) + ", ";
            qry += "CatheterSecuredRemarks = '" + this.Str(ub.CatheterSecuredRemarks) + "', ";
            qry += "TubingSecured = " + this.Bool(ub.TubingSecured) + ", ";
            qry += "TubingSecuredRemarks = '" + this.Str(ub.TubingSecuredRemarks) + "', ";
            qry += "ModifiedOn = GetDate(), ";
            qry += "ModfiedOperator = " + ub.ModfiedOperator + " ";
            qry += "end ";
            qry += "else ";
            qry += "begin ";
            qry += "Insert into OTEf.UTIBundle  ";
            qry += "( ";
            qry += "IssueAuthorityCode, ";
            qry += "RegistrationNo, ";
            qry += "AdmissionNo, ";
            qry += "AdmissionDate, ";
            qry += "IPID, ";
            qry += "Name, ";
            qry += "Age, ";
            qry += "CatheterInsertedDateTime, ";
            qry += "ByTrainedPerson, ";
            qry += "ByTrainedPersonRemarks, ";
            qry += "CatheterIndication, ";
            qry += "CatheterIndicationRemarks, ";
            qry += "HandHygiene, ";
            qry += "HandHygieneRemarks, ";
            qry += "GlovesWorn, ";
            qry += "GlovesWornRemarks, ";
            qry += "PatientCovered, ";
            qry += "PatientCoveredRemarks, ";
            qry += "InsertionSiteCleaned, ";
            qry += "InsertionSiteCleanedRemarks, ";
            qry += "SiteLubricated, ";
            qry += "SiteLubricatedRemarks, ";
            qry += "AppropriateSize, ";
            qry += "AppropriateSizeRemarks, ";
            qry += "ClosedSystem, ";
            qry += "ClosedSystemRemarks, ";
            qry += "DrainageBagAttached, ";
            qry += "DrainageBagAttachedRemarks, ";
            qry += "DrainageBagOffFloor, ";
            qry += "DrainageBagOffFloorRemarks, ";
            qry += "CatheterSecured, ";
            qry += "CatheterSecuredRemarks, ";
            qry += "TubingSecured, ";
            qry += "TubingSecuredRemarks, ";
            qry += "Deleted, ";
            qry += "OperatorID, ";
            qry += "Saved ";
            qry += ") ";
            qry += "values ";
            qry += "( ";
            qry += "(Select top 1 IssueAuthorityCode from OrganisationDetails), ";
            qry += "" + ub.RegistrationNo + ", ";
            qry += "" + ub.AdmissionNo + ", ";
            qry += "(Select AdmitDateTime from dbo.InPatient where RegistrationNo = "+ ub.RegistrationNo +" and AdminNo = "+ ub.AdmissionNo +"), ";
            qry += "(Select IPID from dbo.InPatient where RegistrationNo = "+ ub.RegistrationNo +" and AdminNo = "+ ub.AdmissionNo +"), ";
            qry += "'" + ub.Name + "', ";
            qry += "'" + ub.Age + "', ";
            qry += "'" + ub.CatheterInsertedDateTime + "', ";
            qry += "" + this.Bool(ub.ByTrainedPerson) + ", ";
            qry += "'" + this.Str(ub.ByTrainedPersonRemarks) + "', ";
            qry += "" + this.Bool(ub.CatheterIndication) + ", ";
            qry += "'" + this.Str(ub.CatheterIndicationRemarks) + "', ";
            qry += "" + this.Bool(ub.HandHygiene) + ", ";
            qry += "'" + this.Str(ub.HandHygieneRemarks) + "', ";
            qry += "" + this.Bool(ub.GlovesWorn) + ", ";
            qry += "'" + this.Str(ub.GlovesWornRemarks) + "', ";
            qry += "" + this.Bool(ub.PatientCovered) + ", ";
            qry += "'" + this.Str(ub.PatientCoveredRemarks) + "', ";
            qry += "" + this.Bool(ub.InsertionSiteCleaned) + ", ";
            qry += "'" + this.Str(ub.InsertionSiteCleanedRemarks) + "', ";
            qry += "" + this.Bool(ub.SiteLubricated) + ", ";
            qry += "'" + this.Str(ub.SiteLubricatedRemarks) + "', ";
            qry += "" + this.Bool(ub.AppropriateSize) + ", ";
            qry += "'" + this.Str(ub.AppropriateSizeRemarks) + "', ";
            qry += "" + this.Bool(ub.ClosedSystem) + ", ";
            qry += "'" + this.Str(ub.ClosedSystemRemarks) + "', ";
            qry += "" + this.Bool(ub.DrainageBagAttached) + ", ";
            qry += "'" + this.Str(ub.DrainageBagAttachedRemarks) + "', ";
            qry += "" + this.Bool(ub.DrainageBagOffFloor) + ", ";
            qry += "'" + this.Str(ub.DrainageBagOffFloorRemarks) + "', ";
            qry += "" + this.Bool(ub.CatheterSecured) + ", ";
            qry += "'" + this.Str(ub.CatheterSecuredRemarks) + "', ";
            qry += "" + this.Bool(ub.TubingSecured) + ", ";
            qry += "'" + this.Str(ub.TubingSecuredRemarks) + "', ";
            qry += "0, ";
            qry += ""+ ub.OperatorID +", ";
            qry += "GetDate() ";
            qry += ") ";
            qry += "end ";
            if (db.ExecuteSQL(qry))
                this.ErrorMessage = "Success";
            else
                this.ErrorMessage = "Failed";
            return this.ErrorMessage;
        }
        public string UTIBundle_Delete(string RegNo, string AdmNo)
        {
            qry = "Update OTEf.UTIBundle ";
            qry += "set Deleted = 1 ";
            qry += "where RegistrationNo = "+ RegNo +" and AdmissionNo ="+ AdmNo +" and deleted = 0";
            if (db.ExecuteSQL(qry))
                this.ErrorMessage = "Success";
            else
                this.ErrorMessage = "Failed";
            return this.ErrorMessage;
        }
        #endregion 

        // all other functions 
        public string Str(string _str)
        {
            if (String.IsNullOrEmpty(_str))
                return "";
            else
                return _str.Replace("'","''");
        }
        public string Bool(bool _val)
        {
            if (_val == true)
                return "1";
            else
                return "0";
        }
    }

    #region operative Report modals
    // all models
    public class OperativeReport
    {
        public int ID { get; set; } 
        public string IssueAuthorityCode { get; set; } 
        public int RegistrationNo { get; set; } 
        public int AdmissionNo { get; set; } 
        public string Name { get; set; } 
        public string Age { get; set; }
        public string Sex { get; set; }  
        public DateTime Date { get; set; } 
        public string TypeOfAnesthesia { get; set; } 
        public string NameOfAnesthetist { get; set; } 
        public string Surgeon { get; set; } 
        public string AsstSurgeon { get; set; } 
        public string PreOPDiagnosis { get; set; } 
        public string PostOPDiagnosis { get; set; } 
        public string PlannedProcedures { get; set; } 
        public string PerformedProcedures { get; set; } 
        public string OperativeDetails { get; set; } 
        public string PeriOpertiveComplications { get; set; } 
        public decimal EstimatedAmountOfBloodLoss { get; set; } 
        public bool SurgicalSpecimenSentForExamination { get; set; } 
        public DateTime Saved { get; set; } 
        public int OperatorID { get; set; } 
        public DateTime ModifiedOn { get; set; } 
        public int ModifiedOperatorID { get; set; } 
        public bool Deleted { get; set; }
        public int IPID { get; set; }
        public DateTime AdmissionDate { get; set; }
        
        public int AnesthetistID { get; set; }
        public int SurgeonID { get; set; }
        public int SecondarySurgeonID { get; set; }
        public int AsstSurgeonID { get; set; }
        public string AnesName { get; set; }
        public string SurgName { get; set; }
        public string Sec_surgName { get; set; }
        public string AsstName { get; set; }

    }
    public class OperativeReport_PerformedProcedures
    {
        public int ID { get; set; } 
        public int OperativeReportID { get; set; } 
        public int ProcedureID { get; set; } 
        public DateTime Saved { get; set; } 
        public int OperatorID { get; set; } 
        public bool Deleted { get; set; }
        public int RegNo { get; set; }
        public int AdmNo { get; set; }
        public string Name { get; set; }
    }
    public class OperativeReport_PlannedProcedures
    {
        public int ID { get; set; } 
        public int? OperativeReportID { get; set; } 
        public int? ProcedureID { get; set; } 
        public DateTime? Saved { get; set; } 
        public int? OperatorID { get; set; } 
        public bool? Deleted { get; set; }
        public int RegNo { get; set; }
        public int AdmNo { get; set; }
        public string Name {get;set;}
    }
    public class OperativeReport_PostOPDiagnosis
    {
        public int ID { get; set; } 
        public int OperativeReportID { get; set; } 
        public int ICDID { get; set; } 
        public DateTime Saved { get; set; } 
        public int OperatorID { get; set; } 
        public bool Deleted { get; set; }
        public int RegNo { get; set; }
        public int AdmNo { get; set; }
        public string Name { get; set; }
    }
    public class OperativeReport_PreOPICDDiagnosis
    {
        public int ID { get; set; } 
        public int OperativeReportID { get; set; } 
        public int ICDID { get; set; } 
        public DateTime Saved { get; set; } 
        public int OperatorID { get; set; } 
        public bool Deleted { get; set; }
        public int RegNo { get; set; }
        public int AdmNo { get; set; }
        public string Name { get; set; }
    }
    
    #endregion

    #region UTI Bundles Modals
    public class UTIBundle
    {
        public int ID { get; set; }
        public string IssueAuthorityCode { get; set; }
        public int RegistrationNo { get; set; }
        public int AdmissionNo { get; set; }
        public DateTime AdmissionDate { get; set; }
        public int IPID { get; set; }
        public string Name { get; set; }
        public string Age { get; set; }
        public string Sex { get; set; }
        public DateTime CatheterInsertedDateTime { get; set; }
        public bool ByTrainedPerson { get; set; }
        public string ByTrainedPersonRemarks { get; set; }
        public bool CatheterIndication { get; set;   }
        public string CatheterIndicationRemarks { get; set; }
        public bool HandHygiene { get; set; }
        public string HandHygieneRemarks { get; set; }
        public bool GlovesWorn { get; set; }
        public string GlovesWornRemarks { get; set; }
        public bool PatientCovered { get; set; }
        public string PatientCoveredRemarks { get; set; }
        public bool InsertionSiteCleaned { get; set; }
        public string InsertionSiteCleanedRemarks { get; set; }
        public bool SiteLubricated { get; set;   }
        public string SiteLubricatedRemarks { get; set; }
        public bool AppropriateSize { get; set; }
        public string AppropriateSizeRemarks { get; set; }
        public bool ClosedSystem { get; set; }
        public string ClosedSystemRemarks { set;get; }
        public bool DrainageBagAttached { get; set; }
        public string DrainageBagAttachedRemarks { get; set; }
        public bool DrainageBagOffFloor { get; set; }
        public string DrainageBagOffFloorRemarks { get; set; }
        public bool CatheterSecured { get; set; }
        public string CatheterSecuredRemarks { get; set; }
        public bool TubingSecured { get; set; }
        public string TubingSecuredRemarks { get; set; }
        public bool Deleted { get; set; }
        public int OperatorID { get; set; }
        public DateTime Saved { get; set; }
        public DateTime ModifiedOn { get; set; }
        public int ModfiedOperator { get; set; }
    }
    #endregion 
    public class Select2Model 
    {
        public int id { get; set; }
        public string text { get; set; }
        public string name { get; set; }
    }
}