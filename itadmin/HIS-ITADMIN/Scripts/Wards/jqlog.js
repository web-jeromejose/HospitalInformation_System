

var ajaxWrapper = $.ajaxWrapper();
function TransactionLogin() {

    ajaxWrapper.Get($("#urllist").data("usrlog"), null, function (xdata, e) {
        $("._transactionlogin-box").modal({ keyboard: true });
        $("#_translog").html(xdata);
        InitUserList();
    });
}
function InitUserList() {
    $("#txttransactionusername").select2({
        allowClear: false,
        placeholder: "Username",
        minimumInputLength: 2,
        ajax: {
            cache: false,
            type: 'GET',
            dataType: "json",
            url: $("#urllist").data("usrlist"),
            data: function (searchTerm) {
                return { id: searchTerm };
            },
            results: function (data) {
                return { results: data };
            }
        },
        dropdownAutoWidth: true,
        formatResult: selectFormatResultUser
    }).on("change", function () {
        $("#txtpassword").focus();
    });
}
function selectFormatResultUser(data) {
    var markup = "<table><tr>";
    if (data.name !== undefined) {
        markup += "<td style='width:100px;' >" + data.id + "</td>" + "<td>" + data.text + "</td>";
    }
    markup += "</td></tr></table>"
    return markup;
}
function TransactionLog(CallBack) {
    var aData = {
        "id": $("#txttransactionusername").val(), "pass": $("#txttransactionpassword").val()
    }
    $.ajax({
        cache: false,
        type: 'POST',
        url: $("#btnsigntransaction").data("transsign"),
        data: JSON.stringify(aData),
        contentType: 'application/json',
        success: function (data) {
            CallBack(data);
        }
    }); 
}