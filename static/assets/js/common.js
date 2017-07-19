/*----------------------------------------------
 JavaScript ( jQuery ) Template
 coding. Kobayashi Kazuhiro

 jQuery1.7+
----------------------------------------------*/

/*----------------------------------------------
 サイト内で使用するObjectの作成
 defObj.param	: 関数間で共通して使用するパラメーター
 defObj.func	: 関数
----------------------------------------------*/
var defObj			= {};
defObj.param		= {};
defObj.func			= {};

/*----------------------------------------------
 パラメーター
------------------------------------------------
 defObj.func メソッドで共通して使用するもの
 頻繁に変更が必要だと考えられるもの
----------------------------------------------*/
defObj.param	= {

	//browser
	arrBrowser	: [
					'msie 6.',
					'msie 7.',
					'msie 8.',
					'msie 9.',
					'msie 10.',
					'msie 11.',
					'firefox',
					'opera',
					'chrome',
					'safari'
				  ],
	browser		: null,

	//smartphone
	arrSp		: [
					'iphone',
					'ipad',
					'android',
					'Windows Phone'
				  ],
	smartPhone	: null,

	//import js
	arrJs		: [
					'vendor/fixHeight.js',
					'vendor/syntaxhighlighter/shCore.js',
					'vendor/syntaxhighlighter/shBrushCss.js',
					'vendor/syntaxhighlighter/shBrushJScript.js',
					'vendor/syntaxhighlighter/shBrushPhp.js',
					'vendor/syntaxhighlighter/shBrushPlain.js',
					'vendor/syntaxhighlighter/shBrushSass.js',
					'vendor/syntaxhighlighter/shBrushXml.js',
					'vendor/syntaxhighlighter/shBrushBash.js',
					'vendor/jquery.add-icon.js'
				  ]
};


/*----------------------------------------------
 このファイルが読み込まれたタイミングで実行される関数
----------------------------------------------*/
checkBrowser ();
importJs ( defObj.param.arrJs );


/*----------------------------------------------
 関数一覧
------------------------------------------------
 1. 基本的にdefObj.func Objectにメソッドを追加
 2. メソッドと同名の関数を代入
 3. メソッド間での使用が求められない関数は
	メッソド内で関数定義
 4. default値を設定する場合は、$.extendを使用
----------------------------------------------*/
/*----------------------------------------------
 @disc	: browserのuseragentを判定。
		  defObj.param.arrBrowser, defObj.param.arrSpの
		  配列内でUAに一致したものを
		  defObj.param.browser, defObj.param.smartPhoneに
		  代入する
 @param	: -
 @ret	: -
----------------------------------------------*/
defObj.func.checkBrowser	= checkBrowser;
function checkBrowser ( options ) {

	var c	= $.extend ( {
		arrBrowser	: defObj.param.arrBrowser,
		arrSp		: defObj.param.arrSp
	}, options );

	var userAgent	= window.navigator.userAgent;
	var browserLoop	= c.arrBrowser.length;
	var spLoop		= c.arrSp.length;

	for ( var i = 0; i < browserLoop; i ++ ) {

		var patern		= new RegExp ( c.arrBrowser[i], 'i' );

		if ( userAgent.match( patern ) ) {
			defObj.param.browser	= c.arrBrowser[i];
			return;
		}
	}

	for ( var i = 0; i < spLoop; i ++ ) {

		var patern		= new RegExp ( c.arrSp[i], 'i' );

		if ( userAgent.match( patern ) ) {
			defObj.param.smartPhone	= c.arrSp[i];
			return;
		}
	}
}


