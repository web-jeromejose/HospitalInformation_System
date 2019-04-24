
$(document).ready(function () {

    webroles.init();

});

var webroles = function () {

    var Config = function () {
        console.log('Config');
        var c = new Common();

        var tblmoduleslist;
        var tblmenulist;

        var tblgridlistRoles;
        var tblgridlistRolesId = '#gridlistRoles'
        var tblgridlistRolesDataRow;

        var tblgridlistAssignRoles;
        var tblgridlistAssignRolesId = '#gridlistAssignRoles'
        var tblgridlistAssignRolesDataRow;



        /*********************1st tab ROLES*****************************************************************/
        var LoadRoleList = function () {
            ajaxWrapper.Get($("#url").data("rolelistdatatable"), null, function (x, e) {
                BindLoadRoleList(x.list);
            });
        };
        function BindLoadRoleList(data) {
            console.log(data);
            // http://legacy.datatables.net/release-datatables/examples/basic_init/scroll_x.html
            tblgridlistRoles = $(tblgridlistRolesId).DataTable({
                cache: false,
                destroy: true,
                data: data,
                paging: true,
                ordering: false,
                searching: true,
                info: false,
                scrollY: 400,
                //scrollX: true,
                processing: false,
                autoWidth: false,
                dom: '<"tbdomname">Rlfrtip',
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


            var btns = '';
            var toolbar = btns.concat(
                 '<div style="float:left;">'
                 , "<button id='createnewrole' class='btn btn-info btn-sm right'><span class='glyphicon glyphicon-remove'></span> New Role </button>"
                , '</div><br><br>');
           
            $("div.tbdomname").html(toolbar);



        }

        function updateRoleDetails(deleted) {
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
                        LoadRoleList();
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


        /*******************************************************************************************/


        /*********************3rd tab ASSIGN ROLES*****************************************************************/
        function AssignRolesSearch() {
            var entry = {};
            entry.dept_id = $('#txtdepartment').val() != '' ? $('#txtdepartment').val() : 0;
            entry.role_id = $('#txtrole').val() != '' ? $('#txtrole').val() : 0;

            console.log(entry);

            if (entry.dept_id == 0) {
                c.MessageBoxErr("Error...", 'Please select a Department.');
                return false;
            }

            if (entry.role_id == 0) {
                c.MessageBoxErr("Error...", 'Please select a Role.');
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

        function tblgridlistAssignRolesDataTable(data) {
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
                dom: '<"tbdomname123">Rlfrtip',
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

                if (aData.Selected == 1) {
                    $('#chkselected', nRow).prop('checked', true);
                }


            };
            return rc;

        }

        function AssignRoleSaveSave() {


            var entry;
            entry = []
            entry = {}
            entry.Action = 1;
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

        /*******************************************************************************************/

        /*********************2 tab ASSIGN ROLES MODULE *****************************************************************/
        function AssignRoleModuleSearch() {
            var entry = {};
            entry.moduleid = $('#txtmodule').val() != '' ? $('#txtmodule').val() : 0;
            entry.roleid = $('#txtroleModule').val() != '' ? $('#txtroleModule').val() : 0;

            console.log(entry);

            if (entry.moduleid == 0) {
                c.MessageBoxErr("Error...", 'Please select a Module.');
                return false;
            }

            if (entry.roleid == 0) {
                c.MessageBoxErr("Error...", 'Please select a Role.');
                return false;
            }

            var YesFunc = function () {
 
                var Url = $("#url").data("addmoduleinrole");

                $('#preloader').show();


                $.ajax({
                    url: Url,
                    data: JSON.stringify(entry),
                    type: 'post',
                    cache: false,
                    contentType: "application/json; charset=utf-8",
                    beforeSend: function () {

                    
                    },
                    success: function (data) {

                        $('#preloader').hide();

                        if (data.ErrorCode == 0) {
                            c.MessageBoxErr("Error...", data.Message);
                            return;
                        }

                        var OkFunc = function () {
                            getmodulelist([]);
                            getmoduleFeature([]);
                            getModulebyRole($('#txtroleModule').val());
                        };

                        c.MessageBox(data.Title, data.Message, OkFunc);

                    },
                    error: function (xhr, desc, err) {
                        $('#preloader').hide();
                        var errMsg = err + "<br>" + desc;
                        c.MessageBoxErr(errMsg);
                    }
                });

              

            }

            c.MessageBoxConfirm("Role - Module", "Are you sure you want add this module ?", YesFunc, null);

        }
        function getModulebyRole(roleid) {
            ajaxWrapper.Get($("#url").data("getmodulebyroleid"), { id: roleid }, function (xx, e) {
                getmodulelist(xx);
            });


        }
        function getmodulelist(x) {
            tblmoduleslist = $("#tblmoduleslist").DataTable({
                cache: false,
                destroy: true,
                data: x,
                paging: false,
                ordering: false,
                searching: false,
                info: false,
                //scrollX: true,
                processing: false,
                autoWidth: false,
                dom: 'Rlfrtip',
                scrollCollapse: false,
                pageLength: 150,
                lengthChange: false,
                columns: [
                     { data: "text" },
                     { data: "id", className: "_remove" }
                ],
                fnCreatedRow: function (nRow, aData, iDataIndex) {
                    //$('td:eq(1)', nRow).html("<button>Remove</button>");
                    $('td:eq(1)', nRow).html('<button type="button" class="btn btn-xs red">Remove</button>');
                    var $nRow = $(nRow);
                    $nRow.addClass("row_green");
                }
            });

        }

        function LoadModuleFeature(id) {
            ajaxWrapper.Get($("#url").data("modaccessfeat"), { roleid: $("#txtroleModule").val(), moduleid: id }, function (x, e) {
                getmoduleFeature(x);
            });
        }
        function getmoduleFeature(x) {
            tblmenulist = $("#tblmenulist").DataTable({
                cache: false,
                destroy: true,
                data: x,
                paging: false,
                ordering: false,
                searching: true,
                info: false,
                scrollY: 400,
                //scrollX: true,
                processing: false,
                autoWidth: true,
                dom: 'Rlfrtip',
                scrollCollapse: false,
                pageLength: 150,
                lengthChange: false,
                columns: [
                     { data: "FeatureID" },
                     { data: "ParentName" },
                     { data: "FeatureName" },
                     { data: "HasAccess" },
                     { data: "RoleId", className: "_add" },
                     { data: "RoleId", className: "_remove" },
                     { data: "RoleId", className: "_functions" }


                ],
                fnCreatedRow: function (nRow, aData, iDataIndex) {
                    $('td:eq(3)', nRow).html('<button type="button" class="btn btn-xs red">No</button>');
                    var $nRow = $(nRow); // cache the row wrapped up in jQuery
                    $nRow.addClass("row_red");
                    if (aData["HasAccess"] != "0") {
                        $('td:eq(3)', nRow).html('<button type="button" class="btn btn-xs blue">Yes</button>');
                        $nRow.addClass("row_green");
                    }
                    $('td:eq(4)', nRow).html("<button class='btn btn-sm btn-success'>Add</button>");
                    $('td:eq(5)', nRow).html("<button class='btn btn-sm btn-danger'>Remove</button>");
                    $('td:eq(6)', nRow).html("<button class='btn btn-sm btn-info'>Function</button>");
                }
            });
        }
        function LoadRoleModule(id) {
            console.log(id);

            /* ajaxWrapper.Get($("#url").data("modaccess"), { id: id }, function (x, e) {
                 Sel2Client($("#txtstationmodule"), x, function (dd) {
                     console.log(id);
                     console.log(dd.id);
 
                     ajaxWrapper.Get($("#url").data("modstation"), { id: id, idd: dd.id }, function (xx, e) {
 
                         $("#tblmodules-station").DataTable({
                             destroy: true,
                             paging: false,
                             searching: true,
                             ordering: true,
                             info: false,
                             data: xx,
                             bAutoWidth: false,
                             columns: [
                                  { data: "id" },
                                  { data: "text" },
                                  { data: "id" }
                             ],
                             fnCreatedRow: function (nRow, aData, iDataIndex) {
                                 $('td:eq(2)', nRow).data("id", aData["id"]);
                                 $('td:eq(2)', nRow).data("idd", aData["name"]);
                                 if (aData["name"] == "0") {
                                     $('td:eq(2)', nRow).html("<button class='btn btn-sm btn-success'>Add</button>");
                                     $('td:eq(2)', nRow).addClass("_addstation");
                                 }
                                 else {
                                     $('td:eq(2)', nRow).html("<button class='btn btn-sm btn-danger'>Remove</button>");
                                     $('td:eq(2)', nRow).addClass("_remstation");
                                 }
                             }
                         });
                     });
                 });
                 ajaxWrapper.Get($("#url").data("station"), { id: id }, function (stat, e) {
                     Sel2Client($("#txtstation"), stat, function (dd) {
 
                     });
 
                 });
                 tblmoduleslist = $("#tblmoduleslist").DataTable({
                     destroy: true,
                     paging: false,
                     searching: true,
                     ordering: true,
                     info: false,
                     data: x,
                     bAutoWidth: false,
                     columns: [
                          { data: "text" },
                          { data: "id", className: "_remove" }
                     ],
                     fnCreatedRow: function (nRow, aData, iDataIndex) {
                         $('td:eq(1)', nRow).html("<button>Remove</button>");
                     }
                 });
             });*/
        }

        /*******************************************************************************************/
        function onclickInit() {

            $('#divRoles').click(function (e) {
                e.preventDefault();
                LoadRoleList();
            });

            $(document).on("click", "#gridlistRoles td", function () {
                var d = tblgridlistRoles.row($(this).parents('tr')).data();

                $("#modal-RolesupdateDataTable").modal({ "keyboard": true });

                $('#txtlistDTRolename').val(d.Name);
                $('#txtlistDTRoleID').val(d.RoleId);
                $('#txtlistDTRoleDesc').val(d.Description);

                $('#btnrolenameupdatedelete').show();
                $('#btnrolenameupdate').text('Modify');

            });

            $('#BtnSearchAssignRole').click(function () {
                AssignRolesSearch();
            });

            $('#BtnAssignRoleSave').click(function () {
                var YesFunc = function () {
                    AssignRoleSaveSave();
                };
                c.MessageBoxConfirm("Save User/s?", "Are you sure you want to save the Entry?", YesFunc, null);

            });

            $('#BtnSearchAssignModule').click(function () {
                AssignRoleModuleSearch();

            });


            /************ROLES-MODULES*****/
            $('#divRolesModules').click(function (e) {
                e.preventDefault();
            });
            $(document).on("click", "#tblmoduleslist td", function () {
                var d = tblmoduleslist.row($(this).parents('tr')).data();
                var mod = d.id;
                $("#url").data("rolemoduleid", mod);
                if ($(this).hasClass('_remove')) {
                    ajaxWrapper.Get($("#url").data("removemodulebyrole"), { "roleid": $("#txtroleModule").val(), "moduleid": mod }, function (x, e) {                        
                        NotifySuccess(x.Message, "Module");
                        getmodulelist([]);
                        getmoduleFeature([]);
                        getModulebyRole($('#txtroleModule').val());
                    });
                }
                else {
                    LoadModuleFeature(mod);
                }
            });
            $(document).on("click", "#tblmenulist td", function () {
                if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {

                    var d = tblmenulist.row($(this).parents('tr')).data();

                    entry = {};
                    entry.roleid = $("#txtroleModule").val();
                    entry.moduleid = $("#url").data("rolemoduleid");
                    entry.featid = d.FeatureID;
                    entry.deleted = 0;
                    

                    if ($(this).hasClass('_add')) {
                        $(this).closest("tr").removeClass("row_green");
                        $(this).closest("tr").removeClass("row_red");
                        ajaxWrapper.Get($("#url").data("updaterolefeature"), entry, function (x, e) {
                            NotifySuccess(x.Message, "Module-Feature");
                        });
                        $(this).closest("tr").addClass("row_green");
                        $(this).closest("tr").find('td:eq(3)').html('<button type="button" class="btn btn-xs blue">Yes</button>');
                    }
                    if ($(this).hasClass('_remove')) {
                        entry.deleted = 1;
                        $(this).closest("tr").removeClass("row_green");
                        $(this).closest("tr").removeClass("row_red");
                        ajaxWrapper.Get($("#url").data("updaterolefeature"), entry, function (x, e) {
                            NotifySuccess(x.Message, "Module-Feature");
                        });
                        $(this).closest("tr").addClass("row_red");
                        $(this).closest("tr").find('td:eq(3)').html('<button type="button" class="btn btn-xs red">No</button>');
                    }
                    if ($(this).hasClass('_functions')) {
                       // LoadUserFunctions(d.FeatureID);

                      //  $("#modal-func").modal({ "keyboard": true });
                      //  $("#url").data("funcfeatadd", d.FeatureID);
                    }

                }
            });

            
            $(document).on("click", "#btnrolenameupdatedelete", function () { updateRoleDetails(1); });
            $(document).on("click", "#btnrolenameupdate", function () { updateRoleDetails(0);  });

            $(document).on("click", "#createnewrole", function () {
                $("#modal-RolesupdateDataTable").modal({ "keyboard": true });
                $('#txtlistDTRolename').val("");
                $('#txtlistDTRoleID').val(0);
                $('#txtlistDTRoleDesc').val("");
                $('#btnrolenameupdatedelete').hide();
                $('#btnrolenameupdate').text('New');

                
            });



           



        }
        function initSelect() {


            ajaxWrapper.Get($("#url").data("getroles"), null, function (xx, e) {
                Sel2Client($("#txtrole"), xx, function (x) {
                    tblgridlistAssignRolesDataTable([]);
                })
                Sel2Client($("#txtroleModule"), xx, function (x) {
                    getModulebyRole(x.id);
                })
            });
            ajaxWrapper.Get($("#url").data("getdept"), null, function (xx, e) {
                Sel2Client($("#txtdepartment"), xx, function (x) {
                    tblgridlistAssignRolesDataTable([]);
                })

            });
            ajaxWrapper.Get($("#url").data("getmodule"), null, function (xx, e) {
                Sel2Client($("#txtmodule"), xx, function (x) {

                })
            });




        }
        //*************************************INITIALIZE
        LoadRoleList();
        onclickInit();
        initSelect();

    }
    return {

        init: function () {
            Config();
        }

    }
}();