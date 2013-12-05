
<!-- START OF SDC Advanced Tracking Code -->
<!-- Copyright (c) 1996-2005 WebTrends Inc.  All rights reserved. -->
<!-- V8.0 -->
<!-- $DateTime: 2006/04/07 16:45:14 $ -->

// START OF Advanced SmartSource Data Collector TAG
// Copyright (c) 1996-2006 WebTrends Inc. All rights reserved.
// $DateTime: 2006/03/09 14:15:22 $
var gService = false;
var gTimeZone = -8;

// Code section for Enable First-Party Cookie Tracking
function dcsCookie(){
	if (typeof(dcsOther)=="function"){
		dcsOther();
	}
	else if (typeof(dcsPlugin)=="function"){
		dcsPlugin();
	}
	else if (typeof(dcsFPC)=="function"){
		dcsFPC(gTimeZone);
	}
}
function dcsGetCookie(name){
	var pos=document.cookie.indexOf(name+"=");
	if (pos!=-1){
		var start=pos+name.length+1;
		var end=document.cookie.indexOf(";",start);
		if (end==-1){
			end=document.cookie.length;
		}
		return unescape(document.cookie.substring(start,end));
	}
	return null;
}
function dcsGetCrumb(name,crumb){
	var aCookie=dcsGetCookie(name).split(":");
	for (var i=0;i<aCookie.length;i++){
		var aCrumb=aCookie[i].split("=");
		if (crumb==aCrumb[0]){
			return aCrumb[1];
		}
	}
	return null;
}
function dcsGetIdCrumb(name,crumb){
	var cookie=dcsGetCookie(name);
	var id=cookie.substring(0,cookie.indexOf(":lv="));
	var aCrumb=id.split("=");
	for (var i=0;i<aCrumb.length;i++){
		if (crumb==aCrumb[0]){
			return aCrumb[1];
		}
	}
	return null;
}
function dcsFPC(offset){
	if (typeof(offset)=="undefined"){
		return;
	}
	if (document.cookie.indexOf("WTLOPTOUT=")!=-1){
		return;
	}
	var name=gFpc;
	var dCur=new Date();
	var adj=(dCur.getTimezoneOffset()*60000)+(offset*3600000);
	dCur.setTime(dCur.getTime()+adj);
	var dExp=new Date(dCur.getTime()+315360000000);
	var dSes=new Date(dCur.getTime());
	WT.co_f=WT.vt_sid=WT.vt_f=WT.vt_f_a=WT.vt_f_s=WT.vt_f_d=WT.vt_f_tlh=WT.vt_f_tlv="";
	if (document.cookie.indexOf(name+"=")==-1){
		if ((typeof(gWtId)!="undefined")&&(gWtId!="")){
			WT.co_f=gWtId;
		}
		else if ((typeof(gTempWtId)!="undefined")&&(gTempWtId!="")){
			WT.co_f=gTempWtId;
			WT.vt_f="1";
		}
		else{
			WT.co_f="2";
			var cur=dCur.getTime().toString();
			for (var i=2;i<=(32-cur.length);i++){
				WT.co_f+=Math.floor(Math.random()*16.0).toString(16);
			}
			WT.co_f+=cur;
			WT.vt_f="1";
		}
		if (typeof(gWtAccountRollup)=="undefined"){
			WT.vt_f_a="1";
		}
		WT.vt_f_s=WT.vt_f_d="1";
		WT.vt_f_tlh=WT.vt_f_tlv="0";
	}
	else{
		var id=dcsGetIdCrumb(name,"id");
		var lv=parseInt(dcsGetCrumb(name,"lv"));
		var ss=parseInt(dcsGetCrumb(name,"ss"));
		if ((id==null)||(id=="null")||isNaN(lv)||isNaN(ss)){
			return;
		}
		WT.co_f=id;
		var dLst=new Date(lv);
		WT.vt_f_tlh=Math.floor((dLst.getTime()-adj)/1000);
		dSes.setTime(ss);
		if ((dCur.getTime()>(dLst.getTime()+1800000))||(dCur.getTime()>(dSes.getTime()+28800000))){
			WT.vt_f_tlv=Math.floor((dSes.getTime()-adj)/1000);
			dSes.setTime(dCur.getTime());
			WT.vt_f_s="1";
		}
		if ((dCur.getDay()!=dLst.getDay())||(dCur.getMonth()!=dLst.getMonth())||(dCur.getYear()!=dLst.getYear())){
			WT.vt_f_d="1";
		}
	}
	WT.co_f=escape(WT.co_f);
	WT.vt_sid=WT.co_f+"."+(dSes.getTime()-adj);
	var expiry="; expires="+dExp.toGMTString();
	document.cookie=name+"="+"id="+WT.co_f+":lv="+dCur.getTime().toString()+":ss="+dSes.getTime().toString()+expiry+"; path=/"+(((typeof(gFpcDom)!="undefined")&&(gFpcDom!=""))?("; domain="+gFpcDom):(""));
	if (document.cookie.indexOf(name+"=")==-1){
		WT.co_f=WT.vt_sid=WT.vt_f_s=WT.vt_f_d=WT.vt_f_tlh=WT.vt_f_tlv="";
		WT.vt_f=WT.vt_f_a="2";
	}
}

