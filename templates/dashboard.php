<div class="wrap" id="avt_dashboard_container"></div>
<div class="wrap">
    <b>Instruction:</b>
    <ul style="list-style-type: disc; list-style-position: outside; padding-left: 16px;">
        <li>
            Please make sure the Xpath you input here always points to correct element.
        </li>
        <li>
            The testing initiator URL you'd get is meant to be copied and accessed from certain browser/tab/user-state according to your test case.
        </li>
        <li>
            Please don't run multi instance of test in a single browser session. It causes problem in testing across navigated pages.
        </li>
        <li>
            All the events is set to be triggered by native jQuery. 
            So the visual tester might not work as expectation in some cases such as native browser events like DND or react.js
        </li>
        <li>
            By default AVT waits for only jQuery ajax requests completion that immediately starts on JS events like <code>click</code>.<br/>
            If you use other request package than jQuery, 
            then just increment/decrement <code>window.avt_ajax_counter</code> global variable on request start/complete.
        </li>
        <li>
            You can see the testing log in browser console panel.
        </li>
    </ul>
</div>