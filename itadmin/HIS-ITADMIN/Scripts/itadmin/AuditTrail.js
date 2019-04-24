var c = new Common();
var Action = -1;

var Select2IsClicked = false;



$(document).ready(function () {
    // SetupDataTables();

    InitButton();

    InitSelect2();

    DefaultValues();
    InitDateTimePicker();
    //c.makedate("#dtFrom", "dd-M-yyyy");
    //c.makedate("#dtTo", "dd-M-yyyy");

});

$('#myModal').on('shown.bs.modal', function () {
    //showindicator.Show('#report-container');
});

$(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
    // For future use... Get the active tab.
    //var tabNameSelected = $('.nav-tabs .active').text();
    //RedrawGrid();
})

//$(document).on("dblclick", tblRequisitionListId + " td", function (e) {
//    e.preventDefault();

//    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
//        var tr = $(this).closest('tr');

//        tblRequisitionListDataRow = tblRequisitionList.row($(this).parents('tr')).data();
//        var RegNo = c.GetValue('#txtRegno');
//        if (RegNo == '') {
//            RegNo = -1
//        }

//        var FromDate = c.GetDateTimePickerDate('#dtFrom');
//        var ToDate = c.GetDateTimePickerDate('#dtTo');
//        var OrderId = tblRequisitionListDataRow.OrderId; // this is a billing no
//        var ProcedureId = tblRequisitionListDataRow.ProcedureId;
//        var RequestedId = tblRequisitionListDataRow.RequestedId; // this is a unigue id for all how ever if not done this is blank and get max id for new
//        View(RegNo, FromDate, ToDate, OrderId, ProcedureId, RequestedId);

//        if (RequestedId == 0) {
//            Action = 1
//        } else {
//            Action = 2
//        } 
//        //tblFindingsList.columns.adjust().draw();
//        //Findinglist(OrderId, ProcedureId);
//        //GetID = ID;
//        //Action = 0;
//       // View(ID);
//        //c.SetActiveTab('sectionA');
//        //HandleEnableEntries();
//         HandleEnableButtons();
//    }
//});

//$(document).on("click", tblFindingsListId + " td", function (e) {
//    e.preventDefault();

//    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
//        var tr = $(this).closest('tr');
//        tr.toggleClass('selected');
//        tblFindingsListDataRow = tblFindingsList.row($(this).parents('tr')).data();
//    }

//});

//function InitDataTables() {

//    BindFindingsDetailsTbl([]);

//}

