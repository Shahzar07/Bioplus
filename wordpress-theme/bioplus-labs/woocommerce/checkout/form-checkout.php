<?php
/**
 * Checkout (CheckoutClient.tsx) on WooCommerce's checkout engine.
 *
 * Totals and the payment block are WooCommerce fragments (review-order.php,
 * payment.php) so they refresh as the discount or country changes; the order
 * is placed by WooCommerce and lands in WooCommerce → Orders.
 *
 * @package BioPlus
 * @version 9.4.0
 * @var WC_Checkout $checkout
 */

defined( 'ABSPATH' ) || exit;

if ( ! $checkout->is_registration_enabled() && $checkout->is_registration_required() && ! is_user_logged_in() ) {
	echo esc_html( apply_filters( 'woocommerce_checkout_must_be_logged_in_message', __( 'You must be logged in to checkout.', 'woocommerce' ) ) );
	return;
}

$fields = $checkout->get_checkout_fields();
$bf     = isset( $fields['billing'] ) ? $fields['billing'] : array();

/**
 * One input in the original's style, bound to a WooCommerce checkout field.
 *
 * @param WC_Checkout $checkout Checkout.
 * @param array       $bf       Billing fields.
 * @param string      $key      Field key.
 * @param bool        $full     Span both columns.
 * @param string      $type     Input type.
 */
$field = static function ( $checkout, $bf, $key, $full = false, $type = 'text' ) {
	if ( ! isset( $bf[ $key ] ) ) {
		return;
	}
	$f     = $bf[ $key ];
	$value = $checkout->get_value( $key );
	if ( 'billing_country' === $key ) {
		$countries = WC()->countries->get_allowed_countries();
		$value     = $value ? $value : WC()->countries->get_base_country();
		?>
		<div class="form-row" id="billing_country_field">
			<label for="billing_country" class="mb-1.5 block text-[13px] font-semibold text-ink-800"><?php echo esc_html( $f['label'] ); ?></label>
			<select id="billing_country" name="billing_country" class="country_to_state country_select h-11 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none focus:border-brand-500" autocomplete="country">
				<?php foreach ( $countries as $code => $name ) : ?>
					<option value="<?php echo esc_attr( $code ); ?>"<?php selected( $value, $code ); ?>><?php echo esc_html( $name ); ?></option>
				<?php endforeach; ?>
			</select>
		</div>
		<?php
		return;
	}
	$auto = array(
		'billing_email'      => 'email',
		'billing_phone'      => 'tel',
		'billing_company'    => 'organization',
		'billing_first_name' => 'given-name',
		'billing_last_name'  => 'family-name',
		'billing_address_1'  => 'address-line1',
		'billing_address_2'  => 'address-line2',
		'billing_city'       => 'address-level2',
		'billing_state'      => 'address-level1',
		'billing_postcode'   => 'postal-code',
	);
	?>
	<div class="<?php echo esc_attr( bioplus_cn( 'form-row', $full ? 'sm:col-span-2' : '' ) ); ?>" id="<?php echo esc_attr( $key ); ?>_field">
		<label for="<?php echo esc_attr( $key ); ?>" class="mb-1.5 block text-[13px] font-semibold text-ink-800"><?php echo esc_html( $f['label'] ); ?></label>
		<input type="<?php echo esc_attr( $type ); ?>" id="<?php echo esc_attr( $key ); ?>" name="<?php echo esc_attr( $key ); ?>" value="<?php echo esc_attr( $value ); ?>" placeholder="<?php echo esc_attr( isset( $f['placeholder'] ) ? $f['placeholder'] : '' ); ?>"<?php echo ! empty( $f['required'] ) ? ' required' : ''; ?> autocomplete="<?php echo esc_attr( isset( $auto[ $key ] ) ? $auto[ $key ] : 'on' ); ?>" class="input-text h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm outline-none transition focus:border-brand-500">
	</div>
	<?php
};

