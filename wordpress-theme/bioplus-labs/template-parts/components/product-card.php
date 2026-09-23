<?php
/**
 * Product card (ProductCard.tsx).
 *
 * @package BioPlus
 * @var array $args product => view array from bioplus_product_view().
 */

$p = $args['product'];
if ( empty( $p ) ) {
	return;
}
$availability = $p['availability'];
$single       = 1 === count( $p['variants'] );
$buyable      = null;
foreach ( $p['variants'] as $v ) {
	if ( 'in-stock' === $v['availability'] ) {
		$buyable = $v;
		break;
	}
}
$labels = bioplus_availability_labels();
?>
<div class="group relative flex flex-col overflow-hidden rounded-xl border border-line bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-pop">
	<span class="brand-gradient absolute inset-x-0 top-0 z-10 h-[3px] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>

	<div class="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
		<?php if ( $p['best_seller'] ) : ?>
			<span class="rounded-md bg-ink-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white"><?php esc_html_e( 'Best Seller', 'bioplus' ); ?></span>
		<?php endif; ?>
		<?php if ( $p['is_new'] ) : ?>
			<span class="brand-gradient rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white"><?php esc_html_e( 'New', 'bioplus' ); ?></span>
		<?php endif; ?>
	</div>

	<?php if ( 'in-stock' !== $availability ) : ?>
		<span class="<?php echo esc_attr( 'arriving-soon' === $availability ? 'absolute right-3 top-3 z-10 rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide bg-brand-600 text-white' : 'absolute right-3 top-3 z-10 rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide bg-ink-700 text-white' ); ?>"><?php echo esc_html( $labels[ $availability ] ); ?></span>
	<?php endif; ?>

	<a href="<?php echo esc_url( $p['url'] ); ?>" class="<?php echo esc_attr( bioplus_cn( 'relative flex h-60 items-center justify-center border-b border-line bg-mist', 'out-of-stock' === $availability ? 'opacity-70' : '' ) ); ?>">
		<img src="<?php echo esc_url( $p['image'] ); ?>" alt="<?php echo esc_attr( $p['name'] . ' — ' . __( 'BioPlus Labs research vial', 'bioplus' ) ); ?>" width="880" height="1200" loading="lazy" class="object-contain h-52 w-auto transition-transform duration-500 group-hover:scale-105">
	</a>

	<div class="flex flex-1 flex-col p-5">
		<a href="<?php echo esc_url( $p['url'] ); ?>">
			<h3 class="font-display text-lg font-bold leading-tight text-ink-900 transition-colors group-hover:text-brand-700"><?php echo esc_html( $p['name'] ); ?></h3>
		</a>
		<p class="mt-1 line-clamp-2 text-[13px] leading-relaxed text-ink-600"><?php echo esc_html( $p['tagline'] ); ?></p>

		<div class="mt-3 flex items-center gap-2 text-[11px] font-medium text-ink-500">
			<span>
				<?php
				/* translators: %d: number of options. */
				echo esc_html( sprintf( _n( '%d option', '%d options', count( $p['variants'] ), 'bioplus' ), count( $p['variants'] ) ) );
				?>
			</span>
			<span class="h-1 w-1 rounded-full bg-ink-500/40"></span>
			<span class="<?php echo esc_attr( 'in-stock' === $availability ? 'text-emerald-600' : ( 'arriving-soon' === $availability ? 'text-brand-600' : '' ) ); ?>"><?php echo esc_html( $labels[ $availability ] ); ?></span>
		</div>

		<div class="mt-4 flex items-center justify-between border-t border-line pt-4">
			<div>
				<span class="block text-[11px] text-ink-500"><?php echo $single ? esc_html__( 'per vial', 'bioplus' ) : esc_html__( 'from', 'bioplus' ); ?></span>
				<span class="font-display text-xl font-bold text-ink-900"><?php echo esc_html( $p['price_range'] ); ?></span>
			</div>
			<?php if ( $single && $buyable ) : ?>
				<button type="button" data-add-to-cart="<?php echo esc_attr( $buyable['id'] ); ?>" data-qty="1" class="brand-gradient inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-white transition hover:brightness-110">
					<?php bioplus_the_icon( 'plus', 16 ); ?> <?php esc_html_e( 'Add', 'bioplus' ); ?>
				</button>
			<?php else : ?>
				<a href="<?php echo esc_url( $p['url'] ); ?>" class="inline-flex h-10 items-center gap-1.5 rounded-full border border-ink-900/15 px-4 text-sm font-semibold text-ink-800 transition hover:border-brand-500 hover:text-brand-700">
					<?php echo 'in-stock' === $availability ? esc_html__( 'Select', 'bioplus' ) : esc_html__( 'View', 'bioplus' ); ?> <?php bioplus_the_icon( 'arrow-right', 15 ); ?>
				</a>
			<?php endif; ?>
		</div>
	</div>
</div>
