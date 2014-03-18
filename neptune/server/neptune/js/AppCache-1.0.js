var AppCache={Initialized:false,Encrypted:"",CurrentUser:"",CurrentApp:"",StartApp:"",Url:"",Client:"",Passcode:"",Auth:"",enablePasscode:true,numPasscode:5,PasscodeApp:"",Load:function(e){e=e.toUpperCase();AppCache.CurrentApp=e;AppCache.setEnableLogonScreen(false);$.sap.require("jquery.sap.storage");var t=$.sap.storage(jQuery.sap.storage.Type.local);var n="AppCache_"+e;var r=t.get(n);if(r){if(AppCache.Initialized==true){AppDestroy();sap.ui.getCore().applyChanges()}$("#AppCache_Wrapper").html(r).trigger("create");AppCache.Initialized=true;return}if(modelAppCacheData.getData().length){var i=modelAppCacheData.getData();$.each(i,function(t,n){if(n){if(n.APPLID==e){i.splice(t,1)}}});modelAppCacheData.setData(i)}getOnlineAppCacheContent(e)},Update:function(){getOnlineAppCacheData()},setEnablePasscodeScreen:function(e){AppCache_boxPasscode.setVisible(e);AppCache_statusItem.setInfo();AppCache_inPasscode1.focus()},setEnablePasswordScreen:function(e){AppCache_boxPassword.setVisible(e);AppCache_statusItem.setInfo();AppCache_inPassOld.focus()},setEnableUsersScreen:function(e){AppCache_boxUsers.setVisible(e);AppCache_statusItem.setInfo();AppCacheUsers.removeSelections()},setEnableLogonScreen:function(e){AppCache_boxLogon.setVisible(e);AppCache_statusItem.setInfo();AppCache_inUsername.focus()},Logout:function(){if(AppCache.Initialized==true){AppDestroy()}AppCache.setEnableLogonScreen(true);AppCache.setEnablePasscodeScreen(false);AppCache.setEnableUsersScreen(false);AppCache_listStatus.setVisible(true);AppCache.Initialized=false;NumPad.numPasscode=0;AppCache.Encrypted="";AppCache_inUsername.setValue();AppCache_inUsername.focus();$.ajax({type:"POST",url:AppCache.Url+"/neptune/native/neptune_login_ping.html?sap-clearsso2",success:function(e,t,n){AppCache_statusItem.setInfo(AppCacheText.userLogout)}});AppCache.Auth="";$.ajaxSetup({headers:{Authorization:AppCache.Auth}});if(modelAppCacheUsers.getData().length){AppCache_butSelect.setVisible(true)}},Logon:function(){if(AppCache_inUsername.getValue()==""){AppCache_statusItem.setInfo(AppCacheText.enterUsername);AppCache_inUsername.focus();return}if(AppCache_inPassword.getValue()==""){AppCache_statusItem.setInfo(AppCacheText.enterPassword);AppCache_inPassword.focus();return}var e=AppCache_inUsername.getValue()+":"+AppCache_inPassword.getValue();var t=Base64.encode(e);AppCache.Auth="Basic "+t;$.ajaxSetup({headers:{Authorization:AppCache.Auth,"sap-client":AppCache.Client}});var n="sap-user="+AppCache_inUsername.getValue()+"&sap-password="+AppCache_inPassword.getValue()+"&sap-client="+AppCache.Client;$.ajax({type:"POST",url:AppCache.Url+"/neptune/native/neptune_login_ping.html?sap-clearsso2",data:n,success:function(e,t,n){AppCache_statusItem.setInfo(n.getResponseHeader("SAPLoginMessage"));var r=n.getResponseHeader("SAPLoginStatus");switch(r){case"Logon":AppCache_inPassword.setValue();AppCache_inPassword.focus();return;case"Password":AppCache_statusItem.setInfo(n.getResponseHeader("SAPLoginMessage"));AppCache.setEnablePasswordScreen(true);AppCache.setEnableLogonScreen(false);AppCache.setEnableUsersScreen(false);AppCache_inPassOld.setValue(AppCache_inPassword.getValue());AppCache_inPassNew.focus();return}AppCache_inPassword.setValue();if(AppCache.enablePasscode==true){AppCache.setEnablePasscodeScreen(true);AppCache.setEnableLogonScreen(false);AppCache.setEnableUsersScreen(false)}else{NumPad.Verify=true;AppCache_listStatus.setVisible(false);AppCache.Update()}},error:function(e,t){}})},SetPassword:function(){if(AppCache_inPassNew.getValue()!=AppCache_inPassRepeat.getValue()){AppCache_statusItem.setInfo(AppCacheText.newPasswordNoMatch);AppCache_inPassNew.setValue();AppCache_inPassRepeat.setValue();return}var e="sap-system-login-password="+AppCache_inPassOld.getValue()+"&sap-system-login-passwordnew="+AppCache_inPassNew.getValue()+"&sap-system-login-passwordrepeat="+AppCache_inPassRepeat.getValue()+"&sap-system-login-oninputprocessing=onDoChangePwd"+"&sap-system-login=onContinuePwd"+"&sap-client="+AppCache.Client;$.ajax({type:"POST",url:AppCache.Url+"/neptune/native/neptune_login_ping.html",data:e,success:function(e,t,n){AppCache_statusItem.setInfo(n.getResponseHeader("SAPLoginMessage"));AppCache_inPassword.setValue(AppCache_inPassNew.getValue());AppCache_inPassNew.setValue();AppCache_inPassRepeat.setValue();if(AppCache_statusItem.getInfo().length==0){AppCache.setEnablePasswordScreen(false);AppCache.setEnableLogonScreen(true);AppCache.Logon()}}})},Lock:function(){NumPad.numPasscode=0;if(modelAppCacheUsers.getData().length>1){AppDestroy();AppCache.setEnableUsersScreen(true)}else{var e=modelAppCacheUsers.getData();AppCache.Encrypted=e[0].AUTH;AppCache.Load(AppCache.PasscodeApp)}},RemoveAllCache:function(){AppCache.Logout();$.sap.require("jquery.sap.storage");var e=$.sap.storage(jQuery.sap.storage.Type.local);e.removeAll();modelAppCacheUsers.setData();AppCache_butSelect.setVisible(false)},SetPasscode:function(){jQuery.sap.require("sap.m.MessageToast");if(AppCache_inPasscode1.getValue()==""){AppCache_statusItem.setInfo(AppCacheText.enterNewPasscode);AppCache_inPasscode1.focus();return}if(AppCache_inPasscode2.getValue()==""){AppCache_statusItem.setInfo(AppCacheText.enterRepeatPasscode);AppCache_inPasscode2.focus();return}if(AppCache_inPasscode2.getValue().length!=4){AppCache_statusItem.setInfo(AppCacheText.PasscodeToShort);AppCache_inPasscode1.setValue();AppCache_inPasscode2.setValue();AppCache_inPasscode1.focus();return}if(AppCache_inPasscode1.getValue()!=AppCache_inPasscode2.getValue()){AppCache_statusItem.setInfo(AppCacheText.noPasscodeMatch);AppCache_inPasscode1.setValue();AppCache_inPasscode2.setValue();AppCache_inPasscode1.focus();return}AppCache.setEnablePasscodeScreen(false);AppCache.setEnableUsersScreen(false);AppCache_listStatus.setVisible(false);AppCache.Passcode=AppCache_inPasscode1.getValue();AppCache_inPasscode1.setValue();AppCache_inPasscode2.setValue();AppCache.Load(AppCache.PasscodeApp);getOnlineAppCacheUsers()},Startup:function(){$.ajaxSetup({headers:{"sap-client":AppCache.Client,NeptuneServer:AppCache.Url}});if(AppCache.enablePasscode==true){getCacheAppCacheUsers();if(!modelAppCacheUsers.getData().length){AppCache.setEnableLogonScreen(true);AppCache_listStatus.setVisible(true);return}if(modelAppCacheUsers.getData().length>1){AppCache.setEnableUsersScreen(true);AppCacheUsers.removeSelections()}else{var e=modelAppCacheUsers.getData();AppCache.Encrypted=e[0].AUTH;AppCache.CurrentUser=e[0].NAME;AppCache.setEnableLogonScreen(false);AppCache_listStatus.setVisible(false);AppCache.Load(AppCache.PasscodeApp)}}else{AppCache.setEnableLogonScreen(true);AppCache_listStatus.setVisible(true)}}};var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t}};var NumPad={numValue:"",Verify:false,numPasscode:0,enterKey:function(e){if(Passcode1.getSelected()==false){Passcode1.setSelected(true);NumPad.numValue=NumPad.numValue+e;return}if(Passcode2.getSelected()==false){Passcode2.setSelected(true);NumPad.numValue=NumPad.numValue+e;return}if(Passcode3.getSelected()==false){Passcode3.setSelected(true);NumPad.numValue=NumPad.numValue+e;return}if(Passcode4.getSelected()==false){Passcode4.setSelected(true);NumPad.numValue=NumPad.numValue+e;butNumpadLogin.setEnabled(true);return}},Clear:function(){NumPad.numValue="";Passcode1.setSelected(false);Passcode2.setSelected(false);Passcode3.setSelected(false);Passcode4.setSelected(false);butNumpadLogin.setEnabled(false)},Logon:function(){var e=CryptoJS.AES.decrypt(AppCache.Encrypted,NumPad.numValue);try{var t=e.toString(CryptoJS.enc.Utf8)}catch(n){t=""}if(t==""){NumPad.Clear();if(AppCache.numPasscode==NumPad.numPasscode){NumPad.numPasscode=0;AppCache.Logout();AppCache.RemoveAllCache();return}jQuery.sap.require("sap.m.MessageToast");sap.m.MessageToast.show(AppCacheText.noPasscodeMatch);NumPad.numPasscode++;return}$.ajaxSetup({headers:{Authorization:t}});App.setBusy(true);NumPad.numPasscode=0;NumPad.Clear();NumPad.Verify=true;AppCache.Encrypted="";AppCache.Update()}};$(document).ajaxError(function(e,t,n){switch(t.status){case 0:jQuery.sap.require("sap.m.MessageToast");sap.m.MessageToast.show(AppCacheText.noConnection);if(AppCache.CurrentApp==AppCache.PasscodeApp){AppCache.Load(AppCache.StartApp)}break;case 401:AppCache.Logout();break;case 404:break;default:jQuery.sap.require("sap.m.MessageToast");sap.m.MessageToast.show(t.status+" - "+t.statusText)}})