var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-3754163-9']);
_gaq.push(['_trackPageview']);

(function() {
var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

$(function () {
	/*------------------------------------------------------------------------
		ページを開いた際に実行される
	------------------------------------------------------------------------*/
	$("#gNav li a").each(function(){
		var current = "/" + location.href.replace(location.hash,"").split("/").slice(4,5).join("/");

		if ( current != "//" && current != "/" && current != "/index.html" ) {
			if( $(this).attr("href").indexOf(current) != -1 ) {
				$(this).addClass("current");
				$(this).find("img").attr("src",$(this).find("img").attr("src").replace(".gif","_on.gif"));
				$(this).find("img").removeClass("imgover");
			}
		}
	});

	defObj.func.rollover ();
	defObj.func.css3Class ();
	defObj.func.css3Stripe ();
	defObj.func.nthChild ();
	defObj.func.nthType ();
	defObj.func.smoothScroll ();
	//defObj.func.linkBox ();
	//defObj.func.ie6Hover ();
	//defObj.func.recommend ();
	//defObj.func.tabAction();

	//defObj.func.dropDownMenu ({
	//	left: 100, top: 5
	//});

	//defObj.func.visualAnime ({
	//	ctrl: true, mode: 'slide'
	//});

	//for ie6 pngfix
	if　(defObj.param.browser === "msie 6.") {
		$("img[src$=png],.pngfix").fixPng();
	}

	$("pre").each(function() {
		if ( $(this).find("code").length > 0 ) {
			$(this).html($(this).find("code").html());
		}
		$(this).attr("class", "brush:plain;");
	});

	SyntaxHighlighter.all();

	/*------------------------------------------------------------------------
		window.resize時に実行される
	------------------------------------------------------------------------*/
	$(window).resize (function () {

	});

});

