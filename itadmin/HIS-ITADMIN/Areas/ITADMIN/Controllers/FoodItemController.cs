using DataLayer;
using DataLayer.ITAdmin.Model;
using HIS.Controllers;
using HIS_ITADMIN.Areas.ITADMIN.Models;
using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Security;
using System.Security.Permissions;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;


using DataLayer.ITAdmin.Data;
using SGH;

namespace HIS_ITADMIN.Areas.ITADMIN.Controllers
{
    public class FoodItemController : BaseController
    {
        //
        // GET: /ITADMIN/FoodItem/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult FoodItemDataTable()
        {
            FoodItemModel model = new FoodItemModel();
            List<FoodItemDataTableDAL> list = model.FoodItemDataTable();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<FoodItemDataTableDAL>() }),
                ContentType = "application/json"
            };
            return result;

        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult SaveFoodItem(FoodItemSave entry)
        {
            FoodItemModel model = new FoodItemModel();
            bool status = model.Save(entry);
            
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "FoodItemController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

         [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult SaveFoodCategory(FoodCategorySave entry)
        {
            FoodItemModel model = new FoodItemModel();
            bool status = model.SaveFoodCategory(entry);
           
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("SaveFoodCategory", "FoodItemController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

        

        public JsonResult Select2FoodCategory()
        {
            FoodItemModel model = new FoodItemModel();
            List<RoleModel> li = model.Select2FoodCategory();
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }


        //print 
        public FileResult ToPDF()
        {
            JavaScriptSerializer js = new JavaScriptSerializer();
            FilterFoodItemDal[] filter = js.Deserialize<FilterFoodItemDal[]>(this.GetFilter());


            string DeptID = filter[0].DeptID;
            //string FromDate = filter[0].FromDate;
            //string ToDate = filter[0].ToDate;

            FoodItemRept logic = new FoodItemRept();
            return File(logic.ToPDF(DeptID), "application/pdf");
        }


    }





    public class FoodItemRept
    {
        public FoodItemRept() { }

        public DataTable GetReportHeaderDetails(string DeptID)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[]{
                new SqlParameter("@DeptID", DeptID)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Security_GetDept");

            return dt;
        }


        public DataTable GetReportDetails(string DeptID)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[]{
                new SqlParameter("@DeptID", DeptID),
               // new SqlParameter("@FromDate", FromDate),
               // new SqlParameter("@ToDate", ToDate),
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Security_GetDeptList");

            return dt;
        }
        public DataTable GetAllRolesDetails(string DeptID)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[]{
                new SqlParameter("@DeptID", DeptID)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Security_GetRoleList");

            return dt;
        }

        public byte[] ToPDF(string DeptId)
        {
            ReportGenerator rpt = new ReportGenerator();
            rpt.Path = "Areas/ITADMIN/Reports/Security_UserAccessReviewRpt.rdl"; //
            rpt.AddReportParameter("DeptID", DeptId);
            //rpt.AddReportParameter("FromDate", FromDate);
            //rpt.AddReportParameter("ToDate", ToDate);
            rpt.AddSource("dsHeader", this.GetReportHeaderDetails(DeptId));
            rpt.AddSource("DataSet1", this.GetReportDetails(DeptId));
            return rpt.Generate(ReportGenerator.RptTo.ToPDF);
        }


        public byte[] ToPDFByAllRoles(string DeptId)
        {
            ReportGenerator rpt = new ReportGenerator();
            rpt.Path = "Areas/ITADMIN/Reports/Security_RoleAccessReviewRpt.rdl"; //
            rpt.AddReportParameter("DeptID", DeptId);
            //rpt.AddReportParameter("FromDate", FromDate);
            //rpt.AddReportParameter("ToDate", ToDate);
            rpt.AddSource("dsHeader", this.GetReportHeaderDetails(DeptId));
            rpt.AddSource("DataSet1", this.GetAllRolesDetails(DeptId));
            return rpt.Generate(ReportGenerator.RptTo.ToPDF);
        }

        public byte[] ToXLS(string DeptID)
        {
            ReportGenerator rpt = new ReportGenerator();
            rpt.Path = "Areas/ITADMIN/Reports/Security_UserAccessReviewRpt.rdl";
            rpt.AddReportParameter("DeptID", DeptID);
            //rpt.AddReportParameter("FromDate", FromDate);
            //rpt.AddReportParameter("ToDate", ToDate);
            rpt.AddSource("dsHeader", this.GetReportHeaderDetails(DeptID));
            rpt.AddSource("dsFnlAttendance", this.GetReportDetails(DeptID));
            return rpt.Generate(ReportGenerator.RptTo.ToXLS);
        }

    }
    public class FilterFoodItemDal
    {
        public string DeptID { get; set; }

    }

}
