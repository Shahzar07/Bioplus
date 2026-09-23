<?php
/**
 * SEO: the original's per-page titles, descriptions and Open Graph tags, plus
 * Organization / Product JSON-LD. Stands aside when an SEO plugin is active.
 *
 * @package BioPlus
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Is a dedicated SEO plugin handling meta?
 *
 * @return bool
 */
function bioplus_seo_plugin_active() {
	return defined( 'WPSEO_VERSION' ) || defined( 'RANK_MATH_VERSION' ) || defined( 'AIOSEO_VERSION' ) || class_exists( 'SEOPress\Core\Kernel' );
}

/**
 * Meta descriptions from the original pages (keyed by page template).
 *
 * @return array<string,string>
 */
function bioplus_seo_descriptions() {
	return array(
		'home'                     => 'BioPlus Labs supplies UK researchers with high-purity research peptides and laboratory materials, batch-tested by HPLC/UPLC/MS and shipped with a matching Certificate of Analysis. Research Use Only.',
		'about'                    => 'A UK laboratory supplier built on quality you can verify. Learn about the BioPlus Labs mission, vision, and commitment to batch-level transparency.',
		'research'                 => 'Background reference on the research compound classes BioPlus Labs supplies and the documentation that ships with them. Research Use Only.',
		'certificates-of-analysis' => 'Search and download BioPlus Labs Certificates of Analysis by product or batch number. Identity and purity verified by HPLC, UPLC, and Mass Spectrometry.',
		'dosage-calculator'        => 'Calculate the volume to draw for your research peptide reconstitution. Enter desired dose, peptide strength, and volume.',
		'faq'                      => 'Answers about research peptides, storage, reconstitution, shelf life, and BioPlus Labs policies.',
		'contact'                  => 'Contact BioPlus Labs for product, ordering, shipping, wholesale, and account support.',
		'affiliate'                => 'Join the BioPlus Labs affiliate programme and earn commissions on qualified referral orders.',
		'wholesale'                => 'Wholesale purchasing, laboratory supply agreements, and bulk pricing from BioPlus Labs.',
		'shipping'                 => 'BioPlus Labs shipping, delivery, privacy, returns, ordering, payment, and account information.',
		'shop'                     => 'Browse BioPlus Labs high-purity research peptides and laboratory materials. Research Use Only.',
	);
}

/**
 * Description for the current request.
 *
 * @return string
 */
function bioplus_seo_description() {
	$map = bioplus_seo_descriptions();
	if ( is_front_page() ) {
		return $map['home'];
	}
	if ( function_exists( 'is_shop' ) && is_shop() ) {
		return $map['shop'];
	}
	if ( function_exists( 'is_product' ) && is_product() ) {
		$product = wc_get_product( get_queried_object_id() );
		return $product ? wp_strip_all_tags( $product->get_short_description() ) : '';
	}
	if ( is_singular() ) {
		$custom = get_post_meta( get_queried_object_id(), '_bioplus_meta_description', true );
		if ( $custom ) {
			return $custom;
		}
		$tpl = (string) get_page_template_slug( get_queried_object_id() );
		if ( preg_match( '#template-([a-z0-9-]+)\.php$#', $tpl, $m ) && isset( $map[ $m[1] ] ) ) {
			return $map[ $m[1] ];
		}
		if ( has_excerpt( get_queried_object_id() ) ) {
			return wp_strip_all_tags( get_the_excerpt( get_queried_object_id() ) );
		}
	}
	return get_bloginfo( 'description' );
}

/**
 * Title separator "·" and "Name — tagline" home title, as the original.
 *
 * @return string
 */
function bioplus_title_separator() {
	return '·';
}
add_filter( 'document_title_separator', 'bioplus_title_separator' );

/**
 * Product titles read "Retatrutide — Triple GLP-1 / GIP / glucagon agonist".
 *
 * @param array $parts Title parts.
 * @return array
 */
function bioplus_title_parts( $parts ) {
	if ( is_front_page() ) {
		$parts['title'] = bioplus_site_name() . ' — ' . __( 'High-Purity Research Compounds', 'bioplus' );
		unset( $parts['tagline'], $parts['site'] );
	} elseif ( function_exists( 'is_product' ) && is_product() ) {
		$tagline = get_post_meta( get_queried_object_id(), '_bioplus_tagline', true );
		if ( $tagline ) {
			$parts['title'] = get_the_title( get_queried_object_id() ) . ' — ' . $tagline;
		}
	}
	return $parts;
}
add_filter( 'document_title_parts', 'bioplus_title_parts' );

/**
 * Print meta tags and JSON-LD.
 */
