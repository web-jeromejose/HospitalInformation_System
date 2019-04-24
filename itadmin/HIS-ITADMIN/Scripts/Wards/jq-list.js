 
var Patient = [];
var Doctor = [];
var ExtraFood = [];
var GenericList = [];
var TableDrug;
var TableGeneric;
var TableOtherProc;
var TableTest;
var TableProfile;

var ajaxWrapper = $.ajaxWrapper();
$(function () {
    $(".select2-hidden-accessible").css("display", "none");
});

function InitSelect() {
    InPatientList();
    bindPatient();
    bindDoctor();
    bindDocSelect();
}

function InPatientList() {
    $.ajax({
        cache: false,
        type: 'GET',
        data: { "IPID": "0" },
        url: $("#url").data("patient"),
        beforeSend: function () {
            $(".spinner").modal({ keyboard: false });
        },
        success: function (data) {
            Patient = data;
        }
    });
};
function bindPatient(Callback) {
    $("#txtpatientID").select2({
        allowClear: true,
        closeOnSelect: false,
        initSelection: function (element, callback) {
            var selection = _.find(Patient, function (metric) {
                return metric.id === element.val();
            })
            callback(selection);
        },
        query: function (options) {
            var pageSize = 100;
            var startIndex = (options.page - 1) * pageSize;
            var filteredData = Patient;
            var stripDiacritics = window.Select2.util.stripDiacritics;

            if (options.term && options.term.length > 0) {
                if (!options.context) {
                    var term = stripDiacritics(options.term.toLowerCase());
                    options.context = Patient.filter(function (metric) {
                        if (!metric.stripped_text) {
                            metric.stripped_text = stripDiacritics(metric.id.toLowerCase());
                        }
                        return (
                        metric.BedNo.toString().toUpperCase().indexOf(term.toUpperCase()) != -1 ||
                        metric.RegNo.toString().toUpperCase().indexOf(term.toUpperCase()) != -1 ||
                        metric.name.toString().toUpperCase().indexOf(term.toUpperCase()) != -1
                        );
                    });
                }
                filteredData = options.context;
            }

            options.callback({
                context: filteredData,
                results: filteredData.slice(startIndex, startIndex + pageSize),
                more: (startIndex + pageSize) < filteredData.length
            });
        },
        dropdownAutoWidth: true,
        formatResult: selectFormatResult
    }).on("change", function () {

        Callback($(this).select2('data'));
        $("#txtbed").val($(this).select2('data').BedNo);
        $("#txtname").val($(this).select2('data').name);
        $("#txtage").val($(this).select2('data').Age);
        $("#txtsex").val($(this).select2('data').Sex);
        $("#txtblood").val($(this).select2('data').BloodGroup);
        $("#txtdrug").val($(this).select2('data').Drug);
        $("#txtward").val($(this).select2('data').StationName);
        $("#txtcompany").val($(this).select2('data').CompanyName);
        $("#package").val($(this).select2('data').Package);
        $("#date").val($(this).select2('data').Date);
        bindDocSelect();
        $("#txtdoctor").select2("val", $(this).select2('data').DoctorID);
        $("#ipid").val($(this).val());
    });
};
function bindDoctor() {
    $.ajax({
        cache: false,
        type: 'GET',
        url: $("#url").data("doctor"),
        beforeSend: function () {
            $(".spinner").modal({ keyboard: false });
        },
        success: function (data) {
            Doctor = data;
            $(".spinner").modal('hide');
        }
    });
};
function bindDocSelect() {
    $("#txtdoctor").select2({
        allowClear: true,
        initSelection: function (element, callback) {
            var selection = _.find(Doctor, function (metric) {
                return metric.id === element.val();
            })
            callback(selection);
        },
        query: function (options) {
            var pageSize = 100;
            var startIndex = (options.page - 1) * pageSize;
            var filteredData = Doctor;
            var stripDiacritics = window.Select2.util.stripDiacritics;

            if (options.term && options.term.length > 0) {
                if (!options.context) {
                    var term = stripDiacritics(options.term.toLowerCase());
                    options.context = Doctor.filter(function (metric) {
                        if (!metric.stripped_text) {
                            metric.stripped_text = stripDiacritics(metric.id.toLowerCase());
                        }
                        return (metric.stripped_text.indexOf(term) !== -1
                            || metric.id.toString().toUpperCase().indexOf(term.toUpperCase()) != -1
                            || metric.name.toString().toUpperCase().indexOf(term.toUpperCase()) != -1
                            || metric.code.toString().toUpperCase().indexOf(term.toUpperCase()) != -1
                            );

                    });
                }
                filteredData = options.context;
            }

            options.callback({
                context: filteredData,
                results: filteredData.slice(startIndex, startIndex + pageSize),
                more: (startIndex + pageSize) < filteredData.length
            });
        },
        dropdownAutoWidth: true,
        formatResult: selectFormatDoctor
    });
}
function bindDocSelectReferBy() {
    $("#refto").select2({
        allowClear: true,
        initSelection: function (element, callback) {
            var selection = _.find(Doctor, function (metric) {
                return metric.id === element.val();
            })
            callback(selection);
        },
        query: function (options) {
            var pageSize = 100;
            var startIndex = (options.page - 1) * pageSize;
            var filteredData = Doctor;
            var stripDiacritics = window.Select2.util.stripDiacritics;

            if (options.term && options.term.length > 0) {
                if (!options.context) {
                    var term = stripDiacritics(options.term.toLowerCase());
                    options.context = Doctor.filter(function (metric) {
                        if (!metric.stripped_text) {
                            metric.stripped_text = stripDiacritics(metric.id.toLowerCase());
                        }
                        return (metric.stripped_text.indexOf(term) !== -1
                            || metric.id.toString().toUpperCase().indexOf(term.toUpperCase()) != -1
                            || metric.code.toString().toUpperCase().indexOf(term.toUpperCase()) != -1
                            );
                    });
                }
                filteredData = options.context;
            }

            options.callback({
                context: filteredData,
                results: filteredData.slice(startIndex, startIndex + pageSize),
                more: (startIndex + pageSize) < filteredData.length
            });
        },
        dropdownAutoWidth: true,
        formatResult: selectFormatDoctor
    });
}

