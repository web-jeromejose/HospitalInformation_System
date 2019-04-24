
var ClassGridFilter = {    
    Id: null,
    Text: null,
    Ids: [],
    Texts: [],
    IdIndexOf: null,
    SetCtrlText: function () {
        var obj = document.getElementById(this.Id);
        obj.placeholder = this.Text;
    },
    SetMultiCtrlText: function () {
        var _ids = this.Ids;
        var _txts = this.Texts;
        var l = this.Ids.length;
        for (var i = 0; i < l; i++) {
            var obj = document.getElementById(_ids[i]);
            obj.placeholder = _txts[i];
        }
    },

    SetAllCtrText: function () {
        var _objs = $(":input:text");
        var l = _objs.length;
        for (var i = 0; i < l; i++) {
            if (_objs[i].id.indexOf(this.IdIndexOf) > -1) 
                _objs[i].placeholder = this.Text;                            
        }
    }


}

