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

    public class CSTMarkupModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();

        public bool Save(HeaderMarkUpSave entry)
        {

            try
            {
                List<HeaderMarkUpSave> HeaderMarkUpSave = new List<HeaderMarkUpSave>();
                HeaderMarkUpSave.Add(entry);

                //List<MarkupCompanyLevelSave> MarkupCompanyLevelSave = entry.MarkupCompanyLevelSave;
                //if (MarkupCompanyLevelSave == null) MarkupCompanyLevelSave = new List<MarkupCompanyLevelSave>();

                List<DepartLvlMarkUpSave> DepartLvlMarkUpSave = entry.DepartLvlMarkUpSave;
                if (DepartLvlMarkUpSave == null) DepartLvlMarkUpSave = new List<DepartLvlMarkUpSave>();

                List<RangeMarkupSave> RangeMarkupSave = entry.RangeMarkupSave;
                if (RangeMarkupSave == null) RangeMarkupSave = new List<RangeMarkupSave>();

                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlHeaderMarkUpSave",HeaderMarkUpSave.ListToXml("HeaderMarkUpSave")) ,       
                    new SqlParameter("@xmlDepartLvlMarkUpSave",DepartLvlMarkUpSave.ListToXml("DepartLvlMarkUpSave")),
                    new SqlParameter("@xmlRangeMarkupSave",RangeMarkupSave.ListToXml("RangeMarkupSave")),
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.CompanyLevelMarkupSave_SCS");
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


        public List<ListCompanyModel> Select2CompanyDal(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where Deleted = 0 and CategoryID <> 1  and name like '%" + id + "%' ").DataTableToList<ListCompanyModel>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }



        public List<DepartLvlMarkUp> DepartlvlMarkUp()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.DeptLvlMarkup_DashBoard_SCS");
            List<DepartLvlMarkUp> list = new List<DepartLvlMarkUp>();
            if (dt.Rows.Count > 0) list = dt.ToList<DepartLvlMarkUp>();
            return list;
        }

        
        public List<RangemarkupDashboard> RangemarkupDashboard()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.RangeMarkup_DashBoard_SCS");
            List<RangemarkupDashboard> list = new List<RangemarkupDashboard>();
            if (dt.Rows.Count > 0) list = dt.ToList<RangemarkupDashboard>();
            return list;
        }
        public List<RangemarkupDashboard> OldRangemarkupDashboard()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.OLDRangeMarkup_DashBoard_SCS");
            List<RangemarkupDashboard> list = new List<RangemarkupDashboard>();
            if (dt.Rows.Count > 0) list = dt.ToList<RangemarkupDashboard>();
            return list;
        }

        public List<GetMaxRangeMarkUp> GetMaxRangeMarkUp()
        {
            DBHelper db = new DBHelper();

            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.GetMaxRangeMarkUp_SCS");

            List<GetMaxRangeMarkUp> list = new List<GetMaxRangeMarkUp>();
            if (dt.Rows.Count > 0) list = dt.ToList<GetMaxRangeMarkUp>();
            return list;

        }


       
    }

    public class HeaderMarkUpSave 
    {
        public int Action { get; set; }
        public int CategoryId { get; set; }
        public int CompanyId { get; set; }
        public int OperatorId { get; set; }
        public int MarkupPer { get; set; }
        public List<DepartLvlMarkUpSave> DepartLvlMarkUpSave { get; set; }
        public List<RangeMarkupSave> RangeMarkupSave { get; set; }
    }



    //public class MarkupCompanyLevelSave
    //{
    //    public int Action { get; set; }
    //    public int CategoryId { get; set; }
    //    public int CompanyId { get; set; }
    //    public int OperatorId { get; set; }
    //    public int MarkupPer { get; set; }

    //}

    public class DepartLvlMarkUpSave
    {
        //public int SNo { get; set; }
        //public int MinRange { get; set; }
        public decimal MaxRange { get; set; }
        public decimal Percentage { get; set; }
        public int ID { get; set; }


    }



    public class RangeMarkupSave
    {
        //public int SNo { get; set; }
        //public string Name { get; set; }
        public string MinRange { get; set; }
        public string MaxRange { get; set; }
        public string Percentage { get; set; }
        public string ID { get; set; }


    }

    public class DepartLvlMarkUp
    {
        public int SNo { get; set; }
        public string Name { get; set; }
        public string MaxRange { get; set; }
        public string Percentage { get; set; }
        public int ID { get; set; }


    }

    public class RangemarkupDashboard
    {
        public int SNo { get; set; }
        public string MinRange { get; set; }
        public string MaxRange { get; set; }
        public string Percentage { get; set; }
        public int ID { get; set; }
  


    }




    public class ListCompanyModel
    {
        public string id { get; set; }
        public string name { get; set; }
        public string text { get; set; }
        public string tariffid { get; set; }
    }

    public class ListStationModel
    {
        public string id { get; set; }
        public string name { get; set; }
        public string text { get; set; }

    }

    public class GetMaxRangeMarkUp
    {

        public decimal MaxRange { get; set; }
    
    }


    

}



