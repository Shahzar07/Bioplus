<?php
/**
 * Checkout: field set, research-use declaration, labels.
 *
 * Orders are ordinary WooCommerce orders — they appear under WooCommerce →
 * Orders, trigger the standard emails and decrement stock. The theme only
 * shapes the fields and adds the research-use declaration the original
 * required before an order could be placed.
 *
 * @package BioPlus
 */

if ( ! defined( 'ABSPATH' ) ) {
	return;
}

/**
 * Billing fields as the original checkout asked for them; delivery goes to
 * the billing address (the "research delivery address").
 *
 * @param array $fields Checkout fields.
 * @return array
 */
function bioplus_checkout_fields( $fields ) {
	$b = isset( $fields['billing'] ) ? $fields['billing'] : array();

	$set = array(
		'billing_email'      => array( __( 'Email address', 'bioplus' ), true, 'researcher@lab.ac.uk', 10 ),
		'billing_phone'      => array( __( 'Phone', 'bioplus' ), false, '07700 900123', 20 ),
		'billing_company'    => array( __( 'Institution / Lab (optional)', 'bioplus' ), false, __( 'University Research Lab', 'bioplus' ), 30 ),
		'billing_first_name' => array( __( 'First name', 'bioplus' ), true, '', 40 ),
		'billing_last_name'  => array( __( 'Last name', 'bioplus' ), true, '', 50 ),
		'billing_address_1'  => array( __( 'Address line 1', 'bioplus' ), true, __( 'House number and street', 'bioplus' ), 60 ),
		'billing_address_2'  => array( __( 'Address line 2 (optional)', 'bioplus' ), false, '', 70 ),
		'billing_city'       => array( __( 'Town / City', 'bioplus' ), true, '', 80 ),
		'billing_state'      => array( __( 'County (optional)', 'bioplus' ), false, '', 90 ),
		'billing_postcode'   => array( __( 'Postcode', 'bioplus' ), true, 'EH32 9BZ', 100 ),
		'billing_country'    => array( __( 'Country', 'bioplus' ), true, '', 110 ),
	);
	foreach ( $set as $key => $def ) {
		if ( ! isset( $b[ $key ] ) ) {
			$b[ $key ] = array( 'type' => 'text' );
		}
		$b[ $key ]['label']       = $def[0];
		$b[ $key ]['required']    = $def[1];
		$b[ $key ]['placeholder'] = $def[2];
		$b[ $key ]['priority']    = $def[3];
	}
	$fields['billing'] = $b;

	if ( isset( $fields['order']['order_comments'] ) ) {
		$fields['order']['order_comments']['label']       = __( 'Order notes (optional)', 'bioplus' );
		$fields['order']['order_comments']['placeholder'] = __( 'Anything we should know about this order', 'bioplus' );
		$fields['order']['order_comments']['type']        = 'text';
	}
	return $fields;
}
add_filter( 'woocommerce_checkout_fields', 'bioplus_checkout_fields', 20 );

/**
 * The county is optional in the UK and Ireland.
 *
 * @param array $locale Locale rules.
 * @return array
 */
function bioplus_country_locale( $locale ) {
	foreach ( array( 'GB', 'IE' ) as $cc ) {
		$locale[ $cc ]['state']['required'] = false;
		$locale[ $cc ]['state']['label']    = __( 'County (optional)', 'bioplus' );
	}
	return $locale;
}
add_filter( 'woocommerce_get_country_locale', 'bioplus_country_locale' );

/**
 * Deliver to the billing address.
 *
 * @return string
 */
function bioplus_ship_to_billing() {
	return 'billing_only';
}
add_filter( 'pre_option_woocommerce_ship_to_destination', 'bioplus_ship_to_billing' );

/**
 * Require the research-use declaration.
 */
function bioplus_checkout_validate_ruo() {
	// phpcs:ignore WordPress.Security.NonceVerification.Missing -- WooCommerce verified the checkout nonce.
	if ( empty( $_POST['bioplus_ruo'] ) ) {
		wc_add_notice( __( 'Please confirm the research-use declaration.', 'bioplus' ), 'error' );
	}
}
add_action( 'woocommerce_checkout_process', 'bioplus_checkout_validate_ruo' );

