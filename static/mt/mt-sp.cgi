#!/usr/bin/perl -w

# Movable Type (r) (C) 2001-2015 Six Apart, Ltd. All Rights Reserved.
# This code cannot be redistributed without permission from www.sixapart.com.
# For more information, consult your Movable Type license.
#
# $Id$

use strict;
use File::Spec;
my ( $mt_lib, $sp_lib );

BEGIN {
    my $mt_home = $ENV{MT_HOME} ? $ENV{MT_HOME} : './';
    $mt_lib = File::Spec->catdir( $mt_home, 'lib' );
    $sp_lib = File::Spec->catdir( $mt_home, 'plugins', 'SmartphoneOption',
        'lib' );
}

use lib ( $mt_lib, $sp_lib );
use MT::Bootstrap App => 'MT::App::CMS::Smartphone';
