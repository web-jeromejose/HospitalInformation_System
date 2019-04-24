var c = new Common();
var tbl;
var tblmodules;
var tblmoduleuser;
var tblmoduleslist;
var tblmenulist;
var tblfunc;

var tblfeaturelist;



$(function () {


    LoadRoles();

    Sel2Server($("#txtroles"), $("#url").data("getroles"), function (dd) {
        console.log(dd.id);
        //alert(dd.id);
        //ajaxWrapper.Get($("#url").data("getmodule"), { roleid: dd.id }, function (x, e) {
        //    Sel2Client($("#txtmodule"), x, function () {
        //    });
        //});

    });

    Sel2Server($("#txtrolestofunc"), $("#url").data("getroles"), function (dd) {
        console.log(dd.id);
 
    });


    


    Sel2Server($("#txtrolestoemp"), $("#url").data("getroles"), function (dd) {
        console.log(dd.id);
        //alert(dd.id);
        //ajaxWrapper.Get($("#url").data("getmodule"), { roleid: dd.id }, function (x, e) {
        //    Sel2Client($("#txtmodule"), x, function () {
        //    });
        //});

    });

    Sel2Server($("#txtEmployee"), $("#url").data("getemployeelist"), function (dd) {
        console.log(dd.id);
        //alert(dd.id);
        //ajaxWrapper.Get($("#url").data("getmodule"), { roleid: dd.id }, function (x, e) {
        //    Sel2Client($("#txtmodule"), x, function () {
        //    });
        //});

    });
    

    Sel2Server($("#txtmodule"), $("#url").data("getmodule"), function (dd) {
        console.log(dd.id);
    });
    
    Sel2Server($("#txtmoduletofunc"), $("#url").data("getmodule"), function (dd) {
        console.log(dd.id);
    });
    
    Sel2Server($("#txtstation"), $("#url").data("getstation"), function (dd) {
        console.log(dd.id);
 
    });
    Sel2Server($("#txtstationtofunc"), $("#url").data("getstation"), function (dd) {
        console.log(dd.id);

    });

    Sel2Server($("#txtStationtoStation"), $("#url").data("getstation"), function (dd) {
        console.log(dd.id);

    });


    c.Disable('#CopyStationtoStationBTN', true);
    Sel2Server($("#txtCopyStation"), $("#url").data("getstation"), function (dd) {
        c.Disable('#CopyStationtoStationBTN', false);

    });




   

    $(document).on("click", "#tblfeaturelist td", function () {
        if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {

          
            var d = tblfeaturelist.row($(this).parents('tr')).data();
            console.log(d);
            if ($(this).hasClass('_add')) {
                $(this).closest("tr").removeClass("row_green");
                $(this).closest("tr").removeClass("row_red");
                ajaxWrapper.Get($("#url").data("addrolefunctions")
                    ,{
                        "roleid": $("#txtrolestofunc").val(), "stationid": $("#txtstationtofunc").val(), "moduleid": $("#txtmoduletofunc").val(), "featureid": d.Feature_Id, "functionid": d.Function_Id
                    }, function (x, e) {
                    NotifySuccess(x, "Module");
                });
                $(this).closest("tr").addClass("row_green");
               // $(this).closest("tr").find('td:eq(3)').text("Yes");
            }
            if ($(this).hasClass('_remove')) {
                $(this).closest("tr").removeClass("row_green");
                $(this).closest("tr").removeClass("row_red");
                ajaxWrapper.Get($("#url").data("removerolefunctions"), {
                    "roleid": $("#txtrolestofunc").val(), "stationid": $("#txtstationtofunc").val(), "moduleid": $("#txtmoduletofunc").val(), "featureid": d.Feature_Id, "functionid": d.Function_Id
                }, function (x, e) {
                    NotifySuccess(x, "Module");
                });
                $(this).closest("tr").addClass("row_red");
                //$(this).closest("tr").find('td:eq(3)').text("No");
            }
            //if ($(this).hasClass('_functions')) {
            //    LoadUserFunctions(d.FeatureID);

            //    $("#modal-func").modal({ "keyboard": true });
            //    $("#url").data("funcfeatadd", d.FeatureID);
            //}

        }
    });



    $('#example-select-all').on('click', function () {
        // Get all rows with search applied
        var rows = tblmenulist.rows({ 'search': 'applied' }).nodes();
        // Check/uncheck checkboxes for all rows in the table
        $('input[type="checkbox"]', rows).prop('checked', this.checked);
    });

    // Handle click on checkbox to set state of "Select all" control
    $('#tblmenulist tbody').on('change', 'input[type="checkbox"]', function () {
        // If checkbox is not checked
        if (!this.checked) {
            var el = $('#example-select-all').get(0);
            // If "Select all" control is checked and has 'indeterminate' property
            if (el && el.checked && ('indeterminate' in el)) {
                // Set visual state of "Select all" control 
                // as 'indeterminate'
                el.indeterminate = true;
            }
        }
    });


  
})


