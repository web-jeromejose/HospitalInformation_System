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
    StationDashBoardConnection();
    //TariffDashBoardConnection();
    InitSelect2();
    //InitDataTables();
  //  DefaultValues();
    DefaultDisable();

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
        var Id = tblItemsListDataRow.ID;
       //var TariffName = tblItemsListDataRow.Name;
        //c.ModalShow('#modalEntry', true);
       //c.DisableSelect2('#txtTariff', true);
        //View(DoctorId);
        Action = 2;
        View(Id);
        
    }



});

function InitDataTables() {
    //BindSequence([]);
    BindListofItem([]);
    //BindWithPriceListofItem([]);
}

function DefaultEmpty() {
    c.SetValue('#txtLocationId', '');
    c.SetValue('#txtLocation', '');
    
}

function InitSelect2() {
    // Sample usage

    Sel2Server($("#Select2MainLocation"), $("#url").data("getlocationlist"), function (d) {
        //alert(d.tariffid);
        //var CompanyID = (d.id);
        //var tarrifId = (d.tariffid);

    });
    Sel2Server($("#Select2StationType"), $("#url").data("getstationlist"), function (d) {
        //alert(d.tariffid);
        //var CompanyID = (d.id);
        //var tarrifId ;= (d.tariffid);
      //  alert(d.Id);
    });
    
    Sel2Server($("#Select2Department"), $("#url").data("getdepartmentlist"), function (d) {
        //alert(d.tariffid);
        //var CompanyID = (d.id);
        //var tarrifId = (d.tariffid);

    });
    //$("#select2PackageType").select2({
    //    data: [{ id: 7, text: 'Procedure' },
    //           { id: 3, text: 'Investigation'}],
    //    minimumResultsForSearch: -1
    //}).change(function (e) {
    //    var list = e.added.list;
    //    var Service = c.GetSelect2Id('#select2PackageType');
    //    ShowListPackage(Service);
    //});


    $('#select2DoctorCode').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: $("#url").data("getdoctorcode"),
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term
                };
            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    }).change(function (e) {
        var list = e.added.list;
        //c.SetValue('#txtPercent', list[2]);
        //c.SetValue('#txtPIN2', list[3]);
        //c.SetValue('#txtBloodGroup', list[4]);
        //c.SetSelect2('#select2BedNo', list[6], list[5]);
        //c.SetValue('#PatientRegistrationNO', list[8]);
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

    $('#btnDelete').click(function () {
        var YesFunc = function () {
            Action = 3;
            Save();

        };
        c.MessageBoxConfirm("Delete Entry?", "Are you sure you want to Delete the Entry?", YesFunc, null);

    });

    $('#btnReportGen').click(function () {

        //  print_preview();

        $('#myModal').modal('show');
        PrintPreview();

    });

    $('#btnNew').click(function () {
        DefaultEmpty();
        //  print_preview();
        c.SetValue('#txtOraCode', '');
        //c.DisableSelect2('#select2DoctorCode', false);
        Action = 1;
        Id = 0;
        //View(Id);
       // DefaultValues();
        c.ModalShow('#modalEntry', true);
        HandleEnableButtons();

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


function DefaultDisable(){

  // -- c.Disable('#txtStationName',true);
    c.Disable('#txtstartdate',true);
    c.Disable('#txtstarttime',true);

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
        //var datetoday
        //var timetoday
     
        //datetoday = $('#txtdatetoday').val();
        //timetoday = $('#txttimetoday').val();
        //$('#txtdatetoday').val();
        //$('#txttimetoday').val();
        //c.GetValues('#txtstartdate');
   
        // c.iCheckSet('#iChkLast3Mos', true);

    //c.SetSelect2('#select2PatientTypeId', '1', 'In-patient');


    //c.SetSelect2('#Select2MainLocation', data.LocationId, data.LocationName);
    //c.SetSelect2('#Select2Department', data.DepartmentId, data.DepartmentName);
    //c.SetSelect2('#Select2StationType', data.StationId, data.StationTypeName);
    //c.SetValue('#txtStationName', data.Name);
    //c.SetValue('#StationId', data.StationId);
    //c.SetValue('#txtLocation', data.Location);
    //c.SetValue('#txtPrefix', data.Prefix);
    //c.SetValue('#txtCode', data.Code);
    //c.SetValue('#txtstartdate', data.StartDate);
    //c.SetValue('#txtstarttime', data.StartTime);



    }

function DefaultEmpty()
{
        
    //c.DefaultEmpty('#Select2MainLocation', data.LocationId, data.LocationName);
    //c.DefaultEmpty('#Select2Department', data.DepartmentId, data.DepartmentName);
    //c.DefaultEmpty('#Select2StationType', data.StationId, data.StationTypeName);
    //c.DefaultEmpty('#txtStationName', data.Name);
    //c.DefaultEmpty('#StationId', data.StationId);
    //c.DefaultEmpty('#txtLocation', data.Location);
    //c.DefaultEmpty('#txtPrefix', data.Prefix);
    //c.DefaultEmpty('#txtCode', data.Code);
    //c.DefaultEmpty('#txtstartdate', data.StartDate);
    //c.DefaultEmpty('#txtstarttime', data.StartTime);

    c.SetValue('#txtStationName', '');
    c.SetValue('#StationId', '');
    c.SetValue('#txtLocation', '');
    c.SetValue('#txtPrefix', '');
    c.SetValue('#txtCode', '');
    c.SetValue('#txtstartdate', '');
    c.SetValue('#txtstarttime', '');
    c.Select2Clear('#Select2MainLocation');
    c.Select2Clear('#Select2Department');
    c.Select2Clear('#Select2StationType');
    // c.iCheckSetClear('#IsIndent',false);
    c.iCheckSet('#isIndent', false);
}


function Momentdatetime(value) {
        return moment().format('l h:mm:ss A');
    }


function View(Id) {

    var Url = $('#url').data("getstationview");
        //var Url = baseURL + "ShowSelected";
        var param = {
            Id: Id
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
                //c.SetSelect2('#Select2Station', data.StationId, data.Name);
                c.SetSelect2('#Select2MainLocation', data.LocationId, data.LocationName);
                c.SetSelect2('#Select2Department', data.DepartmentId, data.DepartmentName);
                c.SetSelect2('#Select2StationType', data.StationTypeID, data.StationTypeName);
                c.SetValue('#txtStationName', data.Name);
                c.SetValue('#StationId', data.StationId);
                c.SetValue('#txtLocation', data.Location);
                c.SetValue('#txtPrefix', data.Prefix);
                c.SetValue('#txtCode', data.Code);
                c.SetValue('#txtstartdate', data.StartDate);
                c.SetValue('#txtstarttime', data.StartTime);
                c.SetValue('#txtOraCode', data.ORA_CODE);

                c.iCheckSet('#isIndent', data.IndentLevel == 1 ? true : false);
                HandleEnableButtons();
                //HandleEnableEntries();
                c.ModalShow('#modalEntry', true);
                //if (data.Id == 0) {
                //    datetoday = $('#txtdatetoday').val();
                //    timetoday = $('#txttimetoday').val();

                //    $('#txtstartdate').val(datetoday);
                //    $('#txtstarttime').val(timetoday);
                //}
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
          { targets: [0], data: "slno", className: '', visible: true, searchable: false, width: "1%" },
          { targets: [1], data: "Name", className: '', visible: true, searchable: true, width: "15%" },
          { targets: [2], data: "Location", className: '', visible: true, searchable: true, width: "15%" },
          { targets: [3], data: "LocationName", className: '', visible: true, searchable: true, width: "15%" },
          { targets: [4], data: "ID", className: '', visible: false, searchable: false, width: "10%" },
          { targets: [5], data: "StartDateTime", className: '', visible: false, searchable: false }
     

        ];
        return cols;
    }

function StationDashBoardConnection() {

        var Url = $('#url').data("getstation");
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
        entry.StationId = $('#StationId').val(); 
        entry.Name = $('#txtStationName').val();
        entry.Location = $('#txtLocation').val();
        entry.StationTypeId = c.GetSelect2Id('#Select2StationType');
        entry.DepartmentId = c.GetSelect2Id('#Select2Department');
        entry.LocationId = c.GetSelect2Id('#Select2MainLocation');
        entry.Prefix = $('#txtPrefix').val();
        entry.Code = $('#txtCode').val();
        entry.IndentLevel = c.GetICheck('#isIndent');
      //  entry.OperatorId = 
        //entry.Deleted = 0;
        //entry.Id = $('#StationId').val();
        //entry.Name = $('#txtLocation').val();
  
    
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
                    HandleEnableButtons();
                    //HandleEnableEntries();
                    StationDashBoardConnection();
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