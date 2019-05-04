using HisBloodbankEf.Core.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HIS_BloodBank.Areas.BloodBank.Controllers
{
    public class NewDonorController : Controller
    {
        IDonorBusiness DonorBusiness;

        public NewDonorController(IDonorBusiness donorBusiness) //: base(adminBusiness) { }
        {
            DonorBusiness = donorBusiness;
        }

        public ActionResult Index()
        {
            return Json(DonorBusiness.ToString(), JsonRequestBehavior.AllowGet);
        }


    }
}