function bindPatientList(Callback) {
    $("#txtpatientID").select2({
        allowClear: false,
        placeholder: "Search Patient",
        minimumInputLength: 4,
        ajax: {
            cache: false,
            type: 'GET',
            dataType: "json",
            url: $("#url").data("patient"),
            data: function (searchTerm) {
                return { id: searchTerm };
            },
            results: function (data) {
                return { results: data };
            }
        },
        dropdownAutoWidth: true,
        formatResult: selectFormatResultPatient
    }).on("change", function () {
        Callback($(this).select2('data'));
        $("#txtsex").val($(this).select2('data').Sex);
        $("#txtname").val($(this).select2('data').name);
        $("#txtage").val($(this).select2('data').Age);
    });
}
function bindInpatientList(Callback) {
    $("#txtpatientID").select2({
        allowClear: false,
        placeholder: "Search Patient",
        minimumInputLength: 2,
        ajax: {
            cache: false,
            type: 'GET',
            dataType: "json",
            url: $("#url").data("patient"),
            data: function (searchTerm) {
                return { id: searchTerm };
            },
            results: function (data) {
                return { results: data };
            }
        },
        dropdownAutoWidth: true,
        formatResult: selectFormatResultPatient
    }).on("change", function () {
        Callback();
        $("#txtbed").val($(this).select2('data').BedName);
        $("#txtadmit").val($(this).select2('data').DateTime);
        $("#txtdisc").val($(this).select2('data').DischargeDate);
        $("#txtcompany").val($(this).select2('data').CompanyName);
    });
}


