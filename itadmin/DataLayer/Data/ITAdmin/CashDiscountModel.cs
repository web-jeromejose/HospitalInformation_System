using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;

namespace DataLayer
{
    public class CashDiscountModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();

        public bool Save(CashDiscountHeaderSave entry)
        {

            try
            {
                List<CashDiscountHeaderSave> CashDiscountHeaderSave = new List<CashDiscountHeaderSave>();
                CashDiscountHeaderSave.Add(entry);

                List<CashDiscountDetailsSave> CashDiscountDetailsSave = entry.CashDiscountDetailsSave;
                if (CashDiscountDetailsSave == null) CashDiscountDetailsSave = new List<CashDiscountDetailsSave>();


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlCashDiscountHeaderSave",CashDiscountHeaderSave.ListToXml("CashDiscountHeaderSave")),
                    new SqlParameter("@xmlCashDiscountDetailsSave",CashDiscountDetailsSave.ListToXml("CashDiscountDetailsSave"))
    
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.CashDiscountServices_Save");
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


        public List<CashDiscountDashBoard> CashDiscountDashBoard(int DiscountType, int DiscountId, int CompanyId, int Categoryid)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@DiscountType", DiscountType),
            new SqlParameter("@DiscountId", DiscountId),
            new SqlParameter("@CompanyId",  CompanyId),
            new SqlParameter("@Categoryid", Categoryid)

            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.CashDiscountDisplayTable_SCS");
            List<CashDiscountDashBoard> list = new List<CashDiscountDashBoard>();
            if (dt.Rows.Count > 0) list = dt.ToList<CashDiscountDashBoard>();
            return list;
        }


        public List<Select2CategoryList> Select2CategoryListDAL(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT ID id,Name as text,Name as name from category where id = 1 and deleted = 0 and Name like '%" + id + "%' ").DataTableToList<Select2CategoryList>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }



    }

    public class CashDiscountHeaderSave
    {
        public int Action { get; set; }
        public int DiscountType { get; set; }
        public int CategoryId { get; set; }
        public int CompanyId { get; set; }
        public int DiscountId { get; set; } //Note Class
        public int GradeId { get; set; } //Note Discount Select2discountType
        public int OperatorId { get; set; }
        public List<CashDiscountDetailsSave> CashDiscountDetailsSave { get; set; }

    
    }

    public class CashDiscountDetailsSave
    {
        public int serviceId { get; set; }
        public decimal Percentage { get; set; }
        public decimal Amount { get; set; }

    }

    public class Select2CategoryList
    {
        public string id { get; set; }
        public string text { get; set; }
        public string name { get; set; }
    }

    public class CashDiscountDashBoard
    {
        public int Selected { get; set; }
        public string ServiceName { get; set; }
        public string Percentage { get; set; }
        public string Amount { get; set; }
        public int ServiceId {get; set;}
    }


}



