<?php
    /* 
        Plugin Name: Automated Visual Tester
        Author: TeleShare
        Author URI: teleshareapp.com
        Description: Test website functionalities on browser automatically.
        Version: 1.0.0
        License: GPLv2 or later
        Text Domain: av-tester
    */

    if ( ! defined( 'ABSPATH' ) )
    exit;

    define( 'AVT_VERSION', '1.9.1' );
    define( 'AVT_FILE', __FILE__ );
    define( 'AVT_URL_BASE',  plugin_dir_url( __FILE__ ) );

    spl_autoload_register(function ($class) {
        $path = __DIR__ . DIRECTORY_SEPARATOR . str_replace('\\', DIRECTORY_SEPARATOR, $class) . '.php';
        file_exists( $path ) ? require( $path ) : 0;
    });

    (new \AV_Tester\Init)->start();
?>