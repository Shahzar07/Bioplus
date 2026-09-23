<?php
/**
 * Research Hub → single order.
 *
 * @package BioPlus
 * @version 3.0.0
 * @var int $order_id
 */

defined( 'ABSPATH' ) || exit;

$order = wc_get_order( $order_id );
if ( ! $order ) {
	return;
}
$status = bioplus_order_status( $order );
$notes  = $order->get_customer_order_notes();

wc_get_template(
	'myaccount/panel-header.php',
	array(
		/* translators: %s: order number. */
		'title'    => sprintf( __( 'Order #%s', 'bioplus' ), $order->get_order_number() ),
		/* translators: %s: date. */
		'subtitle' => sprintf( __( 'Placed %s', 'bioplus' ), wc_format_datetime( $order->get_date_created(), 'j F Y' ) ),
	)
);
?>
<div class="mt-6 space-y-4">
	<div class="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
		<div class="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
			<span class="<?php echo esc_attr( 'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ' . $status[1] ); ?>"><?php echo esc_html( $status[0] ); ?></span>
			<?php if ( bioplus_order_awaiting_payment( $order ) && 'bacs' === $order->get_payment_method() ) : ?>
				<a href="<?php echo esc_url( $order->get_checkout_order_received_url() ); ?>" class="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-brand-300 hover:text-brand-200"><?php esc_html_e( 'Open payment page', 'bioplus' ); ?> <?php bioplus_the_icon( 'external-link', 13 ); ?></a>
			<?php endif; ?>
		</div>
		<ul class="mt-4 space-y-1.5">
			<?php foreach ( $order->get_items() as $item ) : ?>
				<?php
				if ( ! $item instanceof WC_Order_Item_Product ) {
					continue;
				}
				$prod = $item->get_product();
				?>
				<li class="flex justify-between text-[13.5px] text-white/70">
					<span><?php echo esc_html( $item->get_quantity() . ' × ' . bioplus_line_name( $prod ? $prod : false ) . ' ' . bioplus_line_label( $prod ? $prod : false ) ); ?></span>
					<span class="text-white/50"><?php echo esc_html( bioplus_money( (float) $item->get_subtotal() + (float) $item->get_subtotal_tax() ) ); ?></span>
				</li>
			<?php endforeach; ?>
		</ul>
		<dl class="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm text-white/70">
			<?php foreach ( $order->get_order_item_totals() as $key => $total ) : ?>
				<?php
				if ( 'payment_method' === $key ) {
					continue;
				}
				?>
				<div class="<?php echo esc_attr( 'order_total' === $key ? 'flex justify-between border-t border-white/10 pt-3 text-base font-bold text-white' : 'flex justify-between' ); ?>">
					<dt><?php echo esc_html( rtrim( wp_strip_all_tags( $total['label'] ), ':' ) ); ?></dt>
					<dd><?php echo wp_kses_post( $total['value'] ); ?></dd>
				</div>
			<?php endforeach; ?>
		</dl>
	</div>

	<div class="grid gap-4 sm:grid-cols-2">
		<div class="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-[13.5px] leading-relaxed text-white/70">
			<p class="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.16em] text-brand-300"><?php bioplus_the_icon( 'map-pin', 15 ); ?> <?php esc_html_e( 'Delivery address', 'bioplus' ); ?></p>
			<address class="mt-3 not-italic"><?php echo wp_kses_post( $order->get_formatted_billing_address() ); ?></address>
		</div>
		<div class="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-[13.5px] leading-relaxed text-white/70">
			<p class="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.16em] text-brand-300"><?php bioplus_the_icon( 'truck', 15 ); ?> <?php esc_html_e( 'Shipment', 'bioplus' ); ?></p>
			<p class="mt-3">
				<?php
				$tracking = $order->get_meta( '_bioplus_tracking_number' );
				echo $tracking ? esc_html( trim( $order->get_meta( '_bioplus_tracking_carrier' ) . ' · ' . $tracking, ' ·' ) ) : esc_html__( 'Tracking available once shipped', 'bioplus' );
				?>
			</p>
			<p class="mt-2"><?php echo esc_html( sprintf( /* translators: %s: method. */ __( 'Payment: %s', 'bioplus' ), $order->get_payment_method_title() ) ); ?></p>
		</div>
	</div>

	<?php if ( $notes ) : ?>
		<div class="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
			<p class="text-[12px] font-bold uppercase tracking-[0.16em] text-brand-300"><?php esc_html_e( 'Order updates', 'bioplus' ); ?></p>
			<ol class="mt-3 space-y-3">
				<?php foreach ( $notes as $note ) : ?>
					<li class="text-[13.5px] text-white/70"><span class="block text-[11.5px] text-white/40"><?php echo esc_html( date_i18n( 'j M Y, H:i', strtotime( $note->comment_date ) ) ); ?></span><?php echo wp_kses_post( wpautop( wptexturize( $note->comment_content ) ) ); ?></li>
				<?php endforeach; ?>
			</ol>
		</div>
	<?php endif; ?>

	<a href="<?php echo esc_url( wc_get_account_endpoint_url( 'orders' ) ); ?>" class="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white"><?php bioplus_the_icon( 'arrow-left', 16 ); ?> <?php esc_html_e( 'All orders', 'bioplus' ); ?></a>
</div>
