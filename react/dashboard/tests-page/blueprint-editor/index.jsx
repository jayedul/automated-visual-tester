import React from 'react';
import './style.scss';

/**
 * Define the supported event list as object
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
    uncheck: {title: 'UnCheck', xpath: true, value: false},
    select: {title: 'Select Dropdown', xpath: true, value: true, placeholder:'Value to select'},
    
    delay: {title: 'Delay', xpath:false, value:true, type: 'number', placeholder:'Millisecond'},
    page_leave: {title: 'Page Leave', xpath:false, value:false},
    redirect: {title: 'Redirect', value:true, placeholder: 'URL'},
    reuse: {title: 'Reause Sequence', xpath:false, value:true, placeholder:'e.g. 5-12'}
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
                                <a href={testing_entry_point} target="blank" onClick={e=>e.preventDefault()}>
                                    {testing_entry_point}
                                </a>
                            </p>
                        }
                    </td>
                </tr>
            </tbody>
        </table>
        <br/>
        <table class="avt-event-list">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Action</th>
                    <th>Xpath/Selector</th>
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
                        let id = index+1;
                        let is_redirect = action=='redirect' || (action=='reuse' && (blueprint[(parseInt(value) || 0)-1] || {}).action=='redirect');

                        return (!action || !actions[action]) ? null : <> 
                        <tr class={sequence_title ? 'has_line' : ''}>
                            <td colSpan={7}>
                                <div className="separator" onClick={e=>onChange(key, 'sequence_title', (window.prompt('Sequence Title', (sequence_title || '')) || '').trim())}>
                                    {sequence_title || 'Add Sequence Title'}
                                </div>
                            </td>
                        </tr>
                        <tr key={key}>
                            <td>
                                {
                                    !is_redirect ? id+'.' :
                                    <a   
                                        href={testing_entry_point+'&avt_test_offset='+id} 
                                        onClick={e=>e.preventDefault()} title="Start testing from here. Make sure the session supports testing from here.">
                                            <b>{id}.</b>
                                    </a>
                                }
                            </td>
                            <td>
                                <select 
                                    name="action" 
                                    title={action} 
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
                                        placeholder={actions[action].placeholder}/>
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
                                    class="dashicons dashicons-arrow-up-alt" 
                                    title="Add action before" 
                                    onClick={()=>addNewAction(index, 'before')}></span>

                                <span 
                                    class="dashicons dashicons-arrow-down-alt" 
                                    title="Add action after" 
                                    onClick={()=>addNewAction(index+1, 'after')}></span>
                            </td>
                        </tr>
                        </>
                    })
                }
            </tbody>
        </table>
    </>
}

export {BlueprintEditor}