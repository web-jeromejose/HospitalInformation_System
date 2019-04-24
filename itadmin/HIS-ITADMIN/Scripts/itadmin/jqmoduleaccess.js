var c = new Common();
var tbl;
var tblmodules;
var tblmoduleuser;
var tblmoduleslist;
var tblmenulist;
var tblfunc;

var MODULE_ID = 0;

$(function () {


 
    c.Disable('#btnAddAccess', true);
    
    $("#btnfeature").hide();
    addEditors();
    initOnload();

    LoadModules();
    EmpList();

    Sel2Server($("#txtemp"), $("#url").data("emp"), function (dd) {
        LoadUserModule(dd.id);

    });
    Sel2Server($("#txtfeat"), $("#url").data("srcmenu"), function (dd) {
        LoadUserModule(dd.id);
    });

    ajaxWrapper.Get($("#url").data("allstation"), { id: 0 }, function (stat, e) {
        Sel2Client($("#txtmoduletostationStatId"), stat, function (dd) { });
    });

    ajaxWrapper.Get($("#url").data("mod"), null, function (x, e) {
        Sel2Client($("#txtmodule"), x, function () {
            c.Disable('#btnAddAccess', false);
        });
        Sel2Client($("#txtmoduletostationModuleId"), x, function () {});
        tblmodules = $("#tblmodules").DataTable({
            destroy: true,
            paging: false,
            searching: true,
            ordering: true,
            info: false,
            data: x,
            bAutoWidth: false,
            columns: [
                 { data: "ID", className: "_save" },
                 { data: "ModuleID" },
                 { data: "ModuleName", className: "_txt _modulename" },
                 { data: "URLLink", className: "_txt _modulename" },
                 { data: "ImgSrc", className: "_txt _img" },
                 { data: "StationSpecific", className: "_txt _img" },
                 { data: "TPwdRequired", className: "_txt _img" },
                 { data: "Deleted", className: "_txt _img" },
                 { data: "VirtualPoolName", className: "_txt _img" },
                 { data: "IncludeVPoolName", className: "_tx_img" }
            ],
            fnCreatedRow: function (nRow, aData, iDataIndex) {
                $('td:eq(0)', nRow).html("<button class='btn btn-info'>Save</button>");
            }
        });

        tbl = $("#tblmenumodules").DataTable({
            destroy: true,
            paging: false,
            searching: true,
            ordering: true,
            info: false,
            data: x,
            bAutoWidth: false,
            columns: [
                 { data: "ModuleID" },
                 { data: "ModuleName" }

            ]
        });
        tblmoduleuser = $("#tblmoduleuser").DataTable({
            destroy: true,
            paging: false,
            searching: true,
            ordering: true,
            info: false,
            data: x,
            bAutoWidth: false,
            columns: [
                 { data: "ModuleID" },
                 { data: "ModuleName" }

            ]
        });
        initEditable();
    });
    ajaxWrapper.Get($("#url").data("funclist"), null, function (x, e) {
        console.log(x);
        Sel2Client($("#txtfunction"), x, function () {
        });
    });
    ajaxWrapper.Get($("#url").data("menu"), { id: "0" }, function (xx, e) {
        $("#tblmenuaddfeat").DataTable({
            destroy: true,
            paging: true,
            searching: true,
            ordering: true,
            info: false,
            data: xx,
            bAutoWidth: false,
            columns: [
                 { data: "FeatureID", className: "_save" },
                 { data: "FeatureID" },
                 { data: "Name" },
                 { data: "ParentID" },
                 { data: "MenuURL" },
                 { data: "Deleted" },
                 { data: "SequenceNo" },
                 { data: "Bar" },
                 { data: "NewWindow" }
            ],
            fnCreatedRow: function (nRow, aData, iDataIndex) {
                $('td:eq(0)', nRow).html("<button>Save</button>");
            }
        });
    });
    $(document).on("click", "#tblmoduleslist td", function () {
        //$(".selectmenu").hide();
        //var c = $(this).attr('class');
        //var cc = c.split(' ');        
        //$("." + cc[0]).show();
        var d = tblmoduleslist.row($(this).parents('tr')).data();
        var mod = d.id;
        $("#url").data("modidusr", mod);
        if ($(this).hasClass('_remove')) {
            ajaxWrapper.Get($("#url").data("delusermod"), { "id": $("#txtemp").val(), "mod": mod }, function (x, e) {
                NotifySuccess(x, "Module");
                LoadUserModule($("#txtemp").val());
            });
        }
        else {
            LoadUserFeatures(mod);
        }
    });
    $(document).on("click", "#tblmenumodules td", function () {
        if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
            var d = tbl.row($(this).parents('tr')).data();
            $("#btnfeature").show();
            $("#btnnewfeature").show();
            $("#url").data("modidfeat", d.ModuleID);
            $("#btnfeature").text("Add Feature to " + d.ModuleName);
            $("#btnnewfeature").text("Add New Feature to " + d.ModuleName);
            MODULE_ID = d.ModuleID
            console.log(MODULE_ID);
            LoadModuleFeature(d.ModuleID);
            $("#modal-feat").attr
            $("#modal-feat").modal({ keyboard: true });
        }
    });
    $(document).on("click", "#tblmoduleuser td", function () {
        if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
            var d = tblmoduleuser.row($(this).parents('tr')).data();
            $("#url").data("modidfeat", d.ModuleID);
            LoadModuleUser(d.ModuleID);
            c.Disable('#btnAddAccess', false);
        }
    });
    $(document).on("click", "#tblmoduleuserlist td", function () {
        if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
            var id = $(this).closest("tr").find('td:eq(1)').text()
            var name = $(this).closest("tr").find('td:eq(3)').text()

            if ($(this).hasClass('_remove')) {
                ajaxWrapper.Get($("#url").data("delusermod"), { "id": id, "mod": $("#url").data("modidfeat") }, function (x, e) {
                    NotifySuccess("User Removed " + name, "Module");
                });
            }

        }
    });
    $(document).on("click", "#tblmodules td", function () {
        if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
            if ($(this).hasClass('_save')) {
                var dd = {
                    id: $(this).closest("tr").find('td:eq(1)').text(),
                    name: $(this).closest("tr").find('td:eq(2)').text(),
                    slink: $(this).closest("tr").find('td:eq(3)').text(),
                    src: $(this).closest("tr").find('td:eq(4)').text(),
                    incvname: $(this).closest("tr").find('td:eq(9)').text(),
                    vname: $(this).closest("tr").find('td:eq(8)').text(),
                    del: $(this).closest("tr").find('td:eq(7)').text()
                }
                if (dd.name == "" || dd.name == null || dd.del == "" || dd.del == null) {
                    NotifyError("Check the input for ( ModuleName/URL LINK/Deleted ) ", "Module");
                    return false;
                }
                ajaxWrapper.Get($("#url").data("svmod"), dd, function (x, e) {
                    NotifySuccess("Module Saved", "Module");
                });
            }
        }
    });
    $(document).on("click", "#tblmenu td", function () {
        if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
            var nme = $(this).closest("tr").find('td:eq(4)').text();
            var idd = $(this).closest("tr").find('td:eq(3)').text();

            console.log(MODULE_ID);
            if ($(this).hasClass('_save')) {
                var dd = {
                    id: $(this).closest("tr").find('td:eq(3)').text(),
                    name: $(this).closest("tr").find('td:eq(4)').text(),
                    parent: $(this).closest("tr").find('td:eq(5)').text(),
                    menu: $(this).closest("tr").find('td:eq(7)').text(),
                    del: $(this).closest("tr").find('td:eq(8)').text(),
                    seq: $(this).closest("tr").find('td:eq(9)').text(),
                    bar: $(this).closest("tr").find('td:eq(10)').text(),
                    newwindow: $(this).closest("tr").find('td:eq(11)').text()
                    , moduleid: MODULE_ID
                }
                 
                if (dd.parent == "" || dd.parent == null || dd.menu == "" || dd.menu == null ||  dd.name == "" || dd.name == null ||  dd.del == "" || dd.del == null  )
                {
                    NotifyError("Check the input for ( Name/MenuUrl/Deleted ) ", "Module");
                    return false;
                }
                ajaxWrapper.Get($("#url").data("svmenu"), dd, function (x, e) {
                    NotifySuccess("Menu Saved - " + nme, "Module");
                    // LoadModuleFeature(idd);
                });
            }
            if ($(this).hasClass('_remove')) {
                ajaxWrapper.Get($("#url").data("delmenu"), { "mod": $("#url").data("modidfeat"), "feat": idd }, function (x, e) {
                    NotifySuccess("Menu Removed - " + nme, "Module");
                    //LoadModuleFeature($("#url").data("modidfeat"));
                });
            }
            if ($(this).hasClass('_functions')) {
                $("#modal-func").modal({ "keyboard": true });
                $("#url").data("funcfeatadd", idd);
                LoadFunctionFeat(idd)
            }
        }
    });
    $(document).on("click", "#tblmenulist td", function () {
        if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {

            var d = tblmenulist.row($(this).parents('tr')).data();

            if ($(this).hasClass('_add')) {
                $(this).closest("tr").removeClass("row_green");
                $(this).closest("tr").removeClass("row_red");
                ajaxWrapper.Get($("#url").data("adduserfeat"), { "id": d.FID, "acc": 0, "feat": d.FeatureID, "mod": $("#url").data("modidusr"), "usr": $("#txtemp").val() }, function (x, e) {
                    NotifySuccess(x, "Module");
                });
                $(this).closest("tr").addClass("row_green");
                $(this).closest("tr").find('td:eq(3)').text("Yes");
            }
            if ($(this).hasClass('_remove')) {
                $(this).closest("tr").removeClass("row_green");
                $(this).closest("tr").removeClass("row_red");
                ajaxWrapper.Get($("#url").data("adduserfeat"), { "id": d.FID, "acc": 1, "feat": d.FeatureID, "mod": $("#url").data("modidusr"), "usr": $("#txtemp").val() }, function (x, e) {
                    NotifySuccess(x, "Module");
                });
                $(this).closest("tr").addClass("row_red");
                $(this).closest("tr").find('td:eq(3)').text("No");
            }
            if ($(this).hasClass('_functions')) {
                LoadUserFunctions(d.FeatureID);

                $("#modal-func").modal({ "keyboard": true });
                $("#url").data("funcfeatadd", d.FeatureID);
            }

        }
    });
    $(document).on("click", "#tblfeaturefunc td", function () {
        if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {

            var d = tblfunc.row($(this).parents('tr')).data();
            $(this).closest("tr").removeClass("row_green");
            $(this).closest("tr").removeClass("row_red");
            if ($(this).hasClass('_add')) {
                ajaxWrapper.Get($("#url").data("upduserfunc"), { "id": d.name, "func": d.id, "feat": $("#url").data("funcfeatadd"), "mod": $("#url").data("modidusr"), "usr": $("#txtemp").val(), "del": "0" }, function (x, e) {
                    NotifySuccess(x, "Module");
                    $(this).closest("tr").addClass("row_green");
                    LoadUserFunctions($("#url").data("funcfeatadd"));
                });
            }
            if ($(this).hasClass('_remove')) {
                ajaxWrapper.Get($("#url").data("upduserfunc"), { "id": d.name, "func": d.id, "feat": $("#url").data("funcfeatadd"), "mod": $("#url").data("modidusr"), "usr": $("#txtemp").val(), "del": "1" }, function (x, e) {
                    NotifySuccess(x, "Module");
                    $(this).closest("tr").addClass("row_red");
                    LoadUserFunctions($("#url").data("funcfeatadd"));
                });
            }
            if ($(this).hasClass('_remove_func')) {
                ajaxWrapper.Get($("#url").data("addfuncfeat"), { "id": d.id, "feat": $("#url").data("funcfeatadd"), "del": "1" }, function (x, e) {
                    NotifySuccess(x, "Function");
                    LoadFunctionFeat($("#url").data("funcfeatadd"));
                });
            }
        }
    });
    $(document).on("click", "#tblmodules-station td", function () {
        var i = $(this).data('id');
        var ii = $(this).data('idd');
        //remove station
        ajaxWrapper.Get($("#url").data("insmodstation"), { id: $("#txtempstation").val(), idd: $("#txtstationmodule").val(), iddd: i, del: ii }, function (x, e) {
            NotifySuccess("Station Removed.", "User Station Access");
            getUstationDatatable($("#txtempstation").val(), $("#txtstationmodule").val());
        });
    });
    //transfer in other page Synchmodulepate
    //$(document).on("click", "#tblmodules-sync td", function () {
    //    var id = $(this).data('id');
    //    var cons = $(this).data('con');
    //    console.log(id);
    //    console.log(cons);

    //    var YesFunc = function () {
    //        $('#preloader').show();
    //        ajaxWrapper.Get($("#url").data("sync"), { id: id, cons: cons }, function (x, e) {
    //            $('#preloader').hide();
    //            NotifySuccess("Done", "Module Access");
    //        });

    //    };
    //    c.MessageBoxConfirm("Save Entry?", "Are you sure you want to sync this " + id + "?", YesFunc, null);


    //});
})

