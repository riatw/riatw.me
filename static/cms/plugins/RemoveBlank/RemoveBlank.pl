package MT::Plugin::RemoveBlank;

use strict;
use MT::Template::Context;
use base qw(MT::Plugin);

my $plugin = new MT::Plugin::RemoveBlank({
    name        => 'RemoveBlank',
    version     => '1.03',
    description => 'Remove space and tab between a tag.',
    author_name => 'bzbell',
    author_link => 'http://bizcaz.com/',
    doc_link    => 'http://bizcaz.com/archives/2007/09/09-174534.php',

    registry => {
        tags => {
            block => {
                RemoveBlank => \&remove_blank_main,
            },
        },
    },
});

MT->add_plugin($plugin);

sub instance
{
	$plugin;
}

sub remove_blank_main
{
    my ($ctx, $args, $cond) = @_;

    my $builder = $ctx->stash('builder');
    my $tokens  = $ctx->stash('tokens');

    my $out = $builder->build ($ctx, $tokens, $cond);
    return $ctx->error ($builder->errstr) if !defined $out;

    my @list = split(/[\r\n]/, $out);
    $out = remove_blank_trim(@list);
    $out;
}

sub remove_blank_trim
{
    my @out = @_;
    my $txt = '';

    for (@out) {
#        s/^\s*(.*?)\s*$/$1/;
        s/^\s+//;
        s/\s+$//;
        $txt .= $_ . "\n" if ($_ ne '');
    }

    return $txt;
}

1;
