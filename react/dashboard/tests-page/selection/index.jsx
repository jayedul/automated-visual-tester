import React from 'react';

const TestSelection=props=> {

    let {
            tests={}, 
            onChange, 
            deleteTest, 
            renameTest, 
            current_one,
            exportTest,
            importTest
        } = props;

    let keys = Object.keys(tests);

    return !keys.length ? null : 
    <>
        <span 
            class="dashicons dashicons-upload" 
            title="Export Tests" 
            onClick={importTest} 
            style={{verticalAlign: 'middle'}}></span>

        <span 
            class="dashicons dashicons-download" 
            title="Export Tests" 
            onClick={exportTest} 
            style={{verticalAlign: 'middle'}}></span>
            

        <span 
            class="dashicons dashicons-edit" 
            title="ReName" 
            onClick={renameTest} 
            style={{verticalAlign: 'middle'}}></span>

        <span 
            class="dashicons dashicons-trash" 
            title="Delete this test" 
            onClick={deleteTest} 
            style={{verticalAlign: 'middle'}}></span>

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