function btnaddnewmodule() {


    var YesFunc = function () {

        ajaxWrapper.Get($("#url").data("createmoduleid"), null, function (x, e) {
            NotifySuccess("Done", "Added New Module --Reserved");






            ajaxWrapper.Get($("#url").data("mod"), null, function (x, e) {
                Sel2Client($("#txtmodule"), x, function () {
                    c.Disable('#btnAddAccess', false);
                });
                console.log(x);
                tblmodules = $("#tblmodules").DataTable({
                    destroy: true,
                    paging: false,
                    searching: true,
                    ordering: true,
                    info: false,
                    data: x,
                    bAutoWidth: false,
                    columns: [
                         { data: "ID", className: "_save" },
                         { data: "ModuleID" },
                         { data: "ModuleName", className: "_txt _modulename" },
                         { data: "URLLink", className: "_txt _modulename" },
                         { data: "ImgSrc", className: "_txt _img" },
                         { data: "StationSpecific", className: "_txt _img" },
                         { data: "TPwdRequired", className: "_txt _img" },
                         { data: "Deleted", className: "_txt _img" },
                         { data: "VirtualPoolName", className: "_txt _img" },
                         { data: "IncludeVPoolName", className: "_tx_img" }
                    ],
                    fnCreatedRow: function (nRow, aData, iDataIndex) {
                        $('td:eq(0)', nRow).html("<button>Save</button>");
                    }
                });
            });



        });

    };
    c.MessageBoxConfirm("Save Entry?", "Are you sure you add new Module?", YesFunc, null);



}

