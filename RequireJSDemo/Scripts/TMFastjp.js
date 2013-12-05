jQuery.fn.exists = function() { return jQuery(this).length > 0; }
function ObjectIsExists(objId) {
    if ((objId == undefined) || (objId == ''))
        return false;
    else
        return jQuery("#" + objId).exists();
}
function validateSearchText(objId) {
    trimTextBox(objId);
    var txt = jQuery("#" + objId).val();

    if (txt == "") {
        alert('キーワードを\r\n入力してください');
        jQuery("#" + objId).focus();
        return false;
    } else if (txt.replace(/\*/g, "").length <= 0) {
        alert(' *（アスタリスク）は他のキーワードと組み合わせて使用してください。');
        jQuery("#" + objId).val("");
        jQuery("#" + objId).focus();
        return false;
    } else if (txt == "キーワードを入力") {
        alert('キーワードを\r\n入力してください');
        jQuery("#" + objId).val("");
        jQuery("#" + objId).focus();
        return false;
    }
    return true;
}


function validateAdvSearchText(objId1, objId2, objId3, objId4) {
    trimTextBox(objId1); trimTextBox(objId2); trimTextBox(objId3); trimTextBox(objId4);
    var length1 = jQuery("#" + objId1).val().length;
    var length2 = jQuery("#" + objId2).val().length;
    var length3 = jQuery("#" + objId3).val().length;
    var length4 = jQuery("#" + objId4).val().length;

    if ((length1 <= 0) && (length2 <= 0) && (length3 <= 0) && (length4 <= 0)) {
        alert('キーワードを\r\n入力してください');
        jQuery("#" + objId2).focus();
        return false;
    }
    var txt = jQuery("#" + objId1).val() + jQuery("#" + objId2).val() + jQuery("#" + objId3).val() + jQuery("#" + objId4).val();
    if (txt.replace(/\*/g, "").length <= 0) {
        alert(' *（アスタリスク）は他のキーワードと組み合わせて使用してください。');
        return false;
    }
    return true;
}
function trimTextBox(objId) {
    jQuery("#" + objId).val(jQuery.trim(jQuery("#" + objId).val()));
}
function objToggle(divId, obj, less, more) {
    if (obj.innerHTML == less) {
        obj.innerHTML = more;
        jQuery("#" + divId).slideDown("slow");
    }
    else {
        obj.innerHTML = less;
        jQuery("#" + divId).slideUp("slow");
    }
    return false;
}
function ShowHideWithCss(objId, objTarget) {
    if (jQuery("#" + objId).hasClass("toggleClose")) {
        jQuery("#" + objTarget).show("fast");
        jQuery("#" + objId).removeClass("toggleClose");
        jQuery("#" + objId).addClass("toggleOpen");
    } else {
        jQuery("#" + objTarget).hide("fast");
        jQuery("#" + objId).removeClass("toggleOpen");
        jQuery("#" + objId).addClass("toggleClose");
    }
    return false;
}
function ShowHideWithImage(objId, objImg, imgShow, imgHide) {
    if (jQuery("#" + objId).css("display") == "none") {
        jQuery("#" + objId).slideDown("slow");
        jQuery("#" + objImg).attr({ src: imgHide });
    } else {
        jQuery("#" + objId).slideUp("slow");
        jQuery("#" + objImg).attr({ src: imgShow });
    }
    return false;
}
function ShowObj(objId) {
    var obj = document.getElementById(objId);
    obj.style.display == "";
    return false;
}
var sortAlpha = true;
function SortAlphabetically(trg) {
    if (sortAlpha == true) {
        sortAlpha = false;
        jQuery(trg).tsort({ order: "asc" });
    } else {
        sortAlpha = true;
        jQuery(trg).tsort({ order: "desc" });
    }
    return false;
}
var sortCount = true;
function SortCount(trg) {
    if (sortCount == true) {
        sortCount = false;
        jQuery(trg).tsort({ order: "asc", attr: "rel" });
    } else {
        sortCount = true;
        jQuery(trg).tsort({ order: "desc", attr: "rel" });
    }
    return false;
}
function AddNavigator(navId, curNavId, objOffset, navText, navValue, SQName, HQName, SQName2, HQName2, SQName3, HQName3, SQName4, HQName4, SPName, SVName, HPName, HVName) {
    if (ObjectIsExists(SQName) && ObjectIsExists(HQName))
        jQuery("#" + SQName).val(jQuery("#" + HQName).val());
    if (ObjectIsExists(SQName2) && ObjectIsExists(HQName2))
        jQuery("#" + SQName2).val(jQuery("#" + HQName2).val());
    if (ObjectIsExists(SQName3) && ObjectIsExists(HQName3))
        jQuery("#" + SQName3).val(jQuery("#" + HQName3).val());
    if (ObjectIsExists(SQName4) && ObjectIsExists(HQName4))
        jQuery("#" + SQName4).val(jQuery("#" + HQName4).val());
    if (ObjectIsExists(SPName) && ObjectIsExists(HPName))
        jQuery("#" + SPName).val(jQuery("#" + HPName).val());
    if (ObjectIsExists(SVName) && ObjectIsExists(HVName))
        jQuery("#" + SVName).val(jQuery("#" + HVName).val());

    var curNav = jQuery("#" + curNavId).val();
    var nav = curNav + "," + navText + ":" + navValue;
    jQuery("#" + navId).val(nav);
    jQuery("#" + objOffset).val("0");
    return true;
}
function RemoveNavigator(navId, curNavId, objOffset, navText, navValue, SQName, HQName, SQName2, HQName2, SQName3, HQName3, SQName4, HQName4, SPName, SVName, HPName, HVName) {
    if (ObjectIsExists(SQName) && ObjectIsExists(HQName))
        jQuery("#" + SQName).val(jQuery("#" + HQName).val());
    if (ObjectIsExists(SQName2) && ObjectIsExists(HQName2))
        jQuery("#" + SQName2).val(jQuery("#" + HQName2).val());
    if (ObjectIsExists(SQName3) && ObjectIsExists(HQName3))
        jQuery("#" + SQName3).val(jQuery("#" + HQName3).val());
    if (ObjectIsExists(SQName4) && ObjectIsExists(HQName4))
        jQuery("#" + SQName4).val(jQuery("#" + HQName4).val());
    if (ObjectIsExists(SPName) && ObjectIsExists(HPName))
        jQuery("#" + SPName).val(jQuery("#" + HPName).val());
    if (ObjectIsExists(SVName) && ObjectIsExists(HVName))
        jQuery("#" + SVName).val(jQuery("#" + HVName).val());

    var curNav = jQuery("#" + curNavId).val();
    var str = "," + navText + ":" + navValue;
    var nav = curNav.replace(str, "");
    jQuery("#" + navId).val(nav);
    jQuery("#" + objOffset).val("0");
    return true;
}

