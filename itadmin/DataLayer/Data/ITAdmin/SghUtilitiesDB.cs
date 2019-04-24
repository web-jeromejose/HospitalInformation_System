using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DataLayer.ITAdmin.Model;
using System.Data;
using System.Data.SqlClient;

namespace DataLayer.ITAdmin.Data
{
    public class SghUtilitiesDB
    {
        public string ErrorMessage { get; set; }

        DBHelper DB = new DBHelper();
      

        

        public List<EmployeeList> GetAllEmployeeDoctors()
        {
            return DB.ExecuteSQLAndReturnDataTableLive("  SELECT emp.ID ,emp.EmployeeID, CAST( emp.EmployeeID  AS varchar(10))+ ' - '+  emp.Name AS Name from HIS..Employee emp JOIN HIS..doctor doc ON emp.EmployeeID = doc.EmployeeID ").DataTableToList<EmployeeList>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }
        

        public List<EmployeeList> GetAllDepartment()
        {
            return DB.ExecuteSQLAndReturnDataTableLive("    select ID, '' as EmployeeID, CAST(DeptCode as varchar(10)) + ' -  ' + Name  as Name from Department  ").DataTableToList<EmployeeList>();
        }

       

        public List<EmployeeList> GetCategories()
        {
            return DB.ExecuteSQLAndReturnDataTable("  SELECT  ID, CAST( ID  AS varchar(10))+ '-'+  Name AS Name, '' as EmployeeID   FROM HIS..HRCATEGORY").DataTableToList<EmployeeList>();
        }

        public List<EmployeeDetailsList> DocEmployeeDetails(string id)
        {

              StringBuilder query = new StringBuilder();
              query.Append(" SELECT   a.EmployeeID, a.Name,a.EmpCode,a.EMail,a.ID,b.Name as NatName,c.Name as DeptName,d.Name as DesignationName, a.CategoryID as CatID, a.Deleted , case when f.TypeID is null then '' else 1 end  as txtPhysiotherapist ");
               query.Append(" FROM  EMPLOYEE a left join Nationality b on a.NationID = b.ID ");
               query.Append(" left join Department c on a.DepartmentID = c.ID ");
               query.Append(" left join Designation d on a.DesignationID = d.ID ");
               query.Append(" left join HRCategory e on a.CategoryID = e.id ");
               query.Append("   left join his.dbo.PtEmployee f on f.TypeID = a.ID and f.deleted =0  ");
               query.Append(" WHERE a.ID = '" + id + "' ");

            return DB.ExecuteSQLAndReturnDataTableLive(query.ToString()).DataTableToList<EmployeeDetailsList>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }



    
        public bool UpdateDoctorsCodeSave(UpdateDoctorsCodeSave entry)
        {

            try
            {
                List<UpdateDoctorsCodeSave> SaveList = new List<UpdateDoctorsCodeSave>();
                SaveList.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlUpdateDoctorsCodeSave",SaveList.ListToXml("UpdateDoctorsCodeSave"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.SghUtilities_UpdateDoctorsCodeSave");
                this.ErrorMessage = db.param[0].Value.ToString();

                bool isOK = this.ErrorMessage.Split('-')[0] == "100";

                return isOK;
                //testc
            }
            catch (Exception x)
            {
                this.ErrorMessage = x.Message;
                return false;
            }

        }



        public List<TariffDetails> GetTariffList()
        {

            StringBuilder query = new StringBuilder();
            query.Append("Select Name,Id from  Tariff ");

            return DB.ExecuteSQLAndReturnDataTableLive(query.ToString()).DataTableToList<TariffDetails>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }

