<?php
/**
 * Site footer and cart drawer.
 *
 * @package BioPlus
 */

?>
</main>
<?php
if ( ! function_exists( 'elementor_theme_do_location' ) || ! elementor_theme_do_location( 'footer' ) ) {
	get_template_part( 'template-parts/layout/site-footer' );
}
get_template_part( 'template-parts/layout/cart-drawer' );
wp_footer();
?>
</body>
</html>
