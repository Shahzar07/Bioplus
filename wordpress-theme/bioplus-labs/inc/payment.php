<?php
/**
 * Direct bank transfer extras: the payment window, the payment screenshot and
 * the customer's "I have paid" confirmation (PaymentWindow.tsx and the
 * /api/orders/* routes), plus the shop alerts that go with them.
 *
 * Payment is WooCommerce's own BACS gateway: orders land "On hold" (shown as
 * "Awaiting payment") and staff mark them Processing once the money clears.
 * Nothing here ever marks an order paid.
 *
 * @package BioPlus
 */

if ( ! defined( 'ABSPATH' ) ) {
	return;
}

/** Screenshots only. */
define( 'BIOPLUS_PROOF_TYPES', array( 'image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/heic', 'image/heif' ) );
define( 'BIOPLUS_PROOF_MAX_BYTES', 8 * 1024 * 1024 );

/**
 * The theme renders the bank details itself on the order-received page.
 */
function bioplus_remove_bacs_thankyou() {
	$gateways = WC()->payment_gateways() ? WC()->payment_gateways()->payment_gateways() : array();
	if ( isset( $gateways['bacs'] ) ) {
		remove_action( 'woocommerce_thankyou_bacs', array( $gateways['bacs'], 'thankyou_page' ) );
	}
}
add_action( 'woocommerce_init', 'bioplus_remove_bacs_thankyou', 20 );
add_action( 'wp', 'bioplus_remove_bacs_thankyou' );

/**
 * Find an order by ID and verify the caller may act on it (order key, owner or staff).
 *
 * @param int    $order_id Order ID.
 * @param string $key      Order key.
 * @return WC_Order|null
 */
function bioplus_permitted_order( $order_id, $key ) {
	$order = $order_id ? wc_get_order( $order_id ) : null;
	if ( ! $order ) {
		return null;
	}
	if ( $key && hash_equals( (string) $order->get_order_key(), (string) $key ) ) {
		return $order;
	}
	$user = get_current_user_id();
	if ( $user && ( (int) $order->get_customer_id() === $user || current_user_can( 'edit_shop_orders' ) ) ) {
		return $order;
	}
	return null;
}

/**
 * Private storage for payment screenshots (not web-readable).
 *
 * @return string Directory path.
 */
function bioplus_proof_dir() {
	$uploads = wp_upload_dir();
	$dir     = trailingslashit( $uploads['basedir'] ) . 'bioplus-payment-proofs';
	if ( ! is_dir( $dir ) ) {
		wp_mkdir_p( $dir );
	}
	if ( ! file_exists( $dir . '/.htaccess' ) ) {
		// phpcs:disable WordPress.WP.AlternativeFunctions.file_system_operations_file_put_contents
		file_put_contents( $dir . '/.htaccess', "Require all denied\nDeny from all\n" );
		file_put_contents( $dir . '/index.php', "<?php\n// Silence is golden.\n" );
		// phpcs:enable
	}
	return $dir;
}

/**
 * AJAX: upload the payment screenshot.
 */
