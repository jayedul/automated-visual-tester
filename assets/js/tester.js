'use strict';

window.jQuery(window).load(function() {

    var $ = window.jQuery;
    var navigation_events = ['page_leave', 'redirect'];
    var avt_event = [{avt_event: true}];
    var ck = 'avt_test_index_at_runtime';
    var ck_leave = 'avt_page_leave_done';

    const Tester = function() {

        // This object must be same as the one in ~/react/dashboard/tests-page/blueprint-editor/index.jsx
        this.actions = {
            click: {title: 'Click', xpath: true, value:false},
            dblclick: {title: 'Double Click', xpath: true, value:false},
            focus: {title: 'Focus', xpath: true, value: false},
            blur: {title: 'Blur', xpath: true, value: false},
            input: {title: 'Input', xpath: true, value: false},
            mouseover: {title: 'Mouseover', xpath: true, value:false},
            mouseout: {title: 'Mouseout', xpath: true, value:false},
            mousedown: {title: 'Mousedown', xpath: true, value:false},
            mouseup: {title: 'Mouseup', xpath: true, value:false},
            submit: {title: 'Submit Form', xpath: true, value: false},
        
            input_text: {title: 'Input Text', xpath: true, value: true},
            check: {title: 'Check', xpath: true, value: false},
            uncheck: {title: 'UnCheck', xpath: true, value: false},
            select: {title: 'Select Dropdown', xpath: true, value: true, placeholder:'Value to select'},
        
            gutengurg_title: {title: 'Gutengurg Title', xpath: false, value:true, placeholder: 'Title for gutengurg editor'},
            gutengurg_content: {title: 'Gutengurg Content', xpath: false, value:true, placeholder: 'Content for gutengurg editor'},
            
            delay: {title: 'Delay', xpath:false, value:true, type: 'number', placeholder:'Millisecond'},
            page_leave: {title: 'Page Leave', xpath:false, value:false},
            redirect: {title: 'Redirect', value:true, placeholder: 'URL'},
            reuse: {title: 'Reause Sequence', xpath:false, value:true, placeholder:'e.g. 5-12'},
        
            terminate: {title: 'Stop Test', xpath: false, value: false, tooltip: 'Useful to make a stop inside a big sequence.'}
        }

        var looper_terminated = false;
        var overlay = $('body')
                        .append('<style>.avt-tester-highlight{outline:1.4px dashed red !important;}</style>')
                        .append('<div \
                                    id="avt_overlay_protection" \
                                    style=" display:none; \
                                            position:fixed; \
                                            left:0; \
                                            right:0; \
                                            top:0; \
                                            bottom:0; \
                                            z-index:99999999999">\
                                </div>')
                        .find('#avt_overlay_protection');

        this.setCookie = (cname, cvalue, exdays) => {
            var expires = '';

            if(exdays) {
                var d = new Date();
                d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                expires = "expires="+d.toUTCString()+';';
            }
            
            document.cookie = cname + "=" + cvalue + ";" + expires + "path="+window.avt_object.base_path;
        }
            
        this.getCookie = (cname, def) => {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return def || "";
        }

        this.deleteCookie = key => {
            this.setCookie(key, '', -2);
        } 

        this.getParameter = (key, def_val, url) => {
            var url_string = url || window.location.href;
            var url = new URL(url_string);
            var value = url.searchParams.get(key);
            return  value ? value : def_val;
        }

        this.overlay_protection=(show, organic)=> {

            if(!show) {

                // Show message if terminated manually
                if(!organic) {
                    looper_terminated = true;
                    console.log('AVT: Terminated by user');
                }

                // Delete identifier cookies
                this.deleteCookie(ck);
                this.deleteCookie(ck_leave);
                this.deleteCookie('avt_test_key');

                // And hide the overlay since testing stopped.
                overlay.hide();
                return;
            }

            // Show the overlay and add terminator event listener
            // It can be shown only at first load, so no way of multiple event attachment
            overlay.show().click(()=> {
                if( window.confirm('Terminate AVT Testing?') ) {
                    this.overlay_protection(false);
                }
            });
        }
        
        this.event_looper = (blueprints, def_delay, pointer, has_next_page) => {

            if(looper_terminated) {
                return;
            }


            var delay = def_delay;
            var event  = blueprints.shift();

            var require_element = this.actions[event.action].xpath;

            if(event.sequence_title) {
                console.log('%c-----'+event.sequence_title+'-----', 'font-weight:bold');
            }

            // Prepare element
            var element = null;
            if(require_element && event.xpath) {
                if(pointer=='xpath') {
                    var DOM = document.evaluate(event.xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    DOM ? element = $(DOM) : 0;
                } else {
                    var el = $(event.xpath);
                    el.length ? element = el : 0;
                    // In fact css selector. 
                    // But we have to use the key 'xpath' for backward compatibillity.
                    // Because initially selector pointer was not available in this app. 
                }
            }

            // Log progress
            console.log('AVT: ' + event.action + ' - ' + (event.comment || ''));

            if(!element || !element.length) {
                if( require_element ) {
                    if(event.skippable) {
                        console.log('AVT Target not found: '+ event.xpath);
                        console.log('Skipping element as it is marked as skippable');
                        this.event_looper(blueprints, def_delay, pointer, has_next_page);
                    } else {
                        console.log('Automated Testing Stopped');
                        this.overlay_protection(false, true);
                        console.log('AVT: Target not found: '+ event.xpath, event);
                        alert('AVT Target not found: '+ event.xpath);
                    }
                    return;
                }
            } else {
                
                element.get(0).scrollIntoView({
                    behavior: 'smooth', 
                    block: 'center',
                    inline: 'center'
                });
                
                // Replace the JS DOM with jquery DOM
                element.addClass('avt-tester-highlight');
            }

            if(!blueprints || !blueprints.length || !has_next_page) {
                this.overlay_protection(false, true);
                console.log('Testing Completed');
            } else {
                // Store index for testing across navigated pages
                this.setCookie(ck, parseInt(this.getCookie(ck, 0))+1);
            }

            if((blueprints[0] || blueprints[1] || {}).action=='page_leave') {
                console.log('AVT: Page leave pending');
                this.setCookie(ck_leave, 1);
            }
            
            switch(event.action) {
                case 'focus' :
                case 'blur' :
                case 'mouseout' :
                case 'mouseover' :
                case 'mousedown' : 
                case 'mouseup' :
                case 'input' : 
                case 'change' : 
                case 'dblclick' : 
                case 'click' : element.each(function() {
                        if(event.action == 'click') {
                            var DOM = $(this).get(0);
                            if(DOM.tagName=='A') {
                                DOM.click();
                                return;
                            }
                        }
                        $(this).trigger(event.action, avt_event);
                    });
                    break;

                case 'submit' : element.each(function() {
                        $(this).submit();
                    });
                    break;

                case 'input_text' : element.each(function() {
                        $(this)
                            .trigger('focus', avt_event)
                            .val(event.value)
                            .trigger('input', avt_event)
                            .trigger('change', avt_event)
                            .trigger('blur', avt_event);
                    });               
                    break;

                case 'select' : element.each(function() {
                        $(this)
                            .trigger('focus')
                            .val(event.value)
                            .trigger('change')
                            .trigger('blur');
                    });         
                    break;

                case 'check' :
                case 'uncheck' : element.each(function() {
                        $(this)
                            .prop('checked', event.action=='check')
                            .trigger('change', avt_event);
                    });
                    break;

                case 'gutengurg_title' :
                case 'gutengurg_content' :
                    if(window._wpLoadBlockEditor || window._wpLoadGutenbergEditor) {
                        if(event.action=='gutengurg_title') {
                            window.wp.data.dispatch('core/editor').editPost({title: event.value});
                        } else {
                            window.wp.data.dispatch('core/block-editor').resetBlocks(window.wp.blocks.parse(event.value));
                        }
                    } else if(event.skippable) {
                        console.log('AVT: Gutengurg editor not found. However skipping as it is marked as skippable.');
                    } else {
                        console.log('Automated Testing Stopped');
                        this.overlay_protection(false, true);
                        console.log('AVT: Gutengurg editor not found');
                        alert('Gutengurg editor not found');
                        return;
                    }
                    break;

                case 'delay' : delay = parseInt( event.value );
                    break;

                case 'redirect' :
                    this.setCookie(ck_leave, 1);
                    
                    var url = event.value;
                    url = url.toLowerCase();
                    if(!(url.indexOf('http://')===0 || url.indexOf('https://')===0)){
                        if(url.indexOf('/')===0) {
                            url = window.avt_object.home_url+url;
                        } else {
                            var path = window.location.pathname;
                            path = path.split('/');
                            path = path.slice(0, path.length-1).join('/');
                            url = window.location.origin+path+'/'+url;
                        }
                    }
                    
                    console.log('AVT: Redirect to ' + url);
                    window.location.assign(url);
                    return;

                case 'page_leave' :
                    window.setTimeout(()=> {
                        this.event_looper(blueprints, def_delay, pointer, has_next_page);
                    }, 5000);
                    return;

                case 'terminate' :
                    console.log('Automated Testing Terminated');
                    this.overlay_protection(false, true);
                    return;
            }

            if(!has_next_page || !blueprints.length) {
                return;
            }
        
            var ajax_resolver = () => {
                setTimeout(() => {
                    if(window.avt_ajax_counter>0) {
                        console.log('AVT: waiting for '+window.avt_ajax_counter+' request'+(window.avt_ajax_counter>1 ? 's' : '')+' completion. ');
                        ajax_resolver();
                        return;
                    }

                    $('.avt-tester-highlight').removeClass('avt-tester-highlight');
                    this.event_looper(blueprints, def_delay, pointer, has_next_page);
                    
                }, 1000);
            }

            (delay && !isNaN(delay) && delay>0) ? setTimeout(ajax_resolver, parseInt( delay )) : ajax_resolver();
        }

        this.fetch_blueprint = callback => {
            
            console.log('AVT: Requesting ' + window.avt_object.avt_test_key);

            $.ajax({
                url: window.avt_object.ajaxurl,
                type: 'POST',
                data: {
                    action: 'avt_get_blueprint', 
                    test_key: window.avt_object.avt_test_key
                },
                success: response=> {
                    if(!response.success || !response.data.blueprint) {
                        console.log(response.data.message || 'Blueprint Request Error');
                        return;
                    }

                    callback(response.data.blueprint)
                },
                error: error=> {
                    console.log('AVT test blueprint loading error.');
                }
            });
        }

        this.expand_reusable_sequence = blueprints => {

            var expanded = [];
            var index_map = {};
            var add_index = 0;

            // Loop through the array and collect reusable map
            for(var i=0; i<blueprints.length; i++) {

                var blueprint = blueprints[i];
                expanded.push(blueprint);

                index_map[i]=i+add_index;
                
                // Expand if it reuses
                if(blueprint.action=='reuse') {
                    // Prepare reusable range and enter all
                    var range = blueprint.value.split('-');
                    var from = parseInt(range[0]);
                    var to = parseInt(range[1]);

                    for(var n=from; n<=to; n++) {
                        var blueprint2 = blueprints[n];
                        if(blueprint2 && blueprint2.action!='reuse') {
                            expanded.push(blueprint2);
                            add_index++;
                        }
                    }
                }

            }
            return [expanded, index_map];
        }

        this.init = () => {

            if(!this.getCookie('avt_test_key')) {
                return;
            }

            this.fetch_blueprint(data=> {
                var use_map = false;
                if(this.getParameter('avt_test_case')) {
                    var from_offset = this.getParameter('avt_test_offset', null);

                    // Favour testing from specific index
                    if(!(from_offset===null)) {
                        use_map = true;
                        this.setCookie(ck, from_offset);
                        this.setCookie(ck_leave, 1);
                    }
                }

                var start_at = parseInt(this.getCookie(ck, 0)) || 0;

                // This block means there is incomplete test but page leave event was not fired
                if(start_at>0 && !this.getCookie(ck_leave) && from_offset===null) {
                    this.overlay_protection(false, true);

                    // Attempt start over if the URL is testing entrypoint
                    if(window.location.href == data.entry_point && confirm('AVT session expired. Start over?')) {
                        window.location.reload();
                    }
                    return;
                }

                this.deleteCookie(ck_leave);

                // Show the overlay now as testing getting started
                this.overlay_protection(true);

                console.log('AVT Testing: ' + data.title);
                start_at>0 ? console.log('AVT Resumed at '+start_at) : 0;

                var expand = this.expand_reusable_sequence(data.blueprint);
                var expanded = expand[0];
                var index_map = expand[1];
                
                var start_index = use_map ? index_map[start_at] : start_at;
                var remaining_tests = expanded.slice(start_index);
                var next_breakpoint;

                for(var i=0; i<remaining_tests.length; i++) {
                    var {action} = remaining_tests[i];

                    if(navigation_events.indexOf(action)) {
                        next_breakpoint = i;
                        break;
                    }
                }

                var has_next_page = next_breakpoint!=undefined && (remaining_tests.length-1)!=next_breakpoint;
                
                if(!remaining_tests || !remaining_tests.length) {
                    console.log('Empty Test Case. Testing Stopped.');
                    this.overlay_protection(false, true);
                    return;
                }

                console.log(start_index);

                this.setCookie(ck, start_index);
                this.event_looper(remaining_tests, (data.event_delay || 0), (data.pointer || 'xpath'), has_next_page);
            });
        }

        return {init: this.init}
    }

    new Tester().init();
});