function SavetoStationToStation()
{

    var YesFunc = function () {
        $('#preloader').show();
        c.Disable('#CopyStationtoStationBTN', true);
        $('#CopyStationtoStationBTN').html('Please wait........');
        ajaxWrapper.Get($("#url").data("savestationtostationpermodule"), { OrigstationId: $("#txtStationtoStation").val(), CopystationId: $("#txtCopyStation").val() }, function (x, e) {
            NotifySuccess("Done", "Copy Station DONE");
            c.Disable('#CopyStationtoStationBTN', false);
            $('#CopyStationtoStationBTN').html('COPY Station');
            $('#preloader').hide();
        });
    };
    c.MessageBoxConfirm("Copy Entry?", "Are you sure you want to Copy this Station Module Access Roles to Other Station?", YesFunc, null);



}



function changeoriginalstation()
{
    ajaxWrapper.Get($("#url").data("getmoduleperstation"), { stationid: $('#txtStationtoStation').val()}, function (x, e) {
        $("#tblstationmodulelist").DataTable({
            destroy: true,
            paging: true,
            searching: true,
            ordering: true,
            info: false,
            data: x,
            bAutoWidth: false,
            columns: [
                // { data: "Id", className: "_add" },
               //  { data: "Id", className: "_remove" },
                 //{ data: "Role_Id" },
                 //{ data: "Rolename" },
                 { data: "Module_Id" },
                { data: "Modulename" }
            ],
            fnCreatedRow: function (nRow, aData, iDataIndex) {
                var $nRow = $(nRow); // cache the row wrapped up in jQuery
                //$nRow.addClass("row_red");
                //if (aData["HasAccess"] == "Yes") {
                $nRow.addClass("row_green");
                //}
                //  $('td:eq(0)', nRow).html("<button class='btn btn-sm btn-success'>Add</button>");
                //  $('td:eq(1)', nRow).html("<button class='btn btn-sm btn-danger'>Remove</button>");
            }
        });
    });

}
function txtroletofeattofunction()
{

    
    var ret = false;
    ret = c.IsEmptySelect2('#txtrolestofunc');

    if (ret) {
        c.MessageBoxErr('ERROR!', 'Please select list on Role');
        return false;
    }

    ret = c.IsEmptySelect2('#txtstationtofunc');

    if (ret) {
        c.MessageBoxErr('ERROR!', 'Please select list on Station');
        return false;
    }


    ret = c.IsEmptySelect2('#txtmoduletofunc');

    if (ret) {
        c.MessageBoxErr('ERROR!', 'Please select list in the Module');
        return false;
    }



    ajaxWrapper.Get($("#url").data("getfeaturelistbyrole"), { stationid: $("#txtstationtofunc").val(), moduleid: $("#txtmoduletofunc").val(), roleid: $("#txtrolestofunc").val() }, function (x, e) {
         tblfeaturelist = $("#tblfeaturelist").DataTable({
            destroy: true,
            paging: false,
            searching: true,
            ordering: true,
            info: false,
            data: x,
            bAutoWidth: false,
            columns: [
                 //{
                 //    data: "Feature_Id",
                 //    'targets': 0,
                 //    'searchable': false,
                 //    'orderable': false,
                 //    'className': 'dt-body-center',
                 //    'render': function (data, type, full, meta) {

                 //        return '<input type="checkbox" name="id[]" value="' + $('<div/>').text(data).html() + '">';
                 //        // return '<input type="checkbox" name="id[]" value="">';
                 //    }
                 //},
                { data: "Feature_Id" },
              
                { data: "featname" },
                { data: "funcname" },
                
              
                { data: "Feature_Id", className: "_add" },
                { data: "Feature_Id", className: "_remove" },
 


            ], 'order': [[1, 'asc']],

            fnCreatedRow: function (nRow, aData, iDataIndex) {
                // $('td:eq(4)', nRow).html("No");
                var $nRow = $(nRow); // cache the row wrapped up in jQuery
                $nRow.addClass("row_red");
                console.log('HasAccess->' + aData["HasAccess"]);
                if (aData["HasAccess"] != "0") {    
                 //   $('td:eq(4)', nRow).html("Yes");
                    $nRow.addClass("row_green");
                }
                $('td:eq(3)', nRow).html("<button class='btn btn-sm btn-success'>Add</button>");
                $('td:eq(4)', nRow).html("<button class='btn btn-sm btn-danger'>Remove</button>");
                //$('td:eq(6)', nRow).html("<button class='btn btn-sm btn-info'>Function</button>");

            }
        });
        //initEditable();

    });

}
function ValidatedSaveRoleToEmp() {

    var ret = false;
    ret = c.IsEmptySelect2('#txtrolestoemp');

    if (ret) {
        c.MessageBoxErr('ERROR!', 'Please select list on Role');
        return false;
    }

    ret = c.IsEmptySelect2('#txtEmployee');

    if (ret) {
        c.MessageBoxErr('ERROR!', 'Please select list on Employee');
        return false;
    }

 
    return true;
}

