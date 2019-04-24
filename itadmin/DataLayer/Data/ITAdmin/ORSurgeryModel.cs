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


    public class ORSurgeryModel
    {
        public string ErrorMessage { get; set; }

        DBHelper db = new DBHelper();

        public bool Save(SurgerySaveHeader entry)
        {

            try
            {
                List<SurgerySaveHeader> SurgerySaveHeader = new List<SurgerySaveHeader>();
                SurgerySaveHeader.Add(entry);

                List<SurgeryDetailsSave> SurgeryDetailsSave = entry.SurgeryDetailsSave;
                if (SurgeryDetailsSave == null) SurgeryDetailsSave = new List<SurgeryDetailsSave>();


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlSurgerySaveHeader",SurgerySaveHeader.ListToXml("SurgerySaveHeader")),
                    new SqlParameter("@xmlSurgeryDetailsSave", SurgeryDetailsSave.ListToXml("SurgeryDetailsSave")),
                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.SurgerySave_SCS");
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

        public List<ORSurgeryDashBoardModel> ORSurgeryDashBoardModel()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.ORSurgery_DashBoard_SCS");
            List<ORSurgeryDashBoardModel> list = new List<ORSurgeryDashBoardModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<ORSurgeryDashBoardModel>();
            return list;
        }

        public List<ORSurgerySpecialisationList> ORSurgerySpecialisationList()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.SurgeryListed_View_SCS");
            List<ORSurgerySpecialisationList> list = new List<ORSurgerySpecialisationList>();
            if (dt.Rows.Count > 0) list = dt.ToList<ORSurgerySpecialisationList>();
            return list;
        }

        public List<ORSurgerySpecialisationSelected> ORSurgerySpecialisationSelected(int Id)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@Id", Id),
 
            };

            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.SurgerySelected_View_SCS");
            List<ORSurgerySpecialisationSelected> list = new List<ORSurgerySpecialisationSelected>();
            if (dt.Rows.Count > 0) list = dt.ToList<ORSurgerySpecialisationSelected>();
            return list;
        }


        public List<SurgeryViewHeader> SurgeryViewHeader(int Id)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
            new SqlParameter("@Id", Id)

            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.SurgeryHeader_View_SCS");

            List<SurgeryViewHeader> list = new List<SurgeryViewHeader>();
            if (dt.Rows.Count > 0) list = dt.ToList<SurgeryViewHeader>();
            if (Id != -1 && dt.Rows.Count > 0)
            {
                list[0].SurgeyDetailsView = this.SurgeyDetailsView(list[0].Id);
               


            }

            return list;

        }

        private List<SurgeyDetailsView> SurgeyDetailsView(int Id)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", Id)
        
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.SurgeryDetailsView_SCS");
            List<SurgeyDetailsView> list = new List<SurgeyDetailsView>();
            if (dt.Rows.Count > 0) list = dt.ToList<SurgeyDetailsView>();
            return list;

        }

    }

    public class SurgerySaveHeader
    {
        public int Action { get; set; }
        public int SurgeryId { get; set; }
        public int DepartmentId { get; set; }
        public int SurgeryTypeId { get; set; }
        public string SurgeryName { get; set; }
        public string Code { get; set; }
        public decimal CostPrice { get; set; }
        public string Instructions { get; set; }
        public int OperatorId { get; set; }
        public List<SurgeryDetailsSave> SurgeryDetailsSave { get; set; }
    
    }

    public class SurgeryDetailsSave
    {
        public int surgerysationId { get; set; }
   
    }

    public class SurgeryViewHeader
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public int DepartmentID { get; set; }
        public string DepartmentName { get; set; }
        public int SurgeryTypeId { get; set; }
        public string SurgeryName { get; set; }
        public string package { get; set; }
        public string CostPrice { get; set; }
        public string Instructions { get; set; }
        public List<SurgeyDetailsView> SurgeyDetailsView { get; set; }
    
    
    }

    public class SurgeyDetailsView
    {
        public int Id { get; set; }
        public string Name { get; set; }
    
    }


    public class ORSurgeryDashBoardModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class ORSurgerySpecialisationList
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class ORSurgerySpecialisationSelected
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
    

}