function InitButton() {
    var NoFunc = function () {
    };
    // Sample usage
    $('#btnPreview').click(function () {

        $('#myModal').modal('show');
        PrintPreview();

        //var RegNo = c.GetValue('#txtRegno');
        //if (RegNo == '') {
        //   RegNo = -1
        //} 
        //var FromDate = c.GetDateTimePickerDate('#dtFrom');
        //var ToDate = c.GetDateTimePickerDate('#dtTo');
        //Requisitionlist(RegNo, FromDate, ToDate);
    });

    $('#btnSave').click(function () {
        var YesFunc = function () {
            Action = 1;
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

    $('#btnRefesh').click(function () {

        //  print_preview();
        PrintPreview();
        //$('#myModal').modal('show');
        //PrintPreview();

    });



    var ret = false;

    //ret = c.IsEmpty('#txtHomeAdress');

    //if (ret) {
    //    c.MessageBoxErr('Y/N...', 'Please input Y for YES and N for NO');
    //    return false;
    //}


    $("#btnDisplay").on("click", function () {
        var empty = false
        empty = c.IsEmptySelect2('#Select2EmployeeId');
        if (empty == true) {

            c.MessageBoxErr('Empty...', 'Please select Employee');
        } else {
            ToPDF();

        }
    

    });
    $("#ExportToXLS").on("click", function () {
        ToXLS();
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

//function InitICheck() {
//    // Sample usage
//    //$('#').iCheck({
//    //    checkboxClass: 'icheckbox_square-red',
//    //    radioClass: 'iradio_square-red'
//    //}).on('ifChecked ifUnchecked', function (e) {
//    //    var checked = e.type == 'ifChecked' ? 1 : 0;

//    //});
//}

function InitSelect2() {
    // Sample usage
    //Sel2Server($("#Select2Depart"), $("#url").data("getdept"), function (d) {
    //    // alert(d.Id);
    //    var Id = (d.id);
    //    //var tarrifId = (d.tariffid);

    //});
    //$('#select2PatientTypeId').select2({
    //    containerCssClass: 'RequiredField',
    //    data: [{ id: 1, text: 'In-patient' }, { id: 0, text: 'Out-patient' }],
    //    minimumResultsForSearch: -1
    //}).change(function (e) {
    //    var id = e.added.id;
    //    if (id=='1') {
    //        $('#hideTypeOfId').hide();
    //        $('#lblPinName').text('Pin No.');
    //    } else {
    //        $('#hideTypeOfId').show();
    //        c.SetSelect2('#select2TypeOfId', '0', 'Pin No.');
    //    }
    //});

    //$('#select2TypeOfId').select2({
    //    containerCssClass: 'RequiredField',
    //    data: [{ id: 1, text: 'Bill No.' }, { id: 0, text: 'Pin No.' }],
    //    minimumResultsForSearch: -1
    //}).change(function (e) {
    //    var id = e.added.id;
    //    $('#lblPinName').text(e.added.text);
    //});



    //});

    $('#Select2EmployeeId').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: $("#url").data("getemp"),
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    id: c.GetSelect2
                };
            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    }).change(function (e) {
        var list = e.added;

    });


    $('#Select2Depart').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: $("#url").data("getdept"),
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    id: c.GetSelect2
                };
            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    }).change(function (e) {
        var list = e.added;

    });



}


//function setCookie(name, value, days) {
//    var expires;

//    if (days) {
//        var date = new Date();
//        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
//        expires = "; expires=" + date.toGMTString();
//    } else {
//        expires = "";
//    }
//    //document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
//    document.cookie = name + "=" + value + expires + "; path=/";
//}

//function PrintPreview() {
//    //$('#loadingpdf').show();

//    var filter = [{
//        // RegNo: -1,
//        //OrderId: c.GetValue('#RequestID'),
//        //ProcedureId: c.GetValue('#ProcedureId'),
//        //RequestedId: c.GetValue('#RequestedId'),
//        FromDate: c.GetDateTimePickerDate('#dtFrom'),
//        ToDate: c.GetDateTimePickerDate('#dtTo'),
//        DepartmentId: c.GetSelect2Id('#Select2Department'),
//        DoctorId: c.GetSelect2Id('#Select2Doctor')
//    }];
//    var filterfy = JSON.stringify(filter);
//    setCookie('Filterfy', filterfy, 365);

//    var url = $("#url").data("printpreview");
//    var content = '<iframe id="MyIFRAME" src="' + url + '" width="100%"  height="100%" frameborder="0" style="overflow-x:"></iframe>';
//    //var content = '<object id="MyIFRAME" data="' + url + '" type="application/pdf" width="100%" height="100%" ></object>';

//    $('#PreviewInPDF').empty();
//    $('#PreviewInPDF').append(content);

//    $('#MyIFRAME').unbind('load');
//    $('#MyIFRAME').load(function () {
//        //$('#loadingpdf').hide();
//    });

//}

function InitDateTimePicker() {
    // Sample usage
    $('#dtFrom').datetimepicker({
        picktime: false
    }).on('dp.change', function (e) {
        //var a = $('#dtfrom').data("DateTimePicker").getDate();
        //var b = moment(a).format(dateFormatOnDisplay);
        //c.SetDateTimePicker('#dtfrom', b);
    });
    $('#dtTo').datetimepicker({
        picktime: false
    }).on('dp.change', function (e) {

    });

    //$('#dtProceduredoneon').datetimepicker({
    //    picktime: true
    //}).on('dp.change', function (e) {
    //    //var a = $('#dtfrom').data("DateTimePicker").getDate();
    //    //var b = moment(a).format(dateFormatOnDisplay);
    //    //c.SetDateTimePicker('#dtfrom', b);
    //});
}

