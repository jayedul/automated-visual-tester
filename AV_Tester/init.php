<?php
    namespace AV_Tester;

    class Init {
        public function __construct() {
            add_action( 'init', array( $this, 'load_textdomain' ));
        }
        
        public function start() {
            new Dashboard;
        }

        public function load_textdomain() {
            load_plugin_textdomain( 'av-tester', false, AVT_FILE . '/languages' );
        }
    }
?>