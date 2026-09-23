<?php
/**
 * Post card for blog/search listings.
 *
 * @package BioPlus
 */

?>
<article <?php post_class( 'group relative flex flex-col overflow-hidden rounded-xl border border-line bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-pop' ); ?>>
	<span class="brand-gradient absolute inset-x-0 top-0 z-10 h-[3px] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
	<?php if ( has_post_thumbnail() ) : ?>
		<a href="<?php the_permalink(); ?>" class="block aspect-[16/10] overflow-hidden bg-mist"><?php the_post_thumbnail( 'medium_large', array( 'class' => 'h-full w-full object-cover transition-transform duration-500 group-hover:scale-105' ) ); ?></a>
	<?php endif; ?>
	<div class="flex flex-1 flex-col p-5">
		<p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-700"><?php echo esc_html( get_the_date() ); ?></p>
		<h2 class="font-display mt-2 text-lg font-bold leading-tight text-ink-900 group-hover:text-brand-700"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
		<p class="mt-2 line-clamp-3 text-[13.5px] leading-relaxed text-ink-600"><?php echo esc_html( wp_trim_words( get_the_excerpt(), 26 ) ); ?></p>
		<a href="<?php the_permalink(); ?>" class="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700"><?php esc_html_e( 'Read more', 'bioplus' ); ?> <?php bioplus_the_icon( 'arrow-right', 15 ); ?></a>
	</div>
</article>
