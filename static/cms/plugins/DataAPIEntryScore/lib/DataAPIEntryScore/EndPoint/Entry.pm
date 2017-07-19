package DataAPIEntryScore::EndPoint::Entry;

use strict;
use warnings;

use MT::DataAPI::Endpoint::Common;
use MT::DataAPI::Endpoint::Entry;
use MT::DataAPI::Resource;
use DataAPIEntryScore::Util qw( load_entry_liked_authors );

sub get_likes_for_entry {
    my ( $app, $endpoint ) = @_;

    # load entry
    my ( $blog, $entry ) = context_objects(@_)
        or return;

    run_permission_filter( $app, 'data_api_view_permission_filter',
        'entry', $entry->id, obj_promise($entry) )
        or return;

    # out
    my $authors = load_entry_liked_authors($entry);
    return {
        totalResults => scalar @$authors,
        items => $authors
    };
}

sub add_like_to_entry {
    my ( $app, $endpoint ) = @_;

    # load entry
    my ( $blog, $entry ) = context_objects(@_)
        or return;
    my $orig_entry = $entry->clone;

    run_permission_filter( $app, 'data_api_view_permission_filter',
        'entry', $entry->id, obj_promise($entry) )
        or return;

    # pre save callbacks
    $app->run_callbacks( 'data_api_save_filter.entry',
        $app, $entry, $orig_entry )
        or return $app->error( $app->errstr, 409 );

    $app->run_callbacks( 'data_api_pre_save.entry', $app, $entry, $orig_entry )
        or return $app->error(
        $app->translate( "Save failed: [_1]", $app->errstr ), 409 );

    my $post_save
        = MT::DataAPI::Endpoint::Entry::build_post_save_sub($app, $blog, $entry, $orig_entry);

    # add like
    $entry->set_score('data_api_like', $app->user, 1, 0, $blog);

    # post save process
    $post_save->();

    # post save callback
    $app->run_callbacks( 'data_api_post_save.entry',
        $app, $entry, $orig_entry );

    # out
    my $authors = load_entry_liked_authors($entry);
    return {
        totalResults => scalar @$authors,
        items => $authors
    };
}

sub remove_like_from_entry {
    my ( $app, $endpoint ) = @_;

    $DB::signal = 1;
    # load entry
    my ( $blog, $entry ) = context_objects(@_)
        or return;
    my $orig_entry = $entry->clone;

    run_permission_filter( $app, 'data_api_view_permission_filter',
        'entry', $entry->id, obj_promise($entry) )
        or return;

    # pre save callbacks
    $app->run_callbacks( 'data_api_save_filter.entry',
        $app, $entry, $orig_entry )
        or return $app->error( $app->errstr, 409 );

    $app->run_callbacks( 'data_api_pre_save.entry', $app, $entry, $orig_entry )
        or return $app->error(
        $app->translate( "Save failed: [_1]", $app->errstr ), 409 );

    my $post_save
        = MT::DataAPI::Endpoint::Entry::build_post_save_sub($app, $blog, $entry, $orig_entry);

    # add like
    $entry->remove_score('data_api_like', $app->user);

    # post save process
    $post_save->();

    # post save callback
    $app->run_callbacks( 'data_api_post_save.entry',
        $app, $entry, $orig_entry );

    # out
    my $authors = load_entry_liked_authors($entry);
    return {
        totalResults => scalar @$authors,
        items => $authors
    };
}

1;
