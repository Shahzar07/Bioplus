<?php
/**
 * Forms — every lead the site collects (contact, affiliate application,
 * wholesale quote, newsletter) is stored as a "Forms" entry in wp-admin and
 * emailed to the store address. Stored first, emailed second: an enquiry that
 * only ever existed as an email is one that can be lost.
 *
 * @package BioPlus
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Form types.
 *
 * @return array<string,string>
 */
function bioplus_form_types() {
	return array(
		'contact'    => __( 'Contact', 'bioplus' ),
		'affiliate'  => __( 'Affiliate application', 'bioplus' ),
		'wholesale'  => __( 'Wholesale quote', 'bioplus' ),
		'newsletter' => __( 'Newsletter', 'bioplus' ),
	);
}

/**
 * Field labels shown on an entry.
 *
 * @return array<string,string>
 */
function bioplus_form_field_labels() {
	return array(
		'name'         => __( 'Name', 'bioplus' ),
		'first_name'   => __( 'First name', 'bioplus' ),
		'last_name'    => __( 'Last name', 'bioplus' ),
		'email'        => __( 'Email', 'bioplus' ),
		'phone'        => __( 'Phone', 'bioplus' ),
		'organisation' => __( 'Company / Institution', 'bioplus' ),
		'website'      => __( 'Website / Social', 'bioplus' ),
		'subject'      => __( 'Subject', 'bioplus' ),
		'message'      => __( 'Message', 'bioplus' ),
	);
}

/**
 * Register the Forms post type (admin-only, not public).
 */
function bioplus_register_forms_cpt() {
	register_post_type(
		'bioplus_lead',
		array(
			'labels'          => array(
				'name'               => __( 'Forms', 'bioplus' ),
				'singular_name'      => __( 'Form entry', 'bioplus' ),
				'menu_name'          => __( 'Forms', 'bioplus' ),
				'all_items'          => __( 'All entries', 'bioplus' ),
				'edit_item'          => __( 'Form entry', 'bioplus' ),
				'view_item'          => __( 'View entry', 'bioplus' ),
				'search_items'       => __( 'Search entries', 'bioplus' ),
				'not_found'          => __( 'No form entries yet.', 'bioplus' ),
				'not_found_in_trash' => __( 'No form entries in the bin.', 'bioplus' ),
			),
			'public'          => false,
			'show_ui'         => true,
			'show_in_menu'    => true,
			'menu_position'   => 26,
			'menu_icon'       => 'dashicons-email-alt',
			'supports'        => array( 'title' ),
			'capability_type' => 'post',
			'capabilities'    => array( 'create_posts' => 'do_not_allow' ),
			'map_meta_cap'    => true,
			'rewrite'         => false,
			'query_var'       => false,
		)
	);
}
add_action( 'init', 'bioplus_register_forms_cpt' );

/**
 * Submenu shortcuts per form type, plus unread count on the menu.
 */
function bioplus_forms_admin_menu() {
	foreach ( bioplus_form_types() as $type => $label ) {
		add_submenu_page( 'edit.php?post_type=bioplus_lead', $label, $label, 'edit_posts', 'edit.php?post_type=bioplus_lead&bioplus_form=' . $type );
	}
	add_submenu_page( 'edit.php?post_type=bioplus_lead', __( 'Export CSV', 'bioplus' ), __( 'Export CSV', 'bioplus' ), 'edit_posts', 'bioplus-forms-export', 'bioplus_forms_export_page' );

	global $menu;
	$unread = bioplus_forms_unread_count();
	if ( $unread && is_array( $menu ) ) {
		foreach ( $menu as $i => $item ) {
			if ( isset( $item[2] ) && 'edit.php?post_type=bioplus_lead' === $item[2] ) {
				$menu[ $i ][0] .= ' <span class="awaiting-mod"><span class="pending-count">' . absint( $unread ) . '</span></span>'; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
			}
		}
	}
}
add_action( 'admin_menu', 'bioplus_forms_admin_menu' );

/**
 * Unread entries.
 *
 * @return int
 */
