using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;


namespace DataLayer
{
    public class FoodItemModel
    {
        public string ErrorMessage { get; set; }
        DBHelper db = new DBHelper();

        public List<FoodItemDataTableDAL> FoodItemDataTable()
        {

            db.param = new SqlParameter[] {
 
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.FoodItem_ShowAll");
            List<FoodItemDataTableDAL> list = new List<FoodItemDataTableDAL>();
            if (dt.Rows.Count > 0) list = dt.ToList<FoodItemDataTableDAL>();
            return list;
        }

        public bool Save(FoodItemSave entry)
        {
            List<FoodItemSave> DetailsEntry = new List<FoodItemSave>();
            DetailsEntry.Add(entry);
            try
            {
                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@FoodItemSaveXML", DetailsEntry.ListToXml("FoodItemSaveXML"))
                };

                //db.param[0].Direction = ParameterDirection.Output;
                //db.ExecuteSP("ITADMIN.FoodItem_Save");
                //this.ErrorMessage = db.param[0].Value.ToString();

                //bool isOK = this.ErrorMessage.Split('-')[0] == "100";

                //return isOK;

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.FoodItem_Save");
              
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
        public bool SaveFoodCategory(FoodCategorySave entry)
        {
            List<FoodCategorySave> DetailsEntry = new List<FoodCategorySave>();
            DetailsEntry.Add(entry);
            try
            {
                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@FoodItemCategorySaveXML", DetailsEntry.ListToXml("FoodItemCategorySaveXML"))
                };

        
                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.FoodItem_CategorySave");
              
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
        


        public List<RoleModel> Select2FoodCategory()
        {
            try
            {
                return db.ExecuteSQLAndReturnDataTableLive("  select id, name as text ,name from foodcategory  where deleted = 0 order by Name ").DataTableToList<RoleModel>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
            }
        }



    }
}

public class FoodItemDataTableDAL
{
    public int id { get; set; }
    public string name { get; set; }
    public string code { get; set; }
    public string categoryname { get; set; }
    public string StartDateTime { get; set; }
    public int CategoryID { get; set; }
}

public class FoodItemSave
{
    public int id { get; set; }
    public int action { get; set; }
    public string name { get; set; }
    public string code { get; set; }
    public string categoryid { get; set; }
}
public class FoodCategorySave
{
  
    public int action { get; set; }
    public string name { get; set; }
}