/**
 * Record the declaration on the order.
 *
 * @param WC_Order $order Order.
 */
function bioplus_checkout_save_ruo( $order ) {
	// phpcs:ignore WordPress.Security.NonceVerification.Missing
	if ( ! empty( $_POST['bioplus_ruo'] ) ) {
		$order->update_meta_data( '_bioplus_ruo_accepted', current_time( 'mysql' ) );
	}
}
add_action( 'woocommerce_checkout_create_order', 'bioplus_checkout_save_ruo' );

/**
 * Place-order button label.
 *
 * @return string
 */
function bioplus_order_button_text() {
	return __( 'Place order', 'bioplus' );
}
add_filter( 'woocommerce_order_button_text', 'bioplus_order_button_text' );

/**
 * Show the declaration on the admin order screen.
 *
 * @param WC_Order $order Order.
 */
function bioplus_admin_order_ruo( $order ) {
	$at = $order->get_meta( '_bioplus_ruo_accepted' );
	if ( $at ) {
		printf( '<p class="form-field form-field-wide"><strong>%1$s</strong><br>%2$s</p>', esc_html__( 'Research-use declaration', 'bioplus' ), esc_html( sprintf( /* translators: %s: date. */ __( 'Accepted %s', 'bioplus' ), $at ) ) );
	}
}
add_action( 'woocommerce_admin_order_data_after_billing_address', 'bioplus_admin_order_ruo' );

/**
 * The single shipping rate the totals show, as [label, cost].
 *
 * @return array{0:string,1:float,2:string}|null
 */
function bioplus_checkout_shipping() {
	if ( ! WC()->cart || ! WC()->cart->needs_shipping() ) {
		return null;
	}
	$packages = WC()->shipping()->get_packages();
	$chosen   = WC()->session ? (array) WC()->session->get( 'chosen_shipping_methods' ) : array();
	foreach ( $packages as $i => $package ) {
		if ( empty( $package['rates'] ) ) {
			continue;
		}
		$rate_id = isset( $chosen[ $i ] ) && isset( $package['rates'][ $chosen[ $i ] ] ) ? $chosen[ $i ] : key( $package['rates'] );
		$rate    = $package['rates'][ $rate_id ];
		return array( $rate->get_label(), (float) $rate->get_cost() + array_sum( (array) $rate->get_taxes() ), $rate_id );
	}
	return null;
}

/**
 * The bank account customers pay into, from WooCommerce's BACS settings.
 *
 * @return array{account_name:string,bank_name:string,sort_code:string,account_number:string,iban:string,bic:string,instructions:string}
 */
function bioplus_bank_details() {
	$accounts = get_option( 'woocommerce_bacs_accounts', array() );
	$first    = is_array( $accounts ) && $accounts ? reset( $accounts ) : array();
	$settings = get_option( 'woocommerce_bacs_settings', array() );
	return array(
		'account_name'   => isset( $first['account_name'] ) ? (string) $first['account_name'] : '',
		'bank_name'      => isset( $first['bank_name'] ) ? (string) $first['bank_name'] : '',
		'sort_code'      => isset( $first['sort_code'] ) ? bioplus_format_sort_code( (string) $first['sort_code'] ) : '',
		'account_number' => isset( $first['account_number'] ) ? (string) $first['account_number'] : '',
		'iban'           => isset( $first['iban'] ) ? (string) $first['iban'] : '',
		'bic'            => isset( $first['bic'] ) ? (string) $first['bic'] : '',
		'instructions'   => isset( $settings['instructions'] ) ? (string) $settings['instructions'] : '',
	);
}

/**
 * "040605" → "04-06-05".
 *
 * @param string $raw Raw sort code.
 * @return string
 */
