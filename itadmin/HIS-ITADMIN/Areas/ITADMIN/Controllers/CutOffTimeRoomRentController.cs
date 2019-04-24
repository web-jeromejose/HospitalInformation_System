using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataLayer;
using HIS.Controllers;
using HIS_ITADMIN.Areas.ITADMIN.Models;
using System.Web.Script.Serialization;
using DataLayer.ITAdmin.Model;

namespace HIS_ITADMIN.Areas.ITADMIN.Controllers
{
    public class CutOffTimeRoomRentController : BaseController
    {
        //
        // GET: /ITADMIN/CutOffTimeRoomRent/

      
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult RoomRentTimeView()
        {
            CutoffRoomRentModel model = new CutoffRoomRentModel();
            List<CutOffTimeRoomRentView> list = model.CutOffTimeRoomRentViewDal();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<CutOffTimeRoomRentView>() }),
                ContentType = "application/json"
            };
            return result;

        }


        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(CutOffTimeRoomRentSave entry)
        {
            CutoffRoomRentModel model = new CutoffRoomRentModel();
            //      entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }
    }
}
