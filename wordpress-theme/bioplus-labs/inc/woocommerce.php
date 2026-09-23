<?php
/**
 * WooCommerce: catalogue model, template plumbing, notices.
 *
 * The original storefront modelled a product as a set of "variants" (one per
 * vial strength) each with a SKU, price and availability. Here every product is
 * a WooCommerce variable product whose variations are those variants; the
 * helpers below turn one into the plain array the templates render, so the
 * markup stays identical to the React components.
 *
 * @package BioPlus
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Availability labels.
 *
 * @return array<string,string>
 */
function bioplus_availability_labels() {
	return array(
		'in-stock'      => __( 'In stock', 'bioplus' ),
		'out-of-stock'  => __( 'Out of stock', 'bioplus' ),
		'arriving-soon' => __( 'Arriving soon', 'bioplus' ),
	);
}

/* ------------------------------------------------------------ plumbing */

// The theme styles every WooCommerce screen itself.
add_filter( 'woocommerce_enqueue_styles', '__return_empty_array' );

// Checkout and cart are the classic shortcode templates, styled by the theme.
add_filter( 'woocommerce_checkout_show_terms', '__return_false' );
remove_action( 'woocommerce_before_checkout_form', 'woocommerce_checkout_login_form', 10 );
remove_action( 'woocommerce_before_checkout_form', 'woocommerce_checkout_coupon_form', 10 );
remove_action( 'woocommerce_before_main_content', 'woocommerce_breadcrumb', 20 );
remove_action( 'woocommerce_cart_collaterals', 'woocommerce_cross_sell_display' );

/**
 * Dequeue block styles the theme replaces.
 */
function bioplus_wc_dequeue() {
	wp_dequeue_style( 'wc-blocks-style' );
	wp_dequeue_style( 'wc-blocks-vendors-style' );
	wp_dequeue_style( 'woocommerce-inline' );
}
add_action( 'wp_enqueue_scripts', 'bioplus_wc_dequeue', 100 );

/**
 * Show the whole catalogue on one page, like the original.
 *
 * @return int
 */
function bioplus_loop_shop_per_page() {
	return 100;
}
add_filter( 'loop_shop_per_page', 'bioplus_loop_shop_per_page', 20 );

/* ------------------------------------------------------------ products */

/**
 * Bundled vial photography, by product slug — used until an image is set.
 *
 * @param string $slug Product slug.
 * @return string
 */
function bioplus_vial_for( $slug ) {
	$map  = array( 'nad-plus' => 'vial-nad.webp' );
	$file = isset( $map[ $slug ] ) ? $map[ $slug ] : 'vial-' . $slug . '.webp';
	if ( ! file_exists( BIOPLUS_DIR . '/assets/images/products/' . $file ) ) {
		$file = 'vial-bpc-157.webp';
	}
	return bioplus_asset( 'images/products/' . $file );
}

/**
 * Product image URL — the featured image, else the bundled vial shot.
 *
 * @param WC_Product $product Product (a variation resolves to its parent).
 * @return string
 */
function bioplus_product_image( $product ) {
	if ( $product && $product->is_type( 'variation' ) ) {
		$parent = wc_get_product( $product->get_parent_id() );
		$product = $parent ? $parent : $product;
	}
	if ( ! $product ) {
		return bioplus_asset( 'images/products/vial-bpc-157.webp' );
	}
	$id = $product->get_image_id();
	if ( $id ) {
		$url = wp_get_attachment_image_url( (int) $id, 'bioplus-vial' );
		if ( $url ) {
			return $url;
		}
	}
	return bioplus_vial_for( $product->get_slug() );
}

/**
 * Availability of one purchasable option.
 *
 * @param WC_Product $product Variation or simple product.
 * @return string in-stock|out-of-stock|arriving-soon
 */
function bioplus_option_availability( $product ) {
	if ( $product->is_in_stock() && $product->is_purchasable() ) {
		return 'in-stock';
	}
	return 'yes' === $product->get_meta( '_bioplus_arriving_soon' ) ? 'arriving-soon' : 'out-of-stock';
}