var MedicalEquipment = [];
function InitMedicalEquipment(id) {
    $.ajax({
        cache: false,
        type: 'GET',
        url: $("#url").data("equipment"),
        success: function (MedicalEquipment) {
            $("#txtMedical").select2({
                allowClear: true,
                initSelection: function (element, callback) {
                    var selection = _.find(MedicalEquipment, function (metric) {
                        return metric.id === element.val();
                    })
                    callback(selection);
                },
                query: function (options) {
                    var pageSize = 100;
                    var startIndex = (options.page - 1) * pageSize;
                    var filteredData = MedicalEquipment;
                    var stripDiacritics = window.Select2.util.stripDiacritics;

                    if (options.term && options.term.length > 0) {
                        if (!options.context) {
                            var term = stripDiacritics(options.term.toLowerCase());
                            options.context = MedicalEquipment.filter(function (metric) {
                                if (!metric.stripped_text) {
                                    metric.stripped_text = stripDiacritics(metric.id.toLowerCase());
                                }
                                return (metric.stripped_text.indexOf(term) !== -1 || metric.id.toString().toUpperCase().indexOf(term.toUpperCase()) != -1);

                            });
                        }
                        filteredData = options.context;
                    }

                    options.callback({
                        context: filteredData,
                        results: filteredData.slice(startIndex, startIndex + pageSize),
                        more: (startIndex + pageSize) < filteredData.length
                    });
                },
                dropdownAutoWidth: true,
                formatResult: selectFormatEquip
            });
            if (id != 0) {
                $("#txtMedical").select2('val', id);
            }
        }
    });
};

function InitTransferStation() {
    $.ajax({
        cache: false,
        type: 'GET',
        url: $("#url").data("tstation"),
        success: function (data) {
            $("#txttransferstation").select2({
                allowClear: true,
                initSelection: function (element, callback) {
                    var selection = _.find(data, function (metric) {
                        return metric.id === element.val();
                    })
                    callback(selection);
                },
                query: function (options) {
                    var pageSize = 100;
                    var startIndex = (options.page - 1) * pageSize;
                    var filteredData = data;
                    var stripDiacritics = window.Select2.util.stripDiacritics;

                    if (options.term && options.term.length > 0) {
                        if (!options.context) {
                            var term = stripDiacritics(options.term.toLowerCase());
                            options.context = data.filter(function (metric) {
                                if (!metric.stripped_text) {
                                    metric.stripped_text = stripDiacritics(metric.id.toLowerCase());
                                }
                                return (metric.stripped_text.indexOf(term) !== -1 || metric.id.toString().toUpperCase().indexOf(term.toUpperCase()) != -1);

                            });
                        }
                        filteredData = options.context;
                    }

                    options.callback({
                        context: filteredData,
                        results: filteredData.slice(startIndex, startIndex + pageSize),
                        more: (startIndex + pageSize) < filteredData.length
                    });
                },
                dropdownAutoWidth: true,
                formatResult: selectFormatName
            }).on("change", function () {
                $("#txtbedtype").val('');
                InitTransferBed($(this).val());
            });
        }
    });
};

function InitTransferBed(idd) {
    $.ajax({
        cache: false,
        type: 'GET',
        url: $("#url").data("tbed"),
        data: { "ssID": idd },
        success: function (data) {
            $("#txttranserbed").select2({
                allowClear: true,
                initSelection: function (element, callback) {
                    var selection = _.find(data, function (metric) {
                        return metric.id === element.val();
                    })
                    callback(selection);
                },
                query: function (options) {
                    var pageSize = 100;
                    var startIndex = (options.page - 1) * pageSize;
                    var filteredData = data;
                    var stripDiacritics = window.Select2.util.stripDiacritics;

                    if (options.term && options.term.length > 0) {
                        if (!options.context) {
                            var term = stripDiacritics(options.term.toLowerCase());
                            options.context = data.filter(function (metric) {
                                if (!metric.stripped_text) {
                                    metric.stripped_text = stripDiacritics(metric.id.toLowerCase());
                                }
                                return (metric.stripped_text.indexOf(term) !== -1 || metric.id.toString().toUpperCase().indexOf(term.toUpperCase()) != -1);

                            });
                        }
                        filteredData = options.context;
                    }

                    options.callback({
                        context: filteredData,
                        results: filteredData.slice(startIndex, startIndex + pageSize),
                        more: (startIndex + pageSize) < filteredData.length
                    });
                },
                dropdownAutoWidth: true,
                formatResult: selectFormatName
            }).on("change", function () {
                $("#txtbedtype").val($(this).select2('data').bedtype);
            });
        }
    });
};
function selectFormatResult(data) {
    var markup = "<table><tr>";
    if (data.name !== undefined) {
        markup += "<td style='width:200px;' >" + data.PINNO + "</td>" + "<td style='width:350px;'>" + data.name + "</td>" + "<td style='width:70px;'>" + data.BedNo + "</td>";
    }
    markup += "</td></tr></table>"
    return markup;
}

