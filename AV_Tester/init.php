<?php
    namespace AV_Tester;

    class Init {
        public function __construct() {
            add_action( 'init', array( $this, 'load_textdomain' ));
            add_action( 'admin_enqueue_scripts', array( $this, 'load_data' ) );
        }
        
        public function start() {
            new Dashboard;
        }

        public function load_textdomain() {
            load_plugin_textdomain( 'av-tester', false, AVT_FILE . '/languages' );
        }

        public function load_data() {
            wp_localize_script( 'avt-data', 'avt_object', array(
                'ajaxurl' => admin_url('admin-ajax.php')
            ) );
        }
    }
?>