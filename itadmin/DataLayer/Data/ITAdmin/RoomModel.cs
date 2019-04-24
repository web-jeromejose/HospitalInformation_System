using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;


namespace DataLayer.ITAdmin.Model
{
    public class RoomModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();

        public bool Save(RoomsSave entry)
        {

            try
            {
                List<RoomsSave> RoomsSave = new List<RoomsSave>();
                RoomsSave.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlRoomsSave",RoomsSave.ListToXml("RoomsSave"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.Room_Save_SCS");
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

        public List<RoomsDashBoard> RoomsDashBoard()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Rooms_DashBoard_SCS");
            List<RoomsDashBoard> list = new List<RoomsDashBoard>();
            if (dt.Rows.Count > 0) list = dt.ToList<RoomsDashBoard>();
            return list;
        }

        public List<RoomsViewModel> RoomsViewModel(int Id)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@Id", Id)
           
           
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Rooms_View_SCS");
            List<RoomsViewModel> list = new List<RoomsViewModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<RoomsViewModel>();
            return list;
        }
    }


    public class RoomsSave
    {

        public int Action { get; set; }
        public int Id { get; set; }
        public int OperatorId { get; set; }
        public string Name { get; set; }

    }

    public class RoomsDashBoard
    {
        public string Name { get; set; }
        public int Id { get; set; }

    }

    public class RoomsViewModel
    {
        public string Name { get; set; }
        public int Id { get; set; }
    }
}



