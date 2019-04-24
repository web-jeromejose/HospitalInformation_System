using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataLayer;
using HIS.Controllers;
using DataLayer.Common;
using System.Web.Script.Serialization;

namespace HIS_ITADMIN.Areas.ITADMIN.Controllers
{
 
    public class CPTCodesController : BaseController
    {
        //
        // GET: /ITADMIN/CPTCodes/
        CPTCodeModel model = new CPTCodeModel();

        [IsSGHFeatureAuthorized(mFeatureID = "2685")]
        public ActionResult Index()
        {
            //if (this.GetIssueAuthorityCode("SA01"))
            //{
                return View();

                /* >>> PROCEDURE EQUIPMENT
                 * 
                 * 1.OTHER PROCEDURE
                 *  
			SELECT     row_number() over(order by a.Code) as SNo, a.Code + ' - ' + Name AS NAME,Id
			FROM         otherprocedures a
			WHERE     (Deleted = 0)
			ORDER BY Name
                 * 
                 * 
                 * 2. NURSING ADMINISTRATION CHARGE / NURsing administrato procedure
                 * 	SELECT      row_number() over(order by deleted) as SNo, code + ' - ' + name AS Name,ID as Id
		FROM         BedsideProcedure
		WHERE     (deleted = 0)
		ORDER BY deleted desc
                 * 
                 * 3. Anaesthesia
                 * 	SELECT     row_number() over(order by Code) as SNo, code + ' - ' + name AS NAME,Id
		FROM         Anaesthesia
		WHERE     (deleted = 0)
		ORDER BY name

                 * 
                 * 4. HOMECARE MAPPING
                 * 
                 *  SELECT
			row_number() over(order by a.ID) as SNo 
			,a.Code + ' '  + a.Name as Test
			,a.CostPrice
			,a.ID as Id
			,REPLACE(a.Code,'FM','HC') as NewCode
			,a.Name
			,a.Code
			FROM Test a
                 * 
                 * 5. PT PROCEDURE
                 * 
                 * SELECT     row_number() over(order by a.Code) as SNo, a.Code + ' - ' + Name AS NAME,Id
			FROM         ptprocedure a
			WHERE     (Deleted = 0)
			ORDER BY Name
                 * 
                 * 
                 * 6. OR SURGERY
                 * 
                 * 
			SELECT     ID, Code + ' - ' + Name AS NAME
			FROM       Surgery
			WHERE     (Deleted = 0)
			ORDER BY Name
                 * 
                 * 
                 * 
                 * 
select top 2 B.NAME AS DeptName,A.Id,A.DepartmentId,A.Code,A.Name,A.CostPrice,A.UDATETIME as DateModified  
FROM otherprocedures A 
LEFT JOIN DBO.Department B ON A.DepartmentID = B.ID
where A.deleted = 0

select top 2 B.NAME AS DeptName,A.Id,A.DepartmentId,A.Code,A.Name,A.CostPrice,A.UDATETIME as DateModified  
FROM BedsideProcedure A 
LEFT JOIN DBO.Department B ON A.DepartmentID = B.ID
where A.deleted = 0

select top 2 B.NAME AS DeptName,A.Id,A.DepartmentId,A.Code,A.Name,A.CostPrice,A.UDATETIME as DateModified  
FROM Anaesthesia A 
LEFT JOIN DBO.Department B ON A.DepartmentID = B.ID
where A.deleted = 0

select top 2 B.NAME AS DeptName,A.Id,A.DepartmentId,A.Code,A.Name,A.CostPrice,A.UDATETIME as DateModified  
FROM Test A 
LEFT JOIN DBO.Department B ON A.DepartmentID = B.ID
where A.deleted = 0

select top 2 B.NAME AS DeptName,A.Id,A.DepartmentId,A.Code,A.Name,A.CostPrice,A.UDATETIME as DateModified  
FROM ptprocedure A 
LEFT JOIN DBO.Department B ON A.DepartmentID = B.ID
where A.deleted = 0

select top 2 B.NAME AS DeptName,A.Id,A.DepartmentId,A.Code,A.Name,A.CostPrice,A.UDATETIME as DateModified  
FROM Surgery A 
LEFT JOIN DBO.Department B ON A.DepartmentID = B.ID
where A.deleted = 0

                 * 
                 * 
                 * 
                 * 
                 * 
                 * 
                 * 
                 * 
                 * 
                 * 
                 * 
                 * 
                 * 
                 */
            //}
            //else
            //{
            //    return View("_UnAuthorized", new List<ApplicationMenuModel>());

            //}
 
        }

        public ActionResult Dashboard(CPTCodeDal viewModel)
        {
            List<CPTCodeDal> list = model.Dashboard();
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            serializer.MaxJsonLength = int.MaxValue;

            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<CPTCodeDal>() }),
                ContentType = "application/json"
            };
            return result;
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(CPTSaveDal entry)
        {
            entry.OperatorId = this.OperatorId;
                
            bool status = model.Save(entry);

            //log  
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("CPTCodeModel", "CPTCodesController", "0", "0", this.OperatorId, " ", this.LocalIPAddress());


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }


    }
}
