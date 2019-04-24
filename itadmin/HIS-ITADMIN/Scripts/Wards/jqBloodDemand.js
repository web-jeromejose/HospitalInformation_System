var tbl;
var tblSelected;

var ajaxWrapper = $.ajaxWrapper();
$(document).ready(function () {
    var months = ['Jan', 'Feb', 'Mar', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    now = new Date(),
    formatted = now.getDate() + ' ' + months[now.getMonth()] + ' ' +
         now.getFullYear() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' +
        now.getSeconds();

    ViewMain();
    InitSelect();
    addEditors();
    $(document).on("click", "#tbl-blood-demand td", function () {
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
    $(document).on("change", "#select-blood", function () {
        var BloodName = $('#select-blood>option:selected').data('name');
        var Quantity = $('#select-blood>option:selected').data('qty');
        var DemandQty = $('#select-blood>option:selected').data('demandqty');
        var Remarks = $('#select-blood>option:selected').data('remarks');
        var comp = $('#select-blood>option:selected').data('comptid');
        var PrevQuantity = $('#select-blood>option:selected').data('prev');

        $("#select-blood>option:selected").remove();

        tblSelected.row.add({
            "Row" : tblSelected.rows().data().length + 1,
            "Name": BloodName,
            "Quantity": parseInt(Quantity),
            "PrevQuantity": parseInt(PrevQuantity),
            "DemandQuantity": "",
            "Remarks": Remarks,
            "ComponentID": comp
        }).draw();

        initEditable();
        $(tblSelected.cell(tblSelected.rows().data().length - 1, 4).node()).click();   
    });
    $(document).on("click", "#btnsave", function () {
        SaveData();
    });

});

function ViewMain() {
    $("._message-box").modal('hide');
    ajaxWrapper.Get($("#url").data("view"), null, function (xdata, e) {
        tbl = $("#tbl-blood-demand").DataTable({
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
                { data: "BedName" },
                { data: "StationName" }
            ],
            fnRowCallback: function (nRow, aData) {
                var id = aData["Demand"];
                var $nRow = $(nRow); // cache the row wrapped up in jQuery
                if (id == "0") {
                    $nRow.css({ "background-color": "#f2dede" })
                }
                else if (id == "1") {
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
        bindPatient();
        $("#txtpatientID").select2('val', d["IPID"]);
        $("#txtpatientID").select2('enable', false);
        bindDocSelect();
        $("#txtdoctor").select2("val", d["Docid"]);
        $("#operator").val(d["OperatorName"]);
        $("#prefixorderno").val(d["sOrderNo"]);
        $("#ipid").val(d["IPID"]);
        $("#ordernoid").val(d["OrderNo"]);
        $("#bloodid").val(d["BloodOrderID"]);
        $("#stat").val('0');
//        alert(d["Demand"]);
//        if (d["Demand"]) = "2") {

//        }
        ajaxWrapper.Get($("#url").data("blood"), { "OrderID": d["BloodOrderID"] }, function (x, e) {
            $.each(x, function (index) {
                $("#select-blood").append('<option data-comptid="' + x[index].ComponentID + '" data-prev="' + x[index].PrevQuantity + '" data-qty="' + x[index].Quantity + '" data-demandqty="' + x[index].DemandQuantity + '" data-remarks="' + x[index].Remarks + '" data-name="' + x[index].Name + '">' + x[index].Code + ' - ' + x[index].Name + '</option>');
            });
        });
        var xx = {
            "Row": "",
            "Name": "",
            "Quantity": "",
            "DemandQuantity": "",
            "Remarks": "",
            "ComponentID": "",
            "PrevQuantity": ""
        };
        tblSelected = $("#tbl-blood-selected").DataTable({
            paging: false,
            searching: false,
            ordering: false,
            info: false,
            data: xx,
            columns: [
               { data: "Row" },
               { data: "Name" },
               { data: "Quantity" },
               { data: "PrevQuantity" },
               { data: "DemandQuantity", className: "priceeditor" },
               { data: "Remarks", className: "remarks" },
               { data: "ComponentID", visible: false }
            ]
        });
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
        return sVal;
    },
    {
        "type": 'integerinput', "style": 'display: inline;', "onblur": 'submit',
        "event": 'click', "submit": '', "cancel": '', "placeholder": ''
    });

    $('.remarks', tblSelected.rows().nodes()).editable(function (sVal, settings) {
        var rowIndex = tblSelected.row($(this).closest('tr')).index();
        return sVal;
    },
    {
        "type": 'remarksInput', "style": 'display: inline;', "onblur": 'submit',
        "event": 'click', "submit": '', "cancel": '', "placeholder": ''
    });
}

function SaveData() {
    if (tblSelected.rows().data().length != -1) {
        var BloodDetail = [];
        var err = false;
        tblSelected.rows().indexes().each(function (idx) {
            var d = tblSelected.row(idx).data();
            d.counter++;

            BloodDetail.push({
                ComponentID: parseInt(d["ComponentID"]),
                Quantity: parseInt(d["Quantity"]),
                Remarks: d["Remarks"],
                DemandQuantity: parseInt(d["DemandQuantity"])
            });
        });

        if (err == false) {
            var aData = {
                "model": BloodDetail, "IPID": $("#ipid").val(), "BloodOrderID": $("#bloodid").val()                
            }
            AjaxWrapperPost($("#url").data("saveorder"), JSON.stringify(aData),function () {
                ViewMain();
            }, "Blood Demand");
        }
    }
}