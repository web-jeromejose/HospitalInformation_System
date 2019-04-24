using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer.ITAdmin.Model
{
    public class UpdateDoctorsCode
    {
        public List<EmployeeList> EmployeeList { get; set; }
        public List<EmployeeList> CategoryList { get; set; }

       
    }

    public class EmployeeList
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string EmployeeID { get; set; }
    }

    public class EmployeeDetailsList
    {
        public string EmployeeID { get; set; }
        public string Name { get; set; }
        public string EmpCode { get; set; }
        public string Email { get; set; }
        public int ID { get; set; }
        public string NatName { get; set; }
        public string DeptName { get; set; }
        public string DesignationName { get; set; }
        public int CatId { get; set; }
        public int Deleted { get; set; }
        public string txtPhysiotherapist { get; set; }
       

    }
    public class UpdateDoctorsCodeSave
    {
        public string cboEmployee { get; set; }
        public string cboCategory { get; set; }
        public string cboStatus { get; set; }
        public string txtDoctorCode { get; set; }
        public string txtEmail { get; set; }
        public string txtPhysiotherapist { get; set; }
    }

    public class TariffDetails
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class DownloadCompanyPrice
    {
        public List<TariffDetails> TariffList { get; set; }
    }

    public class DownloadCompIPPriceDetails
    {
        public string xGroup { get; set; }
        public string Department { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public double Price { get; set; }
        public string arabicname { get; set; }
    }

    public class UserAccessReviewVM
    {
        public List<EmployeeList> DeptList { get; set; }

    }



    public class InPatientVM
    {
        public List<InPatientDetails> InPatientList { get; set; }
    }

    public class InPatientDetails
    {
        public string registrationno { get; set; }
        public int categoryid { get; set; }
        public int companyid { get; set; }
        public string ipid { get; set; }
        public string Title { get; set; }
        public string Name { get; set; }
        public DateTime AdmitDateTime { get; set; }
        public DateTime Now { get; set; }
        public string age { get; set; }
        public string sex { get; set; }
        public string EmployeeID { get; set; }
        public string Doctor { get; set; }
        public string bedname { get; set; }
        public string bedId { get; set; }
        public string BedType { get; set; }
        public string station { get; set; }
        public string stationid { get; set; }

     }

    public class CancelAdmissionSaveDetails
    {
        public string reason { get; set; }

        public string registrationno { get; set; }
        public int categoryid { get; set; }
        public int companyid { get; set; }
        public string ipid { get; set; }
        public string Title { get; set; }
        public string Name { get; set; }
        public DateTime AdmitDateTime { get; set; }
        public DateTime Now { get; set; }
        public string age { get; set; }
        public string sex { get; set; }
        public string EmployeeID { get; set; }
        public string Doctor { get; set; }
        public string bedname { get; set; }
        public string bedId { get; set; }
        public string BedType { get; set; }
        public string station { get; set; }
        public string stationid { get; set; }
    }

    public class IpIdDetails
    {
        public string ipid { get; set; }
    }

    public class ArDateEodDetails
    {
        public string Action { get; set; }
        public DateTime MonthYear { get; set; }
    }


    public class RamadanCutoff
    {
        public int Hours { get; set; }
        public int Mins { get; set; }
 
    }

    public class PHACanceDateReceipt_Dashboard
    {
        public string opbillid { get; set; }
        public string billno { get; set; }
        public string  selected { get; set; }
    }
    public class PHACanceDateReceipt_Save
    {
   
        public string Date { get; set; }
        public List<OpBillList> OpBillList { get; set; }
    }
    public class OpBillList
    {
        public string opbillid { get; set; }
        public string billno { get; set; }
    }

   

}
