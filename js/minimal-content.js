/*
 * MinimalContent plugin
 * 
 * Data attributes:
 * - data-control="minimalContent" - enables the plugin on an element
 * - data-option="value" - an option with a value
 *
 * JavaScript API:
 * $('a#someElement').minimalContent({ option: 'value' })
 *
 * Example:
 *   <div class="is-minimal" data-control="minimalContent">
 *       <p>Some really long content</p>
 *       <div class="read-more">
 *           <a href="javascript:;" class="ui small button">Read more</a>
 *           <a href="javascript:;" class="ui small button">Show less</a>
 *       </div>
 *   </div>
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
    }

    MinimalContent.prototype.init = function() {
        var self = this

        this.$buttons = $('.read-more', this.$el).show()
        this.$btnReadMore = $('a:first', this.$buttons)
        this.$btnReadLess = $('a:last', this.$buttons).hide()

        this.isMinimal = this.$el.hasClass('is-minimal')
        this.minimalHeight = this.$el.height()
        this.maxHeight = parseInt(this.$el.css('max-height'))
        this.buttonsHeight = this.$buttons.height()

        /*
         * Not required
         */
        if (this.minimalHeight < this.maxHeight) {
            this.$buttons.hide()
            return
        }

        this.$el.on('click', '.read-more > a', function() {

            if (self.isMinimal) {
                self.showMore(this)
            }
            else {
                self.showLess(this)
            }

            self.isMinimal = !self.isMinimal

            return false
        });
    }

    MinimalContent.prototype.showLess = function() {
        var self = this

        this.$el.addClass('is-minimal')

        self.$el.animate({ height: this.minimalHeight }, function(){
            self.$el.css({
                height: 'auto',
                maxHeight: self.maxHeight
            })
        })

        this.$btnReadLess.hide()
        this.$btnReadMore.show()
    }

    MinimalContent.prototype.showMore = function(button) {

        var self = this

        this.calculateTotalHeight()

        self.$el.css({
            height: this.minimalHeight,
            maxHeight: 'none'
        })
        .animate({
            height: this.totalHeight - this.buttonsHeight
        })

        this.$el.removeClass('is-minimal')
        this.$btnReadMore.hide()
        this.$btnReadLess.show()
    }

    MinimalContent.prototype.calculateTotalHeight = function() {
        var totalHeight = 0
        $('> *', this.$el).each(function() {
            totalHeight += $(this).outerHeight()
        })

        this.totalHeight = totalHeight
    }

    // MINIMAL TEXTAREA PLUGIN DEFINITION
    // ============================

    var old = $.fn.minimalContent

    $.fn.minimalContent = function (option) {
        var args = Array.prototype.slice.call(arguments, 1), result
        this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.minimalContent')
            var options = $.extend({}, MinimalContent.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.minimalContent', (data = new MinimalContent(this, options)))
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
        $('div[data-control=minimalContent]').minimalContent()
    })

}(window.jQuery);