# Movable Type (r) (C) 2001-2016 Six Apart, Ltd. All Rights Reserved.
# This code cannot be redistributed without permission from www.sixapart.com.
# For more information, consult your Movable Type license.
#
# $Id$

package Smartphone::L10N::fr;

use strict;
use base 'Smartphone::L10N::en_us';
use vars qw( %Lexicon );

## The following is the translation table.

%Lexicon = (
## plugins/SmartphoneOption/config.yaml
	'Provides an iPhone, iPad and Android touch-friendly UI for Movable Type. Once enabled, navigate to your MT installation from your mobile to use this interface.' => 'Fournit une interface tactile iPhone, iPad et Android pour Movable Type. Une fois activé, connectez-vous à votre installation MT depuis votre mobile pour utiliser cette interface.',
	'iPhone' => 'iPhone',
	'iPad' => 'iPad',
	'Android' => 'Android',
	'Desktop' => 'Bureau', # Translate - New

## plugins/SmartphoneOption/extlib/Image/ExifTool/MIFF.pm

## plugins/SmartphoneOption/lib/Smartphone/CMS/Entry.pm
	'Re-Edit' => 'Rééditer',
	'Re-Edit (e)' => 'Rééditer (e)',
	'Rich Text(HTML mode)' => 'Texte enrichi (Mode HTML)',

## plugins/SmartphoneOption/lib/Smartphone/CMS/Listing.pm
	'All' => 'Toutes',
	'Filters which you created from PC.' => 'Filtres créés depuis votre PC',

## plugins/SmartphoneOption/lib/Smartphone/CMS.pm
	q{This function is not supported by [_1].} => q{Cette fonctionnalité n'est pas supportée par [_1].},
	q{This function is not supported by your browser.} => q{Cette fonctionnalité n'est pas supportée par votre navigateur.},
	'Mobile Dashboard' => 'Tableau de bord mobile',
	q{Rich text editor is not supported by your browser. Continue with  HTML editor ?} => q{L'editeur de texte enrichi n'est pas supporté par votre navigateur. Continuer avec l'éditeur HTML ?},
	q{Syntax highlight is not supported by your browser. Disable to continue ?} => q{Le surlignage de syntaxe n'est pas supporté par votre navigateur. Désactiver pour continuer ?},
	'[_1] View' => 'Vue [_1]',

## plugins/SmartphoneOption/lib/Smartphone/CMS/Search.pm
	'Search [_1]' => 'Rechercher [_1]',

## plugins/SmartphoneOption/smartphone.yaml
	'to [_1]' => 'vers [_1]', # Translate - New
	'Smartphone Main' => 'Smartphone principal',
	'Smartphone Sub' => 'Smartphone secondaire',

## plugins/SmartphoneOption/tmpl/cms/dialog/select_formatted_text.tmpl
	'No boilerplate could be found.' => 'Aucun texte formaté n\'a été trouvé', # Translate - New

);

1;
