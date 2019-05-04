// https://code.google.com/p/datejs/
// https://eonasdan.github.io/bootstrap-datetimepicker/

var momentDateTimeFormat = "DD-MMM-YYYY HH:mm A";
var dateFormatOnDisplay = "D-MMM-YYYY";
var dateTimeFormatOnPost = "YYYY-MM-DD hh:mm:ss A";
var dateTimeFormatOnPostDateJs = "yyyy-MM-dd HH:mm:ss tt";
var dateTimeFormatOnPostTimeJs = "HH:mm:ss";
var dateFormatOnPost = "YYYY-MM-DD";
var dateFormatMaskUI = "dd/mm/yyyy";
var dateFormatMaskToServer = "yyyy/mm/dd";
var pageSize = 20;
var Select2IsClicked;
var IsModify = false;

var reportHeight = 200;
var EntryHeight = 50;

var months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May',
    'Jun', 'Jul', 'Aug', 'Sep',
    'Oct', 'Nov', 'Dec'
];

function Common() {
}
Common.prototype = {
    constructor: Common,


    CheckBoxTriState: function (id) {
        if (cb.readOnly) cb.checked = cb.readOnly = false;
        else if (!cb.checked) cb.readOnly = cb.indeterminate = true;
    },
    GridSelectAll: function (id) {
        var allRows = $(id).dataTable().fnGetNodes();
        $(id).DataTable().rows().indexes().each(function (idx) {

            var tr = $(allRows[idx]).closest('tr');
            if (tr.hasClass('selected')) {
                tr.removeClass('selected');
            }
            else {
                tr.addClass('selected');
            }
        });
    },
    IsNumber: function (evt, element) {
        var charCode = (evt.which) ? evt.which : event.keyCode
        if (
            (charCode != 45 || $(element).val().indexOf('-') != -1) &&      // “-” CHECK MINUS, AND ONLY ONE.
            (charCode != 46 || $(element).val().indexOf('.') != -1) &&      // “.” CHECK DOT, AND ONLY ONE.
            (charCode < 48 || charCode > 57))
            return false;

        return true;
    },
    ReSequenceDataTable: function (id, atColumn) {
        var ctr = $(id).DataTable().rows().nodes().length;
        var table = $(id).DataTable()
        for (i = 0; i < ctr; i++) {
            table.cell(i, atColumn).data(i + 1);
        }
    },
    Show: function (id, flag) {
        if (flag) {
            $(id).show();
        } else {
            $(id).hide();
        }
    },
    LoadInIframe: function (iframeName, url) {
        var $iframe = $('#' + iframeName);
        if ($iframe.length) {
            $iframe.attr('src', url);
            return false;
        }
        return true;
    },
    SetBadgeText: function (id, value) {
        $(id).text(value);
    },
    DisableDataTable: function (id, flag) {
        $(id).children().prop('disabled', flag);
    },
    ClearAllText: function () {
        $('input').val('');
    },
    ClearAllSelect2: function () {
        $('span').val('');
    },
    ClearAlliCheck: function () {
        $("input:checkbox").attr('checked', true);
    },
    ResizeDiv: function (id) {
        var viewportWidth = $(window).width();
        var viewportHeight = $(window).height();
        $(id).css("height", viewportHeight - 150);
    },
    ResizeDiv: function (id, lessMargin) {
        var viewportWidth = $(window).width();
        var viewportHeight = $(window).height();
        $(id).css("height", viewportHeight - lessMargin);
    },
    DataTableGetSelected: function (DataTable) {
        return DataTable.$('tr.selected');
    },
    InitGridList: function (id) {
        $(id).DataTable({
            cache: false,
            destroy: true,
            paging: true,
            searching: true,
            ordering: false,
            info: true,
            bAutoWidth: false,
            scrollY: 400,
            scrollX: true
        });
    },
    InitGridEntry: function (id) {
        $(id).DataTable({
            cache: false,
            destroy: true,
            paging: false,
            searching: false,
            ordering: false,
            info: true,
            bAutoWidth: true,
            scrollY: 400,
            scrollX: true
        });
    },
    SetActiveTab: function (tab) {
        $('.nav-tabs a[href="#' + tab + '"]').tab('show');
    },
    SetRequired: function () {
        $('.required-icon').tooltip({
            placement: 'left',
            title: 'Required field'
        });
    },
    GetAge: function getAge(dateString) {

        if (dateString.trim().length == 0) return 0;
        if (dateString == null) return 0;
        dateString = dateString.replace(' ', '-').replace(' ', '-');
        var arr = dateString.split("-");
        var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
        var month = months.indexOf(arr[1].toLowerCase());

        dateString = new Date(parseInt(arr[2]), month, parseInt(arr[0]));

        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    },

    DateDiffYears: function (end) {
        if (end.length == 0) return 0;
        var today = new Date();
        var arr = end.split(' ');
        var birthDate = new Date(arr[0]);
        var res = today.getFullYear() - birthDate.getFullYear();
        return res;
    },
    DateDiffDays: function (start, end) {
        if (start == 0 || end == 0) return 0;
        var s = moment(end);
        var e = moment(start);
        var result = s.diff(e, 'days');
        result = isNaN(result) ? 0 : result;
        return result;
    },
    DateAddDays: function (date, days) {
        var result = moment(date).add(days, 'days');
        return result;
    },

    SetTitle: function (title) {
        var headercaptionId = $('#header-caption');
        var headercaption = $(headercaptionId).html();
        $(headercaptionId).html(headercaption + " - " + title);
    },
    DefaultSettings: function () {

        $('.modal').modal({
            show: false,
            keyboard: false,
            backdrop: 'static'
        }).on('hidden.bs.modal', function () {
            $('#select2-drop').css('display', 'none');
        });


    },

    Enable: function (id) {
        $(id).prop('disable', false);
    },
    Disable: function (id) {
        $(id).prop('disabled', true);
    },
    Disable: function (id, flag) {
        $(id).prop('disabled', flag);
    },
    SetValue: function (id, value) {
        try {
            return $(id).val(value);
        } catch (err) {
            return "";
        }
    },
    ClearInput: function (id) {
        return SetValue(id, "");
    },
    GetValue: function (id) {
        try {
            var v = $(id).val();
            return v.trim();
        } catch (err) {
            return "";
        }
    },
    ReadOnly: function (id, flag) {
        $(id).prop('readonly', flag);
    },
    IsEmpty: function (value) {
        try {
            if (value == "undefined") return true;
            return value.length == 0;
        } catch (err) {
            return false;
        }
    },
    IsEmptyById: function (id) {
        var val = this.GetValue(id);
        return val.length == 0;
    },

    EnableSelect2: function (id) {
        $(id).select2('enable');
    },
    DisableSelect2: function (id) {
        $(id).select2('disable');
    },
    DisableSelect2: function (id, flag) {
        if (flag) $(id).select2('disable');
        else $(id).select2('enable');
    },
    ClearSelect2: function (id) {
        $(id).select2('data', { id: "", text: "" });
    },
    SetSelect2: function (id, valueId, valueText) {
        $(id).select2("data", { id: valueId, text: valueText });
    },
    SetSelect2List: function (id, list) {
        var xrows = [];
        $.each(list, function (index, value) {
            xrows.push({ id: value.id, text: value.name });
        });
        $(id).select2("data", xrows);
    },
    Select2Clear: function (id) {
        $(id).select2('val', '');
    },
    GetSelect2Id: function (id) {
        try {
            return $(id).select2('data').id;
        } catch (err) {
            return "";
        }
    },
    GetSelect2Text: function (id) {
        try {
            return $(id).select2('data').text;
        } catch (err) {
            return "";
        }
    },
    FocusSelect2: function (id) {
        $(id).select2('open');
    },
    Select2ValueSplitToJson: function (value, field) {
        var ret = [];
        var arr = value.split(',');
        $.each(arr, function (i, val) {
            var item = "{" + field + ":" + val + "}";
            ret.push(item);
        });
        return ret;
    },
    IsEmptySelect2: function (id) {
        var val = this.GetSelect2Id(id);

        if (val == undefined) return true;
        else if (val.length == 0) return true;
        else return false;
    },



    IsDate: function (id) {
        var a = $(id).find("input").val();
        if (a.trim().length == 0) return true;
        var output = new Date();
        output = Date.parse(a);
        return !(output == null);
    },
    IsDateEmpty: function (id) {
        var a = $(id).find("input").val();
        return (a.trim().length == 0);
    },
    EnableDateTimePicker: function (id) {
        $(id).data("DateTimePicker").enable();
    },
    DisableDateTimePicker: function (id) {
        $(id).data("DateTimePicker").disable();
    },
    DisableDateTimePicker: function (id, flag) {
        if (flag) $(id).data("DateTimePicker").disable();
        else $(id).data("DateTimePicker").enable();
    },
    SetDateTimePicker: function (id, value) {
        $(id).data("DateTimePicker").setDate(value);
    },
    //MonthNumToName = function (monthnum) {
    //    return this.months[Number(monthnum) - 1] || '';
    //},
    MonthNameToNum: function (monthname) {
        var month = months.indexOf(monthname);
        return month >= 0 ? month + 1 : 0;
    },
    FetchMaskDate: function (value) {
        try {
            var date = this.ConvertToValidDate(value, ' ', dateFormatMaskUI);
            return date;
        } catch (err) {
            return "";
        }
    },
    ConvertToValidDate: function (value, delimeter, format) {
        try {
            var d = value;
            var date = d.split(delimeter);
            var jsdate;
            if (format == dateFormatMaskToServer) {
                var date = date[2] + "-" + date[1] + "-" + date[0];
                jsdate = new Date(date);
            }
            else if (format == dateFormatMaskUI) {
                jsdate = date[0] + "/" + this.MonthNameToNum(date[1]) + "/" + date[2];
            }
            return jsdate;
        } catch (err) {
            return "";
        }
    },
    GetAgeFromMask: function (id) {
        try {
            var dob = new Date(this.ConvertToValidDate($(id).val(), "/", dateFormatMaskToServer));
            var today = new Date();
            var age = Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000));
            return age;
        } catch (err) {
            return "";
        }
    },
    GetServerDateFromMask: function (id) {
        try {
            var value = $(id).val();
            var a = this.ConvertToValidDate(value, '/', dateFormatMaskToServer);
            var b = moment(a).format(dateTimeFormatOnPost);
            return b;
        } catch (err) {
            return "";
        }
    },
    GetDateTimePicker: function (id) {
        try {
            var a = $(id).data("DateTimePicker").getDate();
            var b = moment(a).format(dateTimeFormatOnPost);
            return b;
        } catch (err) {
            return "";
        }
    },
    GetDate: function (value, delimeter) {
        try {
            var a = value;

            if (a.trim().length == 0) return "";

            var arr = a.split(delimeter);
            var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
            var month = months.indexOf(arr[1].toLowerCase());

            a = new Date(parseInt(arr[2]), month, parseInt(arr[0]));


            var b = moment(a).format(dateFormatOnPost);
            return b;
        } catch (err) {
            return "";
        }
    },
    GetDateTimePickerDate: function (id) {
        try {
            var a = $(id).find("input").val();

            if (a.trim().length == 0) return "";

            var arr = a.split("-");
            var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
            var month = months.indexOf(arr[1].toLowerCase());

            a = new Date(parseInt(arr[2]), month, parseInt(arr[0]));


            var b = moment(a).format(dateFormatOnPost);
            return b;
        } catch (err) {
            return "";
        }
    },
    GetDateTimePickerDateTime: function (id) {
        try {
            var a = $(id).find("input").val();
            if (a.trim().length == 0) return "";
            var output = new Date();
            output = Date.parse(a);
            var formatted = output.toString(dateTimeFormatOnPostDateJs);
            return formatted;
        } catch (err) {
            return "";
        }
    },
    GetDateTimePickerTimeJs: function (id) {
        try {
            var a = $(id).find("input").val();
            if (a.trim().length == 0) return "";
            var output = new Date();
            output = Date.parse(a);
            var formatted = output.toString(dateTimeFormatOnPostTimeJs);
            return formatted;
        } catch (err) {
            return "";
        }
    },
    DateTimePickerDisable: function (id, flag) {
        if (flag) $(id).data("DateTimePicker").disable();
        else $(id).data("DateTimePicker").enable();
    },
    IsEmptyDateTimePicker: function (id) {
        var ret = this.GetDateTimePicker(id);
        return ret.trim().length == 0;
    },
    IsEmptyDateTimePickerDate: function (id) {
        var ret = this.GetDateTimePickerDate(id);
        return ret.trim().length == 0;
    },
    IsEmptyDateTimePickerDateTime: function (id) {
        var ret = this.GetDateTimePickerDateTime(id);
        return ret.trim().length == 0;
    },
    GetICheck: function (id) {
        var ret = $(id).is(':checked') ? 1 : 0;
        return ret;
    },
    iCheckSet: function (id, flag) {
        if (flag) $(id).iCheck('check');
        else $(id).iCheck('uncheck');
    },
    iCheckDisable: function (id, flag) {
        if (flag) {
            $(id).iCheck('disable');
        } else {
            $(id).iCheck('enable');
        }
    },

    MomentDDMMMYYYY: function (value) {
        return moment(value).format('DD-MMM-YYYY');
    },
    MomentDDMMMYYYYDLess: function (value) {
        return moment(value).format('DD MMM YYYY');
    },
    MomentYYYYMMDD: function (value) {
        return moment(value).format('YYYY-MM-DD');
    },
    MessageBoxErr: function (Title, Message) {
        if (Message == null) { Message = "Either the session has expired or there was an unknown error..."; }
        else if (Message.length == 0) { Message = "Either the session has expired or there was an unknown error..."; }
        bootbox.dialog({
            message: Message,
            title: Title,
            buttons: {
                Err: {
                    label: "Ok",
                    className: "btn-danger"
                }
            }
        }).find("div.modal-dialog").addClass("bootbox-top");
    },
    MessageBox: function (Title, Message, OkFunc) {
        bootbox.dialog({
            message: Message,
            title: Title,
            buttons: {
                Ok: {
                    label: "Ok",
                    className: "btn-success",
                    callback: OkFunc
                }
            }
        }).find("div.modal-dialog").addClass("bootbox-top");
    },
    MessageBoxConfirm: function (Title, Message, YesFunc, NoFunc) {
        bootbox.dialog({
            message: Message,
            title: Title,
            buttons: {
                Yes: {
                    label: "Yes",
                    className: "btn-success",
                    callback: YesFunc
                },
                No: {
                    label: "No",
                    className: "btn-primary",
                    callback: NoFunc
                }
            }
        }).find("div.modal-dialog").addClass("bootbox-top");
    },
    ModalShow: function (id, flag) {
        if (flag) $(id).modal('show');
        else $(id).modal('hide');
    },
    ButtonDisable: function (id, flag) {
        //$(id).prop("disabled", flag);
        if (flag) {
            $(id).addClass("disabled");
        } else {
            $(id).removeClass("disabled");
        }

    }

}