function LoadModules() {
     
}
function EmpList() {

    ajaxWrapper.Get($("#url").data("showparentlist"), {  }, function (stat, e) {
        Sel2Client($("#txtNew_ParentMenu"), stat, function (dd) { });
    });

    Sel2Server($("#fromCopyEmployee"), $("#url").data("emp"), function (dd) {
        ajaxWrapper.Get($("#url").data("modaccess"), { id: dd.id }, function (x, e) {
            Sel2Client($("#txtCopytomodule"), x, function (dd) { });
        });
    });
    Sel2Server($("#toCopyEmployee"), $("#url").data("emp"), function (dd) { });

    Sel2Server($("#txtempstation"), $("#url").data("emp"), function (dd) {
        var modacceid = dd.id;
        ajaxWrapper.Get($("#url").data("modaccess"), { id: modacceid }, function (x, e) {

            Sel2Client($("#txtstationmodule"), x, function (xx, dd) {

                ajaxWrapper.Get($("#url").data("station"), { id: modacceid }, function (stat, e) {
                    Sel2Client($("#txtstation"), stat, function (dd) { });
                });

                getUstationDatatable(modacceid, xx.id);
            });
        });
    });
    Sel2Server($("#txtstationdoc"), $("#url").data("emp"), function (dd) {
    });

}
function getUstationDatatable(empid, moduleid) //$("#txtempstation").val(),$("#txtstationmodule").val()
{
    ajaxWrapper.Get($("#url").data("modstation"), { id: empid, idd: moduleid }, function (xx, e) {

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

                $('td:eq(2)', nRow).html("<button class='btn btn-sm btn-danger'>Remove</button>");
                $('td:eq(2)', nRow).addClass("_remstation");

            }
        });
    });
}
function AddDoctorStation() {
    ajaxWrapper.Get($("#url").data("insmodstation"), { id: $("#txtempstation").val(), idd: $("#txtstationmodule").val(), iddd: $("#txtstationdoc").val() }, function (x, e) {
        NotifySuccess(x, "Module Doctor Station");
    });
}
function AddStationtoDataInfo() {
    if ($("#txtmoduletostationModuleId").val() == "" || $("#txtmoduletostationStatId").val() == "" ) {
        NotifyError("Please select correct input - Station Module!", "User Station Access - Station Module ");
        return false;
    } else {
        ajaxWrapper.Get($("#url").data("insmodstationdatainfotbl"), { idd: $("#txtmoduletostationModuleId").val(), iddd: $("#txtmoduletostationStatId").val(), del: "0" }, function (x, e) {
            NotifySuccess(x, "User Station Access");
            getUstationDatatable($("#txtempstation").val(), $("#txtstationmodule").val());
        });
    }
}
function RemoveStationtoDataInfo() {
    if ($("#txtmoduletostationModuleId").val() == "" || $("#txtmoduletostationStatId").val() == "") {
        NotifyError("Please select correct input!", "User Station Access - Station Module");
        return false;
    } else {
        ajaxWrapper.Get($("#url").data("insmodstationdatainfotbl"), { idd: $("#txtmoduletostationModuleId").val(), iddd: $("#txtmoduletostationStatId").val(), del: "1" }, function (x, e) {
            NotifySuccess(x, "User Station Access");
            getUstationDatatable($("#txtempstation").val(), $("#txtstationmodule").val());
        });
    }
}

