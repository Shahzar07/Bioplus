<?php
/**
 * Payment methods — a WooCommerce fragment. Direct bank transfer shows the
 * account the customer will pay into, with "Your order number" as reference.
 *
 * @package BioPlus
 * @version 9.8.0
 */

defined( 'ABSPATH' ) || exit;

$gateways = WC()->payment_gateways() ? WC()->payment_gateways()->get_available_payment_gateways() : array();
WC()->payment_gateways()->set_current_gateway( $gateways );
$on  = 'block cursor-pointer rounded-xl border px-4 py-3.5 transition border-brand-500 bg-brand-50/50';
$off = 'block cursor-pointer rounded-xl border px-4 py-3.5 transition border-line bg-white hover:border-brand-300';
?>
<div id="payment" class="woocommerce-checkout-payment space-y-3">
	<?php if ( WC()->cart && WC()->cart->needs_payment() ) : ?>
		<?php if ( $gateways ) : ?>
			<?php foreach ( $gateways as $gateway ) : ?>
				<label class="<?php echo esc_attr( $gateway->chosen ? $on : $off ); ?>" data-on="<?php echo esc_attr( $on ); ?>" data-off="<?php echo esc_attr( $off ); ?>" data-gateway>
					<span class="flex items-center gap-3">
						<input id="payment_method_<?php echo esc_attr( $gateway->id ); ?>" type="radio" class="input-radio h-4 w-4 accent-brand-600" name="payment_method" value="<?php echo esc_attr( $gateway->id ); ?>" <?php checked( $gateway->chosen, true ); ?> data-order_button_text="<?php echo esc_attr( $gateway->order_button_text ); ?>">
						<?php bioplus_the_icon( 'bacs' === $gateway->id ? 'landmark' : 'credit-card', 17, 'shrink-0 text-brand-600' ); ?>
						<span class="text-[14px] font-bold text-ink-900"><?php echo wp_kses_post( $gateway->get_title() ); ?></span>
					</span>
					<?php if ( $gateway->has_fields() || $gateway->get_description() ) : ?>
						<span class="<?php echo esc_attr( $gateway->chosen ? 'mt-2.5 block pl-7 text-[12.5px] leading-relaxed text-ink-600' : 'mt-2.5 hidden pl-7 text-[12.5px] leading-relaxed text-ink-600' ); ?>" data-gateway-desc>
							<?php $gateway->payment_fields(); ?>
						</span>
					<?php endif; ?>
				</label>
				<?php if ( 'bacs' === $gateway->id && bioplus_has_bank_details() ) : ?>
					<div class="<?php echo esc_attr( $gateway->chosen ? 'rounded-xl border border-line bg-mist px-4 py-3.5' : 'hidden rounded-xl border border-line bg-mist px-4 py-3.5' ); ?>" data-bank-preview>
						<p class="text-[12px] font-semibold uppercase tracking-wide text-ink-500"><?php esc_html_e( "You'll be paying into", 'bioplus' ); ?></p>
						<?php bioplus_bank_details_list( __( 'Your order number', 'bioplus' ), array( 'copyable' => false, 'class' => 'mt-1.5' ) ); ?>
					</div>
				<?php endif; ?>
			<?php endforeach; ?>
		<?php else : ?>
			<p class="rounded-xl border border-line bg-mist px-4 py-3.5 text-[13px] text-ink-700"><?php echo esc_html( apply_filters( 'woocommerce_no_available_payment_methods_message', WC()->customer->get_billing_country() ? __( 'Sorry, it seems that there are no available payment methods. Please contact us if you require assistance or wish to make alternate arrangements.', 'woocommerce' ) : __( 'Please fill in your details above to see available payment methods.', 'woocommerce' ) ) ); ?></p>
		<?php endif; ?>
	<?php endif; ?>
</div>
