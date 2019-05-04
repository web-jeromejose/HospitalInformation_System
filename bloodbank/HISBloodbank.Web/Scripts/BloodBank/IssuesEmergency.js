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


        var tblIssueEmergency;
        var tblIssueEmergencyId = '#tblIssueEmergency';
        var tblIssueEmergencyDataRow;

        var tblIssueEmergencyAvailable;
        var tblIssueEmergencyIssued;
        var TblDTComponentId = '#DTComponent';
        var TblDTComponentDataRow;

        var TblDTSDPLR;
        var TblDTSDPLRId = '#DTSDPLR';
        var TblDTSDPLRDataRow;

        var LoadDashboard = function () {
            ajaxWrapper.Get($("#hidUrl").data("getdashboard"), { id: null }, function (x, e) {
                DashboardIssueEmergency(x.list);
            });
        };

        var calcHeightDashboardScreenDashboard = function () {
            return $(window).height() * 68 / 100;
        };

        function RowCallBackIssueEmergency() {
            var rc = function (nRow, aData) {
                var $nRow = $(nRow);
                var status = aData["Status"];
                if (status == "0") {
                    $nRow.css({ "background-color": "#fcc9c9" })
                } else { $nRow.css({ "background-color": "#81dcff" }) }

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

        function DashboardIssueEmergency(data) {

            tblIssueEmergency = $(tblIssueEmergencyId).DataTable({
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

                //dom: '<"tbDashboardScreenDashboard">Rlfrtip',
                columns: [
                        { data: "OrderNo", title: 'Order No', className: '', visible: true, searchable: false, width: "5%" },
                        { data: "OrderDateTime", title: 'Order DT', className: '', visible: true, searchable: true, width: "10%" },
                        { data: "PinNo", title: 'Pin No', className: '', visible: true, searchable: false, width: "10%" },
                        { data: "BedName", title: 'Bed', className: '', visible: true, searchable: true, width: "10%" },
                        { data: "PatientName", title: 'Patient', className: '', visible: true, searchable: true, width: "10%" },
                        { data: "RequestedByOperatorName", title: 'Requested By', className: '', visible: true, searchable: true, width: "10%" },
                        { data: "StationSlNo", title: 'Station No', className: '', visible: true, searchable: true, width: "10%" }
                ],
                fnRowCallback: RowCallBackIssueEmergency()

            });
        }

        $(document).on("click", "#btnClose", function (e) {
            $(".HideOnView").hide();
            $(".HideOnAdd").show();

            c.Show('#divEntryForm', false);
            c.Show('#divDashboard', true);

            tblIssueEmergency.columns.adjust().draw();;
        });

        $(document).on("click", "#tblIssueEmergency tr", function (e) {
            var tr = $(this);

            var data = tblIssueEmergency.row(tr).data();

            if (data.Status == 0) {

                $('#tblIssueEmergency tr.selected').removeClass('selected');
                tr.addClass('selected');

                $('#preloader').show();
                $('.Hide').hide();

                console.log('data');
                c.SetValue("#BloodOrderId", data.OrderNo);
                
                $.ajax({
                    url: $("#hidUrl").data("getissue"),
                    data: { id: data.OrderNo },
                    type: 'get',
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    cache: false,
                    beforeSend: function () {

                    },
                    success: function (data) {
                        $('#preloader').hide();
                        $('.Show').show();
                      
                        c.SetValue("#tbPin", data.PinNo);
                        c.SetValue("#tbName", data.PatientName);
                        c.SetValue("#hidIpId", data.IpId);
                        c.SetValue("#tbBedNo", data.BedName);
                        c.SetValue("#tbWards", data.WardsName);
                        c.SetValue("#hidWardsId", data.WardsId);
                        c.SetValue("#tbDoctor", data.DoctorName);
                        c.SetValue("#hidDoctorId", data.DoctorId);
                        c.SetValue("#tbOperator", data.AcknowledgeByName);
                        c.SetValue("#tbAge", data.Age);
                        c.SetValue("#tbSex", data.Gender);
                        c.SetValue("#tbBloodGroup", data.BloodGroup);
                        c.SetValue("#hidBloodGroupId", data.BloodGroupId);

                        c.Show('#divEntryForm', true);
                        c.Show('#divDashboard', false);
                        $(".HideOnAdd").hide();

                        tblIssueEmergencyIssued = $("#gridBagsIssued").DataTable({
                            cache: false,
                            destroy: true,
                            data: [],
                            paging: true,
                            ordering: false,
                            searching: false,
                            info: true,
                            processing: false,
                            autoWidth: false,

                            scrollCollapse: false,
                            pageLength: 5,
                            lengthChange: false,
                            //scrollY: calcHeightDashboardScreenDashboard(),
                            scrollX: "100%",
                            sScrollXInner: "100%",

                            //dom: '<"tbDashboardScreenDashboard">Rlfrtip',
                            columns: [
                                    { data: "BagId", title: 'BagId', className: '', visible: false },
                                    { data: "BagNo", title: 'Unit No', className: '', visible: true, searchable: false, width: "5%" },
                                    { data: "ExpiryDate", title: 'Expiry Date', className: '', visible: true, searchable: false, width: "10%" },
                                    { data: "BloodGroupName", title: 'Blood Group', className: '', visible: true, searchable: true, width: "10%" },
                                    { data: "CVolume", title: 'Bag Volume', className: '', visible: true, searchable: true, width: "10%" },
                            ],
                            fnCreatedRow: function (nRow, aData, i) {
                                $(nRow).click(function () {
                                    tblIssueEmergencyAvailable.row.add(aData).draw();
                                    tblIssueEmergencyIssued.rows($(nRow)).remove().draw();
                                });
                            }
                        })
                    },
                    error: function (xhr, desc, err) {
                        $('#preloader').hide();
                        var errMsg = err + "<br>" + xhr.responseText;
                        c.MessageBoxErr(errMsg);
                    }
                });

                $('.ShowOnAdd').show();
            }

        });

        function valid() {
            var errortext = "";
            var errors = [];

            if ($("#select2RequestedBloodGroup").val() == 0 || $("#select2RequestedBloodGroup").val() == "") {
                errors.push("Select a Requested Blood Group.");
            }
            if ($("#select2RequestedIssuedBy").val() == 0 || $("#select2RequestedIssuedBy").val() == "") {
                errors.push("Select option for  Issued By.");
            }
            if ($("#select2RequestedCollectedBy").val() == 0 || $("#select2RequestedCollectedBy").val() == "") {
                errors.push("Select option for Collected By.");
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
            var model = {};
           
            model.BloodOrderId = $("#BloodOrderId").val();
            model.collectedBy = $("#select2RequestedCollectedBy").select2("val");
            model.Remarks = $("#tbRemarks").val();
            model.TransfusionType = $("#rbSurgery").is(':checked') ? 1 : 0;//0 = therapeutic
            model.IssuedBy = $("#select2RequestedIssuedBy").select2("val");
            model.issuedBag = {};
            model.issuedBag = [];
             
            $.each(tblIssueEmergencyIssued.rows().data(), function (i, row) { model.issuedBag.push({ bagno: row.BagNo }); }); 
            console.log(model);
            ajaxWrapper.Post($("#hidUrl").data("save"), JSON.stringify(model), function (x, e) {

                if (x.ErrorCode == 0) {
                    c.MessageBox("Error...", x.Message, function () { });
                    return false;
                } else {
                    c.MessageBox("Notify!", " Emergency Issue Successfully.", function () {
                        location.reload();
                    });

                }
            });

        }
        function InitSelect2() {
            $('#select2RequestedBloodGroup').select2({
                //containerCssClass: "RequiredField",
                minimumInputLength: 0,
                allowClear: true,
                ajax: {
                    quietMillis: 150,
                    url: $("#hidUrl").data("getbloodgroup"),
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
            }).on("select2-selecting", function (e) {
                populateBagsAvailable(e.val);
            });


            $('#select2RequestedCollectedBy').select2({
                containerCssClass: "RequiredField",
                minimumInputLength: 0,
                allowClear: true,
                ajax: {
                    quietMillis: 150,
                    url: $("#hidUrl").data("getemployee"),
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
                var list = e.added.list;

            });

            $('#select2RequestedIssuedBy').select2({
                containerCssClass: "RequiredField",
                minimumInputLength: 0,
                allowClear: true,
                ajax: {
                    quietMillis: 150,
                    url: $("#hidUrl").data("getemployee"),
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
                var list = e.added.list;

            });

        }

        function populateBagsAvailable(id) {
            $.ajax({
                url: $("#hidUrl").data("getissueavailable"),
                data: { id: id },
                type: 'get',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                cache: false,
                success: function (data) {
                    tblIssueEmergencyAvailable = $("#gridBagsAvailable").DataTable({
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
                        pageLength: 5,
                        lengthChange: false,
                        //scrollY: calcHeightDashboardScreenDashboard(),
                        scrollX: "100%",
                        sScrollXInner: "100%",

                        //dom: '<"tbDashboardScreenDashboard">Rlfrtip',
                        columns: [
                                { data: "BagId", title: 'BagId', className: '', visible: false },
                                { data: "BagNo", title: 'Unit No', className: '', visible: true, searchable: false, width: "5%" },
                                { data: "DonationDate", title: 'Donated Date', className: '', visible: true, searchable: true, width: "10%" },
                                { data: "ExpiryDate", title: 'Expiry Date', className: '', visible: true, searchable: false, width: "10%" },
                                { data: "BloodGroupName", title: 'Blood Group', className: '', visible: true, searchable: true, width: "10%" },
                                { data: "CVolume", title: 'Bag Volume', className: '', visible: true, searchable: true, width: "10%" },
                        ],
                        fnCreatedRow: function (nRow, aData, i) {
                            $(nRow).click(function () {
                                tblIssueEmergencyIssued.row.add(aData).draw();
                                tblIssueEmergencyAvailable.rows($(nRow)).remove().draw();
                            });
                        }
                    })
                },
                error: function (xhr, desc, err) {
                    $('#preloader').hide();
                    var errMsg = err + "<br>" + xhr.responseText;
                    c.MessageBoxErr(errMsg);
                }
            });
        }

        

        function initBtn() {
            $(".HideOnView").hide();
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