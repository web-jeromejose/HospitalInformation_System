var c = new Common();
var Action = -1;

var Select2IsClicked = false;

var tblItemsList;
var tblItemsListId = '#gridItemList'
var tblItemsListDataRow;




$(document).ready(function () {
    // SetupDataTables();
    //SetupSelectedPrice();
    InitButton();
    //InitDateTimePicker();
    //var Service = 7;
    BillprefixDashBoardConnection();
    InitSelect2();
    InitDataTables();
    DefaultValues();

});

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
        //var Name = tblItemsListDataRow.BillPrefix;
        //var BillType = tblItemsListDataRow.Type;
       //var TariffName = tblItemsListDataRow.Name;
        //c.ModalShow('#modalEntry', true);
       //c.DisableSelect2('#txtTariff', true);
        //View(DoctorId);
        DefaultDisable();
        Action = 2;
        View(StationId);
 
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

  
    $("#Select2BillType").select2({
        data: [{ id: 1, text: 'Cash' },
               { id: 2, text: 'Credit Bill'}],  
        minimumResultsForSearch: -1 
    }).change(function (e) {
        var list = e.added.list;
        //var Service = c.GetSelect2Id('#select2PackageType');
        //ShowListPackage(Service);
        //c.SetValue('#txtName', ' ');
    });

    Sel2Server($("#Select2Stations"), $("#url").data("selectstations"), function (d) {
        //alert(d.tariffid);
        //var CompanyID = (d.id);
        //var tarrifId = (d.tariffid);
        //var list = e.added.list;
        //var CategoryId = (d.id);
        //InvenItemMarkupConnection(CategoryId, TypeId)
        //var CategoryId = c.GetSelect2Id('#Select2DeptStation');
        //var Id = (d.id);
        //ReroutingItem(Id);

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

function DefaultEmpty() {
    // Sample usage
    c.SetValue('#txtStation', ' ');
    c.SetValue('#txtNoOfdDays', ' ');
    //c.SetSelect2('#select2PackageType', '7', 'Procedure');
    // c.iCheckSet('#iChkLast3Mos', true);
    //c.SetSelect2('#Select2Stations', ' ', ' ');
    //c.SetSelect2('#Select2BillType', ' ', ' ');

}



function Momentdatetime(value) {
    return moment().format('l h:mm:ss A');
}


function View(StationId) {

    var Url = $('#url').data("getviewfetchpharmacy");
    //var Url = baseURL + "ShowSelected";
    var param = {
        StationId: StationId
       
    };

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
            //c.SetSelect2('#select2DoctorCode', data.ID, data.Name);
            c.SetValue('#txtStationId', data.StationId);
            c.SetValue('#txtStation', data.Station);
            c.SetValue('#txtNoOfdDays', data.NoOfDays);
            //c.SetSelect2('#Select2BillType', data.BillTypeId, data.Description)
            //c.SetSelect2('#Select2Stations', data.StationId, data.StationName)
            //HandleEnableEntries();
            c.ModalShow('#modalEntry', true);
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
         
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}

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
      { targets: [0], data: "Station", className: '', visible: true, searchable: true, width: "30%" },
      { targets: [1], data: "NoOfDays", className: '', visible: true, searchable: true, width: "10%" },
      { targets: [2], data: "StationId", className: '', visible: false, searchable: false },
    
     
     

    ];
    return cols;
}

function BillprefixDashBoardConnection() {

    var Url = $('#url').data("getcanceldashboard");
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
    entry.StationId = $('#txtStationId').val();
    entry.NoOfDays = $('#txtNoOfdDays').val();
    //entry.BillTypeName = c.GetSelect2Text('#Select2BillType');
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
                BillprefixDashBoardConnection();
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