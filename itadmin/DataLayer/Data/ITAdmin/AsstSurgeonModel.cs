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


namespace DataLayer.ITAdmin.Model
{
    public class AsstSurgeonModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();



        public List<AsstSurgeonDashBoard> AsstSurgeonDashBoard()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.AsstSurgeon_DashBoard_SCS");
            List<AsstSurgeonDashBoard> list = new List<AsstSurgeonDashBoard>();
            if (dt.Rows.Count > 0) list = dt.ToList<AsstSurgeonDashBoard>();
            return list;
        }

        public List<TariffListModel> TariffListModelDal(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT top 10 Id as id,Name as text,Name as name from TARIFF where Deleted = 0 and Name like '%" + id + "%' ").DataTableToList<TariffListModel>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }

        public List<OTNOListModel> OTNOListModelDal(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT top 10 Id as id,Name as text,Name as name from dbo.OTNO where Deleted = 0 and Name like '%" + id + "%' ").DataTableToList<OTNOListModel>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }

        public bool Save(AsstSurgeonSaveModel entry)
        {

            try
            {
                List<AsstSurgeonSaveModel> AsstSurgeonSaveModel = new List<AsstSurgeonSaveModel>();
                AsstSurgeonSaveModel.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlAsstSurgeonSaveModel",AsstSurgeonSaveModel.ListToXml("AsstSurgeonSaveModel"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.AsstSurgeon_Save_SCS");
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

        public List<AssistSurgeonViewModel> AssistSurgeonViewModel(int CategoryId, int ORNoId, int SlNo)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@CategoryId", CategoryId),
            new SqlParameter("@ORNoId", ORNoId),
            new SqlParameter("@SlNo", SlNo)

           
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.AsstSurgeon_View_SCS");
            List<AssistSurgeonViewModel> list = new List<AssistSurgeonViewModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<AssistSurgeonViewModel>();
            return list;
        }
       
    }

    public class AsstSurgeonSaveModel
    {
        public int Action { get; set; }
        public int CategoryId { get; set; }
        public decimal Percentage { get; set; }
        public int OTIDNo { get; set; }
        public int SlnoId { get; set; }
        public int OperatorId { get; set; }
    
    
    }

    public class AssistSurgeonViewModel
    {
        public string category { get; set; }
        public string OtNo { get; set; }
        public string Percentage { get; set; }
        public string SLNoValue { get; set; }
        public string categoryId { get; set; }
        public string OtId {get; set;}
        public string SlNo { get; set; }
    
    }



    public class TariffListModel
    {
        public string id { get; set; }
        public string text { get; set; }
        public string name { get; set; }
    }


    public class OTNOListModel
    {
        public string id { get; set; }
        public string text { get; set; }
        public string name { get; set; }
    }


    public class AsstSurgeonDashBoard
    {
        public string category { get; set; } //note TriffName
        public string OtNo { get; set;  } //ORNo
        public string Percentage { get; set; }
        public string SLNoValue { get; set; }
        public int categoryId { get; set; }
        public int OtId { get; set; }
        public int SlNo { get; set; }

    }
  




}

