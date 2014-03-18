/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * (c) Copyright 2009-2013 SAP AG or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
jQuery.sap.declare("sap.ui.model.xml.XMLListBinding");jQuery.sap.require("sap.ui.model.ClientListBinding");jQuery.sap.require("sap.ui.model.ChangeReason");sap.ui.model.ClientListBinding.extend("sap.ui.model.xml.XMLListBinding");
sap.ui.model.xml.XMLListBinding.prototype.getContexts=function(s,l){this.iLastStartIndex=s;this.iLastLength=l;if(!s){s=0}if(!l){l=Math.min(this.iLength,this.oModel.iSizeLimit)}var c=this._getContexts(s,l),C={};if(this.bUseExtendedChangeDetection){for(var i=0;i<c.length;i++){C[c[i].getPath()]=this.oModel._getObject(c[i].getPath())[0]}if(this.aLastContexts&&s<this.iLastEndIndex){var t=this;var d=jQuery.sap.arrayDiff(this.aLastContexts,c,function(o,n){var O=t.oLastContextData&&t.oLastContextData[o.getPath()];var N=C&&C[n.getPath()];if(O&&N){return jQuery.sap.isEqualNode(O,N)}return false});c.diff=d}this.iLastEndIndex=s+l;this.aLastContexts=c.slice(0);this.oLastContextData={};var t=this;jQuery.each(C,function(k,n){t.oLastContextData[k]=n.cloneNode(true)})}return c};
sap.ui.model.xml.XMLListBinding.prototype.update=function(){var l=this.oModel._getObject(this.sPath,this.oContext);if(l){this.oList=[];var t=this;if(this.bUseExtendedChangeDetection){jQuery.each(l,function(k,n){t.oList.push(n.cloneNode(true))})}else{this.oList=l.slice(0)}this.updateIndices();this.applyFilter();this.applySort();this.iLength=this._getLength()}else{this.oList=[];this.aIndices=[];this.iLength=0}};
sap.ui.model.xml.XMLListBinding.prototype.checkUpdate=function(f){if(!this.bUseExtendedChangeDetection){var l=this.oModel._getObject(this.sPath,this.oContext);if(!this.oList||!l||l.length!=this.oList.length||f){this.update();this._fireChange({reason:sap.ui.model.ChangeReason.Change})}}else{var c=false;var t=this;var l=this.oModel._getObject(this.sPath,this.oContext);if(!jQuery.sap.equal(this.oList,l)){this.update()}var C=this._getContexts(this.iLastStartIndex,this.iLastLength);if(this.aLastContexts){if(this.aLastContexts.length!=C.length){c=true}else{jQuery.each(this.aLastContexts,function(i,o){var n=C[i].getObject()[0];var O=t.oLastContextData&&t.oLastContextData[o.getPath()];if(n&&O&&!O.isEqualNode(n)){c=true;return false}})}}else{c=true}if(c||f){this._fireChange({reason:sap.ui.model.ChangeReason.Change})}}};