function bioplus_forms_unread_count() {
	$q = new WP_Query(
		array(
			'post_type'      => 'bioplus_lead',
			'post_status'    => 'publish',
			'posts_per_page' => 1,
			'fields'         => 'ids',
			'meta_key'       => '_bioplus_read', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
			'meta_value'     => '0', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_value
		)
	);
	return (int) $q->found_posts;
}

/**
 * Filter the list by form type.
 *
 * @param WP_Query $query Query.
 */
function bioplus_forms_filter_query( $query ) {
	if ( ! is_admin() || ! $query->is_main_query() || 'bioplus_lead' !== $query->get( 'post_type' ) ) {
		return;
	}
	// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- list filter.
	$type = isset( $_GET['bioplus_form'] ) ? sanitize_key( wp_unslash( $_GET['bioplus_form'] ) ) : '';
	if ( $type && isset( bioplus_form_types()[ $type ] ) ) {
		$query->set( 'meta_key', '_bioplus_form_type' ); // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
		$query->set( 'meta_value', $type ); // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_value
	}
}
add_action( 'pre_get_posts', 'bioplus_forms_filter_query' );

/**
 * List columns.
 *
 * @param array $cols Columns.
 * @return array
 */
function bioplus_forms_columns( $cols ) {
	return array(
		'cb'           => $cols['cb'],
		'title'        => __( 'From', 'bioplus' ),
		'bioplus_type' => __( 'Form', 'bioplus' ),
		'bioplus_mail' => __( 'Email', 'bioplus' ),
		'bioplus_msg'  => __( 'Message', 'bioplus' ),
		'bioplus_sent' => __( 'Emailed to shop', 'bioplus' ),
		'date'         => __( 'Received', 'bioplus' ),
	);
}
add_filter( 'manage_bioplus_lead_posts_columns', 'bioplus_forms_columns' );

/**
 * Column values.
 *
 * @param string $col     Column.
 * @param int    $post_id Post.
 */
function bioplus_forms_column_value( $col, $post_id ) {
	$fields = (array) get_post_meta( $post_id, '_bioplus_fields', true );
	switch ( $col ) {
		case 'bioplus_type':
			$types = bioplus_form_types();
			$type  = get_post_meta( $post_id, '_bioplus_form_type', true );
			$read  = get_post_meta( $post_id, '_bioplus_read', true );
			echo '<span class="bioplus-pill bioplus-pill--' . esc_attr( $type ) . '">' . esc_html( isset( $types[ $type ] ) ? $types[ $type ] : $type ) . '</span>';
			if ( '0' === $read ) {
				echo ' <span class="bioplus-new">' . esc_html__( 'New', 'bioplus' ) . '</span>';
			}
			break;
		case 'bioplus_mail':
			$email = isset( $fields['email'] ) ? $fields['email'] : '';
			echo $email ? '<a href="' . esc_url( 'mailto:' . $email ) . '">' . esc_html( $email ) . '</a>' : '&ndash;';
			break;
		case 'bioplus_msg':
			$msg = isset( $fields['message'] ) ? $fields['message'] : ( isset( $fields['subject'] ) ? $fields['subject'] : '' );
			echo esc_html( wp_trim_words( $msg, 14 ) );
			break;
		case 'bioplus_sent':
			echo get_post_meta( $post_id, '_bioplus_notified', true ) ? '<span class="dashicons dashicons-yes-alt" style="color:#16a34a"></span>' : '<span class="dashicons dashicons-warning" style="color:#dc2626" title="' . esc_attr__( 'The notification email could not be sent — check your mail settings.', 'bioplus' ) . '"></span>';
			break;
	}
}
add_action( 'manage_bioplus_lead_posts_custom_column', 'bioplus_forms_column_value', 10, 2 );

/**
 * Entry detail box; opening an entry marks it read.
 */
