using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;

namespace DataLayer
{
    public class MapOtherPackageProcedModel
    {
        public string ErrorMessage { get; set; }
        
        DBHelper db = new DBHelper();

        public List<PackageServiceList> PacakgeServiceDAL(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT top 50 ID id,ServiceName as text, ServiceName as name from IPBService where ID = 6 and Deleted = 0  and ServiceName like '%" + id + "%' ").DataTableToList<PackageServiceList>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }

        public List<MapOtherProcedureDashboard> MapOtherProcedureDashboard()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.MapOtherProcedure_DashBoard_SCS");
            List<MapOtherProcedureDashboard> list = new List<MapOtherProcedureDashboard>();
            if (dt.Rows.Count > 0) list = dt.ToList<MapOtherProcedureDashboard>();
            return list;
        }

        public List<MapOtherProcedureView> MapOtherProcedureView(int Id)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@Id", Id),
 

            };

            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.MapOtherProcedure_View_SCS");
            List<MapOtherProcedureView> list = new List<MapOtherProcedureView>();
            if (dt.Rows.Count > 0) list = dt.ToList<MapOtherProcedureView>();
            return list;
        }

        public bool Save(OtherPackageHeaderSave entry)
        {

            try
            {
                List<OtherPackageHeaderSave> OtherPackageHeaderSave = new List<OtherPackageHeaderSave>();
                OtherPackageHeaderSave.Add(entry);

                List<OtherPackageDetailsSave> OtherPackageDetailsSave = entry.OtherPackageDetailsSave;
                if (OtherPackageDetailsSave == null) OtherPackageDetailsSave = new List<OtherPackageDetailsSave>();


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlOtherPackageHeaderSave",OtherPackageHeaderSave.ListToXml("OtherPackageHeaderSave")),
                    new SqlParameter("@xmlOtherPackageDetailsSave", OtherPackageDetailsSave.ListToXml("OtherPackageDetailsSave")),
                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.OtherPackageProcedure_Save_SCS");
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

    public class OtherPackageHeaderSave
    {
        public int Action { get; set; }
        public int ServiceId { get; set; }
        public int OperatorId { get; set; }
        public List<OtherPackageDetailsSave> OtherPackageDetailsSave { get; set; }

    }

    public class  OtherPackageDetailsSave
    {
        public int ItemId {get; set;}
    
    }

    public class PackageServiceList
    {
        public string id { get; set; }
        public string text { get; set; }
        public string name { get; set; }
    
    }

    public class MapOtherProcedureDashboard
    {
        //public int SNo { get; set; }
        public string Name { get; set; }
        public string DepartmentName { get; set; }
        public string ServiceName { get; set; }
        public int ItemId { get; set; }
        public int ServiceID { get; set; }
    }


    public class MapOtherProcedureView
    {
        //public int SNo { get; set; }
        public string Name { get; set; }
        public string DepartmentName { get; set; }
        public string ServiceName { get; set; }
        public int ItemId { get; set; }
        public int ServiceID { get; set; }
    }


}



