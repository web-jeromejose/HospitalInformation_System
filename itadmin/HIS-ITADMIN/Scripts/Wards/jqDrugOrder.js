var tbl;
var tblSelected;

var ajaxWrapper = $.ajaxWrapper();
$(document).ready(function () {
    ViewMain();
    InitDrugList();
    addEditors();
    InitSelect();
    $(document).on("click", "#tbl-drug-order td", function () {
        if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
            var tr = $(this).closest('tr');
            DeptID = "0";
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
    $(document).on("click", "#tbl-drug-list td", function (e) {
        if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
            var d = TableDrug.row($(this).parents('tr')).data();
            $.ajax({
                cache: false,
                type: 'GET',
                url: $("#url").data("checkstock"),
                contentType: 'application/json',
                data: { "ID": d["ID"] },
                success: function (stock) {
                    if (stock != "0") {
                        var ID = d["ID"];
                        var Name = d["Code"] + " - " + d["Description2"];
                        var UnitName = d["UnitName"];

                        tblSelected.row.add({
                            "Row": tblSelected.rows().data().length + 1,
                            "Description": Name,
                            "UnitName": UnitName,
                            "Quantity": "",
                            "Remarks": "",
                            "ID": ID
                        }).draw();

                        tblSelected = $("#tbl-drug-order-selected").DataTable({
                            retrieve: true,
                            fnCreatedRow: function (nRow, aData, iDataIndex) {
                                InitUnit(ID, "", function (e) {
                                    $('td:eq(2)', nRow).html(e);
                                });
                            }
                        });

                        initEditable();
                        $(tblSelected.cell(tblSelected.rows().data().length - 1, 3).node()).click();
                        TableDrug
                                    .row($('#tbl-drug-list tbody tr:eq(0)')[0])
                                    .remove()
                                    .draw();
                    }
                    else {
                        alert("Stock not available at Pharmacy. You cannot proceed.");
                    }
                }

            });
        }
    });
    $(document).on("dblclick", "#tbl-drug-order-selected td", function () {
        tblSelected
            .row($(this).parents('tr'))
            .remove()
            .draw();

    });
    $(document).on("keydown", "#tbl-drug-list_filter", function (e) {
            if (event.which == 13) {
                var d = $("#tbl-drug-list").dataTable().fnGetData($('#tbl-drug-list tbody tr:eq(0)')[0]);
                if (d["id"] != 'null') {
                    $.ajax({
                        cache: false,
                        type: 'GET',
                        url: $("#url").data("checkstock"),
                        contentType: 'application/json',
                        data: { "ID": d["ID"] },
                        success: function (stock) {
                            if (stock != "0") {
                                var ID = d["ID"];
                                var Name = d["Code"] + " - " + d["Description2"];
                                var UnitName = d["UnitName"];
                                tblSelected.row.add({
                                    "Row": tblSelected.rows().data().length + 1,
                                    "Description": Name,
                                    "UnitName": UnitName,
                                    "Quantity": "",
                                    "Remarks": "",
                                    "ID": ID
                                }).draw();
                                initEditable();
                                $(tblSelected.cell(tblSelected.rows().data().length - 1, 3).node()).click();
                                TableDrug
                                    .row($('#tbl-drug-list tbody tr:eq(0)')[0])
                                    .remove()
                                    .draw();

                            }
                            else {
                                alert("Stock not available at Pharmacy. You cannot proceed.");
                            }
                        }
                    });

                }
            }
        });

    $(document).on("click", "#btncancel", function () {
        AjaxWrapperPost($("#url").data("cancel"), JSON.stringify({ "OrderID": $("#ordernoid").val() }), function () {
            ViewMain();
        }, "Drug Order");

    });
    $(document).on("click", "#btnreceive", function () {
        AjaxWrapperPost($("#url").data("receive"), JSON.stringify({ "OrderID": $("#ordernoid").val() }), function () {
            ViewMain();
        }, "Drug Order");
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
                $("#detail").html(data);
                $("#stat").val('0');
                $("#ordernoid").val("0");
                $("#ipid").val("0");
                $("#btncancel").css("display", "none");
                $("#btnreceive").css("display", "none");
                DeptID = "0";
                InitRequestType('0');
                bindPatient(function () {
                    BindDrugList();
                    InitSelectedTable();
                    $("#tbl-drug-list_filter input[aria-controls='tbl-drug-list']").focus();  
                });
                $('#txtpatientID').select2('open');
            }
        });
    });
});
    function ViewMain() {
    $("._message-box").modal('hide');
    ajaxWrapper.Get($("#url").data("view"), null, function (xdata, e) {
        tbl = $("#tbl-drug-order").DataTable({
            destroy: true,
            paging: true,
            searching: true,
            ordering: true,
            info: false,
            data: xdata,
            columns: [
                { data: "sOrderNo" },
                { data: "PIN" },
                { data: "PatientName" },
                { data: "BedName" },
                { data: "DateTime" },
                { data: "OperatorName" },
                
                { data: "DrugDispatch",visible:false},
                { data: "OrderNo", visible: false }
            ],
            fnRowCallback: function (nRow, aData) {
                var id = aData["DrugDispatch"];
                var $nRow = $(nRow); // cache the row wrapped up in jQuery

                if (id == "2") {
                    $('td:eq(0)', nRow).addClass('row_orange');
                    $nRow.css({ "background-color": "#FFFFB3" })
                }
                else if (id == "3") {
                    
                    $nRow.css({ "background-color": "#B3FFB3" })
                }
                else {
                    $nRow.css({ "background-color": "#FFB3B3" })                
                }
                return nRow
            },
            order: [[6, "asc"],[7, "desc"] ]
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
        InitRequestType(d["DrugTakeHome"]);

        ajaxWrapper.Get($("#url").data("selected"), { "OrderID": d["OrderNo"] }, function (xx, e) {
            InitSelectedTable(xx);
            if (d["DrugDispatch"] == "1") {
                initEditable();
            }
        });
        if (d["DrugDispatch"] === "1") {
            BindDrugList();
            $("#btnreceive").css("display", "none");             
        }
        else if (d["DrugDispatch"] === "2") {

            $("#col-drug-list").removeClass("col-lg-4");
            $("#col-drug-list").css("display", "none");
            $("#col-drug-list-select").removeClass("col-lg-8");
            $("#col-drug-list-select").addClass("col-lg-12");

            $("#btncancel").css("display", "none");
            $("#btnsave").css("display", "none");
        }
        else if (d["DrugDispatch"] === "3") {

            $("#col-drug-list").removeClass("col-lg-4");
            $("#col-drug-list").css("display", "none");
            $("#col-drug-list-select").removeClass("col-lg-8");
            $("#col-drug-list-select").addClass("col-lg-12");
            $("#btnreceive").css("display", "none");
            $("#btnsave").css("display", "none");
            $("#btncancel").css("display", "none");
        }

    });
}
function InitSelectedTable(xx,d) {
    tblSelected = $("#tbl-drug-order-selected").DataTable({
        destroy: true,
        paging: false,
        searching: false,
        ordering: false,
        info: false,
        data: xx,
        columns: [
            { data: "Row" },
            { data: "Description" },
            { data: "UnitName" },
            { data: "Quantity", className: "priceeditor"  },
            { data: "Remarks", className : "remarks" },
            { data: "ID", visible: false }
        ],
        fnCreatedRow: function (nRow, aData, iDataIndex) {
            InitUnit(aData["ID"], aData["UnitID"], function (e) {
                $('td:eq(2)', nRow).html(e);
            });
        }
    });
 
}
    function Save() {
    var ItemCode = [];
    if (tblSelected.rows().data().length > 0) {
        var allRows = $("#tbl-drug-order-selected").dataTable().fnGetNodes();
        tblSelected.rows().indexes().each(function (idx) {
            var d = tblSelected.row(idx).data();
            d.counter++;
            var unitid = $(allRows[idx]).find(".unitlist option:selected").val();
            ItemCode.push({
                ID: parseInt(d["ID"]),
                Quantity: parseInt(d["Quantity"]),
                Remarks: d["Remarks"],
                UnitID: unitid
            });
        });
        var TKHome = $("#txtrequest").val();        
        var aData = {
            "item": ItemCode, "OrderID": $("#ordernoid").val(), "IPID": $("#ipid").val(), "DoctorID": $("#txtdoctor").val(), "TKHome": TKHome
        }

        AjaxWrapperPost($("#url").data("saveorder"), JSON.stringify(aData),function() {
            ViewMain();
        },"Drug Order");
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

        $("#tbl-drug-list_filter input[aria-controls='tbl-drug-list']").val("");
        $("#tbl-drug-list_filter input[aria-controls='tbl-drug-list']").focus();

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
