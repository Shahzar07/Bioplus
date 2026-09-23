<?php
/**
 * Default page — brushed-plate hero and the page content in brand prose.
 * Elementor-built pages render full width between the header and footer.
 *
 * @package BioPlus
 */

get_header();
while ( have_posts() ) :
	the_post();
	if ( bioplus_is_elementor_page() ) {
		the_content();
		continue;
	}
	$is_wc = function_exists( 'is_cart' ) && ( is_cart() || is_checkout() || is_account_page() );
	if ( $is_wc ) {
		// Cart, checkout and the Research Hub bring their own layouts.
		the_content();
		continue;
	}
	bioplus_page_hero(
		array(
			'eyebrow' => get_post_meta( get_the_ID(), '_bioplus_eyebrow', true ),
			'title'   => get_the_title(),
			'intro'   => has_excerpt() ? get_the_excerpt() : '',
			'crumb'   => get_the_title(),
		)
	);
	?>
	<div class="<?php echo esc_attr( bioplus_container( 'default', 'py-14' ) ); ?>">
		<div class="bioplus-prose max-w-3xl"><?php the_content(); ?></div>
		<?php
		wp_link_pages();
		if ( comments_open() || get_comments_number() ) {
			comments_template();
		}
		?>
	</div>
	<?php
endwhile;
get_footer();
