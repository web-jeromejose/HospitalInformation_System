using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;


namespace DataLayer.ITAdmin.Model
{
    public class LocationModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();

        public bool Save(LocationSave entry)
        {

            try
            {
                List<LocationSave> LocationSave = new List<LocationSave>();
                LocationSave.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlLocationSave",LocationSave.ListToXml("LocationSave"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.Location_Save_SCS");
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

        public List<LocationDashBoard> LocationDashBoard()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Location_DashBoard_SCS");
            List<LocationDashBoard> list = new List<LocationDashBoard>();
            if (dt.Rows.Count > 0) list = dt.ToList<LocationDashBoard>();
            return list;
        }

        public List<LocationViewModel> LocationViewModel(int LocationId)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@LocationId", LocationId)
           
           
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Location_View_SCS");
            List<LocationViewModel> list = new List<LocationViewModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<LocationViewModel>();
            return list;
        }
    }


    public class LocationSave
    {

        public int Action { get; set; }
        public int Id { get; set; }
        public int OperatorId { get; set; }
        public string Name { get; set; }

    }

    public class LocationDashBoard
    {
        public string Name { get; set; }
        public int Id { get; set; }
    
    }


    public class LocationViewModel
    {
        public string Name { get; set; }
        public int Id { get; set; }
    }
}



