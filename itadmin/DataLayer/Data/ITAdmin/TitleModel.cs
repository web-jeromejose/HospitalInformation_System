using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;


namespace DataLayer.ITAdmin.Model
{
    public class TitleModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();

        public bool Save(TitleSave entry)
        {

            try
            {
                List<TitleSave> TitleSave = new List<TitleSave>();
                TitleSave.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlTitleSave",TitleSave.ListToXml("TitleSave"))                                       
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.Title_Save_SCS");
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

        public List<TitleDashBoard> TitleDashBoard()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Title_DashBoard_SCS");
            List<TitleDashBoard> list = new List<TitleDashBoard>();
            if (dt.Rows.Count > 0) list = dt.ToList<TitleDashBoard>();
            return list;
        }

        public List<TitleViewModel> TitleViewModel(int Id)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@Id", Id)
           
           
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Title_View_SCS");
            List<TitleViewModel> list = new List<TitleViewModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<TitleViewModel>();
            return list;
        }

        public List<Select2Model> Select2MaritalStatusDAL(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT Id as Id,Name as text,Name as name from MaritalStatus where deleted = 0 and Name like '%" + id + "%' ").DataTableToList<Select2Model>(); 
        }

        public List<Select2Model> Select2SexDAL(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT ID as Id,Name as text,Name as name from Sex where deleted = 0 and Name like '%" + id + "%' ").DataTableToList<Select2Model>();
          
        }

    }

    public class Select2Model
    {
        public string id { get; set; }
        public string text { get; set; }
        public string name { get; set; }
    }

    public class TitleSave
    {

        public int Action { get; set; }
        public int Id { get; set; }
        public int MaritalId { get; set; }
        public int SexId { get; set; }
        public int OperatorId { get; set; }
        public string Name { get; set; }

    }

    public class TitleDashBoard
    {
        public string Name { get; set; }
        public int Id { get; set; }

    }

    public class TitleViewModel
    {
        public string Name { get; set; }
        public string Id { get; set; }
        public string MaritalId { get; set; }
        public string MaritalName { get; set; }
        public string SexId { get; set; }
        public string SexName { get; set; }
    }
}



