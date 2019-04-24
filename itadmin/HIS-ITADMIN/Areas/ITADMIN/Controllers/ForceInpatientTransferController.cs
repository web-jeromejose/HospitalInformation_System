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
    public class ForceInpatientTransferController : BaseController
    {
        //
        // GET: /ITADMIN/ForceInpatientTransfer/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult FetchForceInPatientTransfer(int id)
        {
            ForceInPatientTransferModel model = new ForceInPatientTransferModel();
            List<ForceInPatientView> list = model.ForceInPatientView(id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ForceInPatientView>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public JsonResult GetRegNo(string id)
        {
            ForceInPatientTransferModel model = new ForceInPatientTransferModel();

            List<Select2EmployeeAccess> list = model.GetRegno(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetBedList(string id)
        {
            ForceInPatientTransferModel model = new ForceInPatientTransferModel();

            List<Select2EmployeeAccess> list = model.GetBedlist(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public ActionResult Save(SaveInfoForceInPatientTransfer PostData)
        {
            SghUtilitiesDB DB = new SghUtilitiesDB();

            bool status = DB.SaveForceInpatientTransfer(PostData.IPID,PostData.BedId);
 

            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(PostData);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "ForceInpatientTransferController", "0", "0", this.OperatorId, log_details);




            return Json(new CustomMessage { Title = "Message...", Message = "Force transfer successful.", ErrorCode = status ? 1 : 0 });

        }

       


     



      


    }
}
