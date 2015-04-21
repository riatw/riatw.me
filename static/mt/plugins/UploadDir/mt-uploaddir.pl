# $Id: mt-uploaddir.pl 45 2011-06-03 02:34:22Z cheebow $

package MT::Plugin::UploadDir;

use strict;
use MT::Plugin;
@MT::Plugin::UploadDir::ISA = qw(MT::Plugin);

my $DEFAULT_EXT = "audio:mp3,wma,m4a,midi,wav,aiff\n";
$DEFAULT_EXT .= "videos:mp4,m4v,mpeg,avi,mov,wmv\n";
$DEFAULT_EXT .= "images:bmp,jpg,jpeg,gif,tif,tiff,png\n";
$DEFAULT_EXT .= "text:txt\n";
$DEFAULT_EXT .= "docs:pdf,doc,xls,ppt\n";
$DEFAULT_EXT .= "src:pl,c,cc,pas,rb\n";
$DEFAULT_EXT .= "archive:bz2,cab,gz,jar,lzh,rar,tar,taz,zip\n";

use vars qw($PLUGIN_NAME $VERSION);
$PLUGIN_NAME = 'UploadDir';
$VERSION = '0.63';

use MT;
my $plugin = new MT::Plugin::UploadDir({
    name => $PLUGIN_NAME,
    version => $VERSION,
    description => "<MT_TRANS phrase='This plugin automatically switches the destination directory for the uploaded file by the file extension.'>",
    doc_link => 'http://labs.m-logic.jp/plugins/mt-uploaddir/docs/mt-uploaddir.html',
    author_name => 'M-Logic, Inc.',
    author_link => 'http://labs.m-logic.jp/',
    blog_config_template => \&template,
    l10n_class => 'UploadDir::L10N',
    settings => new MT::PluginSettings([
        ['upload_dir_ext_list', { Default => $DEFAULT_EXT }],
        ['upload_dir_ext_default']
    ]),});

MT->add_plugin($plugin);
MT->add_callback('MT::App::CMS::AppTemplateSource.upload', 9, $plugin, \&hdlr_source);
# for MT4
MT->add_callback('MT::App::CMS::template_source.asset_upload', 9, $plugin, \&hdlr_source_mt4);

sub doLog {
    my ($msg) = @_; 
    use MT::Log; 
    my $log = MT::Log->new; 
    if ( defined( $msg ) ) { 
        $log->message( $msg ); 
    }
    $log->save or die $log->errstr; 
}

sub instance { $plugin; }

sub template {
    my $tmpl = <<'EOT';
    <div class="setting">
    <div class="label">
    <label for="upload_dir_ext_list"><MT_TRANS phrase="Extensions:"></label>
    </div>
    <div class="field">
    <p><textarea name="upload_dir_ext_list" id="upload_dir_ext_list" cols="60" rows="10"><TMPL_VAR NAME=UPLOAD_DIR_EXT_LIST ESCAPE=HTML></textarea></p>
    </div> 
    </div>
    <div class="setting">
    <div class="label">
    <label for="upload_dir_ext_default"><MT_TRANS phrase="Default directory:"></label>
    </div>
    <div class="field">
    <p><input type="text" name="upload_dir_ext_default" id="upload_dir_ext_default" value="<TMPL_VAR NAME=UPLOAD_DIR_EXT_DEFAULT ESCAPE=HTML>" /></p>
    </div> 
    </div>
EOT
}

sub upload_dir_ext_list {
    my $plugin = shift;
    my ($blog_id) = @_;
    my %plugin_param;

    $plugin->load_config(\%plugin_param, 'blog:'.$blog_id);
    my $key = $plugin_param{upload_dir_ext_list};
    unless ($key) {
        $plugin->load_config(\%plugin_param, 'system');
        $key = $plugin_param{upload_dir_ext_list};
    }
    $key;
}

sub upload_dir_ext_default {
    my $plugin = shift;
    my ($blog_id) = @_;
    my %plugin_param;

    $plugin->load_config(\%plugin_param, 'blog:'.$blog_id);
    my $key = $plugin_param{upload_dir_ext_default};
    unless ($key) {
        $plugin->load_config(\%plugin_param, 'system');
        $key = $plugin_param{upload_dir_ext_default};
    }
    $key;
}

sub parse_ext {
    my $plugin = shift;
    my $ext_list = shift;

    $ext_list =~ s/,/\|/g;

    my @lines = split(/\n/, $ext_list);

    my %ext = ();
    foreach my $line (@lines) {
        $line =~ s/[\r\n]//g;
        last if !$line;
        $line =~ m/([^:]+):(.+)$/;
        $ext{$2} = $1;
    }

    %ext;
}

sub hdlr_source {
    if (MT->version_number < 3.4) {
        hdlr_source_3_3(@_);
    } else {
        hdlr_source_w(@_);
    }
    1;
}

sub make_script {
    my $plugin = shift;
    my ($blog_id) = @_;

    my $ext_list = $plugin->upload_dir_ext_list($blog_id);
    my $ext_default = $plugin->upload_dir_ext_default($blog_id);

    my %ext = $plugin->parse_ext($ext_list);

    my $ext_if;
    foreach my $key ( keys %ext ) {
        $ext_if .= 'if (fln.match(/\.(' . $key . ')$/i)){' . "\n";
        $ext_if .= '    el.value = \'' . $ext{$key} . "'\n";
        $ext_if .= '} else '
    }
    $ext_if .= "{ \n";
    $ext_if .= "    el.value = '" . $ext_default . "';\n";
    $ext_if .= "}\n";

    my $script = <<"HTML";
<script type="text/javascript" language="JavaScript">
<!--
function changePath(fl){
var fln = fl.value;
var el = document.getElementById('extra_path');

$ext_if
}
//-->
</script>
HTML

    $script;
}

sub hdlr_source_3_3 {
    my ($eh, $app, $tmpl_ref) = @_;

    my $blog = $app->blog;
    
    my $old = <<'HTML';
<p><label for="file"><MT_TRANS phrase="File:"></label> <input type="file" name="file" /></p>
HTML

    my $script = $plugin->make_script($blog->id);
    my $new = <<"HTML";
$script

<p><label for="file"><MT_TRANS phrase="File:"></label> <input type="file" name="file" onchange="changePath(this)" /></p>
HTML

    $$tmpl_ref =~ s!$old!$new!;

    1;
}

sub hdlr_source_w {
    my ($eh, $app, $tmpl_ref) = @_;

    my $blog = $app->blog;
    
    my $old = <<'HTML';
<p><input type="file" name="file" /></p>
HTML

    my $script = $plugin->make_script($blog->id);
    my $new = <<"HTML";
$script

<p><input type="file" name="file" onchange="changePath(this)" /></p>
HTML

    $$tmpl_ref =~ s!$old!$new!;

    1;
}

sub hdlr_source_mt4 {
    my ($eh, $app, $tmpl_ref) = @_;
    my $blog = $app->blog;
    #MT4
    my $old = <<'HTML';
<input type="file" name="file" />
HTML
    
    my $script = $plugin->make_script($blog->id);
    my $new = <<"HTML";

$script

<input type="file" name="file" onchange="changePath(this)" />
HTML
    $$tmpl_ref =~ s!$old!$new!;

    #MT4.2->
    $old = <<'HTML';
<input type="file" name="file" id="file" />
HTML
    
    $script = $plugin->make_script($blog->id);
    $new = <<"HTML";

$script

<input type="file" name="file" id="file" onchange="changePath(this)" />
HTML
    $$tmpl_ref =~ s!$old!$new!;

    1;
}

1;
