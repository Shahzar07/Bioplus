<?php
/**
 * 404 (not-found.tsx).
 *
 * @package BioPlus
 */

get_header();
?>
<section class="band-dark relative overflow-hidden text-white">
	<div class="hairline-grid absolute inset-0 opacity-60"></div>
	<div class="<?php echo esc_attr( bioplus_container( 'default', 'relative flex min-h-[70vh] flex-col items-center justify-center py-20 text-center' ) ); ?>">
		<span class="brand-text-gradient font-display text-7xl font-extrabold sm:text-8xl">404</span>
		<h1 class="font-display mt-4 text-3xl font-bold"><?php esc_html_e( 'Page not found', 'bioplus' ); ?></h1>
		<p class="mt-3 max-w-md text-white/60"><?php esc_html_e( "The page you're looking for doesn't exist or may have moved. Let's get you back to the lab.", 'bioplus' ); ?></p>
		<div class="mt-8 flex flex-wrap justify-center gap-3">
			<?php
			bioplus_button(
				array(
					'label'   => __( 'Back to home', 'bioplus' ),
					'href'    => 'home',
					'variant' => 'light',
				)
			);
			bioplus_button(
				array(
					'label'   => __( 'Browse the catalogue', 'bioplus' ),
					'href'    => 'shop',
					'variant' => 'outlineDark',
				)
			);
			?>
		</div>
	</div>
</section>
<?php
get_footer();
