'use strict';

var sample_test = [
    {
        action: 'click', // Open pop up form
        xpath: ''
    },
    {
        action: 'delay', // Wait for ajax loading of form
        millisecond: 5000
    },
    {
        action: 'focus', // Focus a field
        xpath: ''
    },
    {
        action: 'input', // Then add text
        xpath: ''
    },
    {
        action: 'check', // Check some meta checkbox like remember me
        xpath: ''
    },
    {
        action: 'click', // Click form submitter
        xpath: ''
    },
    {
        action: 'navigate' // Will be navigated to new page, so stop automation for this page, and re-spawn at new page
    },
    {
        action: 'redirect',
        url: ''
    }
];

window.jQuery(document).ready(function($) {

});