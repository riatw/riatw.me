package MT::Plugin::Duplicate;
use strict;
use MT;
use MT::Plugin;

our $VERSION = '0.90';

use base qw( MT::Plugin );

###################################### Init Plugin #####################################

@MT::Plugin::Duplicate::ISA = qw(MT::Plugin);

my $plugin = new MT::Plugin::Duplicate({
    id => 'Duplicate',
    key => 'duplicate',
    description => '<MT_TRANS phrase=\'_PLUGIN_DESCRIPTION\'>',
    name => 'Duplicate',
    author_name => 'Junnama Noda',
    author_link => 'http://junnama.alfasado.net/online/',
    'version' => $VERSION,
    l10n_class => 'Duplicate::L10N',
});

MT->add_plugin($plugin);

sub init_registry {
    my $plugin = shift;
    $plugin->registry({
        callbacks => {
            'MT::App::CMS::template_source.entry_table'
                => \&_add_duplicate_buttons,
            'MT::App::CMS::template_param.edit_entry'
                => \&_mode_is_duplicate,
            'MT::App::CMS::template_source.edit_entry',
                => {
                    handler => \&_add_duplicate_action,
                    priority => 10,
                }
        },
   });
}

##################################### Main Routine ####################################

sub _add_duplicate_buttons {
    my ($cb, $app, $tmpl) = @_;
    my $alt_tmpl;
    open(FH, "plugins/Duplicate/tmpl/entry_table.tmpl") or die;
    while (<FH>) {
        $alt_tmpl .= $_;
    }
    $alt_tmpl =~ s/<__trans phrase="Duplicate">/$plugin->translate("Duplicate")/eg;
    $alt_tmpl =~ s/<__trans phrase="Action">/$plugin->translate("Action")/eg;
    $$tmpl = $alt_tmpl;
}

sub _mode_is_duplicate {
    my ($cb, $app, $param, $tmpl) = @_;
    my $q = $app->param;
    my $duplicate = $q->param('duplicate');
    if ($duplicate) {
        $param->{new_object} = 1;
    }
}

sub _add_duplicate_action {
    my ($cb, $app, $tmpl) = @_;
    my $q = $app->param;
    my $duplicate = $q->param('duplicate');
    unless ($duplicate) {
       my $source ='<div id="autosave-notification-';
       my $new = <<'HTML';
    <unless:if name="new_object">
    <button
        mt:command="view"
        mt:object-type="<mt:var name="object_type" escape="html">" mt:blog-id="<mt:var name="blog_id">"
        type="button"
        class="button"
    <mt:if name="object_type" eq="page">
        title="<__trans phrase="Duplicate this page">"
    <mt:else>
        title="<__trans phrase="Duplicate this entry">"
    </mt:if>
        onclick="window.location.href='<$mt:var name="script_url"$>?__mode=view&amp;_type=<mt:var name="object_type">&amp;id=<$mt:var name="id"$>&amp;blog_id=<$mt:var name="blog_id"$>&amp;duplicate=1'"
        ><__trans phrase="Duplicate"></button>
    </mt:unless>
HTML
        $new =~ s/<__trans phrase="Duplicate this page">/$plugin->translate("Duplicate this page")/eg;
        $new =~ s/<__trans phrase="Duplicate this entry">/$plugin->translate("Duplicate this entry")/eg;
        $new =~ s/<__trans phrase="Duplicate">/$plugin->translate("Duplicate")/eg;
        my $old = quotemeta($source);
        $$tmpl =~ s/$old/$new$source/s;
    } else {
        my $old = quotemeta('mt:command="do-remove-items"');
        $$tmpl =~ s/$old/style="display:none"/;
    }
}

1;