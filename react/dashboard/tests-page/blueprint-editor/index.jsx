import React from 'react';

const actions = {
    click: {title: 'Click', xpath: true, value:false},
    mouseover: {title: 'Mouseover', xpath: true, value:false},
    mousedown: {title: 'Mousedown', xpath: true, value:false},
    delay: {title: 'Delay', xpath:false, value:true, placeholder:'Millisecond'}
}

const BlueprintEditor=props=>
{
    let {blueprint, addNewAction, onChange} = props;

    return <table>
        <thead>
            <tr>
                <th>Action</th>
                <th>Xpath</th>
                <th>Value</th>
            </tr>
        </thead>
        <tbody>
            {
                blueprint.map(event=> {
                    
                    let {key, action, xpath, value} = event;

                    return <tr key={key}>
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
                                !actions[action].xpath ? 'N\\A' : 
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
                                !actions[action].value ? 'N\\a' :
                                <input 
                                    type="text" 
                                    value={value} 
                                    name="value" 
                                    onInput={e=>onChange(key, e.currentTarget.name, e.currentTarget.value)} 
                                    placeholder={actions[action].placeholder}/>
                            }
                        </td>
                    </tr>
                })
            }
            <tr>
                <td colspan="3" style={{textAlign: 'center'}}>
                    <span onClick={addNewAction}>+ Add New</span>
                </td>
            </tr>
        </tbody>
    </table>
}

export {BlueprintEditor}