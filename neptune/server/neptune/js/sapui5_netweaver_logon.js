// Global Ajax Success
$(document).ajaxSuccess(function(event, request, settings) {

  var LoginStatus = request.getResponseHeader("SAPLoginStatus");

  switch (LoginStatus) {

  case "Logon":
    UI5Logon();
    break;

  case "Password":
    UI5Password();
    break;

  }

});

// Global Ajax Error
$(document).ajaxError(function(event, request, settings) {

  switch (request.status) {

  case 0:
    jQuery.sap.require("sap.m.MessageToast");
    sap.m.MessageToast.show("No connection", {duration: 1000});
    break;

  case 200:

    var LoginStatus = request.getResponseHeader("SAPLoginStatus");

    switch (LoginStatus) {

    case "Logon":
      UI5Logon();
      break;

    case "Password":
      UI5Password();
      break;

    }

    break;

  case 401:
    UI5Logon();
    break;

  case 404:
    break;

  default:
    jQuery.sap.require("sap.m.MessageToast");
    sap.m.MessageToast.show(request.status + " - " + request.statusText, {duration: 1000});

  }

});


setTimeout(function(){

// Get Local Storage
UI5LogonGetLS();

// SAPUI5 Logon Dialog 
var butUI5Save = new sap.m.Button({text:"Save",press: function(oEvent) {UI5LogonSave(oEvent);}});
var butUI5Cancel = new sap.m.Button({text:"Cancel",press: function(oEvent) { oLogonDialog.close(); }});
oLogonDialog = new sap.m.Dialog({title:"Logon",type:sap.m.DialogType.Message,leftButton:butUI5Save,rightButton:butUI5Cancel}); 
var lblUI5UserName = new sap.m.Label({text:"Username"});
oLogonDialog.addContent(lblUI5UserName); 
inUI5UserName = new sap.m.Input({});
oLogonDialog.addContent(inUI5UserName); 
var lblUI5Password = new sap.m.Label({text:"Password"});
oLogonDialog.addContent(lblUI5Password); 
inUI5Password = new sap.m.Input({type:sap.m.InputType.Password});
oLogonDialog.addContent(inUI5Password); 

// SAPUI5 Password Dialog 
var butUI5PwdSave = new sap.m.Button({text:"Save",press: function(oEvent) {UI5PwdSave(oEvent);}});
var butUI5PwdCancel = new sap.m.Button({text:"Cancel",press: function(oEvent) { oLogonDialog.close(); }});
oLogonDialogPwd = new sap.m.Dialog({title:"Change Password",type:sap.m.DialogType.Message,leftButton:butUI5PwdSave,rightButton:butUI5PwdCancel}); 
var lblUI5OldPwd = new sap.m.Label({text:"Old password"});
oLogonDialogPwd.addContent(lblUI5OldPwd); 
inUI5OldPwd = new sap.m.Input({type:sap.m.InputType.Password});
oLogonDialogPwd.addContent(inUI5OldPwd); 
var lblUI5NewPwd = new sap.m.Label({text:"New password"});
oLogonDialogPwd.addContent(lblUI5NewPwd); 
inUI5NewPwd = new sap.m.Input({type:sap.m.InputType.Password});
oLogonDialogPwd.addContent(inUI5NewPwd); 
var lblUI5RepeatPwd = new sap.m.Label({text:"Repeat password"});
oLogonDialogPwd.addContent(lblUI5RepeatPwd); 
inUI5RepeatPwd = new sap.m.Input({type:sap.m.InputType.Password});
oLogonDialogPwd.addContent(inUI5RepeatPwd); 
inUI5MessagePwd = new sap.m.Text({});
oLogonDialogPwd.addContent(inUI5MessagePwd); 
},1);

// FUNCTIONS

function UI5Password() {
inUI5OldPwd.setValue();
inUI5NewPwd.setValue();
inUI5RepeatPwd.setValue();
oLogonDialogPwd.open();
inUI5OldPwd.focus();
}

function UI5PwdSave() {

// Check New Password
if (inUI5NewPwd.getValue() != inUI5RepeatPwd.getValue()) {
   inUI5MessagePwd.setText("New password must match");
   inUI5NewPwd.setValue();
   inUI5RepeatPwd.setValue();
   return;
}

var formData = "sap-system-login-password=" 
             + inUI5OldPwd.getValue() 
             + "&sap-system-login-passwordnew="
             + inUI5NewPwd.getValue() 
             + "&sap-system-login-passwordrepeat="
             + inUI5RepeatPwd.getValue() 
             + "&sap-system-login-oninputprocessing=onDoChangePwd"
             + "&sap-system-login=onContinuePwd"
             + "&sap-client="
             + valUI5Client;

$.ajax({
type: "POST",
url: valUI5Url,
data: formData,
success: function (data, status, request) {

  inUI5MessagePwd.setText(request.getResponseHeader("SAPLoginMessage"));

  if (inUI5MessagePwd.getText().length == 0) {
     oLogonDialogPwd.close();
  }
}
});

}

function UI5Logon() {
inUI5UserName.setValue();
inUI5Password.setValue();
oLogonDialog.open();
inUI5UserName.focus();
}

function UI5LogonSave() {
UI5LogonPutLS();
UI5LogonGetLS();
oLogonDialog.close();
}

function UI5LogonPutLS() {

// Build Auth String
var tok  = inUI5UserName.getValue() + ':' + inUI5Password.getValue();
var hash = Base64.encode(tok);
var auth = "Basic " + hash;

// Save to Local Storage
$.sap.require("jquery.sap.storage");
var UI5Storage =  $.sap.storage(jQuery.sap.storage.Type.session);
UI5Storage.remove("Auth");
UI5Storage.put("Auth",auth);
}

function UI5LogonGetLS() {
$.sap.require("jquery.sap.storage");
var UI5Storage = $.sap.storage(jQuery.sap.storage.Type.session);
var auth = UI5Storage.get("Auth");

if (!auth) 
{ return }

$.ajaxSetup({
   headers: {"Authorization": auth}
});

}

function UI5Logout() {
$.sap.require("jquery.sap.storage");
var UI5Storage = $.sap.storage(jQuery.sap.storage.Type.session);
UI5Storage.remove("Auth");

// Clear SSO
$.ajax({
type: "POST",
url: valUI5Url + '?sap-clearsso2',
success: function (data, status, request) {

// Clear Auth
$.ajaxSetup({
   headers: {"Authorization": ""}
});

jQuery.sap.require("sap.m.MessageToast");
sap.m.MessageToast.show("User logged out", {duration: 1000});

}
});

}



/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/

var Base64 = {

	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = Base64._utf8_encode(input);

		while (i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		}

		return output;
	},

	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {

			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}

		output = Base64._utf8_decode(output);

		return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;

		while ( i < utftext.length ) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}

		}

		return string;
	}

}

