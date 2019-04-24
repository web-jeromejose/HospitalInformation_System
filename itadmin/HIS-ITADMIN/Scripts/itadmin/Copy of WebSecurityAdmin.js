var c = new Common();
var Action = -1;

$(document).ready(function () {
    // SetupDataTables();
   // SetupSelectedPrice();
   // InitButton();
    //InitDateTimePicker();
    // InitSelect2();
    stationModuleRoleConfig.init();

     InitClickTabs();
    InitDataTables();
    InitClickDataTables();


});

///***********************************USER AND ROLE TAB******************************************************************

var tblgridlistUsers;
var tblgridlistUsersId = '#gridlistUsers'
var tblgridlistUsersDataRow;


var tblgridlistRoles;
var tblgridlistRolesId = '#gridlistRoles'
var tblgridlistRolesDataRow;


var tblgridlistAssignRoles;
var tblgridlistAssignRolesId = '#gridlistAssignRoles'
var tblgridlistAssignRolesDataRow;


var stationID = 0;

function InitDataTables() {
    //BindSequence([]);
    //UsersDataTableListItem([]);
    ShowUsersDataTable();
}

function InitClickTabs() {
    $('#rolemoduleconfigtabID').click(function () {
        $('#preloader').show();
        RoleModuleConfig.init();
        $('#preloader').hide();
    });
    $('#stationmoduleroletabID').click(function () {
        $('#preloader').show();
        stationModuleRoleConfig.init();
        $('#preloader').hide();
    });
}

function InitSelect2() {
     
 

    ajaxWrapper.Get($("#url").data("getroles"), null, function (xx, e) {
        Sel2Client($("#txtrole"), xx, function (x) {
 
            tblgridlistAssignRolesDataTable([]);
            $('#BtnAssignRoleSave').hide();
        })
    });


    ajaxWrapper.Get($("#url").data("getstation"), null, function (xx, e) {
        Sel2Client($("#txtstation"), xx, function (x) {
          
            tblgridlistAssignRolesDataTable([]);
            $('#BtnAssignRoleSave').hide();

            ajaxWrapper.Get($("#url").data("getrolebystationid"), { id: x.id != '' ? x.id : 0 }, function (xx, e) {
                Sel2Client($("#txtrole"), xx, function (x) {

                })
            });
        })
    });

    ajaxWrapper.Get($("#url").data("getdept"), null, function (xx, e) {
        Sel2Client($("#txtdepartment"), xx, function (x) {
            tblgridlistAssignRolesDataTable([]);
            $('#BtnAssignRoleSave').hide();
        })
    });

}

function InitClickDataTables()
{
    $('#BtnAssignRoleSave').hide();
    $(document).on("click", "#iChkAllTest", function () {
        $('#preloader').show();
        if ($('#iChkAllTest').is(':checked')) {
            $.each(tblgridlistAssignRoles.rows().data(), function (i, row) {
                tblgridlistAssignRoles.cell(i, 0).data('<input id="chkselected" type="checkbox" checked="checked" >');
            });
        }
        else {
            $.each(tblgridlistAssignRoles.rows().data(), function (i, row) {
                tblgridlistAssignRoles.cell(i, 0).data('<input id="chkselected" type="checkbox">');
            });
           
        }
        $('#preloader').hide();
    });


    $(document).on("click", "#gridlistUsers td", function () {
        var d = tblgridlistUsers.row($(this).parents('tr')).data();
        $('#txtlistRoleByUserIdName').val(d.Name);
        $('#txtlistRoleByUserIdEmpId').val(d.EmpId);
        GetRoleByUserIDDataTable(d.UserId);
        $("#modal-listRoleByUserId").modal({ "keyboard": true });
 
    });

    $(document).on("click", "#gridlistRoles td", function () {
        var d = tblgridlistRoles.row($(this).parents('tr')).data();
    
        $("#modal-RolesupdateDataTable").modal({ "keyboard": true });
        
        $('#txtlistDTRolename').val(d.Name);
        $('#txtlistDTRoleID').val(d.RoleId);
        $('#txtlistDTRoleDesc').val(d.Description);
    });


    $('#BtnSearchAssignRole').click(function () {
        AssignRolesSearch();
       
    });

    $('#BtnAssignRoleSave').click(function () {
        var YesFunc = function () {
            Action = 1;
            AssignRoleSaveSave();
            
        };
        c.MessageBoxConfirm("Save User/s?", "Are you sure you want to save the Entry?", YesFunc, null);

    });


}

function AssignRoleSaveSave() {

  
    var entry;
    entry = []
    entry = {}
    entry.Action = 1;
    entry.stationid = $('#txtstation').val() != '' ? $('#txtstation').val() : 0;
    entry.deptid = $('#txtdepartment').val() != '' ? $('#txtdepartment').val() : 0;
    entry.roleid = $('#txtrole').val() != '' ? $('#txtrole').val() : 0;
 
    entry.AssignRoleDetailsSave = [];
    var rowcollection = tblgridlistAssignRoles.$("#chkselected:checked", { "page": "all" });
    rowcollection.each(function (index, elem) {
        var tr = $(elem).closest('tr');
        var row = tblgridlistAssignRoles.row(tr);
        var rowdata = row.data();
       
        entry.AssignRoleDetailsSave.push({
            userId: rowdata.ID,
            employeeId: rowdata.EmployeeId,
        });
    });
 
    $.ajax({
        url: $('#url').data("updateassignrole"),
        data: JSON.stringify(entry),
        type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {

            c.ButtonDisable('#BtnAssignRoleSave', true);
            c.ButtonDisable('#BtnSearchAssignRole', true);
        },
        success: function (data) {
            c.ButtonDisable('#BtnSearchAssignRole', false);
            c.ButtonDisable('#BtnAssignRoleSave', false);

            if (data.ErrorCode == 0) {
                c.MessageBoxErr("Error...", data.Message);
                return;
            }

            var OkFunc = function () {

                AssignRolesSearch();
                Action = 0;
              
            };

            c.MessageBox(data.Title, data.Message, OkFunc);
        },
        error: function (xhr, desc, err) {
            c.ButtonDisable('#BtnAssignRoleSave', false);
            var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
            c.MessageBox("Error...", errMsg, null);
        }
    });

 
}

