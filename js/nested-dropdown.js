/*
 * Nested DropDown plugin
 *
 * Displays a set of tree data using multiple drop downs.
 *
 * Data attributes:
 * - data-control="nested-dropdown" - enables the plugin on an element
 *
 * JavaScript API:
 * $('#someElement').nestedDropdown()
 *
 * Setting data:
 * $('#someElement').nestedDropdown('setData', dataSet)
 *
 * Dependences:
 * - Some other plugin (filename.js)
 */

/*
 * Example data set:

var dataSet = [{
    id: 1,
    name: 'Some item',
    customField: 'supported',
    children: [
        {id: 2, name: 'Another item'},
        {id: 3, name: 'Third item'}
    ]
},
{
    [...]
}]

*
* Example markup:
*

<div
    data-control="nested-dropdown"
    data-selected-value="7"
    data-empty-placeholder="-- Pick something --">
    <ul>
        <li>
            <select name="something">
                <option value="-1">I don't want to pick anything</option>
            </select>
        </li>
    </ul>
</div>

*/

+function ($) { "use strict";

    // NESTED DROPDOWN CLASS DEFINITION
    // ============================

    var NestedDropdown = function(element, options) {
        this.options   = options
        this.$el       = $(element)

        // Init
        this.init()
    }

    NestedDropdown.DEFAULTS = {
        emptyPlaceholder: null
    }

    NestedDropdown.prototype.init = function() {
        var self = this
        this.activeNode = $('>*:first', this.$el)
        this.template = this.activeNode.clone()
        this.dataSet = null

        this.$el.on('change', 'select', function(){
            self.updateNode(this)
        })
    }

    NestedDropdown.prototype.addPlaceholder = function(node) {
        var
            placeholder = this.options.emptyPlaceholder,
            $option = $('<option />').prop('selected', true),
            $select = $('select:first', node)

        if (!placeholder)
            return

        $option.val(0).text(placeholder)
        $select.prepend($option)
    }

    NestedDropdown.prototype.updateNode = function(el) {

        var $node = $(el).closest('ul'),
            $item = $('li:first', $node),
            selectedId =$(':selected', el).val(),
            data = $node.data('nestedDropdown.dataset'),
            match = null

        $('ul', $item).remove()

        $.each(data, function(index, item) {
            if (item.id == selectedId) {
                match = item
                return false
            }
        })

        if (match && match.children) {
            var newNode = this.template.clone()
            this.setData(match.children, newNode, true)
            $item.append(newNode)
            this.$el.trigger('nestedDropdown.branchSelected')
        }
        else {
            this.$el.trigger('nestedDropdown.leafSelected', [selectedId])
        }

    }

    NestedDropdown.prototype.setData = function(data, node, isEmpty) {
        if (!node)
            node = this.activeNode

        node.data('nestedDropdown.dataset', data)

        var $select = $('select:first', node),
            $option = $('<option />')

        if (isEmpty)
            $select.empty()

        $.each(data, function(index, item) {
            $select.append($option.clone().val(item.id).text(item.name))
        })

        this.addPlaceholder(node)
        this.dataSet = data
    }

    NestedDropdown.prototype.setParents = function(dataSet) {

        var setFunc = function(items, id) {
            $.each(items, function(index, item){
                item.parent = id

                if (item.children) {
                    setFunc(item.children, item.id)
                }
            })
        }

        setFunc(dataSet)
    }

    NestedDropdown.prototype.setSelected = function(itemId) {

        var self = this,
            dataSet = this.dataSet

        this.setParents(dataSet)

        var findItemById = function(items, id) {
            var result = false

            $.each(items, function(index, item){
                if (item.id == id) {
                    result = item
                    return false
                }

                if (item.children) {
                    result = findItemById(item.children, id)
                    if (result)
                        return false
                }
            })

            return result
        }

        var makeParentLine = function(item, line) {
            if (!line) line = []
            line.push(item.id)

            if (item.parent) {
                var parentItem = findItemById(dataSet, item.parent)
                line = makeParentLine(parentItem, line)
            }

            return line
        }

        var leafItem = findItemById(dataSet, itemId),
            parentLine = makeParentLine(leafItem).reverse(),
            $select,
            $option

        /*
         * Congo the parent line and make the selections
         */
        $.each(parentLine, function(index, id){
            $select = $('select:last', self.$el),
            $option = $('option[value='+id+']', $select)
            $option.prop('selected', true)
            $select.trigger('change')
        })
    }

    // NESTED DROPDOWN PLUGIN DEFINITION
    // ============================

    var old = $.fn.nestedDropdown

    $.fn.nestedDropdown = function (option) {
        var args = Array.prototype.slice.call(arguments, 1), result
        this.each(function () {
            var $this   = $(this)
            var data    = $this.data('ui.nested-dropdown')
            var options = $.extend({}, NestedDropdown.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('ui.nested-dropdown', (data = new NestedDropdown(this, options)))
            if (typeof option == 'string') result = data[option].apply(data, args)
            if (typeof result != 'undefined') return false
        })

        return result ? result : this
    }

    $.fn.nestedDropdown.Constructor = NestedDropdown

    // NESTED DROPDOWN NO CONFLICT
    // =================

    $.fn.nestedDropdown.noConflict = function () {
        $.fn.nestedDropdown = old
        return this
    }

    // NESTED DROPDOWN DATA-API
    // ===============

    $(document).render(function() {
        $('[data-control="nested-dropdown"]').nestedDropdown()
    })

}(window.jQuery);