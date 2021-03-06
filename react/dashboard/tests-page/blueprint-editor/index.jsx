import React from 'react';
import './style.scss';

import {copyText} from '../../../lib/utility';

/**
 * Define the supported event list as object.
 * If any version is released with wrong action key, then no need to fix as some user may have some test sequence with the key already. 
 * However title can be changed.
 */
const actions = {
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
    change: {title: 'Change', xpath: true, value: false},
    uncheck: {title: 'UnCheck', xpath: true, value: false},
    select: {title: 'Select Dropdown', xpath: true, value: true, placeholder:'Value to select'},

    gutengurg_title: {title: 'Gutengurg Title', xpath: false, value:true, placeholder: 'Title for gutengurg editor'},
    gutengurg_content: {title: 'Gutengurg Content', xpath: false, value:true, placeholder: 'Content for gutengurg editor'},
    
    delay: {title: 'Delay', xpath:false, value:true, type: 'number', placeholder:'Millisecond'},
    page_leave: {title: 'Page Leave', xpath:false, value:false},
    redirect: {title: 'Redirect', value:true, placeholder: 'URL'},
    reuse: {title: 'Reause Sequence', xpath:false, value:true, placeholder:'e.g. 5-12'},

    terminate: {title: 'Terminate Test', xpath: false, value: false, tooltip: 'Useful to make a stop inside a big sequence.'}
}

const getSectionTitle = sequence_title => {
    let title = window.prompt('Sequence Title', (sequence_title || ''));
    return title===null ? sequence_title : (title || '').trim();
}

const scrollNow=id=> {
    let element = document.getElementById('id_to_action_'+id);
    if(element) {
        element.scrollIntoView({behavior:'smooth', block:'center'});

        element.style.outline = '1px dashed red';
        window.setTimeout(()=>{
            element.style.outline = '';
        }, 2500);
    }
}

const scrollToAction=(target, blueprint, onChange)=>{
    let id = target.value;
    id = id.split('-');
    id = id[0] || null;

    if(isNaN(id) || !blueprint[id]) {
        return;
    }

    // Remove focus from the element
    window.jQuery(target).blur();

    // Expand the range if collapse
    for(let i=id; i>=0; i--) {
        if(blueprint[i].sequence_title) {
            if(blueprint[i].is_collapsed) {
                onChange(blueprint[i].key, 'is_collapsed', false, ()=> scrollNow(id));
                return;
            };
            break;
        }
    }

    // Otherwise just call the scroll function
    scrollNow(id);
}

/**
 * @return component
 * 
 * Render the event management editor
 * 
 * @since v1.0.0
 */
