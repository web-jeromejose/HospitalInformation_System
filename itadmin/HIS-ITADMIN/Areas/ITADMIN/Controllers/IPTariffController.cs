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
using DataLayer.ITAdmin.Data;
using SGH;

namespace HIS_ITADMIN.Areas.ITADMIN.Controllers
{
    public class IPTariffController : BaseController
    {
        //
        // GET: /ITADMIN/OPTariff/
        IPTariffDB DB = new IPTariffDB();

        public ActionResult IpTariffView()
        {
            IPTariff model = new IPTariff();
            model.TariffList = DB.GetAllTariff();
            model.ServicesList = DB.GetAllServices();

            //IpTariffViewEntity obPrice = new IpTariffViewEntity();
            ////obPrice.PriceIqueryable = new List<IpTariffViewEntity>().AsQueryable();
            //obPrice.PriceIqueryable = new List<DummDatabaseTableViewEntity>().AsQueryable();
            //obPrice.TariffList = _ipTariff.GetTariffList();
            //obPrice.ServiceList = _ipTariff.GetIPbServiceList();

            //obPrice.MasterTableList = new List<MasterTableViewEntity>();
            //ViewData["bedTypeList"] = _bedTypeService.GetBedTypeList().OrderBy(x => x.Name).ToList();
            //return View(obPrice);
      
            return View(model);
        }

        public ActionResult IPGetItemPrice(int tariffid, int serviceid, int? itemid, Boolean bNextItem)
        {
            TariffItemPriceList price = new TariffItemPriceList();
            price.PriceList = DB.GetItemPrice(tariffid, serviceid, itemid == 0 ? null : itemid, bNextItem);
            price.ItemCode = DB.ItemCode;
            price.ItemName = DB.ItemName;
            price.ItemID = DB.ItemID;
            return PartialView("_IPTariffPrice", price);
        }

        [HttpPost]
        public JsonResult IPTariffSaveItemPrice(SaveTariffParam param)
        {
            param.By = this.OperatorId; // (int)Session["loggedInId"];
            return Json(new { Success = DB.SaveItemPrice(param) });
        }

        [HttpPost]
        public JsonResult IPTariffSaveItemPriceByPercent(SaveTariffRevisedByParam param)
        {
            param.By = this.OperatorId; // (int)Session["loggedInId"];
            return Json(new { Success = DB.SaveItemPrice(param) });
        }

        public ActionResult IPSearchItem(IDataTablesRequest param)
        {
            int serviceID = int.Parse(Request["serviceid"]);
            Boolean searchByCode = Boolean.Parse(Request["searchbycode"]);
            string searchText = Request["searchtext"];

            searchText = searchText == "" ? "-1" : searchText;

            List<SearchResult> res = DB.SearchItem(serviceID, searchByCode, searchText);
            return Json(new DataTablesResponse(param.Draw, res ?? new List<SearchResult>(), 100, 100), JsonRequestBehavior.AllowGet);
        }


        public ActionResult IPFindItem(int ServiceID, Boolean SearchByCode, string SearchText)
        {
          //  IPTariffDB DB = new IPTariffDB();
            List<FindIPTariff> list = DB.ItemFindList(ServiceID, SearchByCode, SearchText);
            var serializer = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            var result = new ContentResult
            {
                Content = serializer.Serialize(new { list = list ?? new List<FindIPTariff>() }),
                ContentType = "application/json"
            };
            return result;

        }
        //public ActionResult IPSearchItem(int test)
        //{
        //    int serviceID = int.Parse(Request["serviceid"]);
        //    Boolean searchByCode = Boolean.Parse(Request["searchbycode"]);
        //    string searchText = Request["searchtext"];

        //    searchText = searchText == "" ? "-1" : searchText;

        //    List<SearchResult> res = DB.SearchItem(serviceID, searchByCode, searchText);
        //    return Json(res, JsonRequestBehavior.AllowGet);
        //}


    }
}
