var LoadingDivID = '<div class="sk-folding-cube"><div class="sk-cube1 sk-cube"></div><div class="sk-cube2 sk-cube"></div><div class="sk-cube4 sk-cube"></div><div class="sk-cube3 sk-cube"></div></div>'

var ajaxWrapper = $.ajaxWrapper();
$(function () {
    $(".read").attr("readonly", "readonly");
});
function NotifData(x) {
    var _notf = "";
    var _notctr = 0;
    $.each(x, function (y, z) {
        if (z.name == "0") {
            _notf = _notf + '<a href="#" class="_notiflink" data-id=' + z.id + ' data-txt=' + z.text + '><i class="fa fa-users text-aqua"></i> ' + z.text + '</a>';
            _notctr = _notctr + 1;
        }
    });
    NotifyInfo(_notctr + "  New Notification ", "");
    $("#_notf_list").html(_notf);
    $("._notf_ctr").text(_notctr);
    $(document).on("click", "._notiflink", function () {
        var notifid = $(this).data('id');
        var htmlsumm = "";
        $.each(x, function (y, z) {
            if (z.id == notifid) {
                if (z.name == "1") {
                    htmlsumm = htmlsumm + "<tr><td style='font-size:10px;text-align:left;'>" + z.text + "</th></tr>";


                } else {
                    htmlsumm = htmlsumm + "<div style='height:300px;overflow:auto;'><hr/><table class='table table-hover'><thead><tr><th>" + z.text + "</th></tr></thead><tbody>";
                }
            }
        });
        htmlsumm = htmlsumm + "</tbody></table></div>";
        notifid = $(this).data('txt');
        swal({
            title: "Notification",
            text: htmlsumm,
            html: true
        });
    });

}
function NotifDataIP(x) {
    var _notf = "";
    var _notctr = 0;
    $.each(x, function (y, z) {
        _notf = _notf + '<a href="#" class="_notiflink" data-id=' + z.id + ' data-txt=' + z.text + '><i class="fa fa-users text-aqua"></i> ' + z.PIN + " (" + z.Bed + ") " + '</a>';
        _notctr = _notctr + 1;
    });
    $("#_notf_list").html(_notf);
    $("._notf_ctr").text(_notctr);
    $(document).on("click", "._notiflink", function () {
        var notifid = $(this).data('id');
        var htmlsumm = "";
        $.each(x, function (y, z) {
            htmlsumm = htmlsumm + "<div style='height:300px;overflow:auto;'><hr/><table class='table table-hover'><thead><tr><th>" + z.PIN + " (" + z.Bed + ") " + "</th></tr></thead><tbody>";
        });
        htmlsumm = htmlsumm + "</tbody></table></div>";
        notifid = $(this).data('txt');
        swal({
            title: "Notification",
            text: htmlsumm,
            html: true
        });
    });

}
function Clear() {
    window.location.reload();
}
function AjaxWrapperGet(url, div) {
    $.ajax({
        cache: false,
        type: 'GET',
        url: url,
        async: true,
        contentType: 'application/json',
        //data: aData,
        beforeSend: function () {
            $(".spinner").modal({ keyboard: false });
        },
        complete: function () {
            $(".spinner").modal('hide');
        },
        success: function (data) {
            div.html(data);
        }
    });
}
function AjaxWrapperGetData(url, div, aData) {
    $.ajax({
        cache: false,
        type: 'GET',
        url: url,
        contentType: 'application/json',
        data: aData,
        beforeSend: function () {
            $(".spinner").modal({ keyboard: false });
        },
        success: function (data) {
            $(".spinner").modal('hide');
            div.html(data);
        }
    });
}
function NotifySuccess(msg, module) {
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "positionClass": "toast-top-right",
        "onclick": null,
        "showDuration": "2000",
        "hideDuration": "2000",
        "timeOut": "2000",
        "extendedTimeOut": "2000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "slideDown",
        "hideMethod": "fadeOut"
    }
    toastr.success(msg, module);
}
function NotifyError(msg, module) {
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "positionClass": "toast-top-right",
        "onclick": null,
        "showDuration": "2000",
        "hideDuration": "2000",
        "timeOut": "2000",
        "extendedTimeOut": "2000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "slideDown",
        "hideMethod": "fadeOut"
    }
    toastr.warning(msg, module);
}

function NotifyInfo(msg, module) {
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "positionClass": "toast-top-right",
        "onclick": null,
        "showDuration": "2000",
        "hideDuration": "2000",
        "timeOut": "2000",
        "extendedTimeOut": "2000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "slideDown",
        "hideMethod": "fadeOut"
    }
    toastr.info(msg, module);
}
function NotifyInfoFix(msg, module) {
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "positionClass": "toast-top-right",
        "onclick": null,
        "showDuration": "0",
        "hideDuration": "0",
        "timeOut": "0",
        "extendedTimeOut": "0",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "slideDown",
        "hideMethod": "fadeOut"
    }
    toastr.info(msg, module);
}
function AjaxWrapperPost(url, aData, SuccessCallBack, module) {
    $.ajax({
        cache: false,
        type: 'POST',
        url: url,
        data: aData,
        contentType: 'application/json',
        beforeSend: function () {
            $(".spinner").modal({ keyboard: false });
        },
        success: function (data, e) {
            $(".spinner").modal('hide');
            if (data.Flag == "1") {
                NotifySuccess(data.Message, module);
            }
            else {
                NotifyError(data.Message, module);
            }

            if (SuccessCallBack)
                SuccessCallBack(data);
        }
    });
}

