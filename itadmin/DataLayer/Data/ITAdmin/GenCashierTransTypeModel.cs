using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;


namespace DataLayer.ITAdmin.Model
{
    public class GenCashierTransTypeModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();

        public bool Save(GenCashierTransTypeSave entry)
        {

            try
            {
                List<GenCashierTransTypeSave> GenCashierTransTypeSave = new List<GenCashierTransTypeSave>();
                GenCashierTransTypeSave.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlGenCashierTransTypeSave",GenCashierTransTypeSave.ListToXml("GenCashierTransTypeSave"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.GenCashierTransType_Save_SCS");
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

        public List<GenCashierTransTypeDashBoard> GenCashierTransTypeDashBoard()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.GenCashierTransType_DashBoard_SCS");
            List<GenCashierTransTypeDashBoard> list = new List<GenCashierTransTypeDashBoard>();
            if (dt.Rows.Count > 0) list = dt.ToList<GenCashierTransTypeDashBoard>();
            return list;
        }

        public List<GenCashierViewModel> GenCashierViewModel(int Id)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@Id", Id)
           
           
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.GenCashierTransType_View_SCS");
            List<GenCashierViewModel> list = new List<GenCashierViewModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<GenCashierViewModel>();
            return list;
        }


    }

    public class GenCashierTransTypeSave
    {
        public int Action { get; set; }
        public int Id { get; set; }
        public int OperatorId { get; set; }
        public string Name { get; set; }
        public int TypeId { get; set; }
    }

    public class GenCashierTransTypeDashBoard
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public int Id { get; set; }
    
    }

    public class GenCashierViewModel
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public int TypeId { get; set; }
        public int Id { get; set; }
    }
}



