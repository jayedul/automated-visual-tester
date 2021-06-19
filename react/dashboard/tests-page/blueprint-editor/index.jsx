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
    let {blueprint, addNewAction, deleteAction, onChange} = props;

    return <table id="avt-event-list">
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
                            <span>Test From Here</span>
                        </td>
                    </tr>
                })
            }
        </tbody>
    </table>
}

export {BlueprintEditor}