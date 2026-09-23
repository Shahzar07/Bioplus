<?php
/**
 * My Account as the "Research Hub": menu, endpoints, research address,
 * account details, registration fields, sign-in / register pages.
 *
 * @package BioPlus
 */

if ( ! defined( 'ABSPATH' ) ) {
	return;
}

/**
 * Custom endpoints: Files & COA (/account/files) and Research Address.
 */
function bioplus_account_endpoints() {
	add_rewrite_endpoint( 'files', EP_ROOT | EP_PAGES );
	add_rewrite_endpoint( 'research-address', EP_ROOT | EP_PAGES );
}
add_action( 'init', 'bioplus_account_endpoints' );

/**
 * Register the endpoints with WooCommerce so wc_get_account_endpoint_url() works.
 *
 * @param array $vars Query vars.
 * @return array
 */
function bioplus_account_query_vars( $vars ) {
	$vars['coa-files']        = 'files';
	$vars['research-address'] = 'research-address';
	return $vars;
}
add_filter( 'woocommerce_get_query_vars', 'bioplus_account_query_vars' );

/**
 * Research Hub navigation (AccountShell.tsx NAV).
 *
 * @return array<string,array{0:string,1:string}> endpoint => [label, icon]
 */
function bioplus_account_nav() {
	return array(
		'dashboard'        => array( __( 'Research Hub', 'bioplus' ), 'layout-dashboard' ),
		'orders'           => array( __( 'Orders', 'bioplus' ), 'package' ),
		'coa-files'        => array( __( 'Files & COA', 'bioplus' ), 'file-text' ),
		'research-address' => array( __( 'Research Address', 'bioplus' ), 'map-pin' ),
		'edit-account'     => array( __( 'Account Settings', 'bioplus' ), 'settings' ),
	);
}

/**
 * Menu items WooCommerce knows about.
 *
 * @return array
 */
function bioplus_account_menu_items() {
	$items = array();
	foreach ( bioplus_account_nav() as $key => $item ) {
		$items[ $key ] = $item[0];
	}
	$items['customer-logout'] = __( 'Log out', 'bioplus' );
	return $items;
}
add_filter( 'woocommerce_account_menu_items', 'bioplus_account_menu_items', 99 );

/**
 * Endpoint titles.
 *
 * @param string $title    Title.
 * @param string $endpoint Endpoint.
 * @return string
 */
function bioplus_account_endpoint_title( $title, $endpoint ) {
	$nav = bioplus_account_nav();
	return isset( $nav[ $endpoint ] ) ? $nav[ $endpoint ][0] : $title;
}
add_filter( 'woocommerce_endpoint_coa-files_title', 'bioplus_account_endpoint_title', 10, 2 );
add_filter( 'woocommerce_endpoint_research-address_title', 'bioplus_account_endpoint_title', 10, 2 );

/**
 * Files & COA content.
 */
function bioplus_account_files_endpoint() {
	wc_get_template( 'myaccount/coa-files.php' );
}
add_action( 'woocommerce_account_coa-files_endpoint', 'bioplus_account_files_endpoint' );

/**
 * Research address content.
 */
function bioplus_account_address_endpoint() {
	wc_get_template( 'myaccount/research-address.php' );
}
add_action( 'woocommerce_account_research-address_endpoint', 'bioplus_account_address_endpoint' );

/**
 * COA files attached to the current customer's orders.
 *
 * @param int $user_id User.
 * @return array[]
 */
