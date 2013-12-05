/* ############### JP ################## */
/* taken from JP 190207&modified	alex */

function popImg(url,name,width,height,scroller)
{
	width = width + 6;
	height = height + 40;
	var outStr = 'height=' + height + ',width=' + width;
   
	if (scroller != 'true')
	{
		outStr = outStr + ',menubar=no,toolbar=no,location=no,directories=no,status=no,resizable=no,';
	}else {
		outStr = outStr + ',menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=no,resizable=no';
	}
	
	imageWindow = window.open('', name, outStr);
	imageWindow.document.open();
	imageWindow.document.write("<!DOCTYPE HTML PUBLIC '-//W3C//DTD HTML 4.01 Transitional//EN' 'http://www.w3.org/TR/html4/loose.dtd'>");
	imageWindow.document.write("<html><head><title>Trend Micro Japan</title>");
	imageWindow.document.write("<meta http-equiv='content-language' content='ja'/><meta http-equiv='Content-Type' content='text/html; charset=UTF-8'/><meta http-equiv='Content-Script-Type' content='text/javascript'/><meta http-equiv='Content-Style-Type' content='text/css'/>");
	imageWindow.document.write("<link rel='stylesheet' href='/css/jp/popup.css' type='text/css' media='screen' /></head>");
	imageWindow.document.write("<body>");
	imageWindow.document.write("<p class='closewindow_rt'><a href='javascript:self.close();'>Close Window</a></p>");
	imageWindow.document.write("<p class='bigimg'><img src='");
	imageWindow.document.write(url);
	imageWindow.document.write("'border='0' alt='Trend Micro Japan' /></p>");
	imageWindow.document.write("</body></html>");
	imageWindow.focus()   
	imageWindow.document.close();
}

var newWindow = null;

function closeWin() {
    if (newWindow != null) {
        if (!newWindow.closed)
            newWindow.close();
    }
}

function popUpWin(url, type, strWidth, strHeight) {

    closeWin();

    if (type == "fullScreen") {
        strWidth = screen.availWidth - 10;
        strHeight = screen.availHeight - 160;
    }

    var tools = "";
    if (type == "standard" || type == "fullScreen") tools = "resizable,toolbar=yes,location=yes,scrollbars=yes ,menubar=yes,width=" + strWidth + ",height=" + strHeight + ",top=0,left=0";
    if (type == "console") tools = "resizable,toolbar=no,location=no,scrollbars=no,width=" + strWidth + ",height=" + strHeight + ",left=0,top=0 ";
    newWindow = window.open(url, 'newWin', tools);
    newWindow.focus();
}