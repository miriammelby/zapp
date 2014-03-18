/*
 * Scroller
 * http://github.com/zynga/scroller
 *
 * Copyright 2011, Zynga Inc.
 * Licensed under the MIT License.
 * https://raw.github.com/zynga/scroller/master/MIT-LICENSE.txt
 *
 * Based on the work of: Unify Project (unify-project.org)
 * http://unify-project.org
 * Copyright 2011, Deutsche Telekom AG
 * License: MIT + Apache (V2)
 * 
 * Inspired by: https://github.com/inexorabletash/raf-shim/blob/master/raf.js
 */
(function(g){if(g.requestAnimationFrame){return}var n=Date.now||function(){return+new Date};var a=Object.keys||function(o){var k={};for(var e in o){k[e]=true}return k};var b=Object.empty||function(o){for(var k in o){return false}return true};var p="RequestAnimationFrame";var c=(function(){var e="webkit,moz,o,ms".split(",");for(var i=0;i<4;i++){if(g[e[i]+p]!=null){return e[i]}}})();if(c){g.requestAnimationFrame=g[c+p];g.cancelRequestAnimationFrame=g[c+"Cancel"+p];return}var T=60;var r={};var d=1;var t=null;g.requestAnimationFrame=function(e,f){var h=d++;r[h]=e;if(t===null){t=setTimeout(function(){var j=n();var k=r;var m=a(k);r={};t=null;for(var i=0,l=m.length;i<l;i++){k[m[i]](j)}},1000/T)}return h};g.cancelRequestAnimationFrame=function(h){delete r[h];if(b(r)){clearTimeout(t);t=null}}})(this);
/*
 * Scroller
 * http://github.com/zynga/scroller
 *
 * Copyright 2011, Zynga Inc.
 * Licensed under the MIT License.
 * https://raw.github.com/zynga/scroller/master/MIT-LICENSE.txt
 *
 * Based on the work of: Unify Project (unify-project.org)
 * http://unify-project.org
 * Copyright 2011, Deutsche Telekom AG
 * License: MIT + Apache (V2)
 */
