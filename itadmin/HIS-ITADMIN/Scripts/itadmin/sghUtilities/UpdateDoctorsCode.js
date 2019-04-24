var c = new Common();




$(document).ready(function () {

    
    $('#preloader').show();

    //var FromDate = c.GetDateTimePickerDateTimeSCS('#dtFromDate');
    //var ToDate = c.GetDateTimePickerDateTimeSCS('#dtToDate');


    //CancelOpReceiptConnection(FromDate, ToDate);
    //InitDateTimePicker();
    //DefaultValues();
    //InitButton();
    //InitDataTables();
    //RedrawGrid();
    //DefaultDisable();


    $("#cboCategory").prop('disabled', true);
    $(".disabled-text").prop('disabled', true);

    $("#cboEmployee").select2({
        allowClear: false,
        dropdownAutoWidth: true
    }).on("change", function (e) {

        $(".disabled-text").prop('disabled', false);
        $("#cboCategory").prop('disabled', false);
        var Url = $("#url").data("getfindemployeeid");
        var param = {
            id: $("#cboEmployee").select2('val'),
        };

        $('#preloader').show();
        //$("#grid").css("visibility", "hidden");
        console.log(Url);
        $.ajax({
            url: Url,
            data: param,
            type: 'get',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            cache: false,
            beforeSend: function () {
            },
            success: function (data) {



                $('#txtDoctorCode').val(data[0].EmpCode);
                $('#txtNationality').val(data[0].NatName);
                $('#txtEmail').val(data[0].Email);
                $('#txtDepartment').val(data[0].DeptName);
                $('#txtPosition').val(data[0].DesignationName);

                if (data[0].txtPhysiotherapist == "" || data[0].txtPhysiotherapist == 0)
                    $("#txtPhysiotherapist").val(0);

                console.log('txtPhysiotherapist -> ' + data[0].txtPhysiotherapist);
                if (data[0].txtPhysiotherapist == 1)
                    $("#txtPhysiotherapist").val(1);


                if (data[0].Deleted == "")
                    $("#cboStatus").val(0);

                $("#cboCategory option").each(function () {
                    if ($(this).val() == data[0].CatId) {
                        $("#cboCategory").select2("val", $(this).val());
                    }
                });

                $("#cboStatus option").each(function () {
                    if ($(this).val() == data[0].Deleted) {
                        $("#cboStatus").val($(this).val());
                    }
                });

                $("#txtNationality").prop('disabled', true);
                $("#txtDepartment").prop('disabled', true);
                $("#txtPosition").prop('disabled', true);
                $("#cboCategory").prop('disabled', false);
                $('#txtDoctorCode').focus();
                $('#preloader').hide();

            },
            error: function (xhr, desc, err) {
                $('#preloader').hide();
                var errMsg = err + "<br>" + desc;
                c.MessageBoxErr(errMsg);
            }
        });


        //$('#cboCategory').select2("enable", true);
        //$('#cboCategory').select2("val", 0);

        //$('#tariffitem').html('-');
        //if (tbl != null && tbl !== undefined) {
        //    tbl.clear().draw();
        //}
        //$('.buttongroups').prop('disabled', true);
        //$('#chkTariffRevisedBy').iCheck('disable');
    });

    $('#cboEmployee').select2('open');

    $("#cboCategory").select2({
        allowClear: false,
        dropdownAutoWidth: true
    }).on("change", function (e) {
        //$('#cboService').select2("enable", true);
        //$('#cboService').select2("val", 0);

        //$('#tariffitem').html('-');
        //if (tbl != null && tbl !== undefined) {
        //    tbl.clear().draw();
        //}
        //$('.buttongroups').prop('disabled', true);
        //$('#chkTariffRevisedBy').iCheck('disable');

    });




    $('#preloader').hide();


});

$('#btnSave').click(function () {
    var YesFunc = function () {
        Action = 1;
        Save();
    };
    c.MessageBoxConfirm("Save Entry?", "Are you sure you want to Add the Entry?", YesFunc, null);
    //c.ModalShow('#modalEntry', true);
});

function Save() {

    $('#preloader').show();
    var ret = Validated();
    if (!ret) return ret;


    url = $('#url').data("save");
    var data = $('#frmUpdateDoctorsCode').serializeObject();
    $.ajax({
        type: "POST",
        contentType: 'application/json',
        url: url,
        data: JSON.stringify(data),
        beforeSend: function () {

            //c.ButtonDisable('#btnCalculate', true);
            //c.ButtonDisable('#btnModify', true);
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
            $('#preloader').hide();
            c.MessageBox(data.Title, data.Message, OkFunc);

            //c.ButtonDisable('#btnCalculate', false);
            //c.ButtonDisable('#btnSave', false);

            //if (data.ErrorCode == 0) {
            //    c.MessageBoxErr("Error...", data.Message);
            //    return;
            //}

            //var OkFunc = function () {

            //    if (Action == 3) {
            //        //                    tblScientificAchievement.row('tr.selected').remove().draw(false);
            //        //                    tblTrainingDetails.row('tr.selected').remove().draw(false);
            //        //tblFamilyDetails.row('tr.selected').remove().draw(false);
            //        //                    tblRelationShipDetails.row('tr.selected').remove().draw(false);
            //        //                    tblPreviousExpDetails.row('tr.selected').remove().draw(false);
            //        //                    tblQualificationDetails.row('tr.selected').remove().draw(false);
            //    }

            //    Action = -1;
            //    HandleEnableButtons();
            //    HandleEnableEntries();
            //    BindSpecialisationList([]);
            //    ///ORSurgeryConnection();
            //};

            // c.MessageBox(data.Title, data.Message, OkFunc);

            $('#preloader').hide();

        },
        error: function (xhr, desc, err) {
            c.ButtonDisable('#btnSave', false);
            var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
            c.MessageBox("Error...", errMsg, null);
        }


    });





    return ret;
}

//$.fn.serializeObject = function () {
//    var o = {};
//    var a = this.serializeArray();
//    $.each(a, function () {
//        if (o[this.name] !== undefined) {
//            if (!o[this.name].push) {
//                o[this.name] = [o[this.name]];
//            }
//            o[this.name].push(this.value || '');
//        } else {
//            o[this.name] = this.value || '';
//        }
//    });
//    return o;
//};

jQuery.fn.serializeObject = function () {
    var arrayData, objectData;
    arrayData = this.serializeArray();
    objectData = {};

    $.each(arrayData, function () {
        var value;

        if (this.value != null) {
            value = this.value;
        } else {
            value = '';
        }

        if (objectData[this.name] != null) {
            if (!objectData[this.name].push) {
                objectData[this.name] = [objectData[this.name]];
            }

            objectData[this.name].push(value);
        } else {
            objectData[this.name] = value;
        }
    });

    return objectData;
};


function Validated() {

    var ret = false;
    $('#preloader').hide();

    ret = c.IsEmpty($('#txtDoctorCode').val());

    if (ret) {
        c.MessageBoxErr('Empty...', 'Please input a Doctor Code');
        return false;
    }

    ret = c.IsEmpty($('#txtEmail').val());

    if (ret) {
        c.MessageBoxErr('Empty...', 'Please select a Email');
        return false;
    }

    ret = c.IsEmpty($('#cboStatus').val());

    if (ret) {
        c.MessageBoxErr('Empty...', 'Please select a Status');
        return false;
    }


    return true;

}