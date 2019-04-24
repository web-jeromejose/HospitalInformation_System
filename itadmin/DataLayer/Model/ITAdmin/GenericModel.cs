using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer
{
    public class GenericModel
    {
        
    }
    public class ListModel
    {
        public string id { get; set; }
        public string name { get; set; }
        public string text { get; set; }
    }
    public class FunctionUserModel
    {
        public string id { get; set; }
        public string name { get; set; }
        public string text { get; set; }
        public string HasAccess { get; set; }
    }
    public class Response
    {
        public string Flag { get; set; }
        public string Message { get; set; }
    }
    public class ModuleModel
    {
        public string id { get; set; }
        public string text { get; set; }
        public string name { get; set; }

        public string ID { get; set; }
        public string ModuleID { get; set; }
        public string ModuleName { get; set; }
        public string URLLink { get; set; }
        public string ImgSrc { get; set; }
        public string StationSpecific { get; set; }
        public string TPwdRequired { get; set; }
        public string Deleted { get; set; }
        public string VirtualPoolName { get; set; }
        public string IncludeVPoolName { get; set; }
        public string AreaName { get; set; }
    }

    public class ModuleAccessModel
    {
        public string FID { get; set; } 
        public string ModuleID { get; set; }
        public string ModuleName { get; set; }
        public string URLLink { get; set; }
        public string ParentName { get; set; }
        public string ParentSeq { get; set; }
        public string FeatureID { get; set; }        
        public string FeatureName { get; set; }
        public string FeatureSequence { get; set; }
        public string HasAccess { get; set; }
    }
    public class ModuleUserModel
    {
        public string EmpID { get; set; }
        public string EmployeeID { get; set; }
        public string EmpName { get; set; }
        public string DeptName { get; set; }
    }
    public class MenuAccessModel
    {
        public string Id { get; set; }
        public string FeatureID { get; set; }
        public string Name { get; set; }
        public string ParentID { get; set; }
        public string MenuURL { get; set; }
        public string StartDateTime { get; set; }
        public string EndDateTime { get; set; }
        public string OperatorID { get; set; }
        public string Deleted { get; set; }
        public string SequenceNo { get; set; }
        public string Bar { get; set; }
        public string NewWindow { get; set; }
        public string ParentName { get; set; }

    }
      public class ModuleMenuSyncModel
    {
        public int ModuleID { get; set; }
        public string ModuleName { get; set; }
        public string URLLink { get; set; }
        public string ImgSrc { get; set; }
        public int Deleted { get; set; }
        public string StationSpecific { get; set; }
        public string TPwdRequired { get; set; }
        public string VirtualPoolName { get; set; }
        public int IncludeVPoolName { get; set; }
    }
 

    public class MenuFunctionsModel
    {
        public string Id { get; set; }
        public string FunctionID { get; set; }
        public string Name { get; set; }
        public string OperatorID { get; set; }

    }
    public class MenuParent
    {
        public string Id { get; set; }
        public string MenuID { get; set; }
        public string Name { get; set; }
        public string MenuLevel { get; set; }
        public string SequenceNo { get; set; }
    }



    public class RoleModel
    {
        public string id { get; set; }
        public string text { get; set; }
        public string name { get; set; }
    }
    public class DtTableFeatureList
    {
       
    
 
        public string Module_Id { get; set; }
        public string Feature_Id { get; set; }
        public string Name { get; set; }
        public string View { get; set; }
        public string Save { get; set; }
        public string Modify { get; set; }
        public string Delete { get; set; }
        public string Printing { get; set; }
        public int HasAccess { get; set; }

    }
    public class FeatureFuncModel
    {
        public string Feature_Id { get; set; }
        public string Function_Id { get; set; }
     
    }

    public class GetFeatureListbyRole
    {
        public string Feature_Id { get; set; }
        public string Function_Id { get; set; }
        public string featname { get; set; }
        public string funcname { get; set; }
        public string HasAccess { get; set; }

        
     
    }

    public class GetAllRoleList
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
 
    }
    public class GetModulePerStation
    {
        public string Role_Id { get; set; }
        public string Module_Id { get; set; }
        public string Modulename { get; set; }
        public string Rolename { get; set; }

    }
    public class GetUserDataTable
    {
        public string ID { get; set; }
        public string EmployeeID { get; set; }
        public string Name { get; set; }
 
    }
    public class GetRolesByUserId
    {
        public string Name { get; set; }
        public string Fullname { get; set; }
        public string Description { get; set; }
 
    }

    public class MenuFunctionPerFeatureIdModel
    {
        public string FunctionID { get; set; }
        public string Name { get; set; }
 

    }

    public class Select2Col1
    {
        public string id { get; set; }
        public string text { get; set; }
        public string name { get; set; }
        public string column1 { get; set; }
    }

    public class GetAllEmplist
    {
        public string Userid { get; set; }
        public string EmployeeId { get; set; }
        public string FullName { get; set; }
        public string DeptName { get; set; }
        public string DateHired { get; set; }
        public string Position { get; set; }
        public string Category { get; set; }
    }

    
}
