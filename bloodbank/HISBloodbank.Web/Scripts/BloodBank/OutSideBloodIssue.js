var c = new Common();


$(document).ready(function () {


    c.DefaultSettings();
    Fn.init();

});


/******************************************************* *********************   ***************************************************************************/
var Fn = function () {

    var handleScreenJs = function () {
        jQuery(document).ready(function () {
 
            LoadDashboard();
            InitSelect2();
            initBtn();
         

        });


        var TblDTBlood;
        var TblDTBloodId = '#DTBlood';
        var TblDTBloodDataRow;

        var TblDTComponent;
        var TblDTComponentId = '#DTComponent';
        var TblDTComponentDataRow;

        var TblDTSDPLR;
        var TblDTSDPLRId = '#DTSDPLR';
        var TblDTSDPLRDataRow;

        var LoadDashboard = function () {
            ajaxWrapper.Get($("#url").data("bloodcategory"), null, function (x, e) {
                DashboardBloodCategory(x.list);
            });

            ajaxWrapper.Get($("#url").data("componentcategory"), null, function (x, e) {
                DashboardComponentCategory(x.list);
            });

            ajaxWrapper.Get($("#url").data("sdplrcategory"), null, function (x, e) {
                DashboardSDPLRCategory(x.list);
            });

        };
        var calcHeightDashboardScreenDashboard = function () {
            return $(window).height() * 50 / 100;
        };
        function RowCallBloodCategory() {
            var rc = function (nRow, aData) {
                var $nRow = $(nRow);
                //if (aData["HasAccess"] === 1) {
                //    //$('td:eq(3)', nRow).html("Yes");
                //    $nRow.addClass("row_green");
                //    $('#checkFunctionConfigRole', nRow).prop('checked', true);
                //}
               
                //jQuery(this).closest("tr").css('background-color', 'yellow !important');
            
                var $nRow = $(nRow);
                var a = new Date(aData["expiry"]);
                var b = moment(a).format("D-MMM-YYYY");
                $('td:eq(3)', nRow).html(' ' + b+ ' / ' + aData["tvolume"]);
                //if (status == 1) { // not screen
                //    $nRow.css({ "background-color": "#fcc9c9" })
                //    $('td:eq(6)', nRow).html('<b class="btn-margin-right btn btn-xs blue"> <i class="glyphicon glyphicon-unchecked"></i> NO </b>');
                //}
                //else if (status == 2) { // screen
                //    $nRow.css({ "background-color": "#ffffd9" })
                //    $('td:eq(6)', nRow).html('<b class="btn-margin-right btn btn-xs blue"> <i class="glyphicon glyphicon-check"></i> YES </b>');
                //}
                //if (screenresult == 1) {
                //    $('td:eq(5)', nRow).html(' <i class="  glyphicon glyphicon-minus"></i><small>Negative</small> ');
                //} else {
                //    $('td:eq(5)', nRow).html(' <i class="glyphicon glyphicon-plus"></i><small>Positive</small>  ');
                //}
                //$('td:eq(4)', nRow).html(' <i class="glyphicon glyphicon-tint"></i>  ' + aData['bloodgroupname']);



                //else if (value == 1) { // Crossmatched/Reserved
                //    $nRow.css({ "background-color": "#b7f5ff" })
                //    //$('# *').prop('disabled', true);
                //}
                //else if (value == 3) { // Incompatible unit(s) order
                //    $nRow.css({ "background-color": "#d3d3d2" })
                //}
                //else if (value == 10) { // Unreserved Units
                //    $nRow.css({ "background-color": "#ffffff" })
                //}

                //if (aData['status'] == 2) { // Stat Request Type
                //    //$('td:eq(0)', nRow).addClass("btn-data-priority");

                //}

            };
            return rc;
        }
        function RowCallSDPLRCategory() {
            var rc = function (nRow, aData) {
                var $nRow = $(nRow);
                var a = new Date(aData["expiry"]);
                var b = moment(a).format("D-MMM-YYYY");
                $('td:eq(3)', nRow).html(' ' + b + ' / ' + aData["tvolume"]);
            };
            return rc;
        }
        function RowCallComponentCategory() {
            var rc = function (nRow, aData) {
                var $nRow = $(nRow);
                var a = new Date(aData["expirydate"]);
                var b = moment(a).format("D-MMM-YYYY");
                $('td:eq(4)', nRow).html(' ' + b + ' / ' + aData["Qty"]);
            };
            return rc;
        }

        function DashboardBloodCategory(data) {
          
            // http://legacy.datatables.net/release-datatables/examples/basic_init/scroll_x.html
            TblDTBlood = $(TblDTBloodId).DataTable({
                cache: false,
                destroy: true,
                data: data,
                paging: false,
                ordering: false,
                searching: false,
                info: true,
                processing: false,
                autoWidth: false,

                scrollCollapse: false,
                pageLength: 20,
                lengthChange: false,
                scrollY: calcHeightDashboardScreenDashboard(),
                scrollX: "100%",
                sScrollXInner: "100%",

                dom: '<"tbDashboardScreenDashboard">Rlfrtip',
                columns: [
                   // { data: "", title: '', className: 'control-center', visible: true, searchable: false, width: "1px", defaultContent: '<button type="button" class="btn btn-sm btn-danger" Id="btnDetailsModif" title="Delete" rel="tooltip"> <i class="glyphicon glyphicon-trash"></i></button>' },
                   // { data: "", title: ' ', className: ' ', visible: true, searchable: false, width: "0%", defaultContent: '<input type="checkbox" class="control-center iCheck-helper" id="checkFunctionConfigRole" />' },
                    //{ data: "", title: ' --  ', className: '   ', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" class="control-center iCheck-helper highlight" id="checkisService" />' },
                    { data: "", title: ' --  ', className: '   ', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" class="control-center iCheck-helper highlight checkisBloodCategoryCL" id="checkisBloodCategory" />' },
                    { data: "bagnumber", title: 'Unit No.', className: '   ', visible: true, searchable: true, width: "1%" },
                    { data: "bloodgroupname", title: 'Blood Group', className: '  ', visible: true, searchable: true, width: "1%" },
                    { data: "expiry", title: 'Expiry / Vol', className: '  ', visible: true, searchable: true, width: "3%" },
                
                    { data: "bloodgroup", title: '', className: '  ', visible: false, searchable: true, width: "1%" },



                    //{ data: "StartDateTime", title: 'Last Date of Current Tax  ', className: '   ', visible: true, searchable: false, width: "2%" },

                ],
                fnRowCallback: RowCallBloodCategory()
                
            });



            var btns = '';
            var toolbar = btns.concat(
                 '<div style="float:left;">'
                 , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnCheckAllFunctions"> <i class="glyphicon glyphicon-check"></i> All </button>'
                , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnUNCheckAllFunctions"> <i class="glyphicon glyphicon-unchecked"></i> All </button>'
                , '</div><br><br>');
            //$("div.tbDashboardScreenDashboard").html(toolbar);

            $('#btnCheckAllFunctions').click(function () {
                $('#preloader').show();
                $.each(TblDTBlood.rows().data(), function (i, row) {
                    TblDTBlood.cell(i, 0).data('<input id="checkFunctionConfigRole" type="checkbox" checked="checked" >');
                });
                $('#preloader').hide();
            });
            $('#btnUNCheckAllFunctions').click(function () {
                $('#preloader').show();
                $.each(TblDTBlood.rows().data(), function (i, row) {
                    TblDTBlood.cell(i, 0).data('<input id="checkFunctionConfigRole" type="checkbox">');
                });
                $('#preloader').hide();

            });

            


            $('.checkisBloodCategoryCL').iCheck({
                checkboxClass: 'icheckbox_square-red',
                radioClass: 'iradio_square-red'
            }).on("ifChecked ifUnchecked", function (e) {
                var checked = e.type == "ifChecked" ? true : false;
                if (this.checked) {

                    $(this).closest("tr").css("background-color", '#27bd61');
                } else {

                    $(this).closest("tr").css("background-color", 'white');
                }
                e.stopPropagation();
            });

        }
        function DashboardComponentCategory(data) {
            console.log(data);
            // http://legacy.datatables.net/release-datatables/examples/basic_init/scroll_x.html
            TblDTComponent = $(TblDTComponentId).DataTable({
                cache: false,
                destroy: true,
                data: data,
                paging: true,
                ordering: false,
                searching: true,
                info: true,
                processing: false,
                autoWidth: false,
                scrollCollapse: false,
                pageLength: 500,
                lengthChange: false,
                scrollY: calcHeightDashboardScreenDashboard(),
                scrollX: "100%",
                sScrollXInner: "100%",

                dom: '<"tbDashboardScreenDashboard">Rlfrtip',
                columns: [
                   // { data: "", title: '', className: 'control-center', visible: true, searchable: false, width: "1px", defaultContent: '<button type="button" class="btn btn-sm btn-danger" Id="btnDetailsModif" title="Delete" rel="tooltip"> <i class="glyphicon glyphicon-trash"></i></button>' },
                   // { data: "", title: ' ', className: ' ', visible: true, searchable: false, width: "0%", defaultContent: '<input type="checkbox" class="control-center iCheck-helper" id="checkFunctionConfigRole" />' },
                    //{ data: "", title: ' --  ', className: '   ', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" class="control-center iCheck-helper highlight" id="checkisService" />' },
                    { data: "", title: ' --  ', className: '   ', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" class="control-center iCheck-helper highlight checkisComponentCategoryCL" id="checkisComponentCategory" />' },
                    
                { data: "tempname", title: 'Type', className: '   ', visible: true, searchable: true, width: "1%" },
                { data: "bagnumber", title: 'Unit No.', className: '   ', visible: true, searchable: true, width: "1%" },
                    { data: "bloodgroupname", title: 'Blood Group', className: '  ', visible: true, searchable: true, width: "1%" },
                    { data: "expirydate", title: 'Expiry / Vol', className: '  ', visible: true, searchable: true, width: "2%" },
                    { data: "bloodgroup", title: '', className: '  ', visible: false, searchable: true, width: "1%" },



                    //{ data: "StartDateTime", title: 'Last Date of Current Tax  ', className: '   ', visible: true, searchable: false, width: "2%" },

                ],
                fnRowCallback: RowCallComponentCategory()
            });

          
            $('.checkisComponentCategoryCL').iCheck({
                checkboxClass: 'icheckbox_square-red',
                radioClass: 'iradio_square-red'
            }).on("ifChecked ifUnchecked", function (e) {
                var checked = e.type == "ifChecked" ? true : false;
                if (this.checked) {

                    $(this).closest("tr").css("background-color", '#27bd61');
                } else {

                    $(this).closest("tr").css("background-color", 'white');
                }
                e.stopPropagation();
            });

 
        }
        function DashboardSDPLRCategory(data) {
        
            // http://legacy.datatables.net/release-datatables/examples/basic_init/scroll_x.html
            TblDTSDPLR = $(TblDTSDPLRId).DataTable({
                cache: false,
                destroy: true,
                data: data,
                paging: false,
                ordering: false,
                searching: false,
                info: true,
                processing: false,
                autoWidth: false,

                scrollCollapse: false,
                pageLength: 20,
                lengthChange: false,
                scrollY: calcHeightDashboardScreenDashboard(),
                scrollX: "100%",
                sScrollXInner: "100%",

                dom: '<"tbDashboardScreenDashboard">Rlfrtip',
                columns: [
                   // { data: "", title: '', className: 'control-center', visible: true, searchable: false, width: "1px", defaultContent: '<button type="button" class="btn btn-sm btn-danger" Id="btnDetailsModif" title="Delete" rel="tooltip"> <i class="glyphicon glyphicon-trash"></i></button>' },
                   // { data: "", title: ' ', className: ' ', visible: true, searchable: false, width: "0%", defaultContent: '<input type="checkbox" class="control-center iCheck-helper" id="checkFunctionConfigRole" />' },
                    //{ data: "", title: ' --  ', className: '   ', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" class="control-center iCheck-helper highlight" id="checkisService" />' },
                    { data: "", title: ' --  ', className: '   ', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" class="control-center iCheck-helper highlight checkisSDPLRCategoryCL" id="checkisSDPLRCategory" />' },
                    { data: "bagnumber", title: 'Unit No.', className: '   ', visible: true, searchable: true, width: "1%" },
                    { data: "bloodgroupname", title: 'Blood Group', className: '  ', visible: true, searchable: true, width: "1%" },
                    { data: "expiry", title: 'Expiry / Vol', className: '  ', visible: true, searchable: true, width: "2%" },
                    { data: "bloodgroup", title: '', className: '  ', visible: false, searchable: true, width: "1%" },
                    //{ data: "StartDateTime", title: 'Last Date of Current Tax  ', className: '   ', visible: true, searchable: false, width: "2%" },
                ],
                fnRowCallback: RowCallSDPLRCategory()
            });

            
            $('.checkisSDPLRCategoryCL').iCheck({
                checkboxClass: 'icheckbox_square-red',
                radioClass: 'iradio_square-red'
            }).on("ifChecked ifUnchecked", function (e) {
                var checked = e.type == "ifChecked" ? true : false;
                if (this.checked) {

                    $(this).closest("tr").css("background-color", '#27bd61');
                } else {

                    $(this).closest("tr").css("background-color", 'white');
                }
                e.stopPropagation();
            });
 
        }

        function valid() {
            var errortext = "";
            var errors = [];

            if ($("#select2Hospital").val() == 0 || $("#select2Hospital").val() == "") {
                errors.push("Select a Hospital.");
            }
            if ($("#billno").val() == 0 || $("#billno").val() == "") {
                errors.push("Input a Bill No.");
            }
            if ($("#patientname").val() == 0 || $("#patientname").val() == "") {
                errors.push("Input a Patient Name.");
            }
            if ($("#select2outsidebag").val() == 0 || $("#select2outsidebag").val() == "") {
                errors.push("Select Outside Bag.");
            }

            if (errors.length > 0) {
                errortext += "<ul>";
                $.each(errors, function (i, item) {
                    errortext += "<li>" + item + "</li>";
                });
                errortext += "</ul>";
                c.MessageBoxErr("Validation Error", errortext);
                return false;
            }
            return true;
        }
        function Save() {

            var model = {
                HospitalId: $("#select2Hospital").val(),
                billno: $("#billno").val(),
                Patname: $("#patientname").val(),
                 }
 
            model.OutsideBloodIssueCategory = [];
            var rowcollection = TblDTBlood.$("#checkisBloodCategory:checked", { "page": "all" });
            rowcollection.each(function (index, elem) {
                var tr = $(elem).closest('tr');
                var row = TblDTBlood.row(tr);
                var rowdata = row.data();

                model.OutsideBloodIssueCategory.push({
                    bagnumber: rowdata.bagnumber

                });
            });
            var rowcollection = TblDTComponent.$("#checkisComponentCategory:checked", { "page": "all" });
            rowcollection.each(function (index, elem) {
                var tr = $(elem).closest('tr');
                var row = TblDTComponent.row(tr);
                var rowdata = row.data();

                model.OutsideBloodIssueCategory.push({
                    bagnumber: rowdata.bagnumber

                });
            });

            var rowcollection = TblDTSDPLR.$("#checkisSDPLRCategory:checked", { "page": "all" });
            rowcollection.each(function (index, elem) {
                var tr = $(elem).closest('tr');
                var row = TblDTSDPLR.row(tr);
                var rowdata = row.data();
              
                model.OutsideBloodIssueCategory.push({
                    bagnumber: rowdata.bagnumber
                
                });
            });

            if (model.OutsideBloodIssueCategory.length === 0) {
               
                c.MessageBoxErr("Unit Bag Selection", "Please select a Unit No.");
                return false;
            }


            model.OutsideBloodIssueHospBag = [];
            arr = $('#select2outsidebag').val();
            $.each(arr.split(','), function (i, val) {
                model.OutsideBloodIssueHospBag.push({
                    bagnumber: val
                });
            });

      
            ajaxWrapper.Post($("#url").data("save"), JSON.stringify(model), function (x, e) {
                console.log('x');
                console.log(x);
               
                if (x.ErrorCode == 0) {
                    c.MessageBox("Error...", x.Message, function () {  });
                    return false;
                } else {
                    c.MessageBox("Notify!", " Outside Blood Issue Successfully.", function () {
                        clearAll();
                     });

                }
            });  

        }
        function InitSelect2() {
            $('#select2Hospital').select2({
                //containerCssClass: "RequiredField",
                minimumInputLength: 0,
                allowClear: true,
                ajax: {
                    quietMillis: 150,
                    url: baseURL + 'Select2Hospital',
                    dataType: 'jsonp',
                    cache: false,
                    data: function (term, page) {
                        return {
                            pageSize: pageSize,
                            pageNum: page,
                            searchTerm: term
                        };
                    },
                    results: function (data, page) {
                        var more = (page * pageSize) < data.Total;
                        return { results: data.Results, more: more };
                    }
                }
            }).change(function (e) {
                var val = e.val;
                console.log(val);
                if (val > 0) {
                    c.ClearSelect2('#select2outsidebag');
                    $('#select2outsidebag').prop('disabled', false);
                    $('#select2outsidebag').trigger('click');
                    $('#select2outsidebag').select2('open');
                } else {
                    c.ClearSelect2('#select2outsidebag');
                    $('#select2outsidebag').prop('disabled', true);
                }
            });
            $("#select2outsidebag").select2({
                placeholder: "Type to include multiple selection...",
                data: [],
                minimumInputLength: 0,
                tags: true,
                ajax: {
                    quietMillis: 150,
                    url: baseURL + 'Select2OutSideBagperHospital',
                    dataType: 'jsonp',
                    data: function (term, page) {
                        return {
                            pageSize: pageSize,
                            pageNum: page,
                            searchTerm: term
                            , hospitalid: $('#select2Hospital').val()
                        };
                    },
                    success: function () {

                    },
                    results: function (data, page) {
                        var more = (page * pageSize) < data.Total;
                        return { results: data.Results, more: more };
                    }
                }
            });

        }
        function initBtn() {
            $('#btnRefresh').click(function () {
                //ShowList(-1);
                location.reload();
                //$('#btnViewFilter').click();
            });

            $('#completed').iCheck({
                checkboxClass: 'icheckbox_square-red',
                radioClass: 'iradio_square-red'
            }).on("ifChecked ifUnchecked", function (e) {
                var checked = e.type == "ifChecked" ? true : false;
            });
            $('#labelcheck').iCheck({
                checkboxClass: 'icheckbox_square-red',
                radioClass: 'iradio_square-red'
            }).on("ifChecked ifUnchecked", function (e) {
                var checked = e.type == "ifChecked" ? true : false;
            });

            $("#btnSave").click(function () {
               
                if (valid()) {

                    var YesFunc = function () {
                        Save();
                    };

                    c.MessageBoxConfirm("Saving...", "Are you sure you want to SAVE?", YesFunc);

                 
                }
            });
        }
        function clearAll() {
            LoadDashboard();
            c.ClearAllText();
            c.ClearAllSelect2();
            c.ClearAlliCheck();
            c.ClearSelect2('#select2outsidebag');
            c.Select2Clear('#select2Hospital');
        }

    }

    return {

        //main function to initiate 
        init: function () {
            // handles style customer tool
            handleScreenJs();

        }
    };

}();