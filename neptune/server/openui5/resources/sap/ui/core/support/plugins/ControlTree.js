/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * (c) Copyright 2009-2013 SAP AG or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
jQuery.sap.declare("sap.ui.core.support.plugins.ControlTree");jQuery.sap.require("sap.ui.core.support.Plugin");jQuery.sap.require("sap.ui.thirdparty.jszip");jQuery.sap.require("sap.ui.core.util.serializer.ViewSerializer");(function($){sap.ui.core.support.Plugin.extend("sap.ui.core.support.plugins.ControlTree",{constructor:function(s){sap.ui.core.support.Plugin.apply(this,["sapUiSupportControlTree","Control Tree",s]);this._oStub=s;if(this.isToolPlugin()){this._aEventIds=["sapUiSupportSelectorSelect",this.getId()+"ReceiveControlTree",this.getId()+"ReceiveControlTreeExport",this.getId()+"ReceiveControlTreeExportError",this.getId()+"TriggerRequestProperties",this.getId()+"ReceiveProperties",this.getId()+"ReceiveBindingInfos",this.getId()+"ReceiveMethods",this.getId()+"ReceivePropertiesMethods"];this._breakpointId="sapUiSupportBreakpoint";this._tab={properties:"Properties",bindinginfos:"BindingInfos",breakpoints:"Breakpoints",exports:"Export"};this._currentTab=this._tab.properties}else{this._aEventIds=[this.getId()+"RequestControlTree",this.getId()+"RequestControlTreeSerialize",this.getId()+"RequestProperties",this.getId()+"RequestBindingInfos",this.getId()+"ChangeProperty",this.getId()+"RefreshBinding"];var t=this;sap.ui.getCore().registerPlugin({startPlugin:function(c){t.oCore=c},stopPlugin:function(){t.oCore=undefined}})}}});sap.ui.core.support.plugins.ControlTree.prototype.init=function(s){sap.ui.core.support.Plugin.prototype.init.apply(this,arguments);if(this.isToolPlugin()){a.call(this,s)}else{b.call(this,s)}};function a(s){$(document).on("click","li img.sapUiControlTreeIcon",$.proxy(this._onIconClick,this)).on("click","li.sapUiControlTreeElement div",$.proxy(this._onNodeClick,this)).on("click","li.sapUiControlTreeLink div",$.proxy(this._onControlTreeLinkClick,this)).on("click","#sapUiSupportControlTabProperties",$.proxy(this._onPropertiesTab,this)).on("click","#sapUiSupportControlTabBindingInfos",$.proxy(this._onBindingInfosTab,this)).on("click","#sapUiSupportControlTabBreakpoints",$.proxy(this._onMethodsTab,this)).on("click","#sapUiSupportControlTabExport",$.proxy(this._onExportTab,this)).on("change","[data-sap-ui-name]",$.proxy(this._onPropertyChange,this)).on("change","[data-sap-ui-method]",$.proxy(this._onPropertyBreakpointChange,this)).on("keyup",'.sapUiSupportControlMethods input[type="text"]',$.proxy(this._autoComplete,this)).on("blur",'.sapUiSupportControlMethods input[type="text"]',$.proxy(this._updateSelectOptions,this)).on("change",'.sapUiSupportControlMethods select',$.proxy(this._selectOptionsChanged,this)).on("click",'#sapUiSupportControlAddBreakPoint',$.proxy(this._onAddBreakpointClicked,this)).on("click",'#sapUiSupportControlExportToXml',$.proxy(this._onExportToXmlClicked,this)).on("click",'#sapUiSupportControlExportToHtml',$.proxy(this._onExportToHtmlClicked,this)).on("click",'#sapUiSupportControlActiveBreakpoints img.remove-breakpoint',$.proxy(this._onRemoveBreakpointClicked,this)).on("click",'#sapUiSupportControlPropertiesArea a.control-tree',$.proxy(this._onNavToControl,this)).on("click",'#sapUiSupportControlPropertiesArea img.sapUiSupportRefreshBinding',$.proxy(this._onRefreshBinding,this));this.renderContentAreas()};sap.ui.core.support.plugins.ControlTree.prototype.exit=function(s){sap.ui.core.support.Plugin.prototype.exit.apply(this,arguments);if(this.isToolPlugin()){$(document).off('click','li img.sapUiControlTreeIcon').off('click','li div').off("click","li.sapUiControlTreeLink").off("click","#sapUiSupportControlTabProperties").off("click","#sapUiSupportControlTabBindings").off("click","#sapUiSupportControlTabBreakpoints").off("click","#sapUiSupportControlTabExport").off('change','[data-sap-ui-name]').off('change','[data-sap-ui-method]').off('keyup','.sapUiSupportControlMethods input[type="text"]').off('blur','.sapUiSupportControlMethods select').off('change','.sapUiSupportControlMethods select').off('click','#sapUiSupportControlAddBreakPoint').off('click','#sapUiSupportControlExportToXml').off('click','#sapUiSupportControlExportToHtml').off('click','#sapUiSupportControlActiveBreakpoints img.remove-breakpoint').off('click','#sapUiSupportControlPropertiesArea a.control-tree').off('click','#sapUiSupportControlPropertiesArea img.sapUiSupportRefreshBinding')}};sap.ui.core.support.plugins.ControlTree.prototype.renderContentAreas=function(){var r=sap.ui.getCore().createRenderManager();r.write('<div id="sapUiSupportControlTreeArea"><ul class="sapUiSupportControlTreeList"></ul></div>');r.write('<div id="sapUiSupportControlTabs" style="visibility:hidden">');r.write('<button id="sapUiSupportControlTabProperties" class="sapUiSupportBtn">Properties</button>');r.write('<button id="sapUiSupportControlTabBindingInfos" class="sapUiSupportBtn">Binding Infos</button>');r.write('<button id="sapUiSupportControlTabBreakpoints" class="sapUiSupportBtn">Breakpoints</button>');r.write('<button id="sapUiSupportControlTabExport" class="sapUiSupportBtn">Export</button>');r.write('</div>');r.write('<div id="sapUiSupportControlPropertiesArea"></div>');r.flush(this.$().get(0));r.destroy()};sap.ui.core.support.plugins.ControlTree.prototype.renderControlTree=function(c){var r=sap.ui.getCore().createRenderManager();function d(i,e){var h=e.aggregation.length>0||e.association.length>0;r.write("<li id=\"sap-debug-controltree-"+e.id+"\" class=\"sapUiControlTreeElement\">");var I=h?"minus":"space";r.write("<img class=\"sapUiControlTreeIcon\" style=\"height: 12px; width: 12px;\" src=\"../../../../testsuite/images/"+I+".gif\" />");var p=e.library.replace(/\./g,"/")+"/images/controls/"+e.type+".gif";if(e.isAssociation){r.write("<img title=\"Association\" class=\"sapUiControlTreeIcon\" style=\"height: 12px; width: 12px;\" src=\"../../../../testsuite/images/link.gif\" />")}r.write("<img class=\"sapUiControlPicture\" style=\"height: 16px; width: 16px;\" src=\"../../../../../test-resources/"+p+"\" />");var C=e.type.lastIndexOf(".")>0?e.type.substring(e.type.lastIndexOf(".")+1):e.type;r.write('<div>');r.write('<span class="name" title="'+e.type+'">'+C+' - '+e.id+'</span>');r.write('<span class="sapUiSupportControlTreeBreakpointCount" title="Number of active breakpoints / methods" style="display:none;"></span>');r.write('</div>');if(e.aggregation.length>0){r.write("<ul>");$.each(e.aggregation,d);r.write("</ul>")}if(e.association.length>0){r.write("<ul>");$.each(e.association,function(i,v){if(typeof(v)==="string"){r.write("<li data-sap-ui-controlid=\""+v+"\" class=\"sapUiControlTreeLink\">");r.write("<img class=\"sapUiControlTreeIcon\" style=\"height: 12px; width: 12px;\" align=\"middle\" src=\"../../../../testsuite/images/space.gif\" />");r.write("<img class=\"sapUiControlTreeIcon\" style=\"height: 12px; width: 12px;\" align=\"middle\" src=\"../../../../testsuite/images/link.gif\" />");r.write("<div><span title='Association to \""+v+"\"'>"+v+"</span></div>");r.write("</li>")}else{d(0,v)}});r.write("</ul>")}r.write("</li>")};$.each(c,d);r.flush(this.$().find("#sapUiSupportControlTreeArea > ul.sapUiSupportControlTreeList").get(0));r.destroy()};sap.ui.core.support.plugins.ControlTree.prototype.renderPropertiesTab=function(c,C){var r=sap.ui.getCore().createRenderManager();r.write('<ul class="sapUiSupportControlTreeList" data-sap-ui-controlid="'+C+'">');$.each(c,function(i,v){r.write("<li>");r.write("<span><label class='sapUiSupportLabel'>BaseType:</label> <code>"+v.control+"</code></span>");if(v.properties.length>0||v.aggregations.length>0){r.write('<div class="get" title="Activate debugger for get-method">G</div><div class="set" title="Activate debugger for set-method">S</div>');r.write("<div class=\"sapUiSupportControlProperties\"><table><colgroup><col width=\"50%\"/><col width=\"50%\"/></colgroup>");$.each(v.properties,function(i,p){r.write("<tr><td>");r.write("<label class='sapUiSupportLabel'>"+p.name+((p.isBound)?'<img title="Value is bound (see Binding Infos)" src="../../../../../resources/testsuite/images/link.gif" style="vertical-align:middle;margin-left:3px">':"")+"</label>");r.write("</td><td>");if(p.type==="boolean"){r.write("<input type='checkbox' ");r.write("data-sap-ui-name='"+p.name+"' ");if(p.value==true){r.write("checked='checked'")}r.write("/>")}else if(p.enumValues){r.write("<div><select ");r.write("data-sap-ui-name='"+p.name+"'>");$.each(p.enumValues,function(k,V){r.write("<option>");r.writeEscaped(k);r.write("</option>")});r.write("</select></div>")}else{r.write("<div><input type='text' ");r.write("data-sap-ui-name='"+p.name+"' ");if(p.value){r.write("value='");r.writeEscaped(""+p.value);r.write("'")}r.write("/></div>")}r.write("</td>");r.write('<td><input type="checkbox" data-sap-ui-method="'+p._sGetter+'" title="Activate debugger for '+p._sGetter+'"');if(p.bp_sGetter){r.write("checked='checked'")}r.write('/></td>');r.write('<td><input type="checkbox" data-sap-ui-method="'+p._sMutator+'" title="Activate debugger for '+p._sMutator+'"');if(p.bp_sMutator){r.write("checked='checked'")}r.write('/></td>');r.write("</tr>")});$.each(v.aggregations,function(i,A){r.write("<tr><td>");r.write("<label class='sapUiSupportLabel'>"+A.name+"</label>");r.write("</td><td>");r.write($.sap.encodeHTML(""+A.value));r.write("</td>");r.write('<td><input type="checkbox" data-sap-ui-method="'+A._sGetter+'" title="Activate debugger for '+A._sGetter+'"');if(A.bp_sGetter){r.write("checked='checked'")}r.write('/></td>');r.write('<td><input type="checkbox" data-sap-ui-method="'+A._sMutator+'" title="Activate debugger for '+A._sMutator+'"');if(A.bp_sMutator){r.write("checked='checked'")}r.write('/></td>');r.write("</tr>")});r.write("</table></div>")}r.write("</li>")});r.write("</ul>");r.flush(this.$().find("#sapUiSupportControlPropertiesArea").get(0));r.destroy();this.$().find("#sapUiSupportControlTabs").css("visibility","");this.selectTab(this._tab.properties)};sap.ui.core.support.plugins.ControlTree.prototype.renderBindingsTab=function(B,c){var r=sap.ui.getCore().createRenderManager();if(B.contexts.length>0){r.write('<h2 style="padding-left:5px">Contexts</h2>');r.write('<ul class="sapUiSupportControlTreeList" data-sap-ui-controlid="'+c+'">');$.each(B.contexts,function(C,o){r.write('<li>');r.write('<span><label class="sapUiSupportLabel">Model Name: '+o.modelName+'</label></span>');r.write('<div class="sapUiSupportControlProperties">');r.write('<table><colgroup><col width="15%"><col width="35%"><col width="50%"></colgroup>');r.write('<tbody>');r.write('<tr><td colspan="2">');r.write('<label class="sapUiSupportLabel">Path</label>');r.write('</td><td>');r.write('<div><span');if(o.invalidPath){r.write(' style="color:red"')}r.write('>'+o.path);if(o.invalidPath){r.write(' (invalid)')}r.write('</span></div>');r.write('</td></tr>');if(o.location){r.write('<tr><td colspan="2">');r.write('<label class="sapUiSupportLabel">Inherited from</label>');r.write('</td><td>');r.write('<div><a class="control-tree sapUiSupportLink" title="'+o.location.name+'" data-sap-ui-control-id="'+o.location.id+'" href="javascript:void(0);">'+o.location.name.substring(o.location.name.lastIndexOf(".")+1)+' ('+o.location.id+')</a></div>');r.write('</td></tr>')}r.write('</tbody></table></div></li>')});r.write('</ul>')}if(B.bindings.length>0){r.write('<h2 style="padding-left:5px">Bindings</h2>');r.write('<ul class="sapUiSupportControlTreeList" data-sap-ui-controlid="'+c+'">');$.each(B.bindings,function(i,o){r.write('<li data-sap-ui-binding-name="'+o.name+'">');r.write('<span>');r.write('<label class="sapUiSupportLabel" style="vertical-align: middle">'+o.name+'</label>');r.write('<img class="sapUiSupportRefreshBinding" title="Refresh Binding" '+'src="../../../../../resources/testsuite/images/refresh.gif" style="cursor:pointer;margin-left:5px;vertical-align:middle">');r.write('</span>');$.each(o.bindings,function(d,e){r.write('<div class="sapUiSupportControlProperties">');r.write('<table><colgroup><col width="15%"><col width="35%"><col width="50%"></colgroup>');r.write('<tbody>');r.write('<tr><td colspan="2">');r.write('<label class="sapUiSupportLabel">Path</label>');r.write('</td><td>');r.write('<div><span');if(e.invalidPath){r.write(' style="color:red"')}r.write('>'+e.path);if(e.invalidPath){r.write(' (invalid)')}r.write('</span></div>');r.write('</td></tr>');r.write('<tr><td colspan="2">');r.write('<label class="sapUiSupportLabel">Absolute Path</label>');r.write('</td><td>');if(typeof e.absolutePath!=='undefined'){r.write('<div>'+e.absolutePath+'</div>')}else{r.write('<div>No binding</div>')}r.write('</td></tr>');r.write('<tr><td colspan="2">');r.write('<label class="sapUiSupportLabel">Relative</label>');r.write('</td><td>');if(typeof e.isRelative!=='undefined'){r.write('<div>'+e.isRelative+'</div>')}else{r.write('<div>No binding</div>')}r.write('</td></tr>');r.write('<tr><td colspan="2">');r.write('<label class="sapUiSupportLabel">Binding Type</label>');r.write('</td><td>');if(!o.type){r.write('<div>No binding</div>')}else{r.write('<div title="'+o.type+'">'+o.type.substring(o.type.lastIndexOf(".")+1)+'</div>')}r.write('</td></tr>');if(e.mode){r.write('<tr><td colspan="2">');r.write('<label class="sapUiSupportLabel">Binding Mode</label>');r.write('</td><td>');r.write('<div>'+e.mode+'</div>');r.write('</td></tr>')}r.write('<tr><td>');r.write('<label class="sapUiSupportLabel">Model</label>');r.write('</td><td>');r.write('<label class="sapUiSupportLabel">Name</label>');r.write('</td><td>');if(e.model&&e.model.name){r.write('<div>'+e.model.name+'</div>')}else{r.write('<div>No binding</div>')}r.write('</td></tr>');r.write('<tr><td>');r.write('</td><td>');r.write('<label class="sapUiSupportLabel">Type</label>');r.write('</td><td>');if(e.model&&e.model.type){r.write('<div><span title="'+e.model.type+'">'+e.model.type.substring(e.model.type.lastIndexOf(".")+1)+'</span></div>')}else{r.write('<div><span>No binding</span></div>')}r.write('</td></tr>');r.write('<tr><td>');r.write('</td><td>');r.write('<label class="sapUiSupportLabel">Default Binding Mode</label>');r.write('</td><td>');if(e.model&&e.model.bindingMode){r.write('<div><span>'+e.model.bindingMode+'</span></div>')}else{r.write('<div><span>No binding</span></div>')}r.write('</td></tr>');r.write('<tr><td>');r.write('</td><td>');r.write('<label class="sapUiSupportLabel">Location</label>');r.write('</td><td>');if(e.model&&e.model.location&&e.model.location.type){if(e.model.location.type==='control'){r.write('<div><a class="control-tree sapUiSupportLink" title="'+e.model.location.name+'" data-sap-ui-control-id="'+e.model.location.id+'" href="javascript:void(0);">'+e.model.location.name.substring(e.model.location.name.lastIndexOf(".")+1)+' ('+e.model.location.id+')</a></div>')}else{r.write('<div><span title="sap.ui.getCore()">Core</span></div>')}}else{r.write('<div><span>No binding</span></div>')}r.write('</td></tr>');r.write('</tbody></table></div>')});r.write('</li>')});r.write('</ul>')}r.flush(this.$().find("#sapUiSupportControlPropertiesArea").get(0));r.destroy()};sap.ui.core.support.plugins.ControlTree.prototype.renderBreakpointsTab=function(m,c){var r=sap.ui.getCore().createRenderManager();r.write('<div class="sapUiSupportControlMethods" data-sap-ui-controlid="'+c+'">');r.write('<select id="sapUiSupportControlMethodsSelect" class="sapUiSupportAutocomplete"><option></option>');$.each(m,function(i,v){if(!v.active)r.write('<option>'+v.name+'</option>')});r.write('</select>');r.write('<input class="sapUiSupportControlBreakpointInput sapUiSupportAutocomplete" type="text"/>');r.write('<button id="sapUiSupportControlAddBreakPoint" class="sapUiSupportBtn">Add breakpoint</button>');r.write('<hr class="no-border"/><ul id="sapUiSupportControlActiveBreakpoints" class="sapUiSupportList sapUiSupportBreakpointList">');$.each(m,function(i,v){if(!v.active)return;r.write('<li><span>'+v.name+'</span>'+'<img class="remove-breakpoint" style="cursor:pointer;margin-left:5px" '+'src="../../../../testsuite/images/delete.gif"></li>')});r.write('</ul></div>');r.flush(this.$().find("#sapUiSupportControlPropertiesArea").get(0));r.destroy();this.selectTab(this._tab.breakpoints);this.$().find('.sapUiSupportControlBreakpointInput').focus()};sap.ui.core.support.plugins.ControlTree.prototype.renderExportTab=function(){var r=sap.ui.getCore().createRenderManager();r.write('<button id="sapUiSupportControlExportToXml" class="sapUiSupportBtn">Export To XML</button>');r.write('<br><br>');r.write('<button id="sapUiSupportControlExportToHtml" class="sapUiSupportBtn">Export To HTML</button>');r.flush(this.$().find("#sapUiSupportControlPropertiesArea").get(0));r.destroy();this.selectTab(this._tab.exports)};sap.ui.core.support.plugins.ControlTree.prototype.requestProperties=function(c){this._oStub.sendEvent(this._breakpointId+"RequestInstanceMethods",{controlId:c,callback:this.getId()+"ReceivePropertiesMethods"})};sap.ui.core.support.plugins.ControlTree.prototype.updateBreakpointCount=function(c,B){var d=$("#sap-debug-controltree-"+c+" > div span.sapUiSupportControlTreeBreakpointCount");if(B.active>0){d.text(B.active+" / "+B.all).show()}else{d.text("").hide()}};sap.ui.core.support.plugins.ControlTree.prototype.onsapUiSupportControlTreeTriggerRequestProperties=function(e){this.requestProperties(e.getParameter("controlId"))};sap.ui.core.support.plugins.ControlTree.prototype.onsapUiSupportControlTreeReceivePropertiesMethods=function(e){var c=e.getParameter("controlId");this._oStub.sendEvent(this.getId()+"RequestProperties",{id:c,breakpointMethods:e.getParameter("methods")});this.updateBreakpointCount(c,JSON.parse(e.getParameter("breakpointCount")))};sap.ui.core.support.plugins.ControlTree.prototype.onsapUiSupportControlTreeReceiveControlTree=function(e){this.renderControlTree(JSON.parse(e.getParameter("controlTree")))};sap.ui.core.support.plugins.ControlTree.prototype.onsapUiSupportControlTreeReceiveControlTreeExportError=function(e){var E=e.getParameter("errorMessage");this._drawAlert(E)};sap.ui.core.support.plugins.ControlTree.prototype._drawAlert=function(e){alert("ERROR: The selected element cannot not be exported.\nPlease choose an other one.\n\nReason:\n"+e)};sap.ui.core.support.plugins.ControlTree.prototype.onsapUiSupportControlTreeReceiveControlTreeExport=function(e){var z=undefined;var v=JSON.parse(e.getParameter("serializedViews"));var t=e.getParameter("sType");if(!$.isEmptyObject(v)){z=new JSZip();for(var V in v){var d=v[V];z.file(V.replace(/\./g,'/')+".view."+t.toLowerCase(),d)}}if(z){var c=z.generate({base64:true});var r=window.atob(c);var u=new Uint8Array(r.length);for(var i=0;i<u.length;++i){u[i]=r.charCodeAt(i)}var f=new Blob([u],{type:'application/zip'});var g=document.createEvent("HTMLEvents");g.initEvent("click");$("<a>",{download:t.toUpperCase()+"Export.zip",href:window.URL.createObjectURL(f)}).get(0).dispatchEvent(g)}};sap.ui.core.support.plugins.ControlTree.prototype.onsapUiSupportSelectorSelect=function(e){this.selectControl(e.getParameter("id"))};sap.ui.core.support.plugins.ControlTree.prototype.onsapUiSupportControlTreeReceiveProperties=function(e){this.renderPropertiesTab(JSON.parse(e.getParameter("properties")),e.getParameter("id"))};sap.ui.core.support.plugins.ControlTree.prototype.onsapUiSupportControlTreeReceiveBindingInfos=function(e){this.renderBindingsTab(JSON.parse(e.getParameter("bindinginfos")),e.getParameter("id"))};sap.ui.core.support.plugins.ControlTree.prototype.onsapUiSupportControlTreeReceiveMethods=function(e){var c=e.getParameter("controlId");this.renderBreakpointsTab(JSON.parse(e.getParameter("methods")),c);this.updateBreakpointCount(c,JSON.parse(e.getParameter("breakpointCount")))};sap.ui.core.support.plugins.ControlTree.prototype._onNodeClick=function(e){var c=$(e.target);var d=c.closest("li");if(d.hasClass("sapUiControlTreeElement")){$(".sapUiControlTreeElement > div").removeClass("sapUiSupportControlTreeSelected");d.children("div").addClass("sapUiSupportControlTreeSelected");this._oStub.sendEvent("sapUiSupportSelectorHighlight",{id:d.attr("id").substring("sap-debug-controltree-".length)});var i=d.attr("id").substring("sap-debug-controltree-".length);if(c.hasClass("sapUiSupportControlTreeBreakpointCount")){this._currentTab=this._tab.breakpoints}this.onAfterControlSelected(i)}e.stopPropagation()};sap.ui.core.support.plugins.ControlTree.prototype._onIconClick=function(e){var c=$(e.target);if(c.parent().attr("data-sap-ui-collapsed")){c.attr("src",c.attr("src").replace("plus","minus")).parent().removeAttr("data-sap-ui-collapsed");c.siblings("ul").show()}else{c.attr("src",c.attr("src").replace("minus","plus")).parent().attr("data-sap-ui-collapsed","true");c.siblings("ul").hide()}if(e.stopPropagation){e.stopPropagation()}};sap.ui.core.support.plugins.ControlTree.prototype._onControlTreeLinkClick=function(e){this.selectControl($(e.target).closest("li").attr("data-sap-ui-controlid"))};sap.ui.core.support.plugins.ControlTree.prototype._onPropertiesTab=function(e){if(this.selectTab(this._tab.properties)){this.requestProperties(this.getSelectedControlId())}};sap.ui.core.support.plugins.ControlTree.prototype._onBindingInfosTab=function(e){if(this.selectTab(this._tab.bindinginfos)){this._oStub.sendEvent(this.getId()+"RequestBindingInfos",{id:this.getSelectedControlId()})}};sap.ui.core.support.plugins.ControlTree.prototype._onMethodsTab=function(e){if(this.selectTab(this._tab.breakpoints)){this._oStub.sendEvent(this._breakpointId+"RequestInstanceMethods",{controlId:this.getSelectedControlId(),callback:this.getId()+"ReceiveMethods"})}};sap.ui.core.support.plugins.ControlTree.prototype._onExportTab=function(e){if(this.selectTab(this._tab.exports)){this.renderExportTab()}};sap.ui.core.support.plugins.ControlTree.prototype._autoComplete=function(e){if(e.keyCode==jQuery.sap.KeyCodes.ENTER){this._updateSelectOptions(e);this._onAddBreakpointClicked()}if(e.keyCode>=jQuery.sap.KeyCodes.ARROW_LEFT&&e.keyCode<=jQuery.sap.KeyCodes.ARROW_DOWN)return;var c=$(e.target),d=c.prev("select"),I=c.val();if(I=="")return;var o=d.find("option").map(function(){return $(this).val()}).get();var O;for(var i=0;i<o.length;i++){O=o[i];if(O.toUpperCase().indexOf(I.toUpperCase())==0){var C=c.cursorPos();if(e.keyCode==jQuery.sap.KeyCodes.BACKSPACE){C--}c.val(O);c.selectText(C,O.length);break}}return};sap.ui.core.support.plugins.ControlTree.prototype._updateSelectOptions=function(e){var s=e.target;if(s.tagName=="INPUT"){var v=s.value;s=s.previousSibling;var o=s.options;for(var i=0;i<o.length;i++){var t=o[i].value||o[i].text;if(t.toUpperCase()==v.toUpperCase()){s.selectedIndex=i;break}}}var c=s.selectedIndex;var C=s.options[c].value||s.options[c].text;if(s.nextSibling&&s.nextSibling.tagName=="INPUT"){s.nextSibling.value=C}};sap.ui.core.support.plugins.ControlTree.prototype._onAddBreakpointClicked=function(e){var c=this.$().find("#sapUiSupportControlMethodsSelect");this._oStub.sendEvent(this._breakpointId+"ChangeInstanceBreakpoint",{controlId:c.closest("[data-sap-ui-controlid]").attr("data-sap-ui-controlid"),methodName:c.val(),active:true,callback:this.getId()+"ReceiveMethods"})};sap.ui.core.support.plugins.ControlTree.prototype._onExportToXmlClicked=function(e){this._startSerializing("XML")};sap.ui.core.support.plugins.ControlTree.prototype._onExportToHtmlClicked=function(e){this._startSerializing("HTML")};sap.ui.core.support.plugins.ControlTree.prototype._startSerializing=function(t){var s=this.getSelectedControlId();if(s){this._oStub.sendEvent(this.getId()+"RequestControlTreeSerialize",{controlID:s,sType:t})}else{this._drawAlert("Nothing to export. Please select an item in the control tree.")}};sap.ui.core.support.plugins.ControlTree.prototype._onRemoveBreakpointClicked=function(e){var c=$(e.target);this._oStub.sendEvent(this._breakpointId+"ChangeInstanceBreakpoint",{controlId:c.closest("[data-sap-ui-controlid]").attr("data-sap-ui-controlid"),methodName:c.siblings('span').text(),active:false,callback:this.getId()+"ReceiveMethods"})};sap.ui.core.support.plugins.ControlTree.prototype._selectOptionsChanged=function(e){var s=e.target;var i=s.nextSibling;i.value=s.options[s.selectedIndex].value};sap.ui.core.support.plugins.ControlTree.prototype._onPropertyChange=function(e){var s=e.target;var c=$(s);var i=c.closest("[data-sap-ui-controlid]").attr("data-sap-ui-controlid");var v=c.val();if(c.attr("type")==="checkbox"){v=""+c.is(":checked")}this._oStub.sendEvent(this.getId()+"ChangeProperty",{id:i,name:c.attr("data-sap-ui-name"),value:v})};sap.ui.core.support.plugins.ControlTree.prototype._onPropertyBreakpointChange=function(e){var c=$(e.target);this._oStub.sendEvent(this._breakpointId+"ChangeInstanceBreakpoint",{controlId:c.closest("[data-sap-ui-controlid]").attr("data-sap-ui-controlid"),methodName:c.attr("data-sap-ui-method"),active:c.is(":checked"),callback:this.getId()+"TriggerRequestProperties"})};sap.ui.core.support.plugins.ControlTree.prototype._onNavToControl=function(e){var c=$(e.target);var i=c.attr("data-sap-ui-control-id");if(i!==this.getSelectedControlId()){this.selectControl(i)}};sap.ui.core.support.plugins.ControlTree.prototype._onRefreshBinding=function(e){var c=$(e.target);var i=c.closest("[data-sap-ui-controlid]").attr("data-sap-ui-controlid");var n=c.closest("[data-sap-ui-binding-name]").attr("data-sap-ui-binding-name");this._oStub.sendEvent(this.getId()+"RefreshBinding",{id:i,name:n})};sap.ui.core.support.plugins.ControlTree.prototype.selectTab=function(t){var c=this.$().find("#sapUiSupportControlTab"+t);if(c.hasClass("active"))return false;this.$().find("#sapUiSupportControlTabs button").removeClass("active");c.addClass("active");this._currentTab=t;return true};sap.ui.core.support.Plugin.prototype.getSelectedControlId=function(){var c=this.$().find(".sapUiSupportControlTreeSelected");if(c.length===0){return undefined}else{return c.parent().attr("id").substring("sap-debug-controltree-".length)}};sap.ui.core.support.plugins.ControlTree.prototype.selectControl=function(c){if(!c){return}$(".sapUiControlTreeElement > div").removeClass("sapUiSupportControlTreeSelected");var t=this;$.sap.byId("sap-debug-controltree-"+c).parents("[data-sap-ui-collapsed]").each(function(i,v){t._onIconClick({target:$(v).find("img:first").get(0)})});var p=$.sap.byId("sap-debug-controltree-"+c).children("div").addClass("sapUiSupportControlTreeSelected").position();var s=this.$().find("#sapUiSupportControlTreeArea").scrollTop();this.$().find("#sapUiSupportControlTreeArea").scrollTop(s+p.top);this.onAfterControlSelected(c)};sap.ui.core.support.plugins.ControlTree.prototype.onAfterControlSelected=function(i){if(this._currentTab==this._tab.properties){this.requestProperties(i)}else if(this._currentTab==this._tab.breakpoints){this._oStub.sendEvent(this._breakpointId+"RequestInstanceMethods",{controlId:i,callback:this.getId()+"ReceiveMethods"})}else if(this._currentTab==this._tab.bindinginfos){this._oStub.sendEvent(this.getId()+"RequestBindingInfos",{id:this.getSelectedControlId()})}};function b(s){this.onsapUiSupportControlTreeRequestControlTree()};sap.ui.core.support.plugins.ControlTree.prototype.onsapUiSupportControlTreeRequestControlTree=function(e){this._oStub.sendEvent(this.getId()+"ReceiveControlTree",{controlTree:JSON.stringify(this.getControlTree())})};sap.ui.core.support.plugins.ControlTree.prototype.onsapUiSupportControlTreeRequestControlTreeSerialize=function(e){var c=sap.ui.getCore().byId(e.getParameter("controlID"));var t=e.getParameter("sType");var v=undefined;var V=undefined;sap.ui.controller(t+"ViewController",{});sap.ui.jsview(t+"ViewExported",{getControllerName:function(){return t+"ViewController"},createContent:function(g){}});sap.ui.controller(t+"ViewController",{});sap.ui.jsview(t+"ViewExported",{getControllerName:function(){return t+"ViewController"},createContent:function(g){}});try{if(c){var p=c.getParent();var d=undefined;d=p.indexOfContent(c);if(c instanceof sap.ui.core.mvc.View){v=new sap.ui.core.util.serializer.ViewSerializer(c,window,"sap.m")}else{var o=sap.ui.jsview(t+"ViewExported");o.addContent(c);v=new sap.ui.core.util.serializer.ViewSerializer(o,window,"sap.m")}V=(t&&t!=="XML")?v.serializeToHTML():v.serializeToXML();if(d){p.insertContent(c,d)}else{p.addContent(c)}}else{var u=sap.ui.getCore().getUIArea(e.getParameter("controlID"));var o=sap.ui.jsview(t+"ViewExported");var C=u.getContent();for(var i=0;i<C.length;i++){o.addContent(C[i])}v=new sap.ui.core.util.serializer.ViewSerializer(o,window,"sap.m");V=(t&&t!=="XML")?v.serializeToHTML():v.serializeToXML();for(var i=0;i<C.length;i++){u.addContent(C[i])}}if(v){this._oStub.sendEvent(this.getId()+"ReceiveControlTreeExport",{serializedViews:JSON.stringify(V),sType:t})}}catch(f){this._oStub.sendEvent(this.getId()+"ReceiveControlTreeExportError",{errorMessage:f.message})}};sap.ui.core.support.plugins.ControlTree.prototype.onsapUiSupportControlTreeRequestProperties=function(e){var c=JSON.parse(e.getParameter("breakpointMethods"));var C=this.getControlProperties(e.getParameter("id"),c);this._oStub.sendEvent(this.getId()+"ReceiveProperties",{id:e.getParameter("id"),properties:JSON.stringify(C)})};sap.ui.core.support.plugins.ControlTree.prototype.onsapUiSupportControlTreeChangeProperty=function(e){var i=e.getParameter("id");var c=sap.ui.getCore().byId(i);if(c){var n=e.getParameter("name");var v=e.getParameter("value");var m=c.getMetadata();m.getJSONKeys();var p=c.getMetadata().getAllProperties()[n];if(p&&p.type){var t=sap.ui.base.DataType.getType(p.type);if(t instanceof sap.ui.base.DataType){var V=t.parseValue(v);if(t.isValid(V)&&V!=="(null)"){c[p._sMutator](V)}}else if(t){if(t[v]){c[p._sMutator](v)}}}}};sap.ui.core.support.plugins.ControlTree.prototype.onsapUiSupportControlTreeRequestBindingInfos=function(e){var i=e.getParameter("id");this._oStub.sendEvent(this.getId()+"ReceiveBindingInfos",{id:i,bindinginfos:JSON.stringify(this.getControlBindingInfos(i))})};sap.ui.core.support.plugins.ControlTree.prototype.onsapUiSupportControlTreeRefreshBinding=function(e){var i=e.getParameter("id");var B=e.getParameter("name");this.refreshBinding(i,B);this._oStub.sendEvent(this.getId()+"ReceiveBindingInfos",{id:i,bindinginfos:JSON.stringify(this.getControlBindingInfos(i))})};sap.ui.core.support.plugins.ControlTree.prototype.getControlTree=function(){var c=[],A={};function s(e){var E={id:e.getId(),type:"",aggregation:[],association:[]};A[E.id]=E.id;if(e instanceof sap.ui.core.UIArea){E.library="sap.ui.core";E.type="sap.ui.core.UIArea";$.each(e.getContent(),function(I,e){var C=s(e);E.aggregation.push(C)})}else{E.library=e.getMetadata().getLibraryName();if(e.getMetadata().getStereotype()==="control"){E.type=e.getMetadata().getElementName()}else if(e.getMetadata().getStereotype()==="component"){E.type=e.getMetadata().getName()}if(e.mAggregations){for(var f in e.mAggregations){var o=e.mAggregations[f];if(o){var g=$.isArray(o)?o:[o];$.each(g,function(I,v){if(v instanceof sap.ui.core.Element){var C=s(v);E.aggregation.push(C)}})}}}if(e.mAssociations){for(var h in e.mAssociations){var i=e.mAssociations[h];if(i){var j=$.isArray(i)?i:[i];$.each(j,function(I,v){E.association.push(v)})}}}}return E};$.each(this.oCore.mUIAreas,function(i,u){var e=s(u);c.push(e)});function d(I,e){for(var i=0;i<e.association.length;i++){var f=e.association[i];if(!A[f]){e.association[i]=s(sap.ui.getCore().byId(f)||sap.ui.getCore().getComponent(f));e.association[i].isAssociation=true;d(0,e.association[i])}}$.each(e.aggregation,d)}$.each(c,d);return c};sap.ui.core.support.plugins.ControlTree.prototype.getControlProperties=function(i,m){var p=/^((boolean|string|int|float)(\[\])?)$/;var c=[];var C=sap.ui.getCore().byId(i);if(!C&&sap.ui.getCore().getUIArea(i)){c.push({control:"sap.ui.core.UIArea",properties:[],aggregations:[]})}else if(C){var M=C.getMetadata();while(M instanceof sap.ui.core.ElementMetadata){var d={control:M.getName(),properties:[],aggregations:[]};var P=M.getProperties();$.each(P,function(k,e){var f={};$.each(e,function(n,v){if(n.substring(0,1)!=="_"||(n=='_sGetter'||n=='_sMutator')){f[n]=v}if(n=='_sGetter'||n=='_sMutator'){f["bp"+n]=$.grep(m,function(o){return o.name===v&&o.active}).length===1}var t=sap.ui.base.DataType.getType(e.type);if(t&&!(t instanceof sap.ui.base.DataType)){f["enumValues"]=t}});f.value=C.getProperty(k);f.isBound=!!C.mBindingInfos[k];d.properties.push(f)});var A=M.getAggregations();$.each(A,function(k,e){if(e.altTypes&&e.altTypes[0]&&p.test(e.altTypes[0])&&typeof(C.getAggregation(k))!=='object'){var f={};$.each(e,function(n,v){if(n.substring(0,1)!=="_"||(n=='_sGetter'||n=='_sMutator')){f[n]=v}if(n=='_sGetter'||n=='_sMutator'){f["bp"+n]=$.grep(m,function(o){return o.name===v&&o.active}).length===1}});f.value=C.getAggregation(k);d.aggregations.push(f)}});c.push(d);M=M.getParent()}}return c};sap.ui.core.support.plugins.ControlTree.prototype.getControlBindingInfos=function(i){var c={bindings:[],contexts:[]};var C=sap.ui.getCore().byId(i);if(!C)return c;var B=C.mBindingInfos;var t=this;for(var d in B){if(B.hasOwnProperty(d)){var m=B[d];var e=[];var f,g=[];if($.isArray(m.parts)){f=m.parts}else{f=[m]}if(m.binding instanceof sap.ui.model.CompositeBinding){g=m.binding.getBindings()}else if(m.binding instanceof sap.ui.model.Binding){g=[m.binding]}$.each(f,function(I,n){var D={};D.invalidPath=true;D.path=n.path;D.mode=n.mode;D.model={name:n.model};if(g.length>I&&g[I]){var p=g[I],M=p.getModel();if(p.getContext().getProperty(D.path)!=null){D.invalidPath=false}var A=p.getModel().resolve(p.getPath(),p.getContext());D.absolutePath=(typeof(A)==='undefined')?'Unresolvable':A;D.isRelative=p.isRelative();D.model=t.getBindingModelInfo(p,C)}e.push(D)});c.bindings.push({name:d,type:(m.binding)?m.binding.getMetadata().getName():undefined,bindings:e})}}function h(n,M){var p={modelName:(M==='undefined')?'none (default)':M,path:n.getPath()};if(!n.getObject()==null){p.invalidPath=true}return p}var j=C.oBindingContexts;for(var k in j){if(j.hasOwnProperty(k)){c.contexts.push(h(j[k],k))}}var j=C.oPropagatedProperties.oBindingContexts;for(var k in j){if(j.hasOwnProperty(k)&&!C.oBindingContexts[k]){var l=h(j[k],k);var o=C;do{if(o.oBindingContexts[k]==j[k]){l.location={id:o.getId(),name:o.getMetadata().getName()};break}}while(o=o.getParent());c.contexts.push(l)}}return c};sap.ui.core.support.plugins.ControlTree.prototype.getBindingModelInfo=function(B,c){var m={};var o=B.getModel();function g(M){for(var s in M){if(M.hasOwnProperty(s)){if(M[s]===o){return s}}}return null}m.name=g(c.oModels)||g(c.oPropagatedProperties.oModels);if(m.name){var C=c;do{if(C.oModels[m.name]===o){m.location={type:'control',id:C.getId(),name:C.getMetadata().getName()};break}}while(C=C.getParent());if(!m.location){var d=null;if(m.name==='undefined'){d=sap.ui.getCore().getModel()}else{d=sap.ui.getCore().getModel(m.name)}if(d){m.location={type:'core'}}}}m.type=o.getMetadata().getName();m.bindingMode=o.getDefaultBindingMode();m.name=(m.name==='undefined')?'none (default)':m.name;return m};sap.ui.core.support.plugins.ControlTree.prototype.refreshBinding=function(I,B){var c=sap.ui.getCore().byId(I);var m=c.mBindingInfos[B];if(!c||!m)return;var o=m.binding;if(!o){return}if(o instanceof sap.ui.model.CompositeBinding){var d=o.getBindings();for(var i=0;i<d.length;i++){d[i].refresh()}}else{o.refresh()}}}(jQuery));

