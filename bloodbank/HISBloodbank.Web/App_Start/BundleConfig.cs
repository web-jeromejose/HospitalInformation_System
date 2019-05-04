using System.Web;
using System.Web.Optimization;

namespace HIS_BloodBank
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Content/modernizr/js/modernizr.js"));

            #region commonjs

            bundles.Add(new ScriptBundle("~/bundles/commonjs").Include(
                        "~/Content/jquery/js/jquery.min.js",
                        "~/Content/bootstrap/js/bootstrap.min.js",
                        "~/Content/moment/js/moment.js",
                        "~/Content/datejs/date.js",
                        "~/Content/accounting/js/accounting.js",
                        "~/Content/bootbox/js/bootbox.min.js",
                        "~/Content/datatable/js/jquery.dataTables.min.js",
                        "~/Content/datatable/extensions/RowGrouping/jquery.dataTables.grouping.js",
                        "~/Content/datatable/extensions/Editable/js/jquery.dataTables.editable.js",
                        "~/Content/datatable/extensions/Editable/js/jquery.jeditable.js",
                        "~/Content/datetimepicker/js/bootstrap-datetimepicker.min.js",
                        "~/Content/icheck/icheck.min.js",
                        "~/Content/dhtmlxscheduler/dhtmlxscheduler.js",
                        "~/Content/dhtmlxscheduler/ext/dhtmlxscheduler_tooltip.js",
                        "~/Content/select2/select2.js",
                        "~/Scripts/Global/hisglobalsettings.js",
                        "~/Content/common/js/common.js",
                        "~/Scripts/Index.js",
                        "~/Content/codebase/dhtmlx.js"
                        ));

            #endregion

            #region commoncss

            bundles.Add(new StyleBundle("~/bundles/commoncss").Include(
                        "~/Content/bootstrap/css/bootstrap.min.css",
                        "~/Content/jqueryui/css/jquery-ui.min.css",
                        "~/Content/jqueryui/css/jquery-ui.theme.min.css",
                        "~/Content/datatable/css/jquery.dataTables.min.css",
                        "~/Content/datatable/css/jquery.dataTables_themeroller.css",
                        "~/Content/datatable/css/dataTables.responsive.css",
                        "~/Content/datetimepicker/css/bootstrap-datetimepicker.min.css",
                        "~/Content/icheck/skins/all.css",
                        "~/Content/select2/select2.css",
                        "~/Content/select2/select2-bootstrap.css",
                        "~/Content/dhtmlxscheduler/dhtmlxscheduler.css",
                        "~/Content/yamm/yamm.css",
                        "~/Content/imported/css/fahad.css",
                        "~/Content/your_style.css",
                        "~/Content/codebase/dhtmlx.css"
                        ));

            #endregion


            #region jquery

            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Content/jquery/js/jquery-{version}.js"
                        ));

            #endregion
            #region jqueryui

            bundles.Add(new ScriptBundle("~/bundles/jqueryui/js").Include(
                        "~/Content/jqueryui/js/jquery-ui.min.js"
                        ));
            bundles.Add(new StyleBundle("~/bundles/jqueryui/css").Include(
                        "~/Content/jqueryui/css/jquery-ui.min.css",
                        "~/Content/jqueryui/css/jquery-ui.theme.min.css"
                        ));

            #endregion
            #region bootstrap

            bundles.Add(new StyleBundle("~/bundles/bootstrap/css").Include(
                        "~/Content/bootstrap/css/bootstrap.min.css"
                        ));
            bundles.Add(new ScriptBundle("~/bundles/bootstrap/js").Include(
                        "~/Content/bootstrap/js/bootstrap.min.js"
                        ));

            bundles.Add(new ScriptBundle("~/Scripts/global").Include(
              "~/Scripts/ajaxWrapper.js",
              "~/Scripts/jqSecurity.js"
              ));

            #endregion
            #region accounting

            bundles.Add(new ScriptBundle("~/bundles/accounting/js").Include(
                        "~/Content/accounting/js/accounting.js"
                        ));

            #endregion
            #region animate

            bundles.Add(new StyleBundle("~/bundles/animate/css").Include(
                        "~/Content/animate/css/animate.css"
                        ));

            #endregion
            #region bootbox

            bundles.Add(new ScriptBundle("~/bundles/bootbox/js").Include(
                        "~/Content/bootbox/js/bootbox.min.js"
                        ));

            #endregion
            #region datatable

            bundles.Add(new StyleBundle("~/bundles/datatable/css").Include(
                        "~/Content/datatable/css/jquery.dataTables.min.css"
                        ));
            bundles.Add(new ScriptBundle("~/bundles/datatable/js").Include(
                        "~/Content/datatable/js/jquery.dataTables.min.js"
                        ));
            bundles.Add(new ScriptBundle("~/bundles/datatable-editable/js").Include(
                        "~/Content/datatable/extensions/Editable/jquery.dataTables.editable.js",
                        "~/Content/datatable/extensions/Editable/jquery.jeditable.js"
                        ));

            #endregion
            #region datetimepicker

            bundles.Add(new StyleBundle("~/bundles/datetimepicker/css").Include(
                        "~/Content/datetimepicker/css/bootstrap-datetimepicker.min.css"
                        ));
            bundles.Add(new ScriptBundle("~/bundles/datetimepicker/js").Include(
                        "~/Content/datetimepicker/js/bootstrap-datetimepicker.min.js"
                        ));

            #endregion
            #region fullcalendar

            bundles.Add(new StyleBundle("~/bundles/fullcalendar/css").Include(
                        "~/Content/fullcalendar/css/fullcalendar.min.css",
                        "~/Content/fullcalendar/css/fullcalendar.print.css"
                        ));
            bundles.Add(new ScriptBundle("~/bundles/fullcalendar/js").Include(
                        "~/Content/fullcalendar/js/fullcalendar.min.js"
                        ));

            #endregion
            #region icheck

            bundles.Add(new StyleBundle("~/bundles/icheck/css").Include(
                        "~/Content/icheck/css/skins/all.css"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/icheck/js").Include(
                        "~/Content/icheck/js/icheck.min.js"
                        ));

            #endregion
            #region inputmask


            bundles.Add(new ScriptBundle("~/bundles/inputmask/js").Include(
                        "~/Content/inputmask/js/jquery.inputmask.min.js"
                        ));

            #endregion
            #region moment

            bundles.Add(new ScriptBundle("~/bundles/moment/js").Include(
                        "~/Content/moment/js/moment.js"
                        ));

            #endregion
            #region notify

            bundles.Add(new ScriptBundle("~/bundles/notify/js").Include(
                        "~/Content/notify/js/Notify.js"
                        ));

            #endregion
            #region select2

            bundles.Add(new StyleBundle("~/bundles/select2/css").Include(
                        "~/Content/select2/css/select2.min.css"
                        ));
            bundles.Add(new ScriptBundle("~/bundles/select2/js").Include(
                        "~/Content/select2/js/select2.min.js"
                        ));


            #endregion



        }
    }
}