function bioplus_forms_meta_boxes() {
	add_meta_box( 'bioplus-lead', __( 'Submission', 'bioplus' ), 'bioplus_forms_render_entry', 'bioplus_lead', 'normal', 'high' );
	remove_meta_box( 'submitdiv', 'bioplus_lead', 'side' );
	add_meta_box( 'bioplus-lead-actions', __( 'Entry', 'bioplus' ), 'bioplus_forms_render_actions', 'bioplus_lead', 'side', 'high' );
}
add_action( 'add_meta_boxes_bioplus_lead', 'bioplus_forms_meta_boxes' );

/**
 * Render the entry.
 *
 * @param WP_Post $post Post.
 */
function bioplus_forms_render_entry( $post ) {
	update_post_meta( $post->ID, '_bioplus_read', '1' );
	$fields = (array) get_post_meta( $post->ID, '_bioplus_fields', true );
	$labels = bioplus_form_field_labels();
	echo '<table class="widefat striped bioplus-entry"><tbody>';
	foreach ( $fields as $key => $value ) {
		if ( '' === (string) $value ) {
			continue;
		}
		$label = isset( $labels[ $key ] ) ? $labels[ $key ] : ucwords( str_replace( '_', ' ', $key ) );
		echo '<tr><th>' . esc_html( $label ) . '</th><td>';
		if ( 'email' === $key ) {
			echo '<a href="' . esc_url( 'mailto:' . $value ) . '">' . esc_html( $value ) . '</a>';
		} else {
			echo nl2br( esc_html( $value ) );
		}
		echo '</td></tr>';
	}
	echo '</tbody></table>';
}

/**
 * Side box: type, time, page, reply, delete.
 *
 * @param WP_Post $post Post.
 */
function bioplus_forms_render_actions( $post ) {
	$types  = bioplus_form_types();
	$type   = get_post_meta( $post->ID, '_bioplus_form_type', true );
	$fields = (array) get_post_meta( $post->ID, '_bioplus_fields', true );
	$page   = get_post_meta( $post->ID, '_bioplus_page', true );
	echo '<p><strong>' . esc_html__( 'Form', 'bioplus' ) . ':</strong> ' . esc_html( isset( $types[ $type ] ) ? $types[ $type ] : $type ) . '</p>';
	echo '<p><strong>' . esc_html__( 'Received', 'bioplus' ) . ':</strong> ' . esc_html( get_the_date( 'j M Y, H:i', $post ) ) . '</p>';
	if ( $page ) {
		echo '<p><strong>' . esc_html__( 'Page', 'bioplus' ) . ':</strong> <a href="' . esc_url( $page ) . '" target="_blank" rel="noopener">' . esc_html( wp_parse_url( $page, PHP_URL_PATH ) ) . '</a></p>';
	}
	if ( ! empty( $fields['email'] ) ) {
		$subject = isset( $fields['subject'] ) && $fields['subject'] ? 'Re: ' . $fields['subject'] : sprintf( 'Re: your %s', strtolower( isset( $types[ $type ] ) ? $types[ $type ] : 'enquiry' ) );
		echo '<p><a class="button button-primary" href="' . esc_url( 'mailto:' . $fields['email'] . '?subject=' . rawurlencode( $subject ) ) . '">' . esc_html__( 'Reply by email', 'bioplus' ) . '</a></p>';
	}
	echo '<p><a class="submitdelete" href="' . esc_url( get_delete_post_link( $post->ID ) ) . '">' . esc_html__( 'Move to bin', 'bioplus' ) . '</a></p>';
}

/**
 * Simple per-IP throttle.
 *
 * @param string $bucket Bucket.
 * @param int    $limit  Max hits.
 * @param int    $window Seconds.
 * @return bool Allowed.
 */
function bioplus_rate_limit( $bucket, $limit, $window ) {
	$ip  = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : 'unknown';
	$key = 'bioplus_rl_' . md5( $bucket . '|' . $ip );
	$hit = (int) get_transient( $key );
	if ( $hit >= $limit ) {
		return false;
	}
	set_transient( $key, $hit + 1, $window );
	return true;
}

/**
 * AJAX: store and email a form submission.
 */