function bioplus_ajax_payment_proof() {
	check_ajax_referer( 'bioplus_nonce', 'nonce' );

	$order_id = isset( $_POST['order_id'] ) ? absint( $_POST['order_id'] ) : 0;
	$key      = isset( $_POST['key'] ) ? sanitize_text_field( wp_unslash( $_POST['key'] ) ) : '';
	$order    = bioplus_permitted_order( $order_id, $key );
	if ( ! $order ) {
		wp_send_json_error( array( 'message' => __( 'Order not found.', 'bioplus' ) ), 404 );
	}
	if ( empty( $_FILES['file'] ) || ! isset( $_FILES['file']['tmp_name'], $_FILES['file']['size'], $_FILES['file']['name'] ) || UPLOAD_ERR_OK !== (int) $_FILES['file']['error'] ) {
		wp_send_json_error( array( 'message' => __( 'Upload failed. Please try again.', 'bioplus' ) ), 400 );
	}

	$tmp  = $_FILES['file']['tmp_name']; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- a temp path, validated below.
	$size = (int) $_FILES['file']['size'];
	if ( $size > BIOPLUS_PROOF_MAX_BYTES ) {
		wp_send_json_error( array( 'message' => __( 'That image is too large. Try cropping it to just the payment confirmation.', 'bioplus' ) ), 413 );
	}

	$mime = function_exists( 'mime_content_type' ) ? (string) mime_content_type( $tmp ) : '';
	$info = @getimagesize( $tmp ); // phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged
	if ( ! in_array( $mime, BIOPLUS_PROOF_TYPES, true ) || ( false === $info && ! in_array( $mime, array( 'image/heic', 'image/heif', 'image/avif' ), true ) ) ) {
		wp_send_json_error( array( 'message' => __( 'That is not a screenshot. Upload an image of your payment — JPEG, PNG, WebP or HEIC.', 'bioplus' ) ), 415 );
	}

	$ext  = array(
		'image/jpeg' => 'jpg',
		'image/png'  => 'png',
		'image/webp' => 'webp',
		'image/avif' => 'avif',
		'image/heic' => 'heic',
		'image/heif' => 'heif',
	);
	$dir  = bioplus_proof_dir();
	$name = 'order-' . $order->get_id() . '-' . wp_generate_password( 20, false ) . '.' . $ext[ $mime ];

	$old = $order->get_meta( '_bioplus_proof_file' );
	if ( ! move_uploaded_file( $tmp, $dir . '/' . $name ) ) {
		wp_send_json_error( array( 'message' => __( 'Upload failed. Please try again.', 'bioplus' ) ), 500 );
	}
	if ( $old && file_exists( $dir . '/' . basename( $old ) ) ) {
		wp_delete_file( $dir . '/' . basename( $old ) );
	}

	$order->update_meta_data( '_bioplus_proof_file', $name );
	$order->update_meta_data( '_bioplus_proof_mime', $mime );
	$order->update_meta_data( '_bioplus_proof_uploaded_at', time() );
	$order->add_order_note( __( 'Customer uploaded a payment screenshot.', 'bioplus' ) );
	$order->save();

	wp_send_json_success( array( 'url' => bioplus_proof_url( $order ) ) );
}
add_action( 'wp_ajax_bioplus_payment_proof', 'bioplus_ajax_payment_proof' );
add_action( 'wp_ajax_nopriv_bioplus_payment_proof', 'bioplus_ajax_payment_proof' );

/**
 * URL that streams an order's screenshot to the customer (by key) or staff.
 *
 * @param WC_Order $order Order.
 * @return string
 */
function bioplus_proof_url( $order ) {
	return add_query_arg(
		array(
			'action'   => 'bioplus_view_proof',
			'order_id' => $order->get_id(),
			'key'      => $order->get_order_key(),
			'v'        => (int) $order->get_meta( '_bioplus_proof_uploaded_at' ),
		),
		admin_url( 'admin-ajax.php' )
	);
}

/**
 * AJAX: stream the screenshot.
 */
