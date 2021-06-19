<?php

namespace AV_Tester;

if ( ! defined( 'ABSPATH' ) )
exit;

class Init {
    public function __construct() {
        add_action( 'init', array( $this, 'load_textdomain' ));
    }
    
    public function start() {
        new Dashboard;
        new Tester;
    }

    public function load_textdomain() {
        load_plugin_textdomain( 'av-tester', false, AVT_FILE . '/languages' );
    }
}