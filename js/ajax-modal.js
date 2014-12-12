/*
 * Ajax Modal plugin
 *
 * Options:
 * - content: content HTML string or callback
 * 
 * Data attributes:
 * - data-control="ajaxModal" - enables the ajax modal plugin
 * - data-handler="widget:pluginName" - October ajax request name
 * - data-update-partial="some partial" - Partial to popuplate the modal
 * - data-request-data="file_id: 1" - October ajax request data
 *
 * JavaScript API:
 * $('a#someLink').ajaxModal({ handler: 'onOpenModalForm' })
 *
 * Dependences:
 * - Semantic UI Modal (modal.js)
 */

+function ($) { "use strict";

    // AJAX MODAL CLASS DEFINITION
    // ============================

    var Modal = function(element, options) {
        var self = this
        this.options    = options
        this.$el        = $(element)
        this.isOpen     = false

        this.init()
    }

    Modal.DEFAULTS = {
        handler: null,
        updatePartial: null,
        extraData: {}
    }

    Modal.prototype.init = function(){
        var self = this

        /*
         * Do not allow the same modal to open twice
         */
        if (self.isOpen)
            return

        this.$modal = $('<div />').addClass('ui modal')
        this.$loader = this.getLoaderSegment()

        this.$modal.append(this.$loader)
        this.$modal.modal({
            onHidden: function() {
                self.destroy()
            }
        })

        this.$modal.on('click', '[data-dismiss="modal"]', function() {
            self.$modal.modal('hide')
        })

        this.$modal.modal('show')

        var updateObj = {}
        updateObj[this.options.updatePartial] = this.$modal

        /*
         * October AJAX
         */
        if (this.options.handler) {

            $.request(this.options.handler, {
                data: this.options.extraData,
                update: updateObj,
                success: function(data, textStatus, jqXHR) {
                    this.success(data, textStatus, jqXHR).done(function(){
                        $(window).trigger('ajaxUpdateComplete', [this, data, textStatus, jqXHR])
                        setTimeout(function() {
                            self.$modal.modal('refresh')
                        }, 250)
                    })
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    this.error(jqXHR, textStatus, errorThrown).done(function(){
                        alert(jqXHR.responseText.length ? jqXHR.responseText : jqXHR.statusText)
                        self.destroy()
                    })
                }
            })

        }
    }

    Modal.prototype.destroy = function() {
        this.$modal.remove()
        this.$el.data('oc.ajaxModal', null)
    }

    Modal.prototype.getLoaderSegment = function() {
        return $('<div />')
            .addClass('ui padded segment')
            .html('                            \
              <p></p>                          \
              <div class="ui active dimmer">   \
                <div class="ui loader"></div>  \
              </div>')
    }

    // AJAX MODAL PLUGIN DEFINITION
    // ============================

    var old = $.fn.ajaxModal

    $.fn.ajaxModal = function (option) {
        var args = Array.prototype.slice.call(arguments, 1)
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.ajaxModal')
            var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.ajaxModal', (data = new Modal(this, options)))
            else if (typeof option == 'string') data[option].apply(data, args)
        })
    }

    $.fn.ajaxModal.Constructor = Modal

    // AJAX MODAL NO CONFLICT
    // =================

    $.fn.ajaxModal.noConflict = function () {
        $.fn.ajaxModal = old
        return this
    }

    // AJAX MODAL DATA-API
    // ===============

    $(document).on('click.oc.ajaxModal', '[data-control="ajaxModal"]', function() {
        $(this).ajaxModal()

        return false
    });

}(window.jQuery);