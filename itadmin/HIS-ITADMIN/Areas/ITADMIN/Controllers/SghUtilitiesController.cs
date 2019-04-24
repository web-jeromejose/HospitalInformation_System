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
 
    public class SghUtilitiesController : BaseController
    {
        //
        // GET: /ITADMIN/SghUtilities/

 
        SghUtilitiesDB DB = new SghUtilitiesDB();


        /* Start
         * Update Doctors Code 
         * JFJ Nov 9 2016
         */
        [IsSGHFeatureAuthorized(mFeatureID = "2324")]
        public ActionResult UpdateDoctorsCode()
        {
            UpdateDoctorsCode model = new UpdateDoctorsCode();
            model.EmployeeList = DB.GetAllEmployeeDoctors();
            model.CategoryList = DB.GetCategories();

            return View(model);
        }


        public JsonResult GetDocEmployeeId(string id)
        {
            List<EmployeeDetailsList> list = DB.DocEmployeeDetails(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }


       [HttpPost]
        public ActionResult UpdateDoctorsCodeSave(UpdateDoctorsCodeSave entry)
        {
            bool status = DB.UpdateDoctorsCodeSave(entry);
          
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("UpdateDoctorsCodeSave", "SghUtilitiesController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            return Json(new CustomMessage { Title = "Message...", Message = DB.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }


       /* END
        * Update Doctors Code 
        * JFJ Nov 9 2016
        */



       /* START
        * Download Company Price List
        * JFJ Nov 15 2016
        */

        [IsSGHFeatureAuthorized(mFeatureID = "2325",mFunctionID = "0")]
       public ActionResult DownloadCompanyPrice()
       {
           DownloadCompanyPrice model = new DownloadCompanyPrice();
           model.TariffList = DB.GetTariffList();
           return View(model);
       }

       public ActionResult LoadOPIPPriceList(string IPorOp, int TariffID)
       {

           if (IPorOp.ToString() == "IP")
           {
               List<DownloadCompIPPriceDetails> list = DB.Load_IPPriceList(TariffID);
               var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
               var result = new ContentResult
               {
                   Content = serializer.Serialize( list ),
                   ContentType = "application/json"
               };
               return result;
           }
           else // OP
           {

               List<DownloadCompIPPriceDetails> list = DB.Load_OPPriceList(TariffID);
               var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
               var result = new ContentResult
               {
                   Content = serializer.Serialize(list),
                   ContentType = "application/json"
               };
               return result;

           

           }
 
          
       }
      

        /* END
       * Download Company Price List
       * JFJ Nov 15 2016
       */


      



       /* START
        *HIS-Utilities - Force Cancel Admission
        * JFJ Nov 26 2016
        */

       public ActionResult ForceCancelAdmission()
       {
           InPatientVM model = new InPatientVM();
           model.InPatientList = DB.GetAllInPatient();
           return View(model);
       }

       [HttpPost]
       public ActionResult CheckAdmissionPatient(CancelAdmissionSaveDetails entry)
       {
           bool status = DB.CheckAdmission(entry);
           return Json(new CustomMessage { Title = "Message...", Message = DB.ErrorMessage, ErrorCode = status ? 1 : 0 });


       }

        [HttpPost]
       public ActionResult SaveCancelAdmission(CancelAdmissionSaveDetails entry)
        {
            bool status = DB.SaveCancelAdmission(entry);
            return Json(new CustomMessage { Title = "Message...", Message = DB.ErrorMessage, ErrorCode = status ? 1 : 0 });

        }


        /* END
         *HIS-Utilities - Force Cancel Admission
         * JFJ Nov 26 2016
         */


        /* START
       *HIS-Utilities - AR DATA EOD
       * JFJ Dec 15 2016
        *  /ITADMIN/SghUtilities/ARDataEod
       */

        [IsSGHFeatureAuthorized(mFeatureID = "525")]
        public ActionResult ARDataEod()
        {
                    return View();
        }

        
        [HttpPost]
        public ActionResult ARDataEodProcess(ArDateEodDetails entry)
        {
            bool status = DB.SaveArDataEOD(entry);
            return Json(new CustomMessage { Title = "Message...", Message = DB.ErrorMessage, ErrorCode = status ? 1 : 0 });

        }


        /* END
         *HIS-Utilities  - AR DATA EOD
         *JFJ Dec 15 2016
         */





    }
}
