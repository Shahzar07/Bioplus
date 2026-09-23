<?php
/**
 * Theme supports, menus, widget areas.
 *
 * @package BioPlus
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register theme features.
 */
function bioplus_setup() {
	load_theme_textdomain( 'bioplus', BIOPLUS_DIR . '/languages' );

	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'editor-styles' );
	add_theme_support( 'customize-selective-refresh-widgets' );
	add_theme_support(
		'html5',
		array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'script', 'style', 'navigation-widgets' )
	);
	add_theme_support(
		'custom-logo',
		array(
			'height'      => 145,
			'width'       => 529,
			'flex-height' => true,
			'flex-width'  => true,
		)
	);

	add_theme_support(
		'woocommerce',
		array(
			'thumbnail_image_width' => 440,
			'single_image_width'    => 880,
			'product_grid'          => array(
				'default_rows'    => 5,
				'default_columns' => 4,
			),
		)
	);

	add_image_size( 'bioplus-vial', 880, 1200, false );

	register_nav_menus(
		array(
			'primary'        => __( 'Primary menu (header)', 'bioplus' ),
			'footer_shop'    => __( 'Footer — Shop column', 'bioplus' ),
			'footer_company' => __( 'Footer — Company column', 'bioplus' ),
			'footer_account' => __( 'Footer — Account column', 'bioplus' ),
			'footer_legal'   => __( 'Footer — Compliance & Legal column', 'bioplus' ),
			'footer_bottom'  => __( 'Footer — bottom bar links', 'bioplus' ),
			'legal_sidebar'  => __( 'Policy pages sidebar', 'bioplus' ),
		)
	);

	add_editor_style( 'assets/css/theme.css' );
}
add_action( 'after_setup_theme', 'bioplus_setup' );

/**
 * Content width for embeds.
 */
function bioplus_content_width() {
	$GLOBALS['content_width'] = 1280; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
}
add_action( 'after_setup_theme', 'bioplus_content_width', 0 );

/**
 * Widget areas.
 */
function bioplus_widgets_init() {
	register_sidebar(
		array(
			'name'          => __( 'Blog sidebar', 'bioplus' ),
			'id'            => 'sidebar-1',
			'description'   => __( 'Shown beside blog posts.', 'bioplus' ),
			'before_widget' => '<section id="%1$s" class="widget rounded-2xl border border-line bg-white p-5 shadow-card %2$s">',
			'after_widget'  => '</section>',
			'before_title'  => '<h2 class="font-display text-base font-bold text-ink-900">',
			'after_title'   => '</h2>',
		)
	);
}
add_action( 'widgets_init', 'bioplus_widgets_init' );

/**
 * Body classes.
 *
 * @param string[] $classes Classes.
 * @return string[]
 */
function bioplus_body_class( $classes ) {
	$classes[] = 'min-h-screen bg-white antialiased';
	return $classes;
}
add_filter( 'body_class', 'bioplus_body_class' );

/**
 * Skip link target and a11y helpers.
 */
function bioplus_skip_link() {
	echo '<a class="skip-link screen-reader-text" href="#main">' . esc_html__( 'Skip to content', 'bioplus' ) . '</a>';
}
add_action( 'wp_body_open', 'bioplus_skip_link', 5 );

/**
 * Pages built with Elementor render full-width between our header and footer.
 *
 * @param int|null $post_id Post ID.
 * @return bool
 */
function bioplus_is_elementor_page( $post_id = null ) {
	$post_id = $post_id ? $post_id : get_the_ID();
	if ( ! $post_id || ! did_action( 'elementor/loaded' ) || ! class_exists( '\Elementor\Plugin' ) ) {
		return false;
	}
	$document = \Elementor\Plugin::$instance->documents->get( $post_id );
	return $document && $document->is_built_with_elementor();
}
