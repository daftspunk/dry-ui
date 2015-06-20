/*
 * Sliding List plugin
 *
 * Displays a sliding list of data.
 *
 * Data attributes:
 * - data-control="sliding-list" - enables the plugin on an element
 *
 * JavaScript API:
 * $('#someElement').slidingList()
 *
 * Setting data:
 * $('#someElement').slidingList('processData', dataSet)
 *
 * Dependences:
 * - Some other plugin (filename.js)
 */

/*
 * Example data set:

var dataSet = [{
    id: 1,
    name: 'Some item',
    children: [
        {id: 2, name: 'Another item', href: '#'},
        {id: 3, name: 'Third item', href: '#'}
    ]
},
{
    [...]
}]

*
* Example markup:
*

<ul class="skill-breadcrumb" id="breadcrumb"></ul>

<div
    class="sliding-list"
    id="slidingList"
    data-control="sliding-list"
    data-breadcrumb="#breadcrumb">
    <ul>
        <li data-back-node>
            <a href="javascript:;"><i class="fa fa-chevron-left"></i> Back</a>
        </li>
        <li data-branch-node>
            <a href="javascript:;"><i class="fa fa-chevron-down"></i> <span></span></a>
        </li>
        <li data-leaf-node>
            <a href="javascript:;"><i class="fa fa-plus"></i> <span></span></a>
        </li>
    </ul>
</div>

*/

+function ($) { "use strict";

    // SLIDING LIST CLASS DEFINITION
    // ============================

    var SlidingList = function(element, options) {
        this.options   = options
        this.$el       = $(element)

        // Init
        this.init()
    }

    SlidingList.DEFAULTS = {
        breadcrumb: null
    }

    SlidingList.prototype.init = function() {

        var self = this,
            $template = $('>ul:first', this.$el)

        this.$backTemplate = $('[data-back-node]', $template).clone()
        this.$leafTemplate = $('[data-leaf-node]', $template).clone()
        this.$branchTemplate = $('[data-branch-node]', $template).clone()
        $('>a', this.$backTemplate).addClass('node-is-back')
        $('>a', this.$leafTemplate).addClass('node-is-leaf')
        $('>a', this.$branchTemplate).addClass('node-has-children')
        this.$template = $template.empty()

        this.activeData = null
        this.previousData = null
        this.isLocked = false

        if (this.options.breadcrumb) {
            this.breadcrumbTrail = []
            this.$breadcrumb = $(this.options.breadcrumb)
        }

        this.$el.on('click', 'a', function(){
            if ($(this).hasClass('node-is-leaf')) {
                var $item = $(this).closest('li'),
                    itemData = $item.data('slidingList.dataitem'),
                    selectedId = itemData.id

                self.$el.trigger('slidingList.leafSelected', [selectedId])
            }
            else {
                self.updateNode(this)
                self.$el.trigger('slidingList.branchSelected')
            }
        })
    }

    SlidingList.prototype.renderBreadcrumb = function() {
        if (!this.$breadcrumb)
            return

        var self = this,
            total = this.breadcrumbTrail.length

        this.$breadcrumb.empty()

        $.each(this.breadcrumbTrail, function(index, item){
            var $item = $('<li />'),
                $anchor = $('<a />').prop('href', 'javascript:;')

            total--
            if (total > 0) {
                $anchor.text(item)
                $item.append($anchor)
                $anchor.on('click', function(){
                    self.goBack(total + 1)
                })
            }
            else {
                $item.text(item)
            }

            self.$breadcrumb.append($item)
        })
    }

    SlidingList.prototype.goBack = function(count) {
        var $group = $('ul:last', this.$el),
            $prevGroup = $group.prev()

        /*
         * Handle multiple back ups
         */
        if (!count) count = 1

        count--;
        for (var i = 0; i < count; i++) {
            var remove = $group
            $prevGroup = $prevGroup.prev()
            $group = $group.prev()
            remove.remove()
            this.breadcrumbTrail.pop()
        }

        $group.addClass('next-node')
        $prevGroup.removeClass('previous-node')
        setTimeout(function(){ $group.remove() }, 500)

        this.breadcrumbTrail.pop()
        this.renderBreadcrumb()
    }

    SlidingList.prototype.updateNode = function(el) {
        var self = this,
            $item = $(el).closest('li'),
            $group = $item.closest('ul'),
            data = $item.data('slidingList.dataset')

        /*
         * Prevent click spam
         */
        if (this.isLocked)
            return

        this.isLocked = true
        setTimeout(function(){ self.isLocked = false }, 500)

        if ($(el).hasClass('node-is-back')) {
            this.goBack()
        }
        else if (data) {
            $group.addClass('previous-node')
            this.setData(data, true)
            this.breadcrumbTrail.push($item.data('slidingList.name'))
            this.renderBreadcrumb()
        }
    }

    SlidingList.prototype.setData = function(data, useAnimate) {

        this.activeData = data

        var self = this,
            $item,
            $node = this.$template.clone(),
            $back = this.$backTemplate.clone(),
            isRoot = !this.previousData

        this.$el.append($node)

        if (useAnimate)
            $node.addClass('new-node')

        if (!isRoot)
            $node.append($back)

        $.each(data, function(index, item){

            if (item.children) {
                $item = self.$branchTemplate.clone()
                $item.data('slidingList.dataset', item.children)
            }
            else {
                $item = self.$leafTemplate.clone()
                $item.data('slidingList.dataitem', item)
            }

            var $label = $('>a >span', $item)
            $label.text(item.name)

            $item.data('slidingList.id', item.id)
            $item.data('slidingList.name', item.name)
            $node.append($item)
        })

        this.previousData = this.activeData

        if (!useAnimate)
            return

        setTimeout(function(){
            $node.removeClass('new-node')
        }, 100)
    }


    // SLIDING LIST PLUGIN DEFINITION
    // ============================

    var old = $.fn.slidingList

    $.fn.slidingList = function (option) {
        var args = Array.prototype.slice.call(arguments, 1), result
        this.each(function () {
            var $this   = $(this)
            var data    = $this.data('ui.sliding-list')
            var options = $.extend({}, SlidingList.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('ui.sliding-list', (data = new SlidingList(this, options)))
            if (typeof option == 'string') result = data[option].apply(data, args)
            if (typeof result != 'undefined') return false
        })

        return result ? result : this
    }

    $.fn.slidingList.Constructor = SlidingList

    // SLIDING LIST NO CONFLICT
    // =================

    $.fn.slidingList.noConflict = function () {
        $.fn.slidingList = old
        return this
    }

    // SLIDING LIST DATA-API
    // ===============

    $(document).render(function() {
        $('[data-control="sliding-list"]').slidingList()
    })

}(window.jQuery);