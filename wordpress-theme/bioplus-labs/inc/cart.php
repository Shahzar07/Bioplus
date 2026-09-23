<?php
/**
 * Cart: AJAX add / set quantity / remove, returning refreshed fragments so the
 * drawer, header badge and product buttons behave like the React cart context.
 *
 * @package BioPlus
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Cart lines in the storefront's shape.
 *
 * @return array[]
 */
function bioplus_cart_lines() {
	$lines = array();
	if ( ! WC()->cart ) {
		return $lines;
	}
	foreach ( WC()->cart->get_cart() as $key => $item ) {
		$product = isset( $item['data'] ) ? $item['data'] : false;
		if ( ! $product ) {
			continue;
		}
		$parent_id = $product->is_type( 'variation' ) ? $product->get_parent_id() : $product->get_id();
		$lines[]   = array(
			'key'        => $key,
			'id'         => $product->get_id(),
			'name'       => bioplus_line_name( $product ),
			'label'      => bioplus_line_label( $product ),
			'sku'        => $product->get_sku(),
			'qty'        => (int) $item['quantity'],
			'price'      => (float) wc_get_price_to_display( $product ),
			'line_total' => (float) $item['line_subtotal'] + (float) $item['line_subtotal_tax'],
			'url'        => get_permalink( $parent_id ),
			'image'      => bioplus_product_image( $product ),
		);
	}
	return $lines;
}

/**
 * Fragments refreshed after any cart change.
 *
 * @param array $fragments Existing fragments.
 * @return array
 */
function bioplus_cart_fragments( $fragments ) {
	$count = WC()->cart ? WC()->cart->get_cart_contents_count() : 0;

	$fragments['[data-cart-drawer-inner]'] = bioplus_capture_part( 'template-parts/layout/cart-drawer-inner' );
	$fragments['[data-cart-count]']        = sprintf(
		'<span class="%1$s" data-cart-count>%2$s</span>',
		esc_attr( $count > 0 ? 'brand-gradient absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full px-1 text-[10px] font-bold text-white' : 'hidden' ),
		esc_html( $count )
	);
	return $fragments;
}
add_filter( 'woocommerce_add_to_cart_fragments', 'bioplus_cart_fragments' );

/**
 * AJAX: add, set or remove.
 */
function bioplus_ajax_cart() {
	check_ajax_referer( 'bioplus_nonce', 'nonce' );

	$op = isset( $_POST['op'] ) ? sanitize_key( wp_unslash( $_POST['op'] ) ) : '';
	wc_clear_notices();

	if ( 'add' === $op ) {
		$id      = isset( $_POST['product_id'] ) ? absint( $_POST['product_id'] ) : 0;
		$qty     = isset( $_POST['qty'] ) ? max( 1, absint( $_POST['qty'] ) ) : 1;
		$product = $id ? wc_get_product( $id ) : false;
		if ( ! $product ) {
			wp_send_json_error( array( 'message' => __( 'That product is no longer available.', 'bioplus' ) ) );
		}
		if ( $product instanceof WC_Product_Variation ) {
			$added = WC()->cart->add_to_cart( $product->get_parent_id(), $qty, $product->get_id(), $product->get_variation_attributes() );
		} else {
			$added = WC()->cart->add_to_cart( $product->get_id(), $qty );
		}
		if ( ! $added ) {
			$errors = wc_get_notices( 'error' );
			wc_clear_notices();
			$msg = $errors ? wp_strip_all_tags( is_array( $errors[0] ) ? $errors[0]['notice'] : $errors[0] ) : __( 'That option could not be added to your cart.', 'bioplus' );
			wp_send_json_error( array( 'message' => $msg ) );
		}
		do_action( 'woocommerce_ajax_added_to_cart', $product->get_id() );
	} elseif ( 'set' === $op || 'remove' === $op ) {
		$key = isset( $_POST['key'] ) ? sanitize_text_field( wp_unslash( $_POST['key'] ) ) : '';
		if ( ! $key || ! WC()->cart->get_cart_item( $key ) ) {
			wp_send_json_error( array( 'message' => __( 'That item is no longer in your cart.', 'bioplus' ) ) );
		}
		$qty = 'remove' === $op ? 0 : ( isset( $_POST['qty'] ) ? absint( $_POST['qty'] ) : 0 );
		if ( $qty <= 0 ) {
			WC()->cart->remove_cart_item( $key );
		} else {
			$item    = WC()->cart->get_cart_item( $key );
			$max     = $item['data']->get_max_purchase_quantity();
			$qty     = $max > 0 ? min( $qty, $max ) : $qty;
			WC()->cart->set_quantity( $key, $qty, true );
		}
	} else {
		wp_send_json_error( array( 'message' => __( 'Unknown cart action.', 'bioplus' ) ) );
	}

	WC()->cart->calculate_totals();
	wc_clear_notices();

	wp_send_json_success(
		array(
			'count'     => WC()->cart->get_cart_contents_count(),
			'fragments' => apply_filters( 'woocommerce_add_to_cart_fragments', array() ),
		)
	);
}
add_action( 'wp_ajax_bioplus_cart', 'bioplus_ajax_cart' );
add_action( 'wp_ajax_nopriv_bioplus_cart', 'bioplus_ajax_cart' );

/**
 * AJAX: current fragments (used after the page is restored from bfcache).
 */
function bioplus_ajax_cart_refresh() {
	wp_send_json_success(
		array(
			'count'     => WC()->cart ? WC()->cart->get_cart_contents_count() : 0,
			'fragments' => apply_filters( 'woocommerce_add_to_cart_fragments', array() ),
		)
	);
}
add_action( 'wp_ajax_bioplus_cart_refresh', 'bioplus_ajax_cart_refresh' );
add_action( 'wp_ajax_nopriv_bioplus_cart_refresh', 'bioplus_ajax_cart_refresh' );

/**
 * Free-delivery threshold shown on the cart page (from the WooCommerce free
 * shipping method when one is configured, else the Customizer value).
 *
 * @return float
 */
function bioplus_free_shipping_threshold() {
	static $threshold = null;
	if ( null !== $threshold ) {
		return $threshold;
	}
	$threshold = (float) bioplus_opt( 'free_shipping_min' );
	if ( class_exists( 'WC_Shipping_Zones' ) ) {
		foreach ( WC_Shipping_Zones::get_zones() as $zone ) {
			foreach ( $zone['shipping_methods'] as $method ) {
				if ( 'free_shipping' === $method->id && 'yes' === $method->enabled && (float) $method->get_option( 'min_amount' ) > 0 ) {
					$threshold = (float) $method->get_option( 'min_amount' );
					return $threshold;
				}
			}
		}
	}
	return $threshold;
}

/**
 * When free delivery applies, it is the only rate — like the original, which
 * simply showed "Free" once the threshold was met.
 *
 * @param array $rates Rates.
 * @return array
 */
function bioplus_hide_paid_rates_when_free( $rates ) {
	$free = array();
	foreach ( $rates as $id => $rate ) {
		if ( 'free_shipping' === $rate->method_id ) {
			$free[ $id ] = $rate;
		}
	}
	return $free ? $free : $rates;
}
add_filter( 'woocommerce_package_rates', 'bioplus_hide_paid_rates_when_free', 100 );