function divUsernRolesTabRolesclick()
{
    ShowRolesDataTable();
}

function divAssignTabRolesclick()
{
    InitSelect2();
}

function updateRoleDetails(deleted)
{
    var entry = {};
    entry.Name = $('#txtlistDTRolename').val();
    entry.RoleId = $('#txtlistDTRoleID').val();
    entry.Description = $('#txtlistDTRoleDesc').val();
    entry.Deleted = deleted;
 
    
                $.ajax({
                    url: $('#url').data("updaterolesave"),
                    data: JSON.stringify(entry),
                    type: 'post',
                    cache: false,
                    contentType: "application/json; charset=utf-8",
                    beforeSend: function () {
                    },
                    success: function (data) {

                        console.log(data);

                        if (data.ErrorCode == 0) {
                            c.MessageBoxErr("Error...", data.Message);
                            return;
                        }

                        var OkFunc = function () {
                            ShowRolesDataTable();
                        };
                        c.MessageBox(data.Title, data.Message, OkFunc);
           

                    },
                    error: function (xhr, desc, err) {
                        c.ButtonDisable('#BtnAssignRoleSave', false);
                        var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
                        c.MessageBox("Error...", errMsg, null);
                    }
                });
    

}

function ShowUsersDataTable() {
    var Url = $("#url").data("usersdatatable");
    var param = {};
    $('#preloader').show();

    $.ajax({
        url: Url,
        data: param,
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false,
        beforeSend: function () {},
        success: function (data) {
            $('#preloader').hide();
            UsersDataTableListItem(data.list);
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}

function UsersDataTableListItem(data) {
     
    tblgridlistUsers = $(tblgridlistUsersId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: true,
        info: false,
        scrollY: 400,
        //scrollX: true,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        columns: UsersDataTableListItemColumns(),
        fnRowCallback: ShowRowCallBack()
    });

}

function ShowRowCallBack()
{
    var rc = function (nRow, aData) {
       // var value = aData['selected'];
        var $nRow = $(nRow);
        //if (aData.Selected.length != 1) {
        //    $('#chkselected', nRow).prop('checked', aData.Selected === 1);
        //}
    };
    return rc;
}

function UsersDataTableListItemColumns() {
    var cols = [
      { targets: [1], data: "Name", className: '', visible: true, searchable: true  },
      { targets: [2], data: "UserId", className: ' ', visible: true, searchable: true, width: "6%" },
      { targets: [3], data: "EmpId", className: '', visible: true, width: "6%" },
      { targets: [4], data: "Status", className: '', visible: true }
    ];
    return cols;
}

function GetRoleByUserIDDataTable(userid) {
    var Url = $("#url").data("getrolebyuseridtable");
    var param = {
        UserId: userid
    };
    $('#preloader').show();

    $.ajax({
        url: Url,
        data: param,
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false,
        beforeSend: function () { },
        success: function (data) {
            $('#preloader').hide();
 
         $('#divUserRoleListtable').DataTable({
                cache: false,
                destroy: true,
                data: data.list,
                paging: true,
                ordering: false,
                searching: false,
                info: false,
                scrollY: 400,
                //scrollX: true,
                processing: false,
                autoWidth: false,
                dom: 'Rlfrtip',
                scrollCollapse: false,
                pageLength: 150,
                lengthChange: false,
                columns: [
                      { targets: [1], data: "Name", className: '', visible: true, searchable: true },
                ]
                
            });


        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}

function ShowRolesDataTable() {
    var Url = $("#url").data("rolesdatatable");
    var param = {};
    $('#preloader').show();

    $.ajax({
        url: Url,
        data: param,
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false,
        beforeSend: function () {},
        success: function (data) {
            $('#preloader').hide();

            tblgridlistRoles = $(tblgridlistRolesId).DataTable({
                cache: false,
                destroy: true,
                data: data.list,
                paging: true,
                ordering: false,
                searching: true,
                info: false,
                scrollY: 400,
                //scrollX: true,
                processing: false,
                autoWidth: false,
                dom: 'Rlfrtip',
                scrollCollapse: false,
                pageLength: 150,
                lengthChange: false,
                columns: [
                      { targets: [0], data: "RoleId", className: '', visible: true, searchable: true },
                      { targets: [1], data: "Name", className: '', visible: true, searchable: true },
                      { targets: [2], data: "Description", className: '', visible: true, searchable: true },
                      { targets: [3], data: "Startdatetime", className: '', visible: true, searchable: true },
                ]

            });
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}

function AssignRolesSearch()
{
    var entry = {};
    entry.station_id =  $('#txtstation').val() != '' ? $('#txtstation').val() : 0;
    entry.dept_id =  $('#txtdepartment').val() != '' ? $('#txtdepartment').val() : 0;
    entry.role_id = $('#txtrole').val() != '' ? $('#txtrole').val() : 0;

    console.log(entry);
    if (entry.role_id == 0)
    {
        c.MessageBoxErr("Error...", 'Please select a Role');
        return false;
    }

    var Url = $("#url").data("getassignroledashboard");

        $('#preloader').show();

        $.ajax({
            url: Url,
            data: entry,
            type: 'get',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            cache: false,
            beforeSend: function () {
            },
            success: function (data) {

                        tblgridlistAssignRolesDataTable(data.list);
                        $('#BtnAssignRoleSave').show();
                        $('#preloader').hide();
            },
            error: function (xhr, desc, err) {
                $('#preloader').hide();
                var errMsg = err + "<br>" + desc;
                c.MessageBoxErr(errMsg);
            }
        });

   

}

function tblgridlistAssignRolesDataTable(data)
{
    tblgridlistAssignRoles = $(tblgridlistAssignRolesId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: true,
        info: false,
        scrollY: 400,
        //scrollX: true,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        columns: [
              { targets: [0], data: "", className: '', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" name="chkselected" id="chkselected"/>' },
              { targets: [1], data: "EmployeeId", className: '', visible: true, searchable: true, width: "40%" },
              { targets: [2], data: "Name", className: '', visible: true, searchable: true, width: "40%" },
              { targets: [3], data: "Dept", className: '', visible: true },
        ],
        fnRowCallback: ShowRowCallBackAssignRole()
    });

}

function ShowRowCallBackAssignRole() {
    var rc = function (nRow, aData) {
       
            var value = aData['Selected'];
        var $nRow = $(nRow);
       
         if (aData.Selected  == 1) {
             $('#chkselected', nRow).prop('checked', true);
         }
        

    };
    return rc;

}


///***********************************ROLE MODULE CONFIG TAB******************************************************************
var RoleModuleConfig = function () {
    var handleRoleModuleConfig = function () {
        console.log('handleRoleModuleConfig');

        //************************************VARIABLE
        var oTable;
        var featurelistTable;
        var table = $('#tblRoleModuleConfigModuleList');
        var roleID = 0;
        var stationIds = [];
        var c = new Common();

        //************************************FUNCTIONS
        function GetModuleByRoleDT(data) {

            //tblItemsList = $(tblItemsListId).DataTable({
            //    cache: false,
            //    destroy: true,
            //    data: data,
            //    paging: false,
            //    ordering: false,
            //    searching: true,
            //    info: false,
            //    scrollY: 400,
            //    //scrollX: true,
            //    processing: false,
            //    autoWidth: false,
            //    dom: 'Rlfrtip',
            //    scrollCollapse: false,
            //    pageLength: 150,
            //    lengthChange: false,
            //    columns: ShowListitemsColumns(),
            //    fnRowCallback: ShowRowCallBack()
            //});

            oTable = table.dataTable({

                // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
                // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js). 
                // So when dropdowns used the scrollable div should be removed. 
               // "dom": "<'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
                data: data,
                destroy: true,
                cache: false,
                searching: true,
                pageLength: 150,
                paging: false,
                columns: [
                      { targets: [1], data: "ModuleName", className: '', visible: true, searchable: true, width: "80%" },
                      { targets: [2], data: "Module_Id", className: '_remove ', visible: true, searchable: false, width: "20%" },
                ]
                ,
                fnCreatedRow: function (nRow, aData, iDataIndex) {
                    $('td:eq(1)', nRow).html("<button class='btn btn-danger btn-sm'><span class='glyphicon glyphicon-remove'></span>  </button>");
                },
                 
            });
   
 
        }
        function ajaxGetModuleByRoleId(roleId)
        {
            var param = { roleId: roleId }
            
            $.ajax({
                url: $("#url").data("getmodulebyrole"),
                data: param,
                type: 'get',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                cache: false,
                beforeSend: function () {
                },
                success: function (data) {
                    $('#preloader').hide();
                   
                      GetModuleByRoleDT(data.list);
                    
                     
                },
                error: function (xhr, desc, err) {
                    $('#preloader').hide();
                    var errMsg = err + "<br>" + desc;
                    c.MessageBoxErr(errMsg);
                }
            });

           

        }

        function DTfeaturelist(x)
        {
            featurelistTable = $("#featurelistTable").DataTable({
                destroy: true,
                paging: false,
                searching: true,
                ordering: true,
                info: false,
                data: x,
                bAutoWidth: false,
                columns: [
                     { data: "FeatureID" },
                     { data: "ParentName" },
                     { data: "FeatureName" },
                     { data: "HasAccess" },
                     { data: "FeatureID", className: "_add" },
                     { data: "FeatureID", className: "_remove" },
                     { data: "FeatureID", className: "_functions" }

                ],
                fnCreatedRow: function (nRow, aData, iDataIndex) {
                    $('td:eq(3)', nRow).html("No");
                    var $nRow = $(nRow); // cache the row wrapped up in jQuery
                    $nRow.addClass("row_red");
                    if (aData["HasAccess"] == "1") {
                        $('td:eq(3)', nRow).html("Yes");
                        $nRow.addClass("row_green");
                    }
                    $('td:eq(4)', nRow).html("<button class='btn btn-sm btn-success'> <span class='glyphicon glyphicon-plus'></span></button>");
                    $('td:eq(5)', nRow).html("<button class='btn btn-sm btn-danger'><span class='glyphicon glyphicon-remove'></span></button>");
                    $('td:eq(6)', nRow).html("<button class='btn btn-sm btn-info'><span class='glyphicon glyphicon-info-sign'></span> </button>");
                }
            });
        }
        function LoadFeatureByRoleModule(RoleId,ModuleId,StationId) {
            ajaxWrapper.Get($("#url").data("getfeaturebyrolemodule"), { RoleId: RoleId, ModuleId: ModuleId, StationId: StationId }, function (x, e) {
                DTfeaturelist(x.list);
            });
        }
        function AddModule()
        {
            var entry = [];
             entry = {};

            entry.RoleId = $("#txtRoleModuleConfigRole").val();
            entry.ModuleId  = $("#txtRoleModuleConfigModule").val() ;
            entry.stationIds = [];
            entry.stationIds = stationIds;
            console.log(entry);

            $.ajax({
                url: $('#url').data("addmodulebyroleid"),
                data: JSON.stringify(entry),
                type: 'post',
                cache: false,
                contentType: "application/json; charset=utf-8",
                beforeSend: function () {

                    c.ButtonDisable('#btnSave', true);
                    c.ButtonDisable('#btnModify', true);
                },
                success: function (data) {
                    c.ButtonDisable('#btnModify', false);
                    c.ButtonDisable('#btnSave', false);

                    if (data.ErrorCode == 0) {
                        c.MessageBoxErr("Error...", data.Message);
                        return;
                    }

                    var OkFunc = function () {
                        ajaxGetModuleByRoleId(roleID);
                        DTfeaturelist([]);
                    };
                   // NotifySuccess(x, "Module");
                   c.MessageBox(data.Title, data.Message, OkFunc);
                },
                error: function (xhr, desc, err) {
                    c.ButtonDisable('#btnSave', false);
                    var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
                    c.MessageBox("Error...", errMsg, null);
                }
            });
 
        }
        function RemoveModule(nRow) {
            var oTableData = oTable.fnGetData(nRow);
            var entry = [];
            entry = {};
            entry.RoleId = roleID;
            entry.ModuleId = oTableData.Module_Id;
            entry.stationId = oTableData.Station_Id;
   
            console.log(entry);

            $.ajax({
                url: $('#url').data("removemodulebyrolestation"),
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
                        ajaxGetModuleByRoleId(roleID);
                        DTfeaturelist([]);
                    };
                    // NotifySuccess(x, "Module");
                    c.MessageBox(data.Title, data.Message, OkFunc);
                },
                error: function (xhr, desc, err) {
                    c.ButtonDisable('#btnSave', false);
                    var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
                    c.MessageBox("Error...", errMsg, null);
                }
            });


        }

        function LoadUserFunctions(d) {

            ajaxWrapper.Get($("#url").data("getusrfuncfeat"), { "RoleId": d.RoleID, "ModuleId": d.ModuleID, "StationId": d.StationID, "FeatId": d.FeatureID }, function (x, e) {
                tblfunc = $("#tblfeaturefunc").DataTable({
                    destroy: true,
                    paging: false,
                    searching: true,
                    ordering: true,
                    info: false,
                    data: x,
                    bAutoWidth: false,
                    columns: [
                         { data: "FunctionID", className: "_add", visible: true, searchable: false },
                         { data: "FunctionID", className: "_remove", visible: true, searchable: false },
                         { data: "FunctName", className: " ", visible: true, searchable: true },
                         { data: "Feature_Id", visible: false, searchable: false },
                         { data: "Role_Id", visible: false, searchable: false },
                         { data: "Module_Id", visible: false, searchable: false },
                         { data: "Station_Id", visible: false, searchable: false },
                         { data: "FunctionID", visible: false, searchable: false },
                    ],
                    fnCreatedRow: function (nRow, aData, iDataIndex) {
                        var $nRow = $(nRow); // cache the row wrapped up in jQuery
                        $nRow.addClass("row_red");
 
                        if (aData["HasAccess"] == "1") {
                            $nRow.addClass("row_green");
                        }
                        $('td:eq(0)', nRow).html("<button class='btn btn-sm btn-success'> <span class='glyphicon glyphicon-plus'></span> </button>");
                        $('td:eq(1)', nRow).html("<button class='btn btn-sm btn-danger'> <span class='glyphicon glyphicon-remove'> </button>");
                    }
                });
            });
        }

        function initOnclickRoleModuleConfig()
        {

            $('#btnRoleModuleConfigAddModule').click(function (e) {
                e.preventDefault();
                var OkFunc = function () {
                    AddModule();
                };        
                c.MessageBoxConfirm('Information', 'Are you sure you want to add this station/s to that module? ', OkFunc);

               

            });


            table.on('click', '._remove', function (e) {
                e.preventDefault();
               
                var nRow = $(this).parents('tr')[0];
              
                var OkFunc = function () {
                    RemoveModule(nRow);
                };
                c.MessageBoxConfirm('Information', 'Are you sure you want to remove this module? ', OkFunc);

            });

            $(document).on("click", "#tblRoleModuleConfigModuleList td ", function () {
                    var nRow = $(this).parents('tr')[0];
                    var oTableData = oTable.fnGetData(nRow);
                  
                 
                    LoadFeatureByRoleModule(roleID, oTableData.Module_Id, oTableData.Station_Id);
            });

            $(document).on("click", "#featurelistTable td", function () {
                if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {

                    var d = featurelistTable.row($(this).parents('tr')).data();

                    if ($(this).hasClass('_add')) {
                        $(this).closest("tr").removeClass("row_green");
                        $(this).closest("tr").removeClass("row_red");
 
                        ajaxWrapper.Post($("#url").data("updateaccessfeaturelist"), { "RoleId": d.RoleID, "ModuleId": d.ModuleID, "StationId": d.StationID, "FeatId": d.FeatureID, "Actionres": 1 }, function (x, e) {
                            NotifySuccess(x, "Feature Updated.");
                        });
                        $(this).closest("tr").addClass("row_green");
                        $(this).closest("tr").find('td:eq(3)').text("Yes");
                    }
                    if ($(this).hasClass('_remove')) {
                        $(this).closest("tr").removeClass("row_green");
                        $(this).closest("tr").removeClass("row_red");
 
                        ajaxWrapper.Post($("#url").data("updateaccessfeaturelist"), { "RoleId": d.RoleID, "ModuleId": d.ModuleID, "StationId": d.StationID, "FeatId": d.FeatureID, "Actionres": 2 }, function (x, e) {
                            NotifySuccess(x, "Feature Updated.");
                        });
                        $(this).closest("tr").addClass("row_red");
                        $(this).closest("tr").find('td:eq(3)').text("No");
                    }
                    if ($(this).hasClass('_functions')) {
                 
                        LoadUserFunctions(d);
                        $("#modal-func").modal({ "keyboard": true });
                         
                    }

                }
            });

            $(document).on("click", "#tblfeaturefunc td", function () {
                if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {

                    var d = tblfunc.row($(this).parents('tr')).data();

                    if ($(this).hasClass('_add')) {
                        $(this).closest("tr").removeClass("row_green");
                        $(this).closest("tr").removeClass("row_red");
                        console.log(d);

                        ajaxWrapper.Post($("#url").data("updatefunctionfeature"), { "RoleId": d.Role_Id, "FunctionId": d.FunctionID, "StationId": d.Station_Id, "FeatId": d.Feature_Id, "Actionres": 1 }, function (x, e) {
                            NotifySuccess(x, "Function Updated.");
                        });

                        $(this).closest("tr").addClass("row_green");
                        $(this).closest("tr").find('td:eq(3)').text("Yes");
                    }
                    if ($(this).hasClass('_remove')) {
                        $(this).closest("tr").removeClass("row_green");
                        $(this).closest("tr").removeClass("row_red");

                        ajaxWrapper.Post($("#url").data("updatefunctionfeature"), { "RoleId": d.Role_Id, "FunctionId": d.FunctionID, "StationId": d.Station_Id, "FeatId": d.Feature_Id, "Actionres": 2 }, function (x, e) {
                            NotifySuccess(x, "Function Updated.");
                        });
                        $(this).closest("tr").addClass("row_red");
                        $(this).closest("tr").find('td:eq(3)').text("No");
                    }
                  

                }
            });



        }

        function initSelect2RoleModuleConfig()
        {
            //***********************************SELECT2
         
            ajaxWrapper.Get($("#url").data("getroles"), null, function (x, e) {
                Sel2Client($("#txtRoleModuleConfigRole"), x, function (dd) {
                    console.log(dd);
                    roleID = dd.id;
                    DTfeaturelist([]);
                    ajaxGetModuleByRoleId(dd.id);
                });
            });

            ajaxWrapper.Get($("#url").data("getmodule"), null, function (x, e) {
                Sel2Client($("#txtRoleModuleConfigModule"), x, function () {
 
                    c.ButtonDisable('#btnRoleModuleConfigAddModule', false);
                });
            });

            ajaxWrapper.Get($("#url").data("getstation"), null, function (x, e) {
                Sel2ClientMultiple($("#txtRoleModuleConfigStationIds"), x, function (xx) {
                    stationIds = [];
                    $.each(xx, function (i, row) {
                        stationIds.push({
                            stationId: row.id
                        });
                    });
                  
                })
               
            });

           

        }
        function initButtonRoleModuleConfig()
        {  
            c.ButtonDisable('#btnRoleModuleConfigAddModule', true);         
        }

        
        //*************************************INITIALIZE
        initOnclickRoleModuleConfig();
        initSelect2RoleModuleConfig();
        initButtonRoleModuleConfig();
    }
    return {

        init: function ()
        {
            handleRoleModuleConfig();
        }

    }
}();

///***********************************STATION MODULE ROLE TAB******************************************************************
var stationModuleRoleConfig = function () {
    var Config = function () {
        console.log('stationModuleRoleConfig');

        //************************************VARIABLE
        var c = new Common();

        //************************************FUNCTIONS

        function Save() {

            var ret = Validated();
            if (!ret) return ret;

            var entry;
            entry = []
            entry = {}
            entry.Action = Action;
            entry.TariffId = c.GetSelect2Id('#select2Tariff');
            entry.ServiceId = c.GetSelect2Id('#Select2Service');
            entry.ItemId = c.GetSelect2Id('#select2ITemCode');

            entry.IPTariffDetailsSave = [];
            var rowcollection = tblItemsWithPriceList.$("#chkselected:checked", { "page": "all" });
            rowcollection.each(function (index, elem) {
                var tr = $(elem).closest('tr');
                var row = tblItemsWithPriceList.row(tr);
                var rowdata = row.data();


                entry.IPTariffDetailsSave.push({
                    BedTypeId: rowdata.BedTypeId,
                    Price: rowdata.Price,
                    StartDate: rowdata.startdatetime//data_date
                });
            });





            console.log(entry.IPTariffDetailsSave);



            $.ajax({
                url: $('#url').data("save"),
                data: JSON.stringify(entry),
                type: 'post',
                cache: false,
                contentType: "application/json; charset=utf-8",
                beforeSend: function () {

                    c.ButtonDisable('#btnSave', true);
                    c.ButtonDisable('#btnModify', true);
                },
                success: function (data) {
                    c.ButtonDisable('#btnModify', false);
                    c.ButtonDisable('#btnSave', false);

                    if (data.ErrorCode == 0) {
                        c.MessageBoxErr("Error...", data.Message);
                        return;
                    }

                    var OkFunc = function () {

                        if (Action == 3) {

                        }
                        InitDataTables();
                        DefaultEmpty();
                        Action = 0;

                    };

                    c.MessageBox(data.Title, data.Message, OkFunc);
                },
                error: function (xhr, desc, err) {
                    c.ButtonDisable('#btnSave', false);
                    var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
                    c.MessageBox("Error...", errMsg, null);
                }
            });

            return ret;
        }

        function updateFunctionforCheckFeatureList()
        {
           
            console.log('updateFunctionforCheckFeatureList');
            var entry;
            entry = []
            entry = {}
            entry.CheckFeatureList = [];
            var rowcollectionFeature = TblDashboardFeature.$("#checkFeatureConfigRole:checked", { "page": "all" });
            rowcollectionFeature.each(function (index, elem) {
                var tr = $(elem).closest('tr');
                var row = TblDashboardFeature.row(tr);
                var rowdata = row.data();

                entry.ModuleId = rowdata.ModuleId;
                entry.RoleId = rowdata.RoleId;
                entry.StationId = rowdata.StationId;

                entry.CheckFeatureList.push({
                    FeatureId: rowdata.FeatureId
                });
            });
            getFunctionperFeatureChecklist(entry)

        }
        function getFunctionperFeatureChecklist(Entry)
        {
           
                $('#preloader').show();
                
                $.ajax({
                    url: $('#url').data("getfunctionperfeature"),
                    data: JSON.stringify(Entry),
                    type: 'post',
                    cache: false,
                    contentType: "application/json; charset=utf-8",
                    beforeSend: function () {
 
                    },
                    success: function (data) {
                         
                        BindFeatureDashboard(data[0].FeatureDashboard);
                        BindFunctionDashboard(data[0].FunctionDashboard);
                        $('#preloader').hide();

                    },
                    error: function (xhr, desc, err) {

                        var errMsg = err + "<br>" + xhr.responseText;
                        $('#preloader').hide();
                        c.MessageBox("Error...", errMsg, null);

                    }
                });


      

        }


        // ----------------------------------------FEATURES-------------------------------------------------------------------------------------------------------------------
        var TblDashboardFeature;
        var TblDashboardFeatureId = '#TblDashboardFeature';
        var TblDashboardFeatureDataRow;
        var ennDashboardFeature = { Checkbox: 0, FeatName: 1, FeatureId: 2, StationId: 3, RoleId: 4, ModuleId: 5  };

        var Format24 = "HH:mm";
        var calcHeightDashboard = function () {
            return $(window).height() * 60 / 100;
        };
        function ShowDashboardFeatureRowCallBack() {
            var rc = function (nRow, aData) {
                //var value = aData['ReturnToDutyId'];
                //var $nRow = $(nRow);
                //if (value > 0) {
                //    $nRow.css({ "background-color": $('#legendHasReturn').css("background-color"), })
                //}
                var $nRow = $(nRow);
              
                if (aData["HasAccess"] === 1) {
                    //$('td:eq(3)', nRow).html("Yes");
                    $nRow.addClass("row_green");
                  $('#checkFeatureConfigRole', nRow).prop('checked', true);

                    //$('td:eq(0)', $nRow).html('<input type="checkbox" class="control-center iCheck-helper" id="checkFeatureConfigRole" checked/>');
                }
            };
            return rc;
        }
        function ShowDashboard() {
            $('#preloader').show();

            var url = $('#url').data('featurefunctiondashboard');

            var success = function (data, e) {
              
                BindFeatureDashboard(data[0].FeatureDashboard);
                BindFunctionDashboard(data[0].FunctionDashboard);
                $('#preloader').hide();
            };
            var error = function (xhr, desc, err) {
               
                var errMsg = err + "<br>" + xhr.responseText;
                $('#preloader').hide();
                c.MessageBox("Error...", errMsg, null);
            };
            ajaxWrapper.Get(url, { RoleId: $('#statmodrole_RoleName').val(), ModuleId: $('#statmodrole_Module').val(), StationId: $('#statmodrole_Station').val() }, success, 'preloader', 'Loading', error);

        }
        function BindFeatureDashboard(data) {

            // http://legacy.datatables.net/release-datatables/examples/basic_init/scroll_x.html
            TblDashboardFeature = $(TblDashboardFeatureId).DataTable({
                cache: false,
                destroy: true,
                data: data,
                paging: false,
                ordering: false,
                searching: true,
                info: false,
                scrollY: calcHeightDashboard(),
                scrollX: "100%",
                sScrollXInner: "100%",
                processing: true,
                autoWidth: false,
                dom: '<"tbDashboardFeatures">Rlfrtip',
                scrollCollapse: false,
                //pageLength: 75,
                lengthChange: false,
                columns: [
                   // { data: "", title: '', className: 'control-center', visible: true, searchable: false, width: "1px", defaultContent: '<button type="button" class="btn btn-sm btn-danger" Id="btnDetailsModif" title="Delete" rel="tooltip"> <i class="glyphicon glyphicon-trash"></i></button>' },
                    { data: "", title: ' ', className: ' ', visible: true, searchable: false, width: "0%", defaultContent: '<input type="checkbox" class="control-center iCheck-helper" id="checkFeatureConfigRole" />' },
                    { data: "FeatName", title: 'Feature', className: '', visible: true, searchable: true, width: "0%" },
                    { data: "FeatureId", title: 'FeatureId', className: ' ', visible: false, searchable: true, width: "0%" },
                    { data: "StationId", title: 'StationId', className: '', visible: false, searchable: false, width: "0%" },
                    { data: "RoleId", title: 'RoleId', className: '', visible: false, searchable: false, width: "0%" },
                    { data: "ModuleId", title: 'ModuleId', className: '', visible: false, searchable: false, width: "0%" }
                ],
                fnRowCallback: ShowDashboardFeatureRowCallBack()
              
              
            });

            var btns = '';
            var toolbar = btns.concat(
                 '<div style="float:left;">'
                , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnCheckAllFeatures"> <i class="glyphicon glyphicon-check"></i> All </button>'
                , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnUNCheckAllFeatures"> <i class="glyphicon glyphicon-unchecked"></i> All </button>'
                , '</div><br><br>');
            $("div.tbDashboardFeatures").html(toolbar);

            $('#btnCheckAllFeatures').click(function () {
             
                    $('#preloader').show();
                    $.each(TblDashboardFeature.rows().data(), function (i, row) {
                        TblDashboardFeature.cell(i, 0).data('<input id="checkFeatureConfigRole" type="checkbox" checked="checked" >');
           
                    });
                    $('#preloader').hide();
                    updateFunctionforCheckFeatureList();
                     

            });
            $('#btnUNCheckAllFeatures').click(function () {
                $('#preloader').show();
                $.each(TblDashboardFeature.rows().data(), function (i, row) {
                    TblDashboardFeature.cell(i, 0).data('<input id="checkFeatureConfigRole" type="checkbox">');
                 
                });
                 
                BindFunctionDashboard([]);
                $('#preloader').hide();
                 

            });
     
            $(TblDashboardFeatureId + ' tbody').on('click', '#checkFeatureConfigRole', function (e) {
                var $cell = $(this).closest('td');
                var $row = $(this).closest('tr');
                var Tbl = TblDashboardFeature;
                var data = Tbl.row($row).data();
                var rowId = data[0];
                var col = Tbl.cell($(this).closest('td')).index();
                
 
                if (col.column == ennDashboardFeature.Checkbox)
                {
                    //TblDashboardFeature.cell(col.row, ennDashboard.Edited).data(1);
                }

                if (this.checked) {
                    $row.addClass("row_green");
                    console.log('checked updateFunctionforCheckFeatureList ');
                   // updateFunctionforCheckFeatureList();
                } else {
                    $row.removeClass("row_green");
                   
                  //  if (col.column == ennDashboard.del) TblDashboardFeature.cell(col.row, ennDashboard.Deleted).data(0);
                }


               
                e.stopPropagation();
            });
        }
     
  
        //$(document).on("click", TblDashboardFeatureId + " td", function (e) {
        //    e.preventDefault();

        //    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        //        var tr = $(this).closest('tr');

        //        //// Multiple selection
        //        //tr.toggleClass('selected');

        //        //tr.removeClass('selected');
        //        //$('tr.selected').removeClass('selected');
        //        //tr.addClass('selected');

        //        TblDashboardFeatureDataRow = TblDashboardFeature.row($(this).parents('tr')).data();

        //    }
        //});
       
        // -----------------------------------------------------------------------------------------------------------------------------------------------------------


        // -----------------------------------------FUNCTIONS------------------------------------------------------------------------------------------------------------------
        var TblDashboardFunction;
        var TblDashboardFunctionId = '#TblDashboardFunction';
        var TblDashboardFunctionDataRow;
        var ennDashboardFunction = { Btn: 0, del: 1, ctr: 2, ID: 3, Name: 4, Edited: 5, Deleted: 6 };

        var Format24 = "HH:mm";
        var calcHeightDashboard = function () {
            return $(window).height() * 60 / 100;
        };
      
        function ShowDashboardRowCallBackFunction() {
            var rc = function (nRow, aData) {
                var $nRow = $(nRow);
                if (aData["HasAccess"] === 1) {
                    //$('td:eq(3)', nRow).html("Yes");
                    $nRow.addClass("row_green");
                    $('#checkFunctionConfigRole', nRow).prop('checked', true);
                     }
            };
            return rc;
        }
        function BindFunctionDashboard(data) {

            // http://legacy.datatables.net/release-datatables/examples/basic_init/scroll_x.html
            TblDashboardFunction = $(TblDashboardFunctionId).DataTable({
                cache: false,
                destroy: true,
                data: data,
                paging: false,
                ordering: false,
                searching: true,
                info: false,
                scrollY: calcHeightDashboard(),
                scrollX: "100%",
                sScrollXInner: "100%",
                processing: true,
                autoWidth: false,
                dom: '<"tbDashboardFunct">Rlfrtip',
                scrollCollapse: false,
                //pageLength: 75,
                lengthChange: false,
                columns: [
                   // { data: "", title: '', className: 'control-center', visible: true, searchable: false, width: "1px", defaultContent: '<button type="button" class="btn btn-sm btn-danger" Id="btnDetailsModif" title="Delete" rel="tooltip"> <i class="glyphicon glyphicon-trash"></i></button>' },
                    { data: "", title: ' ', className: ' ', visible: true, searchable: false, width: "0%", defaultContent: '<input type="checkbox" class="control-center iCheck-helper" id="checkFunctionConfigRole" />' },
                    { data: "FeatureName", title: 'Feature Name', className: '', visible: true, searchable: true, width: "0%" },
                    { data: "FunctionName", title: 'Function Name', className: '', visible: true, searchable: true, width: "0%" },
                    { data: "FeatureId", title: 'FeatureId', className: ' ', visible: false, searchable: true, width: "0%" },
                    { data: "FunctionId", title: 'FunctionId', className: '', visible: false, searchable: false, width: "0%" },
                    { data: "StationId", title: 'StationId', className: '', visible: false, searchable: false, width: "0%" },
                    { data: "RoleId", title: 'RoleId', className: '', visible: false, searchable: false, width: "0%" },
                    { data: "ModuleId", title: 'ModuleId', className: '', visible: false, searchable: false, width: "0%" }
                ],
                fnRowCallback: ShowDashboardRowCallBackFunction()
            });

            var btns = '';
            var toolbar = btns.concat(
                 '<div style="float:left;">'
                 , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnCheckAllFunctions"> <i class="glyphicon glyphicon-check"></i> All </button>'
                , '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnUNCheckAllFunctions"> <i class="glyphicon glyphicon-unchecked"></i> All </button>'
                , '</div><br><br>');
            $("div.tbDashboardFunct").html(toolbar);

            $('#btnCheckAllFunctions').click(function () {
                $('#preloader').show();
                $.each(TblDashboardFunction.rows().data(), function (i, row) {
                    TblDashboardFunction.cell(i, 0).data('<input id="checkFunctionConfigRole" type="checkbox" checked="checked" >');
                });
                $('#preloader').hide();
            });
            $('#btnUNCheckAllFunctions').click(function () {
                $('#preloader').show();
                $.each(TblDashboardFunction.rows().data(), function (i, row) {
                    TblDashboardFunction.cell(i, 0).data('<input id="checkFunctionConfigRole" type="checkbox">');
                });
                $('#preloader').hide();

            });

            $(TblDashboardFunctionId + ' tbody').on('click', '#checkFunctionConfigRole', function (e) {
                var $cell = $(this).closest('td');
                var $row = $(this).closest('tr');
                var Tbl = TblDashboardFunction;
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
 
        // -----------------------------------------------------------------------------------------------------------------------------------------------------------
        function initReadystationModuleRoleConfig()
        {
                       setTimeout(function () {
                $('#statmodrole_Station').trigger('click');
                $('#statmodrole_Station').select2('open');
                $('#preloader').hide();
                
            }, 500)
        }

        function initOnclickstationModuleRoleConfig()
        {

            $(document).on("click", "#tblRoleModuleConfigModuleList td ", function () {
                    var nRow = $(this).parents('tr')[0];
                    var oTableData = oTable.fnGetData(nRow);
                    LoadFeatureByRoleModule(roleID, oTableData.Module_Id, oTableData.Station_Id);
            });

        
            $('#btnSearchConfigRoles').click(function (e) {
                ShowDashboard();
            });
        }

        function initSelect2stationModuleRoleConfig()
        {
            //***********************************SELECT2
              ajaxWrapper.Get($("#url").data("getstation"), null, function (x, e) {
                Sel2Client($("#statmodrole_Station"), x, function (xx) {
                    var statmodrole_Station = xx.id ;
                    ajaxWrapper.Get($("#url").data("getmodulebystation"), { StationId : statmodrole_Station }, function (d, e) {
                        Sel2Client($("#statmodrole_Module"), d, function (bb) {
                            var statmodrole_Module = bb.id;

                            ajaxWrapper.Get($("#url").data("getrolebystationmodule"), { StationId: statmodrole_Station, ModuleId: statmodrole_Module }, function (aa, e) {
                                Sel2Client($("#statmodrole_RoleName"), aa, function (dd) {
                                          
                                            var statmodrole_RoleName = dd.id;
                                            c.ButtonDisable('.ClassDisable', false);
                                            ShowDashboard();
                                          
                                });
                                       
                                     
                            });

                        });
                                $('#preloader').show();
                                setTimeout(function () {
                                    $('#statmodrole_Module').trigger('click');
                                    $('#statmodrole_Module').select2('open');
                                    $('#preloader').hide();
                                }, 500)
                    });
                })
               
              });
        }

        function initButtonstationModuleRoleConfig()
        {  
            c.ButtonDisable('.ClassDisable', true);
        }

        //*************************************INITIALIZE
        initOnclickstationModuleRoleConfig();
        initSelect2stationModuleRoleConfig();
        initButtonstationModuleRoleConfig();
        initReadystationModuleRoleConfig();
    }
    return {

        init: function ()
        {
            Config();
        }

    }
}();
