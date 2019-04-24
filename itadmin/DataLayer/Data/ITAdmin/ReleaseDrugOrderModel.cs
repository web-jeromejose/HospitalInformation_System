using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;

namespace DataLayer
{
    public class ReleaseDrugOrderModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();


        public bool Save(ReleaseDrugOrderSave entry)
        {

            try
            {
                List<ReleaseDrugOrderSave> ReleaseDrugOrderSave = new List<ReleaseDrugOrderSave>();
                ReleaseDrugOrderSave.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlReleaseOrderDrugSave",ReleaseDrugOrderSave.ListToXml("ReleaseDrugOrderSave"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.ReleaseOrderDrug_Save_SCS");
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

    public class ReleaseDrugOrderSave
    {
        public int Action { get; set; }
        public int OrderId { get; set; }
    }


}



