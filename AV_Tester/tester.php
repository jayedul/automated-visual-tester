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

        add_action( 'wp_head', array($this, 'load_ajax_counter') );
        add_action( 'admin_head', array($this, 'load_ajax_counter') );

        add_filter( 'avt_object_array', array($this, 'add_test_key_to_data') );
    }

    
    /**
     * @return void
     * 
     * Send test array to browser
     * 
     * @since v1.0.0
     */
    public function avt_get_tests() {
        
        $tests = get_option( $this->option_key, array() );
        !is_array( $tests ) ? $tests = array() : 0;

        $test_key = sanitize_text_field( isset( $_POST['test_key'] ) ? $_POST['test_key'] : '' );

        // Send specific test blueprint if key is provided
        if( $test_key ) {
            if( isset( $tests[$test_key] )) {
                wp_send_json_success( array(
                    'blueprint' => $tests[$test_key]
                ) );
            }
            wp_send_json_error( array('message' => __('Test Not found', 'automated-visual-tester') ) );
        }
        
        // Otherwise provide all tests as array
        wp_send_json_success( array( 'tests' => (object)$tests ) );
    }
    
    /**
     * @return array
     * 
     * Sanitize array key abd values recursively
     * 
     * @since v1.0.0
     */
    private function sanitize_recursive( $array ) {

        $new_array = array();

        foreach($array as $key => $value) {

            $key = is_numeric( $key ) ? $key : sanitize_text_field( $key );

            if(is_array( $value )) {
                $new_array[$key] = $this->sanitize_recursive( $value );
                continue;
            }

            // Leave numeric as it is
            $new_array[$key] = is_numeric( $value ) ? $value : sanitize_text_field( $value );
        }

        return $array;
    }

    /**
     * @return void
     * 
     * Save test case in database
     * 
     * @since v1.0.0
     */
    public function avt_save_tests() {

        // Check if user can manage options before saving test cases
        if(!current_user_can( 'manage_options' )) {
            wp_send_json_error( array('message' => __('Access Forbidden', 'automated-visual-tester') ) );
            return;
        }

        // Parse blueprint JSON string to array in error suppress mode
        $data = isset( $_POST['blueprints'] ) ? $_POST['blueprints'] : '';
        $data = @json_decode( stripslashes( $data ), true );

        // Now check if it is valid array
        if(!is_array( $data )) {
            wp_send_json_error( array('message' => __('Invalid Blueprints Array', 'automated-visual-tester') ) );
            return;
        } else {
            // Sanitize blueprint array recursively
            $data = $this->sanitize_recursive($data);
        }

        // Sanitize and validate test blueprint
        foreach($data as $test_key => $test_blueprint) {

            $test_title = !empty( $test_blueprint['title'] ) ? $test_blueprint['title'] : $test_key . ' - Untitled';
            $data[$test_key]['title'] = $test_title;

            // Check if all keys exists and no extra key
            if( !is_array( $test_blueprint['blueprint'] ) ) {
                wp_send_json_error( array( 'message' => sprintf( __('Invalid blueprint array in the test %s', 'automated-visual-tester'), $test_title ) ) );
                return;
            }

            // Validate entry point URL
            if(!filter_var( $test_blueprint['entry_point'], FILTER_VALIDATE_URL ) || !(strpos($test_blueprint['entry_point'], get_home_url())===0)) {
                wp_send_json_error( array( 'message' => sprintf( __('Invalid entry point URL in the test %s', 'automated-visual-tester'), $test_title ) ) );
                return;
            }

            // Check if event delay is numeric and at least 0
            if(!is_numeric($test_blueprint['event_delay']) || $test_blueprint['event_delay']<0) {
                wp_send_json_error( array( 'message' => sprintf( __('Invalid event delay in the test %s', 'automated-visual-tester'), $test_title ) ) );
                return;
            }
        }
        
        // Now save the test blueprint data as option since it doesn't need any fancy relation
        update_option( $this->option_key, $data );
        wp_send_json_success(array('message' => __('Saved Successfully', 'automated-visual-tester')));
    }

    /**
     * @return void
     * 
     * Initialize testing session using cookie identifier
     * 
     * @since v1.0.0
     */
    public function init_tester() {

        if(!isset( $_GET['avt_test_case'] )) {
            // Other page
            return;
        }

        $base_path = $this->get_data()['base_path'];
        self::$cookie['avt_test_key'] = sanitize_text_field( $_GET['avt_test_case'] ) ;

        foreach(self::$cookie as $key => $value) {
            setcookie($key, $value, 0, $base_path);
        }
    }

    /**
     * @return boolean
     * 
     * Check if testing session is active
     * 
     * @since v1.0.0
     */
    private function is_in_testing() {
        $data = count( self::$cookie ) ? self::$cookie : $_COOKIE;
        return !empty( $data['avt_test_key'] ) && is_string( $data['avt_test_key'] );
    }
    
    /**
     * @return void
     * 
     * Load ajax call counter JS as early as possible
     * 
     * @since v1.0.0
     */
    public function load_ajax_counter() {
        if($this->is_in_testing()) {
            echo '<script src="' . AVT_URL_BASE . 'assets/js/ajax-counter.js"></script>';
        }
    }

    /**
     * @return void
     * 
     * Load tester JS file
     * 
     * @since v1.0.0
     */
    public function load_tester_scripts() {
        
        if(!$this->is_in_testing()) {
            return;
        }

        wp_enqueue_script( 'avt-tester-js', AVT_URL_BASE . 'assets/js/tester.js', array( 'jquery' ), null, true );
	}

    /**
     * @return void
     * 
     * Filter site meta data to add current test info
     * 
     * @since v1.0.0
     */
    public function add_test_key_to_data($data) {
        $c_data = count( self::$cookie ) ? self::$cookie : $_COOKIE;
        if(isset( $c_data['avt_test_key'] ) ) {
            $data['avt_test_key'] = sanitize_text_field( $c_data['avt_test_key'] );
        }
        return $data;
    }
}