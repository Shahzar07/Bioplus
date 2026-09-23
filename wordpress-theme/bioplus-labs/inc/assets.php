<?php
/**
 * Styles and scripts.
 *
 * @package BioPlus
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Asset version — file mtime in development, theme version otherwise.
 *
 * @param string $rel Relative path under the theme.
 * @return string
 */
function bioplus_asset_ver( $rel ) {
	$file = BIOPLUS_DIR . '/' . $rel;
	return ( defined( 'WP_DEBUG' ) && WP_DEBUG && file_exists( $file ) ) ? (string) filemtime( $file ) : BIOPLUS_VERSION;
}

/**
 * Fonts are self-hosted from assets/fonts (declared in theme.css), exactly as
 * the original served them through next/font — no third-party request.
 * Kept as a hook for child themes that want a font CDN instead.
 *
 * @return string Empty when self-hosting.
 */
function bioplus_fonts_url() {
	return (string) apply_filters( 'bioplus_fonts_url', '' );
}

/**
 * Front-end assets.
 */
function bioplus_enqueue_assets() {
	if ( bioplus_fonts_url() ) {
		wp_enqueue_style( 'bioplus-fonts', bioplus_fonts_url(), array(), null ); // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion
	}
	wp_enqueue_style( 'bioplus-theme', bioplus_asset( 'css/theme.css' ), array(), bioplus_asset_ver( 'assets/css/theme.css' ) );

	wp_enqueue_script( 'bioplus-theme', bioplus_asset( 'js/theme.js' ), array(), bioplus_asset_ver( 'assets/js/theme.js' ), array( 'strategy' => 'defer', 'in_footer' => true ) );

	wp_localize_script(
		'bioplus-theme',
		'bioplusData',
		array(
			'ajaxUrl'     => admin_url( 'admin-ajax.php' ),
			'nonce'       => wp_create_nonce( 'bioplus_nonce' ),
			'formNonce'   => wp_create_nonce( 'bioplus_form' ),
			'cartUrl'     => bioplus_url( 'cart' ),
			'checkoutUrl' => bioplus_url( 'checkout' ),
			'shopUrl'     => bioplus_url( 'shop' ),
			'ageGate'     => (bool) bioplus_opt( 'age_gate_enabled' ),
			'ageGateExit' => esc_url_raw( (string) bioplus_opt( 'age_gate_exit_url' ) ),
			'catalogue'   => function_exists( 'bioplus_catalogue_for_js' ) ? bioplus_catalogue_for_js() : array(),
			'currency'    => function_exists( 'get_woocommerce_currency_symbol' ) ? html_entity_decode( get_woocommerce_currency_symbol() ) : '£',
			'i18n'        => array(
				'results'   => __( 'results', 'bioplus' ),
				'result'    => __( 'result', 'bioplus' ),
				'popular'   => __( 'Popular products', 'bioplus' ),
				'noMatch'   => __( 'No products match', 'bioplus' ),
				'added'     => __( 'Added to cart', 'bioplus' ),
				'addTo'     => __( 'Add to cart', 'bioplus' ),
				'error'     => __( 'Something went wrong. Please try again.', 'bioplus' ),
				'sending'   => __( 'Sending…', 'bioplus' ),
			),
		)
	);

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'bioplus_enqueue_assets', 20 );

/**
 * Preload the two faces used above the fold.
 */
function bioplus_preload_fonts() {
	foreach ( array( 'inter-latin-400-normal.woff2', 'space-grotesk-latin-700-normal.woff2' ) as $font ) {
		printf( '<link rel="preload" href="%s" as="font" type="font/woff2" crossorigin>' . "\n", esc_url( bioplus_asset( 'fonts/' . $font ) ) );
	}
}
add_action( 'wp_head', 'bioplus_preload_fonts', 1 );

/**
 * Favicon fallback when no Site Icon is set.
 */
function bioplus_favicon() {
	if ( has_site_icon() ) {
		return;
	}
	printf( '<link rel="icon" href="%s">' . "\n", esc_url( bioplus_asset( 'images/brand/bioplus-icon-black.png' ) ) );
	printf( '<link rel="apple-touch-icon" href="%s">' . "\n", esc_url( bioplus_asset( 'images/brand/bioplus-icon-512.png' ) ) );
}
add_action( 'wp_head', 'bioplus_favicon', 2 );

/**
 * Admin styles for the Forms inbox, payment proof box and setup screen.
 */
function bioplus_admin_assets() {
	wp_enqueue_style( 'bioplus-admin', bioplus_asset( 'css/admin.css' ), array(), bioplus_asset_ver( 'assets/css/admin.css' ) );
}
add_action( 'admin_enqueue_scripts', 'bioplus_admin_assets' );
