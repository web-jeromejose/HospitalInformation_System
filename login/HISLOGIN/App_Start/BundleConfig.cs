using System.Web;
using System.Web.Optimization;

namespace HIS_LOGIN
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            BundleTable.EnableOptimizations = true;
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
                        "~/Scripts/jquery-ui-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.unobtrusive*",
                        "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            /**Standard CSS Plugins by the group**/
            bundles.Add(new StyleBundle("~/Styles/plugins/global").Include(
                "~/Content/plugins/bootstrap/css/bootstrap.min.css",
               
                "~/Content/plugins/adminlte/css/skins/_all-skins.css",
 
                "~/Content/dist/bower_components/Ionicons/css/ionicons.min.css",
                "~/Content/dist/bower_components/morris.js/morris.css",
                "~/Content/dist/bower_components/jvectormap/jquery-jvectormap.css",
                "~/Content/dist/bower_components/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css",
                "~/Content/dist/bower_components/bootstrap-daterangepicker/daterangepicker.css",
                "~/Content/dist/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.min.css",
              


                "~/Content/plugins/datatable/css/datatables.bootstrap.css"
 
                ));

            ///Standard JS Plugins by the group
            bundles.Add(new ScriptBundle("~/Scripts/plugins/global").Include(
                "~/Content/plugins/bootstrap/js/bootstrap.min.js",
                "~/Content/plugins/datatable/js/jquery.dataTables.js",
                "~/Content/plugins/datatable/js/dataTables.bootstrap.js",
                "~/Content/plugins/caret/jquery.migrate.js",
                "~/Content/plugins/adminlte/js/app.min.js"
                ));


            ///Standard CSS by the group
            bundles.Add(new StyleBundle("~/Styles/global").Include(
                "~/Content/styles/customererror.css",
                "~/Content/styles/globalstyle.css",
                "~/Content/styles/loading.css",
                "~/Content/styles/login.css",
                "~/Content/styles/mainstyles.css",
                "~/Content/styles/menu.css"
                ));

            ///Standard scripts by the group
            bundles.Add(new ScriptBundle("~/Scripts/global").Include(
                "~/Scripts/ajaxWrapper.js"
                ));


            /**Customize CSS-Style-Plugin per programmer-global**/
            bundles.Add(new StyleBundle("~/Styles/custom").Include(
                "~/Content/styles/Site.css",
                "~/Content/styles/spinner.css",
                "~/Content/plugins/select2/select2.min.css",
                "~/Content/plugins/sweetalert/sweet-alert.css",
                "~/Content/plugins/toastr/content/toastr.min.css",
                 "~/Content/plugins/popup/popModal.css" 
                ));




            /**Customize JS-Scripts-Plugin per programmer-global**/
            bundles.Add(new ScriptBundle("~/Scripts/custom").Include(
                "~/Content/plugins/inputmask/jquery.inputmask.js",
                "~/Content/plugins/popup/popModal.js",
                "~/Content/plugins/select2/select2.js",
                "~/Content/plugins/select2/underscore.js",
                "~/Content/plugins/blockui/jquery.blockUI.js",
                "~/Content/plugins/toastr/scripts/toastr.min.js",
                "~/Content/plugins/sweetalert/sweet-alert.min.js",
                  "~/Content/plugins/SliderJs/directorySlider.js",
                "~/Scripts/jqlogin/jqGlobal.js"                
            ));

            /**Customize JS-Function-Plugin per programmer**/
            bundles.Add(new ScriptBundle("~/Scripts/jqlogin").Include(
                "~/Scripts/jqlogin/jqlogin.js"                
            ));
            bundles.Add(new ScriptBundle("~/Scripts/jqhome").Include(
                    "~/Scripts/jqlogin/jqhome.js",
                    "~/Content/plugins/moment/moment.js",
                    "~/Content/plugins/moment/moment-hijri.js",
                    "~/Content/plugins/moment/locale/ar-sa.js",
                    "~/Content/plugins/moment/locale/en-gb.js"
            ));
            /**Customize CSS-Function-Plugin per programmer**/

            
        }
    }
}