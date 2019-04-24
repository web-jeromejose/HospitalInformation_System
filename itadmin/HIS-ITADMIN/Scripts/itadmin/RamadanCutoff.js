var c = new Common();



$(document).ready(function () {
     InitSelect2();
 });


function InitSelect2() {
    $('#btnSave').click(function () {
        var YesFunc = function () {
            Action = 1;
            Save();
        };
        c.MessageBoxConfirm("Save Entry?", "Are you sure you want to Edit the Ramadan Cutoff?", YesFunc, null);

    });
}


function Save() {
 
    var entry;
    entry = []
    entry = {}
    entry.Hours = $('#Hours').val();
    entry.Mins = $('#Mins').val();
   
 

    console.log(entry);



    $.ajax({
        url: $('#url').data("save"),
        data: JSON.stringify(entry),
        type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {

            c.ButtonDisable('#btnSave', true);
    
        },
        success: function (data) {
      
            if (data.ErrorCode == 0) {
                c.MessageBoxErr("Error...", data.Message);
                return;
            }

            var OkFunc = function () {

                if (Action == 3) {

                }
            

            };

            c.MessageBox(data.Title, data.Message, OkFunc);
        },
        error: function (xhr, desc, err) {
            c.ButtonDisable('#btnSave', false);
            var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
            c.MessageBox("Error...", errMsg, null);
        }
    });

  
}
