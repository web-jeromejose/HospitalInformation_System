using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;


namespace DataLayer.ITAdmin.Model
{
    public class SubStoreModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();

        public List<ListHoldingStore> HoldingListDAL(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 a.ID as id,a.Name as text,a.Name as name from Station  a where a.Deleted = 0 and stores = 1 and name like '%" + id + "%' ").DataTableToList<ListHoldingStore>();
           
        }

        public List<SubStoreList> SubStoreList(int Id)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@Id", Id),
            };

            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.SubStore_View_SCS");
            List<SubStoreList> list = new List<SubStoreList>();
            if (dt.Rows.Count > 0) list = dt.ToList<SubStoreList>();
            return list;
        }


        public bool Save(HoldingSubStoreHeaderModel entry)
        {

            try
            {
                List<HoldingSubStoreHeaderModel> HoldingSubStoreHeaderModel = new List<HoldingSubStoreHeaderModel>();
                HoldingSubStoreHeaderModel.Add(entry);

                List<HoldingSubStoreDetailsModel> HoldingSubStoreDetailsModel = entry.HoldingSubStoreDetailsModel;
                if (HoldingSubStoreDetailsModel == null) HoldingSubStoreDetailsModel = new List<HoldingSubStoreDetailsModel>();



                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlHoldingSubStoreHeaderModel",HoldingSubStoreHeaderModel.ListToXml("HoldingSubStoreHeaderModel")),  
                    new SqlParameter("@xmlHoldingSubStoreDetailsModel",HoldingSubStoreDetailsModel.ListToXml("HoldingSubStoreDetailsModel")),
                  
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.HoldingSubStoreSave_SCS");
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

    public class HoldingSubStoreHeaderModel
    {
        public int Action { get; set; }
        public List<HoldingSubStoreDetailsModel> HoldingSubStoreDetailsModel { get; set; }
    }

    public class HoldingSubStoreDetailsModel
    {
        public int stores { get; set; }
        public int Id { get; set; }
    }


    public class SubStoreList
    {
        public int selected { get; set; }
        public string Name { get; set; }
        public int Id { get; set; }    
    }


    public class SubStoreDashBoardModel
    {
        public int selected { get; set; }
        public string Name { get; set; }
        public int ID { get; set; }
    }


    public class ListHoldingStore
    {
        public string id { get; set; }
        public string text { get; set; }
        public string name { get; set; } 
    }


}

   

      



