<!-- START OF SDC Cookie Code -->
<!-- Copyright (c) 1996-2005 WebTrends Inc.  All rights reserved. -->
<!-- $DateTime: 2006/03/08 11:31:03 $ -->

// Code section for Use the new first-party cookie generated with this tag.
var gFpc="WT_FPC";
var gConvert=true;

var gDomain="statse.webtrendslive.com";
var gDcsId="dcs095jr800000sp2txzq64eq_4r5t";


if ((typeof(gConvert)!="undefined")&&gConvert&&(document.cookie.indexOf(gFpc+"=")==-1)&&(document.cookie.indexOf("WTLOPTOUT=")==-1)){
	document.write("<SCR"+"IPT TYPE='text/javascript' SRC='"+"http"+(window.location.protocol.indexOf('https:')==0?'s':'')+"://"+gDomain+"/"+gDcsId+"/wtid.js"+"'><\/SCR"+"IPT>");
}

document.write("<SCR"+"IPT TYPE='text/javascript' SRC='../Scripts/jp_sdctag2j_full_JPOnly.js'></SCR"+"IPT>");