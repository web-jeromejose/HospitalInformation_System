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



namespace HIS_ITADMIN.Areas.ITADMIN.Controllers
{
    public class MachineSetupController : BaseController
    {
        //
        // GET: /ITADMIN/MachineSetup/
        MachineSetupDAL bs = new MachineSetupDAL();
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult GetMachineList()
        {
            List<MachineSetupModel> li = bs.GetMachineListDAL();
            return Json(li.OrderBy(x => x.Name), JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetMachineSv(MachineSetupModel s)
        {
            Response li = bs.GetMachineSaveDAL(s);
            return Json(li, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetDept()
        {
            List<ListModel> li = bs.GetDeptDAL();
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetLocation()
        {
            List<ListModel> li = bs.GetLocationDAL();
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetModalities()
        {
            List<ListModel> li = bs.GetModalitiesDAL();
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetAssetItems()
        {
            List<ListModel> li = bs.GetAssetItemsDAL();
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetProcModal()
        {
            List<ListModel> li = bs.GetProcModalDAL();
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDoctors()
        {
            List<ListModel> li = bs.GetDoctors();
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetMachineDoctors(int machineId)
        {
            List<ListModel> li = bs.GetMachineDoctors(machineId);
            return Json(li.OrderBy(x => x.id), JsonRequestBehavior.AllowGet);
        }

    }
}
