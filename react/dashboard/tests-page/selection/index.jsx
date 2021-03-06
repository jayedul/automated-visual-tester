import React from 'react';

/**
 * @return component
 * 
 * Render test selection dropdown
 * 
 * @since v1.0.0
 */
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
    let verticalAlign = {verticalAlign: 'middle'};

    return <>
        <span 
            class="dashicons dashicons-upload" 
            title="Import Tests" 
            onClick={importTest} 
            style={verticalAlign}></span>

        {
            !keys.length ? null : 
            <>
                <span 
                    class="dashicons dashicons-download" 
                    title="Export Tests" 
                    onClick={exportTest} 
                    style={verticalAlign}></span>
                    
                <span 
                    class="dashicons dashicons-edit" 
                    title="ReName" 
                    onClick={renameTest} 
                    style={verticalAlign}></span>

                <span 
                    class="dashicons dashicons-trash" 
                    title="Delete this test" 
                    onClick={deleteTest} 
                    style={verticalAlign}></span>

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
    </>
}

export {TestSelection}