var _gaq = _gaq || [];
if (window.location.href.search("https://esupport.trendmicro.co.jp") != -1) {
    _gaq.push(['_setAccount', 'UA-11173289-14']);
}
else {
    _gaq.push(['_setAccount', 'UA-11173289-6']);
}
_gaq.push(['_trackPageview']);

(function () {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
var pageTracker = {
    _trackPageview: function (pageUrl) {
        _gaq.push(['_trackPageview', pageUrl]);
        return false;
    }
};