function LoadingFunc() {
    $('div._dmain').block({
        message: $(LoadingDivID),
        css: { width: '4%', border: '0px none #FFFFFF', cursor: 'wait', backgroundColor: '#FFFFFF' },
        overlayCSS: { backgroundColor: '#FFFFFF', opacity: 0.0, cursor: 'wait' }
    });
}
function selectFormatResult(data) {
    var markup = "<table><tr>";
    if (data.name !== undefined) {
        markup += "<td>" + data.text + "</td>";
    }
    markup += "</td></tr></table>"
    return markup;
}
function DTAddDys(id, idd, CallBack) {
    id = moment(id).format('DD MMM YYYY')
    id = moment(moment(id, "DD MMM YYYY").add('days', idd)).format('DD MMM YYYY');
    CallBack(id);
}
function InitDT(input) {
    $(input).datepicker({
        format: 'dd M yyyy',
        toggleActive: true,
        autoclose: true
    }).on("change", function () {
        if ($(this).val() == "") {
            $(this).val("");
        }
    });
    $(input).val(moment(new Date()).format('DD MMM YYYY'));
}
function DTFormatShort(id, CallBack) {
    CallBack(moment(id).format('DD MMM YYYY'));
}
function DTFormat(id, CallBack) {
    CallBack(moment(id).format('DD MMM YYYY hh:mm:ss A'));
}
function DTimeFormat(id, CallBack) {
    CallBack(moment(id).format('hh:mm:ss A'));
}
function DTSeriesNo(input, id) {
    input.on('order.dt search.dt', function () {
        input.column(id, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();
}
function OpenModal(input) {
    $(input).modal({ keyboard: true });
}

function OpenDialog(title, message, CallBack) {
    swal({
        title: title, text: message, type: "info", showCancelButton: true,
        closeOnConfirm: true, showLoaderOnConfirm: true,
    }, function () {
        CallBack();
    });
}

function InitSel2CSS(input) {
    $(input).select2({ query: function () { } });
    $(input).select2("enable", false)
}

function Sel2Server(input, url, Callback) {
    $(input).select2({
        allowClear: false,
        placeholder: "Search",
        ajax: {
            cache: false,
            type: 'GET',
            dataType: "json",
            url: url,
            data: function (searchTerm) {
                return { id: searchTerm };
            },
            results: function (data) {
                return { results: data };
            }
        },
        dropdownAutoWidth: true,
        formatResult: selectFormatName
    }).on("change", function () {
        Callback($(this).select2('data'));
    });
}

function Sel2Client(input, data, CallBack) {
    $(input).select2({
        allowClear: true,
        placeholder: "All",
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
                        } return (metric.stripped_text.indexOf(term) !== -1 || metric.id.toString().toUpperCase().indexOf(term.toUpperCase()) != -1 || metric.name.toString().toUpperCase().indexOf(term.toUpperCase()) != -1 || metric.text.toString().toUpperCase().indexOf(term.toUpperCase()) != -1);

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
    }).on('change', function () {
        CallBack($(this).select2('data'));
    });
    $(input).select2("enable", true);
}

function Sel2ClientAdd(input, data, CallBack) {
    $(input).select2({
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
                        } return (metric.stripped_text.indexOf(term) !== -1 || metric.id.toString().toUpperCase().indexOf(term.toUpperCase()) != -1 || metric.name.toString().toUpperCase().indexOf(term.toUpperCase()) != -1 || metric.text.toString().toUpperCase().indexOf(term.toUpperCase()) != -1);

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
        createSearchChoice: function (term, data) {
            if ($(data).filter(function () {
                return this.text.localeCompare(term) === 0;
            }).length === 0) {
                return { id: "0", text: term };
            }
        },
        dropdownAutoWidth: true,
        formatResult: selectFormatName
    }).on('change', function () {
        CallBack($(this).select2('data'));
    });
    $(input).select2("enable", true);
}

function selectFormatName(data) {
    var markup = "<table><tr>";
    if (data.name !== undefined) {
        markup += "<td>" + data.text + "</td>";
    }
    markup += "</td></tr></table>"
    return markup;
}

function GreenCheck(input) {
    $(input).iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green'
    });
}

function Question(title, text, type, CallBack) {
    swal({
        title: title,
        text: text,
        html: true, type: type, showCancelButton: true, confirmButtonColor: "#DD6B55", confirmButtonText: "Yes!", closeOnConfirm: true
    }, function () {
        CallBack(true);
    });
}
function SavePrompt(title, text, type) {
    swal({ title: title, text: text, html: true, type: type });
}


function LckScr() {
    $('body').block({ message: null });
}
function UnLckScr() {
    $('body').unblock();
}

var _dialogtimer;
function AlertDialog(id, CallBack) {

    if (id != 0) {
        _dialogtimer = setInterval(function () {

            CallBack();
        }, id * 1000); // 60 * 1000 milsec
    }
    else {
        clearInterval(_dialogtimer);
    }
}