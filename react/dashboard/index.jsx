import React from 'react';
import ReactDOM from 'react-dom';

import {Test} from './test-case/index';

window.jQuery(document).ready(function($) {
    var container = document.getElementById('avt_dashboard_container');

    if(container) {
        ReactDOM.render(<Test/>, container);
    } else {
        console.error('avt_dashboard_container not found.');
    }
});