<?php
/**
 * Appearance → BioPlus Setup: a one-click importer that recreates the whole
 * storefront — pages with their templates, the 18-product catalogue with every
 * vial option, SKU, price, stock level and research data, product photography,
 * menus, COA batch register, WooCommerce settings (GBP, UK & Ireland delivery,
 * £12 flat rate, free over £250, direct bank transfer), store emails going to
 * the customer service address, and — when Elementor is active — Elementor
 * layouts for every page, built from the theme's widgets.
 *
 * Every step is idempotent: running it again updates rather than duplicates.
 *
 * @package BioPlus
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register the setup screen.
 */
function bioplus_setup_menu() {
	add_theme_page( __( 'BioPlus Setup', 'bioplus' ), __( 'BioPlus Setup', 'bioplus' ), 'manage_options', 'bioplus-setup', 'bioplus_setup_page' );
}
add_action( 'admin_menu', 'bioplus_setup_menu' );

/**
 * Nudge towards setup after activation.
 */
function bioplus_setup_notice() {
	if ( ! current_user_can( 'manage_options' ) || get_option( 'bioplus_setup_done' ) ) {
		return;
	}
	$screen = get_current_screen();
	if ( $screen && 'appearance_page_bioplus-setup' === $screen->id ) {
		return;
	}
	printf(
		'<div class="notice notice-info"><p><strong>%1$s</strong> %2$s <a class="button button-primary" href="%3$s">%4$s</a></p></div>',
		esc_html__( 'BioPlus Labs:', 'bioplus' ),
		esc_html__( 'import the pages, products, menus and shop settings in one click.', 'bioplus' ),
		esc_url( admin_url( 'themes.php?page=bioplus-setup' ) ),
		esc_html__( 'Open BioPlus Setup', 'bioplus' )
	);
}
add_action( 'admin_notices', 'bioplus_setup_notice' );

/**
 * The setup screen.
 */
function bioplus_setup_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	$log       = get_transient( 'bioplus_setup_log' );
	$elementor = did_action( 'elementor/loaded' );
	$wc        = class_exists( 'WooCommerce' );
	delete_transient( 'bioplus_setup_log' );
	?>
	<div class="wrap bioplus-setup">
		<h1><?php esc_html_e( 'BioPlus Labs — Setup', 'bioplus' ); ?></h1>
		<p class="about-text"><?php esc_html_e( 'Recreates the biopluslabs.co.uk storefront on this site. Safe to run more than once — existing pages and products are updated, not duplicated.', 'bioplus' ); ?></p>

		<?php if ( $log ) : ?>
			<div class="notice notice-success"><p><strong><?php esc_html_e( 'Setup finished.', 'bioplus' ); ?></strong></p><ul class="bioplus-log">
				<?php foreach ( (array) $log as $line ) : ?>
					<li><?php echo esc_html( $line ); ?></li>
				<?php endforeach; ?>
			</ul><p><a class="button button-primary" href="<?php echo esc_url( home_url( '/' ) ); ?>" target="_blank"><?php esc_html_e( 'View the site', 'bioplus' ); ?></a></p></div>
		<?php endif; ?>

		<h2><?php esc_html_e( 'Plugins', 'bioplus' ); ?></h2>
		<table class="widefat striped" style="max-width:720px">
			<tbody>
				<tr><td><strong>WooCommerce</strong> — <?php esc_html_e( 'required for the shop, cart, checkout, orders and Research Hub.', 'bioplus' ); ?></td><td><?php echo $wc ? '<span class="dashicons dashicons-yes-alt" style="color:#16a34a"></span> ' . esc_html__( 'Active', 'bioplus' ) : '<a class="button" href="' . esc_url( admin_url( 'plugin-install.php?s=woocommerce&tab=search&type=term' ) ) . '">' . esc_html__( 'Install', 'bioplus' ) . '</a>'; ?></td></tr>
				<tr><td><strong>Elementor</strong> — <?php esc_html_e( 'recommended: edit every section visually with the BioPlus Labs widgets.', 'bioplus' ); ?></td><td><?php echo $elementor ? '<span class="dashicons dashicons-yes-alt" style="color:#16a34a"></span> ' . esc_html__( 'Active', 'bioplus' ) : '<a class="button" href="' . esc_url( admin_url( 'plugin-install.php?s=elementor&tab=search&type=term' ) ) . '">' . esc_html__( 'Install', 'bioplus' ) . '</a>'; ?></td></tr>
			</tbody>
		</table>

		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" style="margin-top:24px">
			<?php wp_nonce_field( 'bioplus_setup' ); ?>
			<input type="hidden" name="action" value="bioplus_setup">
			<h2><?php esc_html_e( 'What to import', 'bioplus' ); ?></h2>
			<p><label><input type="checkbox" name="steps[]" value="pages" checked> <?php esc_html_e( 'Pages (home, about, research, COAs, calculator, FAQ, contact, affiliate, wholesale, shipping, policies, sign in, register) and set the home page', 'bioplus' ); ?></label></p>
			<p><label><input type="checkbox" name="steps[]" value="shop" <?php checked( $wc ); ?> <?php disabled( ! $wc ); ?>> <?php esc_html_e( 'WooCommerce settings: GBP, UK & Ireland, £12 delivery / free over £250, direct bank transfer, account pages, store emails to', 'bioplus' ); ?> <code><?php echo esc_html( bioplus_email() ); ?></code></label></p>
			<p><label><input type="checkbox" name="steps[]" value="products" <?php checked( $wc ); ?> <?php disabled( ! $wc ); ?>> <?php esc_html_e( 'All 18 products with their vial options, SKUs, prices, stock and photography', 'bioplus' ); ?></label></p>
			<p><label><input type="checkbox" name="steps[]" value="coa" checked> <?php esc_html_e( 'COA batch register entries', 'bioplus' ); ?></label></p>
			<p><label><input type="checkbox" name="steps[]" value="menus" checked> <?php esc_html_e( 'Header and footer menus', 'bioplus' ); ?></label></p>
			<p><label><input type="checkbox" name="steps[]" value="elementor" <?php checked( $elementor ); ?> <?php disabled( ! $elementor ); ?>> <?php esc_html_e( 'Build every page in Elementor with the BioPlus Labs widgets (overwrites existing Elementor layouts on those pages)', 'bioplus' ); ?></label></p>
			<?php submit_button( __( 'Run setup', 'bioplus' ) ); ?>
		</form>
	</div>
	<?php
}

