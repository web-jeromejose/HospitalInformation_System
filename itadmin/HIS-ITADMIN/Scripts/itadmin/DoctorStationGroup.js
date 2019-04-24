var c = new Common();

jQuery(document).ready(function () {
    DoctorStatGroup.init();
});


/******************************************************* ********************* VIEW VAT ***************************************************************************/
var DoctorStatGroup = function () {

    // Handle Theme Settings
    var handleDoctorStatGroup = function () {
        console.log('handleDoctorStatGroup');
        //handle theme layout


        var initSelect2 = function () {


            setTimeout(function () {
                $('#profilelist').trigger('click');
                $('#profilelist').select2('open');

            }, 500);

            ajaxWrapper.Get($("#url").data("profilelist"), {}, function (xx, e) {
                Select2Group($("#profilelist"), xx.list, function (x) { });

            });

            $("#stationlist").select2({
                placeholder: "Type to include multiple station...",
                data: [],
                minimumInputLength: 0,
                tags: true,
                ajax: {
                    quietMillis: 150,
                    url: $("#url").data("stationlist"),
                    dataType: 'jsonp',
                    data: function (term, page) {
                        return {
                            pageSize: pageSize,
                            pageNum: page,
                            searchTerm: term
                        };
                    },
                    success: function () {

                    },
                    results: function (data, page) {
                        var more = (page * pageSize) < data.Total;
                        return { results: data.Results, more: more };
                    }
                }
            });


            $("#doctorlist").select2({
                placeholder: "Type to include multiple doctor in this profile...",
                data: [],
                minimumInputLength: 0,
                tags: true,
                ajax: {
                    quietMillis: 150,
                    url: $("#url").data("doctorlist"),
                    dataType: 'jsonp',
                    data: function (term, page) {
                        return {
                            pageSize: pageSize,
                            pageNum: page,
                            searchTerm: term
                        };
                    },
                    success: function () {

                    },
                    results: function (data, page) {
                        var more = (page * pageSize) < data.Total;
                        return { results: data.Results, more: more };
                    }
                }
            });


            $('#profilelist').on('change', function () {
                $('#btnSave').show();
                var ProfileId = $('#profilelist').val();
                ajaxWrapper.Get($("#url").data("showstationbyprofid"), { ProfileId: ProfileId }, function (xx, e) { c.SetSelect2List('#stationlist', xx.list); });

                ajaxWrapper.Get($("#url").data("showdoctorbyprofid"), { ProfileId: ProfileId }, function (xx, e) { c.SetSelect2List('#doctorlist', xx.list); });

            });


        };
        function initbutton() {
            $('#btnSave').click(function () {
                Save();
            });
            $('#btnNewEntry').click(function () {
                c.ModalShow('#modalReport', true);
            });

            $('.btnCloseReport').click(function () {
                c.ModalShow('#modalReport', false);
            });

            $('#btncreateprofile').click(function () { SaveProfile(); });
        }


        function Validated() {

            var required = '';
            var ctr = 0;

            req = c.IsEmptyById('#profilelist');
            if (req) {
                c.MessageBoxErr('Required...', 'Profile is required.');
                return false;
            }
            if ($('#stationlist').val() == "") {
                ctr++;
                required = required + '<br> ' + ctr + '. Select a Station/s.';
            }
            if ($('#doctorlist').val() == "") {
                ctr++;
                required = required + '<br> ' + ctr + '. Select a Doctor/s.';
            }

            if (required.length > 0) {
                c.MessageBoxErr('Enter the following details...', required);
                return false;
            }
            return true;
        }
        function Save() {

            var ret = Validated();
            if (!ret) return ret;
            c.ButtonDisable('#btnSave', true);
            var entry;
            entry = [];
            entry = {};

            entry.profileid = c.GetSelect2Id('#profilelist');

            var arr;

            entry.stationlist = [];
            arr = $('#stationlist').val();
            $.each(arr.split(','), function (i, val) {
                entry.stationlist.push({
                    id: val
                });
            });

            entry.doctorlist = [];
            arr = $('#doctorlist').val();
            $.each(arr.split(','), function (i, val) {
                entry.doctorlist.push({
                    id: val
                });
            });
            console.log(entry);

            $.ajax({
                url: $("#url").data("save"),
                data: JSON.stringify(entry),
                dataType: 'json',
                type: 'post',
                cache: false,
                contentType: "application/json; charset=utf-8",
                beforeSend: function () {
                    c.ButtonDisable('#btnSave', true);
                },
                success: function (data) {
                    c.ButtonDisable('#btnSave', false);
                    var OkFunc = function () {

                    };

                    c.MessageBox(data.Title, data.Message, OkFunc);
                },
                error: function (xhr, desc, err) {
                    c.ButtonDisable('#btnSave', false);
                    var errMsg = err + "<br>" + xhr.responseText;
                    c.MessageBox("Error...", errMsg, null);
                }
            });


            return ret;
        }
        function SaveProfile() {

            if ($('#newprofilename').val() == "") {
                c.MessageBoxErr('Required...', 'New Profile is required.');
                return false;
            } else {
 
                var entry;
                entry = [];
                entry = {};

                entry.newprofile = $('#newprofilename').val().trim();
              

                $.ajax({
                    url: $("#url").data("saveprofile"),
                    data: JSON.stringify(entry),
                    dataType: 'json',
                    type: 'post',
                    cache: false,
                    contentType: "application/json; charset=utf-8",
                    beforeSend: function () {
                        c.ButtonDisable('#btncreateprofile', true);
                    },
                    success: function (data) {
                        c.ButtonDisable('#btncreateprofile', false);
                        var OkFunc = function () {
                            location.reload();
                        };

                        c.MessageBox(data.Title, data.Message, OkFunc);
                    },
                    error: function (xhr, desc, err) {
                        c.ButtonDisable('#btncreateprofile', false);
                        var errMsg = err + "<br>" + xhr.responseText;
                        c.MessageBox("Error...", errMsg, null);
                    }
                });

            }









        }

        jQuery(document).ready(function () {
            initSelect2();
            initbutton();
        });


    };


    return {

        //main function to initiate the theme
        init: function () {
            // handles style customer tool
            handleDoctorStatGroup();

        }
    };

}();


