var _InfoContStat = 1;

//$(function () {
//    if (getCookie("ReturnURL") != "") {
//        var link = getCookie("ReturnURL");
//        delCookie("ReturnURL");
//        var link = link.replace(/(['"])/g, "");
//        document.location = link;
//    }
//});


function View(Id) {

    var Url = $('#url').data("getuserinfo");
    //var Url = baseURL + "ShowSelected";
    var param = {
        Id: Id

    };

    $('#preloader').show();
    //$('.Hide').hide();

    $.ajax({
        type: "get",
        data: param,
        //cache: false,
        url: Url,
        // dataType: "text",
        error: function (request, error) {
            //  console.log(arguments);
            alert(" Can't do because: " + error);
        },
        success: function (x) {
            $('#preloader').hide();
            $('#enryppassword').val(x.DecrpytPass);

            //  console.log(x);
        }
    });


    //ajaxWrapper.Get(Url, param, function (x) {
    //    console.log(x);
    //    //  alert(x.DecrpytPass);
    //    //c.SetValue('#txtEmail', x.Email);
    //    //c.SetValue('#txtMobile', x.Mobile);
    //    //c.SetValue('#txtQuestion1', x.Question1);
    //    //c.SetValue('#txtQuestion2', x.Question2);
    //    //c.SetValue('#enryppassword', x.DecrpytPass);
    //    //c.SetValue('#SecAnswer1', x.SecAnswer1);
    //    //c.SetValue('#SecAnswer2', x.SecAnswer2);
    //    //c.SetDateTimePicker('#dtEffectivity', Momentdatetime(x.EffectivityDate));
    //    $('#preloader').hide();

    //    //    error: function (xhr, desc, err) {
    //    //        $('#preloader').hide();

    //    //        var errMsg = err + "<br>" + desc;
    //    //        c.MessageBoxErr(errMsg);
    //    //    }


    //});


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
        $('#ErrorMsg').modal('show');
        $('#errorbody').html("You didn't enter your current password!");

        return false;
    }
    else if (pswd == "") {

        $("#Step2").trigger("click");
        $('#ErrorMsg').modal('show');
        $('#errorbody').html("You didn't enter your new password!");

        return false;
    }
    else if (oldpass != origpass) {
        $("#Step1").trigger("click");
        $('#ErrorMsg').modal('show');
        $('#errorbody').html("Old / Current Password is not correct. Please input your correct password.");

        return false;

    }
    else if (!CapitalChar.test(pswd)) {

        $("#Step2").trigger("click");
        $('#ErrorMsg').modal('show');
        $('#errorbody').html("The password must contain at least one uppercase.");

        return false;


    }
    else if ((pswd.length < 8) || (pswd.length > 10)) {

        $('#ErrorMsg').modal('show');
        $('#errorbody').html("The password is wrong length.");

        return false;

    } else if (illegalChars.test(pswd)) {


        $('#ErrorMsg').modal('show');
        $('#errorbody').html("The password contains illegal characters.");
        return false;
    } else if ((pswd.search(/[a-zA-Z]+/) == -1) || (pswd.search(/[0-9]+/) == -1)) {

        $('#ErrorMsg').modal('show');
        $('#errorbody').html("The password must contain at least one numeral.");

        return false;
    } else if (confrmpswd != pswd) {


        $('#ErrorMsg').modal('show');
        $('#errorbody').html("Confirm password not match.");

        return false;
    }
    else if (oldpass == pswd) {


        $('#ErrorMsg').modal('show');
        $('#errorbody').html("You can't use your current password!");

        return false;
    }

    return true;
}


$(document).ready(function () {
    $('#DivChangePass').modal({
        backdrop: 'static',
        keyboard: false
    });

    $(document).on('show.bs.modal', '.modal', function (event) {
        var zIndex = 1040 + (10 * $('.modal:visible').length);
        $(this).css('z-index', zIndex);
        setTimeout(function () {
            $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
        }, 0);
    });


    $('#DivChangePass').modal('show');

    $(document).on('keypress', '#txtOldPassword', function (e) {
        var regno = $(this).val();
        if (e.keyCode == 13) {

            $('#btnStep1').click();
        }

    });
    $(document).on('keypress', '#txtresitConfirmPassword', function (e) {
        var regno = $(this).val();
        if (e.keyCode == 13) {
            $('#BtnChange').click();
        }

    });

    View();

    
 
 

    
    $('#ThankyouMsgClose').click(function () {
        parent.location.reload();
    });

    $('#BtnChange').click(function () {
        var ret = ValidatedPassword();
        if (!ret) return ret;

        var pswd = $('#txtNewPassword').val();
        var param = {
            action: 3,
            password: pswd
        };
        // console.log(param); {Action: 3, Id: "11503", Password: "Sghj12345"}

        $.ajax({
            url: $('#url').data("changepasswordsave"),
            data: JSON.stringify(param),
            type: 'post',
            cache: false,
            contentType: "application/json; charset=utf-8",
            beforeSend: function () {

               
                //c.ButtonDisable('#btnModify', true);
            },
            success: function (x) {

                if (x.ErrorCode == 0) {
                    $('#ErrorMsg').modal('show');
                    $('#errorbody').html(x.Message);

                } else {
                    $('#ThankyouMsg').modal('show');
                    $('#ThankyouMsgbody').html('Congratulations! You changed your password.<br> The password will reset after 90 days as SGH Policy! Thank you!');
                  
                    //var count = 3;
                    //setInterval(function () {
 
                    //    count--;
                    //    if (count == 0) {
                    //        parent.location.reload();
                    //    }
                    //}, 1000);
                }

            },
            error: function (xhr, desc, err) {
              

                $('#ErrorMsg').modal('show');
                $('#errorbody').html(errMsg);

            }
        });


        //$.ajax({
        //    type: "get",
        //    data: param,
        //    //cache: false,
        //    url: $('#url').data('changepasswordsave'),
        //    // dataType: "text",
        //    error: function (request, error) {
        //        $('#ErrorMsg').modal('show');
        //        $('#errorbody').html(error);
        //    },
        //    success: function (x) {
        //        console.log(x);



        //        if (x.ErrorCode == 0) {
        //            $('#ErrorMsg').modal('show');
        //            $('#errorbody').html(x.Message);

        //        } else {
        //            $('#ThankyouMsg').modal('show');
        //            $('#ThankyouMsgbody').html('Congratulations! You changed your password.<br> The password will reset after 90 days as SGH Policy! Thank you!');

                    
        //        }


        //    }
        //});


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









 
});

 
 