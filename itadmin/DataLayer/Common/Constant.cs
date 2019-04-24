using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Data;
namespace DataLayer
{
    public class ConstantModel
    {
        public string cModuleID = "1"; ///Change base on DataInfo..ServerInformation        
    }

    public class ApplicationGlobal
    {
        DBHelper DB = new DBHelper("HIS");
        ConstantModel m = new ConstantModel();
        public string ModuleID { get; set; }
        public string UserID { get; set; }


        public ApplicationVersionModel GetApplicationDetail()
        {
            try
            {
                ConstantModel cons = new ConstantModel();
                DB.param = new SqlParameter[]{
                     new SqlParameter("ModuleID", cons.cModuleID )
                };
                return DB.ExecuteSPAndReturnDataTable("HISGLOBAL.GET_APPLICATION_DETAIL").DataTableToModel<ApplicationVersionModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
        public List<ApplicationMenuModel> GetApplicationMenu()
        {
            try
            {
                ConstantModel cons = new ConstantModel();
                DB.param = new SqlParameter[]{
                     new SqlParameter("UserID", UserID),
                     new SqlParameter("ModuleID", cons.cModuleID )
                };
                return DB.ExecuteSPAndReturnDataTable("HISGLOBAL.EMPLOYEE_FEATURE").DataTableToList<ApplicationMenuModel>();

            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }
    }

    public class ApplicationVersionModel
    {
        public string ModuleID { get; set; }
        public string MajorVersion { get; set; }
        public string MinorVersion { get; set; }
        public string Description { get; set; }
        public string DateDeployed { get; set; }
        public string DateDeveloped { get; set; }
        public string ModuleName { get; set; }
        public string Name { get; set; }
        public string AddInformation { get; set; }
        public string Address { get; set; }
        public string PhoneNo { get; set; }
        public string FaxNo { get; set; }
        public string IssueAuthorityCode { get; set; }
        public string Developer { get; set; }
        public string CopyRight { get; set; }
        public string StationID { get; set; }
    }
    public class ApplicationMenuModel
    {
        public string ID { get; set; }
        public string MenuName { get; set; }
        public string ParentName { get; set; }
        public string MenuURL { get; set; }
        public string ParentSequence { get; set; }
        public string ParentID { get; set; }
        public string MenuLevel { get; set; }
        public string MenuSequence { get; set; }
        public string Bar { get; set; }
        public string Access { get; set; }
        public string NewWindow { get; set; }
    }

    internal class HISConstant
    {
        #region Table
        internal const string MMSIPSTATION_SAVE = "MMSIpStationSave";
        #endregion

        #region StoredProcedure
        internal const string MMSIPSTATION_SAVE_SP = "ITADMIN.MMSIpStation_Save_SCS";
        internal const string MMSIPSTATION_VIEW_SP = "ITADMIN.MMSIpStation_GetMMSIpStation";
        internal const string MMSIPSTATION_DT_SP = "ITADMIN.MMSIpStation_GetMMSIpStationDataTable";
        #endregion

        #region StoredProcedure-Parameter
        internal const string ERROR_MESSAGE = "@ErrorMessage";
        internal const string XML_MMSIPSTATION_SAVE = "@xmlMMSIpStationSave";
        #endregion

        #region Message
        internal const string NOT_ASSIGNED = "Action has not been assigned!";
        internal const string INVALID_IP = "Please enter valid IP Address!";
        internal const string INVALID_STATID = "Please enter valid StationId!";
        internal const string INVALID_LOGIN = "Please enter valid LoginName!";
        #endregion
    }
}
