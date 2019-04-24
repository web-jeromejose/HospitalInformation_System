var tbl;
var tblSelected;
var CanProc = [];
var tblPrev;
var tblPrescription;
var defaultStartDate;
var ajaxWrapper = $.ajaxWrapper();

$(document).ready(function () {
    var d = new Date;
    defaultStartDate = [d.getDate(), d.getMonth() + 1, d.getFullYear()].join('/') + ' 12:00 AM';
    InitSelect();
    ViewMain();

    InitDrugList();
    InitGenericList();
    addEditors();
    $(document).on("click", "#tbl-prescription td", function () {
        CanProc = [];
        InitRequestType();
        if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
            var tr = $(this).closest('tr');
            if (tr.hasClass('selected')) {
                tr.removeClass('selected');
            }
            else {
                $('tr.selected').removeClass('selected');
                tr.addClass('selected');
            }
            var d = tbl.row($(this).parents('tr')).data();

            if (d["PrescriptionOrderStatus"] == "1" || d["PrescriptionOrderStatus"] == "2") {
                ajaxWrapper.Get($("#url").data("prescwindow"), null, function (xdata, e) {
                    $("._message-box").modal({ keyboard: true });
                    $("#detail").html(xdata);
                    $("#ipidPesc").val(d["IPID"]);
                    $("#ordernoid").val(d["OrderNo"]);
                    $("#drid").val(d["DoctorID"]);

                    if (d["PrescriptionOrderStatus"] == "2") {
                        $(".dis").css("display", "none");
                        $(".tbl-prescribed").attr("readonly", "readonly");
                    }
                    ajaxWrapper.Get($("#url").data("selected-pres"), { "PresID": d["OrderNo"], "IPID": d["IPID"] }, function (xx, e) {
                        InitPrescriptionTable(xx);
                    });
                });
            }
            else {
                ViewDetail(d);
            }
        }
    });
    $(document).on("click", "#tbl-drug-list td", function (e) {
        if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {

            var d = TableDrug.row($(this).parents('tr')).data();
            var ID = d["ID"];
            var Name = d["Description2"];
            var Code = d["Code"];
            var Dose = d["Dose"];
            var DoseName = d["DoseName"];
            var d = TableDrug.row($(this).parents('tr')).data();



            ajaxWrapper.Get($("#url").data("checkstock"), { "ID": d["ID"] }, function (stock, e) {
                if (stock != "0") {
                    tblSelected.row.add({
                        "ID": ID,
                        "Code": Code,
                        "Description": Name,

                        "Dose": Dose,
                        "DoseName": DoseName
                    }).draw();

                }
                else {
                    alert("Stock not available at Pharmacy. You cannot proceed.");
                }
            });
            TableDrug
            .row($(this).parents('tr'))
            .remove()
            .draw();
        }
    });
    $(document).on("click", "#tbl-previous-list td", function (e) {
        if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
            var d = tblPrev.row($(this).parents('tr')).data();
            var ID = d["ID"];
            var Name = d["Description"];
            var Code = d["Code"];
            var Code = d["Code"];
            var Dose = d["Dose"];
            var DoseName = d["DoseName"];
            tblSelected.row.add({
                "ID": ID,
                "Code": Code,
                "Description": Name,


                "Dose": Dose,
                "DoseName": DoseName
            }).draw();

            tblPrev
                .row($(this).parents('tr'))
                .remove()
                .draw();
        }
    });
    $(document).on("dblclick", "#tbl-otherproc-selected td", function () {
        tblSelected
        .row($(this).parents('tr'))
        .remove()
        .draw();
    });
    $(document).on("dblclick", "#tbl-prescribed td", function () {
        tblPrescription
        .row($(this).parents('tr'))
        .remove()
        .draw();
    });
    $(document).on("click", "#btnsave", function () {
        Save();
    });
    $(document).on("click", "#btncancel", function () {
        AjaxWrapperPost($("#url").data("cancelorder"), JSON.stringify({ "OrderID": $("#ordernoid").val() }), function () {
            ViewMain();
        },"Prescription Entry");
       
    });
    $(document).on("click", "#btnnew", function () {
        $("._message-box").modal({ keyboard: true });
        $("#detail").html('');
        $.ajax({
            cache: false,
            type: 'GET',
            url: $("#url").data("detail"),
            contentType: 'application/json',
            data: { "IPID": "0" },
            success: function (data) {
                $("#detail").html(data);

                bindPatient(function (d) {
                    ajaxWrapper.Get($("#url").data("selected"), { "PresID": "0", "IPID": $("#ipid").val() }, function (xx, e) {
                        InitSelectedTable(xx, false);
                    });
                });
                $("#stat").val('0');
                $("#ordernoid").val("0");
                $("#ipid").val("0");
                $("#btncancel").css("display", "none");
                BindDrugList();
                BindGenericList();
                BindOtherProc();
                InitSelectedTable();
                InitRequestType();
            }
        });
    });
    $(document).on("click", "#btnprescription", function () {
        if (tblSelected.rows().data().length != 0) {
            var IPID = $("#ipid").val();
            var OrderNo = $("#ordernoid").val();
            var IPID = $("#ipid").val();
            var drid = $("#txtdoctor").val();
            var txtrequest = $("#txtrequest").val();

            ajaxWrapper.Get($("#url").data("prescwindow"), null, function (xdata, e) {
                $("._message-box").modal({ keyboard: true });
                $("#detail").html(xdata);

                $("#ipidPesc").val(IPID);
                $("#drid").val(drid);
                $("#ordernoid").val(OrderNo);
                $("#ordertype").val(txtrequest);

                if (OrderNo != '0') {
                    ajaxWrapper.Get($("#url").data("selected-pres"), { "PresID": OrderNo, "IPID": IPID }, function (xx, e) {
                        InitPrescriptionTable(xx);
                    });
                }
                else {
                    var xx = [];
                    if (tblSelected.rows().data().length != 0) {
                        tblSelected.rows().indexes().each(function (idx) {
                            var d = tblSelected.row(idx).data();
                            d.counter++;
                            xx.push({
                                ID: parseInt(d["ID"]),
                                Description: d["Description"],
                                Dose: d["Dose"],
                                DoseName: d["DoseName"],
                                Frequency: "",
                                Duration: 1,
                                DurationName: "",
                                Administer: "",
                                StartDate: "",
                                EndDate: "",
                                Remarks: "",
                                FrequencyID: 1,
                                RouteofAdminID: 1,
                                DurationID: 1,
                                Discontinue: 0,
                                DiscontinueDate: ""
                            });
                        });
                    }
                    InitPrescriptionTable(xx);
                }
            });
        }
    });

});