function SaveRoleToEmp()
{

    var ret = ValidatedSaveRoleToEmp();
    if (!ret) return ret;


    var YesFunc = function () {

        ajaxWrapper.Get($("#url").data("insertnewroletoemployee"), { roleid: $("#txtrolestoemp").val(), userid: $("#txtEmployee").val() }, function (x, e) {
            NotifySuccess("Done", "Role To Emp");
        });

    };
    c.MessageBoxConfirm("Save Entry?", "Are you sure you want to SAVE?", YesFunc, null);


}
function NewRole()
{
     
    
    if ($("#txtnewrole").val() == '') {
        c.MessageBoxErr('ERROR!', 'Please input in the new role');
        return false;
    }


    var YesFunc = function () {


        ajaxWrapper.Get($("#url").data("insertnewrole"), { "newrolename": $("#txtnewrole").val(), "desc": $("#txtdesc").val() }, function (x, e) {
            NotifySuccess(x, "Module");
            //LoadUserModule($("#txtemp").val());

        });

    };
    c.MessageBoxConfirm("Save Entry?", "Are you sure you want to SAVE?", YesFunc, null);



}

function Validated() {

    var ret = false;
    ret = c.IsEmptySelect2('#txtroles');

    if (ret) {
        c.MessageBoxErr('ERROR!', 'Please select list on Role');
        return false;
    }

    ret = c.IsEmptySelect2('#txtstation');

    if (ret) {
        c.MessageBoxErr('ERROR!', 'Please select list on Station');
        return false;
    }


    ret = c.IsEmptySelect2('#txtmodule');
 
    if (ret) {
        c.MessageBoxErr('ERROR!', 'Please select list in the Module');
        return false;
    }
    return true;
}

function Save()
{
    var ret = Validated();
    if (!ret) return ret;
        var YesFunc = function () {
            $('#btnsaveFeat').prop('disabled', true);
            NotifyError("Updating.....", "WAIT DONT CLOSE");
             //rush dont question this logic ask ur boss
            interval = setInterval(function () {
                $('#preloader').show();
                NotifyError("Updating.....", "WAIT DONT CLOSE");
            }, 2500);
 
            setTimeout(function () {
                clearInterval(interval);
                $('#preloader').hide();
                NotifySuccess("UPDATE", "DONE");
            }, 30000);

            var def = [];
            $("input:checked", $("#tblmenulist").dataTable().fnGetNodes()).each(function (indexInArray) {
                var data = $(this).val();
                def.push(updateCheck(data));
            });
            //input:checkbox:not(:checked)
            $("input:checkbox:not(:checked)", $("#tblmenulist").dataTable().fnGetNodes()).each(function (indexInArray) {
                var data1 = $(this).val();
               def.push(updateUnCheck(data1));
              //  $('#preloader').show();   
            });

           
          
           

            

          
        };
        c.MessageBoxConfirm("Save Entry?", "Are you sure you want to SAVE?", YesFunc, null);




    

}

