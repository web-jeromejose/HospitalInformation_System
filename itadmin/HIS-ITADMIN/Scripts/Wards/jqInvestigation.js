var tbl;
var tblSelected;
var CanProc = [];
var tblPrev;
var tblTestResult;
var DeptID="0";
var ajaxWrapper = $.ajaxWrapper();

$(document).ready(function () {
    var months = ['Jan', 'Feb', 'Mar', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    now = new Date(),
    formatted = now.getDate() + ' ' + months[now.getMonth()] + ' ' +
         now.getFullYear() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' +
        now.getSeconds();

    InitSelect();
    ViewMain();
    InitProfileList();
    InitTestList();

    $(document).on("click", ".close-lab", function () {
        $("._message-result").modal("hide")
    });    
    $(document).on("click", "#tbl-investigation td", function () {
        if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
            var tr = $(this).closest('tr');
//            if (tr.hasClass('selected')) {
//                tr.removeClass('selected');
//            }
//            else {
//                $('tr.selected').removeClass('selected');
//                tr.addClass('selected');
//            }
            var d = tbl.row($(this).parents('tr')).data();

            if ($(this).hasClass("btnEdit")) {
                ViewDetail(d);
            }
            else {
                ViewDetailTest(d);
            }

        }
    });

    $(document).on("dblclick", "#tbl-investigation-test td", function () {
        if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
            var tr = $(this).closest('tr'); 
            var d = tblTestResult.row($(this).parents('tr')).data();

            if (d["TestDoneBy"] !== "0") {
                generate_report($("#regno").val(),$("#ordernoid").val(),d["ID"])
            }
            else {
                AjaxWrapperPost($("#url").data("updateorder"), JSON.stringify({ "OrderID": $("#ordernoid").val(), "ID": d["ID"] }), function () {
                    if (tr.hasClass("danger")) {
                        tr.removeClass("danger");
                    }
                    else {
                        tr.addClass("danger");
                    }
                }, "Investigation");
            }

        }
    });
    $(document).on("click", "#tbl-all-test td", function (e) {
        if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
            var d = TableTest.row($(this).parents('tr')).data();
            var ID = d["ID"];
            var Name = d["Description"];
            var Code = d["Code"];

            var DestID = d["DestID"];
            var SampleID = d["SampleID"];
            var ProfileID = d["ProfileID"];

            if (DeptID === "0") {
                DeptID = d["Remarks"];
            }
            if (DeptID == d["Remarks"]) {
                tblSelected.row.add({
                    "ID": ID,
                    "Code": Code,
                    "Description": Name,

                    "DestID": DestID,
                    "SampleID": SampleID,
                    "ProfileID": ProfileID
                }).draw();

                TableTest
                .row($(this).parents('tr'))
                .remove()
                .draw();
            }
            else {
                alert('Please generate charge slip for the Selected Procedures');
            }
        }
    });
    $(document).on("click", "#tbl-all-profile td", function (e) {
        if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {

            var d = TableProfile.row($(this).parents('tr')).data();
            var ID = d["ID"];
            var Name = d["Description"];
            var Code = d["Code"];

            var DestID = d["DestID"];
            var SampleID = d["SampleID"];
            var ProfileID = d["ProfileID"];

            var d = TableProfile.row($(this).parents('tr')).data();

            tblSelected.row.add({
                "ID": ID,
                "Code": Code,
                "Description": Name,

                "DestID": DestID,
                "SampleID": SampleID,
                "ProfileID": ProfileID

            }).draw();

            TableProfile
            .row($(this).parents('tr'))
            .remove()
            .draw();
        }
    });
    $(document).on("dblclick", "#tbl-selected td", function () {
        var d = tblSelected.row($(this).parents('tr')).data();
        if ($("#stat").val() == '0'){
            TableTest.row.add({
                "ID": d["ID"],
                "Code": d["Code"],
                "Description": d["Description"],

                "DestID": d["DestID"],
                "SampleID": d["SampleID"],
                "ProfileID": d["ProfileID"]
                        
            }).draw();

            tblSelected
                .row($(this).parents('tr'))
                .remove()
                .draw();
        }
        else
        {
            if (d["CollectedBy"] == "0") {
                tblSelected
                .row($(this).parents('tr'))
                .remove()
                .draw();
            }
            else {
                alert("Sample Has Been Collected For This Test. You Cannot Unselect It.");
            }
        }
    });
       $(document).on("keydown", "#tbl-all-test_filter", function (e) {
        if (event.which == 13) {
            var d = $("#tbl-all-test").dataTable().fnGetData($('#tbl-all-test tbody tr:eq(0)')[0]);
            if (d["ID"] != 'null') {
                var ID = d["ID"];
                var Name = d["Description"];
                var Code = d["Code"];

                var DestID = d["DestID"];
                var SampleID = d["SampleID"];
                var ProfileID = d["ProfileID"];
                  if (DeptID === "0") {
                        DeptID = d["Remarks"];
                    }
                     if (DeptID == d["Remarks"]) {
                        tblSelected.row.add({
                            "ID": ID,
                            "Code": Code,
                            "Description": Name,

                            "DestID": DestID,
                            "SampleID": SampleID,
                            "ProfileID": ProfileID

                        }).draw();

                        $("#tbl-all-test_filter input[class='select2-chosen']").val("");

                        TableTest
                        .row($('#tbl-all-test tbody tr:eq(0)')[0])
                        .remove()
                        .draw();
                    }
                    else {
                        alert('Please generate charge slip for the Selected Procedures');
                    }
            }
        }
    });

    $(document).on("click", "#btnsave", function () {
        Save();
    });
    $(document).on("click", "#btncancel", function () {
        AjaxWrapperPost($("#url").data("cancelorder"), JSON.stringify({ "OrderID": $("#ordernoid").val() }), function () {
            ViewMain();
        }, "Investigation");
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
//                $(".datepicker").datetimepicker({
//					    format: 'DD MMM YYYY HH:mm',
//                        autoclose: true,
//                        pick12HourFormat: false
//					});
                InitPatientStat("1");                
                DeptID = "0";
                bindPatient(function (d) {
                    ajaxWrapper.Get($("#url").data("selected"), { "OrderID": "0", "Br": "0" }, function (xx, e) {
                        InitSelectedTable(xx);

                    });
                    
                    $("#tbl-all-test_filter input[aria-controls='tbl-all-test']").focus();     
                });
                 $("#stat").val('0');
                    $("#ordernoid").val("0");
                    $("#ipid").val("0");
                    $("#txtToBeDoneBY").val(formatted);
                    $("#btncancel").css("display", "none");
                    $('#txtpatientID').select2('open');
                
                    BindTestList();
                    BindProfileList();           
                
            }
        });
    });
});

