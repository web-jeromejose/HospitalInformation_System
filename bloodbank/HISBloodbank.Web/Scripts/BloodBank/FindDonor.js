var c = new Common();
var TblLoadDashboard;
var TblLoadDashboardId = '#DTLoadDashboard';
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
            LoadDashboard();
            initSelect2();
            initClick();
            initTextBox();
            initOnChange();

        });
        function initTextBox() {

            $('#dtFindRegistrationDate1').datetimepicker({
                pickTime: false
            }).on("dp.change", function (e) {

            });
            $('#dtFindDonationDate1').datetimepicker({
                pickTime: false
            }).on("dp.change", function (e) {

            });

            $('#txtFindConditionRegId').select2({data: [
                    { id: 1, text: '=' },
                    { id: 2, text: '>' },
                    { id: 3, text: '>=' },
                    { id: 4, text: '<' },
                    { id: 5, text: '<=' },
                    //{ id: 6, text: 'Between' } { id: 7, text: 'like' }
                ],minimumInputLength: 0,allowClear: true
            }).change(function (e) { var list = e.added; });
            $('#txtFindConditionRegDate').select2({
                data: [
                    { id: 1, text: '=' },
                    { id: 2, text: '>' },
                    { id: 3, text: '>=' },
                    { id: 4, text: '<' },
                    { id: 5, text: '<=' },
                    //{ id: 6, text: 'Between' } { id: 7, text: 'like' }
                ], minimumInputLength: 0, allowClear: true
            }).change(function (e) { var list = e.added; });
            $('#txtFindConditionDonationDt').select2({
                data: [
                    { id: 1, text: '=' },
                    { id: 2, text: '>' },
                    { id: 3, text: '>=' },
                    { id: 4, text: '<' },
                    { id: 5, text: '<=' },
                    //{ id: 6, text: 'Between' } { id: 7, text: 'like' }
                ], minimumInputLength: 0, allowClear: true
            }).change(function (e) { var list = e.added; });
            $('#txtFindConditionAge').select2({
                data: [
                    { id: 1, text: '=' },
                    { id: 2, text: '>' },
                    { id: 3, text: '>=' },
                    { id: 4, text: '<' },
                    { id: 5, text: '<=' },
                    //{ id: 6, text: 'Between' } { id: 7, text: 'like' }
                ], minimumInputLength: 0, allowClear: true
            }).change(function (e) { var list = e.added; });
            
        }
        function initOnChange() {
            $('#scrnScreenResultValueIS').on('change', function (xx) {
                if ($(this).is(":checked")) {
                    $('#scrnScreenResultValue').prop('readonly', false);
                    setTimeout(function () {
                        $('#scrnScreenResultValue').trigger('click');
                        $('#scrnScreenResultValue').select2('open');
                    }, 300);
                }
                else { $('#scrnScreenResultValue').prop('readonly', true); }

            });

            $('#scrnComponentIS').change(function () {

                if ($(this).is(":checked")) {
                    $("#scrnComponent").removeProp("readonly");
                    setTimeout(function () {
                        $('#scrnComponent').trigger('click');
                        $('#scrnComponent').select2('open');
                    }, 300);

                } else {
                    $("#scrnComponent").prop("readonly", "true");

                }
            });







        }
        function initSelect2() {

            $('#txtFindBloodGroup').select2({
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
            $('#txtFindDonorStatus').select2({
                //containerCssClass: "RequiredField",
                minimumInputLength: 0,
                allowClear: true,
                ajax: {
                    quietMillis: 150,
                    url: $('#url').data('select2donorstatus'),
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
            
            $('#txtFindGender').select2({
                //containerCssClass: "RequiredField",
                minimumInputLength: 0,
                allowClear: true,
                ajax: {
                    quietMillis: 150,
                    url: $('#url').data('select2gender'),
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
            
            $('#txtFindNationality').select2({
                //containerCssClass: "RequiredField",
                minimumInputLength: 0,
                allowClear: true,
                ajax: {
                    quietMillis: 150,
                    url: $('#url').data('select2nation'),
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
            
            $('#txtFindDonorType').select2({
                //containerCssClass: "RequiredField",
                minimumInputLength: 0,
                allowClear: true,
                ajax: {
                    quietMillis: 150,
                    url: $('#url').data('select2donortype'),
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
            $('#btnFilter').click(function () {
                c.ModalShow('#modalFilter', true);
            
            });
            $('#btnCloseFilter').click(function () {
                c.ModalShow('#modalFilter', false);
            });

            $('#btnViewFilter').click(function () {
                  if ( !ValidateFilter()) {
                    return;
                }


                ShowList(-1);
                c.ModalShow('#modalFilter', false);

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

            if ($("#scrnScreenResultValueIS").is(":checked")) {
                if (!$('#scrnScreenResultValue').val()) {
                    errors.push("Select a Screen Result/s");
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

        function ShowList(id) {

         
            var para;
            para = [];
            para = {};
            para.filterunitno = c.GetValue('#txtUnitNo');
            para.filterpin = c.GetValue('#txtFindPIN');
            para.filterregnoIS = c.GetSelect2Text('#txtFindConditionRegId');
            para.filterregno = c.GetValue('#txtFindRegistrationNo1');
            para.filterregdateIS = c.GetSelect2Text('#txtFindConditionRegDate');
            para.filterregdate = c.GetValue('#dtFindRegistrationDate1');
            para.filterdonatedateIS = c.GetSelect2Text('#txtFindConditionDonationDt');
            para.filterdonatedate = c.GetValue('#dtFindDonationDate1');
            para.filterageIS = c.GetSelect2Text('#txtFindConditionAge');
            para.filterage = c.GetValue('#txtFindAge1');
          
            para.donorname = c.GetValue('#txtFindDonorName');
            para.gender = c.GetSelect2Id('#txtFindGender');
            para.nationality = c.GetSelect2Id('#txtFindNationality');
            para.address1 = c.GetValue('#txtFindAddress1');
            para.address2 = c.GetValue('#txtFindAddress2');
            para.bagno = c.GetValue('#txtFindBagNo');
             
            para.donortype = c.GetSelect2Id('#txtFindDonorType');
            para.bloodgroup = c.GetSelect2Id('#txtFindBloodGroup');
            para.donorstatus = c.GetSelect2Id('#txtFindDonorStatus');
            para.iqama = c.GetValue('#txtFindIqama');
            console.log(para);

         
            ajaxWrapper.Post($("#url").data("showlist"), JSON.stringify(para), function (x, e) {
                console.log(x);
                BindLoadDashboard(x.list);
                
            }); 
           
           /* $.ajax({
                url: Url,
                processData: false,
                data: JSON.stringify(para),
                type: 'post',
                cache: false,
                contentType: "application/json; charset=utf-8",
                beforeSend: function () {
                },
                success: function (data) {
                    BindList(data.list.length == 0 ? [] : data.list);
                    BindQuestionaires(data.list.length == 0 ? [] : data.list[0].DonorQuestionaires);
                    // BindScreenResults(data.list.length == 0 ? [] : data.list[0].ShowScreenResults);
                    $('#preloader').hide();
                    $("#grid").css("visibility", "visible");
                },
                error: function (xhr, desc, err) {
                    $('#preloader').hide();
                    //var errMsg = err + "<br>" + desc;
                    var errMsg = err + "<br>" + xhr.responseText;

                    c.MessageBoxErr(errMsg);
                }
            });*/

      



        }

        function Save() {

            var model = {
                id: TblLoadDashboardDataRow.id,
                DonorRegistrationNO: TblLoadDashboardDataRow.DonorRegistrationNO,

                screentype: c.GetICheck("#scrnScreenType"),// rapid
                screenverified: c.GetICheck("#scrnIsScreenVerify"),
                screening: c.GetICheck("#scrnIsScreen"), //1 - not screen 2- screen   insert to screen
                verified: c.GetICheck("#scrnVerified"),

                bloodgroup: c.GetSelect2Id('#scrnbloodgroup'), //bloodtype
                groupoperatorid: (c.GetSelect2Id('#scrnbloodgroup') != TblLoadDashboardDataRow.bloodgroup) ? 1 : 0,   //if the blood type changes                           
                screenresultNega: $("#scrnScreenResult").val(), // 1-nega 2-postive
                componentids: null,
                screenresults: null
            }

            var components = [];
            var screenresults = [];
            if ($("#scrnComponentIS").is(":checked")) {
                var arr = $('#scrnComponent').val();
                $.each(arr.split(','), function (i, val) {
                    components.push(val);
                });
                model.componentids = components;
            }
            if ($("#scrnScreenResultValueIS").is(":checked")) {
                var arrt = $('#scrnScreenResultValue').val();
                $.each(arrt.split(','), function (i, val) {
                    screenresults.push(val);
                });
                model.screenresults = screenresults;
            }
            /*
       
            var model = {
                id: TblLoadDashboardDataRow.id,
                DonorRegistrationNO: TblLoadDashboardDataRow.DonorRegistrationNO,

                screentype: c.GetICheck("#scrnScreenType"),// rapid
                screenverified: c.GetICheck("#scrnIsScreenVerify"),
                screening: c.GetICheck("#scrnIsScreen"), //1 - not screen 2- screen   insert to screen
                verified: c.GetICheck("#scrnVerified"),

                bloodgroup: c.GetSelect2Id('#scrnbloodgroup'), //bloodtype
                groupoperatorid: (c.GetSelect2Id('#scrnbloodgroup') != TblLoadDashboardDataRow.bloodgroup) ? 1 : 0,   //if the blood type changes                           
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

            ajaxWrapper.Post($("#url").data("save"), JSON.stringify(model), function (x, e) {
                console.log('x');
                console.log(x);
                console.log('e');
                if (x.ErrorCode == 0) {
                    c.ModalShow('#screendetails', false);
                    c.MessageBox("Error...", x.Message, function () { LoadDashboard(); });
                    return false;
                } else {
                    c.ModalShow('#screendetails', false);
                    c.MessageBox("Success", "Screen Updated.", function () {

                        LoadDashboard();
                    });

                }
            });

        }

        function showScreenDetails(TblLoadDashboardDataRow) {

            c.ModalShow('#screendetails', true);
            c.Select2Clear('#scrnComponent');
            c.Select2Clear('#scrnScreenResultValue');
            c.Select2Clear('#scrnbloodgroup');

            $("input:checkbox").attr('checked', false);

            c.SetValue('#bagidtitle', TblLoadDashboardDataRow.id);
            c.SetValue('#scrnRegno', TblLoadDashboardDataRow.DonorRegistrationNO);
            c.SetValue('#scrnScreenResult', TblLoadDashboardDataRow.screenresult);
            c.iCheckSet('#scrnScreenType', TblLoadDashboardDataRow.screentype != 0);
            c.iCheckSet('#scrnComponentIS', TblLoadDashboardDataRow.componentid != 0);
            c.iCheckSet('#scrnVerified', TblLoadDashboardDataRow.verified != 0);
            c.iCheckSet('#scrnIsScreen', TblLoadDashboardDataRow.status == 2);
            c.SetSelect2('#scrnbloodgroup', TblLoadDashboardDataRow.bloodgroup, TblLoadDashboardDataRow.bloodgroupname);

            getComponentdetails(TblLoadDashboardDataRow.id);
            getScreenDetails(TblLoadDashboardDataRow.id);


        }
        function getComponentdetails(bagid) {
            ajaxWrapper.Get($("#url").data("getcomponentdetails"), { bagid: bagid }, function (x, e) {


                var xrows = [];
                $.each(x.list, function (index, value) {
                    xrows.push({ id: value.id, text: value.text });
                });
                console.log('getComponentdetails');
                console.log(xrows);
                $('#scrnComponent').select2("data", xrows);
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
        SetupLoadDashboard();
        var LoadDashboard = function () {
            ajaxWrapper.Get($("#url").data("dashboard"), null, function (x, e) {
                BindLoadDashboard(x.list);
            });
        };
        
        var TblLoadDashboardDataRow;
        var ennLoadDashboard = { Btn: 0, del: 1, ctr: 2, ID: 3, Name: 4, Edited: 5, Deleted: 6 };

        var Format24 = "HH:mm";
        var calcHeightLoadDashboard = function () {
            return $(window).height() *80 / 100;
        };

        function ShowDashboardRowCallLoadDashboard() {
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
        function BindLoadDashboard(data) {
            console.log(data);
            // http://legacy.datatables.net/release-datatables/examples/basic_init/scroll_x.html
            TblLoadDashboard = $(TblLoadDashboardId).DataTable({
                cache: false,
                destroy: true,
                data: data,
                paging: true,
                ordering: false,
                searching: false,
                info: true,
                processing: false,
                autoWidth: false,

                scrollCollapse: false,
                pageLength: 100,
                lengthChange: false,
                scrollY: calcHeightLoadDashboard(),
                scrollX: "100%",
                sScrollXInner: "100%",
                dom: '<"tbLoadDashboard">Bfrtip',
              //  dom: '<"tbLoadDashboard">Rlfrtip',
                columns: [
                   // { data: "", title: '', className: 'control-center', visible: true, searchable: false, width: "1px", defaultContent: '<button type="button" class="btn btn-sm btn-danger" Id="btnDetailsModif" title="Delete" rel="tooltip"> <i class="glyphicon glyphicon-trash"></i></button>' },
                   // { data: "", title: ' ', className: ' ', visible: true, searchable: false, width: "0%", defaultContent: '<input type="checkbox" class="control-center iCheck-helper" id="checkFunctionConfigRole" />' },
                    //{ data: "", title: ' --  ', className: '   ', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" class="control-center iCheck-helper highlight" id="checkisService" />' },

                   { data: "rn", title: '#', className: '   ', visible: true, searchable: true, width: "2%" },
                   { data: "ID", title: 'Unit No.', className: '   ', visible: true, searchable: true, width: "2%" },
                    { data: "RegistrationNo", title: 'Reg No', className: '  ', visible: true, searchable: true, width: "2%" },
                    { data: "Name", title: 'Name', className: '  ', visible: true, searchable: true, width: "3%" },
                    { data: "DonatedDate", title: 'Donated Date', className: '  ', visible: true, searchable: true, width: "1%" },
                    { data: "Age", title: 'Age', className: '  ', visible: true, searchable: true, width: "1%" },
                     { data: "sexname", title: 'Sex', className: '  ', visible: true, searchable: true, width: "2%" },
                     { data: "bloodgroupname", title: 'Blood Group', className: '  ', visible: true, searchable: true, width: "2%" },
                     { data: "iqama", title: 'Iqama', className: '  ', visible: true, searchable: true, width: "2%" },
                     { data: "pphone", title: 'Phone', className: '  ', visible: true, searchable: true, width: "2%" },
                     { data: "bloodgroupname", title: 'Donor Type', className: '  ', visible: true, searchable: true, width: "2%" },
                    { data: "PatientRegistrationNO", title: 'PIN', className: '  ', visible: true, searchable: true, width: "2%" },



                    //{ data: "StartDateTime", title: 'Last Date of Current Tax  ', className: '   ', visible: true, searchable: false, width: "2%" },

                ],
                fnRowCallback: ShowDashboardRowCallLoadDashboard()
                 , buttons: [{  extend: 'pdfHtml5', orientation: 'landscape', pageSize: 'a4',filename:'BloodBank-DonorList',footer: true,message:'messagef',messageBotton:'test',messageTop:' ',title: 'BloodBank - Donor List', text: '<button type="button" style="color: #fff;background-color: #5cb85c;border-color: #4cae4c;" class="btn-margin-left btn btn-xs pull-left"> <i class="glyphicon glyphicon-print"></i> PRINT </button><br><br>' }]

            });

            InitLoadDashboard();

            var btns = '';
            var toolbar = btns.concat(
                 '<div style="float:left;">'
                 , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnCheckAllFunctions"> <i class="glyphicon glyphicon-check"></i> PRINT </button>'
              //  , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnUNCheckAllFunctions"> <i class="glyphicon glyphicon-unchecked"></i> All </button>'
                , '</div><br><br>');
            // $("div.tbLoadDashboard").html(toolbar);

            $('#btnCheckAllFunctions').click(function () {
                $('#preloader').show();
                $.each(TblLoadDashboard.rows().data(), function (i, row) {
                    TblLoadDashboard.cell(i, 0).data('<input id="checkFunctionConfigRole" type="checkbox" checked="checked" >');
                });
                $('#preloader').hide();
            });
            $('#btnUNCheckAllFunctions').click(function () {
                $('#preloader').show();
                $.each(TblLoadDashboard.rows().data(), function (i, row) {
                    TblLoadDashboard.cell(i, 0).data('<input id="checkFunctionConfigRole" type="checkbox">');
                });
                $('#preloader').hide();

            });

            //$(TblLoadDashboardId + ' tbody').on('click', '#checkFunctionConfigRole', function (e) {
            $(TblLoadDashboardId + ' tbody').on('click', 'td', function (e) {
                var $cell = $(this).closest('td');
                var $row = $(this).closest('tr');
                var Tbl = TblLoadDashboard;
                var data = Tbl.row($row).data();
                var rowId = data[0];
                var col = Tbl.cell($(this).closest('td')).index();
                $("#btnPrintSR").data('donrregno', data.DonorRegistrationNO);
                ///////
                $row.removeClass('selected');
                $('tr.selected').removeClass('selected');
                $row.addClass('selected');
                //TblGridListDataRow = TblLoadDashboardId.row($(this).parents('tr')).data();
                ///////

                //if (this.checked) {
                //    $row.addClass("row_green");
                //} else {
                //    $row.removeClass("row_green");
                //}

               
                e.stopPropagation();
            });
        }

        function SetupLoadDashboard() {

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
        function InitLoadDashboard() {


            var Tbl = TblLoadDashboard;

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


        function ValidateFilter() {
            if (!c.IsEmptyById('#txtUnitNo')) return true;
            if (!c.IsEmptyById('#txtFindPIN')) return true;
            if (!c.IsEmptyById('#txtFindRegistrationNo1')) return true;
            if (!c.IsDateEmpty('#dtFindRegistrationDate1')) return true;
            if (!c.IsDateEmpty('#dtFindDonationDate1')) return true;
            if (!c.IsEmptyById('#txtFindAge1')) return true;
            if (!c.IsEmptyById('#txtFindDonorName')) return true;
            if (!c.IsEmptySelect2('#txtFindGender')) return true;
            if (!c.IsEmptyById('#txtFindAddress1')) return true;
            if (!c.IsEmptyById('#txtFindAddress2')) return true;
            if (!c.IsEmptyById('#txtFindBagNo')) return true;
            if (!c.IsEmptySelect2('#txtFindDonorType')) return true;
            if (!c.IsEmptySelect2('#txtFindBloodGroup')) return true;
            if (!c.IsEmptySelect2('#txtFindDonorStatus')) return true;
            if (!c.IsEmptyById('#txtFindIqama')) return true;

            c.MessageBoxErr("Search...", "Search option should atleast have one value.", null);
            return false;
        }

    };


    return {

        //main function to initiate 
        init: function () {
            // handles style customer tool
            handleScreenJs();

        }
    };

}();

function printDiv(divName) {

    if (TblLoadDashboard.rows('.selected').data().length == 0) {
        c.MessageBoxErr("Select...", "Please select a row to print.", null);
        return;
    }

    var donorRegNo = $("#btnPrintSR").data('donrregno');

    if (donorRegNo == "" || donorRegNo == "0") {
        return;
    }

    $.ajax({
        url: $('#url').data('donorsr'),
        dataType: 'json',
        cache: false,
        data: { donorRegiesterNo: donorRegNo },
        success: function (data) {
            printDonorScreenResult(divName, donorRegNo, data);
        },
        errors: function (x, h, r) {
            alert('error');
        }
    });   
}

function printDonorScreenResult(divName, donorRegNo, data) {
    debugger
    var id = TblLoadDashboard.DonorRegistrationNO;
    var printContents = document.getElementById(divName).innerHTML;
    var printContents = "<style>\
                        body, table{\
                            font-family:arial;\
                            font-size:12px;\
                        }\
                        .column {\
                        width:50px;\
                        fload:left!important;\
                        font-size:12px;\
                        font-family:arial;\
                        padding-right:15px;\
                        }\
                        .colpadbot{\
                        padding-bottom: 10px;\
                        }\
                        .space1{\
                        margin-right:50px;\
                        }\
                        .space2{\
                        margin-right:80px;\
                        }\
                        </style>";
    
    printContents += '<div id="printDSR" class="content" > \
                          <div class="row" style="width:40%";>\
                            <div class="col-md-6"><h5 style="text-align: -webkit-center;">SAUDI GERMAN HOSPITAL GROUP</h5></div>\
                            <div class="col-md-6"></div>\
                          </div>\
                          <div class="row" style="width:40%";>\
                            <div class="col-md-6"><h5 style="text-align: -webkit-center;">DEPARTMENT OF TRANSFUSION MEDICINE</h5></div>\
                            <div class="col-md-6"></div>\
                          </div>\
                          <table><thead>\
                            <tr><th></th><th></th></tr>\
                            </thead>\
                            <tbody>\
                                <tr><td>Donor Name:</td><td colspan=3 align="left">' + data[0].Name + '</td></tr>\
                                <tr><td>Date: </td><td colspan=3>' + c.MomentDDMMMYYYYDLess(new Date()) + '</td></tr>\
                                <tr><td>Age/Sex: </td><td>' + data[0].AgeSex + '</td><td>Donation Date: </td><td>' + data[0].DonatedDate + '</td></tr>\
                                <tr><td>Unit Number: </td><td>' + data[0].UnitNumber + '</td><td>Screen Date: </td><td>' + data[0].ScreenDate + '</td></tr>\
                                <tr><td>Donor No: </td><td>' + data[0].DonorNo + '</td><td>Address: </td><td>' + data[0].Address1 + ' ' + data[0].Address2 + '</td></tr>\
                            </tbody></table>\
                            <p>DONOR GROUPING</p>\
                            <table>\
                                <thead>\
                                    <tr><th width="100px;">NAME</th><th>RESULT</th></tr>\
                                </thead>\
                                <tbody>\
                                    <tr><td width="100px;">ABO Group</td><td>' + data[0].ABOGroup + '</td></tr>\
                                    <tr><td width="100px;">Rh(D) Type</td><td>' + data[0].RhDType + '</td></tr>\
                                </tbody>\
                            </table>\
                        <div class="row"></div>\
                        <div class="row">\
                            <div class="col-md-6">\
                                <div class="col-md-6">\
                                    <p>DONOR SCREENING</p>\
                                </div>\
                            </div>\
                            <div class="col-md-6">\
                            </div>\
                        </div> '
    var result = '';
    debugger;
    for (var i = 0; i < data.length; i++) {
        
                     result += '<tr>\
                                    <td style="width:60%;">' + data[i].screen + '</td>\
                                    <td>' + data[i].status + '</td>\
                                </tr>'
    }
    result +=    '<tr>\
                            <td style="width:60%;">HB</td>\
                            <td>' + data[0].HB + '</td>\
                        </tr>\
                                <tr>\
                                    <td style="width:60%;">Hct</td>\
                                    <td>' + data[0].Hct + '</td>\
                                </tr>\
                                <tr>\
                                    <td style="width:60%;">Plt</td>\
                                    <td>' + data[0].Plt + '</td>\
                                </tr>' 
   var other = '<table><thead>\
            <tr><th></th><th></th></tr>\
            </thead><tbody>{{TABLEROWS}}</tbody></table>\
                      <div class="row">\
                            <div class="col-md-6">\
                                <div class="col-md-6"><p>SIGNATURE</p></div>\
                            </div>\
                            <div class="col-md-6"></div>\
                      </div>\
                      <div class="row">\
                            <div class="col-md-6">\
                                <div class="col-md-6"><p>DEPARTMENT OF TRANSFUSION MEDICINE</p></div>\
                            </div>\
                      <div>\
                      <div>\
                      </div>';

    result = other.replace('{{TABLEROWS}}', result);
    printContents += result;

    _window = window.open("", "print");
    _window.document.body.innerHTML = printContents;
    _window.print();
}