function IncreaseOffset(orgObjId, objId, objSizeId, curPagePosId, pagePosId, SQName, HQName, SQName2, HQName2, SQName3, HQName3, SQName4, HQName4, SPName, SVName, HPName, HVName) {
    if (ObjectIsExists(SQName) && ObjectIsExists(HQName))
        jQuery("#" + SQName).val(jQuery("#" + HQName).val());
    if (ObjectIsExists(SQName2) && ObjectIsExists(HQName2))
        jQuery("#" + SQName2).val(jQuery("#" + HQName2).val());
    if (ObjectIsExists(SQName3) && ObjectIsExists(HQName3))
        jQuery("#" + SQName3).val(jQuery("#" + HQName3).val());
    if (ObjectIsExists(SQName4) && ObjectIsExists(HQName4))
        jQuery("#" + SQName4).val(jQuery("#" + HQName4).val());
    if (ObjectIsExists(SPName) && ObjectIsExists(HPName))
        jQuery("#" + SPName).val(jQuery("#" + HPName).val());
    if (ObjectIsExists(SVName) && ObjectIsExists(HVName))
        jQuery("#" + SVName).val(jQuery("#" + HVName).val());

    var CurPagePos = parseInt(jQuery("#" + curPagePosId).val());
    var PagePos = CurPagePos + 1;
    jQuery("#" + pagePosId).val(PagePos);

    var orgValue = jQuery("#" + orgObjId).val();
    var objSize = jQuery("#" + objSizeId).val();
    jQuery("#" + objId).val(parseInt(orgValue) + parseInt(objSize));
    return true;
}
function DecreaseOffset(orgObjId, objId, objSizeId, curPagePosId, pagePosId, SQName, HQName, SQName2, HQName2, SQName3, HQName3, SQName4, HQName4, SPName, SVName, HPName, HVName) {
    if (ObjectIsExists(SQName) && ObjectIsExists(HQName))
        jQuery("#" + SQName).val(jQuery("#" + HQName).val());
    if (ObjectIsExists(SQName2) && ObjectIsExists(HQName2))
        jQuery("#" + SQName2).val(jQuery("#" + HQName2).val());
    if (ObjectIsExists(SQName3) && ObjectIsExists(HQName3))
        jQuery("#" + SQName3).val(jQuery("#" + HQName3).val());
    if (ObjectIsExists(SQName4) && ObjectIsExists(HQName4))
        jQuery("#" + SQName4).val(jQuery("#" + HQName4).val());
    if (ObjectIsExists(SPName) && ObjectIsExists(HPName))
        jQuery("#" + SPName).val(jQuery("#" + HPName).val());
    if (ObjectIsExists(SVName) && ObjectIsExists(HVName))
        jQuery("#" + SVName).val(jQuery("#" + HVName).val());


    var CurPagePos = parseInt(jQuery("#" + curPagePosId).val());
    var PagePos = CurPagePos - 1;
    jQuery("#" + pagePosId).val(PagePos);

    var orgValue = jQuery("#" + orgObjId).val();
    var objSize = jQuery("#" + objSizeId).val();
    jQuery("#" + objId).val(parseInt(orgValue) - parseInt(objSize));
    return true;
}
function newSearch(hfldNavigator, hfldOffset, SQName, SPName, SVName, HQName, HPName, HVName, isFastPage, isLocalPath, isAdvSearch) {
    var existSQName = ObjectIsExists(SQName);
    var existHQName = ObjectIsExists(HQName);

    if (isAdvSearch != undefined && isAdvSearch) {

        if (!validateAdvSearchText(SQName, SQName + '2', SQName + '3', SQName + '4')) {
            return false;
        }
    }
    else {

        if (!existSQName || !validateSearchText(SQName)) {
            return false;
        }
    }

    if (ObjectIsExists(hfldNavigator))
        jQuery("#" + hfldNavigator).val("");

    if (ObjectIsExists(hfldOffset))
        jQuery("#" + hfldOffset).val("0");

    if (ObjectIsExists("fastsearch_chkJPKB"))
        fastsearch_btnSearch_onclick(isLocalPath);
    if (isFastPage == true)
        return true;
    else
        return false;
}

