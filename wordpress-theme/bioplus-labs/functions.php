<?php
/**
 * BioPlus Labs theme bootstrap.
 *
 * Everything lives in /inc; this file only defines constants and loads it.
 *
 * @package BioPlus
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'BIOPLUS_VERSION', '1.0.0' );
define( 'BIOPLUS_DIR', get_template_directory() );
define( 'BIOPLUS_URI', get_template_directory_uri() );

/** Default contact address used everywhere the site shows or sends email. */
define( 'BIOPLUS_DEFAULT_EMAIL', 'customerservice@biopluslabs.co.uk' );

require_once BIOPLUS_DIR . '/inc/helpers.php';
require_once BIOPLUS_DIR . '/inc/setup.php';
require_once BIOPLUS_DIR . '/inc/assets.php';
require_once BIOPLUS_DIR . '/inc/customizer.php';
require_once BIOPLUS_DIR . '/inc/navigation.php';
require_once BIOPLUS_DIR . '/inc/sections.php';
require_once BIOPLUS_DIR . '/inc/forms.php';
require_once BIOPLUS_DIR . '/inc/coa.php';
require_once BIOPLUS_DIR . '/inc/seo.php';
require_once BIOPLUS_DIR . '/inc/importer.php';

/*
 * WooCommerce integration loads only when WooCommerce is active (plugins load
 * before themes). Without it the theme still renders, with an install notice.
 */
if ( class_exists( 'WooCommerce' ) ) {
	require_once BIOPLUS_DIR . '/inc/woocommerce.php';
	require_once BIOPLUS_DIR . '/inc/cart.php';
	require_once BIOPLUS_DIR . '/inc/checkout.php';
	require_once BIOPLUS_DIR . '/inc/payment.php';
	require_once BIOPLUS_DIR . '/inc/account.php';
	require_once BIOPLUS_DIR . '/inc/product-meta.php';
} else {
	require_once BIOPLUS_DIR . '/inc/no-woocommerce.php';
}

require_once BIOPLUS_DIR . '/inc/elementor.php';