// Add dcsOther() here if using existing first-party cookie, or dcsPlugin() here if using WT Cookie Plugin
// Code section for Track clicks to links leading offsite.
function dcsOffsite(evt){
	//debugger
	evt=evt||(window.event||"");
	if (evt){
		var e=dcsEvt(evt,"A");
		if (e.hostname&&!dcsIsOnsite(e.hostname)){
			var qry=e.search?e.search.substring(e.search.indexOf("?")+1,e.search.length):"";
			if (qry.toUpperCase().indexOf("WT.SVL=")==-1){
				WT.svl=dcsParseSvl(e.name?e.name.toString():(e.onclick?e.onclick.toString():""));
			}
			var loc=window.location.search;
			var pid="";
			var pid_index=loc.toUpperCase().indexOf("PID=");
			if (pid_index!=-1){
				var pid_eindex=loc.indexOf("&",pid_index);
				if (pid_eindex!=-1) {
					pid=loc.substring(pid_index+4,pid_eindex);
				} else {
					pid=loc.substring(pid_index+4);
				}
			}
			var path=e.pathname?((e.pathname.indexOf("/")!=0)?"/"+e.pathname:e.pathname):"/";
			var trim=true;
			dcsSaveHref(evt);
			dcsMultiTrack("DCS.dcssip",e.hostname,"DCS.dcsuri",path,"DCS.dcsqry",trim?"":qry,"WT.ti","Offsite:"+e.hostname+path+qry,"WT.os","1","DCSext.PName",pid);
			DCS.dcssip=DCS.dcsuri=DCS.dcsqry=WT.ti=WT.svl=WT.os=DCSext.PName="";
			dcsLoadHref(gHref);
		}
	}
}

// Code section for Track clicks to dynamic links.
function dcsDynamic(evt){
	evt=evt||(window.event||"");
	var agt=navigator.userAgent.toLowerCase();
	var major=parseInt(navigator.appVersion);
	var nn=((agt.indexOf("mozilla")!=-1)&&(agt.indexOf("compatible")==-1));
	var nn_e=(nn&&(major>=4));
	var click=false;
	if (nn_e){
		if (typeof(evt.keyCode)=='undefined') {
			if (evt.which==1) {
				click=true;
			}
		} else {
			if (evt.keyCode==13) {
				click=true;
			}
		}
	} else {
		if (evt.keyCode==13) {
			click=true;
		} else if (typeof(evt.button)!='undefined') {
			if (evt.button==1) {
				click=true;
			}
		}
	}
	if (click) {
		var e=dcsEvt(evt,"A");
		if (e.href&&e.protocol){
			var qry=e.search?e.search.substring(e.search.indexOf("?")+1,e.search.length):"";
			if (qry.toUpperCase().indexOf("WT.SVL=")==-1){
				WT.svl=dcsParseSvl(e.name?e.name.toString():(e.onclick?e.onclick.toString():""));
			}
			var loc=window.location.search;
			var pid="";
			var pid_index=loc.toUpperCase().indexOf("PID=");
			if (pid_index!=-1){
				var pid_eindex=loc.indexOf("&",pid_index);
				if (pid_eindex!=-1) {
					pid=loc.substring(pid_index+4,pid_eindex);
				} else {
					pid=loc.substring(pid_index+4);
				}
			}
			if (e.protocol=="mailto:"){
				dcsMultiTrack("DCS.dcssip","","DCS.dcsuri",e.href,"WT.ti","MailTo:"+e.innerHTML,"WT.cl","mt","DCSext.PName",pid);
				DCS.dcssip=DCS.dcsuri=WT.ti=WT.cl=DCSext.PName="";
			}
			WT.svl="";
		}
	}
}