function AddStation() {
    if ($("#txtempstation").val() == "" || $("#txtstationmodule").val() == "" || $("#txtstation").val() == "") {
        NotifyError("Please select correct input!", "User Station Access");
        return false;
    } else {
        ajaxWrapper.Get($("#url").data("insmodstation"), { id: $("#txtempstation").val(), idd: $("#txtstationmodule").val(), iddd: $("#txtstation").val() }, function (x, e) {
            NotifySuccess(x, "User Station Access");
            getUstationDatatable($("#txtempstation").val(), $("#txtstationmodule").val());
        });
    }
}
function addEditors() {
    $.editable.addInputType('remarksInput', {
        element: function (settings, original) {
            var input = $('<input type="text" class="form-control" style="width:200px;height: 28px;padding-top:0px;padding-bottom:0px;text-align: left;"/>');
            $(this).append(input);
            return (input);
        }
    });

}

function initEditable() {
    $('td._txt').editable(function (sVal, settings) {
        //var rowIndex = tblmodules.row($(this).closest('tr')).index();
        return sVal;
    },
    {
        "type": 'remarksInput', "style": 'display: inline;', "onblur": 'submit',
        "event": 'click', "submit": '', "cancel": '', "placeholder": ''
    });
}

function AddUserModule() {
    ajaxWrapper.Get($("#url").data("addusermod"), { "id": $("#txtemp").val(), "mod": $("#txtmodule").val() }, function (x, e) {
        NotifySuccess(x, "Module");
        LoadUserModule($("#txtemp").val());


    });

}
 

