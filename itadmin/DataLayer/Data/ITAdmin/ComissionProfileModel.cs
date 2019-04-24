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
    public class ComissionProfileModel
    {
        public string ErrorMessage { get; set; }
        DBHelper db = new DBHelper();


        public List<ComissionProfileServices> ComissionProfileServices(string type, string docid)
        {
            try
            {
                db.param = new SqlParameter[] {
                  new SqlParameter("@Type", type),
                   new SqlParameter("@DocId", docid),
            };
                DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.ComissionProfile_ViewServiceTab");
                List<ComissionProfileServices> list = new List<ComissionProfileServices>();
                if (dt.Rows.Count > 0) list = dt.ToList<ComissionProfileServices>();
                return list;
            }
            catch (Exception x)
            {
                this.ErrorMessage = x.Message;
                List<ComissionProfileServices> list = new List<ComissionProfileServices>();
                return list;
            }
        }

        public List<ComissionProfileServices> ComissionProfileDepartmentTab(string type, string serviceid, string docid)
        {

            try
            {
                db.param = new SqlParameter[] {
                  new SqlParameter("@Type", type),
                   new SqlParameter("@ServiceId", serviceid),
                    new SqlParameter("@DocId",docid)
            };
                DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.ComissionProfile_ViewDepartmentTab");
                List<ComissionProfileServices> list = new List<ComissionProfileServices>();
                if (dt.Rows.Count > 0) list = dt.ToList<ComissionProfileServices>();
                return list;
            }
            catch (Exception x)
            {
                this.ErrorMessage = x.Message;
                List<ComissionProfileServices> list = new List<ComissionProfileServices>();
                return list;
            }
        }

        public List<ComissionProfileItemTabList> ComissionProfileItemTabList(string type, string docid, string serviceid, string deptid)
        {

            db.param = new SqlParameter[] {
                  new SqlParameter("@Type", type),
                   
                   new SqlParameter("@Serviceid", serviceid),
                   new SqlParameter("@Deptid", deptid),
                   new SqlParameter("@DocId", docid)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.ComissionProfile_ItemTabList");
            List<ComissionProfileItemTabList> list = new List<ComissionProfileItemTabList>();
            if (dt.Rows.Count > 0) list = dt.ToList<ComissionProfileItemTabList>();
            return list;
        }


        public List<ListModel> GetDoctorDAL()
        {
            try
            {
                return db.ExecuteSQLAndReturnDataTable("  select id as id,EmpCode + ' - ' + Name as name,EmpCode + ' - ' + Name as text from doctor where deleted = 0   ").DataTableToList<ListModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }

        public bool SaveServiceTabCP(SaveServiceTabCP entry)
        {
            List<SaveServiceTabCP> SaveServiceTab = new List<SaveServiceTabCP>();
            SaveServiceTab.Add(entry);

            var varXml = "<DocumentElement></DocumentElement>";
            if (entry.ServiceTabDetailsCP != null && entry.ServiceTabDetailsCP.Count > 0)
            {
                varXml = entry.ServiceTabDetailsCP.ListToXml("servicedetailsXML");
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
                db.ExecuteSP("ITADMIN.ComissionProfile_SaveServiceTab");
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

        public bool SaveDepartmentTab(SaveDepartmentTabCP entry)
        {
            List<SaveDepartmentTabCP> SaveDepartmentTab = new List<SaveDepartmentTabCP>();
            SaveDepartmentTab.Add(entry);


            var varXml = "<DocumentElement></DocumentElement>";
            if (entry.DepartmentTabDetailsCP != null && entry.DepartmentTabDetailsCP.Count > 0)
            {
                varXml = entry.DepartmentTabDetailsCP.ListToXml("departmentdetailsXML");
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
                db.ExecuteSP("ITADMIN.ComissionProfile_SaveDepartmentTab");
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

        public bool SaveItemTab(SaveItemTabCP entry)
        {
            List<SaveItemTabCP> SaveItemTab = new List<SaveItemTabCP>();
            SaveItemTab.Add(entry);


            var varXml = "<DocumentElement></DocumentElement>";
            if (entry.ItemTabDetailsCP != null && entry.ItemTabDetailsCP.Count > 0)
            {
                varXml = entry.ItemTabDetailsCP.ListToXml("itemdetailsXML");
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
                db.ExecuteSP("ITADMIN.ComissionProfile_SaveItemTab");
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

        public List<perDoctorList> perDoctorListServices(string docid)
        {
            try
            {
                    db.param = new SqlParameter[] {
                          new SqlParameter("@DocId", docid)
 
                };
                DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.ComissionProfile_perDoctorListServices");
                List<perDoctorList> list = new List<perDoctorList>();
                if (dt.Rows.Count > 0) list = dt.ToList<perDoctorList>();
                return list;
            }
            catch (Exception x)
            {
                this.ErrorMessage = x.Message;
                List<perDoctorList> list = new List<perDoctorList>();
                return list;
            }
        }

        public List<perDoctorList> perDoctorListDepartment(string docid)
        {
            try
            {
                db.param = new SqlParameter[] {
                          new SqlParameter("@DocId", docid)
 
                };
                DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.ComissionProfile_perDoctorListDept");
                List<perDoctorList> list = new List<perDoctorList>();
                if (dt.Rows.Count > 0) list = dt.ToList<perDoctorList>();
                return list;
            }
            catch (Exception x)
            {
                this.ErrorMessage = x.Message;
                List<perDoctorList> list = new List<perDoctorList>();
                return list;
            }
        }
        
        public List<perDoctorList> perDoctorListItems(string docid)
        {
            try
            {
                db.param = new SqlParameter[] {
                          new SqlParameter("@DocId", docid)
 
                };
                DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.ComissionProfile_perDoctorListItems");
                List<perDoctorList> list = new List<perDoctorList>();
                if (dt.Rows.Count > 0) list = dt.ToList<perDoctorList>();
                return list;
            }
            catch (Exception x)
            {
                this.ErrorMessage = x.Message;
                List<perDoctorList> list = new List<perDoctorList>();
                return list;
            }
        }

 



    }
    public class ComissionProfileServices
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
        public string Amount { get; set; }

    }

    public class ComissionProfileItemTabList
    {
        public string isCheck { get; set; }
        public string itemId { get; set; }
        public string itemName { get; set; }
        public string Percentage { get; set; }
        public string Amount { get; set; }
    }

    public class SaveServiceTabCP
    {
        public string IPOPType { get; set; }
        public string IpAddress { get; set; }
        public int OperatorId { get; set; }
        public int DocId { get; set; }
        public List<ServiceTabDetailsCP> ServiceTabDetailsCP { get; set; }

    }
    public class ServiceTabDetailsCP
    {
        public string ServiceId { get; set; }
        public string Percentage { get; set; }
        public string Amount { get; set; }
    }
    public class SaveDepartmentTabCP
    {
        public string IPOPType { get; set; }
        public int OperatorId { get; set; }
        public int ServiceId { get; set; }
        public int DocId { get; set; }
        public string IpAddress { get; set; }
        public List<DepartmentTabDetailsCP> DepartmentTabDetailsCP { get; set; }

    }
    public class DepartmentTabDetailsCP
    {
        public string DeptId { get; set; }
        public string Percentage { get; set; }
        public string Amount { get; set; }
    }

    public class SaveItemTabCP
    {
        public string IPOPType { get; set; }
        public int OperatorId { get; set; }
        public int ServiceId { get; set; }
        public int DeptId { get; set; }
        public int DocId { get; set; }
        public string IpAddress { get; set; }
        public List<ItemTabDetailsCP> ItemTabDetailsCP { get; set; }

    }
    public class ItemTabDetailsCP
    {
        public string ItemId { get; set; }
        public string Percentage { get; set; }
        public string Amount { get; set; }
    }
    public class perDoctorList
    {
        public string IPOPType { get; set; }
        public string Percentage { get; set; }
        public string Amount { get; set; }

        public string DeptName { get; set; }
        public string ServiceName { get; set; }
    }
}
