using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;


namespace DataLayer.ITAdmin.Model
{
    public class OccupationModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();

        public bool Save(OccupationSave entry)
        {

            try
            {
                List<OccupationSave> OccupationSave = new List<OccupationSave>();
                OccupationSave.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlOccupationSave",OccupationSave.ListToXml("OccupationSave"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.Occupation_Save_SCS");
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

        public List<OccupationDashBoard> OccupationDashBoard()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Occupation_DashBoard_SCS");
            List<OccupationDashBoard> list = new List<OccupationDashBoard>();
            if (dt.Rows.Count > 0) list = dt.ToList<OccupationDashBoard>();
            return list;
        }

        public List<OccupationViewModel> OccupationViewModelDal(int Id)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@Id", Id)
           
           
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Occupation_View_SCS");
            List<OccupationViewModel> list = new List<OccupationViewModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<OccupationViewModel>();
            return list;
        }
    }


    public class OccupationSave
    {

        public int Action { get; set; }
        public int Id { get; set; }
        public int OperatorId { get; set; }
        public string Name { get; set; }

    }

    public class OccupationDashBoard
    {
        public string Name { get; set; }
        public int Id { get; set; }

    }

    public class OccupationViewModel
    {
        public string Name { get; set; }
        public int Id { get; set; }
    }
}