/**
 * Handle the setup form.
 */
function bioplus_setup_handle() {
	if ( ! current_user_can( 'manage_options' ) || ! check_admin_referer( 'bioplus_setup' ) ) {
		wp_die( esc_html__( 'Not allowed.', 'bioplus' ) );
	}
	$steps = isset( $_POST['steps'] ) ? array_map( 'sanitize_key', (array) wp_unslash( $_POST['steps'] ) ) : array();
	if ( function_exists( 'set_time_limit' ) ) {
		set_time_limit( 300 ); // phpcs:ignore Squiz.PHP.DiscouragedFunctions.Discouraged
	}
	$log = bioplus_run_setup( $steps );
	set_transient( 'bioplus_setup_log', $log, 300 );
	wp_safe_redirect( admin_url( 'themes.php?page=bioplus-setup' ) );
	exit;
}
add_action( 'admin_post_bioplus_setup', 'bioplus_setup_handle' );

/**
 * Run the chosen steps.
 *
 * @param string[] $steps Steps.
 * @return string[] Log.
 */
function bioplus_run_setup( $steps ) {
	$log = array();
	$wc  = class_exists( 'WooCommerce' );

	if ( in_array( 'shop', $steps, true ) && $wc ) {
		$log = array_merge( $log, bioplus_setup_shop() );
	}
	if ( in_array( 'pages', $steps, true ) ) {
		$log = array_merge( $log, bioplus_setup_pages() );
	}
	if ( in_array( 'products', $steps, true ) && $wc ) {
		$log = array_merge( $log, bioplus_setup_products() );
	}
	if ( in_array( 'coa', $steps, true ) ) {
		$log = array_merge( $log, bioplus_setup_coa() );
	}
	if ( in_array( 'menus', $steps, true ) ) {
		$log = array_merge( $log, bioplus_setup_menus() );
	}
	if ( in_array( 'elementor', $steps, true ) && did_action( 'elementor/loaded' ) ) {
		$log = array_merge( $log, bioplus_setup_elementor() );
	}

	bioplus_account_endpoints_flush();
	update_option( 'bioplus_setup_done', time() );
	return $log;
}

/**
 * Register endpoints then flush rewrite rules.
 */
function bioplus_account_endpoints_flush() {
	if ( function_exists( 'bioplus_account_endpoints' ) ) {
		bioplus_account_endpoints();
	}
	flush_rewrite_rules();
}

/* ------------------------------------------------------------------ pages */

/**
 * Create or update a page by path.
 *
 * @param string $path     Page path (e.g. "legal/privacy").
 * @param string $title    Title.
 * @param string $template Page template file or ''.
 * @param string $content  Content.
 * @param int    $parent   Parent ID.
 * @param bool   $keep     Keep existing content if the page exists.
 * @return int Page ID.
 */
function bioplus_upsert_page( $path, $title, $template = '', $content = '', $parent = 0, $keep = true ) {
	$existing = get_page_by_path( $path );
	$slug     = basename( $path );
	$data     = array(
		'post_type'   => 'page',
		'post_status' => 'publish',
		'post_title'  => $title,
		'post_name'   => $slug,
		'post_parent' => $parent,
	);
	if ( $existing ) {
		$data['ID'] = $existing->ID;
		if ( ! $keep || '' === trim( $existing->post_content ) ) {
			$data['post_content'] = $content;
		}
		$id = wp_update_post( $data );
	} else {
		$data['post_content'] = $content;
		$id                   = wp_insert_post( $data );
	}
	if ( $id && ! is_wp_error( $id ) ) {
		update_post_meta( $id, '_wp_page_template', $template ? $template : 'default' );
	}
	return (int) $id;
}

