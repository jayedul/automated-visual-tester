<?php
    namespace AV_Tester;

    class Dashboard {
        public function __construct() {
            add_action('admin_menu', array($this, 'register_menu'));

            add_action('admin_enqueue_scripts', array($this, 'load_dashboard_scripts'));

            add_action('admin_enqueue_scripts', array($this, 'load_tester_scripts'));
            add_action('wp_enqueue_scripts', array($this, 'load_tester_scripts'));
        }

        public function register_menu() {
            add_menu_page(__('AV Tester', 'av-tester'), __('AV Tester', 'tutor'), 'manage_options', 'av-tester', array($this, 'tests_dashboard_content'));
		}

        public function tests_dashboard_content() {
            echo '<div id="avt_dashboard_container"></div>';
        }
        
        public function load_dashboard_scripts() {
            if( !isset($_GET['page']) || $_GET['page']!='av-tester' ) {
                // Don't load dashboard script if page is not av-tester
                return;
            }

            wp_enqueue_script( 'avt-dashboard-page', AVT_URL_BASE . '/assets/dashboard.js', array(), null, true );
        }
        
        public function load_tester_scripts() {
            if(!isset( $_COOKIE['av_testing'] )) {
                // Don't enqueue tester if cookie identifier not set
                // return;
            }

            // wp_enqueue_script( 'av-tester-js', AVT_URL_BASE . '/assets/tester.js', array(), null, true );
        }
    }
?>