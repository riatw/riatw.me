$("a").each(function(){
	var _this = $(this);
	var url = _this.attr("href");
	var childLength = _this.find("img").length;
	var target = _this;

	if ( childLength == 0 ) {
		if ( url.match(/\.pdf$/) ) {
			$("<span />").addClass("m-icon-pdf").appendTo(target);
			$(this).attr("target","_blank");
		}
		else if ( url.match(/^http/) && url.indexOf("riatw.me") == -1 ) {
			$("<span />").addClass("m-icon-new-tab").css("marginLeft","10px").appendTo(target);
			$(this).attr("target","_blank");
		}
	}
});