<?php
/**
 * Elementor integration: a "BioPlus Labs" widget category with one widget per
 * storefront section. Each widget's controls are the section's fields (see
 * inc/sections.php) and its output is the very template part the page
 * templates render, so Elementor pages are pixel-identical to the originals.
 *
 * @package BioPlus
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Widget category.
 *
 * @param \Elementor\Elements_Manager $manager Manager.
 */
function bioplus_elementor_category( $manager ) {
	$manager->add_category(
		'bioplus',
		array(
			'title' => __( 'BioPlus Labs', 'bioplus' ),
			'icon'  => 'eicon-flask',
		)
	);
}
add_action( 'elementor/elements/categories_registered', 'bioplus_elementor_category' );

/**
 * Register the widgets.
 *
 * @param \Elementor\Widgets_Manager $widgets Manager.
 */
function bioplus_elementor_widgets( $widgets ) {
	require_once BIOPLUS_DIR . '/inc/elementor/class-section-widget.php';
	require_once BIOPLUS_DIR . '/inc/elementor/widgets.php';
	foreach ( bioplus_elementor_widget_classes() as $class ) {
		if ( class_exists( $class ) ) {
			$widgets->register( new $class() );
		}
	}
}
add_action( 'elementor/widgets/register', 'bioplus_elementor_widgets' );

/**
 * Elementor Pro Theme Builder: let header/footer templates replace the theme's.
 *
 * @param \ElementorPro\Modules\ThemeBuilder\Classes\Locations_Manager $manager Manager.
 */
function bioplus_elementor_locations( $manager ) {
	$manager->register_core_location( 'header' );
	$manager->register_core_location( 'footer' );
}
add_action( 'elementor/theme/register_locations', 'bioplus_elementor_locations' );

/**
 * Brand colours and fonts in Elementor's pickers.
 */
function bioplus_elementor_editor_styles() {
	wp_add_inline_style( 'elementor-editor', '@font-face{font-family:"Space Grotesk";font-weight:700;src:url("' . esc_url( bioplus_asset( 'fonts/space-grotesk-latin-700-normal.woff2' ) ) . '") format("woff2")}' );
}
add_action( 'elementor/editor/after_enqueue_styles', 'bioplus_elementor_editor_styles' );
