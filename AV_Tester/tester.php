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

        if( isset( $_POST['test_key'] ) ) {
            if(is_string( $_POST['test_key'] ) && isset( $tests[$_POST['test_key']] )) {
                wp_send_json_success( array(
                    'blueprint' => $tests[$_POST['test_key']]
                ) );
            }
            wp_send_json_error( array('message' => 'Test Not found' ) );
        }
        
        wp_send_json_success( array( 'tests' => (object)$tests ) );
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
            wp_send_json_error( array('message' => 'Access Forbidden' ) );
            return;
        }

        $data = isset( $_POST['blueprints'] ) ? $_POST['blueprints'] : '';
        $data = @json_decode( stripslashes( $data ), true );

        // Check if it is array
        if(!is_array( $data )) {
            wp_send_json_error( array('message' => 'Invalid Blueprints Array' ) );
            return;
        }

        update_option( $this->option_key, $data );
        wp_send_json_success(array('message' => __('Saved Successfully', 'av-tester')));
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
        
        self::$cookie['avt_test_key'] = $_GET['avt_test_case'];

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
        $data = count(self::$cookie) ? self::$cookie : $_COOKIE;
        return isset( $data['avt_test_key'] );
    }
    
    /**
     * @return void
     * 
     * Load ajax call counter JS code in dashboard and frontend if testing session active 
     * 
     * @since v1.0.0
     */
    public function load_ajax_counter() {
        
        if(!$this->is_in_testing()) {
            return;
        }

        ?>
        <script>
            window.avt_ajax_counter = 0;

            window.jQuery(document).ajaxStart(function() {
                window.avt_ajax_counter++;
            });

            window.jQuery(document).ajaxStop(function() {
                window.avt_ajax_counter--;
            });
        </script>
        <?php
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

        wp_enqueue_script( 'avt-tester-js', AVT_URL_BASE . 'assets/tester.js', array( 'jquery' ), null, true );
	}

    /**
     * @return void
     * 
     * Filter site meta data to add current test info
     * 
     * @since v1.0.0
     */
    public function add_test_key_to_data($data) {
        $c_data = count(self::$cookie) ? self::$cookie : $_COOKIE;
        if(isset( $c_data['avt_test_key'] ) ) {
            $data['avt_test_key'] = $c_data['avt_test_key'];
        }
        return $data;
    }
}