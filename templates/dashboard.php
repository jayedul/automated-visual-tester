<div class="wrap" id="avt_dashboard_container"></div>
<div class="wrap">
    <b><?php _e( 'Instructions', 'automated-visual-tester' ); ?>:</b>
    <ul style="list-style-type: disc; list-style-position: outside; padding-left: 16px;">
        <li>
            <?php _e( 'Please make sure the Xpath you input here always points to the correct element.' , 'automated-visual-tester' ); ?>
        </li>
        <li>
            <?php _e( 'The testing initiator URL you\'d get is meant to be copied and accessed from certain browser/tab/user-state based on your test case.' , 'automated-visual-tester' ); ?>
        </li>
        <li>
            <?php _e( 'Please don\'t access other URL in the same browser session during testing.' , 'automated-visual-tester' ); ?>
            <?php _e( 'It is forbidden in favour of testing across navigated pages using browser session identifier cookie.' , 'automated-visual-tester' ); ?>
        </li>
        <li>
            <?php _e( 'Don\'t forget to add the \'Page Leave\' event after the one the page would reload or redirect to new page.', 'automated-visual-tester' ); ?>
            <?php _e( 'So the tester can detect new page and run remaining test on that.' , 'automated-visual-tester' ); ?>
        </li>
        <li>
            <?php echo sprintf( __( 'Redirect event is meant to be used only for the URLs under %s.', 'automated-visual-tester' ), get_home_url() ); ?>
            <?php _e( 'So the tester will be able to resume on the redirected page too.' , 'automated-visual-tester' ); ?>
        </li>
        <li>
            <?php _e( 'You can see the testing log in browser console panel. And it is recommended in fact.' , 'automated-visual-tester' ); ?>
        </li>
        <li>
            <a href="https://github.com/jayedul/automated-visual-tester" target="_blank" target="_blank" rel="nofollow noopener"><?php _e('Read developer documentation on GitHub.', 'automated-visual-tester'); ?></a>
        </li>
    </ul>
</div>