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

    public class QMSController : BaseController
    {
        //
        // GET: /ITADMIN/QMS/

        QMSModel model = new QMSModel();

        [IsSGHFeatureAuthorized(mFeatureID = "2679")]
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult showZoneOnly()
        {

            List<ShowZoneOnlyDT> list = model.showZoneOnly();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ShowZoneOnlyDT>() }),
                ContentType = "application/json"
            };
            return result;

        }
        public JsonResult showQmsService()
        {

            List<RoleModel> li = model.showQmsService();
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }

        public JsonResult showZoneList()
        {

            List<RoleModel> li = model.showZoneList();
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }

        public JsonResult showLocationList()
        {

            List<RoleModel> li = model.showLocationList();
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetDoctors()
        {
            List<ListModel> li = model.GetDoctors();
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }

        public JsonResult getteststationbylocid(string locid)
        {
            List<ListModel> li = model.getteststationbylocid(locid);
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetStation()
        {
            List<ListModel> li = model.GetStation();
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }

        public ActionResult showClinicByZoneId(string zoneid)
        {

            List<ZoneDT> list = model.showClinicByZoneId(zoneid);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ZoneDT>() }),
                ContentType = "application/json"
            };
            return result;

        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult SaveNewZone(ZoneClinicSave entry)
        {

            bool status = model.SaveNewZone(entry);
 
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("SaveNewZone", "QMSController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult SaveNewClinic(ZoneClinicSave entry)
        {

            bool status = model.SaveNewClinic(entry);
 
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("SaveNewClinic", "QMSController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult SaveNewService(QmsService entry)
        {

            bool status = model.SaveNewService(entry);
 
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("SaveNewService", "QMSController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult SaveDocLocation(QMSDocLoc entry)
        {
            entry.OperatorId = this.OperatorId;

            bool status = model.SaveDocLocation(entry);
 
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("SaveDocLocation", "QMSController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult DeleteLocationById(ZoneClinicSave entry)
        {

            bool status = model.DeleteLocationById(entry);
           
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("DeleteLocationById", "QMSController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult UpdateLocationById(ZoneClinicSave entry)
        {

            bool status = model.UpdateLocationById(entry);

         
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("UpdateLocationById", "QMSController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });

        }
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult SaveStationLocation(ZoneStationSave entry)
        {

            bool status = model.SaveStationLocation(entry);
 
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("SaveStationLocation", "QMSController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });

        }


        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult SaveTestZoneDoc(TestZoneDocDal entry)
        {
            entry.OperatorId = this.OperatorId;
            bool status = model.SaveTestZoneDoc(entry);
 
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("SaveTestZoneDoc", "QMSController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }






    }
}
