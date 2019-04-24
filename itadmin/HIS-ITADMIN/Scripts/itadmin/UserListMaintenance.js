var c = new Common();
var Action = -1;
var ActionIP = 0;
var ActionForPasswordException = 1;

var Select2IsClicked = false;

var tblItemsList;
var tblItemsListId = '#gridItemList'
var tblItemsListDataRow;
var Id;
var DecrpytPass;
var IdPasswordException;
var tblmoduleslist;
var tbluserlockedlist;
var tbliplist;
var webipID = "0";

$(document).ready(function () {
    // SetupDataTables();
    //SetupSelectedPrice();
    InitButton();
    //InitDateTimePicker();
    //var Service = 7;
    //BillprefixDashBoardConnection();
    InitSelect2();
    InitDataTables();
    DefaultValues();
    InitDateTimePicker();
    GetListPasswordException();
    GetListLockedUser();
    GetWebLoginIpList();
    //$('a').tooltip({ placement: "bottom" });
    $('input[type=password][name=pass]').tooltip({
        placement: "bottom",
        trigger: "hover"
    });
    c.ButtonDisable('#btnAdminReset', true);
    //c.Disabled('#btnAdminReset', true);
    //$('#txtPassword').tooltip(show);


   

    $(document).on("click", "#tblmoduleslist td", function () {
 
        var d = tblmoduleslist.row($(this).parents('tr')).data();
        var mod = d.id;
        $("#url").data("modidusr", mod);
        if ($(this).hasClass('_remove')) {

            var entry;
            entry = []
            entry = {}

            entry.Action = 3;
            entry.userid = mod;

            $.ajax({
                url: $('#url').data("passwordexceptsave"),
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

                        if (Action == 3) {

                        }

                        Action = 0;

                    };
                    GetListPasswordException();
                    c.MessageBox(data.Title, data.Message, OkFunc);
                },
                error: function (xhr, desc, err) {
                    c.ButtonDisable('#btnSave', false);
                    var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
                    c.MessageBox("Error...", errMsg, null);
                }
            });
        }
        else {
           // LoadUserFeatures(mod);
        }
    });

    $(document).on("click", "#tbluserlockedlist td", function () {

        var d = tbluserlockedlist.row($(this).parents('tr')).data();
        var modlock = d.Id;
      
        if ($(this).hasClass('_remove')) {

            var YesFunc = function () {
                var entry;
                entry = []
                entry = {}

                entry.Action = 3;
                entry.userid = modlock;

                $.ajax({
                    url: $('#url').data("userlockedsave"),
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

                            if (Action == 3) {

                            }

                            Action = 0;

                        };
                        GetListLockedUser();
                        c.MessageBox(data.Title, data.Message, OkFunc);
                    },
                    error: function (xhr, desc, err) {
                        c.ButtonDisable('#btnSave', false);
                        var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
                        c.MessageBox("Error...", errMsg, null);
                    }
                });

            };
            c.MessageBoxConfirm("Unlocked Employee?", "Are you sure you want to unlocked the employee?", YesFunc, null);

            
        }
        else {
            // LoadUserFeatures(mod);
        }
    });

    $(document).on("click", "#tbliplist td", function () {

        var d = tbliplist.row($(this).parents('tr')).data();
          webipID = d.Id;
         
        console.log('tbliplist');
        console.log(d);

        if ($(this).hasClass('_remove')) {

            var YesFunc = function () {
                var entry;
                entry = []
                entry = {}

                entry.Action = 3;
                entry.Id = webipID;
                /*
                 public int Action { get; set; }
        public string Id { get; set; }
        public string IpAddress { get; set; }
        public string BranchIP { get; set; }
        public string DepartmentId { get; set; }
        public string Deptname { get; set; }
        public int OperatorId { get; set; }
                */
                $.ajax({
                    url: $('#url').data("webipsave"),
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

                            if (Action == 3) {

                            }

                            Action = 0;

                        };
                        GetWebLoginIpList()
                        c.MessageBox(data.Title, data.Message, OkFunc);
                    },
                    error: function (xhr, desc, err) {
                        c.ButtonDisable('#btnSave', false);
                        var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
                        c.MessageBox("Error...", errMsg, null);
                    }
                });

            };
            c.MessageBoxConfirm("Delete Record?", "Are you sure you want to delete this record?", YesFunc, null);
        }
        else {
            
            $('#btnAddIPList').hide();
            $('#btnUpdateIPList').show();
            $('#btnNewIPList').show();

            c.SetValue('#IpAddress',d.IpAddress);
            c.SetValue('#BranchIp',d.BranchIP);
            c.SetSelect2('#select2Dept', d.DepartmentId, d.Deptname);
        }
    });


   

});