function AddModuleFeature() {
    ajaxWrapper.Get($("#url").data("addmenu"), { "mod": $("#url").data("modidfeat"), "feat": $("#txtfeat").val() }, function (x, e) {
        NotifySuccess("Menu Added - " + $("#txtfeat").select2('data').text, "Module");
        LoadModuleFeature($("#url").data("modidfeat"));
    });
    c.Disable('#btnAddAccess', false);
}
function AddNewFearture() {
    console.log('AddNewFearture'); 
    console.log($("#txtNew_ParentMenu").val() );
    console.log($("#txtNew_MenuUrl").val() );
    console.log($("#txtfeatnew").val() );
 
    if ($("#txtfeatnew").val() == "" || $("#txtNew_ParentMenu").val() == "" || $("#txtNew_MenuUrl").val() == "") {
        NotifyError("Fill up Fields!!","Error!! Add Feature!")
    } else
    {
        ajaxWrapper.Get($("#url").data("newmenu"), { "mod": $("#url").data("modidfeat"), "feat": $("#txtfeatnew").val(), "MenuUrl": $("#txtNew_MenuUrl").val(), "ParentId": $("#txtNew_ParentMenu").val()   }, function (x, e) {
                NotifySuccess("Menu Added - " + $("#txtfeatnew").val(), "Module");
                LoadModuleFeature($("#url").data("modidfeat"));
            });
    }

   
}
function AddNewModule() {
    ajaxWrapper.Get($("#url").data("newmenu"), { "mod": $("#url").data("modidfeat"), "feat": $("#txtfeatnew").val() }, function (x, e) {
        NotifySuccess(x, "Module");
        LoadUserModule($("#txtemp").val());
    });
}
function AddFeatureFunction() {
    console.log($("#url").data("addfuncfeat"));
    console.log($("#txtfunction").val());
    console.log($("#txtfunction").select2('val'));
    console.log($("#txtfunction").select2('data'));

    console.log($("#url").data("funcfeatadd"));
    ajaxWrapper.Get($("#url").data("addfuncfeat"), { "id": $("#txtfunction").val(), "feat": $("#url").data("funcfeatadd"), "del": "0" }, function (x, e) {
        NotifySuccess(x, "Function");
        LoadFunctionFeat($("#url").data("funcfeatadd"));
    });
}
 
