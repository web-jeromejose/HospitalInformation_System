using System.Web.Mvc;

namespace HIS_OT.Areas.OTForms
{
    public class FormsAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "OTForms";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "OTForms_default",
                "OTForms/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