function updateCheck($n) {
    var dfd = $.Deferred();
  
    ajaxWrapper.Get($("#url").data("createnewrole"), { "moduleid": $("#txtmodule").val(), "stationid": $("#txtstation").val(), "roleid": $("#txtroles").val(), "featureid": $n }, function (x, e) {       
        dfd.resolve();
    });

    $('#preloader').show();
    return dfd.promise();
}
function updateUnCheck($n) {
    var dfdn = $.Deferred();
 
    ajaxWrapper.Get($("#url").data("deletefeatinrole"), { "moduleid": $("#txtmodule").val(), "stationid": $("#txtstation").val(), "roleid": $("#txtroles").val(), "featureid": $n }, function (x, e) {
       // NotifySuccess(x, "Module");
        dfdn.resolve();
    });

    
    return dfdn.promise();
}


function txtstationchange()
{
    
    ajaxWrapper.Get($("#url").data("dttablefeaturelist"), { stationid: $("#txtstation").val(), moduleid: $("#txtmodule").val(), roleid: $("#txtroles").val() }, function (x, e) {
             tblmenulist = $("#tblmenulist").DataTable({
                destroy: true,
                paging: false,
                searching: true,
                ordering: true,
                info: false,
                data: x,
                bAutoWidth: false,
                columns: [
                     {
                         //data: "Feature_Id",
                         data: getFeatIdandAccess,
                         
                         'targets': 0,
                         'searchable': false,
                         'orderable': false,
                         'className': 'dt-body-center',
                         'render': function (data, type, full, meta) {
                           
                            
                             var c=  data.split("-");
                             var fId=  c[0];
                             var HasAcess = c[1];
                           
                             if (HasAcess === "0")
                             {
                                 return '<input type="checkbox" name="id[]" value="' + $('<div/>').text(fId).html() + '">';

                             } else {
                                 return '<input type="checkbox" name="id[]" value="' + $('<div/>').text(fId).html() + '" checked>';

                             }
                            // return '<input type="checkbox" name="id[]" value="">';
                         }
                     },
                     { data: "Feature_Id" },
                     //{ data: "Name" },
                     { data: "Module_Id" },
                     { data: "Name" },
                     //{ data: "View", className: "_txt" },
                     //{ data: "Save", className: "_txt" },
                     //{ data: "Modify", className: "_txt" },
                     //{ data: "Delete", className: "_txt" },
                     //{ data: "Printing", className: "_txt" },
                     //{ data: "Id", className: "_remove" },
                     //{ data: "Id", className: "_functions" }


                ], 'order': [[1, 'asc']],
              
                fnCreatedRow: function (nRow, aData, iDataIndex) {
                    //$('td:eq(3)', nRow).html("No");
                     var $nRow = $(nRow); // cache the row wrapped up in jQuery
                   $nRow.addClass("row_red");
                   if (aData["HasAccess"] != "0") {
                       
                        $nRow.addClass("row_green");
                    }
                     //$('td:eq(4)', nRow).html("<button class='btn btn-sm btn-success'>Add</button>");
                    //$('td:eq(5)', nRow).html("<button class='btn btn-sm btn-danger'>Remove</button>");
                    //$('td:eq(6)', nRow).html("<button class='btn btn-sm btn-info'>Function</button>");

                }
            });
          //initEditable();
      
        });

}

function getFeatIdandAccess(data, type, dataToSet) {
    return data.Feature_Id + "-" + data.HasAccess;
}
 
function modulechange()
{
   
  
    ajaxWrapper.Get($("#url").data("getrolenamebymoduleid"), { roleid: $("#txtroles").val(), moduleid: $("#txtmodule").val() }, function (x, e) {
        Sel2Client($("#txtstation"), x, function () {
        });
    });



}