function SetupDataTables() {
    // Sample usage
    // SetupSelectedTicketEligib();
}

function RedrawGrid() {
    // There is an issue in bootstrap tab so we need to redraw the grid.
    // gridDashBoard.columns.adjust().draw();    
}

function DefaultReadOnly() {
    // Sample usage
    // c.ReadOnly('#', true);

    //c.ReadOnly('#txtAge', true);
    //c.ReadOnly('#txtGender', true);
    //c.ReadOnly('#txtOrderDate', true);
}

function DefaultValues() {
    // Sample usage
    // c.SetValue('#txtDays', '30');
    // c.SetSelect2('#select2VacationType', '0', 'Normal');
    // c.iCheckSet('#iChkLast3Mos', true);

   // c.SetSelect2('#Select2Depart', '0', '<ALL DEPARTMENT>');
    //c.SetSelect2('#Select2Department', '-1', '<ALL DEPARTMENT>');

}

function DefaultDisable() {
    // Sample usage
    // c.DisableDateTimePicker('#dtFromDate', true);
    //c.DisableSelect2('#Select2RefDoctor', true);
    //c.DisableSelect2('#Select2ProcedureDoneBy', true);
    //c.Disable('#txtPin', true);
    //c.Disable('#txtReportNo', true);
    //c.Disable('#txtName', true);
    //c.Disable('#txtAgeyear', true);
    //c.Disable('#txtSex', true);
    //c.Disable('#txtAddress', true);
    //c.Disable('#txtDateTime', true);
    //c.Disable('#txtProcedurename', true);



}

function DefaultEmpty() {
    // Sample usage
    // c.SetValue('#', '');
    // c.SetSelect2('#', '', '');
    // c.SetDateTimePicker('#', '');
    // c.iCheckSet('#', false);

    //c.SetValue('#Id', '');

    //InitDataTables();
    //DefaultValues();
}

function Validated() {


    /*    
    ---------------------------------------------------------------------------------------------------------------------
    // Sample usage for checking the content of the grid.
    var ctr = 1;
    var required = '';
    $.each(TblTicketEligibility.rows().data(), function (i, row) {
        if (c.IsEmpty(row.Name)) {
            required = required + '<br>' + 'Enter NAME for row ' + ctr;
        }
        ctr++;
    });
    if (required.length > 0) {
        c.MessageBoxErr('Required on Ticket Eligibility list...', required);
        return false;
    }        
    ---------------------------------------------------------------------------------------------------------------------    
    // Sample usage for checking if select2 is required.
    if (c.IsEmptySelect2('#select2LeaveType')) {
        c.MessageBoxErr('Empty...', 'Please select a type of leave.');
        return false;
    }
    ---------------------------------------------------------------------------------------------------------------------
    // Sample usage for checking if textbox is required.
    if (c.IsEmptyById('#txtphonenumber')) {
        c.MessageBoxErr('Empty...', 'Please enter a telephone number.');
        return false;        
    }
    ---------------------------------------------------------------------------------------------------------------------

    */


    return true;
}

function HandleEnableButtons() {


    // VAED
    //if (Action == 0) {
    //    $('.HideOnView').hide();
    //    $('.ShowOnView').show();
    //}
    //else if (Action == 1) {
    //    $('.HideOnAdd').hide();
    //    $('.ShowOnAdd').show();
    //}
    //else if (Action == 2) {
    //    $('.HideOnEdit').hide();
    //    $('.ShowOnEdit').show();
    //}
    //else if (Action == 3) {
    //    $('.HideOnDelete').hide();
    //    $('.ShowOnDelete').show();
    //}

    //HandleButtonNotUse();




}

function HandleEnableEntries() {




}

function HandleButtonNotUse() {
    //$('.NotUse').hide();
}

