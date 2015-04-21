package Ranking_Entries::Tags;
use strict;

# Block Tags
sub hdlr_rankingentries {
    my ($ctx, $args, $cond) = @_;

    my $res = '';
    my $tokens = $ctx->stash('tokens');
    my $builder = $ctx->stash('builder');

#    foreach my $value (@values) {
        defined(my $out = $builder->build($ctx, $tokens, $cond))
            or return $ctx->error($builder->errstr);
        $res .= $out;
#    }
    return $res;
}

1;