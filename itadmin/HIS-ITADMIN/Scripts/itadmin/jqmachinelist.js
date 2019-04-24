var tbl;
$(function () {
    InitDT($(".dt"));
    LoadMach();
    LoadDept();
    LoadLocation();
    LoadAsset();
    LoadModali();
    LoadProcModali();
    LoadDoctors();
    $(document).on("click", "#tbl-machine td", function () {
        var d = tbl.row($(this).parents('tr')).data();
        $("#url").data('id', d.ID);

        $("#txtname").val(d.Name);
        $("#txtdesc").val(d.Description);
        $("#txtroom").val(d.Room);
        DTFormatShort(d.AcquisitionDate, function (dtt) {
            $("#txtaqc").val(dtt);
        });
        DTFormatShort(d.CommisionDate, function (dtt) {
            $("#txtcomm").val(dtt);
        });

        $("#txtcode").select2('val', d.Code);
        //$("#txtmodalt").select2("val",["1","2","3"]);
        $("#txtmodalt").select2("val", [d.ModalityID]);
        $("#txtdept").select2('val', d.DepartmentID);
        $("#txtlocation").select2('val', d.LocationID);

        var selectedDoctorsIds = [];
        ajaxWrapper.Get($("#url").data("getmachinedoctors"), { machineId: d.ID }, function (data, e) {

            $.each(data, function (index, item) {

                selectedDoctorsIds.push(item.id);
            });

            $("#txtDoctors").select2('val', selectedDoctorsIds);
        });


        OpenModal($("#modal-mach"));
    });
    $(document).on("click", "#btn-new", function () {
        $("#txturl").data('id', "0");
        $(".clr").val("");
        OpenModal($("#modal-mach"));
    });
    $(document).on("click", "#btn-sv", function () {
        SV();
    });
});

function LoadMach() {
    ajaxWrapper.Get($("#url").data("mach"), null, function (xx, e) {
        $("#modal-mach").modal('hide');
        tbl = $("#tbl-machine").DataTable({
            destroy: true,
            paging: true,
            searching: true,
            ordering: true,
            info: false,
            data: xx,
            bAutoWidth: false,
            columns: [
                 { data: "ID" },
                 { data: "Code" },
                 { data: "Name" },
                 { data: "Description" },
                 { data: "Department" },
                 { data: "LocationName" },
                 { data: "Room" },
                 { data: "ModalityCode" },
                 { data: "AcquisitionDate" },
                 { data: "CommisionDate" }
            ],
            fnRowCallback: function (nRow, aData) {
                if (aData["AcquisitionDate"] != "") {
                    DTFormatShort(aData["AcquisitionDate"], function (a) {
                        $('td:eq(8)', nRow).html(a);
                    });
                }
                if (aData["CommisionDate"] != "") {
                    DTFormatShort(aData["CommisionDate"], function (a) {
                        $('td:eq(9)', nRow).html(a);
                    });
                }
            }
        });

    });
}
function LoadDept() {
    ajaxWrapper.Get($("#url").data("dept"), null, function (xx, e) {
        Sel2Client($("#txtdept"), xx, function (x) {

        })
    });
}
function LoadLocation() {
    ajaxWrapper.Get($("#url").data("location"), null, function (xx, e) {
        Sel2Client($("#txtlocation"), xx, function (x) {

        })
    });
}
function LoadAsset() {
    ajaxWrapper.Get($("#url").data("asset"), null, function (xx, e) {
        Sel2Client($("#txtcode"), xx, function (x) {

        })
    });
}
function LoadModali() {
    ajaxWrapper.Get($("#url").data("modali"), null, function (xx, e) {
        $("#tbl-modality").DataTable({
            destroy: true,
            paging: true,
            searching: true,
            ordering: true,
            info: false,
            data: xx,
            bAutoWidth: false,
            columns: [
                 { data: "id" },
                 { data: "text" },
                 { data: "name" }
            ]
        });
        Sel2ClientMultiple($("#txtmodalt"), xx, function (x) {

        })
    });
}
function LoadProcModali() {
    ajaxWrapper.Get($("#url").data("procmodal"), null, function (xx, e) {
        $("#tbl-procmodality").DataTable({
            destroy: true,
            paging: true,
            searching: true,
            ordering: true,
            info: false,
            data: xx,
            bAutoWidth: false,
            columns: [
                 { data: "id" },
                 { data: "text" },
                 { data: "name" }
            ]
        });
    });
}

function LoadDoctors() {
    ajaxWrapper.Get($("#url").data("getdoctors"), null, function (xx, e) {
        $("#tbl-doctors").DataTable({
            destroy: true,
            paging: true,
            searching: true,
            ordering: true,
            info: false,
            data: xx,
            bAutoWidth: false,
            columns: [
                 { data: "id" },
                 { data: "text" },
                 { data: "name" }
            ]
        });
        Sel2ClientMultiple($("#txtDoctors"), xx, function (x) {

        })
    });
}


function SV() {

    var MachineSetupModel = {
        ID: $("#url").data("id"),
        Code: $("#txtcode").val(),
        Name: $("#txtname").val(),
        Description: $("#txtdesc").val(),
        DepartmentID: $("#txtdept").val(),
        LocationID: $("#txtlocation").val(),
        Room: $("#txtroom").val(),
        AcquisitionDate: $("#txtaqc").val(),
        CommisionDate: $("#txtcomm").val(),
        ModalityID: $("#txtmodalt").val(),
        DoctorId: $("#txtDoctors").val()
    }

    AjaxWrapperPost($("#url").data("sv"), JSON.stringify(MachineSetupModel), function (xx, e) {
        LoadMach();
    }, "Machine Setup");
}