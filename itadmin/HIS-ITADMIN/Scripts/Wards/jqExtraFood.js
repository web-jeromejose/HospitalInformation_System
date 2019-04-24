var tbl;
var tblSelected;
var defaultStartDate;
var CancelFood=[];

var ajaxWrapper = $.ajaxWrapper();
$(document).ready(function () {
    ViewMain();
    InitExtraFoodList();
    addEditors();
    InitSelect();
    $(document).on("click", "#tbl-extra-food td", function () {
        CancelFood = [];
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
    //$(document).on("change", "#select-extra-food", function () {
    $(document).on("click", "#tbl-extrafood-list td", function (e) {
        if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
            var d = ExtraFoodTable.row($(this).parents('tr')).data();
            var Name = d["Name"];
            var ID = d["ID"];

            tblSelected.row.add({
                "Row": tblSelected.rows().data().length + 1,
                "Name": Name,
                "Quantity": "",
                "Units": "NILS",
                "ID": ID
            }).draw();
            ExtraFoodTable
                .row($(this).parents('tr'))
                .remove()
                .draw();
            initEditable();
            $(tblSelected.cell(tblSelected.rows().data().length - 1, 2).node()).click();
        }
    });

    $(document).on("dblclick", "#tbl-extrafood-selected td", function () {
        var d = tblSelected.row($(this).parents('tr')).data();
        var Name = d["Name"];
        var ID = d["ID"];
        $("#select-extra-food").append('<option data-id="' + ID + '" data-code="" data-name="' + Name + '" data-unit=""  >' + Name + '</option>');

        if ($("#stat").val() === "1") {
            CancelFood.push({
                ID: parseInt(ID)
            });
        }

        tblSelected
        .row($(this).parents('tr'))
        .remove()
        .draw();
    });

    //$(document).on("click", "#tbl-extrafood-list td", function (e) {
    $(document).on("keydown", "#tbl-extrafood-list_filter", function (e) {
        if (event.which == 13) {
            var d = $("#tbl-extrafood-list").dataTable().fnGetData($('#tbl-extrafood-list tbody tr:eq(0)')[0]);
            if (d["ID"] != 'null') {
                var Name = d["Name"];
                var ID = d["ID"];

                tblSelected.row.add({
                    "Row": tblSelected.rows().data().length + 1,
                    "Name": Name,
                    "Quantity": "",
                    "Units": "NILS",
                    "ID": ID
                }).draw();
                ExtraFoodTable
                .row($('#tbl-extrafood-list tbody tr:eq(0)')[0])
                .remove()
                .draw();
                initEditable();
                $(tblSelected.cell(tblSelected.rows().data().length - 1, 2).node()).click();
            }
        }
    });




    $(document).on("click", "#btnsave", function () {
        Save();
    });
    $(document).on("click", "#btncancel", function () {
        if (tblSelected.rows().data().length != 0) {
            AjaxWrapperPost($("#url").data("cancel"), JSON.stringify({ "OrderID": $("#ordernoid").val() }), function () {
                ViewMain();
            }, "Extra Food Order");
        }
        else {
            alert('Please choose item');
        }
    });
    $(document).on("click", "#btnnew", function () {
        CancelFood = [];
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
                bindPatient(function () {
                    InitExtraFoodList();
                    $("#tbl-extrafood-list_filter input[aria-controls='tbl-extrafood-list']").focus();
                });
                $('#txtpatientID').select2('open');
                $("#stat").val('0');
                $("#ordernoid").val("0");
                $("#ipid").val("0");
                var xx = {
                    "Row": "",
                    "Name": "",
                    "Quantity": "",
                    "Units": "",
                    "ID": ""
                };
                $("#btncancel").css("display", "none");
                InitSelectedTable(xx);
            }
        });
    });
});
function ViewMain() {
    $("._message-box").modal('hide');
    ajaxWrapper.Get($("#url").data("view"), null, function (xdata, e) {
        tbl = $("#tbl-extra-food").DataTable({
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
                { data: "StationName", visible: false }
            ],
            fnRowCallback: function (nRow, aData) {
                var id = aData["Dispatch"];
                var $nRow = $(nRow); // cache the row wrapped up in jQuery
                if (id == "0") {
                    $nRow.css({ "background-color": "#f2dede" })
                }
                else {
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
        $("#txtdoctor").select2("val", d["Docid"]);
        $("#operator").val(d["OperatorName"]);
        $("#prefixorderno").val(d["sOrderNo"]);
        $("#ipid").val(d["IPID"]);
        $("#ordernoid").val(d["OrderNo"]);
        $("#stat").val('1');
        $("#date").val(d["DateTime"]);
        ExtraFoodList();
        $("#select-extra-food").prop("disabled", "disabled");
        ajaxWrapper.Get($("#url").data("selected"), { "OrderID": d["OrderNo"] }, function (xx, e) {
            InitSelectedTable(xx);
        });

    });
}
function InitSelectedTable(xx) {
    tblSelected = $("#tbl-extrafood-selected").DataTable({
        destroy: true,
        paging: false,
        searching: false,
        ordering: false,
        info: false,
        data: xx,
        columns: [
            { data: "Row" },
            { data: "Name" },
            { data: "Quantity", className: "priceeditor" },
            { data: "Units" },
            { data: "ID", visible: false }
        ]
    });
    initEditable();
}
function Save() {
    var ExtraFood = [];
    if (tblSelected.rows().data().length != 0) {
        tblSelected.rows().indexes().each(function (idx) {
            var d = tblSelected.row(idx).data();
            d.counter++;
            ExtraFood.push({
                ID: parseInt(d["ID"]),
                Quantity: parseInt(d["Quantity"])
            });
        });
        var aData = {
            "food": ExtraFood, "canfood": CancelFood, "OrderID": $("#ordernoid").val(), "IPID": $("#ipid").val()
        }
        AjaxWrapperPost($("#url").data("saveorder"), JSON.stringify(aData),function () {
            ViewMain();
        },"Extra Food Order");
        
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
}

function initEditable() {
    $('.priceeditor', tblSelected.rows().nodes()).editable(function (sVal, settings) {
        var rowIndex = tblSelected.row($(this).closest('tr')).index();
        tblSelected.cell(rowIndex, 2).data(sVal);
        $("#tbl-extrafood-list_filter input[aria-controls='tbl-extrafood-list']").val("");
        $("#tbl-extrafood-list_filter input[aria-controls='tbl-extrafood-list']").focus();
        return sVal;
    },
    {
        "type": 'integerinput', "style": 'display: inline;', "onblur": 'submit',
        "event": 'click', "submit": '', "cancel": '', "placeholder": ''
    });
}