/**
 * Rewrite root-relative links in imported content to this site's URLs.
 *
 * @param string $html HTML.
 * @return string
 */
function bioplus_localise_links( $html ) {
	return preg_replace_callback(
		'#href="/([a-z0-9\-/]*)"#i',
		static function ( $m ) {
			return 'href="' . esc_url( bioplus_url( $m[1] ) ) . '"';
		},
		$html
	);
}

/**
 * Pages.
 *
 * @return string[]
 */
function bioplus_setup_pages() {
	$log   = array();
	$pages = array();

	$map = array(
		'home'                     => array( __( 'Home', 'bioplus' ), '' ),
		'about'                    => array( __( 'About', 'bioplus' ), 'page-templates/template-about.php' ),
		'research'                 => array( __( 'Research Library', 'bioplus' ), 'page-templates/template-research.php' ),
		'certificates-of-analysis' => array( __( 'Certificates of Analysis', 'bioplus' ), 'page-templates/template-certificates-of-analysis.php' ),
		'dosage-calculator'        => array( __( 'Peptide Dosage Calculator', 'bioplus' ), 'page-templates/template-dosage-calculator.php' ),
		'faq'                      => array( __( 'Frequently Asked Questions', 'bioplus' ), 'page-templates/template-faq.php' ),
		'contact'                  => array( __( 'Contact Us', 'bioplus' ), 'page-templates/template-contact.php' ),
		'affiliate'                => array( __( 'Affiliate Programme', 'bioplus' ), 'page-templates/template-affiliate.php' ),
		'wholesale'                => array( __( 'Wholesale & Bulk Pricing', 'bioplus' ), 'page-templates/template-wholesale.php' ),
		'shipping'                 => array( __( 'Shipping & Delivery', 'bioplus' ), 'page-templates/template-shipping.php' ),
		'login'                    => array( __( 'Sign in', 'bioplus' ), 'page-templates/template-login.php' ),
		'register'                 => array( __( 'Create an account', 'bioplus' ), 'page-templates/template-register.php' ),
	);
	foreach ( $map as $slug => $def ) {
		$pages[ $slug ] = bioplus_upsert_page( $slug, $def[0], $def[1] );
	}
	$log[] = sprintf( /* translators: %d: number. */ __( '%d storefront pages ready.', 'bioplus' ), count( $map ) );

	// Policies under /legal/.
	$legal_file = BIOPLUS_DIR . '/inc/data/legal.json';
	$legal      = file_exists( $legal_file ) ? json_decode( (string) file_get_contents( $legal_file ), true ) : array(); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
	$index      = '<p>' . esc_html__( 'Our policies:', 'bioplus' ) . '</p><ul>';
	foreach ( (array) $legal as $slug => $l ) {
		$index .= '<li><a href="/legal/' . esc_attr( $slug ) . '">' . esc_html( $l['title'] ) . '</a></li>';
	}
	$index          .= '</ul>';
	$parent          = bioplus_upsert_page( 'legal', __( 'Legal', 'bioplus' ), 'page-templates/template-legal.php' );
	$pages['legal']  = $parent;
	foreach ( (array) $legal as $slug => $l ) {
		$id = bioplus_upsert_page( 'legal/' . $slug, $l['title'], 'page-templates/template-legal.php', '', $parent );
		$pages[ 'legal/' . $slug ] = $id;
		update_post_meta( $id, '_bioplus_eyebrow', $l['eyebrow'] );
		if ( $l['updated'] ) {
			update_post_meta( $id, '_bioplus_updated', $l['updated'] );
		}
		if ( $l['intro'] ) {
			wp_update_post( array( 'ID' => $id, 'post_excerpt' => $l['intro'] ) );
		}
	}
	update_option( 'bioplus_pages', $pages );

	// Content that links to other pages is written once the URLs exist.
	foreach ( (array) $legal as $slug => $l ) {
		$post = get_post( $pages[ 'legal/' . $slug ] );
		if ( $post && '' === trim( $post->post_content ) ) {
			wp_update_post( array( 'ID' => $post->ID, 'post_content' => bioplus_localise_links( $l['body'] ) ) );
		}
	}
	$legal_post = get_post( $parent );
	if ( $legal_post && '' === trim( $legal_post->post_content ) ) {
		wp_update_post( array( 'ID' => $parent, 'post_content' => bioplus_localise_links( $index ) ) );
	}
	$log[] = sprintf( /* translators: %d: number. */ __( '%d policy pages ready under /legal/.', 'bioplus' ), count( (array) $legal ) );

	update_option( 'show_on_front', 'page' );
	update_option( 'page_on_front', $pages['home'] );
	if ( '' === (string) get_option( 'permalink_structure' ) ) {
		update_option( 'permalink_structure', '/%postname%/' );
		$log[] = __( 'Permalinks set to "Post name".', 'bioplus' );
	}
	if ( in_array( get_option( 'blogname' ), array( '', 'My WordPress Website', 'WordPress' ), true ) ) {
		update_option( 'blogname', 'BioPlus Labs' );
	}
	if ( in_array( get_option( 'blogdescription' ), array( '', 'Just another WordPress site' ), true ) ) {
		update_option( 'blogdescription', 'Research-Grade Compounds, Verified to the Batch' );
	}
	$log[] = __( 'Home page set as the front page.', 'bioplus' );
	return $log;
}

