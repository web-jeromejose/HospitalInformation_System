using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;

namespace DataLayer
{
    public class NonDiscountItemModel
    {
        public string ErrorMessage { get; set; }
        
        DBHelper db = new DBHelper();

        public bool Save(NonDiscountHeaderSave entry)
        {

            try
            {
                List<NonDiscountHeaderSave> NonDiscountHeaderSave = new List<NonDiscountHeaderSave>();
                NonDiscountHeaderSave.Add(entry);

                List<NonDiscountDetailsSave> NonDiscountDetailsSave = entry.NonDiscountDetailsSave;
                if (NonDiscountDetailsSave == null) NonDiscountDetailsSave = new List<NonDiscountDetailsSave>();


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlNonDiscountHeaderSave",NonDiscountHeaderSave.ListToXml("NonDiscountHeaderSave")),
                    new SqlParameter("@xmlNonDiscountDetailsSave", NonDiscountDetailsSave.ListToXml("NonDiscountDetailsSave")),
                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.NonDiscountItemSave_SCS");
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

        public List<ServiceList> ServiceDal(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT top 50 id id,Name as text, Name as name from OpBService where Deleted = 0  and name like '%" + id + "%' ").DataTableToList<ServiceList>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }

        public List<NonDiscountItemList> NonDiscountItemList(int ServiceId)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@ServiceId", ServiceId),
 

            };


            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.NonDiscountableItem_DashBoard_SCS");
            List<NonDiscountItemList> list = new List<NonDiscountItemList>();
            if (dt.Rows.Count > 0) list = dt.ToList<NonDiscountItemList>();
            return list;
        }

        public List<NonDiscountItemList> SelectedNonDiscountItemList(int ServiceId)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@ServiceId", ServiceId),
 

            };


            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.SelectedNonDiscountableItem_DashBoard_SCS");
            List<NonDiscountItemList> list = new List<NonDiscountItemList>();
            if (dt.Rows.Count > 0) list = dt.ToList<NonDiscountItemList>();
            return list;
        }


    }

    public class NonDiscountHeaderSave
    {
        public int Action { get; set; }
        public int ServiceId { get; set; }
        public List<NonDiscountDetailsSave> NonDiscountDetailsSave { get; set; }
    }

    public class NonDiscountDetailsSave
    {
        public int ItemId { get; set; }
    }

    public class ServiceList
    {
        public string id { get; set; }
        public string text { get; set; }
        public string name { get; set; }

    }

    public class NonDiscountItemList
    {
        public string Items { get; set; }
        public int Id { get; set; }
 
    }

}



