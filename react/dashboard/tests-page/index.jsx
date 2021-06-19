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
        this.saveAll = this.saveAll.bind(this);
        this.addNewAction = this.addNewAction.bind(this);
        this.modifyEvent = this.modifyEvent.bind(this);
        this.deleteAction = this.deleteAction.bind(this);
        this.deleteTest = this.deleteTest.bind(this);
    }

    createNewTest() {
        let title = window.prompt('Test Title');
        title = title.trim();
        
        if(!title.length) {
            return;
        }

        let {tests} = this.state;
        let new_key = getRandomString();
        
        tests[new_key] = {
            title,
            blueprint: []
        }

        this.setState({tests, current_one: new_key}, ()=>this.addNewAction(0));
    }

    deleteTest() {
        let {tests, current_one} = this.state;
        delete tests[current_one];

        let next = Object.keys(tests)[0] || null;

        this.setState({tests, current_one: next});
    }

    addNewAction(index) {

        let {tests, current_one} = this.state;

        let blueprint = {
            key: getRandomString(),
            action: 'click',
            xpath: ''
        }

        tests[current_one].blueprint.splice(index, 0, blueprint);

        this.setState({tests});
    }

    deleteAction(index) {
        let {tests, current_one} = this.state;
        tests[current_one].blueprint.splice(index, 1);
        this.setState({tests});
    }

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
                alert(response.success ? 'Saved Successfully' : 'Could not save');
            },
            error: error => {
                alert('Request Error');
            },
            complete: () => {
                this.setState({saving: false});
            }
        });
    }

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

    render() {
        let {tests, current_one, fetching, saving} = this.state;

        return <div>
            <div style={{padding:'10px 0'}}>
                <h3 style={{display: 'inline-block', margin: '0'}}>
                    AVT Tests &nbsp;
                    {
                        fetching ? null :
                        <button style={{verticalAlign: 'middle'}} className="button button-primary button-small" onClick={this.createNewTest}>
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
                    <Spinner loading={saving}/>
                </h3>
                
                <div style={{display:'inline-block', float: 'right'}}>
                    {
                        fetching ? null :
                        <TestSelection 
                            tests={tests} 
                            current_one={current_one}
                            onChange={current_one=>this.setState({current_one})}
                            deleteTest={this.deleteTest} />
                    }
                </div>
            </div>
            
            <Spinner loading={fetching} center={true}/>

            {
                (!current_one || !tests[current_one]) ? null :
                <BlueprintEditor 
                    blueprint={tests[current_one].blueprint} 
                    addNewAction={this.addNewAction}
                    deleteAction={this.deleteAction} 
                    onChange={this.modifyEvent}/>
            }
            
        </div>
    }
}

export {DashboardRoot}