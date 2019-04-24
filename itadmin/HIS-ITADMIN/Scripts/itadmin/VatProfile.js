var c = new Common();

jQuery(document).ready(function () {


    initButton();
    ViewVat.init();

});
function initButton() {

    $('.sidebar-toggle').click();

}




/******************************************************* ********************* VIEW VAT ***************************************************************************/
var ViewVat = function () {

    // Handle Theme Settings
    var handleViewVat = function () {
        console.log('handleViewVat');
        //handle theme layout



        // -----------------------------------------Vat NEW Price------------------------------------------------------------------------------------------------------------------
        SetupPresentPrice();
        var LoadPresentPrice = function () {
            ajaxWrapper.Get($("#url").data("vatnewprice"), null, function (x, e) {
                BindDashboardPresentPrice(x.list);
            });
        };
        var TblDashboardPresentPrice;
        var TblDashboardPresentPriceId = '#DTviewVatPresentPrice';
        var TblDashboardPresentPriceDataRow;
        var ennDashboardPresentPrice = { Btn: 0, del: 1, ctr: 2, ID: 3, Name: 4, Edited: 5, Deleted: 6 };

        var Format24 = "HH:mm";
        var calcHeightDashboardPresentPrice = function () {
            return $(window).height() * 60 / 100;
        };

        function ShowDashboardRowCallDashboardPresentPrice() {
            var rc = function (nRow, aData) {
                var $nRow = $(nRow);
                //if (aData["HasAccess"] === 1) {
                //    //$('td:eq(3)', nRow).html("Yes");
                //    $nRow.addClass("row_green");
                //    $('#checkFunctionConfigRole', nRow).prop('checked', true);
                //}
            };
            return rc;
        }
        function BindDashboardPresentPrice(data) {
            console.log(data);
            // http://legacy.datatables.net/release-datatables/examples/basic_init/scroll_x.html
            TblDashboardPresentPrice = $(TblDashboardPresentPriceId).DataTable({
                cache: false,
                destroy: true,
                data: data,
                paging: false,
                ordering: false,
                searching: false,
                info: false,
                //scrollY: calcHeightDashboardPresentPrice(),
                //scrollX: "100%",
                //sScrollXInner: "100%",
                //processing: true,
                autoWidth: false,
                dom: '<"tbDashboardPresentPrice">Rlfrtip',
                scrollCollapse: false,

                //lengthChange: false,
                columns: [
                   // { data: "", title: '', className: 'control-center', visible: true, searchable: false, width: "1px", defaultContent: '<button type="button" class="btn btn-sm btn-danger" Id="btnDetailsModif" title="Delete" rel="tooltip"> <i class="glyphicon glyphicon-trash"></i></button>' },
                   // { data: "", title: ' ', className: ' ', visible: true, searchable: false, width: "0%", defaultContent: '<input type="checkbox" class="control-center iCheck-helper" id="checkFunctionConfigRole" />' },
                    { data: "Id", title: 'Tax Name', className: ' ClassName ', visible: true, searchable: false, width: "2%" },
                    { data: "Percentage", title: 'Percentage', className: 'ClassPercentage ', visible: true, searchable: false, width: "1%" },
                    { data: "GrossNet", title: 'GrossNet', className: 'ClassGrossNet ', visible: true, searchable: false, width: "1%" },
                    { data: "StartDateTime", title: 'Last Date of Current Tax  ', className: '   ', visible: true, searchable: false, width: "2%" },
                    { data: "Id", title: 'Effectivity StartDate of New Tax', className: ' ClassDOB  ', visible: true, searchable: false, width: "2%" },
                     //{ data: "Deleted", title: 'Deleted', className: ' ClassYesorNo', visible: true, searchable: false, width: "0%" }
                    //{ data: "StationId", title: 'StationId', className: '', visible: false, searchable: false, width: "0%" },
                    //{ data: "RoleId", title: 'RoleId', className: '', visible: false, searchable: false, width: "0%" },
                    //{ data: "ModuleId", title: 'ModuleId', className: '', visible: false, searchable: false, width: "0%" }
                ],
                fnRowCallback: ShowDashboardRowCallDashboardPresentPrice()
            });

            InitPresentPrice();

            var btns = '';
            var toolbar = btns.concat(
                 '<div style="float:left;">'
                 , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnCheckAllFunctions"> <i class="glyphicon glyphicon-check"></i> All </button>'
                , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnUNCheckAllFunctions"> <i class="glyphicon glyphicon-unchecked"></i> All </button>'
                , '</div><br><br>');
            //$("div.tbDashboardPresentPrice").html(toolbar);

            $('#btnCheckAllFunctions').click(function () {
                $('#preloader').show();
                $.each(TblDashboardPresentPrice.rows().data(), function (i, row) {
                    TblDashboardPresentPrice.cell(i, 0).data('<input id="checkFunctionConfigRole" type="checkbox" checked="checked" >');
                });
                $('#preloader').hide();
            });
            $('#btnUNCheckAllFunctions').click(function () {
                $('#preloader').show();
                $.each(TblDashboardPresentPrice.rows().data(), function (i, row) {
                    TblDashboardPresentPrice.cell(i, 0).data('<input id="checkFunctionConfigRole" type="checkbox">');
                });
                $('#preloader').hide();

            });

            $(TblDashboardPresentPriceId + ' tbody').on('click', '#checkFunctionConfigRole', function (e) {
                var $cell = $(this).closest('td');
                var $row = $(this).closest('tr');
                var Tbl = TblDashboardPresentPrice;
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

        function SetupPresentPrice() {

            // ------------------------------------------------------------------------------------------------------------------------------------------------------------
            $.editable.addInputType('EditableGrossNet', {
                element: function (settings, original) {
                    //  var input = $('<input id="dtS2YesNo" style="width:100%; height:30px;" type="text" class="form-control">');
                    var input = $('<select id="dtEditableGrossNet" class="form-control input-xs select2me input-sm" data-placeholder="Select..."> <option value="Gross">Gross</option> <option value="Net">Net</option> </select>');
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
            $.editable.addInputType('EditablePercentage', {
                element: function (settings, original) {

                    var input = $('<input id="dtTxtPercentage" style="width:100%; height:30px; margin:0px, padding:0px;" type="number" class="form-control">');
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
        function InitPresentPrice() {


            var Tbl = TblDashboardPresentPrice;

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
            $('.ClassPercentage', Tbl.rows().nodes()).editable(function (sVal, settings) {
                var cell = Tbl.cell($(this).closest('td')).index();
                Tbl.cell(cell.row, cell.column).data(sVal);
                return sVal;
            },
            {
                "type": 'EditablePercentage', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
                "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
            });
            $('.ClassGrossNet', Tbl.rows().nodes()).editable(function (sVal, settings) {
                var cell = Tbl.cell($(this).closest('td')).index();
                Tbl.cell(cell.row, cell.column).data(sVal);
                return sVal;
            },
           {
               "type": 'EditableGrossNet', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
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

        // -----------------------------------------Vat OldPrice------------------------------------------------------------------------------------------------------------------

        var LoadOldPrice = function () {
            ajaxWrapper.Get($("#url").data("vatpresentprice"), null, function (x, e) {
                BindDashboardOldPrice(x.list);
            });
        };
        var TblDashboardOldPrice;
        var TblDashboardOldPriceId = '#DTviewVatOldPrice';
        var TblDashboardOldPriceDataRow;
        var ennDashboardOldPrice = { Btn: 0, del: 1, ctr: 2, ID: 3, Name: 4, Edited: 5, Deleted: 6 };

        var Format24 = "HH:mm";
        var calcHeightDashboardOldPrice = function () {
            return $(window).height() * 35 / 100;
        };

        function ShowDashboardRowCallDashboardOldPrice() {
            var rc = function (nRow, aData) {
                var $nRow = $(nRow);
                //if (aData["HasAccess"] === 1) {
                //    //$('td:eq(3)', nRow).html("Yes");
                //    $nRow.addClass("row_green");
                //    $('#checkFunctionConfigRole', nRow).prop('checked', true);
                //}
            };
            return rc;
        }
        function BindDashboardOldPrice(data) {

            // http://legacy.datatables.net/release-datatables/examples/basic_init/scroll_x.html
            TblDashboardOldPrice = $(TblDashboardOldPriceId).DataTable({
                cache: false,
                destroy: true,
                data: data,
                paging: false,
                ordering: true,
                //searching: true,
                //info: false,
                scrollY: calcHeightDashboardOldPrice(),
                scrollX: "409px",
                sScrollXInner: "409px",
                //processing: true,
                autoWidth: false,
                dom: '<"tbDashboardOldPrice">Rlfrtip',
                scrollCollapse: false,
                pageLength: 75,
                //lengthChange: false,
                columns: [
                   // { data: "", title: '', className: 'control-center', visible: true, searchable: false, width: "1px", defaultContent: '<button type="button" class="btn btn-sm btn-danger" Id="btnDetailsModif" title="Delete" rel="tooltip"> <i class="glyphicon glyphicon-trash"></i></button>' },
                   // { data: "", title: ' ', className: ' ', visible: true, searchable: false, width: "0%", defaultContent: '<input type="checkbox" class="control-center iCheck-helper" id="checkFunctionConfigRole" />' },

                    { data: "TaxName", title: 'Tax Name', className: '  ', visible: true, searchable: true, width: "20%" },
                    { data: "Percentage", title: 'Percentage', className: ' ', visible: true, searchable: true, width: "3%" },
                    { data: "GrossNet", title: 'GrossNet', className: ' ', visible: true, searchable: true, width: "3%" },
                    { data: "StartDateTime", title: 'Start Date', className: '   ', visible: true, searchable: true, width: "10%" },
                     { data: "EndDateTime", title: 'End Date', className: ' ', visible: false, searchable: false, width: "1%" }
                    //{ data: "StationId", title: 'StationId', className: '', visible: false, searchable: false, width: "0%" },
                    //{ data: "RoleId", title: 'RoleId', className: '', visible: false, searchable: false, width: "0%" },
                    //{ data: "ModuleId", title: 'ModuleId', className: '', visible: false, searchable: false, width: "0%" }
                , { data: "Id", title: ' ', className: '', visible: false, searchable: true, width: "0%" }
                ],
                fnRowCallback: ShowDashboardRowCallDashboardOldPrice()
            });


            var btns = '';
            var toolbar = btns.concat(
                 '<div style="float:left;">'
                 , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnCheckAllFunctions"> <i class="glyphicon glyphicon-check"></i> All </button>'
                , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnUNCheckAllFunctions"> <i class="glyphicon glyphicon-unchecked"></i> All </button>'
                , '</div><br><br>');
            //$("div.tbDashboardOldPrice").html(toolbar);

            $('#btnCheckAllFunctions').click(function () {
                $('#preloader').show();
                $.each(TblDashboardOldPrice.rows().data(), function (i, row) {
                    TblDashboardOldPrice.cell(i, 0).data('<input id="checkFunctionConfigRole" type="checkbox" checked="checked" >');
                });
                $('#preloader').hide();
            });
            $('#btnUNCheckAllFunctions').click(function () {
                $('#preloader').show();
                $.each(TblDashboardOldPrice.rows().data(), function (i, row) {
                    TblDashboardOldPrice.cell(i, 0).data('<input id="checkFunctionConfigRole" type="checkbox">');
                });
                $('#preloader').hide();

            });

            $(TblDashboardOldPriceId + ' tbody').on('click', '#checkFunctionConfigRole', function (e) {
                var $cell = $(this).closest('td');
                var $row = $(this).closest('tr');
                var Tbl = TblDashboardOldPrice;
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


        // -----------------------------------------Vat Service TAB------------------------------------------------------------------------------------------------------------------
        SetupServicesTab();
        BindDashboardServicesTab([]);
        var LoadServicesTab = function (ipOrop, taxId) {
            console.log(ipOrop);
            console.log(taxId);
            ajaxWrapper.Get($("#url").data("vatservicestab"), { type: ipOrop, taxid: taxId }, function (x, e) {
                BindDashboardServicesTab(x.list);

            });
        };
        var TblDashboardServicesTab;
        var TblDashboardServicesTabId = '#DTviewVatServicesTab';
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
                    $('td:eq(2)', nRow).html('<span class="badge bg-green">Yes</span>');
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
                searching: true,
                //  info: false,
                scrollY: calcHeightDashboardServicesTab(),
                scrollX: "700px",
                sScrollXInner: "700px",
                //processing: true,
                autoWidth: false,

                dom: '<"tbDashboardServicesTab">Rlfrtip',
                //    scrollCollapse: false,
                //pageLength: 20,
                lengthChange: false,

                // order: [[1, "asc"]],
                columns: [
                   // { data: "", title: '', className: 'control-center', visible: true, searchable: false, width: "1px", defaultContent: '<button type="button" class="btn btn-sm btn-danger" Id="btnDetailsModif" title="Delete" rel="tooltip"> <i class="glyphicon glyphicon-trash"></i></button>' },
                    { data: "", title: ' --  ', className: '   ', visible: true, searchable: false, width: "1%", defaultContent: '<input id="checkisService" type="checkbox" class="flat-red"  style="position: absolute; opacity: 0;">' },
                    { data: "Name", title: 'Service Name', className: '   ', visible: true, searchable: true, width: "10%" },
                     { data: "", title: 'Service wise', className: '  ', visible: true, searchable: false, width: "1%", defaultContent: '<span class="badge bg-red">No</span>' },
                    { data: "Percentage", title: 'Percentage', className: 'ClassPercentageServices ', visible: true, searchable: true, width: "1%" },
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
                 , '</div>'
             , '<div style="float:right;">'

                    , '<input type="number" class="input input-sm pull-right" id="PercentageService" />'
                    , '<button type="button" class="btn-margin-right btn btn-xs red pull-right" Id="btnApplyPercentage"> <i class="glyphicon glyphicon-check"></i> Apply Percentage </button>'
              , '</div>'


              , '<br><br>');
            $("div.tbDashboardServicesTab").html(toolbar);

            $('#btnCheckAllFunctions').click(function () {
                $('#preloader').show();
                $.each(TblDashboardServicesTab.rows().data(), function (i, row) {
                    TblDashboardServicesTab.cell(i, 0).data('<input id="checkisService" type="checkbox" checked="checked" class="flat-red"   >');
                });
                initCheckbox();
                $('#preloader').hide();
            });
            $('#btnUNCheckAllFunctions').click(function () {
                $('#preloader').show();
                $.each(TblDashboardServicesTab.rows().data(), function (i, row) {
                    TblDashboardServicesTab.cell(i, 0).data('<input id="checkisService" type="checkbox" class="flat-red"  >');
                });
                initCheckbox();
                $('#preloader').hide();

            });
            $('#btnApplyPercentage').click(function () {
                $('#preloader').show();
                var percentage = $('#PercentageService').val();
                $.each(TblDashboardServicesTab.rows().data(), function (i, row) {
                    TblDashboardServicesTab.cell(i, 3).data(percentage);
                });
                $('#preloader').hide();
            });
            initCheckbox();
            $(TblDashboardServicesTabId + ' tbody').on('click', '#checkisService', function (e) {
                var $cell = $(this).closest('td');
                var $row = $(this).closest('tr');
                var Tbl = TblDashboardServicesTab;
                var data = Tbl.row($row).data();
                var rowId = data[0];
                var col = Tbl.cell($(this).closest('td')).index();
                if (this.checked) {
                    //   $row.addClass("row_green");
                } else {
                    //  $row.removeClass("row_green");
                }
                e.stopPropagation();
            });
        }
        function SetupServicesTab() {


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
            /* $.editable.addInputType('EditableGrossNet', {
                 element: function (settings, original) {
 
                     var input = $('<input id="dtTxtGrossNet" style="width:100%; height:30px; margin:0px, padding:0px;" type="number" class="form-control">');
                     $(this).append(input);
 
                     return (input);
                 }
             });
             */
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
            $('.ClassPercentageServices', Tbl.rows().nodes()).editable(function (sVal, settings) {
                var cell = Tbl.cell($(this).closest('td')).index();
                Tbl.cell(cell.row, cell.column).data(sVal);
                return sVal;
            },
            {
                "type": 'EditablePercentageService', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
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


        // -----------------------------------------Vat department TAB------------------------------------------------------------------------------------------------------------------
        SetupDashboardDeptTabServiceList();
        var LoadDeptTabServiceList = function (ipOrop, deptServiceId) {
            console.log('LoadDeptTabServiceList');
            console.log(ipOrop);
            console.log(deptServiceId);
            ajaxWrapper.Get($("#url").data("vatdepartmenttab"), { type: ipOrop, serviceId: deptServiceId }, function (x, e) {
                BindDashboardDeptTabServiceList(x.list);
            });
        };
        var TblDashboardDeptTabServiceList;
        var TblDashboardDeptTabServiceListId = '#DTviewVatDeptTabServiceList';
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
                searching: true,
                //  info: false,
                scrollY: calcHeightDashboardDeptTabServiceList(),
                scrollX: "700px",
                sScrollXInner: "700px",
                //processing: true,
                autoWidth: false,

                dom: '<"tbDashboardDeptTabServiceList">Rlfrtip',
                //    scrollCollapse: false,
                //pageLength: 20,
                lengthChange: false,
                columns: [
                   // { data: "", title: '', className: 'control-center', visible: true, searchable: false, width: "1px", defaultContent: '<button type="button" class="btn btn-sm btn-danger" Id="btnDetailsModif" title="Delete" rel="tooltip"> <i class="glyphicon glyphicon-trash"></i></button>' },
                    { data: "", title: ' -- ', className: ' input-xs ', visible: true, searchable: false, width: "1%", defaultContent: ' <input id="checkisDept" type="checkbox" class="flat-red"  style="position: absolute; opacity: 0;"> ' },
                    { data: "Name", title: 'Department Name', className: ' input-xs   ', visible: true, searchable: true, width: "10%" },
                    { data: "", title: 'Department-Wise', className: ' input-xs ', visible: true, searchable: false, width: "1%", defaultContent: '<button type="button" class="btn btn-xs red">No</button>' },
                    { data: "Percentage", title: 'Percentage', className: 'ClassPercentageDept ', visible: true, searchable: true, width: "1%" },

                   //{ data: "Percentage", title: 'Percentage', className: 'ClassPercentage ', visible: true, searchable: true, width: "0%" },
                    //{ data: "StartDateTime", title: 'Start Date', className: ' ClassDOB  ', visible: true, searchable: true, width: "0%" },
                    // { data: "Deleted", title: 'Deleted', className: ' ClassYesorNo', visible: true, searchable: false, width: "0%" }
                    //{ data: "StationId", title: 'StationId', className: '', visible: false, searchable: false, width: "0%" },
                    //{ data: "RoleId", title: 'RoleId', className: '', visible: false, searchable: false, width: "0%" },
                    //{ data: "ModuleId", title: 'ModuleId', className: '', visible: false, searchable: false, width: "0%" }
                ],
                fnRowCallback: ShowDashboardRowCallDashboardDeptTabServiceList()
            });

            InitDashboardDeptTabServiceList();


            var btns = '';
            var toolbar = btns.concat(
                 '<div style="float:left;">'
                    , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnCheckAllFunctionsDept"> <i class="glyphicon glyphicon-check"></i> All </button>'
                    , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnUNCheckAllFunctionsDept"> <i class="glyphicon glyphicon-unchecked"></i> All </button>'
                 , '</div>'
             , '<div style="float:right;">'

                    , '<input type="number" class="input input-sm pull-right" id="PercentageServiceDept" />'
                    , '<button type="button" class="btn-margin-right btn btn-xs red pull-right" Id="btnApplyPercentageDept"> <i class="glyphicon glyphicon-check"></i> Apply Percentage </button>'
              , '</div>'


              , '<br><br>');
            $("div.tbDashboardDeptTabServiceList").html(toolbar);
            $('#btnCheckAllFunctionsDept').click(function () {
                $('#preloader').show();
                $.each(TblDashboardDeptTabServiceList.rows().data(), function (i, row) {
                    TblDashboardDeptTabServiceList.cell(i, 0).data('<input id="checkisDept" type="checkbox" checked="checked" class="flat-red"  style="position: absolute; opacity: 0;" >');
                });
                initCheckbox();
                $('#preloader').hide();
            });
            $('#btnUNCheckAllFunctionsDept').click(function () {
                $('#preloader').show();
                $.each(TblDashboardDeptTabServiceList.rows().data(), function (i, row) {
                    TblDashboardDeptTabServiceList.cell(i, 0).data('<input id="checkisDept" type="checkbox" class="flat-red"  style="position: absolute; opacity: 0;" >');
                });
                initCheckbox();
                $('#preloader').hide();

            });
            $('#btnApplyPercentageDept').click(function () {
                $('#preloader').show();
                var percentage = $('#PercentageServiceDept').val();
                $.each(TblDashboardDeptTabServiceList.rows().data(), function (i, row) {
                    TblDashboardDeptTabServiceList.cell(i, 3).data(percentage);
                });
                $('#preloader').hide();
            });
            initCheckbox();
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

        function SetupDashboardDeptTabServiceList() {

            // ------------ ------------------------------------------------------------------------------------------------------------------------------------------------
            $.editable.addInputType('EditablePercentageDept', {
                element: function (settings, original) {

                    var input = $('<input id="dtTxtPercentageDept" style="width:100%; height:30px; margin:0px, padding:0px;" type="number" class="form-control">');
                    $(this).append(input);

                    return (input);
                }
            });

            // ------------------------------------------------------------------------------------------------------------------------------------------------------------


        }
        function InitDashboardDeptTabServiceList() {


            var Tbl = TblDashboardDeptTabServiceList;



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


        }

        // -----------------------------------------------------------------------------------------------------------------------------------------------------------


        // -----------------------------------------Vat item TAB------------------------------------------------------------------------------------------------------------------
        SetupDashboardItemTabList();
        var LoadItemTabList = function () {
            console.log('LoadItemTabList');

            // $('#preloader').show();
            ajaxWrapper.Get($("#url").data("vatitemstabdatatable"), { type: $('#IPOPType').val(), taxid: 0, serviceid: $('#ItemTabService').val(), deptid: $('#ItemTabDept').val() }, function (x, e) {
                BindDashboardItemTabList(x.list);
                //  $('#preloader').hide();
            });
        };
        var TblDashboardItemTabList;
        var TblDashboardItemTabListId = '#DTviewVatItemTablList';
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
                autoWidth: false,
                cache: true,
                destroy: true,
                data: data,
                paging: false,
                ordering: true,
                searching: true,
                //  info: false,

                scrollY: calcHeightDashboardItemTabList(),
                scrollX: "700px",
                sScrollXInner: "700px",
                //processing: true,


                dom: '<"tbDashboardItemTabList">Rlfrtip',
                //    scrollCollapse: false,
                //pageLength: 20,
                lengthChange: false,

                columns: [
                   // { data: "", title: '', className: 'control-center', visible: true, searchable: false, width: "1px", defaultContent: '<button type="button" class="btn btn-sm btn-danger" Id="btnDetailsModif" title="Delete" rel="tooltip"> <i class="glyphicon glyphicon-trash"></i></button>' },
                    { data: "", title: ' Item  ', className: '  ', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox"   id="checkItemisService"  class="flat-red"  style="position: absolute; opacity: 0;" />' },
                    { data: "itemName", title: 'Item Name', className: '     ', visible: true, searchable: true, width: "10%" },
                    { data: "", title: 'Item-Wise', className: ' input-xs ', visible: true, searchable: false, width: "1%", defaultContent: '<button type="button" class="btn btn-xs red">No</button>' },
                     { data: "Percentage", title: 'Percentage', className: 'ClassPercentageItem ', visible: true, searchable: true, width: "1%" },

                   // { data: "", title: 'Dept-Wise', className: ' input-xs ', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" class="control-center iCheck-helper" id="checkisDept" />' },

                   //{ data: "Percentage", title: 'Percentage', className: 'ClassPercentage ', visible: true, searchable: true, width: "0%" },
                    //{ data: "StartDateTime", title: 'Start Date', className: ' ClassDOB  ', visible: true, searchable: true, width: "0%" },
                    // { data: "Deleted", title: 'Deleted', className: ' ClassYesorNo', visible: true, searchable: false, width: "0%" }
                    //{ data: "StationId", title: 'StationId', className: '', visible: false, searchable: false, width: "0%" },
                    //{ data: "RoleId", title: 'RoleId', className: '', visible: false, searchable: false, width: "0%" },
                    { data: "itemId", title: ' ', className: '', visible: false, searchable: false, width: "0%" }
                ],
                fnRowCallback: ShowDashboardRowCallDashboardItemTabList()
            });

            InitDashboardItemTabList();
            var btns = '';
            var toolbar = btns.concat(
                '<div style="float:left;">'
                   , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnCheckAllFunctionsItem"> <i class="glyphicon glyphicon-check"></i> All </button>'
                   , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnUNCheckAllFunctionsItem"> <i class="glyphicon glyphicon-unchecked"></i> All </button>'
                , '</div>'
            , '<div style="float:right;">'

                   , '<input type="number" class="input input-sm pull-right" id="PercentageServiceItem" />'
                   , '<button type="button" class="btn-margin-right btn btn-xs red pull-right" Id="btnApplyPercentageItem"> <i class="glyphicon glyphicon-check"></i> Apply Percentage </button>'
             , '</div>'


             , '<br><br>');
            $("div.tbDashboardItemTabList").html(toolbar);
            $('#btnCheckAllFunctionsItem').click(function () {
                $('#preloader').show();
                $.each(TblDashboardItemTabList.rows().data(), function (i, row) {
                    TblDashboardItemTabList.cell(i, 0).data('<input id="checkItemisService" type="checkbox" checked="checked" class="flat-red"  style="position: absolute; opacity: 0;" >');
                });
                initCheckbox();
                $('#preloader').hide();
            });
            $('#btnUNCheckAllFunctionsItem').click(function () {
                $('#preloader').show();
                $.each(TblDashboardItemTabList.rows().data(), function (i, row) {
                    TblDashboardItemTabList.cell(i, 0).data('<input id="checkItemisService" type="checkbox" class="flat-red"  style="position: absolute; opacity: 0;">');
                });
                initCheckbox();
                $('#preloader').hide();

            });
            $('#btnApplyPercentageItem').click(function () {
                $('#preloader').show();
                var percentage = $('#PercentageServiceItem').val();
                $.each(TblDashboardItemTabList.rows().data(), function (i, row) {
                    TblDashboardItemTabList.cell(i, 3).data(percentage);
                });
                $('#preloader').hide();
            });
            initCheckbox();
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

        function SetupDashboardItemTabList() {

            // ------------ ------------------------------------------------------------------------------------------------------------------------------------------------
            $.editable.addInputType('EditablePercentageItem', {
                element: function (settings, original) {

                    var input = $('<input id="dtTxtPercentageItem" style="width:100%; height:30px; margin:0px, padding:0px;" type="number" class="form-control">');
                    $(this).append(input);

                    return (input);
                }
            });

            // ------------------------------------------------------------------------------------------------------------------------------------------------------------


        }
        function InitDashboardItemTabList() {


            var Tbl = TblDashboardItemTabList;



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


        }
        // -----------------------------------------------------------------------------------------------------------------------------------------------------------


        // -----------------------------------------Tax Exemption TAB------------------------------------------------------------------------------------------------------------------


        var LoadTaxExemption = function () {
            ajaxWrapper.Get($("#url").data("taxexemplist"), null, function (x, e) {
                BindDashboardTaxExemption(x.list);
            });
        };
        var TblDashboardTaxExemption;
        var TblDashboardTaxExemptionId = '#DTviewVatTaxExemption';
        var TblDashboardTaxExemptionDataRow;
        var ennDashboardTaxExemption = { Btn: 0, del: 1, ctr: 2, ID: 3, Name: 4, Edited: 5, Deleted: 6 };

        var Format24 = "HH:mm";
        var calcHeightDashboardTaxExemption = function () {
            return $(window).height() * 35 / 100;
        };

        function ShowDashboardRowCallDashboardTaxExemption() {
            var rc = function (nRow, aData) {
                var $nRow = $(nRow);
                //if (aData["HasAccess"] === 1) {
                //    //$('td:eq(3)', nRow).html("Yes");
                //    $nRow.addClass("row_green");
                //    $('#checkFunctionConfigRole', nRow).prop('checked', true);
                //}
            };
            return rc;
        }
        function BindDashboardTaxExemption(data) {

            TblDashboardTaxExemption = $(TblDashboardTaxExemptionId).DataTable({
                cache: false,
                destroy: true,
                data: data,
                paging: false,
                ordering: true,
                //searching: true,
                //info: false,
                scrollY: calcHeightDashboardTaxExemption(),
                scrollX: "409px",
                sScrollXInner: "409px",
                //processing: true,
                autoWidth: false,
                dom: '<"tbDashboardTaxExemption">Rlfrtip',
                scrollCollapse: false,
                pageLength: 75,
                //lengthChange: false,
                columns: [
                         { data: "NationalityName", title: 'Nationality ', className: ' ', visible: true, searchable: true, width: "3%" }
                         , { data: "Percentage", title: 'Percentage', className: ' ', visible: true, searchable: true, width: "3%" }
                        , { data: "Id", title: ' ', className: '', visible: false, searchable: false, width: "0%" }
                        , { data: "NationalityId", title: ' ', className: '', visible: false, searchable: true, width: "0%" }
                ],
                fnRowCallback: ShowDashboardRowCallDashboardTaxExemption()
            });


            var btns = '';
            var toolbar = btns.concat(
                 '<div style="float:left;">'
                 , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnCheckAllFunctions"> <i class="glyphicon glyphicon-check"></i> All </button>'
                , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnUNCheckAllFunctions"> <i class="glyphicon glyphicon-unchecked"></i> All </button>'
                , '</div><br><br>');
            //$("div.tbDashboardTaxExemption").html(toolbar);
 
 
            $(TblDashboardTaxExemptionId + ' td').on('click', '', function (e) {
                var $cell = $(this).closest('td');
                var $row = $(this).closest('tr');
                var Tbl = TblDashboardTaxExemption;
                var data = Tbl.row($row).data();
                var rowId = data;
                
                $('#EditTaxExempNationalityId').val(rowId.NationalityId);
                $('#EditTaxExempId').val(rowId.Id);
                $('#EditTaxExempNationality').html(rowId.NationalityName);
                $('#EdittaxExempPercentage').val(rowId.Percentage);
             
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

            ajaxWrapper.Get($("#url").data("getnationality"), {}, function (xx, e) {
                Sel2Client($("#TaxExempNationality"), xx, function (x) {
                });
            });

            $('#maintabId').hide();
            setTimeout(function () {
                $('#IPOPType').trigger('click');
                $('#IPOPType').select2('open');

            }, 500);


            $('#IPOPType').on('change', function () {
                $('#maintabId').hide('slow');
                initEmptyAllDom();

                var ipOrop = $(this).val();

                LoadServicesTab(ipOrop, 0);

                ajaxWrapper.Get($("#url").data("servicelistbytype"), { IpOrOp: $('#IPOPType').val() }, function (xx, e) {
                    Sel2Client($("#ItemTabService"), xx, function (x) {

                    });

                    Sel2Client($("#DeptTabService"), xx, function (x) {
                        $('#DivBtnDeptSave').show('slow');
                        LoadDeptTabServiceList($('#IPOPType').val(), x.id);
                    });
                });

                $('#maintabId').show('slow');
                //ajaxWrapper.Get($("#url").data("taxlist"), null, function (xx, e) {
                //    Sel2Client($("#txttaxlistId"), xx, function (x) {
                //        $('#maintabId').show('slow');
                //        LoadServicesTab(ipOrop, x.id);
                //    })
                //});
                //setTimeout(function () {
                //    $('#txttaxlistId').val('0');
                //    $('#txttaxlistId').trigger('click');
                //    $('#txttaxlistId').select2('open');
                //}, 200)


            });
            //$('#txttaxlistId').on('change', function () {
            //    ajaxWrapper.Get($("#url").data("servicelistbytype"), { IpOrOp: $('#IPOPType').val() }, function (xx, e) {
            //        Sel2Client($("#ItemTabService"), xx, function (x) {

            //        });

            //        Sel2Client($("#DeptTabService"), xx, function (x) {
            //            $('#DivBtnDeptSave').show('slow');
            //            LoadDeptTabServiceList($('#IPOPType').val(), $('#txttaxlistId').val(), x.id);
            //        });
            //    });
            //});
            $('#ItemTabDept').on('change', function (xx) {

                $('#DivBtnItemSave').show('slow');
                $('#DIVviewVatItemTablList').show('slow');
                LoadItemTabList();

            });

            $('#ItemTabService').on('change', function (xx) {
                console.log("#ItemTabService");

                $('#DivBtnItemSave').hide('slow');
                $('#DIVviewVatItemTablList').hide('slow');

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


        };

        var BtnInitViewVat = function () {
            $('#viewVatInit').click(function () {
                LoadPresentPrice();
                LoadOldPrice();
            });

            $('#viewTaxExemption').click(function () {

                
                LoadTaxExemption();
                $('#EditTaxExempNationalityId').val(0);
                $('#EditTaxExempId').val(0);
                $('#EditTaxExempNationality').html("");
                $('#EdittaxExempPercentage').val("");
            });


            $('#BtnviewVatSave').click(function () {
                var YesFunc = function () {
                    var entry;
                    entry = []
                    entry = {}
                    entry.Action = 1;

                    $('#DTviewVatPresentPrice tbody tr').each(function () {

                        var TaxName = $(this).find('td:eq(0)').text();
                        var Percentage = $(this).find('td:eq(1)').text();
                        var GrossNet = $(this).find('td:eq(2)').text();
                        var LastDate = new Date($(this).find('td:eq(3)').text());
                        var StartDate = new Date($(this).find('td:eq(4)').text());


                        if (GrossNet.trim() == "" || TaxName.trim() == "" || $(this).find('td:eq(4)').text().trim() == "" || Percentage.trim() == ""   ) {
                            c.MessageBoxErr("Error...", "Please input correct data...");
                            return false;
                        }
                        if (LastDate > StartDate) {
                            c.MessageBoxErr("Error...", "New date should be greater than the last current tax date."); return false;
                        }
                        if (Date.parse(LastDate) == Date.parse(StartDate)) {
                            c.MessageBoxErr("Error...", "New date should be not be equal to the last current tax date.");
                            return false;
                        }


                        entry.TaxName = TaxName.trim();
                        entry.Percentage = Percentage.trim();
                        entry.GrossNet = GrossNet.trim() == "Gross" ? 1 : 2;
                        entry.StartDate = $(this).find('td:eq(4)').text();

                        $.ajax({
                            url: $('#url').data("savenewvat"),
                            data: JSON.stringify(entry),
                            type: 'post',
                            cache: false,
                            contentType: "application/json; charset=utf-8",
                            beforeSend: function () {

                                c.ButtonDisable('#BtnviewVatSave', true);

                            },
                            success: function (data) {
                                c.ButtonDisable('#BtnviewVatSave', false);


                                if (data.ErrorCode == 0) {
                                    c.MessageBoxErr("Error...", data.Message);
                                    return;
                                }

                                var OkFunc = function () {
                                    $('#BtnviewVatSaveClose').trigger('click');
                                };

                                c.MessageBox(data.Title, data.Message, OkFunc);
                            },
                            error: function (xhr, desc, err) {
                                c.ButtonDisable('#BtnviewVatSave', false);
                                var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
                                c.MessageBox("Error...", errMsg, null);
                            }
                        });


                    });
                };
                c.MessageBoxConfirm("Save Vat Charges", "Are you sure you want to save your changes ?", YesFunc, null);

            });


            $('#BtnServiceSave').click(function () {
                var YesFunc = function () {
                    var entry;
                    entry = []
                    entry = {}

                    entry.IPOPType = $('#IPOPType').val();
                    entry.ServiceTabDetails = [];
                    var rowcollection = TblDashboardServicesTab.$("#checkisService:checked", { "page": "all" });
                    rowcollection.each(function (index, elem) {
                        var tr = $(elem).closest('tr');
                        var row = TblDashboardServicesTab.row(tr);
                        var rowdata = row.data();
                        console.log(rowdata);

                        entry.ServiceTabDetails.push({
                            ServiceId: rowdata.ServiceId
                            , Percentage: rowdata.Percentage
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
                var YesFunc = function () {
                    var entry;
                    entry = []
                    entry = {}

                    entry.IPOPType = $('#IPOPType').val();
                    entry.ServiceId = $('#DeptTabService').val();
                    entry.DepartmentTabDetails = [];
                    var rowcollection = TblDashboardDeptTabServiceList.$("#checkisDept:checked", { "page": "all" });
                    rowcollection.each(function (index, elem) {
                        var tr = $(elem).closest('tr');
                        var row = TblDashboardDeptTabServiceList.row(tr);
                        var rowdata = row.data();

                        entry.DepartmentTabDetails.push({
                            DeptId: rowdata.DeptId
                           , Percentage: rowdata.Percentage
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
                var YesFunc = function () {
                    var entry;
                    entry = []
                    entry = {}
                    entry.IPOPType = $('#IPOPType').val();
                    entry.ServiceId = $('#ItemTabService').val();
                    entry.DeptId = $('#ItemTabDept').val();
                    entry.ItemTabDetails = [];
                    var rowcollection = TblDashboardItemTabList.$("#checkItemisService:checked", { "page": "all" });
                    rowcollection.each(function (index, elem) {
                        var tr = $(elem).closest('tr');
                        var row = TblDashboardItemTabList.row(tr);
                        var rowdata = row.data();
                        console.log(rowdata);
                        entry.ItemTabDetails.push({
                            ItemId: rowdata.itemId
                            , Percentage: rowdata.Percentage
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

            $('#btnAddTaxExemp').click(function () {

                if ($('#taxExempPercentage').val() == "" || $('#TaxExempNationality').val() == "") {
                    c.MessageBoxErr('Warning', 'Please input Nationality/Percentage.');
                } else {
                    var YesFunc = function () {
                        var entry;
                        entry = []
                        entry = {}
                        entry.NationalityId = $('#TaxExempNationality').val() == "" ? "0" : $('#TaxExempNationality').val() ;
                        entry.Percentage = $('#taxExempPercentage').val();
                        entry.Id = "0";
                        
                        console.log(entry);
                         $.ajax({
                            url: $('#url').data("savetaxexemption"),
                            data: JSON.stringify(entry),
                            type: 'post',
                            cache: false,
                            contentType: "application/json; charset=utf-8",
                            beforeSend: function () {

                                c.ButtonDisable('#btnAddTaxExemp', true);

                            },
                            success: function (data) {
                                c.ButtonDisable('#btnAddTaxExemp', false);


                                if (data.ErrorCode == 0) {
                                    c.MessageBoxErr("Error...", data.Message);
                                    return;
                                }

                                var OkFunc = function () {
                                    LoadTaxExemption();
                                };

                                c.MessageBox(data.Title, data.Message, OkFunc);
                            },
                            error: function (xhr, desc, err) {
                                c.ButtonDisable('#btnAddTaxExemp', false);
                                var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
                                c.MessageBox("Error...", errMsg, null);
                            }
                        });
                        
                    };
                    c.MessageBoxConfirm("Item Save", "Are you sure you want to save your changes ?", YesFunc, null);
                }
            });
            $('#btnUpdateTaxExemp').click(function () {
                if ($('#EditTaxExempId').val() == "0" || $('#EditTaxExempNationalityId').val() == "" || $('#EdittaxExempPercentage').val() == "") {
                    c.MessageBoxErr('Warning', 'Please select a Nationality and Percentage.');
                } else {
                    var YesFunc = function () {
                        var entry;
                        entry = []
                        entry = {}
                        entry.NationalityId = $('#EditTaxExempNationalityId').val();
                        entry.Percentage = $('#EdittaxExempPercentage').val();
                        entry.Id = $('#EditTaxExempId').val();
                    
                        console.log(entry);
                          $.ajax({
                               url: $('#url').data("savetaxexemption"),
                               data: JSON.stringify(entry),
                               type: 'post',
                               cache: false,
                               contentType: "application/json; charset=utf-8",
                               beforeSend: function () {
   
                                   c.ButtonDisable('#btnUpdateTaxExemp', true);
   
                               },
                               success: function (data) {
                                   c.ButtonDisable('#btnUpdateTaxExemp', false);
   
   
                                   if (data.ErrorCode == 0) {
                                       c.MessageBoxErr("Error...", data.Message);
                                       return;
                                   }
   
                                   var OkFunc = function () {
                                       LoadTaxExemption();
                                   };
   
                                   c.MessageBox(data.Title, data.Message, OkFunc);
                               },
                               error: function (xhr, desc, err) {
                                   c.ButtonDisable('#btnUpdateTaxExemp', false);
                                   var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
                                   c.MessageBox("Error...", errMsg, null);
                               }
                           });
                           

                    };
                    c.MessageBoxConfirm("Item Save", "Are you sure you want to save your changes ?", YesFunc, null);
                }

            });

            


        };

        function initCheckbox() {

            //Flat red color scheme for iCheck
            $('input[type="checkbox"].flat-red, input[type="radio"].flat-red').iCheck({
                checkboxClass: 'icheckbox_flat-green',
                radioClass: 'iradio_flat-green'
            });
        };


        jQuery(document).ready(function () {


            BtnInitViewVat();
            initSelect2();

        });


    };


    return {

        //main function to initiate the theme
        init: function () {
            // handles style customer tool
            handleViewVat();

        }
    };

}();

/******************************************************* ****************************** ***************************************************************************/