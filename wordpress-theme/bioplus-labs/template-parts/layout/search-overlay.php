<?php
/**
 * Product search overlay (SearchOverlay.tsx). Results render client-side from
 * the catalogue JSON; submitting falls back to the WordPress product search.
 *
 * @package BioPlus
 */

?>
<div class="fixed inset-0 z-[95] hidden" data-search-overlay role="dialog" aria-modal="true" aria-label="<?php esc_attr_e( 'Search products', 'bioplus' ); ?>">
	<div class="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" data-search-close></div>
	<div class="animate-fade-up relative mx-auto mt-[8vh] w-full max-w-2xl px-4">
		<div class="overflow-hidden rounded-2xl bg-white shadow-pop">
			<form role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>" class="flex items-center gap-3 border-b border-line px-5 py-4">
				<?php bioplus_the_icon( 'search', 20, 'text-ink-500' ); ?>
				<input type="search" name="s" autocomplete="off" placeholder="<?php esc_attr_e( 'Search peptides, blends, SKUs…', 'bioplus' ); ?>" class="flex-1 bg-transparent text-base outline-none placeholder:text-ink-500" data-search-input>
				<input type="hidden" name="post_type" value="product">
				<button type="button" class="rounded-full p-1.5 text-ink-500 hover:bg-haze" aria-label="<?php esc_attr_e( 'Close search', 'bioplus' ); ?>" data-search-close><?php bioplus_the_icon( 'x', 20 ); ?></button>
			</form>
			<div class="scroll-slim max-h-[55vh] overflow-y-auto p-2">
				<p class="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500" data-search-label><?php esc_html_e( 'Popular products', 'bioplus' ); ?></p>
				<p class="hidden px-3 py-6 text-center text-sm text-ink-500" data-search-empty></p>
				<ul data-search-results></ul>
			</div>
		</div>
	</div>
</div>