var defaultVersionString = "バージョンを選んでください";
function OnJSONPVersionResponse(objId, defValue, result) {
    jQuery("#" + objId).empty();
    jQuery("#" + objId).append(GenOption(defaultVersionString, "", true));
    var c = eval(result);
    for (var i = 0; i < c.length; i++) {
        if (defValue == c[i]) {
            jQuery("#" + objId).append(GenOption(c[i], c[i], true));
        }
        else {
            jQuery("#" + objId).append(GenOption(c[i], c[i], false));
        }
    }
}

function OnJSONPServerResponse(objId, defValue, result) {
    var hasTopProduct = false;
    var optTopGroup = jQuery(document.createElement("optgroup"));
    optTopGroup.attr("label", "主要製品");
    var optGroup = jQuery(document.createElement("optgroup"));
    optGroup.attr("label", "その他の製品");
    var c = eval(result);
    var isLoadDef = false;
    var topCount = 0;
    var otherCount = 0;
    defValue = unescape(defValue);
    for (var i = 0; i < c.length; i++) {
        if (c[i].Key == "1") {
            topCount = topCount + 1;
            hasTopProduct = true;
            if ((isLoadDef == false) && (defValue == c[i].Value)) {
                isLoadDef = true;
                optTopGroup.append(GenOption(c[i].Value, c[i].Value, true));
            }
            else {
                optTopGroup.append(GenOption(c[i].Value, c[i].Value, false));
            }
        }
        else {
            otherCount = otherCount + 1;
            if ((isLoadDef == false) && (defValue == c[i].Value)) {
                isLoadDef = true;
                optGroup.append(GenOption(c[i].Value, c[i].Value, true));
            }
            else {
                optGroup.append(GenOption(c[i].Value, c[i].Value, false));
            }
        }
    }
    jQuery("#" + objId).empty();
    jQuery("#" + objId).append(GenOption("製品名を選んでください", "", true));
    if (hasTopProduct) {
        jQuery("#" + objId).append(optTopGroup);
        jQuery("#" + objId).append(optGroup);
    }
    else {
        jQuery("#" + objId).append(optGroup.html());
    }
}


