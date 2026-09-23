<?php
/**
 * Search form.
 *
 * @package BioPlus
 */

?>
<form role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>" class="flex items-center gap-2.5 rounded-full border border-line bg-white px-4 py-2.5 focus-within:border-brand-500">
	<?php bioplus_the_icon( 'search', 17, 'shrink-0 text-ink-500' ); ?>
	<label class="sr-only" for="<?php echo esc_attr( wp_unique_id( 's-' ) ); ?>"><?php esc_html_e( 'Search', 'bioplus' ); ?></label>
	<input type="search" name="s" value="<?php echo esc_attr( get_search_query() ); ?>" placeholder="<?php esc_attr_e( 'Search…', 'bioplus' ); ?>" class="w-full bg-transparent text-[14px] outline-none placeholder:text-ink-500">
</form>
