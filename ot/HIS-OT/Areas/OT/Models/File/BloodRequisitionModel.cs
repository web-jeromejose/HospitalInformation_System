using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Data;
using DataLayer;

namespace HIS_OT.Areas.OT.Models.File
{
    public class BloodRequisitionModel
    {
        public string ErrorMessage { get; set; }

        DBHelper DB = new DBHelper("OT");

        public BloodRequest GetBloodRequestDAL(int id)
        {
            try
            {
                string sql =
                "SELECT a.id, " +
                        "ISNULL(k.name,'Non-Package') as Package, i.Name as Category, p.BloodGroup, " +
                        "h.Code as Company, h.Name as CompanyName, "+
                        "ip.ICDCODE + ' - ' + ip.ICDDescription as Diagnosis, " +
                        "CONVERT(varchar(5), p.Age) + ' Year(s)' Age, x.NAME Sex,  " +
                        "s.prefix + '-' + CONVERT(varchar(20), a.stationslno) as [CombineOrderNo], a.ipid, " +
                        "p.IssueAuthoritycode + '.' + REPLICATE('0', (10 - len(p.Registrationno))) + CONVERT(varchar(10), p.Registrationno) as PIN, " +
                        "a.doctorid, e.Name DoctorName, a.datetime EntryDateTime, " +
                        "b.ID as BedID, b.Name as Bed, " +
                        "a.reqtype, a.transtype, a.replace, a.wbc, a.rbc, a.hb, a.pt, a.pcv, a.platelet, a.others, a.pttk, a.earlierdetct " +
                "FROM his.dbo.Bloodorder a " +
                "INNER JOIN his.dbo.Employee e " +
                    "ON a.doctorid = e.ID " +
                "INNER JOIN his.dbo.station s " +
                    "ON s.id = a.stationid " +
                "INNER JOIN his.dbo.InPatient p " +
                    "ON a.IPID = p.IPID " +
                "INNER JOIN his.dbo.Bed b " +
                    "ON a.bedid = b.id " +
                "INNER JOIN SEX x " +
                    "ON x.id = p.Sex " +
                "INNER JOIN Category i " +
                    "ON i.ID = p.categoryid " +
                "INNER JOIN Company h " +
                    "ON h.ID = p.companyid " +
                "INNER JOIN	his.dbo.Ipicddetail ip " +
                    "ON	ip.ipid = b.IPID " +
                "LEFT JOIN ippackage d " +
                    "ON d.ipid = a.ipid " +
                "LEFT JOIN Package k " +
                    "ON k.id = d.packageid " +
                "WHERE   a.id = " + id + "";

                var result = DB.ExecuteSQLAndReturnDataTable(sql).DataTableToModel<BloodRequest>();

                sql = "";
                sql = "SELECT a.componentid ComponentID, c.Code Code, c.Name ComponentName, a.quantity Quantity, a.rdatetime RequiredDate, a.remarks Remarks " +
                      "FROM his.dbo.BloodOrderDetail a " +
                      "INNER JOIN Component c " +
                        "ON c.id = a.componentid " +
                      "WHERE   a.orderid = " + id + "";

                result.BloodRequestDetails = DB.ExecuteSQLAndReturnDataTable(sql).DataTableToList<BloodRequestDetail>();
                return result;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public List<BloodRequisition> GetBloodRequestDAL(string stationId)
        {
            try
            {
                string sql =
                "SELECT DISTINCT a.id, " +
                        "s.prefix + '-' + CONVERT(varchar(20), a.stationslno) as [CombineOrderNo],  " +
                        "a.stationslno as [OrderNo], a.status, " +
                        "CONVERT(varchar(17), a.datetime, 113) as [DateTime], b.RegistrationNo, " +
                        "b.issueauthoritycode, b.ipid, c.ID as BedID, c.Name as Bed,  " +
                        "RTrim(b.FirstName) + ' ' + RTrim(b.MiddleName) + ' ' + RTrim(b.LastName) as [PatientName],  " +
                        "d.Name as [OperatorName], s.prefix, " +
                        "s.name as [StationName], A.ID as BloodOrderID, " +
                        "b.IssueAuthoritycode + '.' + REPLICATE('0', (10 - len(b.Registrationno))) + CONVERT(varchar(10),  " +
                        "b.Registrationno) as PIN, " +
                        "b.DoctorID, a.Demand " +
                "FROM his.dbo.BLOODORDER a " +
                "INNER JOIN his.dbo.InPatient b " +
                    "ON a.IPID = b.IPID " +
                "INNER JOIN his.dbo.Bed c " +
                    "ON a.bedid = c.ID " +
                "INNER JOIN his.dbo.Employee d " +
                    "ON a.wOperatorID = d.ID " +
                "INNER JOIN his.dbo.station s " +
                    "ON s.id = a.stationid " +
                "WHERE   a.status <> 6 " +
                        "and s.id = " + stationId + " " +
                        "and b.admitdatetime > '12/23/2006' " +
                "ORDER BY s.prefix + '-' + convert(varchar(20), a.stationslno) DESC";

                return DB.ExecuteSQLAndReturnDataTable(sql).DataTableToList<BloodRequisition>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public Response BloodRequestSave(BloodRequestModel m, List<BloodDetailModel> det)
        {
            try
            {
                DataTable dt_detail = new DataTable();
                dt_detail.Columns.AddRange(new[] {
                    new DataColumn("componentid", typeof(string)),
                    new DataColumn("RDATETIME", typeof(string)),
                    new DataColumn("Quantity", typeof(string)),
                    new DataColumn("Remarks", typeof(string))
                });
                if (det != null)
                {
                    foreach (var i in det)
                    {
                        DataRow newRowsdet = dt_detail.NewRow();
                        newRowsdet["componentid"] = i.id;
                        newRowsdet["RDATETIME"] = i.RequiredDate;
                        newRowsdet["Quantity"] = i.Quantity;
                        newRowsdet["Remarks"] = i.Remarks;
                        dt_detail.Rows.Add(newRowsdet);
                    }
                }
                System.IO.StringWriter swdt = new System.IO.StringWriter();
                dt_detail.TableName = "Data";
                dt_detail.WriteXml(swdt);

                DB.param = new SqlParameter[]{
                    new SqlParameter("@stationid", m.StationID),
                    new SqlParameter("@OperatorID", m.OperatorId),
                    new SqlParameter("@IPID", m.IPID),
                    new SqlParameter("@DoctorID", m.DoctorId),
                    new SqlParameter("@transtype", m.TypeofTransfusion),
                    new SqlParameter("@reqtype", m.TypeofRequest),
                    new SqlParameter("@ireplace", m.Donor),
                    new SqlParameter("@wbc", string.IsNullOrEmpty(m.WBC) ? "0" : m.WBC),
                    new SqlParameter("@rbc", string.IsNullOrEmpty(m.RBC) ? "0" : m.RBC),
                    new SqlParameter("@hb", string.IsNullOrEmpty(m.HB) ? "0" :m.HB),
                    new SqlParameter("@pcv", string.IsNullOrEmpty(m.PCV) ? "0" :m.PCV),
                    new SqlParameter("@OrderID", string.IsNullOrEmpty(m.BloodOrderID) ? "" : m.BloodOrderID),
                    new SqlParameter("@platelet", string.IsNullOrEmpty(m.Platelet) ? "0" :m.Platelet),
                    new SqlParameter("@others", string.IsNullOrEmpty(m.Others ) ? "0" :m.Others),
                    new SqlParameter("@earlierdetct", string.IsNullOrEmpty(m.EarlierDefect) ? "0" :m.EarlierDefect),
                    new SqlParameter("@Clinicaldetails", m.Diagnosis),
                    new SqlParameter("@pt", string.IsNullOrEmpty(m.PT) ? "0": m.PT),
                    new SqlParameter("@pttk", string.IsNullOrEmpty(m.PTTK) ? "0": m.PTTK),
                    new SqlParameter("@demand", "0"),
                    new SqlParameter("@XML", swdt.ToString())
            };
                DB.ExecuteSPAndReturnDataTable("OT.OT_WARDS_BLOOD_REQUEST_SAVE");
                Response res = new Response();
                res.Flag = "1";
                res.Message = "Blood Request Record Saved!";
                return res;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
    }

    public class Response
    {
        public string Flag { get; set; }
        public string Message { get; set; }
    }

    public class MyFilter
    {
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public int StationId { get; set; }
        public int CurrentStationID { get; set; }
    }

    public class BloodRequisition
    {
        public int ID { get; set; }
        public string CombineOrderNo { get; set; }
        public string OrderNo { get; set; }
        public string Status { get; set; }
        public string DateTime { get; set; }
        public string PIN { get; set; }
        public string PatientName { get; set; }
        public string OperatorName { get; set; }
        public string StationName { get; set; }
        public string RegistrationNo { get; set; }
        public int BloodOrderID { get; set; }
        public int Demand { get; set; }
    }

    public class BloodRequest
    {
        public int Id { get; set; }
        public string CombineOrderNo { get; set; }
        public string Age { get; set; }
        public string Sex { get; set; }
        public string BloodGroup { get; set; }
        public string Diagnosis { get; set; }
        public string Company { get; set; }
        public string CompanyName { get; set; }
        public string Package { get; set; }
        public string Category { get; set; }
        public int DoctorId { get; set; }
        public string DoctorName { get; set; }
        public int BedID { get; set; }
        public string Bed { get; set; }
        public string EntryDateTime { get; set; }
        public int IPID { get; set; }
        public string PIN { get; set; }
        public string ReqType { get; set; }
        public string TransType { get; set; }
        public string Replace { get; set; }
        public string WBC { get; set; }
        public string RBC { get; set; }
        public string HB { get; set; }
        public string PT { get; set; }
        public string PCV { get; set; }
        public string Platelet { get; set; }
        public string Others { get; set; }
        public string PTTK { get; set; }
        public string EarlierDetct { get; set; }
        public List<BloodRequestDetail> BloodRequestDetails { get; set; }
    }

    public class BloodRequestDetail
    {
        public string Code { get; set; }
        public string ComponentID { get; set; }
        public string ComponentName { get; set; }
        public string RequiredDate { get; set; }
        public string Quantity { get; set; }
        public string Remarks { get; set; }
    }

    public class BloodRequestModel
    {
        public int ID { get; set; }
        public string RegistrationNo { get; set; }
        public string Prefix { get; set; }
        public string Status { get; set; }
        public string CombineOrderNo { get; set; }
        public string OrderNo { get; set; }
        public string DateTime { get; set; }
        public string IssueAuthoritycode { get; set; }
        public string IPID { get; set; }
        public string BedID { get; set; }
        public string BloodOrderID { get; set; }
        public string PIN { get; set; }
        public string PatientName { get; set; }
        public string DoctorId { get; set; }
        public string Bed { get; set; }
        public string StationName { get; set; }
        public string OperatorName { get; set; }
        public int OperatorId { get; set; }
        public string TypeofRequest { get; set; }
        public string TypeofTransfusion { get; set; }
        public string Donor { get; set; }
        public string WBC { get; set; }
        public string RBC { get; set; }
        public string PCV { get; set; }
        public string HB { get; set; }
        public string Platelet { get; set; }
        public string Others { get; set; }
        public string PT { get; set; }
        public string PTTK { get; set; }
        public string EarlierDefect { get; set; }
        public string Diagnosis { get; set; }
        public string StationID { get; set; }

        //public string BedName { get; set; }
        //public string Docid { get; set; }
        //public List<BloodDetail> SelectedBlood { get; set; }
        //public List<BloodDetail> BloodList { get; set; }
    }

    public class BloodDetailModel : ListModel
    {
        public string Code { get; set; }
        public string ComponentID { get; set; }
        public string ComponentName { get; set; }
        public string RequiredDate { get; set; }
        public string Quantity { get; set; }
        public string Remarks { get; set; }
        public string DemandQuantity { get; set; }
        public string PrevQuantity { get; set; }
    }

    public class ListModel
    {
        public string id { get; set; }
        public string name { get; set; }
        public string text { get; set; }
    }


}