/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * (c) Copyright 2009-2013 SAP AG or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
jQuery.sap.declare("sap.ui.model.xml.XMLModel");jQuery.sap.require("sap.ui.model.ClientModel");jQuery.sap.require("sap.ui.model.xml.XMLPropertyBinding");jQuery.sap.require("sap.ui.model.xml.XMLListBinding");jQuery.sap.require("sap.ui.model.xml.XMLTreeBinding");jQuery.sap.require("jquery.sap.xml");sap.ui.model.ClientModel.extend("sap.ui.model.xml.XMLModel",{constructor:function(d){sap.ui.model.ClientModel.apply(this,arguments);this.oNameSpaces=null;if(d&&d.documentElement){this.setData(d)}},metadata:{publicMethods:["setXML","getXML","setNameSpace"]}});
sap.ui.model.xml.XMLModel.prototype.setXML=function(x){var X=jQuery.sap.parseXML(x);if(X.parseError.errorCode!=0){var p=X.parseError;jQuery.sap.log.fatal("The following problem occurred: XML parse Error for "+p.url+" code: "+p.errorCode+" reason: "+p.reason+" src: "+p.srcText+" line: "+p.line+" linepos: "+p.linepos+" filepos: "+p.filepos);this.fireParseError({url:p.url,errorCode:p.errorCode,reason:p.reason,srcText:p.srcText,line:p.line,linepos:p.linepos,filepos:p.filepos})}this.setData(X)};
sap.ui.model.xml.XMLModel.prototype.getXML=function(){return jQuery.sap.serializeXML(this.oData)};
sap.ui.model.xml.XMLModel.prototype.setData=function(d){this.oData=d;this.checkUpdate()};
sap.ui.model.xml.XMLModel.prototype.loadData=function(u,p,a,t,c,h){var b=this;if(a!==false){a=true}if(!t){t="GET"}if(c===undefined){c=this.bCache}this.fireRequestSent({url:u,type:t,async:a,headers:h,info:"cache="+c});jQuery.ajax({url:u,async:a,cache:c,dataType:'xml',data:p,headers:h,type:t,success:function(d){if(!d){jQuery.sap.log.fatal("The following problem occurred: No data was retrieved by service: "+u)}b.setData(d);b.fireRequestCompleted({url:u,type:t,async:a,headers:h,info:"cache=false",success:true})},error:function(X,d,e){var E={message:d,statusCode:X.status,statusText:X.statusText,responseText:X.responseText};jQuery.sap.log.fatal("The following problem occurred: "+d,X.responseText+","+X.status+","+X.statusText);b.fireRequestCompleted({url:u,type:t,async:a,headers:h,info:"cache=false",success:false,errorobject:E});b.fireRequestFailed(E)}})};
sap.ui.model.xml.XMLModel.prototype.setNameSpace=function(n,p){if(!p){p=""}if(!this.oNameSpaces){this.oNameSpaces={}}this.oNameSpaces[p]=n};
sap.ui.model.xml.XMLModel.prototype.bindProperty=function(p,c,P){var b=new sap.ui.model.xml.XMLPropertyBinding(this,p,c,P);return b};
sap.ui.model.xml.XMLModel.prototype.bindList=function(p,c,s,f,P){var b=new sap.ui.model.xml.XMLListBinding(this,p,c,s,f,P);return b};
sap.ui.model.xml.XMLModel.prototype.bindTree=function(p,c,P){var b=new sap.ui.model.xml.XMLTreeBinding(this,p,c,P);return b};
sap.ui.model.xml.XMLModel.prototype.setProperty=function(p,v,c){var o=p.substring(0,p.lastIndexOf("/")+1),P=p.substr(p.lastIndexOf("/")+1);if(!this.resolve(p,c)){return}if(!this.oData.documentElement){jQuery.sap.log.warning("Trying to set property "+p+", but no document exists.");return}var O;if(P.indexOf("@")==0){O=this._getObject(o,c);if(O[0]){O[0].setAttribute(P.substr(1),v);this.checkUpdate()}}else{O=this._getObject(p,c);if(O[0]){jQuery(O[0]).text(v);this.checkUpdate()}}};
sap.ui.model.xml.XMLModel.prototype.getProperty=function(p,c){var r=this._getObject(p,c);if(r&&typeof r!="string"){r=jQuery(r[0]).text()}return r};
sap.ui.model.xml.XMLModel.prototype._getObject=function(p,c){var r=this.oData.documentElement;if(!r){return null}var n=this.isLegacySyntax()?[r]:[];if(c instanceof sap.ui.model.Context){n=this._getObject(c.getPath())}else if(c){n=[c]}if(!p){return n}var P=p.split("/"),s,i=0;if(!P[0]){n=r;i++}n=n.length==undefined?[n]:n;n=n[0]?n:null;while(n&&n.length>0&&P[i]){s=P[i];if(s.indexOf("@")==0){n=this._getAttribute(n[0],s.substr(1))}else if(s=="text()"){n=jQuery(n[0]).text()}else if(isNaN(s)){n=this._getChildElementsByTagName(n[0],s)}else{n=[n[s]]}i++}return n};
sap.ui.model.xml.XMLModel.prototype._getAttribute=function(n,N){if(!this.oNameSpaces||N.indexOf(":")==-1){return n.getAttribute(N)}var s=this._getNameSpace(N),l=this._getLocalName(N);if(n.getAttributeNS){return n.getAttributeNS(s,l)}else{if(!this.oDocNSPrefixes){this.oDocNSPrefixes=this._getDocNSPrefixes()}var p=this.oDocNSPrefixes[s];N=(p?p+":":"")+l;return n.getAttribute(N)}};
sap.ui.model.xml.XMLModel.prototype._getChildElementsByTagName=function(n,N){var c=n.childNodes,r=[];if(this.oNameSpaces){var s=this._getNameSpace(N),l=this._getLocalName(N),C;jQuery.each(c,function(i,o){C=o.localName||o.baseName;if(o.nodeType==1&&C==l&&o.namespaceURI==s){r.push(o)}})}else{jQuery.each(c,function(i,o){if(o.nodeType==1&&o.nodeName==N){r.push(o)}})}return r};
sap.ui.model.xml.XMLModel.prototype._getNameSpace=function(n){var c=n.indexOf(":"),p="";if(c>0){p=n.substr(0,c)}return this.oNameSpaces[p]};
sap.ui.model.xml.XMLModel.prototype._getLocalName=function(n){var c=n.indexOf(":"),l=n;if(c>0){l=n.substr(c+1)}return l};
sap.ui.model.xml.XMLModel.prototype._getDocNSPrefixes=function(){var p={},d=this.oData&&this.oData.documentElement;if(!d){return p}var a=d.attributes;jQuery.each(a,function(i,A){var n=A.name,v=A.value;if(n=="xmlns"){p[v]=""}else if(n.indexOf("xmlns")==0){p[v]=n.substr(6)}});return p};
sap.ui.model.xml.XMLModel.prototype._resolve=function(p,c){var i=!jQuery.sap.startsWith(p,"/"),r=p;if(i){if(c){r=c.getPath()+"/"+p}else{r=this.isLegacySyntax()?"/"+p:undefined}}return r};

