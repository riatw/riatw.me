package DataAPIEntryScore::ContextHandlers::Tags;

use strict;

use DataAPIEntryScore::Util qw( load_entry_liked_authors );

sub entry_liked_authors {
    my ($ctx, $args, $cond) = @_;

    my $entry = $ctx->stash('entry')
        or return $ctx->_no_entry_error();

    my $authors = load_entry_liked_authors($entry);
    my $builder = $ctx->stash('builder');
    my $tokens  = $ctx->stash('tokens');
    my $res = '';
    my $vars = $ctx->{__stash}{vars} ||= {};
    my $count = 0;
    MT::Meta::Proxy->bulk_load_meta_objects($authors);
    for my $author (@$authors) {
        $count++;
        local $ctx->{__stash}{author}    = $author;
        local $ctx->{__stash}{author_id} = $author->id;
        local $vars->{__first__}         = $count == 1;
        local $vars->{__last__}          = !defined $authors->[$count];
        local $vars->{__odd__}     = ( $count % 2 ) == 1;
        local $vars->{__even__}    = ( $count % 2 ) == 0;
        local $vars->{__counter__} = $count;
        defined( my $out = $builder->build( $ctx, $tokens, $cond ) )
            or return $ctx->error( $builder->errstr );
        $res .= $out;
    }
    $res;
}

1;