(function(g){var t=Date.now||function(){return+new Date()};var d=60;var m=1000;var r={};var c=1;if(!g.core){g.core={effect:{}}}else if(!core.effect){core.effect={}}core.effect.Animate={stop:function(i){var a=r[i]!=null;if(a){r[i]=null}return a},isRunning:function(i){return r[i]!=null},start:function(s,v,a,b,e,f){var h=t();var l=h;var p=0;var i=0;var k=c++;if(!f){f=document.body}if(k%20===0){var n={};for(var u in r){n[u]=true}r=n}var o=function(q){var w=q!==true;var x=t();if(!r[k]||(v&&!v(k))){r[k]=null;a&&a(d-(i/((x-h)/m)),k,false);return}if(w){var y=Math.round((x-l)/(m/d))-1;for(var j=0;j<Math.min(y,4);j++){o(true);i++}}if(b){p=(x-h)/b;if(p>1){p=1}}var z=e?e(p):p;if((s(z,x,w)===false||p===1)&&w){r[k]=null;a&&a(d-(i/((x-h)/m)),k,p===1||b==null)}else if(w){l=x;requestAnimationFrame(o,f)}};r[k]=true;requestAnimationFrame(o,f);return k}}})(this);var Scroller;(function(){Scroller=function(c,o){this.__callback=c;this.options={scrollingX:true,scrollingY:true,animating:true,bouncing:true,locking:true,paging:false,snapping:false,zooming:false,minZoom:0.5,maxZoom:3};for(var k in o){this.options[k]=o[k]}};
// Easing Equations (c) 2003 Robert Penner, all rights reserved.
// Open source under the BSD License.
var e=function(p){return(Math.pow((p-1),3)+1)};var a=function(p){if((p/=0.5)<1){return 0.5*Math.pow(p,3)}return 0.5*(Math.pow((p-2),3)+2)};var m={__isSingleTouch:false,__isTracking:false,__isGesturing:false,__isDragging:false,__isDecelerating:false,__isAnimating:false,__clientLeft:0,__clientTop:0,__clientWidth:0,__clientHeight:0,__contentWidth:0,__contentHeight:0,__snapWidth:100,__snapHeight:100,__refreshHeight:null,__refreshActive:false,__refreshActivate:null,__refreshDeactivate:null,__refreshStart:null,__zoomLevel:1,__scrollLeft:0,__scrollTop:0,__maxScrollLeft:0,__maxScrollTop:0,__scheduledLeft:0,__scheduledTop:0,__scheduledZoom:0,__lastTouchLeft:null,__lastTouchTop:null,__lastTouchMove:null,__positions:null,__minDecelerationScrollLeft:null,__minDecelerationScrollTop:null,__maxDecelerationScrollLeft:null,__maxDecelerationScrollTop:null,__decelerationVelocityX:null,__decelerationVelocityY:null,setDimensions:function(c,b,d,f){var s=this;if(c){s.__clientWidth=c}if(b){s.__clientHeight=b}if(d){s.__contentWidth=d}if(f){s.__contentHeight=f}s.__computeScrollMax();s.scrollTo(s.__scrollLeft,s.__scrollTop,true)},setPosition:function(l,t){var s=this;s.__clientLeft=l||0;s.__clientTop=t||0},setSnapSize:function(w,h){var s=this;s.__snapWidth=w;s.__snapHeight=h},activatePullToRefresh:function(h,b,d,s){var c=this;c.__refreshHeight=h;c.__refreshActivate=b;c.__refreshDeactivate=d;c.__refreshStart=s},finishPullToRefresh:function(){var s=this;s.__refreshActive=false;if(s.__refreshDeactivate){s.__refreshDeactivate()}s.scrollTo(s.__scrollLeft,s.__scrollTop,true)},getValues:function(){var s=this;return{left:s.__scrollLeft,top:s.__scrollTop,zoom:s.__zoomLevel}},getScrollMax:function(){var s=this;return{left:s.__maxScrollLeft,top:s.__maxScrollTop}},zoomTo:function(l,b,o,c){var s=this;if(!s.options.zooming){throw new Error("Zooming is not enabled!")}if(s.__isDecelerating){core.effect.Animate.stop(s.__isDecelerating);s.__isDecelerating=false}var d=s.__zoomLevel;if(o==null){o=s.__clientWidth/2}if(c==null){c=s.__clientHeight/2}l=Math.max(Math.min(l,s.options.maxZoom),s.options.minZoom);s.__computeScrollMax(l);var f=((o+s.__scrollLeft)*l/d)-o;var t=((c+s.__scrollTop)*l/d)-c;if(f>s.__maxScrollLeft){f=s.__maxScrollLeft}else if(f<0){f=0}if(t>s.__maxScrollTop){t=s.__maxScrollTop}else if(t<0){t=0}s.__publish(f,t,l,b)},zoomBy:function(f,b,o,c){var s=this;s.zoomTo(s.__zoomLevel*f,b,o,c)},scrollTo:function(l,t,b,z){var s=this;if(s.__isDecelerating){core.effect.Animate.stop(s.__isDecelerating);s.__isDecelerating=false}if(z!=null&&z!==s.__zoomLevel){if(!s.options.zooming){throw new Error("Zooming is not enabled!")}l*=z;t*=z;s.__computeScrollMax(z)}else{z=s.__zoomLevel}if(!s.options.scrollingX){l=s.__scrollLeft}else{if(s.options.paging){l=Math.round(l/s.__clientWidth)*s.__clientWidth}else if(s.options.snapping){l=Math.round(l/s.__snapWidth)*s.__snapWidth}}if(!s.options.scrollingY){t=s.__scrollTop}else{if(s.options.paging){t=Math.round(t/s.__clientHeight)*s.__clientHeight}else if(s.options.snapping){t=Math.round(t/s.__snapHeight)*s.__snapHeight}}l=Math.max(Math.min(s.__maxScrollLeft,l),0);t=Math.max(Math.min(s.__maxScrollTop,t),0);if(l===s.__scrollLeft&&t===s.__scrollTop){b=false}s.__publish(l,t,z,b)},scrollBy:function(l,t,b){var s=this;var c=s.__isAnimating?s.__scheduledLeft:s.__scrollLeft;var d=s.__isAnimating?s.__scheduledTop:s.__scrollTop;s.scrollTo(c+(l||0),d+(t||0),b)},doMouseZoom:function(w,t,p,b){var s=this;var c=w>0?0.97:1.03;return s.zoomTo(s.__zoomLevel*c,false,p-s.__clientLeft,b-s.__clientTop)},doTouchStart:function(t,b){if(t.length==null){throw new Error("Invalid touch list: "+t)}if(b instanceof Date){b=b.valueOf()}if(typeof b!=="number"){throw new Error("Invalid timestamp value: "+b)}var s=this;if(s.__isDecelerating){core.effect.Animate.stop(s.__isDecelerating);s.__isDecelerating=false}if(s.__isAnimating){core.effect.Animate.stop(s.__isAnimating);s.__isAnimating=false}var c,d;var i=t.length===1;if(i){c=t[0].pageX;d=t[0].pageY}else{c=Math.abs(t[0].pageX+t[1].pageX)/2;d=Math.abs(t[0].pageY+t[1].pageY)/2}s.__initialTouchLeft=c;s.__initialTouchTop=d;s.__zoomLevelStart=s.__zoomLevel;s.__lastTouchLeft=c;s.__lastTouchTop=d;s.__lastTouchMove=b;s.__lastScale=1;s.__enableScrollX=!i&&s.options.scrollingX;s.__enableScrollY=!i&&s.options.scrollingY;s.__isTracking=true;s.__isDragging=!i;s.__isSingleTouch=i;s.__positions=[]},doTouchMove:function(t,b,s){if(t.length==null){throw new Error("Invalid touch list: "+t)}if(b instanceof Date){b=b.valueOf()}if(typeof b!=="number"){throw new Error("Invalid timestamp value: "+b)}var c=this;if(!c.__isTracking){return}var d,f;if(t.length===2){d=Math.abs(t[0].pageX+t[1].pageX)/2;f=Math.abs(t[0].pageY+t[1].pageY)/2}else{d=t[0].pageX;f=t[0].pageY}var p=c.__positions;if(c.__isDragging){var g=d-c.__lastTouchLeft;var h=f-c.__lastTouchTop;var i=c.__scrollLeft;var j=c.__scrollTop;var l=c.__zoomLevel;if(s!=null&&c.options.zooming){var o=l;l=l/c.__lastScale*s;l=Math.max(Math.min(l,c.options.maxZoom),c.options.minZoom);if(o!==l){var n=d-c.__clientLeft;var q=f-c.__clientTop;i=((n+i)*l/o)-n;j=((q+j)*l/o)-q;c.__computeScrollMax(l)}}if(c.__enableScrollX){i-=g;var r=c.__maxScrollLeft;if(i>r||i<0){if(c.options.bouncing){i+=(g/2)}else if(i>r){i=r}else{i=0}}}if(c.__enableScrollY){j-=h;var u=c.__maxScrollTop;if(j>u||j<0){if(c.options.bouncing){j+=(h/2);if(!c.__enableScrollX&&c.__refreshHeight!=null){if(!c.__refreshActive&&j<=-c.__refreshHeight){c.__refreshActive=true;if(c.__refreshActivate){c.__refreshActivate()}}else if(c.__refreshActive&&j>-c.__refreshHeight){c.__refreshActive=false;if(c.__refreshDeactivate){c.__refreshDeactivate()}}}}else if(j>u){j=u}else{j=0}}}if(p.length>60){p.splice(0,30)}p.push(i,j,b);c.__publish(i,j,l)}else{var v=c.options.locking?3:0;var w=5;var x=Math.abs(d-c.__initialTouchLeft);var y=Math.abs(f-c.__initialTouchTop);c.__enableScrollX=c.options.scrollingX&&x>=v;c.__enableScrollY=c.options.scrollingY&&y>=v;p.push(c.__scrollLeft,c.__scrollTop,b);c.__isDragging=(c.__enableScrollX||c.__enableScrollY)&&(x>=w||y>=w)}c.__lastTouchLeft=d;c.__lastTouchTop=f;c.__lastTouchMove=b;c.__lastScale=s},doTouchEnd:function(t){if(t instanceof Date){t=t.valueOf()}if(typeof t!=="number"){throw new Error("Invalid timestamp value: "+t)}var s=this;if(!s.__isTracking){return}s.__isTracking=false;if(s.__isDragging){s.__isDragging=false;if(s.__isSingleTouch&&s.options.animating&&(t-s.__lastTouchMove)<=100){var p=s.__positions;var b=p.length-1;var c=b;for(var i=b;i>0&&p[i]>(s.__lastTouchMove-100);i-=3){c=i}if(c!==b){var d=p[b]-p[c];var f=s.__scrollLeft-p[c-2];var g=s.__scrollTop-p[c-1];s.__decelerationVelocityX=f/d*(1000/60);s.__decelerationVelocityY=g/d*(1000/60);var h=s.options.paging||s.options.snapping?4:1;if(Math.abs(s.__decelerationVelocityX)>h||Math.abs(s.__decelerationVelocityY)>h){if(!s.__refreshActive){s.__startDeceleration(t)}}}}}if(!s.__isDecelerating){if(s.__refreshActive&&s.__refreshStart){s.__publish(s.__scrollLeft,-s.__refreshHeight,s.__zoomLevel,true);if(s.__refreshStart){s.__refreshStart()}}else{s.scrollTo(s.__scrollLeft,s.__scrollTop,true,s.__zoomLevel);if(s.__refreshActive){s.__refreshActive=false;if(s.__refreshDeactivate){s.__refreshDeactivate()}}}}s.__positions.length=0},__publish:function(l,t,z,b){var s=this;var w=s.__isAnimating;if(w){core.effect.Animate.stop(w);s.__isAnimating=false}if(b&&s.options.animating){s.__scheduledLeft=l;s.__scheduledTop=t;s.__scheduledZoom=z;var o=s.__scrollLeft;var c=s.__scrollTop;var d=s.__zoomLevel;var f=l-o;var g=t-c;var h=z-d;var i=function(p,n,r){if(r){s.__scrollLeft=o+(f*p);s.__scrollTop=c+(g*p);s.__zoomLevel=d+(h*p);if(s.__callback){s.__callback(s.__scrollLeft,s.__scrollTop,s.__zoomLevel)}}};var v=function(n){return s.__isAnimating===n};var j=function(r,n,p){if(n===s.__isAnimating){s.__isAnimating=false}if(s.options.zooming){s.__computeScrollMax()}};s.__isAnimating=core.effect.Animate.start(i,v,j,250,w?e:a)}else{s.__scheduledLeft=s.__scrollLeft=l;s.__scheduledTop=s.__scrollTop=t;s.__scheduledZoom=s.__zoomLevel=z;if(s.__callback){s.__callback(l,t,z)}if(s.options.zooming){s.__computeScrollMax()}}},__computeScrollMax:function(z){var s=this;if(z==null){z=s.__zoomLevel}s.__maxScrollLeft=Math.max((s.__contentWidth*z)-s.__clientWidth,0);s.__maxScrollTop=Math.max((s.__contentHeight*z)-s.__clientHeight,0)},__startDeceleration:function(t){var s=this;if(s.options.paging){var b=Math.max(Math.min(s.__scrollLeft,s.__maxScrollLeft),0);var c=Math.max(Math.min(s.__scrollTop,s.__maxScrollTop),0);var d=s.__clientWidth;var f=s.__clientHeight;s.__minDecelerationScrollLeft=Math.floor(b/d)*d;s.__minDecelerationScrollTop=Math.floor(c/f)*f;s.__maxDecelerationScrollLeft=Math.ceil(b/d)*d;s.__maxDecelerationScrollTop=Math.ceil(c/f)*f}else{s.__minDecelerationScrollLeft=0;s.__minDecelerationScrollTop=0;s.__maxDecelerationScrollLeft=s.__maxScrollLeft;s.__maxDecelerationScrollTop=s.__maxScrollTop}var g=function(p,n,r){s.__stepThroughDeceleration(r)};var h=s.options.snapping?4:0.1;var v=function(){return Math.abs(s.__decelerationVelocityX)>=h||Math.abs(s.__decelerationVelocityY)>=h};var i=function(r,j,w){s.__isDecelerating=false;s.scrollTo(s.__scrollLeft,s.__scrollTop,s.options.snapping)};s.__isDecelerating=core.effect.Animate.start(g,v,i)},__stepThroughDeceleration:function(r){var s=this;var b=s.__scrollLeft+s.__decelerationVelocityX;var c=s.__scrollTop+s.__decelerationVelocityY;if(!s.options.bouncing){var d=Math.max(Math.min(s.__maxScrollLeft,b),0);if(d!==b){b=d;s.__decelerationVelocityX=0}var f=Math.max(Math.min(s.__maxScrollTop,c),0);if(f!==c){c=f;s.__decelerationVelocityY=0}}if(r){s.__publish(b,c,s.__zoomLevel)}else{s.__scrollLeft=b;s.__scrollTop=c}if(!s.options.paging){var g=0.95;s.__decelerationVelocityX*=g;s.__decelerationVelocityY*=g}if(s.options.bouncing){var h=0;var i=0;var p=0.03;var j=0.08;if(b<s.__minDecelerationScrollLeft){h=s.__minDecelerationScrollLeft-b}else if(b>s.__maxDecelerationScrollLeft){h=s.__maxDecelerationScrollLeft-b}if(c<s.__minDecelerationScrollTop){i=s.__minDecelerationScrollTop-c}else if(c>s.__maxDecelerationScrollTop){i=s.__maxDecelerationScrollTop-c}if(h!==0){if(h*s.__decelerationVelocityX<=0){s.__decelerationVelocityX+=h*p}else{s.__decelerationVelocityX=h*j}}if(i!==0){if(i*s.__decelerationVelocityY<=0){s.__decelerationVelocityY+=i*p}else{s.__decelerationVelocityY=i*j}}}}};for(var k in m){Scroller.prototype[k]=m[k]}})();

