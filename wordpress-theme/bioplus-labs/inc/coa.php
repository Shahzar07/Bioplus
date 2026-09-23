<?php
/**
 * COA Batches — the public batch register on /certificates-of-analysis.
 *
 * Each entry is a batch: product, batch number, purity, test date and the
 * certificate PDF. Managed under Products → COA Batches.
 *
 * @package BioPlus
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register the post type.
 */
function bioplus_register_coa_cpt() {
	register_post_type(
		'bioplus_coa',
		array(
			'labels'       => array(
				'name'          => __( 'COA Batches', 'bioplus' ),
				'singular_name' => __( 'COA Batch', 'bioplus' ),
				'add_new_item'  => __( 'Add COA batch', 'bioplus' ),
				'edit_item'     => __( 'Edit COA batch', 'bioplus' ),
				'menu_name'     => __( 'COA Batches', 'bioplus' ),
			),
			'public'       => false,
			'show_ui'      => true,
			'show_in_menu' => class_exists( 'WooCommerce' ) ? 'edit.php?post_type=product' : true,
			'menu_icon'    => 'dashicons-media-document',
			'supports'     => array( 'title', 'page-attributes' ),
			'rewrite'      => false,
		)
	);
}
add_action( 'init', 'bioplus_register_coa_cpt' );

/**
 * Meta box.
 */
function bioplus_coa_meta_box() {
	add_meta_box( 'bioplus-coa', __( 'Batch details', 'bioplus' ), 'bioplus_coa_render_box', 'bioplus_coa', 'normal', 'high' );
}
add_action( 'add_meta_boxes_bioplus_coa', 'bioplus_coa_meta_box' );

/**
 * Render the batch fields.
 *
 * @param WP_Post $post Post.
 */
function bioplus_coa_render_box( $post ) {
	wp_nonce_field( 'bioplus_coa', 'bioplus_coa_nonce' );
	$product = (int) get_post_meta( $post->ID, '_bioplus_coa_product', true );
	$fields  = array(
		'_bioplus_coa_batch'  => array( __( 'Batch number', 'bioplus' ), 'BPL-0441-R7' ),
		'_bioplus_coa_purity' => array( __( 'Purity (%)', 'bioplus' ), '99.2' ),
		'_bioplus_coa_tested' => array( __( 'Tested (e.g. Jun 2026)', 'bioplus' ), 'Jun 2026' ),
		'_bioplus_coa_pdf'    => array( __( 'Certificate PDF URL (upload in Media, paste the file URL)', 'bioplus' ), 'https://…' ),
	);
	echo '<p class="description">' . esc_html__( 'The entry title is the product name shown in the register (e.g. "TB-500 (Thymosin β4)").', 'bioplus' ) . '</p>';
	echo '<table class="form-table"><tbody>';
	echo '<tr><th><label for="bioplus_coa_product">' . esc_html__( 'Linked product', 'bioplus' ) . '</label></th><td><select id="bioplus_coa_product" name="_bioplus_coa_product"><option value="0">—</option>';
	foreach ( get_posts( array( 'post_type' => 'product', 'posts_per_page' => -1, 'orderby' => 'title', 'order' => 'ASC' ) ) as $p ) {
		echo '<option value="' . esc_attr( $p->ID ) . '"' . selected( $product, $p->ID, false ) . '>' . esc_html( $p->post_title ) . '</option>';
	}
	echo '</select></td></tr>';
	foreach ( $fields as $key => $f ) {
		echo '<tr><th><label for="' . esc_attr( $key ) . '">' . esc_html( $f[0] ) . '</label></th><td><input type="text" class="regular-text" id="' . esc_attr( $key ) . '" name="' . esc_attr( $key ) . '" value="' . esc_attr( get_post_meta( $post->ID, $key, true ) ) . '" placeholder="' . esc_attr( $f[1] ) . '"></td></tr>';
	}
	echo '</tbody></table>';
}

/**
 * Save.
 *
 * @param int $post_id Post.
 */
function bioplus_coa_save( $post_id ) {
	if ( ! isset( $_POST['bioplus_coa_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['bioplus_coa_nonce'] ) ), 'bioplus_coa' ) || ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}
	update_post_meta( $post_id, '_bioplus_coa_product', isset( $_POST['_bioplus_coa_product'] ) ? absint( $_POST['_bioplus_coa_product'] ) : 0 );
	foreach ( array( '_bioplus_coa_batch', '_bioplus_coa_purity', '_bioplus_coa_tested' ) as $key ) {
		update_post_meta( $post_id, $key, isset( $_POST[ $key ] ) ? sanitize_text_field( wp_unslash( $_POST[ $key ] ) ) : '' );
	}
	update_post_meta( $post_id, '_bioplus_coa_pdf', isset( $_POST['_bioplus_coa_pdf'] ) ? esc_url_raw( wp_unslash( $_POST['_bioplus_coa_pdf'] ) ) : '' );
}
add_action( 'save_post_bioplus_coa', 'bioplus_coa_save' );

/**
 * Register entries for the finder.
 *
 * @return array[]
 */
function bioplus_coa_entries() {
	$posts = get_posts(
		array(
			'post_type'      => 'bioplus_coa',
			'post_status'    => 'publish',
			'posts_per_page' => -1,
			'orderby'        => array(
				'menu_order' => 'ASC',
				'date'       => 'DESC',
			),
		)
	);
	$out   = array();
	foreach ( $posts as $post ) {
		$product = (int) get_post_meta( $post->ID, '_bioplus_coa_product', true );
		$out[]   = array(
			'product' => $post->post_title,
			'url'     => $product ? get_permalink( $product ) : bioplus_url( 'shop' ),
			'purity'  => (float) get_post_meta( $post->ID, '_bioplus_coa_purity', true ),
			'batch'   => (string) get_post_meta( $post->ID, '_bioplus_coa_batch', true ),
			'tested'  => (string) get_post_meta( $post->ID, '_bioplus_coa_tested', true ),
			'pdf'     => (string) get_post_meta( $post->ID, '_bioplus_coa_pdf', true ),
		);
	}
	return $out;
}

/**
 * The batch register as it shipped (CoaFinder.tsx), used by the setup wizard.
 *
 * @return array[]
 */
function bioplus_default_coa_entries() {
	return array(
		array( 'Retatrutide', 'retatrutide', 99.2, 'BPL-0441-R7', 'Jun 2026' ),
		array( 'BPC-157', 'bpc-157', 99.4, 'BPL-0157-C4', 'Jun 2026' ),
		array( 'TB-500 (Thymosin β4)', 'tb-500', 98.9, 'BPL-0500-T2', 'May 2026' ),
		array( 'Tirzepatide', 'tirzepatide', 99.1, 'BPL-0395-Z9', 'May 2026' ),
		array( 'CJC-1295 + Ipamorelin', 'cjc-1295', 98.7, 'BPL-0372-K1', 'May 2026' ),
		array( 'MOTS-c', 'mots-c', 98.6, 'BPL-0360-M5', 'Apr 2026' ),
		array( 'Ipamorelin', 'ipamorelin', 99.0, 'BPL-0356-I3', 'Apr 2026' ),
		array( 'GHK-Cu', 'ghk-cu', 99.3, 'BPL-0341-G8', 'Apr 2026' ),
	);
}