function Select2Group(input, data, CallBack) {
    $(input).select2({
        allowClear: true,
        placeholder: "Select a Profile",
        initSelection: function (element, callback) {
            var selection = _.find(data, function (metric) {
                return metric.id === element.val();
            })
            callback(selection);
        },
        query: function (options) {
            var pageSize = 100;
            var startIndex = (options.page - 1) * pageSize;
            var filteredData = data;
            var stripDiacritics = window.Select2.util.stripDiacritics;

            if (options.term && options.term.length > 0) {
                if (!options.context) {
                    var term = stripDiacritics(options.term.toLowerCase());
                    options.context = data.filter(function (metric) {
                        if (!metric.stripped_text) {
                            metric.stripped_text = stripDiacritics(metric.id.toLowerCase());
                        } return (metric.stripped_text.indexOf(term) !== -1 || metric.id.toString().toUpperCase().indexOf(term.toUpperCase()) != -1 || metric.name.toString().toUpperCase().indexOf(term.toUpperCase()) != -1 || metric.text.toString().toUpperCase().indexOf(term.toUpperCase()) != -1);

                    });
                }
                filteredData = options.context;
            }
            options.callback({
                context: filteredData,
                results: filteredData.slice(startIndex, startIndex + pageSize),
                more: (startIndex + pageSize) < filteredData.length
            });
        },
        dropdownAutoWidth: true,
        formatResult: selectFormatName
    }).on('change', function () {
        CallBack($(this).select2('data'));
    });
    $(input).select2("enable", true);
}
/***/