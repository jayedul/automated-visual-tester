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
            Please don't run multiple tests at the same time or multi instance of a test in a single browser session. 
            Both causes problem in testing across navigated pages.
        </li>
        <li>
            Don't forget to add the <i>Page Leave</i> event after the one the page would reload or redirect to new page. 
            So the tester can run further test on the new page.
        </li>
        <li>
            Redirect event is meant to use only and only for the URLs that are under <i><?php echo get_home_url(); ?></i>. 
            So the tester will be able to resume on the redirected page too.
        </li>
        <li>
            All the events is set to be triggered by native jQuery. 
            So the visual tester might not work as expectation in some cases such as native browser events like DND or react.js
        </li>
        <li>
            By default AVT waits for only jQuery ajax requests completion that immediately starts on JS events like <i>click</i>.<br/>
            If you use other request package than jQuery, 
            then just increment/decrement <code>window.avt_ajax_counter</code> global variable on request start/complete.
        </li>
        <li>
            You can see the testing log in browser console panel.
        </li>
    </ul>
</div>