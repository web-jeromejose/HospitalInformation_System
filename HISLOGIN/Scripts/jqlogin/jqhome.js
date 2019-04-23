var USERPROFILE = [];

var jq = {
    "init": function () {
        $('.hintModal').hintModal({});
        if (getCookie("ReturnURL") != "") {
            var link = getCookie("ReturnURL");
            delCookie("ReturnURL");
            var link = link.replace(/(['"])/g, "");
            document.location = link;
        }
        $(".imgModule").click(function () {
            var link = $(this).data('urlink');
            var id = $(this).data('moduleid');
            ajaxWrapper.Get($("#url").data("openpage"), { "id": id }, function (x) {
            });
			window.location = link;
            
        });
        $(document).on("keyup", "#txtfind", function () {
            $(".imgModule").hide();
            var i = $(this).val().toLowerCase();
            $("div[data-search*='" + i + "']").show();
            if (i == "") {
                $(".imgModule").show();
            }
        });

       
    },
    "changepassword": function () {


        if (getCookie("IsUserPassword90DaysExpired") == 1) {
            console.log("popup the #changepassbtn");
          //  View($('#url').data('getuserid'));
             $("#changepassbtn").trigger("click"); //comment for now
 
        }

        $(document).on('keypress', '#txtOldPassword', function (e) {
            var regno = $(this).val();
            if (e.keyCode == 13) {
                $('#btnStep1').click();
            }
        });
        $(document).on('keypress', '#txtresitConfirmPassword', function (e) {
            var regno = $(this).val();
            if (e.keyCode == 13) {
                console.log('keypress-txtresitConfirmPassword');
                $('#BtnChange').click();
            }
        });
        $('#changepassbtn').click(function () {
           // View($('#url').data('getuserid'));
            //$('#DivChangePass').modal({
            //    backdrop: 'static',
            //    keyboard: false
            //});
 
        });
        $('#btnStep1').click(function () {
            View($('#url').data('getuserid'));
         
            $('#loadingtext').html('<span class="label pull-left bg-blue">..Please wait ارجوك انتظر...</span>');
            $('#btnStep1').hide();
            _.delay(function () {
                $('#loadingtext').html('');
                $('#btnStep1').show();
                                var ret = false;
                                var pswd = $('#txtNewPassword').val();
                                var oldpass = $('#txtOldPassword').val();

                                var origpass = $('#enryppassword').val();
                                var confrmpswd = $('#txtresitConfirmPassword').val();
                                var error = "";
                                var illegalChars = /[\W]/;  // allow only letters and numbers
                                var CapitalChar = /[A-Z]+/; // allow one Capital Letter

                                if (oldpass == "") {

                                    $("#Step1").trigger("click");
                                    //$('#ErrorMsg').modal('show');
                                    // $('#errorbody').html("You didn't enter your current password!");
                                    swal("Alert!!", "You didn't enter your current password!", "warning");
                                    $("#Step1").trigger("click");
                                    return false;
                                }

                                else if (oldpass != origpass) {
                                    $("#Step1").trigger("click");
                                    // $('#ErrorMsg').modal('show');
                                    // $('#errorbody').html("Old / Current Password is not correct. Please input your correct password.");
                                    swal("Alert!!", "Old / Current Password is not correct. Please input your correct password.", "error");
                                    $("#Step1").trigger("click");
                                    return false;

                                }
                                else {
                                    $('#btnStep1Hidden').trigger("click");
                                }


            }, $('#enryppassword').val().length > 0 ? 100 : 2000);

           


        });
        $('#BtnChangeBTN').click(function () {

            var ret = ValidatedPassword();
            if (!ret) return ret;

            $('#BtnChange').hide();

            var pswd = $('#txtNewPassword').val();
            var param = {
                action: 1,
                id: $('#url').data('getuserid'),
                password: pswd
            };
            console.log('BtnChange');
           $.ajax({
                type: "get",
                data: param,
                url: $('#url').data('changepasswordsave'),
                error: function (request, error) {
                   // $('#ErrorMsg').modal('show');
                   // $('#errorbody').html(error);
                    swal("Alert!!", error, "error");
                    $('#BtnChange').show();
                },
                success: function (x) {
                    if (x.ErrorCode == 0) {
                     swal("Alert!!", x.Message, "error");

                    } else {
                        swal("Congratulations!!", 'You changed your password. The password will reset after 90 days as SGH Policy! Thank you!', "success");
                  
                    $('#BtnChange').show();
                    $('#div-changepass').modal('hide');

                    delCookie("IsUserPassword90DaysExpired");
                    }
                }
            }); 
        });
        $('.next').click(function () {
            var nextId = $(this).parents('.tab-pane').next().attr("id");
            $('[href=#' + nextId + ']').tab('show');
            return false;
        })
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {

            //update progress
            var step = $(e.target).data('step');
            var percent = (parseInt(step) / 2) * 100;

            $('.progress-bar').css({ width: percent + '%' });
            $('.progress-bar').text("Step " + step + " of 2");

            //e.relatedTarget // previous tab

        })
        $('.first').click(function () {

            $('#UserForm a:first').tab('show')

        })
        function View(Id) {

            var Url = $('#url').data("getuserinfo");
     
            var param = {
                Id: Id

            };
            $.ajax({
                type: "get",
                data: param,            
                url: Url,              
                error: function (request, error) {                   
                    alert(" Can't do because: " + error);
                },
                success: function (x) {                   
                    $('#enryppassword').val(x.DecrpytPass);
                    console.log('View');
                    console.log(x);
                    USERPROFILE = x;
                }
            });
 

        }
        function ValidatedPassword() {
            var ret = false;
            var pswd = $('#txtNewPassword').val();
            var oldpass = $('#txtOldPassword').val();


            var origpass = $('#enryppassword').val();
            var confrmpswd = $('#txtresitConfirmPassword').val();
            var error = "";
            var illegalChars = /[\W]/;  // allow only letters and numbers
            var CapitalChar = /[A-Z]+/; // allow one Capital Letter

            if (oldpass == "") {

                $("#Step1").trigger("click");
               // $('#ErrorMsg').modal('show');
              //  $('#errorbody').html("You didn't enter your current password!");
                swal("Alert!!", "You didn't enter your current password!", "warning");
                return false;
            }
            else if (pswd == "") {

                $("#Step2").trigger("click");
               // $('#ErrorMsg').modal('show');
               // $('#errorbody').html("You didn't enter your new password!");
                swal("Alert!!", "You didn't enter your current password!", "warning");


                return false;
            }
            else if (oldpass != origpass) {
                $("#Step1").trigger("click");
              //  $('#ErrorMsg').modal('show');
             //   $('#errorbody').html("Old / Current Password is not correct. Please input your correct password.");
                swal("Alert!!", "Old / Current Password is not correct. Please input your correct password.", "error");


                return false;

            }
            else if (!CapitalChar.test(pswd)) {

                $("#Step2").trigger("click");
              //  $('#ErrorMsg').modal('show');
              //  $('#errorbody').html("The password must contain at least one uppercase.");
                swal("Alert!!", "The password must contain at least one uppercase.", "info");

                return false;


            }
            else if ((pswd.length < 8) || (pswd.length > 10)) {

              //  $('#ErrorMsg').modal('show');
              //  $('#errorbody').html("The password is wrong length.");
                swal("Alert!!", "The password is wrong length.", "info");
                return false;

            } else if (illegalChars.test(pswd)) {


              //  $('#ErrorMsg').modal('show');
               // $('#errorbody').html("The password contains illegal characters.");
                swal("Alert!!", "The password contains illegal characters.", "info");
                return false;
            } else if ((pswd.search(/[a-zA-Z]+/) == -1) || (pswd.search(/[0-9]+/) == -1)) {

              //  $('#ErrorMsg').modal('show');
              //  $('#errorbody').html("The password must contain at least one numeral.");
                swal("Alert!!", "The password must contain at least one numeral.", "info");

                return false;
            } else if (confrmpswd != pswd) {


              //  $('#ErrorMsg').modal('show');
              //  $('#errorbody').html("Confirm password not match.");
                swal("Alert!!", "Confirm password not match.", "info");
                return false;
            }
            else if (oldpass == pswd) {


             //   $('#ErrorMsg').modal('show');
           //     $('#errorbody').html("You can't use your current password!");
                swal("Alert!!", "You can't use your current password!", "info");

                return false;
            }

            return true;
        }



    }
}
$(document).ready(function () {
    jq.init();
    jq.changepassword();
});

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
