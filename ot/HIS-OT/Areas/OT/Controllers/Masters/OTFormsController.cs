using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using HIS_OT.Areas.OT.Controllers;
using HIS.Controllers;
using HIS_OT.Areas.OT.Models.Masters;

namespace HIS_OT.Areas.OT.Controllers.Masters
{
    public class OTFormsController : BaseController
    {
        //
        // GET: /OT/OTForms/
        // schema OTEF

        public ActionResult Index()
        {
            return View();
        }

        // zahid Code starts here
        OTFormModel otfm = new OTFormModel();
        #region all Views here
        
        public ActionResult OperativeReport()
        {
            return View();
        }
        public ActionResult UTIBundle()
        {
            return View();
        }

        #endregion

        #region All JSONs Operative Reports
        // all other JSONS
        public JsonResult GetPatientBasicDetails(string RegNo, string AdmNo)
        {
            return Json(otfm.GetPatientBasicDetails(RegNo, AdmNo), JsonRequestBehavior.AllowGet);
        }
        public JsonResult OperativeReport_Save(OperativeReport or)
        {
            or.Saved = DateTime.Now;
            or.OperatorID = this.OperatorId;
            or.ModifiedOperatorID = this.OperatorId;
            return Json(otfm.OperativeReport_Save(or),JsonRequestBehavior.AllowGet);
        }
        public JsonResult SelectAdmissionNo(string RegNo)
        {
            return Json(otfm.SelectAdmissionNo(RegNo),JsonRequestBehavior.AllowGet);
        }
        public JsonResult OperativeReport_Delete(string RegNo, string AdmNo)
        {
            return Json(otfm.OperativeReport_Delete(RegNo, AdmNo),JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetDoctors(string id)
        {
            return Json(otfm.GetDoctors(id),JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetICDCodes(string id)
        {
            return Json(otfm.GetICDCodes(id), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetProcedures(string id)
        {
            return Json(otfm.GetProcedures (id),JsonRequestBehavior.AllowGet);
        }
        public JsonResult OperativeReport_PerformedProcedures_Save(OperativeReport_PerformedProcedures orpp)
        {
            orpp.OperatorID = this.OperatorId;
            return Json(otfm.OperativeReport_PerformedProcedures_Save(orpp), JsonRequestBehavior.AllowGet);
        }
        public JsonResult OperativeReport_PlannedProcedures_Save(OperativeReport_PlannedProcedures orpp)
        {
            orpp.OperatorID = this.OperatorId;
            return Json(otfm.OperativeReport_PlannedProcedures_Save(orpp), JsonRequestBehavior.AllowGet);
        }
        public JsonResult OperativeReport_PostOPDiagnosis_Save(OperativeReport_PostOPDiagnosis orpo)
        {
            orpo.OperatorID = this.OperatorId;
            return Json(otfm.OperativeReport_PostOPDiagnosis_Save(orpo), JsonRequestBehavior.AllowGet);
        }
        public JsonResult OperativeReport_PreOPICDDiagnosis_Save(OperativeReport_PreOPICDDiagnosis orpr)
        {
            orpr.OperatorID = this.OperatorId;
            return Json(otfm.OperativeReport_PreOPICDDiagnosis_Save(orpr), JsonRequestBehavior.AllowGet);
        }

        public JsonResult OperativeReport_PerformedProcedures_Select(string RegNo, string AdmNo)
        {
            OperativeReport_PerformedProcedures o = new OperativeReport_PerformedProcedures();
            o.RegNo = int.Parse(RegNo);
            o.AdmNo = int.Parse(AdmNo);
            return Json(otfm.OperativeReport_PerformedProcedures_Select(o), JsonRequestBehavior.AllowGet);
        }
        public JsonResult OperativeReport_PlannedProcedures_Select(string RegNo, string AdmNo)
        {
            OperativeReport_PlannedProcedures o = new OperativeReport_PlannedProcedures(); 
            o.RegNo = int.Parse(RegNo);
            o.AdmNo = int.Parse(AdmNo);
            return Json(otfm.OperativeReport_PlannedProcedures_Select(o), JsonRequestBehavior.AllowGet);
        }
        public JsonResult OperativeReport_PostOPDiagnosis_Select(string RegNo, string AdmNo)
        {
            OperativeReport_PostOPDiagnosis o = new OperativeReport_PostOPDiagnosis();
            o.RegNo = int.Parse(RegNo);
            o.AdmNo = int.Parse(AdmNo);
            return Json(otfm.OperativeReport_PostOPDiagnosis_Select(o), JsonRequestBehavior.AllowGet);
        }
        public JsonResult OperativeReport_PreOPICDDiagnosis_Select(string RegNo, string AdmNo)
        {
            OperativeReport_PreOPICDDiagnosis o = new OperativeReport_PreOPICDDiagnosis();
            o.RegNo = int.Parse(RegNo);
            o.AdmNo = int.Parse(AdmNo);
            return Json(otfm.OperativeReport_PreOPICDDiagnosis_Select(o), JsonRequestBehavior.AllowGet);
        }
        public JsonResult OperativeReport_PerformedProcedures_Delete(string ID)
        {
            return Json(otfm.OperativeReport_PerformedProcedures_Delete(ID),JsonRequestBehavior.AllowGet);
        }
        public JsonResult OperativeReport_PlannedProcedures_Delete(string ID)
        {
            return Json(otfm.OperativeReport_PlannedProcedures_Delete(ID), JsonRequestBehavior.AllowGet);
        }
        public JsonResult OperativeReport_PostOPDiagnosis_Delete(string ID)
        {
            return Json(otfm.OperativeReport_PostOPDiagnosis_Delete(ID), JsonRequestBehavior.AllowGet);
        }
        public JsonResult OperativeReport_PreOPICDDiagnosis_Delete(string ID)
        {
            return Json(otfm.OperativeReport_PreOPICDDiagnosis_Delete(ID),JsonRequestBehavior.AllowGet);
        }

        #endregion 

        #region UTL Bundles 

        public JsonResult UTIBundle_GetAdmission(string RegNo)
        {
            return Json(otfm.UTIBundle_GetAdmission(RegNo), JsonRequestBehavior.AllowGet);
        }
        public JsonResult UTIBundle_GetPatientDetails(string RegNo, string AdmNo)
        {
            return Json(otfm.UTIBundle_GetPatientDetails(RegNo, AdmNo),JsonRequestBehavior.AllowGet);
        }
        public JsonResult UTIBundle_Insert(UTIBundle ub)
        {
            ub.OperatorID = this.OperatorId;
            ub.ModfiedOperator = this.OperatorId;
            return Json(otfm.UTIBundle_Insert(ub),JsonRequestBehavior.AllowGet);
        }
        public JsonResult UTIBundle_Delete(string RegNo, string AdmNo)
        {
            return Json(otfm.UTIBundle_Delete(RegNo, AdmNo), JsonRequestBehavior.AllowGet);
        }
        #endregion

        // zahid code ends here
    }
}