function GetListLockedUser() {

    ajaxWrapper.Get($("#url").data("userlockedlist"), null, function (x, e) {

        tbluserlockedlist = $("#tbluserlockedlist").DataTable({
            destroy: true,
            paging: false,
            searching: true,
            ordering: true,
            info: false,
            data: x,
            bAutoWidth: false,
            columns: [
                 { data: "Name" },
                 { data: "Deptname" },
                 { data: "Id", className: "_remove" }
            ],
            fnCreatedRow: function (nRow, aData, iDataIndex) {
                var $nRow = $(nRow);
                $nRow.addClass("row_green");
                $('td:eq(2)', nRow).html("<button class='btn btn-sm btn-danger'>Unlocked</button>");
            }
        });
    });
}


function GetWebLoginIpList() {

    ajaxWrapper.Get($("#url").data("listwebip"), null, function (x, e) {

        tbliplist = $("#tbliplist").DataTable({
            destroy: true,
            paging: false,
            searching: true,
            ordering: true,
            info: false,
            data: x,
            bAutoWidth: false,
            columns: [
                 { data: "IpAddress" },
                 { data: "BranchIP" },
                 { data: "Deptname" },
                 { data: "Id", className: "_remove" },
                 
            ],
            fnCreatedRow: function (nRow, aData, iDataIndex) {
                var $nRow = $(nRow);
                $nRow.addClass("row_green");
                $('td:eq(3)', nRow).html("<button class='btn btn-sm btn-danger'>Delete</button>");
             }
        });
    });
}


function GetListPasswordException()
{

    ajaxWrapper.Get($("#url").data("exceppaccess"), { id: 1 }, function (x, e) {

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
                 { data: "deptname" },
                 { data: "id", className: "_remove" }
            ],
            fnCreatedRow: function (nRow, aData, iDataIndex) {
                var $nRow = $(nRow);
                $nRow.addClass("row_green");
                $('td:eq(2)', nRow).html("<button class='btn btn-sm btn-danger'>Remove</button>");
            }
        });
    });
}

function RedrawGrid() {
    // TblGridSequence.columns.adjust().draw();

    if (tblItemsList !== undefined) tblItemsList.columns.adjust().draw();
    

}

$(document).on("click", tblItemsListId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');
        tr.toggleClass('selected');
        tblItemsListDataRow = tblItemsList.row($(this).parents('tr')).data();
        //var Service = c.GetSelect2Id('#select2PackageType');
        var StationId = tblItemsListDataRow.StationId;
        var Name = tblItemsListDataRow.BillPrefix;
        var BillType = tblItemsListDataRow.Type;
       //var TariffName = tblItemsListDataRow.Name;
        //c.ModalShow('#modalEntry', true);
       //c.DisableSelect2('#txtTariff', true);
        //View(DoctorId);
        DefaultDisable();
        Action = 2;
        View(StationId, Name, BillType);
 
    }



});

function InitDataTables() {
    //BindSequence([]);
    BindListofItem([]);
    //BindWithPriceListofItem([]);
}

function DefaultEmpty() {
    c.SetValue('#txtName', ' ');
    c.SetValue('#txtCode', ' ');
    c.SetValue('#txtCostPrice', ' ');
    //c.SetSelect2('#select2PackageType', '7', 'Procedure');
    // c.iCheckSet('#iChkLast3Mos', true);

    c.SetSelect2('#Select2Department', 0, 'Search');
    
}

function DefaultValues() {


}