/* ------------------------------------------------------------------- shop */

/**
 * WooCommerce configuration.
 *
 * @return string[]
 */
function bioplus_setup_shop() {
	$log   = array();
	$email = bioplus_email();

	$options = array(
		'woocommerce_currency'                         => 'GBP',
		'woocommerce_currency_pos'                     => 'left',
		'woocommerce_price_thousand_sep'               => ',',
		'woocommerce_price_decimal_sep'                => '.',
		'woocommerce_price_num_decimals'               => '2',
		'woocommerce_default_country'                  => 'GB:',
		'woocommerce_store_city'                       => bioplus_opt( 'location_town' ),
		'woocommerce_allowed_countries'                => 'specific',
		'woocommerce_specific_allowed_countries'       => array( 'GB', 'IE' ),
		'woocommerce_ship_to_countries'                => 'specific',
		'woocommerce_specific_ship_to_countries'       => array( 'GB', 'IE' ),
		'woocommerce_ship_to_destination'              => 'billing_only',
		'woocommerce_calc_taxes'                       => 'no',
		'woocommerce_enable_coupons'                   => 'yes',
		'woocommerce_manage_stock'                     => 'yes',
		'woocommerce_notify_low_stock_amount'          => '5',
		'woocommerce_stock_email_recipient'            => $email,
		'woocommerce_enable_guest_checkout'            => 'yes',
		'woocommerce_enable_checkout_login_reminder'   => 'no',
		'woocommerce_enable_signup_and_login_from_checkout' => 'yes',
		'woocommerce_enable_myaccount_registration'    => 'yes',
		'woocommerce_registration_generate_username'   => 'yes',
		'woocommerce_registration_generate_password'   => 'no',
		'woocommerce_myaccount_edit_account_endpoint'  => 'settings',
		'woocommerce_myaccount_downloads_endpoint'     => '',
		'woocommerce_myaccount_edit_address_endpoint'  => '',
		'woocommerce_myaccount_payment_methods_endpoint' => '',
		'woocommerce_email_from_name'                  => bioplus_site_name(),
		'woocommerce_email_from_address'               => $email,
		'woocommerce_email_base_color'                 => '#f85000',
		'woocommerce_email_footer_text'                => sprintf( '%s — Research Use Only. Not for human or animal consumption. Questions? %s', bioplus_site_name(), $email ),
		'woocommerce_cart_redirect_after_add'          => 'no',
		'woocommerce_enable_ajax_add_to_cart'          => 'yes',
		'woocommerce_coming_soon'                      => 'no',
	);
	foreach ( $options as $key => $value ) {
		update_option( $key, $value );
	}

	// Store emails that go to the shop are addressed to the customer service inbox.
	foreach ( array( 'new_order', 'cancelled_order', 'failed_order' ) as $id ) {
		$settings              = (array) get_option( 'woocommerce_' . $id . '_settings', array() );
		$settings['enabled']   = 'yes';
		$settings['recipient'] = $email;
		update_option( 'woocommerce_' . $id . '_settings', $settings );
	}
	$log[] = sprintf( /* translators: %s: email. */ __( 'Store emails (new, cancelled and failed orders, low stock) now go to %s; customer emails are sent from it.', 'bioplus' ), $email );

	// Direct bank transfer, with the client's account as shipped in the original.
	update_option(
		'woocommerce_bacs_settings',
		array_merge(
			(array) get_option( 'woocommerce_bacs_settings', array() ),
			array(
				'enabled'      => 'yes',
				'title'        => 'Direct bank transfer',
				'description'  => 'Pay straight into our UK business account. Your order is placed now and held for you; the account details and your payment reference appear on the next screen and in your confirmation email. We dispatch as soon as the transfer clears — usually the same working day.',
				'instructions' => 'Please quote your order number as the payment reference — it is how we match your transfer to your order. Orders are dispatched once payment clears, usually the same working day.',
			)
		)
	);
	if ( ! get_option( 'woocommerce_bacs_accounts' ) ) {
		update_option(
			'woocommerce_bacs_accounts',
			array(
				array(
					'account_name'   => 'Alessandro Iannelli',
					'account_number' => '32437300',
					'bank_name'      => 'Tide Business',
					'sort_code'      => '04-06-05',
					'iban'           => '',
					'bic'            => '',
				),
			)
		);
	}
	foreach ( array( 'cod', 'cheque' ) as $gw ) {
		$s = (array) get_option( 'woocommerce_' . $gw . '_settings', array() );
		if ( $s ) {
			$s['enabled'] = 'no';
			update_option( 'woocommerce_' . $gw . '_settings', $s );
		}
	}
	$log[] = __( 'Direct bank transfer enabled (edit the account under WooCommerce → Settings → Payments → Direct bank transfer).', 'bioplus' );

	// WooCommerce pages as classic shortcode pages the theme styles.
	$wc_pages = array(
		'shop'      => array( 'shop', __( 'Shop', 'bioplus' ), '' ),
		'cart'      => array( 'cart', __( 'Cart', 'bioplus' ), '<!-- wp:shortcode -->[woocommerce_cart]<!-- /wp:shortcode -->' ),
		'checkout'  => array( 'checkout', __( 'Checkout', 'bioplus' ), '<!-- wp:shortcode -->[woocommerce_checkout]<!-- /wp:shortcode -->' ),
		'myaccount' => array( 'account', __( 'Research Hub', 'bioplus' ), '<!-- wp:shortcode -->[woocommerce_my_account]<!-- /wp:shortcode -->' ),
	);
	foreach ( $wc_pages as $key => $def ) {
		$id = (int) get_option( 'woocommerce_' . $key . '_page_id' );
		if ( ! $id || ! get_post( $id ) ) {
			$id = bioplus_upsert_page( $def[0], $def[1], '', $def[2] );
		} else {
			$update = array(
				'ID'          => $id,
				'post_name'   => $def[0],
				'post_status' => 'publish',
			);
			if ( $def[2] ) {
				$update['post_content'] = $def[2];
			}
			wp_update_post( $update );
		}
		update_option( 'woocommerce_' . $key . '_page_id', $id );
	}
	$log[] = __( 'Shop, Cart, Checkout and Research Hub (/account/) pages configured.', 'bioplus' );

	// UK & Ireland delivery: £12 flat rate, free over the threshold.
	if ( class_exists( 'WC_Shipping_Zones' ) ) {
		$zone = null;
		foreach ( WC_Shipping_Zones::get_zones() as $z ) {
			if ( 'United Kingdom & Ireland' === $z['zone_name'] ) {
				$zone = new WC_Shipping_Zone( $z['id'] );
			}
		}
		if ( ! $zone ) {
			$zone = new WC_Shipping_Zone();
			$zone->set_zone_name( 'United Kingdom & Ireland' );
			$zone->set_zone_order( 0 );
			$zone->add_location( 'GB', 'country' );
			$zone->add_location( 'IE', 'country' );
			$zone->save();
		}
		$have = array();
		foreach ( $zone->get_shipping_methods() as $m ) {
			$have[ $m->id ] = $m;
		}
		if ( ! isset( $have['flat_rate'] ) ) {
			$zone->add_shipping_method( 'flat_rate' );
		}
		if ( ! isset( $have['free_shipping'] ) ) {
			$zone->add_shipping_method( 'free_shipping' );
		}
		foreach ( $zone->get_shipping_methods() as $m ) {
			$option = $m->get_instance_option_key();
			$data   = (array) get_option( $option, array() );
			if ( 'flat_rate' === $m->id ) {
				$data = array_merge( $data, array( 'title' => 'UK tracked delivery', 'cost' => '12', 'tax_status' => 'none' ) );
			} elseif ( 'free_shipping' === $m->id ) {
				$data = array_merge( $data, array( 'title' => 'Free UK delivery', 'requires' => 'min_amount', 'min_amount' => (string) (int) bioplus_opt( 'free_shipping_min' ), 'ignore_discounts' => 'no' ) );
			}
			update_option( $option, $data );
		}
		WC_Cache_Helper::get_transient_version( 'shipping', true );
		$log[] = __( 'Delivery: UK & Ireland, £12 tracked, free over £250.', 'bioplus' );
	}

	return $log;
}