function ViewMain() {
    $("._message-box").modal('hide');
    ajaxWrapper.Get($("#url").data("view"), null, function (xdata, e) {
        tbl = $("#tbl-prescription").DataTable({
            destroy: true,
            paging: true,
            searching: true,
            ordering: false,
            info: false,
            data: xdata,
            columns: [
                { data: "sOrderNo" },
                { data: "PIN" },
                { data: "PatientName" },
                { data: "BedName" },
                { data: "DoctorName" },
                { data: "OperatorName" },
                { data: "DateTime" },
                { data: "StationName" }
            ],
            fnRowCallback: function (nRow, aData) {
                var id = aData["PrescriptionOrderStatus"];
                var $nRow = $(nRow); // cache the row wrapped up in jQuery
                if (id == "0") {
                    $nRow.css({ "background-color": "#f2dede" })
                } else if (id == "1") {
                    $nRow.css({ "background-color": "#fcf8e3" })
                }
                else if (id == "2") {
                    $nRow.css({ "background-color": "#dff0d8" })
                }
                return nRow
            }
        });
    });
}

function ViewDetail(d) {
    ajaxWrapper.Get($("#url").data("detail"), { "IPID": d["IPID"] }, function (xdata, e) {
        $("._message-box").modal({ keyboard: true });
        $("#detail").html(xdata);
        bindPatient(null);
        $("#txtpatientID").select2('val', d["IPID"]);
        $("#txtpatientID").select2('enable', false);
        bindDocSelect();
        $("#txtdoctor").select2("val", d["DoctorID"]);
        $("#operator").val(d["OperatorName"]);
        $("#prefixorderno").val(d["sOrderNo"]);
        $("#ipid").val(d["IPID"]);
        $("#ordernoid").val(d["OrderNo"]);
        $("#stat").val(d["DrugDispatch"]);
        $("#date").val(d["DateTime"]);
        BindDrugList();
        BindGenericList();
        InitRequestType();
        ajaxWrapper.Get($("#url").data("selected"), { "PresID": d["OrderNo"], "IPID": d["IPID"] }, function (xx, e) {
            InitSelectedTable(xx, true);
        });

    });
}

