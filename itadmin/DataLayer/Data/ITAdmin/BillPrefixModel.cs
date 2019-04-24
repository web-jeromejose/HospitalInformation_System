using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;


namespace DataLayer.ITAdmin.Model
{
    public class BillPrefixModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();

        public bool Save(BillPrefixSave entry)
        {

            try
            {
                List<BillPrefixSave> BillPrefixSave = new List<BillPrefixSave>();
                BillPrefixSave.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlBillPrefixSave",BillPrefixSave.ListToXml("BillPrefixSave"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.BillPrefix_Save_SCS");
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

        public List<BillPrefixDashBoard> BillPrefixDashBoard()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.BillPrefix_DashBoard_SCS");
            List<BillPrefixDashBoard> list = new List<BillPrefixDashBoard>();
            if (dt.Rows.Count > 0) list = dt.ToList<BillPrefixDashBoard>();
            return list;
        }

        public List<BillPrefixView> BillPrefixView(int StationId,string Name, string BillType)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@StationId", StationId),
            new SqlParameter("@Name", Name),
            new SqlParameter("@BillType", BillType)
           
           
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.BillPrefix_View_SCS");
            List<BillPrefixView> list = new List<BillPrefixView>();
            if (dt.Rows.Count > 0) list = dt.ToList<BillPrefixView>();
            return list;
        }

        public List<ListStation> Select2Stations(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT ID id,Name as text,Name as name from dbo.STATION where Deleted = 0 and Name like '%" + id + "%' ").DataTableToList<ListStation>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }
    }

    public class BillPrefixSave
    {
        public int Action { get; set; }
        public int StationId { get; set; }
        public string Prefix { get; set; }
        public string BillTypeName { get; set; }
        public int BillTypeId { get; set; }
        public int OperatorId { get; set; }
    
    }


    public class BillPrefixView
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string StationName { get; set; }
        public int StationId { get; set; }
        public int BillTypeId { get; set; }
    
    }

    public class BillPrefixDashBoard
    {
        public int SNo {get; set;}
        public string Station { get; set; }
        public string Type { get; set; }
        public string BillPrefix { get; set; }
        public int StationId { get; set; }
    }

    public class ListStation
    {
        public string id { get; set; }
        public string name { get; set; }
        public string text { get; set; }
    }


}



