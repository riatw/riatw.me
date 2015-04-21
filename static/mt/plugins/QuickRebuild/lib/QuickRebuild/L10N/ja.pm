#   Copyright (c) 2008 ToI-Planning, All rights reserved.
# 
#   Redistribution and use in source and binary forms, with or without
#   modification, are permitted provided that the following conditions
#   are met:
# 
#   1. Redistributions of source code must retain the above copyright
#      notice, this list of conditions and the following disclaimer.
#
#   2. Redistributions in binary form must reproduce the above copyright
#      notice, this list of conditions and the following disclaimer in the
#      documentation and/or other materials provided with the distribution.
#
#   3. Neither the name of the authors nor the names of its contributors
#      may be used to endorse or promote products derived from this
#      software without specific prior written permission.
#
#   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
#   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
#   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
#   A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
#   OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
#   SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
#   TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
#   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
#   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
#   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
#   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
#
#  $Id$

package QuickRebuild::L10N::ja;

use strict;
use base 'QuickRebuild::L10N::en_us';
use vars qw( %Lexicon );

%Lexicon = (
	'Quick Publish Site' => 'サイトを再構築(クリックでスタート)',
	'Rebuild quickly' => '再構築支援プラグイン',
	'Rebuild' => '再構築',
	'toi-planning' => 'ToI企画',
	'Rebuild all blog' => '全てのブログを再構築',

	'Only Author Monthly Archives' => 'ユーザー-月別アーカイブのみ',
	'Only Category Archives' => 'カテゴリアーカイブのみ',
	'Only Category Monthly Archives' => 'カテゴリ-月別アーカイブのみ',
	'Only Monthly Archives' => '月別アーカイブのみ',
	'Only Page Archives' => 'ウェブページアーカイブのみ',
	'Only Individual Archives' => 'ブログ記事アーカイブのみ',
	'Only Entry Archives' => 'ブログ記事アーカイブのみ',
);

1;
