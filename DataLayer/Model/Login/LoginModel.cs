using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer
{
    public class LoginModel
    {
        public string ID { get; set; }
        public string Username { get; set; }

        public string Password { get; set; }
        public string Name { get; set; }
        public string Branch { get; set; }
        public string BranchID { get; set; }

        public string ModuleAccess { get; set; }
        public string ClinicType { get; set; }
    }

 
    public class RolesOfUserModel
    {
        public string ModuleCode { get; set; }
        public string ModuleName { get; set; }
        public string PermissionType { get; set; }
    }

    public class UserItems
    {
        public string EmployeeID { get; set; }
        public string Name { get; set; }
    }

    public class UserModules
    {
        public string ModuleID { get; set; }
        public string Name { get; set; }
        public string URLLink { get; set; }
        public string ImgSrc { get; set; }
    }


    public class UserFormModel
    {
        public string Action { get; set; }
        public string txtQuestion1 { get; set; }
        public string txtQuestion2 { get; set; }
        public string txtAnswer1 { get; set; }
        public string txtAnswer2 { get; set; }
        public string email { get; set; }
        public string mobile { get; set; }
        public string EmpId { get; set; }
    }

    public class ChangePasswordSaveModel
    {
        public string Action { get; set; }
        public string id { get; set; }
        public string password { get; set; }
        public string pass_key { get; set; }
    }



    public class remainingdaysmodel
    {
        public string daysremaining { get; set; }
    }


    public class UserList
    {
        public string id { get; set; }
        public string name { get; set; }
        public string text { get; set; }
    }

    public class GetUserListModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
        public string Question1 { get; set; }
        public string Question2 { get; set; }
        public string SecAnswer1 { get; set; }
        public string SecAnswer2 { get; set; }
        public string EffectivityDate { get; set; }
        public bool IsSuperUserId { get; set; }
        public string IsSuperUser { get; set; }
        public string DecrpytPass { get; set; }


    }

    public class UserRegistrationSave
    {
        public int Action { get; set; }
        public int Id { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
        public string Question1 { get; set; }
        public string Question2 { get; set; }
        public string SecAnswer1 { get; set; }
        public string SecAnswer2 { get; set; }
        public string EffectivityDate { get; set; }
        //public bool IsSuperUserId { get; set; }
        //public string IsSuperUser { get; set; }
        public int OperatorId { get; set; }
        public string IPAddress { get; set; }
    }

    public class LogChar
    {
        public string MonthName { get; set; }
        public int MonthNumber { get; set; }        
        public int sum_of_login { get; set; }
        public int total_login { get; set; }
        public string module_use { get; set; }
        public int module_count { get; set; }
        public string IPAddress { get; set; }
        public int ip_count { get; set; }
        public int all_user_count { get; set; }
        public string all_user_modulename { get; set; }

        
    }
    public class PunchInDetails
    {
        public string DeptID { get; set; }
        public string EmployeeID { get; set; }
        public string Name { get; set; }
        public string Todate { get; set; }
        public string InTime { get; set; }
        public string OutTime { get; set; }
        public string InTime1 { get; set; }
        public string OutTime1 { get; set; }
        public string Shiftname { get; set; }


    }



}
