<?php
/**
 * Shop / category / product search — the research catalogue (ShopClient.tsx).
 *
 * @package BioPlus
 * @version 9.9.0
 */

defined( 'ABSPATH' ) || exit;

get_header();

// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only sorting.
$orderby = isset( $_GET['orderby'] ) ? sanitize_key( wp_unslash( $_GET['orderby'] ) ) : 'featured';
$orderby = in_array( $orderby, array( 'featured', 'price', 'price-desc', 'title' ), true ) ? $orderby : 'featured';
$sorts   = array(
	'featured'   => __( 'Featured', 'bioplus' ),
	'price'      => __( 'Price: Low to High', 'bioplus' ),
	'price-desc' => __( 'Price: High to Low', 'bioplus' ),
	'title'      => __( 'Name A–Z', 'bioplus' ),
);

if ( is_search() || is_product_taxonomy() ) {
	$ids      = wp_list_pluck( $GLOBALS['wp_query']->posts, 'ID' );
	$products = array_values(
		array_filter(
			bioplus_all_products(),
			static function ( $p ) use ( $ids ) {
				return in_array( $p['id'], $ids, true );
			}
		)
	);
} else {
	$products = bioplus_all_products();
}
$products = bioplus_sort_products( $products, $orderby );

if ( is_search() ) {
	/* translators: %s: search terms. */
	$heading = sprintf( __( 'Results for “%s”', 'bioplus' ), get_search_query() );
	$intro   = __( 'Research compounds matching your search. All products are Research Use Only.', 'bioplus' );
	$crumb   = __( 'Search', 'bioplus' );
} elseif ( is_product_taxonomy() ) {
	$heading = single_term_title( '', false );
	$intro   = wp_strip_all_tags( term_description() );
	$crumb   = $heading;
} else {
	$shop_id = wc_get_page_id( 'shop' );
	$heading = __( 'Research Catalogue', 'bioplus' );
	$intro   = __( 'Every product we supply, on one page. High-purity research compounds and laboratory materials, batch-tested for identity and purity. All products are Research Use Only.', 'bioplus' );
	$crumb   = __( 'Shop', 'bioplus' );
	if ( $shop_id > 0 && has_excerpt( $shop_id ) ) {
		$intro = get_the_excerpt( $shop_id );
	}
}
?>
<section class="metal-plate relative overflow-hidden border-b border-line">
	<div class="absolute inset-x-0 top-0 h-px bg-white/70"></div>
	<div class="<?php echo esc_attr( bioplus_container( 'default', 'relative py-12 sm:py-14' ) ); ?>">
		<nav class="text-[12px] text-ink-500" aria-label="<?php esc_attr_e( 'Breadcrumb', 'bioplus' ); ?>">
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="hover:text-brand-700"><?php esc_html_e( 'Home', 'bioplus' ); ?></a> <span class="mx-1.5">/</span> <span class="text-ink-700"><?php echo esc_html( $crumb ); ?></span>
		</nav>
		<div class="mt-5 flex gap-5 sm:gap-7">
			<span class="brand-gradient mt-1.5 w-1.5 shrink-0 rounded-full" aria-hidden="true"></span>
			<div>
				<h1 class="font-display text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl"><?php echo esc_html( $heading ); ?></h1>
				<?php if ( $intro ) : ?>
					<p class="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-600"><?php echo esc_html( $intro ); ?></p>
				<?php endif; ?>
			</div>
		</div>
	</div>
</section>

<div class="<?php echo esc_attr( bioplus_container( 'default', 'py-10' ) ); ?>">
	<?php bioplus_print_notices(); ?>
	<div class="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
		<p class="text-[13px] text-ink-500">
			<?php
			/* translators: %d: number of products. */
			echo esc_html( sprintf( _n( '%d product', '%d products', count( $products ), 'bioplus' ), count( $products ) ) );
			?>
		</p>
		<form method="get" class="flex items-center gap-2 text-sm" data-auto-submit>
			<?php if ( is_search() ) : ?>
				<input type="hidden" name="s" value="<?php echo esc_attr( get_search_query() ); ?>">
				<input type="hidden" name="post_type" value="product">
			<?php endif; ?>
			<label for="sort" class="hidden text-ink-600 sm:inline"><?php esc_html_e( 'Sort', 'bioplus' ); ?></label>
			<select id="sort" name="orderby" class="rounded-full border border-line bg-white px-3 py-2 text-sm font-medium text-ink-800 outline-none focus:border-brand-500">
				<?php foreach ( $sorts as $value => $label ) : ?>
					<option value="<?php echo esc_attr( $value ); ?>"<?php selected( $orderby, $value ); ?>><?php echo esc_html( $label ); ?></option>
				<?php endforeach; ?>
			</select>
			<noscript><button type="submit" class="rounded-full border border-line px-3 py-2"><?php esc_html_e( 'Sort', 'bioplus' ); ?></button></noscript>
		</form>
	</div>

	<?php if ( $products ) : ?>
		<div class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			<?php
			foreach ( $products as $product_view ) {
				get_template_part( 'template-parts/components/product-card', null, array( 'product' => $product_view ) );
			}
			?>
		</div>
	<?php else : ?>
		<div class="mt-10 flex flex-col items-center justify-center gap-4 rounded-2xl border border-line bg-mist py-16 text-center">
			<p class="font-display text-lg font-bold"><?php esc_html_e( 'No products found', 'bioplus' ); ?></p>
			<a href="<?php bioplus_the_url( 'shop' ); ?>" class="brand-gradient rounded-full px-6 py-3 text-sm font-bold text-white"><?php esc_html_e( 'View the full catalogue', 'bioplus' ); ?></a>
		</div>
	<?php endif; ?>
</div>
<?php
get_footer();