const BlueprintEditor=props=>
{
    let {
            blueprint, 
            entry_point, 
            event_delay,
            pointer,
            test_case, 
            setMetaData, 
            addNewAction, 
            deleteAction, 
            onChange
        } = props;

    let testing_entry_point; 

    try {
        // Check if the entry point URL is under the same home url
        if(entry_point.indexOf(window.avt_object.home_url)===0) {

            let url = new URL(entry_point);

            let search = url.search || '';
            search.indexOf('?')===0 ? search=search.slice(1) : 0;

            search = search.split('&');
            search.push('avt_test_case='+test_case);

            url.search = search.filter(s=>s).join('&');

            testing_entry_point = url.toString();
        }
    }
    catch(e) {
        
    }

    return <> 
        <table class="avt-event-list test-meta-data">
            <tbody>
                <tr>
                    <td>
                        <input 
                            type="text" 
                            name="entry_point" 
                            placeholder="Entry Point URL"
                            value={entry_point}
                            onInput={e=>setMetaData(e.currentTarget.name, e.currentTarget.value)}/>
                    </td>
                    <td>
                        <input 
                            type="number" 
                            name="event_delay" 
                            placeholder="Event Delay"
                            value={event_delay}
                            onInput={e=>setMetaData(e.currentTarget.name, e.currentTarget.value)}
                            title="Delay between events. Every event will wait this amount of milliseconds. Useful to understand what's happening on screen."/>
                    </td>
                    <td title="Element pointer type">
                        <label>
                            <input 
                                type="radio" 
                                name="pointer" 
                                value="xpath" 
                                checked={pointer=='xpath'}
                                onChange={e=>e.currentTarget.checked ? setMetaData(e.currentTarget.name, e.currentTarget.value) : 0}/>
                            Xpath
                        </label>
                        &nbsp;&nbsp;
                        <label>
                            <input 
                                type="radio" 
                                name="pointer" 
                                value="selector" 
                                checked={pointer=='selector'}
                                onChange={e=>e.currentTarget.checked ? setMetaData(e.currentTarget.name, e.currentTarget.value) : 0}/>
                            Selector
                        </label>
                    </td>
                </tr>
                <tr>
                    <td colSpan={3}>
                        <small>The URL you'd like to start automated testing from. <i>Target URL must be under <b>{window.avt_object.home_url}</b></i></small>
                        {
                            !testing_entry_point ? null :
                            <p>
                                Save the changes and access testing URL from certain browser/tab according to your test case.<br/>
                                <a href={testing_entry_point} target="blank" onClick={e=>(e.preventDefault(), copyText(testing_entry_point))}>
                                    {testing_entry_point}
                                </a>
                            </p>
                        }
                    </td>
                </tr>
            </tbody>
        </table>
        <br/>
        <div>
            <a href="javascript:;" onClick={e=>onChange(null, 'is_collapsed', true)}>Collapse</a>
            &nbsp; / &nbsp;
            <a href="javascript:;" onClick={e=>onChange(null, 'is_collapsed', false)}>Expand</a> All
        </div>
        <br/>
        <table class="avt-event-list">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Action</th>
                    <th>{pointer=='xpath' ? 'Xpath' : 'CSS Selector'}</th>
                    <th>Value</th>
                    <th>Comment</th>
                    <th title="Skip if target element not found">Skippable</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {
                    blueprint.map((event, index)=> {
                        
                        let {key, action, xpath, value, comment, skippable, sequence_title} = event || {};
                        let {tooltip=''} = actions[action];
                        let is_redirect = action=='redirect' || (action=='reuse' && (blueprint[parseInt(value) || -1] || {}).action=='redirect');
                        let testing_offset = testing_entry_point+'&avt_test_offset='+index;
                        const id_to_action = 'id_to_action_'+index;

                        let is_collapsed = false;
                        let section_index = null;
                        let section_index_last = null;

                        for(let i=index; i>=0; i--) {
                            if(blueprint[i].sequence_title) {
                                is_collapsed = blueprint[i].is_collapsed;
                                section_index = i;
                                section_index_last = i;
                                break;
                            }
                        }

                        // Get the section index
                        if(index==section_index) {
                            for(let i=index+1; true; i++) {
                                if(!blueprint[i] || blueprint[i].sequence_title) {
                                    break;
                                }
                                section_index_last=i;
                            }
                        }

                        return (!action || !actions[action]) ? null : <> 
                            {
                                (is_collapsed && index!==section_index) ? null :
                                <tr key={'t_'+key} class={sequence_title ? 'has_line' : ''}>
                                    <td colSpan={7}>
                                        <div className="separator">
                                            <span>
                                                {
                                                    !sequence_title ? null :
                                                    <span 
                                                        className={"dashicons dashicons-"+(!is_collapsed ? 'remove' : 'plus-alt')} 
                                                        onClick={e=>onChange(key, 'is_collapsed', !is_collapsed)}
                                                        title={(is_collapsed ? 'Expand' : 'Collapse')+' Section'}></span>
                                                }
                                                <span onClick={e=>onChange(key, 'sequence_title', getSectionTitle(sequence_title))}>
                                                    {sequence_title || 'Add Sequence Title'}  {sequence_title ? '('+section_index+'-'+section_index_last+')' : ''}
                                                </span>
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            }
                            {
                                is_collapsed ? null : 
                                <tr key={key} id={id_to_action}>
                                    <td>
                                        {
                                            !is_redirect ? index+'.' :
                                            <a   
                                                href={testing_offset} 
                                                onClick={e=>(e.preventDefault(), copyText(testing_offset))} 
                                                title="Start testing from here. Make sure the session supports testing from here.">
                                                    <b>{index}.</b>
                                            </a>
                                        }
                                    </td>
                                    <td>
                                        <select 
                                            name="action" 
                                            title={action+(tooltip ? ': '+tooltip : '')} 
                                            defaultValue={action} 
                                            onChange={e=>onChange(key, e.currentTarget.name, e.currentTarget.value)}>
                                            {
                                                Object.keys(actions).sort().map(action=>{
                                                    return <option value={action} key={action}>
                                                        {actions[action].title}
                                                    </option>
                                                })
                                            }
                                        </select>
                                    </td>
                                    <td>
                                        {
                                            !actions[action].xpath ? null : 
                                            <input 
                                                type="text" 
                                                value={xpath} 
                                                name="xpath" 
                                                title={xpath}
                                                onInput={e=>onChange(key, e.currentTarget.name, e.currentTarget.value)} 
                                                placeholder={pointer=='xpath' ? 'Xpath' : 'Selector'}/>
                                        }
                                    </td>
                                    <td>
                                        {
                                            !actions[action].value ? null :
                                            <input 
                                                type={actions[action].type || 'text'} 
                                                value={value} 
                                                name="value" 
                                                title={value}
                                                onInput={e=>onChange(key, e.currentTarget.name, e.currentTarget.value)} 
                                                placeholder={actions[action].placeholder}
                                                onDoubleClick={e=>action=='reuse' ? scrollToAction(e.currentTarget, blueprint, onChange) : 0}/>
                                        }
                                    </td>
                                    <td>
                                        <input 
                                            type="text" 
                                            value={comment} 
                                            name="comment" 
                                            title={comment}
                                            onInput={e=>onChange(key, e.currentTarget.name, e.currentTarget.value)}/>
                                    </td>
                                    <td>
                                        {
                                            !actions[action].xpath ? null :
                                            <input 
                                                type="checkbox" 
                                                title="Skip if target element not found" 
                                                name="skippable"
                                                defaultChecked={skippable}
                                                onChange={e=>onChange(key, e.currentTarget.name, e.currentTarget.checked)}/>
                                        }
                                    </td>
                                    <td>
                                        {
                                            blueprint.length<=1 ? null :
                                            <span 
                                                class="dashicons dashicons-trash" 
                                                title="Delete this action" 
                                                onClick={()=>deleteAction(index)}></span>
                                        }

                                        <span 
                                            class="dashicons dashicons-database-add" 
                                            title="Add action before" 
                                            onClick={()=>addNewAction(index, 'before')}></span>

                                        <span 
                                            class="dashicons dashicons-database-add avt-flip-vertical" 
                                            title="Add action after" 
                                            onClick={()=>addNewAction(index+1, 'after')}></span>
                                    </td>
                                </tr>
                            }
                        </>
                    })
                }
            </tbody>
        </table>
    </>
}

export {BlueprintEditor}