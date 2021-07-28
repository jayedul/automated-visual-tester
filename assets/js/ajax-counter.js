window.avt_ajax_counter = 0;

window.jQuery(document).ajaxSend(function() {
    window.avt_ajax_counter++;
});

window.jQuery(document).ajaxComplete(function() {
    window.avt_ajax_counter--;
});