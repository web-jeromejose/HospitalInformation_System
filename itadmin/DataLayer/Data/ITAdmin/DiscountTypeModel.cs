using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;


namespace DataLayer.ITAdmin.Model
{
    public class DiscountTypeModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();

        public bool Save(DiscountTypeSave entry)
        {

            try
            {
                List<DiscountTypeSave> DiscountTypeSave = new List<DiscountTypeSave>();
                DiscountTypeSave.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlDiscountTypeSave",DiscountTypeSave.ListToXml("DiscountTypeSave"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.DiscounType_Save_SCS");
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

        public bool DumpSave(DumpDiscountTypeSave entry)
        {

            try
            {
                List<DumpDiscountTypeSave> DumpDiscountTypeSave = new List<DumpDiscountTypeSave>();
                DumpDiscountTypeSave.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlDumpDiscountTypeSave",DumpDiscountTypeSave.ListToXml("DumpDiscountTypeSave"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.DUMP_DiscounType_Save_SCS");
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

        public List<DiscountTypeDashBoard> DiscountTypeDashBoard(int DiscountType)
        {
           
            db.param = new SqlParameter[] {
            new SqlParameter("@DiscountType", DiscountType)
           
            };
            return db.ExecuteSPAndReturnDataTable("ITADMIN.DiscountTypeList_SCS").DataTableToList<DiscountTypeDashBoard>();
            //List<DiscountTypeDashBoard> list = new List<DiscountTypeDashBoard>();
            //if (dt.Rows.Count > 0) list = dt.ToList<DiscountTypeDashBoard>();
           // return dt;
        }

        public List<Select2CompanyList> Select2CompanyDAL(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT ID id,Code + ' - ' + Name as text,Name as name from Company where CategoryId = 1 and Active = 0 and deleted = 0 and Name like '%" + id + "%' ").DataTableToList<Select2CompanyList>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }

      
    }



}


public class DumpDiscountTypeSave
{
    public int Action { get; set; }
    public int OperatorId { get; set; }
    public int DiscountType { get; set; }
    public int Id { get; set; }
    public int DumpDiscountId { get; set; }
}


public class DiscountTypeSave
{
    public int Action { get; set; }
    public string Name { get; set; }
    public bool AuthCanEdit { get; set; }
    public bool RequireNoAuth { get; set; }
    public int OperatorId { get; set; }
    public int CompanyId { get; set; }
    public int DiscountType { get; set; }
    public int Id { get; set; }
    public int DumpDiscountId { get; set; }
}




public class DiscountTypeDashBoard
{
    public int SNo { get; set; }
    public string Name { get; set; }
    public string CreatedOn { get; set; }
    public string Id { get; set; }
    public bool AuthCanEdit { get; set; }
    public bool RequireNoAuth { get; set; }
    public long CompanyId { get; set; }
    public string CompanyName { get; set; }

}

public class Select2CompanyList
{

    public string id { get; set; }
    public string text { get; set; }
    public string name { get; set; }

}