        public List<DownloadCompIPPriceDetails> Load_IPPriceList(int TariffId)
        {
            DBHelper db = new DBHelper();

            db.param = new SqlParameter[] {
            new SqlParameter("@TariffID", TariffId)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.SghUtilities_DownloadCompPriceListIPTariff");
            List<DownloadCompIPPriceDetails> list = new List<DownloadCompIPPriceDetails>();
            if (dt.Rows.Count > 0) list = dt.ToList<DownloadCompIPPriceDetails>();
            return list;
        }

        public List<DownloadCompIPPriceDetails> Load_OPPriceList(int TariffId)
        {
            DBHelper db = new DBHelper();

            db.param = new SqlParameter[] {
            new SqlParameter("@TariffID", TariffId)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.SghUtilities_DownloadCompPriceListOPTariff");
            List<DownloadCompIPPriceDetails> list = new List<DownloadCompIPPriceDetails>();
            if (dt.Rows.Count > 0) list = dt.ToList<DownloadCompIPPriceDetails>();
            return list;

 
        }






        public bool SaveCancelOPDiscountApproval(ReleaseEmpVacationHeaderSave entry)
        {

            try
            {
                List<ReleaseEmpVacationHeaderSave> ReleaseEmpVacationHeaderSave = new List<ReleaseEmpVacationHeaderSave>();
                ReleaseEmpVacationHeaderSave.Add(entry);

                List<ReleaseEmpVacationDetails> ReleaseEmpVacationDetails = entry.ReleaseEmpVacationDetails;
                if (ReleaseEmpVacationDetails == null) ReleaseEmpVacationDetails = new List<ReleaseEmpVacationDetails>();


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlReleaseEmpVacationHeaderSave",ReleaseEmpVacationHeaderSave.ListToXml("ReleaseEmpVacationHeaderSave")),
                    new SqlParameter("@xmlReleaseEmpVacationDetails", ReleaseEmpVacationDetails.ListToXml("ReleaseEmpVacationDetails")),

                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.SghUtilities_CancelOpDiscountApprovalSave");
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



        public bool SaveForceInpatientTransfer(string IpId, string BedId)
        {

            try
            { 

                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@ipid", IpId.ToString()),
                    new SqlParameter("@bedId", BedId.ToString()),
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.SghUtilities_SaveForceInpatientTransferBed");
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


        public List<InPatientDetails> GetAllInPatient()
        {

            DBHelper db = new DBHelper();

            db.param = new SqlParameter[] {
          //  new SqlParameter("@TariffID", TariffId)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.SghUtilities_GetAllInPatient");
            List<InPatientDetails> list = new List<InPatientDetails>();
            if (dt.Rows.Count > 0) list = dt.ToList<InPatientDetails>();
            return list;
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }

        public bool SaveCancelAdmission(CancelAdmissionSaveDetails entry)
        {

            try
            {
                List<CancelAdmissionSaveDetails> SaveList = new List<CancelAdmissionSaveDetails>();
                SaveList.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@CancelAdmissionSaveDetails",SaveList.ListToXml("CancelAdmissionSaveDetails"))                  
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.SghUtilities_CheckForceCancelAdmission");
                this.ErrorMessage = db.param[0].Value.ToString();

                bool isOK = this.ErrorMessage.Split('-')[0] == "100";

                return isOK;
                //testc
            }
            catch (Exception x)
            {
                this.ErrorMessage = x.Message;
                return false;
            }

        }


        public bool CheckAdmission(CancelAdmissionSaveDetails entry)
        {

            try
            {

                StringBuilder query = new StringBuilder();
                query.Append(" Select InPatient.IPID from InPatient,Bed where  InPatient.IPID = Bed.IPID   and InPatient.registrationno = " + entry.registrationno);

                List<IpIdDetails> list = DB.ExecuteSQLAndReturnDataTableLive(query.ToString()).DataTableToList<IpIdDetails>();

                if (list.Count == 0)
                {
                    this.ErrorMessage = "Admission is already cancelled";
                    return false;
                }


                List<CancelAdmissionSaveDetails> SaveList = new List<CancelAdmissionSaveDetails>();
                SaveList.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@CancelAdmissionSaveDetails",SaveList.ListToXml("CancelAdmissionSaveDetails"))                  
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.SghUtilities_UpdateDoctorsCodeSave");
                this.ErrorMessage = db.param[0].Value.ToString();

                bool isOK = this.ErrorMessage.Split('-')[0] == "100";

                return isOK;
                //testc
            }
            catch (Exception x)
            {
                this.ErrorMessage = x.Message;
                return false;
            }

        }


        public bool SaveArDataEOD(ArDateEodDetails entry)
        {
            // OLD [dbo].[SP_OP_POSTARCOMPANYBILLDETAILS] 
            try
            { 
                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                      new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@action",entry.Action.ToString()),
                    new SqlParameter("@from",entry.MonthYear.ToString("dd-MMM-yyyy"))                  
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.SghUtilities_ArDataEod");
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

        public bool RamadanCutOffSave(RamadanCutoff entry)
        {
             
            try
            {
                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                     
                    new SqlParameter("@Hours",entry.Hours ),
                    new SqlParameter("@Min",entry.Mins )                  
                };

                 db.ExecuteSP("ITADMIN.RamadanCutOff_Save");
                this.ErrorMessage = "100-Ramadan Cut off updated";

                bool isOK = this.ErrorMessage.Split('-')[0] == "100";

                return isOK;
            }
            catch (Exception x)
            {
                this.ErrorMessage = x.Message;
                return false;
            }

        }


        public List<PHACanceDateReceipt_Dashboard> PHACanceDateReceipt_Dashboard(string date)
        {
            DBHelper db = new DBHelper();

            db.param = new SqlParameter[] {
            new SqlParameter("@stDate", date)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.PHACanceDateReceipt_Dashboard");
            List<PHACanceDateReceipt_Dashboard> list = new List<PHACanceDateReceipt_Dashboard>();
            if (dt.Rows.Count > 0) list = dt.ToList<PHACanceDateReceipt_Dashboard>();
            return list;
        }



        public bool PHACanceDateReceipt_Save(PHACanceDateReceipt_Save entry)
        {
     
            try
            {
                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@Date", entry.Date),
                    new SqlParameter("@xmlOpBillList", entry.OpBillList.ListToXml("xmlOpBillList"))
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.PHACanceDateReceipt_Save");
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






        


  
    }
}