function InitSelectedTable(xx, b) {
    if (b == true) {
        tblSelected = $("#tbl-otherproc-selected").DataTable({
            destroy: true,
            paging: false,
            searching: false,
            ordering: false,
            info: false,
            data: xx,
            columns: [
                { data: "ID", visible: false },
                { data: "Code" },
                { data: "Description" },

                { data: "Dose", visible: false },
                { data: "DoseName", visible: false }
            ]
        });
    }
    else {
        tblSelected = $("#tbl-otherproc-selected").DataTable({
            destroy: true,
            paging: false,
            searching: false,
            ordering: false,
            info: false,
            columns: [
                { data: "ID", visible: false },
                { data: "Code" },
                { data: "Description" },

                { data: "Dose", visible: false },
                { data: "DoseName", visible: false }
            ]
        });
    }

    tblPrev = $("#tbl-previous-list").DataTable({
        destroy: true,
        paging: false,
        searching: false,
        ordering: false,
        info: false,
        data: xx,
        columns: [
            { data: "ID", visible: false },
            { data: "Code" },
            { data: "Description" },

            { data: "Dose", visible: false },
            { data: "DoseName", visible: false }
        ]
    });
}

function InitPrescriptionTable(xx) {
    tblPrescription = $("#tbl-prescribed").DataTable({
        destroy: true,
        paging: false,
        searching: false,
        ordering: false,
        info: false,
        data: xx,
        columns: [
            { data: "ID", visible: false },
            { data: "Description", visible: false },
            { data: "Dose", className: "priceeditor" },
            { data: "DoseName", className: "unitName" },
            { data: "Frequency" },
            { data: "Duration", className: "durationumber" },
            { data: "DurationName" },
            { data: "Administer" },
            { data: "StartDate", className: 'dateeditor1' },
            { data: "EndDate", className: "dateeditor2" },
            { data: "Remarks", className: "remarksInput" },
            { data: "Discontinue" },
            { data: "DiscontinueDate", className: "dateeditor3" },

            { data: "RouteofAdminID", visible: false },
            { data: "FrequencyID", visible: false },
            { data: "DurationID", visible: false }
        ]
        ,
        drawCallback: function (settings) {
            var api = this.api();
            var rows = api.rows({ page: 'current' }).nodes();
            var last = null;

            api.column(1, { page: 'current' }).data().each(function (group, i) {
                if (last !== group) {
                    $(rows).eq(i).before(
                        '<tr class="group default"><th colspan="12">' + group + '</th></tr>'
                    );
                    last = group;
                }
            });
        },
        //        fnRowCallback: function (nRow, aData) {
        //            var $nRow = $(nRow); // cache the row wrapped up in jQuery
        //            var sFreq = aData["RoutineID"] + '|' + aData["Routine"]

        //            $(".duration").val(aData['DurationID']);

        //            //$('.duration option[value=' + aData['DurationID'] + ']').attr('selected', 'selected');
        //            return nRow
        //        },
        fnCreatedRow: function (nRow, aData, iDataIndex) {

            InitFreqList(aData["FrequencyID"], function (e) {
                $('td:eq(2)', nRow).html(e);
            });
            InitDurationList(aData["DurationID"], function (e) {
                $('td:eq(4)', nRow).html(e);
            });

            InitRouteList(aData["RouteofAdminID"], function (e) {
                $('td:eq(5)', nRow).html(e);
            });
                        
            $('td:eq(9)', nRow).html('<input type="checkbox" name="chkroles" style="width:15px;height:15px;" class="chk" checked=checked>');
            if (aData["Discontinue"] !== "False") {
                $('td:eq(9)', nRow).html('<input type="checkbox" name="chkroles" style="width:15px;height:15px;" class="chk" checked=checked>');
            }
            else {
                $('td:eq(9)', nRow).html('<input type="checkbox" name="chkroles" style="width:15px;height:15px;" class="chk">');
            }
        }
    });
    initEditable();
}