function ViewMain() {
    $("._message-box").modal('hide');
    ajaxWrapper.Get($("#url").data("view"), null, function (xdata, e) {
        tbl = $("#tbl-investigation").DataTable({
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
                { data: "DateTime" },
                { data: "OperatorName" },
                { data: "Diagnosis", className: "btnEdit btn-select-data-edit" },
                { data: "OrderNo", visible: false }
                           
            ],
            fnRowCallback: function (nRow, aData,iDisplayIndex ) {
                var id = aData["InvStat"];
                var $nRow = $(nRow);
                if (id == "1") {
                    //nRow.className = "row_red";
                    $nRow.css({ "background-color": "#91E1FF" })
                }
                else if (id == "2") {
                    $nRow.css({ "background-color": "#FFFFB3" })
                }
                else if (id == "3") {
                    $nRow.css({ "background-color": "#FFB3B3" })
                }
                return nRow
            },
            fnCreatedRow: function (nRow, aData, iDataIndex) {
                if (aData["InvPriority"] !== "0") {
                    $('td:eq(0)', nRow).addClass("btn-data-priority");
                }
            },
            order: [[7, "desc"]]

        });
        
       // var RegNo = getCookie('RegNo');
        //alert(RegNo);
        //tbl.fnFilter('370885',0, true, false);
    });    
}
function ViewDetail(d) {
    ajaxWrapper.Get($("#url").data("detail"), { "IPID": d["IPID"] }, function (xdata, e) {
        $("._message-box").modal({ keyboard: true });
        $("#detail").html(xdata);

        if (d["InvStat"] !== "3") {
            $("#btncancel").css("display", "none");
        }
        if (d["InvStat"] == "1") {
            $("#btncancel").css("display", "none");
            $("#btnsave").css("display", "none");
        }
        bindPatient(null);

        $("#txtpatientID").select2('val', d["IPID"]);
        $("#txtpatientID").select2('enable', false);
        bindDocSelect();
        $("#txtdoctor").select2("val", d["DoctorID"]);
        $("#operator").val(d["OperatorName"]);
        $("#regno").val(d["RegistrationNo"]);
        $("#prefixorderno").val(d["sOrderNo"]);
        $("#ipid").val(d["IPID"]);
        $("#ordernoid").val(d["OrderNo"]);
        $("#stat").val(d["DrugDispatch"]);
        if (d["InvPhlem"] == "1") {
            $("#phleb").attr("checked", "checked");
        }
        $("#txtToBeDoneBY").val(d["InvTestDate"]);

        if (d["InvTestDone"] == "0") {
            $("#testdoneat1").attr("checked", "checked");
        }
        else {
            $("#testdoneat2").attr("checked", "checked");
        }

        if (d["InvPriority"] == "0") {
            $("#priority1").attr("checked", "checked");
        }
        else {
            $("#priority2").attr("checked", "checked");

        }
        BindTestList();
        BindProfileList();
        InitPatientStat(d["InvPatientStat"]);

        $(".laboratory-list").css("display", "none");
        $(".laboratory-select").removeClass("col-xs-4");
        $(".laboratory-select").addClass("col-xs-10 ");

        ajaxWrapper.Get($("#url").data("selected"), { "OrderID": d["OrderNo"], "Br": "0" }, function (xx, e) {
            InitSelectedTable(xx);
        });
    });
}
function ViewDetailTest(d) {
    ajaxWrapper.Get($("#url").data("detailresult"), { "IPID": d["IPID"] }, function (xdata, e) {
        $("._message-box").modal({ keyboard: true });
        $("#detail").html(xdata);
        $("#txtorder").val(d["sOrderNo"]);
        $("#txtbed").val(d["BedName"]);
        $("#txtpin").val(d["PIN"]);
        $("#txtname").val(d["PatientName"]);
        $("#ipid").val(d["IPID"]);
        $("#ordernoid").val(d["OrderNo"]);
        $("#regno").val(d["RegistrationNo"]);
        ajaxWrapper.Get($("#url").data("selected"), { "OrderID": d["OrderNo"], "Br": "1" }, function (xx, e) {
            tblTestResult = $("#tbl-investigation-test").DataTable({
                destroy: true,
                paging: true,
                searching: false,
                ordering: false,
                info: false,
                data: xx,
                columns: [
                    { data: "ID", visible: false },
                    { data: "Row", },
                    { data: "Profile" },
                    { data: "Section" },
                    { data: "Description" },
                    { data: "Sample" },
                    { data: "Remarks" },
                    { data: "CollectedBy", visible: false  }
                ],
                fnRowCallback: function (nRow, aData) {
                    var CollectedBy = aData["CollectedBy"];
                    var TestDoneBy = aData["TestDoneBy"];
                    var VerifiyBy = aData["VerifiyBy"];
                    var $nRow = $(nRow);

                    if (VerifiyBy !== "0") {
                        $nRow.css({ "background-color": "#B3FFB3" })
                    }
                    else if (TestDoneBy !== "0") {
                        $nRow.css({ "background-color": "#FFFFB3" })
                    }
                    else if (CollectedBy !== "0") {
                        $nRow.css({ "background-color": "#FFB3B3" })
                        //$nRow.addClass("danger");
                    }
                    
                    return nRow
                }
//                ,drawCallback: function (settings) {
//                    var api = this.api();
//                    var rows = api.rows({ page: 'current' }).nodes();
//                    var last = null;

//                    api.column(3, { page: 'current' }).data().each(function (group, i) {
//                        if (last !== group) {
//                            $(rows).eq(i).before(
//                                '<tr class="group default"><th colspan="8">' + group + '</th></tr>'
//                            );
//                            last = group;
//                        }
//                    });
//                }
            });
        });
    });
}

