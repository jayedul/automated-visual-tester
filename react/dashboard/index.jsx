import React from 'react';
import ReactDOM from 'react-dom';

import {DashboardRoot} from './tests-page';

window.jQuery(document).ready(function($) {
    var container = document.getElementById('avt_dashboard_container');

    if(container) {
        ReactDOM.render(<DashboardRoot/>, container);
    } else {
        console.error('avt_dashboard_container not found.');
    }
});