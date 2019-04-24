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
    public class GenerateTariffController : BaseController
    {
        //
        // GET: /ITADMIN/GenerateTariff/

        GenerateTariffModel model = new GenerateTariffModel();



        public ActionResult Index()
        {
            return View();
        }

        public JsonResult tarifflist()
        {
           
            List<GT_TariffModel> li = model.TariffList();
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }
        public JsonResult servicelist()
        {
            List<GT_ServiceModel> li = model.servicelist();
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }
        public JsonResult itemlist(int serviceid)
        {
            List<GT_TariffModel> li = model.itemlist(serviceid);
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }
        public JsonResult bedtypelist()
        {
            List<GT_TariffModel> li = model.bedtypelist();
            return Json(li.OrderBy(x => x.name), JsonRequestBehavior.AllowGet);
        }


        public JsonResult OldPriceList(string TariffID, string ServiceID,string ItemId,string BedType)
        {
            List<GT_CurrentPriceDal> li = model.CurrentTariffPrice_IP(TariffID,ServiceID,ItemId,BedType);
            return Json(li.OrderBy(x => x.ItemName), JsonRequestBehavior.AllowGet);
        }


        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult SaveNewPrice(SaveNewPriceDal entry)
        {   
            bool status = model.SaveNewPrice(entry, this.OperatorId);
            //log  
            MasterModel log = new MasterModel();
            bool logs = log.loginsert("SaveNewPrice", "GenerateTariffController", "0", "0", this.OperatorId, entry.ToString());



            return Json(new CustomMessage { Title = "Message...", Message = model.ErrorMessage, ErrorCode = status ? 1 : 0 });


        }




        public ActionResult Bulk_IP_Tariff()
        {
            return View();
        }

    }
}
