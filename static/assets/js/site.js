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

$(function () {
// localStorage DataModel
// 	userid: "ano_001",
// 	pageviews: [
// 		{
			// url: "xxxx",
// 			count: 0,
// 			lastmod: 2015/10/11
// 		}
// 	]

// TODO
// - 変数の命名見直し
// - リファクタ
// - show / hideのコード共通化
// - 接頭語見直し asc　Considerate

	function searchArray(array, value) {
		for ( var i = 0; i < array.length; i++ ){
			if ( array[i].url == value ) {
				return i + 1;
			}
		}

		return false;
	}

	// logging
	var href = location.pathname;
	var storage = localStorage.getItem("_asc");

	if ( storage == null ) {
		storage = {
			username: Date.now(),
			pageviews: [

			],
			lastmod: Date.now()
		}
	}
	else {
		storage = JSON.parse(storage);
	}

	if ( searchArray(storage.pageviews, href) ) {
		var idx = searchArray(storage.pageviews, href) - 1;
		storage.pageviews[idx].count = storage.pageviews[idx].count + 1;
		storage.lastmod = Date.now();
	}
	else {
		storage.pageviews.push({
			url: href,
			count: 1,
			lastmod: Date.now()
		})
	}

	storage.lastmod = Date.now();

	localStorage.setItem("_asc", JSON.stringify(storage));

	// asc-show
	$("[data-asc-show]").each(function() {
		var $this = $(this);
		var conditions = $this.data("asc-show");
		var flag = 0;

		//条件の数分だけ繰り返す
		for ( var i = 0; i < conditions.length; i++ ) {
			var condition = conditions[i];
			var regex = new RegExp(condition.regex);
			var count = condition.count;
			var localcount = 0;

			//条件を満たしたかどうか
			for ( var j = 0; j < storage.pageviews.length; j++ ) {
				var pageview = storage.pageviews[j];

				if ( regex.test( pageview.url ) ) {
					localcount = localcount + pageview.count;
				}
			}

			if ( localcount >= count ) {
				flag++;
			}
		}

		if ( flag == conditions.length ) {
			$this.show();
		}
		else {
			$this.remove();
		}
	});

	// asc-hide
	$("[data-asc-hide]").each(function() {
		var $this = $(this);
		var conditions = $this.data("asc-hide");
		var flag = 0;

		//条件の数分だけ繰り返す
		for ( var i = 0; i < conditions.length; i++ ) {
			var condition = conditions[i];
			var regex = new RegExp(condition.regex);
			var count = condition.count;
			var localcount = 0;

			//条件を満たしたかどうか
			for ( var j = 0; j < storage.pageviews.length; j++ ) {
				var pageview = storage.pageviews[j];

				if ( regex.test( pageview.url ) ) {
					localcount = localcount + pageview.count;
				}
			}

			if ( localcount >= count ) {
				flag++;
			}
		}

		if ( flag == conditions.length ) {
			$this.remove();
		}
		else {
			$this.show();
		}
	});

	// 目次
	var array = [];
	//array
		// - id
		// - text
		// - child - id / - text

	var start = 0;
	var end = 0;
	var all = $(".entry-body").children();
	var contentHTML = $(".entry-body");
	var target = $("<ul />").addClass("entry-outline");

	var h4Count = 0;

	contentHTML.find("h2").each(function(i){
		var array_temp = new Object;
		array_temp.child = [];

		end = $(this).nextAll("h2").eq("0").index();

		if ( end == -1 ) {
			end = all.length;
		}

		var count = all.slice(start,end).filter("h4").length - 1;
		array_temp.id = "h2-" + (i+1);
		$(this).attr("id","h2-" + (i+1));

		array_temp.text = $(this).text();

		all.slice(start,end).filter("h4").each(function(i){
			var array_temp2 = new Object;
			h4Count++;
			array_temp2.id = "h4-" + h4Count;
			array_temp2.text = $(this).text();

			$(this).attr("id","h4-" + h4Count);

			array_temp.child.push(array_temp2);
		});

		start = end;

		array.push(array_temp);
	});

	for ( var i=0; i < array.length; i++ ){
		var tmpl = '<li><a href="#{{id}}">{{text}}</a></li>'
		tmpl = tmpl.replace("{{id}}", array[i].id);
		tmpl = tmpl.replace("{{text}}", array[i].text);

		target.append(tmpl);
	}

	console.log(array);

	if ( array.length > 0 ) {
		$(".entry-body").before(target);
		defObj.func.smoothScroll ();
	}
});

