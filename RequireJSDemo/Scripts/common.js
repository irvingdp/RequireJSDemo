
//header pulldown

$(function() {
	$("#products_list").hover(function() {
		$(this).children('dd').show();
	}, function() {
		$(this).children('dd').hide();
	});
});