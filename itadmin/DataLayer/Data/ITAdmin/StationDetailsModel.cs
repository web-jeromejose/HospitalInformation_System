using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;


namespace DataLayer.ITAdmin.Model
{
    public class StationDetailsModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();

        public bool Save(StationDetailsSave entry)
        {

            try
            {
                List<StationDetailsSave> StationDetailsSave = new List<StationDetailsSave>();
                StationDetailsSave.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlStationDetailsSave",StationDetailsSave.ListToXml("StationDetailsSave"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.StationDetails_Save_SCS");
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

        public List<StationDashBoard> StationDashBoard()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Station");
            List<StationDashBoard> list = new List<StationDashBoard>();
            if (dt.Rows.Count > 0) list = dt.ToList<StationDashBoard>();
            return list;
        }

        public List<StationDetailsViewModel> StationDetailsViewModellst(int Id)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@Id", Id)
           
           
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Station_View");
            List<StationDetailsViewModel> list = new List<StationDetailsViewModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<StationDetailsViewModel>();
            return list;
        }

        public List<LocationList> LocationListDal(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT id as id,Name as text,Name as name from Location where deleted = 0 and name like '%" + id + "%' ").DataTableToList<LocationList>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }

        public List<LocationList> StationTypeListDal(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT id as id,Name as text,Name as name from StationType where deleted = 0 and name like '%" + id + "%' ").DataTableToList<LocationList>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }

        public List<LocationList> DepartmentListDal(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT id as id,Name as text,Name as name from Department where deleted = 0 and name like '%" + id + "%' ").DataTableToList<LocationList>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }
    }

    public class LocationList
    {
        public string id { get; set; }
        public string name { get; set; }
        public string text { get; set; }
        //public string tariffid { get; set; }
    }

    public class DepartmentList
    {
        public string id { get; set; }
        public string name { get; set; }
        public string text { get; set; }
        //public string tariffid { get; set; }
    }


    public class StationDetailsSave
    {

        public int Action { get; set; }
        public int StationId { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public string StationTypeId { get; set; }
        public string DepartmentId { get; set; }
        public string LocationId { get; set; }
        public string Prefix { get; set; }
        public string Code { get; set; }
        public string IndentLevel { get; set; }
        public int OperatorId { get; set; }
    }

    public class StationDashBoard
    {
        public string slno { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public string LocationName { get; set; }
        public int ID { get; set; }
        public string StartDateTime { get; set; }

    }

    public class StationDetailsViewModel
    {
        public string slno { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public string LocationName { get; set; }
        public string StationTypeName { get; set; }
        public string DepartmentName { get; set; }
        public string Prefix { get; set; }
        public string Code { get; set; }
        public string StartDate { get; set; }
        public string StartTime { get; set; }
        public int StationId { get; set; }
        public int LocationId { get; set; }
        public int StationTypeID { get; set; }
        public int DepartmentId { get; set; }
        public int IndentLevel { get; set; }
        public string ORA_CODE { get; set; }
        
    }
}



