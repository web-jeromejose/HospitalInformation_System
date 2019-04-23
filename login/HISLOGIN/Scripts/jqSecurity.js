
var PatientViewFrame = $('<div class="modal fade" id="_message-iframe" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog" style="width: 100%;height:100%;"><button type="button" class="btn btn-danger btn-md pull-right"  data-dismiss="modal" id="btn-close"><span class="glyphicon glyphicon-remove"></span> Close</button><iframe id="iframe-link" style="width: 100%;height:100%;"></iframe></div></div>');
var my_skins = [
"skin-blue",
"skin-black",
"skin-red",
"skin-yellow",
"skin-purple",
"skin-green",
"skin-blue-light",
"skin-black-light",
"skin-red-light",
"skin-yellow-light",
"skin-purple-light",
"skin-green-light"
];
var idletime = 0;
var idletick;
var jqSecurity = {
    "init": function () {

        if (typeof (Storage) !== "undefined") {
            var tmp = localStorage.getItem('skin');
            if (tmp && $.inArray(tmp, my_skins))
                jqSecurity.ChangeSkin(tmp);
        }

        jqSecurity.globalOnClick();

        if (getCookie("Logged_LockScreen").length != 0) {
            //for login users
            $(document).on("mousemove", "body", function () {
                idletime = 0;
            });
            $(document).on("keypress", "body", function () {
                idletime = 0;
            });
        

          
          jqSecurity.CheckLock();
           idletick = setInterval(jqSecurity.AutoLock, 1000);
       
        } 


    


       


       
    },
    "globalOnClick": function () {


        $(document).on("click", "._iframeload", function () {
            var url = $(this).data('url');
            $("#mainiframe").append($(PatientViewFrame));
            $("#_message-iframe").modal();
            $("#iframe-link").attr('src', url);
        });
        $(document).on('hidden.bs.modal', "#_message-iframe", function () {
            $(this).remove();
        });


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
        $(document).on("click", "[data-skin]", function (e) {
            jqSecurity.ChangeSkin($(this).data('skin'));
        });
        $(document).on("click", ".lockscreenLINK", function (e) {
            _.delay(function () {
                jqSecurity.LockScreen("true");
            }, 500);
        });

        $(document).on("click", "#btn-unlockthescreen", function (e) {
            let password = $('lockscreen_password').val();
         
            ajaxWrapper.Get($("#mainiframe").data("lockscreen"), { spass: password }, function (d) {
               
                if (d == true) {
                    _.delay(function () {
                        jqSecurity.LockScreen("false");
                    }, 500);
                }
                else {
                    _.delay(function () {
                        jqSecurity.LockScreen("true");
                    }, 500);
                }
            });
        });

        $(document).on("keydown", "#lockscreen_password", function (e) {
            if (event.which == 13) {
                let password = $(this).val();
               
                ajaxWrapper.Get($("#mainiframe").data("lockscreen"), { spass: password }, function (d) {
               
                    if (d == true) {
                        _.delay(function () {
                            jqSecurity.LockScreen("false");
                        }, 500);
                    }
                    else {
                        _.delay(function () {
                            jqSecurity.LockScreen("true");
                        }, 500);
                    }
                });
            }
        });


        $(document).on("change", "input[required=required],select[required=required]", function () {
            if ($(this).val() != "") {
                $(this).closest("div").removeClass("has-warning");
                $(this).closest("div").addClass("has-success");
                $(this).closest("div").children("i").removeClass("glyphicon-remove-circle");
                $(this).closest("div").children("i").addClass("glyphicon-ok-circle");
            }
            else {
                $(this).closest("div").removeClass("has-success");
                $(this).closest("div").addClass("has-warning");
                $(this).closest("div").children("i").removeClass("glyphicon-ok-circle");
                $(this).closest("div").children("i").addClass("glyphicon-remove-circle");
            }
        });


    },
    "GetMenu": function () {
        ajaxWrapper.Get($("#mainiframe").data("appmenu"), null, function (d, e) {
            $("#url-menu").html(d);
            //if ($(".featlink").data('isshow') != '0') {
            //    ajaxWrapper.Get($("#mainiframe").data("appissue"), null, function (dd) {
            //        $.each(dd, function (iss, isss) {
            //            jqSecurity.NotifyIssueInfo("<b><u>Issue:</u></b><small> : <i>" + isss.Remarks + "</i></small><br/>" + "<b><u>Remarks</u></b> : <small>" + isss.ResolvedRemarks + '</small>');
            //        });
            //    });
            //}
            jqSecurity.SecureFunction();
        });
    },
    "SecureFunction": function () {
        var sss = window.location;
        $.each($(".featlink > a"), function () {
            var ss = $(this).attr("href").split("/");
            if (sss.toString().indexOf(ss[3]) != -1) {
                var s = $(this).closest("li").data("featid");
                $(".func-btn").addClass("disabled");
                ajaxWrapper.Get($("#mainiframe").data("urlfunction"), { fid: s }, function (d, e) {
                    $.each(d, function (index, name) {
                        $('.func-btn').each(function () {
                            if ($(this).data("funcid") == name.id) {
                                $(this).removeClass("disabled");
                            }
                        });
                    });
                });
                return false;
            }
        });
    },
    "ChangeSkin": function (i) {
        $.each(my_skins, function (ii) {
            $("body").removeClass(my_skins[ii]);
        });

        $("body").addClass(i);
        if (typeof (Storage) !== "undefined") {
            localStorage.setItem('skin', i);
        }
    },
    "CheckLock": function () {
       

            if (getCookie("lock") == "true") {
                _.delay(function () {
                    jqSecurity.LockScreen("true");
                }, 500);
            }
            else {
                delCookie("lock");
            }

       
       
    },
    "LockScreen": function (b) {
        if (b == "true") {

            console.log('LockScreen->true'  );

            setCookie("lock", "true", 1);
            
          // $("#lockscreenpg").css("display", "block");
            $.blockUI({
                 message: $("#lockscreenpg").html(),
                css: {
                    backgroundColor: "#C7C8CA", 'z-index': '1050', padding: 0, margin: 0, top: 0, left: 0, width: '100%', height: '100%', textAlign: 'center', border: 'none', cursor: 'not-allowed'
                }
            });
 
            $(".main-header").hide();
            $("#mainiframe").hide();
        }
        else {
            delCookie("lock");
            $.unblockUI();
            idletime = 0;
            idletick = setInterval(jqSecurity.AutoLock, 1000);
            $(".main-header").show();
            $("#mainiframe").show();
            window.location.reload();
        }
    },
    "AutoLock": function () {

        if (getCookie("lock") !== "true") {
            //not lock
            idletime = idletime + 1;          
            if (idletime == 6000) {  
                clearInterval(idletick);
                jqSecurity.LockScreen("true");
            }

        } 
        
    }
}

