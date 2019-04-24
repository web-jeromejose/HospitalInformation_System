using System.Web;
using System.Web.Optimization;

namespace HIS_ITADMIN
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            BundleTable.EnableOptimizations = true;
            /////////////////////OLD///////////////////////////////////////
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                       "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
                        "~/Scripts/jquery-ui-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.unobtrusive*",
                        "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            ///**Standard CSS Plugins by the group**/
            bundles.Add(new StyleBundle("~/Styles/plugins/global").Include(
                "~/Content/dist/bower_components/bootstrap/dist/css/bootstrap.min.css",
                "~/Content/dist/bower_components/bootstrap/dist/css/bootstrap-theme.min.css",
                "~/Content/dist/bower_components/font-awesome/css/font-awesome.min.css",
                "~/Content/dist/bower_components/Ionicons/css/ionicons.min.css",
               
                "~/Content/dist/bower_components/bootstrap/dist/css/bootstrap.min.css",
                "~/Content/dist/css/skins/_all-skins.min.css",
 
                 "~/Content/plugins/datetimepicker/css/bootstrap-datetimepicker.min.css",
                // "~/Content/dist/bower_components/datatables.net-bs/css/dataTables.bootstrap.min.css",
                 "~/Content/dist/bower_components/select2/dist/css/select2.min.css",               
                 "~/Content/dist/bower_components/bootstrap-daterangepicker/daterangepicker.css",
                 "~/Content/dist/bower_components/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css",
                 "~/Content/dist/plugins/iCheck/all.css",
                  "~/Content/plugins/toastr/content/toastr.min.css",

                   "~/Content/plugins/select2/select2.min.css",                  
                 //custom
                 "~/Content/styles/loading.css",
                 "~/Content/styles/Site.css"
                ));
              
            /////Standard JS Plugins by the group
            bundles.Add(new ScriptBundle("~/Scripts/plugins/global").Include(
                //"~/Content/dist/bower_components/jquery/dist/jquery.min.js",
                //"~/Content/dist/bower_components/bootstrap/dist/js/bootstrap.min.js",
                //"~/Content/dist/bower_components/jquery-slimscroll/jquery.slimscroll.min.js",
               

                //"~/Content/dist/bower_components/datatables.net/js/jquery.dataTables.min.js",
                //"~/Content/dist/bower_components/datatables.net-bs/js/dataTables.bootstrap.min.js",
                //"~/Content/plugins/keytable/keytable.js",
            
                //"~/Content/plugins/keytable/jquery.dataTables.editable.js",
                //"~/Content/plugins/datatable/js/dataTables.bootstrap.js",
                //"~/Content/plugins/editables/jquery.jeditable.js",

                //"~/Content/dist/bower_components/select2/dist/js/select2.full.min.js",
                //"~/Content/dist/plugins/input-mask/jquery.inputmask.js",
                //"~/Content/dist/plugins/input-mask/jquery.inputmask.date.extensions.js",
                //"~/Content/dist/plugins/input-mask/jquery.inputmask.extensions.js",
                //"~/Content/dist/bower_components/moment/min/moment.min.js",
                //"~/Content/dist/plugins/iCheck/icheck.min.js",

                //"~/Content/dist/bower_components/bootstrap-daterangepicker/daterangepicker.js",
           
                //"~/Content/dist/bower_components/bootstrap-colorpicker/dist/js/bootstrap-colorpicker.min.js",
                //"~/Content/dist/plugins/timepicker/bootstrap-timepicker.min.js",
                //"~/Content/plugins/bootbox/jquery.bootbox.js",
                //"~/Content/plugins/blockui/jquery.blockUI.js",
                //"~/Content/plugins/datetimepicker/js/bootstrap-datetimepicker.min.js",
                

    
                //"~/Content/plugins/select2/select2.js",
                //"~/Content/plugins/select2/underscore.js",
                //"~/Content/plugins/sweetalert/sweet-alert.min.js",
                //"~/Content/dist/bower_components/fastclick/lib/fastclick.js",
                //"~/Content/dist/js/adminlte.js",
                //"~/Content/dist/js/demo.js",
                //"~/Content/plugins/toastr/scripts/toastr.min.js",
               
                //"~/Content/plugins/moment/moment.js"
                ));

            bundles.Add(new ScriptBundle("~/Scripts/global").Include(
                //custom
                //"~/Scripts/ajaxWrapper.js",
                //"~/Scripts/itadmin/jqGlobal.js",
                // "~/Content/plugins/common/common.js",
                //"~/Scripts/jqSecurity.js"
               ));

            /////Standard CSS by the group
            //bundles.Add(new StyleBundle("~/Styles/global").Include(
            //    "~/Content/styles/customererror.css",
            //    "~/Content/styles/globalstyle.css",
            //    "~/Content/styles/loading.css",
            //    "~/Content/styles/login.css",
            //    "~/Content/styles/mainstyles.css",
            //    "~/Content/styles/menu.css"
            //    ));


            ///Standard scripts by the group
            

            ///**Customize CSS-Style-Plugin per programmer-global**/
            //bundles.Add(new StyleBundle("~/Styles/custom").Include(
            //    "~/Content/styles/Site.css",
            //    "~/Content/plugins/select2/select2.min.css",
            //    "~/Content/plugins/sweetalert/sweet-alert.css",
            //    "~/Content/plugins/toastr/content/toastr.min.css"
            //    ));


            ///**Customize JS-Scripts-Plugin per programmer-global**/
            //bundles.Add(new StyleBundle("~/Scripts/custom").Include(
            //    "~/Content/plugins/select2/select2.js",
            //    "~/Content/plugins/select2/underscore.js",
            //    "~/Content/plugins/toastr/scripts/toastr.min.js",
            //    "~/Content/plugins/keytable/jquery.jeditable.js",     
            //    "~/Content/plugins/keytable/jquery.dataTables.editable.js",
            // "~/Content/plugins/sweetalert/sweet-alert.min.js",    
            //    "~/Scripts/itadmin/jqGlobal.js"
            //));



            ///**Customize JS-Function-Plugin per programmer**/
            //bundles.Add(new ScriptBundle("~/Scripts/jqreports").Include(
            //   "~/Scripts/itadmin/jqreport.js",
            //   "~/Content/plugins/datepicker/js/moment.js",
            //   "~/Content/plugins/datepicker/js/bootstrap-datepicker.js"
            //   ));

            ///**Customize CSS-Function-Plugin per programmer**/
            /////////////////////OLD///////////////////////////////////////




        }
    }
}