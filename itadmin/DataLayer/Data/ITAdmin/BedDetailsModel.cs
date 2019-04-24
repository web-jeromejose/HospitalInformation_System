using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;


namespace DataLayer.ITAdmin.Model
{
    public class BedDetailsModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();

        public bool Save(BedSave entry)
        {

            try
            {
                List<BedSave> BedSave = new List<BedSave>();
                BedSave.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlBedSave",BedSave.ListToXml("BedSave"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.Bed_Save_SCS");
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

        public List<BedDashBoard> BedDashBoardDL()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Bed_DashBoard");
            List<BedDashBoard> list = new List<BedDashBoard>();
            if (dt.Rows.Count > 0) list = dt.ToList<BedDashBoard>();
            return list;
        }

        public List<BedViewModel> BedViewModelDL(int Id)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@Id", Id)
           
           
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Bed_View");
            List<BedViewModel> list = new List<BedViewModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<BedViewModel>();
            return list;
        }

        public List<ListSelect> BedType(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,name as text, name as name from bedtype where Deleted = 0 and name like '%" + id + "%' ").DataTableToList<ListSelect>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }

        public List<ListSelect> StationName(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,name as text, name as name from dbo.station where Deleted = 0 and name like '%" + id + "%' ").DataTableToList<ListSelect>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }

        public List<ListSelect> RoomName(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,name as text, name as name from Rooms where Deleted = 0 and name like '%" + id + "%' ").DataTableToList<ListSelect>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }

        public List<ListSelect> BedStatus(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,name as text, name as name from bedstatus where name like '%" + id + "%' ").DataTableToList<ListSelect>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }

        public List<ListSelect> DepartmentList(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,name as text, name as name from Department where Deleted = 0 and name like '%" + id + "%' ").DataTableToList<ListSelect>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }


    }

    public class ListSelect
    {
        public string id { get; set; }
        public string name { get; set; }
        public string text { get; set; }
        //public string tariffid { get; set; }
    }


    public class BedSave
    {

        public int Action { get; set; }
        public int bedid { get; set; }
        public string BedName { get; set; }
        public string ExtensionNo { get; set; }
        public int BedTypeID { get; set; }
        public int StationId { get; set; }
        public int RoomId { get; set; }
        public int StatusId { get; set; }
        public int DepartmentID { get; set; }
        public int OperatorId { get; set; }
    }

    public class BedDashBoard
    {
        public string Slno { get; set; }
        public string Station { get; set; }
        public string Name { get; set; }
        public string BedId { get; set; }
    }

    public class BedViewModel
    {
        public string BedName { get; set; }
        public string BedType { get; set; }
        public string BedTypeID { get; set; }
        public string RoomName { get; set; }
        public string RoomId { get; set; }
        public string ExtensionNo { get; set; }
        public string StatusId { get; set; }
        public string BedStatusName { get; set; }
        public string DepartmentID { get; set; }
        public string DepartmentName { get; set; }
        public string Stationname { get; set; }
        public string StationId { get; set; }
        public string bedid { get; set; }
    }
}



