<?php
/**
 * Checkout totals — a WooCommerce fragment refreshed on every update.
 *
 * @package BioPlus
 * @version 5.2.0
 */

defined( 'ABSPATH' ) || exit;

$subtotal  = (float) WC()->cart->get_subtotal() + (float) WC()->cart->get_subtotal_tax();
$total     = (float) WC()->cart->get_total( 'edit' );
$shipping  = bioplus_checkout_shipping();
$threshold = bioplus_free_shipping_threshold();
?>
<div class="woocommerce-checkout-review-order-table" data-order-total="<?php echo esc_attr( bioplus_money( $total ) ); ?>">
	<?php if ( $shipping ) : ?>
		<input type="hidden" name="shipping_method[0]" value="<?php echo esc_attr( $shipping[2] ); ?>" data-index="0">
	<?php endif; ?>
	<dl class="mt-5 space-y-2 border-t border-line pt-4 text-sm">
		<div class="flex justify-between"><dt class="text-ink-600"><?php esc_html_e( 'Subtotal', 'bioplus' ); ?></dt><dd class="font-semibold"><?php echo esc_html( bioplus_money( $subtotal ) ); ?></dd></div>
		<?php foreach ( WC()->cart->get_coupons() as $code => $coupon ) : ?>
			<div class="flex justify-between text-brand-700">
				<dt><?php echo esc_html( sprintf( /* translators: %s: coupon code. */ __( 'Discount (%s)', 'bioplus' ), strtoupper( $code ) ) ); ?> <a href="<?php echo esc_url( add_query_arg( 'remove_coupon', rawurlencode( $code ), wc_get_checkout_url() ) ); ?>" class="woocommerce-remove-coupon ml-1 text-[11px] font-semibold text-ink-500 hover:text-red-600" data-coupon="<?php echo esc_attr( $code ); ?>"><?php esc_html_e( 'Remove', 'bioplus' ); ?></a></dt>
				<dd class="font-semibold">−<?php echo esc_html( bioplus_money( WC()->cart->get_coupon_discount_amount( $code, ! WC()->cart->display_prices_including_tax() ) ) ); ?></dd>
			</div>
		<?php endforeach; ?>
		<?php if ( WC()->cart->needs_shipping() ) : ?>
			<div class="flex justify-between">
				<dt class="text-ink-600"><?php esc_html_e( 'Delivery', 'bioplus' ); ?></dt>
				<dd class="font-semibold">
					<?php
					if ( ! $shipping ) {
						esc_html_e( 'Enter your address', 'bioplus' );
					} elseif ( $shipping[1] <= 0 ) {
						esc_html_e( 'Free', 'bioplus' );
					} else {
						echo esc_html( bioplus_money( $shipping[1] ) );
					}
					?>
				</dd>
			</div>
		<?php endif; ?>
		<?php foreach ( WC()->cart->get_fees() as $fee ) : ?>
			<div class="flex justify-between"><dt class="text-ink-600"><?php echo esc_html( $fee->name ); ?></dt><dd class="font-semibold"><?php echo esc_html( bioplus_money( $fee->total ) ); ?></dd></div>
		<?php endforeach; ?>
		<?php if ( wc_tax_enabled() && ! WC()->cart->display_prices_including_tax() ) : ?>
			<div class="flex justify-between"><dt class="text-ink-600"><?php echo esc_html( WC()->countries->tax_or_vat() ); ?></dt><dd class="font-semibold"><?php echo esc_html( bioplus_money( WC()->cart->get_taxes_total() ) ); ?></dd></div>
		<?php endif; ?>
		<div class="flex justify-between border-t border-line pt-3 text-base">
			<dt class="font-bold"><?php esc_html_e( 'Total', 'bioplus' ); ?></dt>
			<dd class="font-display text-xl font-bold"><?php echo esc_html( bioplus_money( $total ) ); ?></dd>
		</div>
	</dl>
	<?php if ( $threshold > 0 && $subtotal < $threshold ) : ?>
		<p class="mt-3 text-[11.5px] text-ink-500"><?php echo esc_html( sprintf( /* translators: %s: amount. */ __( 'Spend %s more for free delivery.', 'bioplus' ), bioplus_money( $threshold - $subtotal ) ) ); ?></p>
	<?php endif; ?>
</div>
