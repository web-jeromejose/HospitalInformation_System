using System.Web.Mvc;
//test
namespace HIS_BloodBank.Areas.BloodBank
{
    public class BloodBankAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "BloodBank";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "BloodBank_default",
                "BloodBank/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
