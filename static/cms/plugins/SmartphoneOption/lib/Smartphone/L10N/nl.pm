# Movable Type (r) (C) 2001-2016 Six Apart, Ltd. All Rights Reserved.
# This code cannot be redistributed without permission from www.sixapart.com.
# For more information, consult your Movable Type license.
#
# $Id$

package Smartphone::L10N::nl;

use strict;
use base 'Smartphone::L10N::en_us';
use vars qw( %Lexicon );

## The following is the translation table.

%Lexicon = (
## plugins/SmartphoneOption/config.yaml
	'Provides an iPhone, iPad and Android touch-friendly UI for Movable Type. Once enabled, navigate to your MT installation from your mobile to use this interface.' => 'Voegt een Movable Type gebruikersinterface toe geschikt voor aanraakschermen op iPhone, iPad en Android toestellen. Zodra deze plugin is ingeschakelt, navigeert u eenvoudigweg met uw mobiele toestel naar uw MT installatie om deze interface te gebruiken.',
	'iPhone' => 'iPhone',
	'iPad' => 'iPad',
	'Android' => 'Android',
	'Desktop' => 'Bureaublad', # Translate - New

## plugins/SmartphoneOption/extlib/Image/ExifTool/MIFF.pm

## plugins/SmartphoneOption/lib/Smartphone/CMS/Entry.pm
	'Re-Edit' => 'Opnieuw bewerken',
	'Re-Edit (e)' => 'Opnieuw bewerken (e)',
	'Rich Text(HTML mode)' => 'Rich Text(HTML modus)',

## plugins/SmartphoneOption/lib/Smartphone/CMS/Listing.pm
	'All' => 'Alle',
	'Filters which you created from PC.' => 'Filters aangemaakt op de PC.',

## plugins/SmartphoneOption/lib/Smartphone/CMS.pm
	'This function is not supported by [_1].' => 'Deze functie wordt niet ondersteund door [_1].',
	'This function is not supported by your browser.' => 'Deze functie wordt niet ondersteund door uw browser.',
	'Mobile Dashboard' => 'Mobiel dashboard',
	'Rich text editor is not supported by your browser. Continue with  HTML editor ?' => 'De rich text tekstbewerker wordt niet ondersteund door uw browser.  Doorgaan met de HTML editor?',
	'Syntax highlight is not supported by your browser. Disable to continue ?' => 'Automatisch markeren syntaxis wordt niet ondersteund door uw browser.  Uitschakelen om verder te gaan?',
	'[_1] View' => '[_1] overzicht',

## plugins/SmartphoneOption/lib/Smartphone/CMS/Search.pm
	'Search [_1]' => 'Doorzoek [_1]',

## plugins/SmartphoneOption/smartphone.yaml
	'to [_1]' => 'naar [_1]', # Translate - New
	'Smartphone Main' => 'Smartphone Hoofd',
	'Smartphone Sub' => 'Smartphone Sub',

);

1;
