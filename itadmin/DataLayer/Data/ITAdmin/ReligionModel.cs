using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;


namespace DataLayer.ITAdmin.Model
{
    public class ReligionModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();

        public bool Save(ReligionSave entry)
        {

            try
            {
                List<ReligionSave> ReligionSave = new List<ReligionSave>();
                ReligionSave.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlReligionSave",ReligionSave.ListToXml("ReligionSave"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.Religion_Save_SCS");
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

        public List<ReligionDashBoard> LocationDashBoard()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Religion_DashBoard_SCS");
            List<ReligionDashBoard> list = new List<ReligionDashBoard>();
            if (dt.Rows.Count > 0) list = dt.ToList<ReligionDashBoard>();
            return list;
        }

        public List<ReligionViewModel> ReligionViewModel(int ReligionId)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@ReligionId", ReligionId)
           
           
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Religion_View_SCS");
            List<ReligionViewModel> list = new List<ReligionViewModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<ReligionViewModel>();
            return list;
        }
    }


    public class ReligionSave
    {

        public int Action { get; set; }
        public int Id { get; set; }
        public int OperatorId { get; set; }
        public string Name { get; set; }

    }

    public class ReligionDashBoard
    {
        public string Name { get; set; }
        public int Id { get; set; }
    
    }


    public class ReligionViewModel
    {
        public string Name { get; set; }
        public int Id { get; set; }
    }
}