function bioplus_format_sort_code( $raw ) {
	$digits = preg_replace( '/\D/', '', $raw );
	if ( 6 !== strlen( $digits ) ) {
		return trim( $raw );
	}
	return substr( $digits, 0, 2 ) . '-' . substr( $digits, 2, 2 ) . '-' . substr( $digits, 4, 2 );
}

/**
 * Rows shown wherever the bank details appear (checkout, thank-you, Research Hub).
 *
 * @param string $reference Payment reference.
 * @return array[]
 */
function bioplus_bank_rows( $reference ) {
	$bank = bioplus_bank_details();
	$rows = array( array( __( 'Account name', 'bioplus' ), $bank['account_name'], false ) );
	if ( $bank['bank_name'] ) {
		$rows[] = array( __( 'Bank', 'bioplus' ), $bank['bank_name'], false );
	}
	$rows[] = array( __( 'Sort code', 'bioplus' ), $bank['sort_code'], false );
	$rows[] = array( __( 'Account number', 'bioplus' ), $bank['account_number'], false );
	if ( $bank['iban'] ) {
		$rows[] = array( 'IBAN', $bank['iban'], false );
	}
	if ( $bank['bic'] ) {
		$rows[] = array( 'BIC / SWIFT', $bank['bic'], false );
	}
	$rows[] = array( __( 'Payment reference', 'bioplus' ), $reference, true );
	return $rows;
}

/**
 * Whether bank details are configured.
 *
 * @return bool
 */
function bioplus_has_bank_details() {
	$bank = bioplus_bank_details();
	return '' !== $bank['account_number'] && '' !== $bank['sort_code'];
}

/**
 * Render the bank details list (BankTransferDetails.tsx).
 *
 * @param string $reference Payment reference.
 * @param array  $opts      tone light|dark, copyable bool, class.
 */
function bioplus_bank_details_list( $reference, $opts = array() ) {
	$opts = wp_parse_args(
		$opts,
		array(
			'tone'     => 'light',
			'copyable' => true,
			'class'    => '',
		)
	);
	$dark = 'dark' === $opts['tone'];
	?>
	<dl class="<?php echo esc_attr( bioplus_cn( 'space-y-0', $opts['class'] ) ); ?>">
		<?php foreach ( bioplus_bank_rows( $reference ) as $row ) : ?>
			<div class="<?php echo esc_attr( $dark ? 'flex items-center justify-between gap-4 border-b py-2.5 last:border-0 border-white/10' : 'flex items-center justify-between gap-4 border-b py-2.5 last:border-0 border-line' ); ?>">
				<dt class="<?php echo esc_attr( $dark ? 'text-sm text-white/55' : 'text-sm text-ink-600' ); ?>"><?php echo esc_html( $row[0] ); ?></dt>
				<dd class="flex items-center gap-2">
					<?php
					if ( $row[2] ) {
						$value_class = $dark ? 'font-display text-base font-bold text-brand-300' : 'font-display text-base font-bold text-brand-700';
					} else {
						$value_class = $dark ? 'text-sm font-semibold text-white' : 'text-sm font-semibold text-ink-900';
					}
					?>
					<span class="<?php echo esc_attr( $value_class ); ?>"><?php echo esc_html( $row[1] ); ?></span>
					<?php if ( $opts['copyable'] ) : ?>
						<button type="button" class="<?php echo esc_attr( $dark ? 'transition text-white/40 hover:text-brand-300' : 'transition text-ink-500 hover:text-brand-600' ); ?>" data-copy="<?php echo esc_attr( $row[1] ); ?>" aria-label="<?php echo esc_attr( sprintf( /* translators: %s: field label. */ __( 'Copy %s', 'bioplus' ), $row[0] ) ); ?>">
							<span data-copy-icon><?php bioplus_the_icon( 'copy', 14 ); ?></span>
							<span class="hidden text-emerald-500" data-copied-icon><?php bioplus_the_icon( 'check', 14 ); ?></span>
						</button>
					<?php endif; ?>
				</dd>
			</div>
		<?php endforeach; ?>
	</dl>
	<?php
}
