using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;


namespace DataLayer.ITAdmin.Model
{
    public class MaritalStatusModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();

        public bool Save(MaritalSave entry)
        {

            try
            {
                List<MaritalSave> MaritalSave = new List<MaritalSave>();
                MaritalSave.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlMaritalSave",MaritalSave.ListToXml("MaritalSave"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.Marital_Save_SCS");
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

        public List<MaritalDashBoard> MaritalDashBoard()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Marital_DashBoard_SCS");
            List<MaritalDashBoard> list = new List<MaritalDashBoard>();
            if (dt.Rows.Count > 0) list = dt.ToList<MaritalDashBoard>();
            return list;
        }

        public List<MartialViewModel> MaritalViewModelDal(int Id)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@Id", Id)
           
           
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Marital_View_SCS");
            List<MartialViewModel> list = new List<MartialViewModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<MartialViewModel>();
            return list;
        }
    }


    public class MaritalSave
    {

        public int Action { get; set; }
        public int Id { get; set; }
        public int OperatorId { get; set; }
        public string Name { get; set; }

    }

    public class MaritalDashBoard
    {
        public string Name { get; set; }
        public int Id { get; set; }
    
    }

    public class MartialViewModel
    {
        public string Name { get; set; }
        public int Id { get; set; }
    }
}



