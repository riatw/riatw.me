package DataAPIEntryScore::Util;

use strict;
use warnings;

use base 'Exporter';
our @EXPORT_OK = qw( load_entry_liked_authors );

sub load_entry_liked_authors {
    my ($entry, $terms, $args) = @_;

    # check terms / args
    $terms ||= {};
    $args ||= {};
    $args->{sort} ||= 'nickname';
    my $is_sort_by_liked_on = 0;
    if ($args->{sort} eq 'liked_on') {
        delete $args->{sort};
        $is_sort_by_liked_on = 1;
    }

    # load authors
    my $scores = $entry->_get_objectscores('data_api_like');
    $DB::signal = 1;
    my %scores_by_author_id = map { $_->author_id => $_ } @$scores;
    my @author_ids = map { $_->author_id } @$scores;
    my @authors = MT->model('author')->load({ id => \@author_ids });

    # sort by liked_on
    if ($is_sort_by_liked_on) {
        @authors = sort {
            $scores_by_author_id{$a->id}->{created_on} <=>
            $scores_by_author_id{$b->id}->{created_on};
        } @authors;
    }

    # out
    return \@authors;
}

package MT::Scorable;

use strict;
use MT::ObjectScore;

sub remove_score {
    my $obj = shift;
    my ( $namespace, $user ) = @_;

    return $obj->error( MT->translate('Object must be saved first.') )
        unless $obj->id;

    my $mt = MT->instance;
    my $ip;
    if ( $mt->isa('MT::App') ) {
        $ip = $mt->remote_ip;
    }

    my $term = {
        namespace => $namespace,
        object_id => $obj->id,
        object_ds => $obj->datasource,
    };
    $term->{ip} = $ip if $ip && !$user;
    $term->{author_id} = $user->id if $user;

    my $s = @{ $obj->_load_score_data($term) }[0];
    if ($s) {
        $s->remove();
        $obj->_flush_score_cache($term);
    }
}

1;