function selectFormatResultPatient(data) {
    var markup = "<table><tr>";
    if (data.name !== undefined) {
        markup += "<td style='width:200px;' >" + data.PIN + "</td>" + "<td style='width:350px;'>" + data.name + "</td>";
    }
    markup += "</td></tr></table>"
    return markup;

}
function selectFormatDoctor(data) {
    var markup = "<table><tr>";
    if (data.name !== undefined) {
        markup += "<td style='width:70px;' >" + data.code + "</td>" + "<td>" + data.name + "</td>" + "<td>" + data.name + "</td>";
    }
    markup += "</td></tr></table>"
    return markup;
}
function selectItem(data) {
    var markup = "<table><tr>";
    if (data.name !== undefined) {
        markup += "<td style='width:100px;' >" + data.code + "</td>" + "<td>" + data.name + "</td>";
    }
    markup += "</td></tr></table>"
    return markup;
}
function selectFormatEquip(data) {
    var markup = "<table><tr>";
    if (data.name !== undefined) {
        markup += "<td>" + data.name + "</td>";
    }
    markup += "</td></tr></table>"
    return markup;
}
function selectFormatName(data) {
    var markup = "<table><tr>";
    if (data.name !== undefined) {
        markup += "<td>" + data.text + "</td>";
    }
    markup += "</td></tr></table>"
    return markup;
}


var Req = [];
function InitRequestType(id) {
    Req = [];
    Req.push({
        id: '0',
        text: 'Normal',
        name: 'Normal'
    });

    Req.push({
        id: '1',
        text: 'Stat',
        name: 'Stat'
    });

    Req.push({
        id: '2',
        text: 'Take Home',
        name: 'Take Home'
    });

    bindRequestType();
    $("#txtrequest").select2("val", id);
};
function bindRequestType() {
    $("#txtrequest").select2({
        allowClear: true,
        initSelection: function (element, callback) {
            var selection = _.find(Req, function (metric) {
                return metric.id === element.val();
            })
            callback(selection);
        },
        query: function (options) {
            var pageSize = 100;
            var startIndex = (options.page - 1) * pageSize;
            var filteredData = Req;
            var stripDiacritics = window.Select2.util.stripDiacritics;

            if (options.term && options.term.length > 0) {
                if (!options.context) {
                    var term = stripDiacritics(options.term.toLowerCase());
                    options.context = Req.filter(function (metric) {
                        if (!metric.stripped_text) {
                            metric.stripped_text = stripDiacritics(metric.id.toLowerCase());
                            metric.stripped_text = stripDiacritics(metric.name.toLowerCase());
                        }
                        return (metric.stripped_text.indexOf(term) !== -1 || metric.id.toString().toUpperCase().indexOf(term.toUpperCase()) != -1);
                    });
                }
                filteredData = options.context;
            }

            options.callback({
                context: filteredData,
                results: filteredData.slice(startIndex, startIndex + pageSize),
                more: (startIndex + pageSize) < filteredData.length
            });
        },
        dropdownAutoWidth: true,
        formatResult: selectRequest
    });
};
function selectRequest(data) {
    var markup = "<table><tr>";
    if (data.name !== undefined) {
        markup += "<td style='width:150px;' >" + data.name + "</td>";
    }
    markup += "</td></tr></table>"
    return markup;
}

