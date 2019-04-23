using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Data;
using DataLayer;

namespace HIS_OT.Areas.OT.Models.File
{
    public class BloodDemandModel
    {
        DBHelper DB = new DBHelper("OT");

        public BloodDemand GetBloodDemandDAL(int id, int stationId)
        {
            try
            {
                string sql = "SELECT d1.prefix + '-' + CONVERT(varchar(20), bo.stationslno) as CombineOrderNo, " +
                               "e1.Name as OperatorName, bo.DateTime as DateTime, " +
                               "a.IPID, bo.id, b.PatientName as name, x.name Sex, " +
                               "c.Name as Bed, c.ID as BedID, a.AdmitDateTime, d.Name as Station, e.EmpCode + ' - ' + e.Name as DoctorName, e.ID as DoctorId, " +
                               "CONVERT(varchar(3), b.Age) + ' ' + at.Name Age, f.Name as Category, g.Code + '-'+  g.Name as CompanyName, a.BloodGroup, " +
                               "ISNULL(pp.Name,'Non Package Patient') as Package, " +
                               "ip.ICDCODE  + ' - ' + ip.ICDDescription as Diagnosis, " +
                               "a.IssueAuthoritycode + '.' + REPLICATE('0', (10 - len(a.Registrationno))) + CONVERT(varchar(10),  " +
                               "a.Registrationno) as PIN " +
                       "FROM his.dbo.InPatient a " +
                       "INNER JOIN his.dbo.ALLPATIENTS b " +
                            "ON a.RegistrationNo = b.Registrationno " +
                       "INNER JOIN his.dbo.bed c " +
                            "ON a.IPID = c.IPID " +
                       "INNER JOIN his.dbo.Station d " +
                            "ON c.StationID = d.ID " +
                       "INNER JOIN his.dbo.employee e " +
                            "ON a.DoctorID = e.ID " +
                       "INNER JOIN his.dbo.category f " +
                            "ON a.CategoryID = f.ID " +
                       "INNER JOIN his.dbo.company g " +
                            "ON a.CompanyID = g.ID " +
                       "INNER JOIN his.dbo.Ipicddetail ip " +
                            "ON ip.ipid = a.IPID " +
                       "INNER JOIN his.dbo.BloodOrder bo " +
                            "ON bo.ipid = a.IPID " +
                       "INNER JOIN his.dbo.Station d1 " +
                            "ON bo.StationID = d1.ID " +
                       "INNER JOIN his.dbo.employee e1 " +
                            "ON bo.woperatorid = e1.ID " +
                        "INNER JOIN his.dbo.Sex x " +
                            "ON x.id = a.Sex " +
                        "INNER JOIN his.dbo.AgeType at " +
                            "ON at.id = a.AgeType " +
                       "LEFT JOIN his.dbo.IpPackage p " +
                            "ON a.IPID = p.Ipid " +
                       "LEFT JOIN his.dbo.Package pp " +
                            "ON p.PackageId = pp.Id " +
                       //"WHERE c.Status = 5 and (" + ipId + " = 0 or a.IPID = " + ipId + ") " +
                       "WHERE c.Status = 5 " +
                       "and (" + id + " = 0 or bo.id = " + id + ") " +
                       "and (" + stationId + " = 0 or bo.Stationid = " + stationId + ")";

                var result = DB.ExecuteSQLAndReturnDataTable(sql).DataTableToModel<BloodDemand>();

                if (id > 0 && result != null)
                {
                    result.BloodDemandDetails = GetBloodDemandDetailDAL(id);
                }
                return result;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public List<BloodDemandDT> GetBloodDemandDAL(string stationId)
        {
            try
            {
                string sql =
                 "SELECT DISTINCT a.id, a.id as BloodOrderID, " +
                         "s.prefix + '-' + CONVERT(varchar(20), a.stationslno) as [CombineOrderNo],  " +
                         "a.stationslno as [OrderNo], a.status, " +
                         "CONVERT(varchar(17), a.datetime, 113) as [DateTime], b.RegistrationNo, " +
                         "b.issueauthoritycode, b.ipid, c.ID as BedID, c.Name as Bed,  " +
                         "RTrim(b.FirstName) + ' ' + RTrim(b.MiddleName) + ' ' + RTrim(b.LastName) as [PatientName],  " +
                         "d.Name as [OperatorName], s.prefix, " +
                         "s.name as [StationName], " +
                         "b.IssueAuthoritycode + '.' + REPLICATE('0', (10 - len(b.Registrationno))) + CONVERT(varchar(10),  " +
                         "b.Registrationno) as PIN, " +
                         "b.DoctorID, a.Demand, " +
                         "(SELECT CASE "+ 
                                    "WHEN ISNULL(SUM(od.Quantity) - SUM(od.demandqty), 0) > 0 THEN 2 "+
                                    "WHEN ISNULL(SUM(od.Quantity) - SUM(od.demandqty), 0) < 0 THEN 1 "+
			                    "ELSE 1 "+
                         "END "+
                         "FROM his.dbo.BloodOrderDetail od " +
                         "WHERE od.orderid = a.id) ExtendStatus " +
                 "FROM his.dbo.BLOODORDER a " +
                 "INNER JOIN his.dbo.InPatient b " +
                    "ON a.IPID = b.IPID " +
                 "INNER JOIN his.dbo.Bed c " +
                    "ON a.ipid = c.ipid " + 
                 "INNER JOIN his.dbo.Employee d " +
                    "ON a.wOperatorID = d.ID " +
                 "INNER JOIN his.dbo.station s " +
                    "ON a.stationid = s.id " +
                 "WHERE  a.status in(0,1,7) " +
                        "and a.StationId = " + stationId + " " +
                        "and b.admitdatetime > '12/23/2006' " +
                 "ORDER BY s.prefix + '-' + convert(varchar(20), a.stationslno) DESC";

                return DB.ExecuteSQLAndReturnDataTable(sql).DataTableToList<BloodDemandDT>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public Response BloodDemandSave(int operatorId, int stationId, int bloodOrderId, int ipid, List<BloodDetailModel> det)
        {
            try
            {
                DataTable dt_detail = new DataTable();
                dt_detail.Columns.AddRange(new[] {
                    new DataColumn("componentid", typeof(string)),
                    new DataColumn("OQTY", typeof(string)),
                    new DataColumn("Remarks", typeof(string)),
                    new DataColumn("Quantity", typeof(string))
                });
                if (det != null)
                {
                    foreach (var i in det)
                    {
                        DataRow newRowsdet = dt_detail.NewRow();
                        newRowsdet["componentid"] = i.id;
                        newRowsdet["OQTY"] = i.Quantity;
                        newRowsdet["Remarks"] = i.Remarks;
                        newRowsdet["Quantity"] = i.DemandQuantity;
                        dt_detail.Rows.Add(newRowsdet);
                    }
                }
                System.IO.StringWriter swdt = new System.IO.StringWriter();
                dt_detail.TableName = "Data";
                dt_detail.WriteXml(swdt);

                DB.param = new SqlParameter[]{
                    new SqlParameter("@OPERATORID", operatorId),
                    new SqlParameter("@ipid", ipid),
                    new SqlParameter("@BLOODORDERID", bloodOrderId),
                    new SqlParameter("@stationid", stationId),
                    new SqlParameter("@XML", swdt.ToString())
            };
                DB.ExecuteSPAndReturnDataTable("OT.OT_WARDS_BLOOD_DEMAND_SAVE");
                Response res = new Response();
                res.Flag = "1";
                res.Message = "Blood Demand Record Saved!";
                return res;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }



        private List<BloodDemandDetail> GetBloodDemandDetailDAL(int id)
        {
            try
            {
                string sql = "SELECT a.componentid ComponentID, b.code + ' - ' + b.name ComponentName, a.quantity Quantity, a.demandqty PrevQty, a.remarks Remarks " +
                             "FROM BloodOrderDetail a " +
                             "INNER JOIN component b ON a.componentid = b.id " +
                             "WHERE a.orderid = " + id + " ";

                return DB.ExecuteSQLAndReturnDataTable(sql).DataTableToList<BloodDemandDetail>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
    }

    public class BloodDemandDT
    {
        public int ID { get; set; }
        public string CombineOrderNo { get; set; }
        public string OrderNo { get; set; }
        public string DateTime { get; set; }
        public string PIN { get; set; }
        public string PatientName { get; set; }
        public string OperatorName { get; set; }
        public string Bed { get; set; }
        public string StationName { get; set; }
        public string Status { get; set; }
        public string RegistrationNo { get; set; }
        public int Demand { get; set; }
        public int ExtendStatus { get; set; }
        public int BloodOrderID { get; set; }
    }

    public class BloodDemand
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
        public List<BloodDemandDetail> BloodDemandDetails { get; set; }
    }

    public class BloodDemandDetail
    {
        public int ComponentID { get; set; }
        public string ComponentName { get; set; }
        public int Quantity { get; set; }
        public int PrevQty { get; set; }
        public string Remarks { get; set; }
    }
}