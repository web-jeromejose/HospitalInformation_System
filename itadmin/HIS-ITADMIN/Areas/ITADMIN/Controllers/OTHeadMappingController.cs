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
    public class OTHeadMappingController : BaseController
    {
        //
        // GET: /ITADMIN/OTHeadMapping/
        UserRegistrationModel bs = new UserRegistrationModel();
         

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult Select2UserList(string id)
        {
            List<UserList> list = bs.Select2UserListDal(id);
            return Json(list, JsonRequestBehavior.AllowGet);
        }


        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(OTHeadmodel entry)
        {
 
            bool status = bs.SaveOTHead(entry);
            return Json(new CustomMessage { Title = "Message...", Message = bs.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }
 

        public ActionResult MainListOtHead()
        {
            List<MainListOT> list =  bs.GetMainListOT();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<MainListOT>() }),
                ContentType = "application/json"
            };
            return result;
        }

 

    }


}
