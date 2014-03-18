/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * (c) Copyright 2009-2013 SAP AG or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
jQuery.sap.declare("sap.ui.core.routing.History");jQuery.sap.require("sap.ui.core.routing.HashChanger");
sap.ui.core.routing.History=function(h){this._iHistoryLength=window.history.length;this._aHistory=[];this._bIsInitial=true;if(!h){jQuery.sap.log.error("sap.ui.core.routing.History constructor was called and it did not get a hashChanger as parameter")}this._oHashChanger=h;this._oHashChanger.attachEvent("hashChanged",this._onHashChange,this);this._oHashChanger.attachEvent("hashReplaced",this._hashReplaced,this);this._oHashChanger.attachEvent("hashSet",this._hashSet,this);this._reset()};
sap.ui.core.routing.History.prototype.destroy=function(n){this._oHashChanger.detachEvent("hashChanged",this._onHashChange,this);this._oHashChanger.detachEvent("hashReplaced",this._hashReplaced,this);this._oHashChanger.detachEvent("hashSet",this._hashSet,this);this._oHashChanger=null};
sap.ui.core.routing.History.prototype.getDirection=function(n){if(n!==undefined&&this._bIsInitial){return undefined}if(n===undefined){return this._sCurrentDirection}return this._getDirection(n)};
sap.ui.core.routing.History.prototype._reset=function(){this._aHistory.length=0;this._iHistoryPosition=0;this._bUnknown=true;this._aHistory[0]=this._oHashChanger.getHash()};
sap.ui.core.routing.History.prototype._getDirection=function(n,h){var d=sap.ui.core.routing.HistoryDirection;if(this._oNextHash&&this._oNextHash.sHash===n){return d.NewEntry}if(this._bUnknown){return d.Unknown}if(h){return d.NewEntry}if(this._aHistory[this._iHistoryPosition+1]===n&&this._aHistory[this._iHistoryPosition-1]===n){return d.Unknown}if(this._aHistory[this._iHistoryPosition-1]===n){return d.Backwards}if(this._aHistory[this._iHistoryPosition+1]===n){return d.Forwards}return d.Unknown};
sap.ui.core.routing.History.prototype._onHashChange=function(e){this._hashChange(e.getParameter("newHash"))};
sap.ui.core.routing.History.prototype._hashChange=function(n){var d=sap.ui.core.routing.HistoryDirection,h=jQuery.inArray(n,this._aHistory),a=window.history.length,D;if(this._oNextHash&&this._oNextHash.bWasReplaced&&this._oNextHash.sHash===n){this._aHistory[this._iHistoryPosition]=n;this._oNextHash=null;return}this._bIsInitial=false;D=this._sCurrentDirection=this._getDirection(n,this._iHistoryLength<window.history.length);if(this._oNextHash&&!this._oNextHash.bWasReplaced){this._iHistoryLength=a+1}else{this._iHistoryLength=a}if(this._oNextHash){this._oNextHash=null}if(D===d.Unknown){this._reset();return}this._bUnknown=false;if(D===d.NewEntry){if(this._iHistoryPosition+1<this._aHistory.length){this._aHistory=this._aHistory.slice(0,this._iHistoryPosition+1)}this._aHistory.push(n);this._iHistoryPosition+=1;return}if(D===d.Forwards){this._iHistoryPosition++;return}if(D===d.Backwards){this._iHistoryPosition--}};
sap.ui.core.routing.History.prototype._hashSet=function(e){this._hashChangedByApp(e.getParameter("sHash"),false)};
sap.ui.core.routing.History.prototype._hashReplaced=function(e){this._hashChangedByApp(e.getParameter("sHash"),true)};
sap.ui.core.routing.History.prototype._hashChangedByApp=function(n,w){this._oNextHash={sHash:n,bWasReplaced:w}};
(function(){var i=new sap.ui.core.routing.History(sap.ui.core.routing.HashChanger.getInstance());sap.ui.core.routing.History.getInstance=function(){return i}}());

