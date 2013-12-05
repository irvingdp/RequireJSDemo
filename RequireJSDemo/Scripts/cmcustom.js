var cm_UseUTF8=true;
/* Blocks impression tracking and addresses duplicate link counting
 *
 */
 
cmSetupOther({"cm_UseCookie":false,"cm_TrackImpressions":""});


/* Creates an Error Tag
 *
 */
function cmCreateErrorTag(pageID, categoryID) {
	if(pageID == null) {
		pageID = cmGetDefaultPageID();
	}
	cmMakeTag(["tid","404","pi",pageID,"cg",categoryID,"pc","Y"]);
}


/* Get Cookie Domain - JAPAN
 *
 */
function cmJPGetCookieDomain() {
	var JPdomains = new Array("trendmicro.co.jp",
							"smp.ne.jp",
							"trendmicro.com",
							"tmqa.jp",
							"is702.jp",
							"tm-secureweb.jp",
							"vb-blog.jp",
							"trendflexsecurity.jp",
							"trendmicro-business-blog.jp",
							"virusbuster.jp",
							"ehosts.net"
							);

	for(var i = 0; i < JPdomains.length; i ++) {
		if(location.hostname.indexOf(JPdomains[i], 0) != -1){
			return JPdomains[i];
		}
	}

	/* return default domain */
	return "trendmicro.com";
}


/* Get Cookie Domain - CWA
 *
 */
function cmCWAGetCookieDomain() {
	var CWAdomains = new Array("trendsecure.com",
							"antivirus.com",
							"securecloud.com",
							"mediaroom.com",
							"liveperson.net",
							"trendmicro.com.au",
							"trendmicro-europe.com",
							"pccillin.com.tw",
							"digitalriver.com",
							"trendnet.org",
							"trendmicro.co.nz",
							"trendmicro-apac.com",
							"findmyorder.com"
							);

	for(var i = 0; i < CWAdomains.length; i ++) {
		if(location.hostname.indexOf(CWAdomains[i], 0) != -1){
			return CWAdomains[i];
		}
	}

	/* return default domain */
	return "trendmicro.com";
}


/* Link Leashing
 *
 */
 
function cmCustomLinkClickHandler(link) {
	if (link.href.indexOf("CWA-pageAssetEvent") > -1) {
		cmCreateConversionEventTag(link.href,"2","PAGE ASSET","0");
	}
	if (link.href.indexOf(".pdf") > -1) {
		cmCreatePageviewTag(link.href, "PDFDOWNLOAD");
	}
	if (link.href.indexOf(".dat") > -1) {
		cmCreatePageviewTag(link.href, "DATDOWNLOAD");
	}
	if (link.href.indexOf(".mp3") > -1) {
		cmCreatePageviewTag(link.href, "MP3DOWNLOAD");
	}
	if (link.href.indexOf(".mp4") > -1) {
		cmCreatePageviewTag(link.href, "MP4DOWNLOAD");
	}
	if (link.href.indexOf(".exe") > -1) {
		cmCreatePageviewTag(link.href, "EXEDOWNLOAD");
	}
	if (link.href.indexOf(".txt") > -1) {
		cmCreatePageviewTag(link.href, "TXTDOWNLOAD");
	}
	if (link.href.indexOf(".ppt") > -1) {
		cmCreatePageviewTag(link.href, "PPTDOWNLOAD");
	}
	if (link.href.indexOf(".xls") > -1) {
		cmCreatePageviewTag(link.href, "XLSDOWNLOAD");
	}
	if (link.href.indexOf(".doc") > -1) {
		cmCreatePageviewTag(link.href, "DOCDOWNLOAD");
	}
	if (link.href.indexOf(".zip") > -1) {
		cmCreatePageviewTag(link.href, "ZIPDOWNLOAD");
	}
	if (link.href.indexOf(".bin") > -1) {
		cmCreatePageviewTag(link.href, "BINDOWNLOAD");
	}
}
//-->=