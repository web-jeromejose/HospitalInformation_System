(function ($) {

    var LoadingDivID = '<div class="sk-folding-cube"><div class="sk-cube1 sk-cube"></div><div class="sk-cube2 sk-cube"></div><div class="sk-cube4 sk-cube"></div><div class="sk-cube3 sk-cube"></div></div>'


    $.ajaxWrapper = function (options) {

        this.defaults = {
            ShowLoading: true,
            LoaderContainerId: "#divLoader",
            LoaderText: "Loading...",
            LoadingDivID: "",
            ErrorCallBack: function (jqXHR, textStatus, errorThrown) {
                var contentType = jqXHR.getResponseHeader("Content-Type");
                if (jqXHR.status === 200 && contentType.toLowerCase().indexOf("text/html") >= 0) {
                    window.location.reload();
                    return;
                }
                else if (jqXHR.status === 500 && contentType.toLowerCase().indexOf("text/html") >= 0) {
                    document.open();
                    document.write(jqXHR.responseText);
                    document.close();
                    return;
                }
                else if (jqXHR.status === 404) {
                    document.open();
                    document.write(jqXHR.responseText);
                    document.close();
                    return;
                }

                var response = eval("(" + jqXHR.responseText + ")");
                var output = "Message: " + response.Message + "\n\n";
                output += "StackTrace: " + response.StackTrace;
                alert(output);
            }
        };

        var o = $.extend({}, this.defaults, options);

        this.Get = function (WebService, GetData, SuccessCallBack, LoadingDivID, LoaderText, ErrorCallback) {

            if (WebService == "")
                return 1; // Incorrect Parameters

            if (ErrorCallback == null)
                ErrorCallback = o.ErrorCallBack;

            if (GetData != null && typeof (GetData) === "object")
                GetData = $.param(GetData);

            var ShowLoading = false;
            if (typeof LoadingDivID !== 'undefined' && LoadingDivID != null && LoadingDivID != '')
                ShowLoading = true;

            if (typeof LoadingDivID !== 'undefined' && LoadingDivID != null && LoadingDivID.charAt(0) != '.')
                LoadingDivID = '#' + LoadingDivID;
            $('#preloader').show();
            $.ajax({
                type: "GET",
                url: WebService,
                data: GetData,
                cache: false,
                beforeSend: function () {
                  
                    if (ShowLoading != null ? ShowLoading : o.ShowLoading)
                        $(LoadingDivID).block();
                },
                success: function (data, e) {
                    if (SuccessCallBack)
                        SuccessCallBack(data, e);

                    if (ShowLoading != null ? ShowLoading : o.ShowLoading)
                        $(LoadingDivID).unblock({ fadeOut: 0 });
                    $('#preloader').hide();
                },
                //success: SuccessCallBack,
                error: ErrorCallback
            });

            return 0; // Successful
        };

        this.Post = function (WebService, JsonData, SuccessCallBack, LoadingDivID, LoaderText, ErrorCallback) {
            var blnBlockWholePage = false;
            if (typeof LoadingDivID !== 'undefined' && LoadingDivID != null && LoadingDivID.toLowerCase() == 'body')
                blnBlockWholePage = true;
            else if (typeof LoadingDivID !== 'undefined' && LoadingDivID != null && LoadingDivID.charAt(0) != '.')
                LoadingDivID = '#' + LoadingDivID;

            var ShowLoading = false;
            if (typeof LoadingDivID !== 'undefined' && LoadingDivID != null && LoadingDivID != '')
                ShowLoading = true;

            if (WebService == "")
                return 1; // Incorrect Parameters

            if (ErrorCallback == null)
                ErrorCallback = o.ErrorCallBack;

            if (typeof (JsonData) === "object")
                JsonData = JSON.stringify(JsonData);

            var headers = {};
            if ($('input[name="__RequestVerificationToken"]').length > 0) {
                var token = $('input[name="__RequestVerificationToken"]').val();
                headers['__RequestVerificationToken'] = token;
            }
            $('#preloader').show();
            $.ajax({
                type: "POST",
                url: WebService,
                data: JsonData,
                cache: false,
                //dataType: "json",
                headers: headers,
                contentType: "application/json; charset=utf-8",
                beforeSend: function () {
                    if (ShowLoading != null ? ShowLoading : o.ShowLoading) {
                        if (!blnBlockWholePage)
                            $(LoadingDivID).block();
                        else
                            $.blockUI({
                                message: '<img class="loadinggif" src="data:image/png;base64,R0lGODlhFAAUAIAAAP///wAAACH5BAEAAAAALAAAAAAUABQAAAIRhI+py+0Po5y02ouz3rz7rxUAOw==" width="128px" height="128px" alt="Loading">',
                                css: {
                                    padding: 0, margin: 0, width: '30%', top: '40%', left: '35%', textAlign: 'center', border: 'none', backgroundColor: 'transparent', cursor: 'wait'
                                }
                            });
                    }
                },
                //success: SuccessCallBack,
                success: function (data, e) {
                    if (SuccessCallBack)
                        SuccessCallBack(data, e);

                    if (ShowLoading != null ? ShowLoading : o.ShowLoading) {
                        if (!blnBlockWholePage)
                            $(LoadingDivID).unblock({ fadeOut: 0 });
                        else
                            $.unblockUI();
                    }
                    $('#preloader').hide();
                },
                error: ErrorCallback
            });

            return 0;
        };

        return this;
    };





})(jQuery);



var ajaxWrapper = $.ajaxWrapper();
$(function () {
    $(".read").attr("readonly", "readonly");
});
function Clear() {
    window.location.reload();
}
function AjaxWrapperGet(url, div) {
    $('#preloader').show();
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
            $('#preloader').hide();
        },
        success: function (data) {
            div.html(data);
        }
    });
}
function AjaxWrapperGetData(url, div, aData) {
    $('#preloader').show();
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
            $('#preloader').hide();
            div.html(data);
        }
    });
}
function NotifySuccess(msg, module) {
    toastr.success(msg, module).options = {
        "closeButton": false,
        "debug": true,
        "positionClass": "toast-bottom-left",
        "onclick": null,
        "showDuration": "700",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
}
function NotifyError(msg, module) {
    toastr.warning(msg, module).options = {
        "closeButton": false,
        "debug": true,
        "positionClass": "toast-bottom-left",
        "onclick": null,
        "showDuration": "100",
        "hideDuration": "100",
        "timeOut": "100",
        "extendedTimeOut": "100",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
}

function AjaxWrapperPost(url, aData, SuccessCallBack, module) {
    $('#preloader').show();
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
            $('#preloader').hide();
            if (data.Flag == "1") {
                NotifySuccess(data.Message, module);
            }
            else {
                NotifyError(data.Message, module);
            }

            if (SuccessCallBack)
                SuccessCallBack();
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

function InitDT(input) {
    $(input).datepicker({
        format: 'dd M yyyy',
        toggleActive: true,
        autoclose: true
    });
    $(input).val(moment(new Date()).format('DD MMM YYYY'));
}
function DTFormat(id, CallBack) {
    CallBack(moment(id).format('DD MMM YYYY hh:mm:ss A'));
}
function DTFormatShort(id, CallBack) {
    CallBack(moment(id).format('DD MMM YYYY'));
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
        minimumInputLength: 1,
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
function Sel2ClientMultiple(input, data, CallBack) {
    $(input).select2({
        allowClear: true,
        multiple: true,
        data: data,
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