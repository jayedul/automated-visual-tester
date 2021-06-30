window.avt_ajax_counter = 0;

window.jQuery(document).ajaxStart(function() {
    window.avt_ajax_counter++;
});

window.jQuery(document).ajaxStop(function() {
    window.avt_ajax_counter--;
});