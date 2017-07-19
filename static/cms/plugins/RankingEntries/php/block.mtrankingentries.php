<?php
require dirname(__FILE__) . '/../gapi.class.php';

function smarty_block_mtrankingentries ($args, $content, &$ctx, &$repeat) {
    # ブログの取得
    //$blog = $ctx->stash('blog');
    # エントリーの取得
    //$entry = $ctx->stash('entry');
    # モディファイアの取得
    //$hoge = $args['hoge'];

    //ローカル変数
    $localvars = array( 'entry', '_entries_counter', 'entries', '_entries_lastn',
                        'blog', 'blog_id', 'include_blogs', 'category_expression', 'tag_id' );
    //$appを生成
    $app = $ctx->stash( 'bootstrapper' );
    
    //ブログIDをセット
    $blog_id = intval( $ctx->stash( 'blog_id' ) );
    $blog = $ctx->stash( 'blog' );
	
    //ブログコンテキスト以外から呼ばれた場合？
    if (! isset( $blog ) ) {
        if ( $blog_id ) {
            $blog = $ctx->mt->db()->fetch_blog( $blog_id );
            $ctx->stash( 'blog', $blog );
        }
    }
    $blog_id = $blog->id;
    $ctx->stash( 'blog_id', $blog->id );
    
    //MTで色々するための関数読み込み
    require_once 'class.mt_entry.php';
    
    if (! isset( $content ) ) {
        $ctx->localize( $localvars );
        $ctx->__stash[ 'entries' ] = NULL;
        $counter = 0;
        $lastn = $args[ 'lastn' ];
        if (! isset( $lastn ) ) {
            $lastn = $blog->entries_on_index;
        }
        $ctx->stash( '_entries_lastn', $lastn );
    } else {
        $lastn = $ctx->stash( '_entries_lastn' );
        $counter = $ctx->stash( '_entries_counter' );
    }

    //1周目だったら、データを取得する
    $entries = $ctx->stash( 'entries' );

    if (! isset( $entries ) ) {
define('ga_email','ke.suzuki@studio-weekend.com');
define('ga_password','9anmj1uj');
define('ga_profile_id','47734190');

$plugin = $app->component('rankingentries');
$ga_email = $plugin->get_config_value('ranking_entries_ga_email','system');
$ga_password = $plugin->get_config_value('ranking_entries_ga_password','system');
$ga_profile_id = $plugin->get_config_value('ranking_entries_ga_profile_id','system');

/* ディメンション */
$dimensions=array('pageTitle','pagePath');
/* 指標 */
$metrics=array('pageviews','visits');
/* 結果のソート順と方向 */
$sort_metric='-pageviews';
/* フィルター */
$filter= $args['ga_filter'];
/* 開始日・終了日（過去1週間） */
$start_date=date('Y-m-d', strtotime($args['ga_start']));
$end_date=date('Y-m-d', strtotime($args['ga_end']));
/* 開始インデックス */
$start_index=1;
/* 結果フィードの最大取得数 */
$max_results=50;

/* 認証 */
$ga = new gapi($ga_email,$ga_password);
/* データ取得 */
$ga->requestReportData(
    $ga_profile_id,    /* プロファイルID */
    $dimensions,    /* ディメンション */
    $metrics,        /* 指標 */
    $sort_metric,    /* 結果のソート順と方向 */
    $filter,        /* フィルタ */
    $start_date,    /* 開始日 */
    $end_date,        /* 終了日 */
    $start_index,    /* 開始インデックス */
    $max_results    /* 結果の最大取得数 */
);
$i=1;
foreach($ga->getResults() as $result){
  $gapi_result[] = $result->getPagepath();
  $i++;
}


for ($i = 0; $i< count($gapi_result); $i++) {
    $sql = "SELECT fileinfo_entry_id FROM mt_fileinfo WHERE fileinfo_url = '" . $gapi_result[$i] .  "'";
    $match = $ctx->mt->db()->Execute( $sql );
			
    if($match->fields[fileinfo_entry_id]){
	$entries[] = $match->fields[fileinfo_entry_id];
    }
}
$ctx->stash('entries',$entries);

}
    
    //取得結果が何も無ければ、$localvarsを開放
    if ( empty( $entries ) ) {
        if (! $repeat ) {
            $ctx->restore( $localvars );
        }
        $content = '';
    }
    
    //lastnが-1、もしくはlastn > 該当記事数の場合lastnの値を入れ替える
    if ( ( $lastn > count( $entries ) ) || ( $lastn == -1 ) ) {
        $lastn = count( $entries );
        $ctx->stash( '_entries_lastn', $lastn );
    }

    if ( $lastn ? ( $counter < $lastn ) : ( $counter < count( $entries ) ) ) {
        //entryidsからidを取り出して、$entry = MT::Entry->load...
        $entry = $app->load('Entry', $entries[ $counter ]); 
        if (! empty( $entry ) ) {
	    array_push ( $app->entry_ids_published, $entry->id );
            $ctx->stash( 'blog', $entry->blog() );
            $ctx->stash( 'blog_id', $entry->blog_id );
            $ctx->stash( 'entry', $entry );
            $ctx->stash( '_entries_counter', $counter + 1 );
            $count = $counter + 1;
            $ctx->__stash[ 'vars' ][ '__counter__' ] = $count;
            $ctx->__stash[ 'vars' ][ '__odd__' ]     = ( $count % 2 ) == 1;
            $ctx->__stash[ 'vars' ][ '__even__' ]    = ( $count % 2 ) == 0;
            $ctx->__stash[ 'vars' ][ '__first__' ]   = $count == 1;
            $ctx->__stash[ 'vars' ][ '__last__' ]    = ( $count == count( $entries ) );
            $repeat = true;
        }
    } else {
        $ctx->restore( $localvars );
        $repeat = false;
    }

    return $content;
}
?>