function InitSelect2() {
    // Sample usage


    Sel2Server($("#select2UserPasswordReset"), $("#url").data("selectuserlist"), function (d) {
    
    });
  
    $("#Select2IsSuperUser").select2({
        data: [{ id: 1, text: 'Yes' },
               { id: 2, text: 'No'}],  
        minimumResultsForSearch: -1 
    }).change(function (e) {
        var list = e.added.list;
        //var Service = c.GetSelect2Id('#select2PackageType');
        //ShowListPackage(Service);
        //c.SetValue('#txtName', ' ');
    });

  

    $('#select2Userlist').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: $("#url").data("fetchuserinfo"),
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    //Id: c.GetSelect2Id('#select2Userlist')

                };
            },

            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }

        }


    }).change(function (e) {
        var list = e.added;
        var Id = c.GetSelect2Id('#select2Userlist');
        View(Id);
        //c.SetValue('#UserName', list[0]);
        //c.SetDateTimePicker('#dtEffectivity', list[1]);
        //c.SetValue('#txtQuestion1', list[2]);
        //c.SetValue('#txtQuestion2', list[3]);
        //c.SetValue('#SecAnswer1', list[4]);
        //c.SetValue('#SecAnswer2', list[5]);
        //c.SetValue('#txtMobile', list[6]);
        //c.SetValue('#txtEmail', list[7]);

    });

    Sel2Server($("#select2UserlistPasswordException"), $("#url").data("selectuserlist"), function (d) {
        //alert(d.tariffid);
        var IdPasswordException = (d.id);
    });


    Sel2Server($("#select2Userlist"), $("#url").data("selectuserlist"), function (d) {
        //alert(d.tariffid);
        var Id = (d.id);
        //View(Id);
        //var CompanyID = (d.id);
        //var tarrifId = (d.tariffid);
        //var list = e.added.list;
        //var CategoryId = (d.id);
        //InvenItemMarkupConnection(CategoryId, TypeId)
        //var CategoryId = c.GetSelect2Id('#Select2DeptStation');
        //var Id = (d.id);
        //ReroutingItem(Id);

    });
 

    Sel2Server($("#select2UserReset"), $("#url").data("selectuserlistwithuserauthentic"), function (d) {
        //alert(d.tariffid);
        Id = (d.id);
        Viewselect2UserReset(Id);
        //var CompanyID = (d.id);
        //var tarrifId = (d.tariffid);
        //var list = e.added.list;
        //var CategoryId = (d.id);
        //InvenItemMarkupConnection(CategoryId, TypeId)
        //var CategoryId = c.GetSelect2Id('#Select2DeptStation');
        //var Id = (d.id);
        //ReroutingItem(Id);
        c.ButtonDisable('#btnAdminReset', false);
    });


    ajaxWrapper.Get($("#url").data("getdeptlist"), null, function (xx, e) {
        Sel2Client($("#select2Dept"), xx, function (x) {
             
        })
    });



}