function View(RegNo, FromDate, ToDate, OrderId, ProcedureId, RequestedId) {

    //var Url = $('#url').data("getfindings");
    ////var Url = baseURL + "ShowSelected";
    //var param = {
    //    RegNo: RegNo,
    //    FromDate: FromDate,
    //    ToDate: ToDate,
    //    OrderId: OrderId,
    //    ProcedureId: ProcedureId,
    //    RequestedId: RequestedId
    //};

    //$('#preloader').show();
    ////$('.Hide').hide();

    //$.ajax({
    //    url: Url,
    //    data: param,
    //    type: 'get',
    //    contentType: 'application/json; charset=utf-8',
    //    dataType: 'json',
    //    cache: false,
    //    beforeSend: function () {

    //    },
    //    success: function (result) {
    //        $('#preloader').hide();
    //        $('.Show').show();

    //        //if (FetchFindingsResults.length == 0) {
    //        //    c.MessageBoxErr("Deleted...", "The selected record doesn't exist and already been deleted.", null);
    //        //    tblRequisitionList.row('tr.selected').remove().draw(false);
    //        //    return;
    //        //}

    //        var data = result.list[0];
    //        c.SetValue('#Registrationno', data.Registrationno);
    //        c.SetValue('#IssueAuthoritycode', data.IssueAuthorityCode);
    //        c.SetValue('#ProcedureId', data.ProcedureId);
    //        c.SetValue('#RequestID', data.ORDERID); //this is a billing no
    //        c.SetValue('#RequestedId', data.RequestedId); // this is unique OrderId for all
    //        c.SetValue('#PatientType', data.PATIENTTYPE);
    //        c.SetValue('#txtPin', data.PIN);
    //        c.SetValue('#txtReportNo', data.ReportNo);
    //        c.SetValue('#txtName', data.Name);
    //        c.SetValue('#txtAgeyear', data.AgeYear);
    //        c.SetValue('#txtSex', data.Sex);
    //        c.SetValue('#txtAddress', data.Address);
    //        c.SetValue('#txtDateTime', data.ReportDateTime);
    //        c.SetValue('#txtProcedurename', data.PROCEDURENAME);
    //        /*Select2*/
    //        c.SetSelect2('#Select2RefDoctor', data.ReferralDOctorID, data.ReferralDoctorName);
    //        c.SetSelect2('#Select2ProcedureDoneBy', data.ProcedureDocId, data.ProcedureDoneby);

    //        c.SetDateTimePicker('#dtProceduredoneon', data.TestDoneDttm);
    //         //c.SetDateTimePicker('#dtProceduredoneon', moment(data.TestDoneDttm));


    //        ///*Table Show*/

    //        BindFindingsDetailsTbl(data.FetchFindingsDetails);
    //        //BindFindingsTbl(data.FindingsResult);
    //        //BindTrainingDetails(data.TrainingDetailsTable);
    //        //BindFamilyDetails(data.FamilyDetailsTable);
    //        //BindRelationShipDetails(data.RelationShipDetailsTable);
    //        //BindPreviousExpDetails(data.PreviousExperienceDetailsTable);
    //        //BindQualificationDetails(data.QualificationDetailsTable);


    //        //HandleEnableButtons();
    //        HandleEnableEntries();
    //        c.ModalShow('#modalEntry', true);
    //    },
    //    error: function (xhr, desc, err) {
    //        $('#preloader').hide();
    //        var errMsg = err + "<br>" + desc;
    //        c.MessageBoxErr(errMsg);
    //    }
    //});

}

function ValidatedNewEntry() {

    var ret = false;

    //ret = c.IsEmpty('#txtHomeAdress');

    //if (ret) {
    //    c.MessageBoxErr('Y/N...', 'Please input Y for YES and N for NO');
    //    return false;
    //}







    return true;

}

function Momentdatetime(value) {
    return moment().format('l h:mm:ss A');
}