$fieldset_open = static function ( $step, $title ) {
	?>
	<section class="overflow-hidden rounded-xl border border-line bg-white shadow-card">
		<h2 class="font-display flex items-center gap-3 border-b border-line bg-mist px-6 py-4 text-[17px] font-bold">
			<span class="brand-gradient grid h-7 w-7 place-items-center rounded-md text-[13px] font-bold text-white"><?php echo esc_html( $step ); ?></span>
			<?php echo esc_html( $title ); ?>
		</h2>
		<div class="grid gap-4 p-6 sm:grid-cols-2">
	<?php
};
$fieldset_close = static function () {
	echo '</div></section>';
};
?>
<div class="<?php echo esc_attr( bioplus_container( 'default', 'py-12' ) ); ?>">
	<a href="<?php bioplus_the_url( 'cart' ); ?>" class="inline-flex items-center gap-2 text-sm font-semibold text-ink-700 hover:text-brand-700"><?php bioplus_the_icon( 'arrow-left', 16 ); ?> <?php esc_html_e( 'Back to cart', 'bioplus' ); ?></a>
	<h1 class="font-display mt-4 text-4xl font-extrabold tracking-tight"><?php esc_html_e( 'Checkout', 'bioplus' ); ?></h1>

	<?php if ( ! is_user_logged_in() ) : ?>
		<p class="mt-3 text-[13.5px] text-ink-600">
			<?php esc_html_e( 'Checking out as a guest.', 'bioplus' ); ?>
			<a href="<?php echo esc_url( add_query_arg( 'next', rawurlencode( wc_get_checkout_url() ), bioplus_url( 'login' ) ) ); ?>" class="font-semibold text-brand-700 hover:underline"><?php esc_html_e( 'Sign in', 'bioplus' ); ?></a>
			<?php esc_html_e( 'to use a saved address and keep this order in your Research Hub.', 'bioplus' ); ?>
		</p>
	<?php endif; ?>

	<?php do_action( 'woocommerce_before_checkout_form', $checkout ); ?>

	<form name="checkout" method="post" class="checkout woocommerce-checkout mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]" action="<?php echo esc_url( wc_get_checkout_url() ); ?>" enctype="multipart/form-data" novalidate data-bioplus-checkout>
		<div class="space-y-8">
			<div class="woocommerce-NoticeGroup-slot"><?php bioplus_print_notices(); ?></div>

			<?php do_action( 'woocommerce_checkout_before_customer_details' ); ?>
			<div id="customer_details" class="woocommerce-billing-fields space-y-8">
				<?php
				$fieldset_open( '1', __( 'Contact information', 'bioplus' ) );
				$field( $checkout, $bf, 'billing_email', true, 'email' );
				$field( $checkout, $bf, 'billing_phone', true, 'tel' );
				$fieldset_close();

				$fieldset_open( '2', __( 'Research delivery address', 'bioplus' ) );
				$field( $checkout, $bf, 'billing_company', true );
				$field( $checkout, $bf, 'billing_first_name' );
				$field( $checkout, $bf, 'billing_last_name' );
				$field( $checkout, $bf, 'billing_address_1', true );
				$field( $checkout, $bf, 'billing_address_2', true );
				$field( $checkout, $bf, 'billing_city' );
				$field( $checkout, $bf, 'billing_state' );
				$field( $checkout, $bf, 'billing_postcode' );
				$field( $checkout, $bf, 'billing_country' );

				if ( ! is_user_logged_in() && $checkout->is_registration_enabled() ) :
					?>
					<div class="sm:col-span-2">
						<label class="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-mist p-4 text-[13px] text-ink-700">
							<input type="checkbox" name="createaccount" value="1" class="mt-0.5 h-4 w-4 accent-brand-600" <?php checked( ( true === $checkout->get_value( 'createaccount' ) || ( true === apply_filters( 'woocommerce_create_account_default_checked', false ) ) ), true ); ?> data-create-account>
							<span><strong class="font-semibold text-ink-900"><?php esc_html_e( 'Create a Research Hub account', 'bioplus' ); ?></strong> — <?php esc_html_e( 'track this order and download its Certificates of Analysis.', 'bioplus' ); ?></span>
						</label>
						<?php if ( 'no' === get_option( 'woocommerce_registration_generate_password' ) ) : ?>
							<div class="mt-3 hidden" data-create-account-fields>
								<label for="account_password" class="mb-1.5 block text-[13px] font-semibold text-ink-800"><?php esc_html_e( 'Choose a password', 'bioplus' ); ?></label>
								<input type="password" id="account_password" name="account_password" autocomplete="new-password" class="input-text h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm outline-none transition focus:border-brand-500">
							</div>
						<?php endif; ?>
					</div>
					<?php
				endif;
				$fieldset_close();
				?>
			</div>
			<?php do_action( 'woocommerce_checkout_after_customer_details' ); ?>

			<?php $fieldset_open( '3', __( 'Payment method', 'bioplus' ) ); ?>
				<div class="col-span-full space-y-3">
					<?php woocommerce_checkout_payment(); ?>
					<?php if ( isset( $fields['order']['order_comments'] ) ) : ?>
						<div class="sm:col-span-2">
							<label for="order_comments" class="mb-1.5 block text-[13px] font-semibold text-ink-800"><?php echo esc_html( $fields['order']['order_comments']['label'] ); ?></label>
							<input type="text" id="order_comments" name="order_comments" value="<?php echo esc_attr( $checkout->get_value( 'order_comments' ) ); ?>" placeholder="<?php echo esc_attr( $fields['order']['order_comments']['placeholder'] ); ?>" class="input-text h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm outline-none transition focus:border-brand-500">
						</div>
					<?php endif; ?>
				</div>
			<?php $fieldset_close(); ?>

			<label class="flex cursor-pointer items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
				<input type="checkbox" name="bioplus_ruo" value="1" class="mt-0.5 h-4 w-4 accent-brand-600" required data-ruo>
				<span class="text-[12.5px] leading-relaxed text-amber-900">
					<?php bioplus_the_icon( 'flask-conical', 14, 'mr-1 inline text-amber-600' ); ?>
					<?php esc_html_e( 'I certify that I am purchasing for legitimate research purposes, am at least 18 years of age, and that all products will be used solely for laboratory research in accordance with applicable laws. Products are not for human or animal consumption.', 'bioplus' ); ?>
				</span>
			</label>
		</div>

		<aside class="lg:sticky lg:top-24 lg:self-start">
			<div class="rounded-2xl border border-line bg-white p-6 shadow-card">
				<h2 class="font-display text-lg font-bold" id="order_review_heading"><?php esc_html_e( 'Order summary', 'bioplus' ); ?></h2>
				<ul class="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
					<?php foreach ( bioplus_cart_lines() as $l ) : ?>
						<li class="flex items-center gap-3">
							<span class="relative flex h-14 w-12 items-center justify-center rounded-lg bg-white">
								<img src="<?php echo esc_url( $l['image'] ); ?>" alt="<?php echo esc_attr( $l['name'] ); ?>" width="880" height="1200" loading="lazy" class="object-contain h-12 w-auto">
								<span class="brand-gradient absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold text-white"><?php echo esc_html( $l['qty'] ); ?></span>
							</span>
							<span class="min-w-0 flex-1">
								<span class="block truncate text-[13px] font-semibold"><?php echo esc_html( $l['name'] ); ?></span>
								<span class="block truncate text-[11px] text-ink-500"><?php echo esc_html( $l['label'] ); ?></span>
							</span>
							<span class="text-[13px] font-bold"><?php echo esc_html( bioplus_money( $l['line_total'] ) ); ?></span>
						</li>
					<?php endforeach; ?>
				</ul>

				<?php if ( wc_coupons_enabled() ) : ?>
					<div class="mt-5 border-t border-line pt-4" data-coupon>
						<label for="discount-draft" class="mb-1.5 block text-[12.5px] font-semibold text-ink-700"><?php esc_html_e( 'Discount code', 'bioplus' ); ?></label>
						<div class="flex gap-2">
							<input id="discount-draft" type="text" placeholder="<?php esc_attr_e( 'Optional', 'bioplus' ); ?>" class="h-10 min-w-0 flex-1 rounded-xl border border-line bg-white px-3 text-sm uppercase outline-none transition focus:border-brand-500" data-coupon-input>
							<button type="button" class="h-10 shrink-0 rounded-xl border border-ink-900/15 px-4 text-[13px] font-semibold text-ink-800 transition hover:border-brand-500 hover:text-brand-700" data-coupon-apply><?php esc_html_e( 'Apply', 'bioplus' ); ?></button>
						</div>
						<p class="mt-1.5 hidden text-[11.5px] font-medium text-red-700" data-coupon-error></p>
					</div>
				<?php endif; ?>

				<?php do_action( 'woocommerce_checkout_before_order_review' ); ?>
				<div id="order_review" class="woocommerce-checkout-review-order">
					<?php woocommerce_order_review(); ?>
				</div>
				<?php do_action( 'woocommerce_checkout_after_order_review' ); ?>

				<?php wp_nonce_field( 'woocommerce-process_checkout', 'woocommerce-process-checkout-nonce' ); ?>
				<button type="submit" name="woocommerce_checkout_place_order" id="place_order" value="<?php esc_attr_e( 'Place order', 'bioplus' ); ?>" data-value="<?php esc_attr_e( 'Place order', 'bioplus' ); ?>" disabled class="brand-gradient mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-bold text-white transition enabled:hover:brightness-110 disabled:opacity-40" data-place-order>
					<?php bioplus_the_icon( 'lock', 16 ); ?>
					<span data-place-label><?php esc_html_e( 'Place order', 'bioplus' ); ?> — <span data-place-total><?php echo esc_html( bioplus_money( (float) WC()->cart->get_total( 'edit' ) ) ); ?></span></span>
				</button>

				<div class="mt-4 flex items-center justify-center gap-4 text-[11px] text-ink-500">
					<span class="flex items-center gap-1"><?php bioplus_the_icon( 'shield-check', 13, 'text-brand-600' ); ?> <?php esc_html_e( 'SSL secure', 'bioplus' ); ?></span>
					<span class="flex items-center gap-1"><?php bioplus_the_icon( 'flask-conical', 13, 'text-brand-600' ); ?> <?php esc_html_e( 'Research Use Only', 'bioplus' ); ?></span>
				</div>
			</div>
		</aside>
	</form>

	<?php do_action( 'woocommerce_after_checkout_form', $checkout ); ?>
</div>
