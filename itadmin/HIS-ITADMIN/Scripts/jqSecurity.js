var ajaxWrapper = $.ajaxWrapper();
var PatientViewFrame = $('<div class="modal fade" id="_message-iframe" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog" style="width: 100%;height:100%;"><iframe id="iframe-link" style="width: 100%;height:100%;"></iframe></div></div>');

$(document).ready(function () {	
    GetMenu();
	setStorage("HIS_MODULEID", $("#mainiframe").data("modid"));
    $(document).on("click", "._iframeload", function () {
        var url = $(this).data('url');
        //$("._mainiframe").append($(PatientViewFrame));
		$("#mainiframe").append($(PatientViewFrame));
        $("#_message-iframe").modal();
        $("#iframe-link").attr('src', url);
    });
    $(document).on('hidden.bs.modal', "#_message-iframe", function () {
        $(this).remove();
    });
    SecureFunction();

    $(this).bind("contextmenu", function(e) {
                e.preventDefault();
            });
    
});
function GetMenu() {
    ajaxWrapper.Get($("#txtstationame").data("appmenu"), null, function (d, e) {
        $("#url-menu").html(d);
    });
}

    $(document).on("keyup", "#featsearch", function () {

            $(".featlink").hide();
            $("._parentlink").hide();

            var i = $(this).val().toLowerCase();
            //$(".featlink[data-search*='" + i + "']").show();
            //var ii = $(".featlink[data-search*='" + i + "']").data("parentid");

            $.each($(".featlink[data-search*='" + i + "']"), function () {
                var ii = $(this).data("parentid");
                $(this).show();
                $("._parentlink_" + ii).show();
                $("._parentlink_" + ii).show();
                $("._parentmenu_" + ii).addClass("menu-open");
                $("._parentmenu_" + ii).css("display", "block");
            });

            if (i == "") {
                $(".featlink").show();
                $("._parentlink").show();
                $("._parentmenu").removeClass("menu-open");
                $("._parentmenu").css("display", "none");
            }
        });

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

function SecureFunction() {
    $(".func-btn").addClass("disabled");
    ajaxWrapper.Get($("#txtstationame").data("urlfunction"), null, function (d, e) {       
        $.each(d, function (index, name) {
            $('.func-btn').each(function () {
                if ($(this).data("funcid") == name.id) {
                    $(this).removeClass("disabled");
                }
            });
        });
    });
}

function setStorage(name, val) {
    if (typeof (Storage) !== "undefined") {
        localStorage.setItem(name, val);
    }
}
function getStorage(name) {
    if (typeof (Storage) !== "undefined") {
        return localStorage.getItem(name);
    }
}
function delStorage(name) {
    if (typeof (Storage) !== "undefined") {
        return localStorage.removeItem(name);
    }
}
