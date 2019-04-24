

var c = new Common();

jQuery(document).ready(function () {

 
    ChangeZeroPrice.init();

});

var ChangeZeroPrice = function () {

    var handleScript = function () {
        console.log('handleScript');
      

        function InitSelect2() {
            // Sample usage
            //Sel2Server($("#select2Pin"), $("#url").data("getpatientlist"), function (d) {
           
            //});
 

            ajaxWrapper.Get($("#url").data("getpatientlist"), {id : ''}, function (xx, e) {
                Sel2Client($("#select2Pin"), xx, function (x) {
                    console.log(x);                  
                })
            });




        }

        function initOnChange() {
            $('#select2Pin').on('change', function (xx) {
                console.log($(this).val());
                LoadZeroPriceList();

            });
        }



        // -----------------------------------------ZeroPriceList TAB------------------------------------------------------------------------------------------------------------------

        var LoadZeroPriceList = function () {
            console.log('LoadZeroPriceList');
            ajaxWrapper.Get($("#url").data("getorderlist"), { ipid: $('#select2Pin').val() }, function (x, e) {
                BindDashboardZeroPriceList(x.list);
          
            });
        };
        var TblDashboardZeroPriceList;
        var TblDashboardZeroPriceListId = '#DTviewZeroPriceList';
        var TblDashboardZeroPriceListDataRow;
        var ennDashboardZeroPriceList = { Btn: 0, del: 1, ctr: 2, ID: 3, Name: 4, Edited: 5, Deleted: 6 };

        var Format24 = "HH:mm";
        var calcHeightDashboardZeroPriceList = function () {
            return $(window).height() * 60 / 100;
        };
        function ShowDashboardRowCallDashboardZeroPriceList() {
            var rc = function (nRow, aData) {
                var $nRow = $(nRow);

                if (aData.isCheck == "1") {
                    $('#checkItemisService', nRow).prop('checked', true);
                    $('td:eq(2)', nRow).html('<button type="button" class="btn btn-xs green">Yes</button>');
                }



            };
            return rc;
        }
        function BindDashboardZeroPriceList(data) {

            // http://legacy.datatables.net/release-datatables/examples/basic_init/scroll_x.html
            TblDashboardZeroPriceList = $(TblDashboardZeroPriceListId).DataTable({
                autoWidth: false,
                cache: true,
                destroy: true,
                data: data,
                paging: false,
                ordering: true,
                searching: true,
                //  info: false,

                scrollY: calcHeightDashboardZeroPriceList(),
                scrollX: "100%",
                sScrollXInner: "100%",
                //processing: true,


                dom: '<"tbDashboardZeroPriceList">Rlfrtip',
                //    scrollCollapse: false,
                //pageLength: 20,
                lengthChange: false,

                columns: [
                    // { data: "", title: '', className: 'control-center', visible: true, searchable: false, width: "1px", defaultContent: '<button type="button" class="btn btn-sm btn-danger" Id="btnDetailsModif" title="Delete" rel="tooltip"> <i class="glyphicon glyphicon-trash"></i></button>' },
                     { data: "OrderId", title: 'Order Id', className: '     ', visible: true, searchable: true, width: "10%" },
                  //  { data: "Dispatcheddatetime", title: 'Order Date', className: '     ', visible: true, searchable: true, width: "20%" },
                    { data: "ItemName", title: 'Item Name', className: '     ', visible: true, searchable: true, width: "70%" },
                    { data: "dispatchquantity", title: 'Quantity', className: '     ', visible: true, searchable: true, width: "10%" },
                    { data: "Price", title: 'Price', className: '     ', visible: true, searchable: true, width: "10%" },
                   // { data: "Dispatcheddatetime", title: 'Item-Wise', className: ' input-xs ', visible: true, searchable: false, width: "1%", defaultContent: '<button type="button" class="btn btn-xs red">No</button>' },
                    // { data: "", title: 'Dept-Wise', className: ' input-xs ', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" class="control-center iCheck-helper" id="checkisDept" />' },
                    //{ data: "Percentage", title: 'Percentage', className: 'ClassPercentage ', visible: true, searchable: true, width: "0%" },
                    //{ data: "StartDateTime", title: 'Start Date', className: ' ClassDOB  ', visible: true, searchable: true, width: "0%" },
                    // { data: "Deleted", title: 'Deleted', className: ' ClassYesorNo', visible: true, searchable: false, width: "0%" }
                    //{ data: "StationId", title: 'StationId', className: '', visible: false, searchable: false, width: "0%" },
                    //{ data: "RoleId", title: 'RoleId', className: '', visible: false, searchable: false, width: "0%" },
             
                ],
                fnRowCallback: ShowDashboardRowCallDashboardZeroPriceList()
            });


            var btns = '';
            var toolbar = btns.concat(
                 '<div style="float:left;">'
                 , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnUpdateZeroPrice"> <i class="glyphicon glyphicon-check"></i> Update Price to 0.01 </button>'
              //  , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnUNCheckAllFunctions"> <i class="glyphicon glyphicon-unchecked"></i> All </button>'
                , '</div><br><br>');
             $("div.tbDashboardZeroPriceList").html(toolbar);

            $('#btnUpdateZeroPrice').click(function () {
              
                var YesFunc = function () {
                    var entry;
                    entry = []
                    entry = {}
                    entry.Action = 1;
                    entry.ipid = $('#select2Pin').val();
                    console.log(entry);

                        $.ajax({
                            url: $('#url').data("zeropricesave"),
                            data: JSON.stringify(entry),
                            type: 'post',
                            cache: false,
                            contentType: "application/json; charset=utf-8",
                            beforeSend: function () {
 
                            },
                            success: function (data) {
                            

                                if (data.ErrorCode == 0) {
                                    c.MessageBoxErr("Error...", data.Message);
                                    return;
                                }

                                var OkFunc = function () {
                                    $('#btnUpdateZeroPrice').hide();
                                };

                                c.MessageBox(data.Title, data.Message, OkFunc);
                            },
                            error: function (xhr, desc, err) {
                                c.ButtonDisable('#BtnviewVatSave', false);
                                var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
                                c.MessageBox("Error...", errMsg, null);
                            }
                        });
 
                };
                c.MessageBoxConfirm("Update CST Price", "Are you sure you want to update this PIN ?", YesFunc, null);
 
               
            });
            //$('#btnUNCheckAllFunctions').click(function () {
            //    $('#preloader').show();
            //    $.each(TblDashboardZeroPriceList.rows().data(), function (i, row) {
            //        TblDashboardZeroPriceList.cell(i, 0).data('<input id="checkFunctionConfigRole" type="checkbox">');
            //    });
            //    $('#preloader').hide();

            //});

            //$(TblDashboardZeroPriceListId + ' tbody').on('click', '#checkFunctionConfigRole', function (e) {
            //    var $cell = $(this).closest('td');
            //    var $row = $(this).closest('tr');
            //    var Tbl = TblDashboardZeroPriceList;
            //    var data = Tbl.row($row).data();
            //    var rowId = data[0];
            //    var col = Tbl.cell($(this).closest('td')).index();
            //    if (this.checked) {
            //        $row.addClass("row_green");
            //    } else {
            //        $row.removeClass("row_green");
            //    }
            //    e.stopPropagation();
            //});
        }

        // -----------------------------------------------------------------------------------------------------------------------------------------------------------



        $(document).ready(function () {

            InitSelect2();
            initOnChange();
  
        });



    }

    return {
        //main function to initiate the module
        init: function () {

            handleScript();
 
        }

    };

}();