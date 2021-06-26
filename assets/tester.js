'use strict';



window.jQuery(window).load(function() {

    var avt_ajax_counter = 0;

    window.jQuery(document).ajaxStart(function() {
        avt_ajax_counter++;
    });

    window.jQuery(document).ajaxStop(function() {
        avt_ajax_counter--;
    });

    var $ = window.jQuery;
    var non_element_actions = [ 'delay', 'page_leave', 'redirect' ];
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
            
        this.overlay_protection=(show, suppress)=> {

            if(!show) {
                if(!suppress) {
                    looper_terminated = true;
                    console.info('AVT: Terminated by user');
                }

                this.deleteCookie(ck);
                this.deleteCookie(ck_leave);
                this.deleteCookie('avt_test_key');

                overlay.hide();

                return;
            }

            overlay.show().click(()=> {
                if( window.confirm('Terminate AVT Testing?') ) {
                    this.overlay_protection(false);
                }
            });
        }
        
        this.event_looper = (blueprints, def_delay) => {

            if(!blueprints.length || looper_terminated) {
                if(!looper_terminated) {
                    this.overlay_protection(false, true);
                    alert('AVT Testing Completed successfully.');
                }
                return;
            }

            var delay = def_delay;
            var event  = blueprints.shift();
            var element =  event.xpath ? document.evaluate(event.xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue : null;

            // Log progress
            console.log('AVT: ' + event.action + ' - ' + (event.comment || ''));

            // Store index for testing across navigated pages
            this.setCookie(ck, parseInt( this.getCookie(ck, '0') )+1);

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
                case 'click' : element.trigger(event.action);
                    break;

                case 'submit' : element.submit();
                    break;

                case 'input_text' : element.trigger('focus').val(event.value).trigger('input').trigger('change').trigger('blur');
                    break;

                case 'check' :
                case 'uncheck' : element.prop('checked', event.action=='check').trigger('change');
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
        
            var ajax_resolver = () => {
                setTimeout(() => {
                    if(avt_ajax_counter>0) {
                        console.log('AVT: waiting for '+avt_ajax_counter+' request'+(avt_ajax_counter>1 ? 's' : '')+' completion. ');
                        ajax_resolver();
                        return;
                    }

                    $('.avt-tester-highlight').removeClass('avt-tester-highlight');
                    this.event_looper(blueprints, def_delay);
                    
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
            
            this.overlay_protection(true);

            this.fetch_blueprint(data=> {

                var index = this.getCookie(ck, 0);

                if(index>0 && !this.getCookie(ck_leave)) {
                    // Test aborted in navigated page
                    console.log('Test aborted due to invalid page leave');
                    console.log('Please delete these two cookie and try again. ', ck, ck_leave);
                    return;
                }
                 
                console.log(index);
                console.info('AVT started: ' + data.title);
                index>0 ? console.info('AVT Resumed at index: '+index) : 0;

                this.event_looper(data.blueprint.slice(index), (data.event_delay || 0));
            });
        }

        return {init: this.init}
    }

    new Tester().init();
});