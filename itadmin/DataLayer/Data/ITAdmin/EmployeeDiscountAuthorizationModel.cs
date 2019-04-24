using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;

namespace DataLayer
{
    public class EmployeeDiscountAuthorizationModel
    {
        public string ErrorMessage { get; set; }
        
        DBHelper db = new DBHelper();

        public bool Save(EmpAuthorityHeaderSave entry)
        {

            try
            {
                List<EmpAuthorityHeaderSave> EmpAuthorityHeaderSave = new List<EmpAuthorityHeaderSave>();
                EmpAuthorityHeaderSave.Add(entry);

                List<EmpAuthorityDetailsSave> EmpAuthorityDetailsSave = entry.EmpAuthorityDetailsSave;
                if (EmpAuthorityDetailsSave == null) EmpAuthorityDetailsSave = new List<EmpAuthorityDetailsSave>();


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlEmpAuthorityHeaderSave",EmpAuthorityHeaderSave.ListToXml("EmpAuthorityHeaderSave")),
                    new SqlParameter("@xmlEmpAuthorityDetailsSave",EmpAuthorityDetailsSave.ListToXml("EmpAuthorityDetailsSave"))
    
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.EmpAuthorityDiscount_Save");
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

        public List<EmpDiscAutDashboard> EmpDiscAutDashboard()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.EmployeeDiscountAutho_DashBoard_SCS");
            List<EmpDiscAutDashboard> list = new List<EmpDiscAutDashboard>();
            if (dt.Rows.Count > 0) list = dt.ToList<EmpDiscAutDashboard>();
            return list;
        }

        public List<EmpAuthorityView> EmpAuthorityView(int DiscountId, int IPOPTypeId)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@DiscountId", DiscountId),
            new SqlParameter("@IPOPTypeId", IPOPTypeId)
     

            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.EmployeeDiscountAutho_EmpAuthority_SCS");
            List<EmpAuthorityView> list = new List<EmpAuthorityView>();
            if (dt.Rows.Count > 0) list = dt.ToList<EmpAuthorityView>();
            return list;
        }



    }
    
    public class EmpAuthorityHeaderSave
    {
        public int Action {get; set;}
        public int DiscountId {get; set;}
        public int IPOPTypeId {get; set;}
        public int OperatorId { get; set; }
        public List<EmpAuthorityDetailsSave> EmpAuthorityDetailsSave { get; set; }
    }

    public class EmpAuthorityDetailsSave
    {
        public int EmployeeId { get; set; }   
    }


    public class EmpDiscAutDashboard
    {
        public string Name { get; set; }
        public int Id { get; set; }
    
    }

    public class EmpAuthorityView
    {
        public string Name { get; set; }
        public int Id { get; set; }
    
    }
}



