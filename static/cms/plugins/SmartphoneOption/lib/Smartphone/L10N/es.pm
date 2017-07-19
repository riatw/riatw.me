# Movable Type (r) (C) 2001-2016 Six Apart, Ltd. All Rights Reserved.
# This code cannot be redistributed without permission from www.sixapart.com.
# For more information, consult your Movable Type license.
#
# $Id$

package Smartphone::L10N::es;

use strict;
use base 'Smartphone::L10N::en_us';
use vars qw( %Lexicon );

## The following is the translation table.

%Lexicon = (
## plugins/SmartphoneOption/config.yaml
	'Provides an iPhone, iPad and Android touch-friendly UI for Movable Type. Once enabled, navigate to your MT installation from your mobile to use this interface.' => 'Provee a Movable Type un interfaz táctil especialmente adaptado a iPhone, iPad y Android.',
	'iPhone' => 'iPhone',
	'iPad' => 'iPad',
	'Android' => 'Android',
	'Desktop' => 'Escritorio', # Translate - New

## plugins/SmartphoneOption/extlib/Image/ExifTool/MIFF.pm

## plugins/SmartphoneOption/lib/Smartphone/CMS/Entry.pm
	'Re-Edit' => 'Re-editar',
	'Re-Edit (e)' => 'Re-editar (e)',
	'Rich Text(HTML mode)' => 'Texto con formato (modo HTML)',

## plugins/SmartphoneOption/lib/Smartphone/CMS/Listing.pm
	'All' => 'Todos',
	'Filters which you created from PC.' => 'Filtros creados en el PC.',

## plugins/SmartphoneOption/lib/Smartphone/CMS.pm
	'This function is not supported by [_1].' => 'Esta función no está soportada por [_1]',
	'This function is not supported by your browser.' => 'Esta función no está soportada por su navegador.',
	'Mobile Dashboard' => 'Panel de Control - Móvil',
	'Rich text editor is not supported by your browser. Continue with  HTML editor ?' => 'El editor de texto con formato no está soportado por el navegador. ¿Continuar con el editor HTML?',
	'Syntax highlight is not supported by your browser. Disable to continue ?' => 'El coloreado de sintaxis no está soportado por el navegador. ¿Desactivar para continuar? ',
	'[_1] View' => 'Vista [_1]',

## plugins/SmartphoneOption/lib/Smartphone/CMS/Search.pm
	'Search [_1]' => 'Buscar [_1]',

## plugins/SmartphoneOption/smartphone.yaml
	'to [_1]' => 'a [_1]', # Translate - New
	'Smartphone Main' => 'Móvil Principal',
	'Smartphone Sub' => 'Móvil Secundario',

## plugins/SmartphoneOption/tmpl/cms/dialog/select_formatted_text.tmpl
	'No boilerplate could be found.' => 'No se pudo encontrar ningún texto plantilla.', # Translate - New

);

1;
