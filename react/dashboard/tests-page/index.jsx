import React, { Component } from 'react';
import { Spinner, getRandomString } from '../../lib/utility';
import { BlueprintEditor } from './blueprint-editor';
import { TestSelection } from './selection';

class DashboardRoot extends Component {

    constructor(props) {

        super(props);

        this.state = {
            fetching : true,
            saving: false,
            tests: {},
            current_one: null
        }

        this.createNewTest = this.createNewTest.bind(this);
        this.deleteTest = this.deleteTest.bind(this);
        this.renameTest = this.renameTest.bind(this);

        this.importTest = this.importTest.bind(this);
        this.exportTest = this.exportTest.bind(this);

        this.isValidBlueprint = this.isValidBlueprint.bind(this);
        this.setMetaData = this.setMetaData.bind(this);
        this.saveAll = this.saveAll.bind(this);
        this.addNewAction = this.addNewAction.bind(this);
        this.modifyEvent = this.modifyEvent.bind(this);
        this.deleteAction = this.deleteAction.bind(this);
        this.adjustReuseRange = this.adjustReuseRange.bind(this);
        this.avtToast = this.avtToast.bind(this);
    }

    /**
     * @return void
     * 
     * Create new test and add to the list
     * 
     * @since v1.0.0
     */
    createNewTest( blueprint ) {
        let title = blueprint ? blueprint.title : window.prompt('Give a title');
        title = title ? title.trim() : null;
        
        if(!title || !title.length) {
            return;
        }

        let {tests} = this.state;
        let new_key = getRandomString();
        
        tests[new_key] = blueprint || {
            title,
            entry_point: window.avt_object.home_url,
            event_delay: 500,
            blueprint: []
        }

        this.setState({tests, current_one: new_key}, ()=>(!blueprint ? this.addNewAction(0) : 0) );
    }

    /**
     * @return void
     * 
     * Set meta data for currently selected test
     * 
     * @since v1.0.0
     */
    setMetaData(key, value) {
        let {tests, current_one} = this.state;
        tests[current_one][key] = value;
        this.setState({tests});
    }

    /**
     * @return void
     * 
     * Delete currently selected test
     * 
     * @since v1.0.0
     */
    deleteTest() {
        let {tests, current_one} = this.state;
        delete tests[current_one];

        let next = Object.keys(tests)[0] || null;

        this.setState({tests, current_one: next});
    }

    /**
     * @return void
     * 
     * Change current test name
     * 
     * @since v1.0.0
     */
    renameTest() {
        let {tests, current_one} = this.state;
        
        let name = window.prompt('Rename Test', tests[current_one].title);
        name = name ? name.trim() : null;

        if(!name || !name.length) {
            // Empty Name not allowed
            return;
        }
        
        tests[current_one].title = name;
        this.setState({tests});
    }

    /**
     * @return boolean
     * 
     * Check if the provided blueprint is valid
     * 
     * @since v1.0.0
     */
    isValidBlueprint(blueprint) {
        return  blueprint.title != undefined && 
                blueprint.entry_point != undefined && 
                blueprint.event_delay != undefined && 
                Array.isArray(blueprint.blueprint) && 
                blueprint.blueprint.filter(event=>event.action!=undefined).length>0;
    }

    /**
     * @return void
     * 
     * Import Test from JSON file
     * 
     * @since v1.0.0
     */
    importTest() {
        let element = document.createElement('input');
        element.setAttribute('type', 'file');
        element.setAttribute('accept', '.json');
        element.onchange=e=> {
            console.log(e.currentTarget.files);

            let files = e.currentTarget.files;

            if(!files || !files[0]) {
                alert('Import Error');
                return;
            }

            let f = files[0];
            var reader = new FileReader();

            reader.onload = e => {

                let json;
                try{ json = JSON.parse(e.target.result); } catch(e) { }

                if(!json || typeof json!='object' || !this.isValidBlueprint(json)) {
                    alert('Invalid JSON file');
                    return;
                }

                this.createNewTest(json);
            }
            
            reader.readAsText(f);
        }

        element.click();
    }

