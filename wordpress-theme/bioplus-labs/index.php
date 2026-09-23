<?php
/**
 * Fallback template — blog index, archives and search.
 *
 * @package BioPlus
 */

get_header();

if ( is_search() ) {
	/* translators: %s: search query. */
	$title = sprintf( __( 'Search results for “%s”', 'bioplus' ), get_search_query() );
} elseif ( is_archive() ) {
	$title = wp_strip_all_tags( get_the_archive_title() );
} elseif ( is_home() && ! is_front_page() ) {
	$title = single_post_title( '', false );
} else {
	$title = __( 'Research notes', 'bioplus' );
}

bioplus_page_hero(
	array(
		'eyebrow' => is_search() ? __( 'Search', 'bioplus' ) : __( 'Research notes', 'bioplus' ),
		'title'   => $title,
		'crumb'   => $title,
	)
);
?>
<div class="<?php echo esc_attr( bioplus_container( 'default', 'py-14' ) ); ?>">
	<?php if ( have_posts() ) : ?>
		<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
			<?php
			while ( have_posts() ) :
				the_post();
				get_template_part( 'template-parts/components/post-card' );
			endwhile;
			?>
		</div>
		<div class="mt-10"><?php the_posts_pagination( array( 'mid_size' => 1 ) ); ?></div>
	<?php else : ?>
		<div class="rounded-2xl border border-line bg-mist p-10 text-center">
			<p class="font-display text-lg font-bold text-ink-900"><?php esc_html_e( 'Nothing found', 'bioplus' ); ?></p>
			<p class="mt-2 text-sm text-ink-600"><?php esc_html_e( 'Try a different search, or browse the catalogue.', 'bioplus' ); ?></p>
			<div class="mt-5"><?php bioplus_button( array( 'label' => __( 'Browse the catalogue', 'bioplus' ), 'href' => 'shop' ) ); ?></div>
		</div>
	<?php endif; ?>
</div>
<?php
get_footer();
