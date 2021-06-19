<?php
namespace AV_Tester;

if ( ! defined( 'ABSPATH' ) )
exit;

class Tester {

    private $option_key = 'avt_test_blueprints';

    function __construct() {
        add_action( 'wp_ajax_avt_get_tests', array($this, 'avt_get_tests') );
        add_action( 'wp_ajax_avt_save_tests', array($this, 'avt_save_tests') );
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
}