function InitButton() {
    var NoFunc = function () {
    };



    // Sample usage
    //$('#btnProcess').click(function () {

    //    var RegNo = c.GetValue('#txtRegno');
    //    if (RegNo == '') {
    //       RegNo = -1
    //    } 
    //    var FromDate = c.GetDateTimePickerDate('#dtFrom');
    //    var ToDate = c.GetDateTimePickerDate('#dtTo');
    //    Requisitionlist(RegNo, FromDate, ToDate);
    //});

    
    $('#btnNewIPList').show();
    $('#btnAddIPList').hide();
    $('#btnUpdateIPList').hide();

    $('#btnNewIPList').click(function () {
        $('#btnAddIPList').show();
        $('#btnUpdateIPList').hide();
        $('#btnNewIPList').hide();

        c.SetValue('#IpAddress', '');
        c.SetValue('#BranchIp','');
        c.SetSelect2('#select2Dept','', '---');

    });
    

    $('#btnUpdateIPList').click(function () {
        if ($('#IpAddress').val() == "") {
            c.MessageBoxErr('Empty', "You didn't enter a IP Address.");
            return false;
        }
        if ($('#BranchIp').val() == "") {
            c.MessageBoxErr('Empty', "You didn't enter a Branch.");
            return false;
        }

        if ($('#select2Dept').val() == "") {
            c.MessageBoxErr('Empty', "You didn't select a Department.");
            return false;
        }

        var YesFunc = function () {
            ActionIP = 2;
 
            SaveIPLIST();
            $('#btnAddIPList').hide();
            $('#btnUpdateIPList').hide();
            $('#btnNewIPList').show();
            webipID = "0";
            c.SetValue('#IpAddress', '');
            c.SetValue('#BranchIp', '');
            c.SetSelect2('#select2Dept', '', '---');


        };
        c.MessageBoxConfirm("Save Entry?", "Are you sure you want to Save the Entry?", YesFunc, null);
    });


    $('#btnProcess').click(function () {
        Process();
    });

    $('#btnAddEmployeePasswordException').click(function () {
        ActionForPasswordException = 1;
        AddEmployeeException();
    });

    
    $('#btnAddIPList').click(function () {

        if ($('#IpAddress').val() == "") {
            c.MessageBoxErr('Empty', "You didn't enter a Ip Address.");
            return false;
        } else if ($('#BranchIp').val() == "") {
            c.MessageBoxErr('Empty', "You didn't enter a Branch.");
            return false;
        } else if ($('#select2Dept').val() == "") {
            c.MessageBoxErr('Empty', "You didn't select a Department.");
            return false;
        } 

        var YesFunc = function () {
            ActionIP = 1;

           
            $('#btnAddIPList').hide();
            $('#btnUpdateIPList').hide();
            $('#btnNewIPList').show();
            SaveIPLIST();
            webipID = "0";
            c.SetValue('#IpAddress', '');
            c.SetValue('#BranchIp', '');
            c.SetSelect2('#select2Dept', '', '---');
           

        };
        c.MessageBoxConfirm("Save Entry?", "Are you sure you want to Save the Entry?", YesFunc, null);

    });

    
    $('#btnSave').click(function () {
        var YesFunc = function () {
            Action = 1;
            Save();
        };
        c.MessageBoxConfirm("Save Entry?", "Are you sure you want to Add the Entry?", YesFunc, null);

    });


    $('#btnReset').click(function () {
        var YesFunc = function () {
            Action = 1;
            Reset();
        };
        c.MessageBoxConfirm("Reset Entry?", "Are you sure you want to Reset?", YesFunc, null);

    });


    $('#btnAdminReset').click(function () {

                var YesFuncMain = function () {
                    Action = 2;
                    Save();
                };

                var YesFunc = function ()
                {
                    var data = $('#select2UserReset').select2('data')
                    //for WIPRO - EXPIRED ONLY
                  //  c.MessageBoxConfirm("EXPIRED_" + c.GetSelect2Id('#select2UserReset'), "The ResetPassword for <b>" + data.text + "</b> is <b>EXPIRED" + c.GetSelect2Id('#select2UserReset') + "</b> <br>Confirmed? <b>Please take note or tell the User.</b>", YesFuncMain, null);
                    c.MessageBoxConfirm("EXPIRED", "The Reset Password for <b>" + data.text + "</b>  is <b>EXPIRED</b>  <br>Confirmed? <b>Please take note or tell the User.</b>", YesFuncMain, null);
                };
            c.MessageBoxConfirm("Admin Reset Entry?", "Are you sure you want to Admin Reset the Entry?", YesFunc, null);

    });

    $('#btnReportGen').click(function () {

        //  print_preview();

        $('#myModal').modal('show');
        PrintPreview();

    });

    $('#btnNew').click(function () {
        DefaultEmpty();
        //  print_preview();
        //c.DisableSelect2('#select2DoctorCode', false);
        c.DisableSelect2('#Select2Stations', false);
        c.DisableSelect2('#Select2BillType', false);

        c.Disable('#txtPrefix', false);
        Action = 1;
        c.ModalShow('#modalEntry', true);
        

    });


    //$('#btnAddScientificAchievement').click(function () {
    //    var ctr = $(tblScientificAchievementListId).DataTable().rows().nodes().length + 1;
    //    tblScientificAchievement.row.add({
    //        "SNo": ctr,
    //        "ScientificAchievement": "",
    //        "TransAchievementYear": "",
    //        "Awards": "",
    //        "Remarks": "",
    //        "EmpId": Action == 1 ? "" : GetID,
    //        "AchievementYear": ""
    //    }).draw();
    //    InitSelectedScientificAchievement();
    //});

    $('#btnNewResetPassword').click(function () {
        if (c.GetSelect2Id('#select2UserPasswordReset') == "") {
            c.MessageBoxErr('Empty', "You didn't enter a employee");
            //alert(pswd);
            return false;
        }


        var YesFunc = function () {

         


            $.ajax({
                url: $('#url').data("forceresetpassword"),
                data: JSON.stringify({ EmpId: c.GetSelect2Id('#select2UserPasswordReset') }),
                type: 'post',
                cache: false,
                contentType: "application/json; charset=utf-8",
                beforeSend: function () {

                    c.ButtonDisable('#btnNewResetPassword', true);
                    //c.ButtonDisable('#btnModify', true);
                },
                success: function (data) {
                    //c.ButtonDisable('#btnModify', false);
                    c.ButtonDisable('#btnNewResetPassword', false);

                    console.log(data);

                    if (data.ErrorCode == 0) {
                        c.MessageBoxErr("Error...", data.Message);
                        return;
                    }

                    var OkFunc = function () {

                       
 
                    };

                    c.MessageBox('Success','Employee set Password to EXPIRED. PLEASE LOGIN and change the password. / or Go to CHANGE PASSWORD TAB', OkFunc);
                },
                error: function (xhr, desc, err) {
                    c.ButtonDisable('#btnNewResetPassword', false);
                    var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
                    c.MessageBox("Error...", errMsg, null);
                }
            });

          
        };
        c.MessageBoxConfirm("Force Reset Password?", "Are you sure you want to FORCE Reset?", YesFunc, null);

    });


}
function AddEmployeeException() {

    var entry;
    entry = []
    entry = {}

    entry.Action = ActionForPasswordException;
    entry.userid = c.GetSelect2Id('#select2UserlistPasswordException');
 
    $.ajax({
        url: $('#url').data("passwordexceptsave"),
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

                if (Action == 3) {
 
                }

                Action = 0;
 
            };
            GetListPasswordException();
            c.MessageBox(data.Title, data.Message, OkFunc);
        },
        error: function (xhr, desc, err) {
            c.ButtonDisable('#btnSave', false);
            var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
            c.MessageBox("Error...", errMsg, null);
        }
    });


}
function DefaultDisable() {
    // Sample usage
    //c.SetValue('#', '30');
    //c.DisableDateTimePicker('#dtMonth', true);
    c.DisableSelect2('#Select2Stations', true);
    c.DisableSelect2('#Select2BillType', true);

    c.Disable('#txtPrefix', true);
   

}

