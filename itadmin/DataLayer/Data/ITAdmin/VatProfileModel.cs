using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;
using System.Text;


namespace DataLayer
{
    public class VatProfileModel
    {

        public string ErrorMessage { get; set; }
        DBHelper db = new DBHelper();


        public List<RoleModel> TaxList()
        {
            return db.ExecuteSQLAndReturnDataTableLive(" select 0 as id, '--All DEPT--' as text , '--All DEPT--' as name  union select id, name as text ,name from Department where deleted = 0 order by Name ").DataTableToList<RoleModel>();
        }

        public List<RoleModel> GetDepartmentDal()
        {
            return db.ExecuteSQLAndReturnDataTableLive(" select 0 as id, '--All DEPT--' as text , '--All DEPT--' as name  union select id, name as text ,name from Department where deleted = 0 order by Name ").DataTableToList<RoleModel>();
        }


        public List<RoleModel> GetGradeDal()
        {
            return db.ExecuteSQLAndReturnDataTableLive(" select 0 as id, '--All DEPT--' as text , '--All DEPT--' as name  union select id, name as text ,name from Department where deleted = 0 order by Name ").DataTableToList<RoleModel>();
        }
        public List<RoleModel> GetServiceDal()
        {
            return db.ExecuteSQLAndReturnDataTableLive(" select 0 as id, '--All DEPT--' as text , '--All DEPT--' as name  union select id, name as text ,name from Department where deleted = 0 order by Name ").DataTableToList<RoleModel>();
        }

        public List<RoleModel> GetNationalityDal()
        {
            return db.ExecuteSQLAndReturnDataTableLive(" select id,UPPER(name) as text ,UPPER(name) as name from Nationality where deleted = 0 order by Name ").DataTableToList<RoleModel>();

        }
        public List<RoleModel> VatServiceListByType(string IpOrOP)
        {
            try
            {
                db.param = new SqlParameter[] {
                        new SqlParameter("@Type", IpOrOP)
            };
                DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.VatProfile_ViewServiceListByType");
                List<RoleModel> list = new List<RoleModel>();
                if (dt.Rows.Count > 0) list = dt.ToList<RoleModel>();
                return list;
            }
            catch (Exception x)
            {
                this.ErrorMessage = x.Message;
                List<RoleModel> list = new List<RoleModel>();
                return list;
            }
        }
        public List<RoleModel> DeptListByService(string IpOrOp, string serviceId)
        {
            try
            {
                db.param = new SqlParameter[] {
                        new SqlParameter("@Type", IpOrOp),
                        new SqlParameter("@ServiceId", serviceId)
            };
                DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.VatProfile_ViewDeptListByService");
                List<RoleModel> list = new List<RoleModel>();
                if (dt.Rows.Count > 0) list = dt.ToList<RoleModel>();
                return list;
            }
            catch (Exception x)
            {
                this.ErrorMessage = x.Message;
                List<RoleModel> list = new List<RoleModel>();
                return list;
            }

        }


        public List<Tax> VatPresentPrice()
        {
            try
            {
                db.param = new SqlParameter[] {
 
            };
                DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.VatProfile_ViewVat");
                List<Tax> list = new List<Tax>();
                if (dt.Rows.Count > 0) list = dt.ToList<Tax>();
                return list;
            }
            catch (Exception x)
            {
                this.ErrorMessage = x.Message;
                List<Tax> list = new List<Tax>();
                return list;
            }
        }

        public List<Tax> VatNewPrice()
        {
            try
            {
                db.param = new SqlParameter[] {
 
            };
                DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.VatProfile_VatNewPrice");
                List<Tax> list = new List<Tax>();
                if (dt.Rows.Count > 0) list = dt.ToList<Tax>();
                return list;
            }
            catch (Exception x)
            {
                this.ErrorMessage = x.Message;
                List<Tax> list = new List<Tax>();
                return list;
            }
        }
        public List<TaxServices> VatTaxServices(string type, string taxid)
        {
            try
            {
                db.param = new SqlParameter[] {
                  new SqlParameter("@Type", type),
                   new SqlParameter("@TaxId", taxid),
            };
                DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.VatProfile_ViewServiceTab");
                List<TaxServices> list = new List<TaxServices>();
                if (dt.Rows.Count > 0) list = dt.ToList<TaxServices>();
                return list;
            }
            catch (Exception x)
            {
                this.ErrorMessage = x.Message;
                List<TaxServices> list = new List<TaxServices>();
                return list;
            }
        }

