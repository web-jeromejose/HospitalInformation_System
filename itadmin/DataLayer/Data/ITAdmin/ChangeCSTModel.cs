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

    public class ChangeCSTModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();

        public bool Save(ChangeCSTSaveModel entry)
        {

            try
            {
                List<ChangeCSTSaveModel> ChangeCSTSaveModel = new List<ChangeCSTSaveModel>();
                ChangeCSTSaveModel.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlChangeCSTSaveModel",ChangeCSTSaveModel.ListToXml("ChangeCSTSaveModel"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.ChangeCSTPrice_Save");
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
        public bool ZeroPriceSave(ZeroPriceSaveVM entry)
        {

            try
            {
                List<ZeroPriceSaveVM> ChangeCSTSaveModel = new List<ZeroPriceSaveVM>();
                ChangeCSTSaveModel.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlZeroPrice",ChangeCSTSaveModel.ListToXml("ZeroPrice"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.CST_CheckZeroPriceListSave");
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


        

        public List<ListItemModel> Select2ItemList(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT top 20 id,ItemCode as text, ItemCode as name from Item where CategoryId = 7 and ItemCode like '%" + id + "%' ").DataTableToList<ListItemModel>();
        }



        public List<ListItemView> GetListItemView(int Id)
        {
            db.param = new SqlParameter[] {
            new SqlParameter("@Id",Id)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.ChangeItemCST_View_SCS");

            List<ListItemView> list = new List<ListItemView>();
            if (dt.Rows.Count > 0) list = dt.ToList<ListItemView>();
            return list;

        }

        public List<ListItemModel> Select2InPatientList(string pin)
        {
            return db.ExecuteSQLAndReturnDataTableLive("select ipid as id ,cast(RegistrationNo as varchar)+'-'+FirstName + ' ' + MiddleName + ' '+FamilyName as name,cast(RegistrationNo as varchar) + '-'+FirstName + ' ' + MiddleName + ' '+FamilyName as text from InPatient where RegistrationNo like  '%" + pin + "%' ").DataTableToList<ListItemModel>();            
        }

        public List<GetZeroPriceListVM> GetZeroPriceList(int ipid)
        {
            db.param = new SqlParameter[] {
            new SqlParameter("@ipid",ipid)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.CST_CheckZeroPriceList");

            List<GetZeroPriceListVM> list = new List<GetZeroPriceListVM>();
            if (dt.Rows.Count > 0) list = dt.ToList<GetZeroPriceListVM>();
            return list;

        }
     
       
    }

    public class ChangeCSTSaveModel
    {
        public int Action { get; set; }
        public decimal mrp { get; set; }
        public decimal SellingPrice { get; set; }
        public int ItemId { get; set; }
    
    }


    public class ListItemModel
    {
        public string id { get; set; }
        public string name { get; set; }
        public string text { get; set; }
        
    }

    public class ListItemView
    {
        public string ItemName { get; set; }
        public decimal OldPrice { get; set; }
        public string TotalItem { get; set; }

    }

    public class GetZeroPriceListVM 
    {
        public string PTName { get; set; }
        public string Dispatcheddatetime { get; set; }
        public int OrderId { get; set; }
        public int ItemId { get; set; }
        public int BatchId { get; set; }
        public string dispatchquantity { get; set; }
        public int Ipid { get; set; }
        public decimal Price { get; set; }
        public string ItemCode { get; set; }
        public string ItemName { get; set; }
    }


    public class ZeroPriceSaveVM
    {
        public int Action { get; set; }
        public int IpId { get; set; }
        public int OperatorID { get; set; }
        
    }
    

}