var ExtraFoodTable;
function InitExtraFoodList() {
    $.ajax({
        cache: false,
        type: 'GET',
        url: $("#url").data("extrafood"),
        success: function (xdata) {
            ExtraFoodTable = $("#tbl-extrafood-list").DataTable({
                destroy: true,
                paging: true,
                searching: true,
                ordering: true,
                info: false,
                data: xdata,
                columns: [
                    { data: "Code" },
                    { data: "Name" }
                ]
            });

        }
    });
}
function ExtraFoodList() {
    for (var i = 0; i < ExtraFood.length; i++) {
        $("#select-extra-food").append('<option data-id="' + ExtraFood[i].ID + '" data-code="' + ExtraFood[i].Code + '" data-name="' + ExtraFood[i].Code + ' - ' + ExtraFood[i].Name + '" data-unit="' + ExtraFood[i].Units + '"  >' + ExtraFood[i].Code + ' - ' + ExtraFood[i].Name + '</option>');
    }
}


function BindDrugList() {
    TableDrug = $("#tbl-drug-list").DataTable({
        destroy: true,
        paging: true,
        searching: true,
        ordering: true,
        info: false,
        data: DrugList,
        columns: [
            { data: "ID", visible: false },
            { data: "Code" },
            { data: "Description", visible: false },
            { data: "Description2" },
            { data: "UnitName", visible: false },
            { data: "Dose", visible: false },
            { data: "DoseName", visible: false }
        ]
    });
}

function InitGenericList() {
    $.ajax({
        cache: false,
        type: 'GET',
        url: $("#url").data("genericlist"),
        success: function (data) {
            GenericList = data;

        }
    });
}
function BindGenericList() {
    TableGeneric = $("#tbl-generic-list").DataTable({
        destroy: true,
        paging: true,
        searching: true,
        ordering: false,
        info: false,
        data: GenericList,
        columns: [
            { data: "ID", visible: false },
            { data: "Code" },
            { data: "Description" },

            { data: "Dose", visible: false },
            { data: "DoseName", visible: false }
        ]
    });
}



function BindOtherProc() {
    TableOtherProc = $("#tbl-proc-list").DataTable({
        destroy: true,
        paging: true,
        searching: true,
        ordering: true,
        info: false,
        data: OtherProcList,
        columns: [
            { data: "ID", visible: false },
            { data: "Code" },
            { data: "Description" }
        ]
    });
}

function BindNurseProc() {
    TableNursingProc = $("#tbl-proc-list").DataTable({
        destroy: true,
        paging: true,
        searching: true,
        ordering: true,
        info: false,
        data: NurseProcList,
        columns: [
            { data: "ID", visible: false },
            { data: "Code" },
            { data: "Description" }
        ]
    });
}

function InitProcedureSelect() {
    $("#list-procedure-order").select2({
        allowClear: false,
        placeholder: "Search Procedure",
        minimumInputLength: 3,
        ajax: {
            cache: false,
            type: 'GET',
            dataType: "json",
            url: $("#url").data("otherprocselect"),
            data: function (searchTerm) {
                return { id: searchTerm };
            },
            results: function (data) {
                return { results: data };
            }
        },
        dropdownAutoWidth: true,
        formatResult: selectItem
    });
    //.on("change", function () {
//        $("#txtsex").val($(this).select2('data').Sex);
//        $("#txtname").val($(this).select2('data').name);
//        $("#txtage").val($(this).select2('data').Age);
    //});
};




function InitUnit(itemid,id, CallBack) {
    var UnitID;
    $.ajax({
        cache: false,
        type: 'GET',
        data: { "id": itemid },
        url: $("#url").data("unitlist"),
        success: function (data) {
            UnitID = '<select class="unitlist">';
            for (var i = 0; i < data.length; i++) {
                if (data[i].ID == id) {
                    UnitID = UnitID + '<option  data-id=' + data[i].ID + '  value=' + data[i].ID + ' selected="selected" >' + data[i].Name + '</option>';
                }
                else {
                    UnitID = UnitID + '<option data-id=' + data[i].ID + '  value=' + data[i].ID + ' >' + data[i].Name + '</option>';
                }
            }
            UnitID = UnitID + '</select>';
            CallBack(UnitID);
        }
    });
}