function GetProduct(objId, defValue, pCategory, isLocalPath) {

    if (jQuery.browser.msie) {
        defValue = escape(defValue);
    }

    var url = "";
    if (isLocalPath == undefined || isLocalPath != true) {
        url = getScr();
    }

    if (pCategory == undefined || pCategory == "") {
        pCategory = "CORPORATE";
    }
    url = url + "/_layouts/eSupportjp.WSAPI/TMProductjp.ashx?objId=" + objId + "&defValue=" + defValue + "&pCategory=" + pCategory;

    // if pages has been regisity the sever, then set
    var oldScript = document.getElementById(url);
    if (oldScript) {
        oldScript.setAttribute("src", url);
        return;
    }
    jQuery.getScript(url);

}
function GetVersion(objId, product, defValue, pCategory, isLocalPath) {
    if (jQuery.browser.msie) {
        defValue = escape(defValue);
    }

    var url = "";
    if (isLocalPath == undefined || isLocalPath != true) {
        url = getScr();
    }

    if (jQuery.browser.msie) {
        product = escape(product);
    }

    url = url + "/_layouts/eSupportjp.WSAPI/TMVersionjp.ashx?objId=" + objId + "&product=" + product + "&defValue=" + defValue + "&pCategory=" + pCategory;
    var oldScript = document.getElementById(url);
    if (oldScript) {
        oldScript.setAttribute("src", url);
        return;
    }
    jQuery.getScript(url);
}



function GenOption(text, value, blnSelected) {
    var option = jQuery(document.createElement("option"));
    option.text(text);
    option.attr("value", value);
    if (blnSelected)
        option.attr("selected", "selected");
    return option;
}

function setPageSize(objId, objHid) {
    jQuery("#" + objHid).val(jQuery("#" + objId).val());
}

function GetSubSite() {
    var url = window.location.href.split("/");
    var subSite = "consumer";
    if (url.length > 4) {
        subSite = url[3];
    }

    if ((subSite.toLowerCase() != "consumer") && (subSite.toLowerCase() != "smb") && (subSite.toLowerCase() != "enterprise")) {
        subSite = "consumer";
    }
    return subSite;
}
function DoSearch(objSearch, objProduct, strSegment) {
    if (!validateSearchText(objSearch)) {
        return false;
    }
    var url = window.location.href.split("/");
    var subSite = "consumer";
    var paramT = "";

    if ((strSegment != undefined) && (strSegment != "")) {
        subSite = strSegment;
    }
    if ((subSite.toLowerCase() != "smb") && (subSite.toLowerCase() != "enterprise")) {
        subSite = "consumer";
    }
    paramT = "t=1";
    window.location.href = '/' + subSite + '/FASTSearch.aspx?' + paramT + '&p=' + encodeURIComponent(jQuery('#' + objProduct).val()) + '&q=' + encodeURIComponent(jQuery('#' + objSearch).val());

    return false;
}
function DoPVSearch(objSearch, objProduct, objVersion, objScope) {
    if (!validateSearchText(objSearch)) {
        return false;
    }
    var url = window.location.href.split("/");
    var subSite = GetSubSite();
    var param2 = "", param3 = "", param4 = "";
    if (jQuery('#' + objProduct).val() != "") {
        param2 = "&p=" + encodeURIComponent(jQuery('#' + objProduct).val());
    }
    if (jQuery('#' + objVersion).val() != "") {
        param3 = "&v=" + encodeURIComponent(jQuery('#' + objVersion).val());
    }
    if (jQuery('#' + objScope).attr("checked") == true) {
        param4 = "t=1";
    } else {
        param4 = "t=2";
    }
    window.location.href = '/' + subSite + '/FASTSearch.aspx?' + param4 + param2 + param3 + '&q=' + encodeURIComponent(jQuery('#' + objSearch).val());
    return false;
}
function chkKeyPressDoSearch(e, obj1, obj2, segment) {
    var keycode;
    if (e && e.which) {
        e = e;
        keycode = e.which;
    }
    else {
        e = event
        keycode = e.keyCode
    }
    if (keycode == 13) {
        DoSearch(obj1, obj2, segment);
        return false;
    }
}

