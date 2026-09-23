<?php
/**
 * Template Name: BioPlus — Policy / Legal
 *
 * Page hero on the brushed plate, then the policy index beside the page
 * content (LegalLayout in Prose.tsx). The text itself is ordinary page content,
 * edited in the block editor.
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
	$updated = get_post_meta( get_the_ID(), '_bioplus_updated', true );
	$updated = $updated ? $updated : get_the_modified_date( 'F Y' );
	$eyebrow = get_post_meta( get_the_ID(), '_bioplus_eyebrow', true );
	$parent  = wp_get_post_parent_id( get_the_ID() );

	bioplus_page_hero(
		array(
			'eyebrow'      => $eyebrow ? $eyebrow : __( 'Policy', 'bioplus' ),
			'title'        => get_the_title(),
			'intro'        => has_excerpt() ? get_the_excerpt() : '',
			'crumb'        => get_the_title(),
			'crumb_parent' => __( 'Legal', 'bioplus' ),
			'crumb_url'    => $parent ? get_permalink( $parent ) : bioplus_url( 'legal/research-disclaimer' ),
		)
	);
	?>
	<div class="<?php echo esc_attr( bioplus_container( 'default', 'py-14' ) ); ?>">
		<div class="grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-14">
			<aside class="lg:sticky lg:top-28 lg:self-start">
				<p class="text-[10.5px] font-bold uppercase tracking-[0.18em] text-ink-500"><?php echo esc_html( bioplus_menu_title( 'legal_sidebar' ) ); ?></p>
				<nav class="mt-4 space-y-1 border-l border-line" aria-label="<?php esc_attr_e( 'Policies', 'bioplus' ); ?>">
					<?php foreach ( bioplus_menu_items( 'legal_sidebar' ) as $l ) : ?>
						<a href="<?php echo esc_url( $l['url'] ); ?>" class="<?php echo esc_attr( $l['active'] ? '-ml-px block border-l-2 py-1.5 pl-4 text-[13.5px] font-medium transition border-brand-500 text-brand-700' : '-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-[13.5px] font-medium text-ink-600 transition hover:border-brand-500 hover:text-brand-700' ); ?>"><?php echo esc_html( $l['label'] ); ?></a>
					<?php endforeach; ?>
				</nav>
				<p class="mt-7 rounded-lg bg-mist px-3.5 py-2.5 text-[11.5px] font-medium uppercase tracking-[0.12em] text-ink-500"><?php echo esc_html( sprintf( /* translators: %s: month and year. */ __( 'Last updated %s', 'bioplus' ), $updated ) ); ?></p>
			</aside>
			<div class="min-w-0 max-w-3xl">
				<div class="bioplus-prose"><?php the_content(); ?></div>
			</div>
		</div>
	</div>
	<?php
endwhile;
get_footer();