function InitSelectedTable(xx) {
    tblSelected = $("#tbl-selected").DataTable({
        destroy: true,
        paging: true,
        searching: false,
        ordering: false,
        info: false,
        data: xx,
        bAutoWidth: false,
        columns: [
            { data: "ID", visible: false },
            { data: "Code" },
            { data: "Description" },
            { data: "DestID", visible: false },
            { data: "SampleID", visible: false },
            { data: "ProfileID", visible: false }
        ],
            fnRowCallback: function (nRow, aData,iDisplayIndex ) {
                var $nRow = $(nRow);
                if (aData["CollectedBy"] != "0") {
                    $nRow.css({ "background-color": "#FFB3B3" })
                }
                return nRow
            },

        order: [[ 5, "desc" ]]

    });
}
function Save() {
    var LaboratoryTest = [];
    if (tblSelected.rows().data().length != 0) {

        tblSelected.rows().indexes().each(function (idx) {
            var d = tblSelected.row(idx).data();
            d.counter++;
            LaboratoryTest.push({
                ID: parseInt(d["ID"]),
                DestID: parseInt(d["DestID"]),
                SampleID: parseInt(d["SampleID"]),
                ProfileID: parseInt(d["ProfileID"])
            });
        });
        var ph = "0";
        if (typeof $('input[name="phleb"]:checked').val() != undefined) {
            ph = "1";
        }
        var InvestigationDetail = {
            "Remarks": $("#txtremarks").val(),
            "DateTime": $("#date").val(),
            "ToBeDoneBY": $("#txtToBeDoneBY").val(),
            "ExStatus": "1",
            "Phlebotomy": ph,
            "PatientStatus": $("#txtstatus").val(),
            "Priority": $('input[name="priority"]:checked').val(),
            "ToBeDoneAt": $('input[name="testdoneat"]:checked').val()
        }

        var aData = {
            "model": LaboratoryTest, "det": InvestigationDetail, "OrderID": $("#ordernoid").val(), "IPID": $("#ipid").val(), "DoctorID": $("#txtdoctor").val()
        }
        AjaxWrapperPost($("#url").data("saveorder"), JSON.stringify(aData),function() { ViewMain(); }, "Investigation");
        
    }
    else {
        alert('Please choose item');
    }
}