/* --------------------------------------------------------------- products */

/**
 * Import a bundled image into the media library once.
 *
 * @param string $file  File name inside assets/images/products.
 * @param string $title Title / alt.
 * @return int Attachment ID.
 */
function bioplus_import_image( $file, $title ) {
	$existing = get_posts(
		array(
			'post_type'      => 'attachment',
			'posts_per_page' => 1,
			'meta_key'       => '_bioplus_source', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
			'meta_value'     => $file, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_value
			'fields'         => 'ids',
		)
	);
	if ( $existing ) {
		return (int) $existing[0];
	}
	$src = BIOPLUS_DIR . '/assets/images/products/' . $file;
	if ( ! file_exists( $src ) ) {
		return 0;
	}
	require_once ABSPATH . 'wp-admin/includes/file.php';
	require_once ABSPATH . 'wp-admin/includes/media.php';
	require_once ABSPATH . 'wp-admin/includes/image.php';

	$tmp = wp_tempnam( $file );
	copy( $src, $tmp );
	$id = media_handle_sideload(
		array(
			'name'     => $file,
			'tmp_name' => $tmp,
		),
		0,
		$title
	);
	if ( is_wp_error( $id ) ) {
		wp_delete_file( $tmp );
		return 0;
	}
	update_post_meta( $id, '_bioplus_source', $file );
	update_post_meta( $id, '_wp_attachment_image_alt', $title );
	return (int) $id;
}

