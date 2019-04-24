
var ajaxWrapper = $.ajaxWrapper();
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
            NotifySuccess(data.Message, module);
            if (SuccessCallBack)
                SuccessCallBack();
        }
    });
}