// Code section for Track clicks to download links.
function dcsDownload(evt){
	evt=evt||(window.event||"");
	var agt=navigator.userAgent.toLowerCase();
	var major=parseInt(navigator.appVersion);
	var nn=((agt.indexOf("mozilla")!=-1)&&(agt.indexOf("compatible")==-1));
	var nn_e=(nn&&(major>=4));
	var click = false;
	if (nn_e){
		if (typeof(evt.keyCode)=='undefined') {
			if (evt.which==1) {
				click=true;
			}
		} else {
			if (evt.keyCode==13) {
				click=true;
			}
		}
	} else {
		if (evt.keyCode==13) {
			click=true;
		} else if (typeof(evt.button)!='undefined') {
			if (evt.button==1) {
				click=true;
			}
		}
	}
	if (click) {
		var e=dcsEvt(evt,"A");
		if (e.hostname&&dcsIsOnsite(e.hostname)){
			var types="zip,exe,tar,pdf";
			if (types.indexOf(e.pathname.substring(e.pathname.lastIndexOf(".")+1,e.pathname.length))!=-1){
				var qry=e.search?e.search.substring(e.search.indexOf("?")+1,e.search.length):"";
				if (qry.toUpperCase().indexOf("WT.SVL=")==-1){
					WT.svl=dcsParseSvl(e.name?e.name.toString():(e.onclick?e.onclick.toString():""));
				}
				var path=e.pathname?((e.pathname.indexOf("/")!=0)?"/"+e.pathname:e.pathname):"/";
//				dcsSaveHref(evt);
				dcsMultiTrack("DCS.dcssip",e.hostname,"DCS.dcsuri",path,"DCS.dcsqry",e.search||"","WT.ti","Download:"+(e.innerHTML||""),"WT.dl","1");
				DCS.dcssip=DCS.dcsuri=DCS.dcsqry=WT.ti=WT.svl=WT.dl="";
			}
		}
	}
}

// Code section for Track right clicks to download links.
function dcsRightClick(evt){
	evt=evt||(window.event||"");
	if (evt){
		var btn=evt.which||evt.button;
		if (btn!=1){
			var e=evt.target||evt.srcElement;
			if (dcsIsHttp(e)){
			var types="zip,exe,tar,pdf";
				if (types.indexOf(e.pathname.substring(e.pathname.lastIndexOf(".")+1,e.pathname.length))!=-1){
					var path=e.pathname?((e.pathname.indexOf("/")!=0)?"/"+e.pathname:e.pathname):"/";
					dcsSaveHref(evt);
					dcsMultiTrack("DCS.dcssip",e.hostname,"DCS.dcsuri",path,"DCS.dcsqry","","WT.ti","Download:"+path,"WT.dl","1","WT.rc","1");
					DCS.dcssip=DCS.dcsuri=WT.ti=WT.dl=WT.rc="";
				}
			}
		}
	}
}

// Code section for Set the First-Party Cookie domain
//var gFpcDom=".webtrends.com";