function HandleButtonNotUse() {
    $('.NotUse').hide();
}

function HandleEnableEntries() {
    // VAED
    if (Action == 0 || Action == 3) { // view or delete
        //c.Disable('#txtProfileName', true);

    }
    else if (Action == 1) { // add
        //c.Disable('#txtProfileName', false);

    }
    else if (Action == 2) { // edit    
        //c.Disable('#txtProfileName', true);

    }
    else {
        c.Show('#Entry', false);
        c.Show('#DashBoard', true);
    }

}

function InitDateTimePicker() {
    // Sample usage
 

    //$('.datepicker').datepicker({
    //    autoclose: true,
    //    todayHighlight: true,
    //    format: "dd/mm/yyyy"
    //});

    $('#dtEffectivity').datetimepicker({
        picktime: false,
     //   format: 'mm-yyyy'
    }).on('dp.change', function (e) {
        //c.SetDateTimePicker('#dtMonth');
        //var a = $('#dtfrom').data("DateTimePicker").getDate();
        //var b = moment(a).format(dateFormatOnDisplay);
        //c.SetDateTimePicker('#dtfrom', new Date(year, month, 1));
    });
    //$('#dtTo').datetimepicker({
    //    picktime: false
    //}).on('dp.change', function (e) {

    //});

    //$('#dtProceduredoneon').datetimepicker({
    //    picktime: true
    //}).on('dp.change', function (e) {
    //    //var a = $('#dtfrom').data("DateTimePicker").getDate();
    //    //var b = moment(a).format(dateFormatOnDisplay);
    //    //c.SetDateTimePicker('#dtfrom', b);
    //});
}

function DefaultEmpty() {
    // Sample usage
    c.SetValue('#txtPrefix', ' ');

    //c.SetSelect2('#select2PackageType', '7', 'Procedure');
    // c.iCheckSet('#iChkLast3Mos', true);
    c.SetSelect2('#Select2Stations', ' ', ' ');
    c.SetSelect2('#Select2BillType', ' ', ' ');

}

function Momentdatetime(value) {
    return moment(value).format("DD-MMM-YYYY");//moment().format('l h:mm:ss A');
  
}

function Viewselect2UserReset(Id) {

    var Url = $('#url').data("getuserinfo");
    //var Url = baseURL + "ShowSelected";
    var param = {
        Id: Id

    };

    $('#preloader').show();
    //$('.Hide').hide();
    console.log('getuserinfo');
    console.log(param);
    ajaxWrapper.Get(Url, param, function (x) {

        console.log(x);
        console.log('view from select2UserReset');

        c.SetValue('#enryppassword', x.DecrpytPass);
 
        $('#preloader').hide();

    });


}


function View(Id) {

    var Url = $('#url').data("getuserinfo");
    //var Url = baseURL + "ShowSelected";
    var param = {
        Id: Id
       
    };

    $('#preloader').show();
    //$('.Hide').hide();
    console.log('getuserinfo');
    console.log(param);
    ajaxWrapper.Get(Url, param, function (x) {
        //  alert(x.DecrpytPass);
        console.log(x);
        c.SetValue('#txtEmail', x.Email);
        c.SetValue('#txtMobile', x.Mobile);
        c.SetValue('#txtQuestion1', x.Question1);
        //$('#txtresetquestion1').html(x.Question1.toLowerCase() == 'default' || x.Question1.toLowerCase() == '' ? 'Security Answer1:' : x.Question1);
       // $('#txtresetquestion2').html(x.Question2);
   
        c.SetValue('#txtQuestion2', x.Question2);
        c.SetValue('#enryppassword', x.DecrpytPass);
        c.SetValue('#SecAnswer1', x.SecAnswer1);
        c.SetValue('#SecAnswer2', x.SecAnswer2);
        console.log(x.EffectivityDate);
        console.log(Momentdatetime(x.EffectivityDate));
    //  c.SetDateTimePicker('#dtEffectivity', Momentdatetime(x.EffectivityDate));
       c.SetDateTimePicker('#dtEffectivity', x.EffectivityDate);
      
        $('#preloader').hide();

        //    error: function (xhr, desc, err) {
        //        $('#preloader').hide();

        //        var errMsg = err + "<br>" + desc;
        //        c.MessageBoxErr(errMsg);
        //    }


    });
 

}

