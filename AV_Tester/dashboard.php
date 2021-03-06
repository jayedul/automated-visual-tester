<?php
namespace AV_Tester;

if ( ! defined( 'ABSPATH' ) )
exit;

class Dashboard {

    private $page_slug = 'automated-visual-tester';

    public function __construct() {
        add_action('admin_menu', array($this, 'register_menu'));
        add_action('admin_enqueue_scripts', array($this, 'load_dashboard_scripts'));
        add_filter( 'admin_footer_text', array($this, 'admin_footer_text'), 1 );
    }

    /**
     * @return void
     * 
     * Register one and only dashboard root level menu
     * 
     * @since v1.0.0
     */
    public function register_menu() {
        add_menu_page(
            __('AV Tester', $this->page_slug), 
            __('AV Tester', $this->page_slug), 
            'manage_options', 
            $this->page_slug, 
            array($this, 'tests_dashboard_content'), 
            'data:image/svg+xml;base64,' . base64_encode('<svg enable-background="new 0 0 432.458 432.458" fill="none" version="1.1" viewBox="0 0 432.46 432.46" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
                <path d="m322.74 106.63c-2.778-4.518-5.731-8.889-8.873-13.08-25.777-34.375-60.453-53.307-97.641-53.307s-71.864 18.932-97.641 53.307c-3.143 4.191-6.095 8.562-8.874 13.08 20.061 31.973 60.275 53.85 106.51 53.85 46.241 0 86.455-21.877 106.52-53.85z"/>
                <path d="m417.46 201.76h-65.606c-0.808-12.567-2.625-24.87-5.406-36.742l51.575-51.576c5.858-5.858 5.858-15.355 0-21.213-5.857-5.858-15.355-5.858-21.213 0l-25.966 25.966c-7.348 12.845-17.202 24.674-29.365 35.028-24.637 20.972-56.246 33.718-90.248 36.621v202.38c31.443-4.39 60.365-22.55 82.641-52.255 3.907-5.21 7.536-10.687 10.881-16.395l52.058 52.058c2.929 2.929 6.768 4.393 10.607 4.393 3.838 0 7.678-1.465 10.606-4.393 5.858-5.858 5.858-15.355 0-21.213l-59.579-59.58c7.427-19.594 11.986-40.927 13.41-63.076h65.606c8.284 0 15-6.716 15-15-1e-3 -8.283-6.717-14.999-15.001-14.999z"/>
                <path d="m201.23 189.84c-34.003-2.903-65.612-15.649-90.249-36.621-12.163-10.354-22.017-22.183-29.365-35.028l-25.966-25.967c-5.858-5.858-15.356-5.858-21.213 0-5.858 5.858-5.858 15.355 0 21.213l51.575 51.575c-2.78 11.873-4.598 24.175-5.406 36.742h-65.606c-8.284 0-15 6.716-15 15s6.716 15 15 15h65.606c1.424 22.149 5.983 43.482 13.41 63.076l-59.579 59.579c-5.858 5.858-5.858 15.355 0 21.213 5.857 5.858 15.355 5.858 21.213 0l52.058-52.058c3.345 5.708 6.974 11.185 10.881 16.395 22.274 29.705 51.197 47.866 82.641 52.255v-202.37z"/>
            </svg>' 
        ) );
    }

    /**
     * @return void
     * 
     * HTML for dashboard page
     * 
     * @since v1.0.0
     */
    public function tests_dashboard_content() {
        require str_replace('/', DIRECTORY_SEPARATOR,  AVT_DIR . '/templates/dashboard.php') ;
    }
    
    /**
     * @return void
     * 
     * Load JS for the dashboard
     * 
     * @since v1.0.0
     */
    public function load_dashboard_scripts() {
        if( !isset( $_GET['page'] ) || $_GET['page'] != $this->page_slug ) {
            // No need to load JS in other pages than AV Tester dashboard
            return;
        }

        wp_enqueue_script( 'avt-dashboard-js', AVT_URL_BASE . 'assets/js/dashboard.js', array( 'jquery' ), AVT_VERSION, true );
	}

    /**
     * Show review link in footer
     */
	public function admin_footer_text( $footer_text ) {
		if ( isset($_GET['page']) && $_GET['page'] === 'automated-visual-tester' ) {
			$footer_text = sprintf(__( 'Please, %sleave a review%s on Automated Visual Tester. Your feedback is valuable.', 'automated-visual-tester'), '<a href="https://wordpress.org/support/plugin/automated-visual-tester/reviews/#new-post" target="_blank">', '</a>');
		}

		return $footer_text;
	}

}