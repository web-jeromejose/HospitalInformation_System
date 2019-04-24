//Added bt Jason
function IsPlus(keyCode) {
    return keyCode == 43;
}

function IsBraces(keycode) {
    return (keyCode == 123) || (keyCode == 125)
}

//***********************************
function IsSpace(keyCode) {
    return keyCode == 32;
}

function IsDot(keyCode) {
    return keyCode == 190;
}

function IsAlphabet(keyCode) {
    return ((keyCode >= 65) && (keyCode <= 90)) ||
            ((keyCode >= 97) && (keyCode <= 122));
}

function IsNumber(keyCode) {
    return ((keyCode >= 48) && (keyCode <= 57)) ||
           ((keyCode >= 96) && (keyCode <= 105));
}

function IsDash(keyCode) {
    return keyCode == 45;
}

function IsAtSign(keyCode) {
    return keyCode == 64;
}

function IsUnderscore(keyCode) {
    return keyCode == 95;
}

function IsSharp(keyCode) {
    return keyCode == 35;
}

function IsSlash(keyCode) {
    return keyCode == 47;
}

function IsComma(keyCode) {
    return keyCode == 44;
}

function IsParenthesis(keyCode) {
    return (keyCode == 40) || (keyCode == 41);
}


function IsInMinLen(ValueLen, MinLen) {
    return (ValueLen <= MinLen);

}

function IsBackSpace(keyCode) {
    return (keyCode == 8)
}


function fadein(obj) {
    $(obj).fadeIn('slow', function () {
        $(this).css({ "display": "block" });
    });
}
function fadeout(obj) {

    $(obj).fadeOut('slow', function () {
        $(this).css({ "display": "none" });
    });
}

function ShowCtrl(obj) {
    $(obj).css({ "display": "block" });   
}
function HideCtrl(obj) {
    $(obj).css({ "display": "none" });
   
}