/*----------------------------------------------
 @disc	: yuga.jsのrolloverメソッドを編集
 @param	: -
 @ret	: -

 Copyright (c) 2009 Kyosuke Nakamura (kyosuke.jp)
 Licensed under the MIT License:
 http://www.opensource.org/licenses/mit-license.php
----------------------------------------------*/
defObj.func.rollover	= rollover;
function rollover ( options ) {

	var c	= $.extend ( {
		hoverSelector	: '.imgover, .allimg img',
		groupSelector	: '.imggroup',
		filterSelector	: '.noOver',
		postfix			: '_on',
		current			: '_cr'
	}, options );

	var rolloverImgs	= $( c.hoverSelector ).filter( isNoRollover ).filter( isNotCurrent );
	rolloverImgs.each ( function () {
		this.originalSrc		= $(this).attr( 'src' );
		this.rolloverSrc		= this.originalSrc.replace ( new RegExp('(' + c.postfix + ')?(\.gif|\.jpg|\.png)$'), c.postfix + '$2' );
		this.rolloverImg		= new Image;
		this.rolloverImg.src	= this.rolloverSrc;
		this.currentSrc			= this.originalSrc.replace ( new RegExp('(' + c.current + ')?(\.gif|\.jpg|\.png)$'), c.current + '$2' );
	} );

	var groupingImgs	= $( c.groupSelector ).find('img').filter( isNoRollover ).filter( isRolloverImg );

	rolloverImgs.not( groupingImgs ).hover( function () {
		$(this).attr( 'src', this.rolloverSrc );
	},
	function () {
		$(this).attr( 'src', this.originalSrc );
	} );

	$( c.groupSelector ).hover( function () {
		$(this).filter( isNoRollover ).find( 'img' ).filter( isRolloverImg ).each( function () {
			$(this).attr( 'src', this.rolloverSrc );
		});
	}, function(){
		$(this).filter( isNoRollover ).find( 'img' ).filter( isRolloverImg ).each( function () {
			$(this).attr( 'src', this.originalSrc );
		});
	});

	//filter function
	function isNotCurrent(){
		return Boolean( ! this.currentSrc );
	}
	function isRolloverImg(){
		return Boolean( this.rolloverSrc );
	}

	function isNoRollover () {
		var str		= c.filterSelector.replace( new RegExp ( /[ |　]/g ), '' );
		var arr		= str.split(',');

		var loopNum		= arr.length;
		for ( var i = 0; i < loopNum; i ++ ) {

			if( $(this).is( $( arr[i] ) ) ) {
				return false;
				break;
			}
		}
		return true;
	}
}


/*----------------------------------------------
 @disc	: 引数の配列に記述されたjsを書き出す
 @param	: -
 @ret	: -
----------------------------------------------*/
defObj.func.importJs	= importJs;

function importJs ( param ) {

	var jsfiles		= param;

	function lastof ( pa ) {
		return pa[pa.length - 1];
	}

	function dirname ( path ) {
		return path.substring( 0, path.lastIndexOf('/') );
	}

	var prefix	= dirname ( lastof( document.getElementsByTagName('script') ).src );
	for( var i = 0; i < jsfiles.length; i ++ ) {

		document.write('<script type="text/javascript" src="' + prefix + '/' + jsfiles[i] + '"></script>');
	}
}


/*----------------------------------------------
 @disc	: タブ切り替え
 @param	: -
 @ret	: -
----------------------------------------------*/
defObj.func.tabAction	= tabAction;

function tabAction ( options ) {

	var c	= $.extend ( {
		tabNaviSelector	: '.m-box-tab .nav',
		tabActiveClass	: 'active'
	}, options );

	$(c.tabNaviSelector).each(function(){
		_this = $(this);

		_this.find("li").first().addClass("active");
		_this.next().find("li").first().addClass("active");

		_this.find("li").click(function(){
			_index = $(this).index();
			_this.find("li").removeClass("active");
			_this.next().find("li").removeClass("active");

			$(this).addClass("active");
			_this.next().find("> li").eq(_index).addClass("active");
		})
	});

}


/*----------------------------------------------
 @disc		first-child, last-childの擬似クラス
 			childSelectorの子要素のfirst-child, last-childにクラスを追加
 @param		-
 @ret		-
----------------------------------------------*/
defObj.func.css3Class	= css3Class;

function css3Class ( options ) {

	var c	= $.extend ( {
		firstChildClass	: 'firstChild',
		lastChildClass	: 'lastChild',
		childSelector	: '.child'
	}, options );

	$( c.childSelector ).children( ':first-child' ).addClass( c.firstChildClass );
	$( c.childSelector ).children( ':last-child' ).addClass( c.lastChildClass );
}