function addEditors() {
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
                        setTimeout(function () { $(tblSelected.cell(cellIndex.row + 1, cellIndex.column).node()).click(); }, 0)
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
                        setTimeout(function () { $(tblSelected.cell(cellIndex.row + 1, cellIndex.column).node()).click(); }, 0)
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
                        setTimeout(function () { $(tblSelected.cell(cellIndex.row + 1, cellIndex.column).node()).click(); }, 0)
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

    InitFreqList();
    $.editable.addInputType('dropdownFreq', {
        element: function (settings, original) {
            $(this).append(FrequencyList);
            return (FrequencyList);
        }
    });

    InitDurationList();
    $.editable.addInputType('dropdownDuration', {
        element: function (settings, original) {
            $(this).append(DurationList);
            return (DurationList);
        }
    });

    InitRouteList();
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
        tblPrescription.cell(rowIndex, 5).data(sVal);
        return sVal;
    },
     {
         "type": 'durationumber', "style": 'display: inline;', "onblur": 'submit',
         "event": 'click', "submit": '', "cancel": '', "placeholder": ''
     });

    $('.datetimeeditorStart', tblPrescription.rows().nodes()).editable(function (sVal, settings) {
        setTimeout(function () { keys.block = false; }, 0);
        var rowIndex = tblPrescription.row($(this).closest('tr')).index();
        tblPrescription.cell(rowIndex, 8).data(sVal).draw();
        return sVal;
    },
    {
        "type": 'datetimepicker', "style": 'display: inline;', "onblur": 'submit',
        "event": 'click', "submit": '', "cancel": '', "placeholder": ''
    });

    $('.datetimeeditorEnd', tblPrescription.rows().nodes()).editable(function (sVal, settings) {
        setTimeout(function () { keys.block = false; }, 0);
        var rowIndex = tblPrescription.row($(this).closest('tr')).index();
        tblPrescription.cell(rowIndex, 9).data(sVal).draw();
        return sVal;
    },
    {
        "type": 'datetimepicker', "style": 'display: inline;', "onblur": 'submit',
        "event": 'click', "submit": '', "cancel": '', "placeholder": ''
    });

    $('.dropdownFreq', tblPrescription.rows().nodes()).editable(function (sVal, settings) {
        var rowIndex = tblPrescription.row($(this).closest('tr')).index();
        var s = sVal.split('|');
        tblPrescription.cell(rowIndex, 4).data(s[1]);
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

    $('.datetimeeditorDiscont', tblPrescription.rows().nodes()).editable(function (sVal, settings) {
        setTimeout(function () { keys.block = false; }, 0);
        var rowIndex = tblPrescription.row($(this).closest('tr')).index();
        tblPrescription.cell(rowIndex, 12).data(sVal).draw();
        return sVal;
    },
    {
        "type": 'datetimepicker', "style": 'display: inline;', "onblur": 'submit',
        "event": 'click', "submit": '', "cancel": '', "placeholder": ''
    });

}


    function generate_report(Reg,Order,TID) {
        var dlink = $("#tbl-investigation-test").data("urllink");
        var repsrc = dlink + "?Reg=" + Reg + "&Order=" + Order + "&TID=" + TID;        
        openNewWindow(repsrc);
    }

    function openNewWindow(link) {
        //popupWin = window.open(link, 'open_window', 'status, scrollbars, resizable,independent, width=640, height=480, left=0, top=0')
        $("._message-result").modal({ keyboard: true });        
        $("#rrpt").attr('src', link);
    }