/**
 * Get or create a product category.
 *
 * @param string $name Name.
 * @param string $slug Slug.
 * @return int Term ID.
 */
function bioplus_product_cat( $name, $slug ) {
	$term = get_term_by( 'slug', $slug, 'product_cat' );
	if ( $term ) {
		return (int) $term->term_id;
	}
	$t = wp_insert_term( $name, 'product_cat', array( 'slug' => $slug ) );
	return is_wp_error( $t ) ? 0 : (int) $t['term_id'];
}

/**
 * The catalogue as exported from the original site.
 *
 * @return array
 */
function bioplus_catalogue_data() {
	$file = BIOPLUS_DIR . '/inc/data/catalogue.json';
	return file_exists( $file ) ? (array) json_decode( (string) file_get_contents( $file ), true ) : array(); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
}

/**
 * Products.
 *
 * @return string[]
 */
function bioplus_setup_products() {
	$data     = bioplus_catalogue_data();
	$products = isset( $data['products'] ) ? $data['products'] : array();
	$science  = isset( $data['peptide'] ) ? $data['peptide'] : array();
	if ( ! $products ) {
		return array( __( 'Catalogue data missing — products were not imported.', 'bioplus' ) );
	}

	$cats = array(
		'peptides' => bioplus_product_cat( __( 'Research Peptides', 'bioplus' ), 'research-peptides' ),
		'stacks'   => bioplus_product_cat( __( 'Research Stacks', 'bioplus' ), 'research-stacks' ),
		'supplies' => bioplus_product_cat( __( 'Laboratory Supplies', 'bioplus' ), 'laboratory-supplies' ),
	);
	$range = bioplus_import_image( 'bioplus-range.webp', 'The BioPlus Labs research vial range' );

	$created = 0;
	$updated = 0;
	foreach ( $products as $index => $p ) {
		$existing = get_page_by_path( $p['slug'], OBJECT, 'product' );
		$product  = $existing ? wc_get_product( $existing->ID ) : null;
		if ( $product && ! $product->is_type( 'variable' ) ) {
			wp_set_object_terms( $product->get_id(), 'variable', 'product_type' );
			$product = wc_get_product( $product->get_id() );
		}
		if ( ! $product ) {
			$product = new WC_Product_Variable();
			++$created;
		} else {
			++$updated;
		}

		$product->set_name( $p['name'] );
		$product->set_slug( $p['slug'] );
		$product->set_status( 'publish' );
		$product->set_catalog_visibility( 'visible' );
		$product->set_short_description( $p['blurb'] );
		$product->set_menu_order( $index );
		$product->set_featured( ! empty( $p['bestSeller'] ) );
		$product->set_reviews_allowed( true );

		$cat = in_array( $p['slug'], array( 'glow', 'klow' ), true ) ? $cats['stacks'] : ( 'bacteriostatic-water' === $p['slug'] ? $cats['supplies'] : $cats['peptides'] );
		$product->set_category_ids( array_filter( array( $cat ) ) );

		$vial = 'nad-plus' === $p['slug'] ? 'vial-nad.webp' : 'vial-' . $p['slug'] . '.webp';
		$img  = bioplus_import_image( $vial, $p['name'] . ' — BioPlus Labs research vial' );
		if ( $img ) {
			$product->set_image_id( $img );
		}
		if ( $range ) {
			$product->set_gallery_image_ids( array( $range ) );
		}

		$labels    = wp_list_pluck( $p['variants'], 'label' );
		$attribute = new WC_Product_Attribute();
		$attribute->set_name( 'Option' );
		$attribute->set_options( $labels );
		$attribute->set_visible( true );
		$attribute->set_variation( true );
		$product->set_attributes( array( $attribute ) );

		$sci = isset( $science[ $p['slug'] ] ) ? $science[ $p['slug'] ] : array();
		$product->update_meta_data( '_bioplus_tagline', $p['tagline'] );
		$product->update_meta_data( '_bioplus_highlights', implode( "\n", $p['highlights'] ) );
		$product->update_meta_data( '_bioplus_form', $p['form'] );
		$product->update_meta_data( '_bioplus_best_seller', ! empty( $p['bestSeller'] ) ? 'yes' : 'no' );
		$product->update_meta_data( '_bioplus_is_new', ! empty( $p['isNew'] ) ? 'yes' : 'no' );
		$product->update_meta_data( '_bioplus_purity', isset( $sci['purity'] ) ? $sci['purity'] : '' );
		$product->update_meta_data( '_bioplus_full_name', isset( $sci['fullName'] ) ? $sci['fullName'] : '' );
		$product->update_meta_data( '_bioplus_formula', isset( $sci['molecularFormula'] ) ? $sci['molecularFormula'] : '' );
		$product->update_meta_data( '_bioplus_mw', isset( $sci['molecularWeight'] ) ? $sci['molecularWeight'] : '' );
		$product->update_meta_data( '_bioplus_cas', isset( $sci['casNumber'] ) ? $sci['casNumber'] : '' );
		$product->update_meta_data( '_bioplus_blend_note', isset( $sci['blendNote'] ) ? $sci['blendNote'] : '' );
		$product_id = $product->save();

		foreach ( $p['variants'] as $v_index => $v ) {
			$vid       = wc_get_product_id_by_sku( $v['sku'] );
			$variation = $vid ? wc_get_product( $vid ) : null;
			if ( ! $variation || ! $variation->is_type( 'variation' ) ) {
				$variation = new WC_Product_Variation();
			}
			$variation->set_parent_id( $product_id );
			$variation->set_attributes( array( 'option' => $v['label'] ) );
			$variation->set_sku( $v['sku'] );
			$variation->set_regular_price( (string) $v['price'] );
			$variation->set_status( 'publish' );
			$variation->set_menu_order( $v_index );
			$variation->set_manage_stock( true );
			if ( ! $vid ) {
				// Opening stock as seeded by the original; never reset on a re-run.
				$variation->set_stock_quantity( 'in-stock' === $v['availability'] ? 25 : 0 );
			}
			$variation->set_stock_status( 'in-stock' === $v['availability'] && $variation->get_stock_quantity() > 0 ? 'instock' : 'outofstock' );
			$variation->update_meta_data( '_bioplus_strength', $v['strength'] );
			$variation->update_meta_data( '_bioplus_arriving_soon', 'arriving-soon' === $v['availability'] ? 'yes' : 'no' );
			$variation->save();
		}
		WC_Product_Variable::sync( $product_id );
		wc_delete_product_transients( $product_id );
	}

	/* translators: 1: created, 2: updated. */
	return array( sprintf( __( 'Products: %1$d created, %2$d updated (every vial option, SKU, price and stock level).', 'bioplus' ), $created, $updated ) );
}