/**
 * "£55" or "£55 – £75".
 *
 * @param float[] $prices Prices.
 * @return string
 */
function bioplus_price_range( $prices ) {
	if ( ! $prices ) {
		return '';
	}
	$lo = min( $prices );
	$hi = max( $prices );
	return $lo === $hi ? bioplus_money( $lo ) : bioplus_money( $lo ) . ' – ' . bioplus_money( $hi );
}

/**
 * Flatten a WooCommerce product into the storefront's product shape.
 *
 * @param WC_Product|int $product Product or ID.
 * @return array|null
 */
function bioplus_product_view( $product ) {
	static $cache = array();

	$product = is_numeric( $product ) ? wc_get_product( $product ) : $product;
	if ( ! $product instanceof WC_Product ) {
		return null;
	}
	$id = $product->get_id();
	if ( isset( $cache[ $id ] ) ) {
		return $cache[ $id ];
	}

	$variants = array();
	if ( $product->is_type( 'variable' ) ) {
		foreach ( $product->get_children() as $child_id ) {
			$v = wc_get_product( $child_id );
			if ( ! $v || 'publish' !== $v->get_status() ) {
				continue;
			}
			$attrs    = $v->get_attributes();
			$label    = $attrs ? implode( ' / ', array_map( 'strval', array_values( $attrs ) ) ) : $v->get_name();
			$strength = $v->get_meta( '_bioplus_strength' );
			if ( '' === $strength ) {
				$strength = trim( preg_replace( '/\s*vial$/i', '', $label ) );
			}
			$variants[] = array(
				'id'           => $v->get_id(),
				'sku'          => $v->get_sku(),
				'label'        => $label,
				'strength'     => $strength,
				'price'        => (float) $v->get_price(),
				'availability' => bioplus_option_availability( $v ),
				'max'          => $v->get_max_purchase_quantity(),
				'order'        => (int) $v->get_menu_order(),
			);
		}
		usort(
			$variants,
			static function ( $a, $b ) {
				return $a['order'] <=> $b['order'] ?: $a['price'] <=> $b['price'];
			}
		);
	} else {
		$strength   = $product->get_meta( '_bioplus_strength' );
		$variants[] = array(
			'id'           => $product->get_id(),
			'sku'          => $product->get_sku(),
			'label'        => $strength ? $strength : $product->get_name(),
			'strength'     => $strength,
			'price'        => (float) $product->get_price(),
			'availability' => bioplus_option_availability( $product ),
			'max'          => $product->get_max_purchase_quantity(),
			'order'        => 0,
		);
	}

	$avail = 'out-of-stock';
	foreach ( $variants as $v ) {
		if ( 'in-stock' === $v['availability'] ) {
			$avail = 'in-stock';
			break;
		}
		if ( 'arriving-soon' === $v['availability'] ) {
			$avail = 'arriving-soon';
		}
	}

	$highlights = $product->get_meta( '_bioplus_highlights' );
	$highlights = bioplus_lines( $highlights );
	$tagline    = (string) $product->get_meta( '_bioplus_tagline' );
	$blurb      = wp_strip_all_tags( (string) $product->get_short_description() );

	$cache[ $id ] = array(
		'id'           => $id,
		'slug'         => $product->get_slug(),
		'name'         => $product->get_name(),
		'tagline'      => $tagline,
		'blurb'        => $blurb,
		'highlights'   => $highlights,
		'form'         => (string) ( $product->get_meta( '_bioplus_form' ) ? $product->get_meta( '_bioplus_form' ) : __( 'Lyophilised powder', 'bioplus' ) ),
		'best_seller'  => 'yes' === $product->get_meta( '_bioplus_best_seller' ) || $product->is_featured(),
		'is_new'       => 'yes' === $product->get_meta( '_bioplus_is_new' ),
		'url'          => get_permalink( $id ),
		'image'        => bioplus_product_image( $product ),
		'variants'     => $variants,
		'availability' => $avail,
		'price_range'  => bioplus_price_range( wp_list_pluck( $variants, 'price' ) ),
		'lowest'       => $variants ? min( wp_list_pluck( $variants, 'price' ) ) : 0,
		'is_stack'     => has_term( 'research-stacks', 'product_cat', $id ),
		'menu_order'   => (int) $product->get_menu_order(),
		'science'      => array(
			'full_name'  => (string) $product->get_meta( '_bioplus_full_name' ),
			'purity'     => (string) $product->get_meta( '_bioplus_purity' ),
			'formula'    => (string) $product->get_meta( '_bioplus_formula' ),
			'mw'         => (string) $product->get_meta( '_bioplus_mw' ),
			'cas'        => (string) $product->get_meta( '_bioplus_cas' ),
			'blend_note' => (string) $product->get_meta( '_bioplus_blend_note' ),
		),
	);
	return $cache[ $id ];
}