// Code section for Enable Event Tracking
function dcsParseSvl(sv){
	sv=sv.split(" ").join("");
	sv=sv.split("\t").join("");
	sv=sv.split("\n").join("");
	var pos=sv.toUpperCase().indexOf("WT.SVL=");
	if (pos!=-1){
		var start=pos+8;
		var end=sv.indexOf('"',start);
		if (end==-1){
			end=sv.indexOf("'",start);
			if (end==-1){
				end=sv.length;
			}
		}
		return sv.substring(start,end);
	}
	return "";
}
function dcsIsOnsite(host){
	var doms="trendmicro.co.jp,trendmicro.com,g.akamai.net,is702.jp,vb-blog.jp,tmqa.jp,trendflexsecurity.jp,virusbuster.jp,tm-secureweb.jp,trendmicro.ehosts.net";
    var aDoms=doms.split(',');
    for (var i=0;i<aDoms.length;i++){
		if (host.indexOf(aDoms[i])!=-1){
		       return 1;
		}
    }
    return 0;
}
function dcsIsHttp(e){
	return (e.href&&e.protocol&&(e.protocol.indexOf("http")!=-1))?true:false;
}

var gHref="";
function dcsSaveHref(evt){
	if (evt.preventDefault&&evt.target.href){
		evt.preventDefault();
		gHref=evt.target.href;
	}
}
function dcsLoadHref(evt){
	if (gHref.length>0){
		window.location=gHref;
		gHref="";
	}
}
function dcsEvt(evt,tag){
	var e=evt.target||evt.srcElement;
	while (e.tagName&&(e.tagName!=tag)){
		e=e.parentElement||e.parentNode;
	}
	return e;
}
function dcsBind(event,func){
	if ((typeof(window[func])=="function")&&document.body){
		if (document.body.addEventListener){
			document.body.addEventListener(event, window[func], true);
		}
		else if(document.body.attachEvent){
			document.body.attachEvent("on"+event, window[func]);
		}
	}
}
function dcsET(){
	dcsBind("mousedown","dcsDownload");
	dcsBind("keypress","dcsDownload");
	dcsBind("click","dcsOffsite");
	dcsBind("mousedown","dcsDynamic");
	dcsBind("keypress","dcsDynamic");
	dcsBind("mousedown","dcsRightClick");
}
	
function dcsMultiTrack(){
	if (arguments.length%2==0){
		for (var i=0;i<arguments.length;i+=2){
			if (arguments[i].indexOf('WT.')==0){
				WT[arguments[i].substring(3)]=gI18n?dcsEscape(dcsEncode(arguments[i+1]),I18NRE):arguments[i+1];
			}
			else if (arguments[i].indexOf('DCS.dcsref')==0){
				DCS[arguments[i].substring(4)]=gI18n?dcsEscape(arguments[i+1],I18NRE):arguments[i+1];
			}
			else if (arguments[i].indexOf('DCS.dcsqry')==0){
				DCS[arguments[i].substring(4)]=gI18n?queryEncode(arguments[i+1]):arguments[i+1];
			}
			else if (arguments[i].indexOf('DCS.')==0){
				DCS[arguments[i].substring(4)]=arguments[i+1];
			}
			else if (arguments[i].indexOf('DCSext.')==0){
				DCSext[arguments[i].substring(7)]=gI18n?dcsEscape(dcsEncode(arguments[i+1]),I18NRE):arguments[i+1];
			}
		}
		var dCurrent=new Date();
		DCS.dcsdat=dCurrent.getTime();
		dcsFunc("dcsCookie");
		dcsTag();
	}
}

// Add event handlers here

function dcsTMSearch() {
	if (window.location.pathname!='/search/google/ja-jp/results.asp'){
		return;
	}
	var elems;
	if (document.all){
		elems=document.all.tags("img");
	} else if (document.documentElement){
		elems=document.getElementsByTagName("img");
	}
	if (typeof(elems)!="undefined"){
		for (var i=1;i<=elems.length;i++){
			var img=elems.item(i-1);
			if (img.src&&img.src.indexOf('/search/google/ja-jp/images/powered-by-google.jpg')!=-1){
				WT.oss_r='1';
				break;
			}
		}
	}

	var param=window.location.search;
	var first;
	var last;
	var pos1=param.indexOf("?q=",0);
	var pos2=param.indexOf("&q=",0);
	if(pos1!=-1 | pos2!=-1){
		if(pos1!=-1){
			first = pos1;	
		}else if(pos2!=-1){
			first=pos2;	
		}
		last=param.indexOf("&",first+1)
		if(last==-1){
			last=param.length;
		}
		WT.oss=param.substring(first+3,last).replace(/%/g,"%25");
	}
}

