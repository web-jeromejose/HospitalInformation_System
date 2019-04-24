var c = new Common();
var Action = 0;
jQuery(document).ready(function () {
    DosageForm.init();
});
var DosageForm = function () {

    var handleScript = function () {
        console.log('handleScript');
        // -----------------------------------------Dashboard------------------------------------------------------------------------------------------------------------------

        var Load = function () {
            
            ajaxWrapper.Get($("#url").data("dashboard"), null, function (x, e) {
                BindDashboardDosageForm(x);
            });
        };
        var TblDashboardDosageForm;
        var TblDashboardDosageFormId = '#DTviewDosageForm';
        var TblDashboardDosageFormDataRow;
        var ennDashboardDosageForm = { Btn: 0, del: 1, ctr: 2, ID: 3, Name: 4, Edited: 5, Deleted: 6 };

        var Format24 = "HH:mm";
        var calcHeightDashboardDosageForm = function () {
            return $(window).height() * 35 / 100;
        };

        function ShowDashboardRowCallDashboardDosageForm() {
            var rc = function (nRow, aData) {
                var $nRow = $(nRow);
                //if (aData["HasAccess"] === 1) {
                //    //$('td:eq(3)', nRow).html("Yes");
                //    $nRow.addClass("row_green");
                //    $('#checkFunctionConfigRole', nRow).prop('checked', true);
                //}
            };
            return rc;
        }
        function BindDashboardDosageForm(data) {
            console.log(data);
            // http://legacy.datatables.net/release-datatables/examples/basic_init/scroll_x.html
            TblDashboardDosageForm = $(TblDashboardDosageFormId).DataTable({
                cache: false,
                destroy: true,
                data: data,
                paging: false,
                ordering: true,
                //searching: true,
                //info: false,
                scrollY: calcHeightDashboardDosageForm(),
                scrollX: "610px",
                sScrollXInner: "610px",
                //processing: true,
                autoWidth: false,
                dom: '<"tbDashboardDosageForm">Rlfrtip',
                scrollCollapse: false,
                pageLength: 75,
                //lengthChange: false,
                columns: [
 
                    { data: "slno", title: 'SLNo', className: '  ', visible: true, searchable: true, width: "1%" },
                    { data: "Name", title: 'Name', className: ' ', visible: true, searchable: true, width: "10%" },
                    { data: "Description", title: 'Details', className: ' ', visible: true, searchable: true, width: "10%" },
                    { data: "Id", title: ' ', className: ' ', visible: false, searchable: true, width: "1%" },
  
                ],
                fnRowCallback: ShowDashboardRowCallDashboardDosageForm()
            });


            var btns = '';
            var toolbar = btns.concat(
                 '<div style="float:left;">'
                 , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnCheckAllFunctions"> <i class="glyphicon glyphicon-check"></i> All </button>'
                , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnUNCheckAllFunctions"> <i class="glyphicon glyphicon-unchecked"></i> All </button>'
                , '</div><br><br>');
            //$("div.tbDashboardDosageForm").html(toolbar);

            $('#btnCheckAllFunctions').click(function () {
                $('#preloader').show();
                $.each(TblDashboardDosageForm.rows().data(), function (i, row) {
                    TblDashboardDosageForm.cell(i, 0).data('<input id="checkFunctionConfigRole" type="checkbox" checked="checked" >');
                });
                $('#preloader').hide();
            });
            $('#btnUNCheckAllFunctions').click(function () {
                $('#preloader').show();
                $.each(TblDashboardDosageForm.rows().data(), function (i, row) {
                    TblDashboardDosageForm.cell(i, 0).data('<input id="checkFunctionConfigRole" type="checkbox">');
                });
                $('#preloader').hide();

            });

            $(TblDashboardDosageFormId + ' tbody').on('click', '#checkFunctionConfigRole', function (e) {
                var $cell = $(this).closest('td');
                var $row = $(this).closest('tr');
                var Tbl = TblDashboardDosageForm;
                var data = Tbl.row($row).data();
                var rowId = data[0];
                var col = Tbl.cell($(this).closest('td')).index();
                if (this.checked) {
                    $row.addClass("row_green");
                } else {
                    $row.removeClass("row_green");
                }
                e.stopPropagation();
            });
        }

        function ViewDashboardDosageForm(data) {
                    $('#preloader').show();
                    console.log(data);
                  
              
                    //if (FetchFindingsResults.length == 0) {
                    //    c.MessageBoxErr("Deleted...", "The selected record doesn't exist and already been deleted.", null);
                    //    tblRequisitionList.row('tr.selected').remove().draw(false);
                    //    return;
                    //}

                    //var data = result.list[0];
                    //c.SetSelect2('#select2DoctorCode', data.ID, data.Name);
                    c.SetValue('#DosageFormId', data.Id);
                    c.SetValue('#DosageFormName', data.Name);
                    c.SetValue('#DosageFormDesc', data.Description);
                    //c.SetValue('#txtName', data.BedName);
                    //c.SetValue('#txtExtention', data.ExtensionNo);
                    //c.SetSelect2('#Select2Bedtype', data.BedTypeID, data.BedType);
                    //c.SetSelect2('#Select2Station', data.StationId, data.Stationname);
                    //c.SetSelect2('#Select2Room', data.RoomId, data.RoomName);
                    ////c.SetSelect2('#Select2Station', data.StationId, data.Stationname);
                    //c.SetSelect2('#Select2Status', data.StatusId, data.BedStatusName);
                    //c.SetSelect2('#Select2Department', data.DepartmentID, data.DepartmentName);
                    //  c.SetValue('#Select2Type', data.Type);
                    //c.SetValue('#txtbedtypeid', data.BedTypeId);
                    //c.SetValue('#txttimetoday', data.TimeToday);
                    c.ModalShow('#modalViewDetails', true);
                    $('#preloader').hide();
        }

        function initClickTblDashboardDosageFormId()
        {
            $(document).on("click", TblDashboardDosageFormId + " td", function (e) {
                e.preventDefault();

                if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
                    var tr = $(this).closest('tr');
                    tr.toggleClass('selected');
                    tblItemsListDataRow = TblDashboardDosageForm.row($(this).parents('tr')).data();
                   
                    Action = 2;
                    ViewDashboardDosageForm(tblItemsListDataRow);
                    handleButtonEnable();

                }
                });
            }


        // -----------------------------------------------------------------------------------------------------------------------------------------------------------
        function handleButtonEnable()
        {
            if (Action == 1)//new
            {
                c.ButtonDisable('#btnDelete', true);
            }
            else if (Action == 2)//update
            {
               c.ButtonDisable('#btnDelete', false);
           }
           
        }

        function initClick()
        {
            
            
            $('#BtnClose').click(function () {
                ViewDashboardDosageForm([]);
                Load();
            });

            $('#btnNew').click(function () {
                Action = 1;
                ViewDashboardDosageForm([]);
                handleButtonEnable();
            });


            $('#btnDelete').click(function () {
                var YesFunc = function () {
                    var entry;
                    entry = []
                    entry = {}

                    entry.Action = 3;
                    entry.Name = ($('#DosageFormName').val() == '' || $('#DosageFormName').val() == null ? '0' : $('#DosageFormName').val());
                    entry.Description = ($('#DosageFormDesc').val() == '' || $('#DosageFormDesc').val() == null ? '0' : $('#DosageFormDesc').val());
                    entry.Id = ($('#DosageFormId').val() == '' || $('#DosageFormId').val() == null ? '0' : $('#DosageFormId').val() );
                   
                    console.log(entry);


                    $.ajax({
                        url: $('#url').data("dosageformsave"),
                        data: JSON.stringify(entry),
                        type: 'post',
                        cache: false,
                        contentType: "application/json; charset=utf-8",
                        beforeSend: function () {

                            c.ButtonDisable('#btnSave', true);

                        },
                        success: function (data) {
                            console.log('data');
                            console.log(data);
                            c.ButtonDisable('#btnSave', false);


                            if (data.ErrorCode == 0) {
                                c.MessageBoxErr("Error!!", data.Message);
                                return;
                            }

                            var OkFunc = function () {
                              
                                ViewDashboardDosageForm([]);
                                Load();
                            };

                            c.MessageBox(data.Title, data.Message, OkFunc);
                        },
                        error: function (xhr, desc, err) {
                            c.ButtonDisable('#btnSave', false);
                            var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
                            c.MessageBox("Error...", errMsg, null);
                        }
                    });


                };
                c.MessageBoxConfirm("Option - Delete", "Are you sure you want to delete this item?", YesFunc, null);

            });
            $('#btnSave').click(function () {
                var YesFunc = function () {
                    var entry;
                    entry = []
                    entry = {}

                    entry.Action = Action;
                    entry.Name = ($('#DosageFormName').val() == '' || $('#DosageFormName').val() == null ? '0' : $('#DosageFormName').val());
                    entry.Description = ($('#DosageFormDesc').val() == '' || $('#DosageFormDesc').val() == null ? '0' : $('#DosageFormDesc').val());
                    entry.Id = ($('#DosageFormId').val() == '' || $('#DosageFormId').val() == null ? '0' : $('#DosageFormId').val());

                    console.log(entry);

                    $.ajax({
                        url: $('#url').data("dosageformsave"),
                        data: JSON.stringify(entry),
                        type: 'post',
                        cache: false,
                        contentType: "application/json; charset=utf-8",
                        beforeSend: function () {

                            c.ButtonDisable('#btnSave', true);

                        },
                        success: function (data) {
                            console.log('data');
                            console.log(data);
                            c.ButtonDisable('#btnSave', false);


                            if (data.ErrorCode == 0) {
                                c.MessageBoxErr("Error!!", data.Message);
                                return;
                            }

                            var OkFunc = function () {
                                if (Action == 1)
                                {
                                     
                                }
                                ViewDashboardDosageForm([]);
                                Load();
                            };

                            c.MessageBox(data.Title, data.Message, OkFunc);
                        },
                        error: function (xhr, desc, err) {
                            c.ButtonDisable('#btnSave', false);
                            var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
                            c.MessageBox("Error...", errMsg, null);
                        }
                    });


                };
                c.MessageBoxConfirm("Option - Save", "Are you sure you want to save this item?", YesFunc, null);

            });

        }
        jQuery(document).ready(function () {
            Load();
            initClick();
            initClickTblDashboardDosageFormId();

        });


    }

    return {
        //main function to initiate the module
        init: function () {
            handleScript();
        }
    };

}();