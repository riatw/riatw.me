<?php
function smarty_block_mtremoveblank($args, $content, &$ctx, &$repeat){
  global $mt;

  $list = preg_split("[\r\n|\r|\n]", $content);
  $content = remove_blank_trim($list);
  return $content;
}

function remove_blank_trim($out){
  $txt = '';

  for( $i = 0, $n = count($out); $i < $n; $i++ ){
    $out[$i] = trim($out[$i]);
    if ($out[$i] != ''){
      $txt .= $out[$i] . "\n";
    }
  }
  return $txt;
}
