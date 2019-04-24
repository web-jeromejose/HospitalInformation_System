var tbl;
var tblSelected;
var defaultStartDate;

var ajaxWrapper = $.ajaxWrapper();
$(document).ready(function () {
    var months = ['Jan', 'Feb', 'Mar', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    now = new Date(),
    formatted = now.getDate() + ' ' + months[now.getMonth()] + ' ' +
         now.getFullYear() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' +
        now.getSeconds();

    InitSelect();
    ViewMain();
    addEditors();
    $(document).on("click", "#tbl-blood-request td", function () {
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
            ViewDetail(d);
        }
    });
    $(document).on("dblclick", "#tbl-blood-selected td", function () {
        tblSelected
            .row($(this).parents('tr'))
            .remove()
            .draw();

    });

    $(document).on("change", "#select-blood", function () {
        var BloodName = $('#select-blood>option:selected').data('name');
        var Comp = $('#select-blood>option:selected').data('componentid');

        $("#select-blood>option:selected").remove();

        tblSelected.row.add({
            "Name": BloodName,
            "Quantity": "",
            "RequiredDate": formatted,
            "Remarks": "",
            "ComponentID": Comp
        }).draw();
        initEditable();
        $(tblSelected.cell(tblSelected.rows().data().length - 1, 1).node()).click();        
    });
    $(document).on("click", "#btnsave", function () {
        Save();
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
                //$(".spinner").modal('hide');
                $("#detail").html(data);
                bindPatient(function (d) {
                    ViewOther("0", d["Diagnosis"]);

                });
                bindDocSelect();
                $("#stat").val('3');
                $("#ordernoid").val("0")
            }
        });
    });
});

function ViewMain() {
    $("._message-box").modal('hide');
    ajaxWrapper.Get($("#url").data("view"), null, function (xdata, e) {
        tbl = $("#tbl-blood-request").DataTable({
            destroy: true,
            paging: true,
            searching: true,
            ordering: false,
            info: false,
            data: xdata,
            columns: [
                { data: "sOrderNo" },
                { data: "DateTime" },
                { data: "PIN" },
                { data: "PatientName" },
                { data: "OperatorName" },
                { data: "StationName" }
            ],
            fnRowCallback: function (nRow, aData) {
                var id = aData["Status"];
                var $nRow = $(nRow); // cache the row wrapped up in jQuery
                if (id == "7" || id == "0") {
                    $nRow.css({ "background-color": "#f2dede" })
                }
                else if (id == "1") {
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
        $("#txtdoctor").select2("val", d["Docid"]);
        $("#operator").val(d["OperatorName"]);
        $("#prefixorderno").val(d["sOrderNo"]);
        $("#ipid").val(d["IPID"]);
        $("#ordernoid").val(d["OrderNo"]);
        $("#bloodid").val(d["BloodOrderID"]);
        $("#date").val(d["DateTime"]);
        $("#stat").val('0');
        if (d["Status"] != "0" ) {
            $("#btnsave").css("display", "none")
        }
        ViewOther( d["BloodOrderID"],'');
    });
}

function ViewOther(OrderID,diag) {
    ajaxWrapper.Get($("#url").data("other"), { "OrderID": OrderID }, function (x, e) {
        $("#others").html(x);
        $("#diagnosis").val(diag);
        if ($("#typofrequest").data("id") == "0") {
            $("#Req1").attr("checked", "checked");
        }
        else if ($("#typofrequest").data("id") == "0") {
            $("#Req2").attr("checked", "checked");
        }
        else {
            $("#Req3").attr("checked", "checked");
        }

        if ($("#typoftransfusion").data("id") == "False") {
            $("#trans1").attr("checked", "checked");
        }
        else {
            $("#trans2").attr("checked", "checked");
        }

        if ($("#replacmentdon").data("id") == "False") {
            $("#donor2").attr("checked", "checked");
        }
        else {
            $("#donor1").attr("checked", "checked");
        }
        ajaxWrapper.Get($("#url").data("selected"), { "OrderID": OrderID }, function (xx, e) {
            tblSelected = $("#tbl-blood-selected").DataTable({
                destroy: true,
                paging: false,
                searching: false,
                ordering: false,
                info: false,
                data: xx,
                columns: [
                { data: "Name" },
                { data: "Quantity", className: "priceeditor" },
                { data: "RequiredDate", className: "dateeditor1" },
                { data: "Remarks", className: "remarks" },
                { data: "ComponentID", visible: false }
                ]
            });
            initEditable();
        });

    });
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
            //            $(this).find('input').inputmask("decimal", { radixPoint: ".", autoGroup: true, groupSeparator: ",", groupSize: 3, digits: 0 });
            //            $(this).find('input').inputmask("decimal", { radixPoint: ".", autoGroup: true, groupSeparator: ",", groupSize: 3, digits: 0 });
            $(this).find('input').inputmask("integer");
            $(this).find('input').inputmask("integer");
            $(this).find('input').keydown(function (e) {
                var cellIndex = tblSelected.cell(original).index();
                if (e.keyCode == 40) { //down                    
                    if (cellIndex.row < tblSelected.rows().data().length - 1) {
                        setTimeout(function () { $(tblSelected.cell(cellIndex.row + 1, cellIndex.column).node()).click(); }, 0)
                    }
                }
                else if (e.keyCode == 38) { //up                                        
                    if (cellIndex.row > 0) {
                        setTimeout(function () { $(tblSelected.cell(cellIndex.row - 1, cellIndex.column).node()).click(); }, 0)
                    }
                }
            });
        }
    });

    $.editable.addInputType('datetimepicker', {
        element: function (settings, original) {
            var input = $('<input type="text" class="form-control" value="' + defaultStartDate + '" style="width: 100%;height: 22px;padding-top:0px;padding-bottom:0px;"/>');
            $(this).append(input);

            return (input);
        },
        plugin: function (settings, original) {
            //if (!MakeCellEditable(original)) {
                $(this).find('input').focus(function () {
                    var esc = $.Event("keydown", { keyCode: 27 });
                    $(this).trigger(esc);
                });
                return;
            //}

            $(this).find('input').val(defaultStartDate).inputmask("datetime12");
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
                var cellIndex = tblSelected.cell(original).index();
                if (e.keyCode == 40) { //down                    
                    if (cellIndex.row < tblSelected.rows().data().length - 1) {
                        setTimeout(function () { $(tblSelected.cell(cellIndex.row + 1, cellIndex.column).node()).click(); }, 0)
                    }
                }
                else if (e.keyCode == 38) { //up                                        
                    if (cellIndex.row > 0) {
                        setTimeout(function () { $(tblSelected.cell(cellIndex.row - 1, cellIndex.column).node()).click(); }, 0)
                    }
                }
            });
        }
    });
}

