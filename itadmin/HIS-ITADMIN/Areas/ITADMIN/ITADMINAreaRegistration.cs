using System.Web.Mvc;

namespace HIS_ITADMIN.Areas.ITADMIN
{
    public class ITADMINAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "ITADMIN";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "ITADMIN_default",
                "ITADMIN/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