//function View(Id) {

//    var Url = $('#url').data("listinformation");
//    //var Url = baseURL + "ShowSelected";
//    var param = {
//        Id: Id

//    };

//    $('#preloader').show();
//    //$('.Hide').hide();

//    $.ajax({
//        url: Url,
//        data: param,
//        type: 'get',
//        contentType: 'application/json; charset=utf-8',
//        dataType: 'json',
//        cache: false,
//        beforeSend: function () {

//        },
//        success: function (result) {
//            $('#preloader').hide();
//            $('.Show').show();

//            //if (FetchFindingsResults.length == 0) {
//            //    c.MessageBoxErr("Deleted...", "The selected record doesn't exist and already been deleted.", null);
//            //    tblRequisitionList.row('tr.selected').remove().draw(false);
//            //    return;
//            //}

//            var data = result.list[0];
//            c.SetValue('#txtEmail', data.Email);
//            c.SetValue('#txtMobile', data.Mobile);
//            c.SetValue('#txtQuestion1', data.Question1);
//            c.SetValue('#txtQuestion2', data.Question2);
//            c.SetDateTimePicker('#dtEffectivity', moment(data.EffectivityDate));
//            c.SetValue('#extpassword', data.Password);


//            //HandleEnableEntries();
//            //c.ModalShow('#modalEntry', true);
//            //RedrawGrid();
           
//        },
//        error: function (xhr, desc, err) {
//            $('#preloader').hide();
//            var errMsg = err + "<br>" + desc;
//            c.MessageBoxErr(errMsg);
//        }
//    });

//}

//-------------------List-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function BindListofItem(data) {

    tblItemsList = $(tblItemsListId).DataTable({
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
        autoWidth: true,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        columns: ShowListColumns()
        //fnRowCallback: ShowCompatabilityRowCallBack()
    });

    //InitSelected();
}

function ShowListColumns() {
    var cols = [
      { targets: [0], data: "SNo", className: '', visible: true, searchable: false, width: "1%" },
      { targets: [1], data: "Station", className: '', visible: true, searchable: true, width: "30%" },
      { targets: [2], data: "Type", className: '', visible: true, searchable: true, width: "20%" },
      { targets: [3], data: "BillPrefix", className: '', visible: true, searchable: true, width: "20%" },
      { targets: [4], data: "StationId", className: '', visible: false, searchable: false },
     
     

    ];
    return cols;
}

function BillprefixDashBoardConnection() {

    var Url = $('#url').data("getbilldashboard");
    $('#preloader').show();
    //$('#loadingpdf').show();
    // $("#grid").css("visibility", "hidden");

    $.ajax({
        url: Url,
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false,
        beforeSend: function () {

        },
        success: function (data) {

            BindListofItem(data.list);
            $('#preloader').hide();
            //RedrawGrid();
        },
        error: function (xhr, desc, err) {
            //$('#loadingpdf').hide();
            $('#preloader').hide();
            var errMsg = err.responseText + "<br>" + desc;
            c.MessageBoxErr(errMsg);

        }
    });
}


//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Validated() {

    var ret = false;

    ret = c.IsEmpty('#txtPassword');
    if (ret) {
        c.MessageBoxErr('Empty', "You didn't enter a password");
        return false;
    }
    
    //var ret = c.IsEmpty('#');

    //if (ret) {
    //    c.MessageBoxErr('Incorrect', 'Confirm Password not match');
    //    return false;

    //}


    return true;

}


