jQuery(function($) {
    $.MTAppMsg({
        msg: 'MTAppjQueryプラグインのインストールに成功しました！ user.js を編集して管理画面のカスタマイズを楽しみましょう！',
        type: 'success'
    });

	//本文内で画像をアップロードする再の □ポップアップウィンドウでもとの大きさの画像にリンクします。 のチェック欄を非表示にする。
	$('#link_to_popup-field').css({position:'absolute',top:'-9999px',left:'-9999px'});


	//カテゴリのトラックバックを非表示
	if($("body").is("#edit-category")){
		$("#category-details-content fieldset").eq(1).hide().end().eq(2).hide();
	}

	switch(mtappVars.blog_id)
	{
		case 2:
		if($("body").is("#edit-entry")){
			//本文の高さを調整する（入力内容を制限したい時に）
			$("#edit-entry #editor-content-textarea").css("height","300px").parent().css("height","305px");
		}
		break;

		case 3:

		if($("body").is("#edit-entry")){
			//カテゴリー一覧をタイトルの下に移動
			$("#edit-entry #entry-category-widget").insertAfter("#title-field");
			//ブログの各画面にアラートを表示する、投稿画面の注釈とかに使用する

			//ここの中には普通にjsが書ける
			$.MTAppCustomize({
				basename: 'title',
				show_field: 'hide'
			});
			$.MTAppCustomize({
				basename: 'body',
				show_field: 'show',
				show_parent: 'hide'
			});
			$.MTAppCustomize({
				basename: 'more',
				show_field: 'hide',
				show_parent: 'hide'
			});

			$.MTAppCustomize({
				basename: 'assets',
				show_field: 'hide'
			});
			$.MTAppCustomize({
				basename: 'keywords',
				show_field: 'hide'
			});
			$.MTAppCustomize({
				basename: 'excerpt',
				label: 'jsの適用先',
				show_field: 'show'
			});
			$.MTAppCustomize({
				basename: 'category',
				label: 'デモ',
				show_field: 'show'
			});

			/*
			$.MTAppInCats({
			    categories: '12', // カテゴリIDを指定。複数の場合はカンマ区切り
			    code      : function(){
					/*
						MTAppSelectBox
						単一行のカスタムフィールドをセレクトボックにするjs
					*/
					/*$("#excerpt").MTAppSelectBox({label:'大,小,無'});
			    }
			});

			$.MTAppInCats({
			    categories: '13', // カテゴリIDを指定。複数の場合はカンマ区切り
			    code      : function(){
					$.MTAppsetImageviewer({url:'/mt/plugins/MTAppjQueryPlus/mtappjqueryplus.cgi'});
					$("#excerpt").MTAppMultiConverter({
						type:'textarea',
						tbody:'<ul class="MTAppMultiConverter"><li class="row"><div class="imgText inner"><div class="image"><input type="hidden" value="" class="sample_image" /></div><div class="checkbox"><label>画像を正方形にする<input type="checkbox" class="square" value="1" /></label><label>画像を拡大表示する<input type="checkbox" class="lightbox" value="lightbox" /></label></div></div><div class="remove_btn"><input type="button" class="remove" value="-" /></div></li></ul><input type="button" class="add" value="画像を追加する" />'
					});
			    }
			});

			$.MTAppInCats({
			    categories: '11', // カテゴリIDを指定。複数の場合はカンマ区切り
			    code      : function(){
					/*
						MTAppTableConverter
						##区切りのテキスト→テキストエリアに展開するjs
						options.type:text/textarea (単1行と複数行)
						options.thead (見出し)
					*//*
					$("#excerpt").MTAppTableConverter({
						colcnt:2,
						type:'textarea',
						thead:'<tr><th>項目</th><th>内容</th><th style="width:3em;"></th></tr>'
					});
			    }
			});
			*/

			$("#excerpt").MTAppUnits({
				type:'textarea',
				tbody:'<ul class="MTAppMultiConverter"><li class="text"><div class="imgText inner"><input type="hidden" class="type" value="text" /><div><label>配置<select class="position"><option value="normal">おまかせ</option><option value="clear">回り込み解除</option></select></label><label>フォーマット<select class="format"><option value="normal">テキスト</option><option value="h2">大見出し</option><option value="h3">子見出し</option><option value="list">リスト</option><option value="ul">テーブル</option></select></label></div><div><label>テキスト<textarea class="text"></textarea></label></div></div><div class="remove_btn">テキスト <input type="button" class="remove" value="-" /></div></li><li class="image"><input type="hidden" class="type" value="image" /><div class="imgText inner"><div class="image"><input type="image" src="/mt/mt-static/plugins/MTAppjQueryPlus/image_select_default.jpg" value="/mt/mt-static/plugins/MTAppjQueryPlus/image_select_default.jpg" alt="写真を選択" class="image" /></div><div><label>配置<select class="position"><option value="normal">おまかせ</option><option value="floatL">左</option><option value="floatR">右</option><option value="center">中央</option></select></label><label>画像の大きさ<select class="imagesize"><option value="normal">原寸大</option><option value="100">小</option><option value="300">中</option><option value="500">大</option></select></label><label>拡大表示する<input  class="lightbox" type="checkbox" value="lightbox" /></label></div><div><label>リンク先URL<input class="linkurl" type="text" value="" /></label></div></div><div class="remove_btn">画像 <input type="button" class="remove" value="-" /></div></li></ul><input type="button" class="add_text" value="テキストを追加する" /><input type="button" class="add_image" value="画像を追加する" />'
			});

			/*
			$("#excerpt").MTAppMultiConverter({
				tbody:'<li class="row"><div class="clearfix"><div class="imgWrap"><input type="image" class="image" /></div><div><label><input type="text" class="title" /></label></div><div class="inline"><label><input type="checkbox" class="flag1 mar10" />&nbsp;チェックボックス</label></div><div class="select_wrap"><label><select class="select1"><option value="data1">data1</option><option value="data2">data2</option></select></label></div><div class="select_wrap"><label><textarea class="textarea1"></textarea></label></div></div><div class="remove_btn"><input type="button" class="remove" value="-" /></div></li>',
				url:'/mt/plugins/MTAppjQueryPlus/mt-jqueryplus.cgi'
			});
			*/
}
		break;
	}

	//*** 画像アップロード時の日本語ファイル判定処理 ***//
	$.MTAppUploadValidater();
	//*** ブログ記事の並び替え機能 (jQuery.Sortable使用） ***//
	$.MTAppEntrySort();

});

 (function($){
    $.fn.MTAppUnits = function(options){
        var op = $.extend({},options || {}); // optionsに値があれば上書きする

		var customfield = $(this);

		//元のテキストエリアを隠す
		customfield.css("display","none");
		//とりあえずクリーニング
		var target = customfield.parent();
		target.find("ul").remove().end().find("input.add").remove();

		//基本的なHTMLをまず入れる。
		customfield.after(op.tbody);
		var rowdata = customfield.text().replace(/[\n\r][\n\r]?/g, "\n").split("\n");

		//処理対象テーブルの指定（基本変更不要）
		tbl = target.find("ul");

		//各フォーマットを登録
		trhtml = {};

		$("li",tbl).each(function(){
			var n = $(this).attr("class");
			console.log(n);
			trhtml[n] = "<li>" + $(this).html() + "</li>";
			console.log(trhtml[n]);
		});

		$(tbl).empty();

		if(rowdata.length >= 1 && rowdata != ""){
			for(rowcnt=0;rowcnt<rowdata.length;rowcnt++)
			{
				//行のデータ(json)をオブジェクトに変換
				coldata = $.evalJSON(rowdata[rowcnt]);

				var c_unit = coldata["type"];
				console.log(c_unit);

				tbl.append(trhtml[c_unit]);

				//処理対象の行
				attach = tbl.find("li:last-child");

				//クラス名を頼りに要素に値をセットしていく
				for(var key in coldata){
					if(coldata[key] != ""){
						if(coldata[key] != "type"){
							var current = "." + key;
							$(current,attach).val(coldata[key].replace(/<br \/>/g, "\n"));
							$(current,attach).attr("src",coldata[key]);

							$(current,attach).attr("checked","checked");
						}
					}
				}
			}
		}

		$(".MTAppMultiConverter li select.format").each(function(){
			if($(this).val() == "ul"){
				$(this).parent().parent().parent().find("textarea.text").MTAppTableConverter({colcnt:2,thead:''});
			}
		});

		//テーブルの行の入れ替えを実装
		$(tbl).sortable({
			cursor: 'move',
        	opacity: 0.8,
        	placeholder: 'ui-state-highlight'
		});

		//行の入れ替えが伝わるように、マウスポインタを変更
		$(tbl).css("cursor","pointer");

		//ブログ記事保存時に、テーブル→テキストエリアにデータを書き出す
		$("form#entry_form").submit(function(){
			var tbody = customfield.parent().find("ul");
			var savebuff = [];

			$("li",tbody).each(function(i){
				var colbuff = {};
				$("input[type=text],input:checked,input[type=image],input[type=hidden],select,textarea",this).not(".remove").each(function(){
					var c = $(this).attr("class");
					if(c){
					colbuff[c] = $(this).val();
					}
				});

				savebuff.push($.toJSON(colbuff));
			});

			customfield.val(savebuff.join("\n"));
		});

		//テキストの追加処理
		$("input.add_text",target).click(function(){
			var tbl = $(this).parent().find("ul");
			tbl.append(trhtml["text"]);

			//***行の削除処理
			$(".MTAppMultiConverter select.format").change(function() {
				if($(this).val() == "ul"){
					$(this).parent().parent().parent().find("textarea.text").MTAppTableConverter({colcnt:2,thead:''});
				}
			});
		});

		$("input.add_image",target).click(function(){
			var tbl = $(this).parent().find("ul");
			tbl.append(trhtml["image"]);
		});

		//***行の削除処理
		$(".MTAppMultiConverter input.remove").live('click', function(e) {
			$(this).parent().parent().remove();
		});


		//機能：画像表示のイベントヒモ付
		//画像をクリックした時の処理
		$(".MTAppMultiConverter input[type=image]").live('click', function(e) {
			var iv = $("#imageviewer");

			iv.css("top",e.pageY -100);
			iv.css("left",e.pageX + 50);
			iv.show();
			tmp_id = $(this);
			return false;
		});

	}

})(jQuery);