var jqGlobal = {
    "initRequired": function () {
        $.each($("input[required=required],select[required=required]"), function () {
            $(this).closest("div").removeClass("has-success");
            $(this).closest("div").addClass("has-warning");
            $(this).closest("div").addClass("has-feedback");
            if ($(this).hasClass("form-control")) {
                $(this).closest("div").html($(this).closest("div").html() + '<i class="glyphicon glyphicon-remove-circle form-control-feedback"></i>');
            }
        });
    }
}
function AlertDialog(id, CallBack) {


}



function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}
function delCookie(cname) {
    document.cookie = cname + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;path=/';
}

function showLoader(show = true) {

    if (show === true) {
        $.blockUI({
            css: {
                border: 'none',
                padding: '15px',
                backgroundColor: '#000',
                '-webkit-border-radius': '10px',
                '-moz-border-radius': '10px',
                opacity: .5,
                color: '#fff'
            }
            , message: $('#LoadingMessageBlockUI')

        });
    } else {
        $.unblockUI();
    }

}


$(document).ready(function () {
    jqSecurity.init();
 //   delCookie("lock"); // just for deleting the existing cookie old old old version 


    $(this).bind("contextmenu", function(e) {
                e.preventDefault();
    });
    $(document).ajaxSend(function () {
        showLoader(true);
    });
    $(document).ajaxComplete(function () {
        showLoader(false);
    });



});



