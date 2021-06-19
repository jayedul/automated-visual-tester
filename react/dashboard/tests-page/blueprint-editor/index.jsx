import React from 'react';

import './style.scss';

const actions = {
    click: {title: 'Click', xpath: true, value:false},
    mouseover: {title: 'Mouseover', xpath: true, value:false},
    mousedown: {title: 'Mousedown', xpath: true, value:false},
    delay: {title: 'Delay', xpath:false, value:true, placeholder:'Millisecond'}
}

const BlueprintEditor=props=>
{
    let {blueprint, entry_point, test_case, setEntryPoint, addNewAction, deleteAction, onChange} = props;

    let testing_entry_point; 
    let entry_url = entry_point || window.avt_object.home_url;

    try {
        let url = new URL(entry_url);

        let search = url.search || '';
        search.indexOf('?')===0 ? search=search.slice(1) : 0;

        search = search.split('&');
        search.push('avt_test_case='+test_case);

        search = search.filter(s=>s).join('&') + '&avt_test_index=';

        url.search = search;

        testing_entry_point = url.toString();
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
                    <td colSpan={4}>
                        <input 
                            type="text" 
                            name="entry_url" 
                            placeholder="Entry Point URL"
                            value={entry_url}
                            onInput={e=>setEntryPoint(e.currentTarget.value)}/>
                        <small>The URL you'd like to start automated testing from. <i>Target URL must be under <b>{window.avt_object.home_url}</b></i></small>
                        
                        {
                            !testing_entry_point ? null :
                            <p>
                                Save the changes and access testing URL from certain browser/tab according to your test case.<br/>
                                <i>Please don't run multi instance of test. It causes problem in testing across navigated pages.</i><br/>
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
                                <select name="action" onChange={e=>onChange(key, e.currentTarget.name, e.currentTarget.value)}>
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
                                        onInput={e=>onChange(key, e.currentTarget.name, e.currentTarget.value)} 
                                        placeholder="Xpath"/>
                                }
                            </td>
                            <td>
                                {
                                    !actions[action].value ? null :
                                    <input 
                                        type="text" 
                                        value={value} 
                                        name="value" 
                                        onInput={e=>onChange(key, e.currentTarget.name, e.currentTarget.value)} 
                                        placeholder={actions[action].placeholder}/>
                                }
                            </td>
                            <td>
                                <input 
                                    type="text" 
                                    value={comment} 
                                    name="comment" 
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