function ValidatedPassword()
{
    var ret = false;
    var pswd = $('#txtPassword').val();
    var confrmpswd = $('#txtConfirmPassword').val();
    var error = "";
    var illegalChars = /[\W]/; // allow only letters and numbers
    var CapitalChar = /[A-Z]+/; // allow one Capital Letter
    //ret = c.IsEmpty('#txtPassword');
    //if (ret) {
    //    c.MessageBoxErr('Empty', "You didn't enter a password");
    //    return false;
    //}
    if (Action !== 2) {

        if (pswd == "") {
            c.MessageBoxErr('Empty', "You didn't enter a password");
            //alert(pswd);
            return false;
        }
        else if (!CapitalChar.test(pswd)) {
            c.MessageBoxErr('Incorrect', "The password must contain at least one uppercase.");
            return false;

        }
        else if ((pswd.length < 8) || (pswd.length > 10)) {
            c.MessageBoxErr('Incorrect', "The password is wrong length. Maximum 10 characters only.");
            return false;

        } else if (illegalChars.test(pswd)) {

            c.MessageBoxErr('Incorrect', "The password contains illegal characters.");
            return false;
        } else if ((pswd.search(/[a-zA-Z]+/) == -1) || (pswd.search(/[0-9]+/) == -1)) {

            c.MessageBoxErr('Incorrect', "The password must contain at least one numeral.");
            return false;
        } else if (confrmpswd != pswd) {

            c.MessageBoxErr('Not Match', "Confirm password not match.");
            return false;
        }
        //} else if (pswd != $('#dcryptpassword').val()) {
        //    c.MessageBoxErr('Incorrect', "The password not match..");
        //    return false;
        //}

    }

    ret = c.IsEmpty('#select2UserReset');
    if (ret) {
        c.MessageBoxErr('Empty', "You didn't enter a valid User");
        return false;
    }


    return true;
}


function ValidatedResetPassword() {
    var ret = false;
    var Oldpswd = $('#enryppassword').val();
    var entryoldpswd = $('#txtOldPassword').val();
    var newpswd = $('#txtNewPassword').val();
    var confrmrstpswd = $('#txtresitConfirmPassword').val();
    // var svanswr1 = $('#SecAnswer1').val();
    //  var svanswr2 = $('#SecAnswer2').val();
    // var answr1 = $('#txtresetAnswer1').val();
    //var answr2 = $('#txtresetAnswer2').val();
   
    var error = "";
    var illegalChars = /[\W]/; // allow only letters and numbers
    var CapitalChar = /[A-Z]+/; // allow one Capital Letter

    //ret = c.IsEmpty('#txtPassword');
    //if (ret) {
    //    c.MessageBoxErr('Empty', "You didn't enter a password");
    //    return false;
    //}
    console.log(entryoldpswd);
    console.log(newpswd);
    console.log(confrmrstpswd);
    if (newpswd == "") {
        c.MessageBoxErr('Empty', "You didn't enter a new password");
        //alert(pswd);
        return false;
    }

    else if (!CapitalChar.test(newpswd)) {
        c.MessageBoxErr('Incorrect', "The password must contain at least one uppercase.");
        return false;

    } else if ((newpswd.length < 8) || (newpswd.length > 10)) {
        c.MessageBoxErr('Incorrect', "The password is wrong length. Maximum 10 Characters only");
        return false;

    } else if (illegalChars.test(newpswd)) {

        c.MessageBoxErr('Incorrect', "The password contains illegal characters.");
        return false;
    } else if ((newpswd.search(/[a-zA-Z]+/) == -1) || (newpswd.search(/[0-9]+/) == -1)) {

        c.MessageBoxErr('Incorrect', "The password must contain at least one numeral1.");
        return false;
    } else if (Oldpswd != entryoldpswd) {
        console.log(Oldpswd);
        console.log(entryoldpswd);
        c.MessageBoxErr('Not Match', "Old password not match.");
        return false;

    } else if (newpswd != confrmrstpswd) {
        c.MessageBoxErr('Not Match', "The Confirm password not match..");
        return false;
    } else if (Oldpswd == "") {

        c.MessageBoxErr('Empty', "You didn't enter an Old password");
        return false;
    }
    //else if (svanswr1 !== answr1) {

    //    c.MessageBoxErr('Incorrect', "The security Answer1 not match..");
    //    return false;

    //}
    //else if (svanswr2 !== answr2) {

    //    c.MessageBoxErr('Incorrect', "The security Answer2 not match..");
    //    return false;

    //}



    return true;
}