function GridList(cId) {
    this.Id = cId;
    this.Tbl;

    var param;
    var Url;

    var Columns = [];
    var RowCallback = function (nRow, aData) { return nRow; };
    var ctr = 0;

    this.Tbl = $(cId).DataTable({
        cache: false,
        destroy: true,
        paging: false,
        searching: true,
        ordering: false,
        scrollX: true,
        info: true
    });

}
GridList.prototype = {
    constructor: GridList,
    Legend: function (col, value, color) {
        var row = {};
        row['col'] = col;
        row['value'] = value;
        row['backColor'] = color;
        this.ListOfLegends.push(row);
    },
    setRowCallback: function (value) {
        RowCallback = value;
    },
    setColumns: function (value) {
        Columns = value;
    },
    setUrl: function (value) {
        Url = value;
    },
    setParam: function (value) {
        param = value;
    },
    getId: function () {
        return this.Id.replace('#', '');
    },
    getTbl: function () {
        return this.Tbl;
    },
    Display: function () {
        var id = this.Id;
        var cols = this.Columns;
        var tbl;
        var datarow;
        var legends = this.ListOfLegends;

        $.ajax({
            url: Url,
            data: param,
            type: 'get',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            cache: false,
            beforeSend: function () {
                $('#preloader').show();
                $('.Hide').hide();
            },
            success: function (data) {
                $('#preloader').hide();
                $('.Show').show();
                this.Tbl = $(id).DataTable({
                    data: data,
                    cache: false,
                    destroy: true,
                    paging: true,
                    searching: true,
                    ordering: false,
                    info: true,
                    columns: Columns,
                    bAutoWidth: false,
                    scrollY: 400,
                    scrollX: true,
                    fnRowCallback: RowCallback
                });
            },
            error: function (xhr, desc, err) {
                $('#preloader').hide();
                var errMsg = err + "<br>" + desc;

            }
        });

        //        $(document).on("click", this.Id + " td", SelectedRow);
        //        function SelectedRow(e) {
        //            if (ctr>0) {
        //                ctr=0;
        //                return;
        //            }
        //            ctr++;

        //            e.preventDefault();

        //            if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        //                var tr = $(this).closest('tr');

        //                if (tr.hasClass('selected')) {
        //                    tr.removeClass('selected');
        //                }
        //                else {
        //                    $('tr.selected').removeClass('selected');
        //                    tr.addClass('selected');
        //                }

        //                $.event.trigger({
        //                    type: id.replace('#', '') + "_Selected",
        //                    DataRow: ""
        //                    // DataRow: this.Tbl.row($(this).parents('tr')).data(),
        //                });

        //            }
        //        }
        function Loaded(nRow, aData) {
            $.event.trigger({
                type: id.replace('#', '') + "_Loading",
                enRow: nRow,
                aData: aData
            });
        }

    }


}

