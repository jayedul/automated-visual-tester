import React from 'react';

import './style.scss';

const actions = {
    click: {title: 'Click', xpath: true, value:false},
    input: {title: 'Text Input', xpath: true, value: true},
    mouseover: {title: 'Mouseover', xpath: true, value:false},
    mousedown: {title: 'Mousedown', xpath: true, value:false},
    delay: {title: 'Delay', xpath:false, value:true, type: 'number', placeholder:'Millisecond'}
}

const BlueprintEditor=props=>
{
    let {
            blueprint, 
            entry_point, 
            event_delay,
            test_case, 
            setMetaData, 
            addNewAction, 
            deleteAction, 
            onChange
        } = props;

    let testing_entry_point; 

    try {
        if(entry_point.indexOf(window.avt_object.home_url)===0) {

            let url = new URL(entry_point);

            let search = url.search || '';
            search.indexOf('?')===0 ? search=search.slice(1) : 0;

            search = search.split('&');
            search.push('avt_test_case='+test_case);

            search = search.filter(s=>s).join('&') + '&avt_test_index=';

            url.search = search;

            testing_entry_point = url.toString();
        }
    }
    catch(e) {
        
    }

    return <> 
        <table class="avt-event-list">
            <tbody>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td colSpan={3}>
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
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td colSpan={4}>
                        <small>The URL you'd like to start automated testing from. <i>Target URL must be under <b>{window.avt_object.home_url}</b></i></small>
                        {
                            !testing_entry_point ? null :
                            <p>
                                Save the changes and access testing URL from certain browser/tab according to your test case.<br/>
                                <a href={testing_entry_point+'0'} target="blank">
                                    {testing_entry_point+'0'}
                                </a>
                            </p>
                        }
                    </td>
                    <td></td>
                </tr>
            </tbody>
        </table>
        <br/>
        <table class="avt-event-list">
            <thead>
                <tr>
                    <th></th>
                    <th>Action</th>
                    <th>Xpath</th>
                    <th>Value</th>
                    <th>Comment</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {
                    blueprint.map((event, index)=> {
                        
                        let {key, action, xpath, value, comment} = event;

                        return <tr key={key}>
                            <td>
                                <span class="dashicons dashicons-trash" title="Delete this action" onClick={()=>deleteAction(index)}></span>
                                <span class="dashicons dashicons-arrow-up-alt" title="Add action before" onClick={()=>addNewAction(index)}></span>
                                <span class="dashicons dashicons-arrow-down-alt" title="Add action after" onClick={()=>addNewAction(index+1)}></span>
                            </td>
                            <td>
                                <select 
                                    name="action" 
                                    title={action} 
                                    defaultValue={action} 
                                    onChange={e=>onChange(key, e.currentTarget.name, e.currentTarget.value)}>
                                    {
                                        Object.keys(actions).map(action=>{
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
                                        placeholder="Xpath"/>
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
                                    !testing_entry_point ? null :
                                    <a href={testing_entry_point+''+index} target="blank">
                                        Test Here
                                    </a>
                                }
                            </td>
                        </tr>
                    })
                }
            </tbody>
        </table>
    </>
}

export {BlueprintEditor}