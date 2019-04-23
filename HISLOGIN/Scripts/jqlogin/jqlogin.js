var jq = {
    "init": function () {
        if ($("#txtusername").val() != "") {
            $("#txtpassword").focus();
        }
        $(".alert-danger").delay(5000).fadeOut(500);
        //$(document).on("click", "#btn-login", function () {
        //    $(".login-box").fadeOut(500);
        //});
        //$(document).on("keydown", "#txtpassword", function (e) {
        //    //if (event.which == 13) {
        //    //    $(".login-box").fadeOut(900);
        //    //}
        //});
        //var colors = 5;
        //var active = 1;
        //setInterval(function () {
        //    $("body").css("background", "url('../Images/MainSlider/main_" + active + ".jpg') no-repeat center center fixed");
        //    active++;
        //    if (active == colors) active = 1;
        //}, 5000);
    }
}
$(document).ready(function () {
    jq.init();
});