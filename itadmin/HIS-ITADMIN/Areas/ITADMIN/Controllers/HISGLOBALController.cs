using DataLayer;
using DataLayer.Common;
using HIS.Controllers;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace HIS_ITADMIN.Areas.ITADMIN.Controllers
{
    public class HISGLOBALController : BaseController
    {
        //
        // GET: /ITADMIN/HISGLOBAL/ModuleModifier
        private ModuleAccessDAL bs = new ModuleAccessDAL();
        private ExceptionLogging eLOG = new ExceptionLogging();


        public ActionResult ModuleModifier()
        {
            return View();
        }

        public ActionResult ModuleList()
        {
            List<AllModuleList> list = bs.AllModuleList();

            JavaScriptSerializer serializer = new JavaScriptSerializer();
            serializer.MaxJsonLength = int.MaxValue;

            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<AllModuleList>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult getFeatures(string moduleid)
        {
            List<FeatureList> list = bs.getFeaturesbyModId(moduleid);

            JavaScriptSerializer serializer = new JavaScriptSerializer();
            serializer.MaxJsonLength = int.MaxValue;

            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<FeatureList>() }),
                ContentType = "application/json"
            };
            return result;

        }


        public ActionResult getFunctionbyFeature(string Featureid)
        {
            List<ListModel> list = bs.getFunctionbyFeature(Featureid);

            JavaScriptSerializer serializer = new JavaScriptSerializer();
            serializer.MaxJsonLength = int.MaxValue;

            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<ListModel>() }),
                ContentType = "application/json"
            };
            return result;

        }
        public JsonResult GetFunctionList()
        {

            List<ListModel> li = bs.GetFunctionList();
            return Json(li, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Upload_HISMODULES()
        {
            var file = Request.Files[0];
            var ModuleId = Request.Form["ModuleId_UploadFile"];

            if (Request.Files.Count > 0)
            {


                string folderPath = Server.MapPath("../../HISLOGIN_IMAGES/");

                //Check whether Directory (Folder) exists.
                if (!Directory.Exists(folderPath))
                {
                    //If Directory (Folder) does not exists Create it.
                    Directory.CreateDirectory(folderPath);
                }

                //Save the File to the Directory (Folder).
                file.SaveAs(folderPath + Path.GetFileName("module_" + ModuleId + ".png"));


                //if (file != null && file.ContentLength > 0)
                //{
                //    var fileName = Path.GetFileName(file.FileName);
                //    var path = Path.Combine(Server.MapPath("~/Images/"), fileName);
                //    file.SaveAs(path);
                //}
            }


            return RedirectToAction("ModuleModifier", "HISGLOBAL", new { area = "ITADMIN" });
        }

        [HttpPost]
        public ActionResult SaveNewModule()
        {
            ViewBag.Title = "test ";
            if (Request.IsAjaxRequest())
            {
                string HIS_ModuleName_NEW = Request.Form["HIS_ModuleName_NEW"];
               
                string HIS_URLLINK_NEW = Request.Form["HIS_URLLINK_NEW"];

                string resultnew = bs.CreateNewModule(HIS_ModuleName_NEW, HIS_URLLINK_NEW);
              
            }
            return RedirectToAction("ModuleModifier", "HISGLOBAL", new { area = "ITADMIN" });
        }
        public JsonResult getParent()
        {
            List<ListModel> li = bs.GetParentList();
            return Json(li.OrderBy(x => x.text), JsonRequestBehavior.AllowGet);
        }

        /**SAVE**/
        [HttpPost]
        public ActionResult HISModulesUpdate(HisModDal param)
        {
            string li = bs.HISModulesUpdate(param);
            //log  
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("HISModulesUpdate", "ModuleAccessController", "0", "0", this.OperatorId, " ", this.LocalIPAddress());

            return Json(new CustomMessage { Title = "Message...", Message = "MODULE has been updated..", ErrorCode = logs ? 1 : 0 });
        }

        [HttpPost]
        public ActionResult SaveNewFeatures(string name, string menuUrl, string ParentID, string mod)
        {
            string li = bs.SaveNewFeatures( name,  menuUrl,  ParentID,  mod);
            //log  
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("SaveNewFeatures", "ModuleAccessController", "0", "0", this.OperatorId, " ", this.LocalIPAddress());

            return Json(new CustomMessage { Title = "Message...", Message = "MODULE has been updated..", ErrorCode = logs ? 1 : 0 });
        }

        [HttpPost]
        public ActionResult UpdateFeatures(updateFeatDal param)
        {
            string li = bs.UpdateFeatures(param);
            //log  
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("UpdateFeatures", "ModuleAccessController", "0", "0", this.OperatorId, " ", this.LocalIPAddress());

            return Json(new CustomMessage { Title = "Message...", Message = "Features has been updated..", ErrorCode = logs ? 1 : 0 });
        }

        [HttpPost]
        public ActionResult DeleteFeatures(string featid,string moduleid)
        {
            string li = bs.DeleteFeatures(featid, moduleid);
            //log  
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("DeleteFeatures", "ModuleAccessController", "0", "0", this.OperatorId, " ", this.LocalIPAddress());

            return Json(new CustomMessage { Title = "Message...", Message = "Features has been updated..", ErrorCode = logs ? 1 : 0 });
        }


        
        [HttpPost]
        public ActionResult SaveNewFunction(string featid,string functid)
        {
          string li = bs.SaveNewFunction(featid,functid,"0");
            //log  
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("SaveNewFunction", "ModuleAccessController", "0", "0", this.OperatorId, " ", this.LocalIPAddress());

            return Json(new CustomMessage { Title = "Message...", Message = "FUNCTION has been updated..", ErrorCode = logs ? 1 : 0 });
        }

        [HttpPost]
        public ActionResult RemoveFeatFunction(string featid, string functid)
        {
            string li = bs.SaveNewFunction(featid, functid, "1");
            //log  
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("RemoveFeatFunction", "ModuleAccessController", "0", "0", this.OperatorId, " ", this.LocalIPAddress());

            return Json(new CustomMessage { Title = "Message...", Message = "FUNCTION has been updated..", ErrorCode = logs ? 1 : 0 });
        }





    }
}
