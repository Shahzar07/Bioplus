<?php
/**
 * Order received — the order's own payment page (order-received/[number]).
 *
 * Checkout lands here, the on-hold email links here and the Research Hub links
 * here, so the bank details and payment reference stay reachable from any
 * device. The 20-minute window and the screenshot upload are prompts, never an
 * expiry: nothing cancels the order when the clock runs out.
 *
 * @package BioPlus
 * @version 8.1.0
 * @var WC_Order|false $order
 */

defined( 'ABSPATH' ) || exit;

if ( ! $order ) {
	?>
	<div class="<?php echo esc_attr( bioplus_container( 'narrow', 'py-20 text-center' ) ); ?>">
		<h1 class="font-display text-3xl font-extrabold"><?php esc_html_e( 'Thank you — your order has been received.', 'bioplus' ); ?></h1>
		<a href="<?php bioplus_the_url( 'shop' ); ?>" class="brand-gradient mt-6 inline-block rounded-full px-6 py-3 text-sm font-bold text-white"><?php esc_html_e( 'Continue shopping', 'bioplus' ); ?></a>
	</div>
	<?php
	return;
}

$number    = $order->get_order_number();
$awaiting  = bioplus_order_awaiting_payment( $order ) && 'bacs' === $order->get_payment_method();
$status    = bioplus_order_status( $order, true );
$placed    = $order->get_date_created() ? $order->get_date_created()->getTimestamp() : time();
$minutes   = max( 1, (int) bioplus_opt( 'payment_window' ) );
$proof     = (bool) $order->get_meta( '_bioplus_proof_file' );
$confirmed = (int) $order->get_meta( '_bioplus_payment_confirmed_at' );
$bank      = bioplus_bank_details();
$required  = (bool) bioplus_opt( 'payment_proof_required' );
?>
<div class="<?php echo esc_attr( bioplus_container( 'narrow', 'py-16' ) ); ?>">
	<?php bioplus_print_notices(); ?>

	<?php if ( $order->has_status( 'failed' ) ) : ?>
		<div class="text-center">
			<h1 class="font-display text-3xl font-extrabold tracking-tight"><?php esc_html_e( 'Payment unsuccessful', 'bioplus' ); ?></h1>
			<p class="mt-3 text-ink-600"><?php esc_html_e( 'Unfortunately your order cannot be processed as the payment was declined. Please try again.', 'bioplus' ); ?></p>
			<a href="<?php echo esc_url( $order->get_checkout_payment_url() ); ?>" class="brand-gradient mt-6 inline-block rounded-full px-6 py-3 text-sm font-bold text-white"><?php esc_html_e( 'Pay', 'bioplus' ); ?></a>
		</div>
	<?php else : ?>
		<div class="text-center">
			<div class="brand-gradient mx-auto grid h-16 w-16 place-items-center rounded-full text-white"><?php bioplus_the_icon( 'check', 30, '', array( 'stroke' => 3 ) ); ?></div>
			<h1 class="font-display mt-6 text-4xl font-extrabold tracking-tight"><?php esc_html_e( 'Order received', 'bioplus' ); ?></h1>
			<p class="mt-3 text-ink-600">
				<?php
				printf(
					/* translators: 1: first name, 2: order number, 3: date. */
					esc_html__( 'Thank you, %1$s. Your order %2$s was placed on %3$s.', 'bioplus' ),
					esc_html( $order->get_billing_first_name() ),
					'<strong class="text-ink-900">' . esc_html( $number ) . '</strong>',
					esc_html( wc_format_datetime( $order->get_date_created(), 'j F Y' ) )
				);
				?>
			</p>
			<span class="<?php echo esc_attr( 'mt-4 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ring-1 ' . $status[1] ); ?>"><?php echo esc_html( $status[0] ); ?></span>
		</div>

		<section class="mt-8 rounded-2xl border border-line bg-white p-6 shadow-card">
			<h2 class="font-display flex items-center gap-2 text-lg font-bold"><?php bioplus_the_icon( 'landmark', 19, 'text-brand-600' ); ?> <?php echo $awaiting ? esc_html__( 'Pay by direct bank transfer', 'bioplus' ) : esc_html__( 'Payment', 'bioplus' ); ?></h2>

			<?php if ( ! $awaiting ) : ?>
				<p class="mt-3 text-[13.5px] leading-relaxed text-ink-600">
					<?php
					if ( 'bacs' === $order->get_payment_method() || $order->is_paid() ) {
						esc_html_e( 'Payment for this order has been received — there is nothing more to pay. You can follow its progress in your Research Hub.', 'bioplus' );
					} else {
						echo esc_html( sprintf( /* translators: %s: payment method. */ __( 'Paid by %s.', 'bioplus' ), $order->get_payment_method_title() ) );
					}
					?>
				</p>
			<?php elseif ( bioplus_has_bank_details() ) : ?>
				<p class="mt-2 text-[13.5px] leading-relaxed text-ink-600">
					<?php
					printf(
						/* translators: 1: amount, 2: minutes. */
						esc_html__( 'Transfer %1$s to the account below from your banking app, quoting the payment reference — that reference is how we match your transfer to this order. Please pay within %2$s minutes so we can dispatch today.', 'bioplus' ),
						'<strong class="text-ink-900">' . esc_html( bioplus_money( $order->get_total() ) ) . '</strong>',
						esc_html( $minutes )
					);
					?>
				</p>
				<?php bioplus_bank_details_list( $number, array( 'class' => 'mt-4' ) ); ?>

				<div data-payment-window data-placed="<?php echo esc_attr( $placed ); ?>" data-minutes="<?php echo esc_attr( $minutes ); ?>" data-order-id="<?php echo esc_attr( $order->get_id() ); ?>" data-key="<?php echo esc_attr( $order->get_order_key() ); ?>" data-has-proof="<?php echo $proof ? '1' : '0'; ?>" data-confirmed="<?php echo $confirmed ? '1' : '0'; ?>" data-proof-required="<?php echo $required ? '1' : '0'; ?>">
					<?php get_template_part( 'template-parts/components/payment-window', null, array( 'order' => $order, 'minutes' => $minutes, 'proof' => $proof, 'confirmed' => $confirmed, 'required' => $required ) ); ?>
				</div>

				<?php if ( $bank['instructions'] ) : ?>
					<p class="mt-4 flex items-start gap-2 rounded-xl bg-mist px-4 py-3 text-[12.5px] leading-relaxed text-ink-600"><?php bioplus_the_icon( 'shield-check', 15, 'mt-px shrink-0 text-brand-600' ); ?><span><?php echo esc_html( $bank['instructions'] ); ?></span></p>
				<?php endif; ?>
			<?php else : ?>
				<p class="mt-3 text-[13.5px] leading-relaxed text-ink-600"><?php esc_html_e( "We'll email you the account details shortly. Please quote", 'bioplus' ); ?> <strong class="text-ink-900"><?php echo esc_html( $number ); ?></strong> <?php esc_html_e( 'as your payment reference.', 'bioplus' ); ?></p>
			<?php endif; ?>
		</section>

		<section class="mt-6 rounded-2xl border border-line bg-white p-6 shadow-card">
			<h2 class="font-display flex items-center gap-2 text-lg font-bold"><?php bioplus_the_icon( 'package', 19, 'text-brand-600' ); ?> <?php esc_html_e( 'Your order', 'bioplus' ); ?></h2>
			<ul class="mt-4 space-y-2">
				<?php foreach ( $order->get_items() as $item ) : ?>
					<?php
					if ( ! $item instanceof WC_Order_Item_Product ) {
						continue;
					}
					$prod = $item->get_product();
					?>
					<li class="flex justify-between gap-4 text-[13.5px]">
						<span class="text-ink-700"><?php echo esc_html( $item->get_quantity() . ' × ' . bioplus_line_name( $prod ? $prod : false ) ); ?> <span class="text-ink-500"><?php echo esc_html( bioplus_line_label( $prod ? $prod : false ) . ( $prod && $prod->get_sku() ? ' (' . $prod->get_sku() . ')' : '' ) ); ?></span></span>
						<span class="font-semibold"><?php echo esc_html( bioplus_money( (float) $item->get_subtotal() + (float) $item->get_subtotal_tax() ) ); ?></span>
					</li>
				<?php endforeach; ?>
			</ul>
			<dl class="mt-4 space-y-2 border-t border-line pt-4 text-sm">
				<div class="flex justify-between"><dt class="text-ink-600"><?php esc_html_e( 'Subtotal', 'bioplus' ); ?></dt><dd class="font-semibold"><?php echo esc_html( bioplus_money( (float) $order->get_subtotal() ) ); ?></dd></div>
				<?php if ( (float) $order->get_discount_total() > 0 ) : ?>
					<div class="flex justify-between"><dt class="text-ink-600"><?php echo esc_html( __( 'Discount', 'bioplus' ) . ( $order->get_coupon_codes() ? ' (' . strtoupper( implode( ', ', $order->get_coupon_codes() ) ) . ')' : '' ) ); ?></dt><dd class="font-semibold">−<?php echo esc_html( bioplus_money( (float) $order->get_discount_total() ) ); ?></dd></div>
				<?php endif; ?>
				<div class="flex justify-between"><dt class="text-ink-600"><?php esc_html_e( 'Delivery', 'bioplus' ); ?></dt><dd class="font-semibold"><?php echo (float) $order->get_shipping_total() <= 0 ? esc_html__( 'Free', 'bioplus' ) : esc_html( bioplus_money( (float) $order->get_shipping_total() + (float) $order->get_shipping_tax() ) ); ?></dd></div>
				<div class="flex justify-between border-t border-line pt-3"><dt class="font-bold"><?php esc_html_e( 'Total', 'bioplus' ); ?></dt><dd class="font-display text-xl font-bold"><?php echo esc_html( bioplus_money( (float) $order->get_total() ) ); ?></dd></div>
			</dl>
			<div class="mt-5 border-t border-line pt-4 text-[13px] leading-relaxed text-ink-600">
				<p class="flex items-center gap-2 font-semibold text-ink-800"><?php bioplus_the_icon( 'truck', 15, 'text-brand-600' ); ?> <?php esc_html_e( 'Delivery address', 'bioplus' ); ?></p>
				<p class="mt-1.5">
					<?php echo esc_html( $order->get_billing_first_name() . ' ' . $order->get_billing_last_name() . ( $order->get_billing_company() ? ' · ' . $order->get_billing_company() : '' ) ); ?><br>
					<?php echo esc_html( $order->get_billing_address_1() . ( $order->get_billing_address_2() ? ', ' . $order->get_billing_address_2() : '' ) ); ?><br>
					<?php echo esc_html( $order->get_billing_city() . ( $order->get_billing_state() ? ', ' . $order->get_billing_state() : '' ) . ' ' . $order->get_billing_postcode() ); ?>
				</p>
			</div>
		</section>

		<p class="mt-6 text-center text-[12.5px] leading-relaxed text-ink-500"><?php esc_html_e( "Keep this page — the link in your confirmation email brings you back to it at any time. We'll email you again as soon as the transfer clears and your order is dispatched.", 'bioplus' ); ?></p>

		<div class="mt-6 flex flex-wrap justify-center gap-3">
			<a href="<?php echo esc_url( is_user_logged_in() ? bioplus_url( 'account/orders' ) : bioplus_url( 'register' ) ); ?>" class="brand-gradient rounded-full px-6 py-3 text-sm font-bold text-white"><?php echo is_user_logged_in() ? esc_html__( 'View order in Research Hub', 'bioplus' ) : esc_html__( 'Create an account to track it', 'bioplus' ); ?></a>
			<a href="<?php bioplus_the_url( 'shop' ); ?>" class="rounded-full border border-ink-900/15 px-6 py-3 text-sm font-semibold text-ink-800 hover:border-brand-500"><?php esc_html_e( 'Continue shopping', 'bioplus' ); ?></a>
		</div>
	<?php endif; ?>
</div>