function Save() {

//    var allRows = $("#tbl-prescribed").dataTable().fnGetNodes();
//    for(var i=0; i < allRows.length; i++) {
//        //alert($(allRows[i]).find("td:eq(4)").html());
//        alert($(allRows[i]).find(".duration option:selected").val());
//    }

//    var d = tblPrescription.$('input, select').serialize();
//    alert(
//            "The following data would have been submitted to the server: \n\n" +
//            d
//        );


    var ItemCode = [];
    if (tblPrescription.rows().data().length != 0) {
    var allRows = $("#tbl-prescribed").dataTable().fnGetNodes();
        tblPrescription.rows().indexes().each(function (idx) {
            var d = tblPrescription.row(idx).data();
            d.counter++;
//            alert($(allRows[idx]).find(".duration option:selected").val());
//            alert($(allRows[idx]).find(".route option:selected").val());
//            alert($(allRows[idx]).find(".frequency option:selected").val());

            var duraitionl = $(allRows[idx]).find(".duration option:selected").val();
            var freql = $(allRows[idx]).find(".frequency option:selected").val();
            var routinel = $(allRows[idx]).find(".routeadmin option:selected").val();

            ItemCode.push({
                ID: d["ID"],
                Dose: d["Dose"],
                DoseName: d["DoseName"],
                Remarks: d["Remarks"],
                DurationID: duraitionl,
                Duration: d["Duration"],
                StartDate: d["StartDate"],
                EndDate: d["EndDate"],
                Discontinue: d["Discontinue"],
                DiscontinueDate: d["DiscontinueDate"],
                RouteofAdminID: routinel,
                FrequencyID: freql
            });
        });
        var aData = {
            "model": ItemCode, "can": CanProc, "OrderID": $("#ordernoid").val(), "IPID": $("#ipidPesc").val(), "DoctorID": $("#drid").val(), "ordertype": $("#ordertype").val()
        }
        AjaxWrapperPost($("#url").data("saveorder"), JSON.stringify(aData), function () {
            ViewMain();
        }, "Prescription Entry");
    }
    else {
        alert('Please choose item');
    }
}

