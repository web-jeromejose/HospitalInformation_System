using DataLayer;
using DataLayer.ITAdmin.Model;
using HIS.Controllers;
using HIS_ITADMIN.Areas.ITADMIN.Models;
using log4net;
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
    public class HandleException : HandleErrorAttribute
    {
        //
        // GET: /ITADMIN/HandleException/


        public override void OnException(ExceptionContext context)
        {
            if (context.ExceptionHandled) return;

            var thisController = (BaseController)context.Controller;
            Exception ex = context.Exception;
            context.ExceptionHandled = true;
            var controllerName = context.RouteData.Values["controller"].ToString();
            var actionName = context.RouteData.Values["action"].ToString();

            var log = LogManager.GetLogger(typeof(HandleException).Name);
            log.Error(string.Format("Error while executing : {0}/{1} " + System.Environment.NewLine
                + "Parameter: {2}", controllerName, actionName, context.HttpContext.Request.QueryString));
            log.Error(string.Format("Stacktrace:  {0}", context.Exception));
            if (context.HttpContext.Request.IsAjaxRequest())
            {
                // if request was an Ajax request, respond with json with Error field
                //var jsonResult = new ErrorController { ControllerContext = context }.GetJsonError(context.Exception);
                //jsonResult.ExecuteResult(context);
            }
            else
            {
                // if not an ajax request, continue with logic implemented by MVC -> html error page
                base.OnException(context);
            }
        }
    }
}
