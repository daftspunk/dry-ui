/*
 * Inline Editor plugin
 * 
 * Data attributes:
 * - data-control="inline-editor" - enables the plugin on an element
 * - data-option="value" - an option with a value
 *
 * JavaScript API:
 * $('a#someElement').inlineEditor({ option: 'value' })
 *
 * Example:
 *
 *    <div class="field">
 *        <label>Name</label>
 *        <div data-control="inline-editor">
 *            <div class="view content">
 *                {{ name }}
 *                <a href="javascript:;" class="ui large left pointing label" inline-edit>
 *                    <i class="pencil icon"></i>
 *                </a>
 *            </div>
 *            <div class="edit content" style="display: none">
 *                <div class="ui icon input">
 *                    <input type="text" name="name" value="{{ name }}" />
 *                    <i class="checkmark circular icon" inline-save></i>
 *                </div>
 *            </div>
 *        </div>
 *    </div>
 */

+function ($) { "use strict";

    // INLINE EDITOR CLASS DEFINITION
    // ============================

    var InlineEditor = function(element, options) {
        this.options   = options
        this.$el       = $(element)
        this.isEdit    = false

        // Init
        this.init()
    }

    InlineEditor.DEFAULTS = {
        property: null,
        handler: 'onPatch',
        partial: null
    }

    InlineEditor.prototype.init = function() {
        // Public properties
        this.$view  = $('.view.content', this.$el)
        this.$edit  = $('.edit.content', this.$el)

        this.$saveButton = $('[inline-save]', this.$el)
        this.$editButton = $('[inline-edit]', this.$el)
        this.$cancelButton = $('[inline-cancel]', this.$el)

        this.showEdit()

        this.$saveButton.on('click', $.proxy(this.saveContent, this))
        this.$editButton.on('click', $.proxy(this.showToggle, this))
        this.$cancelButton.on('click', $.proxy(this.showView, this))

        if (this.$saveButton.is('i.icon')) {
            this.$saveButton.on('mouseenter', function() {
                $(this).addClass('inverted green')
            })
            this.$saveButton.on('mouseleave', function() {
                $(this).removeClass('inverted green')
            })
        }
    }

    InlineEditor.prototype.getContainer = function() {

        var parentEl = this.$el.parent()
        if (parentEl.data('editable-container')) {
            return parentEl
        }

        this.$el.wrap('<div />')
        parentEl = this.$el.parent()
        parentEl.data('editable-container', true)
        return parentEl
    }

    InlineEditor.prototype.saveContent = function() {
        var updateObj = {},
            dataObj = {}

        dataObj.propertyName = this.options.property

        updateObj[this.options.partial] = this.getContainer()

        this.$el.closest('form').request(this.options.handler, {
            update: updateObj,
            data: dataObj
        })

        // this.showView()
    }

    InlineEditor.prototype.showToggle = function() {
        if (this.isEdit)
            this.showView()
        else
            this.showEdit()
    }

    InlineEditor.prototype.showView = function() {
        this.$el.addClass('view-mode').removeClass('edit-mode')
        this.isEdit = false
    }

    InlineEditor.prototype.showEdit = function() {
        this.$el.addClass('edit-mode').removeClass('view-mode')
        this.isEdit = true

        $('[inline-focus]', this.$edit).focus()
    }

    // INLINE EDITOR PLUGIN DEFINITION
    // ============================

    var old = $.fn.inlineEditor

    $.fn.inlineEditor = function (option) {
        var args = Array.prototype.slice.call(arguments, 1), result
        this.each(function () {
            var $this   = $(this)
            var data    = $this.data('ui.inline-editor')
            var options = $.extend({}, InlineEditor.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('ui.inline-editor', (data = new InlineEditor(this, options)))
            if (typeof option == 'string') result = data[option].apply(data, args)
            if (typeof result != 'undefined') return false
        })

        return result ? result : this
    }

    $.fn.inlineEditor.Constructor = InlineEditor

    // INLINE EDITOR NO CONFLICT
    // =================

    $.fn.inlineEditor.noConflict = function () {
        $.fn.inlineEditor = old
        return this
    }

    // INLINE EDITOR DATA-API
    // ===============

    $(document).on('click.ui.inline-editor', '[data-control="inline-editor"] [inline-edit]', function() {
        $(this).closest('[data-control="inline-editor"]').inlineEditor()
        return false
    });

}(window.jQuery);
