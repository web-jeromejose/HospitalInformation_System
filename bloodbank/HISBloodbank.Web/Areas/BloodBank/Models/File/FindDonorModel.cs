using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;

using HIS_BloodBank.Models;
using System.Text;

namespace HIS_BloodBank.Areas.BloodBank.Models
{
    public class FindDonorModel
    {
        public string ErrorMessage { get; set; }
        DBHelper db = new DBHelper();
        StringBuilder sql = new StringBuilder();

        public List<DonorDashboardDAL> Dashboard()
        {
            sql.Clear();
            sql.Append("  select TOP 1000 ROW_NUMBER() OVER(  order by a.datetime desc )  as rn, isnull(a.DonorRegistrationNo, 0) as RegistrationNo   ");
            sql.Append("  ,c.name as donortypetext , d.name as bloodgroupname,e.NAME as sexname ");
            //sql.Append("  --=-- donor table ");
            sql.Append("  ,a.DonorType,a.ipid,a.ID,a.Name,a.Status,a.DonorNo,a.DonorRegistrationNO,a.ExpiryDate,a.age,a.ppobox,a.address1,a.cityname,a.address2,a.pzipcode,a.pphone,a.pcellno,a.DateTime,a.DateofBirth,a.Sex,a.BloodGroup,a.Religion,a.Occupation,a.Maritialstatus,a.LastDonatedDate,a.OPNO,a.Hb,a.Weight,a.BP,a.Temperature,a.Pulse,a.Phlebotomist,a.volumeDrawn,a.Bagtype,a.Company,a.Venisite,a.WillingTodonate,a.HealthHistory,a.operatorid,a.stationid,a.Title,a.District,a.HospitalId,a.Type,a.deleted,a.GroupOperatorId,a.Remarks,a.DonorStatus,a.DonatedDate,a.ReactionId,a.nationality,a.bleddingdate,a.iqama,a.pcity,a.country,a.countryname,a.pemail,a.ppagerno,a.IssueAuthorityCode,a.Iqamaissuedate,a.IqamaIssuePlace,a.Sgpt,a.Bilrubin,a.hct,a.plt,a.Suffers,a.Vaccination,a.Antidrugs,a.Questionairespos,a.Questionairesneg,a.Procid,a.screenresult,a.PAmount,a.idd,a.screenvalue,a.screendate,a.Ausab,a.PatientRegistrationNO,a.BillNo,a.IssueID,a.IssueMappedDateTime,a.Aganistbill,a.IssueBagnumber,a.PRINTNO,a.labno ");
            sql.Append("  from donorreg  a  ");
            sql.Append("  left join allinpatients b on a.ipid = b.IPID  ");
            sql.Append("  left join dbo.DonorType c on a.DonorType = c.id ");
            sql.Append("  left join dbo.BloodGroup d on a.BloodGroup = d.id ");
            sql.Append("  left join dbo.sex e on a.Sex = e.ID ");
            
            sql.Append("  order by a.datetime desc ");


            List<DonorDashboardDAL> list = db.ExecuteSQLAndReturnDataTable(sql.ToString()).DataTableToList<DonorDashboardDAL>();
            return list;
        }

        public List<DonorScreenResult> GetDonorScreeningReuslt(int donorRegiesterNo)
        {
            string sql = "select d.Name, convert(varchar(25), GETDATE() , 106) CurrentDate, convert(varchar(10), d.Age) + ' Yrs/' + x.Name AgeSex, " +
                            "convert(varchar(25), d.DonatedDate, 106) DonatedDate, d.id UnitNumber, d.DonorRegistrationNO DonorNo, " +
                            "isnull(d.address1, '') Address1, isnull(d.address2, '') Address2, " +
                            "g.name ABOGroup, convert(char(5), convert(varchar(10), d.Hb)) + ' mg/dl' HB,  " +
                            "convert(char(3), convert(varchar(10), d.hct)) + ' %' Hct,  " +
                            "convert(char(3), convert(varchar(10), d.plt)) Plt, " +
                            "convert(varchar(25), s.DateTime, 106) ScreenDate,  " +
                            "case when d.Status = 3 then 'NEGATIVE' " +
                                 "when d.Status = 2 then 'POSITIVE' " +
                                 "else 'NEW' " +
                            "end RhDType, " +
                            "u.screen, u.status " +
                        "from DonorReg d " +
                        "inner join sex x on d.sex = x.ID " +
                        "inner join BloodGroup g on g.id = d.BloodGroup " +
                        "left join Screen s on s.Bagnumber = d.id " +
                        "cross apply dbo.GetScreeningResult("+ donorRegiesterNo + ") u " +
                        "where d.DonorRegistrationNO = " + donorRegiesterNo + "";

            List<DonorScreenResult> list = db.ExecuteSQLAndReturnDataTable(sql.ToString()).DataTableToList<DonorScreenResult>();
            return list;
        }

