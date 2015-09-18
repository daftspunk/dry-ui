/*
 * MinimalContent plugin
 * 
 * Data attributes:
 * - data-control="minimal-content" - enables the plugin on an element
 * - data-option="value" - an option with a value
 *
 * JavaScript API:
 * $('a#someElement').minimalContent({ option: 'value' })
 */

+function ($) { "use strict";

    // MINIMAL TEXTAREA CLASS DEFINITION
    // ============================

    var MinimalContent = function(element, options) {
        this.options   = options
        this.$el       = $(element)

        var self = this

        // Init
        self.init()
    }

    MinimalContent.DEFAULTS = {
        showChars: 300,
        ellipsesText: '...',
        moreText: 'See more'
    }

    MinimalContent.prototype.init = function() {
        var self = this,
            content = this.$el.html(),
            shortContent,
            longContent,
            $long,
            $short,
            link

        link = ' <a href="javascript:;" data-read-more>'+this.options.moreText+'</a>'

        shortContent = this.limitHtml(
            content,
            this.options.showChars,
            this.options.ellipsesText,
            link
        )

        if (!shortContent) {
            return
        }

        this.$el.wrap('<div data-long />')
        $short = $('<div data-short>' + shortContent + '</div>');
        $long = this.$el.parent()

        $long.hide()
        $long.before($short)

        $short.on('click', '[data-read-more]', function() {
            $(this).closest('[data-short]').hide().next().show()
            $(window).trigger('resize')
            return false
        })
    }

    MinimalContent.prototype.limitHtml = function(content, showChars, end, link) {
        var c = content.substr(0, showChars);

        if (!link) {
            link = ''
        }

        if (!end) {
            end = '...'
        }

        if (content.length == c.length) {
            return false
        }

        if (c.indexOf('<') == -1) {
            // If there's HTML don't want to cut it
            return c + end + link
        }

        var inTag = false; // I'm in a tag?
        var bag = ''; // Put the characters to be shown here
        var countChars = 0; // Current bag size
        var openTags = []; // Stack for opened tags, so I can close them later
        var tagName = null;

        for (var i = 0, r = 0; r <= showChars; i++) {
            if (content[i] == '<' && !inTag) {
                inTag = true;

                // This could be "tag" or "/tag"
                tagName = content.substring(i + 1, content.indexOf('>', i));

                // If its a closing tag
                if (tagName[0] == '/') {
                    if (tagName != '/' + openTags[0]) {
                        console.log('ERROR en HTML: the top of the stack should be the tag that closes')
                    }
                    else {
                        openTags.shift() // Pops the last tag from the open tag stack (the tag is closed in the retult HTML!)
                    }
                }
                else {
                    // There are some nasty tags that don't have a close tag like <br/>
                    if (tagName.toLowerCase() != 'br') {
                        openTags.unshift(tagName); // Add to start the name of the tag that opens
                    }
                }
            }

            if (inTag && content[i] == '>') {
                inTag = false;
            }

            // Add tag name chars to the result
            if (inTag) {
                bag += content.charAt(i);
            }
            else {
                r++;
                if (countChars <= showChars) {
                    bag += content.charAt(i); // Fix to ie 7 not allowing you to reference string characters using the []
                    countChars++;
                }
                // Now I have the characters needed
                else {
                    // I have unclosed tags
                    if (openTags.length > 0) {
                        for (j = 0; j < openTags.length; j++) {
                            bag += '</' + openTags[j] + '>'; // Close all tags that were opened

                            // You could shift the tag from the stack to check if you end with an empty stack, that means you have closed all open tags
                        }
                        break;
                    }
                }
            }
        }

        c = $('<div/>').html(bag + '<span class="ellip">' + end + '</span>' + link).html();
        return c;
    }

    // MINIMAL TEXTAREA PLUGIN DEFINITION
    // ============================

    var old = $.fn.minimalContent

    $.fn.minimalContent = function (option) {
        var args = Array.prototype.slice.call(arguments, 1), result
        this.each(function () {
            var $this   = $(this)
            var data    = $this.data('ui.minimal-content')
            var options = $.extend({}, MinimalContent.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('ui.minimal-content', (data = new MinimalContent(this, options)))
            if (typeof option == 'string') result = data[option].apply(data, args)
            if (typeof result != 'undefined') return false
        })

        return result ? result : this
    }

    $.fn.minimalContent.Constructor = MinimalContent

    // MINIMAL TEXTAREA NO CONFLICT
    // =================

    $.fn.minimalContent.noConflict = function () {
        $.fn.minimalContent = old
        return this
    }

    // MINIMAL TEXTAREA DATA-API
    // ===============

    $(document).on('render', function(){
        $('div[data-control="minimal-content"]').minimalContent()
    })

}(window.jQuery);