function dcsAdv(){
	dcsFunc("dcsET");
	dcsFunc("dcsCookie");
	dcsFunc("dcsAdSearch");
	dcsFunc("dcsTMSearch");
	dcsFunc("dcsTP");
}
// END OF Advanced SmartSource Data Collector TAG

// START OF Basic SmartSource Data Collector TAG
// Copyright (c) 1996-2006 WebTrends Inc. All rights reserved.
// $DateTime: 2006/03/09 14:15:22 $
var gImages=new Array;
var gIndex=0;
var DCS=new Object();
var WT=new Object();
var DCSext=new Object();
var gQP=new Array();
var gI18n=true;
if (window.RegExp){
	var RE={"%09":/\t/g,"%20":/ /g,"%23":/\#/g,"%26":/\&/g,"%2B":/\+/g,"%3F":/\?/g,"%5C":/\\/g,"%22":/\"/g,"%7F":/\x7F/g,"%A0":/\xA0/g};
	var I18NRE={"%25":/\%/g};
}

// Add customizations here

function dcsVar(){
	var dCurrent=new Date();
	WT.tz=dCurrent.getTimezoneOffset()/60*-1;
	if (WT.tz==0){
		WT.tz="0";
	}
	WT.bh=dCurrent.getHours();
	WT.ul=navigator.appName=="Netscape"?navigator.language:navigator.userLanguage;
	if (typeof(screen)=="object"){
		WT.cd=navigator.appName=="Netscape"?screen.pixelDepth:screen.colorDepth;
		WT.sr=screen.width+"x"+screen.height;
	}
	if (typeof(navigator.javaEnabled())=="boolean"){
		WT.jo=navigator.javaEnabled()?"Yes":"No";
	}
	if (document.title){
		WT.ti=gI18n?dcsEscape(dcsEncode(document.title),I18NRE):document.title;
	}
	WT.js="Yes";
	WT.jv=dcsJV();
	if (document.body&&document.body.addBehavior){
		document.body.addBehavior("#default#clientCaps");
		if (document.body.connectionType){
			WT.ct=document.body.connectionType;
		}
		document.body.addBehavior("#default#homePage");
		WT.hp=document.body.isHomePage(location.href)?"1":"0";
	}
	if (parseInt(navigator.appVersion)>3){
		if ((navigator.appName=="Microsoft Internet Explorer")&&document.body){
			WT.bs=document.body.offsetWidth+"x"+document.body.offsetHeight;
		}
		else if (navigator.appName=="Netscape"){
			WT.bs=window.innerWidth+"x"+window.innerHeight;
		}
	}
	WT.fi="No";
	if (window.ActiveXObject){
		for(var i=10;i>0;i--){
			try{
				var flash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash."+i);
				WT.fi="Yes";
				WT.fv=i+".0";
				break;
			}
			catch(e){
			}
		}
	}
	else if (navigator.plugins&&navigator.plugins.length){
		for (var i=0;i<navigator.plugins.length;i++){
			if (navigator.plugins[i].name.indexOf('Shockwave Flash')!=-1){
				WT.fi="Yes";
				WT.fv=navigator.plugins[i].description.split(" ")[2];
				break;
			}
		}
	}
	if (gI18n){
		WT.em=(typeof(encodeURIComponent)=="function")?"uri":"esc";
		if (typeof(document.defaultCharset)=="string"){
			WT.le=document.defaultCharset;
		} 
		else if (typeof(document.characterSet)=="string"){
			WT.le=document.characterSet;
		}
	}
//	WT.sp="@@SPLITVALUE@@";
	DCS.dcsdat=dCurrent.getTime();
	DCS.dcssip=window.location.hostname;
	DCS.dcsuri=window.location.pathname;
	DCS.dcsreportid="jp";
	if (window.location.search){
		DCS.dcsqry=gI18n?queryEncode(window.location.search):window.location.search;
		if (gQP.length>0){
			for (var i=0;i<gQP.length;i++){
				var pos=DCS.dcsqry.indexOf(gQP[i]);
				if (pos!=-1){
					var front=DCS.dcsqry.substring(0,pos);
					var end=DCS.dcsqry.substring(pos+gQP[i].length,DCS.dcsqry.length);
					DCS.dcsqry=front+end;
				}
			}
		}
	}
	if ((window.document.referrer!="")&&(window.document.referrer!="-")){
		if (!(navigator.appName=="Microsoft Internet Explorer"&&parseInt(navigator.appVersion)<4)){
			DCS.dcsref=gI18n?dcsEscape(window.document.referrer, I18NRE):window.document.referrer;
		}
	}
}

function queryEncode(str){
	var v,v_sp;
	v=str;
	if (str.indexOf("?")==0){
		v=str.substring(1);
	}
	v_sp=v.split("&");
	for (var i=0;i<v_sp.length;i++){
		var e_pos=v_sp[i].indexOf("=");
		var v_enc=dcsEscape(dcsEncode(v_sp[i].substring(e_pos+1)),I18NRE);
		if (v_enc.indexOf("%25")>-1&&v_enc.indexOf("%2525")==-1){
			v_enc=dcsEscape(v_enc,I18NRE);
		}
		v_sp[i]=v_sp[i].substring(0,e_pos+1)+v_enc;
	}
	return v_sp.join("&");
}

function dcsA(N,V){
	return "&"+N+"="+dcsEscape(V, RE);
}

function dcsEscape(S, REL){
	if (typeof(REL)!="undefined"){
		var retStr = new String(S);
		for (R in REL){
			retStr = retStr.replace(REL[R],R);
		}
		return retStr;
	}
	else{
		return escape(S);
	}
}

function dcsEncode(S){
	if (typeof(encodeURIComponent)=="function"){
		return encodeURIComponent(S);
	}
	else{
		var str_split = escape(S).split("%u");
		var str = '';
		for (i=0;i<str_split.length;i++){
			if (i>0){
				str_split[i]=treatEscape(str_split[i]);
			}
			str+=str_split[i];
		}
		return str;
	}
}

function treatEscape(str){
	var dest;
	var rest = '';
	if (str.length>4){
		rest=str.substring(4,str.length);
		str=str.substring(0,4);
	}
	var c = parseInt(str,16);
	if ((c>=0x0001)&&(c<= 0x007F)){
	    dest='%'+str.charAt(2)+str.charAt(3);
	}
	else if(c>0x07FF){
	    dest='%'+(0xE0|((c>>12)&0x0F)).toString(16);
	    dest+='%'+(0x80|((c>>6)&0x3F)).toString(16);
	    dest+='%'+(0x80|((c>>0)&0x3F)).toString(16);
	}
	else{
	    dest='%'+(0xC0|((c>>6)&0x1F)).toString(16);
	    dest+='%'+(0x80|((c>>0)&0x3F)).toString(16);
	}
	return dest+rest;
}


function dcsCreateImage(dcsSrc){
	if (document.images){
		gImages[gIndex]=new Image;
		gImages[gIndex].src=dcsSrc;
		gIndex++;
	}
	else{
		document.write('<IMG ALT="" BORDER="0" NAME="DCSIMG" WIDTH="1" HEIGHT="1" SRC="'+dcsSrc+'">');
	}
}


function dcsMeta(){
	var elems;
	if (document.all){
		elems=document.all.tags("meta");
	}
	else if (document.documentElement){
		elems=document.getElementsByTagName("meta");
	}
	if (typeof(elems)!="undefined"){
		for (var i=1;i<=elems.length;i++){
			var meta=elems.item(i-1);
			if (meta.name){
				if (meta.name.indexOf('WT.')==0){
					WT[meta.name.substring(3)]=gI18n?dcsEscape(dcsEncode(meta.content),I18NRE):meta.content;
				}
				else if (meta.name.indexOf('DCSext.')==0){
					DCSext[meta.name.substring(7)]=gI18n?dcsEscape(dcsEncode(meta.content),I18NRE):meta.content;
				}
				else if (meta.name.indexOf('DCS.dcsref')==0){
					DCS[meta.name.substring(4)]=gI18n?dcsEscape(meta.content,I18NRE):meta.content;
				}
				else if (meta.name.indexOf('DCS.dcsqry')==0){
					DCS[meta.name.substring(4)]=gI18n?queryEncode(meta.content):meta.content;
				}
				else if (meta.name.indexOf('DCS.')==0){
					DCS[meta.name.substring(4)]=meta.content;
				}
			}
		}
	}
}

var gDomain2="wdcs.trendmicro.com";
var gDcsId2="";
function dcsTag(){
	if (document.cookie.indexOf("WTLOPTOUT=")!=-1){
		return;
	}
	var P="http"+(window.location.protocol.indexOf('https:')==0?'s':'')+"://"+gDomain+(gDcsId==""?'':'/'+gDcsId)+"/dcs.gif?";
	if (gI18n){
		WT.dep="";
	}
	for (var N in DCS){
		if (DCS[N]){
			P+=dcsA(N,DCS[N]);
		}
	}
	var keys=["co_f","vt_sid","vt_f_tlv"];
	for (var i=0;i<keys.length;i++){
		var key=keys[i];
		if (WT[key]){
			P+=dcsA("WT."+key,WT[key]);
			delete WT[key];
		}
	}
	for (N in WT){
		if (WT[N]){
			P+=dcsA("WT."+N,WT[N]);
		}
	}
	for (N in DCSext){
		if (DCSext[N]){
			if (gI18n){
				WT.dep=(WT.dep.length==0)?N:(WT.dep+";"+N);
			}
			P+=dcsA(N,DCSext[N]);
		}
	}
	if (gI18n&&(WT.dep.length>0)){
		P+=dcsA("WT.dep",WT.dep);
	}
	if (P.length>2048&&navigator.userAgent.indexOf('MSIE')>=0){
		P=P.substring(0,2040)+"&WT.tu=1";
	}
	dcsCreateImage(P);
}


function dcsJV(){
	var agt=navigator.userAgent.toLowerCase();
	var major=parseInt(navigator.appVersion);
	var mac=(agt.indexOf("mac")!=-1);
	var nn=((agt.indexOf("mozilla")!=-1)&&(agt.indexOf("compatible")==-1));
	var nn4=(nn&&(major==4));
	var nn6up=(nn&&(major>=5));
	var ie=((agt.indexOf("msie")!=-1)&&(agt.indexOf("opera")==-1));
	var ie4=(ie&&(major==4)&&(agt.indexOf("msie 4")!=-1));
	var ie5up=(ie&&!ie4);
	var op=(agt.indexOf("opera")!=-1);
	var op5=(agt.indexOf("opera 5")!=-1||agt.indexOf("opera/5")!=-1);
	var op6=(agt.indexOf("opera 6")!=-1||agt.indexOf("opera/6")!=-1);
	var op7up=(op&&!op5&&!op6);
	var jv="1.1";
	if (nn6up||op7up){
		jv="1.5";
	}
	else if ((mac&&ie5up)||op6){
		jv="1.4";
	}
	else if (ie5up||nn4||op5){
		jv="1.3";
	}
	else if (ie4){
		jv="1.2";
	}
	return jv;
}

function dcsFunc(func){
	if (typeof(window[func])=="function"){
		window[func]();
	}
}

// 20060731 ERL - start

//
// Code section to convert parameters to WebTrends Parameter
//

function dcsQP(N)
{
	if (typeof(N)=="undefined")
	{
		return "";
	}

	var qry=location.search.substring(1);
	var pairs=qry.split("&");

	for (var i=0;i<pairs.length;i++)
	{
		var pos=pairs[i].indexOf("=");
		if (pos==-1)
		{
			continue;
		}
		if (pairs[i].substring(0,pos)==N)
		{
			gQP[gQP.length]=((i==0?"":"&")+pairs[i]);
			return pairs[i].substring(pos+1);
		}
	}
	
	return "";
}

// 20060731 ERL - end

dcsVar();
dcsMeta();
dcsFunc("dcsAdv");
dcsTag();

// END OF Basic SmartSource Data Collector TAG=