function initEditable() {
    $('.priceeditor', tblSelected.rows().nodes()).editable(function (sVal, settings) {
        var rowIndex = tblSelected.row($(this).closest('tr')).index();
        tblSelected.cell(rowIndex, 1).data(sVal);
        return sVal;
    },
    {
        "type": 'integerinput', "style": 'display: inline;', "onblur": 'submit',
        "event": 'click', "submit": '', "cancel": '', "placeholder": ''
    });

    $('.dateeditor1', tblSelected.rows().nodes()).editable(function (sVal, settings) {
        var rowIndex = tblSelected.row($(this).closest('tr')).index();
        tblSelected.cell(rowIndex, 2).data(sVal).draw();
        return sVal;
    },
			{
			    "type": 'dateinput', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { },
			    "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
			});

    $('.remarks', tblSelected.rows().nodes()).editable(function (sVal, settings) {
        var rowIndex = tblSelected.row($(this).closest('tr')).index();
        tblSelected.cell(rowIndex, 3).data(sVal);
        return sVal;
    },
    {
        "type": 'remarksInput', "style": 'display: inline;', "onblur": 'submit',
        "event": 'click', "submit": '', "cancel": '', "placeholder": ''
    });
}

function Save() {
    var BloodRequest;
    var BloodDetail = [];
    var Defects = 0;
    var Req = 0;
    var Trans = 0;
    var iDonor = 0;
    if ($("#chk1").is(':checked')) {
        Defects = Defects + parseInt( $("#chk1").val());
    }
    if ($("#chk2").is(':checked')) {
        Defects = Defects + parseInt($("#chk2").val());
    }
    if ($("#chk3").is(':checked')) {
        Defects = Defects + parseInt($("#chk3").val());
    }
    if ($("#chk4").is(':checked')) {
        Defects = Defects + parseInt($("#chk4").val());
    }
    if ($("#chk5").is(':checked')) {
        Defects = Defects + parseInt($("#chk5").val());
    }
    if ($("#chk6").is(':checked')) {
        Defects = Defects + parseInt($("#chk6").val());
    }
    if ($("#Req1").is(':checked')) {
        Req = 0;
    }
    if ($("#Req2").is(':checked')) {
        Req = 1;
    }
    if ($("#Req3").is(':checked')) {
        Req = 2;
    }

    if ($("#trans1").is(':checked')) {
        Trans = 0;
    }
    if ($("#trans2").is(':checked')) {
        Trans = 1;
    }

    if ($("#donor1").is(':checked')) {
        iDonor = 0;
    }
    if ($("#donor2").is(':checked')) {
        iDonor = 1;
    }
    BloodRequest = {
        TypeofRequest: 0,
        TypeofTransfusion:0,
        Donor: 0,
        WBC: $("#wbc").val(),
        RBC: $("#rbc").val(),
        PCV: $("#pcv").val(),
        HB: $("#hb").val(),
        Platelet: $("#plate").val(),
        Others: $("#other").val(),
        PT: $("#pt").val(),
        PTTK: $("#pttk").val(),
        EarlierDefect: Defects,
        Diagnosis: $("#diagnosis").val(),
        Docid: $("#txtdoctor").val(),
        IPID: $("#ipid").val(),
        TypeofTransfusion :Trans ,
        TypeofRequest : Req,
        Donor: iDonor,
        BloodOrderID: $("#bloodid").val()
    };
    tblSelected.rows().indexes().each(function (idx) {
        var d = tblSelected.row(idx).data();
        d.counter++;
//        var ddate = d["RequiredDate"].split("/");
//        var str = d["RequiredDate"];
//        var res = ddate[1] + '/' + ddate[0] + '/' + ddate[2];  //str.substring(4, str.length);

        BloodDetail.push({
            ComponentID: parseInt(d["ComponentID"]),
            Quantity: parseInt(d["Quantity"]),
            Remarks: d["Remarks"],
            RequiredDate: d["RequiredDate"]
        });
    });
    var aData = {
        "model": BloodRequest, "blood": BloodDetail
    }

    AjaxWrapperPost($("#url").data("saveorder"), JSON.stringify(aData),function() {
        ViewMain();
    },"Blood Request");
}