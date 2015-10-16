/*
 * Implement alerts with AJAX framework
 */

$(window).on('ajaxErrorMessage', function(event, message){
    if (!message) return

    $.ui.alert(message)

    // Prevent the default alert() message
    event.preventDefault()
})

$(window).on('ajaxConfirmMessage', function(event, message){
    if (!message) return

    $.ui.confirm(message, function(isConfirm){
        isConfirm
            ? event.promise.resolve()
            : event.promise.reject()
    })

    // Prevent the default confirm() message
    event.preventDefault()
    return true
})

/*
 * Alerts
 *
 * Displays alert and confirmation dialogs
 *
 * JavaScript API:
 * $.ui.alert()
 * $.ui.confirm()
 *
 */
;(function($){

    if ($.ui === undefined)
        $.ui = {}

    $.ui.alert = function alert(message) {
        var $modal = $(getDialogTemplate())
        $modal.appendTo($('body'))
        $('[data-message]', $modal).text(message)
        $('[data-cancel]', $modal).remove()

        $modal
            .modal({
                onHidden: function() {
                    $modal.modal('destroy')
                    $modal.remove()
                }
            })
            .modal('show')
    }

    $.ui.confirm = function confirm(message, callback) {
        var $modal = $(getDialogTemplate())
        $modal.appendTo($('body'))
        $('[data-message]', $modal).text(message)

        $modal
            .modal({
                closable: false,
                onDeny: function() { callback(false) },
                onApprove: function() { callback(true) },
                onHidden: function() {
                    $modal.modal('destroy')
                    $modal.remove()
                }
            })
            .modal('show')
    }

    function getDialogTemplate() {
        return '                                                                        \
            <div class="ui small basic modal">                                          \
                <div class="header" data-message></div>                                 \
                <div class="actions">                                                   \
                    <div data-cancel class="ui large red basic cancel inverted button"> \
                        <i class="remove icon"></i>                                     \
                        <span>Cancel</span>                                             \
                    </div>                                                              \
                    <div data-ok class="ui large green ok inverted button">             \
                        <i class="checkmark icon"></i>                                  \
                        <span>OK</span>                                                 \
                    </div>                                                              \
                </div>                                                                  \
            </div>                                                                      \
        '
    }

})(jQuery);