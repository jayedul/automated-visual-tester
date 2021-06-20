<?php
namespace AV_Tester;

if ( ! defined( 'ABSPATH' ) )
exit;

class Tester {

    private $option_key = 'avt_test_blueprints';

    function __construct() {
        add_action( 'wp_ajax_avt_get_tests', array($this, 'avt_get_tests') );
        add_action( 'wp_ajax_avt_save_tests', array($this, 'avt_save_tests') );

        add_action( 'wp_ajax_avt_get_blueprint', array($this, 'avt_get_tests') );
        add_action( 'wp_ajax_nopriv_avt_get_blueprint', array($this, 'avt_get_tests') );

        add_action('init', array($this, 'init_tester'));
        add_action('admin_enqueue_scripts', array($this, 'load_tester_scripts'));
        add_action('wp_enqueue_scripts', array($this, 'load_tester_scripts'));

        add_filter( 'avt_object_array', array($this, 'add_test_key_to_data') );
    }

    public function avt_get_tests() {
        
        $tests = get_option( $this->option_key, array() );
        !is_array( $tests ) ? $tests = array() : 0;

        if( isset( $_POST['test_key'] ) ) {
            if(is_string( $_POST['test_key'] ) && isset( $tests[$_POST['test_key']] )) {
                wp_send_json_success( array('blueprint' => $tests[$_POST['test_key']] ) );
            }
            wp_send_json_error('Not found');
        }
        
        wp_send_json_success( array( 'tests' => (object)$tests ) );
    }

    public function avt_save_tests() {
        $data = isset( $_POST['blueprints'] ) ? $_POST['blueprints'] : '';
        $data = @json_decode( stripslashes( $data ), true );

        if(!is_array( $data )) {
            wp_send_json_error( 'Invalid Blueprints Array' );
            return;
        }

        update_option( $this->option_key, $data );
        wp_send_json_success();
    }

    public function init_tester() {
        if(!isset( $_GET['avt_test_case'], $_GET['avt_test_index'] )) {
            // Other page
            return;
        }

        $_SESSION['avt_testing'] = true;
        $_SESSION['test_key'] = $_GET['avt_test_case'];
        $_SESSION['test_index'] = $_GET['avt_test_index'];
    }
    
    public function load_tester_scripts() {
        if(!isset( $_SESSION['avt_testing'] ) || !$_SESSION['avt_testing']) {
            // Tester not initiated
            return;
        }

        wp_enqueue_script( 'avt-tester-js', AVT_URL_BASE . 'assets/tester.js', array(), null, true );
    }

    public function add_test_key_to_data($data) {
        if(isset( $_SESSION['avt_testing'] ) && $_SESSION['avt_testing'] ) {
            $data['test_key'] = $_SESSION['test_key'];
            $data['test_index'] = $_SESSION['test_index'];
        }
        return $data;
    }
}