function bioplus_ajax_submit_form() {
	check_ajax_referer( 'bioplus_form', 'nonce' );

	// Honeypot — bots fill every field.
	if ( ! empty( $_POST['bp_website'] ) ) {
		wp_send_json_success();
	}

	$type = isset( $_POST['form_type'] ) ? sanitize_key( wp_unslash( $_POST['form_type'] ) ) : '';
	if ( ! isset( bioplus_form_types()[ $type ] ) ) {
		wp_send_json_error( array( 'message' => __( 'Unknown form.', 'bioplus' ) ), 400 );
	}
	if ( ! bioplus_rate_limit( 'form_' . $type, 'newsletter' === $type ? 5 : 8, HOUR_IN_SECONDS ) ) {
		wp_send_json_error( array( 'message' => sprintf( /* translators: %s: email. */ __( "You've sent several messages already. Please email us directly at %s instead.", 'bioplus' ), bioplus_email() ) ), 429 );
	}

	$fields = array();
	foreach ( array_keys( bioplus_form_field_labels() ) as $key ) {
		if ( isset( $_POST[ $key ] ) ) {
			$fields[ $key ] = 'message' === $key
				? sanitize_textarea_field( wp_unslash( $_POST[ $key ] ) )
				: sanitize_text_field( wp_unslash( $_POST[ $key ] ) );
		}
	}
	$fields['email'] = isset( $fields['email'] ) ? sanitize_email( $fields['email'] ) : '';

	// Validation mirrors app/contact/actions.ts.
	$errors = array();
	if ( 'contact' === $type ) {
		if ( empty( $fields['first_name'] ) ) {
			$errors[] = __( 'Enter your first name.', 'bioplus' );
		} elseif ( empty( $fields['last_name'] ) ) {
			$errors[] = __( 'Enter your last name.', 'bioplus' );
		}
	}
	if ( in_array( $type, array( 'affiliate', 'wholesale' ), true ) && empty( $fields['name'] ) ) {
		$errors[] = __( 'Enter your name.', 'bioplus' );
	}
	if ( 'wholesale' === $type && empty( $fields['organisation'] ) && ! $errors ) {
		$errors[] = __( 'Enter your company or institution.', 'bioplus' );
	}
	if ( ! $errors && ! is_email( $fields['email'] ) ) {
		$errors[] = __( 'Enter a valid email address.', 'bioplus' );
	}
	if ( ! $errors && 'contact' === $type ) {
		$len = mb_strlen( isset( $fields['message'] ) ? $fields['message'] : '' );
		if ( $len < 10 ) {
			$errors[] = __( 'Please write a little more so we can help.', 'bioplus' );
		} elseif ( $len > 5000 ) {
			$errors[] = __( 'That message is too long — please shorten it.', 'bioplus' );
		}
	}
	if ( $errors ) {
		wp_send_json_error( array( 'message' => $errors[0] ), 422 );
	}

	$types = bioplus_form_types();
	$who   = ! empty( $fields['name'] ) ? $fields['name'] : trim( ( isset( $fields['first_name'] ) ? $fields['first_name'] : '' ) . ' ' . ( isset( $fields['last_name'] ) ? $fields['last_name'] : '' ) );
	$who   = $who ? $who : $fields['email'];

	$post_id = wp_insert_post(
		array(
			'post_type'   => 'bioplus_lead',
			'post_status' => 'publish',
			'post_title'  => $who,
		),
		true
	);
	if ( is_wp_error( $post_id ) ) {
		wp_send_json_error( array( 'message' => __( 'Something went wrong. Please try again.', 'bioplus' ) ), 500 );
	}
	update_post_meta( $post_id, '_bioplus_form_type', $type );
	update_post_meta(
		$post_id,
		'_bioplus_fields',
		array_filter(
			$fields,
			static function ( $value ) {
				return '' !== (string) $value;
			}
		)
	);
	update_post_meta( $post_id, '_bioplus_read', '0' );
	update_post_meta( $post_id, '_bioplus_page', isset( $_POST['page_url'] ) ? esc_url_raw( wp_unslash( $_POST['page_url'] ) ) : '' );

	// Email the shop, with Reply-To set to the sender.
	$labels = bioplus_form_field_labels();
	$body   = array();
	foreach ( $fields as $key => $value ) {
		if ( '' !== (string) $value ) {
			$body[] = ( isset( $labels[ $key ] ) ? $labels[ $key ] : $key ) . ': ' . $value;
		}
	}
	$body[]   = '';
	$body[]   = __( 'View in wp-admin:', 'bioplus' ) . ' ' . admin_url( 'post.php?post=' . $post_id . '&action=edit' );
	$subject  = sprintf( '[%1$s] %2$s — %3$s', bioplus_site_name(), $types[ $type ], $who );
	$headers  = array( 'Reply-To: ' . $who . ' <' . $fields['email'] . '>' );
	$notified = wp_mail( bioplus_email(), $subject, implode( "\n", $body ), $headers );
	update_post_meta( $post_id, '_bioplus_notified', $notified ? 1 : 0 );

	do_action( 'bioplus_form_submitted', $type, $fields, $post_id );

	wp_send_json_success( array( 'id' => $post_id ) );
}
add_action( 'wp_ajax_bioplus_submit_form', 'bioplus_ajax_submit_form' );
add_action( 'wp_ajax_nopriv_bioplus_submit_form', 'bioplus_ajax_submit_form' );