function SaveIPLIST()
{
 
 


    var entry;
    entry = []
    entry = {}

    entry.Action = ActionIP;
  
    entry.Id = webipID;
    entry.IpAddress = $('#IpAddress').val();
    entry.BranchIP = $('#BranchIp').val();
    entry.DepartmentId = $('#select2Dept').val();
    console.log('entryIP');
    console.log(entry);
    $.ajax({
        url: $('#url').data("webipsave"),
        data: JSON.stringify(entry),
        type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {

        },
        success: function (data) {
            ActionIP = 0;
            console.log(data);

            if (data.ErrorCode == 0) {
                c.MessageBoxErr("Error...", data.Message);
                return;
            }

            var OkFunc = function () {
  
            };
            GetWebLoginIpList()
            c.MessageBox(data.Title, data.Message, OkFunc);
        },
        error: function (xhr, desc, err) {
            c.ButtonDisable('#btnSave', false);
            var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
            c.MessageBox("Error...", errMsg, null);
        }
    }); 




}
function Save() {

    var ret = ValidatedPassword();
    if (!ret) return ret;

    var entry;
    entry = []
    entry = {}

    entry.Action = Action;
    var Id = c.GetSelect2Id('#select2Userlist');
    entry.Id = c.GetSelect2Id('#select2Userlist');
    if (entry.Id == "") {
        entry.Id = c.GetSelect2Id('#select2UserReset');
    }
 
    if (Action == 2) {//admin reset
        //for WIPRO - EXPIRED ONLY
       // entry.Password = 'EXPIRED_' + entry.Id;
        entry.Password = 'EXPIRED';
    } else
    {
        entry.Password = $('#txtPassword').val();
    }
    entry.Name = $('#UserName').val();
   
    entry.Email = $('#txtEmail').val();
    entry.Mobile = $('#txtMobile').val();
    entry.Question1 = $('#txtQuestion1').val();
    entry.Question2 = $('#txtQuestion2').val();
    entry.SecAnswer1 = $('#txtAnswer1').val();
    entry.SecAnswer2 = $('#txtAnswer2').val();
    entry.EffectivityDate = c.GetDateTimePickerDateTimeSCS('#dtEffectivity');
   
    console.log(entry);
    //entry.BillTypeId = c.GetSelect2Id('#Select2BillType');
    
    $.ajax({
        url: $('#url').data("save"),
        data: JSON.stringify(entry),
        type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {

            c.ButtonDisable('#btnSave', true);
            //c.ButtonDisable('#btnModify', true);
        },
        success: function (data) {
            //c.ButtonDisable('#btnModify', false);
            c.ButtonDisable('#btnSave', false);

            if (data.ErrorCode == 0) {
                c.MessageBoxErr("Error...", data.Message);
                return;
            }

            var OkFunc = function () {

                if (Action == 3) {
                    //                    tblScientificAchievement.row('tr.selected').remove().draw(false);
                    //                    tblTrainingDetails.row('tr.selected').remove().draw(false);
                    //tblFamilyDetails.row('tr.selected').remove().draw(false);
                    //                    tblRelationShipDetails.row('tr.selected').remove().draw(false);
                    //                    tblPreviousExpDetails.row('tr.selected').remove().draw(false);
                    //                    tblQualificationDetails.row('tr.selected').remove().draw(false);
                }

                Action = 0;
                //HandleEnableButtons();
                //HandleEnableEntries();
                //BillprefixDashBoardConnection();
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



function Reset() {

    var ret = ValidatedResetPassword();
    if (!ret) return ret;

    var entry;
    entry = []
    entry = {}

    entry.Action = 3;
    entry.Id = Id;
    entry.Password = $('#txtNewPassword').val();

  
   ///entry.EffectivityDate = c.GetDateTimePickerDateTimeSCS('#dtEffectivity');
    //entry.BillTypeId = c.GetSelect2Id('#Select2BillType');

    $.ajax({
        url: $('#url').data("save"),
        data: JSON.stringify(entry),
        type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {

            c.ButtonDisable('#btnSave', true);
            //c.ButtonDisable('#btnModify', true);
        },
        success: function (data) {
            //c.ButtonDisable('#btnModify', false);
            c.ButtonDisable('#btnSave', false);

            console.log(data);

            if (data.ErrorCode == 0) {
                c.MessageBoxErr("Error...", data.Message);
                return;
            }

            var OkFunc = function () {

                if (Action == 3) {
                    //                    tblScientificAchievement.row('tr.selected').remove().draw(false);
                    //                    tblTrainingDetails.row('tr.selected').remove().draw(false);
                    //tblFamilyDetails.row('tr.selected').remove().draw(false);
                    //                    tblRelationShipDetails.row('tr.selected').remove().draw(false);
                    //                    tblPreviousExpDetails.row('tr.selected').remove().draw(false);
                    //                    tblQualificationDetails.row('tr.selected').remove().draw(false);
                }

                Action = 0;
                //HandleEnableButtons();
                //HandleEnableEntries();
                //BillprefixDashBoardConnection();
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