var swap_val = "キーワードを入力";
function SwapFocusIn(obj) {
    if (obj.value == swap_val) {
        obj.value = "";
    }
}

function SwapFocusOut(obj) {
    if (jQuery.trim(obj.value) == "") {
        obj.value = swap_val;
    }
}

//fix the DefaultButton doesn't work in FF and other browsers.
function WebForm_FireDefaultButton(event, target) {

    //event.srcElement doesn't work in FF so we check whether
    //it or event.target exists, using whichever is returned
    var element = event.target || event.srcElement;
    var __nonMSDOMBrowser = (window.navigator.appName.toLowerCase().indexOf('explorer') == -1);

    if (event.keyCode == 13 &&
        !(element &&
        element.tagName.toLowerCase() == "textarea")) {
        if (jQuery.browser.opera || jQuery.browser.mozilla) {
            return false;
        }
        var defaultButton;
        if (__nonMSDOMBrowser) {
            defaultButton = document.getElementById(target);
        }
        else {
            defaultButton = document.all[target];
        }
        if (defaultButton) {
            if (typeof defaultButton.click != "undefined") {
                defaultButton.click();
                event.cancelBubble = true;
                if (event.stopPropagation) {
                    event.stopPropagation();
                }
                return false;
            } else if (typeof defaultButton.onclick != "undefined") {
                defaultButton.onclick();
                event.cancelBubble = true;
                if (event.stopPropagation) {
                    event.stopPropagation();
                }
                return false;
            }
        }
    }
    return true;
}

function lnkSortby_Click(sortby) {
    document.getElementById('ctl00_PlaceHolderMain_hflSortby').value = sortby;
}

function search_Scope_Count(objJPKB, objJPVE, objENKB, objENVE, objHflSearchScope) {
    var scope = 0;

    var existchkJPKB = ObjectIsExists(objJPKB);
    var existchkJPVE = ObjectIsExists(objJPVE);
    var existchkENKB = ObjectIsExists(objENKB);
    var existchkENVE = ObjectIsExists(objENVE);

    if (existchkJPKB && (jQuery("#" + objJPKB).attr("checked") == true))
        scope = scope + 1;
    if (existchkJPVE && (jQuery("#" + objJPVE).attr("checked") == true))
        scope = scope + 2;
    if (existchkENKB && (jQuery("#" + objENKB).attr("checked") == true))
        scope = scope + 4;
    if (existchkENVE && (jQuery("#" + objENVE).attr("checked") == true))
        scope = scope + 8;


    if (ObjectIsExists(objHflSearchScope) && !existchkJPKB && !existchkJPVE && !existchkENKB && !existchkENVE) {
        var scopeCollection = encodeURIComponent(jQuery("#" + objHflSearchScope).val()).toLowerCase();
        if (scopeCollection.indexOf("jpkb") >= 0)
        { scope = 1; }
        if (scopeCollection.indexOf("jpve") >= 0)
        { scope += 2; }
        if (scopeCollection.indexOf("enkb") >= 0)
        { scope += 4; }
        if (scopeCollection.indexOf("enve") >= 0)
        { scope += 8; }
    }
    return scope;
}