/**
 * Export screen.
 */
function bioplus_forms_export_page() {
	echo '<div class="wrap"><h1>' . esc_html__( 'Export form entries', 'bioplus' ) . '</h1><form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '">';
	wp_nonce_field( 'bioplus_forms_export' );
	echo '<input type="hidden" name="action" value="bioplus_forms_export"><p><select name="type"><option value="">' . esc_html__( 'All forms', 'bioplus' ) . '</option>';
	foreach ( bioplus_form_types() as $k => $label ) {
		echo '<option value="' . esc_attr( $k ) . '">' . esc_html( $label ) . '</option>';
	}
	echo '</select> <button class="button button-primary">' . esc_html__( 'Download CSV', 'bioplus' ) . '</button></p></form></div>';
}

/**
 * Stream the CSV.
 */
function bioplus_forms_export() {
	if ( ! current_user_can( 'edit_posts' ) || ! check_admin_referer( 'bioplus_forms_export' ) ) {
		wp_die( esc_html__( 'Not allowed.', 'bioplus' ) );
	}
	$type = isset( $_POST['type'] ) ? sanitize_key( wp_unslash( $_POST['type'] ) ) : '';
	$args = array(
		'post_type'      => 'bioplus_lead',
		'post_status'    => 'publish',
		'posts_per_page' => -1,
	);
	if ( $type ) {
		$args['meta_key']   = '_bioplus_form_type'; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
		$args['meta_value'] = $type; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_value
	}
	$posts  = get_posts( $args );
	$labels = bioplus_form_field_labels();

	nocache_headers();
	header( 'Content-Type: text/csv; charset=utf-8' );
	header( 'Content-Disposition: attachment; filename=bioplus-forms-' . gmdate( 'Y-m-d' ) . '.csv' );
	$out = fopen( 'php://output', 'w' ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_fopen
	fputcsv( $out, array_merge( array( 'Date', 'Form' ), array_values( $labels ) ) );
	foreach ( $posts as $post ) {
		$fields = (array) get_post_meta( $post->ID, '_bioplus_fields', true );
		$row    = array( get_the_date( 'Y-m-d H:i', $post ), get_post_meta( $post->ID, '_bioplus_form_type', true ) );
		foreach ( array_keys( $labels ) as $key ) {
			// Neutralise spreadsheet formulas.
			$val   = isset( $fields[ $key ] ) ? (string) $fields[ $key ] : '';
			$row[] = preg_match( '/^[=+\-@]/', $val ) ? "'" . $val : $val;
		}
		fputcsv( $out, $row );
	}
	fclose( $out ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_fclose
	exit;
}
add_action( 'admin_post_bioplus_forms_export', 'bioplus_forms_export' );