/**
 * Every published product as views, in catalogue order.
 *
 * @return array[]
 */
function bioplus_all_products() {
	static $all = null;
	if ( null !== $all ) {
		return $all;
	}
	$ids = wc_get_products(
		array(
			'status'     => 'publish',
			'limit'      => -1,
			'orderby'    => array(
				'menu_order' => 'ASC',
				'date'       => 'ASC',
			),
			'return'     => 'ids',
			'visibility' => 'catalog',
		)
	);
	$all = array();
	foreach ( $ids as $id ) {
		$view = bioplus_product_view( $id );
		if ( $view && $view['variants'] ) {
			$all[] = $view;
		}
	}
	return $all;
}

/**
 * A slice of the catalogue.
 *
 * @param string   $source bestsellers|stacks|new|all|skus.
 * @param string[] $slugs  Slugs for "skus".
 * @param int      $limit  Max items (0 = all).
 * @return array[]
 */
function bioplus_products( $source = 'all', $slugs = array(), $limit = 0 ) {
	$all = bioplus_all_products();
	switch ( $source ) {
		case 'stacks':
			$list = array_filter(
				$all,
				static function ( $p ) {
					return $p['is_stack'];
				}
			);
			break;
		case 'bestsellers':
			$list = array_filter(
				$all,
				static function ( $p ) {
					return ( $p['best_seller'] || $p['is_new'] ) && ! $p['is_stack'];
				}
			);
			break;
		case 'new':
			$list = array_filter(
				$all,
				static function ( $p ) {
					return $p['is_new'];
				}
			);
			break;
		case 'skus':
			$by   = array();
			foreach ( $all as $p ) {
				$by[ $p['slug'] ] = $p;
			}
			$list = array();
			foreach ( (array) $slugs as $slug ) {
				if ( isset( $by[ $slug ] ) ) {
					$list[] = $by[ $slug ];
				}
			}
			break;
		default:
			$list = $all;
	}
	$list = array_values( $list );
	return $limit > 0 ? array_slice( $list, 0, $limit ) : $list;
}

/**
 * Sort views the way the shop's toolbar does (ShopClient.tsx).
 *
 * @param array[] $list    Views.
 * @param string  $orderby featured|price|price-desc|title.
 * @return array[]
 */
function bioplus_sort_products( $list, $orderby ) {
	$rank = array(
		'in-stock'      => 0,
		'arriving-soon' => 1,
		'out-of-stock'  => 2,
	);
	usort(
		$list,
		static function ( $a, $b ) use ( $orderby, $rank ) {
			switch ( $orderby ) {
				case 'price':
					return $a['lowest'] <=> $b['lowest'];
				case 'price-desc':
					return $b['lowest'] <=> $a['lowest'];
				case 'title':
					return strcasecmp( $a['name'], $b['name'] );
				default:
					return ( $rank[ $a['availability'] ] <=> $rank[ $b['availability'] ] )
						?: ( (int) $b['best_seller'] <=> (int) $a['best_seller'] )
						?: strcasecmp( $a['name'], $b['name'] );
			}
		}
	);
	return $list;
}

