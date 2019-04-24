var c = new Common();
var Action = -1;

var Select2IsClicked = false;

var tblItemsList;
var tblItemsListId = '#tblmoduleslist'
var tblItemsListDataRow;

//var tblItemsWithPriceList;
//var tblItemsWithPriceListId = '#gridListWithPrice'
//var tblItemsWithPriceListDataRow;

var tblmoduleslist;

var OrderId;
var ProcedureId;
var RequestedId;

$(document).ready(function () {
    // SetupDataTables();
    //SetupSelectedPrice();
     InitButton();
    ////InitDateTimePicker();
    //NursingAdminConnection();
     InitSelect2();
    //InitDataTables();
    //DefaultValues();
    //HandleEnableEntries();
    //RedrawGrid();

    ShowList();

});


function ShowList() {

    ajaxWrapper.Get($("#url").data("exceppaccess"), { id: 1 }, function (x, e) {
        console.log(x.list);
          tblmoduleslist = $("#tblmoduleslist").DataTable({
            destroy: true,
            paging: false,
            searching: true,
            ordering: true,
            info: false,
            data: x.list,
            bAutoWidth: false,
            columns: [
                 { data: "empid" },
                 { data: "name" },
                 { data: "userid", className: "_remove" }
            ],
            fnCreatedRow: function (nRow, aData, iDataIndex) {
                var $nRow = $(nRow);
                $nRow.addClass("row_green");
                $('td:eq(2)', nRow).html("<button class='btn btn-sm btn-danger'>Remove</button>");
            }
        });
    });
}


//$(document).on("click", tblItemsListId + " td", function (e) {
//    e.preventDefault();

//    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
//        var tr = $(this).closest('tr');
//        tr.toggleClass('selected');
//        tblItemsListDataRow = tblItemsList.row($(this).parents('tr')).data();
//        //var Service = c.GetSelect2Id('#select2PackageType');
//       // var Id = tblItemsListDataRow.Id;
//        console.log('tblItemsListDataRow');
//        console.log(tblItemsListDataRow);


//        /// dito na ko...

//        //c.ModalShow('#modalEntry', true);

        
//       // c.ButtonDisable('#btnDelete', false);
//       // c.ButtonDisable('#btnPrint', false);
//       // View(Id);
//        Action = 2;
//        HandleEnableButtons();
//    }



//});

function InitDataTables() {
    //BindSequence([]);
    BindNursingAdmins([]);
    //BindWithPriceListofItem([]);
}

