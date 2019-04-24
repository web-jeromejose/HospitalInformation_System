using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Globalization;
using System.Data;
using System.ComponentModel;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Web;
using System.Data.SqlClient;


namespace DataLayer
{

    public class InventoryItemMarkupModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();

        public bool Save(InvenItemMarkupHeaderModel entry)
        {

            try
            {
                List<InvenItemMarkupHeaderModel> InvenItemMarkupHeaderModel = new List<InvenItemMarkupHeaderModel>();
                InvenItemMarkupHeaderModel.Add(entry);

                //List<MarkupCompanyLevelSave> MarkupCompanyLevelSave = entry.MarkupCompanyLevelSave;
                //if (MarkupCompanyLevelSave == null) MarkupCompanyLevelSave = new List<MarkupCompanyLevelSave>();

                List<InvenItemMarkupDetailsModel> InvenItemMarkupDetailsModel = entry.InvenItemMarkupDetailsModel;
                if (InvenItemMarkupDetailsModel == null) InvenItemMarkupDetailsModel = new List<InvenItemMarkupDetailsModel>();


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlInvenItemMarkupHeaderModel",InvenItemMarkupHeaderModel.ListToXml("InvenItemMarkupHeaderModel")) ,       
                    new SqlParameter("@xmlInvenItemMarkupDetailsModel",InvenItemMarkupDetailsModel.ListToXml("InvenItemMarkupDetailsModel")),

                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.InvetoryItemMarkup_SAVE_SCS");
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


        public List<ListofItemGroup> Select2CatDal(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT top 10 ID as id,Name as text,Name as name from ItemGroup where Deleted = 0 and name like '%" + id + "%' ").DataTableToList<ListofItemGroup>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }

        public List<ListofType> Select2TypesDal(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT id,Description as text,Description as name from PoTypes where Deleted = 0 and Description like '%" + id + "%' ").DataTableToList<ListofType>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }


        public List<InvenItemMarkupViewModel> InvenItemMarkupViewModel(int CategoryId, int TypeId)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@CategoryId", CategoryId),
            new SqlParameter("@TypeId", TypeId)
        
            };

            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.InvetoryItem_MarkUp_View_SCS");
            List<InvenItemMarkupViewModel> list = new List<InvenItemMarkupViewModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<InvenItemMarkupViewModel>();
            return list;
        }


       
    }




    public class InvenItemMarkupHeaderModel
    {
        public int Action { get; set; }
        public int CategoryId { get; set; }
        public int Type { get; set; }
        public int OperatorId { get; set; }
        public List<InvenItemMarkupDetailsModel> InvenItemMarkupDetailsModel { get; set; }
    
    }

    public class InvenItemMarkupDetailsModel
    {
        public int SNo { get; set; }
        public int MinRange { get; set; }
        public int MaxRange { get; set; }
        public int Percentage { get; set; }
    

    }

    public class InvenItemMarkupViewModel
    {
        public string SNo { get; set; }
        public string MinRange { get; set; }
        public string MaxRange { get; set; }
        public string Percentage { get; set; }
    }


    public class InventoryItemDashBoard
    {
        public int SNo { get; set; }
        public int MinRange { get; set; }
        public int MaxRange { get; set; }
        public int Percentage { get; set; }
    
    
    }


    public class ListofItemGroup
    {
        public string id { get; set; }
        public string name {get; set;}
        public string text { get; set; }
    }

    public class ListofType
    {

        public string id { get; set; }
        public string name { get; set; }
        public string text { get; set; }
    }


    

}



