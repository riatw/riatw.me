# Movable Type (r) (C) 2007-2013 Six Apart, Ltd. All Rights Reserved.
# This code cannot be redistributed without permission from www.sixapart.com.
# For more information, consult your Movable Type license.
#
# $Id$

package CustomFields::DataAPI;

use strict;
use warnings;

use CustomFields::Util qw(get_meta);

our %custom_fields_cache;

sub updatable_fields {
    ['customFields'];
}

sub fields {
    [   {   name        => 'customFields',
            from_object => sub {
                my ($obj) = @_;

                my $meta = get_meta($obj);
                [   map {
                        +{  basename => $_->basename,
                            value    => $meta->{ $_->basename },
                        };
                    } @{ custom_fields($obj) }
                ];
            },
            to_object => sub {
                my ( $hash, $obj ) = @_;

                my %values = ();
                for my $v ( @{ $hash->{customFields} || [] } ) {
                    $values{ $v->{basename} } = $v->{value};
                }

                for my $f ( @{ custom_fields($obj) } ) {
                    my $bn = $f->basename;
                    $obj->meta( 'field.' . $bn, $values{$bn} )
                        if exists $values{$bn};
                }

                return;
            },
        },
    ];
}

sub custom_fields {
    my ($obj) = @_;
    my $obj_type = $obj->class_type || $obj->datasource;
    my $blog_id = $obj->can('blog_id') ? $obj->blog_id : 0;

    $custom_fields_cache{$obj_type} ||= {};
    if ( !$custom_fields_cache{$obj_type}{$blog_id} ) {
        my $c = MT->component('commercial');
        load_meta_fields() unless $c->{customfields};

        $custom_fields_cache{$obj_type}{$blog_id} = [
            grep {
                $_->obj_type eq $obj_type
                    && ( $_->blog_id == $blog_id || $_->blog_id == 0 )
            } @{ $c->{customfields} }
        ];
    }

    $custom_fields_cache{$obj_type}{$blog_id};
}

1;
