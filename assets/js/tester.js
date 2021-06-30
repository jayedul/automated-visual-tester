'use strict';

window.jQuery(window).load(function() {

    var $ = window.jQuery;
    var non_element_actions = [ 'delay', 'page_leave', 'redirect' ];
    var navigation_events = ['page_leave', 'redirect'];
    var avt_event = [{avt_event: true}];
    var ck = 'avt_test_index_at_runtime';
    var ck_leave = 'avt_page_leave_done';

    const Tester = function() {

        var looper_terminated = false;
        var overlay = $('body')
                        .append('<style>.avt-tester-highlight{outline:1px dotted red !important;}</style>')
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
            
        this.overlay_protection=(show, organic)=> {

            if(!show) {

                // Show message if terminated manually
                if(!organic) {
                    looper_terminated = true;
                    console.info('AVT: Terminated by user');
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
        
        this.event_looper = (blueprints, def_delay, has_next_page) => {

            if(looper_terminated) {
                return;
            }

            var delay = def_delay;
            var event  = blueprints.shift();
            var element =  event.xpath ? document.evaluate(event.xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue : null;

            // Log progress
            console.log('AVT: ' + event.action + ' - ' + (event.comment || ''));

            if(!element) {
                if(non_element_actions.indexOf( event.action ) == -1) {
                    console.log('Automated Testing Stopped');
                    this.overlay_protection(false, true);
                    alert('AVT Target not found: '+ event.xpath);
                    return;
                }
            } else {
                
                element.scrollIntoView({
                    behavior: 'smooth', 
                    block: 'center',
                    inline: 'center'
                });
                
                // Replace the JS DOM with jquery DOM
                element = $(element).addClass('avt-tester-highlight');
            }

            if(!blueprints.length || !has_next_page) {
                this.overlay_protection(false, true);
                console.log('Testing Completed');
            } else {
                // Store index for testing across navigated pages
                this.setCookie(ck, parseInt( this.getCookie(ck, '0') )+1);
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
                case 'click' : 
                    if(event.action == 'click') {
                        var DOM = element.get(0);
                        if(DOM.tagName=='A') {
                            DOM.click();
                            break;
                        }
                    } 
                    element.trigger(event.action, avt_event);
                    break;

                case 'submit' : element.submit();
                    break;

                case 'input_text' : element
                                        .trigger('focus', avt_event)
                                        .val(event.value)
                                        .trigger('input', avt_event)
                                        .trigger('change', avt_event)
                                        .trigger('blur', avt_event);
                    break;

                case 'check' :
                case 'uncheck' : element.prop('checked', event.action=='check').trigger('change', avt_event);
                    break;

                case 'delay' : delay = parseInt( event.value );
                    break;

                case 'redirect' :
                    window.location.assign(event.value);
                    this.setCookie(ck_leave, 1);
                    break;

                case 'page_leave' : 
                    this.setCookie(ck_leave, 1);
                    return;
            }

            if(!has_next_page) {
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
                    this.event_looper(blueprints, def_delay, has_next_page);
                    
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

        this.init = () => {

            if(!this.getCookie('avt_test_key')) {
                return;
            }

            this.fetch_blueprint(data=> {

                var start_at = this.getCookie(ck, 0);

                // This block means there is incomplete test but page leave event was not fired
                if(start_at>0 && !this.getCookie(ck_leave)) {
                    this.overlay_protection(false, true);

                    // Attempt start over if the URL is testing entrypoint
                    if(window.location.href == data.entry_point && confirm('AVT session expired. Start over?')) {
                        window.location.reload();
                    }
                    return;
                }

                // Show the overlay now as testing getting started
                this.overlay_protection(true);

                console.info('AVT Testing: ' + data.title);
                start_at>0 ? console.info('AVT Resumed at index: '+start_at) : 0;

                var remaining_tests = data.blueprint.slice(start_at);
                var next_breakpoint;

                for(var i=0; i<remaining_tests.length; i++) {
                    var {action, key} = remaining_tests[i];

                    if(navigation_events.indexOf(action)) {
                        next_breakpoint = key;
                        break;
                    }
                }

                var has_next_page = next_breakpoint && ((remaining_tests[remaining_tests.length-1] || {}).key!=next_breakpoint);
                
                if(!remaining_tests || !remaining_tests.length) {
                    console.log('Empty Test Case. Testing Stopped.');
                    this.overlay_protection(false, true);
                    return;
                }

                this.event_looper(remaining_tests, (data.event_delay || 0), has_next_page);
            });
        }

        return {init: this.init}
    }

    new Tester().init();
});