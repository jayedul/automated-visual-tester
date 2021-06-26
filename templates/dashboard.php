<div class="wrap" id="avt_dashboard_container"></div>
<div class="wrap">
    <b><?php _e( 'Instruction', 'av-tester' ); ?>:</b>
    <ul style="list-style-type: disc; list-style-position: outside; padding-left: 16px;">
        <li>
            <?php _e( 'Please make sure the Xpath you input here always points to correct element.' , 'av-tester' ); ?>
        </li>
        <li>
            <?php _e( 'The testing initiator URL you\'d get is meant to be copied and accessed from certain browser/tab/user-state according to your test case.' , 'av-tester' ); ?>
        </li>
        <li>
            <?php _e( 'Please don\'t run multiple tests at the same time or multi instance of a test in a single browser session. ' , 'av-tester' ); ?>
            <?php _e( 'Both causes problem in testing across navigated pages.' , 'av-tester' ); ?>
        </li>
        <li>
            <?php _e( 'Don\'t forget to add the \'Page Leave\' event after the one the page would reload or redirect to new page.' , 'av-tester' ); ?>
            <?php _e( 'So the tester can run further test on the new page.' , 'av-tester' ); ?>
        </li>
        <li>
            <?php echo sprintf( __( 'Redirect event is meant to use only and only for the URLs that are under %s.', 'av-tester' ), get_home_url() ); ?>
            <?php _e( 'So the tester will be able to resume on the redirected page too.' , 'av-tester' ); ?>
        </li>
        <li>
            <?php _e( 'All the events is set to be triggered by native jQuery. ' , 'av-tester' ); ?>
            <?php _e( 'So the visual tester might not work as expectation in some cases such as native browser events like Drag & Drop.' , 'av-tester' ); ?>
        </li>
        <li>
            <?php _e( 'By default AVT waits for only jQuery ajax requests completion that immediately starts on JS events like \'click\'.' , 'av-tester' ); ?>.<br/>
            <?php _e( 'If you use other request package than jQuery, then just increment/decrement <code>window.avt_ajax_counter</code> global variable on request start/complete.' , 'av-tester' ); ?>
        </li>
        <li>
            <?php _e( 'You can see the testing log in browser console panel.' , 'av-tester' ); ?>
        </li>
    </ul>
</div>