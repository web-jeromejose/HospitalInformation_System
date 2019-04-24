var c = new Common();

jQuery(document).ready(function () {


   
    comissionProfile.init();

});


/******************************************************* ********************* VIEW CP ***************************************************************************/
var comissionProfile = function () {

    // Handle Theme Settings
    var handleJS = function () {

        var errorloop = 0;
        // -----------------------------------------CP Service TAB------------------------------------------------------------------------------------------------------------------
        SetupServicesTab();
        BindDashboardServicesTab([]);
        var LoadServicesTab = function (ipOrop, docid) {
        
            ajaxWrapper.Get($("#url").data("comissionprofileservicestab"), { type: ipOrop, docid: $('#sel2alldoctor').val() }, function (x, e) {
                BindDashboardServicesTab(x.list);

            });
        };
        var TblDashboardServicesTab;
        var TblDashboardServicesTabId = '#DTviewCPServicesTab';
        var TblDashboardServicesTabDataRow;
        var ennDashboardServicesTab = { Btn: 0, del: 1, ctr: 2, ID: 3, Name: 4, Edited: 5, Deleted: 6 };

        var Format24 = "HH:mm";
        function calcHeightDashboardServicesTab() {
            return $(window).height() * 60 / 100;
        };
        function ShowDashboardRowCallDashboardServicesTab() {
            var rc = function (nRow, aData) {
                var $nRow = $(nRow);

                if (aData.isService == "1") {
                    $('#checkisService', nRow).prop('checked', true);
                    $('td:eq(2)', nRow).html('<button type="button" class="btn btn-xs green">Yes</button>');
                }

            };
            return rc;
        }
        function BindDashboardServicesTab(data) {

            // http://legacy.datatables.net/release-datatables/examples/basic_init/scroll_x.html
            TblDashboardServicesTab = $(TblDashboardServicesTabId).DataTable({
                cache: false,
                destroy: true,
                data: data,
                paging: false,
                ordering: true,
                searching: false,
                //  info: false,
                scrollY: calcHeightDashboardServicesTab(),
                scrollX: "820px",
                sScrollXInner: "820px",
                //processing: true,
                autoWidth: false,

                //   dom: '<"tbDashboardDeptTabServiceList">Rlfrtip',
                //    scrollCollapse: false,
                //pageLength: 20,
                lengthChange: false,

               // order: [[1, "asc"]],
                columns: [
                   // { data: "", title: '', className: 'control-center', visible: true, searchable: false, width: "1px", defaultContent: '<button type="button" class="btn btn-sm btn-danger" Id="btnDetailsModif" title="Delete" rel="tooltip"> <i class="glyphicon glyphicon-trash"></i></button>' },
                    { data: "", title: ' --  ', className: '   ', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" class="control-center iCheck-helper highlight" id="checkisService" />' },
                    { data: "Name", title: 'Service Name', className: '   ', visible: true, searchable: true, width: "10%" },
                     { data: "", title: 'Service wise', className: '  ', visible: true, searchable: false, width: "1%", defaultContent: '<button type="button" class="btn btn-xs red">No</button>' },

                    { data: "Percentage", title: 'Percentage', className: 'ClassPercentageService ', visible: true, searchable: true, width: "1%" },
                    { data: "Amount", title: 'Amount ', className: 'ClassAmountService ', visible: true, searchable: true, width: "1%" },
                    //{ data: "StartDateTime", title: 'Start Date', className: ' ClassDOB  ', visible: true, searchable: true, width: "0%" },
                    // { data: "Deleted", title: 'Deleted', className: ' ClassYesorNo', visible: true, searchable: false, width: "0%" }
                    //{ data: "StationId", title: 'StationId', className: '', visible: false, searchable: false, width: "0%" },
                    //{ data: "RoleId", title: 'RoleId', className: '', visible: false, searchable: false, width: "0%" },
                    //{ data: "ModuleId", title: 'ModuleId', className: '', visible: false, searchable: false, width: "0%" }
                ],
                fnRowCallback: ShowDashboardRowCallDashboardServicesTab()
            });

            InitServicesTab();

            var btns = '';
            var toolbar = btns.concat(
                 '<div style="float:left;">'
                 , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnCheckAllFunctions"> <i class="glyphicon glyphicon-check"></i> All </button>'
                , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnUNCheckAllFunctions"> <i class="glyphicon glyphicon-unchecked"></i> All </button>'
                , '</div><br><br>');
            //$("div.tbDashboardServicesTab").html(toolbar);

            $('#btnCheckAllFunctions').click(function () {
                $('#preloader').show();
                $.each(TblDashboardServicesTab.rows().data(), function (i, row) {
                    TblDashboardServicesTab.cell(i, 0).data('<input id="checkFunctionConfigRole" type="checkbox" checked="checked" >');
                });
                $('#preloader').hide();
            });
            $('#btnUNCheckAllFunctions').click(function () {
                $('#preloader').show();
                $.each(TblDashboardServicesTab.rows().data(), function (i, row) {
                    TblDashboardServicesTab.cell(i, 0).data('<input id="checkFunctionConfigRole" type="checkbox">');
                });
                $('#preloader').hide();

            });

            $(TblDashboardServicesTabId + ' tbody').on('click', '#checkFunctionConfigRole', function (e) {
                var $cell = $(this).closest('td');
                var $row = $(this).closest('tr');
                var Tbl = TblDashboardServicesTab;
                var data = Tbl.row($row).data();
                var rowId = data[0];
                var col = Tbl.cell($(this).closest('td')).index();
                if (this.checked) {
                    $row.addClass("row_green");
                } else {
                    $row.removeClass("row_green");
                }
                e.stopPropagation();
            });
        }
        function SetupServicesTab() {

            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $.editable.addInputType('EditableYesNo', {
                element: function (settings, original) {
                    //  var input = $('<input id="dtS2YesNo" style="width:100%; height:30px;" type="text" class="form-control">');
                    var input = $('<select id="dtS2YesNo" class="form-control input-xs select2me input-sm" data-placeholder="Select..."> <option value="1">Yes</option> <option value="0">No</option> </select>');
                    $(this).append(input);
                    return (input);
                },
                plugin: function (settings, original) {

                },
                submit: function (settings, original) {
                    console.log($("#dtS2YesNo", this).select2("data").name);
                    console.log($("#dtS2YesNo", this).select2("data"));
                    if ($("#dtS2YesNo", this).select2('val') != null && $("#dtS2YesNo", this).select2('val') != '') {

                        $("input", this).val($("#dtS2YesNo", this).select2("data").name);
                    }
                }
            });
            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $.editable.addInputType('EditableName', {
                element: function (settings, original) {

                    var input = $('<input id="dtTxtName" style="width:100%; height:30px; margin:0px, padding:0px;" type="text" class="form-control">');
                    $(this).append(input);

                    return (input);
                }
            });
            $.editable.addInputType('EditableDeleted', {
                element: function (settings, original) {

                    var input = $('<input id="dtTxtDeleted" style="width:100%; height:30px; margin:0px, padding:0px;" type="number" class="form-control">');
                    $(this).append(input);

                    return (input);
                }
            });

            // ------------ ------------------------------------------------------------------------------------------------------------------------------------------------
            $.editable.addInputType('EditablePercentageService', {
                element: function (settings, original) {

                    var input = $('<input id="dtTxtPercentageService" style="width:100%; height:30px; margin:0px, padding:0px;" type="number" class="form-control">');
                    $(this).append(input);

                    return (input);
                }
            });
            // ------------ ------------------------------------------------------------------------------------------------------------------------------------------------
            $.editable.addInputType('EditableAmountService', {
                element: function (settings, original) {

                    var input = $('<input id="dtTxtAmountService" style="width:100%; height:30px; margin:0px, padding:0px;" type="number" class="form-control">');
                    $(this).append(input);

                    return (input);
                }
            });

            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $.editable.addInputType('EditableDOB', {
                element: function (settings, original) {
                    var input = $('<input id="dtDateDOB" style="width:100%; height:30px;" type="text" class="form-control date" data-date-format="DD-MMM-YYYY"/>');
                    $(this).append(input);

                    return (input);
                },
                plugin: function (settings, original) {
                    $(this).find('#dtDateDOB')
                            .datetimepicker({
                                pickTime: false
                            });
                }
            });
            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $.editable.addInputType('EditableRelationship', {
                element: function (settings, original) {
                    var input = $('<input id="dtS2Relationship" style="width:100%; height:30px;" type="text" class="form-control">');
                    $(this).append(input);

                    return (input);
                },
                plugin: function (settings, original) {
                    var select2 = $(this).find('#dtS2Relationship').select2({
                        allowClear: false,
                        ajax: {
                            cache: false,
                            type: 'GET',
                            dataType: "json",
                            url: $('#UrlEntry').data('s2relationship'),
                            data: function (searchTerm) {
                                return { search: searchTerm };
                            },
                            results: function (data) {
                                return { results: data };
                            }
                        },
                        dropdownAutoWidth: true,
                        formatResult: function (data) {
                            var markup = "<table><tr>";
                            if (data.name !== undefined) {
                                markup += "<td>" + data.text + "</td>";
                            }
                            markup += "</td></tr></table>"
                            return markup;
                        }
                    }).on("select2-blur", function () {
                        $("#dtS2Relationship").closest('td').get(0).reset();
                    }).on('select2-close', function () {
                        if (Select2IsClicked) { $("#dtS2Relationship").closest('form').submit(); }
                        else { $("#dtS2Relationship").closest('td').get(0).reset(); }
                        Select2IsClicked = false;
                    }).on("select2-focus", function (e) {
                        var a = $(this).closest('tr').find('#dtS2Relationship').val();
                        $("#dtS2Relationship").select2("data", { id: a, text: a });
                    }).data('select2');

                    select2.onSelect = (function (fn) {
                        return function (data, options) {
                            var target;
                            if (options != null) {
                                target = $(options.target);
                            }
                            Select2IsClicked = true;
                            return fn.apply(this, arguments);
                        }
                    })(select2.onSelect);


                },
                submit: function (settings, original) {
                    if ($("#dtS2Relationship", this).select2('val') != null && $("#dtS2Relationship", this).select2('val') != '') {
                        $("input", this).val($("#dtS2Relationship", this).select2("data").text);

                    }
                }
            });
            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $.editable.addInputType('EditableEligibility', {
                element: function (settings, original) {
                    var input = $('<input id="dtS2Eligibility" style="width:100%; height:30px;" type="text" class="form-control">');
                    $(this).append(input);

                    return (input);
                },
                plugin: function (settings, original) {
                    var select2 = $(this).find('#dtS2Eligibility').select2({
                        minimumResultsForSearch: -1,
                        minimumInputLength: 0,
                        allowClear: true,
                        data: [
                            { id: 1, text: 'Half' },
                            { id: 2, text: 'Full' }
                        ]
                    }).on("select2-blur", function () {
                        $("#dtS2Eligibility").closest('td').get(0).reset();
                    }).on('select2-close', function () {
                        if (Select2IsClicked) { $("#dtS2Eligibility").closest('form').submit(); }
                        else { $("#dtS2Eligibility").closest('td').get(0).reset(); }
                        Select2IsClicked = false;
                    }).on("select2-focus", function (e) {
                        var a = $(this).closest('tr').find('#dtS2Eligibility').val();
                        $("#dtS2Eligibility").select2("data", { id: a, text: a });
                    }).data('select2');

                    select2.onSelect = (function (fn) {
                        return function (data, options) {
                            var target;
                            if (options != null) {
                                target = $(options.target);
                            }
                            Select2IsClicked = true;
                            return fn.apply(this, arguments);
                        }
                    })(select2.onSelect);


                },
                submit: function (settings, original) {
                    if ($("#dtS2Eligibility", this).select2('val') != null && $("#dtS2Eligibility", this).select2('val') != '') {
                        $("input", this).val($("#dtS2Eligibility", this).select2("data").text);

                    }
                }
            });
            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $.editable.addInputType('EditableRoute', {
                element: function (settings, original) {
                    var input = $('<input id="dtS2Route" style="width:100%; height:30px;" type="text" class="form-control">');
                    $(this).append(input);

                    return (input);
                },
                plugin: function (settings, original) {
                    var select2 = $(this).find('#dtS2Route').select2({
                        allowClear: false,
                        ajax: {
                            cache: false,
                            type: 'GET',
                            dataType: "json",
                            url: $('#UrlEntry').data('s2sectors'),
                            data: function (searchTerm) {
                                return { search: searchTerm };
                            },
                            results: function (data) {
                                return { results: data };
                            }
                        },
                        dropdownAutoWidth: true,
                        formatResult: function (data) {
                            var markup = "<table><tr>";
                            if (data.name !== undefined) {
                                markup += "<td>" + data.text + "</td>";
                            }
                            markup += "</td></tr></table>"
                            return markup;
                        }
                    }).on("select2-blur", function () {
                        $("#dtS2Route").closest('td').get(0).reset();
                    }).on('select2-close', function () {
                        if (Select2IsClicked) { $("#dtS2Route").closest('form').submit(); }
                        else { $("#dtS2Route").closest('td').get(0).reset(); }
                        Select2IsClicked = false;
                    }).on("select2-focus", function (e) {
                        var a = $(this).closest('tr').find('#dtS2Route').val();
                        $("#dtS2Route").select2("data", { id: a, text: a });
                    }).data('select2');

                    select2.onSelect = (function (fn) {
                        return function (data, options) {
                            var target;
                            if (options != null) {
                                target = $(options.target);
                            }
                            Select2IsClicked = true;
                            return fn.apply(this, arguments);
                        }
                    })(select2.onSelect);


                },
                submit: function (settings, original) {
                    if ($("#dtS2Route", this).select2('val') != null && $("#dtS2Route", this).select2('val') != '') {
                        $("input", this).val($("#dtS2Route", this).select2("data").text);

                    }
                }
            });
            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $.editable.addInputType('EditableTicket', {
                element: function (settings, original) {
                    //var input = $('<input id="dtChkTicket" type="checkbox" checked>');
                    var input = $('<input id="dtChkTicket" type="checkbox" checked data-toggle="toggle" data-style="ios" data-size="mini" data-onstyle="success" data-offstyle="danger">');
                    $(this).append(input);

                    return (input);
                },
                plugin: function (settings, original) {
                    $(this).find('#dtChkTicket')
                            .bootstrapToggle({
                                "on": "yes",
                                "off": "no"
                            });
                }
            });
            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
        }
        function InitServicesTab() {


            var Tbl = TblDashboardServicesTab;

            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $('.ClassYesorNo', Tbl.rows().nodes()).editable(function (sVal, settings) {


                var cell = Tbl.cell($(this).closest('td')).index();
                //var id = $('#dtS2Approver').select2('data').id;
                //var name = $('#dtS2Approver').select2('data').RelName;
                //var age = $('#dtS2Approver').select2('data').Age;
                //var dob = $('#dtS2Approver').select2('data').dob;
                Tbl.cell(cell.row, cell.column).data(sVal);
                //Tbl.cell(cell.row, ennTicket.id).data(id);
                //Tbl.cell(cell.row, ennTicket.dob).data(dob);
                //Tbl.cell(cell.row, ennTicket.RelName).data(name);
                //Tbl.cell(cell.row, ennTicket.Age).data(age);


                return sVal;
            },
            {
                "type": 'EditableYesNo', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
                "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
            });

            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $('.ClassName', Tbl.rows().nodes()).editable(function (sVal, settings) {
                var cell = Tbl.cell($(this).closest('td')).index();
                Tbl.cell(cell.row, cell.column).data(sVal);
                return sVal;
            },
            {
                "type": 'EditableName', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
                "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
            });
            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $('.ClassDeleted', Tbl.rows().nodes()).editable(function (sVal, settings) {
                var cell = Tbl.cell($(this).closest('td')).index();
                Tbl.cell(cell.row, cell.column).data(sVal);
                return sVal;
            },
            {
                "type": 'EditableDeleted', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
                "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
            });

            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $('.ClassPercentageService', Tbl.rows().nodes()).editable(function (sVal, settings) {
                var cell = Tbl.cell($(this).closest('td')).index();
                Tbl.cell(cell.row, cell.column).data(sVal);
                return sVal;
            },
            {
                "type": 'EditablePercentageService', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
                "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
            });


            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $('.ClassAmountService', Tbl.rows().nodes()).editable(function (sVal, settings) {
                var cell = Tbl.cell($(this).closest('td')).index();
                Tbl.cell(cell.row, cell.column).data(sVal);
                return sVal;
            },
            {
                "type": 'EditableAmountService', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
                "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
            });

            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $('.ClassDOB', Tbl.rows().nodes()).editable(function (sVal, settings) {
                var cell = Tbl.cell($(this).closest('td')).index();
                Tbl.cell(cell.row, cell.column).data(sVal);

                //if (sVal.trim().length > 0) {
                //    var age = c.GetAge(sVal);
                //    Tbl.cell(cell.row, ennTicket.Age).data(age);
                //}

                return sVal;
            },
            {
                "type": 'EditableDOB', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
                "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
            });
            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $('.ClassS2Relationship', Tbl.rows().nodes()).editable(function (sVal, settings) {
                var cell = Tbl.cell($(this).closest('td')).index();
                var id = c.GetSelect2Id('#dtS2Relationship');
                Tbl.cell(cell.row, ennTicket.RelationshipID).data(id);
                Tbl.cell(cell.row, cell.column).data(sVal);

                return sVal;
            },
            {
                "type": 'EditableRelationship', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
                "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
            });
            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $('.ClassS2Eligibility', Tbl.rows().nodes()).editable(function (sVal, settings) {
                var cell = Tbl.cell($(this).closest('td')).index();
                var id = c.GetSelect2Id('#dtS2Eligibility');
                Tbl.cell(cell.row, ennTicket.EligibleID).data(id);
                Tbl.cell(cell.row, cell.column).data(sVal);

                return sVal;
            },
            {
                "type": 'EditableEligibility', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
                "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
            });
            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $('.ClassS2Route', Tbl.rows().nodes()).editable(function (sVal, settings) {
                var cell = Tbl.cell($(this).closest('td')).index();
                var id = c.GetSelect2Id('#dtS2Route');
                Tbl.cell(cell.row, ennTicket.RouteID).data(id);
                Tbl.cell(cell.row, cell.column).data(sVal);

                return sVal;
            },
            {
                "type": 'EditableRoute', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
                "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
            });
            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $('.ClassTicket', Tbl.rows().nodes()).editable(function (event, state) {
                var cell = Tbl.cell($(this).closest('td')).index();
                Tbl.cell(cell.row, ennTicket.TicketEnt).data(state === true ? 1 : 0);

            },
            {
                "type": 'EditableTicket', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
                "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
            });
            // ------------------------------------------------------------------------------------------------------------------------------------------------------------


        }

        // -----------------------------------------------------------------------------------------------------------------------------------------------------------




        // -----------------------------------------CP department TAB------------------------------------------------------------------------------------------------------------------
        SetupDeptTab();
        var LoadDeptTabServiceList = function (ipOrop, deptServiceId) {
            console.log('LoadDeptTabServiceList');
            console.log(ipOrop);
            console.log(deptServiceId);
            ajaxWrapper.Get($("#url").data("comissionprofiledepartmenttab"), { type: ipOrop, serviceId: deptServiceId, docid: $('#sel2alldoctor').val() }, function (x, e) {
                BindDashboardDeptTabServiceList(x.list);
            });
        };
        var TblDashboardDeptTabServiceList;
        var TblDashboardDeptTabServiceListId = '#DTviewCPDeptTabServiceList';
        var TblDashboardDeptTabServiceListDataRow;
        var ennDashboardDeptTabServiceList = { Btn: 0, del: 1, ctr: 2, ID: 3, Name: 4, Edited: 5, Deleted: 6 };

        var Format24 = "HH:mm";
        var calcHeightDashboardDeptTabServiceList = function () {
            return $(window).height() * 60 / 100;
        };
        function ShowDashboardRowCallDashboardDeptTabServiceList() {
            var rc = function (nRow, aData) {
                var $nRow = $(nRow);
                if (aData.isDept == "1") {
                    $('#checkisDept', nRow).prop('checked', true);
                    $('td:eq(2)', nRow).html('<button type="button" class="btn btn-xs green">Yes</button>');
                }


            };
            return rc;
        }
        function BindDashboardDeptTabServiceList(data) {

            // http://legacy.datatables.net/release-datatables/examples/basic_init/scroll_x.html
            TblDashboardDeptTabServiceList = $(TblDashboardDeptTabServiceListId).DataTable({
                cache: false,
                destroy: true,
                data: data,
                paging: false,
                ordering: true,
                searching: false,
                //  info: false,
                scrollY: calcHeightDashboardDeptTabServiceList(),
                scrollX: "820px",
                sScrollXInner: "820px",
                //processing: true,
                autoWidth: false,

                //   dom: '<"tbDashboardDeptTabServiceList">Rlfrtip',
                //    scrollCollapse: false,
                //pageLength: 20,
                lengthChange: false,
                columns: [
                   // { data: "", title: '', className: 'control-center', visible: true, searchable: false, width: "1px", defaultContent: '<button type="button" class="btn btn-sm btn-danger" Id="btnDetailsModif" title="Delete" rel="tooltip"> <i class="glyphicon glyphicon-trash"></i></button>' },
                    { data: "", title: ' -- ', className: ' input-xs ', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" class="control-center iCheck-helper highlight" id="checkisDept" />' },
                    { data: "Name", title: 'Department Name', className: ' input-xs   ', visible: true, searchable: true, width: "20%" },
                     { data: "", title: 'Department-Wise', className: ' input-xs ', visible: true, searchable: false, width: "1%", defaultContent: '<button type="button" class="btn btn-xs red">No</button>' },

                    { data: "Percentage", title: 'Percentage', className: 'ClassPercentageDept ', visible: true, searchable: true, width: "1%" },
                    { data: "Amount", title: 'Amount', className: 'ClassAmountDept ', visible: true, searchable: true, width: "1%" },
                    //{ data: "StartDateTime", title: 'Start Date', className: ' ClassDOB  ', visible: true, searchable: true, width: "0%" },
                    // { data: "Deleted", title: 'Deleted', className: ' ClassYesorNo', visible: true, searchable: false, width: "0%" }
                    //{ data: "StationId", title: 'StationId', className: '', visible: false, searchable: false, width: "0%" },
                    //{ data: "RoleId", title: 'RoleId', className: '', visible: false, searchable: false, width: "0%" },
                    //{ data: "ModuleId", title: 'ModuleId', className: '', visible: false, searchable: false, width: "0%" }
                ],
                fnRowCallback: ShowDashboardRowCallDashboardDeptTabServiceList()
            });


            InitDeptTab();
            var btns = '';
            var toolbar = btns.concat(
                 '<div style="float:left;">'
                 , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnCheckAllFunctions"> <i class="glyphicon glyphicon-check"></i> All </button>'
                , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnUNCheckAllFunctions"> <i class="glyphicon glyphicon-unchecked"></i> All </button>'
                , '</div><br><br>');
            //$("div.tbDashboardDeptTabServiceList").html(toolbar);

            $('#btnCheckAllFunctions').click(function () {
                $('#preloader').show();
                $.each(TblDashboardDeptTabServiceList.rows().data(), function (i, row) {
                    TblDashboardDeptTabServiceList.cell(i, 0).data('<input id="checkFunctionConfigRole" type="checkbox" checked="checked" >');
                });
                $('#preloader').hide();
            });
            $('#btnUNCheckAllFunctions').click(function () {
                $('#preloader').show();
                $.each(TblDashboardDeptTabServiceList.rows().data(), function (i, row) {
                    TblDashboardDeptTabServiceList.cell(i, 0).data('<input id="checkFunctionConfigRole" type="checkbox">');
                });
                $('#preloader').hide();

            });

            $(TblDashboardDeptTabServiceListId + ' tbody').on('click', '#checkFunctionConfigRole', function (e) {
                var $cell = $(this).closest('td');
                var $row = $(this).closest('tr');
                var Tbl = TblDashboardDeptTabServiceList;
                var data = Tbl.row($row).data();
                var rowId = data[0];
                var col = Tbl.cell($(this).closest('td')).index();
                if (this.checked) {
                    $row.addClass("row_green");
                } else {
                    $row.removeClass("row_green");
                }
                e.stopPropagation();
            });
        }
        function SetupDeptTab() {

            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $.editable.addInputType('EditableYesNo', {
                element: function (settings, original) {
                    //  var input = $('<input id="dtS2YesNo" style="width:100%; height:30px;" type="text" class="form-control">');
                    var input = $('<select id="dtS2YesNo" class="form-control input-xs select2me input-sm" data-placeholder="Select..."> <option value="1">Yes</option> <option value="0">No</option> </select>');
                    $(this).append(input);
                    return (input);
                },
                plugin: function (settings, original) {

                },
                submit: function (settings, original) {
                    console.log($("#dtS2YesNo", this).select2("data").name);
                    console.log($("#dtS2YesNo", this).select2("data"));
                    if ($("#dtS2YesNo", this).select2('val') != null && $("#dtS2YesNo", this).select2('val') != '') {

                        $("input", this).val($("#dtS2YesNo", this).select2("data").name);
                    }
                }
            });
            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $.editable.addInputType('EditableName', {
                element: function (settings, original) {

                    var input = $('<input id="dtTxtName" style="width:100%; height:30px; margin:0px, padding:0px;" type="text" class="form-control">');
                    $(this).append(input);

                    return (input);
                }
            });
            $.editable.addInputType('EditableDeleted', {
                element: function (settings, original) {

                    var input = $('<input id="dtTxtDeleted" style="width:100%; height:30px; margin:0px, padding:0px;" type="number" class="form-control">');
                    $(this).append(input);

                    return (input);
                }
            });

            // ------------ ------------------------------------------------------------------------------------------------------------------------------------------------
            $.editable.addInputType('EditablePercentageDept', {
                element: function (settings, original) {

                    var input = $('<input id="dtTxtPercentageDept" style="width:100%; height:30px; margin:0px, padding:0px;" type="number" class="form-control">');
                    $(this).append(input);

                    return (input);
                }
            });
            // ------------ ------------------------------------------------------------------------------------------------------------------------------------------------
            $.editable.addInputType('EditableAmountDept', {
                element: function (settings, original) {

                    var input = $('<input id="dtTxtAmountSDept" style="width:100%; height:30px; margin:0px, padding:0px;" type="number" class="form-control">');
                    $(this).append(input);

                    return (input);
                }
            });

            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $.editable.addInputType('EditableDOB', {
                element: function (settings, original) {
                    var input = $('<input id="dtDateDOB" style="width:100%; height:30px;" type="text" class="form-control date" data-date-format="DD-MMM-YYYY"/>');
                    $(this).append(input);

                    return (input);
                },
                plugin: function (settings, original) {
                    $(this).find('#dtDateDOB')
                            .datetimepicker({
                                pickTime: false
                            });
                }
            });
            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $.editable.addInputType('EditableRelationship', {
                element: function (settings, original) {
                    var input = $('<input id="dtS2Relationship" style="width:100%; height:30px;" type="text" class="form-control">');
                    $(this).append(input);

                    return (input);
                },
                plugin: function (settings, original) {
                    var select2 = $(this).find('#dtS2Relationship').select2({
                        allowClear: false,
                        ajax: {
                            cache: false,
                            type: 'GET',
                            dataType: "json",
                            url: $('#UrlEntry').data('s2relationship'),
                            data: function (searchTerm) {
                                return { search: searchTerm };
                            },
                            results: function (data) {
                                return { results: data };
                            }
                        },
                        dropdownAutoWidth: true,
                        formatResult: function (data) {
                            var markup = "<table><tr>";
                            if (data.name !== undefined) {
                                markup += "<td>" + data.text + "</td>";
                            }
                            markup += "</td></tr></table>"
                            return markup;
                        }
                    }).on("select2-blur", function () {
                        $("#dtS2Relationship").closest('td').get(0).reset();
                    }).on('select2-close', function () {
                        if (Select2IsClicked) { $("#dtS2Relationship").closest('form').submit(); }
                        else { $("#dtS2Relationship").closest('td').get(0).reset(); }
                        Select2IsClicked = false;
                    }).on("select2-focus", function (e) {
                        var a = $(this).closest('tr').find('#dtS2Relationship').val();
                        $("#dtS2Relationship").select2("data", { id: a, text: a });
                    }).data('select2');

                    select2.onSelect = (function (fn) {
                        return function (data, options) {
                            var target;
                            if (options != null) {
                                target = $(options.target);
                            }
                            Select2IsClicked = true;
                            return fn.apply(this, arguments);
                        }
                    })(select2.onSelect);


                },
                submit: function (settings, original) {
                    if ($("#dtS2Relationship", this).select2('val') != null && $("#dtS2Relationship", this).select2('val') != '') {
                        $("input", this).val($("#dtS2Relationship", this).select2("data").text);

                    }
                }
            });
            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $.editable.addInputType('EditableEligibility', {
                element: function (settings, original) {
                    var input = $('<input id="dtS2Eligibility" style="width:100%; height:30px;" type="text" class="form-control">');
                    $(this).append(input);

                    return (input);
                },
                plugin: function (settings, original) {
                    var select2 = $(this).find('#dtS2Eligibility').select2({
                        minimumResultsForSearch: -1,
                        minimumInputLength: 0,
                        allowClear: true,
                        data: [
                            { id: 1, text: 'Half' },
                            { id: 2, text: 'Full' }
                        ]
                    }).on("select2-blur", function () {
                        $("#dtS2Eligibility").closest('td').get(0).reset();
                    }).on('select2-close', function () {
                        if (Select2IsClicked) { $("#dtS2Eligibility").closest('form').submit(); }
                        else { $("#dtS2Eligibility").closest('td').get(0).reset(); }
                        Select2IsClicked = false;
                    }).on("select2-focus", function (e) {
                        var a = $(this).closest('tr').find('#dtS2Eligibility').val();
                        $("#dtS2Eligibility").select2("data", { id: a, text: a });
                    }).data('select2');

                    select2.onSelect = (function (fn) {
                        return function (data, options) {
                            var target;
                            if (options != null) {
                                target = $(options.target);
                            }
                            Select2IsClicked = true;
                            return fn.apply(this, arguments);
                        }
                    })(select2.onSelect);


                },
                submit: function (settings, original) {
                    if ($("#dtS2Eligibility", this).select2('val') != null && $("#dtS2Eligibility", this).select2('val') != '') {
                        $("input", this).val($("#dtS2Eligibility", this).select2("data").text);

                    }
                }
            });
            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $.editable.addInputType('EditableRoute', {
                element: function (settings, original) {
                    var input = $('<input id="dtS2Route" style="width:100%; height:30px;" type="text" class="form-control">');
                    $(this).append(input);

                    return (input);
                },
                plugin: function (settings, original) {
                    var select2 = $(this).find('#dtS2Route').select2({
                        allowClear: false,
                        ajax: {
                            cache: false,
                            type: 'GET',
                            dataType: "json",
                            url: $('#UrlEntry').data('s2sectors'),
                            data: function (searchTerm) {
                                return { search: searchTerm };
                            },
                            results: function (data) {
                                return { results: data };
                            }
                        },
                        dropdownAutoWidth: true,
                        formatResult: function (data) {
                            var markup = "<table><tr>";
                            if (data.name !== undefined) {
                                markup += "<td>" + data.text + "</td>";
                            }
                            markup += "</td></tr></table>"
                            return markup;
                        }
                    }).on("select2-blur", function () {
                        $("#dtS2Route").closest('td').get(0).reset();
                    }).on('select2-close', function () {
                        if (Select2IsClicked) { $("#dtS2Route").closest('form').submit(); }
                        else { $("#dtS2Route").closest('td').get(0).reset(); }
                        Select2IsClicked = false;
                    }).on("select2-focus", function (e) {
                        var a = $(this).closest('tr').find('#dtS2Route').val();
                        $("#dtS2Route").select2("data", { id: a, text: a });
                    }).data('select2');

                    select2.onSelect = (function (fn) {
                        return function (data, options) {
                            var target;
                            if (options != null) {
                                target = $(options.target);
                            }
                            Select2IsClicked = true;
                            return fn.apply(this, arguments);
                        }
                    })(select2.onSelect);


                },
                submit: function (settings, original) {
                    if ($("#dtS2Route", this).select2('val') != null && $("#dtS2Route", this).select2('val') != '') {
                        $("input", this).val($("#dtS2Route", this).select2("data").text);

                    }
                }
            });
            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $.editable.addInputType('EditableTicket', {
                element: function (settings, original) {
                    //var input = $('<input id="dtChkTicket" type="checkbox" checked>');
                    var input = $('<input id="dtChkTicket" type="checkbox" checked data-toggle="toggle" data-style="ios" data-size="mini" data-onstyle="success" data-offstyle="danger">');
                    $(this).append(input);

                    return (input);
                },
                plugin: function (settings, original) {
                    $(this).find('#dtChkTicket')
                            .bootstrapToggle({
                                "on": "yes",
                                "off": "no"
                            });
                }
            });
            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
        }
        function InitDeptTab() {


            var Tbl = TblDashboardDeptTabServiceList;

            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $('.ClassYesorNo', Tbl.rows().nodes()).editable(function (sVal, settings) {


                var cell = Tbl.cell($(this).closest('td')).index();
                //var id = $('#dtS2Approver').select2('data').id;
                //var name = $('#dtS2Approver').select2('data').RelName;
                //var age = $('#dtS2Approver').select2('data').Age;
                //var dob = $('#dtS2Approver').select2('data').dob;
                Tbl.cell(cell.row, cell.column).data(sVal);
                //Tbl.cell(cell.row, ennTicket.id).data(id);
                //Tbl.cell(cell.row, ennTicket.dob).data(dob);
                //Tbl.cell(cell.row, ennTicket.RelName).data(name);
                //Tbl.cell(cell.row, ennTicket.Age).data(age);


                return sVal;
            },
            {
                "type": 'EditableYesNo', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
                "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
            });

            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $('.ClassName', Tbl.rows().nodes()).editable(function (sVal, settings) {
                var cell = Tbl.cell($(this).closest('td')).index();
                Tbl.cell(cell.row, cell.column).data(sVal);
                return sVal;
            },
            {
                "type": 'EditableName', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
                "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
            });
            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $('.ClassDeleted', Tbl.rows().nodes()).editable(function (sVal, settings) {
                var cell = Tbl.cell($(this).closest('td')).index();
                Tbl.cell(cell.row, cell.column).data(sVal);
                return sVal;
            },
            {
                "type": 'EditableDeleted', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
                "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
            });

            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $('.ClassPercentageDept', Tbl.rows().nodes()).editable(function (sVal, settings) {
                var cell = Tbl.cell($(this).closest('td')).index();
                Tbl.cell(cell.row, cell.column).data(sVal);
                return sVal;
            },
            {
                "type": 'EditablePercentageDept', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
                "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
            });


            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $('.ClassAmountDept', Tbl.rows().nodes()).editable(function (sVal, settings) {
                var cell = Tbl.cell($(this).closest('td')).index();
                Tbl.cell(cell.row, cell.column).data(sVal);
                return sVal;
            },
            {
                "type": 'EditableAmountDept', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
                "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
            });

            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $('.ClassDOB', Tbl.rows().nodes()).editable(function (sVal, settings) {
                var cell = Tbl.cell($(this).closest('td')).index();
                Tbl.cell(cell.row, cell.column).data(sVal);

                //if (sVal.trim().length > 0) {
                //    var age = c.GetAge(sVal);
                //    Tbl.cell(cell.row, ennTicket.Age).data(age);
                //}

                return sVal;
            },
            {
                "type": 'EditableDOB', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
                "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
            });
            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $('.ClassS2Relationship', Tbl.rows().nodes()).editable(function (sVal, settings) {
                var cell = Tbl.cell($(this).closest('td')).index();
                var id = c.GetSelect2Id('#dtS2Relationship');
                Tbl.cell(cell.row, ennTicket.RelationshipID).data(id);
                Tbl.cell(cell.row, cell.column).data(sVal);

                return sVal;
            },
            {
                "type": 'EditableRelationship', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
                "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
            });
            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $('.ClassS2Eligibility', Tbl.rows().nodes()).editable(function (sVal, settings) {
                var cell = Tbl.cell($(this).closest('td')).index();
                var id = c.GetSelect2Id('#dtS2Eligibility');
                Tbl.cell(cell.row, ennTicket.EligibleID).data(id);
                Tbl.cell(cell.row, cell.column).data(sVal);

                return sVal;
            },
            {
                "type": 'EditableEligibility', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
                "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
            });
            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $('.ClassS2Route', Tbl.rows().nodes()).editable(function (sVal, settings) {
                var cell = Tbl.cell($(this).closest('td')).index();
                var id = c.GetSelect2Id('#dtS2Route');
                Tbl.cell(cell.row, ennTicket.RouteID).data(id);
                Tbl.cell(cell.row, cell.column).data(sVal);

                return sVal;
            },
            {
                "type": 'EditableRoute', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
                "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
            });
            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $('.ClassTicket', Tbl.rows().nodes()).editable(function (event, state) {
                var cell = Tbl.cell($(this).closest('td')).index();
                Tbl.cell(cell.row, ennTicket.TicketEnt).data(state === true ? 1 : 0);

            },
            {
                "type": 'EditableTicket', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
                "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
            });
            // ------------------------------------------------------------------------------------------------------------------------------------------------------------


        }

        // -----------------------------------------------------------------------------------------------------------------------------------------------------------


        // -----------------------------------------CP item TAB------------------------------------------------------------------------------------------------------------------
        SetupItemTab();
        var LoadItemTabList = function () {
            console.log('LoadItemTabList');

            // $('#preloader').show();
            ajaxWrapper.Get($("#url").data("comissioinprofitemstabdatatable"), { type: $('#IPOPType').val(), docid: $('#sel2alldoctor').val(), serviceid: $('#ItemTabService').val(), deptid: $('#ItemTabDept').val() }, function (x, e) {
                BindDashboardItemTabList(x.list);
                //  $('#preloader').hide();
            });
        };
        var TblDashboardItemTabList;
        var TblDashboardItemTabListId = '#DTviewCPItemTablList';
        var TblDashboardItemTabListDataRow;
        var ennDashboardItemTabList = { Btn: 0, del: 1, ctr: 2, ID: 3, Name: 4, Edited: 5, Deleted: 6 };

        var Format24 = "HH:mm";
        var calcHeightDashboardItemTabList = function () {
            return $(window).height() * 60 / 100;
        };
        function ShowDashboardRowCallDashboardItemTabList() {
            var rc = function (nRow, aData) {
                var $nRow = $(nRow);

                if (aData.isCheck == "1") {
                    $('#checkItemisService', nRow).prop('checked', true);
                    $('td:eq(2)', nRow).html('<button type="button" class="btn btn-xs green">Yes</button>');
                }



            };
            return rc;
        }
        function BindDashboardItemTabList(data) {

            // http://legacy.datatables.net/release-datatables/examples/basic_init/scroll_x.html
            TblDashboardItemTabList = $(TblDashboardItemTabListId).DataTable({
                cache: false,
                destroy: true,
                data: data,
                paging: false,
                ordering: true,
                searching: false,
                //  info: false,
                scrollY: calcHeightDashboardItemTabList(),
                scrollX: "820px",
                sScrollXInner: "820px",
                //processing: true,
                autoWidth: false,

                //   dom: '<"tbDashboardDeptTabServiceList">Rlfrtip',
                //    scrollCollapse: false,
                //pageLength: 20,
                lengthChange: false,


                columns: [
                   // { data: "", title: '', className: 'control-center', visible: true, searchable: false, width: "1px", defaultContent: '<button type="button" class="btn btn-sm btn-danger" Id="btnDetailsModif" title="Delete" rel="tooltip"> <i class="glyphicon glyphicon-trash"></i></button>' },
                    { data: "", title: ' Item  ', className: '  ', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" class="control-center iCheck-helper highlight" id="checkItemisService" />' },
                    { data: "itemName", title: 'Item Name', className: '     ', visible: true, searchable: true, width: "10%" },
                    { data: "", title: 'Item-Wise', className: ' input-xs ', visible: true, searchable: false, width: "1%", defaultContent: '<button type="button" class="btn btn-xs red">No</button>' },

                   // { data: "", title: 'Dept-Wise', className: ' input-xs ', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" class="control-center iCheck-helper" id="checkisDept" />' },

                    { data: "Percentage", title: 'Percentage', className: 'ClassPercentageItem ', visible: true, searchable: true, width: "1%" },
                    { data: "Amount", title: 'Amount', className: 'ClassAmountItem ', visible: true, searchable: true, width: "1%" },
                    //{ data: "StartDateTime", title: 'Start Date', className: ' ClassDOB  ', visible: true, searchable: true, width: "0%" },
                    // { data: "Deleted", title: 'Deleted', className: ' ClassYesorNo', visible: true, searchable: false, width: "0%" }
                    //{ data: "StationId", title: 'StationId', className: '', visible: false, searchable: false, width: "0%" },
                    //{ data: "RoleId", title: 'RoleId', className: '', visible: false, searchable: false, width: "0%" },
                    { data: "itemId", title: ' ', className: '', visible: false, searchable: false, width: "0%" }
                ],
                fnRowCallback: ShowDashboardRowCallDashboardItemTabList()
            });
            InitItemTab();

            var btns = '';
            var toolbar = btns.concat(
                 '<div style="float:left;">'
                 , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnCheckAllFunctions"> <i class="glyphicon glyphicon-check"></i> All </button>'
                , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnUNCheckAllFunctions"> <i class="glyphicon glyphicon-unchecked"></i> All </button>'
                , '</div><br><br>');
            //$("div.tbDashboardItemTabList").html(toolbar);

            $('#btnCheckAllFunctions').click(function () {
                $('#preloader').show();
                $.each(TblDashboardItemTabList.rows().data(), function (i, row) {
                    TblDashboardItemTabList.cell(i, 0).data('<input id="checkFunctionConfigRole" type="checkbox" checked="checked" >');
                });
                $('#preloader').hide();
            });
            $('#btnUNCheckAllFunctions').click(function () {
                $('#preloader').show();
                $.each(TblDashboardItemTabList.rows().data(), function (i, row) {
                    TblDashboardItemTabList.cell(i, 0).data('<input id="checkFunctionConfigRole" type="checkbox">');
                });
                $('#preloader').hide();

            });

            $(TblDashboardItemTabListId + ' tbody').on('click', '#checkFunctionConfigRole', function (e) {
                var $cell = $(this).closest('td');
                var $row = $(this).closest('tr');
                var Tbl = TblDashboardItemTabList;
                var data = Tbl.row($row).data();
                var rowId = data[0];
                var col = Tbl.cell($(this).closest('td')).index();
                if (this.checked) {
                    $row.addClass("row_green");
                } else {
                    $row.removeClass("row_green");
                }
                e.stopPropagation();
            });
        }
        function SetupItemTab() {

            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $.editable.addInputType('EditableYesNo', {
                element: function (settings, original) {
                    //  var input = $('<input id="dtS2YesNo" style="width:100%; height:30px;" type="text" class="form-control">');
                    var input = $('<select id="dtS2YesNo" class="form-control input-xs select2me input-sm" data-placeholder="Select..."> <option value="1">Yes</option> <option value="0">No</option> </select>');
                    $(this).append(input);
                    return (input);
                },
                plugin: function (settings, original) {

                },
                submit: function (settings, original) {
                    console.log($("#dtS2YesNo", this).select2("data").name);
                    console.log($("#dtS2YesNo", this).select2("data"));
                    if ($("#dtS2YesNo", this).select2('val') != null && $("#dtS2YesNo", this).select2('val') != '') {

                        $("input", this).val($("#dtS2YesNo", this).select2("data").name);
                    }
                }
            });
            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $.editable.addInputType('EditableName', {
                element: function (settings, original) {

                    var input = $('<input id="dtTxtName" style="width:100%; height:30px; margin:0px, padding:0px;" type="text" class="form-control">');
                    $(this).append(input);

                    return (input);
                }
            });
            $.editable.addInputType('EditableDeleted', {
                element: function (settings, original) {

                    var input = $('<input id="dtTxtDeleted" style="width:100%; height:30px; margin:0px, padding:0px;" type="number" class="form-control">');
                    $(this).append(input);

                    return (input);
                }
            });

            // ------------ ------------------------------------------------------------------------------------------------------------------------------------------------
            $.editable.addInputType('EditablePercentageItem', {
                element: function (settings, original) {

                    var input = $('<input id="dtTxtPercentageItem" style="width:100%; height:30px; margin:0px, padding:0px;" type="number" class="form-control">');
                    $(this).append(input);

                    return (input);
                }
            });
            // ------------ ------------------------------------------------------------------------------------------------------------------------------------------------
            $.editable.addInputType('EditableAmountItem', {
                element: function (settings, original) {

                    var input = $('<input id="dtTxtAmountItem" style="width:100%; height:30px; margin:0px, padding:0px;" type="number" class="form-control">');
                    $(this).append(input);

                    return (input);
                }
            });

            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $.editable.addInputType('EditableDOB', {
                element: function (settings, original) {
                    var input = $('<input id="dtDateDOB" style="width:100%; height:30px;" type="text" class="form-control date" data-date-format="DD-MMM-YYYY"/>');
                    $(this).append(input);

                    return (input);
                },
                plugin: function (settings, original) {
                    $(this).find('#dtDateDOB')
                            .datetimepicker({
                                pickTime: false
                            });
                }
            });
            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $.editable.addInputType('EditableRelationship', {
                element: function (settings, original) {
                    var input = $('<input id="dtS2Relationship" style="width:100%; height:30px;" type="text" class="form-control">');
                    $(this).append(input);

                    return (input);
                },
                plugin: function (settings, original) {
                    var select2 = $(this).find('#dtS2Relationship').select2({
                        allowClear: false,
                        ajax: {
                            cache: false,
                            type: 'GET',
                            dataType: "json",
                            url: $('#UrlEntry').data('s2relationship'),
                            data: function (searchTerm) {
                                return { search: searchTerm };
                            },
                            results: function (data) {
                                return { results: data };
                            }
                        },
                        dropdownAutoWidth: true,
                        formatResult: function (data) {
                            var markup = "<table><tr>";
                            if (data.name !== undefined) {
                                markup += "<td>" + data.text + "</td>";
                            }
                            markup += "</td></tr></table>"
                            return markup;
                        }
                    }).on("select2-blur", function () {
                        $("#dtS2Relationship").closest('td').get(0).reset();
                    }).on('select2-close', function () {
                        if (Select2IsClicked) { $("#dtS2Relationship").closest('form').submit(); }
                        else { $("#dtS2Relationship").closest('td').get(0).reset(); }
                        Select2IsClicked = false;
                    }).on("select2-focus", function (e) {
                        var a = $(this).closest('tr').find('#dtS2Relationship').val();
                        $("#dtS2Relationship").select2("data", { id: a, text: a });
                    }).data('select2');

                    select2.onSelect = (function (fn) {
                        return function (data, options) {
                            var target;
                            if (options != null) {
                                target = $(options.target);
                            }
                            Select2IsClicked = true;
                            return fn.apply(this, arguments);
                        }
                    })(select2.onSelect);


                },
                submit: function (settings, original) {
                    if ($("#dtS2Relationship", this).select2('val') != null && $("#dtS2Relationship", this).select2('val') != '') {
                        $("input", this).val($("#dtS2Relationship", this).select2("data").text);

                    }
                }
            });
            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $.editable.addInputType('EditableEligibility', {
                element: function (settings, original) {
                    var input = $('<input id="dtS2Eligibility" style="width:100%; height:30px;" type="text" class="form-control">');
                    $(this).append(input);

                    return (input);
                },
                plugin: function (settings, original) {
                    var select2 = $(this).find('#dtS2Eligibility').select2({
                        minimumResultsForSearch: -1,
                        minimumInputLength: 0,
                        allowClear: true,
                        data: [
                            { id: 1, text: 'Half' },
                            { id: 2, text: 'Full' }
                        ]
                    }).on("select2-blur", function () {
                        $("#dtS2Eligibility").closest('td').get(0).reset();
                    }).on('select2-close', function () {
                        if (Select2IsClicked) { $("#dtS2Eligibility").closest('form').submit(); }
                        else { $("#dtS2Eligibility").closest('td').get(0).reset(); }
                        Select2IsClicked = false;
                    }).on("select2-focus", function (e) {
                        var a = $(this).closest('tr').find('#dtS2Eligibility').val();
                        $("#dtS2Eligibility").select2("data", { id: a, text: a });
                    }).data('select2');

                    select2.onSelect = (function (fn) {
                        return function (data, options) {
                            var target;
                            if (options != null) {
                                target = $(options.target);
                            }
                            Select2IsClicked = true;
                            return fn.apply(this, arguments);
                        }
                    })(select2.onSelect);


                },
                submit: function (settings, original) {
                    if ($("#dtS2Eligibility", this).select2('val') != null && $("#dtS2Eligibility", this).select2('val') != '') {
                        $("input", this).val($("#dtS2Eligibility", this).select2("data").text);

                    }
                }
            });
            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $.editable.addInputType('EditableRoute', {
                element: function (settings, original) {
                    var input = $('<input id="dtS2Route" style="width:100%; height:30px;" type="text" class="form-control">');
                    $(this).append(input);

                    return (input);
                },
                plugin: function (settings, original) {
                    var select2 = $(this).find('#dtS2Route').select2({
                        allowClear: false,
                        ajax: {
                            cache: false,
                            type: 'GET',
                            dataType: "json",
                            url: $('#UrlEntry').data('s2sectors'),
                            data: function (searchTerm) {
                                return { search: searchTerm };
                            },
                            results: function (data) {
                                return { results: data };
                            }
                        },
                        dropdownAutoWidth: true,
                        formatResult: function (data) {
                            var markup = "<table><tr>";
                            if (data.name !== undefined) {
                                markup += "<td>" + data.text + "</td>";
                            }
                            markup += "</td></tr></table>"
                            return markup;
                        }
                    }).on("select2-blur", function () {
                        $("#dtS2Route").closest('td').get(0).reset();
                    }).on('select2-close', function () {
                        if (Select2IsClicked) { $("#dtS2Route").closest('form').submit(); }
                        else { $("#dtS2Route").closest('td').get(0).reset(); }
                        Select2IsClicked = false;
                    }).on("select2-focus", function (e) {
                        var a = $(this).closest('tr').find('#dtS2Route').val();
                        $("#dtS2Route").select2("data", { id: a, text: a });
                    }).data('select2');

                    select2.onSelect = (function (fn) {
                        return function (data, options) {
                            var target;
                            if (options != null) {
                                target = $(options.target);
                            }
                            Select2IsClicked = true;
                            return fn.apply(this, arguments);
                        }
                    })(select2.onSelect);


                },
                submit: function (settings, original) {
                    if ($("#dtS2Route", this).select2('val') != null && $("#dtS2Route", this).select2('val') != '') {
                        $("input", this).val($("#dtS2Route", this).select2("data").text);

                    }
                }
            });
            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $.editable.addInputType('EditableTicket', {
                element: function (settings, original) {
                    //var input = $('<input id="dtChkTicket" type="checkbox" checked>');
                    var input = $('<input id="dtChkTicket" type="checkbox" checked data-toggle="toggle" data-style="ios" data-size="mini" data-onstyle="success" data-offstyle="danger">');
                    $(this).append(input);

                    return (input);
                },
                plugin: function (settings, original) {
                    $(this).find('#dtChkTicket')
                            .bootstrapToggle({
                                "on": "yes",
                                "off": "no"
                            });
                }
            });
            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
        }
        function InitItemTab() {


            var Tbl = TblDashboardItemTabList;

            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $('.ClassYesorNo', Tbl.rows().nodes()).editable(function (sVal, settings) {


                var cell = Tbl.cell($(this).closest('td')).index();
                //var id = $('#dtS2Approver').select2('data').id;
                //var name = $('#dtS2Approver').select2('data').RelName;
                //var age = $('#dtS2Approver').select2('data').Age;
                //var dob = $('#dtS2Approver').select2('data').dob;
                Tbl.cell(cell.row, cell.column).data(sVal);
                //Tbl.cell(cell.row, ennTicket.id).data(id);
                //Tbl.cell(cell.row, ennTicket.dob).data(dob);
                //Tbl.cell(cell.row, ennTicket.RelName).data(name);
                //Tbl.cell(cell.row, ennTicket.Age).data(age);


                return sVal;
            },
            {
                "type": 'EditableYesNo', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
                "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
            });

            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $('.ClassName', Tbl.rows().nodes()).editable(function (sVal, settings) {
                var cell = Tbl.cell($(this).closest('td')).index();
                Tbl.cell(cell.row, cell.column).data(sVal);
                return sVal;
            },
            {
                "type": 'EditableName', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
                "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
            });
            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $('.ClassDeleted', Tbl.rows().nodes()).editable(function (sVal, settings) {
                var cell = Tbl.cell($(this).closest('td')).index();
                Tbl.cell(cell.row, cell.column).data(sVal);
                return sVal;
            },
            {
                "type": 'EditableDeleted', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
                "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
            });

            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $('.ClassPercentageItem', Tbl.rows().nodes()).editable(function (sVal, settings) {
                var cell = Tbl.cell($(this).closest('td')).index();
                Tbl.cell(cell.row, cell.column).data(sVal);
                return sVal;
            },
            {
                "type": 'EditablePercentageItem', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
                "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
            });


            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $('.ClassAmountItem', Tbl.rows().nodes()).editable(function (sVal, settings) {
                var cell = Tbl.cell($(this).closest('td')).index();
                Tbl.cell(cell.row, cell.column).data(sVal);
                return sVal;
            },
            {
                "type": 'EditableAmountItem', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
                "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
            });

            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $('.ClassDOB', Tbl.rows().nodes()).editable(function (sVal, settings) {
                var cell = Tbl.cell($(this).closest('td')).index();
                Tbl.cell(cell.row, cell.column).data(sVal);

                //if (sVal.trim().length > 0) {
                //    var age = c.GetAge(sVal);
                //    Tbl.cell(cell.row, ennTicket.Age).data(age);
                //}

                return sVal;
            },
            {
                "type": 'EditableDOB', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
                "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
            });
            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $('.ClassS2Relationship', Tbl.rows().nodes()).editable(function (sVal, settings) {
                var cell = Tbl.cell($(this).closest('td')).index();
                var id = c.GetSelect2Id('#dtS2Relationship');
                Tbl.cell(cell.row, ennTicket.RelationshipID).data(id);
                Tbl.cell(cell.row, cell.column).data(sVal);

                return sVal;
            },
            {
                "type": 'EditableRelationship', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
                "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
            });
            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $('.ClassS2Eligibility', Tbl.rows().nodes()).editable(function (sVal, settings) {
                var cell = Tbl.cell($(this).closest('td')).index();
                var id = c.GetSelect2Id('#dtS2Eligibility');
                Tbl.cell(cell.row, ennTicket.EligibleID).data(id);
                Tbl.cell(cell.row, cell.column).data(sVal);

                return sVal;
            },
            {
                "type": 'EditableEligibility', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
                "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
            });
            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $('.ClassS2Route', Tbl.rows().nodes()).editable(function (sVal, settings) {
                var cell = Tbl.cell($(this).closest('td')).index();
                var id = c.GetSelect2Id('#dtS2Route');
                Tbl.cell(cell.row, ennTicket.RouteID).data(id);
                Tbl.cell(cell.row, cell.column).data(sVal);

                return sVal;
            },
            {
                "type": 'EditableRoute', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
                "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
            });
            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $('.ClassTicket', Tbl.rows().nodes()).editable(function (event, state) {
                var cell = Tbl.cell($(this).closest('td')).index();
                Tbl.cell(cell.row, ennTicket.TicketEnt).data(state === true ? 1 : 0);

            },
            {
                "type": 'EditableTicket', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
                "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
            });
            // ------------------------------------------------------------------------------------------------------------------------------------------------------------


        }


        // -----------------------------------------------------------------------------------------------------------------------------------------------------------


        // -----------------------------------------Commission Profile Options - SERVICES ------------------------------------------------------------------------------------------------------------------


        var LoadCPDocListServices = function () {
            ajaxWrapper.Get($("#url").data("cpdoclistservices"), { docid: $('#sel2alldoctorservices').val() }, function (x, e) {
                BindDashboardCPDocListServices(x.list);
            });
        };
        var TblDashboardCPDocListServices;
        var TblDashboardCPDocListServicesId = '#DTviewDocAllServices';
        var TblDashboardCPDocListServicesDataRow;
        var ennDashboardCPDocListServices = { Btn: 0, del: 1, ctr: 2, ID: 3, Name: 4, Edited: 5, Deleted: 6 };

        var Format24 = "HH:mm";
        var calcHeightDashboardCPDocListServices = function () {
            return $(window).height() * 35 / 100;
        };

        function ShowDashboardRowCallDashboardCPDocListServices() {
            var rc = function (nRow, aData) {
                var $nRow = $(nRow);
                if (aData["IPOPType"] === "IP") {
                    //$('td:eq(3)', nRow).html("Yes");
                    $nRow.addClass("row_blue");
                   
                }
                if (aData["IPOPType"] === "OP") {
                    //$('td:eq(3)', nRow).html("Yes");
                    $nRow.addClass("row_green");

                }
            };
            return rc;
        }
        function BindDashboardCPDocListServices(data) {

            // http://legacy.datatables.net/release-datatables/examples/basic_init/scroll_x.html
            TblDashboardCPDocListServices = $(TblDashboardCPDocListServicesId).DataTable({
                cache: false,
                destroy: true,
                data: data,
                paging: false,
                ordering: true,
                //searching: true,
                //info: false,
                scrollY: calcHeightDashboardCPDocListServices(),
                scrollX: "900px",
                sScrollXInner: "900px",
                //processing: true,
                autoWidth: false,
                dom: '<"tbDashboardCPDocListServices">Rlfrtip',
                scrollCollapse: false,
                pageLength: 75,
                //lengthChange: false,
                columns: [
                   // { data: "", title: '', className: 'control-center', visible: true, searchable: false, width: "1px", defaultContent: '<button type="button" class="btn btn-sm btn-danger" Id="btnDetailsModif" title="Delete" rel="tooltip"> <i class="glyphicon glyphicon-trash"></i></button>' },
                   // { data: "", title: ' ', className: ' ', visible: true, searchable: false, width: "0%", defaultContent: '<input type="checkbox" class="control-center iCheck-helper" id="checkFunctionConfigRole" />' },

                    { data: "IPOPType", title: 'Type', className: '  ', visible: true, searchable: true, width: "2%" },
                    { data: "ServiceName", title: 'Service', className: ' ', visible: true, searchable: true, width: "10%" },
                    { data: "Percentage", title: 'Percentage', className: ' ', visible: true, searchable: true, width: "2%" },
                    { data: "Amount", title: 'Amount', className: '   ', visible: true, searchable: true, width: "2%" },
                    // { data: "EndDateTime", title: 'End Date', className: ' ', visible: false, searchable: false, width: "1%" }
                    //{ data: "StationId", title: 'StationId', className: '', visible: false, searchable: false, width: "0%" },
                    //{ data: "RoleId", title: 'RoleId', className: '', visible: false, searchable: false, width: "0%" },
                    //{ data: "ModuleId", title: 'ModuleId', className: '', visible: false, searchable: false, width: "0%" }
                  // , { data: "Id", title: ' ', className: '', visible: false, searchable: true, width: "0%" }
                ],
                fnRowCallback: ShowDashboardRowCallDashboardCPDocListServices()
            });


            var btns = '';
            var toolbar = btns.concat(
                 '<div style="float:left;">'
                 , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnCheckAllFunctions"> <i class="glyphicon glyphicon-check"></i> All </button>'
                , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnUNCheckAllFunctions"> <i class="glyphicon glyphicon-unchecked"></i> All </button>'
                , '</div><br><br>');
            //$("div.tbDashboardCPDocListServices").html(toolbar);

            $('#btnCheckAllFunctions').click(function () {
                $('#preloader').show();
                $.each(TblDashboardCPDocListServices.rows().data(), function (i, row) {
                    TblDashboardCPDocListServices.cell(i, 0).data('<input id="checkFunctionConfigRole" type="checkbox" checked="checked" >');
                });
                $('#preloader').hide();
            });
            $('#btnUNCheckAllFunctions').click(function () {
                $('#preloader').show();
                $.each(TblDashboardCPDocListServices.rows().data(), function (i, row) {
                    TblDashboardCPDocListServices.cell(i, 0).data('<input id="checkFunctionConfigRole" type="checkbox">');
                });
                $('#preloader').hide();

            });

            $(TblDashboardCPDocListServicesId + ' tbody').on('click', '#checkFunctionConfigRole', function (e) {
                var $cell = $(this).closest('td');
                var $row = $(this).closest('tr');
                var Tbl = TblDashboardCPDocListServices;
                var data = Tbl.row($row).data();
                var rowId = data[0];
                var col = Tbl.cell($(this).closest('td')).index();
                if (this.checked) {
                    $row.addClass("row_green");
                } else {
                    $row.removeClass("row_green");
                }
                e.stopPropagation();
            });
        }

        // -----------------------------------------------------------------------------------------------------------------------------------------------------------


        // -----------------------------------------Commission Profile Options - Department ------------------------------------------------------------------------------------------------------------------


        var LoadCPDocListDepartment = function () {
            ajaxWrapper.Get($("#url").data("cpdoclistdepartment"), { docid: $('#sel2alldoctordept').val() }, function (x, e) {
                BindDashboardCPDocListDepartment(x.list);
            });
        };
        var TblDashboardCPDocListDepartment;
        var TblDashboardCPDocListDepartmentId = '#DTviewDocAllDept';
        var TblDashboardCPDocListDepartmentDataRow;
        var ennDashboardCPDocListDepartment = { Btn: 0, del: 1, ctr: 2, ID: 3, Name: 4, Edited: 5, Deleted: 6 };

        var Format24 = "HH:mm";
        var calcHeightDashboardCPDocListDepartment = function () {
            return $(window).height() * 35 / 100;
        };

        function ShowDashboardRowCallDashboardCPDocListDepartment() {
            var rc = function (nRow, aData) {
                var $nRow = $(nRow);
                if (aData["IPOPType"] === "IP") {
                    //$('td:eq(3)', nRow).html("Yes");
                    $nRow.addClass("row_blue");

                }
                if (aData["IPOPType"] === "OP") {
                    //$('td:eq(3)', nRow).html("Yes");
                    $nRow.addClass("row_green");

                }
            };
            return rc;
        }
        function BindDashboardCPDocListDepartment(data) {

            // http://legacy.datatables.net/release-datatables/examples/basic_init/scroll_x.html
            TblDashboardCPDocListDepartment = $(TblDashboardCPDocListDepartmentId).DataTable({
                cache: false,
                destroy: true,
                data: data,
                paging: false,
                ordering: true,
                //searching: true,
                //info: false,
                scrollY: calcHeightDashboardCPDocListDepartment(),
                scrollX: "900px",
                sScrollXInner: "900px",
                //processing: true,
                autoWidth: false,
                dom: '<"tbDashboardCPDocListDepartment">Rlfrtip',
                scrollCollapse: false,
                pageLength: 75,
                //lengthChange: false,
                columns: [
                   // { data: "", title: '', className: 'control-center', visible: true, searchable: false, width: "1px", defaultContent: '<button type="button" class="btn btn-sm btn-danger" Id="btnDetailsModif" title="Delete" rel="tooltip"> <i class="glyphicon glyphicon-trash"></i></button>' },
                   // { data: "", title: ' ', className: ' ', visible: true, searchable: false, width: "0%", defaultContent: '<input type="checkbox" class="control-center iCheck-helper" id="checkFunctionConfigRole" />' },

                    { data: "IPOPType", title: 'Type', className: '  ', visible: true, searchable: true, width: "2%" },
                    { data: "DeptName", title: 'Department', className: ' ', visible: true, searchable: true, width: "10%" },
                    { data: "ServiceName", title: 'Service', className: ' ', visible: true, searchable: true, width: "10%" },
                    { data: "Percentage", title: 'Percentage', className: ' ', visible: true, searchable: true, width: "2%" },
                    { data: "Amount", title: 'Amount', className: '   ', visible: true, searchable: true, width: "2%" },
                    // { data: "EndDateTime", title: 'End Date', className: ' ', visible: false, searchable: false, width: "1%" }
                    //{ data: "StationId", title: 'StationId', className: '', visible: false, searchable: false, width: "0%" },
                    //{ data: "RoleId", title: 'RoleId', className: '', visible: false, searchable: false, width: "0%" },
                    //{ data: "ModuleId", title: 'ModuleId', className: '', visible: false, searchable: false, width: "0%" }
                  // , { data: "Id", title: ' ', className: '', visible: false, searchable: true, width: "0%" }
                ],
                fnRowCallback: ShowDashboardRowCallDashboardCPDocListDepartment()
            });


            var btns = '';
            var toolbar = btns.concat(
                 '<div style="float:left;">'
                 , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnCheckAllFunctions"> <i class="glyphicon glyphicon-check"></i> All </button>'
                , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnUNCheckAllFunctions"> <i class="glyphicon glyphicon-unchecked"></i> All </button>'
                , '</div><br><br>');
            //$("div.tbDashboardCPDocListDepartment").html(toolbar);

            $('#btnCheckAllFunctions').click(function () {
                $('#preloader').show();
                $.each(TblDashboardCPDocListDepartment.rows().data(), function (i, row) {
                    TblDashboardCPDocListDepartment.cell(i, 0).data('<input id="checkFunctionConfigRole" type="checkbox" checked="checked" >');
                });
                $('#preloader').hide();
            });
            $('#btnUNCheckAllFunctions').click(function () {
                $('#preloader').show();
                $.each(TblDashboardCPDocListDepartment.rows().data(), function (i, row) {
                    TblDashboardCPDocListDepartment.cell(i, 0).data('<input id="checkFunctionConfigRole" type="checkbox">');
                });
                $('#preloader').hide();

            });

            $(TblDashboardCPDocListDepartmentId + ' tbody').on('click', '#checkFunctionConfigRole', function (e) {
                var $cell = $(this).closest('td');
                var $row = $(this).closest('tr');
                var Tbl = TblDashboardCPDocListDepartment;
                var data = Tbl.row($row).data();
                var rowId = data[0];
                var col = Tbl.cell($(this).closest('td')).index();
                if (this.checked) {
                    $row.addClass("row_green");
                } else {
                    $row.removeClass("row_green");
                }
                e.stopPropagation();
            });
        }

        // -----------------------------------------------------------------------------------------------------------------------------------------------------------

        // -----------------------------------------Commission Profile Options - ITEM ------------------------------------------------------------------------------------------------------------------


        var LoadCPDocListItems = function () {
            ajaxWrapper.Get($("#url").data("cpdoclistitem"), { docid: $('#sel2alldoctoritem').val() }, function (x, e) {
                BindDashboardCPDocListItems(x.list);
            });
        };
        var TblDashboardCPDocListItems;
        var TblDashboardCPDocListItemsId = '#DTviewDocAllItem';
        var TblDashboardCPDocListItemsDataRow;
        var ennDashboardCPDocListItems = { Btn: 0, del: 1, ctr: 2, ID: 3, Name: 4, Edited: 5, Deleted: 6 };

        var Format24 = "HH:mm";
        var calcHeightDashboardCPDocListItems = function () {
            return $(window).height() * 35 / 100;
        };

        function ShowDashboardRowCallDashboardCPDocListItems() {
            var rc = function (nRow, aData) {
                var $nRow = $(nRow);
                if (aData["IPOPType"] === "IP") {
                    //$('td:eq(3)', nRow).html("Yes");
                    $nRow.addClass("row_blue");

                }
                if (aData["IPOPType"] === "OP") {
                    //$('td:eq(3)', nRow).html("Yes");
                    $nRow.addClass("row_green");

                }
            };
            return rc;
        }
        function BindDashboardCPDocListItems(data) {

            // http://legacy.datatables.net/release-datatables/examples/basic_init/scroll_x.html
            TblDashboardCPDocListItems = $(TblDashboardCPDocListItemsId).DataTable({
                cache: false,
                destroy: true,
                data: data,
                paging: false,
                ordering: true,
                //searching: true,
                //info: false,
                scrollY: calcHeightDashboardCPDocListItems(),
                scrollX: "900px",
                sScrollXInner: "900px",
                //processing: true,
                autoWidth: false,
                dom: '<"tbDashboardCPDocListItems">Rlfrtip',
                scrollCollapse: false,
                pageLength: 75,
                //lengthChange: false,
                columns: [
                   // { data: "", title: '', className: 'control-center', visible: true, searchable: false, width: "1px", defaultContent: '<button type="button" class="btn btn-sm btn-danger" Id="btnDetailsModif" title="Delete" rel="tooltip"> <i class="glyphicon glyphicon-trash"></i></button>' },
                   // { data: "", title: ' ', className: ' ', visible: true, searchable: false, width: "0%", defaultContent: '<input type="checkbox" class="control-center iCheck-helper" id="checkFunctionConfigRole" />' },

                    { data: "IPOPType", title: 'Type', className: '  ', visible: true, searchable: true, width: "2%" },
                    { data: "ServiceName", title: 'Service', className: ' ', visible: true, searchable: true, width: "10%" },
                    { data: "Percentage", title: 'Percentage', className: ' ', visible: true, searchable: true, width: "2%" },
                    { data: "Amount", title: 'Amount', className: '   ', visible: true, searchable: true, width: "2%" },
                    // { data: "EndDateTime", title: 'End Date', className: ' ', visible: false, searchable: false, width: "1%" }
                    //{ data: "StationId", title: 'StationId', className: '', visible: false, searchable: false, width: "0%" },
                    //{ data: "RoleId", title: 'RoleId', className: '', visible: false, searchable: false, width: "0%" },
                    //{ data: "ModuleId", title: 'ModuleId', className: '', visible: false, searchable: false, width: "0%" }
                  // , { data: "Id", title: ' ', className: '', visible: false, searchable: true, width: "0%" }
                ],
                fnRowCallback: ShowDashboardRowCallDashboardCPDocListItems()
            });


            var btns = '';
            var toolbar = btns.concat(
                 '<div style="float:left;">'
                 , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnCheckAllFunctions"> <i class="glyphicon glyphicon-check"></i> All </button>'
                , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnUNCheckAllFunctions"> <i class="glyphicon glyphicon-unchecked"></i> All </button>'
                , '</div><br><br>');
            //$("div.tbDashboardCPDocListItems").html(toolbar);

            $('#btnCheckAllFunctions').click(function () {
                $('#preloader').show();
                $.each(TblDashboardCPDocListItems.rows().data(), function (i, row) {
                    TblDashboardCPDocListItems.cell(i, 0).data('<input id="checkFunctionConfigRole" type="checkbox" checked="checked" >');
                });
                $('#preloader').hide();
            });
            $('#btnUNCheckAllFunctions').click(function () {
                $('#preloader').show();
                $.each(TblDashboardCPDocListItems.rows().data(), function (i, row) {
                    TblDashboardCPDocListItems.cell(i, 0).data('<input id="checkFunctionConfigRole" type="checkbox">');
                });
                $('#preloader').hide();

            });

            $(TblDashboardCPDocListItemsId + ' tbody').on('click', '#checkFunctionConfigRole', function (e) {
                var $cell = $(this).closest('td');
                var $row = $(this).closest('tr');
                var Tbl = TblDashboardCPDocListItems;
                var data = Tbl.row($row).data();
                var rowId = data[0];
                var col = Tbl.cell($(this).closest('td')).index();
                if (this.checked) {
                    $row.addClass("row_green");
                } else {
                    $row.removeClass("row_green");
                }
                e.stopPropagation();
            });
        }

        // -----------------------------------------------------------------------------------------------------------------------------------------------------------



        var initEmptyAllDom = function () {
            BindDashboardServicesTab([]);
            BindDashboardItemTabList([]);
            BindDashboardDeptTabServiceList([]);
            c.SetSelect2('#ItemTabService', '0', '');
            c.SetSelect2('#ItemTabDept', '0', '');
            c.SetSelect2('#DeptTabService', '0', '');
            $('#DivBtnDeptSave').hide('slow');

            c.DisableSelect2('#ItemTabDept', true);
            $('#DivBtnItemSave').hide('slow');

        };


        var initSelect2 = function () {

            //****doctors 
            ajaxWrapper.Get($("#url").data("getdoclist"), {}, function (xx, e) {
                console.log('getdoclist');
                Sel2Client($("#sel2alldoctor"), xx, function (x) { });
                Sel2Client($("#sel2alldoctorservices"), xx, function (x) { });
                Sel2Client($("#sel2alldoctordept"), xx, function (x) { });
                Sel2Client($("#sel2alldoctoritem"), xx, function (x) { });
                
            });

            $('#maintabId').hide();
            setTimeout(function () {
                $('#IPOPType').trigger('click');
                $('#IPOPType').select2('open');

            }, 500);

            $('#IPOPType').on('change', function () {
                c.SetSelect2('#sel2alldoctor', '0', '');
                setTimeout(function () {
                    $('#sel2alldoctor').trigger('click');
                    $('#sel2alldoctor').select2('open');

                }, 500);

            });

            $('#sel2alldoctor').on('change', function () {
                $('#maintabId').hide('slow');
                initEmptyAllDom();

                var docId = $(this).val();
                var ipOrop = $('#IPOPType').val();
           

                LoadServicesTab(ipOrop, docId);

                ajaxWrapper.Get($("#url").data("servicelistbytype"), { IpOrOp: $('#IPOPType').val() }, function (xx, e) {
                    Sel2Client($("#ItemTabService"), xx, function (x) {

                    });

                    Sel2Client($("#DeptTabService"), xx, function (x) {
                        $('#DivBtnDeptSave').show('slow');
                        LoadDeptTabServiceList($('#IPOPType').val(), x.id);
                    });
                });

                $('#maintabId').show('slow');
         
            });
       
            $('#ItemTabDept').on('change', function (xx) {

                $('#DivBtnItemSave').show('slow');
                $('#DIVviewCPItemTablList').show('slow');
                LoadItemTabList();

            });

            $('#ItemTabService').on('change', function (xx) {
                console.log("#ItemTabService");

                $('#DivBtnItemSave').hide('slow');
                $('#DIVviewCPItemTablList').hide('slow');

                c.DisableSelect2('#ItemTabDept', false);

                ajaxWrapper.Get($("#url").data("getdeptlistbyservice"), { IpOrOp: $('#IPOPType').val(), serviceId: $('#ItemTabService').val() }, function (xx, e) {
                    console.log("#AJAXItemTabDept");
                    Sel2Client($("#ItemTabDept"), xx, function (x) {

                    });

                });

                setTimeout(function () {
                    $('#ItemTabDept').val('0');
                    $('#ItemTabDept').trigger('click');
                    $('#ItemTabDept').select2('open');

                }, 200)

            });

            $('#sel2alldoctorservices').on('change', function () {
                LoadCPDocListServices();
            });
            $('#sel2alldoctordept').on('change', function () {
                LoadCPDocListDepartment();
            });

            $('#sel2alldoctoritem').on('change', function () {
                LoadCPDocListItems();
            });

            
            
        };

        var BtnInitViewCP = function () {
           
            $('#BtnServiceSave').click(function () {


                //--------------------------START VALIDATE SERVICE TAB

              /*  var rowcollectionValidateService = TblDashboardServicesTab.$("#checkisService:checked", { "page": "all" });
                rowcollectionValidateService.each(function (index, elem) {
                    var tr = $(elem).closest('tr');
                    var row = TblDashboardServicesTab.row(tr);
                    var rowdata = row.data();
                    validateAmountPercentage(rowdata);

                });
                if (errorloop == 1) {
                    errorloop = 0;
                    return false;
                }*/

                //--------------------------END VALIDATE SERVICE TAB


                var YesFunc = function () {

                    var entry;
                    entry = []
                    entry = {}

                    entry.IPOPType = $('#IPOPType').val();
                    entry.DocId = $('#sel2alldoctor').val();
                    entry.ServiceTabDetailsCP = [];
                    var rowcollection = TblDashboardServicesTab.$("#checkisService:checked", { "page": "all" });
                    rowcollection.each(function (index, elem) {
                        var tr = $(elem).closest('tr');
                        var row = TblDashboardServicesTab.row(tr);
                        var rowdata = row.data();

                        entry.ServiceTabDetailsCP.push({
                            ServiceId: rowdata.ServiceId
                            , Percentage: rowdata.Percentage
                            , Amount: rowdata.Amount
                        });
                    });



                   $.ajax({
                        url: $('#url').data("saveservicetab"),
                        data: JSON.stringify(entry),
                        type: 'post',
                        cache: false,
                        contentType: "application/json; charset=utf-8",
                        beforeSend: function () {

                            c.ButtonDisable('#BtnServiceSave', true);

                        },
                        success: function (data) {
                            c.ButtonDisable('#BtnServiceSave', false);


                            if (data.ErrorCode == 0) {
                                c.MessageBoxErr("Error...", data.Message);
                                return;
                            }

                            var OkFunc = function () {
                                LoadServicesTab($('#IPOPType').val(), 0);
                            };

                            c.MessageBox(data.Title, data.Message, OkFunc);
                        },
                        error: function (xhr, desc, err) {
                            c.ButtonDisable('#BtnServiceSave', false);
                            var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
                            c.MessageBox("Error...", errMsg, null);
                        }
                    }); 


                };
                c.MessageBoxConfirm("Service Save", "Are you sure you want to save your changes ?", YesFunc, null);

            });
            $('#BtnDeptSave').click(function () {


                //--------------------------START VALIDATE dept TAB

              /*  var rowcollectionValidateDept = TblDashboardDeptTabServiceList.$("#checkisDept:checked", { "page": "all" });
                rowcollectionValidateDept.each(function (index, elem) {
                    var tr = $(elem).closest('tr');
                    var row = TblDashboardDeptTabServiceList.row(tr);
                    var rowdata = row.data();
                    validateAmountPercentage(rowdata);

                });
                if (errorloop == 1) {
                    errorloop = 0;
                    return false;
                }*/

                //--------------------------END VALIDATE dept TAB

                var YesFunc = function () {
                    var entry;
                    entry = []
                    entry = {}

                    entry.IPOPType = $('#IPOPType').val();
                    entry.ServiceId = $('#DeptTabService').val();
                    entry.DocId = $('#sel2alldoctor').val();
                    entry.DepartmentTabDetailsCP = [];
                    var rowcollection = TblDashboardDeptTabServiceList.$("#checkisDept:checked", { "page": "all" });
                    rowcollection.each(function (index, elem) {
                        var tr = $(elem).closest('tr');
                        var row = TblDashboardDeptTabServiceList.row(tr);
                        var rowdata = row.data();

                        entry.DepartmentTabDetailsCP.push({
                              DeptId: rowdata.DeptId
                            , Percentage: rowdata.Percentage
                            , Amount: rowdata.Amount
                        });
                    });



                    $.ajax({
                        url: $('#url').data("savedepartmenttab"),
                        data: JSON.stringify(entry),
                        type: 'post',
                        cache: false,
                        contentType: "application/json; charset=utf-8",
                        beforeSend: function () {

                            c.ButtonDisable('#BtnServiceSave', true);

                        },
                        success: function (data) {
                            c.ButtonDisable('#BtnServiceSave', false);


                            if (data.ErrorCode == 0) {
                                c.MessageBoxErr("Error...", data.Message);
                                return;
                            }

                            var OkFunc = function () {
                                LoadDeptTabServiceList($('#IPOPType').val(), $('#DeptTabService').val());
                            };

                            c.MessageBox(data.Title, data.Message, OkFunc);
                        },
                        error: function (xhr, desc, err) {
                            c.ButtonDisable('#BtnServiceSave', false);
                            var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
                            c.MessageBox("Error...", errMsg, null);
                        }
                    }); 


                };
                c.MessageBoxConfirm("Department Save", "Are you sure you want to save your changes ?", YesFunc, null);

            });
            $('#BtnItemSave').click(function () {


                //--------------------------START VALIDATE item TAB

              /*  var rowcollectionValidateItem = TblDashboardItemTabList.$("#checkItemisService:checked", { "page": "all" });
                rowcollectionValidateItem.each(function (index, elem) {
                    var tr = $(elem).closest('tr');
                    var row = TblDashboardItemTabList.row(tr);
                    var rowdata = row.data();
                    if (errorloop == 0) {//for one error message only per loop
                        if ((parseInt(rowdata.Amount) == 0 || rowdata.Amount == "") || (parseInt(rowdata.Percentage) == 0 || rowdata.Percentage == "")) {
                            c.MessageBoxErr("Error...", "Please input number in Percentage / Amount Column in " + rowdata.itemName);
                            errorloop = 1;
                        }
                    }
                });
                if (errorloop == 1) {
                    errorloop = 0;
                    return false;
                }
                */
                //--------------------------END VALIDATE item TAB

                var YesFunc = function () {
                    var entry;
                    entry = []
                    entry = {}
                    entry.IPOPType = $('#IPOPType').val();
                    entry.ServiceId = $('#ItemTabService').val();
                    entry.DeptId = $('#ItemTabDept').val();
                    entry.DocId = $('#sel2alldoctor').val();
                    entry.ItemTabDetailsCP = [];
                    var rowcollection = TblDashboardItemTabList.$("#checkItemisService:checked", { "page": "all" });
                    rowcollection.each(function (index, elem) {
                        var tr = $(elem).closest('tr');
                        var row = TblDashboardItemTabList.row(tr);
                        var rowdata = row.data();
                        console.log(rowdata);
                        entry.ItemTabDetailsCP.push({
                            ItemId: rowdata.itemId
                            , Percentage: rowdata.Percentage
                            , Amount: rowdata.Amount
                        });
                    });


                     $.ajax({
                        url: $('#url').data("saveitemtab"),
                        data: JSON.stringify(entry),
                        type: 'post',
                        cache: false,
                        contentType: "application/json; charset=utf-8",
                        beforeSend: function () {

                            c.ButtonDisable('#BtnServiceSave', true);

                        },
                        success: function (data) {
                            c.ButtonDisable('#BtnServiceSave', false);


                            if (data.ErrorCode == 0) {
                                c.MessageBoxErr("Error...", data.Message);
                                return;
                            }

                            var OkFunc = function () {
                                LoadItemTabList();
                            };

                            c.MessageBox(data.Title, data.Message, OkFunc);
                        },
                        error: function (xhr, desc, err) {
                            c.ButtonDisable('#BtnServiceSave', false);
                            var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
                            c.MessageBox("Error...", errMsg, null);
                        }
                    }); 

                };
                c.MessageBoxConfirm("Item Save", "Are you sure you want to save your changes ?", YesFunc, null);

            });

            $('#viewViewServices').click(function () {
                BindDashboardCPDocListServices([]);
                setTimeout(function () {
                    $('#sel2alldoctorservices').trigger('click');
                    $('#sel2alldoctorservices').select2('open');

                }, 500);
            });
            $('#viewViewDept').click(function () {
                BindDashboardCPDocListDepartment([]);
                 
                setTimeout(function () {
                    $('#sel2alldoctordept').trigger('click');
                    $('#sel2alldoctordept').select2('open');

                }, 500);
            });

            $('#viewViewItems').click(function () {
                BindDashboardCPDocListItems([]);

                setTimeout(function () {
                    $('#sel2alldoctoritem').trigger('click');
                    $('#sel2alldoctoritem').select2('open');

                }, 500);
            });


        };

        function validateAmountPercentage(rowdata) {
            if (errorloop == 0) {//for one error message only per loop
                if ((parseInt(rowdata.Amount) == 0 || rowdata.Amount == "") || (parseInt(rowdata.Percentage) == 0 || rowdata.Percentage == "")) {
                    c.MessageBoxErr("Error...", "Please input integer in Percentage / Amount Column in " + rowdata.Name);
                    errorloop = 1;
                }
            }
        }

        jQuery(document).ready(function () {


            BtnInitViewCP();
            initSelect2();

        });



    };


return {

    //main function to initiate the theme
    init: function () {
        // handles style customer tool
        handleJS();

    }
};

}();