function bioplus_seo_head() {
	if ( bioplus_seo_plugin_active() ) {
		return;
	}
	$desc  = trim( wp_strip_all_tags( bioplus_seo_description() ) );
	$title = wp_get_document_title();
	$url   = is_singular() ? get_permalink() : home_url( bioplus_current_path() );
	$image = bioplus_asset( 'images/products/bioplus-range.webp' );
	if ( function_exists( 'is_product' ) && is_product() ) {
		$product = wc_get_product( get_queried_object_id() );
		$image   = $product ? bioplus_product_image( $product ) : $image;
	} elseif ( is_singular() && has_post_thumbnail() ) {
		$image = get_the_post_thumbnail_url( null, 'large' );
	}

	if ( $desc ) {
		printf( '<meta name="description" content="%s">' . "\n", esc_attr( $desc ) );
	}
	printf( '<meta property="og:title" content="%s">' . "\n", esc_attr( $title ) );
	if ( $desc ) {
		printf( '<meta property="og:description" content="%s">' . "\n", esc_attr( $desc ) );
	}
	printf( '<meta property="og:type" content="%s">' . "\n", esc_attr( function_exists( 'is_product' ) && is_product() ? 'product' : 'website' ) );
	printf( '<meta property="og:url" content="%s">' . "\n", esc_url( $url ) );
	printf( '<meta property="og:site_name" content="%s">' . "\n", esc_attr( bioplus_site_name() ) );
	printf( '<meta property="og:locale" content="%s">' . "\n", esc_attr( str_replace( '-', '_', get_bloginfo( 'language' ) ) ) );
	printf( '<meta property="og:image" content="%s">' . "\n", esc_url( $image ) );
	echo '<meta name="twitter:card" content="summary_large_image">' . "\n";

	$schema = array();
	if ( is_front_page() ) {
		$schema[] = array(
			'@context' => 'https://schema.org',
			'@type'    => 'Organization',
			'name'     => bioplus_site_name(),
			'url'      => home_url( '/' ),
			'logo'     => bioplus_asset( 'images/brand/bioplus-logo-black.png' ),
			'email'    => bioplus_email(),
			'address'  => array(
				'@type'           => 'PostalAddress',
				'addressLocality' => bioplus_opt( 'location_town' ),
				'addressRegion'   => bioplus_opt( 'location_county' ),
				'addressCountry'  => 'GB',
			),
		);
	}
	if ( function_exists( 'is_product' ) && is_product() && function_exists( 'bioplus_product_view' ) ) {
		$view = bioplus_product_view( get_queried_object_id() );
		if ( $view ) {
			$offers = array();
			foreach ( $view['variants'] as $v ) {
				$offers[] = array(
					'@type'         => 'Offer',
					'sku'           => $v['sku'],
					'price'         => number_format( $v['price'], 2, '.', '' ),
					'priceCurrency' => get_woocommerce_currency(),
					'availability'  => 'in-stock' === $v['availability'] ? 'https://schema.org/InStock' : ( 'arriving-soon' === $v['availability'] ? 'https://schema.org/PreOrder' : 'https://schema.org/OutOfStock' ),
					'url'           => $view['url'],
				);
			}
			$schema[] = array(
				'@context'    => 'https://schema.org',
				'@type'       => 'Product',
				'name'        => $view['name'],
				'description' => $view['blurb'],
				'image'       => $view['image'],
				'brand'       => array(
					'@type' => 'Brand',
					'name'  => bioplus_site_name(),
				),
				'offers'      => $offers,
			);
		}
	}
	foreach ( $schema as $item ) {
		echo '<script type="application/ld+json">' . wp_json_encode( $item, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . '</script>' . "\n";
	}
}
add_action( 'wp_head', 'bioplus_seo_head', 3 );

/**
 * WooCommerce prints its own product JSON-LD; the theme's is richer (one offer
 * per vial size), so drop WooCommerce's when the theme handles SEO.
 */
function bioplus_seo_remove_wc_schema() {
	if ( ! bioplus_seo_plugin_active() && function_exists( 'WC' ) && isset( WC()->structured_data ) ) {
		remove_action( 'wp_footer', array( WC()->structured_data, 'output_structured_data' ), 10 );
	}
}
add_action( 'wp', 'bioplus_seo_remove_wc_schema' );

/**
 * Old Next.js URLs that differ from WordPress's.
 */
function bioplus_legacy_redirects() {
	if ( ! is_404() ) {
		return;
	}
	$path = trim( bioplus_current_path(), '/' );
	$map  = array(
		'login'                        => 'login',
		'register'                     => 'register',
		'account/files'                => 'account/files',
		'account/research-address'     => 'account/research-address',
		'account/settings'             => 'account/settings',
	);
	if ( 0 === strpos( $path, 'checkout/order-received/' ) && function_exists( 'wc_get_checkout_url' ) ) {
		wp_safe_redirect( bioplus_url( 'account/orders' ), 301 );
		exit;
	}
	if ( isset( $map[ $path ] ) ) {
		$target = bioplus_url( $map[ $path ] );
		if ( untrailingslashit( $target ) !== untrailingslashit( home_url( '/' . $path ) ) ) {
			wp_safe_redirect( $target, 301 );
			exit;
		}
	}
}
add_action( 'template_redirect', 'bioplus_legacy_redirects', 1 );
