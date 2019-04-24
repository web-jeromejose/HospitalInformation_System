using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using DataLayer;
using HIS.Controllers;

namespace HIS_ITADMIN.Areas.ITADMIN.Controllers
{
    public class SecurityAdminController : BaseController
    {
        // WIPRO SEC ADMIN
        // GET: /ITADMIN/SecurityAdmin/
        SecurityAdminDAL SecAdDAL = new SecurityAdminDAL();
        ModuleAccessDAL bs = new ModuleAccessDAL();

        [IsSGHFeatureAuthorized(mFeatureID = "2375")]
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult LoadDataForDataWareHousingQlikView()
        {
           // var test = SecAdDAL.GetOraBiArRejection();
            return View();
        }

        public JsonResult RoleList(string id)
        {
            List<RoleModel> li = bs.GetRolesDal(id);
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }

        public JsonResult StationList(string id)
        {
            List<RoleModel> li = bs.GetStationDal(id);
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }
        public JsonResult ModuleList(string id)
        {
            List<RoleModel> li = bs.GetModulesDal(id);
            return Json(li , JsonRequestBehavior.AllowGet);
        }


        public JsonResult DeptList()
        {
            List<RoleModel> li = bs.GetDepartmentDal();
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }



        public JsonResult GetRolesByModuleID(string roleid, string moduleid)
        {
            List<RoleModel> li = bs.GetRolesByModuleID(roleid, moduleid);
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }


        public JsonResult DtTableFeatureList(string stationid,string moduleid,string roleid)
        {
            List<DtTableFeatureList> li = bs.DtTableFeatureList(stationid,moduleid,roleid);
            return Json(li.OrderBy(x => x.Name), JsonRequestBehavior.AllowGet);
        }

        public JsonResult CreateNewRole(string moduleid, string stationid, string roleid, string featureid)
        {
            string s = bs.CreateNewRole(moduleid,stationid,roleid,featureid);

            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(moduleid);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("CreateNewRole", "SecurityAdminController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(s, JsonRequestBehavior.AllowGet);
        }
        public JsonResult DeleteFeatinRole(string moduleid, string stationid, string roleid, string featureid)
        {
            string s = bs.DeleteFeatinRole(moduleid, stationid, roleid, featureid);

            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(moduleid);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("DeleteFeatinRole", "SecurityAdminController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(s, JsonRequestBehavior.AllowGet);
        }

        

        public JsonResult InsertNewRole(string newrolename,string desc )
        {
            string s = bs.InsertNewRole(newrolename, desc);

            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(newrolename);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("InsertNewRole", "SecurityAdminController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(s, JsonRequestBehavior.AllowGet);
        }


        public JsonResult EmployeeList(string id)
        {
            List<RoleModel> li = bs.EmployeeList(id);
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }

        public JsonResult InsertNewRoleToEmployee(string roleid,string userid)
        {
            string s = bs.InsertNewRoleToEmployee(roleid,userid);


            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(userid);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("InsertNewRoleToEmployee", "SecurityAdminController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(s, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetFeatureListbyRole(string roleid,string moduleid, string stationid)
        {
            List<GetFeatureListbyRole> li = bs.GetFeatureListbyRole(roleid, stationid, moduleid);
            return Json(li.OrderBy(x => x.featname), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAllRoleList()
        {
            List<GetAllRoleList> li = bs.GetAllRoleList();
            return Json(li , JsonRequestBehavior.AllowGet);
        }

        public JsonResult AddRoleFunctions(string roleid,string stationid,string moduleid,string featureid, string functionid)
        {
            string s = bs.AddRoleFunctions(roleid, stationid, moduleid, featureid, functionid);

            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(roleid);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("AddRoleFunctions", "SecurityAdminController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(s, JsonRequestBehavior.AllowGet);
        }
        public JsonResult RemoveRoleFunctions(string roleid, string stationid, string moduleid, string featureid, string functionid)
        {
            string s = bs.RemoveRoleFunctions(roleid, stationid, moduleid, featureid, functionid);


            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(roleid);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("RemoveRoleFunctions", "SecurityAdminController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(s, JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetModulePerStation(string stationid)
        {
            List<GetModulePerStation> li = bs.GetModulePerStation(stationid);
            return Json(li, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SaveStationtoStationperModule(string OrigstationId, string CopystationId)
        {
            string s = bs.SaveStationtoStationperModule(OrigstationId, CopystationId);
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(OrigstationId);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("SaveStationtoStationperModule", "SecurityAdminController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(s, JsonRequestBehavior.AllowGet);
        }


        //public JsonResult GetStation(string id)
        //{
        //    SecAdDAL.ID = id;
        //    List<ListModel> li = SecAdDAL.GetStationDAL();
        //    return Json(li.OrderBy(x => x.text), JsonRequestBehavior.AllowGet);
        //}

        //public JsonResult GetModule(string id)
        //{
        //    SecAdDAL.ID = id;
        //    List<ListModel> li = SecAdDAL.GetStationDAL();
        //    return Json(li.OrderBy(x => x.text), JsonRequestBehavior.AllowGet);
        //}

        //public JsonResult GetRole(string id)
        //{
        //    SecAdDAL.ID = id;
        //    List<ListModel> li = SecAdDAL.GetStationDAL();
        //    return Json(li.OrderBy(x => x.text), JsonRequestBehavior.AllowGet);
        //}


        /* User And Roles
         * Start JFJ Jan-04-2017
         */
        [IsSGHFeatureAuthorized(mFeatureID = "2391")]
        public ActionResult UserAndRoles()
        {
            return View();
        }


        public JsonResult GetUserDataTable()
        {
            List<GetUserDataTable> li = SecAdDAL.GetUserDataTable();
            return Json(li , JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetRolesByUserId(string userid)
        {
            List<GetRolesByUserId> li = SecAdDAL.GetRolesByUserId(userid);
            return Json(li, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SaveRoleDesc(string Id, string RoleName, string Desc)
        {
            string s = SecAdDAL.SaveRoleDesc(Id, RoleName, Desc);
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(RoleName);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("SaveRoleDesc", "SecurityAdminController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(s, JsonRequestBehavior.AllowGet);
        }

        /* User And Roles
        * END JFJ Jan-04-2017
        */

        public JsonResult GetModuleByRoleId(string id)
        {
            List<RoleModel> li = SecAdDAL.GetModuleByRoleId(id);
            return Json(li, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAllEmployeeList()
        {
            List<RoleModel> li = SecAdDAL.GetAllEmployeeList();
            return Json(li, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetDetailsByEmployee(int userid)
        {
            List<AssignRoleDataTAble> li = SecAdDAL.GetDetailsByEmployee(userid);
            return Json(li, JsonRequestBehavior.AllowGet);
        }

    }
}
