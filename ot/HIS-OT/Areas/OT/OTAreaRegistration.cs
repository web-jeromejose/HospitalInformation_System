using System.Web.Mvc;

namespace HIS_OT.Areas.OT
{
    public class OTAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "OT";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "OT_default",
                "OT/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