/* -------------------------------------------------------------------- coa */

/**
 * COA batch register.
 *
 * @return string[]
 */
function bioplus_setup_coa() {
	$count = 0;
	foreach ( bioplus_default_coa_entries() as $i => $e ) {
		$found = get_posts(
			array(
				'post_type'      => 'bioplus_coa',
				'posts_per_page' => 1,
				'post_status'    => 'any',
				'meta_key'       => '_bioplus_coa_batch', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
				'meta_value'     => $e[3], // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_value
				'fields'         => 'ids',
			)
		);
		if ( $found ) {
			continue;
		}
		$id = wp_insert_post(
			array(
				'post_type'   => 'bioplus_coa',
				'post_status' => 'publish',
				'post_title'  => $e[0],
				'menu_order'  => $i,
			)
		);
		if ( $id && ! is_wp_error( $id ) ) {
			$product = get_page_by_path( $e[1], OBJECT, 'product' );
			update_post_meta( $id, '_bioplus_coa_product', $product ? $product->ID : 0 );
			update_post_meta( $id, '_bioplus_coa_purity', (string) $e[2] );
			update_post_meta( $id, '_bioplus_coa_batch', $e[3] );
			update_post_meta( $id, '_bioplus_coa_tested', $e[4] );
			++$count;
		}
	}
	/* translators: %d: count. */
	return array( sprintf( __( 'COA register: %d batch entries added.', 'bioplus' ), $count ) );
}

/* ------------------------------------------------------------------ menus */

/**
 * Menus from the original navigation.
 *
 * @return string[]
 */
function bioplus_setup_menus() {
	$pages     = (array) get_option( 'bioplus_pages', array() );
	$locations = (array) get_theme_mod( 'nav_menu_locations', array() );
	$names     = array(
		'primary'        => 'Primary',
		'footer_shop'    => 'Shop',
		'footer_company' => 'Company',
		'footer_account' => 'Account',
		'footer_legal'   => 'Compliance & Legal',
		'footer_bottom'  => 'Footer bottom',
		'legal_sidebar'  => 'Policies',
	);
	$wc_ids    = array(
		'shop'    => (int) get_option( 'woocommerce_shop_page_id' ),
		'cart'    => (int) get_option( 'woocommerce_cart_page_id' ),
		'account' => (int) get_option( 'woocommerce_myaccount_page_id' ),
	);

	foreach ( bioplus_default_menus() as $location => $menu ) {
		$name = $names[ $location ];
		$obj  = wp_get_nav_menu_object( $name );
		$id   = $obj ? $obj->term_id : wp_create_nav_menu( $name );
		if ( is_wp_error( $id ) ) {
			continue;
		}
		foreach ( (array) wp_get_nav_menu_items( $id ) as $old ) {
			wp_delete_post( $old->ID, true );
		}
		foreach ( $menu['items'] as $pos => $item ) {
			$route   = $item[1];
			$page_id = 0;
			if ( isset( $pages[ $route ] ) ) {
				$page_id = (int) $pages[ $route ];
			} elseif ( isset( $wc_ids[ $route ] ) ) {
				$page_id = $wc_ids[ $route ];
			}
			$args = array(
				'menu-item-title'    => $item[0],
				'menu-item-status'   => 'publish',
				'menu-item-position' => $pos + 1,
			);
			if ( $page_id && 'home' !== $route ) {
				$args['menu-item-type']      = 'post_type';
				$args['menu-item-object']    = 'page';
				$args['menu-item-object-id'] = $page_id;
			} else {
				$args['menu-item-type'] = 'custom';
				$args['menu-item-url']  = bioplus_url( $route );
			}
			wp_update_nav_menu_item( $id, 0, $args );
		}
		$locations[ $location ] = $id;
	}
	set_theme_mod( 'nav_menu_locations', $locations );
	return array( __( 'Header, footer and policy menus created (Appearance → Menus).', 'bioplus' ) );
}