function Save() {

    //var ret = ValidatedNewEntry();
    //if (!ret) return ret;

    //var entry;
    //entry = []
    //entry = {}
    //entry.Action = Action;
    //entry.Registrationno = $('#Registrationno').val();
    //entry.IssueAuthoritycode = c.GetValue('#IssueAuthoritycode');
    //entry.ReportNo = c.GetValue('#txtReportNo');
    //entry.ReportDateTime = c.GetValue('#txtDateTime');
    //entry.ProcedureId = c.GetValue('#ProcedureId');
    //entry.ReferralDoctorID = c.GetSelect2Id('#Select2RefDoctor');
    //entry.ReferralDoctorName = c.GetSelect2Text('#Select2RefDoctor');
    //entry.TestDonebyID = c.GetSelect2Id('#Select2ProcedureDoneBy');
    //entry.RequestID = c.GetValue('#RequestID');
    //entry.PatientType = c.GetValue('#PatientType');
    //entry.TestDoneDtTm = c.GetDateTimePicker('#dtProceduredoneon');
    //entry.RequestedId = c.GetValue('#RequestedId');


    //entry.FindingsDetailsSave = [];
    //var storeOrderId = "";
    //var ResultIdvalue = 'N';
    //var ResultConvertId = 'N' ? 2 : 1;
    //var RequestedId = c.GetValue('#RequestedId');
    //$.each(tblFindingsList.rows().data(), function (i, row) {
    //    if (storeOrderId.length == 0) storeOrderId = row.OrderId;
    //   entry.FindingsDetailsSave.push({
    //       OrderId: RequestedId,
    //        ParameterId: row.id,
    //        ResultId: row.ResultConvertId,
    //        Description: row.Description,
    //        ResultType: row.ResultType,
    //        type: row.type === 'false' ? 0 : 1
    //       //ParameterId: row.PenaltyName.split(" ")[0],
    //        ////type: c.MomentYYYYMMDD(row.PenaltyDate),
    //        //Refund: row.Refund === 'Yes' ? 1 : 0,
    //        //testAppId: false,
    //        //RefundDate: row.RefundDate.replace(" ", "-").replace(" ", "-")
    //    });
    //});
    //$.ajax({
    //    url: $('#url').data("save"),
    //    data: JSON.stringify(entry),
    //    type: 'post',
    //    cache: false,
    //    contentType: "application/json; charset=utf-8",
    //    beforeSend: function () {

    //        c.ButtonDisable('#btnSave', true);
    //        c.ButtonDisable('#btnModify', true);
    //    },
    //    success: function (data) {
    //        c.ButtonDisable('#btnModify', false);
    //        c.ButtonDisable('#btnSave', false);

    //        if (data.ErrorCode == 0) {
    //            c.MessageBoxErr("Error...", data.Message);
    //            return;
    //        }

    //        var OkFunc = function () {

    //            if (Action == 3) {
    //                //                    tblScientificAchievement.row('tr.selected').remove().draw(false);
    //                //                    tblTrainingDetails.row('tr.selected').remove().draw(false);
    //                //tblFamilyDetails.row('tr.selected').remove().draw(false);
    //                //                    tblRelationShipDetails.row('tr.selected').remove().draw(false);
    //                //                    tblPreviousExpDetails.row('tr.selected').remove().draw(false);
    //                //                    tblQualificationDetails.row('tr.selected').remove().draw(false);
    //            }

    //            Action = 0;
    //            HandleEnableButtons();
    //            //HandleEnableEntries();
    //        };

    //        c.MessageBox(data.Title, data.Message, OkFunc);
    //    },
    //    error: function (xhr, desc, err) {
    //        c.ButtonDisable('#btnSave', false);
    //        var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
    //        c.MessageBox("Error...", errMsg, null);
    //    }
    //});

    //return ret;
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
        FromDateLog: c.GetDateTimePickerDateTimeSCS('#dtFrom'),
        ToDateLog: c.GetDateTimePickerDateTimeSCS('#dtTo'),
        EmpId: c.GetSelect2Id('#Select2EmployeeId'),
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
        FromDateLog: c.GetDateTimePickerDateTimeSCS('#dtFrom'),
        ToDateLog: c.GetDateTimePickerDateTimeSCS('#dtTo'),
        EmpId: c.GetSelect2Id('#Select2EmployeeId'),
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