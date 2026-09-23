<?php
/**
 * Cart drawer contents — replaced as a fragment after every cart change.
 *
 * @package BioPlus
 */

$lines    = function_exists( 'bioplus_cart_lines' ) ? bioplus_cart_lines() : array();
$count    = ( function_exists( 'WC' ) && WC()->cart ) ? WC()->cart->get_cart_contents_count() : 0;
$subtotal = ( function_exists( 'WC' ) && WC()->cart ) ? (float) WC()->cart->get_subtotal() + (float) WC()->cart->get_subtotal_tax() : 0;
?>
<div class="flex h-full flex-col" data-cart-drawer-inner>
	<div class="flex items-center justify-between border-b border-line px-6 py-5">
		<div class="flex items-center gap-2">
			<?php bioplus_the_icon( 'shopping-bag', 18, 'text-brand-700' ); ?>
			<h2 class="font-display text-lg font-bold"><?php esc_html_e( 'Your Cart', 'bioplus' ); ?></h2>
			<span class="rounded-full bg-haze px-2 py-0.5 text-xs font-semibold text-ink-700"><?php echo esc_html( $count ); ?></span>
		</div>
		<button type="button" class="rounded-full p-2 text-ink-600 transition hover:bg-haze" aria-label="<?php esc_attr_e( 'Close cart', 'bioplus' ); ?>" data-cart-close><?php bioplus_the_icon( 'x', 20 ); ?></button>
	</div>

	<?php if ( ! $lines ) : ?>
		<div class="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
			<div class="flex h-16 w-16 items-center justify-center rounded-full bg-haze"><?php bioplus_the_icon( 'shopping-bag', 26, 'text-ink-500' ); ?></div>
			<p class="text-ink-600"><?php esc_html_e( 'Your cart is empty.', 'bioplus' ); ?></p>
			<a href="<?php bioplus_the_url( 'shop' ); ?>" class="brand-gradient rounded-full px-6 py-3 text-sm font-semibold text-white"><?php esc_html_e( 'Browse Catalogue', 'bioplus' ); ?></a>
		</div>
	<?php else : ?>
		<div class="scroll-slim flex-1 overflow-y-auto px-4 py-4">
			<ul class="space-y-3">
				<?php foreach ( $lines as $l ) : ?>
					<li class="flex gap-3 rounded-xl border border-line p-3">
						<a href="<?php echo esc_url( $l['url'] ); ?>" class="flex h-20 w-16 shrink-0 items-center justify-center rounded-lg bg-white">
							<img src="<?php echo esc_url( $l['image'] ); ?>" alt="<?php echo esc_attr( $l['name'] ); ?>" width="880" height="1200" loading="lazy" class="object-contain h-16 w-auto">
						</a>
						<div class="min-w-0 flex-1">
							<div class="flex items-start justify-between gap-2">
								<a href="<?php echo esc_url( $l['url'] ); ?>" class="text-sm font-semibold leading-tight hover:text-brand-700"><?php echo esc_html( $l['name'] ); ?></a>
								<button type="button" class="rounded p-1 text-ink-500 hover:text-red-600" aria-label="<?php esc_attr_e( 'Remove', 'bioplus' ); ?>" data-cart-remove="<?php echo esc_attr( $l['key'] ); ?>"><?php bioplus_the_icon( 'trash-2', 15 ); ?></button>
							</div>
							<p class="mt-0.5 text-xs text-ink-500"><?php echo esc_html( $l['label'] ); ?></p>
							<p class="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-ink-500"><?php echo esc_html( 'SKU ' . $l['sku'] ); ?></p>
							<div class="mt-2 flex items-center justify-between">
								<div class="inline-flex items-center rounded-full border border-line">
									<button type="button" class="grid h-7 w-7 place-items-center text-ink-600 hover:text-brand-700" aria-label="<?php esc_attr_e( 'Decrease quantity', 'bioplus' ); ?>" data-cart-qty="<?php echo esc_attr( $l['key'] ); ?>" data-value="<?php echo esc_attr( $l['qty'] - 1 ); ?>"><?php bioplus_the_icon( 'minus', 13 ); ?></button>
									<span class="w-7 text-center text-sm font-semibold"><?php echo esc_html( $l['qty'] ); ?></span>
									<button type="button" class="grid h-7 w-7 place-items-center text-ink-600 hover:text-brand-700" aria-label="<?php esc_attr_e( 'Increase quantity', 'bioplus' ); ?>" data-cart-qty="<?php echo esc_attr( $l['key'] ); ?>" data-value="<?php echo esc_attr( $l['qty'] + 1 ); ?>"><?php bioplus_the_icon( 'plus', 13 ); ?></button>
								</div>
								<span class="text-sm font-bold"><?php echo esc_html( bioplus_money( $l['line_total'] ) ); ?></span>
							</div>
						</div>
					</li>
				<?php endforeach; ?>
			</ul>
		</div>

		<div class="border-t border-line px-6 py-5">
			<div class="flex items-center justify-between text-sm">
				<span class="text-ink-600"><?php esc_html_e( 'Subtotal', 'bioplus' ); ?></span>
				<span class="font-display text-xl font-bold"><?php echo esc_html( bioplus_money( $subtotal ) ); ?></span>
			</div>
			<p class="mt-1 text-xs text-ink-500"><?php esc_html_e( 'Delivery calculated at checkout. UK prices include VAT where applicable.', 'bioplus' ); ?></p>
			<div class="mt-4 flex flex-col gap-2">
				<a href="<?php bioplus_the_url( 'checkout' ); ?>" class="brand-gradient flex h-12 items-center justify-center rounded-full text-sm font-bold text-white"><?php esc_html_e( 'Proceed to Checkout', 'bioplus' ); ?></a>
				<a href="<?php bioplus_the_url( 'cart' ); ?>" class="flex h-11 items-center justify-center rounded-full border border-ink-900/15 text-sm font-semibold text-ink-800 hover:border-brand-500"><?php esc_html_e( 'View Cart', 'bioplus' ); ?></a>
			</div>
		</div>
	<?php endif; ?>
</div>