/*----------------------------------------------
 @disc	: stripeSelectorの子要素にodd/even(奇数/偶数)クラスを追加
 @param	: -
 @ret	: -
----------------------------------------------*/
defObj.func.css3Stripe	= css3Stripe;

function css3Stripe ( options ) {

	var c	= $.extend ( {
		stripeSelector	: '.stripe',
		oddClass		: 'odd',
		evenClass		: 'even'
	}, options );

	$( c.stripeSelector ).each(function(){
		$(this).children(':odd').addClass( c.evenClass );
		$(this).children(':even').addClass( c.oddClass );
	});
}


/*----------------------------------------------
 @disc	: nthChildSelectorの子要素にchild-nクラスを追加
 @param	: -
 @ret	: -
----------------------------------------------*/
defObj.func.nthChild	= nthChild;

function nthChild ( options ) {

	var c	= $.extend ( {

		nthChildClass	: 'nthChild'

	}, options );

	$( '[class*=' + c.nthChildClass + ']' ).each( function () {

		$(this).children().each ( function (index) {

			var _this	= $(this);

			var s	= {
				patern	: new RegExp ( '.*?' + c.nthChildClass + '\-(\d*) ?.*?' )
			}

			var nthChild	= _this.parent().attr( 'class' ).replace ( s.patern, '$1' );



			if ( isNaN ( nthChild ) === false ) {
				_this.addClass( 'child-' + ( ( index % nthChild ) + 1 ) );
			}
			else {
				_this.addClass( 'child-' + ( index + 1 ) );
			}
		} );
	});
}


/*----------------------------------------------
 @disc	: nthTypeClassの子要素(type)にtype-child-nを追加
 @param	: -
 @ret	: -
----------------------------------------------*/
defObj.func.nthType	= nthType;

function nthType ( options ) {

	var c	= $.extend ( {

		nthTypeClass	: 'nthType'

	}, options );

	$( '[class*=' + c.nthTypeClass + ']' ).each( function () {

		var _this		= $(this);
		var patern		= new RegExp ( c.nthTypeClass + '-([a-zA-Z0-9-_]*)', 'gi' );
		var arrClass	= _this.attr('class').match( patern );

		for ( var i = 0; i < arrClass.length; i ++ ) {

			var obj		= arrClass[i].replace( patern, '$1' );

			_this.children( obj ).each ( function ( index ) {
				$(this).addClass( 'child-' + obj + '-' + ( index + 1 ) );
			} );
		}
	} );
}


/*----------------------------------------------
 @disc	: IE6のhover擬似クラス
 @param	: -
 @ret	: -
----------------------------------------------*/
defObj.func.ie6Hover	= ie6Hover;

function ie6Hover ( options ) {

	var c	= $.extend ( {
		target		: '.hoverWrap',
		ie6Class	: 'hover'
	}, options );

	$( c.target ).hover ( function () {
		$(this).addClass( c.ie6Class );
	}, function () {
		$(this).removeClass( c.ie6Class );
	} );
}


/*----------------------------------------------
 @disc	: スムーススクロール
 @param	: -
 @ret	: -
----------------------------------------------*/
defObj.func.smoothScroll	= smoothScroll;

function smoothScroll ( options ) {

	var c	= $.extend ( {
		speed		: 300
	}, options );

	var $anchors = $( 'a[href^="#"]' );
	var $doc     = $( $.browser.safari ? 'body' : 'html' );

	$anchors.each( function () {

		var _this		= $(this);
		var anchorID	= _this.attr( 'href' );
		var $target;

		if ( anchorID !='#' ) {
			$target	= $( anchorID );
		}
		else {
			$target	= $('body');
		}



		_this.click( function (e) {

			var targetPositionTop	= $target.offset().top;

			$doc.stop().animate({
				scrollTop	: targetPositionTop
			},
			{
				duration	: c.speed,
				complete	: function () {

					//anchorID		= anchorID.replace( '#', '' );
					//location.hash	= encodeURIComponent ( anchorID );
				}
			});

			return false;
		});
	});
}


/*----------------------------------------------
 @disc	: リンクエリアを広げる
 @param	: -
 @ret	: -
----------------------------------------------*/
defObj.func.linkBox	= linkBox;

