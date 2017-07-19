jQuery(function($) {
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
	}

	//*** 画像アップロード時の日本語ファイル判定処理 ***//
	$.MTAppUploadValidater();
	//*** ブログ記事の並び替え機能 (jQuery.Sortable使用） ***//
	// $.MTAppEntrySort();

});
