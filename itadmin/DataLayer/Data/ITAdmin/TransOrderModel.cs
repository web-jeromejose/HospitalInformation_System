using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;

namespace DataLayer
{
    public class TransOrderModel
    {
        public string ErrorMessage { get; set; }

        public bool Process(CreateTransOrder entry)
        {

            try
            {
                List<CreateTransOrder> CreateTransOrder = new List<CreateTransOrder>();
                CreateTransOrder.Add(entry);

                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlCreateTransOrder",CreateTransOrder.ListToXml("CreateTransOrder"))

                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.CreateTransOrder_SCS");
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


    }

    public class CreateTransOrder
    {
        public int Action { get; set; }
        public string MonthYear { get; set; }
    }

}



