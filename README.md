# Dry UI

A set of useful JS tools accumulated over the years.

## Usage examples

#### `ajax-modal.js` 

Opens an AJAX Modal window with the partial contents inside.

    <button
        class="ui button"
        data-control="ajax-modal"
        data-handler="onLoadSomeForm"
        data-update-partial="some-form"
        data-modal-id="modalSomeForm">
        Open some form
    </button>

Inside the `some-form.htm` partial:

    <i class="close icon" data-dismiss="modal"></i>
    <div class="header">
        Some form
    </div>
    <div class="content">
        <p>This is a form</p>
    </div>
    <div class="actions">
        <a href="javascript:;" data-dismiss="modal">
            Nevermind
        </a>
        <button class="ui large positive button">
            Submit
        </button>
    </div>

#### `minimal-content.js`

    <div data-control="minimal-content">
        <p>Some really long content</p>
    </div>
