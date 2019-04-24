var tbl;
var tblSelected;
var ctr = 1;

var ajaxWrapper = $.ajaxWrapper();
$(document).ready(function () {
    ViewMain();
    InitSelect();
    addEditors();

    $(document).on("click", "#tbl-drug-return td", function () {
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
            ViewDetail(d);
        }
    });
    $(document).on("dblclick", "#tbl-drug-return-selected td", function () {
        var d = tblSelected.row($(this).parents('tr')).data();
        var DrugName = d["DrugName"];
        var UnitName = d["UnitName"];
        var InputQuantity = d["InputQuantity"];
        var Quantity = d["Quantity"];
        var Batchno = d["Batchno"];
        var ServiceID = d["ServiceID"];
        var BatchID = d["BatchID"];
        var Remarks = d["Remarks"];

        TableDrug.row.add({
            "DrugName": DrugName,
            "UnitName": UnitName,
            "InputQuantity": InputQuantity,
            "Quantity": Quantity,
            "Remarks": Remarks,
            "Batchno": Batchno,
            "ServiceID": ServiceID,
            "BatchID": BatchID
        }).draw();

        tblSelected
            .row($(this).parents('tr'))
            .remove()
            .draw();

    });

    //$(document).on("change", "#selectdruglist", function () {
    $(document).on("click", "#tbl-drug-return-druglist td", function (e) {

        if (TableDrug.rows().data().length > 0) {
            var d = TableDrug.row($(this).parents('tr')).data();
            var DrugName = d["DrugName"];
            var UnitName = d["UnitName"];
            var InputQuantity = d["InputQuantity"];
            var Quantity = d["Quantity"];
            var Batchno = d["Batchno"];
            var ServiceID = d["ServiceID"];
            var BatchID = d["BatchID"];
            var Remarks = d["Remarks"];

            tblSelected.row.add({
                "Row": tblSelected.rows().data().length + 1,
                "DrugName": DrugName,
                "UnitName": UnitName,
                "InputQuantity": InputQuantity,
                "Quantity": Quantity,
                "Remarks": Remarks,
                "Batchno": Batchno,
                "ServiceID": ServiceID,
                "BatchID": BatchID
            }).draw();

            TableDrug
                .row($(this).parents('tr'))
                .remove()
                .draw();

            initEditable();
            $(tblSelected.cell(tblSelected.rows().data().length - 1, 3).node()).click();
        }
    });

    $(document).on("click", "#btncancel", function (e) {
        AjaxWrapperPost($("#url").data("cancelorder"), JSON.stringify({ "OrderID": $("#ordernoid").val() }), function () {
            ViewMain();
        }, "Drug Return");
    });

    $(document).on("click", "#btnsave", function (e) {
        Save();
    });

    $(document).on("click", "#btnnew", function () {
        $("._message-box").modal({ keyboard: true });
        ajaxWrapper.Get($("#url").data("detail"), { "IPID": "0" }, function (xdata, e) {
            $("#detail").html(xdata);
            $("#stat").val('0');
            $("#ordernoid").val("0")
            bindPatient(function () {
                OrderNoList();
                ClearDrugSelected();
            });
            $('#txtpatientID').select2('open');
        });
    });
});

function ViewMain() {
    $("._message-box").modal('hide');
    ajaxWrapper.Get($("#url").data("view"), null, function (xdata, e) {
        tbl = $("#tbl-drug-return").DataTable({
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

                { data: "Status",visible:false },
                { data: "OrderNo", visible: false }
            ],
            fnRowCallback: function (nRow, aData) {
                var id = aData["Status"];
                var $nRow = $(nRow); // cache the row wrapped up in jQuery
                if (id == "1") {
                    $nRow.css({ "background-color": "#FFB300" })
                }
                return nRow
            },            
            order: [[6, "asc"],[7, "asc"]]
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
        $("#drugorderid").val(d["DrugOrderID"]);
        $("#stat").val('1');
        $("#date").val(d["DateTime"]);
        if (d["Status"] == "1") {
            $("#btnsave").css("display", "none");
            $("#btncancel").css("display", "none");
        }
        OrderNoList(d["DrugOrderID"]);
        $(".selectdruglist").css("display", "none");
        ajaxWrapper.Get($("#url").data("selected"), { "ID": d["DrugOrderID"], "OrderID": d["OrderNo"] }, function (xx, e) {
            InitSelectedTable(xx);
        });

        OrderNoList(d["DrugOrderID"], d["OrderNo"]);
    });
}

function InitSelectedTable(xx) {
    tblSelected = $("#tbl-drug-return-selected").DataTable({
        destroy: true,
        paging: false,
        searching: false,
        ordering: false,
        info: false,
        data: xx,
        columns: [
            { data: "Row" },
            { data: "DrugName" },
            { data: "UnitName" },
            { data: "Quantity", className: "priceeditor" },
            { data: "Remarks", className: "remarks" },
            { data: "Batchno" },
            { data: "Quantity",visible: false},
            { data: "ServiceID", visible: false },
            { data: "BatchID", visible: false }
        ]
    });
    
}


function addEditors() {
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
        tblSelected.cell(rowIndex, 3).data(sVal);
        return sVal;
    },
    {
        "type": 'integerinput', "style": 'display: inline;', "onblur": 'submit',
        "event": 'click', "submit": '', "cancel": '', "placeholder": ''
    });

    $('.remarks', tblSelected.rows().nodes()).editable(function (sVal, settings) {
        var rowIndex = tblSelected.row($(this).closest('tr')).index();
        tblSelected.cell(rowIndex, 4).data(sVal);
        return sVal;
    },
    {
        "type": 'remarksInput', "style": 'display: inline;', "onblur": 'submit',
        "event": 'click', "submit": '', "cancel": '', "placeholder": ''
    });
}
function ClearDrugSelected() {
    var x = {
        "Row": "",
        "DrugName": "",
        "UnitName": "",
        "InputQuantity": "",
        "Remarks": "",
        "Batchno": "",
        "Quantity": "",
        "ServiceID": "",
        "BatchID": ""
    }
    $("#selectdruglist").empty();
    InitSelectedTable(x);
}

function Save() {
    if (tblSelected.rows().data().length > 0) {
        var DrugModel = [];
        var err = false;
        tblSelected.rows().indexes().each(function (idx) {
            var d = tblSelected.row(idx).data();
            d.counter++;
            if (parseInt(d["Quantity"]) == 0) {
                alert("Please enter Quantity required for Drug Name : " + d["DrugName"]);
                err = true;
            }
            if (parseInt(d["InputQuantity"]) > parseInt(d["Quantity"])) {
                alert("Quantity to be returned should be less than " + d["Quantity"] + " for Drug Name : " + d["DrugName"]);
                err = true;
            }
            if (parseInt(d["Quantity"]) == 0) {
                alert("Already Return for Drug Name : " + d["DrugName"]);
                err = true;
            }
            DrugModel.push({
                ServiceID: parseInt(d["ServiceID"]),
                Quantity: parseInt(d["Quantity"]),
                Remarks: d["Remarks"],
                BatchID: parseInt(d["BatchID"])
            });

        });

        if (err == false) {
            var aData = { "model": DrugModel, "IPID": $("#ipid").val(), "DrugOrderID": $("#ordernolist").val(), "DoctorID": $("#txtdoctor").val(), "OrderID": $("#ordernoid").val() }
            alert('ok');
//            AjaxWrapperPost($("#url").data("saveorder"), JSON.stringify(aData), function () {
//                ViewMain();
//            }, "Drug Return");
        }
    }
    else {
        alert("Please select at least one Drug");
    }
}