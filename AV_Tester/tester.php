<?php
namespace AV_Tester;

if ( ! defined( 'ABSPATH' ) )
exit;

class Tester extends Init{

    private $option_key = 'avt_test_blueprints';
    private static $cookie = [];

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
                wp_send_json_success( array(
                    'blueprint' => $tests[$_POST['test_key']]
                ) );
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

        $base_path = $this->get_data()['base_path'];
        
        self::$cookie['avt_testing'] = 1;
        self::$cookie['avt_test_key'] = $_GET['avt_test_case'];
        self::$cookie['avt_test_index'] = $_GET['avt_test_index'];

        foreach(self::$cookie as $key => $value) {
            setcookie($key, $value, 0, $base_path);
        }
    }
    
    public function load_tester_scripts() {
        
        $data = count(self::$cookie) ? self::$cookie : $_COOKIE;

        if(!isset( $data['avt_testing'] ) || !$data['avt_testing']) {
            // Tester not initiated
            return;
        }

        wp_enqueue_script( 'avt-tester-js', AVT_URL_BASE . 'assets/tester.js', array(), null, true );
    }

    public function add_test_key_to_data($data) {
        $c_data = count(self::$cookie) ? self::$cookie : $_COOKIE;
        if(isset( $c_data['avt_testing'] ) && $c_data['avt_testing'] ) {
            $data['avt_test_key'] = $c_data['avt_test_key'];
            $data['avt_test_index'] = $c_data['avt_test_index'];
        }
        return $data;
    }
}