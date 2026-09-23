<?php
/**
 * Customizer: Appearance → Customize → BioPlus Labs.
 *
 * Site-wide content that the original kept in src/lib/site.ts lives here so it
 * is editable without code.
 *
 * @package BioPlus
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Sanitise a checkbox.
 *
 * @param mixed $value Value.
 * @return bool
 */
function bioplus_sanitize_checkbox( $value ) {
	return (bool) $value;
}

/**
 * Sanitise limited HTML (strong/span/a/br).
 *
 * @param string $value Value.
 * @return string
 */
function bioplus_sanitize_inline_html( $value ) {
	return wp_kses( (string) $value, bioplus_inline_kses() );
}

/**
 * Register Customizer settings.
 *
 * @param WP_Customize_Manager $wp_customize Manager.
 */
function bioplus_customize_register( $wp_customize ) {
	$wp_customize->add_panel(
		'bioplus',
		array(
			'title'    => __( 'BioPlus Labs', 'bioplus' ),
			'priority' => 25,
		)
	);

	$sections = array(
		'bioplus_contact'  => array(
			'title'  => __( 'Contact & company', 'bioplus' ),
			'fields' => array(
				'contact_email'    => array( 'email', __( 'Contact / customer service email', 'bioplus' ), 'sanitize_email' ),
				'hours_days'       => array( 'text', __( 'Office days', 'bioplus' ) ),
				'hours_time'       => array( 'text', __( 'Office hours', 'bioplus' ) ),
				'hours_note'       => array( 'textarea', __( 'Hours note', 'bioplus' ) ),
				'legal_name'       => array( 'text', __( 'Legal / trading name', 'bioplus' ) ),
				'location_town'    => array( 'text', __( 'Town', 'bioplus' ) ),
				'location_county'  => array( 'text', __( 'County', 'bioplus' ) ),
				'location_country' => array( 'text', __( 'Country', 'bioplus' ) ),
				'company_number'   => array( 'text', __( 'Companies House number (hidden when empty)', 'bioplus' ) ),
				'facebook_url'     => array( 'url', __( 'Facebook URL', 'bioplus' ), 'esc_url_raw' ),
			),
		),
		'bioplus_brand'    => array(
			'title'  => __( 'Logos', 'bioplus' ),
			'fields' => array(
				'logo_dark'  => array( 'image', __( 'Logo for light backgrounds (header)', 'bioplus' ), 'esc_url_raw' ),
				'logo_light' => array( 'image', __( 'Logo for dark backgrounds (footer, age gate)', 'bioplus' ), 'esc_url_raw' ),
			),
		),
		'bioplus_header'   => array(
			'title'  => __( 'Header & announcement bar', 'bioplus' ),
			'fields' => array(
				'announcement_1'   => array( 'text', __( 'Announcement 1', 'bioplus' ) ),
				'announcement_2'   => array( 'text', __( 'Announcement 2', 'bioplus' ) ),
				'announcement_3'   => array( 'text', __( 'Announcement 3', 'bioplus' ) ),
				'announcement_4'   => array( 'text', __( 'Announcement 4', 'bioplus' ) ),
				'header_cta_label' => array( 'text', __( 'Header button label', 'bioplus' ) ),
			),
		),
		'bioplus_footer'   => array(
			'title'  => __( 'Footer', 'bioplus' ),
			'fields' => array(
				'footer_about'     => array( 'textarea', __( 'About text', 'bioplus' ) ),
				'footer_ruo'       => array( 'textarea', __( 'Research-use-only disclaimer', 'bioplus' ), 'bioplus_sanitize_inline_html' ),
				'newsletter_title' => array( 'text', __( 'Newsletter heading', 'bioplus' ) ),
				'newsletter_text'  => array( 'textarea', __( 'Newsletter text', 'bioplus' ) ),
				'footer_credit'    => array( 'text', __( '"Powered by" credit', 'bioplus' ) ),
			),
		),
		'bioplus_gate'     => array(
			'title'  => __( 'Research access verification', 'bioplus' ),
			'fields' => array(
				'age_gate_enabled'  => array( 'checkbox', __( 'Show the 18+ / research-use gate on first visit', 'bioplus' ), 'bioplus_sanitize_checkbox' ),
				'age_gate_exit_url' => array( 'url', __( '"Leave site" destination', 'bioplus' ), 'esc_url_raw' ),
			),
		),
		'bioplus_checkout' => array(
			'title'  => __( 'Checkout & payment', 'bioplus' ),
			'fields' => array(
				'free_shipping_min'      => array( 'number', __( 'Free UK delivery threshold (£) shown on the cart', 'bioplus' ), 'absint' ),
				'payment_window'         => array( 'number', __( 'Bank transfer payment window (minutes)', 'bioplus' ), 'absint' ),
				'payment_proof_required' => array( 'checkbox', __( 'Ask for a payment screenshot before "I have paid"', 'bioplus' ), 'bioplus_sanitize_checkbox' ),
			),
		),
	);

	$defaults = bioplus_option_defaults();
	$priority = 10;

	foreach ( $sections as $section_id => $section ) {
		$wp_customize->add_section(
			$section_id,
			array(
				'title'    => $section['title'],
				'panel'    => 'bioplus',
				'priority' => $priority,
			)
		);
		$priority += 10;

		foreach ( $section['fields'] as $key => $field ) {
			$type     = $field[0];
			$sanitize = isset( $field[2] ) ? $field[2] : ( 'textarea' === $type ? 'sanitize_textarea_field' : 'sanitize_text_field' );
			$setting  = 'bioplus_' . $key;

			$wp_customize->add_setting(
				$setting,
				array(
					'default'           => isset( $defaults[ $key ] ) ? $defaults[ $key ] : '',
					'sanitize_callback' => $sanitize,
					'transport'         => 'refresh',
				)
			);

			if ( 'image' === $type ) {
				$wp_customize->add_control(
					new WP_Customize_Image_Control(
						$wp_customize,
						$setting,
						array(
							'label'   => $field[1],
							'section' => $section_id,
						)
					)
				);
			} else {
				$wp_customize->add_control(
					$setting,
					array(
						'label'   => $field[1],
						'section' => $section_id,
						'type'    => $type,
					)
				);
			}
		}
	}
}
add_action( 'customize_register', 'bioplus_customize_register' );
