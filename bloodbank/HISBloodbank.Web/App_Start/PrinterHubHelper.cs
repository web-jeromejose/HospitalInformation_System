using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HIS_BloodBank.App_Start
{
    public static class PrinterHubHelper
    {
        public static IHtmlString PrinterHubSetting(this HtmlHelper helper, string myIp)
        {
            myIp = "127.0.0.1";
            var hubUrl = System.Configuration.ConfigurationManager.AppSettings["PrinterHub"].ToString() + "a/reprintbbbarcode/";
            string printerHubSetting = "<input type='hidden' id='hidMyIp' value='" + myIp + "' />";
            printerHubSetting += "<input type='hidden' id='hidPrinterHubUrl' value='" + hubUrl + "' />";
            return new HtmlString(printerHubSetting);
        }

    }
}