function bioplus_ajax_view_proof() {
	// phpcs:disable WordPress.Security.NonceVerification.Recommended -- authorised by the order key or capability.
	$order_id = isset( $_GET['order_id'] ) ? absint( $_GET['order_id'] ) : 0;
	$key      = isset( $_GET['key'] ) ? sanitize_text_field( wp_unslash( $_GET['key'] ) ) : '';
	// phpcs:enable
	$order = bioplus_permitted_order( $order_id, $key );
	$file  = $order ? basename( (string) $order->get_meta( '_bioplus_proof_file' ) ) : '';
	$path  = $file ? bioplus_proof_dir() . '/' . $file : '';
	if ( ! $path || ! file_exists( $path ) ) {
		status_header( 404 );
		exit;
	}
	nocache_headers();
	header( 'Content-Type: ' . $order->get_meta( '_bioplus_proof_mime' ) );
	header( 'Content-Length: ' . filesize( $path ) );
	header( 'X-Content-Type-Options: nosniff' );
	readfile( $path ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_readfile
	exit;
}
add_action( 'wp_ajax_bioplus_view_proof', 'bioplus_ajax_view_proof' );
add_action( 'wp_ajax_nopriv_bioplus_view_proof', 'bioplus_ajax_view_proof' );

/**
 * AJAX: "Done — I have paid". Stops the customer's clock and alerts the shop.
 */
function bioplus_ajax_confirm_payment() {
	check_ajax_referer( 'bioplus_nonce', 'nonce' );

	$order_id = isset( $_POST['order_id'] ) ? absint( $_POST['order_id'] ) : 0;
	$key      = isset( $_POST['key'] ) ? sanitize_text_field( wp_unslash( $_POST['key'] ) ) : '';
	$order    = bioplus_permitted_order( $order_id, $key );
	if ( ! $order ) {
		wp_send_json_error( array( 'message' => __( 'Order not found.', 'bioplus' ) ), 404 );
	}
	if ( bioplus_opt( 'payment_proof_required' ) && ! $order->get_meta( '_bioplus_proof_file' ) ) {
		wp_send_json_error( array( 'message' => __( 'Upload your payment screenshot first.', 'bioplus' ) ), 409 );
	}
	if ( $order->get_meta( '_bioplus_payment_confirmed_at' ) ) {
		wp_send_json_success( array( 'confirmedAt' => (int) $order->get_meta( '_bioplus_payment_confirmed_at' ) ) );
	}

	$now = time();
	$order->update_meta_data( '_bioplus_payment_confirmed_at', $now );
	$order->add_order_note( __( 'Customer confirmed they have paid and attached a screenshot.', 'bioplus' ) );
	$order->save();

	bioplus_send_payment_confirmed_alert( $order );

	wp_send_json_success( array( 'confirmedAt' => $now ) );
}
add_action( 'wp_ajax_bioplus_confirm_payment', 'bioplus_ajax_confirm_payment' );
add_action( 'wp_ajax_nopriv_bioplus_confirm_payment', 'bioplus_ajax_confirm_payment' );

/**
 * Email the shop when a customer says they have paid.
 *
 * @param WC_Order $order Order.
 */
function bioplus_send_payment_confirmed_alert( $order ) {
	$number  = $order->get_order_number();
	/* translators: %s: order number. */
	$subject = sprintf( __( 'Payment confirmed by customer — order %s', 'bioplus' ), $number );
	$lines   = array(
		/* translators: 1: customer email, 2: order number. */
		sprintf( __( '%1$s says they have paid for order %2$s and attached a screenshot.', 'bioplus' ), $order->get_billing_email(), $number ),
		/* translators: %s: amount. */
		sprintf( __( 'Amount due: %s', 'bioplus' ), wp_strip_all_tags( wc_price( $order->get_total() ) ) ),
		__( 'Check the bank for the transfer, then mark the order Processing.', 'bioplus' ),
		$order->get_edit_order_url(),
	);
	wp_mail( bioplus_email(), $subject, implode( "\n\n", $lines ) );
}

/**
 * Link to the order's payment page in the customer's on-hold email.
 *
 * @param WC_Order $order         Order.
 * @param bool     $sent_to_admin Admin email.
 * @param bool     $plain_text    Plain text.
 * @param WC_Email $email         Email.
 */
function bioplus_email_payment_link( $order, $sent_to_admin, $plain_text, $email = null ) {
	if ( $sent_to_admin || ! $email || 'customer_on_hold_order' !== $email->id || 'bacs' !== $order->get_payment_method() ) {
		return;
	}
	$url = $order->get_checkout_order_received_url();
	if ( $plain_text ) {
		/* translators: %s: URL. */
		echo esc_html( sprintf( __( 'Your payment page (bank details, timer and screenshot upload): %s', 'bioplus' ), $url ) ) . "\n\n";
		return;
	}
	printf(
		'<p style="margin:0 0 18px"><a href="%1$s" style="display:inline-block;background:#f85000;color:#ffffff;font-weight:bold;text-decoration:none;padding:12px 22px;border-radius:999px">%2$s</a></p>',
		esc_url( $url ),
		esc_html__( 'Open your payment page', 'bioplus' )
	);
}
add_action( 'woocommerce_email_before_order_table', 'bioplus_email_payment_link', 5, 4 );

/* --------------------------------------------------------- admin order box */

/**
 * Register the order meta box (classic orders and HPOS).
 */
function bioplus_order_meta_boxes() {
	$screens = array( 'shop_order' );
	if ( function_exists( 'wc_get_page_screen_id' ) ) {
		$screens[] = wc_get_page_screen_id( 'shop-order' );
	}
	foreach ( array_unique( $screens ) as $screen ) {
		add_meta_box( 'bioplus-payment', __( 'BioPlus — payment, tracking & COA', 'bioplus' ), 'bioplus_render_order_meta_box', $screen, 'side', 'high' );
	}
}
add_action( 'add_meta_boxes', 'bioplus_order_meta_boxes' );

/**
 * Render the order meta box.
 *
 * @param WP_Post|WC_Order $post_or_order Post or order.
 */
function bioplus_render_order_meta_box( $post_or_order ) {
	$order = $post_or_order instanceof WC_Order ? $post_or_order : wc_get_order( $post_or_order->ID );
	if ( ! $order ) {
		return;
	}
	wp_nonce_field( 'bioplus_order_meta', 'bioplus_order_meta_nonce' );
	$proof     = $order->get_meta( '_bioplus_proof_file' );
	$confirmed = (int) $order->get_meta( '_bioplus_payment_confirmed_at' );
	$files     = (array) $order->get_meta( '_bioplus_coa_files' );
	echo '<div class="bioplus-box">';
	echo '<p><strong>' . esc_html__( 'Payment screenshot', 'bioplus' ) . '</strong><br>';
	if ( $proof ) {
		$url = bioplus_proof_url( $order );
		echo '<a href="' . esc_url( $url ) . '" target="_blank" rel="noopener"><img src="' . esc_url( $url ) . '" alt="" class="bioplus-proof-thumb"></a><br>';
		echo esc_html( sprintf( /* translators: %s: date. */ __( 'Uploaded %s', 'bioplus' ), wp_date( 'j M Y H:i', (int) $order->get_meta( '_bioplus_proof_uploaded_at' ) ) ) );
	} else {
		esc_html_e( 'None uploaded yet.', 'bioplus' );
	}
	echo '</p><p><strong>' . esc_html__( 'Customer confirmation', 'bioplus' ) . '</strong><br>';
	echo $confirmed ? esc_html( sprintf( /* translators: %s: date. */ __( '"I have paid" pressed %s', 'bioplus' ), wp_date( 'j M Y H:i', $confirmed ) ) ) : esc_html__( 'Not yet confirmed.', 'bioplus' );
	echo '</p><hr>';
	echo '<p><label><strong>' . esc_html__( 'Carrier', 'bioplus' ) . '</strong><br><input type="text" class="widefat" name="bioplus_tracking_carrier" value="' . esc_attr( $order->get_meta( '_bioplus_tracking_carrier' ) ) . '" placeholder="Royal Mail"></label></p>';
	echo '<p><label><strong>' . esc_html__( 'Tracking number', 'bioplus' ) . '</strong><br><input type="text" class="widefat" name="bioplus_tracking_number" value="' . esc_attr( $order->get_meta( '_bioplus_tracking_number' ) ) . '"></label></p><hr>';
	echo '<p><strong>' . esc_html__( 'Certificates of Analysis', 'bioplus' ) . '</strong><br><span class="description">' . esc_html__( 'Shown in the customer\'s Research Hub → Files & COA.', 'bioplus' ) . '</span></p>';
	echo '<div class="bioplus-coa-rows" data-bioplus-coa-rows>';
	foreach ( $files as $f ) {
		if ( empty( $f['id'] ) ) {
			continue;
		}
		bioplus_coa_row_markup( (int) $f['id'], isset( $f['label'] ) ? $f['label'] : '', isset( $f['batch'] ) ? $f['batch'] : '' );
	}
	echo '</div><p><button type="button" class="button" data-bioplus-coa-add>' . esc_html__( 'Attach COA file', 'bioplus' ) . '</button></p>';
	echo '<script type="text/html" id="tmpl-bioplus-coa-row">';
	bioplus_coa_row_markup( 0, '', '' );
	echo '</script></div>';
}

/**
 * One COA row in the order meta box.
 *
 * @param int    $id    Attachment ID.
 * @param string $label Label.
 * @param string $batch Batch.
 */
function bioplus_coa_row_markup( $id, $label, $batch ) {
	$name = $id ? basename( (string) get_attached_file( $id ) ) : '{{ data.name }}';
	echo '<div class="bioplus-coa-row"><input type="hidden" name="bioplus_coa_id[]" value="' . esc_attr( $id ? $id : '{{ data.id }}' ) . '">';
	echo '<code>' . esc_html( $name ) . '</code>';
	echo '<input type="text" class="widefat" name="bioplus_coa_label[]" value="' . esc_attr( $label ) . '" placeholder="' . esc_attr__( 'Product (e.g. BPC-157)', 'bioplus' ) . '">';
	echo '<input type="text" class="widefat" name="bioplus_coa_batch[]" value="' . esc_attr( $batch ) . '" placeholder="' . esc_attr__( 'Batch number', 'bioplus' ) . '">';
	echo '<button type="button" class="button-link-delete" data-bioplus-coa-remove>' . esc_html__( 'Remove', 'bioplus' ) . '</button></div>';
}

/**
 * Save tracking + COA files.
 *
 * @param int $order_id Order ID.
 */
function bioplus_save_order_meta_box( $order_id ) {
	if ( ! isset( $_POST['bioplus_order_meta_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['bioplus_order_meta_nonce'] ) ), 'bioplus_order_meta' ) ) {
		return;
	}
	if ( ! current_user_can( 'edit_shop_orders' ) ) {
		return;
	}
	$order = wc_get_order( $order_id );
	if ( ! $order ) {
		return;
	}
	$order->update_meta_data( '_bioplus_tracking_carrier', isset( $_POST['bioplus_tracking_carrier'] ) ? sanitize_text_field( wp_unslash( $_POST['bioplus_tracking_carrier'] ) ) : '' );
	$order->update_meta_data( '_bioplus_tracking_number', isset( $_POST['bioplus_tracking_number'] ) ? sanitize_text_field( wp_unslash( $_POST['bioplus_tracking_number'] ) ) : '' );

	$ids    = isset( $_POST['bioplus_coa_id'] ) ? array_map( 'absint', (array) wp_unslash( $_POST['bioplus_coa_id'] ) ) : array();
	$labels = isset( $_POST['bioplus_coa_label'] ) ? array_map( 'sanitize_text_field', (array) wp_unslash( $_POST['bioplus_coa_label'] ) ) : array();
	$batch  = isset( $_POST['bioplus_coa_batch'] ) ? array_map( 'sanitize_text_field', (array) wp_unslash( $_POST['bioplus_coa_batch'] ) ) : array();
	$files  = array();
	foreach ( $ids as $i => $id ) {
		if ( $id && get_post( $id ) ) {
			$files[] = array(
				'id'    => $id,
				'label' => isset( $labels[ $i ] ) ? $labels[ $i ] : '',
				'batch' => isset( $batch[ $i ] ) ? $batch[ $i ] : '',
				'added' => time(),
			);
		}
	}
	$order->update_meta_data( '_bioplus_coa_files', $files );
	$order->save();
}
add_action( 'woocommerce_process_shop_order_meta', 'bioplus_save_order_meta_box', 50 );

/**
 * Media picker script for the COA rows.
 *
 * @param string $hook Hook suffix.
 */
function bioplus_order_admin_scripts( $hook ) {
	$screen = get_current_screen();
	if ( ! $screen || ! in_array( $screen->id, array( 'shop_order', function_exists( 'wc_get_page_screen_id' ) ? wc_get_page_screen_id( 'shop-order' ) : 'shop_order' ), true ) ) {
		return;
	}
	wp_enqueue_media();
	wp_enqueue_script( 'bioplus-admin', bioplus_asset( 'js/admin.js' ), array( 'jquery', 'wp-util' ), bioplus_asset_ver( 'assets/js/admin.js' ), true );
}
add_action( 'admin_enqueue_scripts', 'bioplus_order_admin_scripts' );

/**
 * Orders list column showing whether a screenshot is attached.
 *
 * @param array $columns Columns.
 * @return array
 */
function bioplus_orders_column( $columns ) {
	$columns['bioplus_proof'] = __( 'Payment proof', 'bioplus' );
	return $columns;
}
add_filter( 'manage_edit-shop_order_columns', 'bioplus_orders_column', 20 );
add_filter( 'manage_woocommerce_page_wc-orders_columns', 'bioplus_orders_column', 20 );

/**
 * Render the payment proof column.
 *
 * @param string       $column        Column.
 * @param int|WC_Order $post_or_order Post ID or order.
 */
function bioplus_orders_column_value( $column, $post_or_order ) {
	if ( 'bioplus_proof' !== $column ) {
		return;
	}
	$order = $post_or_order instanceof WC_Order ? $post_or_order : wc_get_order( $post_or_order );
	if ( ! $order ) {
		return;
	}
	if ( $order->get_meta( '_bioplus_payment_confirmed_at' ) ) {
		echo '<mark class="order-status status-processing"><span>' . esc_html__( 'Paid (customer)', 'bioplus' ) . '</span></mark>';
	} elseif ( $order->get_meta( '_bioplus_proof_file' ) ) {
		echo '<mark class="order-status status-on-hold"><span>' . esc_html__( 'Screenshot', 'bioplus' ) . '</span></mark>';
	} else {
		echo '&ndash;';
	}
}
add_action( 'manage_shop_order_posts_custom_column', 'bioplus_orders_column_value', 20, 2 );
add_action( 'manage_woocommerce_page_wc-orders_custom_column', 'bioplus_orders_column_value', 20, 2 );