    /**
     * @return void
     * 
     * Export test in JSON format file
     * 
     * @since v1.0.0
     */
    exportTest() {
        let {tests, current_one} = this.state;

        let json = JSON.stringify(tests[current_one]);
        let json_data = "data:text/json;charset=utf-8," + encodeURIComponent(json);

        let element = document.createElement('A');
        element.setAttribute('href', json_data);
        element.setAttribute("download", "avt-test.json");
        element.click();
    }


    avtToast(title, description) {

        if(!window.jQuery('.avt-toast-parent').length) {
            window.jQuery('body').append('<div class="avt-toast-parent"></div>');
        }
        
        let content = window.jQuery('\
            <div>\
                <div>\
                    <div>\
                        <b>'+title+'</b>\
                        <span>'+description+'</span>\
                    </div>\
                </div>\
            </div>');

        let is_hovered = false;
        content
            .mouseover(function() {
                is_hovered=true
            }).mouseout(function() {
                is_hovered=false
            }).find('.avt-toast-close').click(function() {
                content.remove();
            });

        window.jQuery('.avt-toast-parent').append(content);

        let waiter = function() {
            setTimeout(function() {
                if(content) {
                    if(is_hovered) {
                        waiter();
                        return;
                    }

                    content.fadeOut('fast', function() {
                        window.jQuery(this).remove();
                    });
                }
            }, 3000);
        }
        
        waiter();
    }

    adjustReuseRange(blueprints, index, is_added) {

        //Adjust reuse sequence range
        for(let i=0; i<blueprints.length; i++) {
            let bprint = blueprints[i];
            if(bprint.action!='reuse') {
                continue;
            }

            let range = bprint.value.split('-');
            let from = parseInt(range[0] || 0) || 0;
            let to = parseInt(range[1] || 0) || 0;
            let is_del_clear = !is_added && (from==index || to==index);

            if(from<0 || to<0 || is_del_clear) {
                blueprints[i].value = '';
                if(is_del_clear) {
                    this.avtToast('Notice!', 'Action '+i+': Reuse range has been cleared since starting or ending action has been deleted.');
                }
                continue;
            }

            if(is_added) {
                if(index<=from) {
                    from = from+1;
                    to = to+1;
                } else if(index>from && index<=to) {
                    to = to+1;
                }
            } else {
                if(index<from) {
                    from = from-1;
                    to = to-1;
                } else if(index>from && index<=to) {
                    to = to-1;
                }
            }
            
            blueprints[i].value = from+'-'+to;
        }

        return blueprints;
    }

    /**
     * @return void
     * 
     * Add action to currently selected test
     * 
     * @since v1.0.0
     */
    addNewAction(index, position) {

        let {tests, current_one} = this.state;

        let blueprint = {
            key: getRandomString(),
            action: 'click',
            xpath: '',
            comment: ''
        }

        let current_blueprints = tests[current_one].blueprint;
        if(current_blueprints[index] && position=='before') {
            // Move the sequence title to the new one
            blueprint.sequence_title = current_blueprints[index].sequence_title;
            tests[current_one].blueprint[index].sequence_title = '';
        }
        
        // Add the new blueprint to the array
        tests[current_one].blueprint.splice(index, 0, blueprint);
        tests[current_one].blueprint = this.adjustReuseRange(tests[current_one].blueprint, index, true);

        this.setState({tests});
    }

    /**
     * @return void
     * 
     * Delete action from currently selected test
     * 
     * @since v1.0.0
     */
    deleteAction(index) {
        let {tests, current_one} = this.state;

        // Move sequence title to next
        let blueprint = tests[current_one].blueprint[index];
        let next_blueprint = tests[current_one].blueprint[index+1];
        if(blueprint && blueprint.sequence_title && next_blueprint && !next_blueprint.sequence_title) {
            tests[current_one].blueprint[index+1].sequence_title = blueprint.sequence_title;
        }

        tests[current_one].blueprint.splice(index, 1);
        tests[current_one].blueprint = this.adjustReuseRange(tests[current_one].blueprint, index, false);

        this.setState({tests});
    }

