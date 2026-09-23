<?php
/**
 * Research Hub → Orders (cards instead of a table).
 *
 * @package BioPlus
 * @version 9.5.0
 * @var bool   $has_orders
 * @var object $customer_orders
 */

defined( 'ABSPATH' ) || exit;

wc_get_template(
	'myaccount/panel-header.php',
	array(
		'title'    => __( 'Orders', 'bioplus' ),
		'subtitle' => __( 'Track and review your BioPlus Labs orders.', 'bioplus' ),
	)
);
?>
<div class="mt-6 space-y-4">
	<?php if ( ! $has_orders ) : ?>
		<div class="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
			<span class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-500/15 text-brand-300"><?php bioplus_the_icon( 'shopping-bag', 24 ); ?></span>
			<p class="font-display mt-4 text-lg font-bold text-white"><?php esc_html_e( 'No orders yet', 'bioplus' ); ?></p>
			<p class="mt-1.5 text-[13.5px] text-white/55"><?php esc_html_e( 'Your orders will appear here once you place one.', 'bioplus' ); ?></p>
			<a href="<?php bioplus_the_url( 'shop' ); ?>" class="brand-gradient mt-6 inline-block rounded-full px-6 py-3 text-sm font-bold text-white"><?php esc_html_e( 'Shop the catalogue', 'bioplus' ); ?></a>
		</div>
	<?php else : ?>
		<?php foreach ( $customer_orders->orders as $customer_order ) : ?>
			<?php
			$order = wc_get_order( $customer_order );
			if ( ! $order ) {
				continue;
			}
			$status   = bioplus_order_status( $order );
			$coa      = (array) $order->get_meta( '_bioplus_coa_files' );
			$tracking = $order->get_meta( '_bioplus_tracking_number' );
			$carrier  = $order->get_meta( '_bioplus_tracking_carrier' );
			?>
			<div class="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
				<div class="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
					<div class="flex items-center gap-3">
						<span class="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/15 text-brand-300"><?php bioplus_the_icon( 'package', 18 ); ?></span>
						<div>
							<a href="<?php echo esc_url( $order->get_view_order_url() ); ?>" class="font-display text-base font-bold text-white hover:text-brand-300">#<?php echo esc_html( $order->get_order_number() ); ?></a>
							<p class="text-[12px] text-white/50"><?php echo esc_html( sprintf( /* translators: %s: date. */ __( 'Placed %s', 'bioplus' ), wc_format_datetime( $order->get_date_created(), 'j M Y' ) ) ); ?></p>
						</div>
					</div>
					<span class="<?php echo esc_attr( 'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ' . $status[1] ); ?>"><?php echo esc_html( $status[0] ); ?></span>
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
							<span><?php echo esc_html( $item->get_quantity() . ' × ' . bioplus_line_name( $prod ? $prod : false ) . ' ' . bioplus_line_label( $prod ? $prod : false ) ); ?> <?php if ( $prod && $prod->get_sku() ) : ?><span class="text-white/40">(<?php echo esc_html( $prod->get_sku() ); ?>)</span><?php endif; ?></span>
							<span class="text-white/50"><?php echo esc_html( bioplus_money( (float) $item->get_subtotal() + (float) $item->get_subtotal_tax() ) ); ?></span>
						</li>
					<?php endforeach; ?>
				</ul>

				<?php if ( bioplus_order_awaiting_payment( $order ) && 'bacs' === $order->get_payment_method() ) : ?>
					<div class="mt-4 rounded-xl border border-amber-400/25 bg-amber-500/10 p-4">
						<p class="flex items-center gap-2 text-[12.5px] font-semibold text-amber-200"><?php bioplus_the_icon( 'landmark', 15 ); ?> <?php echo esc_html( sprintf( /* translators: %s: amount. */ __( 'Awaiting your bank transfer of %s', 'bioplus' ), bioplus_money( (float) $order->get_total() ) ) ); ?></p>
						<?php if ( bioplus_has_bank_details() ) : ?>
							<?php bioplus_bank_details_list( $order->get_order_number(), array( 'tone' => 'dark', 'class' => 'mt-2' ) ); ?>
						<?php else : ?>
							<p class="mt-1.5 text-[12.5px] text-amber-100/80"><?php esc_html_e( "We'll email you the account details — please quote", 'bioplus' ); ?> <strong class="font-semibold"><?php echo esc_html( $order->get_order_number() ); ?></strong> <?php esc_html_e( 'as your reference.', 'bioplus' ); ?></p>
						<?php endif; ?>
						<a href="<?php echo esc_url( $order->get_checkout_order_received_url() ); ?>" class="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-brand-300 hover:text-brand-200"><?php esc_html_e( 'Open payment page', 'bioplus' ); ?> <?php bioplus_the_icon( 'external-link', 13 ); ?></a>
					</div>
				<?php endif; ?>

				<div class="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
					<div class="text-[13px] text-white/55">
						<?php if ( $tracking ) : ?>
							<?php esc_html_e( 'Tracking:', 'bioplus' ); ?> <span class="font-semibold text-brand-300"><?php echo esc_html( ( $carrier ? $carrier . ' · ' : '' ) . $tracking ); ?></span>
						<?php else : ?>
							<?php esc_html_e( 'Tracking available once shipped', 'bioplus' ); ?>
						<?php endif; ?>
					</div>
					<div class="flex items-center gap-4">
						<span class="font-display text-lg font-bold text-white"><?php echo esc_html( bioplus_money( (float) $order->get_total() ) ); ?></span>
						<?php if ( $coa ) : ?>
							<a href="<?php echo esc_url( wc_get_account_endpoint_url( 'coa-files' ) ); ?>" class="inline-flex items-center gap-1 text-[13px] font-semibold text-brand-300 hover:text-brand-200"><?php echo esc_html( sprintf( /* translators: %d: count. */ __( 'View COA (%d)', 'bioplus' ), count( $coa ) ) ); ?></a>
						<?php endif; ?>
						<a href="<?php echo esc_url( $order->get_view_order_url() ); ?>" class="inline-flex items-center gap-1 text-[13px] font-semibold text-white/70 hover:text-white"><?php esc_html_e( 'Details', 'bioplus' ); ?> <?php bioplus_the_icon( 'chevron-right', 14 ); ?></a>
					</div>
				</div>
			</div>
		<?php endforeach; ?>

		<?php if ( 1 < $customer_orders->max_num_pages ) : ?>
			<div class="flex justify-between">
				<?php if ( 1 !== $current_page ) : ?>
					<a class="rounded-full border border-white/15 px-4 py-2 text-[13px] font-semibold text-white hover:border-brand-400" href="<?php echo esc_url( wc_get_endpoint_url( 'orders', $current_page - 1 ) ); ?>"><?php esc_html_e( 'Newer orders', 'bioplus' ); ?></a>
				<?php endif; ?>
				<?php if ( intval( $customer_orders->max_num_pages ) !== $current_page ) : ?>
					<a class="ml-auto rounded-full border border-white/15 px-4 py-2 text-[13px] font-semibold text-white hover:border-brand-400" href="<?php echo esc_url( wc_get_endpoint_url( 'orders', $current_page + 1 ) ); ?>"><?php esc_html_e( 'Older orders', 'bioplus' ); ?></a>
				<?php endif; ?>
			</div>
		<?php endif; ?>
	<?php endif; ?>
</div>
