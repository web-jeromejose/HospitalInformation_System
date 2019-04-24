var c = new Common();

jQuery(document).ready(function () {
    BulkAccess.init();
});


var BulkAccess = function () {

    var handleScript = function () {
        console.log('handleScript');
        var tblmoduleslist;
        var tbllistoffeaturepermodule;
        var tblfunc;
        var moduleid = 0;
        var featureid = 0;
        var modulename = "";


        // -----------------------------------------List of All Employees ------------------------------------------------------------------------------------------------------------------
        var LoadCPDocListItems = function () {
            var filter = {
                DeptId: $("#seldept").val() == "" ? "0" : $("#seldept").val()
                      , DesigId: $("#seldesignation").val() == "" ? "0" : $("#seldesignation").val()
                      , CatId: $("#selcategory").val() == "" ? "0" : $("#selcategory").val()
            };
            console.log(filter);
            console.log(JSON.stringify(filter));
            ajaxWrapper.Post($("#url").data("emp"), JSON.stringify(filter), function (x, e) {
                BindDashboardListofAllEmployee(x);
            });
        };
        var TblDashboardListofAllEmployee;
        var TblDashboardListofAllEmployeeId = '#DTlistofAllEmployees';
        var TblDashboardListofAllEmployeeDataRow;
        var ennDashboardListofAllEmployee = { Btn: 0, del: 1, ctr: 2, ID: 3, Name: 4, Edited: 5, Deleted: 6 };

        var Format24 = "HH:mm";
        var calcHeightDashboardListofAllEmployee = function () {
            return $(window).height() * 60 / 100;
        };

        function ShowDashboardRowCallDashboardListofAllEmployee() {
            var rc = function (nRow, aData) {
                var $nRow = $(nRow);
                $nRow.addClass("row_red");
                //if (aData["IPOPType"] === "IP") {
                //    //$('td:eq(3)', nRow).html("Yes");
                //    $nRow.addClass("row_blue");

                //}
                //if (aData["IPOPType"] === "OP") {
                //    //$('td:eq(3)', nRow).html("Yes");
                //    $nRow.addClass("row_green");

                //}
            };
            return rc;
        }
        function BindDashboardListofAllEmployee(data) {
            console.log('BindDashboardListofAllEmployee');
         
              TblDashboardListofAllEmployee = $(TblDashboardListofAllEmployeeId).DataTable({
                cache: false,
                destroy: true,
                data: data,
                paging: false,
                ordering: true,
                searching: true,
                //  info: false,
                scrollY: calcHeightDashboardListofAllEmployee(),
                scrollX: "1250px",
                sScrollXInner: "1250px",
                //processing: true,
                autoWidth: false,

                dom: '<"TbDashboardListofAllEmployee">Rlfrtip',
                //    scrollCollapse: false,
                 pageLength: 20,
                lengthChange: false,

                // order: [[1, "asc"]],
                columns: [
                   // { data: "", title: '', className: 'control-center', visible: true, searchable: false, width: "1px", defaultContent: '<button type="button" class="btn btn-sm btn-danger" Id="btnDetailsModif" title="Delete" rel="tooltip"> <i class="glyphicon glyphicon-trash"></i></button>' },
                    { data: "", title: ' --  ', className: '   ', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" class="control-center iCheck-helper highlight" id="checkisEmployee" />' },
                    { data: "EmployeeId", title: 'Employee ID', className: '   ', visible: true, searchable: true, width: "2%" },
                    { data: "FullName", title: 'Employee Name', className: '   ', visible: true, searchable: true, width: "20%" },
                    { data: "DeptName", title: 'Department', className: '   ', visible: true, searchable: true, width: "20%" },
                   { data: "Position", title: 'Position', className: '   ', visible: true, searchable: true, width: "10%" },
                    { data: "Category", title: 'Category', className: '   ', visible: true, searchable: true, width: "10%" },
                      { data: "DateHired", title: 'Hired Date', className: '   ', visible: true, searchable: true, width: "10%" },

                   //  { data: "", title: 'Service wise', className: '  ', visible: true, searchable: false, width: "1%", defaultContent: '<button type="button" class="btn btn-xs red">No</button>' },
                    //{ data: "Percentage", title: 'Percentage', className: 'ClassPercentageServices ', visible: true, searchable: true, width: "1%" },
                    //{ data: "StartDateTime", title: 'Start Date', className: ' ClassDOB  ', visible: true, searchable: true, width: "0%" },
                    // { data: "Deleted", title: 'Deleted', className: ' ClassYesorNo', visible: true, searchable: false, width: "0%" }
                    //{ data: "StationId", title: 'StationId', className: '', visible: false, searchable: false, width: "0%" },
                    //{ data: "RoleId", title: 'RoleId', className: '', visible: false, searchable: false, width: "0%" },
                    { data: "Userid", title: ' ', className: '', visible: false, searchable: false, width: "0%" }
                ],
                  fnRowCallback: ShowDashboardRowCallDashboardListofAllEmployee()
            });

           
              LoadModuleList();

            var btns = '';
            var toolbar = btns.concat(
                 '<div style="float:left;">'
                    , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnCheckAllFunctions"> <i class="glyphicon glyphicon-check"></i> All </button>'
                    , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnUNCheckAllFunctions"> <i class="glyphicon glyphicon-unchecked"></i> All </button>'
                 , '</div>'
             , '<div style="float:right;">'
                  , '</div>'


              , '<br><br>');
             $("div.TbDashboardListofAllEmployee").html(toolbar);

            $('#btnCheckAllFunctions').click(function () {
                $('#preloader').show();
                $.each(TblDashboardListofAllEmployee.rows().data(), function (i, row) {
                    TblDashboardListofAllEmployee.cell(i, 0).data('<input id="checkisEmployee" type="checkbox" checked="checked" >');
                });
                $('#preloader').hide();
            });
            $('#btnUNCheckAllFunctions').click(function () {
                $('#preloader').show();
                $.each(TblDashboardListofAllEmployee.rows().data(), function (i, row) {
                    TblDashboardListofAllEmployee.cell(i, 0).data('<input id="checkisEmployee" type="checkbox">');
                });
                $('#preloader').hide();

            });
            $('#btnApplyPercentage').click(function () {
                $('#preloader').show();
                var percentage = $('#PercentageService').val();
                $.each(TblDashboardListofAllEmployee.rows().data(), function (i, row) {
                    TblDashboardListofAllEmployee.cell(i, 3).data(percentage);
                });
                $('#preloader').hide();
            });


            $(TblDashboardListofAllEmployeeId + ' tbody').on('click', '#checkisEmployee', function (e) {
                var $cell = $(this).closest('td');
                var $row = $(this).closest('tr');
                var Tbl = TblDashboardListofAllEmployee;
                var data = Tbl.row($row).data();
                var rowId = data[0];
                var col = Tbl.cell($(this).closest('td')).index();
                if (this.checked) {
                    $row.removeClass("row_red");
                    $row.addClass("row_green");
                } else {
                    $row.removeClass("row_green");
                    $row.addClass("row_red");
                }
                e.stopPropagation();
            });
        }

        
        // -----------------------------------------------------------------------------------------------------------------------------------------------------------

        function LoadModuleList() {
          
            ajaxWrapper.Get($("#url").data("allmodulelist"), {  }, function (x, e) {
           
               
                tblmoduleslist = $("#DTlistofAllModules").DataTable({
                    destroy: true,
                    paging: false,
                    searching: true,
                    ordering: true,
                    info: false,
                    data: x,
                    bAutoWidth: false,
                    scrollY: calcHeightDashboardListofAllEmployee(),
                    scrollX: "400px",
                    sScrollXInner: "400px",
                    columns: [
                        
                          { data: "text", title: 'Name', className: '   ', visible: true, searchable: true, width: "1%" },
                           { data: "id", title: '', className: ' _add  ', visible: true, searchable: true, width: "2%" },
                         //{ data: "id", className: "_add" }
                    ],
                    fnCreatedRow: function (nRow, aData, iDataIndex) {
                        $('td:eq(1)', nRow).html("<button class='btn btn-primary'>Add</button>");
                        $('td:eq(0)', nRow).addClass("row_green");
                    }
                });
            });
        }

        function listoffeaturepermodule(moduleid) {
            
            ajaxWrapper.Get($("#url").data("modaccessfeat"), { mod: moduleid }, function (x, e) {
                tbllistoffeaturepermodule = $("#DTlistofAllFeature").DataTable({
                        destroy: true,
                        paging: false,
                        searching: true,
                        ordering: true,
                        info: false,
                        data: x,
                        bAutoWidth: false,
                        scrollY: calcHeightDashboardListofAllEmployee(),
                        scrollX: "830px",
                        sScrollXInner: "830px",
                        columns: [
                             { data: "FeatureID", title: 'Feat ID', className: '   ', visible: true, searchable: true, width: "1%" },
                             { data: "ParentName", title: 'Menu Name', className: '   ', visible: true, searchable: true, width: "10%" },
                             { data: "FeatureName", title: 'Feat Name', className: '   ', visible: true, searchable: true, width: "10%" },
                             { data: "HasAccess", title: 'Access', className: '   ', visible: true, searchable: true, width: "5%" },
                             { data: "FID", title: ' ', className: ' _add   ', visible: true, searchable: true, width: "1%" },
                             { data: "FID", title: ' ', className: ' _remove   ', visible: true, searchable: true, width: "1%" },
                             { data: "FID", title: ' ', className: ' _functions   ', visible: true, searchable: true, width: "1%" },
 


                        ],
                        fnCreatedRow: function (nRow, aData, iDataIndex) {
                            $('td:eq(3)', nRow).html("No");
                            var $nRow = $(nRow); // cache the row wrapped up in jQuery
                            $nRow.addClass("row_red");
                            if (aData["HasAccess"] != "0") {
                                $('td:eq(3)', nRow).html("Yes");
                                $nRow.addClass("row_green");
                            }
                            $('td:eq(4)', nRow).html("<button class='btn btn-sm btn-success'>Add</button>");
                            $('td:eq(5)', nRow).html("<button class='btn btn-sm btn-danger'>Remove</button>");
                            $('td:eq(6)', nRow).html("<button class='btn btn-sm btn-info'>Function</button>");
                        }
                    });
                });

        }

        function LoadUserFunctions(id) {
            ajaxWrapper.Get($("#url").data("getusrfuncfeat"), { feat: id }, function (x, e) {
                console.log(x);
                tblfunc = $("#tblfeaturefunc").DataTable({
                    destroy: true,
                    paging: false,
                    searching: true,
                    ordering: true,
                    info: false,
                    data: x,
                    bAutoWidth: false,
                    columns: [
                         { data: "id", className: "_add" },
                         { data: "id", className: "_remove" },
                         { data: "id" },
                         { data: "text" }
                    ],
                    fnCreatedRow: function (nRow, aData, iDataIndex) {
                        var $nRow = $(nRow); // cache the row wrapped up in jQuery
                        $nRow.addClass("row_red");
                        if (aData["HasAccess"] == "Yes") {
                            $nRow.addClass("row_green");
                        }
                        $('td:eq(0)', nRow).html("<button class='btn btn-sm btn-success'>Add</button>");
                        $('td:eq(1)', nRow).html("<button class='btn btn-sm btn-danger'>Remove</button>");
                    }
                });
            });
        }


        function initDT() {
            LoadCPDocListItems();
        }
        function adduserfeat(deleted, FeatureID)
        {
                var entry;
                entry = []
                entry = {}

                entry.ModuleId = moduleid;
                entry.FeatureId = FeatureID;
                entry.Deleted = deleted;
                entry.EmployeeSelectedList = [];
                var rowcollection = TblDashboardListofAllEmployee.$("#checkisEmployee:checked", { "page": "all" });
                rowcollection.each(function (index, elem) {
                    var tr = $(elem).closest('tr');
                    var row = TblDashboardListofAllEmployee.row(tr);
                    var rowdata = row.data();
               
                    entry.EmployeeSelectedList.push({
                        Userid: rowdata.Userid
                    });
                });
                console.log('entry');
                console.log(entry);

                $('#preloader').show();
                $.ajax({
                    url: $('#url').data("adduserfeat"),
                    data: JSON.stringify(entry),
                    type: 'post',
                    cache: false,
                    contentType: "application/json; charset=utf-8",
                    beforeSend: function () {

                    },
                    success: function (data) {
                        $('#preloader').hide();
                        if (data.ErrorCode == 0) {
                            c.MessageBoxErr("Error...", data.Message);
                            return;
                        }

                        NotifySuccess(data.Message, "Module");
                    },
                    error: function (xhr, desc, err) {

                        var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
                        c.MessageBox("Error...", errMsg, null);
                    }
                });

        }

        function adduserfunction(functionid,deleted)
        {


           

            var entry;
            entry = []
            entry = {}

            entry.ModuleId = moduleid;
            entry.FeatureId = featureid;
            entry.FunctionId = functionid;
            entry.Deleted = deleted;
   
            entry.EmployeeSelectedList = [];
            var rowcollection = TblDashboardListofAllEmployee.$("#checkisEmployee:checked", { "page": "all" });
            rowcollection.each(function (index, elem) {
                var tr = $(elem).closest('tr');
                var row = TblDashboardListofAllEmployee.row(tr);
                var rowdata = row.data();

                entry.EmployeeSelectedList.push({
                    Userid: rowdata.Userid
                });
            });
            console.log('entry');
            console.log(entry);

            $('#preloader').show();
            $.ajax({
                url: $('#url').data("upduserfunc"),
                data: JSON.stringify(entry),
                type: 'post',
                cache: false,
                contentType: "application/json; charset=utf-8",
                beforeSend: function () {

                },
                success: function (data) {
                    $('#preloader').hide();
                    if (data.ErrorCode == 0) {
                        c.MessageBoxErr("Error...", data.Message);
                        return;
                    }

                    NotifySuccess(data.Message, "Module");
                },
                error: function (xhr, desc, err) {

                    var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
                    c.MessageBox("Error...", errMsg, null);
                }
            });

                
            }

        function initOnClick()
        {
            $(document).on("click", "#DTlistofAllModules td", function () {
                var d = tblmoduleslist.row($(this).parents('tr')).data();
                var mod = d.id;
                moduleid = d.id
                modulename = d.text;
                $("#url").data("modidusr", mod);
                $(this).closest("tr").addClass("row_red");
                if ($(this).hasClass('_add')) {
                    console.log('mod' + mod);
                    
                    var YesFunc = function () {
                        $('#preloader').show();
                        var entry;
                        entry = []
                        entry = {}
                       
                        entry.ModuleId = mod;
                        entry.EmployeeSelectedList = [];
                        var rowcollection = TblDashboardListofAllEmployee.$("#checkisEmployee:checked", { "page": "all" });
                        rowcollection.each(function (index, elem) {
                            var tr = $(elem).closest('tr');
                            var row = TblDashboardListofAllEmployee.row(tr);
                            var rowdata = row.data();
                          
                            entry.EmployeeSelectedList.push({
                                Userid: rowdata.Userid
                            });
                        });
                        console.log('entry');
                        console.log(entry);

                      
                     $.ajax({
                            url: $('#url').data("savemoduleemployee"),
                            data: JSON.stringify(entry),
                            type: 'post',
                            cache: false,
                            contentType: "application/json; charset=utf-8",
                            beforeSend: function () {
 
                            },
                            success: function (data) {
                                
                                if (data.ErrorCode == 0) {
                                    c.MessageBoxErr("Error...", data.Message);
                                    return;
                                }

                                var OkFunc = function () {
                                    listoffeaturepermodule(mod);
                                };
                                $('#preloader').hide();
                                c.MessageBox(data.Title, 'Update the Feature Funtion in ' + modulename + '.<br> click <b>ADD</b> and  <b>REMOVE</b> in each feature name for access. <br> You can also select the  <b>FUNCTION</b> list in each feature. <br> Take Note: this is a bulk update. Please verify carefully.', OkFunc);
                            },
                            error: function (xhr, desc, err) {
                               
                                var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
                                c.MessageBox("Error...", errMsg, null);
                            }
                        }); 


                    };
                    c.MessageBoxConfirm("Add Module", "Are you sure you want to add this module name -<b>" + modulename + "</b>  ?", YesFunc, null);


                    //ajaxWrapper.Get($("#url").data("delusermod"), { "id": $("#txtemp").val(), "mod": mod }, function (x, e) {
                    //    NotifySuccess(x, "Module");
                    //    LoadUserModule($("#txtemp").val());
                    //});
                }
                else {
                   // LoadUserFeatures(mod);
                }
            });

            $(document).on("click", "#DTlistofAllFeature td", function () {
                if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {

                    var d = tbllistoffeaturepermodule.row($(this).parents('tr')).data();
                    featureid = d.FID;
                    if (featureid == 0) { alert('feature id = 0 '); }
                    console.log(featureid);

                    if ($(this).hasClass('_add')) {
                        $(this).closest("tr").removeClass("row_green");
                        $(this).closest("tr").removeClass("row_red");

                        $(this).closest("tr").addClass("row_green");
                        $(this).closest("tr").find('td:eq(3)').text("Yes");
 
                            adduserfeat(0, d.FID);
                        
                    }
                    if ($(this).hasClass('_remove')) {

                        $(this).closest("tr").removeClass("row_green");
                        $(this).closest("tr").removeClass("row_red");

                        $(this).closest("tr").addClass("row_red");
                        $(this).closest("tr").find('td:eq(3)').text("No");
                   
                            adduserfeat(1, d.FID);
                        
                    }
                    if ($(this).hasClass('_functions')) {
                        LoadUserFunctions(d.FID);

                        $("#modal-func").modal({ "keyboard": true });
                        $("#url").data("funcfeatadd", d.FeatureID);
                    }

                }
            });

            $(document).on("click", "#tblfeaturefunc td", function () {
                if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {

                    var d = tblfunc.row($(this).parents('tr')).data();
                    $(this).closest("tr").removeClass("row_green");
                    $(this).closest("tr").removeClass("row_red");

                    if ($(this).hasClass('_add')) {
                        $(this).closest("tr").addClass("row_green");
                        adduserfunction(d.id,0);
                        //ajaxWrapper.Get($("#url").data("upduserfunc"), { "id": d.name, "func": d.id, "feat": $("#url").data("funcfeatadd"), "mod": $("#url").data("modidusr"), "usr": $("#txtemp").val(), "del": "0" }, function (x, e) {
                        //    NotifySuccess(x, "Module");
                        //    LoadUserFunctions($("#url").data("funcfeatadd"));
                        //});
                    }
                    if ($(this).hasClass('_remove')) {
                        $(this).closest("tr").addClass("row_red");
                        adduserfunction(d.id, 1);
                        //ajaxWrapper.Get($("#url").data("upduserfunc"), { "id": d.name, "func": d.id, "feat": $("#url").data("funcfeatadd"), "mod": $("#url").data("modidusr"), "usr": $("#txtemp").val(), "del": "1" }, function (x, e) {
                        //    NotifySuccess(x, "Module");
                           
                        //    LoadUserFunctions($("#url").data("funcfeatadd"));
                        //});
                    }
                     
                }
            });

            
            $(document).on("click", "#btnSearch", function () {
                LoadCPDocListItems();
            });


        }

        function initSelect2() {
            ajaxWrapper.Get($("#url").data("getdepartmentlist"), null, function (xx, e) {
                Sel2Client($("#seldept"), xx, function (x) {
                });
 
            });
            ajaxWrapper.Get($("#url").data("getdesignation"), null, function (xx, e) {
                Sel2Client($("#seldesignation"), xx, function (x) {
                });

            });
            ajaxWrapper.Get($("#url").data("getcategory"), null, function (xx, e) {
                Sel2Client($("#selcategory"), xx, function (x) {
                });

            });

        }

     
        initDT();
        initOnClick();
        initSelect2();

    }

    return {
        //main function to initiate the module
        init: function () {

            handleScript();

        }

    };

}();