/**
 * Other products to fill "You may also be researching" (product page).
 *
 * @param int $exclude Product ID.
 * @return array[]
 */
function bioplus_related_products( $exclude ) {
	$list = array_filter(
		bioplus_all_products(),
		static function ( $p ) use ( $exclude ) {
			return $p['id'] !== $exclude;
		}
	);
	usort(
		$list,
		static function ( $a, $b ) {
			return ( (int) ( 'in-stock' === $b['availability'] ) <=> (int) ( 'in-stock' === $a['availability'] ) )
				?: ( (int) $b['best_seller'] <=> (int) $a['best_seller'] );
		}
	);
	return array_slice( array_values( $list ), 0, 4 );
}

/**
 * The catalogue as the header search overlay needs it.
 *
 * @return array[]
 */
function bioplus_catalogue_for_js() {
	$out = array();
	foreach ( bioplus_all_products() as $p ) {
		$out[] = array(
			'name'    => $p['name'],
			'tagline' => $p['tagline'],
			'url'     => $p['url'],
			'image'   => $p['image'],
			'price'   => $p['price_range'],
			'search'  => strtolower( $p['name'] . ' ' . $p['tagline'] . ' ' . $p['blurb'] . ' ' . implode( ' ', wp_list_pluck( $p['variants'], 'sku' ) ) ),
		);
	}
	return $out;
}

/**
 * Product-page usage notes (peptide-details.ts → USAGE_NOTES).
 *
 * @return string[]
 */
function bioplus_usage_notes() {
	return apply_filters(
		'bioplus_usage_notes',
		array(
			__( 'Strictly for in-vitro laboratory research, analytical testing, and scientific investigation — not for human or animal use.', 'bioplus' ),
			__( 'Handle with appropriate personal protective equipment in a controlled laboratory environment.', 'bioplus' ),
			__( 'No dosage, administration, or treatment guidance is provided, as products are sold for research only.', 'bioplus' ),
			__( 'Follow accepted laboratory storage, handling, and disposal practices at all times.', 'bioplus' ),
		)
	);
}

/* ---------------------------------------------------------------- stock */

/**
 * Selling the last vial of an "arriving soon" option is impossible; clearing
 * the flag once stock returns keeps the badge honest.
 *
 * @param WC_Product $product Product.
 */
function bioplus_clear_arriving_flag( $product ) {
	if ( $product->is_in_stock() && 'yes' === $product->get_meta( '_bioplus_arriving_soon' ) ) {
		$product->delete_meta_data( '_bioplus_arriving_soon' );
		$product->save_meta_data();
	}
}
add_action( 'woocommerce_variation_set_stock', 'bioplus_clear_arriving_flag' );
add_action( 'woocommerce_product_set_stock', 'bioplus_clear_arriving_flag' );

/* -------------------------------------------------------------- notices */

/**
 * Print WooCommerce notices in the theme's banner style.
 *
 * @param bool $dark Dark (Research Hub) variant.
 */
function bioplus_print_notices( $dark = false ) {
	if ( ! function_exists( 'wc_get_notices' ) || ! WC()->session ) {
		return;
	}
	$all = wc_get_notices();
	if ( ! $all ) {
		return;
	}
	foreach ( $all as $type => $notices ) {
		foreach ( $notices as $notice ) {
			bioplus_notice( $type, isset( $notice['notice'] ) ? $notice['notice'] : $notice, $dark );
		}
	}
	wc_clear_notices();
}

/**
 * One notice banner.
 *
 * @param string $type    error|success|notice.
 * @param string $message HTML message.
 * @param bool   $dark    Dark variant.
 */
