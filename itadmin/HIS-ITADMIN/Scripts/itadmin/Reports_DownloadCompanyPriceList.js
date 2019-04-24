var Reports = function () {
    var DownloadCompPriceList = function () {
        console.log('DownloadCompPriceList');

        //************************************VARIABLE
 
        var c = new Common();

        //************************************FUNCTIONS
        function init()
        {
          

            setTimeout(function () {
                $('#cboTariff').trigger('click');
                $('#cboTariff').select2('open');
                $('#preloader').hide();

            }, 500)

        }

        function InitButton() {
          

 
            $("#BtnLoad").on("click", function () {
 
                if ($('#cboTariff').val() == '') {
                    c.MessageBoxErr('Empty...', 'Please select Tariff Name');
                } else {
                    ToPDF();
                }

            });
            $("#ExportToXLS").on("click", function () {
                ToXLS();
            });
 
        }



        function Momentdatetime(value) {
            return moment().format('l h:mm:ss A');
        }


        function setCookie(name, value, days) {
            var expires;

            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toGMTString();
            } else {
                expires = "";
            }
            //document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
            document.cookie = name + "=" + value + expires + "; path=/";
        }
        function ToPDF() {

            $('#PDFMaximize').show();
            $('.loadingpdf').show();

            var filter = [{
                TariffId: $('#cboTariff').val(),
                IporOp: $('#tariffType').val(),
            }];
            var filterfy = JSON.stringify(filter);
            setCookie('Filterfy', filterfy, 365);

            var url = $("#url").data("pdf") + "?page=1#zoom=100";
            var content = '<iframe id="MyIFRAME" src="' + url + '" width="100%"  height="100%" frameborder="0" class="rpt-viewer-frame"></iframe>';
  
            $('#PreviewInPDF').empty();
            $('#PreviewInPDF').append(content);

            $('#MyIFRAME').unbind('load');
            $('#MyIFRAME').load(function () {
                $('.loadingpdf').hide();
            });

        }
        function ToXLS() {
            $('#PDFMaximize').show();
            $('.loadingpdf').show();

            var filter = [{
                TariffId: $('#cboTariff').val(),
                IporOp: $('#tariffType').val(),
            }];
            var filterfy = JSON.stringify(filter);
            setCookie('Filterfy', filterfy, 365);

            var url = $("#url").data("xls") + "?page=1#zoom=100";
            var content = '<iframe id="MyIFRAME" src="' + url + '" width="100%"  height="100%" frameborder="0" class="rpt-viewer-frame"></iframe>';

            $('#PreviewInPDF').empty();
            $('#PreviewInPDF').append(content);

            $('#MyIFRAME').unbind('load');
            $('#MyIFRAME').load(function () {
                $('.loadingpdf').hide();
            });

            setTimeout(function () {
                $('#PreviewInPDF').hide();
                $('#PDFMaximize').hide();
            }, 5000)


        }


        //*************************************INITIALIZE
 
        InitButton();
        init();
    }
    return {

        init: function () {
            DownloadCompPriceList();
        }

    }
}();

 
 