function linkBox ( options ) {

	var c	= $.extend ( {
		clickSelector	: '.linkWrap',
		linkSelector	: 'a:first'
	}, options );

	$( c.clickSelector ).click ( function () {

		var _this		= $(this);
		var strHref		= _this.find( c.linkSelector ).attr('href');
		var strTarget	= _this.find( c.linkSelector ).attr('target');

		if ( strTarget == '_blank' ) {
			window.open( strHref, '_blank' );
		}
		else {
			location.href	= strHref;
		}

		return false;

	} ).hover( function () { $(this).css( { cursor : 'pointer' } ); }, function () { $(this).css( { cursor : 'default' } ); } );
}


/*----------------------------------------------
 @disc	: title属性を擬似的にplaceholderとして使う
 @param	: -
 @ret	: -
----------------------------------------------*/
defObj.func.placeholder	= placeholder;

function placeholder ( options ) {

	var c	= $.extend ( {
		defaultColor	: '#ccc',
		selector		: '.placeholder'
	}, options );

	$( c.selector ).each ( function () {

		var _this	= $(this);

		//title属性を保持

		var strPlaceholder	= _this.attr('title');

		//元の文字色を保持

		var originalColor	= _this.css('color');

		switch ( originalColor ) {

			case '' :
				_this.val();

		}

	} );
}


/*----------------------------------------------
 @disc	: c.selectorの親タグをposition: relativeにし、
 		  c.selectorをdropdownmenuにする。
 @param	: selector	ドロップダウンメニューのDOM
 		  left		親タグをrelativeとしたときのleft
		  			位置を個別で設定する場合はautoを渡し、
					CSSで記述
		  top		leftと同様
		  speed		slideToggleのspeed引数。単位はms。
 @ret	: -
----------------------------------------------*/
defObj.func.dropDownMenu	= dropDownMenu;

function dropDownMenu ( options ) {

	var c	= $.extend ( {
		selector		: '.ddMenu',
		left			: 10,
		top				: 10,
		speed			: 500
	}, options );

	$( c.selector ).each ( function () {

		var _this	= $(this);

		//このメニューを調整

		var param		= {}
		param.position	= 'absolute';

		if ( isNaN ( c.left ) == true ) {
			param.left	= 'auto';
		}
		else {
			param.left	= c.left;
		}

		if ( isNaN ( c.top ) == true ) {
			param.top	= 'auto';
		}
		else {
			param.top	= c.top;
		}

		_this.css( param ).hide();

		//親タグにposition: relative

		_this.parent().css( { position	: 'relative' } );

		//event
		_this.parent().mouseenter( mouseon );
		_this.parent().mouseleave( mouseout );
	} );


	//functions
	function mouseon () {
		var _this	= $(this);
		var objMenu	= _this.find( c.selector );

		$( c.selector ).not( objMenu ).stop().slideUp( c.speed );
		objMenu.stop().slideDown( c.speed );
	}

	function mouseout () {
		var _this	= $(this);
		_this.find( c.selector ).slideUp( c.speed );
	}
}


/*----------------------------------------------
 @disc	: c.selectorの子タグをアニメーションさせる
 @param	: -
 @ret	: -
----------------------------------------------*/
defObj.func.visualAnime	= visualAnime;