function bioplus_notice( $type, $message, $dark = false ) {
	if ( 'error' === $type ) {
		$class = $dark ? 'mb-5 flex items-start gap-2 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-[13px] font-medium text-red-200' : 'mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-800';
		$icon  = 'alert-circle';
	} elseif ( 'success' === $type ) {
		$class = $dark ? 'mb-5 flex items-start gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-[13px] font-medium text-emerald-200' : 'mb-5 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] font-medium text-emerald-800';
		$icon  = 'check';
	} else {
		$class = $dark ? 'mb-5 flex items-start gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-[13px] font-medium text-white/80' : 'mb-5 flex items-start gap-2 rounded-xl border border-line bg-mist px-4 py-3 text-[13px] font-medium text-ink-700';
		$icon  = 'alert-circle';
	}
	printf(
		'<div role="%1$s" class="%2$s">%3$s<div class="bioplus-notice-text">%4$s</div></div>',
		'error' === $type ? 'alert' : 'status',
		esc_attr( $class ),
		bioplus_icon( $icon, 16, 'mt-px shrink-0' ), // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		wp_kses_post( $message )
	);
}

/* ------------------------------------------------------------------ misc */

/**
 * Order status label and badge classes for the dark Research Hub.
 *
 * @param WC_Order $order Order.
 * @param bool     $light Light variant (order-received page).
 * @return array{0:string,1:string}
 */
function bioplus_order_status( $order, $light = false ) {
	$status = $order->get_status();
	$labels = array(
		'pending'    => __( 'Awaiting payment', 'bioplus' ),
		'on-hold'    => __( 'Awaiting payment', 'bioplus' ),
		'processing' => __( 'Processing', 'bioplus' ),
		'completed'  => __( 'Shipped', 'bioplus' ),
		'cancelled'  => __( 'Cancelled', 'bioplus' ),
		'refunded'   => __( 'Refunded', 'bioplus' ),
		'failed'     => __( 'Failed', 'bioplus' ),
	);
	$dark   = array(
		'pending'    => 'bg-amber-500/15 text-amber-300',
		'on-hold'    => 'bg-amber-500/15 text-amber-300',
		'processing' => 'bg-brand-500/15 text-brand-300',
		'completed'  => 'bg-sky-500/15 text-sky-300',
	);
	$lite   = array(
		'pending'    => 'bg-amber-100 text-amber-800 ring-amber-200',
		'on-hold'    => 'bg-amber-100 text-amber-800 ring-amber-200',
		'processing' => 'bg-brand-50 text-brand-700 ring-brand-200',
		'completed'  => 'bg-sky-100 text-sky-800 ring-sky-200',
	);
	$label  = isset( $labels[ $status ] ) ? $labels[ $status ] : wc_get_order_status_name( $status );
	if ( $light ) {
		return array( $label, isset( $lite[ $status ] ) ? $lite[ $status ] : 'bg-haze text-ink-600 ring-line' );
	}
	return array( $label, isset( $dark[ $status ] ) ? $dark[ $status ] : 'bg-white/10 text-white/60' );
}

/**
 * Whether the order is still waiting for its bank transfer.
 *
 * @param WC_Order $order Order.
 * @return bool
 */
function bioplus_order_awaiting_payment( $order ) {
	return in_array( $order->get_status(), array( 'on-hold', 'pending' ), true );
}

/**
 * The variant label of an order/cart line (e.g. "20 mg vial").
 *
 * @param WC_Product|false $product Product.
 * @return string
 */
function bioplus_line_label( $product ) {
	if ( ! $product ) {
		return '';
	}
	if ( $product->is_type( 'variation' ) ) {
		$attrs = $product->get_attributes();
		return $attrs ? implode( ' / ', array_map( 'strval', array_values( $attrs ) ) ) : '';
	}
	return (string) $product->get_meta( '_bioplus_strength' );
}

/**
 * The parent product name of a line.
 *
 * @param WC_Product|false $product Product.
 * @return string
 */
function bioplus_line_name( $product ) {
	if ( ! $product ) {
		return '';
	}
	if ( $product->is_type( 'variation' ) ) {
		$parent = wc_get_product( $product->get_parent_id() );
		return $parent ? $parent->get_name() : $product->get_name();
	}
	return $product->get_name();
}