function fastsearch_btnSearch_onclick(isLocalPath) {
    var url = "";
    if (isLocalPath == undefined || isLocalPath != true) {
        url = getScr();
    }
    url = url + '/corporate/FASTSearch.aspx?q=' + encodeURIComponent(jQuery("#fastsearch_tbxSearchString").val());
    var scope = search_Scope_Count("fastsearch_chkJPKB", "fastsearch_chkJPVE", "fastsearch_chkENKB", "fastsearch_chkENVE", "fastsearch_hflSearchScope");

    if (scope > 0) { url = url + '&t=' + scope; }
    if (ObjectIsExists("fastsearch_selProduct") && (jQuery("#fastsearch_selProduct")[0].selectedIndex != 0)) {
        var selectedProduct = jQuery("#fastsearch_selProduct").val();
        url = url + '&p=' + encodeURIComponent(selectedProduct);

        if (ObjectIsExists("fastsearch_selVersion") && (jQuery("#fastsearch_selVersion")[0].selectedIndex != 0)) {
            var selectedVersion = jQuery("#fastsearch_selVersion").val();
            url = url + '&v=' + encodeURIComponent(selectedVersion);
        }
    }

    var Segment = ObjectIsExists('fastsearch_hflCurSegment') ? jQuery('#fastsearch_hflCurSegment').val() : "CORPORATE";
    Segment = Segment.toUpperCase();
    if (Segment != "CONS" && Segment != "SB" && Segment != "MB" && Segment != "ENT" && Segment != "PR" && Segment != "CP" && Segment != "CORPORATE") {
        Segment = "CORPORATE";
    }
    url = url + '&g=' + Segment;
    window.location = url;
    return true;
}

function validateText(isLocalPath, hflSearchString) {
    hasString = validateSearchText("fastsearch_tbxSearchString");
    if (hasString)
        fastsearch_btnSearch_onclick(isLocalPath);
}


function GetSolution(rt, oid, pn) {
    jQuery.getJSON("/_layouts/eSupportjp.WSAPI/TMSolutionjp.ashx?t=" + rt + "&p=" + encodeURIComponent(pn) + "&callback=?", function(data) {
        jQuery("#" + oid).html("");
        if (data.length > 0) {
            var ulObj = jQuery(document.createElement("ul"));
            for (var i = 0; i < data.length; i++) {
                var liObj = jQuery(document.createElement("li"));
                liObj.append("<a href=\"" + data[i].Link + "\">" + data[i].Title + "</a>");
                ulObj.append(liObj);
            }
            jQuery("#" + oid).append(ulObj);
        }
    });
}


function ProductVersionInit(SPName, SVName, HPName, HVName, SegName, isLocalPath, SQName, HQName, SQName2, HQName2, SQName3, HQName3, SQName4, HQName4) {
    var segment = ObjectIsExists(SegName) ? jQuery("#" + SegName).val() : "";
    var defProduct = ObjectIsExists(HPName) ? jQuery("#" + HPName).val() : "";
    var defVersion = ObjectIsExists(HVName) ? jQuery("#" + HVName).val() : "";

    if (ObjectIsExists(SQName) && ObjectIsExists(HQName)) {
        if ((jQuery("#" + HQName).val().length == 0) && !ObjectIsExists(SQName2))
            jQuery("#" + SQName).val(swap_val);
        else {
            jQuery("#" + SQName).val(jQuery("#" + HQName).val());
        }

    }

    if (ObjectIsExists(SQName2) && ObjectIsExists(HQName2)) {
        jQuery("#" + SQName2).val(jQuery("#" + HQName2).val());
    }

    if (ObjectIsExists(SQName3) && ObjectIsExists(HQName3)) {
        jQuery("#" + SQName3).val(jQuery("#" + HQName3).val());
    }

    if (ObjectIsExists(SQName4) && ObjectIsExists(HQName4)) {
        jQuery("#" + SQName4).val(jQuery("#" + HQName4).val());
    }

    if (SVName != '') {
        GetProduct(SPName, defProduct, segment, isLocalPath);
        jQuery("#" + SPName).change(function() {
            GetVersion(SVName, jQuery(this).val(), defVersion, segment, isLocalPath);
        });
        GetVersion(SVName, defProduct, defVersion, segment, isLocalPath);
    }
    else {
        GetProduct(SPName, defProduct, segment, isLocalPath);
    }
}


function getScr() {
    var siteUrl = "";
    jQuery("script").each(function() {
        if (this.src.indexOf("TMFastjp.js", 0) > 0) {
            var urls = this.src.split("/");
            if (urls.length >= 3) {
                siteUrl = urls[0] + "//" + urls[2];
            }
        }
    });
    return siteUrl;
}