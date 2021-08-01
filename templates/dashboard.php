<?php $home_url = get_home_url(); ?>
<div class="wrap" id="avt_dashboard_container"></div>
<div class="wrap">
    <br/>
    <p>You could watch a demo on YouTube. <a href="https://youtu.be/7K08WaNP5Vw" target="_blank">https://youtu.be/7K08WaNP5Vw</a></p>
    <br/>
    <b><?php _e( 'Instructions', 'automated-visual-tester' ); ?>:</b>
    <ul>
        <li>
            <?php _e( 'Please make sure the Xpath/Selector you input here always points to the correct element.', 'automated-visual-tester' ); ?>
        </li>
        <li>
            <?php _e( 'Only Google Chrome browser is recommended to copy xpath or selector. Other browsers aren\'t efficient for this.', 'automated-visual-tester' ); ?>
        </li>
        <li>
            <?php _e( 'Nested reusable sequence is not supported currently.', 'automated-visual-tester' ); ?>
        </li>
        <li>
            <?php _e( 'To trigger events on multiple elements, please use css selector instead of xpath.', 'automated-visual-tester' ); ?>
        </li>
        <li>
            <?php _e( 'The testing initiator URL you\'d get is meant to be copied and accessed from a certain browser/tab/user-state based on your test case.', 'automated-visual-tester' ); ?>
        </li>
        <li>
            <?php _e( 'Please don\'t access other URLs in the same browser session during testing.', 'automated-visual-tester' ); ?>
            <?php _e( 'It is forbidden in favour of testing across navigated pages using browser session identifier cookie.', 'automated-visual-tester' ); ?>
        </li>
        <li>
            <?php _e( 'Don\'t forget to add the \'Page Leave\' event after the one the page would reload or redirect to a new page.', 'automated-visual-tester' ); ?>
            <?php _e( 'So the tester can detect the new page and run the remaining test on that.', 'automated-visual-tester' ); ?>
            <?php _e( 'Not necessary after the redirect event. Only after uncontrolled redirection made by anything else like browser/user.', 'automated-visual-tester'); ?>
        </li>
        <li>
            <?php echo sprintf( __( 'Redirect event is meant to be used only for the URLs under %s.', 'automated-visual-tester' ), '<a href="'.$home_url.'" target="_blank">'.$home_url.'</a>' ); ?>
            <?php _e( 'So the tester will be able to resume on the redirected page too.', 'automated-visual-tester' ); ?>
        </li>
        <li>
            <?php _e( 'Here you can get the testing URL at specific indexes only in case of the redirect event since it acts almost similar to the entry point URL.', 'automated-visual-tester' ); ?>
            <?php _e( 'Make sure testing from specific offset will have appropriate environment, for example logged in user or other factors.', 'automated-visual-tester' ); ?>
        </li>
        <li>
            <?php _e('Running tests in the private or incognito tab is prohibited since some features might not work there.', 'automated-visual-tester' ); ?>
        </li>
        <li>
            <?php _e('Minimum delay 500 millisecond recommended.', 'automated-visual-tester' ); ?>
        </li>
        <li>
            <?php _e( 'You can use some relative path for redirection', 'automated-visual-tester' ); ?>
            <ul>
                <li>
                    <code>/path/</code> = <code><?php echo $home_url ?>/path/</code>
                </li>
                <li>
                    <code>path/</code> = <code><?php echo $home_url ?>/current_path/path/</code>
                </li>
                <li>
                    <code>http(s)://absolute_url</code> = <code>http(s)://absolute_url</code>
                </li>
            </ul>
        </li>
        <li>
            <?php _e( 'You can see the testing log in the browser console panel. And it is recommended in fact.', 'automated-visual-tester' ); ?>
        </li>
        <li>
            <a href="https://github.com/jayedul/automated-visual-tester" target="_blank" target="_blank" rel="nofollow noopener"><?php _e('Read developer documentation on GitHub.', 'automated-visual-tester'); ?></a>
        </li>
    </ul>
</div>