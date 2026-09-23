<?php
/**
 * Menus: WordPress menus when assigned, the original navigation otherwise.
 *
 * @package BioPlus
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * The storefront's navigation, route-keyed (src/lib/site.ts).
 *
 * @return array<string,array{title:string,items:array<int,array{0:string,1:string}>}>
 */
function bioplus_default_menus() {
	return array(
		'primary'        => array(
			'title' => '',
			'items' => array(
				array( __( 'Home', 'bioplus' ), 'home' ),
				array( __( 'Shop', 'bioplus' ), 'shop' ),
				array( __( 'COAs', 'bioplus' ), 'certificates-of-analysis' ),
				array( __( 'About', 'bioplus' ), 'about' ),
				array( __( 'Research', 'bioplus' ), 'research' ),
				array( __( 'Calculator', 'bioplus' ), 'dosage-calculator' ),
				array( __( 'FAQ', 'bioplus' ), 'faq' ),
				array( __( 'Contact', 'bioplus' ), 'contact' ),
			),
		),
		'footer_shop'    => array(
			'title' => __( 'Shop', 'bioplus' ),
			'items' => array(
				array( __( 'All Products', 'bioplus' ), 'shop' ),
				array( __( 'Certificates of Analysis', 'bioplus' ), 'certificates-of-analysis' ),
				array( __( 'Research Library', 'bioplus' ), 'research' ),
				array( __( 'Dosage Calculator', 'bioplus' ), 'dosage-calculator' ),
				array( __( 'Cart', 'bioplus' ), 'cart' ),
			),
		),
		'footer_company' => array(
			'title' => __( 'Company', 'bioplus' ),
			'items' => array(
				array( __( 'About BioPlus Labs', 'bioplus' ), 'about' ),
				array( __( 'Certificates of Analysis', 'bioplus' ), 'certificates-of-analysis' ),
				array( __( 'Dosage Calculator', 'bioplus' ), 'dosage-calculator' ),
				array( __( 'Research Library', 'bioplus' ), 'research' ),
				array( __( 'Wholesale Programme', 'bioplus' ), 'wholesale' ),
				array( __( 'Affiliate Programme', 'bioplus' ), 'affiliate' ),
				array( __( 'Contact Us', 'bioplus' ), 'contact' ),
			),
		),
		'footer_account' => array(
			'title' => __( 'Account', 'bioplus' ),
			'items' => array(
				array( __( 'Research Hub', 'bioplus' ), 'account' ),
				array( __( 'Orders', 'bioplus' ), 'account/orders' ),
				array( __( 'Certificates of Analysis', 'bioplus' ), 'account/files' ),
				array( __( 'Research Address', 'bioplus' ), 'account/research-address' ),
				array( __( 'Cart', 'bioplus' ), 'cart' ),
			),
		),
		'footer_legal'   => array(
			'title' => __( 'Compliance & Legal', 'bioplus' ),
			'items' => bioplus_legal_links(),
		),
		'footer_bottom'  => array(
			'title' => '',
			'items' => array(
				array( __( 'Privacy', 'bioplus' ), 'legal/privacy' ),
				array( __( 'Terms', 'bioplus' ), 'legal/terms' ),
				array( __( 'Regulatory Notice', 'bioplus' ), 'legal/regulatory-notice' ),
				array( __( 'Shipping', 'bioplus' ), 'shipping' ),
			),
		),
		'legal_sidebar'  => array(
			'title' => __( 'Policies', 'bioplus' ),
			'items' => bioplus_legal_links(),
		),
	);
}

/**
 * Policy links used by the legal sidebar and footer column.
 *
 * @return array
 */
function bioplus_legal_links() {
	return array(
		array( __( 'Research-Use-Only Disclaimer', 'bioplus' ), 'legal/research-disclaimer' ),
		array( __( 'Regulatory & Legal Notice', 'bioplus' ), 'legal/regulatory-notice' ),
		array( __( 'Shipping & Delivery', 'bioplus' ), 'shipping' ),
		array( __( 'Returns & Refunds', 'bioplus' ), 'legal/returns' ),
		array( __( 'Privacy Policy', 'bioplus' ), 'legal/privacy' ),
		array( __( 'Terms & Conditions', 'bioplus' ), 'legal/terms' ),
	);
}

/**
 * Menu items for a location as [ ['label' => , 'url' => , 'active' => ] ].
 *
 * @param string $location Menu location.
 * @return array
 */
function bioplus_menu_items( $location ) {
	$items     = array();
	$locations = get_nav_menu_locations();

	if ( ! empty( $locations[ $location ] ) ) {
		$menu_items = wp_get_nav_menu_items( $locations[ $location ] );
		if ( $menu_items ) {
			foreach ( $menu_items as $item ) {
				if ( (int) $item->menu_item_parent ) {
					continue;
				}
				$items[] = array(
					'label'  => $item->title,
					'url'    => $item->url,
					'active' => bioplus_is_active_url( $item->url ),
					'target' => $item->target,
				);
			}
			return $items;
		}
	}

	$defaults = bioplus_default_menus();
	if ( empty( $defaults[ $location ] ) ) {
		return $items;
	}
	foreach ( $defaults[ $location ]['items'] as $item ) {
		$url     = bioplus_url( $item[1] );
		$items[] = array(
			'label'  => $item[0],
			'url'    => $url,
			'active' => bioplus_is_active_url( $url ),
			'target' => '',
		);
	}
	return $items;
}

/**
 * Column title for a footer menu location (the menu's name when assigned).
 *
 * @param string $location Location.
 * @return string
 */
function bioplus_menu_title( $location ) {
	$locations = get_nav_menu_locations();
	if ( ! empty( $locations[ $location ] ) ) {
		$menu = wp_get_nav_menu_object( $locations[ $location ] );
		if ( $menu ) {
			return $menu->name;
		}
	}
	$defaults = bioplus_default_menus();
	return isset( $defaults[ $location ] ) ? $defaults[ $location ]['title'] : '';
}
