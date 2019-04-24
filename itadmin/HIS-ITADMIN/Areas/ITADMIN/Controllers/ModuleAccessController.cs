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
    public class ModuleAccessController : BaseController
    {
        //
        // GET: /ITADMIN/ModuleAccess/
        ModuleAccessDAL bs = new ModuleAccessDAL();
        ExceptionLogging eLOG = new ExceptionLogging();

        [IsSGHFeatureAuthorized(mFeatureID = "516")]
        public ActionResult Index()
        {
            FeatureID = "516";
            return View();
        }
        public JsonResult EmployeeList(string id)
        {
            bs.ID = id;
            List<ListModel> li = bs.GetEmplist();
            return Json(li, JsonRequestBehavior.AllowGet);
        }
        public JsonResult ModuleList()
        {
            List<ModuleModel> li = bs.GetModulesDAL();
            return Json(li.OrderBy(x => x.ModuleName), JsonRequestBehavior.AllowGet);
        }
        public JsonResult UpdateModule(string id, string name, string slink, string src, string incvname, string vname, string del)
        {
            string li = bs.UpdateModuleDAL(id, name, slink, src, incvname, vname, del);
            //log  
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("UpdateModule", "ModuleAccessController", "0", "0", this.OperatorId, " ", this.LocalIPAddress());



            return Json(li, JsonRequestBehavior.AllowGet);
        }
        public JsonResult ModuleAccessList(string id)
        {
            bs.ID = id;
            List<ListModel> li = bs.GetModuleAccessDAL();
            return Json(li, JsonRequestBehavior.AllowGet);
        }
        public JsonResult ModuleAccessListFeat(string id, string mod)
        {
            bs.ID = id;
            List<ModuleAccessModel> li = bs.GetModuleAccessFeatureDAL(mod);
            return Json(li, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetMenu(string id)
        {
            bs.ID = id;
            List<MenuAccessModel> li = bs.GetMenuDAL();
            return Json(li.OrderBy(x => x.Name).OrderBy(x => x.ParentID), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetMenuSearch(string id)
        {
            bs.ID = id;
            List<ListModel> li = bs.GetMenuSearchDAL();
            return Json(li.OrderBy(x => x.text), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetModuleUser(string id)
        {
            bs.ID = id;
            List<ModuleUserModel> li = bs.GetModuleUserAccessDAL();
            return Json(li.OrderBy(x => x.EmpName), JsonRequestBehavior.AllowGet);
        }
        ///UpdateMenu?id=2270&name=testjerome&parent=0&menu=&del=True&seq=0&bar=False&newwindow=False&_=1481797207848
        public JsonResult UpdateMenu(string id, string parent, string menu, string seq, string name, string bar, string newwindow, string del, string moduleid)
        {
            bs.UpdateMenuDAL(id, parent, menu, seq, name, bar, newwindow, del, moduleid);
            //log  
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("UpdateMenu", "ModuleAccessController", "0", "0", this.OperatorId, " ", this.LocalIPAddress());

            return Json("", JsonRequestBehavior.AllowGet);
        }

        public JsonResult AddModMenu(string mod, string feat)
        {
            bs.AddModuleFeature(mod, feat);


            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(mod);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("NewModMenu", "ModuleAccess", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json("", JsonRequestBehavior.AllowGet);
        }
        public JsonResult NewModMenu(string mod, string feat,string MenuUrl,string ParentId)
        {
            bs.NewModMenuDAL(mod, feat, MenuUrl, ParentId);


            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(mod);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("NewModMenu", "ModuleAccess", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json("", JsonRequestBehavior.AllowGet);
        }
        public JsonResult RemModMenu(string mod, string feat)
        {
            bs.DeleteModMenuDAL(mod, feat);
            //log  
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("RemModMenu-DeleteFeature", "ModuleAccessController", "", "", this.OperatorId, " ", this.LocalIPAddress());

            return Json("", JsonRequestBehavior.AllowGet);
        }
        public JsonResult UpdateUserModule(string id, string mod)
        {
            string s = bs.UpdateUserModuleDAL(id, mod);
            //log  
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("UpdateUserModule", "ModuleAccessController", "0", "0", this.OperatorId, " ",this.LocalIPAddress());
            return Json(s, JsonRequestBehavior.AllowGet);
        }

        public JsonResult UpdateUserFeature(string id, string acc, string feat, string mod, string usr)
        {
            string s = bs.UpdateUserFeatureDAL(id, acc, feat, mod, usr);
            //log  
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("UpdateUserFeature", "ModuleAccessController", "0", "0", this.OperatorId, " ", this.LocalIPAddress());
            return Json(s, JsonRequestBehavior.AllowGet);
        }
        public JsonResult DeleteUserMod(string id, string mod)
        {
            string s = bs.DeleteUserModuleDAL(id, mod);
            //log  
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("DeleteUserMod", "ModuleAccessController", "0", "0", this.OperatorId, " ", this.LocalIPAddress());

            return Json(s, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetFunctions()
        {
            List<ListModel> li = bs.GetAllFeatureFunctionDAL();
            return Json(li.OrderBy(x => x.text), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetFunctionsFeat(string id)
        {
            bs.ID = id;
            List<ListModel> li = bs.GetFeatureFunctionDAL();
            return Json(li.OrderBy(x => x.text), JsonRequestBehavior.AllowGet);
        }
        public JsonResult AddNewFeatureFunction(string id)
        {
            string li = bs.AddNewFeatureFunctionDAL(id);
            //log  
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("AddNewFeatureFunction", "ModuleAccessController", "0", "0", this.OperatorId, " ", this.LocalIPAddress());

            return Json(li, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetFunctionsAddFeat(string id, string feat, string del)
        {
            bs.ID = id;
            string li = bs.AddFeatureFunction(del, feat);
            return Json(li, JsonRequestBehavior.AllowGet);
        }
        public JsonResult UpdateUserFunction(string id, string usr, string mod, string feat, string func, string del)
        {
            bs.ID = id;
            string li = bs.UpdateUserFunctionDAL(id, usr, mod, feat, func, del);
            //log  
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("UpdateUserFunction", "ModuleAccessController", "0", "0", this.OperatorId, " ", this.LocalIPAddress());

            return Json(li, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetUserFunctionsFeat(string id, string feat)
        {
            List<FunctionUserModel> li = bs.GetUserFeatureFunctionDAL(id, feat);
            return Json(li.OrderBy(x => x.text), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetParent()
        {
            List<ListModel> li = bs.GetParentDAL();
            return Json(li.OrderBy(x => x.text), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetStation()
        {
            List<ListModel> li = bs.GetStationDAL();
            return Json(li.OrderBy(x => x.text), JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetALLStation()
        {
            List<ListModel> li = bs.GetALLStationDAL();
            return Json(li.OrderBy(x => x.text), JsonRequestBehavior.AllowGet);
        }
        
        public JsonResult GetModuleStation(string id, string idd)
        {
            List<ListModel> li = bs.GetModuleStationDAL(id, idd);
            return Json(li, JsonRequestBehavior.AllowGet);
        }
        public JsonResult InsertModuleStation(string id, string idd, string iddd, string del)
        {
            string s = bs.InsertModuleStationDAL(id, idd, iddd, del);

            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(id);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("InsertModuleStationDAL", "ModuleAccess", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(s, JsonRequestBehavior.AllowGet);
        }
        public JsonResult InserttoDataInfoModulePermission( string idd, string iddd, string del)
        {
            string s = bs.InserttoDataInfoModulePermission(idd, iddd, del);


            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(idd);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("InserttoDataInfoModulePermission", "ModuleAccess", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(s, JsonRequestBehavior.AllowGet);
        }
        ///*Synchronize*/

        public JsonResult SynchModules()
        {
            //bs.SynchModulesDAL();
            return Json("Modules Synchronized!", JsonRequestBehavior.AllowGet);
        }
        public JsonResult SynchFeatures()
        {
            //bs.SynchFeaturesDAL();
            return Json("Features Synchronized!", JsonRequestBehavior.AllowGet);
        }
        public JsonResult SynchModFeatures(string id, string cons)
        {
            bs.SynchFeaturesDAL(id, cons);
            //bs.SynchModFeaturesDAL(id);
            //bs.SynchParentFuncDAL();
            //bs.SynchFeatFuncDAL(id);
            //bs.SynchFuncDAL();
            return Json("Module Features Synchronized!", JsonRequestBehavior.AllowGet);
        }

        public JsonResult SynchPerModFeatures(string id, string cons)
        {

            try
            {

                eLOG.LogDetail("ModuleSync Module ID -->" + id);
                eLOG.LogDetail("----STEP1");
                bs.SyncModuleID(id, cons);
                eLOG.LogDetail("----STEP2");
                bs.SynchFeaturesDAL(id, cons);
                eLOG.LogDetail("----STEP3");
                bs.SynchModFeaturesDAL(id, cons);
                eLOG.LogDetail("----STEP4");
                bs.SynchFeatFuncDAL(id, cons);
                eLOG.LogDetail("----STEP5");
                bs.SynchParentMenu(id, cons);
                eLOG.LogDetail("----STEP6 - DONE");
                eLOG.LogDetail("ModuleSync Connection -->" + cons);


                //log  
                var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
                string log_details = log_serializer.Serialize(id);
                MasterModel log = new MasterModel();
                bool logs = log.loginsert("SynchPerModFeatures", "ModuleAccess", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            }
            catch (Exception ex)
            {
                eLOG.LogError(ex);
            }


            return Json("Module Features Synchronized SynchPerModFeatures!", JsonRequestBehavior.AllowGet);
        }

        public JsonResult CreateModuleId()
        {
            try
            {
                bs.CreateModuleId();
            }
            catch (Exception ex)
            {
                eLOG.LogError(ex);
            }

            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize("CreateModuleId");
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("CreateModuleId", "ModuleAccess", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json("ModuleID Created!", JsonRequestBehavior.AllowGet);
        }



        public JsonResult AddNewParent(string id)
        {
            string li = bs.AddNewParent(id);

            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(id);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("AddNewParent", "ModuleAccess", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(li, JsonRequestBehavior.AllowGet);
        }
        public JsonResult AddNewFunction(string id)
        {
            string li = bs.AddNewFunction(id);


            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(id);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("AddNewFunction", "ModuleAccess", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            return Json(li, JsonRequestBehavior.AllowGet);
        }

        //public JsonResult SynchModules()
        //{
        //    bs.SynchModulesDAL();   //CAIRO
        //    bs.SynchModulesTestDAL(); //TEST .90
        //    return Json("Modules Synchronized!", JsonRequestBehavior.AllowGet);
        //}
        //public JsonResult SynchFeatures()
        //{
        //    bs.SynchFeaturesDAL();
        //    bs.SynchFeaturesTestDAL();
        //    return Json("Features Synchronized!", JsonRequestBehavior.AllowGet);
        //}
        //public JsonResult SynchModFeatures()
        //{
        //    bs.SynchModFeaturesDAL();
        //    bs.SynchModFeaturesTestDAL();
        //    return Json("Module Features Synchronized!", JsonRequestBehavior.AllowGet);
        //}
        //public JsonResult SynchFunctions()
        //{
        //    bs.SynchFunctionDAL();
        //    return Json("Module Features Synchronized!", JsonRequestBehavior.AllowGet);
        //}

        //Show Parent Menu List
        public JsonResult GetParentList()
        {

            List<ListModel> li = bs.GetParentList();
            return Json(li, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetFunctionList()
        {

            List<ListModel> li = bs.GetFunctionList();
            return Json(li, JsonRequestBehavior.AllowGet);
        }

        #region Copy Employee to Another
        public JsonResult SaveCopyEmployeeAccess(string FromUserId, string ToUserId, string ModuleId, int DeleteOld)
        {

            string s = bs.SaveCopyEmployeeAccess(FromUserId, ToUserId, ModuleId, DeleteOld);
            //log  
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("SaveCopyEmployeeAccess", "ModuleAccessController", "0", "0", this.OperatorId, " ", this.LocalIPAddress());

            return Json(s, JsonRequestBehavior.AllowGet);
        }

      

        #endregion

        #region Sync Page
        public ActionResult SyncModulePage()
        {         
            return View();
        }
        #endregion


    }
}
