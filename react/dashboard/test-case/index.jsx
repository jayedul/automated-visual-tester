import React, { Component } from 'react';

class DashbboardRoot extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tests: []
        }
    }

    componentDidMount() {
        window.jQuery.ajax({
            url: window.avt_object.ajaxurl,
            data: {action: ''}
        })
    }

    render() {

    }
}
const Test=()=><span>Test Element</span>

export {Test}