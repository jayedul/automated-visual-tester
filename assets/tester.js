'use strict';

window.jQuery(window).load(function() {

    var $ = window.jQuery;

    var non_element_actions = [ 'delay' ];

    const Tester = function() {

        var overlay = $('body')
                        .append('<style>.avt-tester-highlight{outline:1px dotted red;}</style>')
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
        
        this.event_looper = blueprints => {

            if(!blueprints.length || looper_terminated) {
                if(!looper_terminated) {
                    console.info('AVT Testing Completed for this page.');
                    this.overlay_protection(false, true);
                }
                return;
            }

            var delay = 0;
            var event  = blueprints.shift();
            var element =  event.xpath ? document.evaluate(event.xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue : null;

            console.log('AVT: ' + event.action + ' - ' + (event.xpath || ''));

            if(!element) {
                if(non_element_actions.indexOf( event.action ) == -1) {
                    console.error('AVT Target not found: '+ event.xpath);
                    console.warn('Automated Testing Stopped');
                    this.overlay_protection(false, true);
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

                case 'delay' : delay = event.millisecond;
                    break;
            }

            setTimeout(()=> {
                setTimeout(() => {
                    $('.avt-tester-highlight').removeClass('avt-tester-highlight');
                    this.event_looper(blueprints);
                }, 3000);
            }, delay);
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
                this.event_looper(session_blueprint);
            });
        }

        return {init: this.init}
    }

    new Tester().init();
});