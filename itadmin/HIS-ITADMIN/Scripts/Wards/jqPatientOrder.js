$(function () {
    $('#txtpatientID').select2('open'); 
});
$(document).ready(function () {  
    bindInpatientList(function () {
        ViewData();
        $('#txtpatientID').select2('open'); 
    });
    $(document).on("click", "#btnview", function () {
        ViewData();
    });
});
function ViewData() {
    ajaxWrapper.Get($("#url").data("result"), { "IPID": $("#txtpatientID").val() }, function (xdata, e) {
        var sect="";
        $("#tbl-patientorder").DataTable({
            destroy: true,
            paging: false,
            searching: true,
            ordering: true,
            info: false,
            data: xdata,
            bAutoWidth: false,
            columns: [
                { data: "PType", visible: false },
                { data: "Section" },
                { data: "sOrderNo" },
                { data: "OrderDateTime" },
                { data: "TestName" },
                { data: "Room" },
                { data: "Qty" },
                { data: "Unit" },
                { data: "OrderStat" },
                { data: "Operator" },

                { data: "iRow", visible: false },
                { data: "iiiRow", visible: false },
                { data: "iiRow", visible: false }
            ],            
            drawCallback: function (settings) {
                var api = this.api();
                var rows = api.rows({ page: 'current' }).nodes();
                var last = null;

                api.column(0, { page: 'current' }).data().each(function (group, i) {
                    if (last !== group) {
                        $(rows).eq(i).before(
                            '<tr class="group default" ><th colspan="12" style="text-align:center;">' + group + '</th></tr>'
                        );
                        last = group;
                    }
                });
            },            
            fnRowCallback: function (nRow, aData) {
                
                var $nRow = $(nRow); // cache the row wrapped up in jQuery
                if (sect != aData["Section"])
                {                    
                    sect= aData["Section"];
                }
                else {
                var $cell=$('td:eq(0)', nRow);
                            $cell.text("");
                }
                return nRow
            },
            order: [[10, "asc"], [11, "asc"], [12, "asc"]]


        });
    });
}     