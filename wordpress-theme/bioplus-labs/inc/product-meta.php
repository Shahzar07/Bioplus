<?php
/**
 * Product edit screen: the research data the storefront shows (tagline,
 * highlights, badges, purity, formula, MW, CAS…) and per-variation strength
 * and "arriving soon" flags.
 *
 * @package BioPlus
 */

if ( ! defined( 'ABSPATH' ) ) {
	return;
}

/**
 * Product data tab.
 *
 * @param array $tabs Tabs.
 * @return array
 */
function bioplus_product_data_tab( $tabs ) {
	$tabs['bioplus'] = array(
		'label'    => __( 'BioPlus research data', 'bioplus' ),
		'target'   => 'bioplus_product_data',
		'priority' => 15,
	);
	return $tabs;
}
add_filter( 'woocommerce_product_data_tabs', 'bioplus_product_data_tab' );

/**
 * Fields in the tab.
 *
 * @return array<string,array>
 */
function bioplus_product_fields() {
	return array(
		'_bioplus_tagline'     => array( 'text', __( 'Tagline', 'bioplus' ), __( 'Shown under the name on cards and the product page, e.g. "Triple GLP-1 / GIP / glucagon agonist".', 'bioplus' ) ),
		'_bioplus_highlights'  => array( 'textarea', __( 'Research highlights (one per line)', 'bioplus' ), __( 'The "Research" tab.', 'bioplus' ) ),
		'_bioplus_form'        => array( 'text', __( 'Form', 'bioplus' ), __( 'e.g. Lyophilised powder', 'bioplus' ) ),
		'_bioplus_best_seller' => array( 'checkbox', __( 'Best Seller badge', 'bioplus' ), '' ),
		'_bioplus_is_new'      => array( 'checkbox', __( 'New badge', 'bioplus' ), '' ),
		'_bioplus_purity'      => array( 'text', __( 'Purity', 'bioplus' ), __( 'e.g. ≥99%', 'bioplus' ) ),
		'_bioplus_full_name'   => array( 'text', __( 'Full chemical name', 'bioplus' ), '' ),
		'_bioplus_formula'     => array( 'text', __( 'Molecular formula', 'bioplus' ), '' ),
		'_bioplus_mw'          => array( 'text', __( 'Molecular weight', 'bioplus' ), '' ),
		'_bioplus_cas'         => array( 'text', __( 'CAS number', 'bioplus' ), '' ),
		'_bioplus_blend_note'  => array( 'text', __( 'Blend note', 'bioplus' ), '' ),
	);
}

/**
 * Render the tab panel.
 */
function bioplus_product_data_panel() {
	echo '<div id="bioplus_product_data" class="panel woocommerce_options_panel"><div class="options_group">';
	foreach ( bioplus_product_fields() as $key => $f ) {
		if ( 'checkbox' === $f[0] ) {
			woocommerce_wp_checkbox(
				array(
					'id'    => $key,
					'label' => $f[1],
				)
			);
		} elseif ( 'textarea' === $f[0] ) {
			woocommerce_wp_textarea_input(
				array(
					'id'          => $key,
					'label'       => $f[1],
					'description' => $f[2],
					'desc_tip'    => true,
					'rows'        => 5,
				)
			);
		} else {
			woocommerce_wp_text_input(
				array(
					'id'          => $key,
					'label'       => $f[1],
					'description' => $f[2],
					'desc_tip'    => (bool) $f[2],
				)
			);
		}
	}
	echo '<p class="form-field"><em>' . esc_html__( 'The short description is the product blurb. The product image falls back to the bundled vial photograph when none is set.', 'bioplus' ) . '</em></p>';
	echo '</div></div>';
}
add_action( 'woocommerce_product_data_panels', 'bioplus_product_data_panel' );

/**
 * Save the tab. WooCommerce verifies the nonce and capability before this hook.
 *
 * @param WC_Product $product Product.
 */
function bioplus_product_data_save( $product ) {
	// phpcs:disable WordPress.Security.NonceVerification.Missing
	foreach ( bioplus_product_fields() as $key => $f ) {
		if ( 'checkbox' === $f[0] ) {
			$product->update_meta_data( $key, isset( $_POST[ $key ] ) ? 'yes' : 'no' );
		} elseif ( 'textarea' === $f[0] ) {
			$product->update_meta_data( $key, isset( $_POST[ $key ] ) ? sanitize_textarea_field( wp_unslash( $_POST[ $key ] ) ) : '' );
		} else {
			$product->update_meta_data( $key, isset( $_POST[ $key ] ) ? sanitize_text_field( wp_unslash( $_POST[ $key ] ) ) : '' );
		}
	}
	// phpcs:enable
}
add_action( 'woocommerce_admin_process_product_object', 'bioplus_product_data_save' );

/**
 * Variation fields.
 *
 * @param int     $loop           Index.
 * @param array   $variation_data Data.
 * @param WP_Post $variation      Variation post.
 */
function bioplus_variation_fields( $loop, $variation_data, $variation ) {
	woocommerce_wp_text_input(
		array(
			'id'            => "bioplus_strength_{$loop}",
			'name'          => "bioplus_strength[{$loop}]",
			'label'         => __( 'Strength per vial (e.g. 20 mg)', 'bioplus' ),
			'value'         => get_post_meta( $variation->ID, '_bioplus_strength', true ),
			'wrapper_class' => 'form-row form-row-first',
		)
	);
	woocommerce_wp_checkbox(
		array(
			'id'            => "bioplus_arriving_{$loop}",
			'name'          => "bioplus_arriving[{$loop}]",
			'label'         => __( 'Show as "Arriving soon" while out of stock', 'bioplus' ),
			'value'         => get_post_meta( $variation->ID, '_bioplus_arriving_soon', true ),
			'cbvalue'       => 'yes',
			'wrapper_class' => 'form-row form-row-last',
		)
	);
}
add_action( 'woocommerce_product_after_variable_attributes', 'bioplus_variation_fields', 10, 3 );

/**
 * Save variation fields.
 *
 * @param WC_Product_Variation $variation Variation.
 * @param int                  $i         Index.
 */
function bioplus_variation_save( $variation, $i ) {
	// phpcs:disable WordPress.Security.NonceVerification.Missing -- WooCommerce verified the save_variations nonce.
	if ( isset( $_POST['bioplus_strength'][ $i ] ) ) {
		$variation->update_meta_data( '_bioplus_strength', sanitize_text_field( wp_unslash( $_POST['bioplus_strength'][ $i ] ) ) );
	}
	$variation->update_meta_data( '_bioplus_arriving_soon', isset( $_POST['bioplus_arriving'][ $i ] ) ? 'yes' : 'no' );
	// phpcs:enable
}
add_action( 'woocommerce_admin_process_variation_object', 'bioplus_variation_save', 10, 2 );
