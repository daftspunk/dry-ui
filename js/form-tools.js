/*
 * Form validation specifically for OctoberCMS
 */

$(window).on('ajaxInvalidField', function(event, fieldElement, fieldName, errorMsg, isFirst) {
    event.preventDefault()

    var $field = $(fieldElement).closest('.grouped.fields'),
        $label = $('<div />').addClass('ui red pointing above basic label')

    if (!$field.length) {
        $field = $(fieldElement).closest('.field')
    }

    if (!$field.length) {
        return
    }

    if (errorMsg) {
        $label.text(errorMsg.join(', '))
    }

    $label.addClass('form-field-error-label')
    $field.addClass('error')

    // Prevent the next error alert only once
    $(window).one('ajaxError', function(event, message){
        event.preventDefault()
    })

    if ($('.form-field-error-label', $field).length > 0)
        return

    $field.append($label)

    if (isFirst) {
        // Scroll to the form group, if not inside a modal window
        if (!$field.closest('.ui.modal').length) {
            $('html, body').animate({ scrollTop: $field.offset().top }, 500, function(){
                if ($field.hasClass('no-focus')) return
                $(fieldElement).focus()
            })
        }

        $label.transition({
            animation: 'shake',
            duration: '1s'
        })
    }
})

$(document).on('ajaxPromise', '[data-request]', function() {
    var $form = $(this).closest('form'),
        $label = $('.form-field-error-label', $form)

    if (!$form.length || !$label.length)
        return

    $label.remove()
    $('.field.error, .grouped.fields.error', $form).removeClass('error')
})

/*
 * Toolbar
 *
 * Allows a button outside the form to trigger the submission,
 * induces loading on that button too.
 *
 * Example:

    <button data-submit-form="#requestSubmitForm">
        I will submit the form with ID requestSubmitForm
    </button>
 */

$(document).on('click', '[data-submit-form]', function() {
    var $this = $(this),
    $form = $($this.data('submit-form'))

    $form.submit()
    $this.addClass('loading')
    $form.one('ajaxFail ajaxDone', function(){
        $this.removeClass('loading')
    })
})