function InitSelect2() {
    // Sample usage


    Sel2Server($("#Select2Department"), $("#url").data("getdeparlist"), function (d) {
        //alert(d.tariffid);
        var DepartmentId = (d.id);
        //var tarrifId = (d.tariffid);

    });


    Sel2Server($("#select2Userlist"), $("#url").data("selectuserlist"), function (d) {
        //alert(d.tariffid);
        c.ButtonDisable('#btnADD', false);
        var IdPasswordException = (d.id);
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
    c.ButtonDisable('#btnADD', true);
    $(document).on("click", "#tblmoduleslist td", function () {

        var d = tblmoduleslist.row($(this).parents('tr')).data();
    
     
        if ($(this).hasClass('_remove')) {

            var entry;
            entry = []
            entry = {}

            entry.Action = 3;
            entry.userid = d.userid;
            console.log(entry);
            $.ajax({
                url: $('#url').data("save"),
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
                    ShowList();
                    c.MessageBox(data.Title, data.Message, OkFunc);
                },
                error: function (xhr, desc, err) {
                    c.ButtonDisable('#btnSave', false);
                    var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
                    c.MessageBox("Error...", errMsg, null);
                }
            });
        }
         
    });






    $('#btnADD').click(function () {


        Action = 1;
        var entry;
        entry = [];
        entry = {};
        entry.Action = Action;//delete
        //  entry.AnaesthesiaID = c.GetSelect2Id('#select2AnaesthetiaType');
        entry.userid = c.GetSelect2Id('#select2Userlist');
        console.log(entry);
        $.ajax({
            url: $('#url').data('save'),
            data: JSON.stringify(entry),
            type: 'post',
            cache: false,
            contentType: "application/json; charset=utf-8",
            beforeSend: function () {
                c.ButtonDisable('#btnADD', true);
            },
            success: function (data) {
                console.log(data);
                c.ButtonDisable('#btnADD', false);
        
                if (data.ErrorCode == 0) {
                    c.MessageBoxErr("Error...", data.Message);
                    return;
                }
                ShowList();
                var errMsg = data.Message;
                c.MessageBox(data.Title, errMsg, null);

            },
            error: function (xhr, desc, err) {

                var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
                c.MessageBox("Error...", errMsg, null);
            }
        });

    });














    $('#btnProcess').click(function () {
        Process();
    });

    $('#btnSave').click(function () {
        var YesFunc = function () {
            //Action = 1;
            Save();
        };
        c.MessageBoxConfirm("Save Entry?", "Are you sure you want to Add the Entry?", YesFunc, null);

    });

    $('#btnModify').click(function () {
        var YesFunc = function () {
            Action = 2;
            Save();

        };
        c.MessageBoxConfirm("Modify Entry?", "Are you sure you want to Modify the Entry?", YesFunc, null);

    });

    $('#btnReportGen').click(function () {

        //  print_preview();

        $('#myModal').modal('show');
        PrintPreview();

    });

    $("#btnPrint").on("click", function () {
        //var empty = false
        //empty = c.IsEmptySelect2('#Select2EmployeeId');
        //if (empty == true) {

        //    c.MessageBoxErr('Empty...', 'Please select Employee');
        //} else {
        ToPDF();

        // }

    });

    $("#ExportToXLS").on("click", function () {
        ToXLS();
    });

    $('#btnNew').click(function () {
        DefaultEmpty();
        //  print_preview();
        Action = 1;
        c.ButtonDisable('#btnDelete', true);
        c.ButtonDisable('#btnPrint', true);
        c.ModalShow('#modalEntry', true);


    });

    $('#btnDelete').click(function () {

        var YesFunc = function () {
            Action = 3;
            Save();

        };

        c.MessageBoxConfirm("Delete Entry?", "Are you sure you want to Delete the Entry?", YesFunc, null);
        //  print_preview();

    });






}

function HandleEnableButtons() {
    // VAED
    if (Action == 0) {
        $('.HideOnView').hide();

        $('.ShowOnView').show();
    }
    else if (Action == 1) {
        $('.HideOnAdd').hide();

        $('.ShowOnAdd').show();
    }
    else if (Action == 2) {
        $('.HideOnEdit').hide();

        $('.ShowOnEdit').show();
    }
    else if (Action == 3) {
        $('.HideOnDelete').hide();
        $('.ShowOnDelete').show();
    }
    else {
        c.Show('#ButtonsOnBoard', true);

        c.Show('#ButtonsOnEntry', false);
    }

    HandleButtonNotUse();
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
    $('#dtMonth').datetimepicker({
        picktime: false,
        format: 'mm-yyyy'
    }).on('dp.change', function (e) {
        //c.SetDateTimePicker('#dtMonth');
        //var a = $('#dtfrom').data("DateTimePicker").getDate();
        //var b = moment(a).format(dateFormatOnDisplay);
        c.SetDateTimePicker('#dtfrom', new Date(year, month, 1));
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

function DefaultValues() {
    // Sample usage
    // c.SetValue('#txtDays', '30');
    c.SetSelect2('#select2PackageType', '7', 'Procedure');
    // c.iCheckSet('#iChkLast3Mos', true);

    //c.SetSelect2('#select2PatientTypeId', '1', 'In-patient');

}


function DefaultEmpty() {

    c.SetValue('#Id', '');
    //c.SetValue('#txtCode', '');
    //c.SetValue('#txtName');
    //c.SetValue('#txtCostPrice');
    c.Select2Clear('#Select2Department');

}

function Momentdatetime(value) {
    return moment().format('l h:mm:ss A');
}


function View(Id) {

    var Url = $('#url').data("getnurseview");
    //var Url = baseURL + "ShowSelected";
    var param = {
        Id: Id


    };
    $('#loadingpdf').show();
    $('#preloader').show();
    //$('.Hide').hide();

    $.ajax({
        url: Url,
        data: param,
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false,
        beforeSend: function () {

        },
        success: function (result) {
            $('#preloader').hide();
            $('.Show').show();

            //if (FetchFindingsResults.length == 0) {
            //    c.MessageBoxErr("Deleted...", "The selected record doesn't exist and already been deleted.", null);
            //    tblRequisitionList.row('tr.selected').remove().draw(false);
            //    return;
            //}

            var data = result.list[0];
            c.SetValue('#Id', data.Id);
            //c.SetValue('#txtCode', data.Code);
            //c.SetValue('#txtName', data.Name);
            //c.SetValue('#txtCostPrice', data.CostPrice);
            c.SetSelect2('#Select2Department', data.DepartmentId, data.DepartmentName);

            HandleEnableButtons();
            //HandleEnableEntries();
            c.ModalShow('#modalEntry', true);
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            $('#loadingpdf').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}

//-------------------List-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function RedrawGrid() {
    // TblGridSequence.columns.adjust().draw();

    if (tblItemsList !== undefined) tblItemsList.columns.adjust().draw();

    //if (TblGridQuantityAvailable !== undefined) TblGridQuantityAvailable.columns.adjust().draw();
    //if (TblGridIssueingQuantity !== undefined) TblGridIssueingQuantity.columns.adjust().draw();
    //if (TblGridPrevResults !== undefined) TblGridPrevResults.columns.adjust().draw();
}

function BindNursingAdmins(data) {

    tblItemsList = $(tblItemsListId).DataTable({
        data: data,
        cache: false,
        destroy: true,
        paging: false,
        searching: true,
        ordering: false,
        info: false,
        bAutoWidth: false,
        dom: 'Rlfrtip',
        scrollY: 400,
        scrollX: true,
        fixedHeader: true,
        columns: ShowNursingAdminColumns(),
        fnRowCallback: ShowNursingAdminisCallBack()
    });

    //InitSelectedPharmacyMarkUp();
}

function ShowNursingAdminisCallBack() {
    var rc = function (nRow, aData) {
        //var value = aData['selected'];
        //var $nRow = $(nRow);

        //if (aData.selected.length != 1) {
        //    $('#chkselected', nRow).prop('checked', aData.selected === 1);
        //}
        //var value = aData['Price'];
        //var $nRow = $(nRow);

        ////WardDemand
        //if (value == '') {
        //    $nRow.css({ "background-color": "#d7ffea" })
        //}
        //ISSUED
        //else if (value == 1) {
        //    $nRow.css({ "background-color": "#d7ffea" })
        //}
        //    //Partial Issues
        //else if (value == 3) {
        //    $nRow.css({ "background-color": "#f5b044" })
        //}

    };
    return rc;

}

function ShowNursingAdminColumns() {
    var cols = [

      { targets: [0], data: "userid", className: '', visible: true, searchable: true, width: "1%" },
      { targets: [1], data: "empid", className: '', visible: true, searchable: true, width: "20%" },
      { targets: [2], data: "name", className: '', visible: true, searchable: true, width: "20%" },
      { targets: [3], data: "userid", className: '', visible: false, searchable: false }


    ];
    return cols;
}

function NursingAdminConnection() {

    var Url = $('#url').data("getnursingadminis");

    $('#loadingpdf').show();
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

            BindNursingAdmins(data.list);
            $('#preloader').hide();
            RedrawGrid();
        },
        error: function (xhr, desc, err) {
            $('#loadingpdf').hide();
            //$('#preloader').hide();
            var errMsg = err.responseText + "<br>" + desc;
            c.MessageBoxErr(errMsg);

        }
    });
}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Validated() {

    var ret = false;

    //ret = c.IsEmpty('#txtHomeAdress');

    //if (ret) {
    //    c.MessageBoxErr('Y/N...', 'Please input Y for YES and N for NO');
    //    return false;
    //}







    return true;

}


function Save() {

    var ret = Validated();
    if (!ret) return ret;

    var entry;
    entry = []
    entry = {}
    entry.Action = Action;
    //entry.Deleted = 0;
    entry.Id = $('#Id').val();
    //entry.Name = $('#txtName').val();
    //entry.Code = $('#txtCode').val();
    //entry.CostPrice = $('#txtCostPrice').val();
    entry.DepartmentId = c.GetSelect2Id('#Select2Department');

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
                    //                    tblScientificAchievement.row('tr.selected').remove().draw(false);
                    //                    tblTrainingDetails.row('tr.selected').remove().draw(false);
                    //tblFamilyDetails.row('tr.selected').remove().draw(false);
                    //                    tblRelationShipDetails.row('tr.selected').remove().draw(false);
                    //                    tblPreviousExpDetails.row('tr.selected').remove().draw(false);
                    //                    tblQualificationDetails.row('tr.selected').remove().draw(false);
                }

                Action = 0;
                HandleEnableButtons();
                HandleEnableEntries();
                NursingAdminConnection();
                RedrawGrid();
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


function RedrawGrid() {
    // TblGridSequence.columns.adjust().draw();

    if (tblItemsList !== undefined) tblItemsList.columns.adjust().draw();

    //if (TblGridQuantityAvailable !== undefined) TblGridQuantityAvailable.columns.adjust().draw();
    //if (TblGridIssueingQuantity !== undefined) TblGridIssueingQuantity.columns.adjust().draw();
    //if (TblGridPrevResults !== undefined) TblGridPrevResults.columns.adjust().draw();
}

function setCookie(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    //document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
    document.cookie = name + "=" + value + expires + "; path=/";
}


function ToPDF() {
    //if (debug) debugger;

    $('#PDFMaximize').show();
    $('.loadingpdf').show();

    var filter = [{
        Id: c.GetValue('#Id'),
    }];
    var filterfy = JSON.stringify(filter);
    setCookie('Filterfy', filterfy, 365);


    var url = $("#url").data("pdf") + "?page=1#zoom=100";
    var content = '<iframe id="MyIFRAME" src="' + url + '" width="100%"  height="100%" frameborder="0" class="rpt-viewer-frame"></iframe>';

    //$('#rptMaximize').empty();
    //$('#rptMaximize').append(content);

    $('#PreviewInPDF').empty();
    $('#PreviewInPDF').append(content);

    $('#MyIFRAME').unbind('load');
    $('#MyIFRAME').load(function () {
        $('.loadingpdf').hide();
    });

}
function ToXLS() {
    $('#PDFMaximize').show();
    $('.loadingpdf').show();

    var filter = [{
        Id: c.GetValue('#Id'),
    }];
    var filterfy = JSON.stringify(filter);
    setCookie('Filterfy', filterfy, 365);

    var url = $("#url").data("xls") + "?page=1#zoom=100";
    var content = '<iframe id="MyIFRAME" src="' + url + '" width="100%"  height="100%" frameborder="0" class="rpt-viewer-frame"></iframe>';

    //$('#rptMaximize').empty();
    //$('#rptMaximize').append(content);

    $('#PreviewInPDF').empty();
    $('#PreviewInPDF').append(content);

    $('#PDFMaximize').hide();
    $('#MyIFRAME').unbind('load');
    $('#MyIFRAME').load(function () {
        $('.loadingpdf').hide();
        $('#PDFMaximize').hide();
    });


}