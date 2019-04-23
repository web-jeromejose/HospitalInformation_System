var divLoading = '<div class="sk-fading-circle"><div class="sk-circle1 sk-circle"></div><div class="sk-circle2 sk-circle"></div><div class="sk-circle3 sk-circle"></div><div class="sk-circle4 sk-circle"></div><div class="sk-circle5 sk-circle"></div><div class="sk-circle6 sk-circle"></div><div class="sk-circle7 sk-circle"></div>  <div class="sk-circle8 sk-circle"></div>  <div class="sk-circle9 sk-circle"></div>  <div class="sk-circle10 sk-circle"></div>  <div class="sk-circle11 sk-circle"></div>  <div class="sk-circle12 sk-circle"></div></div>';
(function ($) {
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
                console.log('ajaxwrapper-ERROR');
                console.log(output);
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
            $.ajax({
                type: "GET",
                url: WebService,
                data: GetData,
                cache: false,
                beforeSend: function () {
                    $.blockUI({
                        message: divLoading,
                        css: {
                            padding: 0, margin: 0, width: '30%', top: '40%', left: '35%', textAlign: 'center', border: 'none', backgroundColor: 'transparent', cursor: 'wait'
                        }
                    });
                },
                success: function (data, e) {
                    if (SuccessCallBack) {
                        SuccessCallBack(data, e);
                    }
                    delCookie("spass");
                },
                complete: function () {
                    if ($.active == "1") {
                        $.unblockUI();
                    }
                },
                error: function (result) {
                    if (result.status == "403") {
                        swal({
                            title: result.statusText,
                            text: "Please enter your password",
                            type: "input",
                            inputType: "password",
                            showCancelButton: true,
                            closeOnConfirm: true,
                            animation: "slide-from-top",
                            inputPlaceholder: "Password"
                        },
                        function (inputValue) {
                            if (inputValue === false) return false;
                            if (inputValue === "") {
                                swal.showInputError("Invalid Password!");
                                return false
                            }
                            setCookie("spass", inputValue, 1);
                            RunGetAjax(WebService, GetData, SuccessCallBack, LoadingDivID, LoaderText, ErrorCallback);
                        });
                    }
                    else {
                        swal({ title: "Unauthorized Access", text: result.statusText, html: true, type: "error" });
                    }
                }
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

            $.ajax({
                type: "POST",
                url: WebService,
                data: JsonData,
                cache: false,
                //headers: headers,
                contentType: "application/json; charset=utf-8",
                beforeSend: function () {
                },
                success: function (data, e) {
                    delCookie("spass");
                    if (SuccessCallBack) {
                        SuccessCallBack(data, e);
                    }
                    delCookie("spass");
                },
                error: function (result) {
                    if (result.statusText != "403") {

                        $(".sweet-alert").css("width", "478px");
                        $(".sweet-alert").css("left", "50%");
                        swal({
                            title: "Password Required!",
                            text: "Please enter your password",
                            type: "input",
                            inputType: "password",
                            showCancelButton: true,
                            closeOnConfirm: true,
                            animation: "slide-from-top",
                            inputPlaceholder: "Password"
                        },
                        function (inputValue) {

                            //if (inputValue === false) return false;
                            //if (inputValue === "") {
                            //    swal.showInputError("Invalid Password!");
                            //    return false
                            //}
                            setCookie("spass", inputValue, 1);

                            _.delay(function () {

                                RunPostAjax(WebService, JsonData, SuccessCallBack);
                            }, 800);
                        });
                    }
                    else {
                        swal({
                            title: "Unauthorized Access", text: "Sorry, you do not have the required permission to access this option.",
                            html: true, type: "error"
                        });
                    }
                }
            });

            return 0;
        };

        return this;
    };
})(jQuery);

function RunGetAjax(WebService, GetData, SuccessCallBack, LoadingDivID, LoaderText, ErrorCallback) {
    $.ajax({
        type: "GET",
        url: WebService,
        data: GetData,
        cache: false,
        success: function (data, e) {
            if (SuccessCallBack) {
                SuccessCallBack(data, e);
            }
            delCookie("spass");
        },
        error: function (result) {
            if (result.status == "403") {
                _.delay(function () {
                    swal({
                        title: result.statusText,
                        text: "Please enter your password",
                        type: "input",
                        inputType: "password",
                        showCancelButton: true,
                        closeOnConfirm: false,
                        animation: "slide-from-top",
                        inputPlaceholder: "Password"
                    },
                function (inputValue) {
                    if (inputValue === false) return false;
                    if (inputValue === "") {
                        swal.showInputError("Invalid Password!");
                        return false
                    }
                    setCookie("spass", inputValue, 1);
                    RunAjax(WebService, GetData, SuccessCallBack, LoadingDivID, LoaderText, ErrorCallback);
                });
                }, 1000);
            }
            else {
                swal({ title: "Unauthorized Access", text: result.statusText, html: true, type: "error" });
            }
        }
    });
}
function RunPostAjax(WebService, JsonData, SuccessCallBack) {
    $.ajax({
        type: "POST",
        url: WebService,
        data: JsonData,
        cache: false,
        contentType: "application/json; charset=utf-8",
        success: function (data, e) {
            if (SuccessCallBack) {
                SuccessCallBack(data, e);
            }
            delCookie("spass");
        },
        error: function (result) {
            if (result.status == "403") {

                $(".sweet-alert").css("width", "478px");
                $(".sweet-alert").css("left", "50%");
                _.delay(function () {
                    swal({
                        title: "Password Required Incorrect!",
                        text: "Please enter your password",
                        type: "input",
                        inputType: "password",
                        showCancelButton: true,
                        closeOnConfirm: true,
                        animation: "slide-from-top",
                        inputPlaceholder: "Password"
                    },
                function (inputValue) {
                    //if (inputValue === false) return false;
                    //if (inputValue === "") {
                    //    swal.showInputError("Invalid Password!");
                    //    return false
                    //}

                    setCookie("spass", inputValue, 1);
                    RunPostAjax(WebService, JsonData, SuccessCallBack);
                });
                }, 1000);
            }
            else {
                swal({ title: "Unauthorized Access", text: result.statusText, html: true, type: "error" });
            }
        }
    });
}