function LoadFunctionFeat(id) {
    ajaxWrapper.Get($("#url").data("funcfeat"), { id: id }, function (x, e) {
        tblfunc = $("#tblfeaturefunc").DataTable({
            destroy: true,
            paging: false,
            searching: true,
            ordering: true,
            info: false,
            data: x,
            bAutoWidth: false,
            columns: [
                 { data: "id" },
                 { data: "id", className: "_remove_func" },
                 { data: "id" },
                 { data: "text" }
            ],
            fnCreatedRow: function (nRow, aData, iDataIndex) {
                $('td:eq(0)', nRow).html("");
                $('td:eq(1)', nRow).html("<button class='btn btn-sm btn-danger'>Remove</button>");
            }
        });
    });
}
function LoadUserModule(id) {
    console.log(id);

    ajaxWrapper.Get($("#url").data("modaccess"), { id: id }, function (x, e) {

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
    });
}
function LoadModuleUser(id) {

    ajaxWrapper.Get($("#url").data("moduseraccess"), { id: id }, function (x, e) {
        $("#tblmoduleuserlist").DataTable({
            destroy: true,
            paging: false,
            searching: true,
            ordering: true,
            info: false,
            data: x,
            bAutoWidth: false,
            columns: [
                 { data: "EmpID", className: "_remove" },
                 { data: "EmpID" },
                 { data: "EmployeeID" },
                 { data: "EmpName" },
                 { data: "DeptName" }
            ],
            fnCreatedRow: function (nRow, aData, iDataIndex) {
                $('td:eq(0)', nRow).html("<button class='btn btn-danger'>Remove</button>");
            }
        });
        initEditable();
    });
    c.Disable('#btnAddAccess', false);
}
function LoadModuleFeature(id) {
    ajaxWrapper.Get($("#url").data("menu"), { id: id }, function (x, e) {
        console.log('LoadModuleFeature');
        console.log(x);
        $("#tblmenu").DataTable({
            destroy: true,
            paging: false,
            searching: true,
            ordering: true,
            info: false,
            data: x,
            bAutoWidth: false,
           // scrollY: 500,
            columns: [
                 { data: "FeatureID", className: "_save" },
                 { data: "FeatureID", className: "_remove" },
                 { data: "FeatureID", className: "_functions" },
                 { data: "FeatureID" },
                 { data: "Name", className: "_txt" },
                { data: "ParentID", className: "_txt" },
                {
                    title: 'Parent Name', className: '  ', visible: true, searchable: true, width: "10%", sortable: true,
                    "render": function (data, type, full, meta) {
                        console.log(full);
                        var html = '<div class="input-group input-group-sm col-sm-12"> ' +
                            '<span  style="font-size: 10px;"  >' + full.ParentName + '</span>' +
                            ' </div>';
                        return html;
                    }
                },
                 { data: "MenuURL", className: "_txt" },
                 { data: "Deleted", className: "_txt" },
                 { data: "SequenceNo", className: "_txt" },
                 { data: "Bar", className: "_txt" },
                 { data: "NewWindow", className: "_txt" }
            ],
            fnCreatedRow: function (nRow, aData, iDataIndex) {
                $('td:eq(0)', nRow).html("<button class='btn btn-xs btn-success'>Save</button>");
                $('td:eq(1)', nRow).html("<button class='btn btn-xs btn-danger'>Remove</button>");
                $('td:eq(2)', nRow).html("<button class='btn btn-xs btn-info'>Function</button>");
            }
        });
        initEditable();
    });
}
function LoadUserFeatures(id) {
    ajaxWrapper.Get($("#url").data("modaccessfeat"), { id: $("#txtemp").val(), mod: id }, function (x, e) {
        tblmenulist = $("#tblmenulist").DataTable({
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
                 { data: "FID", className: "_add" },
                 { data: "FID", className: "_remove" },
                 { data: "FID", className: "_functions" }


            ],
            fnCreatedRow: function (nRow, aData, iDataIndex) {
                $('td:eq(3)', nRow).html("No");
                var $nRow = $(nRow); // cache the row wrapped up in jQuery
                $nRow.addClass("row_red");
                if (aData["HasAccess"] != "0") {
                    $('td:eq(3)', nRow).html("Yes");
                    $nRow.addClass("row_green");
                }
                $('td:eq(4)', nRow).html("<button class='btn btn-sm btn-success'>Add</button>");
                $('td:eq(5)', nRow).html("<button class='btn btn-sm btn-danger'>Remove</button>");
                $('td:eq(6)', nRow).html("<button class='btn btn-sm btn-info'>Function</button>");
            }
        });
    });
}
function LoadUserFunctions(id) {
    ajaxWrapper.Get($("#url").data("getusrfuncfeat"), { id: $("#txtemp").val(), feat: id }, function (x, e) {
        tblfunc = $("#tblfeaturefunc").DataTable({
            destroy: true,
            paging: false,
            searching: true,
            ordering: true,
            info: false,
            data: x,
            bAutoWidth: false,
            columns: [
                 { data: "id", className: "_add" },
                 { data: "id", className: "_remove" },
                 { data: "id" },
                 { data: "text" }
            ],
            fnCreatedRow: function (nRow, aData, iDataIndex) {
                var $nRow = $(nRow); // cache the row wrapped up in jQuery
                $nRow.addClass("row_red");
                if (aData["HasAccess"] == "Yes") {
                    $nRow.addClass("row_green");
                }
                $('td:eq(0)', nRow).html("<button class='btn btn-sm btn-success'>Add</button>");
                $('td:eq(1)', nRow).html("<button class='btn btn-sm btn-danger'>Remove</button>");
            }
        });
    });
}


