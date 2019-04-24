
var ControlProperties = {
    ControlIdPrefix:null,
    ControlId: null,
    NewControlId:null,
    ControllerAction:null,
    Data:null,
    DataIndex:null,
    DataColValue:null
}


var ControlMethods = {
    ctrlProp: ControlProperties,
    ctrlIndex: null,
    ctrlKeyCode: null,

    //This will get the index of the control inside the Gridview
    //Note: that In order to run this method, ControlProperty ControlId must be filled.
    //ControlId     = 'txtName'
    GetIndex: function () {

        var c = this.ctrlProp;

        if (c.ControlId == null) {
            alert("System error:\nControl property was not valid or not supploed!");
            return;
        }
        var tempIndex = c.ControlId.replace(c.ControlIdPrefix, "");
        this.ctrlIndex = 1 * parseInt(tempIndex);
    },
    //This will select the specific Control you.
    //Note: In order to run this method, ControlProperty NewControlId  
    //NewControlId  = 'txtName{{0}}_I'    (this should be the format - because the characters {{0}} contains the index value of the control).
    SetFocusToNewItem: function () {
        var id = this.ctrlProp.NewControlId.replace("{{0}}", this.ctrlIndex);
        document.getElementById(id).select();
    },

    //Note:On the KeyBoard Event of the Control call this method. This will fire the GetIndex() and SetFocusToNewItem();
    //The only thing you have to do is to Fille the ctrlKeyCode under ControlMethod
    KeyBoardEvent: function () {
        this.GetIndex();
        var code = this.ctrlKeyCode;

        if (code == 38) {//Up
            this.ctrlIndex -= 1;
            this.SetFocusToNewItem();
        }
        else if (code == 40) {//Down
            this.ctrlIndex += 1;
            this.SetFocusToNewItem();
        }
        else {
            this.ValueChanged();
        }
    },
    ValueChanged: function () {
        var c = ControlProperties;

        if (c.Data == null) {
            alert("Control property ('Data') value was undefined or invalid value");
            return;
        }

        c.Data["index"] = this.ctrlIndex;
        $.ajax({
            url: c.ControllerAction,
            data: c.Data,
            type: 'POST',
            success: function (r) {

            }
        });
    }

}