using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;


namespace DataLayer.ITAdmin.Model
{
    public class NationalityModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();

        public bool Save(NationalitySave entry)
        {

            try
            {
                List<NationalitySave> NationalitySave = new List<NationalitySave>();
                NationalitySave.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlNationalitySave",NationalitySave.ListToXml("NationalitySave"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.Nationality_Save_SCS");
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

        public List<NationalityDashBoard> NationalityDashBoard()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Nationality_DashBoard_SCS");
            List<NationalityDashBoard> list = new List<NationalityDashBoard>();
            if (dt.Rows.Count > 0) list = dt.ToList<NationalityDashBoard>();
            return list;
        }
        public List<NationalityViewModel> NationalityViewModelDal(int Id)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@Id", Id)
           
           
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Nationality_View_SCS");
            List<NationalityViewModel> list = new List<NationalityViewModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<NationalityViewModel>();
            return list;
        }
    }


    public class NationalitySave
    {

        public int Action { get; set; }
        public int Id { get; set; }
        public int OperatorId { get; set; }
        public string Name { get; set; }

    }

    public class NationalityDashBoard
    {
        public string Name { get; set; }
        public int Id { get; set; }

    }

    public class NationalityViewModel
    {
        public string Name { get; set; }
        public int Id { get; set; }
    }
}



