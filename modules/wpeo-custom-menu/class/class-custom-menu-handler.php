<?php
/**
 * Handle Custom Menu.
 *
 * @author Eoxia <dev@eoxia>
 * @since 1.0.0
 * @version 1.0.0
 * @copyright 2016-2019 Eoxia
 * @package EO_Framework\WPEO_Custom_Menu\Class
 */

namespace eoxia;

use eoxia\Custom_Menu_Handler as CMH;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( '\eoxia\Custom_Menu_Handler' ) ) {

	/**
	 * Class wpeo_custom_menu.
	 */
	class Custom_Menu_Handler
	{
		private static $_instance = null;

		public static $logo_src;
		public static $logo_url;

		/**
		 * List of Menu.
		 *
		 * @since 1.0.0
		 */
		public static $menus = array();

		public static function getInstance() {

			if(is_null(self::$_instance)) {
				self::$_instance = new Custom_Menu_Handler();
			}

			return self::$_instance;
		}

		public static function add_logo( $logo_src, $logo_url ) {
			self::$logo_src = $logo_src;
			self::$logo_url = $logo_url;
		}

		public static function register_container( $page_title, $menu_title, $capability, $menu_slug ) {
			add_menu_page( $page_title, $menu_title, $capability, $menu_slug );
		}

		/**
		 * Register a menu.
		 *
		 * @param string            $name Menu Name, ID.
		 * @param Class_Custom_Menu $menu Menu definition.
		 *
		 * @since 1.0.0
		 */
		public static function register_menu( $parent_slug, $page_title, $menu_title, $capability, $menu_slug, $function = '', $fa_class = '', $position = null ) {
			add_submenu_page( $parent_slug, $page_title, $menu_title, $capability, $menu_slug, array( self::getInstance(), 'display' ) );
			$menu = new Custom_Menu_Class( $page_title, $menu_title, $capability, $menu_slug, $function, $fa_class, $position );

			self::$menus[ $parent_slug ]['items'][ $menu_slug ] = apply_filters( 'eo_custom_menu_' . $parent_slug . '_' . $menu_slug, $menu );
			self::$menus[ $parent_slug ]['position']            = $position;

			\eoxia\Config_Util::$init['eo-framework']->wpeo_custom_menu->inserts_page[] = $menu_slug;
		}

		public function display() {
			$this->display_nav();
			$this->display_content();
		}

		public function display_nav() {
			global $current_screen;

			$menus = array();

			self::register_menu( 'others', 'Go to WP Admin', 'Go to WP Admin', 'manage_options', 'go-to-wp-admin', '', 'fa fa-tachometer-alt', 'bottom' );
			self::$menus['others']['items']['go-to-wp-admin']->link = admin_url( 'index.php' );

			$minimize_menu = get_user_meta( get_current_user_id(), '_eo_menu_minimize', true );
			$minimize_menu = empty( $minimize_menu ) ? false : true;
			$icon_minimize = $minimize_menu ? 'fa fa-arrow-right' : 'fa fa-arrow-left';

			self::register_menu( 'others', 'Minimize menu', 'Minimize menu', 'manage_options', 'minimize-menu', '', $icon_minimize, 'bottom' );
			self::$menus['others']['items']['minimize-menu']->link              = '#';
			self::$menus['others']['items']['minimize-menu']->class            .= ' minimize-menu action-attribute ';
			self::$menus['others']['items']['minimize-menu']->additional_attrs .= 'data-action=save_menu_state';


			$menus[ $current_screen->parent_base ] = self::$menus[ $current_screen->parent_base ];
			$menus['others'] = self::$menus['others'];

			require_once PLUGIN_EO_FRAMEWORK_PATH . '/modules/wpeo-custom-menu/view/nav.view.php';
		}

		public function display_content() {
			global $current_screen;

			$current_user = wp_get_current_user();

			$parent_menu = $current_screen->parent_base;
			$page        = $_GET['page'];


			$menu = self::$menus[ $parent_menu ]['items'][ $page ];

			require_once PLUGIN_EO_FRAMEWORK_PATH . '/modules/wpeo-custom-menu/view/content.view.php';
		}
	}
}