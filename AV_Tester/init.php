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

        add_action('admin_enqueue_scripts', array($this, 'load_data'));
        add_action('wp_enqueue_scripts', array($this, 'load_data'));
    }

    public function load_textdomain() {
        load_plugin_textdomain( 'av-tester', false, AVT_FILE . '/languages' );
    }

    private function get_data() {
        return apply_filters( 'avt_object_array', array(
            'home_url' => get_home_url(),
            'ajaxurl' => admin_url('admin-ajax.php'),
            'loading_icon_url' => get_admin_url() . 'images/loading.gif'
        ) );
    }

    public function load_data() {
        $data = $this->get_data();
        wp_localize_script( 'avt-dashboard-js', 'avt_object', $data );
        wp_localize_script( 'avt-tester-js', 'avt_object', $data );
    }
}