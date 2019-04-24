var c = new Common();

jQuery(document).ready(function () {
    ServiceCat.init();
});
var ServiceCat = function () {

    var handleScript = function () {
        console.log('handleScript');
        // -----------------------------------------Dashboard------------------------------------------------------------------------------------------------------------------

        var Load = function () {

            ajaxWrapper.Get($("#url").data("dashboard"), null, function (x, e) {
                BindDashboard(x);
            });
        };
        var TblDashboard;
        var TblDashboardId = '#DTDashboard';
        var TblDashboardDataRow;
        var ennDashboard = { Btn: 0, del: 1, ctr: 2, ID: 3, Name: 4, Edited: 5, Deleted: 6 };

        var Format24 = "HH:mm";
        var calcHeightDashboard = function () {
            return $(window).height() * 35 / 100;
        };

        function ShowDashboardRowCallDashboard() {
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
        function BindDashboard(data) {
            
            // http://legacy.datatables.net/release-datatables/examples/basic_init/scroll_x.html
            TblDashboard = $(TblDashboardId).DataTable({
                cache: false,
                destroy: true,
                data: data,
                paging: false,
                ordering: true,
                //searching: true,
                //info: false,
                scrollY: calcHeightDashboard(),
                scrollX: "810px",
                sScrollXInner: "810px",
                //processing: true,
                autoWidth: false,
                dom: '<"tbDashboard">Rlfrtip',
                scrollCollapse: false,
                pageLength: 75,
                //lengthChange: false,
                columns: [

                    /*
                      public int slno { get; set; }
       public string CategoryName { get; set; }
       public string CategoryId { get; set; }
       public string Name { get; set; }
       public string Code { get; set; }
       public string ItemId { get; set; }
       public string DeptName { get; set; }
       public string ServiceCatId { get; set; }
       */
                    { data: "slno", title: 'SLNo', className: '  ', visible: true, searchable: true, width: "1%" },
                    { data: "Name", title: 'Name', className: ' ', visible: true, searchable: true, width: "10%" },
                    { data: "Code", title: 'Code', className: ' ', visible: true, searchable: true, width: "5%" },
                    { data: "CategoryName", title: 'Category Name', className: ' ', visible: true, searchable: true, width: "5%" },
                    { data: "DeptName", title: 'Dept Name', className: ' ', visible: true, searchable: true, width: "5%" },

                    { data: "ServiceCatId", title: ' ', className: ' ', visible: false, searchable: true, width: "1%" },
                    { data: "CategoryId", title: ' ', className: ' ', visible: false, searchable: true, width: "1%" },
                    { data: "ItemId", title: ' ', className: ' ', visible: false, searchable: true, width: "1%" },

                ],
                fnRowCallback: ShowDashboardRowCallDashboard()
            });


            var btns = '';
            var toolbar = btns.concat(
                 '<div style="float:left;">'
                 , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnCheckAllFunctions"> <i class="glyphicon glyphicon-check"></i> All </button>'
                , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnUNCheckAllFunctions"> <i class="glyphicon glyphicon-unchecked"></i> All </button>'
                , '</div><br><br>');
            //$("div.tbDashboard").html(toolbar);

            $('#btnCheckAllFunctions').click(function () {
                $('#preloader').show();
                $.each(TblDashboard.rows().data(), function (i, row) {
                    TblDashboard.cell(i, 0).data('<input id="checkFunctionConfigRole" type="checkbox" checked="checked" >');
                });
                $('#preloader').hide();
            });
            $('#btnUNCheckAllFunctions').click(function () {
                $('#preloader').show();
                $.each(TblDashboard.rows().data(), function (i, row) {
                    TblDashboard.cell(i, 0).data('<input id="checkFunctionConfigRole" type="checkbox">');
                });
                $('#preloader').hide();

            });

            $(TblDashboardId + ' tbody').on('click', '#checkFunctionConfigRole', function (e) {
                var $cell = $(this).closest('td');
                var $row = $(this).closest('tr');
                var Tbl = TblDashboard;
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

        function ViewDashboard(data) {
            $('#preloader').show();
            console.log(data);


            //if (FetchFindingsResults.length == 0) {
            //    c.MessageBoxErr("Deleted...", "The selected record doesn't exist and already been deleted.", null);
            //    tblRequisitionList.row('tr.selected').remove().draw(false);
            //    return;
            //}

            //var data = result.list[0];
            //c.SetSelect2('#select2DoctorCode', data.ID, data.Name);
            c.SetValue('#idd', data.ServiceCatId);
            c.SetValue('#CategoryName', data.CategoryName);
            c.SetValue('#Code', data.Code);
            c.SetValue('#Name', data.Name);
            c.SetValue('#DeptName', data.DeptName);
     
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

        function initClickTblDashboardId() {
            $(document).on("click", TblDashboardId + " td", function (e) {
                e.preventDefault();

                if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
                    var tr = $(this).closest('tr');
                    tr.toggleClass('selected');
                    tblItemsListDataRow = TblDashboard.row($(this).parents('tr')).data();

                    Action = 0;
                    ViewDashboard(tblItemsListDataRow);
                    handleButtonEnable();

                }
            });
        }


        // -----------------------------------------------------------------------------------------------------------------------------------------------------------
        function handleButtonEnable() {
            if (Action == 1)//new
            {
                c.SetValue('#DeptName_new', '');
                c.Select2Clear('#CategoryName_new');
                c.Select2Clear('#ServiceCatId');

                c.ButtonDisable('#btnDelete', true);
                $('#showOnNew').show();
                $('#showOnView').hide();
                c.ButtonDisable('#btnSave', false);
            }
            else if (Action == 2)//update
            {
                c.ButtonDisable('#btnDelete', false);
            }
            else if (Action == 0)//view
            {
                $(".showOnView").attr("readonly", true);
                $('#showOnNew').hide();
                $('#showOnView').show();
                c.ButtonDisable('#btnSave', true);
                c.ButtonDisable('#btnDelete', false);
            }
            else {
                c.ButtonDisable('#btnDelete', true);
                c.ButtonDisable('#btnSave', true);

            }

        }

        function Validated()
        {
            var required = '';
            var ctr = 0;
 
            
            if (c.IsEmptySelect2('#CategoryName_new')) {
                 ctr++;
                required = required + '<br> ' + ctr + '. Select Service Category.';
            }

            if (c.IsEmptySelect2('#ServiceCatId') ) {
                ctr++;
                required = required + '<br> ' + ctr + '. Select Test Item.';
            }

            if (required.length > 0) {

                c.MessageBoxErr('Enter the following details...', required);

                //if (ctr == 1 && isDonatingFor && c.IsEmptySelect2('#select2DonatingFor')) {
                //    c.SetActiveTab('sectionB');
                //}
                //else if (ctr == 1 && c.IsEmptySelect2('#select2DonorStatus')) {
                //    c.SetActiveTab('sectionE');
                //}
                //else {
                //    c.SetActiveTab('sectionA');
                //}

                return false;
            }

            return true;
        }
        function initSelect2()
        {
             
            ajaxWrapper.Get($("#url").data("getservicecatlist"), null, function (x, e) {
                Sel2Client($("#CategoryName_new"), x, function (xx) {
                });
            });
            ajaxWrapper.Get($("#url").data("gettestlist"), null, function (x, e) {
                Sel2Client($("#ServiceCatId"), x, function (xx) {

                });
            });
            

            $('#ServiceCatId').on('change', function (xx) {
                if ($('#ServiceCatId').val() != '') {
                    ajaxWrapper.Get($("#url").data("getdeptbytestid"), { testid: $('#ServiceCatId').val() }, function (a, e) {
                        c.SetValue('#DeptName_new', a[0].name);
                    });
                } else {
                    c.SetValue('#DeptName_new','');
                }
            });


        }
        function initClick() {
            $('#BtnClose').click(function () {
                //ViewDashboard([]);
                //Load();
            });
            $('#btnNew').click(function () {
                Action = 1;
                ViewDashboard([]);
                handleButtonEnable();
            });
            $('#btnDelete').click(function () {
                var YesFunc = function () {
                    var entry;
                    entry = []
                    entry = {}

                    entry.Action = 3;
                     entry.Id = ($('#idd').val() == '' || $('#idd').val() == null ? '0' : $('#idd').val());

                    console.log(entry);

                    ajaxWrapper.Post($("#url").data("servicecategorysave"),entry, function (data, e) {
                        
                                if (data.ErrorCode == 0) {
                                    c.MessageBoxErr("Error!!", data.Message);
                                    return;
                                }
                                var OkFunc = function () {
                                    Action = 5;
                                    handleButtonEnable();
                                    ViewDashboard([]);
                                    Load();
                                };
                                c.MessageBox(data.Title, data.Message, OkFunc);
                    });

                


                };
                c.MessageBoxConfirm("Option - Delete", "Are you sure you want to delete this item?", YesFunc, null);

            });
            $('#btnSave').click(function () {

                var ret = Validated();
                if (!ret) return ret;

                var YesFunc = function () {
                    var entry;
                    entry = []
                    entry = {}

                    entry.Action = Action;
                    entry.ServiceCatId = ($('#CategoryName_new').val() == '' || $('#CategoryName_new').val() == null ? '0' : $('#CategoryName_new').val());
                    entry.ItemId = ($('#ServiceCatId').val() == '' || $('#ServiceCatId').val() == null ? '0' : $('#ServiceCatId').val());
                    
                    console.log(entry);

                    ajaxWrapper.Post($("#url").data("servicecategorysave"), entry, function (data, e) {

                        if (data.ErrorCode == 0) {
                            c.MessageBoxErr("Error!!", data.Message);
                            return;
                        }
                        var OkFunc = function () {
                            Action = 5;
                            handleButtonEnable();
                            ViewDashboard([]);
                            Load();
                        };
                        c.MessageBox(data.Title, data.Message, OkFunc);
                    });

                };
                c.MessageBoxConfirm("Option - Save", "Are you sure you want to save this item?", YesFunc, null);

            });

        }
        jQuery(document).ready(function () {
            Load();
            initClick();
            initClickTblDashboardId();
            initSelect2();

        });





    }

    return {
        //main function to initiate the module
        init: function () {
            handleScript();
        }
    };

}();
