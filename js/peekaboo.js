/*
 * "Peekaboo" visibility manager
 */

/*
 * Example usage:

$('.element').peekaboo(function (){
    $(this).addClass('inView')
}, function () {
    $(this).removeClass('inView')
})

$('.element').on('appear disappear', function(e) {
    console.log(this, $(this).data('pkb-state'));
})

 */

(function(window, document, $) {

    var $window = $(window),
        tolerance = 0,
        els = [];

    $.fn.peekaboo = function(options) {
        var args = [].slice.call(arguments);

        options = options || {};

        if (args.length && 'function' === typeof args[0]) {
            options = {
                onAppear: args[0],
                onDisappear: args[1]
            };
        }

        if (options.tolerance !== undefined)
            tolerance = options.tolerance

        return this.each(function() {
            els.push($(this)
                .on('appear', options.onAppear || $.noop)
                .on('disappear', options.onDisappear || $.noop)
            );
        });
    };

    $window.on('scroll.peekaboo resize.peekaboo', function(e) {
        $.each(els, function() {
            var $elem = this;
            if ($window.scrollTop() < $elem.offset().top + ($elem.height() + tolerance)
                && $elem.offset().top < $window.scrollTop() + $window.height()) {
                if ('appeared' !== $elem.data('pkb-state')) {
                    $elem.data('pkb-state', 'appeared').trigger('appear', e);
                }
            }
            else {
                if ('disappeared' !== $elem.data('pkb-state')) {
                    $elem.data('pkb-state', 'disappeared').trigger('disappear', e);
                }
            }
        });
    });

}).call(this, window, document, jQuery);