        public List<DonorDashboardDAL> List(DonorListParam entry)
        {
            sql.Clear();

            sql.Append("  select ROW_NUMBER() OVER(  order by a.datetime desc )  as rn,isnull(b.RegistrationNo,0) as RegistrationNo   ");
            sql.Append("  ,c.name as donortypetext , d.name as bloodgroupname,e.NAME as sexname ");
            //sql.Append("  --=-- donor table ");
            sql.Append("  ,a.DonorType,a.ipid,a.ID,a.Name,a.Status,a.DonorNo,a.DonorRegistrationNO,a.ExpiryDate,a.age,a.ppobox,a.address1,a.cityname,a.address2,a.pzipcode,a.pphone,a.pcellno,a.DateTime,a.DateofBirth,a.Sex,a.BloodGroup,a.Religion,a.Occupation,a.Maritialstatus,a.LastDonatedDate,a.OPNO,a.Hb,a.Weight,a.BP,a.Temperature,a.Pulse,a.Phlebotomist,a.volumeDrawn,a.Bagtype,a.Company,a.Venisite,a.WillingTodonate,a.HealthHistory,a.operatorid,a.stationid,a.Title,a.District,a.HospitalId,a.Type,a.deleted,a.GroupOperatorId,a.Remarks,a.DonorStatus,a.DonatedDate,a.ReactionId,a.nationality,a.bleddingdate,a.iqama,a.pcity,a.country,a.countryname,a.pemail,a.ppagerno,a.IssueAuthorityCode,a.Iqamaissuedate,a.IqamaIssuePlace,a.Sgpt,a.Bilrubin,a.hct,a.plt,a.Suffers,a.Vaccination,a.Antidrugs,a.Questionairespos,a.Questionairesneg,a.Procid,a.screenresult,a.PAmount,a.idd,a.screenvalue,a.screendate,a.Ausab,a.PatientRegistrationNO,a.BillNo,a.IssueID,a.IssueMappedDateTime,a.Aganistbill,a.IssueBagnumber,a.PRINTNO,a.labno ");
            sql.Append("  from donorreg  a  ");
            sql.Append("  left join allinpatients b on a.ipid = b.IPID  ");
            sql.Append("  left join dbo.DonorType c on a.DonorType = c.id ");
            sql.Append("  left join dbo.BloodGroup d on a.BloodGroup = d.id ");
            sql.Append("  left join dbo.sex e on a.Sex = e.ID ");
            sql.Append("  where 1= 1  ");
            if (entry.filterunitno != null)
            {
                sql.Append("  and  a.id like '%" + entry.filterunitno.Trim() + "%'  ");
            }
            if (entry.filterpin != null)
            {
                sql.Append("  and  a.patientregistrationno like '%" + entry.filterpin.Trim() + "%'  ");
            }
            if (entry.filterregnoIS != null)
            {
                sql.Append("  and  a.DonorRegistrationNO " + entry.filterregnoIS + " '" + entry.filterregno.Trim() + "'  ");
            }
            if (entry.filterregdateIS != null)
            {
                sql.Append("  and   a.datetime " + entry.filterregdateIS + "   '" + entry.filterregdate + "'  ");
            }
            if (entry.filterdonatedateIS != null)
            {
                sql.Append("  and  a.DonatedDate " + entry.filterdonatedateIS + "   '" + entry.filterdonatedate + "'  ");
            }
            if (entry.filterageIS != null)
            {
                sql.Append("  and  a.age  " + entry.filterageIS + "  '" + entry.filterage.Trim() + "'  ");
            }
            if (entry.donorname != null)
            {
                sql.Append("  and  a.Name like '%" + entry.donorname.Trim() + "%'  ");
            }
            if (entry.gender != 0)
            {
                sql.Append("  and  a.sex = '" + entry.gender + "'  ");
            }
            if (entry.nationality != 0)
            {
                sql.Append("  and  a.nationality = '" + entry.nationality + "'  ");
            }
            if (entry.address1 != null)
            {
                sql.Append("  and  a.address1 like '%" + entry.address1.Trim() + "%'  ");
            }
            if (entry.address2 != null)
            {
                sql.Append("  and  a.address2 like '%" + entry.address2.Trim() + "%'  ");
            }
            if (entry.bagno != null)
            {
                sql.Append("  and  a.id = '" + entry.bagno.Trim() + "'  ");
            }
            if (entry.donortype != 0)
            {
                sql.Append("  and  a.donortype = '" + entry.donortype + "'  ");
            }
            if (entry.bloodgroup != 0)
            {
                sql.Append("  and  a.bloodgroup = '" + entry.bloodgroup + "'  ");
            }
            if (entry.donorstatus != 0)
            {
                sql.Append("  and  a.donorstatus = '" + entry.donorstatus + "'  ");
            }
            if (entry.iqama != null)
            {
                sql.Append("  and  a.Iqama = '" + entry.iqama.Trim() + "'  ");
            }
            sql.Append("  order by a.datetime desc ");

            List<DonorDashboardDAL> list = db.ExecuteSQLAndReturnDataTable(sql.ToString()).DataTableToList<DonorDashboardDAL>();
            return list;

        }


    }

