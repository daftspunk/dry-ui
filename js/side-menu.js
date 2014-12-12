/*
 * Side menu control.
 *
 * @todo Incomplete implementation
 *
 * Data attributes:
 * - data-control="sideMenu" - enables the plugin
 *
 */
+function ($) { "use strict";

    var SideMenu = function (element, options) {

        this.$el = $(element)

        this.options = options || {};

        var self = this;

        this.$overlay = $('<div class="side-menu-overlay" />')
        this.$sideMenu = this.$el
        this.$sideMenu.show().addClass('side-menu')
        this.$sideMenu.before(this.$overlay)

        this.$el.on('click', $.proxy(this.showSideMenu, this))
        this.$overlay.on('click', $.proxy(this.hideSideMenu, this))
        this.$sideMenu.on('click', $.proxy(this.hideSideMenu, this))
    }

    SideMenu.prototype.showSideMenu = function() {
        this.$overlay.addClass('on')
        this.$sideMenu.addClass('in')
    }

    SideMenu.prototype.hideSideMenu = function() {
        this.$overlay.removeClass('on')
        this.$sideMenu.removeClass('in')
    }

    SideMenu.DEFAULTS = {
    }

    // SIDE MENU PLUGIN DEFINITION
    // ===================================

    var old = $.fn.sideMenu

    $.fn.sideMenu = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data  = $this.data('oc.side-menu')
            var options = $.extend({}, SideMenu.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('oc.side-menu', (data = new SideMenu(this, options)))
        })
      }

    $.fn.sideMenu.Constructor = SideMenu

    // SIDE MENU NO CONFLICT
    // ===================================

    $.fn.sideMenu.noConflict = function () {
        $.fn.sideMenu = old
        return this
    }

    // SIDE MENU DATA-API
    // ===================================

    $(document).on('ready', function(){
        $('[data-control=sideMenu]').sideMenu()
    })

}(window.jQuery);