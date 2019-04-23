using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;
using HIS_OT.Models;
using HIS_OT.Controllers;
using System.Linq.Expressions;

namespace HIS_OT.Areas.OT.Models
{
    public class IPDrugReturns
    {
        DBHelper DB = new DBHelper("OT");

        public List<DrugReturnDT> GetDrugReturnList(string stationId)
        {
            try
            {
                string sql =
                 "SELECT  s.Prefix +'-'+ CONVERT(varchar(20), dr.stationslno) AS [CombineOrderNo], dr.ID, " +
                         "LTRIM(p.FirstName) + ' ' + LTRIM(p.MiddleName) + ' ' + LTRIM(p.LastName) [PatientName],  " +
                         "b.Name Bed, dr.Status, CONVERT(varchar(17), dr.DateTime, 113) [DateTime], " +
                         "e.Name [OperatorName],  " +
                         "p.IssueAuthoritycode + '.' + REPLICATE('0', (10 - len(p.Registrationno))) + CONVERT(varchar(10),  " +
                         "p.Registrationno) PIN " +
                 "FROM his.dbo.DrugReturn dr " +
                 "INNER JOIN his.dbo.InPatient p " +
                    "ON dr.IPID = p.IPID " +
                 "INNER JOIN his.dbo.Bed b " +
                    "ON dr.BedID = b.Id " +
                 "INNER JOIN his.dbo.Employee e  " +
                    "ON dr.OperatorID = e.ID " +
                 "INNER JOIN his.dbo.station s " +
                    "ON dr.stationid = s.ID " +
                 "WHERE  dr.StationId = " + stationId + " " +
                 "ORDER BY s.prefix + '-' + CONVERT(varchar(20), dr.stationslno) DESC";

                return DB.ExecuteSQLAndReturnDataTable(sql).DataTableToList<DrugReturnDT>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public List<OrderNoList> OrderNoList(int ipid, string searchTerm)
        {
            try
            {
                string sql =
                 "DECLARE @StationID int, @Tostationid int " +
                 "SELECT @StationID = StationID FROM his.dbo.Bed WHERE IPID = " + ipid + " " +
                 "SELECT @Tostationid = pharmacystationid FROM his.dbo.PharmacyStation WHERE wardstationid = @stationid " +
                 "SELECT OrderID Id, OrderID Name, Prefix + '-' + CONVERT(varchar(10), StationSLNo) Text, Prefix, OrderID, StationSLNo AS OrderDrugId, " +
                            "CASE WHEN prescriptionid <> '0' THEN " +
                                    "CONVERT(varchar(10), stationslno) + '[ ]' " +
                                "ELSE CONVERT(varchar(10), stationslno) " +
                            "END AS StationSLNo, " +
                            "PrescriptionID " +
                 "FROM ( " +
                        "SELECT c.prefix, a.id OrderID, " +
                        "CASE WHEN (prescriptionid > 0) THEN prescriptionid " +
                            "ELSE a.stationslno " +
                        "END stationslno, " +
                        "a.prescriptionid " +
                        "FROM his.dbo.DrugOrder a, his.dbo.station c " +
                        "WHERE c.id = a.stationid and a.tostationid = @Tostationid and a.ipid = " + ipid + "" +
                       ") x " +
                 "/* GROUP BY prefix, stationslno, prescriptionid, OrderID */ " +
                 "WHERE Prefix + '-' + CONVERT(varchar(10), StationSLNo) LIKE '%" + searchTerm + "%' " +
                 "ORDER BY stationslno";

                var result = DB.ExecuteSQLAndReturnDataTable(sql).DataTableToList<OrderNoList>();
                return result;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public List<DrugModelDT> GetDrugs(int orderId, string stationId)
        {
            try
            {
                string sql =
                 "SELECT c.ID ServiceID, c.Name DrugName, dr.ID OrderID, " +
                 "d.BatchID, b.Batchno, p.Name UnitName, " +
                 "/* d.substituteid,, CONVERT(int, SUM(dispatchquantity)) Qty " +
                 "( " +
                    "SELECT SUM(quantity) FROM his.dbo.DrugReturnDetail dd " +
                    "WHERE dd.Drugorderid = dr.ID " +
                          "and dd.serviceid = d.substituteid " +
                          "and dd.batchid = d.batchid " +
                 ")  RetQty, " +
                    "d.unitid, p.Name Units, c.ItemCode, */ " +
                    "CONVERT(int, SUM(dispatchquantity)) Quantity " +
                 "FROM his.dbo.item c " +
                 "INNER JOIN his.dbo.DrugOrderDetailsubstitute d " +
                    "ON c.ID = d.substituteID " +
                 "INNER JOIN his.dbo.DrugOrder dr " +
                    "ON dr.ID = d.OrderID and dr.Dispatched = 3 and dr.ordertype = 1 " +
                 "INNER JOIN his.dbo.Packing p " +
                    "ON p.ID = d.UnitID " +
                 "INNER JOIN his.dbo.Batch b " +
                    "ON d.Batchid = b.batchid " +
                 "WHERE dr.ToStationid = " + stationId + " " +
                        "and dr.ID = " + orderId + " " +
                 "GROUP BY d.substituteid, b.Batchno, d.BatchId, d.Unitid,p.Name,c.Name,c.ItemCode,dr.id, c.ID";

                var result = DB.ExecuteSQLAndReturnDataTable(sql).DataTableToList<DrugModelDT>();
                return result;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public DrugReturnModel GetDrugReturn(int id, int stationId)
        {
            try
            {
                string sql = "SELECT s.Prefix + '-' + CONVERT(varchar(20), a.stationslno) CombineOrderNo, a.IPID, " +
                             "p.IssueAuthoritycode + '.' + REPLICATE('0', (10 - len(p.Registrationno))) + CONVERT(varchar(10), p.Registrationno) PIN, " +
                             "LTRIM(p.FirstName) + ' ' + LTRIM(p.MiddleName) + ' ' + LTRIM(p.LastName) [Name],  " +
                             "a.BedId, b.Name BedNo, CONVERT(varchar(17), a.DateTime, 113) EntryDateTime, " +
                             "CONVERT(varchar(3), p.Age) + ' ' + at.Name Age, x.NAME Sex, p.BloodGroup, DrugOrderId, " +
                             "a.Doctorid, e.EmpCode DoctorCode, e.Name DoctorName, c.Name CompanyName, ISNULL(g.Name, 'Non-Package') Package " +
                             "FROM DrugReturn a " +
                             "INNER JOIN Station s " +
                                "ON s.ID = a.StationID " +
                             "INNER JOIN InPatient p " +
                                "ON p.IPID = a.IPID " +
                             "INNER JOIN Bed b " +
                                "ON b.id = a.BedID " +
                             "INNER JOIN AgeType at " +
                                "ON at.id = p.AgeType " +
                             "INNER JOIN Sex x " +
                                "ON x.id = p.Sex " +
                             "INNER JOIN Employee e " +
                                "ON e.id = a.Doctorid " +
                             "INNER JOIN Company c " +
                                "ON c.ID = p.CompanyID " +
                             "LEFT JOIN IPPackage ip " +
                                "ON ip.Ipid = p.IPID " +
                             "LEFT JOIN Package g " +
                                "ON g.Id = ip.PackageId " +
                             "WHERE a.Id = " + id + "";

                var result = DB.ExecuteSQLAndReturnDataTable(sql).DataTableToModel<DrugReturnModel>();

                if (id > 0 && result != null)
                {
                    var Orders = OrderNoList(result.IPID, "");
                    if (Orders != null && Orders.Count > 0)
                    {
                        sql = "SELECT a.Id OrderId, s.prefix + '-' + CONVERT(varchar(10), a.stationSlNo) OrderNo " +
                              "FROM DrugOrder a " +
                              "INNER JOIN station s " +
                                    "ON s.id = a.stationid " +
                              "WHERE a.id = " + result.DrugOrderId + "";

                        var result2 = DB.ExecuteSQLAndReturnDataTable(sql).DataTableToModel<OrderModel>();

                        result.DrugOrderNo = result2 != null ? result2.OrderNo : "";
                    }
                    result.DrugDetail = GetDrugDetails(id);
                }
                return result;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public string Cancel(int drugReturnId)
        {
            try
            {
                SqlParameter[] sqlParam = new SqlParameter[1];
                sqlParam[0] = new SqlParameter("@ORDERID", drugReturnId);
                DB.param = sqlParam;
                DB.ExecuteSP("OT.OT_WARDS_DRUG_RETURN_CANCEL");
                return "Cancelled Successfull!";
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public string Save(List<DrugItemModel> drug, string operatorId, int drugReturnId, int drugOrderId, int ipid, int doctorId)
        {
            try
            {
                DataTable dtRet = new DataTable();
                dtRet.Columns.AddRange(new[] {
                    new DataColumn("ServiceID", typeof(string)),
                    new DataColumn("Quantity", typeof(string)),
                    new DataColumn("BatchID", typeof(string)),
                    new DataColumn("Remarks", typeof(string)),
                });

                foreach (var item in drug)
                {
                    DataRow newRow = dtRet.NewRow();
                    newRow["ServiceID"] = item.ServiceID;
                    newRow["Quantity"] = item.Quantity;
                    newRow["BatchID"] = item.BatchID;
                    newRow["Remarks"] = item.Remarks;
                    dtRet.Rows.Add(newRow);
                }

                System.IO.StringWriter sw = new System.IO.StringWriter();
                dtRet.TableName = "Data";
                dtRet.WriteXml(sw);

                SqlParameter[] sqlParam = new SqlParameter[6];
                sqlParam[0] = new SqlParameter("@ORDERID_PARAM", drugReturnId);
                sqlParam[1] = new SqlParameter("@IPID", ipid);
                sqlParam[2] = new SqlParameter("@OperatorID", operatorId);
                sqlParam[3] = new SqlParameter("@DrugOrderId", drugOrderId);
                sqlParam[4] = new SqlParameter("@DoctorID", doctorId);
                sqlParam[5] = new SqlParameter("@XML", sw.ToString());
                DB.param = sqlParam;
                DB.ExecuteSQL("OT.OT_WARDS_DRUG_RETURN_SAVE");
                return "Record Successfully Saved!";
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        private List<DrugReturnDetail> GetDrugDetails(int id)
        {
            string sql = "DECLARE @OrderID int, @StationID int, @Tostationid int " +
                                         "SELECT @OrderID = DrugOrderId from his.dbo.DrugReturn WHERE id = " + id + " " +
                                         "SELECT @StationID = stationid from his.dbo.DrugOrder WHERE id = @OrderID " +
                                         "SELECT @Tostationid = pharmacystationid FROM his.dbo.PharmacyStation WHERE wardstationid = @StationID " +
                                         "SELECT DISTINCT " +
                                                "c.id DrugOrderId, d.ServiceID, a.Name Drug, f.ID UnitId, f.Name Units, " +
                                                "dod.Quantity Qty, d.Quantity RetQty, d.Remarks, d.Batchid, e.BatchNo " +
                                        "FROM his.dbo.item a " +
                                        "LEFT JOIN his.dbo.DrugOrderDetailsubstitute b " +
                                            "ON a.ID = b.substituteID " +
                                        "LEFT JOIN his.dbo.DrugOrder c " +
                                            "ON b.OrderID = c.ID " +
                                        "LEFT JOIN his.dbo.DrugReturnDetail d " +
                                            "ON c.ID = d.DrugOrderId and b.ServiceId = d.ServiceID " +
                                        "INNER JOIN DrugOrderDetail dod " +
                                            "ON	dod.ServiceID = d.ServiceID and dod.OrderID = c.ID " +
                                        "INNER JOIN his.dbo.batch e " +
                                            "ON e.batchid =d.batchid and a.ID = e.ItemID " +
                                        "LEFT JOIN his.dbo.Packing f " +
                                            "ON b.UnitID = f.ID " +
                                        "WHERE c.Dispatched = 3 " +
                                                "and c.Ordertype = 1 " +
                                                "and c.Tostationid = @Tostationid " +
                                                "and c.ID = @OrderID " +
                                                "and d.ServiceID is not null " +
                                                "and d.OrderID = " + id + "";

            var result = DB.ExecuteSQLAndReturnDataTable(sql).DataTableToList<DrugReturnDetail>();
            return result;
        }
    }

    public class PatientRepository
    {
        const string CACHE_KEY = "$Select2GetPinNameBedNoRepositoryPin$";

        public IQueryable<PatientViewModel> queryable { get; set; }

        private static IList<PatientViewModel> toIList;
        public IList<PatientViewModel> ToIList
        {
            get { return toIList; }
            set { toIList = value; }
        }

        private bool _putOnSession = false;
        public bool PutOnSession
        {
            get { return _putOnSession; }
            set { _putOnSession = value; }
        }

        public IQueryable<PatientViewModel> Fetch()
        {
            //Check cache first before regenerating data.
            if (this.PutOnSession && HttpContext.Current.Cache[CACHE_KEY] != null)
            {
                return (IQueryable<PatientViewModel>)HttpContext.Current.Cache[CACHE_KEY];
            }
            DataTable dt = null;
            DBHelper db = new DBHelper();
            dt = db.ExecuteSPAndReturnDataTable("OT.Select2GetPinNameBedNo");

            List<PatientViewModel> results = dt.ToList<PatientViewModel>();
            var result = results.AsQueryable();
            queryable = result;
            HttpContext.Current.Cache[CACHE_KEY] = result;
            return result;
        }

        private IQueryable<PatientViewModel> GetQuery(string searchTerm, bool isPIN = false)
        {
            searchTerm = searchTerm.ToLower();
            Expression<Func<PatientViewModel, bool>> predicate = a => a.PIN.Like(searchTerm);
            if (!isPIN)
            {
                predicate = a => a.Name.Like(searchTerm);
            }
            return queryable.Where(predicate);
        }

        public List<PatientViewModel> Get(string searchTerm, int pageSize, int pageNum, bool isPIN)
        {
            return GetQuery(searchTerm, isPIN)
                .Skip(pageSize * (pageNum - 1))
                .Take(pageSize)
                .ToList();
        }

        public PagedResult Page(string searchTerm, int pageSize, int pageNum, bool isPIN)
        {
            List<PatientViewModel> list2 = this.Get(searchTerm, pageSize, pageNum, isPIN);
            int count = this.GetCount(searchTerm, pageSize, pageNum);

            PagedResult page = new PagedResult();
            try
            {
                page.Results = list2.AsEnumerable().Select(m => new Result()
                {
                    id = m.IPID.ToString(),
                    text = isPIN ? m.PIN : m.Name,
                    list = AddDictionaryList.GetViewModel(m)

                }).ToList();
                page.Total = count;
            }
            catch (Exception ex)
            { }
            return page;
        }

        public int GetCount(string searchTerm, int pageSize, int pageNum)
        {
            return GetQuery(searchTerm).Count();
        }
    }

    public class DrugReturnDT
    {
        public int ID { get; set; }
        public string CombineOrderNo { get; set; }
        public string DateTime { get; set; }
        public string PIN { get; set; }
        public string PatientName { get; set; }
        public string OperatorName { get; set; }
        public string Bed { get; set; }
        //public string StationName { get; set; }
        public string Status { get; set; }
        //public string RegistrationNo { get; set; }
        //public int ExtendStatus { get; set; }
        //public int BloodOrderID { get; set; }
    }

    public class PatientViewModel
    {
        public int Registrationno { get; set; }
        public string Issueauthoritycode { get; set; }
        public int IPID { get; set; }
        public string Name { get; set; }
        public int BedId { get; set; }
        public string BedNo { get; set; }
        public string PIN { get; set; }
        public string Ward { get; set; }
        public string Age { get; set; }
        public string Sex { get; set; }
        public string PrimaryConsultant { get; set; }
        public string Package { get; set; }
        public string Company { get; set; }
        public string CompanyName { get; set; }
        public string Category { get; set; }
        public string BloodGroup { get; set; }
        public int DoctorId { get; set; }
        public string DoctorCode { get; set; }
        public string DoctorName { get; set; }
        public string AdmitDateTime { get; set; }
        public string Diagnosis { get; set; }
    }

    public class PagedResult
    {
        public int Total { get; set; }
        public List<Result> Results { get; set; }
    }

    public class Result
    {
        public string id { get; set; }
        public string text { get; set; }
        public Dictionary<string, string> list { get; set; }
    }

    public class OrderModel
    {
        public int OrderId { get; set; }
        public string OrderNo { get; set; }
    }

    public class OrderNoList : BaseMod
    {
        public string Prefix { get; set; }
        public string OrderID { get; set; }
        public string StationSLNo { get; set; }
        public string PrescriptionID { get; set; }
    }

    public class BaseMod
    {
        public int id { get; set; }
        public string name { get; set; }
        public string text { get; set; }
    }

    public class DrugReturnModel
    {
        public int Id { get; set; }
        public string EntryDateTime { get; set; }
        public string CombineOrderNo { get; set; }
        public string PIN { get; set; }
        public int IPID { get; set; }
        public string Name { get; set; }
        public int DrugOrderId { get; set; }
        public string DrugOrderNo { get; set; }
        public int BedId { get; set; }
        public string BedNo { get; set; }
        public string Age { get; set; }
        public string Sex { get; set; }
        public string BloodGroup { get; set; }
        public int DoctorId { get; set; }
        public string DoctorCode { get; set; }
        public string DoctorName { get; set; }
        public string CompanyName { get; set; }
        public string Package { get; set; }
        public List<DrugReturnDetail> DrugDetail { get; set; }
    }

    public class DrugReturnDetail
    {
        public int ServiceID { get; set; }
        public string Drug { get; set; }
        public int UnitId { get; set; }
        public string Units { get; set; }
        public string Qty { get; set; }
        public string RetQty { get; set; }
        public string Remarks { get; set; }
        public string BatchNo { get; set; }
        public int BatchId { get; set; }
    }

    public class DrugModelDT
    {
        public string OrderID { get; set; }
        public string ServiceID { get; set; }
        public string BatchID { get; set; }
        public string DrugName { get; set; }
        public string Quantity { get; set; }
        public string Batchno { get; set; }
        public string UnitName { get; set; }
    }

    public class DrugModel
    {
        public string OrderID { get; set; }
        public string ServiceID { get; set; }
        public string BatchID { get; set; }
        public string DrugOrderID { get; set; }
        public string DrugName { get; set; }
        public string Quantity { get; set; }
        public string Remarks { get; set; }
        public string Batchno { get; set; }
    }

    public class DrugItemModel
    {
        public string ServiceID { get; set; }
        public string BatchID { get; set; }
        public string Quantity { get; set; }
        public string Remarks { get; set; }
    }
}