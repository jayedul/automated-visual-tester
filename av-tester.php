<?php
/* 
    Plugin Name: AV Tester - WordPress Automation
    Plugin URI: https://github.com/jayedul/automated-visual-tester
    Description: An automated testing plugin for WordPress CMS that simulates user interaction on browser without any crazy setup.
    Author: JK
    Author URI: https://profiles.wordpress.org/jayedul/
    Version: 1.0.0
    License: GPLv2 or later
    Text Domain: av-tester
*/

if ( ! defined( 'ABSPATH' ) )
exit;

// Define Runtime Information for this plugin 
define( 'AVT_VERSION', '1.0.0' );
define( 'AVT_FILE', __FILE__ );
define( 'AVT_DIR', __DIR__ );
define( 'AVT_PATH_BASE', plugin_dir_path( __DIR__ ) );
define( 'AVT_URL_BASE',  plugin_dir_url( __FILE__ ) );

// Load text domain
add_action( 'init', function() {
	load_plugin_textdomain( 'av-tester', false, basename( dirname( __FILE__ ) ) . '/languages' );
});

// Create autoloader for classes
spl_autoload_register(function ($class) {
    $path = __DIR__ . DIRECTORY_SEPARATOR . str_replace('\\', DIRECTORY_SEPARATOR, $class) . '.php';
    file_exists( $path ) ? require( $path ) : 0;
});

// Initialize the application
(new \AV_Tester\Init)->start();