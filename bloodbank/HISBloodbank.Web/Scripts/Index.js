var ajaxWrapper = $.ajaxWrapper();
var PatientViewFrame = $('<div class="modal fade" id="_message-iframe" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog" style="width: 100%;height:100%;"><button type="button" class="btn btn-danger btn-md pull-right"  data-dismiss="modal" id="btn-close"><span class="glyphicon glyphicon-remove"></span> Close</button><iframe id="iframe-link" style="width: 100%;height:100%;"></iframe></div></div>');

$(function () {
    //SecureFeatures(); // uncomment to activate security.
});


$(document).ready(function () {
    GetListOfStation();
    GetInfo();
    GetMenu();
    $("#ListOfStation").change(function () {
        var option = $("#ListOfStation").val();
        SetCurrentStation(option);
    });
    $(document).on("click", "._iframeload", function () {

        setCookie("AppName", $(".AR_about_title").html(), 1);
        var url = $(this).data('url');
        $("._mainiframe").append($(PatientViewFrame));
        $("#_message-iframe").modal();
        $("#iframe-link").attr('src', url);
        console.log('url');
        console.log(url);
    });
    $(document).on('hidden.bs.modal', "#_message-iframe", function () {
        $(this).remove();
    });

});

function GetMenu() {
    ajaxWrapper.Get($("#txtstationame").data("appmenu"), null, function (d, e) {
        $("#url-menu").html(d);
    });
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
}
function GetListOfStation() {
    var Url = baseURL + 'GetListOfStation';
    var param = {
        ModuleId: 13
    };

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

            var list = data.list[0].ListOStations;

            $(list).each(function () {
                var option = $('<option />');
                option.attr('value', this.value).text(this.label);

                $('#ListOfStation').append(option);
            });

            $('#ListOfStation').val(data.list[0].value);

        },
        error: function (xhr, desc, err) {
            var errMsg = err + "<br>" + desc;
        }
    });
}
function SetCurrentStation(Id) {

    $.ajax({
        url: baseURL + 'SetCurrentStation',
        data: { 'Value': Id },
        type: 'post',
        cache: false,
        success: function (data) {
            Refresh();
        },
        error: function (xhr, desc, err) {
            var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
            alert(errMsg);
        }
    });

}
function GetInfo() {
    var Url = baseURL + "GetInfo";

    $.ajax({
        url: Url,
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false,
        beforeSend: function () {

        },
        success: function (data) {

            var data = data.list[0];
            $("#svrinfo").text(data.svr);


        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}

function SecureFeatures() {

    $(".featlink").addClass("disabled");
    $(".featlink").css("pointer-events", "none");
    ajaxWrapper.Get($("#txtstationame").data("urlsecure"), null, function (d, e) {
        $.each(d, function (index, name) {
            $('.featlink').each(function () {
                if ($(this).data("featid") == name.id) {
                    $(this).removeClass("disabled");
                    $(this).css("pointer-events", "visible");
                }
            });
        });
    });
}