function SyncMod() {
    ajaxWrapper.Get($("#url").data("syncmod"), null, function (x, e) {
        Notify(x, "Module");

    });
}
function SyncFeat() {
    //ajaxWrapper.Get($("#url").data("syncfeat"), null, function (x, e) {
    //    Notify(x, "Feature Setup");
    //});
    ajaxWrapper.Get($("#url").data("syncmodfeat"), null, function (x, e) {
        Notify(x, "Module Feauture Setup");
    });
}
function SyncFunc() {
    ajaxWrapper.Get($("#url").data("syncfunc"), null, function (x, e) {
        Notify(x, "Module Function Setup");
    });
}
function Notify(msg, module) {
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": true,
        "progressBar": false,
        "positionClass": "toast-bottom-left",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "0",
        "extendedTimeOut": "0",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
    toastr["success"](msg);
}


function DefaultDisable() {

    c.Disable('#btnAddAccess', false);
    //    c.Disable('#txtstarttime', true);

}


function CopyFromToEmployee() {
    if ($("#fromCopyEmployee").val() == '') {
        NotifyError("Fill up From Employee", "Module");
        return false;
    }
    if ($("#toCopyEmployee").val() == '') {
        NotifyError("Fill up TO Employee", "Module");
        return false;
    }
    
    var YesFunc = function () {
        var deleteoldaccess = c.GetICheck('#copyemptoempradiodeleteold')

        ajaxWrapper.Get($("#url").data("savecopyemployeeaccess"), { FromUserId: $("#fromCopyEmployee").val(), ToUserId: $("#toCopyEmployee").val(), ModuleId: $("#txtCopytomodule").val() == '' ? 0 : $("#txtCopytomodule").val(), DeleteOld: deleteoldaccess }, function (x, e) {
            NotifySuccess(x, "Employee to Employee ");
        });

    };
    c.MessageBoxConfirm("Save Entry?", "Are you sure you want to copy the access? ", YesFunc, null);


}

function initOnload() {

   

}