function visualAnime ( options ) {

	var c	= $.extend ( {

		mode			: 'fade',
		speed			: 500,
		selector		: '#mainVisual',
		mainClass		: 'mainv-',
		wrapperClass	: 'visualWrap',

		//auto animation
		autoAct			: true,
		autoTime		: 6000,

		//controler
		ctrl				: true,
		ctrlClass			: 'ctrl',
		ctrlLeftClass		: 'ctrlLeft',
		ctrlRightClass		: 'ctrlRight',
		ctrlLeftObj			: 'left',
		ctrlRightObj		: 'right',
		ctrlCurrentClass	: 'current',

		//thumbnail
		thumbSelector	: '#thumbNail',
		thumbClass		: 'thumb',
		thumbDispNum	: 3

	}, options );


	$( c.selector ).each ( function () {

		var s	= {
			arrMain		: [],
			arrThumb	: [],
			timerId		: null
		};

		s.mainLen			= $( c.selector ).children().length;
		s.ThumbLen			= $( c.thumbSelector ).children().length;
		s.regExpFilterNum	= new RegExp ( '.*?' + c.mainClass + '(\d*) ?.*?' );
		s.mainWidth			= $( c.selector ).children().first().width();

		///// setting /////

		$( c.selector ).wrap( '<div class="' + c.wrapperClass + '"></div>' );

		//mainvisualを配列代入

		$( c.selector ).children().each ( function ( index ) {

			var _this	= $(this);

			_this.addClass( c.mainClass + index );

			s.arrMain.push( _this );

			if ( index != 0 ) {
				_this.remove();
			}
		} );

		//thumbnailを配列代入

		if ( $( c.thumbSelector ).length > 0 ) {

			$( c.selector ).parent().append( '<div class="' + c.thumbClass + '"></div>' );
			$( c.selector ).parent().find( '.' + c.thumbClass ).append( $( c.thumbSelector ) );

			$( c.thumbSelector ).children().each ( function ( index ) {

				var _this	= $(this);
				s.arrThumb.push( _this );

				if ( index >= c.thumbDispNum ) {
					_this.remove();
				}
			} );
		}

		//controlerを作成

		if ( c.ctrl == true ) {

			//olタグをappend

			$( c.selector ).parent().append( '<div class="' + c.ctrlClass + '"><ol></ol></div>' );

			//ctrlObject
			var ctrl	= $( c.selector ).parent().find( '.' + c.ctrlClass );

			for ( var i = 0; i < s.mainLen; i ++ ) {
				ctrl.find( 'ol' ).append( '<li style="cursor: pointer;">' + ( i + 1 ) + '</li>' );
			}

			ctrl.find( 'ol li:first' ).addClass( c.ctrlCurrentClass );

			ctrl.prepend ( '<p class="' + c.ctrlLeftClass + '"></p>' );
			ctrl.append ( '<p class="' + c.ctrlRightClass + '"></p>' );

			ctrl.find ( '.' + c.ctrlLeftClass ).css( 'cursor', 'pointer' ).append( c.ctrlLeftObj );
			ctrl.find ( '.' + c.ctrlRightClass ).css( 'cursor', 'pointer' ).append( c.ctrlRightObj );
		}

		///// event /////

		//bind

		allBind ();

		function allBind () {
			autoAct ( c.autoTime );
			$( c.selector ).parent().find( '.' + c.ctrlLeftClass ).on( 'click', clickLeft );
			$( c.selector ).parent().find( '.' + c.ctrlRightClass ).on( 'click', clickRight );
			$( c.selector ).parent().find( '.' + c.ctrlClass + ' li' ).on( 'click', clickPager );
		}

		function allUnbind () {
			clearInterval ( s.timerId );
			$( c.selector ).parent().find( '.' + c.ctrlLeftClass ).off( 'click', clickLeft );
			$( c.selector ).parent().find( '.' + c.ctrlRightClass ).off( 'click', clickRight );
			$( c.selector ).parent().find( '.' + c.ctrlClass + ' li' ).off( 'click', clickPager );
		}

		function clickLeft () {

			allUnbind ();

			//現在表示しているビジュアルのclassから配列番号を取得
			var curNum	= getClassNum ( $( c.selector ).children(':not(:hidden)') );

			//次に表示するビジュアルの配列番号
			var nextNum	= curNum + 1;

			if ( nextNum >= s.arrMain.length ) {	//配列番号以上なら0
				nextNum	= 0;
			}

			switch ( c.mode ) {
				case 'fade'		:
					crossFade ( nextNum );
					break;

				case 'slide'	:
					slideRight ( 1 );
					break;
			}

			//pagerがあればcurrent class変更

			if ( c.ctrl === true ) {
				pagerAction ( nextNum );
			}
		}

		function clickRight () {

			allUnbind ();

			//現在表示しているビジュアルのclassから配列番号を取得
			var curNum	= getClassNum ( $( c.selector ).children(':not(:hidden)') );

			//次に表示するビジュアルの配列番号
			var nextNum	= curNum + 1;

			if ( nextNum >= s.arrMain.length ) {	//配列番号以上なら0
				nextNum	= 0;
			}

			switch ( c.mode ) {

				case 'fade'		:
					crossFade ( nextNum );
					break;

				case 'slide'	:
					slideLeft ( 1 );
					break;
			}

			//pagerがあればcurrent class変更

			if ( c.ctrl === true ) {
				pagerAction ( nextNum );
			}
		}

		function clickPager () {

			allUnbind ();

			var nowPager	= $( c.selector ).parent().find( '.' + c.ctrlClass + ' li' ).index( $( '.' + c.ctrlClass + ' li.' + c.ctrlCurrentClass ) );
			var curPager	= $( c.selector ).parent().find( '.' + c.ctrlClass + ' li' ).index( $(this) );

			pagerAction ( curPager );

			switch ( c.mode ) {

				case 'fade'		:
					crossFade ( curPager );
					break;

				case 'slide'	:

					var numSlide	= curPager - nowPager;

					if ( numSlide > 0 ) {
						slideLeft ( Math.abs( numSlide ) );
					}
					else if ( numSlide < 0 ) {
						slideRight ( Math.abs( numSlide ) );
					}
					break;
			}
		}

		///// function /////
		/*
			getClassNum
		*/
		function getClassNum ( aObj ) {
			return parseInt ( aObj.attr( 'class' ).replace ( s.regExpFilterNum, '$1' ) );
		}
		/*
			crossFade
		*/
		function crossFade ( aFadeInNum ) {

			var nextObj	= s.arrMain[ aFadeInNum ].clone().hide();

			$( c.selector ).append( nextObj );

			$( c.selector ).children(':not(:hidden)').fadeOut( c.speed, function () {
				$(this).remove();
				allBind ();
			} );

			nextObj.fadeIn( c.speed );
		}
		/*
			slideLeft
		*/
		function slideLeft ( aSlideNum ) {

			//現在表示しているビジュアルのclassから配列番号を取得

			var curNum	= getClassNum ( $( c.selector ).children(':not(:hidden)') );

			//次に表示するビジュアルの配列番号

			for ( var i = 0; i < aSlideNum; i ++ ) {

				var nextNum	= curNum + 1;

				if ( nextNum >= s.arrMain.length ) {	//配列番号以上なら0
					nextNum	= 0;
				}

				var nextObj	= s.arrMain[ nextNum ].clone().css( { left : ( s.mainWidth * ( i + 1 ) ) } );

				$( c.selector ).append( nextObj );

			}

			$( c.selector ).animate ( { left : - ( s.mainWidth * aSlideNum ) }, function () {
				allBind();

				$( c.selector ).children( ':not(:last)' ).remove();

				$( c.selector ).children().css( { left : 0 } );
				$( c.selector ).css( { left : 0 } );
			} );
		}
		/*
			slideRight
		*/
		function slideRight ( aSlideNum ) {

			//現在表示しているビジュアルのclassから配列番号を取得

			var curNum	= getClassNum ( $( c.selector ).children(':not(:hidden)') );

			//次に表示するビジュアルの配列番号

			for ( var i = 0; i < aSlideNum; i ++ ) {

				var nextNum	= curNum + 1;

				if ( nextNum >= s.arrMain.length ) {	//配列番号以上なら0
					nextNum	= 0;
				}

				var nextObj	= s.arrMain[ nextNum ].clone().css( { left : - ( s.mainWidth * ( i + 1 ) ) } );

				$( c.selector ).append( nextObj );
			}

			$( c.selector ).animate ( { left : ( s.mainWidth * aSlideNum ) }, function () {
				allBind();

				$( c.selector ).children( ':not(:last)' ).remove();

				$( c.selector ).children().css( { left : 0 } );
				$( c.selector ).css( { left : 0 } );
			} );
		}
		/*
			thumbnailSlide
		*/

		/*
			pagerAction
		*/
		function pagerAction ( aPageNum ) {
			$( c.selector ).parent().find( '.' + c.ctrlClass + ' li' ).removeClass( c.ctrlCurrentClass );
			$( c.selector ).parent().find( '.' + c.ctrlClass + ' li' ).eq( aPageNum ).addClass( c.ctrlCurrentClass );
		}
		/*
			auto action
		*/
		function autoAct ( aTime ) {
			clearInterval ( s.timerId );
			s.timerId		= null;
			s.timerId		= setInterval ( function () {
				clickRight ( 1 );
			}, aTime );
		}


	} );
}



