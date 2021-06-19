import React from 'react';

const TestSelection=props=> {

    let {tests={}, onChange, deleteTest, current_one} = props;
    let keys = Object.keys(tests);

    return !keys.length ? null : 
    <>
        <span 
            class="dashicons dashicons-trash" 
            title="Delete this test" 
            onClick={deleteTest} 
            style={{verticalAlign: 'middle'}}></span>&nbsp;
            
        <select name="avt-test-selection" onChange={e=>onChange(e.target.value)} value={current_one}>
            {
                keys.map(key=> {
                    let {title} = tests[key];
                    return <option key={key} value={key}>
                        {title}
                    </option>
                })
            }
        </select>
    </>
}

export {TestSelection}