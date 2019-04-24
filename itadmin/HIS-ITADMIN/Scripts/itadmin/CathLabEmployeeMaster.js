 
var CathLabEmployeeMaster = function () {

    // Handle  
    var handleJS = function () {
        var c = new Common();

        var initSelect2 = function () {
 
            $("#Select2EmployeeType").select2({
                data: [ { id: 2, text: 'Doctor' }
                       ,{ id: 3, text: 'Technician' }
                       ,{ id: 4, text: 'Anaesthetist' }
                       ,{ id: 5, text: 'Scrub Nurse' }
                        ],
                minimumResultsForSearch: -1
            }).change(function (e) {
                c.ButtonDisable('#btnSave', false);
                ShowDashboard();

          
            });


        };
        var init = function () {
            c.ButtonDisable('#btnSave', true);
        };

        var initClick = function () {

            $('#btnSave').click(function () {
                Save();
            });


            $(document).on("click", "#iChkAllTest", function () {
                $('#preloader').show();
                if ($('#iChkAllTest').is(':checked')) {
                    $.each(TblDashboard.rows().data(), function (i, row) {
                        TblDashboard.cell(i, 0).data('<input id="chkselected" type="checkbox" checked="checked" >');
                    });
                }
                else {
                    $.each(TblDashboard.rows().data(), function (i, row) {
                        TblDashboard.cell(i, 0).data('<input id="chkselected" type="checkbox">');
                    });

                }
                $('#preloader').hide();
            });

            $(document).on("click", "#TblDashboard td", function () {
                if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {

                    var d = TblDashboard.row($(this).parents('tr')).data();
                     
                    if ($(this).hasClass('_add'))
                    {
                        $(this).closest("tr").removeClass("row_green");
                        $(this).closest("tr").removeClass("row_red");
                      
                        Save($("#url").data("adduser"), { "empid": d.Id, "type": $('#Select2EmployeeType').select2('data').id },d.Name);

                        $(this).closest("tr").addClass("row_green");
                        $(this).closest("tr").find('td:eq(4)').text("Yes");
                    }
                    if ($(this).hasClass('_remove'))
                    {
                        $(this).closest("tr").removeClass("row_green");
                        $(this).closest("tr").removeClass("row_red");

                        Save($("#url").data("removeuser"), { "empid": d.Id, "type": $('#Select2EmployeeType').select2('data').id }, d.Name);

                        $(this).closest("tr").addClass("row_red");
                        $(this).closest("tr").find('td:eq(4)').text("No");
                    }
                  

                }
            });



        };

        var Save = function (url,param,name) {

            $.ajax({
                url: url,
                data: JSON.stringify(param),
                type: 'post',
                cache: false,
                contentType: "application/json; charset=utf-8",
                beforeSend: function () {
                    $('#preloader').show();
                },
                success: function (data)
                {
                    $('#preloader').hide();
                    if (data.ErrorCode == 0)
                    {
                        c.MessageBoxErr("Error...", data.Message);
                        return;
                    }
                    var OkFunc = function () {
 
                    };
                    NotifySuccess(data.Message + '<br>Name: ' + name, data.Title);
                    // c.MessageBox(data.Title, data.Message, OkFunc);
                },
                error: function (xhr, desc, err) {
                    
                    var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
                    c.MessageBox("Error...", errMsg, null);
                }
            });

        };

        // -----------------------------------------------------------------------------------------------------------------------------------------------------------
        var TblDashboard;
        var TblDashboardId = '#TblDashboard';
        var TblDashboardDataRow;

        var calcHeightDashboard = function () {
            return $(window).height() * 60 / 100;
        };
        function ShowDashboardRowCallBack() {
            var rc = function (nRow, aData) {
                //var $nRow = $(nRow);
                //console.log('ShowDashboardRowCallBack');
                //if (aData.isExist == 1) {
                //    $('#chkselected', nRow).prop('checked', true);
                //    $nRow.addClass("row_green");
                //    $('#chkselected', nRow).removeClass("_notcheck");
                //    $('#chkselected', nRow).addClass("_check");
                //} else {
                //    $nRow.addClass("row_red");
                //    $('#chkselected', nRow).removeClass("_check");
                //    $('#chkselected', nRow).addClass("_notcheck");
                //}


                $('td:eq(4)', nRow).html("No");
                var $nRow = $(nRow); // cache the row wrapped up in jQuery
                $nRow.addClass("row_red");
                if (aData.isExist != "0") {
                    $('td:eq(4)', nRow).html("Yes");
                    $nRow.addClass("row_green");
                }
                $('td:eq(5)', nRow).html("<button class='btn btn-sm btn-success'>Add</button>");
                $('td:eq(6)', nRow).html("<button class='btn btn-sm btn-danger'>Remove</button>");
                 

            };
            return rc;
        }
        function ShowDashboard() {
            $('#preloader').show();
            var url = $('#url').data("dashboard");
            var param = {
                TypeId: $('#Select2EmployeeType').val()
            };

            var success = function (data, e) {
                $('#preloader').hide();
                BindDashboard(data.list);
            };
            var error = function (xhr, desc, err) {
                $('#preloader').hide();
                var errMsg = err + "<br>" + xhr.responseText;
                c.MessageBox("Error...", errMsg, null);
            };
            console.log(param);
           
            ajaxWrapper.Get(url, param, success, 'WrapperDashboard', 'Loading', error);

        }
        function BindDashboard(data) {
          
            // http://legacy.datatables.net/release-datatables/examples/basic_init/scroll_x.html
            TblDashboard = $(TblDashboardId).DataTable({
                cache: false,
                destroy: true,
                data: data,
                paging: true,
                ordering: false,
                searching: true,
                info: false,
                //scrollY: calcHeightDashboard(),
                //scrollX: "100%",
                //sScrollXInner: "200%",
                //processing: true,
                autoWidth: false,
                dom: '<"tbDashboard">Rlfrtip',
                scrollCollapse: false,
                pageLength: 80,
                lengthChange: false,
                columns: [

               //{ data: "", className: '', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" class="" name="chkselected" id="chkselected"/>' },
                    { data: "SNo", title: 'SNo', className: '', visible: true, searchable: false, width: "1%" },
                    {   data: "EmployeeID", title: 'Employee ID', className: '', visible: true, searchable: true, width: "2%" },
                    {   data: "Name", title: 'Employee Name', className: '', visible: true, searchable: true, width: "5%" },
                    { data: "DeptName", title: 'Department', className: '', visible: true, searchable: true, width: "2%" },
                    { data: "isExist", title: 'Has Access', className: "", width: "1%" },
                    { data: "Id", className: "_add", width: "1%" },
                    { data: "Id", className: "_remove", width: "1%" },
              
         

                ],
               // fnRowCallback: ShowDashboardRowCallBack()
                fnCreatedRow :  ShowDashboardRowCallBack()
            });

            var btns = '';
            var toolbar = btns.concat(
                 '<div style="float:left;">'
                , '<button type="button" class="btn-margin-right btn btn-sm btn-primary" Id="btnDNew"> <i class="glyphicon glyphicon-file"></i> New </button>'
                //, '<button type="button" class="btn-margin-right btn btn-sm btn-primary" Id="btnDEdit"> <i class="glyphicon glyphicon-edit"></i> Edit </button>'
            //    , '<button type="button" class="btn-margin-right btn btn-sm btn-primary" Id="btnDView"> <i class="glyphicon glyphicon-th-list"></i> View </button>'
                , '<button type="button" class="btn-margin-right btn btn-sm btn-primary" Id="btnDRefresh"> <i class="glyphicon glyphicon-refresh"></i> Refresh </button>'
                , '<button type="button" class="btn-margin-right btn btn-sm btn-primary" Id="btnDFilter"> <i class="glyphicon glyphicon-filter" ></i> Filter </button>'
                , '</div>');

           // $("div.tbDashboard").html(toolbar);

    

        }
       
        // -----------------------------------------------------------------------------------------------------------------------------------------------------------



        //------------------------------------------------------------------------------------------------------------------------------------------------------------------
        $(document).ready(function () {
            initSelect2();
            initClick();
            init();
 
        });

       
       


    };


    return {

        //main function to initiate the theme
        init: function () {
        
            handleJS();


        }
    };

}();