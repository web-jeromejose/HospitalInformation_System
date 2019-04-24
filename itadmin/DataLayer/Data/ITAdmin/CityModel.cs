using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;


namespace DataLayer.ITAdmin.Model
{
    public class CityModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();

        public bool Save(CitySave entry)
        {

            try
            {
                List<CitySave> CitySave = new List<CitySave>();
                CitySave.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlCitySave",CitySave.ListToXml("CitySave"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.City_Save_SCS");
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

        public List<CityDashBoard> CityDashBoardDal()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.City_DashBoard_SCS");
            List<CityDashBoard> list = new List<CityDashBoard>();
            if (dt.Rows.Count > 0) list = dt.ToList<CityDashBoard>();
            return list;
        }

        public List<CityViewModel> CityViewModel(int Id)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@Id", Id)
           
           
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.City_View_SCS");
            List<CityViewModel> list = new List<CityViewModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<CityViewModel>();
            return list;
        }
    }


    public class CitySave
    {

        public int Action { get; set; }
        public int Id { get; set; }
        public int OperatorId { get; set; }
        public string Name { get; set; }

    }

    public class CityDashBoard
    {
        public string Name { get; set; }
        public int Id { get; set; }

    }

    public class CityViewModel
    {
        public string Name { get; set; }
        public int Id { get; set; }
    }
}



