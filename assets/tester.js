'use strict';

window.jQuery(window).load(function() {

    var $ = window.jQuery;

    var sample_test = [
        {
            action: 'click', // Open pop up form
            xpath: '//*[@id="tutor-topics-151"]/div[1]/h4/span[1]'
        },
        {
            action: 'click',
            xpath: '//*[@id="tutor-quiz-152"]/div/a[1]'
        },
        {
            action: 'delay', // Wait for ajax loading of form
            millisecond: 5000
        },
        {
            action: 'default_page_leave' // Will be navigated to new page, so stop automation for this page, and re-spawn at new page
        }
    ];

    var non_element_actions = [ 'delay' ];

    const Tester = function() {

        this.event_looper = blueprints => {

            if(!blueprints.length) {
                console.info('AVT Testing Completed for this page.');
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
                    return;
                }
            } else {
                element.scrollIntoView({
                    behavior: 'smooth', 
                    block: 'center'
                });

                // Replace the JS DOM with jquery DOM
                element = $(element);
            }

            switch(event.action) {
                case 'click' : element.trigger('click');
                    break;

                case 'delay' : delay = event.millisecond;
                    break;
            }

            setTimeout(()=> {
                setTimeout(() => {
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
            var blueprint = sample_test;
            
            callback(blueprint);
        }

        this.init = () => {
            this.fetch_blueprint(blueprint=> {
                var session_blueprint = this.get_current_session_blueprint(blueprint);
                this.event_looper(session_blueprint);
            });
        }

        return {init: this.init}
    }

    new Tester().init();
});