var ajaxWrapper = $.ajaxWrapper();
var c = new Common();
$(function () { });

function Refresh() {
    location.reload();
}
$(document).ready(function () {
    GetListOfStation();
 
    $(document).on("change", "#ListOfStation", function (e) {
        var option = $("#ListOfStation").val(); 
        SetCurrentStation(option);
    });

    $(this).bind("contextmenu", function(e) {
                e.preventDefault();
            });
 
});

function GetListOfStation() {
    //var Url = baseURL + 'GetListOfStation';
    var Url = $('#txtstationame').data('getlistofstation');
    var param = {
        ModuleId: 5 // OT
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
          
            var station = $('#ListOfStation').val();
            console.log('station' + station);
            if (station == null) {
                c.MessageBoxErr('Error...', 'Please select a station in the upper right.');
                return false;
            }

        },
        error: function (xhr, desc, err) {
            var errMsg = err + "<br>" + desc;
        }
    });
}
function SetCurrentStation(Id) {
    var Url = $('#txtstationame').data('setcurrentstation');
    $.ajax({
        url: Url,//baseURL + 'SetCurrentStation',        
        data: { 'Value': Id },
        type: 'post',
        cache: false,
        success: function (data) {
            Refresh();
            $('#btnClose').click();
        },
        error: function (xhr, desc, err) {
            var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
            alert(errMsg);
        }
    });

}


//function SecureFeatures() {
    
//    $(".featlink").addClass("disabled");
//    $(".featlink").css("pointer-events", "none");
//    ajaxWrapper.Get($("#txtstationame").data("urlsecure"), null, function (d, e) {
//        $.each(d, function (index, name) {
//            $('.featlink').each(function () {
//                if ($(this).data("featid") == name.id) {
//                    $(this).removeClass("disabled");
//                    $(this).css("pointer-events", "visible");
//                }
//            });
//        });
//    });
//}