function InitFreqList(id, CallBack) {
    var FrequencyList;
    $.ajax({
        cache: false,
        type: 'GET',
        url: $("#url").data("frequencylist"),
        success: function (data) {
            FrequencyList = '<select class="frequency">';
            for (var i = 0; i < data.length; i++) {
                if (data[i].ID == id) {
                    FrequencyList = FrequencyList + '<option  data-id=' + data[i].ID + '  value=' + data[i].ID + ' selected="selected" >' + data[i].Name + '</option>';
                }
                else {
                    FrequencyList = FrequencyList + '<option data-id=' + data[i].ID + '  value=' + data[i].ID + ' >' + data[i].Name + '</option>';
                }
            }
            FrequencyList = FrequencyList + '</select>';
            CallBack(FrequencyList);
        }
    });
}

function InitDurationList(id, CallBack) {
    var DurationList;
    $.ajax({
        cache: false,
        type: 'GET',
        url: $("#url").data("durationlist"),
        success: function (data) {
            DurationList = '<select class="duration">';
            for (var i = 0; i < data.length; i++) {
                if (data[i].ID == id) {
                    DurationList = DurationList + '<option value=' + data[i].ID + ' selected="selected" >' + data[i].Name + '</option>';
                }
                else {
                    DurationList = DurationList + '<option value=' + data[i].ID + ' >' + data[i].Name + '</option>';
                }
            }
            DurationList = DurationList + '</select>';
            CallBack(DurationList);
        }
    });
}


function InitRouteList(id, CallBack) {
    var RouteList;
    $.ajax({
        cache: false,
        type: 'GET',
        url: $("#url").data("routeadmin"),
        success: function (data) {
            RouteList = '<select class="routeadmin">';
            for (var i = 0; i < data.length; i++) {
                if (data[i].ID == id) {
                    RouteList = RouteList + '<option value=' + data[i].ID + ' selected="selected" >' + data[i].Name + '</option>';
                }
                else {
                    RouteList = RouteList + '<option value=' + data[i].ID + ' >' + data[i].Name + '</option>';
                }
            }
            RouteList = RouteList + '</select>';
            CallBack(RouteList);
        }
    });
}


function BindTestList() {
    TableTest = $("#tbl-all-test").DataTable({
        destroy: true,
        paging: true,
        searching: true,
        ordering: true,
        info: false,
        data: TestList,
        columns: [
            { data: "ID", visible: false },
            { data: "Code" },
            { data: "Description" }
        ]
    });
}


function BindProfileList() {
    TableProfile = $("#tbl-all-profile").DataTable({
        destroy: true,
        paging: true,
        searching: true,
        ordering: false,
        info: false,
        data: ProfileList,
        columns: [
            { data: "ID", visible: false },
            { data: "Code" },
            { data: "Description" }
        ]
    });
}

function InitPatientStat(id) {
    $.ajax({
        cache: false,
        type: 'GET',
        url: $("#url").data("patientstat"),
        success: function (data) {
            $("#txtstatus").select2({
                allowClear: true,
                initSelection: function (element, callback) {
                    var selection = _.find(data, function (metric) {
                        return metric.id === element.val();
                    })
                    callback(selection);
                },
                query: function (options) {
                    var pageSize = 100;
                    var startIndex = (options.page - 1) * pageSize;
                    var filteredData = data;
                    var stripDiacritics = window.Select2.util.stripDiacritics;

                    if (options.term && options.term.length > 0) {
                        if (!options.context) {
                            var term = stripDiacritics(options.term.toLowerCase());
                            options.context = data.filter(function (metric) {
                                if (!metric.stripped_text) {
                                    metric.stripped_text = stripDiacritics(metric.id.toLowerCase());
                                    metric.stripped_text = stripDiacritics(metric.name.toLowerCase());
                                }
                                return (metric.stripped_text.indexOf(term) !== -1 || metric.id.toString().toUpperCase().indexOf(term.toUpperCase()) != -1);
                            });
                        }
                        filteredData = options.context;
                    }

                    options.callback({
                        context: filteredData,
                        results: filteredData.slice(startIndex, startIndex + pageSize),
                        more: (startIndex + pageSize) < filteredData.length
                    });
                },
                dropdownAutoWidth: true,
                formatResult: selectRequest
            });

            $("#txtstatus").select2("val", id);
        }
    });
};