function addEditors() {
    $.editable.addInputType('dateinput', {
        element: function (settings, original) {
            var input = $('<input type="text" class="form-control" value="" style="width: 100%;height: 22px;padding-top:0px;padding-bottom:0px;"/>');
            $(this).append(input);
            return (input);
        },
        plugin: function (settings, original) {
            $(this).find('input')
					.datetimepicker({
					    format: 'DD MMM YYYY HH:mm',
                        autoclose: true,
                        pick12HourFormat: false
					});
        }
    });

    $.editable.addInputType('integerinput', {
        element: function (settings, original) {
            var input = $('<input type="text" class="form-control" style="width:100%;height: 100%;padding-top:0px;padding-bottom:0px;"/>');
            $(this).append(input);

            return (input);
        },
        plugin: function (settings, original) {
            $(this).find('input').inputmask("integer");
            $(this).find('input').keydown(function (e) {
                var cellIndex = tblPrescription.cell(original).index();
                if (e.keyCode == 40) { //down                    
                    if (cellIndex.row < tblPrescription.rows().data().length - 1) {
                        setTimeout(function () { $(tblPrescription.cell(cellIndex.row + 1, cellIndex.column).node()).click(); }, 0)
                    }
                }
                else if (e.keyCode == 38) { //up                                        
                    if (cellIndex.row > 0) {
                        setTimeout(function () { $(tblPrescription.cell(cellIndex.row - 1, cellIndex.column).node()).click(); }, 0)
                    }
                }
            });
        }
    });

    $.editable.addInputType('decimalinput', {
        element: function (settings, original) {
            var input = $('<input type="text" class="form-control" style="height: 100%;width:100%;padding-top:0px;padding-bottom:0px;"/>');
            $(this).append(input);
            return (input);
        },
        plugin: function (settings, original) {
            $(this).find('input').inputmask("decimal", { radixPoint: ".", autoGroup: true, groupSeparator: ",", groupSize: 3, digits: 2 });
            $(this).find('input').keydown(function (e) {
                var cellIndex = tblPrescription.cell(original).index();
                if (e.keyCode == 40) { //down                    
                    if (cellIndex.row < tblPrescription.rows().data().length - 1) {
                        setTimeout(function () { $(tblPrescription.cell(cellIndex.row + 1, cellIndex.column).node()).click(); }, 0)
                    }
                }
                else if (e.keyCode == 38) { //up                                        
                    if (cellIndex.row > 0) {
                        setTimeout(function () { $(tblPrescription.cell(cellIndex.row - 1, cellIndex.column).node()).click(); }, 0)
                    }
                }
            });
        }
    });

    $.editable.addInputType('durationumber', {
        element: function (settings, original) {
            var input = $('<input type="text" class="form-control" style="width:70px;height: 22px;padding-top:0px;padding-bottom:0px;"/>');
            $(this).append(input);

            return (input);
        },
        plugin: function (settings, original) {
            $(this).find('input').inputmask("integer");
            $(this).find('input').keydown(function (e) {
                var cellIndex = tblPrescription.cell(original).index();
                if (e.keyCode == 40) { //down                    
                    if (cellIndex.row < tblPrescription.rows().data().length - 1) {
                        setTimeout(function () { $(tblPrescription.cell(cellIndex.row + 1, cellIndex.column).node()).click(); }, 0)
                    }
                }
                else if (e.keyCode == 38) { //up                                        
                    if (cellIndex.row > 0) {
                        setTimeout(function () { $(tblPrescription.cell(cellIndex.row - 1, cellIndex.column).node()).click(); }, 0)
                    }
                }
            });
        }
    });

    $.editable.addInputType('remarksInput', {
        element: function (settings, original) {
            var input = $('<input type="text" class="form-control" style="height: 22px;padding-top:0px;padding-bottom:0px;"/>');
            $(this).append(input);
            return (input);
        },
        plugin: function (settings, original) {
            //setTimeout(function () { keys.block = true; }, 0);
            $(this).find('input').keydown(function (e) {
                var cellIndex = tblPrescription.cell(original).index();
                if (e.keyCode == 40) { //down                    
                    if (cellIndex.row < tblPrescription.rows().data().length - 1) {
                        setTimeout(function () { $(tblPrescription.cell(cellIndex.row + 1, cellIndex.column).node()).click(); }, 0)
                    }
                }
                else if (e.keyCode == 38) { //up                                        
                    if (cellIndex.row > 0) {
                        setTimeout(function () { $(tblPrescription.cell(cellIndex.row - 1, cellIndex.column).node()).click(); }, 0)
                    }
                }
            });
        }
    });

    $.editable.addInputType('datetimepicker', {
        element: function (settings, original) {
            var input = $('<input type="text" class="date-form form-control" value="' + defaultStartDate + '" style="width: 100%;height: 22px;padding-top:0px;padding-bottom:0px;"/>');
            $(this).append(input);
            return (input);
        },
        plugin: function (settings, original) {
            $(this).find('input').focus(function () {
                var esc = $.Event("keydown", { keyCode: 27 });
                $(this).trigger(esc);
            });
            return;

            $(this).find('input').val(defaultStartDate)
                            .inputmask("datetime12");
            setTimeout(function () { keys.block = true; }, 0);
        }
    });

    $.editable.addInputType('dropdownFreq', {
        element: function (settings, original) {
            $(this).append(FrequencyList);
            return (FrequencyList);
        },
        content: function (data, settings, original) {
            $(this).attr('selected', 'selected');
        }
    });

    $.editable.addInputType('dropdownDuration', {
        element: function (settings, original) {
            $(this).append(DurationList);
            return (DurationList);
        }
    });

    $.editable.addInputType('dropdownRoute', {
        element: function (settings, original) {
            $(this).append(RouteList);
            return (RouteList);
        }
    });

    $.editable.addInputType('unitName', {
        element: function (settings, original) {
            var input = $('<input type="text" class="form-control" style="width:70px;height: 22px;padding-top:0px;padding-bottom:0px;"/>');
            $(this).append(input);
            return (input);
        },
        plugin: function (settings, original) {
            //setTimeout(function () { keys.block = true; }, 0);
            $(this).find('input').keydown(function (e) {
                var cellIndex = tblPrescription.cell(original).index();
                if (e.keyCode == 40) { //down                    
                    if (cellIndex.row < tblPrescription.rows().data().length - 1) {
                        setTimeout(function () { $(tblPrescription.cell(cellIndex.row + 1, cellIndex.column).node()).click(); }, 0)
                    }
                }
                else if (e.keyCode == 38) { //up                                        
                    if (cellIndex.row > 0) {
                        setTimeout(function () { $(tblPrescription.cell(cellIndex.row - 1, cellIndex.column).node()).click(); }, 0)
                    }
                }
            });
        }
    });

    $.editable.addInputType('remarksInput', {
        element: function (settings, original) {
            var input = $('<input type="text" class="form-control" style="height: 22px;padding-top:0px;padding-bottom:0px;"/>');
            $(this).append(input);
            return (input);
        },
        plugin: function (settings, original) {
            //setTimeout(function () { keys.block = true; }, 0);
            $(this).find('input').keydown(function (e) {
                var cellIndex = tbl.cell(original).index();
                if (e.keyCode == 40) { //down                    
                    if (cellIndex.row < tbl.rows().data().length - 1) {
                        setTimeout(function () { $(tbl.cell(cellIndex.row + 1, cellIndex.column).node()).click(); }, 0)
                    }
                }
                else if (e.keyCode == 38) { //up                                        
                    if (cellIndex.row > 0) {
                        setTimeout(function () { $(tbl.cell(cellIndex.row - 1, cellIndex.column).node()).click(); }, 0)
                    }
                }
            });
        }
    });

    $.editable.addInputType('checkInput', {
        element: function (settings, original) {
            var input = $('<input type="checkbox" style="width:20px;height:20px;" />');
            $(this).append(input);
            return (input);
        },
        plugin: function (settings, original) {
            //setTimeout(function () { keys.block = true; }, 0);
            $(this).find('input').keydown(function (e) {
                var cellIndex = tbl.cell(original).index();
                if (e.keyCode == 40) { //down                    
                    if (cellIndex.row < tbl.rows().data().length - 1) {
                        setTimeout(function () { $(tbl.cell(cellIndex.row + 1, cellIndex.column).node()).click(); }, 0)
                    }
                }
                else if (e.keyCode == 38) { //up                                        
                    if (cellIndex.row > 0) {
                        setTimeout(function () { $(tbl.cell(cellIndex.row - 1, cellIndex.column).node()).click(); }, 0)
                    }
                }
            });
        }
    });

}

