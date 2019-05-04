var c = new Common();


$(document).ready(function () {

    c.SetTitle("Screening");
    c.DefaultSettings();
    ViewScreen.init();

});




/******************************************************* ********************* VIEW Screen ***************************************************************************/
var ViewScreen = function () {

    var handleScreenJs = function () {
        console.log('handleScreenJs');
        jQuery(document).ready(function () {
            LoadScreenDashboard();
            initSelect2();
            initClick();

            initOnChange();

        });
        function initOnChange() {
            $('#scrnScreenResultValueIS').on('change', function (xx) {
                if ($(this).is(":checked")) {
                    $('#scrnScreenResultValue').prop('readonly', false);
                    setTimeout(function () {
                        $('#scrnScreenResultValue').trigger('click');
                        $('#scrnScreenResultValue').select2('open');
                    }, 300);
                }
                else { $('#scrnScreenResultValue').prop('readonly', true);   }

            });

            $('#scrnComponentIS').change(function () {

                if ($(this).is(":checked")) {
                    $("#scrnComponent").removeProp("readonly");
                    setTimeout(function () {
                        $('#scrnComponent').trigger('click');
                        $('#scrnComponent').select2('open');
                    }, 300);

                } else {
                    c.Select2Clear("#scrnComponent");
                    $("#scrnComponent").prop("readonly", "true");
                  
                }
            });

        }
        function initSelect2() {


            $("#scrnScreenResultValue").select2({
                placeholder: "Select multiple Screen Type...",
                data: [],
                minimumInputLength: 0,
                tags: true,
                ajax: {
                    quietMillis: 150,
                    url: $('#url').data('select2screenresult'),
                    dataType: 'jsonp',
                    data: function (term, page) {
                        return {
                            pageSize: pageSize,
                            pageNum: page,
                            searchTerm: term
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


            $("#scrnComponent").select2({
                placeholder: "Select multiple component...",
                data: [],
                minimumInputLength: 0,
                tags: true,
                ajax: {
                    quietMillis: 150,
                    url: $('#url').data('select2component'),
                    dataType: 'jsonp',
                    data: function (term, page) {
                        return {
                            pageSize: pageSize,
                            pageNum: page,
                            searchTerm: term
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

            $('#scrnbloodgroup').select2({
                //containerCssClass: "RequiredField",
                minimumInputLength: 0,
                allowClear: true,
                ajax: {
                    quietMillis: 150,
                    url: $('#url').data('select2bloodgroup'),
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
                //var list = e.added.list;

            });


        }
        function initClick() {
            $('#btnRefresh').click(function () {
              location.reload();
            });
            $('#btnclose').click(function () {
                c.ModalShow('#screendetails', false);
            });
            $('#btnView').click(function () {
                showScreenDetails(TblDashboardScreenDashboardDataRow);
            });

            $("#btnUpdate").click(function () {
                if (valid()) {
                    Save();
                }
            });


            $(document).on("click", TblDashboardScreenDashboardId + " td", function (e) {
                e.preventDefault();

                if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
                    var tr = $(this).closest('tr');

                    tr.removeClass('selected');
                    $('tr.selected').removeClass('selected');
                    tr.addClass('selected')

                    TblDashboardScreenDashboardDataRow = TblDashboardScreenDashboard.row($(this).parents('tr')).data();


                }
            });

            $(document).on("dblclick", TblDashboardScreenDashboardId + " td", function (e) {
                e.preventDefault();

                if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
                    var tr = $(this).closest('tr');

                    TblDashboardScreenDashboardDataRow = TblDashboardScreenDashboard.row($(this).parents('tr')).data();


                    showScreenDetails(TblDashboardScreenDashboardDataRow);


                }
            });

            $('#btnView').click(function () {

                if (TblDashboardScreenDashboard.rows('.selected').data().length == 0) {
                    c.MessageBoxErr("Select...", "Please select a row to view.", null);
                    return;
                }

            });

            $(document).on("change", $("#scrnScreenResult"), function (e) {
                if ($("#scrnScreenResult :selected").text() == "POSITIVE") {
                    $("#scrnScreenResultValueIS").prop("checked", true);
                    $('#scrnScreenResultValue').prop('readonly', false);
                }
                else {
                    c.Select2Clear('#scrnScreenResultValue');
                    $("#scrnScreenResultValueIS").prop("checked", false);
                    $('#scrnScreenResultValue').prop('readonly', true);
                }
            });

        }

        function valid() {
            var errortext = "";
            var errors = [];


            if ($("#scrnbloodgroup").val() == 0 || $("#scrnbloodgroup").val() == "") {
                errors.push("Select a blood group.");
            }

            if ($("#scrnComponentIS").is(":checked")) {
                if (!$('#scrnComponent').val()) {
                    errors.push("Select a Component/s");
                }
            }

            //if (!$("#scrnScreenType").is(":checked")) {
            //    errors.push("Screen Type is not check..");
            //}


            
            if ($("#scrnScreenResult").val() == 2) {//POSITIVE
                if ($("#scrnScreenResultValueIS").is(":checked")) {
                    if (!$('#scrnScreenResultValue').val()) {
                        errors.push("Select a Screen Result/s.");
                    }
                } else {
                    errors.push("Please select a Positive Screen Result/s.");
                }
 
            }

            if ($("#scrnScreenResult").val() == 1) { //NEGA
                if ($('#scrnScreenResultValue').val()) {
                    errors.push("Please Remove the Screen Result values.");
                }
                if ($("#scrnScreenResultValueIS").is(":checked")) {                  
                        errors.push("Please uncheck the Screen Result.");
                    
                }

            }

            if (!$("#scrnVerified").is(":checked")) {
                errors.push("Please verify the unit.");

            }
            if (!$("#scrnIsScreen").is(":checked") & !$("#scrnIsScreenVerify").is(":checked")) {
                errors.push("Please select Screening / Screen Verified.");

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
                id: TblDashboardScreenDashboardDataRow.id,
                DonorRegistrationNO: TblDashboardScreenDashboardDataRow.DonorRegistrationNO,

                screentype: c.GetICheck("#scrnScreenType"),// rapid
                screenverified: c.GetICheck("#scrnIsScreenVerify"),
                screening: c.GetICheck("#scrnIsScreen"), //1 - not screen 2- screen   insert to screen
                verified: c.GetICheck("#scrnVerified"),

                bloodgroup: c.GetSelect2Id('#scrnbloodgroup'), //bloodtype
                groupoperatorid: (c.GetSelect2Id('#scrnbloodgroup') != TblDashboardScreenDashboardDataRow.bloodgroup) ? 1 : 0,   //if the blood type changes                           
                screenresultNega: $("#scrnScreenResult").val(), // 1-nega 2-postive
                componentids: null,
                screenresults: null
            }

            var components = [];
            var screenresults = [];
            //if ($("#scrnComponentIS").is(":checked")) {
                var arr = $('#scrnComponent').val();
                $.each(arr.split(','), function (i, val) {
                    components.push(val);
                });
                model.componentids = components;
            //}
            if ($("#scrnScreenResultValueIS").is(":checked")) {
                var arrt = $('#scrnScreenResultValue').val();
                $.each(arrt.split(','), function (i, val) {
                    screenresults.push( val);
                });
                model.screenresults = screenresults;
            }
            /*
       
            var model = {
                id: TblDashboardScreenDashboardDataRow.id,
                DonorRegistrationNO: TblDashboardScreenDashboardDataRow.DonorRegistrationNO,

                screentype: c.GetICheck("#scrnScreenType"),// rapid
                screenverified: c.GetICheck("#scrnIsScreenVerify"),
                screening: c.GetICheck("#scrnIsScreen"), //1 - not screen 2- screen   insert to screen
                verified: c.GetICheck("#scrnVerified"),

                bloodgroup: c.GetSelect2Id('#scrnbloodgroup'), //bloodtype
                groupoperatorid: (c.GetSelect2Id('#scrnbloodgroup') != TblDashboardScreenDashboardDataRow.bloodgroup) ? 1 : 0,   //if the blood type changes                           
                screenresultNega: $("#scrnScreenResult").val() // 1-nega 2-postive
            }

            model.componentid = {};
            model.componentid = [];
            model.screenresult = {};
            model.screenresult = [];
            if ($("#scrnComponentIS").is(":checked")) {
                arr = $('#scrnComponent').val();
                $.each(arr.split(','), function (i, val) {
                    model.componentid.push({
                        BinaryId: val
                    });
                });
            }           
            if ($("#scrnScreenResultValueIS").is(":checked")) {
             
                    arrt = $('#scrnScreenResultValue').val();
                    $.each(arrt.split(','), function (i, val) {
                        model.screenresult.push({
                            ScrnBinaryId: val
                        });
                    });
                 
            }  
           */

            console.log(model);

            ajaxWrapper.Post($("#url").data("save"), JSON.stringify(model), function (x, e) {
                console.log('x');
                console.log(x);
                console.log('e');
                if (x.ErrorCode == 0) {
                    c.ModalShow('#screendetails', false);
                    c.MessageBox("Error...", x.Message, function () { LoadScreenDashboard(); });
                    return false;
                } else {
                    c.ModalShow('#screendetails', false);
                    c.MessageBox("Success", "Screen Updated.", function () {

                        LoadScreenDashboard();
                    });

                }
            } );

        }

        function showScreenDetails(TblDashboardScreenDashboardDataRow) {
          
            c.ModalShow('#screendetails', true);
            c.Select2Clear('#scrnComponent');
            c.Select2Clear('#scrnScreenResultValue');
            c.Select2Clear('#scrnbloodgroup');

            $("input:checkbox").attr('checked', false);

            c.SetValue('#bagidtitle', TblDashboardScreenDashboardDataRow.id);
            c.SetValue('#scrnRegno', TblDashboardScreenDashboardDataRow.DonorRegistrationNO);
            if (TblDashboardScreenDashboardDataRow.screenresult) {
                c.SetValue('#scrnScreenResult', TblDashboardScreenDashboardDataRow.screenresult);
            } else {
                c.SetValue('#scrnScreenResult', 1); //1 nega 2-positive
            }
            c.iCheckSet('#scrnScreenType', TblDashboardScreenDashboardDataRow.screentype != 0);
            c.iCheckSet('#scrnComponentIS', TblDashboardScreenDashboardDataRow.componentid != 0);
            c.iCheckSet('#scrnVerified', TblDashboardScreenDashboardDataRow.verified != 0);
            c.iCheckSet('#scrnIsScreen', TblDashboardScreenDashboardDataRow.status == 2);
            c.SetSelect2('#scrnbloodgroup', TblDashboardScreenDashboardDataRow.bloodgroup, TblDashboardScreenDashboardDataRow.bloodgroupname);

            getComponentdetails(TblDashboardScreenDashboardDataRow.id);
            getScreenDetails(TblDashboardScreenDashboardDataRow.id);
            c.Select2Clear('#scrnComponent');
        }

        function getComponentdetails(bagid)
        {
            ajaxWrapper.Get($("#url").data("getcomponentdetails"), { bagid: bagid }, function (x, e) {
             
                var xrows = [];
                $.each(x.list, function (index, value) {
                    xrows.push({ id: value.id, text: value.text });
                });
                console.log('getComponentdetails');
                console.log(xrows);
                $('#scrnComponent').select2("data", xrows);
                $('#scrnComponentIS').prop("hidden", true);
                $('#dvComponent').prop("hidden", true);
                debugger;
                if (!TblDashboardScreenDashboardDataRow.IsCompExist) {
                    $('#dvComponent').prop("hidden", false);
                    c.SetSelect2('#scrnComponent', TblDashboardScreenDashboardDataRow.procid, TblDashboardScreenDashboardDataRow.ProcName);
                }
            });
        }

        function getScreenDetails(bagid) {
            ajaxWrapper.Get($("#url").data("getscreendetails"), { bagid: bagid }, function (x, e) {

                var xrows = [];
                $.each(x.list, function (index, value) {
                    xrows.push({ id: value.id, text: value.text });
                });
                console.log('getScreenDetails');
                console.log(xrows);
                $('#scrnScreenResultValue').select2("data", xrows);

            });
        }

        // -----------------------------------------Screen Dasboard------------------------------------------------------------------------------------------------------------------
        SetupScreenDashboard();
        var LoadScreenDashboard = function () {
            ajaxWrapper.Get($("#url").data("screendashboard"), null, function (x, e) {
                BindDashboardScreenDashboard(x.list);
            });
        };
        var TblDashboardScreenDashboard;
        var TblDashboardScreenDashboardId = '#DTScreenDashboard';
        var TblDashboardScreenDashboardDataRow;
        var ennDashboardScreenDashboard = { Btn: 0, del: 1, ctr: 2, ID: 3, Name: 4, Edited: 5, Deleted: 6 };

        var Format24 = "HH:mm";
        var calcHeightDashboardScreenDashboard = function () {
            return $(window).height() * 50 / 100;
        };

        function ShowDashboardRowCallDashboardScreenDashboard() {
            var rc = function (nRow, aData) {
                var $nRow = $(nRow);
                //if (aData["HasAccess"] === 1) {
                //    //$('td:eq(3)', nRow).html("Yes");
                //    $nRow.addClass("row_green");
                //    $('#checkFunctionConfigRole', nRow).prop('checked', true);
                //}

                var status = aData['status'];
                var screenresult = aData['screenresult'];

                var $nRow = $(nRow);
                if (status == 1) { // not screen
                    $nRow.css({ "background-color": "#fcc9c9" })
                    $('td:eq(6)', nRow).html('<b class="btn-margin-right btn btn-xs blue"> <i class="glyphicon glyphicon-unchecked"></i> NO </b>');
                }
                else if (status == 2) { // screen
                    $nRow.css({ "background-color": "#ffffd9" })
                    $('td:eq(6)', nRow).html('<b class="btn-margin-right btn btn-xs blue"> <i class="glyphicon glyphicon-check"></i> YES </b>');
                }
                if (screenresult == 1) {
                    $('td:eq(5)', nRow).html(' <i class="  glyphicon glyphicon-minus"></i><small>Negative</small> ');
                } else {
                    $('td:eq(5)', nRow).html(' <i class="glyphicon glyphicon-plus"></i><small>Positive</small>  ');
                }
                $('td:eq(4)', nRow).html(' <i class="glyphicon glyphicon-tint"></i>  ' + aData['bloodgroupname']);



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
        function BindDashboardScreenDashboard(data) {
            console.log(data);
            // http://legacy.datatables.net/release-datatables/examples/basic_init/scroll_x.html
            TblDashboardScreenDashboard = $(TblDashboardScreenDashboardId).DataTable({
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

                   { data: "id", title: 'Unit No.', className: '   ', visible: true, searchable: true, width: "2%" },
                    { data: "DonorRegistrationNO", title: 'Reg No', className: '  ', visible: true, searchable: true, width: "2%" },
                    { data: "donortypename", title: 'Donation Type', className: '  ', visible: true, searchable: true, width: "3%" },
                    { data: "bagtypename", title: 'Bag Type', className: '  ', visible: true, searchable: true, width: "1%" },
                    { data: "bloodgroupname", title: 'Group', className: '  ', visible: true, searchable: true, width: "1%" },
                     { data: "screenresultname", title: 'Screen Result', className: '  ', visible: true, searchable: true, width: "2%" },
                    { data: "status", title: 'Screen Status', className: '  ', visible: true, searchable: true, width: "2%" },



                    //{ data: "StartDateTime", title: 'Last Date of Current Tax  ', className: '   ', visible: true, searchable: false, width: "2%" },

                ],
                fnRowCallback: ShowDashboardRowCallDashboardScreenDashboard()
            });

            InitScreenDashboard();

            var btns = '';
            var toolbar = btns.concat(
                 '<div style="float:left;">'
                 , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnCheckAllFunctions"> <i class="glyphicon glyphicon-check"></i> All </button>'
                , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnUNCheckAllFunctions"> <i class="glyphicon glyphicon-unchecked"></i> All </button>'
                , '</div><br><br>');
            //$("div.tbDashboardScreenDashboard").html(toolbar);

            $('#btnCheckAllFunctions').click(function () {
                $('#preloader').show();
                $.each(TblDashboardScreenDashboard.rows().data(), function (i, row) {
                    TblDashboardScreenDashboard.cell(i, 0).data('<input id="checkFunctionConfigRole" type="checkbox" checked="checked" >');
                });
                $('#preloader').hide();
            });
            $('#btnUNCheckAllFunctions').click(function () {
                $('#preloader').show();
                $.each(TblDashboardScreenDashboard.rows().data(), function (i, row) {
                    TblDashboardScreenDashboard.cell(i, 0).data('<input id="checkFunctionConfigRole" type="checkbox">');
                });
                $('#preloader').hide();

            });

            $(TblDashboardScreenDashboardId + ' tbody').on('click', '#checkFunctionConfigRole', function (e) {
                var $cell = $(this).closest('td');
                var $row = $(this).closest('tr');
                var Tbl = TblDashboardScreenDashboard;
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

        function SetupScreenDashboard() {

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
                    var input = $('<input id="dtS2Relationship" type="text" class="select2 form-control input-sm">');
                    $(this).append(input);

                    return (input);
                },
                plugin: function (settings, original) {
                    var select2 = $(this).find('#dtS2Relationship').select2({
                        minimumResultsForSearch: -1,
                        minimumInputLength: 0,
                        allowClear: true,
                        ajax: {
                            cache: false,
                            type: 'GET',
                            dataType: "json",
                            url: $('#url').data('select2component'),
                            results: function (data) {
                                return { results: data.Results };
                            }
                        },
                    }).on("select2-blur", function () {
                        $("#dtS2Relationship").closest('td').get(0).reset();
                    }).on('select2-close', function () {
                        if (Select2IsClicked) { $("#dtS2Relationship").closest('form').submit(); }
                        else { $("#dtS2Relationship").closest('td').get(0).reset(); }
                        Select2IsClicked = false;
                    }).on("select2-focus", function (e) {
                        var rowdata = dtitems.row($(this).closest('tr')).data();
                        $("#dtS2Relationship").select2("data", { id: rowdata.Unit.Id, text: rowdata.Unit.Name });
                        // var a = $(this).closest('tr').find('#dtS2Relationship').val();
                        //$("#dtS2Relationship").select2("data", { id: a, text: a });
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
            $.editable.addInputType('EditableRelationshipOLD', {
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
        function InitScreenDashboard() {


            var Tbl = TblDashboardScreenDashboard;

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

    };


    return {

        //main function to initiate 
        init: function () {
            // handles style customer tool
            handleScreenJs();

        }
    };

}();

/******************************************************* ****************************** ***************************************************************************/