//*******Drug Return
var OrderNo = [];
function OrderNoList(DrugOrderID, OrderNo) {
    $.ajax({
        cache: false,
        type: 'GET',
        data: { "ipid": $("#txtpatientID").val() },
        url: $("#btnsave").data("orderno"),
        success: function (OrderNo) {
            $("#ordernolist").select2({
                allowClear: true,
                initSelection: function (element, callback) {
                    var selection = _.find(OrderNo, function (metric) {
                        return metric.id === element.val();
                    })
                    callback(selection);
                },
                query: function (options) {
                    var pageSize = 100;
                    var startIndex = (options.page - 1) * pageSize;
                    var filteredData = OrderNo;
                    var stripDiacritics = window.Select2.util.stripDiacritics;

                    if (options.term && options.term.length > 0) {
                        if (!options.context) {
                            var term = stripDiacritics(options.term.toLowerCase());
                            options.context = OrderNo.filter(function (metric) {
                                if (!metric.stripped_text) {
                                    metric.stripped_text = stripDiacritics(metric.id.toLowerCase());
                                }
                                return (
                                metric.id.toString().toUpperCase().indexOf(term.toUpperCase()) != -1 ||
                                metric.text.toString().toUpperCase().indexOf(term.toUpperCase()) != -1
                                );

                            });
                        }
                        filteredData = options.context;
                    }

                    options.callback({
                        context: filteredData,
                        results: filteredData.slice(startIndex, startIndex + pageSize),
                        more: (startIndex + pageSize) < filteredData.length
                    });
                },
                dropdownAutoWidth: true,
                formatResult: selectFormatOrderNo
            }).on("change", function () {

                if ($("#stat").val() == "0") {
                    $("#orderdrugid").val($(this).select2('data').OrderID);
                    ClearDrugSelected();
                    InitDrugReturnList($(this).select2('data').OrderID);
                }
            });
            if (DrugOrderID != undefined) {
                $("#ordernolist").select2("val", DrugOrderID);
                $("#ordernolist").select2('enable', false);
            }
        }
    });
}
function selectFormatOrderNo(data) {
    var markup = "<table><tr>";
    if (data.name !== undefined) {
        markup += "<td style='width:70px;' >" + data.text + "</td>";
    }
    markup += "</td></tr></table>"
    return markup;
}

function InitDrugReturnList(id) {
    ajaxWrapper.Get($("#url").data("orderlist"), { "ID": id }, function (xdata, e) {
        TableDrug = $("#tbl-drug-return-druglist").DataTable({
            destroy: true,
            paging: false,
            searching: false,
            ordering: true,
            info: false,
            data: xdata,
            columns: [
            { data: "DrugName" }
            ]
        });
    });
}

var tblBloodReturn;
var tblBloodReturnSelected;
function BindBloodReturn(id) {
    ajaxWrapper.Get($("#url").data("blood"), { "IPID": id }, function (xdata, e) {
        tblBloodReturn = $("#tbl-blood-list").DataTable({
            destroy: true,
            paging: false,
            searching: false,
            ordering: false,
            info: false,
            data: xdata,
            columns: [
                { data: "Code" },
                { data: "Quantity" },
                { data: "RequiredDate"},
                { data: "Name"},
                { data: "ComponentID", visible: false }
            ]
        });
        var xx = {
            "Code": "",
            "Quantity": "",
            "RequiredDate": "",
            "Name": "",
            "ComponentID" : ""
        };

        tblBloodReturnSelected = $("#tbl-blood-selected").DataTable({
            destroy: true,
            paging: false,
            searching: false,
            ordering: false,
            info: false,
            data: xx,
            columns: [
                { data: "Code" },
                { data: "Quantity" },
                { data: "RequiredDate" },
                { data: "Name", visbile: false },
                { data: "ComponentID", visible: false }
            ]
        });
    });
}