/*----------------------------------------------
 @disc	: -
 @param	: -
 @ret	: -
----------------------------------------------*/
defObj.func.gMaps	= gMaps;
function gMaps ( options ) {

	var c	= $.extend ( {
		mapId		: 'gMaps',
		lat			: 0,
		lng			: 0,
		zoom		: 15
	}, options );

	if ( $( '#' + c.mapId ).length ) {

		var latLng	= new google.maps.LatLng ( c.lat, c.lng );
		var myOptions	= {
			zoom				: c.zoom,
			center				: latLng,
			mapTypeControl		: true,
			style				: google.maps.ZoomControlStyle.DEFAULT,
			zoomControl			: true,
			scaleControl		: true,
			mapTypeId			: google.maps.MapTypeId.ROADMAP
		};

		var map	= new google.maps.Map ( document.getElementById ( c.mapId ), myOptions );

		var marker	= new google.maps.Marker ( {
			position	: latLng,
			map			: map
		} );
	}
}

/*--------------/
/	recommend	/
/--------------*/
defObj.func.recommend	= recommend;

function recommend ( options ) {

	var c	= $.extend ( {

		speed			: 500,
		selector		: '#portfolio',

		//auto animation
		autoAct			: true,
		autoTime		: 6000,

		//controler
		ctrl				: true,
		ctrlClass			: 'ctrl',
		ctrlLeftClass		: 'ctrlLeft',
		ctrlRightClass		: 'ctrlRight',
		ctrlCurrentClass	: 'current',
		ctrlPagerClass: 'recommendPager',

		//rec
		recLeft: 210,
		recNum: 4

	}, options );

	$( c.selector ).each ( function () {
		///// setting /////
		var objRec		= $("ul",c.selector);
		var recMax		= objRec.find('li').length;
		var pageNum		= Math.ceil( objRec.find('li').length / c.recNum );
		var _pager		= $('#portfolio ol li');

		//init
		objRec.find('li').each( function(index) {
			var _this	= $(this);

			if ( index >= c.recNum ) {
				_this.hide();
			}

			_this.css( {
				position	: 'absolute',
				left		: ( c.recLeft * index ) + 'px'
			} );
		});

		//make pager
		objRec.append('<ol class="' + c.ctrlPagerClass + '" />');

		for ( var i = 0; i < pageNum; i ++ ) {
			$("." + c.ctrlPagerClass).append('<li />');
			$("." + c.ctrlPagerClass).first().addClass("active");
		}

		///// event /////

		//--------------//
		//	clickRight	//
		//--------------//
		$("." + c.ctrlRightClass).click( clickRightDelay );

		function clickRightDelay () {
			//change pager
			var _nowPage	= _pager.index( $('#portfolio ol li.active') );

			if( _nowPage != ( pageNum - 1 ) ) {

				_pager.eq( _nowPage + 1 ).addClass("active")

				_pager.removeClass('active');
				_pager.eq( _nowPage + 1 ).addClass('active');

				clickRight(1);
			}
		}

		function clickRight ( aNum ) {
			//remaind banner
			var intFirst	= objRec.find('li').index( $('#portfolio ul li:visible').first() );
			var intLast		= objRec.find('li').index( $('#portfolio ul li:visible').last() );
			var intRemaind	= recMax - ( intLast + 1 );
			var intAnime	= c.recNum * aNum;

			if ( intLast >= ( recMax - 1 ) ) {
				return false;
			}

			//animate banner
			for( var i = 0; i < intAnime; i ++ ) {

				if ( $("li",objRec).eq( intLast + 1 + i ).length ) {
					$("li",objRec).eq( intLast + 1 + i ).show();
				}
				else {
					break;
				}
			}

			//unbind
			switchBind ('off');

			var animateFlg	= 1;
			$("li",objRec).animate( { 'left' : '-=' + ( intAnime * c.recLeft ) + 'px' }, c.speed, function(){

				if( animateFlg == 1 ) {

					for( var i = 0; i < intAnime; i ++ ) {

						if ( $("li",objRec).eq( intFirst + i ).length ) {

							$("li",objRec).eq( intFirst + i ).hide();
						}
					}

					//bind
					switchBind ('on');
				}

				animateFlg	= 0;

			} );


			return false;
		}

		//--------------//
		//	clickLeft	//
		//--------------//
		$("." + c.ctrlLeftClass).click( clickLeftDelay );

		function clickLeftDelay () {

			//change pager
			var _nowPage	= _pager.index( $('#portfolio ol li.active') );

			if( _nowPage != 0 ) {

				_pager.eq( _nowPage - 1 ).addClass("active")

				_pager.removeClass('active');
				_pager.eq( _nowPage - 1 ).addClass('active');

				clickLeft(1);
			}
		}

		function clickLeft ( aNum ) {

			//remaind banner
			var intFirst	= objRec.find('li').index( $('#portfolio ul li:visible').first() );
			var intLast		= objRec.find('li').index( $('#portfolio ul li:visible').last() );
			var intRemaind	= c.recNum - ( intLast - intFirst + 1 );
			var intAnime	= c.recNum * aNum;

			if ( intFirst <= 0 ) {

				return false;
			}

			//animate banner
			var tmpNum;
			for ( var i = 0; i < intAnime; i ++ ) {

				tmpNum	= intFirst - 1 - i;

				if ( tmpNum >= 0 && $("li",objRec).eq( tmpNum ).length ) {

					$("li",objRec).eq( tmpNum ).show();
				}
			}

			//unbind
			switchBind ('off');

			var animateFlg	= 1;
			$("li",objRec).animate( { 'left' : '+=' + ( intAnime * c.recLeft ) + 'px' }, c.speed, function(){

				if( animateFlg == 1 ) {

					for ( var i = 0; i < ( intAnime - intRemaind ); i ++ ) {

						if ( $("li",objRec).eq( intLast - i ).length ) {
							$("li",objRec).eq( intLast - i ).hide();
						}
						else {
							break;
						}
					}

					//bind
					switchBind ('on');
				}
				animateFlg	= 0;

			} );

			return false;
		}

		//--------------//
		//	clickPager	//
		//--------------//
		$('#portfolio ol li').click( clickPager );

		function clickPager () {

			var _this		= $(this);

			var _crPage		= _pager.index( _this );
			var _nowPage	= _pager.index( $('#portfolio ol li.active') );

			if ( _this.is('.active') ) {
				return false;
			}

			//change active
			_pager.removeClass('active');
			_this.addClass('active');

			//slide recommend
			var slideNum	= _crPage - _nowPage;

			if ( slideNum > 0 ) {
				clickRight ( slideNum );
			}
			else {
				clickLeft ( Math.abs( slideNum ) );
			}
		}


		//--------------//
		//	switchBind	//
		//--------------//
		function switchBind ( param ) {

			if ( param == 'on' ) {

				$("." + c.ctrlLeftClass).bind( 'click', clickLeftDelay );
				$("." + c.ctrlRightClass).bind( 'click', clickRightDelay );
				$('#portfolio ol li').bind( 'click', clickPager );
			}
			else if ( param == 'off' ) {

				$("." + c.ctrlLeftClass).unbind( 'click', clickLeftDelay );
				$("." + c.ctrlRightClass).unbind( 'click', clickRightDelay );
				$('#portfolio ol li').unbind( 'click', clickPager );
			}
		}

		var s	= {
			timerId		: null
		};

		/*
			auto action
		*/
		function autoAct ( aTime ) {
			clearInterval ( s.timerId );
			s.timerId		= null;
			s.timerId		= setInterval ( function () {
				var _pager		= $('#portfolio ol li');
				var _nowPage	= _pager.index( $('#portfolio ol li.active') );
				var _length = _pager.length - 1;
				var _patern		= new RegExp( '(_cr)?(\.gif|\.jpg|\.png)$' );
				var _this = _pager.eq(0);

				if (_nowPage != _length ) {
					clickRightDelay();
				}
				else {
					clickLeft(_length);

					//change active
					_pager.removeClass('active');
					_this.addClass('active');
				}
			}, aTime );
		}

		//autoAct(5000);
	});
};