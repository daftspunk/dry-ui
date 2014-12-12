/*
 * MinimalTextarea plugin
 * 
 * Data attributes:
 * - data-control="minimalTextarea" - enables the plugin on an element
 * - data-option="value" - an option with a value
 *
 * JavaScript API:
 * $('a#someElement').minimalTextarea({ option: 'value' })
 *
 * Example:
 *   <div class="is-minimal disabled" data-control="minimalTextarea">
 *       <textarea name="content" placeholder="Click here"></textarea>
 *       <div class="hide-minimal">
 *           <button type="submit">
 *               Submit
 *           </button>
 *       </div>
 *   </div>
 */

+function ($) { "use strict";

    // MINIMAL TEXTAREA CLASS DEFINITION
    // ============================

    var MinimalTextarea = function(element, options) {
        this.options   = options
        this.$el       = $(element)

        // Init
        this.init()
    }

    MinimalTextarea.DEFAULTS = {
        disabled: false
    }

    MinimalTextarea.prototype.init = function() {
        var self = this

        this.$textarea  = $('textarea', this.$el)
        this.isDisabled = this.$el.hasClass('disabled')

        if (this.isDisabled)
            this.$textarea.attr('disabled', true)

        this.$el.on('click', 'textarea', function(){
            if (!self.isDisabled)
                self.$el.removeClass('is-minimal')
        })

    }

    MinimalTextarea.prototype.reset = function() {
        this.$textarea.val('')
        this.$el.addClass('is-minimal')
    }

    // MINIMAL TEXTAREA PLUGIN DEFINITION
    // ============================

    var old = $.fn.minimalTextarea

    $.fn.minimalTextarea = function (option) {
        var args = Array.prototype.slice.call(arguments, 1), result
        this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.minimalTextarea')
            var options = $.extend({}, MinimalTextarea.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.minimalTextarea', (data = new MinimalTextarea(this, options)))
            if (typeof option == 'string') result = data[option].apply(data, args)
            if (typeof result != 'undefined') return false
        })

        return result ? result : this
    }

    $.fn.minimalTextarea.Constructor = MinimalTextarea

    // MINIMAL TEXTAREA NO CONFLICT
    // =================

    $.fn.minimalTextarea.noConflict = function () {
        $.fn.minimalTextarea = old
        return this
    }

    // MINIMAL TEXTAREA DATA-API
    // ===============

    $(document).on('render', function(){
        $('div[data-control=minimalTextarea]').minimalTextarea()
    })

}(window.jQuery);