/* -------------------------------------------------------------- elementor */

/**
 * Elementor-style random element ID.
 *
 * @return string
 */
function bioplus_el_id() {
	return substr( md5( wp_generate_password( 12, false ) . microtime() ), 0, 7 );
}

/**
 * One full-width section holding one BioPlus widget.
 *
 * @param string $section Section id.
 * @param array  $args    Settings overrides.
 * @return array
 */
function bioplus_el_section( $section, $args ) {
	$settings = array_merge( bioplus_section_defaults( $section ), (array) $args );
	foreach ( bioplus_sections()[ $section ]['fields'] as $key => $field ) {
		if ( 'repeater' === $field['type'] && isset( $settings[ $key ] ) && is_array( $settings[ $key ] ) ) {
			$settings[ $key ] = array_values(
				array_map(
					static function ( $row ) {
						$row['_id'] = bioplus_el_id();
						return $row;
					},
					$settings[ $key ]
				)
			);
		} elseif ( 'image' === $field['type'] ) {
			$settings[ $key ] = array(
				'url' => is_string( $settings[ $key ] ) ? $settings[ $key ] : '',
				'id'  => '',
			);
		} elseif ( 'url' === $field['type'] ) {
			$settings[ $key ] = array(
				'url'         => (string) $settings[ $key ],
				'is_external' => '',
				'nofollow'    => '',
			);
		}
	}
	return array(
		'id'       => bioplus_el_id(),
		'elType'   => 'section',
		'isInner'  => false,
		'settings' => array(
			'layout'  => 'full_width',
			'gap'     => 'no',
			'padding' => array(
				'unit'     => 'px',
				'top'      => '0',
				'right'    => '0',
				'bottom'   => '0',
				'left'     => '0',
				'isLinked' => true,
			),
		),
		'elements' => array(
			array(
				'id'       => bioplus_el_id(),
				'elType'   => 'column',
				'isInner'  => false,
				'settings' => array(
					'_column_size' => 100,
					'_inline_size' => null,
				),
				'elements' => array(
					array(
						'id'         => bioplus_el_id(),
						'elType'     => 'widget',
						'widgetType' => 'bioplus-' . $section,
						'isInner'    => false,
						'settings'   => $settings,
						'elements'   => array(),
					),
				),
			),
		),
	);
}

/**
 * Build the Elementor layout of every storefront page.
 *
 * @return string[]
 */
function bioplus_setup_elementor() {
	$pages   = (array) get_option( 'bioplus_pages', array() );
	$layouts = bioplus_page_layouts();
	$done    = 0;
	foreach ( $layouts as $key => $sections ) {
		if ( empty( $pages[ $key ] ) ) {
			continue;
		}
		$post_id = (int) $pages[ $key ];
		$data    = array();
		foreach ( $sections as $section ) {
			$data[] = bioplus_el_section( $section[0], isset( $section[1] ) ? $section[1] : array() );
		}
		update_post_meta( $post_id, '_elementor_edit_mode', 'builder' );
		update_post_meta( $post_id, '_elementor_template_type', 'wp-page' );
		update_post_meta( $post_id, '_elementor_version', defined( 'ELEMENTOR_VERSION' ) ? ELEMENTOR_VERSION : '3.0.0' );
		update_post_meta( $post_id, '_elementor_data', wp_slash( wp_json_encode( $data ) ) );
		delete_post_meta( $post_id, '_elementor_css' );
		++$done;
	}
	// Let the theme's typography and colours lead.
	update_option( 'elementor_disable_color_schemes', 'yes' );
	update_option( 'elementor_disable_typography_schemes', 'yes' );
	$cpt = (array) get_option( 'elementor_cpt_support', array( 'page', 'post' ) );
	if ( ! in_array( 'page', $cpt, true ) ) {
		$cpt[] = 'page';
		update_option( 'elementor_cpt_support', $cpt );
	}
	if ( class_exists( '\Elementor\Plugin' ) ) {
		\Elementor\Plugin::$instance->files_manager->clear_cache();
	}
	/* translators: %d: count. */
	return array( sprintf( __( 'Elementor: %d pages built from BioPlus Labs widgets — open any of them with "Edit with Elementor".', 'bioplus' ), $done ) );
}
