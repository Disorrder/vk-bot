// --- init ---
function refreshMessageToken() {
    window.open('/vk/token', 'Refresh token')
}
function saveMessageToken(e) {
    var card = $(e.target).parents('.card');
    var field = $(e.currentTarget).parents('.field-editable');
    var model = field.find('.fe-model');
    saveUser(card.data('id'), {
        message_token: model[0].value
    });
}

function saveUser(id, data) {
    return $.ajax(`/user/${id}`, {
        method: 'PUT',
        data,
    });
}


// --- field-editable component ---
$('.field-editable .fe-edit').on('click', (e) => {
    var card = $(e.currentTarget).parents('.card');
    var field = $(e.currentTarget).parents('.field-editable');
    var view = field.find('.fe-view');
    var model = field.find('.fe-model');

    field.addClass('editing');
    model.focus();
});

$('.field-editable .fe-save').on('click', (e) => {
    var card = $(e.currentTarget).parents('.card');
    var field = $(e.currentTarget).parents('.field-editable');
    var view = field.find('.fe-view');
    var model = field.find('.fe-model');

    view.html(model[0].value);
    model[0].value = null;
    field.removeClass('editing');
});

$('.field-editable .fe-cancel').on('click', (e) => {
    var card = $(e.currentTarget).parents('.card');
    var field = $(e.currentTarget).parents('.field-editable');
    var view = field.find('.fe-view');

    field.removeClass('editing');
});


// --- utils ---
jQuery.fn.selectText = function() {
    var element = this[0];
    if (document.body.createTextRange) {
        var range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }
};