    /**
     * @return void
     * 
     * Modify specific action under currently selected test
     * 
     * @since v1.0.0
     */
    modifyEvent(key, name, value) {

        let {tests, current_one} = this.state;

        for(let i=0; i<tests[current_one].blueprint.length; i++) {
            if(tests[current_one].blueprint[i].key==key) {
                tests[current_one].blueprint[i][name] = value;
                break;
            }
        }

        this.setState({tests});
    }

    /**
     * @return void
     * 
     * Save all the changes together
     * 
     * @since v1.0.0
     */
    saveAll() {
        this.setState({saving: true});

        window.jQuery.ajax({
            url: window.avt_object.ajaxurl,
            type: 'POST',
            data: {
                action: 'avt_save_tests', 
                blueprints: JSON.stringify(this.state.tests)
            },
            success: response=> {
                var message = (response.data || {}).message || 'Error in Saving';
                alert(message);
            },
            error: error => {
                alert('Request Error');
            },
            complete: () => {
                this.setState({saving: false});
            }
        });
    }

    /**
     * @return void
     * 
     * Load test cases from server on component mount
     * 
     * @since v1.0.0
     */
    componentDidMount() {
        window.jQuery.ajax({
            url: window.avt_object.ajaxurl,
            data: {action: 'avt_get_tests'},
            success: response=> {
                if(response.success) {
                    
                    let {tests} = response.data || {};
                    let keys = Object.keys(tests);
                    let last = keys[keys.length - 1] || null;

                    this.setState({
                        tests,
                        current_one: last
                    });

                } else {
                    alert('Could not retrieve saved tests');
                }
            },
            error: error => {
                alert('Request Error');
            },
            complete: () => {
                this.setState({fetching: false});
            }
        })
    }

    /**
     * @return component
     * 
     * Render the UI for Test Cases and Event management
     * 
     * @since v1.0.0
     */
    render() {
        let {tests, current_one, fetching, saving} = this.state;

        return <div>
            <div style={{padding:'10px 0'}}>
                <h3 style={{display: 'inline-block', margin: '0'}}>
                    AVT Tests &nbsp;
                    {
                        fetching ? null :
                        <button style={{verticalAlign: 'middle'}} className="button button-primary button-small" onClick={()=>this.createNewTest()}>
                            Create New
                        </button>
                    }
                    &nbsp;
                    {
                        !Object.keys(tests).length ? null :
                        <button style={{verticalAlign: 'middle'}} className="button button-primary button-small" onClick={this.saveAll}>
                            Save All
                        </button>
                    }
                    &nbsp;
                    <Spinner loading={saving || fetching}/>
                </h3>
                
                <div style={{display:'inline-block', float: 'right'}}>
                    {
                        fetching ? null :
                        <TestSelection 
                            tests={tests} 
                            current_one={current_one}
                            onChange={current_one=>this.setState({current_one})}
                            deleteTest={this.deleteTest} 
                            renameTest={this.renameTest}
                            importTest={this.importTest}
                            exportTest={this.exportTest}/>
                    }
                </div>
            </div>
            
            {
                (!current_one || !tests[current_one]) ? null :
                <BlueprintEditor 
                    entry_point={tests[current_one].entry_point}
                    event_delay={tests[current_one].event_delay}
                    pointer={tests[current_one].pointer || 'xpath'}
                    test_case={current_one}
                    blueprint={tests[current_one].blueprint} 
                    setMetaData={this.setMetaData}
                    addNewAction={this.addNewAction}
                    deleteAction={this.deleteAction} 
                    onChange={this.modifyEvent}/>
            }
            
        </div>
    }
}

export {DashboardRoot}