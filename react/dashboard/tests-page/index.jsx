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
    }

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

        this.setState({tests, current_one: new_key}, ()=>this.addNewAction(0));
    }

    setMetaData(key, value) {
        let {tests, current_one} = this.state;
        tests[current_one][key] = value;
        this.setState({tests});
    }

    deleteTest() {
        let {tests, current_one} = this.state;
        delete tests[current_one];

        let next = Object.keys(tests)[0] || null;

        this.setState({tests, current_one: next});
    }

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

    isValidBlueprint(blueprint) {
        return  blueprint.title != undefined && 
                blueprint.entry_point != undefined && 
                blueprint.event_delay != undefined && 
                Array.isArray(blueprint.blueprint) && 
                blueprint.blueprint.filter(event=>event.action!=undefined).length>0;
    }

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

    exportTest() {
        let {tests, current_one} = this.state;

        let json = JSON.stringify(tests[current_one]);
        let json_data = "data:text/json;charset=utf-8," + encodeURIComponent(json);

        let element = document.createElement('A');
        element.setAttribute('href', json_data);
        element.setAttribute("download", "avt-test.json");
        element.click();
    }

    addNewAction(index) {

        let {tests, current_one} = this.state;

        let blueprint = {
            key: getRandomString(),
            action: 'click',
            xpath: '',
            comment: ''
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