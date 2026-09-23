<?php
/**
 * Site header: age gate, announcement bar, sticky header (SiteChrome + Header.tsx).
 *
 * @package BioPlus
 */

?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<?php
if ( ! function_exists( 'elementor_theme_do_location' ) || ! elementor_theme_do_location( 'header' ) ) {
	if ( bioplus_opt( 'age_gate_enabled' ) ) {
		get_template_part( 'template-parts/layout/age-gate' );
	}
	get_template_part( 'template-parts/layout/announcement-bar' );
	get_template_part( 'template-parts/layout/site-header' );
}
?>
<main id="main">
