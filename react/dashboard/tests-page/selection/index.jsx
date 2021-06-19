import React from 'react';

const TestSelection=props=> {

    let {tests={}, onChange, current_one} = props;
    let keys = Object.keys(tests);

    return !keys.length ? null : <select name="avt-test-selection" onChange={e=>onChange(e.target.value)} defaultValue={current_one}>
        {
            keys.map(key=> {
                let {title} = tests[key];
                return <option key={key} value={key}>
                    {title}
                </option>
            })
        }
    </select>
}

export {TestSelection}