/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * (c) Copyright 2009-2013 SAP AG or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
jQuery.sap.declare("sap.ui.core.tmpl.DOMElement");jQuery.sap.require("sap.ui.core.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.ui.core.tmpl.DOMElement",{metadata:{publicMethods:["attr","removeAttr"],library:"sap.ui.core",properties:{"text":{type:"string",group:"Appearance",defaultValue:null},"tag":{type:"string",group:"Behavior",defaultValue:'span'}},aggregations:{"attributes":{type:"sap.ui.core.tmpl.DOMAttribute",multiple:true,singularName:"attribute"},"elements":{type:"sap.ui.core.tmpl.DOMElement",multiple:true,singularName:"element"}}}});
sap.ui.core.tmpl.DOMElement.prototype.applySettings=function(s){sap.ui.core.Control.prototype.applySettings.apply(this,arguments);var t=this,m=this.getMetadata(),j=m.getJSONKeys();jQuery.each(s,function(k,v){if(k!=="id"&&k!=="text"&&!j[k]&&typeof v==="string"){t.attr(k,v)}})};
sap.ui.core.tmpl.DOMElement.prototype.exit=sap.ui.core.tmpl.DOMElement.prototype.onBeforeRendering=function(){var t=this.getTag().toLowerCase();if(t==="input"||t==="textarea"||t==="select"){this.$().off("change")}};
sap.ui.core.tmpl.DOMElement.prototype.onAfterRendering=function(){var t=this.getTag().toLowerCase();if(t==="input"||t==="textarea"||t==="select"){this.$().on("change",jQuery.proxy(this.oninputchange,this))}};
sap.ui.core.tmpl.DOMElement.prototype.oninputchange=function(e){var t=this.getTag().toLowerCase();if(t==="input"){var v=this.$().val();jQuery.each(this.getAttributes(),function(i,a){if(a.getName().toLowerCase()==="value"){a.setValue(v)}})}else if(t==="textarea"){var T=this.$().val();this.setText(T)}else if(t==="select"){var T="";this.$().find("select option:selected").each(function(){T+=jQuery(this).text()+" "});this.setText(T)}};
sap.ui.core.tmpl.DOMElement.prototype.attr=function(k,v){var a=this.getAttributes(),A;jQuery.each(a,function(i,V){var n=V.getName();if(n.toLowerCase()===k){A=V;return false}});if(v===undefined){return A&&A.getValue()}else{if(A){if(v===null){this.removeAttribute(A)}else{A.setValue(v)}}else{if(v!==null){this.addAttribute(new sap.ui.core.tmpl.DOMAttribute({name:k,value:v}))}}return this}};
sap.ui.core.tmpl.DOMElement.prototype.removeAttr=function(k){this.attr(k,null);return this};
sap.ui.core.tmpl.DOMElement.prototype.setText=function(t){this.setProperty("text",t,true);var $=this.$();if($.length>0){var T=this.getTag().toLowerCase();if(T==="textarea"){$.val(this.getProperty("text"))}else{$.text(this.getProperty("text"))}}};