function LoadRoles() {
    ajaxWrapper.Get($("#url").data("getallrolelist"), null , function (x, e) {
      $("#tblallRoles").DataTable({
            destroy: true,
            paging: true,
            searching: true,
            ordering: true,
            info: false,
            data: x,
            bAutoWidth: false,
            columns: [
                // { data: "Id", className: "_add" },
               //  { data: "Id", className: "_remove" },
                 { data: "Id" },
                 { data: "Name" },
                { data: "Description" }
            ],
            fnCreatedRow: function (nRow, aData, iDataIndex) {
                var $nRow = $(nRow); // cache the row wrapped up in jQuery
                //$nRow.addClass("row_red");
                //if (aData["HasAccess"] == "Yes") {
                    $nRow.addClass("row_green");
                //}
              //  $('td:eq(0)', nRow).html("<button class='btn btn-sm btn-success'>Add</button>");
              //  $('td:eq(1)', nRow).html("<button class='btn btn-sm btn-danger'>Remove</button>");
            }
        });
    });
}















//**END JFJ*/




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
function AddParent() {
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
    ajaxWrapper.Get($("#url").data("newmenu"), { "mod": $("#url").data("modidfeat"), "feat": $("#txtfeatnew").val() }, function (x, e) {
        NotifySuccess("Menu Added - " + $("#txtfeatnew").val(), "Module");
        LoadModuleFeature($("#url").data("modidfeat"));
    });
}
function AddNewModule() {
    ajaxWrapper.Get($("#url").data("newmenu"), { "mod": $("#url").data("modidfeat"), "feat": $("#txtfeatnew").val() }, function (x, e) {
        NotifySuccess(x, "Module");
        LoadUserModule($("#txtemp").val());
    });
}
function AddFeatureFunction() {
    ajaxWrapper.Get($("#url").data("addfuncfeat"), { "id": $("#txtfunction").val(), "feat": $("#url").data("funcfeatadd"), "del": "0" }, function (x, e) {
        NotifySuccess(x, "Function");
        LoadFunctionFeat($("#url").data("funcfeatadd"));
    });
}
function AddNewFunction() {
    ajaxWrapper.Get($("#url").data("addnewfunc"), { "id": $("#txtnewfunction").val() }, function (x, e) {
        NotifySuccess("Function Added - " + $("#txtnewfunction").val(), "Module");
        ajaxWrapper.Get($("#url").data("funclist"), null, function (x, e) {
            Sel2Client($("#txtfunction"), x, function () {
            });
        });
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
        $("#tblmenu").DataTable({
            destroy: true,
            paging: false,
            searching: true,
            ordering: true,
            info: false,
            data: x,
            bAutoWidth: false,
            columns: [
                 { data: "FeatureID", className: "_save" },
                 { data: "FeatureID", className: "_remove" },
                 { data: "FeatureID", className: "_functions" },
                 { data: "FeatureID" },
                 { data: "Name", className: "_txt" },
                 { data: "ParentID", className: "_txt" },
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
//function LoadUserFeatures(id) {
//    ajaxWrapper.Get($("#url").data("modaccessfeat"), { id: $("#txtemp").val(), mod: id }, function (x, e) {
//        tblmenulist = $("#tblmenulist").DataTable({
//            destroy: true,
//            paging: false,
//            searching: true,
//            ordering: true,
//            info: false,
//            data: x,
//            bAutoWidth: false,
//            columns: [
//                 { data: "FeatureID" },
//                 { data: "ParentName" },
//                 { data: "FeatureName" },
//                 { data: "HasAccess" },
//                 { data: "FID", className: "_add" },
//                 { data: "FID", className: "_remove" },
//                 { data: "FID", className: "_functions" }


//            ],
//            fnCreatedRow: function (nRow, aData, iDataIndex) {
//                $('td:eq(3)', nRow).html("No");
//                var $nRow = $(nRow); // cache the row wrapped up in jQuery
//                $nRow.addClass("row_red");
//                if (aData["HasAccess"] != "0") {
//                    $('td:eq(3)', nRow).html("Yes");
//                    $nRow.addClass("row_green");
//                }
//                $('td:eq(4)', nRow).html("<button class='btn btn-sm btn-success'>Add</button>");
//                $('td:eq(5)', nRow).html("<button class='btn btn-sm btn-danger'>Remove</button>");
//                $('td:eq(6)', nRow).html("<button class='btn btn-sm btn-info'>Function</button>");
//            }
//        });
//    });
//}
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
