using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataLayer;
using HIS.Controllers;
using DataLayer.Common;

namespace HIS_ITADMIN.Areas.ITADMIN.Controllers
{
 
    public class InvMaxController : BaseController
    {
        MasterModel bs = new MasterModel();
        ExceptionLogging eLOG = new ExceptionLogging();

        //
        // GET: /ITADMIN/InvMax/
        [IsSGHFeatureAuthorized(mFeatureID = "2705")]
        public ActionResult Index()
        {
            return View();
        }


        public JsonResult GetInvStation(string id, string idd)
        {
            List<ListModel> li = bs.GetStationWithInvmax();
            return Json(li, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetStationMMSRPTMAP(string id, string idd)
        {
            List<ListModel> li = bs.GetStationWithMMSRPTMAP();
            return Json(li, JsonRequestBehavior.AllowGet);
        }

        

        public JsonResult InvMaxSave(int stationid)
        {

            string s = bs.InvMaxSave(stationid);


            //log  
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("InvMaxSave", "InvMaxController", "0", "0", this.OperatorId, " ", this.LocalIPAddress());


            return Json(s, JsonRequestBehavior.AllowGet);
        }

        public JsonResult InvMaxSaveMMSRPTMAP(int stationid)
        {

            string s = bs.InvMaxSaveMMSRPTMAP(stationid);


            //log  
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("MMSRPTMAP", "InvMaxController", "0", "0", this.OperatorId, " ", this.LocalIPAddress());


            return Json(s, JsonRequestBehavior.AllowGet);
        }
        
    }
}
