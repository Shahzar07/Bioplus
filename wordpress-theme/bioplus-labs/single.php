<?php
/**
 * Single post.
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
	bioplus_page_hero(
		array(
			'eyebrow'      => get_the_date(),
			'title'        => get_the_title(),
			'crumb'        => get_the_title(),
			'crumb_parent' => __( 'Research notes', 'bioplus' ),
			'crumb_url'    => get_post_type_archive_link( 'post' ) ? get_post_type_archive_link( 'post' ) : home_url( '/' ),
		)
	);
	?>
	<div class="<?php echo esc_attr( bioplus_container( 'default', 'py-14' ) ); ?>">
		<div class="grid gap-10 lg:grid-cols-[1fr_300px]">
			<article <?php post_class( 'min-w-0' ); ?>>
				<?php if ( has_post_thumbnail() ) : ?>
					<div class="mb-8 overflow-hidden rounded-2xl border border-line"><?php the_post_thumbnail( 'large', array( 'class' => 'w-full' ) ); ?></div>
				<?php endif; ?>
				<div class="bioplus-prose"><?php the_content(); ?></div>
				<?php
				wp_link_pages();
				if ( comments_open() || get_comments_number() ) {
					comments_template();
				}
				?>
			</article>
			<?php if ( is_active_sidebar( 'sidebar-1' ) ) : ?>
				<aside class="space-y-4"><?php dynamic_sidebar( 'sidebar-1' ); ?></aside>
			<?php endif; ?>
		</div>
	</div>
	<?php
endwhile;
get_footer();
