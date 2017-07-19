/*
 * $Id$
 */
;(function($) {

/*
 *
 * Utilities
 *
 */

function touchable() {
    return (typeof Touch === 'object');
}

function getTouches(e) {
    if(e.originalEvent) {
        if(e.originalEvent.touches && e.originalEvent.touches.length) {
            return e.originalEvent.touches;
        } else if(e.originalEvent.changedTouches && e.originalEvent.changedTouches.length) {
            return e.originalEvent.changedTouches;
        }
    }
    return e.touches;
}

function blurFormElements() {
    // Blur form elements for Android problem.
    // The fucused element always brought to the front.
    var selection = window.getSelection();
    if(selection && selection.focusNode) {
        $(selection.focusNode).find('input, select, textarea').each(function() { this.blur(); });
    }
}

/*
 * sortable
 *
 * Override jQuery.ui.sortable to change the bihaviour.
 */
$.fn.mtOriginalSortable = $.fn.sortable;
$.fn.sortable = function(options) {
    if(typeof options == 'object') {
        // Slow down scroll.
        options.scrollSpeed = 10;
    }
    return this.mtOriginalSortable(options);
}

/*
 *
 * selectable
 *
 * Override jQuery.ui.selectable to change the bihaviour.
 *
 */
$.fn.mtOriginalSelectable = $.fn.selectable;
$.fn.selectable = function(options) {
    var originalSelected = options.selected;
    var newSelected = function(event, ui) {
        var $tr = $(ui.selected);
        var checkboxOffset = 0;

        // Has checkboxes?
        var $cb = $tr.find('td.cb');
        if ($cb.length > 0)
            checkboxOffset = $cb.width();

        if( checkboxOffset > 0 && event.clientX >= checkboxOffset ) {
            // Open the first anchor.
            var target = options.anchorsTarget;
            if ( !target )
                target = '.smartphone_main a';

            var href = $tr.find(target).filter(function() {
                return $(this).attr('href')? true: false;
            }).first().attr('href');

            if ( href ) {
                if ( $tr.find('input:checked').length == 0 ) {
                    setTimeout(function() {
                        $tr.removeClass('selected');
                    }, 1000);
                }
                location.href = href;
                return true;
            }
        }

        if ( originalSelected )
            return originalSelected(event, ui);

        return false;
    };
    var dummySelected = function() {};
    options.selected = touchable()? dummySelected: newSelected;

    // Touch focus.
    if(!$('body').hasClass('dialog')) {
        this.mtTouchHighlight({
            target: 'tr',
            toggleClass: 'selected',
            emulateSelected: touchable()? newSelected: null,
            touchEndResult: true 
        });
    }

    return this.mtOriginalSelectable(options);
}

/*
 * mtDialog
 *
 * Copy almost from the original to override.
 *
 */
var mt_dialog_top = -1;
$.fn.mtDialog = function(options) {
    var defaults = {
        loadingimage: StaticURI+'images/indicator.gif',
        esckeyclose: true
    };
    var opts = $.extend(defaults, options);
    init_dialog();
    return this.each(function() {
        $(this).click(function() {
            open_dialog(this.href, opts);
            return false;
        });
    });
};

function init_dialog() {
    $(window).resize(function() {
        resize_dialog();
    });

    var $dialog = $('.mt-dialog');
    if (!$dialog.length) {
        $('body').append('<div class="mt-dialog"><span>Close</span></div>');
        $('.mt-dialog').after('<div class="mt-dialog-overlay overlay"></div>');
        $(".mt-dialog > div > span").click(function() {
            close_dialog();
        });
    }

    // Added for smartphone.
    $('.mt-dialog-overlay').bind('mousedown', function(event) {
        event.preventDefault();
        close_dialog();
    });
};

function resize_dialog() {
    var $dialog = $('.mt-dialog');
    var height = $(window).height();
    if ($dialog.length) {
        $dialog.height(height - 60);
        $('#mt-dialog-iframe').height(height - 60);

        // Add for smartphone.
        var contentHeight = $('#container').height();
        $('.mt-dialog-overlay').css('min-height', contentHeight);
    }
};

// Add for smartphone.
function resize_mt_dialog() {
    var dialogHeight = $('#mt-dialog-iframe').contents().find('body').get(0).scrollHeight;
    $('.mt-dialog').css('min-height', dialogHeight + 'px');
    $('#mt-dialog-iframe').css('min-height', dialogHeight + 'px');

    // On loaded, scroll to dialog top.
    window.scrollTo( 0, mt_dialog_top );
}

function open_dialog(href, opts) {
    if ( opts.form ) {
        var param = opts.param;
        $('<iframe />')
            .attr({
                id: 'mt-dialog-iframe',
                name: 'mt-dialog-iframe',
                frameborder: '0',
                width: '100%'
            })
            .load(function() {
                $('.mt-dialog .loading').remove();

                // Add for smartphone.
                resize_mt_dialog();
            })
            .appendTo($('.mt-dialog'));

        resize_dialog();
        $('<img />')
            .attr({
                src: opts.loadingimage
            })
            .addClass('loading')
            .appendTo($('.mt-dialog'));
        var form = $('<form />')
            .attr({
                'id': 'mt-dialog-post-form',
                'method': 'post',
                'action': href,
                'target': 'mt-dialog-iframe'
            })
            .append( $( '#' + opts.form).children().clone() )
            .appendTo($('.mt-dialog'));
        $.each( param, function( key, val ) {
            form.find('[name=' + key + ']').remove();
            $('<input />')
                .attr({
                    'type': 'hidden',
                    'name': key,
                    'value': val
                })
                .appendTo( form )
        });
        form.submit();
        form.remove();
    }
    else {
        $('<iframe />')
            .attr({
                id: 'mt-dialog-iframe',
                frameborder: '0',
                src: href+'&dialog=1',
                width: '100%'
            })
            .load(function() {
                $('.mt-dialog .loading').remove();

                // Add for smartphone.
                resize_mt_dialog();
            })
            .appendTo($('.mt-dialog'));

        resize_dialog();
        $('<img />')
            .attr({
                src: opts.loadingimage
            })
            .addClass('loading')
            .appendTo($('.mt-dialog'));
    }
    if (navigator.userAgent.indexOf("Gecko/") == -1) {
        $('body').addClass('has-dialog');
    }

    // Added for smartphone.
    mt_dialog_top = $(window).scrollTop();
    $('.mt-dialog').css( 'top', ( mt_dialog_top + 4 ) + 'px' );
    $('body').addClass('no-highlight');
    blurFormElements();

    $('.mt-dialog').show();
    $('.mt-dialog').bind('close', function(event, fn) {
        fn(event);
    });
    $('.mt-dialog-overlay').show();
    if (opts.esckeyclose) {
        $(document).keyup(function(event){
            if (event.keyCode == 27) {
                close_dialog();
            }
        });
    }
    // for ie6 tweaks
    if (!$.support.style && !$.support.objectAll) {
        if ($.fn.bgiframe) $('.mt-dialog-overlay').bgiframe();
        if ($.fn.exFixed) $('.mt-dialog').exFixed();
    }
};

function close_dialog(url, fn) {
    $('body').removeClass('has-dialog');
    $('.mt-dialog-overlay').hide();
    if (fn) {
        $('.mt-dialog').trigger('close', fn);
    }
    $('.mt-dialog').unbind('close');
    $('.mt-dialog').hide();

    // Added for Smartphone.
    // Scroll back to original position and reset position.
    window.scrollTo( 0, mt_dialog_top );
    mt_dialog_top = -1;
    $('body').removeClass('no-highlight');

    $('#mt-dialog-iframe').remove();
    if (url) {
        window.location = url;
    }
};

$.fn.mtDialog.open = function(url, options) {
    var defaults = {
        loadingimage: StaticURI+'images/indicator.gif',
        esckeyclose: true
    };
    var opts = $.extend(defaults, options);
    init_dialog();
    open_dialog(url, opts);
};

$.fn.mtDialog.close = function(url, fn) {
    close_dialog(url, fn);
};

$.event.special.dialogReady = {
    setup:function( data, ns ) {
        return false;
    },
    teardown:function( ns ) {
        return false;
    }
};

$.fn.mtDialogReady = function(options) {
    $(window).trigger('dialogReady');
};

/*
 *
 * jQuery mtAutoResizeTextArea
 *
 * Resizes textarea automatically.
 *
 */
$.fn.mtAutoResizeTextArea = function(options) {
    var defaults = {
    };
    var opts = $.extend( defaults, options );

    return this.each( function() {
        // Elements.
        var textarea = this,
            $textarea = $(this);

        // Height status.
        var originalHeight = $textarea.height(),
            lastHeight = 0,
            currentHeight = 0;

        // Key event handler.
        var keyHandler = function() {
            var newHeight = textarea.scrollHeight,
                deltaHeight = newHeight - lastHeight;

            if(deltaHeight > 0 && newHeight > originalHeight) {
                window.scrollBy(0, deltaHeight);
                $textarea.height(newHeight + 'px');
            }

            lastHeight = newHeight;
        };

        // Focus handler.
        var focusHandler = function() {
            var newHeight = textarea.scrollHeight;

            if(newHeight > lastHeight) {
                $textarea.height(newHeight + 'px');
            }

            lastHeight = newHeight;
        };

        $textarea.bind( {
            keydown: keyHandler,
            focus: focusHandler
        } );
    } );
};

/*
 *
 * jQuery mtTouchHighlight
 *
 * Highlight element by touching.
 *
 */
$.fn.mtTouchHighlight = function(options) {
    var defaults = {
        threshold: 4,
        timeout: 1500,
        touchEndResult: true
    };
    var opts = $.extend(defaults, options);

    return this.each( function() {
        var $this = $(this);
        var startEvent = null;
        var $target = null,
            startX = 0, startY = 0,
            deltaX = 0, deltaY = 0;

        $(this).bind('touchstart', function(e) {
            // Handle only for a finger.
            var touches = getTouches(e);
            if ( touches.length != 1 ) {
                $target = null;
                return true;
            }

            var touch = touches[0];
            startX = touch.screenX;
            startY = touch.screenY;
            deltaX = deltaY = 0;
            $target = opts.target? $(e.target).parents().andSelf().filter(opts.target): $(this);
            startEvent = e;
            startEvent.clientX = touch.clientX;
            startEvent.clientY = touch.clientY;

            return true;
        }).bind('touchmove', function(e) {
            // Handle only for a finger.
            var touches = getTouches(e);
            if ( touches.length != 1 ) {
                $target = null;
                return true;
            }

            // Coodinate changing.
            var touch = touches[0];
            deltaX = Math.abs(touch.screenX - startX);
            deltaY = Math.abs(touch.screenY - startY);

            // If much moved, cancel highlighting.
            if($target && ( deltaY > opts.threshold || deltaX > opts.threshold ) ) {
                $target = null;
            }

            return true;
        }).bind('touchend', function(e) {
            if ( $target ) {
                if ( opts.toggleClass ) {
                    $target.addClass(opts.toggleClass);
                }

                if ( opts.emulateSelected ) {
                    var ui = new Object;
                    ui.selected = $target.get(0);
                    opts.emulateSelected(startEvent, ui);
                }
            } else {
                return true;
            }

            return opts.touchEndResult;
        }).bind('touchcancel', function(e) {
            // Cancel hilighting.
            $target = null;
        });
    });
}

/*
 *
 * mtSplitDatetime
 *
 * Splits text boxes for date and time to pulldowns.
 *
 */
$.fn.mtSplitDatetime = function(options) {
    var defaults = {
        dateDelimiter: '-',
        timeDelimiter: ':'
    };
    var opts = $.extend(defaults, options);

    var pulldowns = {
            month: { from: 1, to: 12 },
            day: { from: 1, to: 31 },
            hour: { from: 0, to: 23 },
            minute: { from: 0, to: 59 },
            second: { from: 0, to: 59 }
        },
        buildPulldown = function(basename, type, value) {
            var html = '';

            // Build select element html.
            html += '<select name="' + basename + '_' + type + '" class="splitted splited-' + type + '">';
            html += '<option value=""></option>'

            var pulldown = pulldowns[type];
            for(var i = pulldown.from; i <= pulldown.to; i++) {
                var withZero = (i < 10? "0": "") + i;
                html += '<option value="' + withZero + '"';
                if(i === value || withZero === value)
                    html += ' selected="selected"';
                html += '>' + withZero + '</option>';
            }
            html += '</select>';

            return html;
        };

    return this.each(function() {
        // Delay to initialize called actually.
        var $this = $(this);
        var val = $this.val();
        var basename = $this.attr('name');
        var html = '';

        // FIXME: type=number is the best for Year.
        // But iPhone shows comma in type=number, and I can't hide it.
        var number_type = $('body').hasClass('device-iphone')? 'text': 'number';

        if($this.hasClass('text-date')) {
            // In the case of date.
            var parts = val.split(opts.dateDelimiter);
            var year = parts.length > 0? parts[0]: "",
                month = parts.length > 1? parts[1]: "",
                day = parts.length > 2? parts[2]: "";

            html += '<span class="splited-date">';
            html += '<input type="' + number_type + '" pattern="[0-9]*" class="splited-year text num" class="splitted splitted-year" name="' + basename + '_year" maxlength="4" value="' + year + '" />';
            html += opts.dateDelimiter + buildPulldown(basename, 'month', month);
            html += opts.dateDelimiter + buildPulldown(basename, 'day', day);
            html += '</span>';
        } else if($this.hasClass('entry-time') || ($this.hasClass('text') && $this.hasClass('time'))) {
            // In the case of time.
            var parts = val.split(opts.timeDelimiter);
            var hour = parts.length > 0? parts[0]: "",
                minute = parts.length > 1? parts[1]: "",
                second = parts.length > 2? parts[2]: "";

            html += '<span class="splited-time">';
            html += buildPulldown(basename, 'hour', hour);
            html += opts.timeDelimiter + buildPulldown(basename, 'minute', minute);
            html += opts.timeDelimiter + buildPulldown(basename, 'second', second);
            html += '</span>';
        }

        if(html.length > 0) {
            // Replace with the element.
            $this.after($(html)).remove();
            // Insert datetime_splited_beacon once.
            if($("input[name='datetime_splited_beacon']").length == 0)
                $('#entry_form').prepend('<input type="hidden" name="datetime_splited_beacon" value="1" />');
        }
    });
}

/*
 *
 * jQuery mtEllipsisText
 *
 * Shortens length of text node.
 *
 */
$.fn.mtEllipsisText = function(options) {
    var defaults = {
        length: 128,
        leader: '...'
    };
    var opts = $.extend(defaults, options);

    return this.each(function() {
        var textNodes = [];
        $(this).contents()
        .filter(function() { return this.nodeType == Node.TEXT_NODE; })
        .each(function() {
            var text = this.nodeValue;
            if(text.length > opts.length) {
                text = text.substr(0, opts.length);
                text += opts.leader;
                this.nodeValue = text;
            }
        });
    });
}

/*
 * mtSmartphone
 *
 * Makes Movable Type screens suitable for Smartphone.
 *
 */

$.mtSmartphone = function(options) {
    var defaults = {
        delay: 100,
        tabMargin: 5,
        entryIframeMessage: 'WYSIWYG mode is disable on this device. Change to HTML mode to edit?',
        templateIframeMessage: 'Code highlight is disable on this device. Turn off the highlight to edit?'
    };
    var opts = $.extend(defaults, options);

    // Hide address bar when loaded and orientation changed.
    hideAddressBar(opts);

    // Add menu button and redefine popup behaviour.
    addMenuButton(opts);
    handlePopups(opts);

    // Handle editor iframes.
    if(opts.request.type == 'entry' || opts.request.type == 'page')
        handleIframeEditor(opts);

    // Make jQuery.ui.sortable touchable.
    touchSortable(opts);

    // Adjust other events and styles.
    adjustEvents(opts);
    adjustStyles(opts);
};

/*
 * Hide address bar after loaded
 *
 */
function hideAddressBar(opts) {
    var fn = function() {
        setTimeout(function() {
            if (window.pageYOffset === 0)
                window.scrollTo(0,1);
        }, opts.delay);
    };

    $(window).bind('load', fn);
    $('body').bind('orientationchange', fn);
}

/*
 * Disable some mouse events.
 *
 */
function adjustEvents(opts) {
    if(opts.request.type == 'enety' || opts.request.type == 'page') {
        $('#category-selector-list').mtTouchHighlight({
            target: '.list-item',
            toggleClass: 'list-item-hover'
        });
    }

    if(opts.request.mode == 'dashboard') {
        $('.widget .blog-content').each(function() {
            var href = $(this).find('h4 a').attr('href');
            if(href) {
                $(this).find('.thumbnail').css('cursor', 'pointer')
                    .click(function() {
                        location.href = href;
                    });
            }
        });
    }

    if ( $('body').hasClass('device-ios') ) {
        $('textarea').mtAutoResizeTextArea();
    }

    if( opts.request.mode == 'list' && ( opts.request.type == 'category' || opts.request.type == 'folder' ) ) {
        $('#root').on('mousedown','.sortable-item',function(e){
            var $target = $(e.target);
            if(!$target.hasClass('sort-tab')) {
                $target.parents().andSelf().filter('.sortable-item').removeClass('selected');
                var url = $(this).find('.item-label a').attr('href');
                if ( url ) {
                    location.href = url;
                }
            }
        });
    }
}

/*
 * Adjust some styles can't change by CSS.
 *
 */
function adjustStyles(opts) {
    // Remove text from some element.
    $('.indicator,#field-convert_breaks,#user,#footer #version')
        .contents()
        .filter(function() { return this.nodeType == Node.TEXT_NODE; })
        .remove();

    $('ul.tabs').each(function() {
        $(this).parent().css({ 'overflow-x': 'hidden' });
    });

    // Switch left labels to top labels.
    $('.field-left-label').each(function() {
        $(this).addClass('field-top-label').removeClass('field-left-label');
    }).show();

    // Bring utility nav to footer.
    var $utilityNav = $('#utility-nav');
    $utilityNav.find('#utility-nav-list').prepend($utilityNav.find('li#user'))
        .find('li#switch-device a').each(function() {
            $(this).addClass('button');
        });
    $('#footer').prepend($utilityNav.show());

    // Unlink user.
    var $user = $('#utility-nav #user');
    $user.append($user.find('a').children());
    $user.find('a').remove();

    // Split datetime.
    $('.text-date, .entry-time, .text.time').mtSplitDatetime();

    // Remove cfg_prefs links(for upload screen).
    $('a[href*="cfg_prefs"]').each(function() {
        $(this).after($(this).contents()).remove();
    });

    // Highlight scope selector.
    $('#scope-selector').mtTouchHighlight({
        target: 'ul li a',
        toggleClass: 'highlight'
    });

    // Highlight menu.
    $('#menu').mtTouchHighlight({
        target: '.item a',
        toggleClass: 'highlight'
    });

    // Bring bottom indicator and pagination to head of actions-bar-bottom.
    // Only for listing-screen.
    if ( opts.request.mode == 'list' ) {
        var $bar = $('#listing #actions-bar-bottom');
        $bar.prepend($bar.find('.pagination, .indicator')).show();

        // Sync select-all checkbox with th :checkbox.
        var $th_checkbox = $('table.listing-table th :checkbox').first();
        var $cb_select_all = $('#cb-select-all');
        if($th_checkbox.length > 0 && $cb_select_all.length > 0) {
            var cb_last_checked;
            var sync_select_all = function() {
                if($th_checkbox.prop('checked') === cb_last_checked)
                    return;
                cb_last_checked = $th_checkbox.prop('checked');
                if(cb_last_checked) {
                    $cb_select_all.prop('checked', true);
                } else {
                    $cb_select_all.prop('checked', false);
                }
            };

            if(typeof $th_checkbox.get(0).onpropertychange === 'object') {
                // For IE. Maybe applyed Windows Mobile.
                $th_checkbox.bind('propertychange', sync_select_all);
            } else {
                setInterval(sync_select_all, 10);
            }

            $cb_select_all.click(function() {
                $th_checkbox.get(0).checked = this.checked;
                $th_checkbox.triggerHandler('click');
            });
        }

        // Bring the row count selection to the bottom.
        $('#actions-bar-bottom .per-page-option').append($('#display-options #per_page-field #row'));

        // Remove Action... option from list action selector.
        $('.plugin-actions .action_selector option[value=0]').remove();
    }

    // Entry edit screen.
    if(opts.request.type == 'entry' || opts.request.type == 'page') {
        // Blink text area to after text-field.
        $('#editor-content-textarea').insertAfter($('#text-field')).css('display', 'block');

        $('#category-field .widget-action a').addClass('button');
        $('#convert_breaks-field .field-content').append($('#convert_breaks').show());

        // Bring the delete button on edit entry to actions bar.
        $('#related-content .actions-bar').append(
            $('.delete-action a').addClass('button').addClass('action')
        );

        // Bring the auto-save notification to bottom
        $('#editor-content-textarea').after($('#autosave-notification-top'));
    }

    // Comment edit screen.
    if(opts.request.type == 'comment') {
        $('body#edit-comment img[src$="filter.gif"]').parent().remove();
    }

    // Remove readonly from asset-url.
    if(opts.request.type == 'asset') {
        $('#asset-url').removeAttr('readonly');
    }

    // Join label and field as no wrap.
    if(opts.request.mode == 'search_replace') {
        $('body#search-replace #date-range').each(function() {
            var $from = $('<span class="wrap" /> ');
            $from.append($(this).find('label[for=datefrom], input[name=from]'));
            $(this).append($from);

            var $to = $('<span class="wrap" />');
            $to.append($(this).find('label[for=dateto], input[name=to]'));
            $(this).append($to);
        });
    }
}

/*
 * Put menu button.
 *
 */
function addMenuButton(opts) {
    // Menu element.
    var $menu = $('#menu').first();
    if($menu.length < 1) return;

    // Bring the current top-menu to the top of nav.
    var $menuNav = $menu.find('ul.menu-nav');
    // $menuNav.prepend($menuNav.find('li.top-menu.current'));

    // Menu button.
    var $menuButton = $('<a href="#" class="toggle-button" id="menu-button"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAAkCAYAAADGrhlwAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAGZJREFUeNrs1kEKgCAQBVAnOqYEnSyI7jnh1kUug+H9hQtB8OGAPzKzVco+lut+PlXn0WPeW535I+OeWysWICAgoNqgqPaxGjkgIOVUOQUCAgJSTr0QEJByqpwaOSAgICDldM4rwACNQCQ/UAo46wAAAABJRU5ErkJggg=="></a>');

    // Insert the button.
    $('h1#page-title').prepend($menuButton);
}

/*
 * Makes jQuery.ui.sortable tauchable.
 *
 */
function touchSortable(opts) {
    // Only for touchable device.
    // if(!touchable()) return;

    // Event map.
    var touchMouseEventMap = {
        touchstart: 'mousedown',
        touchend: 'mouseup',
        touchmove: 'mousemove',
        touchcancel: 'mouseup'
    };

    // Touch handler.
    var handler = function(event) {
        // Handle touching with one finger.
        if(event.touches.length > 1) return;

        // Cursor is move?
        if($(event.target).css('cursor') != 'move') return;

        // Map event type.
        var type = touchMouseEventMap[event.type];
        if(!type) return;

        // Dispatch as mouse event.
        event.preventDefault();
        var touchEvent = event.changedTouches[0];
        var mouseEvent = document.createEvent('MouseEvent');

        mouseEvent.initMouseEvent(
            type, true, true, window, 1,
            touchEvent.screenX, touchEvent.screenY,
            touchEvent.clientX, touchEvent.clientY,
            false, false, false, 0, null
        );
        event.target.dispatchEvent(mouseEvent);
    };

    // Add event listeners.
    $('.sortable, .connectSortable').each(function(index, el) {
        for(var type in touchMouseEventMap) {
            el.addEventListener(type, handler, false);
        }
    });
}

/*
 * Make iframe typed editor switchable to textarea.
 *
 */
function handleIframeEditor(opts) {
    // iframe typed elements.
    var iframes = {
        entry: {
            target: '#editor-content-iframe',
            textarea: '#editor-content-textarea',
            iframeButton: '.command-toggle-wysiwyg',
            textareaButton: '.command-toggle-html',
            message: opts.entryIframeMessage
        },
        template: {
            target: 'body.edit-template #textarea-enclosure iframe',
            textarea: '#text',
            iframeButton: '.button.command-highlight-on',
            textareaButton: '.button.command-highlight-off',
            message: opts.templateIframeMessage
        }
    };

    // iframeTouched will be called from editor-content.html
    App.iframeTouched = function() {
        for(var mode in iframes) {
            var iframe = iframes[mode];
            var $textareaButton = $(iframe.textareaButton);
            var $textarea = $(iframe.textarea);

            if($textareaButton.length && $textarea.length) {
                if(confirm(iframe.message)) {
                    $textareaButton.trigger('click');
                    $textarea.focus();
                }
            }
        }
    };
}

/*
 * Puts and toggles overlay to close popups like scope selector or menu.
 * Because iOS
 */
function togglePopupOverlay(opts) {
    if(!$('body').hasClass('device-ios')) return;

    var $overlay = $('#popup-overlay');
    if($overlay.length == 0) {
        $overlay = $('<a id="popup-overlay" href="javascript:void(0)" />');
        $overlay.bind('click', function(event) {
            // $('#content-body').removeClass('no-highlight');
            closePopups(opts, 'all');
            $overlay.hide();
            /*
            event.preventDefault();
            event.stopPropagation();
            return false;
            */
        });
        // $(document).unbind('mousedown');
        $('body').prepend($overlay);
    }

    var shown = false;
    var targets = ['#menu', '#scope-selector', '#quick-search-form'];
    for(var i = 0; i < targets.length; i++) {
        var $target = $(targets[i]);
        if($target.length > 0 && $target.css('display') != 'none')
            shown = true;
    }

    if(shown) {
        $overlay.height($('#container').height());
        // $('#content-body').addClass('no-highlight');

        // Blur form element for Android problem.
        // The fucused element always brought to the top.
        var selection = window.getSelection();
        if(selection && selection.focusNode) {
            $(selection.focusNode).find('input, select, textarea').each(function() { this.blur(); });
        }

        $overlay.show();
    } else {
        // $('#content-body').removeClass('no-highlight');
        $overlay.hide();
    }
}

/*
 * handlePopups
 * Set and override events of popup like menu or selector.
 */
function handlePopups(opts) {
    var popups = {
        scope: {
            nav: '#selector-nav',
            isOpened: function() {
                return $(this.nav).hasClass('show-selector');
            },
            isTargetInPopup: function(e) {
                return $(e.target).parents(this.nav).length > 0;
            },
            open: function() {
                $(this.nav).addClass('show-selector active');
            },
            close: function() {
                $(this.nav).removeClass('show-selector active');
            },
            height: function() {
                return $('#scope-selector').height() + 40;
            },
            noHighlight: '#main'
        },
        menu: {
            menu: '#menu',
            isOpened: function() {
                return $(this.menu).css('display') != 'none';
            },
            isTargetInPopup: function(e) {
                return $(e.target).parents(this.menu).length > 0;
            },
            open: function() {
                $(this.menu).show();
            },
            close: function() {
                $(this.menu).hide();
            },
            height: function() {
                return $(this.menu).height() + 70;
            },
            noHighlight: '#content-body'
        },
        search: {
            search: '#cms-search',
            nav_and_search: '.fav-actions-nav, #cms-search',
            isOpened: function() {
                return $(this.search).hasClass('active');
            },
            isTargetInPopup: function(e) {
                return $(e.target).parents('#basic-search').length > 0;
            },
            open: function() {
                $(this.nav_and_search).addClass('active').find('.detail').show();
            },
            close: function() {
                $(this.nav_and_search).removeClass('active').find('.detail').hide();
            }
        }
    };

    var handles = {
        'menu-button': {
            selector: '#menu-button',
            unbind: true,
            popup: 'menu',
            toggleFocus: true
        },
        'menu-toggle': {
            selector: '#menu .toggle-button',
            expandHeight: true
        },
        'scope-selector': {
            selector: '#selector-nav a.toggle-button',
            unbind: true,
            popup: 'scope',
            toggleFocus: true
        },
        'search-link': {
            selector: '#cms-search .detail-link',
            unbind: true,
            popup: 'search'
        }
    };

    var expandMainHeight = function () {
        var max_height = 0;
        $.each(popups, function(id, popup) {
            if(popup.height && popup.isOpened()) {
                var height = popup.height();
                if(height > max_height) {
                    max_height = height;
                }
            }
        });

        $('#main').css('min-height', max_height? max_height + 'px': '100%');
    };

    var closePopups = function(except) {
        var closed = false;
        $.each(popups, function(id, popup) {
            if(id != except) {
                if(popup.close)
                    popup.close();

                if(popup.noHighlight && $('body').hasClass('device-android'))
                    $(popup.noHighlight).removeClass('no-highlight');

                closed = true;
            }
        });

        if(closed)
            expandMainHeight();

        if($('body').hasClass('device-ios')) {
            if(!except || !popups[except].isOpened()) {
                // Hide overlay.
                $('#popup-overlay').hide();
            }
        }
    };

    var openPopup = function(id) {
        var popup = popups[id];

        if(popup.open)
            popup.open();

        expandMainHeight();

        if(popup.noHighlight && $('body').hasClass('device-android'))
            $(popup.noHighlight).addClass('no-highlight');

        if($('body').hasClass('device-ios')) {
            // Show overlay.
            var $overlay = $('#popup-overlay');
            if($overlay.length < 1) {
                $overlay = $('<a id="popup-overlay" href="javascript:void(0)" />');
                $overlay.bind('mousedown', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    closePopups();
                    $overlay.hide();
                });
                $('body').prepend($overlay);
            }

            blurFormElements();
            $overlay.height($('#container').height()).show();
        }
    };

    // Rebind document mousedown event.
    $(document).unbind('mousedown').bind('mousedown', function(e) {
        var except;
        $.each(popups, function(id, popup) {
            if(popup.isTargetInPopup(e))
                except = id;
        });

        closePopups(except);
    });

    // Rebind mousedown event to handles.
    $.each(handles, function(id, handle) {
        var $handle = $(handle.selector);

        if(handle.unbind)
            $handle.unbind('mousedown click');

        $handle.bind('mousedown', function(e) {
            e.stopPropagation();

            if(handle.popup) {
                var popup = popups[handle.popup];
                if(popup.isOpened()) {
                    closePopups();
                } else {
                    closePopups(handle.popup);
                    openPopup(handle.popup);
                }
            } else {
                if(handle.expandHeight)
                    expandMainHeight();
            }

            return false;
        });
    });
}

})(jQuery);