function GridEntry(cId, cSearching) {
    this.Id = cId;
    this.Url;
    this.Tbl;

    var Searching = cSearching;
    //var Tbl;
    var Columns = [];
    var RowCallback = function (nRow, aData) { return nRow; };
    var RowCount;


    var ctr = 0;

    this.Tbl = $(cId).DataTable({
        cache: false,
        destroy: true,
        paging: false,
        searching: cSearching,
        ordering: false,
        scrollX: true,
        info: false
    });

}
GridEntry.prototype = {
    constructor: GridEntry,
    ReadOnly: function (flag) {
        if (flag) {
            $(this.Id + " *").attr('disabled', 'disabled');
        }
        else {
            $(this.Id + " *").attr('enabled', 'enabled');
        }
    },
    Legend: function (col, value, color) {
        var row = {};
        row['col'] = col;
        row['value'] = value;
        row['backColor'] = color;
        this.ListOfLegends.push(row);
    },
    setRowCallback: function (value) {
        RowCallback = value;
    },
    setColumns: function (value) {
        Columns = value;
    },
    setSearching: function (value) {
        Searching = value;
    },
    AddRow: function (value) {
        Tbl.row.add(value).draw();
    },
    getRowCount: function () {
        RowCount = $(this.Id).DataTable().rows().nodes().length;
        return RowCount;
    },
    getId: function () {
        return this.Id.replace('#', '');
    },
    getTbl: function () {
        return this.Tbl;
    },
    Display: function () {
        var id = this.Id;
        var cols = this.Columns;
        var tbl;
        var datarow;
        var legends = this.ListOfLegends;

        $.ajax({
            url: this.Url,
            type: 'get',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            cache: false,
            beforeSend: function () {
                ctr = 0;
                $('#preloader').show();
            },
            success: function (data) {

                this.Tbl = $(id).DataTable({
                    data: data,
                    cache: false,
                    destroy: true,
                    paging: true,
                    searching: Searching,
                    ordering: true,
                    info: false,
                    columns: Columns,
                    autoWidth: false,
                    scrollX: true,
                    scrollY: "400%",
                    fnRowCallback: RowCallback
                });

                showindicator.Stop();
            },
            error: function (xhr, desc, err) {
                showindicator.Stop();
                var errMsg = err + "<br>" + desc;
            }
        });

        $(document).on("click", this.Id + " td", SelectedRow);
        function SelectedRow(e) {
            if (ctr > 0) return;
            ctr++;

            e.preventDefault();

            if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
                var tr = $(this).closest('tr');

                if (tr.hasClass('selected')) {
                    tr.removeClass('selected');
                }
                else {
                    $('tr.selected').removeClass('selected');
                    tr.addClass('selected');
                }

                $.event.trigger({
                    type: id.replace('#', '') + "_Selected",
                    DataRow: Tbl.row($(this).parents('tr')).data(),
                });

            }
        }
        function Loaded(nRow, aData) {
            $.event.trigger({
                type: id.replace('#', '') + "_Loading",
                enRow: nRow,
                aData: aData
            });
        }

        ctr = 0;
    },
    Display: function (data) {
        var id = this.Id;
        var cols = this.Columns;
        var tbl;
        var datarow;
        var legends = this.ListOfLegends;

        this.Tbl = $(id).DataTable({
            data: data
            , cache: false
            , destroy: true
            , paging: true
            , searching: true
            , ordering: false
            , autoWidth: false
            , info: true
            , scrollX: true
            , scrollY: "400%"
            , scrollCollapse: true
            , columns: Columns
            , fnRowCallback: RowCallback
        });

        //        $(document).on("click", this.Id + " td", SelectedRow);
        //        function SelectedRow(e) {
        //            if (ctr>0) {
        //                ctr=0;
        //                return;
        //            }
        //            ctr++;

        //            e.preventDefault();

        //            if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        //                var tr = $(this).closest('tr');

        //                if (tr.hasClass('selected')) {
        //                    tr.removeClass('selected');
        //                }
        //                else {
        //                    $('tr.selected').removeClass('selected');
        //                    tr.addClass('selected');
        //                }

        //                $.event.trigger({
        //                    type: id.replace('#', '') + "_Selected",
        //                    DataRow: Tbl.row($(this).parents('tr')).data(),
        //                });

        //            }
        //        }
        function Loaded(nRow, aData) {
            $.event.trigger({
                type: id.replace('#', '') + "_Loading",
                enRow: nRow,
                aData: aData
            });
        }

        ctr = 0;
    },
    Empty: function () {
        this.Tbl = $(this.Id).DataTable({
            cache: false,
            destroy: true,
            paging: false,
            searching: Searching,
            ordering: false,
            scrollX: true,
            info: false
        });
    }

}

function AjaxANM(url) {
    this.Url = url;
}
AjaxANM.prototype = {

}
