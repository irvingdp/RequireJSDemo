function addEventCallback(obj, handler, callback) {
var tmp = obj[handler];
obj[handler] = function () { if (tmp) tmp(); callback(); };
}

addEventCallback(window, "onload", function() {
rolloverManager.initialize();
// 起動時イベントは必ずここに追加してください。
});

/*
	Standards Compliant Rollover Script
	Author : Daniel Nolan
	http://www.bleedingego.co.uk/webdev.php

	Modifier: Concent, Inc., 2007-07-25
	- not only 'img' objects, but 'input', 'area' (imagemap) are available.
	- you can change image file suffix with a classname like 'rollover_suffix'.
	- window.onload binding mechanism is changed.
*/

var rolloverManager = new function() {
	var that = this; // save the context, to be used in private method.
	this.rolloverClass = 'rollover';
	this.defaultRolloverImageSuffix = '_on';

this.initialize = function() {
	setRollovers('img',   function(image) {return (true);                 });
	setRollovers('input', function(input) {return (input.type == 'image');});
	return that;
}

function getRolloverClass(anObject) {
	var rolloverClassRe = new RegExp('^(' + that.rolloverClass + ')(.*)');
	if (!anObject.className) return null;
	var classNames = anObject.className.split(' ');
	var i, n;
	for (i = 0, n = classNames.length; i < n; i++) {
		var classNameElements = classNames[i].match(rolloverClassRe);
		if (classNameElements) return classNameElements;
		// returns an array [class_full, class_base, class_extension]
	}
	return null;
}

function setRollovers(targetTag, isRolloverObject) {
	var aImages = document.getElementsByTagName(targetTag); //like 'img', 'input',...
	var i, n;
	for (i = 0, n = aImages.length; i < n; i++) {		
		var image = aImages[i];
		if (!image.className) continue;
		if (!getRolloverClass(image)) continue;
		if (!isRolloverObject(image)) continue;
		if (image.useMap) { // case of clickable map
			setRolloversClickableMap(image);
			continue; // next image
		}
		setRollover(image);
	}
}
function setRolloversClickableMap(image) {
	var mapId = image.useMap.match(/^\#(.*)/)[1]; // cut off the initial "#"
	var areas = document.getElementById(mapId).areas;
	var i, n;
	for (i = 0, n = areas.length; i < n; i++) {
		if (getRolloverClass(areas[i])) {
			setRollover(image, areas[i]);
		}
	}
}

function setRollover(targetImage, eventCaptureObject) {
	// if eventCaptureObject catch some mouseover/mouseout event,
	// then replace the image source of targetImage.
	var src = targetImage.src;

	if (!eventCaptureObject) eventCaptureObject = targetImage;
	var rolloverImageSuffix = getRolloverClass(eventCaptureObject)[2] // _XX of rollover_XX
		|| that.defaultRolloverImageSuffix;                       // _on

	var ftype = src.substring(src.lastIndexOf('.'), src.length);
	var hsrc = src.replace(ftype, rolloverImageSuffix + ftype);
	var mouseoverImage = new Image();
	var mouseoutImage  = new Image();

	mouseoverImage.src = hsrc;	// preload mouseover image
	mouseoutImage.src  = src;	// save as mouseout image

	eventCaptureObject.onmouseover = function() {
		targetImage.src = hsrc;
	}	
	
	eventCaptureObject.onmouseout = function() {
		targetImage.src = src;
	}
}
} // /rolloverManager
