'use strict';

window.avt_ajax_counter = 0;

window.jQuery(document).ajaxStart(function() {
    window.avt_ajax_counter++;
});

window.jQuery(document).ajaxStop(function() {
    window.avt_ajax_counter--;
});

window.jQuery(window).load(function() {

    var $ = window.jQuery;

    var non_element_actions = [ 'delay' ];

    const Tester = function() {

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

        var looper_terminated = false;

        this.overlay_protection=(show, suppress)=> {

            if(!show) {
                if(!suppress) {
                    looper_terminated = true;
                    console.info('AVT: Terminated by user');
                }
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

            console.log('AVT: ' + event.action + ' - ' + (event.action=='delay' ? event.value : (event.xpath || '')));

            if(!element) {
                if(non_element_actions.indexOf( event.action ) == -1) {
                    console.warn('Automated Testing Stopped');
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
                case 'click' : element.trigger('click');
                    break;

                case 'input' : element.trigger('focus').val(event.value).trigger('input').trigger('change').trigger('blur');
                    break;

                case 'delay' : delay = parseInt( event.value );
                    break;
            }
        
            var ajax_resolver = () => {
                setTimeout(() => {
                    if(window.avt_ajax_counter>0) {
                        console.log('AVT: waiting for '+window.avt_ajax_counter+' request'+(window.avt_ajax_counter>1 ? 's' : '')+' completion. ');
                        ajax_resolver();
                        return;
                    }

                    $('.avt-tester-highlight').removeClass('avt-tester-highlight');
                    this.event_looper(blueprints, def_delay);
                    
                }, 1000);
            }

            (delay && !isNaN(delay) && delay>0) ? setTimeout(ajax_resolver, parseInt( delay )) : ajax_resolver();
        }

        this.get_current_session_blueprint = blueprint => {
            var index_offset = 0;
            var sliced = [];

            for(var i=index_offset; i<blueprint.length; i++) {
                if(blueprint[i].action == 'default_page_leave') {
                    break;
                }

                sliced.push(blueprint[i]);
            }

            return sliced;
        }

        this.fetch_blueprint = callback => {
            
            $.ajax({
                url: window.avt_object.ajaxurl,
                type: 'POST',
                data: {action: 'avt_get_blueprint', test_key: window.avt_object.test_key},
                success: response=> {
                    if(!response.success || !response.data.blueprint) {
                        console.error('AVT blueprint error');
                        return;
                    }

                    callback(response.data.blueprint)
                },
                error: error=> {
                    console.error('AVT test blueprint loading error.');
                }
            });
        }

        this.init = () => {
            
            this.overlay_protection(true);

            this.fetch_blueprint(data=> {
                console.info('AVT started: ' + data.title);
                var session_blueprint = this.get_current_session_blueprint(data.blueprint);
                this.event_looper(session_blueprint, (data.event_delay || 0));
            });
        }

        return {init: this.init}
    }

    new Tester().init();
});