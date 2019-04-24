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
    public class TariffController : BaseController
    {
        //
        // GET: /ITADMIN/Tariff/

        #region Tariff

        [IsSGHFeatureAuthorized(mFeatureID = "1325")]
        public ActionResult Index()
        {
            return View();
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Save(TariffSave entry)
        {
            TariffModel model = new TariffModel();
            //entry.OperatorID = this.TariffModel;
            bool status = model.Save(entry);
 
            //log  
            var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            string log_details = log_serializer.Serialize(entry);
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("Save", "TariffController", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }

        public ActionResult TariffDashBoard()
        {
            TariffModel model = new TariffModel();
            List<TariffDashboardModel> list = model.TariffDashboardModel();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<TariffDashboardModel>() }),
                ContentType = "application/json"
            };
            return result;

        }

        public ActionResult FetchTariff(int Tariffid)
        {
            TariffModel model = new TariffModel();
            List<TariffViewModel> list = model.TariffViewModel(Tariffid);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<TariffViewModel>() }),
                ContentType = "application/json"
            };
            return result;

        }
        #endregion


        #region OPTariff
        public ActionResult OPTariffNew_Op()
        {
            return View();
        }
        public ActionResult OPTariffDashBoard()
        {

            TariffModel model = new TariffModel();
            List<OPTariffDashBoardDAL> list = model.OPTariffDashBoard();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<OPTariffDashBoardDAL>() }),
                ContentType = "application/json"
            };
            return result;

        }
        #endregion

        #region IPTariff 
        public ActionResult IPTariffNew_Ip()
        {
            return View();
        }
        public ActionResult IPTariffDashBoard()
        {
            TariffModel model = new TariffModel();
            List<IPTariffDashBoardDAL> list = model.IPTariffDashBoard();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<IPTariffDashBoardDAL>() }),
                ContentType = "application/json"
            };
            return result;

        }

        #endregion
      

    }
}
