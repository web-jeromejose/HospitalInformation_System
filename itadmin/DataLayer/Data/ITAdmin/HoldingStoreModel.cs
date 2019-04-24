using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;


namespace DataLayer.ITAdmin.Model
{
    public class HoldingStoreModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();

        public List<HoldingStoreDashBoardModel> HoldingStoreDashBoardModel()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Holding_Store_DashBoard_SCS");
            List<HoldingStoreDashBoardModel> list = new List<HoldingStoreDashBoardModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<HoldingStoreDashBoardModel>();
            return list;
        }


        public bool Save(HoldingStoreHeaderModel entry)
        {

            try
            {
                List<HoldingStoreHeaderModel> HoldingStoreHeaderModel = new List<HoldingStoreHeaderModel>();
                HoldingStoreHeaderModel.Add(entry);

                List<HoldingStoreDetailsModel> HoldingStoreDetailsModel = entry.HoldingStoreDetailsModel;
                if (HoldingStoreDetailsModel == null) HoldingStoreDetailsModel = new List<HoldingStoreDetailsModel>();


      
                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlHoldingStoreHeaderModel",HoldingStoreHeaderModel.ListToXml("HoldingStoreHeaderModel")),  
                    new SqlParameter("@xmlHoldingStoreDetailsModel",HoldingStoreDetailsModel.ListToXml("HoldingStoreDetailsModel")),
                  
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.HoldingStoreSave_SCS");
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



}

        public class HoldingStoreDashBoardModel
        {
            public int selected { get; set; }
            public int ID { get; set; }
            public string Name { get; set; }
       

        }

        public class HoldingStoreHeaderModel
        {
            public int Action { get; set; }
            public List<HoldingStoreDetailsModel> HoldingStoreDetailsModel { get; set; }
        }

        public class HoldingStoreDetailsModel
        {
            public int stores { get; set; }
            public int Id { get; set; }
        }




