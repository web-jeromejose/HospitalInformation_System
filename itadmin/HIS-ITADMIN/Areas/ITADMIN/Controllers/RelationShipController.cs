using System;
using System.Collections.Generic;
using DataLayer;
using DataLayer.ITAdmin.Model;
using HIS.Controllers;
using HIS_ITADMIN.Areas.ITADMIN.Models;
using Microsoft.Reporting.WebForms;
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
    public class RelationShipController : BaseController
    {
        //
        // GET: /ITADMIN/RelationShip/
        [IsSGHFeatureAuthorized(mFeatureID = "514")]
        public ActionResult Index()
        {
            return View();
        }


        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(RelationshipSave entry)
        {
            RelationShipModel model = new RelationShipModel();
            entry.OperatorId = this.OperatorId;
            bool status = model.Save(entry);
            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

        public ActionResult RelationshipDashBoard()
        {
            RelationShipModel model = new RelationShipModel();
            List<RelationshipBoard> list = model.RelationshipBoardList();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<RelationshipBoard>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult FetchRelationship(int Id)
        {
            RelationShipModel model = new RelationShipModel();
            List<RelationshipViewModel> list = model.RelationshipViewModelList(Id);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<RelationshipViewModel>() }),
                ContentType = "application/json"
            };
            return result;

        }

    }
}
