using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;


namespace DataLayer.ITAdmin.Model
{
    public class StationTypeModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();

        public bool Save(StationTypeSave entry)
        {

            try
            {
                List<StationTypeSave> StationTypeSave = new List<StationTypeSave>();
                StationTypeSave.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlStationTypeSave",StationTypeSave.ListToXml("StationTypeSave"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.StationType_Save_SCS");
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

        public List<StationTypeDashBoard> StationTypeDashBoard()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.StationType_DashBoard_SCS");
            List<StationTypeDashBoard> list = new List<StationTypeDashBoard>();
            if (dt.Rows.Count > 0) list = dt.ToList<StationTypeDashBoard>();
            return list;
        }

        public List<StationTypeViewModel> StationTypeViewModel(int Id)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@Id", Id)
           
           
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.StationType_View_SCS");
            List<StationTypeViewModel> list = new List<StationTypeViewModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<StationTypeViewModel>();
            return list;
        }
    }


    public class StationTypeSave
    {

        public int Action { get; set; }
        public int Id { get; set; }
        public int OperatorId { get; set; }
        public string Name { get; set; }

    }

    public class StationTypeDashBoard
    {
        public string Name { get; set; }
        public int Id { get; set; }


    }

    public class StationTypeViewModel
    {
        public string Name { get; set; }
        public string Id { get; set; }
        public string StartDateTime { get; set; }
        public string StartTime { get; set; }
        public string DateToday { get; set; }
        public string TimeToday { get; set; }
    }
}



