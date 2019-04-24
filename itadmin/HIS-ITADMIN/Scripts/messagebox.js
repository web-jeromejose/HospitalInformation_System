(function ($) {
    $.MessageBox = function (options) {
        
        var mainSettings = $.extend({
            DefaultTitle: ''
        }, options);

        this.setDefaultTitle = function (value) {
            mainSettings.DefaultTitle = value;
        };

        this.CenterScreen = function () {
            $('.modal-dialog').css({
                //'top': '40%',
                'margin-top': function () {
                    return -($(this).height() / 2);
                }
            });
        };

        this.Show = function (options) {
            var settings = $.extend({
                Msg: '',
                Title: '',
                BtnColor: 'btn-primary',
                className: '',
                iconError: false,
                iconInfo: true,
                iconQuestion: false,
                showIcon: true,
                defaultButtonLabel: "Ok",
                OkButtonCallBack: function () { },
                OnEscapeCallBack: function () { },
                fnShowCallBack: function () { },
                draggable: true,
                showButtons: true,
                showCloseButton: true,
                closeOnEscape: true,                
                Buttons: null
            }, options);                       

            if (settings.showButtons && settings.Buttons == null)
                settings.Buttons = { Ok: { label: settings.defaultButtonLabel, className: "btn " + settings.BtnColor, callback: settings.OkButtonCallBack } };
                       

            var message = "";
            if (settings.showIcon) {
                var iconClass = '';
                if (settings.iconError)
                    iconClass = 'bootboxerroricon glyphicon-circle_exclamation_mark';
                else if (settings.iconQuestion)
                    iconClass = 'bootboxinfoicon glyphicon-circle_question_mark';
                else
                    iconClass = 'bootboxinfoicon glyphicon-circle_info';

                message = "<div class='row'><div class='col-sm-2 bootboxcentertext'><i class='" + iconClass + "'></i></div><div class='col-sm-10'>" + settings.Msg + "</div></div>";
            }
            else {
                message = settings.Msg;
            }

            if (settings.Title == '' && mainSettings.DefaultTitle != '')
                settings.Title = '<span class="bootboxcompressedtitle">' + mainSettings.DefaultTitle + '</span>';
            else
                settings.Title = '<span class="bootboxcompressedtitle">' + settings.Title + '</span>';

            var bootdialog = bootbox.dialog({
                message: message,
                className: "bootboxcompressedheader bootboxcompressedfooter " + settings.className,
                title: settings.Title,                
                closeButton: settings.showCloseButton,
                buttons: settings.Buttons,
                keyboard: settings.closeOnEscape,
                animate: false, onEscape: settings.OnEscapeCallBack
            });

            //bootdialog.on("show.bs.modal", function () {
                if (settings.fnShowCallBack != null) {
                    settings.fnShowCallBack();
                }                
            //});
            
            $('.modal-dialog').css({
                'top': '40%',
                'margin-top': function () {
                    return -($(this).height() / 2);
                }
            });

            if (settings.draggable) {
                $(".modal-dialog").draggable({
                    handle: ".modal-header"
                });
            }            
        };

        //this.Show = function (msg, msgTitle, btnColor, showErrorIcon, OkButtonCallBack, OnEscapeCallBack) {
        //    if (OkButtonCallBack == null)
        //        OkButtonCallBack = o.OkButtonCallBack;

        //    if (OnEscapeCallBack == null)
        //        OnEscapeCallBack = o.OnEscapeCallBack;

        //    if (typeof btnColor === 'undefined' || btnColor == null)
        //        btnColor = 'btn-primary';

        //    if (typeof showErrorIcon !== 'undefined' && showErrorIcon != null && showErrorIcon == true)
        //        msg = "<div class='row-fluid'><div class='span2 bootboxcentertext'><i class='bootboxerroricon icon-exclamation-sign'></i></div><div class='span10'>" + msg + "</div></div>";
        //    else
        //        msg = "<div class='row-fluid'><div class='span2 bootboxcentertext'><i class='bootboxinfoicon glyphicon-circle_info'></i></div><div class='span10'>" + msg + "</div></div>";

        //    bootbox.dialog({
        //        message: msg,
        //        className: "bootboxcompressedheader",
        //        title: msgTitle,
        //        buttons: { Ok: { label: "Ok", className: "btn " + btnColor, callback: OkButtonCallBack } },
        //        animate: false, onEscape: OnEscapeCallBack
        //    });
        //};

        return this;
    };

    $(function () {
        $(document).on('shown.bs.modal', function (e) {
            var idx = ($('.modal:visible').length) - 1; // raise backdrop after animation.

            $('.modal').not('.stacked').css('z-index', 1040 + (10 * idx));
            $('.modal').not('.stacked').addClass('stacked');

            $('.modal-backdrop').not('.stacked').css('z-index', 1039 + (10 * idx));
            $('.modal-backdrop').not('.stacked').addClass('stacked');
        });
    });
})(jQuery);