function initEditable() {
    $('.dateeditor1', tblPrescription.rows().nodes()).editable(function (sVal, settings) {
        var rowIndex = tblPrescription.row($(this).closest('tr')).index();
        tblPrescription.cell(rowIndex, 8).data(sVal).draw();
        return sVal;
    },
			{
			    "type": 'dateinput', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { },
			    "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
			});
    $('.dateeditor2', tblPrescription.rows().nodes()).editable(function (sVal, settings) {
        var rowIndex = tblPrescription.row($(this).closest('tr')).index();
        tblPrescription.cell(rowIndex, 9).data(sVal).draw();
        return sVal;
    },
			{
			    "type": 'dateinput', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { },
			    "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
			});

    $('.dateeditor3', tblPrescription.rows().nodes()).editable(function (sVal, settings) {
        var rowIndex = tblPrescription.row($(this).closest('tr')).index();
        tblPrescription.cell(rowIndex, 12).data(sVal).draw();
        return sVal;
    },
			{
			    "type": 'dateinput', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { },
			    "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
			});

    $('.priceeditor', tblPrescription.rows().nodes()).editable(function (sVal, settings) {
        var rowIndex = tblPrescription.row($(this).closest('tr')).index();
        tblPrescription.cell(rowIndex, 2).data(sVal);
        return sVal;
    },
    {
        "type": 'decimalinput', "style": 'display: inline;', "onblur": 'submit',
        "event": 'click', "submit": '', "cancel": '', "placeholder": ''
    });

    $('.durationumber', tblPrescription.rows().nodes()).editable(function (sVal, settings) {
        var rowIndex = tblPrescription.row($(this).closest('tr')).index();
        tblPrescription.cell(rowIndex, 5).data(sVal).draw();
        return sVal;
    },
     {
         "type": 'durationumber', "style": 'display: inline;', "onblur": 'submit',
         "event": 'click', "submit": '', "cancel": '', "placeholder": ''
     });

    $('.dropdownFreq', tblPrescription.rows().nodes()).editable(function (sVal, settings) {
        var rowIndex = tblPrescription.row($(this).closest('tr')).index();
        var s = sVal.split('|');
        tblPrescription.cell(rowIndex, 4).data(s[0]);
        return s[1];
    },
    {
        "type": 'dropdownFreq', "style": 'display: inline;', "onblur": 'submit',
        "event": 'click', "submit": '', "cancel": '', "placeholder": ''
    });

    $('.dropdownDuration', tblPrescription.rows().nodes()).editable(function (sVal, settings) {
        var rowIndex = tblPrescription.row($(this).closest('tr')).index();
        var s = sVal.split('|');
        tblPrescription.cell(rowIndex, 6).data(s[1]);
        return s[1];
    },
    {
        "type": 'dropdownDuration', "style": 'display: inline;', "onblur": 'submit',
        "event": 'click', "submit": '', "cancel": '', "placeholder": ''
    });

    $('.dropdownRoute', tblPrescription.rows().nodes()).editable(function (sVal, settings) {
        var rowIndex = tblPrescription.row($(this).closest('tr')).index();
        var s = sVal.split('|');
        tblPrescription.cell(rowIndex, 7).data(s[1]);
        return s[1];
    },
    {
        "type": 'dropdownRoute', "style": 'display: inline;', "onblur": 'submit',
        "event": 'click', "submit": '', "cancel": '', "placeholder": ''
    });

    $('.remarksInput', tblPrescription.rows().nodes()).editable(function (sVal, settings) {
        var rowIndex = tblPrescription.row($(this).closest('tr')).index();
        tblPrescription.cell(rowIndex, 10).data(sVal);
        return sVal;
    },
    {
        "type": 'remarksInput', "style": 'display: inline;', "onblur": 'submit',
        "event": 'click', "submit": '', "cancel": '', "placeholder": ''
    });

    $('.unitName', tblPrescription.rows().nodes()).editable(function (sVal, settings) {
        var rowIndex = tblPrescription.row($(this).closest('tr')).index();
        tblPrescription.cell(rowIndex, 3).data(sVal);
        return sVal;
    },
    {
        "type": 'unitName', "style": 'display: inline;', "onblur": 'submit',
        "event": 'click', "submit": '', "cancel": '', "placeholder": ''
    });

    $('.checkInput', tblPrescription.rows().nodes()).editable(function (sVal, settings) {
        var rowIndex = tblPrescription.row($(this).closest('tr')).index();
        tblPrescription.cell(rowIndex, 11).data(sVal);
        return sVal;
    },
    {
        "type": 'checkInput', "style": 'display: inline;', "onblur": 'submit',
        "event": 'click', "submit": '', "cancel": '', "placeholder": ''
    });

}

