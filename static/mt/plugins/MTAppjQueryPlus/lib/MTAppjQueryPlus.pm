package MTAppjQueryPlus;

use strict;
use base 'MT::App';

###
##
#
use MT::Log;
use Data::Dumper;
sub doLog {
    my ($msg, $code) = @_;     return unless defined($msg);
    my $log = MT::Log->new;
    $log->message($msg);
    $log->metadata($code);
    $log->save or die $log->errstr;
}
#
##
###

sub init {
    my $app = shift;
    $app->SUPER::init(@_) or return;
    $app->add_methods(
        status => \&status,
        build => \&build,
        initialize => \&initialize,
        ajax => \&ajax,
    );
    $app->{default_mode} = 'status';
    $app->{charset} = $app->{cfg}->PublishCharset;
    $app;
}

sub initialize
{
    my $app = shift;
    my %param;
    $param{blog_id} = $app->param('blog_id');
    $param{type} = $app->param('_type');

        my $p = MT->component('MTAppjQueryPlus');
        return $p->load_tmpl($param{type} . '_initialize_view.tmpl', \%param);
}

sub ajax
{
    my $app = shift;
    my %param;
    $param{blog_id} = $app->param('blog_id');
    $param{type} = $app->param('_type');
    $param{offset} = $app->param('offset');
    $param{lastn} = $app->param('lastn');
    $param{square} = $app->param('square');
    $param{tags} = $app->param('tags');
        my $p = MT->component('MTAppjQueryPlus');
    return $p->load_tmpl($param{type} . '_ajax_view.tmpl', \%param);
}

sub build
{
    my $app = shift;
    my %param;
    $param{tmpl} = $app->param('tmpl');
        my $p = MT->component('MTAppjQueryPlus');
    return $p->load_tmpl('build.tmpl', \%param);
}

sub status
{
    my $str = '{"test1":"aaa","test2":"bbb"}';
    return "hello";
}

sub script { return 'mt-jqueryplus.cgi'; }

sub cgi_path {
    my $path = MT->config->CGIPath;
    $path =~ s!/$!!;
    $path =~ s!^https?://[^/]*!!;
    $path .= '/plugins/MTAppjQueryPlus';
    return $path;
}

sub hello {
    my $app = shift;

    $app->{no_print_body} = 1;
    $app->send_http_header("text/plain");
    $app->print_encode("Hello PSGI.");
}

sub template_source_header {
    my ($cb, $app, $tmpl_ref) = @_;

    my $p = MT->component('MTAppjQueryPlus');
    my $static_path        = $app->static_path;
    my $static_plugin_path = $static_path . $p->envelope . '/';

    my $mtappjqueryplus = <<__MTML__;
    <mt:setvarblock name="html_head" append="1">
    <link rel="stylesheet" href="${static_plugin_path}css/MTAppjQueryPlus.css" type="text/css" />
    <script type="text/javascript" src="${static_plugin_path}js/jquery.calendar-min.js"></script>
    <script type="text/javascript" src="${static_plugin_path}js/MTAppjQueryPlus.js"></script>
    </mt:setvarblock>
    <mt:var name="html_head">
__MTML__

    my $mtappjqueryplus = <<__MTML__;
    <mt:setvarblock name="html_head" append="1">
    <link rel="stylesheet" href="${static_plugin_path}css/MTAppjQueryPlus.css" type="text/css" />
    <script type="text/javascript" src="${static_plugin_path}js/jquery.calendar-min.js"></script>
    <script type="text/javascript" src="${static_plugin_path}js/MTAppjQueryPlus.js"></script>
    </mt:setvarblock>
__MTML__

#$$tmpl_ref =~ s/(<mt:var name="html_head">)/$mtappjqueryplus$1/g;
$$tmpl_ref =~ s/(<mt:var name="html_head">)/$mtappjqueryplus$1/g;
}

1;