function bioplus_customer_coa_files( $user_id ) {
	$files  = array();
	$orders = wc_get_orders(
		array(
			'customer_id' => $user_id,
			'limit'       => -1,
			'orderby'     => 'date',
			'order'       => 'DESC',
		)
	);
	foreach ( $orders as $order ) {
		foreach ( (array) $order->get_meta( '_bioplus_coa_files' ) as $f ) {
			if ( empty( $f['id'] ) ) {
				continue;
			}
			$url = wp_get_attachment_url( (int) $f['id'] );
			if ( ! $url ) {
				continue;
			}
			$files[] = array(
				'url'      => $url,
				'label'    => ! empty( $f['label'] ) ? $f['label'] : basename( (string) get_attached_file( (int) $f['id'] ) ),
				'batch'    => isset( $f['batch'] ) ? $f['batch'] : '',
				'order'    => $order->get_order_number(),
				'order_id' => $order->get_id(),
				'date'     => ! empty( $f['added'] ) ? (int) $f['added'] : ( $order->get_date_created() ? $order->get_date_created()->getTimestamp() : time() ),
			);
		}
	}
	return $files;
}

/**
 * Save the research address (billing + shipping).
 */
function bioplus_save_research_address() {
	if ( ! isset( $_POST['bioplus_address_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['bioplus_address_nonce'] ) ), 'bioplus_research_address' ) ) {
		return;
	}
	$user_id = get_current_user_id();
	if ( ! $user_id ) {
		return;
	}
	$get = static function ( $key ) {
		return isset( $_POST[ $key ] ) ? sanitize_text_field( wp_unslash( $_POST[ $key ] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Missing -- verified above.
	};

	$data = array(
		'company'    => $get( 'org' ),
		'first_name' => $get( 'first_name' ),
		'last_name'  => $get( 'last_name' ),
		'address_1'  => $get( 'line1' ),
		'address_2'  => $get( 'line2' ),
		'city'       => $get( 'city' ),
		'state'      => $get( 'county' ),
		'postcode'   => wc_format_postcode( $get( 'postcode' ), $get( 'country' ) ),
		'country'    => in_array( $get( 'country' ), array( 'GB', 'IE' ), true ) ? $get( 'country' ) : 'GB',
	);
	foreach ( array( 'first_name' => __( 'first name', 'bioplus' ), 'last_name' => __( 'last name', 'bioplus' ), 'address_1' => __( 'address', 'bioplus' ), 'city' => __( 'town or city', 'bioplus' ), 'postcode' => __( 'postcode', 'bioplus' ) ) as $field => $label ) {
		if ( '' === $data[ $field ] ) {
			/* translators: %s: field label. */
			wc_add_notice( sprintf( __( 'Enter your %s.', 'bioplus' ), $label ), 'error' );
			return;
		}
	}

	$customer = new WC_Customer( $user_id );
	foreach ( $data as $key => $value ) {
		$customer->{"set_billing_$key"}( $value );
		$customer->{"set_shipping_$key"}( $value );
	}
	$customer->save();

	wc_add_notice( __( 'Research address saved.', 'bioplus' ) );
	wp_safe_redirect( wc_get_account_endpoint_url( 'research-address' ) );
	exit;
}
add_action( 'template_redirect', 'bioplus_save_research_address' );

/**
 * Account details: a display name is derived from first + last name.
 *
 * @param array $required Required fields.
 * @return array
 */
function bioplus_account_required_fields( $required ) {
	unset( $required['account_display_name'] );
	return $required;
}
add_filter( 'woocommerce_save_account_details_required_fields', 'bioplus_account_required_fields' );

/**
 * Save phone and institution with the account details.
 *
 * @param int $user_id User.
 */
function bioplus_save_account_extras( $user_id ) {
	// phpcs:disable WordPress.Security.NonceVerification.Missing -- WooCommerce verified the account details nonce.
	$customer = new WC_Customer( $user_id );
	if ( isset( $_POST['account_phone'] ) ) {
		$customer->set_billing_phone( sanitize_text_field( wp_unslash( $_POST['account_phone'] ) ) );
	}
	if ( isset( $_POST['account_organisation'] ) ) {
		$customer->set_billing_company( sanitize_text_field( wp_unslash( $_POST['account_organisation'] ) ) );
	}
	$name = trim( $customer->get_first_name() . ' ' . $customer->get_last_name() );
	if ( $name ) {
		$customer->set_display_name( $name );
	}
	$customer->save();
	// phpcs:enable
}
add_action( 'woocommerce_save_account_details', 'bioplus_save_account_extras' );

/**
 * Password rule from the original: at least 10 characters.
 *
 * @param WP_Error $errors Errors.
 */
function bioplus_account_password_rule( $errors ) {
	// phpcs:ignore WordPress.Security.NonceVerification.Missing
	$pass = isset( $_POST['password_1'] ) ? (string) wp_unslash( $_POST['password_1'] ) : ''; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
	if ( '' !== $pass && strlen( $pass ) < 10 ) {
		$errors->add( 'password', __( 'Your new password must be at least 10 characters.', 'bioplus' ) );
	}
}
add_action( 'woocommerce_save_account_details_errors', 'bioplus_account_password_rule' );

/**
 * Registration: name required, password ≥ 10 characters.
 *
 * @param string   $username Username.
 * @param string   $email    Email.
 * @param WP_Error $errors   Errors.
 */
function bioplus_validate_registration( $username, $email, $errors ) {
	// phpcs:disable WordPress.Security.NonceVerification.Missing -- WooCommerce verified the register nonce.
	if ( isset( $_POST['bioplus_register'] ) ) {
		if ( empty( $_POST['full_name'] ) ) {
			$errors->add( 'full_name', __( 'Enter your name.', 'bioplus' ) );
		}
		$pass = isset( $_POST['password'] ) ? (string) wp_unslash( $_POST['password'] ) : ''; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		if ( strlen( $pass ) < 10 ) {
			$errors->add( 'password', __( 'Choose a password of at least 10 characters.', 'bioplus' ) );
		}
	}
	// phpcs:enable
}
add_action( 'woocommerce_register_post', 'bioplus_validate_registration', 10, 3 );

/**
 * Save the name and institution given at registration.
 *
 * @param int $customer_id Customer.
 */
function bioplus_save_registration( $customer_id ) {
	// phpcs:disable WordPress.Security.NonceVerification.Missing
	if ( empty( $_POST['full_name'] ) ) {
		return;
	}
	$name     = sanitize_text_field( wp_unslash( $_POST['full_name'] ) );
	$parts    = preg_split( '/\s+/', $name, 2 );
	$customer = new WC_Customer( $customer_id );
	$customer->set_first_name( $parts[0] );
	$customer->set_last_name( isset( $parts[1] ) ? $parts[1] : '' );
	$customer->set_billing_first_name( $parts[0] );
	$customer->set_billing_last_name( isset( $parts[1] ) ? $parts[1] : '' );
	$customer->set_display_name( $name );
	if ( ! empty( $_POST['organisation'] ) ) {
		$customer->set_billing_company( sanitize_text_field( wp_unslash( $_POST['organisation'] ) ) );
	}
	$customer->save();
	// phpcs:enable
}
add_action( 'woocommerce_created_customer', 'bioplus_save_registration' );

/**
 * After sign-in or registration, go to the requested page or the Research Hub.
 *
 * @param string $redirect Redirect.
 * @return string
 */
function bioplus_auth_redirect( $redirect ) {
	// phpcs:ignore WordPress.Security.NonceVerification.Missing
	$next = isset( $_POST['next'] ) ? esc_url_raw( wp_unslash( $_POST['next'] ) ) : '';
	if ( $next ) {
		return wp_validate_redirect( $next, wc_get_page_permalink( 'myaccount' ) );
	}
	return $redirect ? $redirect : wc_get_page_permalink( 'myaccount' );
}
add_filter( 'woocommerce_login_redirect', 'bioplus_auth_redirect' );
add_filter( 'woocommerce_registration_redirect', 'bioplus_auth_redirect' );

/**
 * Signed-in visitors skip the sign-in and register pages.
 */
function bioplus_auth_pages_redirect() {
	if ( ! is_user_logged_in() || ! is_page() ) {
		return;
	}
	$template = get_page_template_slug();
	if ( in_array( $template, array( 'page-templates/template-login.php', 'page-templates/template-register.php' ), true ) ) {
		wp_safe_redirect( wc_get_page_permalink( 'myaccount' ) );
		exit;
	}
}
add_action( 'template_redirect', 'bioplus_auth_pages_redirect' );

/**
 * Render the sign-in / register card (AuthForm.tsx).
 *
 * @param string $mode login|register.
 */
function bioplus_auth_form( $mode = 'login' ) {
	wc_get_template( 'myaccount/bioplus-auth.php', array( 'mode' => $mode ) );
}

/**
 * Dark form field for the Research Hub panels (DarkForm.tsx → DarkField).
 *
 * @param array $a label, name, value, type, required, placeholder, hint, autocomplete, id.
 */
function bioplus_dark_field( $a ) {
	$a  = wp_parse_args(
		$a,
		array(
			'label'        => '',
			'name'         => '',
			'value'        => '',
			'type'         => 'text',
			'required'     => false,
			'placeholder'  => '',
			'hint'         => '',
			'autocomplete' => '',
			'id'           => '',
		)
	);
	$id = $a['id'] ? $a['id'] : $a['name'];
	?>
	<div>
		<label for="<?php echo esc_attr( $id ); ?>" class="mb-1.5 block text-[13px] font-semibold text-white/70"><?php echo esc_html( $a['label'] ); ?></label>
		<input id="<?php echo esc_attr( $id ); ?>" type="<?php echo esc_attr( $a['type'] ); ?>" name="<?php echo esc_attr( $a['name'] ); ?>" value="<?php echo esc_attr( $a['value'] ); ?>"<?php echo $a['required'] ? ' required' : ''; ?><?php echo $a['autocomplete'] ? ' autocomplete="' . esc_attr( $a['autocomplete'] ) . '"' : ''; ?> placeholder="<?php echo esc_attr( $a['placeholder'] ); ?>" class="h-11 w-full rounded-xl border border-white/12 bg-white/[0.04] px-3.5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-brand-400">
		<?php if ( $a['hint'] ) : ?>
			<p class="mt-1.5 text-[11.5px] text-white/40"><?php echo esc_html( $a['hint'] ); ?></p>
		<?php endif; ?>
	</div>
	<?php
}

/**
 * Light auth field (AuthForm.tsx → Field).
 *
 * @param array $a Same keys as bioplus_dark_field().
 */
function bioplus_light_field( $a ) {
	$a  = wp_parse_args(
		$a,
		array(
			'label'        => '',
			'name'         => '',
			'value'        => '',
			'type'         => 'text',
			'required'     => false,
			'placeholder'  => '',
			'hint'         => '',
			'autocomplete' => '',
			'id'           => '',
		)
	);
	$id = $a['id'] ? $a['id'] : $a['name'];
	?>
	<div>
		<label for="<?php echo esc_attr( $id ); ?>" class="mb-1.5 block text-[13px] font-semibold text-ink-800"><?php echo esc_html( $a['label'] ); ?></label>
		<input id="<?php echo esc_attr( $id ); ?>" type="<?php echo esc_attr( $a['type'] ); ?>" name="<?php echo esc_attr( $a['name'] ); ?>" value="<?php echo esc_attr( $a['value'] ); ?>"<?php echo $a['required'] ? ' required' : ''; ?><?php echo $a['autocomplete'] ? ' autocomplete="' . esc_attr( $a['autocomplete'] ) . '"' : ''; ?> placeholder="<?php echo esc_attr( $a['placeholder'] ); ?>" class="h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm outline-none transition focus:border-brand-500">
		<?php if ( $a['hint'] ) : ?>
			<p class="mt-1.5 text-[11.5px] text-ink-500"><?php echo esc_html( $a['hint'] ); ?></p>
		<?php endif; ?>
	</div>
	<?php
}
