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


    public class MOHCodesMappingController : BaseController
    {

        //RUSH RUSH RUSH
        // GET: /ITADMIN/MOHCodesMapping/
        MasterModel bs = new MasterModel();
        ExceptionLogging eLOG = new ExceptionLogging();
        
        public ActionResult Index()
        {
            return View();
        }



        public ActionResult MohJedRiyadMastertable(string deptid, string serviceid)
        {

            List<MohJedRiyadMastertable> list = bs.MohJedRiyadMastertable(deptid, serviceid);
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            serializer.MaxJsonLength = int.MaxValue;

            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<MohJedRiyadMastertable>() }),
                ContentType = "application/json"
            };
            return result;

        }

            [AcceptVerbs(HttpVerbs.Get)]
        public ActionResult MOHMasterDelete(string Id)
        {

            bool status = bs.MOHMasterDelete(Id,this.OperatorId);
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(Id);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("MOHMasterDelete", "MOHMasterUpdate", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(new CustomMessage { Title = "Message...", Message = bs.ErrorMessage, ErrorCode = status ? 1 : 0 }, JsonRequestBehavior.AllowGet);
        }

           [AcceptVerbs(HttpVerbs.Get)]
        public JsonResult MOHMasterAdd(string DeptID
                                ,string SGH_Code
                                ,string SGH_ExtCode
                                ,string MOH_ID
                                ,string MOH_ItemCode
                                ,string MOH_Price
                                ,string ACHI_Code
                                ,string ACHI_BLOCK
                                ,string ACHI_PROCEDURE
                                ,string LOINC_Code
                                ,string SGH_Desc
                                , string SFDA_Code)
        {

            bool status = bs.MOHMasterAdd(DeptID
                                            , SGH_Code
                                            , SGH_ExtCode
                                            , MOH_ID
                                            , MOH_ItemCode
                                            , MOH_Price
                                            , ACHI_Code
                                            , ACHI_BLOCK
                                            , ACHI_PROCEDURE
                                            , LOINC_Code, SGH_Desc
                                            , SFDA_Code,this.OperatorId);
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(SGH_Code);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("MOHMasterAdd", "MOHMasterUpdate", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(new CustomMessage { Title = "Message...", Message = bs.ErrorMessage, ErrorCode = status ? 1 : 0 }, JsonRequestBehavior.AllowGet);
        }

            [AcceptVerbs(HttpVerbs.Post)]
           public JsonResult MOHMasterSave(
                string ID
                ,string DeptID
                                ,string SGH_Code
                                ,string SGH_ExtCode
                                ,string MOH_ID
                                ,string MOH_ItemCode
                                ,string MOH_Price
                                ,string ACHI_Code
                                ,string ACHI_BLOCK
                                ,string ACHI_PROCEDURE
                                ,string LOINC_Code
                                ,string SFDA_Code
                                , string SGH_Desc
                )
        {

            bool status = bs.MOHMasterUpdate(ID,DeptID
                                            , SGH_Code
                                            , SGH_ExtCode
                                            , MOH_ID
                                            , MOH_ItemCode
                                            , MOH_Price
                                            , ACHI_Code
                                            , ACHI_BLOCK
                                            , ACHI_PROCEDURE
                                            , LOINC_Code
                                            , SFDA_Code
                                            , SGH_Desc,
                                            this.OperatorId);

            
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(DeptID);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("MOHMasterSave", "MOHMasterUpdate", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            return Json(new CustomMessage { Title = "Message...", Message = bs.ErrorMessage, ErrorCode = status ? 1 : 0 }, JsonRequestBehavior.AllowGet);
        }

        
   

 //notused
        public ActionResult Moh_AchiCodes(string deptid, string serviceid)
        {

            List<Moh_AchiCodes> list = bs.Moh_AchiCodes();
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            serializer.MaxJsonLength = int.MaxValue;

            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<Moh_AchiCodes>() }),
                ContentType = "application/json"
            };
            return result;


        }
        public ActionResult Moh_AchiCodes_Xray(string deptid, string serviceid)
        {

            List<Moh_AchiCodes_Xray> list = bs.Moh_AchiCodes_Xray();
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            serializer.MaxJsonLength = int.MaxValue;

            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<Moh_AchiCodes_Xray>() }),
                ContentType = "application/json"
            };
            return result;


        }
        public ActionResult Moh_AchiCodes_LABLoin(string deptid, string serviceid)
        {

            List<Moh_AchiCodes_LABLoin> list = bs.Moh_AchiCodes_LABLoin();
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            serializer.MaxJsonLength = int.MaxValue;

            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<Moh_AchiCodes_LABLoin>() }),
                ContentType = "application/json"
            };
            return result;


        }
        public ActionResult PharmacySFDA(string deptid, string serviceid)
        {

            List<PharmacySFDA> list = bs.PharmacySFDA();
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            serializer.MaxJsonLength = int.MaxValue;

            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<PharmacySFDA>() }),
                ContentType = "application/json"
            };
            return result;


        }
        public ActionResult Moh_AchiCode_LabTEST(string deptid, string serviceid)
        {

            List<Moh_AchiCode_LabTEST> list = bs.Moh_AchiCode_LabTEST();
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            serializer.MaxJsonLength = int.MaxValue;

            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<Moh_AchiCode_LabTEST>() }),
                ContentType = "application/json"
            };
            return result;
        }

    }
}
