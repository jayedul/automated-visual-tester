<?php
namespace AV_Tester;

if ( ! defined( 'ABSPATH' ) )
exit;

class Dashboard {

    private $page_slug = 'av-tester';

    public function __construct() {
        add_action('admin_menu', array($this, 'register_menu'));
        add_action('admin_enqueue_scripts', array($this, 'load_dashboard_scripts'));

        add_action('admin_enqueue_scripts', array($this, 'load_tester_scripts'));
        add_action('wp_enqueue_scripts', array($this, 'load_tester_scripts'));
    }

    public function register_menu() {
        add_menu_page(__('AV Tester', $this->page_slug), __('AV Tester', 'tutor'), 'manage_options', $this->page_slug, array($this, 'tests_dashboard_content'));
    }

    public function tests_dashboard_content() {
        echo '<div class="wrap" id="avt_dashboard_container"></div>';
    }
    
    public function load_dashboard_scripts() {
        if( !isset($_GET['page']) || $_GET['page']!=$this->page_slug ) {
            return;
        }

        wp_enqueue_script( 'avt-dashboard-js', AVT_URL_BASE . '/assets/dashboard.js', array(), null, true );
        
        wp_localize_script( 'avt-dashboard-js', 'avt_object', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'loading_icon_url' => get_admin_url() . 'images/loading.gif'
        ) );
    }
    
    public function load_tester_scripts() {
        if(!isset( $_COOKIE['av_testing'] )) {
            // Don't enqueue tester if cookie identifier not set
            // return;
        }

        // wp_enqueue_script( 'av-testing-initiator-js', AVT_URL_BASE . '/assets/tester.js', array(), null, true );
    }
}