using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;

namespace DataLayer
{
    public class CashDiscountDeptWiseModel
    {
        public string ErrorMessage { get; set; }

        DBHelper db = new DBHelper();

        public List<CashDepartmentDashBoard> CashDepartmentDashBoard(int DiscountType,int ServiceId)
        {
            db.param = new SqlParameter[] {
            new SqlParameter("@DiscountType", DiscountType),
            new SqlParameter("@ServiceId", ServiceId)

            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.CashDiscountDepartment_DashBoardDept_SCS");
            List<CashDepartmentDashBoard> list = new List<CashDepartmentDashBoard>();
            if (dt.Rows.Count > 0) list = dt.ToList<CashDepartmentDashBoard>();
            return list;
        }

        public List<CashDiscountDeptWiseItem> CashDiscountDeptWiseItem(int DiscountType, int CompanyId, int CategoryId, int DiscountId, int ServiceId, int DepartmentId)
        {
            db.param = new SqlParameter[] {
            new SqlParameter("DiscountType", DiscountType),
            new SqlParameter("CompanyId",CompanyId),
            new SqlParameter("CategoryId",CategoryId),
            new SqlParameter("DiscountId",DiscountId),
            new SqlParameter("ServiceId",ServiceId),
            new SqlParameter("DepartmentId",DepartmentId)

            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.CashDiscountDeptWiseItem_DashBoard_SCS");
            List<CashDiscountDeptWiseItem> list = new List<CashDiscountDeptWiseItem>();
            if (dt.Rows.Count > 0) list = dt.ToList<CashDiscountDeptWiseItem>();
            return list;
        }

    }

    public class CashDepartmentDashBoard
    {
        public int Selected { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Percentage{ get; set;}
        public string Amount { get; set; }
        public int Id { get; set; }
       
    }

    public class CashDiscountDeptWiseItem
    {
        public int Selected { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Percentage { get; set; }
        public string Amount { get; set; }
        public int DepartmentId { get; set; }

    
    }


}