    public class DonorScreenResult
    {
        public string Name { get; set; }
        public string AgeSex { get; set; }
        public string CurrentDate { get; set; }
        public string DonatedDate { get; set; }
        public string UnitNumber { get; set; }
        public string DonorNo { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string ABOGroup { get; set; }
        public string HB { get; set; }
        public string Hct { get; set; }
        public string Plt { get; set; }
        public string ScreenDate { get; set; }
        public string RhDType { get; set; }
        public string screen { get; set; }
        public string status { get; set; }
    }

        public class DonorDashboardDAL
    {

        public int rn { get; set; }
        public string RegistrationNo { get; set; }
        public string bloodgroupname { get; set; }
        public string donortypetext { get; set; }
        public string sexname { get; set; }


        //all TABLE DonorREg FIELD
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
        public string Age { get; set; }
        public string Sex { get; set; }
        public string BloodGroup { get; set; }
        public string Religion { get; set; }
        public string Occupation { get; set; }
        public string Maritialstatus { get; set; }
        public string LastDonatedDate { get; set; }
        public string DonorType { get; set; }
        public string ipid { get; set; }
        public string OPNO { get; set; }
        public string Hb { get; set; }
        public string Weight { get; set; }
        public string BP { get; set; }
        public string Temperature { get; set; }
        public string Pulse { get; set; }
        public string Phlebotomist { get; set; }
        public string volumeDrawn { get; set; }
        public string Bagtype { get; set; }
        public string Company { get; set; }
        public string Venisite { get; set; }
        public string WillingTodonate { get; set; }
        public string HealthHistory { get; set; }
        public string operatorid { get; set; }
        public string stationid { get; set; }
        public string Title { get; set; }
        public string District { get; set; }
        public string HospitalId { get; set; }
        public string Type { get; set; }
        public string deleted { get; set; }
        public string GroupOperatorId { get; set; }
        public string Status { get; set; }
        public string DonorNo { get; set; }
        public string DonorRegistrationNO { get; set; }
        public string ExpiryDate { get; set; }
        public string Remarks { get; set; }
        public string DonorStatus { get; set; }
        public string DonatedDate { get; set; }
        public string ReactionId { get; set; }
        public string nationality { get; set; }
        public string bleddingdate { get; set; }
        public string iqama { get; set; }
        public string pcity { get; set; }
        public string country { get; set; }
        public string countryname { get; set; }
        public string pemail { get; set; }
        public string ppagerno { get; set; }
        public string IssueAuthorityCode { get; set; }
        public string Iqamaissuedate { get; set; }
        public string IqamaIssuePlace { get; set; }
        public string Sgpt { get; set; }
        public string Bilrubin { get; set; }
        public string hct { get; set; }
        public string plt { get; set; }
        public string Suffers { get; set; }
        public string Vaccination { get; set; }
        public string Antidrugs { get; set; }
        public string Questionairespos { get; set; }
        public string Questionairesneg { get; set; }
        public string Procid { get; set; }
        public string screenresult { get; set; }
        public string PAmount { get; set; }
        public string idd { get; set; }
        public string screenvalue { get; set; }
        public string screendate { get; set; }
        public string Ausab { get; set; }
        public string PatientRegistrationNO { get; set; }
        public string BillNo { get; set; }
        public string IssueID { get; set; }
        public string IssueMappedDateTime { get; set; }
        public string Aganistbill { get; set; }
        public string IssueBagnumber { get; set; }
        public string PRINTNO { get; set; }
        public string labno { get; set; }

    }


    public class DonorListParam
    {
        public DonorListParam() { }
        public string filterunitno { get; set; }
        public string filterpin { get; set; }
        public string filterregnoIS { get; set; }
        public string filterregno { get; set; }
        public string filterregdateIS { get; set; }
        public string filterregdate { get; set; }
        public string filterdonatedateIS { get; set; }
        public string filterdonatedate { get; set; }
        public string filterageIS { get; set; }
        public string filterage { get; set; }

        public string donorname { get; set; }
        public int gender { get; set; }
        public int nationality { get; set; }
        public string address1 { get; set; }
        public string address2 { get; set; }
        public string bagno { get; set; }

        public int donortype { get; set; }
        public int bloodgroup { get; set; }
        public int donorstatus { get; set; }
        public string iqama { get; set; }
    
    }



}