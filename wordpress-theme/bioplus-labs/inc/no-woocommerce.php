<?php
/**
 * Stand-ins used while WooCommerce is not active, so every template renders.
 *
 * @package BioPlus
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Admin notice: install WooCommerce.
 */
function bioplus_wc_missing_notice() {
	if ( ! current_user_can( 'install_plugins' ) ) {
		return;
	}
	printf(
		'<div class="notice notice-warning"><p><strong>%1$s</strong> %2$s <a href="%3$s">%4$s</a></p></div>',
		esc_html__( 'BioPlus Labs theme:', 'bioplus' ),
		esc_html__( 'install and activate WooCommerce to enable the shop, cart, checkout and Research Hub, then run Appearance → BioPlus Setup.', 'bioplus' ),
		esc_url( admin_url( 'plugin-install.php?s=woocommerce&tab=search&type=term' ) ),
		esc_html__( 'Install WooCommerce', 'bioplus' )
	);
}
add_action( 'admin_notices', 'bioplus_wc_missing_notice' );

/**
 * Availability labels.
 *
 * @return array<string,string>
 */
function bioplus_availability_labels() {
	return array(
		'in-stock'      => __( 'In stock', 'bioplus' ),
		'out-of-stock'  => __( 'Out of stock', 'bioplus' ),
		'arriving-soon' => __( 'Arriving soon', 'bioplus' ),
	);
}

/**
 * No catalogue without WooCommerce.
 *
 * @return array
 */
function bioplus_products() {
	return array();
}

/**
 * No catalogue without WooCommerce.
 *
 * @return array
 */
function bioplus_all_products() {
	return array();
}

/**
 * No cart without WooCommerce.
 *
 * @return array
 */
function bioplus_cart_lines() {
	return array();
}

/**
 * Nothing to search without WooCommerce.
 *
 * @return array
 */
function bioplus_catalogue_for_js() {
	return array();
}

/**
 * No notices without WooCommerce.
 */
function bioplus_print_notices() {}