        public List<TaxServices> VatDepartmentTab(string type, string serviceid)
        {

            try
            {
                db.param = new SqlParameter[] {
                  new SqlParameter("@Type", type),
                   new SqlParameter("@ServiceId", serviceid),
            };
                DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.VatProfile_ViewDepartmentTab");
                List<TaxServices> list = new List<TaxServices>();
                if (dt.Rows.Count > 0) list = dt.ToList<TaxServices>();
                return list;
            }
            catch (Exception x)
            {
                this.ErrorMessage = x.Message;
                List<TaxServices> list = new List<TaxServices>();
                return list;
            }
        }
        public List<VatItemTabList> VatItemTabList(string type, string taxid, string serviceid, string deptid)
        {

            db.param = new SqlParameter[] {
                  new SqlParameter("@Type", type),
                   new SqlParameter("@TaxId", taxid),
                   new SqlParameter("@Serviceid", serviceid),
                   new SqlParameter("@Deptid", deptid)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.VatProfile_VatItemTabList");
            List<VatItemTabList> list = new List<VatItemTabList>();
            if (dt.Rows.Count > 0) list = dt.ToList<VatItemTabList>();
            return list;
        }

        public bool SaveNewVat(SaveNewVat entry)
        {
            List<SaveNewVat> DetailsEntry = new List<SaveNewVat>();
            DetailsEntry.Add(entry);


            try
            {
                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                     new SqlParameter("@savenewvat", DetailsEntry.ListToXml("savenewvatXML"))
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.VatProfile_SaveNewVat");
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

        public bool SaveServiceTab(SaveServiceTab entry)
        {
            List<SaveServiceTab> SaveServiceTab = new List<SaveServiceTab>();
            SaveServiceTab.Add(entry);

            var varXml = "<DocumentElement></DocumentElement>";
            if (entry.ServiceTabDetails != null && entry.ServiceTabDetails.Count > 0)
            {
                varXml = entry.ServiceTabDetails.ListToXml("servicedetailsXML");
            }

            try
            {
                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                     new SqlParameter("@serviceheader", SaveServiceTab.ListToXml("serviceheaderXML")),
                     new SqlParameter("@servicedetails", varXml)
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.VatProfile_SaveServiceTab");
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
        public bool SaveDepartmentTab(SaveDepartmentTab entry)
        {
            List<SaveDepartmentTab> SaveDepartmentTab = new List<SaveDepartmentTab>();
            SaveDepartmentTab.Add(entry);


            var varXml = "<DocumentElement></DocumentElement>";
            if (entry.DepartmentTabDetails != null && entry.DepartmentTabDetails.Count > 0)
            {
                varXml = entry.DepartmentTabDetails.ListToXml("departmentdetailsXML");
            }

            try
            {
                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                     new SqlParameter("@departmentheader", SaveDepartmentTab.ListToXml("departmentheaderXML")),
                     new SqlParameter("@departmentdetails", varXml)
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.VatProfile_SaveDepartmentTab");
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
        public bool SaveItemTab(SaveItemTab entry)
        {
            List<SaveItemTab> SaveItemTab = new List<SaveItemTab>();
            SaveItemTab.Add(entry);


            var varXml = "<DocumentElement></DocumentElement>";
            if (entry.ItemTabDetails != null && entry.ItemTabDetails.Count > 0)
            {
                varXml = entry.ItemTabDetails.ListToXml("itemdetailsXML");
            }

            try
            {
                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                     new SqlParameter("@itemsheader", SaveItemTab.ListToXml("itemheaderXML")),
                     new SqlParameter("@itemsdetails", varXml)
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.VatProfile_SaveItemTab");
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



        public List<TaxExempList> TaxExempList()
        {
            try
            {
                db.param = new SqlParameter[] {
 
            };
                DataTable dt = db.ExecuteSQLAndReturnDataTableLive(" select a.Id,a.Percentage,b.Name as NationalityName, b.Id as NationalityId from tax_exemption a left join Nationality b on a.nationalityId = b.Id  ");
                List<TaxExempList> list = new List<TaxExempList>();
                if (dt.Rows.Count > 0) list = dt.ToList<TaxExempList>();
                return list;
            }
            catch (Exception x)
            {
                this.ErrorMessage = x.Message;
                List<TaxExempList> list = new List<TaxExempList>();
                return list;
            }

        }

        public bool SaveTaxExemp(SaveTaxExemp entry)
        {

            try
            {
                DBHelper db = new DBHelper();

                StringBuilder sql = new StringBuilder();
                sql.Clear();

                sql.Append("  declare @NationalityId varchar(20) = '" + entry.NationalityId + "' ");
                sql.Append("  declare @Percentage varchar(20) = '" + entry.Percentage + "' ");
                sql.Append("  declare @operatorid varchar(20) = '" + entry.OperatorId + "' ");
                sql.Append("   ");
                sql.Append("  insert into OldTax_Exemption (Id,NationalityId,Percentage,OperatorId,StartDateTime,Deleted) ");
                sql.Append("  select Id,NationalityId,Percentage,@operatorid,GETDATE(),Deleted  ");
                sql.Append("  from Tax_Exemption where NationalityId = @NationalityId ");
                sql.Append("   ");
                sql.Append("  Delete from  Tax_Exemption where NationalityId = @NationalityId ");
                sql.Append("   ");
                sql.Append("  INSERT INTO Tax_Exemption (NationalityId,Percentage,OperatorId,StartDateTime,Deleted) ");
                sql.Append("  values(@NationalityId,@Percentage,@operatorid,GETDATE(),0) ");

                db.ExecuteSQLLive(sql.ToString());
 
                this.ErrorMessage = "Data Added!";
 
                return true;
            }
            catch (Exception x)
            {
                this.ErrorMessage = x.Message;
                return false;
            }

        }



    }




    public class TaxExempList
    {
        public string Id { get; set; }
        public string Percentage { get; set; }
        public string NationalityName { get; set; }
        public string NationalityId { get; set; }

    }




    public class Tax
    {
        public string Id { get; set; }
        public string TaxName { get; set; }
        public string Percentage { get; set; }
        public string GrossNet { get; set; }
        public string CreatedDateTime { get; set; }
        public string StartDateTime { get; set; }
        public string EndDateTime { get; set; }
        public string OperatorId { get; set; }
        public string Deleted { get; set; }
        public string CreatedIPAddress { get; set; }
    }
    public class TaxServices
    {
        public string Name { get; set; }
        public string isService { get; set; }
        public string isDept { get; set; }
        public string ServiceId { get; set; }
        public string DeptId { get; set; }
        public string StartDateTime { get; set; }
        public string OperatorId { get; set; }
        public string IPAddress { get; set; }
        public int IPOPType { get; set; }
        public string Percentage { get; set; }

    }
    public class VatItemTabList
    {
        public string isCheck { get; set; }
        public string itemId { get; set; }
        public string itemName { get; set; }
        public string Percentage { get; set; }

    }

    public class TaxDepartment
    {
        public string ServiceId { get; set; }
        public int DepartmentId { get; set; }
        public string StartDateTime { get; set; }
        public string OperatorId { get; set; }
        public string IPAddress { get; set; }
        public int IPOPType { get; set; }
        public string Percentage { get; set; }
    }
    public class TaxItem
    {
        public string ServiceId { get; set; }
        public string DepartmentId { get; set; }
        public string ItemId { get; set; }
        public string StartDateTime { get; set; }
        public string OperatorId { get; set; }
        public string IPAddress { get; set; }
        public string IPOPType { get; set; }
        public string Percentage { get; set; }
    }

    public class OPTaxDetails
    {
        public string OPBillId { get; set; }
        public string TaxId { get; set; }
        public string BillNo { get; set; }
        public string ServiceId { get; set; }
        public string ItemId { get; set; }
        public string Amount { get; set; }
        public string DateTime { get; set; }
    }

    public class IPTaxDetails
    {
        public string BIllNo { get; set; }
        public string TaxId { get; set; }
        public string InvoiceNo { get; set; }
        public string ServiceId { get; set; }
        public string SerialNo { get; set; }
        public string ItemId { get; set; }
        public string Amount { get; set; }
        public string DateTime { get; set; }
    }
    public class SaveNewVat
    {
        public string Action { get; set; }
        public string TaxName { get; set; }
        public string GrossNet { get; set; } //1 gross 2 net
        public string Percentage { get; set; }
        public string StartDate { get; set; }
        public string IpAddress { get; set; }
        public int OperatorId { get; set; }
    }

    public class SaveServiceTab
    {
        public string IPOPType { get; set; }
        public int OperatorId { get; set; }
        public string IpAddress { get; set; }
        public List<ServiceTabDetails> ServiceTabDetails { get; set; }

    }
    public class ServiceTabDetails
    {
        public string ServiceId { get; set; }
        public string Percentage { get; set; }
    }


    public class SaveDepartmentTab
    {
        public string IPOPType { get; set; }
        public string IpAddress { get; set; }
        public int OperatorId { get; set; }
        public int ServiceId { get; set; }

        public List<DepartmentTabDetails> DepartmentTabDetails { get; set; }

    }
    public class DepartmentTabDetails
    {
        public string DeptId { get; set; }
        public string Percentage { get; set; }
    }
    public class SaveItemTab
    {
        public string IPOPType { get; set; }
        public int OperatorId { get; set; }
        public int ServiceId { get; set; }
        public int DeptId { get; set; }
        public string IpAddress { get; set; }
        public List<ItemTabDetails> ItemTabDetails { get; set; }

    }
    public class ItemTabDetails
    {
        public string ItemId { get; set; }
        public string Percentage { get; set; }
    }

    public class SaveTaxExemp
    {
        public string Id { get; set; }
        public string NationalityId { get; set; }
        public string Percentage { get; set; }
        public int OperatorId { get; set; }
     }

}
