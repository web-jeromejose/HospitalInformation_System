using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using log4net;
using DataLayer;
using DataLayer.Common;
using HIS.Controllers;

namespace HIS_ITADMIN.Areas.ITADMIN.Controllers
{
    public class MMSIpStationController : BaseController
    {
        MMSIpStationModel MMSIpStation;
        MasterModel model;
        ExceptionLogging eLOG;

        public MMSIpStationController()
        {
            MMSIpStation = new MMSIpStationModel();
            model = new MasterModel();
            eLOG = new ExceptionLogging();
        }

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Save(MMSIpStationSave entry)
        {
            bool status = false;
            try
            {
                status = MMSIpStation.Save(entry);
                
                //log  
                var log_serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
                string log_details = log_serializer.Serialize(entry);
                MasterModel log = new MasterModel();
                bool logs = log.loginsert("Save", "MMS_IPAddrStations", "0", "0", this.OperatorId, log_details, this.LocalIPAddress());


            }
            catch (HISValidationException ex)
            {
                return Json(new CustomMessage { Title = "Message...", Message = ex.Message, ErrorCode = 0 });
            }
            catch (Exception e)
            {
                eLOG.LogError(e);
                var logger = LogManager.GetLogger("IP Tariff Logger");
                logger.Error(e.Message);
                logger.Error(e.StackTrace);
            }
            return Json(new CustomMessage { Title = "Message...", Message = MMSIpStation.ErrorMessage, ErrorCode = status ? 1 : 0 });
        }

        public ActionResult GetMMSIpStationDataTable()
        {
            List<MMSIpStationDT> list = MMSIpStation.GetMMSIpStationDataTable();
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<MMSIpStationDT>() }),
                ContentType = "application/json"
            };
            return result;
        }

        public ActionResult GetMMSIpStation(string ipAddress, int stationId)
        { 
            MMSIpStationViewModel MMSIpStationModel = MMSIpStation.GetMMSIpStation(ipAddress, stationId);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var list = new ContentResult
            {
                Content = serializer.Serialize(new { list = MMSIpStationModel ?? new MMSIpStationViewModel() }),
                ContentType = "application/json"
            };
            return list;
        }
    }
}
