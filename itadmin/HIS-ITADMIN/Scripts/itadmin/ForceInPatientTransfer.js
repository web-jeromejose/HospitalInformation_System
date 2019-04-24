var c = new Common();
var Action = -1;
 
 
 


$(document).ready(function () {
 
    InitSelect2();
   
    
});

 
 

function InitSelect2() {
    $("#HasBed").hide();
    $("#btnSave").hide();
    Sel2Server($("#Select2Pin"), $("#url").data("fetchip"), function (d) {
        console.log(d);
        var arr = d.text.split('-');
        $('#txtName').val(arr[1]);
        $('#txtCurrentBed').val(d.name);
       // AccessId = (d.id);
        //var tarrifId = (d.tariffid);

        Sel2Server($("#Select2TransferPin"), $("#url").data("getbedlistwithnopatient"), function (e) {
            console.log(e);
        });


        if (!d.name) {
            $("#btnSave").show();
            $("#HasBed").hide();
            $('#Select2TransferPin').select2("enable", true);
            c.MessageBoxErr('Message', 'Please select correct Bed Name.');
            setTimeout(function () {
                $('#Select2TransferPin').select2('open');
            }, 2500); 

       

           

        } else {
            $("#HasBed").show(); 
              
            $('#Select2TransferPin').select2("enable", false);
            $("#btnSave").hide();
            c.MessageBoxErr('Error', 'Patient is currently in proper bed and cannot be transfer!!!!');
        }

    });

    
    $('#btnSave').click(function () {
        var YesFunc = function () {
            Action = 1;
            Save();
        };
        c.MessageBoxConfirm("Save Entry?", "Are you sure you want to transfer the Patient?", YesFunc, null);

    });

}
 

function Save() {

    var ret = Validated();
    if (!ret) return ret;


    var ai = {
       
        BedId: $("#Select2TransferPin").select2('data').id,
        IPID: $("#Select2Pin").select2('data').id

    };

    console.log(ai);
    $.ajax({
        url: $('#url').data("save"),
        type: 'POST',
        data: JSON.stringify(ai),
        contentType: 'application/json; charset=utf-8',
        success: function (data ) {
            console.log(data);

            if (data.ErrorCode == 0) {
                c.MessageBoxErr("Error...", data.Message);
                return;
            }

            var OkayButtonFunc = function () {
                //  alert('OKAY');
                $("#Select2Pin").val('');
                $('#Select2Pin').select2('open');
                $('#Select2TransferPin').select2("enable", false);
               
            }

            c.MessageBox(data.Title, data.Message, OkayButtonFunc);

        },
            error: function () {
                alert("error");
            }
        });



}

function Validated() {

    var ret = false;

    ret = $("#Select2TransferPin").select2('data');
    console.log(ret);
    if (!ret) {
        c.MessageBoxErr('ERROR', 'Please select Transfer Bed!');
        setTimeout(function () {
            $('#Select2TransferPin').select2('open');
        }, 2500);

        return false;
    }

    return true;

}