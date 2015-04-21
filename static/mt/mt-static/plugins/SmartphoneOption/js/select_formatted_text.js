jQuery(function($) {

    var dialog;

    function init() {
        var panel = new ListingPanel('formatted_text');
        dialog = new Dialog.Simple('list-formatted-texts');

        var originalOnUpdate = panel.datasource.onUpdate;
        panel.datasource.onUpdate = function(ds) {
            originalOnUpdate.apply(this, arguments);
            panel.tableSelect.onChange(panel.tableSelect);
        };

        dialog.panel = panel;
        panel.pager.setState($.parseJSON($('#pager_json').val()));
        panel.parent = dialog;
        dialog.open({}, dialogClose);
    }

    function dialogClose(data) {
        if (!data) {
            parent.jQuery.fn.mtDialog.close();
            return;
        }

        var selecteds  = dialog.panel.tableSelect.selected();
        var id         = selecteds[0].value;
        var html       = jQuery('#formatted-text-' + id + '-text').val();
        var edit_field = $('#edit_field').val();

        window.parent.app.insertHTML(html, edit_field);
        window.parent.jQuery.fn.mtDialog.close();

        parent.jQuery.fn.mtDialog.close();
        return;
    }

    init();
});
