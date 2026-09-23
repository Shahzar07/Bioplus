<?php
/**
 * Cart page (app/cart/page.tsx).
 *
 * @package BioPlus
 * @version 10.1.0
 */

defined( 'ABSPATH' ) || exit;

$lines     = bioplus_cart_lines();
$count     = WC()->cart->get_cart_contents_count();
$subtotal  = (float) WC()->cart->get_subtotal() + (float) WC()->cart->get_subtotal_tax();
$threshold = bioplus_free_shipping_threshold();
$remaining = max( 0, $threshold - $subtotal );
?>
<div class="<?php echo esc_attr( bioplus_container( 'default', 'py-12' ) ); ?>" data-cart-page>
	<h1 class="font-display text-4xl font-extrabold tracking-tight"><?php esc_html_e( 'Your Cart', 'bioplus' ); ?></h1>
	<p class="mt-2 text-ink-600">
		<?php
		/* translators: %d: number of items. */
		echo esc_html( sprintf( _n( '%d item', '%d items', $count, 'bioplus' ), $count ) );
		?>
		· <?php esc_html_e( 'Research Use Only', 'bioplus' ); ?>
	</p>

	<div class="mt-6"><?php bioplus_print_notices(); ?></div>

	<div class="mt-4 grid gap-8 lg:grid-cols-[1.7fr_1fr]">
		<div>
			<ul class="space-y-3">
				<?php foreach ( $lines as $l ) : ?>
					<li class="relative flex gap-4 overflow-hidden rounded-xl border border-line bg-white p-4 shadow-card">
						<span class="brand-gradient absolute inset-y-0 left-0 w-[3px]"></span>
						<a href="<?php echo esc_url( $l['url'] ); ?>" class="ml-1 flex h-28 w-24 shrink-0 items-center justify-center rounded-lg bg-mist">
							<img src="<?php echo esc_url( $l['image'] ); ?>" alt="<?php echo esc_attr( $l['name'] ); ?>" width="880" height="1200" loading="lazy" class="object-contain h-24 w-auto">
						</a>
						<div class="flex min-w-0 flex-1 flex-col">
							<div class="flex items-start justify-between gap-3">
								<div>
									<a href="<?php echo esc_url( $l['url'] ); ?>" class="font-display text-lg font-bold hover:text-brand-700"><?php echo esc_html( $l['name'] ); ?></a>
									<p class="text-[13px] text-ink-600"><?php echo esc_html( $l['label'] ); ?></p>
									<p class="text-[11px] font-medium uppercase tracking-wide text-ink-500"><?php echo esc_html( 'SKU ' . $l['sku'] ); ?></p>
								</div>
								<button type="button" class="rounded p-1.5 text-ink-500 hover:text-red-600" aria-label="<?php esc_attr_e( 'Remove', 'bioplus' ); ?>" data-cart-remove="<?php echo esc_attr( $l['key'] ); ?>"><?php bioplus_the_icon( 'trash-2', 17 ); ?></button>
							</div>
							<div class="mt-auto flex items-center justify-between pt-3">
								<div class="inline-flex items-center rounded-full border border-line">
									<button type="button" class="grid h-9 w-9 place-items-center text-ink-700 hover:text-brand-700" aria-label="<?php esc_attr_e( 'Decrease', 'bioplus' ); ?>" data-cart-qty="<?php echo esc_attr( $l['key'] ); ?>" data-value="<?php echo esc_attr( $l['qty'] - 1 ); ?>"><?php bioplus_the_icon( 'minus', 15 ); ?></button>
									<span class="w-9 text-center font-semibold"><?php echo esc_html( $l['qty'] ); ?></span>
									<button type="button" class="grid h-9 w-9 place-items-center text-ink-700 hover:text-brand-700" aria-label="<?php esc_attr_e( 'Increase', 'bioplus' ); ?>" data-cart-qty="<?php echo esc_attr( $l['key'] ); ?>" data-value="<?php echo esc_attr( $l['qty'] + 1 ); ?>"><?php bioplus_the_icon( 'plus', 15 ); ?></button>
								</div>
								<div class="text-right">
									<span class="font-display text-lg font-bold"><?php echo esc_html( bioplus_money( $l['line_total'] ) ); ?></span>
									<span class="block text-[11px] text-ink-500"><?php echo esc_html( sprintf( /* translators: %s: unit price. */ __( '%s each', 'bioplus' ), bioplus_money( $l['price'] ) ) ); ?></span>
								</div>
							</div>
						</div>
					</li>
				<?php endforeach; ?>
			</ul>
			<a href="<?php bioplus_the_url( 'shop' ); ?>" class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink-700 hover:text-brand-700"><?php bioplus_the_icon( 'arrow-left', 16 ); ?> <?php esc_html_e( 'Continue shopping', 'bioplus' ); ?></a>
		</div>

		<aside class="lg:sticky lg:top-24 lg:self-start">
			<div class="rounded-2xl border border-line bg-white p-6 shadow-card">
				<h2 class="font-display text-xl font-bold"><?php esc_html_e( 'Order Summary', 'bioplus' ); ?></h2>

				<?php if ( $threshold > 0 && $remaining > 0 ) : ?>
					<div class="mt-4 rounded-xl bg-brand-50 p-3 text-[12.5px] text-brand-800">
						<?php esc_html_e( 'Add', 'bioplus' ); ?> <strong><?php echo esc_html( bioplus_money( $remaining ) ); ?></strong> <?php esc_html_e( 'more to qualify for free UK delivery.', 'bioplus' ); ?>
						<div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-brand-100">
							<div class="brand-gradient h-full rounded-full" style="<?php echo esc_attr( 'width:' . min( 100, round( ( $subtotal / $threshold ) * 100, 2 ) ) . '%' ); ?>"></div>
						</div>
					</div>
				<?php else : ?>
					<p class="mt-4 rounded-xl bg-emerald-50 p-3 text-[12.5px] font-medium text-emerald-700"><?php esc_html_e( "You've qualified for free UK delivery.", 'bioplus' ); ?></p>
				<?php endif; ?>

				<dl class="mt-5 space-y-2.5 text-sm">
					<div class="flex justify-between"><dt class="text-ink-600"><?php esc_html_e( 'Subtotal', 'bioplus' ); ?></dt><dd class="font-semibold"><?php echo esc_html( bioplus_money( $subtotal ) ); ?></dd></div>
					<div class="flex justify-between"><dt class="text-ink-600"><?php esc_html_e( 'Delivery', 'bioplus' ); ?></dt><dd class="text-ink-500"><?php esc_html_e( 'Calculated at checkout', 'bioplus' ); ?></dd></div>
					<div class="flex justify-between border-t border-line pt-3 text-base"><dt class="font-bold"><?php esc_html_e( 'Estimated total', 'bioplus' ); ?></dt><dd class="font-display text-xl font-bold"><?php echo esc_html( bioplus_money( $subtotal ) ); ?></dd></div>
				</dl>

				<a href="<?php bioplus_the_url( 'checkout' ); ?>" class="brand-gradient mt-5 flex h-12 items-center justify-center gap-2 rounded-full text-sm font-bold text-white"><?php esc_html_e( 'Secure checkout', 'bioplus' ); ?> <?php bioplus_the_icon( 'arrow-right', 17 ); ?></a>
				<p class="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-ink-500"><?php bioplus_the_icon( 'lock', 12 ); ?> <?php esc_html_e( 'SSL-encrypted · Direct bank transfer', 'bioplus' ); ?></p>
			</div>
		</aside>
	</div>
</div>
