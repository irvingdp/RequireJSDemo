/* JP - global stuff */


jQuery(document).ready(function () {

    jQuery('ul#globalNav').superfish();

    jQuery('ul#topNav').superfish();

    autoFill(jQuery("#searchfield"), "");

    function autoFill(id, v) {
        jQuery(id).css({ color: "#b2adad" }).attr({ value: v }).focus(function () {
            if (jQuery(this).val() == v) {
                jQuery(this).val("").css({ color: "#333" });
            }
        }).blur(function () {
            if (jQuery(this).val() == "") {
                jQuery(this).css({ color: "#b2adad" }).val(v);
            }
        });

    }

});

function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}


/****************************************** 
* TELL A FRIEND
*****************************************/

function tell_a_friend() {
    var WindowSet = 'top=100,left=200,width=490,height=660,resizable=0,scrollbars=0,toolbar=0,menubar=0,location=0,status=0';
    var ServerName = "inet.trendmicro.co.jp";
    var sTitle = window.document.title;
    var sURL = window.document.location;
    window.open("https://" + ServerName + "/tell_a_friend/index.asp?t=" + escape(sTitle) + "&u=" + sURL, "_blank", WindowSet);
}


/****************************************** 
* TEXT SIZER
*****************************************/

function textsizer(theSize) {
    if (theSize == 'larger') {
        document.getElementById("textsize").href = "../css/corp_style/larger.css";
    } else if (theSize == "largest") {
        document.getElementById("textsize").href = "../css/corp_style/largest.css";
    } else if (theSize == "normal") {
        document.getElementById("textsize").href = "#";
    }
    createCookie('TM_TextSizer', theSize, 365)
}

function currentSize() {
    var x = readCookie('TM_TextSizer')
    if (x) {
        if (x == 'larger') {
            document.getElementById("textsize").href = "../css/corp_style/larger.css";
        } else if (x == "largest") {
            document.getElementById("textsize").href = "../css/corp_style/largest.css";
        } else if (x == "normal") {
            document.getElementById("textsize").href = "#";
        }
    } else {
        document.getElementById("textsize").href = "../css/corp_style/larger.css";
    }

}

function expander(theID) {
    spanID = document.getElementById(theID);
    spanID.style.display = (spanID.style.display == 'block') ? 'none' : 'block';
}

function expanderBody(theID, allIDs) {
    // spanID = document.getElementById(theID);
    for (var i = 0; i < allIDs; i++) {
        spanID = document.getElementById('expander_' + i);
        if ('expander_' + i == theID)
            spanID.style.display = (spanID.style.display == 'block') ? 'none' : 'block';
        else
            spanID.style.display = 'none';
    }
}

function expanderBodyOpenAll(allIDs) {
    // spanID = document.getElementById(theID);
    for (var i = 0; i < allIDs; i++) {
        spanID = document.getElementById('expander_' + i);
        spanID.style.display = 'block';
    }
}

function expanderBodyClose(theID) {
    spanID = document.getElementById(theID);
    spanID.style.display = 'none';
}



/****************************************** 
* LOGO ANIMATION
*****************************************/

// Set slideShowSpeed (milliseconds)
var slideShowSpeed = 2000;

// Specify the image files
var Pic = new Array();
// to add more images, just continue
// the pattern, adding to the array below


// diese auskommentierte bilder def muss denn ins flex rein

//Pic[0] = '/media/img/logos/01.gif';
//Pic[1] = '/media/img/logos/02.gif';
//Pic[2] = '/media/img/logos/03.gif';
//Pic[3] = '/media/img/logos/04.gif';
//Pic[4] = '/media/img/logos/05.gif';
//Pic[5] = '/media/img/logos/06.gif';
//Pic[6] = '/media/img/logos/07.gif';
//Pic[7] = '/media/img/logos/08.gif';
//Pic[8] = '/media/img/logos/09.gif';
//Pic[9] = '/media/img/logos/10.gif';
//Pic[10] = '/media/img/logos/11.gif';

// Run SlideShow

var t;
var j = 0;
var p = Pic.length;

var preLoad = new Array();
for (i = 0; i < p; i++) {
    preLoad[i] = new Image()
    preLoad[i].src = Pic[i]
}

function runSlideShow() {
    if (document.getElementById("SlideShow") != null) {
        document.getElementById("SlideShow").src = preLoad[j].src;
        j = j + 1;
        if (j > (p - 1)) j = 0;
        t = setTimeout('runSlideShow()', slideShowSpeed);
    }
}


//Run function on window load.
function loadFunctions() {
    runSlideShow();
    currentSize();
}
window.onload = loadFunctions